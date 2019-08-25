var moment = require('moment');
exports.get = function(req,res){
    connection_mongo.method.getUserInfomation(req, function (userData) {
      var username = '';
      var role = '';
      if(!_.isEmpty(userData)){
        username = userData.username;
        role = userData.role;
      }
      checkSessionUser(req, res, 'front-end/index', {title: "Dashboard",user:username,role:role})
    });
};
exports.post = function(req,res) {
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req, function (userData) {
    if(!_.isEmpty(userData)){
      if(req.body.method == 'showbill') {
          var search = [
              {
                  $project: {
                      transNo: "$trans_no",
                      transDate : "$trans_date",
                      orgId: "$org_id",
                      packageId : "$package_id",
                      packageAmount : "$package_amount",
                      paidAmount : "$paid_amount",
                      returnAmount : "$return_amount",
                      expDate : "$exp_date",
                      status : "$status"
                  }
              },
              {
                  $match: {
                      transNo: req.body.transNo
                  }
              },
              {
                  $lookup: {
                      from: "organize",
                      localField: "orgId",
                      foreignField: "id",
                      as: "orgName"
                  }
              },
              {
                  $lookup: {
                      from: "package",
                      localField: "packageId",
                      foreignField: "id",
                      as: "packageName"
                  }
              }
          ];
          connection_mongo.method.aggregate('transaction_payment',search,function(err,paymentData){
              if(!_.isEmpty(paymentData)){
                  paymentData = paymentData[0]
                  var data = new Object();
                  poontFunc.method.stringToFormatDate(paymentData.expDate, "yyyymmdd", function (d) {
                    poontFunc.method.stringToFormatDate(paymentData.transDate, "yyyymmdd", function (dd) {
                      data.billOrgName = paymentData.orgName[0].org_name
                      data.billTranNo = paymentData.transNo;
                      data.billTranDate = dd;
                      data.billFirstName = userData.first_name;
                      data.billPackageDesc = paymentData.packageName[0].name;
                      data.billPackageAmount = paymentData.packageName[0].amount;
                      data.billExpireDate = d;
                      data.billNetAmount = paymentData.packageAmount;
                      data.billPaid = paymentData.paidAmount;
                      data.billReturn = paymentData.returnAmount;
                      data.billStatus = paymentData.status;
                      object.rows = data;
                      object.success = true;
                      object.message = "ออกใบเสร็จรับเงิน สำเร็จ";
                      res.json(object);
                      return;
                    });
                  });
              }else{
                  object.message = "เลขที่ใบเสร็จรับเงินไม่ถูกต้อง."
                  res.json(object);
                  return;
              }
          })
      }else if(req.body.method == 'searchHistory'){
          var search = [
              {
                  $project:{
                      id : "$id",
                      transNo : "$trans_no",
                      transDate : "$trans_date",
                      packageId : "$package_id",
                      memId : "$mem_id",
                      orgId : "$org_id",
                      status : "$status"

                  }
              },
              {
                  $match: {
                      orgId: userData.org_id
                  }
              },
              {
                  $lookup: {
                      from: "package",
                      localField: "packageId",
                      foreignField: "id",
                      as: "packageData"
                  }
              },
              {
                  $lookup: {
                      from: "member",
                      localField: "memId",
                      foreignField: "id",
                      as: "memberData"
                  }
              }
          ];
          connection_mongo.method.aggregate('transaction_payment',search,function(err,historyData){
              if(!_.isEmpty(historyData)){
                  historyData = connection_mongo.method.selectColumn(historyData,['id','transNo','transDate','packageData','memberData','status']);
                  _.forEach(historyData,function(obj){
                      poontFunc.method.stringToFormatDate(obj.transDate, "yyyymmdd", function (d) {
                          obj.transDate = d;
                      });
                  });

                  object.rows = _.orderBy(historyData,['id'],['desc']);
                  object.success = true;
                  res.json(object);
                  return;
              } else {
                  object.message = "No data found."
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method == 'searchIncome'){
          var search = [
              {
                  $project:{
                      id : "$id",
                      transNo : "$trans_no_ref",
                      transDate : "$cr_date",
                      in_amt : "$in_amount",
                      out_amt : "$out_amount",
                      balance : "$balance_amount",
                      orgId : "$org_id"

                  }
              },
              {
                  $match: {
                      orgId: userData.org_id

                  }
              }
          ];
          connection_mongo.method.aggregate('activity_organize',search,function(err,incomeData){
              if(!_.isEmpty(incomeData)){
                  incomeData = connection_mongo.method.selectColumn(incomeData,['id','transNo','transDate','in_amt','out_amt','balance']);
                  _.forEach(incomeData,function(obj){
                      poontFunc.method.stringToFormatDate(obj.transDate, "yyyymmdd", function (d) {
                          obj.transDate = d;
                      });
                  });

                  object.rows = _.orderBy(incomeData,['id'],['desc']);
                  object.success = true;
                  res.json(object);
                  return;
              } else {
                  object.message = "No data found."
                  res.json(object);
                  return;
              }
          });
      }else if(req.body.method == 'searchMember'){
          var search = [{
              $project: {
                  memId: "$id",
                  memCode: "$mem_code",
                  firstName: "$mem_fname",
                  lastName: "$mem_lname",
                  nickName: "$nick_name",
                  orgId: "$org_id"
              }
          }, {
              $match: {
                  orgId: userData.org_id
              }
          }, {
              $lookup: {
                  from: "member_package",
                  localField: "memId",
                  foreignField: "id",
                  as: "expire"
              }
          }
          ];
          connection_mongo.method.aggregate('member',search,function(err,memberData){
              if(!_.isEmpty(memberData)){
                  memberData = connection_mongo.method.selectColumn(memberData,['memId','memCode','firstName','lastName','nickName','expire']);
                  _.forEach(memberData,function(obj){
                      if(obj.expire.length > 0){
                          poontFunc.method.stringToFormatDate(obj.expire[0].exp_date, "yyyymmdd", function (d) {
                              obj.expire[0].exp_date = d;
                          });
                      }
                  });
                  object.rows = _.orderBy(memberData,['id'],['desc']);
                  object.success = true;
                  res.json(object);
                  return;
              } else {
                  object.message = "No data found."
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
exports.put = function(req,res){
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req,function(userData){
    if(!_.isEmpty(userData)){
        if(req.body.method == 'addNewMember') {
            connection_mongo.method.findOne('organize', {id: _.toNumber(userData.org_id)}, function (orgData) {
                if (!_.isEmpty(orgData)) {
                    var memberCode = orgData.org_code + poontFunc.method.getNow('yyyy') + '0001';
                    connection_mongo.method.find('member', {org_id: _.toNumber(userData.org_id)}, function (memData) {
                        if (!_.isEmpty(memData)) {
                            var oldMemCode = memData[memData.length - 1].mem_code;
                            if (oldMemCode.substr(0, orgData.org_code.length + 4) == (orgData.org_code + poontFunc.method.getNow('yyyy'))) {
                                memberCode = orgData.org_code + poontFunc.method.getNow('yyyy') + _.padStart((oldMemCode.substr(orgData.org_code.length + 5) * 1) + 1, 4, '0');
                            }
                        }
                        var addNewMember = new Object();
                        addNewMember.org_id = userData.org_id;
                        addNewMember.mem_code = memberCode;
                        addNewMember.mem_fname = req.body.firstName;
                        addNewMember.mem_lname = req.body.lastName;
                        addNewMember.nick_name = req.body.nickName;
                        addNewMember.active = 1;
                        if (!poontFunc.method.isEmpty(req.body.birthday)) {
                            addNewMember.birthday = poontFunc.method.changeDateFormat(req.body.birthday) + '000000';
                        }
                        connection_mongo.method.insertOne('member', addNewMember, userData.user_code, function (saveData) {
                            object.message = "สมัครสมาชิกสำเร็จ"
                            object.id = saveData.ops[0].id;
                            object.success = true;
                            res.json(object);
                            return;
                        });
                    });
                } else {
                    object.message = "Please Login."
                    res.json(object);
                    return;
                }
            });
        }else if(req.body.method == 'paymentTransaction'){
            connection_mongo.method.findOne('package',{id:_.toNumber(req.body.packageId)},function(packageData){
                if(!_.isEmpty(packageData)){
                    var transNo = 'BILL' + poontFunc.method.getNow('yyyymm') + '0001';
                    connection_mongo.method.find('transaction_payment', {}, function (transData) {
                        if (!_.isEmpty(transData)) {
                            var oldTransNo = transData[transData.length - 1].trans_no;
                            if (oldTransNo.substr(4, 6) == (poontFunc.method.getNow('yyyymm'))) {
                                transNo = 'BILL' + poontFunc.method.getNow('yyyymm') + _.padStart((oldTransNo.substr(10) * 1) + 1, 4, '0');
                            }
                        }
                        var saveTransaction = new Object();
                        saveTransaction.trans_no = transNo;
                        saveTransaction.trans_date = poontFunc.method.getNow('yyyymmdd') + "000000";
                        saveTransaction.org_id = userData.org_id;
                        saveTransaction.mem_id = _.toNumber(req.body.memId);
                        saveTransaction.package_id = packageData.id;
                        saveTransaction.package_amount = packageData.amount;
                        saveTransaction.paid_amount = _.toNumber(req.body.amount);
                        saveTransaction.return_amount = saveTransaction.paid_amount - saveTransaction.package_amount;
                        saveTransaction.status = "N";
                        var expDate;
                        if(packageData.package_type=="D"){
                            expDate = moment().add(0,'days').format('YYYYMMDD') + '000000';
                        }else if(packageData.package_type=="M"){
                            expDate = moment().add(30,'days').format('YYYYMMDD') + '000000';
                        }else if(packageData.package_type=="Y"){
                            expDate = moment().add(1,'years').format('YYYYMMDD') + '000000';
                        }else{
                            expDate = '';
                        }
                        saveTransaction.exp_date = expDate;
                        var memberPackage = new Object();
                        memberPackage.org_id = saveTransaction.org_id;
                        memberPackage.mem_id = saveTransaction.mem_id;
                        memberPackage.package_id = saveTransaction.package_id;
                        memberPackage.package_amount = saveTransaction.package_amount;
                        memberPackage.exp_date = expDate;
                        memberPackage.status = 1;
                        memberPackage.trans_no_ref = saveTransaction.trans_no;

                        connection_mongo.method.findOne('member_package',{org_id:saveTransaction.org_id,mem_id:memberPackage.mem_id},function(memberPackageData){
                            if(!_.isEmpty(memberPackageData)){
                                connection_mongo.method.updateOne("member_package",{org_id:saveTransaction.org_id,mem_id:memberPackage.mem_id},memberPackage,function(){
                                    console.log('memberPackageUpdate')
                                });
                            }else{
                                connection_mongo.method.insertOne("member_package",memberPackage,function(){
                                    console.log('memberPackageInsert')
                                });
                            };
                        });

                        var activity = new Object();
                        activity.org_id = userData.org_id;
                        activity.in_amount = saveTransaction.package_amount;
                        activity.trans_no_ref = saveTransaction.trans_no;

                        connection_mongo.method.findLast('activity_organize',{org_id:userData.org_id},function(atvData){
                            if(!_.isEmpty(atvData)){
                                activity.balance_amount = activity.in_amount+_.toNumber(atvData.balance_amount);
                            }else{
                                activity.balance_amount = activity.in_amount;
                            }
                            connection_mongo.method.insertOne("activity_organize",activity);
                        });

                        connection_mongo.method.insertOne("transaction_payment",saveTransaction,userData.user_code,function(){
                            object.transNo = transNo;
                            object.message = "ชำระเงินสำเร็จ"
                            object.success = true;
                            res.json(object);
                            return;
                        });
                    });
                }else{
                    object.message = "กรุณาเลือก Package."
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
exports.patch = function(req,res){
    var object = {};
    object.message = '';
    object.success = false;
    connection_mongo.method.getUserInfomation(req,function(userData){
        if(!_.isEmpty(userData)){
            if(req.body.method == 'cancelPayment'){
                connection_mongo.method.findOne('transaction_payment',{id:_.toNumber(req.body.id)},function(transData){
                    if(!_.isEmpty(transData)){
                        if(transData.status!="C"){
                            var activity = new Object();
                            activity.org_id = transData.org_id;
                            activity.out_amount = transData.package_amount;

                            connection_mongo.method.findLast('activity_organize',{org_id:transData.org_id},function(atvData){
                                if(!_.isEmpty(atvData)){
                                    activity.balance_amount = _.toNumber(atvData.balance_amount)-_.toNumber(activity.out_amount);
                                    activity.trans_no_ref = transData.trans_no;
                                    connection_mongo.method.insertOne("activity_organize",activity);
                                }
                                connection_mongo.method.updateOne('transaction_payment',{id:_.toNumber(req.body.id)},{status:"C"},userData.user_code);
                                connection_mongo.method.updateOne('member_package',{trans_no_ref:atvData.trans_no_ref},{status:0},userData.user_code);
                                object.success = true;
                                object.message = "ยกเลิกรายการสำเร็จ"
                                res.json(object);
                                return;
                            });
                        }else {
                            object.message = "รายการนี้ ถูกยกเลิกไปแล้ว"
                            res.json(object);
                            return;
                        }
                    }else{
                        res.json(object);
                        return;
                    }
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
exports.delete = function(req,res){
    var object = {};
    object.message = '';
    object.success = false;
    connection_mongo.method.getUserInfomation(req,function(userData){
        if(!_.isEmpty(userData)){
            connection_mongo.method.deleteOne('transaction_work',{id:_.toNumber(req.body.id)});
            object.message = "ปรับปรุงภาระงานสำเร็จ"
            object.success = true;
            res.json(object);
            return;
        }else{
            object.message = "Please Login."
            res.json(object);
            return;
        }
    });
};