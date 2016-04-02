#!/usr/bin/env node
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

var logger = require('../lib/logger.js');
var boet = require('../lib/bot.js')(yargs);

logger.info('Starting commandline interface');

var stdin = process.openStdin();
process.stdout.write('> ');
stdin.on('data', function (line) {
  var session = {
    message: {
      text: line.toString()
    }
  };
  boet.onMessage(session).then(function(response) {
    process.stdout.write('< ' + response.replace(/\n/g, '\n< '));
    process.stdout.write('\n\n> ');
  });
});
