var axios = require('axios');
var fs = require('fs');
var markov = require('./vendor/node-markov.js');
var m = markov(1);
m.readExternal(fs.readFileSync('data/scifi.json').toString());

var instance = axios.create({
  baseURL: 'http://rhymebrain.com/',
  timeout: 10000,
  headers: {'X-Custom-Header': 'foobar'}
});

var botsong = {
  onMessage: function(session) {
    var wordToRhyme = lastWord(session.message.text);
    return instance.get('/talk?function=getRhymes&word=' + wordToRhyme)
    .then(function (response) {

      var scoredArray = [];
      scoredArray = arrayWithOnlyScoredAbove(scoredArray, response.data, 300);
      scoredArray = arrayWithOnlyScoredAbove(scoredArray, response.data, 250);
      scoredArray = arrayWithOnlyScoredAbove(scoredArray, response.data, 200);

      for (var i = 0 ; i < scoredArray.length; i++ ) {
        var item = scoredArray[i];
        var responseText = buildResponseText(item.word);
        if (responseText) {
          return responseText;
        }
      }

      return 'I can\'t come up with anything that rhymes with '  + wordToRhyme;

      // if (scoredArray.length > 0) {
      //   var item = scoredArray[Math.floor(Math.random()*scoredArray.length)];
      //   return m.respond(item.word).join(' ') + ' ' + item.word;
      //   // return 'hey that rhymes with ' + item.word;
      // } else {
      //   return 'I can\'t come up with anything that rhymes with '  + wordToRhyme;
      // }
    })
    .catch(function (response) {
      console.log(response);
      return 'Error';
    });

  }
};

module.exports = botsong;

function lastWord(words) {
    var n = words.split(" ");
    return n[n.length - 1];
}

function buildResponseText(word) {
  var key = m.search(word.toLowerCase());
  if (!key) {
    return undefined;
  }

  var responseText = m.backward(key, 10).join(' ') + ' ' + word;
  responseText = responseText.charAt(0).toUpperCase() + responseText.slice(1);

  return responseText;
}

function arrayWithOnlyScoredAbove(scoredArray, allData, score) {
  if (scoredArray.length == 0)
  {
    for (var i = 0; i < allData.length; i++) {
      if (allData[i].score >= score)
      {
        scoredArray.push(allData[i]);
      }
    }
  }
  return scoredArray;
}
