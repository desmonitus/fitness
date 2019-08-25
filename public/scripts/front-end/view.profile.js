var PROFILE = {};
PROFILE.url = POONT.contextPath + '/profile';

function getHeight(element){
    var height = ($(window).height() - 115)+'px';
    if($(window).width() <= 600){
        height = '467px';
    }
    if($(window).width() <= 700){
        height = '';
    }
    element.css('height',height);
    element.css('max-height',height);
};
$( window ).resize(function() {
    getHeight($mainFrame);
});
$(document).ready(function() {
    POONT.loadingShow();
    Promise.all([init()]).then(function() {
        action();
        search();
    }, function() {
        console.log('error')
    });
});
function init(){
    $loader = $('.loader');
    $mainFrame = $('.main-frame');
    $userCode = $('#userCode');
    $username = $('#username');
    $firstName = $('#firstName');
    $lastName = $('#lastName');
    $birthday = $('#birthday');
    $email = $('#email');
    $phone = $('#phone');
    $position = $('#position');
    getHeight($mainFrame);
    $mainFrame.overlayScrollbars({ });
    $save = $('.save');
    buildDateField();
};
function action(){
    $save.click(function(){
        update();
    });
};
function buildDateField(){
    $birthday.bootstrapMaterialDatePicker({
        time : false,
        format : 'DD/MM/YYYY'
    });
}
function search(){
    var search = new Object();
    search.method = 'search';
    $.ajax({
        type: "POST",
        content: "application/json; charset=utf-8",
        url: PROFILE.url,
        dataType: "json",
        data : search,
        success: function(d) {
            if (d.success == true){
                var data = d.rows[0];
                $userCode.val(data.user_code);
                $username.val(data.username);
                $firstName.val(data.first_name);
                $lastName.val(data.last_name);
                $birthday.bootstrapMaterialDatePicker('setDate',new Date(data.birthday));
                $email.val(data.email);
                $phone.val(data.phone);
                $position.val(data.position);
            }else{
                toastr["error"](d.message,"แจ้งเตือน");
            }
        }
    });
};
function update(){
    var update = new Object();
    update.firstName = $firstName.val();
    update.lastName = $lastName.val();
    update.birthday = $birthday.val();
    update.email = $email.val();
    update.phone = $phone.val();
    update.position = $position.val();
    update.method = 'update';
    $.ajax({
        type: "PATCH",
        content: "application/json; charset=utf-8",
        url: PROFILE.url,
        dataType: "json",
        data : update,
        success: function(d) {
            if (d.success == true){
                toastr["success"](d.message,"สำเร็จ");
            }else{
                toastr["error"](d.message,"แจ้งเตือน");
            }
        }
    });
};