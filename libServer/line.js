const lineBot = require('@line/bot-sdk');
const URL = 'https://api.line.me/v2/bot';
const token = 'lV9zu/hZX6tojZLFRw9pREe3CHZOjVNKGiZ6++rkLBGukhSNsTBbcJoqoI2bAsfyBODU0FoMmk4Phfru7tBuJEcGER//F4N1REwmit0BWKT1dlrr0Ov/pUa7PWbBEzNwbUK56OUCunzrBh1hDBDbpwdB04t89/1O/w1cDnyilFU=';
const client_bot = new lineBot.Client({
    channelAccessToken: token
});
const request = require('request');
var LINE = new Object();
exports.main = function(req, res) {
    var lineSource = req.body.events[0];
    var id = lineSource.source.userId;
    console.log('Event: '+lineSource.type);
    if(lineSource.type == 'follow'){
        connection_mongo.method.findOne('ssm_line',{userId:id},function(lineData){
            var host = req.headers.host;
            if(_.isEmpty(lineData)){
                var lineSave = new Object();
                lineSave.userId = id;
                lineSave.active = 0;
                connection_mongo.method.insertOne('ssm_line',lineSave,null,function(saveCallback){
                    LINE.pushMessage(id,'ยืนยันตัวตนที่ ==> line://app/1572991590-d71J5Xvo?token='+id+'\n\n' +
                        'หรือผ่านเว็บไซต์ ==> '+host+'/shareSaveMoney/confirmLine?token='+id);
                });
            }else{
                if(!lineData.active){
                    LINE.pushMessage(id,'ยืนยันตัวตนที่ ==> line://app/1572991590-d71J5Xvo?token='+id+'\n\n' +
                        'หรือ \n ผ่านเว็บไซต์ ==> '+host+'/shareSaveMoney/confirmLine?token='+id);
                }else{
                    LINE.pushMessage(id,'บัญชีนี้ลงทะเบียนเรียบร้อยแล้วค่ะ \nท่านสามารถ Refresh หน้าจอเว็บไซต์ เพื่อตั้งค่า Notification ค่ะ');
                }
            }
        });
    }else if(lineSource.type == 'unfollow'){
        connection_mongo.method.findOne('ssm_line',{userId:id,active:1},function(lineData){
            if(!_.isEmpty(lineData)){
                connection_mongo.method.updateOne('ssm_line',{userId:id},{active:0});
            };
        });
    }else if(lineSource.type == 'message'){
        if(lineSource.message.text == 'test'){
            // const obj ={
            //     "type": "flex",
            //     "altText": "this is a flex message",
            //     "contents": {
            //         "type": "bubble",
            //         "body": {
            //             "type": "box",
            //             "layout": "vertical",
            //             "spacing": "md",
            //             "contents": [
            //                 {
            //                     "type": "text",
            //                     "text": "คุณได้รับข้อความนี้หรือไม่?"
            //                 },
            //                 {
            //                     "type": "button",
            //                     "style" : "primary",
            //                     "action": {
            //                         "type": "postback",
            //                         "label": "ได้รับ",
            //                         "data": "action=Y"
            //                     }
            //                 },
            //                 {
            //                     "type": "button",
            //                     "style" : "secondary",
            //                     "action": {
            //                         "type": "postback",
            //                         "label": "ไม่ได้รับ",
            //                         "data": "action=N"
            //                     }
            //                 }
            //             ]
            //         }
            //     }
            // };
        }
    }else if(lineSource.type == 'postback'){

    }
    console.log(lineSource);
    res.sendStatus(200)
};
LINE.pushMessage = function(userId,msg){
    client_bot.pushMessage(userId,{type:'text',text:msg});
}
LINE.broadcastMessage = function(msg){
    let headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {'+token+'}'
  }
  let body = JSON.stringify({
    messages: [{
      type: 'text',
      text: msg
    }]});
    request.post({
    url: URL+'/message/broadcast ',
    headers: headers,
    body: body
  }, (err, res, body) => {
  });
}
LINE.broadcastMessageObject = function(obj){
    let headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {'+token+'}'
  }
  let body = JSON.stringify( {messages: [obj]});
    request.post({
    url: URL+'/message/broadcast ',
    headers: headers,
    body: body
  }, (err, res, body) => {
        console.log(err);
  });
}
LINE.replyMessage = function(replyToken,object){
     client_bot.replyMessage(replyToken,object);
}
exports.method = LINE;