#!/usr/bin/env node
var util = require('util');
var yargs = require('yargs')
  .options({
    'd': {
      alias: 'data',
      default: 'data/apollo.json',
      describe: 'dataset to use',
      type: 'string'
    }
  })
  .env()
  .help('h')
  .alias('h', 'help')
  .argv;

var botsong = require('../lib/bot.js')(yargs);


var stdin = process.openStdin();
util.print('> ');
stdin.on('data', function (line) {
  var session = {
    message: {
      text: line.toString()
    }
  };
  botsong.onMessage(session).then(function(response) {
    console.log(response);
    util.print('> ');
  });
});
