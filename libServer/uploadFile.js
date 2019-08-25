const client = require('filestack-js').init('AJpeP1PDQvq147aJJDKUwz');
var UL = new Object();
UL.uploadOneImage = function(path,callBack){
  client.upload(path)
    .then(res => {
      callBack(true,res);
    })
    .catch(err => {
      callBack(false,err)
    });
};
exports.method = UL;