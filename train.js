var fs = require('fs');

var markov = require('./vendor/node-markov.js');
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

console.log('Reading file', yargs.file);
var input = fs.readFileSync(yargs.file).toString();

console.log('Preprocessing input');
input = input.replace(/\s*[.!?]+\s*/gm, ' ');
input = input.replace(/[\s,:;"\'(){}\[\]]+/gm, ' ');
input = input.toLowerCase();

console.log('Generating Markov chain');
var m = markov(1);
m.seed(input, function () {
  console.log('Writing output file to', yargs.output);
  fs.writeFileSync(yargs.output, m.writeExternal());
});
