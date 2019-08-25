//https://www.npmjs.com/package/slackbots
var SB = new Object();
var slack = require('slackbots');
var bot = new slack({
  token: 'xoxb-226778270484-425712348182-Jj1m6bUgI5sTfqldRmMovYyV', // Add a bot https://my.slack.com/services/new/bot and put the token
  name: 'C-View(C13)'
});
var params = {
  icon_emoji: ':guardsman:'
};
SB.sendMsgToAdmin = function(msg){
  bot.postMessageToUser('desmonitus', msg , params);
};
SB.sendMsgToUser = function(user,msg){
  bot.postMessage(user, msg , params);
};
SB.sendMsgToChanel = function(msg,channel){
  bot.postMessageToChannel(channel, msg, params);
};
exports.method = SB;
