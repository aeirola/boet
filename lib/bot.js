var axios = require('axios');
var fs = require('fs');
var markov = require('../vendor/node-markov.js');
var sentiment = require('sentiment');

var Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();


var logger = require('./logger.js');
var images = require('./images.js');

module.exports = function(options) {
  logger.info('Waking up boet, fasten your spacebelts');

  var goodMarkov = markov(1);
  goodMarkov.readExternal(fs.readFileSync('data/apollo.json').toString());
  var badMarkov = markov(1);
  badMarkov.readExternal(fs.readFileSync('data/deathmetal.json').toString());

  var boet = {
    onMessage: function(session) {
      var inputMessage = session.message.text;
      logger.verbose('Incoming message: "%s"', inputMessage.trim());
      return getText(inputMessage)
        .then(function(textResponse) {
          if (!textResponse) {
            logger.verbose('No response found for input');
            return 'I can\'t come up with anything that rhymes with '  + inputMessage;
          } else {
            logger.verbose('Responding with "%s"', textResponse);
            return getImage(textResponse).then(function(imageResponse) {
              if (imageResponse) {
                return textResponse + '\n\n' + imageResponse;
              } else {
                return textResponse;
              }
            });
          }
        })
        .catch(function(error) {
          logger.warning('Response construction failed: %s', error);
          return 'Error: ' + error.message;
        });
    }
  };

  function getText(inputMessage) {
    var wordToRhyme = lastWord(inputMessage);
    var sentimentScore = sentiment(inputMessage).score;
    logger.verbose('Using sentiment: %s', sentimentScore);
    return axios.get('http://rhymebrain.com/talk?function=getRhymes&word=' + wordToRhyme, {
      timeout: 10000
    })
    .then(function (response) {
      var scoredArray = response.data;

      scoredArray.sort(function(a, b) {
        return (Math.round(Math.random()*10) + 1) * weightScore(b.score) -
               (Math.round(Math.random()*10) + 1) * weightScore(a.score);
      });

      var textLenght = inputMessage.length;
      for (var i = 0 ; i < scoredArray.length; i++ ) {
        var item = scoredArray[i];
        var responseText = buildResponseText(item.word, textLenght, sentimentScore);
        if (responseText) {
          return responseText;
        }
      }
    });
  }

  function getImage(text) {
    if (!options.bingKey) {
      logger.verbose('Search API key not provided, using fallback images');
      var image = images.getImage();
      return Promise.resolve('![' + image.title + '](' + image.url + ')');
    }

    return axios.get('https://api.datamarket.azure.com/Bing/Search/v1/Image', {
      params: {
        '$format': 'json',
        '$top': 1,
        'Query': '\'space ' + text + '\''
      },
      auth: {
        username: '',
        password: options.bingKey
      }
    }).then(function(response) {
      if (response.status !== 200 || response.data.d.results.length < 1) {
        throw new Error('no images available');
      }
      var result = response.data.d.results[0];
      return '![' + result.Title + '](' + result.MediaUrl + ')';
    })
    .catch(function() {
      console.verbose('Image fetch failed, using backup images');
      var image = images.getImage();
      return '![' + image.title + '](' + image.url + ')';
    });
  }

  function weightScore(score)
  {
    if (score >= 300)
    {
      return score * 10;
    }
    else if (score >= 250)
    {
      return score * 5;
    }
    else if (score >= 200)
    {
      return score * 3;
    }
    else if (score >= 100)
    {
      return score * 2;
    }
    else
    {
      return score * 1;
    }
  }

  function lastWord(words) {
    var n = words.split(' ');
    return n[n.length - 1];
  }

  function buildResponseText(word, length, sentiment) {
    var markovChain = goodMarkov;
    if (sentiment < 0)
    {
      markovChain = badMarkov;
    }

    var key = markovChain.search(word.toLowerCase());
    if (!key) {
      return undefined;
    }

    var responseText = markovChain.backward(key, 10).join(' ') + ' ' + word;

    var textArray = responseText.split(' ');
    var finalText = '';

    var i = textArray.length;
    while (i > 0 ) {
      i = i - 1;
      finalText = textArray[i] + ' ' + finalText;
      if (finalText.length >= length)
      {
        break;
      }
    }

    responseText = finalText;
    responseText = responseText.charAt(0).toUpperCase() + responseText.slice(1);

    return responseText;
  }

  return boet;
};
