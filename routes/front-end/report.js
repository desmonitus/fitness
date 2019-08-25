exports.get = function(req,res){
  setTimeout(function(){
    connection_mongo.method.getUserInfomation(req, function (userData) {
      var username = '';
      if(!_.isEmpty(userData)){
        if(userData.role == 0){
          title = "ผู้ดูแลระบบ";
        }else if(userData.role == 1){
          title = "ผู้ดูแลองค์กร";
        }else{
          res.redirect('/');
          return false
        }
        username = userData.username;
        checkSessionUser(req, res, 'front-end/report', {title: 'รายงาน',user:username,role:userData.role});
      }else{
        res.redirect('/');
      }
    });
  },250);
};
exports.post = function(req,res){
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req, function (userData) {
    if(!_.isEmpty(userData)){
      if(req.body.method=="getAllUser"){
        var search = [
            {
              $project: {
                new_year: {$substr: ["$trans_month",0,4]},
                user_code: "$user_code",
                org : "$org_id"
              }
            },
            {
              $match: {
                org: userData.org_id,
                new_year: req.body.year

              }
            },
            {
              $group: {
                _id: {user: "$user_code"}
            }
            },
            {
              $lookup: {
                from: "user",
                localField: "_id.user",
                foreignField: "user_code",
                as: "name"
              }
          }];
        connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
          if(!_.isEmpty(data)){
            var result = _.map(data,"name[0]");
            result = connection_mongo.method.selectColumn(result,['user_code','first_name','last_name'])
            object.rows = result;
            object.success = true
            res.json(object);
            return;
          }else{
            res.json(object);
            return;
          }
        });
      }else if(req.body.method=="getAllPoint"){

          var search = [
              {
                  $project: {
                      new_year: {$substr: ["$trans_month",0,4]},
                      trans: "$work_min",
                      month: "$trans_month",
                      user: "$user_code",
                      org : "$org_id"
                  }
              },
              {
                  $match: {
                      org: userData.org_id,
                      new_year: req.body.year
                  }
              },
              {
                  $group: {
                      _id: {
                          user: "$user",
                          month: "$month",
                          year: "$new_year"
                      },
                      sum: {
                          $sum: {$divide: ['$trans',480]}
                      }
                  }
              }];
          connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
              if(!_.isEmpty(data)){
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              }else{
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method=="getAllTotalPoint"){

          var search = [
              {
                  $project: {
                      new_year: {$substr: ["$trans_month",0,4]},
                      trans: "$work_min",
                      month: "$trans_month",
                      user: "$user_code",
                      org : "$org_id"
                  }
              },
              {
                  $match: {
                      org: userData.org_id,
                      new_year: req.body.year
                  }
              },
              {
                  $group: {
                      _id: {
                          user: "$user",
                          year: "$new_year"
                      },
                      total: {
                          $sum: {$divide: ['$trans',480]}
                      }
                  }
              }];
          connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
              if(!_.isEmpty(data)){
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              }else{
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method=="getMonthTotal"){

          var search = [
              {
                  $project: {
                      new_year: {$substr: ["$trans_month",0,4]},
                      trans: "$work_min",
                      month: "$trans_month",
                      user: "$user_code",
                      org : "$org_id"
                  }
              },
              {
                  $match: {
                      org: userData.org_id,
                      new_year: req.body.year
                  }
              },
              {
                  $group: {
                      _id: {
                          month: "$month",
                          year: "$new_year"
                      },
                      total: {
                          $sum: {$divide: ['$trans',480]}
                      }
                  }
              }];
          connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
              if(!_.isEmpty(data)){
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              }else{
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method=="getAllWorkType"){
        var search = [{
          $project: {
            new_year: {$substr: ["$trans_month",0,4]},
            trans: "$work_min",
            month: "$trans_month",
            user: "$user_code",
            tranType : "$trans_type",
            org : "$org_id"
          }
        },
          {
            $match: {org: userData.org_id,new_year: req.body.year,user: req.body.user}
          },
          {
            $group: {_id: {user: "$user",
                type : "$tranType",
                year: "$new_year"}
            }
          },
          {
            $lookup:
                {
                  from: "work_type",
                  localField: "_id.type",
                  foreignField: "id",
                  as: "typeName"
                }
          }
        ];
        connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
          if(!_.isEmpty(data)){
            object.rows = data;
            object.success = true
            res.json(object);
            return;
          }else{
            res.json(object);
            return;
          }
        });
      }else if(req.body.method=="getWorkTypePoint"){
          var search = [{
              $project: {
                  new_year: {$substr: ["$trans_month",0,4]},
                  trans: "$work_min",
                  month: "$trans_month",
                  user: "$user_code",
                  tranType : "$trans_type",
                  org : "$org_id"
              }
          },
              {
                  $match: {org: userData.org_id,new_year: req.body.year,user: req.body.user}
              },
              {
                  $group: {
                      _id: {
                          user: "$user",
                          month: "$month",
                          type:"$tranType",
                          year: "$new_year"
                      },
                      sum: {
                          $sum: {$divide: ['$trans',480]}
                      }
                  }
              }
          ];
          connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
              if(!_.isEmpty(data)){
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              }else{
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method=="getWorkTypeTotalPoint") {
          var search = [{
              $project: {
                  new_year: {$substr: ["$trans_month", 0, 4]},
                  trans: "$work_min",
                  month: "$trans_month",
                  user: "$user_code",
                  tranType: "$trans_type",
                  org: "$org_id"
              }
          },
              {
                  $match: {org: userData.org_id, new_year: req.body.year, user: req.body.user}
              },
              {
                  $group: {
                      _id: {
                          type: "$tranType",
                          year: "$new_year"
                      },
                      total: {
                          $sum: {$divide: ['$trans', 480]}
                      }
                  }
              }
          ];
          connection_mongo.method.aggregate('transaction_work', search, function (err, data) {
              if (!_.isEmpty(data)) {
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              } else {
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method=="getTypeMonthTotal"){

              var search = [
                  {
                      $project: {
                          new_year: {$substr: ["$trans_month",0,4]},
                          trans: "$work_min",
                          month: "$trans_month",
                          user: "$user_code",
                          org : "$org_id"
                      }
                  },
                  {
                      $match: {
                          org: userData.org_id,
                          user: req.body.user,
                          new_year: req.body.year
                      }
                  },
                  {
                      $group: {
                          _id: {
                              month: "$month",
                              year: "$new_year"
                          },
                          total: {
                              $sum: {$divide: ['$trans',480]}
                          }
                      }
                  }];
              connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
                  if(!_.isEmpty(data)){
                      object.rows = data;
                      object.success = true
                      res.json(object);
                      return;
                  }else{
                      res.json(object);
                      return;
                  }
              });
      }else if(req.body.method=="getAllDateWorkType"){
          var search = [{
              $project: {
                  new_year: {$substr: ["$trans_month",0,4]},
                  trans: "$work_min",
                  month: "$trans_month",
                  day: "$trans_date",
                  user: "$user_code",
                  tranType : "$trans_type",
                  org : "$org_id"
              }
          },
              {
                  $match: {org: userData.org_id,new_year: req.body.year,user: req.body.user, month:req.body.year+req.body.month}
              },
              {
                  $group: {
                      _id: {
                          user: "$user",
                          month: "$month",
                          type:"$tranType",
                          year: "$new_year"
                      }
                  }
              },
              {
                  $lookup:
                      {
                          from: "work_type",
                          localField: "_id.type",
                          foreignField: "id",
                          as: "typeName"
                      }
              }
          ];
          connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
              if(!_.isEmpty(data)){
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              }else{
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method=="getWorkTypeMonthPoint"){
          var search = [{
              $project: {
                  new_year: {$substr: ["$trans_month",0,4]},
                  trans: "$work_min",
                  month: "$trans_month",
                  day: "$trans_date",
                  user: "$user_code",
                  tranType : "$trans_type",
                  org : "$org_id"
              }
          },
              {
                  $match: {org: userData.org_id,new_year: req.body.year,user: req.body.user, month:req.body.year+req.body.month}
              },
              {
                  $group: {
                      _id: {
                          day: "$day",
                          type:"$tranType"
                      },
                      sum: {
                          $sum: {$divide: ['$trans',480]}
                      }
                  }
              }
          ];
          connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
              if(!_.isEmpty(data)){
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              }else{
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method=="getWorkTypeMonthTotalPoint"){
          var search = [{
              $project: {
                  new_year: {$substr: ["$trans_month",0,4]},
                  trans: "$work_min",
                  month: "$trans_month",
                  day: "$trans_date",
                  user: "$user_code",
                  tranType : "$trans_type",
                  org : "$org_id"
              }
          },
              {
                  $match: {org: userData.org_id,new_year: req.body.year,user: req.body.user, month:req.body.year+req.body.month}
              },
              {
                  $group: {
                      _id: {
                          month: "$month",
                          type:"$tranType"
                      },
                      total: {
                          $sum: {$divide: ['$trans',480]}
                      }
                  }
              }
          ];
          connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
              if(!_.isEmpty(data)){
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              }else{
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method=="getDayTotalPoint"){
          var search = [{
              $project: {
                  new_year: {$substr: ["$trans_month",0,4]},
                  trans: "$work_min",
                  month: "$trans_month",
                  day: "$trans_date",
                  user: "$user_code",
                  tranType : "$trans_type",
                  org : "$org_id"
              }
          },
              {
                  $match: {org: userData.org_id,new_year: req.body.year,user: req.body.user, month:req.body.year+req.body.month}
              },
              {
                  $group: {
                      _id: {
                          day: "$day"
                      },
                      total: {
                          $sum: {$divide: ['$trans',480]}
                      }
                  }
              }
          ];
          connection_mongo.method.aggregate('transaction_work',search,function (err,data) {
              if(!_.isEmpty(data)){
                  object.rows = data;
                  object.success = true
                  res.json(object);
                  return;
              }else{
                  res.json(object);
                  return;
              }
          });
      }else{
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