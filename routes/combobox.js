exports.get = function(req, res) {
		var object = {};
		object.message = '';
		object.success = false;
        res.json(object);
        return;
};
exports.post = function(req,res){
  var object = {};
  object.message = '';
  object.success = false;
  connection_mongo.method.getUserInfomation(req,function(userData){
    if(req.body.method == 'searchPackage'){
      if(!_.isEmpty(userData)){
        connection_mongo.method.find('package',{org_id:userData.org_id,active:1},function(packageData){
          if(!_.isEmpty(packageData)){
            var mapped = connection_mongo.method.selectColumn(packageData,['id','name','amount','package_type']);
            mapped = comboboxFormat(mapped,['id','name','name'],true);
            object.object = mapped;
            object.success = true;
            res.json(object);
            return;
          }else{
            res.json(object);
            return;
          }
        });
      }else{
        object.message = 'Please Login.';
        res.json(object);
        return;
      }
    }else if(req.body.method == "searchMember"){
      if(!_.isEmpty(userData)){
        connection_mongo.method.find('member',{org_id:userData.org_id,active:1},function(packageData){
          if(!_.isEmpty(packageData)){
            var mapped = connection_mongo.method.selectColumn(packageData,['id','mem_code','nick_name']);
            mapped = comboboxFormat(mapped,['id','mem_code','mem_code'],true);
            object.object = mapped;
            object.success = true;
            res.json(object);
            return;
          }else{
            res.json(object);
            return;
          }
        });
      }else{
        object.message = 'Please Login.';
        res.json(object);
        return;
      }
    }else if(req.body.method == "searchRole"){
      object.success = true;
      if(userData.role == 0){
        object.object = [{code:'0',descriptionTh:'ผู้ดูแลระบบ',descriptionEn:'Super Admin'},{code:'1',descriptionTh:"ผู้ดูแลสำนักวิชา",descriptionEn:'Admin'},{code:'2',descriptionTh:"ผู้ใช้งาน",descriptionEn:'User'}];
      }else{
        object.object = [{code:'1',descriptionTh:"ผู้ดูแลสำนักวิชา",descriptionEn:'Admin'},{code:'2',descriptionTh:"ผู้ใช้งาน",descriptionEn:'User'}];
      }
      res.json(object);
      return;
    }else if(req.body.method == "searchOrg"){
      connection_mongo.method.find('organize',{active:1},function(orgData){
        if(!_.isEmpty(orgData)){
          var mapped = comboboxFormat(orgData,['id','org_name','org_name']);
          object.object = mapped;
          object.success = true;
          res.json(object);
          return;
        }else{
          object.success = false;
          res.json(object);
          return;
        }
      });
    }else{
      res.json(object);
      return;
    }
  });
};
function comboboxFormat(array,columnRefArray,keepObject) {
  var result = [];
  var data = [];
  for(var i = 0;i<array.length;i++){
  	var object = {};
    object.code = array[i][columnRefArray[0]];
    object.descriptionTh = array[i][columnRefArray[1]];
    object.descriptionEn = array[i][columnRefArray[2]];
    if(keepObject){
      object.data = array[i];
    }
    result.push(object);
  }
  return result;
}