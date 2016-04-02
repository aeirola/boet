var chai = require('chai');
var expect = chai.expect;

var proxyquire =  require('proxyquire');

var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);

// Mock axios
var RHYME_SEARCH_RESULT = [{
  'word': 'thing',
  'freq': 21,
  'score': 228,
  'flags': 'bc',
  'syllables': '3'
}, {
  'word': 'ding',
  'freq': 20,
  'score': 228,
  'flags': 'bc',
  'syllables': '3'
}, {
  'word': 'sing',
  'freq': 19,
  'score': 228,
  'flags': 'bc',
  'syllables': '3'
}];

var BING_SEACH_RESULT = {
  'd': {
    'results': [
      {
        'ID': '337a4106-fd15-4bed-8128-939cdb7d3af6',
        'Title': 'My Top Collection Silly cat pictures 3',
        'MediaUrl': 'http://4.bp.blogspot.com/-x0UKA0biJzA/T7Eypic0zEI/AAAAAAAAAr0/8K1OmlRV82o/s1600/silly+cat+pictures+3.jpg',
        'SourceUrl': 'http://mytopcollection.blogspot.com/2012/05/silly-cat-pictures.html',
        'DisplayUrl': 'mytopcollection.blogspot.com/2012/05/silly-cat-pictures.html',
        'Width': '500',
        'Height': '517',
        'FileSize': '46657',
        'ContentType': 'image/jpeg',
        'Thumbnail': {
          'MediaUrl': 'http://ts1.mm.bing.net/th?id=OIP.M0dd81c8810ee5604993f80767469bd47H0&pid=15.1',
          'ContentType': 'image/jpg',
          'Width': '464',
          'Height': '480',
          'FileSize': '20659'
        }
      }
    ]
  }
};

mock.onGet(/http:\/\/rhymebrain.com\/talk.*/)
  .reply(200, RHYME_SEARCH_RESULT);
mock.onGet(/https:\/\/api.datamarket.azure.com\/Bing\/Search\/v1\/Image/)
  .reply(200, BING_SEACH_RESULT);


describe('boet', function() {
  var bot = proxyquire('../lib/bot.js', {
    'axios': axios
  });
  var boet = bot({
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
