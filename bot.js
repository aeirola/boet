var botsong = {
  onMessage: function(session) {
    var response = 'laalaa';
    return 'You say: ' + session.message.text + ', I say ' + response;
  }
};

module.exports = botsong;
