var ADMIN = {};
ADMIN.url = POONT.contextPath + '/admin';
var menu;
var role = [{code:0,descriptionTh:'ผู้ดูแลระบบ',descriptionEn:'Super Admin'},{code:1,descriptionTh:"ผู้ดูแลองค์กร",descriptionEn:'Admin'},{code:2,descriptionTh:"ผู้ใช้งาน",descriptionEn:'User'}];
function getHeight(element){
    var height = ($(window).height() - 115)+'px';
    if($(window).width() <= 600){
        height = '467px';
    }
    element.css('height',height);
    element.css('max-height',height);
};
$( window ).resize(function() {
    getHeight($leftBox);
    getHeight($rightBox);
});
$(document).ready(function() {
    Promise.all([init()]).then(function() {
        action();
        searchMember();
    }, function() {
        console.log('error')
    });
});
function init(){
    $leftBox = $('.leftBox');
    $rightBox = $('.rightBox');
    $selectMenu = $('.selectMenu');
    $orgBox = $('.orgBox');
    $userBox = $('.userBox');
    $workTypeBox = $('.workTypeBox');
    $addNewMember = $('#addNewMember');
    $addNewMemberModel = $('.addNewMemberModel');
    $memberInfo = $('.memberInfo');
    $usernameNew = $('#usernameNew');
    $firstNameNew = $('#firstNameNew');
    $lastNameNew = $('#lastNameNew');
    $birthdayNew = $('#birthdayNew');
    $emailNew = $('#emailNew');
    $phoneNew = $('#phoneNew');
    $postionNew = $('#postionNew');
    $passwordNew = $('#passwordNew');
    $passwordConfirmNew = $('#passwordConfirmNew');
    $saveUserNew = $('.saveUserNew');
    $frame = $('.frame');
    $editMemberModel = $('.editMemberModel');
    $idEdit = $('#idEdit');
    $userCodeEdit = $('#userCodeEdit');
    $usernameEdit = $('#usernameEdit');
    $firstNameEdit = $('#firstNameEdit');
    $lastNameEdit = $('#lastNameEdit');
    $birthdayEdit = $('#birthdayEdit');
    $emailEdit = $('#emailEdit');
    $phoneEdit = $('#phoneEdit');
    $postionEdit = $('#postionEdit');
    $passwordEdit = $('#passwordEdit');
    $passwordConfirmEdit = $('#passwordConfirmEdit');
    $saveUserEdit = $('.saveUserEdit');
    $addNewOrg = $('#addNewOrg');
    $addNewOrgModel = $('.addNewOrgModel');
    $orgInfo = $('.orgInfo');
    $orgCodeNew = $('#orgCodeNew');
    $orgNameNew = $('#orgNameNew');
    $saveOrgNew = $('.saveOrgNew');
    $orgIdEdit = $('#orgIdEdit');
    $orgCodeEdit = $('#orgCodeEdit');
    $orgNameEdit = $('#orgNameEdit');
    $saveOrgEdit = $('.saveOrgEdit');
    $editOrgModel = $('.editOrgModel');
    $addNewWorkType = $('#addNewWorkType');
    $addNewWorkTypeModel = $('.addNewWorkTypeModel');
    $workTypeInfo = $('.workTypeInfo');
    $workTypeCodeNew = $('#workTypeCodeNew');
    $workTypeNameNew = $('#workTypeNameNew');
    $saveWorkTypeNew = $('.saveWorkTypeNew');
    $workTypeIdEdit = $('#workTypeIdEdit');
    $workTypeCodeEdit = $('#workTypeCodeEdit');
    $workTypeNameEdit = $('#workTypeNameEdit');
    $saveWorkTypeEdit = $('.saveWorkTypeEdit');
    $editWorkTypeModel = $('.editWorkTypeModel');
    getHeight($leftBox);
    getHeight($rightBox);
    buildDateField();
    buildCombobox();

    $frame.overlayScrollbars({ });
    menu = [{id:0,el:$orgBox},{id:1,el:$userBox},{id:2,el:$workTypeBox}];
};
function action(){
    $selectMenu.click(function(){
        selectPage($(this));
    });
    $addNewOrg.click(function(){
        $addNewOrgModel.modal('show');
    });
    $addNewWorkType.click(function(){
        $addNewWorkTypeModel.modal('show');
    });
    $addNewMember.click(function(){
        $addNewMemberModel.modal('show');
    });
    $saveUserNew.click(function(){
        if(checkBeforeSave()){
            if($passwordNew.val() == $passwordConfirmNew.val()){
                $saveUserNew.prop('disabled',true);
                saveNewUser();
            }else{
                toastr["error"]('รหัสผ่านไม่ตรงกัน','แจ้งเตือน');
            }
        }else{
            toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
        }
    });
    $saveUserEdit.click(function () {
        if(checkBeforeUpdate()){
            if(!POONT.isEmpty($passwordEdit.val())||!POONT.isEmpty($passwordConfirmEdit.val())){
                if($passwordEdit.val()==$passwordConfirmEdit.val()){
                    $saveUserEdit.prop('disabled',true);
                    updateUser();
                }else{
                    toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
                }
            }else{
                $saveUserEdit.prop('disabled',true);
                updateUser();
            }
        }else{
            toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
        }
    })
    $saveOrgNew.click(function(){
        if(checkOrgBeforeSave()){
            $saveOrgNew.prop('disabled',true);
            saveNewOrg();
        }else{
            toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
        }
    });
    $saveOrgEdit.click(function(){
       if(checkOrgBeforeUpdate()){
           $saveOrgEdit.prop('disabled',true);
           updateOrg();
       }else{
           toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
       }
    });
    $saveWorkTypeNew.click(function(){
        if(checkWorkTypeBeforeSave()){
            $saveWorkTypeNew.prop('disabled',true);
            saveNewWorkType();
        }else{
            toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
        }
    });
    $saveWorkTypeEdit.click(function(){
        if(checkWorkTypeBeforeUpdate()){
            $saveWorkTypeEdit.prop('disabled',true);
            updateWorkType();
        }else{
            toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
        }
    });
    $addNewMemberModel.on('hidden.bs.modal', function (e) {
        clearAddNewUser();
    });
    $editMemberModel.on('hidden.bs.modal', function (e) {
        clearEditUser();
    });
    $addNewOrgModel.on('hidden.bs.modal', function (e) {
        clearAddNewOrg();
    });
    $editOrgModel.on('hidden.bs.modal', function (e) {
        clearEditOrg();
    });
    $addNewWorkTypeModel.on('hidden.bs.modal', function (e) {
        clearAddNewWorkType();
    });
    $editWorkTypeModel.on('hidden.bs.modal', function (e) {
        clearEditWorkType();
    });
};
function selectPage(element){
    var id = element.attr('data');
    if(id==0){
        searchOrg();
    }else if(id==1){
        searchMember();
    }else if(id==2){
        searchWorkType();
    }
    $('.menuTab').removeClass('active');
    element.children().addClass('active');
    _.forEach(menu,function (o) {
       o.el.addClass('hide');
    });
    var result = _.find(menu,{id:_.toNumber(id)});
    result.el.removeClass('hide');
};
function buildDateField(){
    $birthdayNew.bootstrapMaterialDatePicker({
        time : false,
        format : 'DD/MM/YYYY'
    });
    $birthdayEdit.bootstrapMaterialDatePicker({
        time : false,
        format : 'DD/MM/YYYY'
    });
}
function buildCombobox(){
    $.combobox.build({
        id:"roleNew",
        placeholder: "สิทธิ์ผู้ใช้",
        method: "searchRole",
        type : "POST"
    });
    $.combobox.build({
        id:"roleEdit",
        placeholder: "สิทธิ์ผู้ใช้",
        method: "searchRole",
        type : "POST"
    });
    $.combobox.build({
        id:"orgComboboxNew",
        placeholder: "องค์กร",
        method: "searchOrg",
        type : "POST"
    });
    $.combobox.build({
        id:"orgComboboxEdit",
        placeholder: "องค์กร",
        method: "searchOrg",
        type : "POST"
    });
};
function renderCombobox() {
    $.combobox.render({
        id:"orgComboboxNew",
        method: "searchOrg",
        type : "POST"
    });
    $.combobox.render({
        id:"orgComboboxEdit",
        method: "searchOrg",
        type : "POST"
    });
};
function checkBeforeSave(){
    return !POONT.isEmpty($usernameNew.val())&&!POONT.isEmpty($passwordNew.val())&&!POONT.isEmpty($passwordConfirmNew.val());
};
function checkBeforeUpdate(){
    return !POONT.isEmpty($usernameEdit.val());
};
function checkOrgBeforeSave(){
    return !POONT.isEmpty($orgNameNew.val())&&!POONT.isEmpty($orgCodeNew.val());
}
function checkOrgBeforeUpdate(){
    return !POONT.isEmpty($orgNameEdit.val())&&!POONT.isEmpty($orgCodeEdit.val());
}
function checkWorkTypeBeforeSave(){
    return !POONT.isEmpty($workTypeNameNew.val())&&!POONT.isEmpty($workTypeCodeNew.val());
}
function checkWorkTypeBeforeUpdate(){
    return !POONT.isEmpty($workTypeNameEdit.val())&&!POONT.isEmpty($workTypeCodeEdit.val());
}
function clearAddNewUser(){
    $.combobox.clear('orgComboboxNew');
    $usernameNew.val(null);
    $firstNameNew.val(null);
    $lastNameNew.val(null);
    $birthdayNew.val(null);
    $emailNew.val(null);
    $phoneNew.val(null);
    $postionNew.val(null);
    $.combobox.clear('roleNew');
    $passwordNew.val(null);
    $passwordConfirmNew.val(null);
    $saveUserNew.prop('disabled',false);
}
function clearEditUser(){
    $idEdit.val(null);
    $.combobox.clear('orgComboboxEdit');
    $userCodeEdit.val(null);
    $usernameEdit.val(null);
    $firstNameEdit.val(null);
    $lastNameEdit.val(null);
    $birthdayEdit.val(null);
    $emailEdit.val(null);
    $phoneEdit.val(null);
    $postionEdit.val(null);
    $.combobox.clear('roleEdit');
    $passwordEdit.val(null);
    $passwordConfirmEdit.val(null);
    $saveUserEdit.prop('disabled',false);
}
function clearAddNewOrg() {
    $orgCodeNew.val(null);
    $orgNameNew.val(null);
    $saveOrgNew.prop('disabled',false);
}
function clearEditOrg() {
    $orgIdEdit.val(null);
    $orgCodeEdit.val(null);
    $orgNameEdit.val(null);
    $saveOrgEdit.prop('disabled',false);
}
function clearAddNewWorkType() {
    $workTypeCodeNew.val(null);
    $workTypeNameNew.val(null);
    $saveWorkTypeNew.prop('disabled',false);
}
function clearEditWorkType() {
    $workTypeIdEdit.val(null);
    $workTypeCodeEdit.val(null);
    $workTypeNameEdit.val(null);
    $saveWorkTypeEdit.prop('disabled',false);
}
function saveNewUser(){
    var paramSave = new Object;
    paramSave.org = $.combobox.getValue('orgComboboxNew');
    paramSave.username = $usernameNew.val();
    paramSave.firstName = $firstNameNew.val();
    paramSave.lastName = $lastNameNew.val();
    paramSave.birthday = $birthdayNew.val();
    paramSave.email = $emailNew.val();
    paramSave.phone = $phoneNew.val();
    paramSave.position = $postionNew.val();
    paramSave.role = $.combobox.getValue('roleNew')
    paramSave.password = $passwordNew.val();
    paramSave.method = 'saveMember';
    $.ajax({
        type: "PUT",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramSave,
        success: function(d) {
            if(d.success){
                searchMember();
                $addNewMemberModel.modal("hide");
                toastr["success"](d.message,'สำเร็จ');
            }else{
                $saveUserNew.prop('disabled',false);
                toastr["error"](d.message,'แจ้งเตือน');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $saveUserNew.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });

};
function searchMember(){
    $('.loader').addClass('action');
    var search = Object();
    search.method = 'searchMember'
    $.ajax({
        type: "POST",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: search,
        success: function(d) {
            $memberInfo.children().remove();
            if(d.success){
                var result = '';
                var index = d.rows.length;
                for(var i =0;i<index;i++){
                    var status = '';
                    if(d.rows[i].active==1){
                        status = 'checked';
                    }
                    result += '<tr>'+
                        '<td class="text-center col-sm-2">'+d.rows[i].username+'</td>'+
                        '<td class="text-left col-sm-3">'+d.rows[i].first_name+' '+d.rows[i].last_name+'</td>'+
                        '<td class="text-center col-sm-2">'+d.rows[i].position+'</td>'+
                        '<td class="text-center col-sm-2">'+_.find(role,{code:_.toNumber(d.rows[i].role)}).descriptionTh+'</td>'+
                        '<td class="text-center col-sm-2"><div class="pretty p-switch">'+
                        ' <input '+status+' type="checkbox" name="switch1" data-value="'+d.rows[i].id+'" onchange="updateMemberActive($(this))" />'+
                        '     <div class="state p-primary">'+
                        '         <label>&nbsp</label>'+
                        '     </div>'+
                        ' </div></td> '+
                        '<td class="text-center col-sm-1">'+
                        '	<span class="editMember glyphicon glyphicon-pencil" data-value="'+d.rows[i].id+'" aria-hidden="true" style="margin-right: 10px;"/>'+
                        '	<span class="deleteMember glyphicon glyphicon-remove" data-user-code="'+d.rows[i].user_code+'" data-value="'+d.rows[i].id+'" aria-hidden="true"/>'+
                        '</td>'+
                        '</tr>';
                }
                $memberInfo.append(result);
                $('.loader').removeClass('action');
                $(".editMember").click(function(){
                    searchForUpdate($(this).attr("data-value"));
                });
                $(".deleteMember").click(function(){
                    var data = $(this).attr("data-value");
                    var userCode = $(this).attr("data-user-code");
                    swal({
                            title: "ยืนยันการลบผู้ใช้งานระบบ",
                            text: "ต้องการลบผู้ใช้งานระบบคนนี้ ?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "ยืนยัน",
                            cancelButtonText: "ยกเลิก",
                            closeOnConfirm: false
                        },
                        function(isConfirm){
                            if (isConfirm) {
                                deleteMemberFunction(data,userCode);
                            }
                        });
                });

            }else{
                toastr["error"](d.message,'แจ้งเตือน');
                $('.loader').removeClass('action');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $memberInfo.children().remove();
            $saveUserNew.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function updateMemberActive(e){
    var paramActive = new Object();
    paramActive.id = e.attr('data-value');
    paramActive.active = e.prop('checked')?1:0;
    paramActive.method = 'updateMemberActive';
    $.ajax({
        type: "PATCH",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramActive,
        success: function(d) {
            if(d.success){
                toastr["success"](d.message,'สำเร็จ');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function deleteMemberFunction(id,userCode){
    var paramDelete = new Object;
    paramDelete.idDelete = id;
    paramDelete.userCode = userCode;
    paramDelete.method = 'deleteMember';
    $.ajax({
        type: "DELETE",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramDelete,
        success: function(d) {
            searchMember();
            swal.close();
            if(d.success){
                toastr["success"](d.message,'สำเร็จ');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            swal.close();
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function searchForUpdate(id){
    $('.loader').addClass('action');
    var paramUpdate = new Object;
    paramUpdate.id = id;
    paramUpdate.method = 'searchForUpdate';
    $.ajax({
        type: "POST",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramUpdate,
        success: function(d) {
            var data = d.rows;
            if(d.success){
                $idEdit.val(data.id);
                $.combobox.setValue('orgComboboxEdit',data.org_id);
                $userCodeEdit.val(data.user_code);
                $usernameEdit.val(data.username);
                $firstNameEdit.val(data.first_name);
                $lastNameEdit.val(data.last_name);
                $birthdayEdit.bootstrapMaterialDatePicker('setDate',new Date(data.birthday));
                $emailEdit.val(data.email);
                $phoneEdit.val(data.phone);
                $postionEdit.val(data.position);
                $.combobox.setValue('roleEdit',data.role);
                $editMemberModel.modal('show');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
            $('.loader').removeClass('action');
        },
        error: function (xhr, textStatus, errorThrown) {
            swal.close();
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function updateUser(){
    var paramUpdate = new Object;
    paramUpdate.id = $idEdit.val();
    paramUpdate.org = $.combobox.getValue('orgComboboxEdit');
    paramUpdate.username = $usernameEdit.val();
    paramUpdate.firstName = $firstNameEdit.val();
    paramUpdate.lastName = $lastNameEdit.val();
    paramUpdate.birthday = $birthdayEdit.val();
    paramUpdate.email = $emailEdit.val();
    paramUpdate.phone = $phoneEdit.val();
    paramUpdate.position = $postionEdit.val();
    paramUpdate.role = $.combobox.getValue('roleEdit')
    paramUpdate.password = $passwordEdit.val();
    paramUpdate.method = 'update';
    $.ajax({
        type: "PATCH",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramUpdate,
        success: function(d) {
            if(d.success){
                searchMember();
                $editMemberModel.modal("hide");
                toastr["success"](d.message,'สำเร็จ');
            }else{
                $saveUserEdit.prop('disabled',false);
                toastr["error"](d.message,'แจ้งเตือน');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $saveUserNew.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });

};
function saveNewOrg(){
    var paramSave = new Object;
    paramSave.orgCode = $orgCodeNew.val();
    paramSave.orgName = $orgNameNew.val();
    paramSave.method = 'saveOrg';
    $.ajax({
        type: "PUT",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramSave,
        success: function(d) {
            if(d.success){
                searchOrg();
                $addNewOrgModel.modal("hide");
                toastr["success"](d.message,'สำเร็จ');
                renderCombobox();
            }else{
                $saveOrgNew.prop('disabled',false);
                toastr["error"](d.message,'แจ้งเตือน');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $saveOrgNew.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });

};
function searchOrg(){
    $('.loader').addClass('action');
    var search = Object();
    search.method = 'searchOrg'
    $.ajax({
        type: "POST",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: search,
        success: function(d) {
            $orgInfo.children().remove();
            if(d.success){
                var result = '';
                var index = d.rows.length;
                for(var i =0;i<index;i++){
                    var status = '';
                    if(d.rows[i].active==1){
                        status = 'checked';
                    }
                    result += '<tr>'+
                        '<td class="text-center col-sm-4">'+d.rows[i].org_code+'</td>'+
                        '<td class="text-left col-sm-5">'+d.rows[i].org_name+'</td>'+
                        '<td class="text-center col-sm-2"><div class="pretty p-switch">'+
                        ' <input '+status+' type="checkbox" name="switch1" data-value="'+d.rows[i].id+'" onchange="updateOrgActive($(this))" />'+
                        '     <div class="state p-primary">'+
                        '         <label>&nbsp</label>'+
                        '     </div>'+
                        ' </div></td> '+
                        '<td class="text-center col-sm-1">'+
                        '	<span class="editOrg glyphicon glyphicon-pencil" data-value="'+d.rows[i].id+'" aria-hidden="true" style="margin-right: 10px;"/>'+
                        '	<span class="deleteOrg glyphicon glyphicon-remove" data-value="'+d.rows[i].id+'" aria-hidden="true"/>'+
                        '</td>'+
                        '</tr>';
                }
                $orgInfo.append(result);
                $('.loader').removeClass('action');
                $(".editOrg").click(function(){
                    searchForOrgUpdate($(this).attr("data-value"));
                });
                $(".deleteOrg").click(function(){
                    var data = $(this).attr("data-value");
                    swal({
                            title: "ยืนยันการลบองค์กร",
                            text: "ต้องการลบองค์กรนี้ ?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "ยืนยัน",
                            cancelButtonText: "ยกเลิก",
                            closeOnConfirm: false
                        },
                        function(isConfirm){
                            if (isConfirm) {
                                deleteOrgFunction(data);
                            }
                        });
                });

            }else{
                toastr["error"](d.message,'แจ้งเตือน');
                $('.loader').removeClass('action');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $orgInfo.children().remove();
            $saveOrgNew.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });

};
function updateOrgActive(e){
    var paramActive = new Object();
    paramActive.id = e.attr('data-value');
    paramActive.active = e.prop('checked')?1:0;
    paramActive.method = 'updateOrgActive';
    $.ajax({
        type: "PATCH",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramActive,
        success: function(d) {
            if(d.success){
                toastr["success"](d.message,'สำเร็จ');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function deleteOrgFunction(id){
    var paramDelete = new Object;
    paramDelete.idDelete = id;
    paramDelete.method = 'deleteOrg';
    $.ajax({
        type: "DELETE",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramDelete,
        success: function(d) {
            swal.close();
            if(d.success){
                searchOrg();
                renderCombobox();
                toastr["success"](d.message,'สำเร็จ');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            swal.close();
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function searchForOrgUpdate(id){
    $('.loader').addClass('action');
    var paramUpdate = new Object;
    paramUpdate.id = id;
    paramUpdate.method = 'searchForOrgUpdate';
    $.ajax({
        type: "POST",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramUpdate,
        success: function(d) {
            var data = d.rows;
            if(d.success){
                $orgIdEdit.val(data.id);
                $orgCodeEdit.val(data.org_code);
                $orgNameEdit.val(data.org_name);
                $editOrgModel.modal('show');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
            $('.loader').removeClass('action');
        },
        error: function (xhr, textStatus, errorThrown) {
            swal.close();
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function updateOrg(){
    var paramUpdate = new Object;
    paramUpdate.id = $orgIdEdit.val();
    paramUpdate.orgCode = $orgCodeEdit.val();
    paramUpdate.orgName = $orgNameEdit.val();
    paramUpdate.method = 'updateOrg';
    $.ajax({
        type: "PATCH",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramUpdate,
        success: function(d) {
            if(d.success){
                searchOrg();
                $editOrgModel.modal("hide");
                toastr["success"](d.message,'สำเร็จ');
                renderCombobox();
            }else{
                $saveOrgEdit.prop('disabled',false);
                toastr["error"](d.message,'แจ้งเตือน');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $saveOrgEdit.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });

};

function saveNewWorkType(){
    var paramSave = new Object;
    paramSave.workTypeCode = $workTypeCodeNew.val();
    paramSave.workTypeName = $workTypeNameNew.val();
    paramSave.method = 'saveWorkType';
    $.ajax({
        type: "PUT",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramSave,
        success: function(d) {
            if(d.success){
                searchWorkType();
                $addNewWorkTypeModel.modal("hide");
                toastr["success"](d.message,'สำเร็จ');
            }else{
                $saveWorkTypeNew.prop('disabled',false);
                toastr["error"](d.message,'แจ้งเตือน');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $saveWorkTypeNew.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });

};
function searchWorkType(){
    $('.loader').addClass('action');
    var search = Object();
    search.method = 'searchWorkType'
    $.ajax({
        type: "POST",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: search,
        success: function(d) {
            $workTypeInfo.children().remove();
            if(d.success){
                var result = '';
                var index = d.rows.length;
                for(var i =0;i<index;i++){
                    var status = '';
                    if(d.rows[i].active==1){
                        status = 'checked';
                    }
                    result += '<tr>'+
                        '<td class="text-center col-sm-4">'+d.rows[i].work_type_code+'</td>'+
                        '<td class="text-left col-sm-5">'+d.rows[i].work_type_name+'</td>'+
                        '<td class="text-center col-sm-2"><div class="pretty p-switch">'+
                        ' <input '+status+' type="checkbox" name="switch1" data-value="'+d.rows[i].id+'" onchange="updateWorkTypeActive($(this))" />'+
                        '     <div class="state p-primary">'+
                        '         <label>&nbsp</label>'+
                        '     </div>'+
                        ' </div></td> '+
                        '<td class="text-center col-sm-1">'+
                        '	<span class="editWorkType glyphicon glyphicon-pencil" data-value="'+d.rows[i].id+'" aria-hidden="true" style="margin-right: 10px;"/>'+
                        '	<span class="deleteWorkType glyphicon glyphicon-remove" data-value="'+d.rows[i].id+'" aria-hidden="true"/>'+
                        '</td>'+
                        '</tr>';
                }
                $workTypeInfo.append(result);
                $('.loader').removeClass('action');
                $(".editWorkType").click(function(){
                    searchForWorkTypeUpdate($(this).attr("data-value"));
                });
                $(".deleteWorkType").click(function(){
                    var data = $(this).attr("data-value");
                    swal({
                            title: "ยืนยันการลบประเภทงาน",
                            text: "ต้องการลบประเภทงานนี้ ?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "ยืนยัน",
                            cancelButtonText: "ยกเลิก",
                            closeOnConfirm: false
                        },
                        function(isConfirm){
                            if (isConfirm) {
                                deleteWorkTypeFunction(data);
                            }
                        });
                });

            }else{
                toastr["error"](d.message,'แจ้งเตือน');
                $('.loader').removeClass('action');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $workTypeInfo.children().remove();
            $saveWorkTypeNew.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });

};
function updateWorkTypeActive(e){
    var paramActive = new Object();
    paramActive.id = e.attr('data-value');
    paramActive.active = e.prop('checked')?1:0;
    paramActive.method = 'updateWorkTypeActive';
    $.ajax({
        type: "PATCH",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramActive,
        success: function(d) {
            if(d.success){
                toastr["success"](d.message,'สำเร็จ');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function deleteWorkTypeFunction(id){
    var paramDelete = new Object;
    paramDelete.idDelete = id;
    paramDelete.method = 'deleteWorkType';
    $.ajax({
        type: "DELETE",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramDelete,
        success: function(d) {
            swal.close();
            if(d.success){
                searchWorkType();
                toastr["success"](d.message,'สำเร็จ');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            swal.close();
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function searchForWorkTypeUpdate(id){
    $('.loader').addClass('action');
    var paramUpdate = new Object;
    paramUpdate.id = id;
    paramUpdate.method = 'searchForWorkTypeUpdate';
    $.ajax({
        type: "POST",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramUpdate,
        success: function(d) {
            var data = d.rows;
            if(d.success){
                $workTypeIdEdit.val(data.id);
                $workTypeCodeEdit.val(data.work_type_code);
                $workTypeNameEdit.val(data.work_type_name);
                $editWorkTypeModel.modal('show');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
            }
            $('.loader').removeClass('action');
        },
        error: function (xhr, textStatus, errorThrown) {
            swal.close();
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function updateWorkType(){
    var paramUpdate = new Object;
    paramUpdate.id = $workTypeIdEdit.val();
    paramUpdate.workTypeCode = $workTypeCodeEdit.val();
    paramUpdate.workTypeName = $workTypeNameEdit.val();
    paramUpdate.method = 'updateWorkType';
    $.ajax({
        type: "PATCH",
        url: ADMIN.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramUpdate,
        success: function(d) {
            if(d.success){
                searchWorkType();
                $editWorkTypeModel.modal("hide");
                toastr["success"](d.message,'สำเร็จ');
            }else{
                $saveWorkTypeEdit.prop('disabled',false);
                toastr["error"](d.message,'แจ้งเตือน');
            };
        },
        error: function (xhr, textStatus, errorThrown) {
            $saveWorkTypeEdit.prop('disabled',false);
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });

};