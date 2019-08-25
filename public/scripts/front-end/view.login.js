var LOGIN = {};
LOGIN.url = POONT.contextPath + '/login';
$(document).ready(function() {
    Promise.all([init()]).then(function() {
        action();
    }, function() {
        console.log('error')
    });
});
function init(){
    $username = $('input[name=username]');
    $password = $('input[name=password]');
    $submit = $('.submit');
};
function action(){
    $submit.click(function(){
        if(checkBeforeSave()){
            login();
        }else{
            toastr["error"]("กรุณากรอกข้อมูลให้ครบทุกช่อง","แจ้งเตือน");
        }
    });
    $('input').keyup(function(e){
        if(e.keyCode==13){
            if(checkBeforeSave()){
                login();
            }else{
                toastr["error"]("กรุณากรอกข้อมูลให้ครบทุกช่อง","แจ้งเตือน");
            }
        }
    });
};
function checkBeforeSave(){
    return !POONT.isEmpty($username.val())&&!POONT.isEmpty($password.val());
}
function login(){
    var login = new Object();
    login.username = $username.val();
    login.password = $password.val();
    $.ajax({
        type: "POST",
        content: "application/json; charset=utf-8",
        url: LOGIN.url,
        dataType: "json",
        data: login,
        success: function(d) {
            if (d.success == true){
                window.location = '/';
            }else{
                toastr["error"](d.message,"แจ้งเตือน");
            }
        }
    });
}