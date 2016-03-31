var restify = require('restify');
var botbuilder = require('botbuilder');
var yargs = require('yargs')
  .options({
    'i': {
      alias: 'id',
      default: 'botsong',
      describe: 'appId',
      type: 'string'
    },
    's': {
      alias: 'secret',
      demand: true,
      describe: 'appSecret',
      type: 'string'
    },
    'p': {
      alias: 'port',
      default: 3978,
      descript: 'TCP port',
      type: 'number'
    }
  })
  .env()
  .help('h')
  .alias('h', 'help')
  .argv;

var botsong = require('./bot.js');

// Create bot and add dialogs
var bot = new botbuilder.BotConnectorBot({
  appId: yargs.id,
  appSecret: yargs.secret
});
bot.add('/', function (session) {
  session.send(botsong.onMessage(session));
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

if (require.main === module) {
  // Start server
  server.listen(yargs.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
  });
}

module.exports = server;
