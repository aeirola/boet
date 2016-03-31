var restify = require('restify');
var botbuilder = require('botbuilder');

var botsong = require('./bot.js');

// Create bot and add dialogs
var bot = new botbuilder.BotConnectorBot({ appId: 'YourAppId', appSecret: 'YourAppSecret' });
bot.add('/', function (session) {
  session.send(botsong.onMessage(session));
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

if (require.main === module) {
  // Start server
  server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
  });
}

module.exports = server;
