var expect = require('chai').expect;

describe('boet', function() {
  var boet = require('../lib/bot.js')({
    data: 'data/apollo.json'
  });

  function testFunction(input, done) {
    var session = {
      message: {
        text: input
      }
    };

    boet.onMessage(session).then(function(response){
      expect(response).not.to.equal('Error');
      console.log('>', input);
      console.log('<', response);
      done();
    });
  }

  it('should respond to message: Hello', function(done) {
    testFunction('Hello', done);
  });
  it('should respond to message: Finland', function(done) {
    testFunction('Finland', done);
  });
  it('should respond to message: Is this the real thing?', function(done) {
    testFunction('Is this the real thing?', done);
  });
  it('should respond to message: Is this just fantasy?', function(done) {
    testFunction('Is this just fantasy?', done);
  });
  it('should respond to message: Caught in a land slide', function(done) {
    testFunction('Caught in a land slide', done);
  });
  it('should respond to message: No escape from reality', function(done) {
    testFunction('No escape from reality', done);
  });
});
