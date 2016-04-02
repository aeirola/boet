#!/usr/bin/env node
var util = require('util');
var yargs = require('yargs')
  .options({
    'b': {
      alias: 'bingKey',
      describe: 'Bing key for search',
      type: 'string'
    }
  })
  .env()
  .help('h')
  .alias('h', 'help')
  .argv;

var boet = require('../lib/bot.js')(yargs);


var stdin = process.openStdin();
util.print('> ');
stdin.on('data', function (line) {
  var session = {
    message: {
      text: line.toString()
    }
  };
  boet.onMessage(session).then(function(response) {
    console.log(response);
    util.print('> ');
  });
});
