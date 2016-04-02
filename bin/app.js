var path = require('path');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  target: 'https://webchat.botframework.com/',
  secure: false,
  prependPath: false,
  headers: {
    host: 'webchat.botframework.com'
  }
});

var restify = require('restify');
var botbuilder = require('botbuilder');
var yargs = require('yargs')
  .options({
    'i': {
      alias: 'id',
      default: 'botsong',
      describe: 'Bot connector appId',
      type: 'string'
    },
    's': {
      alias: 'secret',
      demand: true,
      describe: 'Bot connector appSecret',
      type: 'string'
    },
    'b': {
      alias: 'bingKey',
      describe: 'Bing key for search',
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

var boet = require('../lib/bot.js')(yargs);

// Create bot and add dialogs
var bot = new botbuilder.BotConnectorBot({
  appId: yargs.id,
  appSecret: yargs.secret
});
bot.add('/', function (session) {

  boet.onMessage(session).then(function(response) {
    session.send(response);
  });
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

// Proxy stuff
server.get('/embed/botsong', function(req, res) {
  proxy.web(req, res);
});
server.get('/(css|scripts|images|fonts|api)/.*', function(req, res) {
  proxy.web(req, res);
});
server.post('/api/.*', function(req, res) {
  proxy.web(req, res);
});

// Serve certain static files
server.get('/', restify.serveStatic({
  directory: path.join(__dirname, '..'),
  file: 'index.html'
}));

if (require.main === module) {
  // Start server
  server.listen(yargs.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
  });
}

module.exports = server;
