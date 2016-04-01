var axios = require('axios');
var instance = axios.create({
  baseURL: 'http://rhymebrain.com/',
  timeout: 10000,
  headers: {'X-Custom-Header': 'foobar'}
});

var botsong = {
  onMessage: function(session) {
    var response = 'laalaa';
    //return 'You say: ' + session.message.text + ', I say ' + response;

    var wordToRhyme = lastWord(session.message.text)

    return instance.get('/talk?function=getRhymes&word=' + wordToRhyme)
    .then(function (response) {

      var scoredArray = []
      scoredArray = arrayWithOnlyScoredAbove(scoredArray, response.data, 300)
      scoredArray = arrayWithOnlyScoredAbove(scoredArray, response.data, 250)
      scoredArray = arrayWithOnlyScoredAbove(scoredArray, response.data, 200)

      if (scoredArray.length > 0)
      {
          var item = scoredArray[Math.floor(Math.random()*scoredArray.length)];
          //console.log("hey that rhymes with " + item.word)
          return "hey that rhymes with " + item.word
      }
      else
      {
          //console.log("I can't come up with anything that rhymes with " + line.toString())  
          return "I can't come up with anything that rhymes with "  + wordToRhyme          
      }
    })
    .catch(function (response) {
      console.log(response);
      return "Error"
    });

  }
};

module.exports = botsong;

function lastWord(words) {
    var n = words.split(" ");
    return n[n.length - 1];
}


function arrayWithOnlyScoredAbove(scoredArray, allData, score) {
  if (scoredArray.length == 0)
  {
    for (var i = 0; i < allData.length; i++) {
        if (allData[i].score >= score)
        {
          scoredArray.push(allData[i])
      }
    }
  }
  return scoredArray
}