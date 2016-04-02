var fs = require('fs');
var logger = require('../lib/logger.js');
var markov = require('../vendor/node-markov.js');
var yargs = require('yargs')
  .options({
    'f': {
      alias: 'file',
      demand: true,
      describe: 'Input file',
      type: 'string'
    },
    'o': {
      alias: 'output',
      demand: true,
      describe: 'Output file',
      type: 'string'
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv;

logger.info('Reading file', yargs.file);
var input = fs.readFileSync(yargs.file).toString();

logger.info('Preprocessing input');
input = input.replace(/\s*[.!?]+\s*/gm, ' ');
input = input.replace(/[\s,:;"(){}\[\]]+/gm, ' ');
input = input.replace(/(\s'|'\s)/gm, ' ');
input = input.toLowerCase();

logger.info('Generating Markov chain');
var m = markov(1);
m.seed(input, function () {
  logger.info('Writing output file to', yargs.output);
  fs.writeFileSync(yargs.output, m.writeExternal());
});
