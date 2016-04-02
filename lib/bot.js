var axios = require('axios');
var fs = require('fs');
var markov = require('../vendor/node-markov.js');

var BING_KEY = 'NLjwuXkem3XF5Y+H9gfSqwqUsRi35xHawcQUWqpcVBI=';

module.exports = function(options) {
  var markovChain = markov(1);
  markovChain.readExternal(fs.readFileSync(options.data).toString());

  var boet = {
    onMessage: function(session) {
      var inputMessage = session.message.text;
      return getText(inputMessage)
        .then(function(textResponse) {
          if (!textResponse) {
            return 'I can\'t come up with anything that rhymes with '  + inputMessage;
          } else {
            return getImage(textResponse).then(function(imageResponse) {
              if (imageResponse) {
                return textResponse + '\n\n-----\n\n' + imageResponse;
              } else {
                return textResponse;
              }
            });
          }
        })
        .catch(function(error) {
          console.log(error);
          return 'Error: ' + error.message;
        });
    }
  };

  function getText(inputMessage) {
    var wordToRhyme = lastWord(inputMessage);
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
        var responseText = buildResponseText(item.word, textLenght);
        if (responseText) {
          return responseText;
        }
      }
    });
  }

  function getImage(text) {
    return axios.get('https://api.datamarket.azure.com/Bing/Search/v1/Image', {
      params: {
        '$format': 'json',
        '$top': 1,
        'Query': '\'' + text + '\''
      },
      auth: {
        username: '',
        password: BING_KEY
      }
    }).then(function(response) {
      if (response.status !== 200 || response.data.d.results.length < 1) {
        return null;
      }
      var result = response.data.d.results[0];
      return '![' + result.Title + '](' + result.MediaUrl + ')';
    })
    .catch(function() {
      return null;
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

  function buildResponseText(word, length) {
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
