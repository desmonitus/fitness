exports.get = function(req,res){
  setTimeout(function(){
    connection_mongo.method.getUserInfomation(req, function (userData) {
      var username = '';
      if(!_.isEmpty(userData)){
        username = userData.username;
        var role = [{code:'0',descriptionTh:'ผู้ดูแลระบบ',descriptionEn:'Super Admin'},{code:'1',descriptionTh:"ผู้ดูแลองค์กร",descriptionEn:'Admin'},{code:'2',descriptionTh:"ผู้ใช้งาน",descriptionEn:'User'}];
        var title = '';
        if(userData.role == 0){
          title = "ผู้ดูแลระบบ";
        }else if(userData.role == 1){
          title = "ผู้ดูแลองค์กร";
        }else{
          res.redirect('/');
          return false
        }
        checkSessionUser(req, res, 'front-end/admin', {title: title,user:username,role:userData.role});
      }else{
        res.redirect('/');
      }
    });
  },250);
};
exports.post = function(req,res) {
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req, function (userData) {
    if(!_.isEmpty(userData)) {
      if (req.body.method == 'searchMember') {
        var search = new Object();
        if (userData.role != 0) {
          search.role = {$in: [1, 2]}
          search.org_id = userData.org_id;
        }
        connection_mongo.method.find('user', search, function (userArrayData) {
          if (!_.isEmpty(userArrayData)) {
            var mappedUserArrayData = connection_mongo.method.selectColumn(userArrayData, ['id', 'user_code', 'username', 'first_name', 'last_name', 'position', 'role', 'active']);
            object.success = true;
            object.rows = mappedUserArrayData;
            res.json(object);
            return
          } else {
            object.message = "ไม่พบข้อมูลในระบบ";
            res.json(object);
            return
          }
        });
      } else if (req.body.method == 'searchForUpdate') {
        var search = new Object();
        search.id = _.toNumber(req.body.id);
        connection_mongo.method.findOne('user', search, function (profileData) {
          if (!_.isEmpty(profileData)) {
            var mapped = connection_mongo.method.selectColumn([profileData], ['id', 'org_id', 'user_code', 'username', 'first_name', 'last_name', 'birthday', 'email', 'phone', 'position', 'role']);
            _.forEach(mapped, function (o) {
              if(!poontFunc.method.isEmpty(o.birthday)){
                poontFunc.method.stringToFormatDate(o.birthday, "yyyymmdd", function (d) {
                  o.birthday = d;
                });
              }
            });
            object.success = true;
            object.rows = mapped[0];
            res.json(object);
            return
          } else {
            res.json(object);
            return
          }
        });
      } else if (req.body.method == 'searchOrg') {
        connection_mongo.method.find('organize', {}, function (orgData) {
          if (!_.isEmpty(orgData)) {
            var mappedOrgData = connection_mongo.method.selectColumn(orgData, ['id', 'org_code', 'org_name', 'active']);
            object.success = true;
            object.rows = mappedOrgData;
            res.json(object);
            return
          } else {
            object.message = "ไม่พบข้อมูลในระบบ";
            res.json(object);
            return
          }
        });
      }else if (req.body.method == 'searchWorkType') {
        connection_mongo.method.find('work_type', {org_id:userData.org_id}, function (workTypeData) {
          if (!_.isEmpty(workTypeData)) {
            var mappedWorkTypeData = connection_mongo.method.selectColumn(workTypeData, ['id', 'work_type_code', 'work_type_name', 'active']);
            object.success = true;
            object.rows = mappedWorkTypeData;
            res.json(object);
            return
          } else {
            object.message = "ไม่พบข้อมูลในระบบ";
            res.json(object);
            return
          }
        });
      } else if (req.body.method == 'searchForOrgUpdate') {
        var search = new Object();
        search.id = _.toNumber(req.body.id);
        connection_mongo.method.findOne('organize', search, function (orgData) {
          if (!_.isEmpty(orgData)) {
            var mapped = connection_mongo.method.selectColumn([orgData], ['id', 'org_code', 'org_name']);
            object.success = true;
            object.rows = mapped[0];
            res.json(object);
            return
          } else {
            res.json(object);
            return
          }
        });
      } else if (req.body.method == 'searchForWorkTypeUpdate') {
        var search = new Object();
        search.id = _.toNumber(req.body.id);
        connection_mongo.method.findOne('work_type', search, function (workTypeData) {
          if (!_.isEmpty(workTypeData)) {
            var mapped = connection_mongo.method.selectColumn([workTypeData], ['id', 'work_type_code', 'work_type_name']);
            object.success = true;
            object.rows = mapped[0];
            res.json(object);
            return
          } else {
            res.json(object);
            return
          }
        });
      } else {
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
exports.put = function(req,res){
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req,function(userData){
    if(!_.isEmpty(userData)){
      if(req.body.method == 'saveMember'){
        var userCode = 'U'+poontFunc.method.getNow('yyyymm')+'0001';
        connection_mongo.method.find('user',{},function(userCheckData) {
          var check = true;
          if (!_.isEmpty(userCheckData)) {
            var oldUserCode = userCheckData[userCheckData.length - 1].user_code;
            if (oldUserCode.substr(1, 6) == poontFunc.method.getNow('yyyymm')) {
              userCode = 'U' + poontFunc.method.getNow('yyyymm') + _.padStart((oldUserCode.substr(7) * 1) + 1, 4, '0');
            }
            if (!_.isEmpty(_.find(userCheckData, {'username': req.body.username}))) {
              check = false;
              object.message = "Username นี้ซ้ำกับในระบบกรุณาใช้ชื่อ Username อื่นนะคะ";
            }
          }
          if (check) {
            var save = new Object();
            if(!poontFunc.method.isEmpty(req.body.org)){
              save.org_id = _.toNumber(req.body.org);
            }else{
              save.org_id = userData.org_id;
            }
            save.user_code = userCode;
            save.username = req.body.username;
            save.password = sha1(req.body.password);
            save.first_name = req.body.firstName;
            save.last_name = req.body.lastName;
            if(!poontFunc.method.isEmpty(req.body.birthday)){
              save.birthday = poontFunc.method.changeDateFormat(req.body.birthday)+'000000';
            }
            save.email = req.body.email;
            save.phone = req.body.phone;
            save.position = req.body.position;
            save.role = _.toNumber(req.body.role);
            save.active = 1;
            connection_mongo.method.insertOne('user',save,userData.user_code,function(){
              object.success = true;
              object.message = "เพิ่มข้อมูลผู้ใช้งานระบบ สำเร็จ";
              res.json(object);
              return;
            })
          }else{
            res.json(object);
            return;
          }
        });
      }else if(req.body.method == 'saveOrg'){
        var save = new Object();
        save.org_code = req.body.orgCode;
        save.org_name = req.body.orgName;
        save.active = 1;
        connection_mongo.method.insertOne('organize',save,userData.user_code,function(){
          object.success = true;
          object.message = "เพิ่มข้อมูลองค์กรใหม่ สำเร็จ";
          res.json(object);
          return;
        });
      }else if(req.body.method == 'saveWorkType'){
        var save = new Object();
        save.work_type_code = req.body.workTypeCode;
        save.work_type_name = req.body.workTypeName;
        save.org_id = userData.org_id;
        save.active = 1;
        connection_mongo.method.insertOne('work_type',save,userData.user_code,function(){
          object.success = true;
          object.message = "เพิ่มข้อมูลประเภทงานใหม่ สำเร็จ";
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
exports.patch = function(req,res){
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req,function(userData){
    if(!_.isEmpty(userData)){
      if(req.body.method == 'update'){
        connection_mongo.method.find('user',{username : req.body.username,id : {$ne:_.toNumber(req.body.id)}},function(findUser){
          if(!_.isEmpty(findUser)){
            object.message = "Username นี้ซ้ำกับในระบบกรุณาใช้ชื่อ Username อื่นนะคะ"
            res.json(object);
            return;
          }else{
            var update = new Object();
            if(!poontFunc.method.isEmpty(req.body.org)){
              update.org_id = _.toNumber(req.body.org);
            }
            update.username = req.body.username;
            update.first_name = req.body.firstName;
            update.last_name = req.body.lastName;
            if(!poontFunc.method.isEmpty(req.body.birthday)){
              update.birthday = poontFunc.method.changeDateFormat(req.body.birthday)+'000000';
            }
            update.email = req.body.email;
            update.phone = req.body.phone;
            update.position = req.body.position;
            update.role = _.toNumber(req.body.role);
            if(!poontFunc.method.isEmpty(req.body.password)){
              update.password = sha1(req.body.password);
            }
            connection_mongo.method.updateOne('user',{id:_.toNumber(req.body.id)},update,userData.user_code,function(updateData){
              object.message = "ปรับปรุงภาระงานสำเร็จ"
              object.success = true;
              res.json(object);
              return;
            });
          }
        });
      }else if(req.body.method == 'updateOrg'){
        var paramSearch = new Object();
        paramSearch.id = _.toNumber(req.body.id);
        var paramUpdate = new Object();
        paramUpdate.org_code =  req.body.orgCode;
        paramUpdate.org_name =  req.body.orgName;
        connection_mongo.method.updateOne('organize',paramSearch,paramUpdate,userData.user_code);
        object.success = true;
        object.message = 'ปรับปรุงรายการสำเร็จ';
        res.json(object);
        return;
      }else if(req.body.method == 'updateWorkType'){
        var paramSearch = new Object();
        paramSearch.id = _.toNumber(req.body.id);
        var paramUpdate = new Object();
        paramUpdate.work_type_code =  req.body.workTypeCode;
        paramUpdate.work_type_name =  req.body.workTypeName;
        connection_mongo.method.updateOne('work_type',paramSearch,paramUpdate,userData.user_code);
        object.success = true;
        object.message = 'ปรับปรุงรายการสำเร็จ';
        res.json(object);
        return;
      }else if(req.body.method == 'updateMemberActive'){
        var paramSearch = new Object();
        paramSearch.id = _.toNumber(req.body.id);
        var paramActiveUpdate = new Object();
        paramActiveUpdate.active = _.toNumber(req.body.active);
        connection_mongo.method.updateOne('user',paramSearch,paramActiveUpdate,userData.user_code);
        object.success = true;
        object.message = 'ปรับปรุงสถานะการใช้งานสำเร็จ';
        res.json(object);
        return;
      }else if(req.body.method == 'updateOrgActive'){
        var paramSearch = new Object();
        paramSearch.id = _.toNumber(req.body.id);
        var paramActiveUpdate = new Object();
        paramActiveUpdate.active = _.toNumber(req.body.active);
        connection_mongo.method.updateOne('organize',paramSearch,paramActiveUpdate,userData.user_code);
        object.success = true;
        object.message = 'ปรับปรุงสถานะการใช้งานสำเร็จ';
        res.json(object);
        return;
      }else if(req.body.method == 'updateWorkTypeActive'){
        var paramSearch = new Object();
        paramSearch.id = _.toNumber(req.body.id);
        var paramActiveUpdate = new Object();
        paramActiveUpdate.active = _.toNumber(req.body.active);
        connection_mongo.method.updateOne('work_type',paramSearch,paramActiveUpdate,userData.user_code);
        object.success = true;
        object.message = 'ปรับปรุงสถานะการใช้งานสำเร็จ';
        res.json(object);
        return;
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
exports.delete = function(req, res) {
  connection_mongo.method.getUserInfomation(req,function(userData){
    var object = {};
    object.message = '';
    object.success = false;
    if(!_.isEmpty(userData)) {
      if(req.body.method == 'deleteMember'){
        var paramDelete = new Object();
        paramDelete.id = _.toNumber(req.body.idDelete);
        connection_mongo.method.find('transaction_work',{user_code:req.body.userCode},function (transData) {
          if(_.isEmpty(transData)){
            connection_mongo.method.deleteOne('user',paramDelete);
            object.message = 'ลบรายการสำเร็จ';
            object.success = true;
            res.json(object);
            return;
          }else{
            object.message = 'ไม่สามารถลบผู้ใช้งานระบบคนนี้ได้ เนื่องจากผู้ใช้งานคนนี้ได้มีการลงภาระงานในระบบแล้ว';
            res.json(object);
            return;
          }
        })

      }else if(req.body.method == 'deleteOrg'){
        var paramDelete = new Object();
        paramDelete.id = _.toNumber(req.body.idDelete);
        connection_mongo.method.find('transaction_work',{org_id:_.toNumber(req.body.idDelete)},function(transData){
          if(_.isEmpty(transData)){
            connection_mongo.method.deleteOne('organize',paramDelete);
            object.message = 'ลบรายการสำเร็จ';
            object.success = true;
            res.json(object);
            return;
          }else{
            object.message = 'ไม่สามารถลบองค์กรนี้ได้ เนื่องจากมีการลงภาระงานขององค์กรนี้ในระบบ';
            res.json(object);
            return;
          }
        });
      }else if(req.body.method == 'deleteWorkType'){
        var paramDelete = new Object();
        paramDelete.id = _.toNumber(req.body.idDelete);
        connection_mongo.method.find('transaction_work',{trans_type:_.toNumber(req.body.idDelete),org_id:userData.org_id},function(transData){
          if(_.isEmpty(transData)){
            connection_mongo.method.deleteOne('work_type',paramDelete);
            object.message = 'ลบรายการสำเร็จ';
            object.success = true;
            res.json(object);
            return;
          }else{
            object.message = 'ไม่สามารถลบประเภทงานนี้ได้ เนื่องจากมีการลงภาระงานด้วยประเภทงานนี้ในระบบ';
            res.json(object);
            return;
          }
        });
      }else{
        object.message = 'Please Login';
        res.json(object);
        return;
      }
    }else{
      object.message = 'Please Login';
      res.json(object);
      return;
    }
  });
};
