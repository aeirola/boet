var expect = require('chai').expect;

describe('botsong', function() {
  var botsong = require('./bot.js');

  it('should respond to message', function() {
    var session = {
      message: {
        text: 'hello'
      }
    };

    var response = botsong.onMessage(session);

    expect(response).to.equal('You say: hello, I say laalaa');
  });
});
