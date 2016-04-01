var expect = require('chai').expect;

describe('botsong', function() {
  var botsong = require('./bot.js');

  it('should respond to message', function(done) {
    var session = {
      message: {
        text: 'hello'
      }
    };

    botsong.onMessage(session).then(function(response){
      expect(response).not.to.equal('error');
      console.log(response)
      done()
    });


  });
});
