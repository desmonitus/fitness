var DB = new Object();
DB.defaultParam = new Object();
DB.defaultParam.cr_by = 'admin';
DB.defaultParam.cr_date = poontFunc.method.getNow();
DB.defaultParam.up_by = 'admin';
DB.defaultParam.up_date = poontFunc.method.getNow();
var DB_MONGO = new Object();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://fitness:fitness@firmupgym-2xjpj.mongodb.net/test?retryWrites=true&w=majority";

//const url = "mongodb://localhost:27017/?retryWrites=true";
const client = new MongoClient(url, { useNewUrlParser: true });
var nameServer = "fitness";
client.connect(err => {
  const collection = client.db("fitness");
  client.close();
});

DB_MONGO.findOne = function(table,object,callback){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db(nameServer);
    if (err) throw err;
    dbo.collection(table).findOne(object, function(err, result) {
      if (err) throw err;
      db.close();
      return callback(result);
    });
  });
};
DB_MONGO.find = function(table,object,callback) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db(nameServer);
    dbo.collection(table).find(object).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      return callback(result);
    });
  });
};
DB_MONGO.findLast = function(table,object,callback){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db(nameServer);
    dbo.collection(table).find(object).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      if (result.length > 0) {
        result = _.findLast(result);
      } else {
        result = {};
      }
      return callback(result);
    });
  })
};
DB_MONGO.insertOne = function(table,object,user,callback){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db(nameServer);
    DB.defaultParam.cr_by = !_.isEmpty(user)?user:DB.defaultParam.cr_by;
    DB.defaultParam.up_by = !_.isEmpty(user)?user:DB.defaultParam.up_by;
    object = _.merge(object, DB.defaultParam);
    dbo.collection(table).find({}).toArray(function(err, result) {
      if (err) throw err;
      if(result.length>0){
        result = _.findLast(result);
        object.id = (result.id)+1;
      }else{
        result = [];
        object.id = 0;
      }
      dbo.collection(table).insertOne(object, function(err, res) {
        if (err) throw err;
        db.close();
        if(_.isFunction(callback)){
          return callback(res);
        }
      });
    });
  });
};
DB_MONGO.updateOne = function(table,objectCondition,objectNew,user,callback){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db(nameServer);
    objectNew.up_by = !_.isEmpty(user)?user:DB.defaultParam.up_by;
    objectNew.up_date = poontFunc.method.getNow();
    dbo.collection(table).updateOne(objectCondition,{ $set: objectNew}, function(err, res) {
      if (err) throw err;
      db.close();
      if(_.isFunction(callback)){
        return callback(res);
      }
    });
  });
};
DB_MONGO.deleteOne = function(table,object){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db(nameServer);
    dbo.collection(table).deleteOne(object, function(err, res) {
      if (err) throw err;
      db.close();
    });
  });

};

DB_MONGO.selectColumn = function(data,columnArray){
  return _.map(data, _.partialRight(_.pick, columnArray));
};

DB_MONGO.getUserInfomation = function(req,callback){
  var data = jwt.verify(poontFunc.method.getCookie(req,'desmonitus'), 'Desmonitus-Kitimetha', function(err, decoded) {
    if (err) {
      callback('');
    }else{
      callback(decoded);
    }
  });
};
DB_MONGO.aggregate = function(table,aggregateObject,callback){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db(nameServer);
    dbo.collection(table).aggregate(aggregateObject).toArray(function(err, docs) {
      callback(err,docs);
    });
  });
}
exports.method = DB_MONGO;