exports.get = function(req,res){
  setTimeout(function(){
    connection_mongo.method.getUserInfomation(req, function (userData) {
      var username = '';
      var role = ''
      if(!_.isEmpty(userData)){
        username = userData.username;
        role = userData.role;
      }
      checkSessionUser(req, res, 'front-end/profile', {title: "ลงภาระงาน",user:username,role:role})
    });
  },250);
};
exports.post = function(req,res) {
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req, function (userData) {
    if(!_.isEmpty(userData)){
      if(req.body.method == 'search'){
            object.success = true;
            var mapped = connection_mongo.method.selectColumn([userData],['user_code','username'
            ,'first_name','last_name','birthday','email','phone','position']);
            mapped =  _.forEach(mapped, function (o) {
                  if(!poontFunc.method.isEmpty(o.birthday)){
                      poontFunc.method.stringToFormatDate(o.birthday, "yyyymmdd", function (d) {
                          o.birthday = d;
                      });
                  }
              });
              object.rows = mapped
            res.json(object);
            return
      } else{
          object.message = "Please Login."
          res.json(object);
          return;
      }
    }else{
      object.message = "Please Login."
      res.json(object);
      return;
    }
  });
};
exports.patch = function(req,res){
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req,function(userData){
    if(!_.isEmpty(userData)){
      if(req.body.method == 'update'){
        var update = new Object();
        update.first_name = req.body.firstName;
        update.last_name = req.body.lastName;
        if(!poontFunc.method.isEmpty(req.body.birthday)){
            update.birthday = poontFunc.method.changeDateFormat(req.body.birthday)+'000000';
        }else{
            update.birthday = '';
        }
        update.email = req.body.email;
        update.phone = req.body.phone;
        update.position = req.body.position;
        connection_mongo.method.updateOne('user',{user_code:userData.user_code},update,userData.user_code,function(updateData){
          object.message = "ปรับปรุงข้อมูลสำเร็จ"
          object.success = true;
          res.json(object);
          return;
        });
      }else{
        res.json(object);
        return;
      }
    }else{
      object.message = "Please Login."
      res.json(object);
      return;
    }
  });
};