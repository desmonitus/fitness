exports.get = function(req,res){
  res.render('front-end/login',{title:"Login"});
};
exports.post = function (req,res) {
  var object = {};
  object.message = '';
  object.success = false;
  pass = sha1(req.body.password);
  // connection_mongo.method.findOne('user',{$or: [{username: req.body.username}, {email: req.body.username}],password : pass,active:1},function (userData) {
  var search = [
    {$project:
          {
            userId:"$id",username:"$username",email:"$email",password:"$password",active:"$active",org:"$org_id",userActive:"$active"
          }
    },
    {$lookup:
          {
            from: "organize",
            localField: "org",
            foreignField: "id",
            as: "orgs"
          }
    },
    {$match:{$or : [{username:req.body.username},{email:req.body.username}],password:pass,userActive:1}

    }
  ];
  connection_mongo.method.aggregate('user',search,function(err,userData){
    if(!_.isEmpty(userData)) {
      if(userData[0].orgs[0].active==1){
        object.success = true;
        var numSession = sha1(Math.floor(Math.random() * Math.floor(10000)));
        var paramUserUpdate = new Object();
        paramUserUpdate.id = _.toNumber(userData[0].userId);
        var paramDataUserUpdate = new Object();
        paramDataUserUpdate.session = numSession;
        connection_mongo.method.updateOne('user',paramUserUpdate,paramDataUserUpdate);
        res.cookie('desmonitus', numSession);
        setTimeout(function(){
          res.json(object);
          return;
        },500);
      }else{
        object.message = 'องค์กร '+userData[0].orgs[0].org_name+' ไม่สามารถใช้งานได้';
        res.json(object);
        return;
      }
    }else{
      object.message = 'รหัสหรืออีเมลไม่ถูกต้อง';
      res.json(object);
      return;
    }
  });
}