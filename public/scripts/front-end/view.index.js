var INDEX = {};
INDEX.url = POONT.contextPath + '/';
var menu;
var searchAjax = null;
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
    }, function() {
        console.log('error')
    });
});
function init(){
    $leftBox = $('.leftBox');
    $rightBox = $('.rightBox');
    $selectMenu = $('.select-menu');
    $mainPanel = $('.main-panel');
    $menuAddUser = $('.menu-add-user');
    $menuDailyPayment = $('.menu-daily-payment');
    $menuRenew = $('.menu-renew');
    $menuMember = $('.menu-member');
    $menuIncome = $('.menu-income');
    $menuMemberInfo = $('.menu-member-info');
    $menuHistory = $('.menu-history');
    $firstNameAddMember = $('#firstNameAddMember');
    $lastNameAddMember = $('#lastNameAddMember');
    $nickNameAddMember = $('#nickNameAddMember');
    $birthdayAddMember = $('#birthdayAddMember');
    $saveAddMember = $('.saveAddMember');
    $nickNamePayment = $('#nickNamePayment');
    $amountPayment = $('#amountPayment');
    $expirePayment = $('#expirePayment');
    $payPayment = $('.payPayment');
    $paidPaymentModal = $('#paidPaymentModal');
    $returnPaymentModal = $('#returnPaymentModal');
    $amountPaymentModal = $('#amountPaymentModal');
    $packagePaymentModal = $('#packagePaymentModal');
    $amountPaymentModalValue = $('#amountPaymentModalValue');
    $paymentModal = $('.paymentModal');
    $numberBtn = $('.numberBtn');
    $insertRing = $('.insertRing');
    $paid = $('.paid');
    $billModal = $('.billModal');
    $billOrgName = $('#billOrgName');
    $billTranNo = $('#billTranNo');
    $billTranDate = $('#billTranDate');
    $billFirstName = $('#billFirstName');
    $billStatus = $('#billStatus');
    $billPackageDesc = $('#billPackageDesc');
    $billPackageAmount = $('#billPackageAmount');
    $billExpireDate = $('#billExpireDate');
    $billNetAmount = $('#billNetAmount');
    $billPaid = $('#billPaid');
    $billReturn = $('#billReturn');
    $historyInfo = $('.historyInfo');
    $incomeInfo = $('.incomeInfo');
    $memberInfo = $('.memberInfo');
    getHeight($leftBox);
    getHeight($rightBox);
    $leftBox.overlayScrollbars({ });
    $rightBox.overlayScrollbars({ });
    $paidPaymentModal.autoNumeric('init',{mDec:0})
    $paidPaymentModal.keyup(function(){
        calPayment();
    });
    $numberBtn.click(function(){
        var old = $paidPaymentModal.autoNumeric('get')
        var press = $(this).attr('data-value');
        if(press=='C'){
            $paidPaymentModal.val(null);
            calPayment();
        }else if(press=='EQ'){
            $paidPaymentModal.autoNumeric('set',Number($amountPaymentModalValue.val()));
            calPayment();
        }else{
            $paidPaymentModal.autoNumeric('set',old+press);
            calPayment();
        }
    });
    $paid.click(function(){
        if(!POONT.isEmpty($paidPaymentModal.autoNumeric('get'))){
            if(Number($paidPaymentModal.autoNumeric('get'))>=Number($amountPaymentModalValue.val())){
                $(this).attr('disabled',true);
                $insertRing.css('display','inline-block');
                payPackage();
            }else{
                toastr["error"]('จำนวนเงินที่ชำระน้อยกว่ายอดที่ต้องชำระค่ะ','แจ้งเตือน');
            }
        }else{
            toastr["error"]('จำนวนเงินที่ชำระน้อยกว่ายอดที่ต้องชำระค่ะ','แจ้งเตือน');
        }
    })
    menu = [{id:0, el:$menuAddUser},
            {id:1, el:$menuDailyPayment},
            {id:2, el:$menuRenew},
            {id:3, el:$menuMember},
            {id:4, el:$menuIncome},
            {id:5, el:$menuMemberInfo},
            {id:6, el:$menuHistory}
           ];
    buildCombobox();
    buildDateField();
};
function action(){
    $selectMenu.click(function(){
        $mainPanel.addClass('hide');
        $selectMenu.removeClass('action');
        $(this).addClass('action');
        var index = $(this).attr('data-index');
        selectPage(index);
    })
    $saveAddMember.click(function(){
        if(checkBeforAddMember()){
            $(this).attr('disabled',true);
            addNewMember();
        //     swal({
        //             title: "ยืนยัน" ,
        //             text: "ยืนยันการสมัคร?",
        //             type: "warning",
        //             showCancelButton: true,
        //             confirmButtonClass: "btn-danger",
        //             confirmButtonText: "ยืนยัน",
        //             cancelButtonText: "ยกเลิก",
        //             closeOnConfirm: false
        //         },
        //         function(isConfirm){
        //             if (isConfirm) {
        //             }
        //         });
        }else{
            toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
        }
    });
    $payPayment.click(function(){
        if(checkBeforPaid()){
            var result = _.find(storage.packagePayment,{code:_.toNumber($.combobox.getValue('packagePayment'))});
            if(!POONT.isEmpty(result)){
                $packagePaymentModal.val($.combobox.getDesc('packagePayment'));
                $amountPaymentModal.text($.number(_.toNumber(result.data.amount),0));
                $amountPaymentModalValue.val(_.toNumber(result.data.amount));
                $paymentModal.modal('show');
            }
        }else{
            toastr["error"]('กรุณากรอกข้อมูลในช่อง * ให้ครบด้วยค่ะ','แจ้งเตือน');
        }
    });
    $paymentModal.on('hidden.bs.modal', function (e) {
        // clearPaymentForm();
        $paidPaymentModal.val(null);
        $returnPaymentModal.text(0);
    });
};
function calPayment(){
    var amount = Number($amountPaymentModalValue.val());
    var pay = $paidPaymentModal.autoNumeric('get');
    var returnVal = 0;
    if(!POONT.isEmpty(pay)){
        returnVal = Number(pay) - amount;
    }
    if(returnVal<0){
        returnVal = 0;
    }
    $returnPaymentModal.text($.number(_.toNumber(returnVal),0));

};
function selectPage(index){
    var result = _.find(menu,{id:_.toNumber(index)});
    if(!POONT.isEmpty(result)){
        result.el.removeClass('hide');
    }
    index = _.toNumber(index);
    if(index==3){
        searchMember();
    }else if(index==4){
        searchIncome();
    }else if(index==6){
        searchHistory();
    }
};
function buildCombobox(){
    $.combobox.build({
        id:"memberCodePayment",
        label: "รหัสสมาชิก <span style='color:red;'> *</span>",
        placeholder: "กรุณาเลือกสมาชิก",
        method: "searchMember",
        type : "POST",
        selected  : function(data){
            if(!POONT.isEmpty(data)){
                var res = data[0].data;
                $nickNamePayment.val(res.nick_name);
            }
        },
        blur : function(){
            if(POONT.isEmpty($.combobox.getValue('memberCodePayment'))){
                console.log('Empty');
                $nickNamePayment.val(null);
            }
        },
        keypress : function(data,val){
            if(!POONT.isEmpty(data)){
            data = _.filter(data,function(obj){
              return  obj.data.nick_name.toString().toLowerCase().match(val);
            })

            var result = '';
            $('#memberCodePaymentlist>li').remove();
            if (data.length > 0) {
                result = '';
                for (var i = 0; i < data.length; i++) {
                    var name = '';
                    if (POONT.getCookie('linId') == "en") {
                        name = data[i].descriptionEn;
                    } else {
                        name = data[i].descriptionTh;
                    }
                    result = result + '<li><a code="' + data[i]["code"] + '" style="cursor:pointer; border-bottom:1px solid #eaeaea;">' + name + '</a></li>';
                }
                $('#memberCodePaymentlist').append(result);
                $('#memberCodePaymentlist>li>a').click(function () {
                    if ($('#memberCodePayment').attr('showDescription') == 'true') {
                        $('#memberCodePayment>.selectedCombobox').val($(this).attr('code'));
                        $('#memberCodePaymentDescription').val($(this).text());
                    } else {
                        $('#memberCodePayment>.selectedCombobox').val($(this).text());
                    }
                    $('#memberCodePaymentCode').val($(this).attr('code'));
                    if ($('#memberCodePayment>.selectedCombobox').parent().dropdown().hasClass('open')) {
                        $('#memberCodePayment>.selectedCombobox').parent().dropdown().removeClass('open')
                    }
                    var d = _.find(storage.memberCodePayment,{code:Number($(this).attr('code'))});
                    if(!POONT.isEmpty(d)){
                        var res = d.data;
                        $nickNamePayment.val(res.nick_name);
                    }
                });
            }
            if (!$('#memberCodePayment>.selectedCombobox').parent().dropdown().hasClass('open')) {
                $('#memberCodePayment>.selectedCombobox').dropdown('toggle');
            } else {
                $('#memberCodePayment>.selectedCombobox').parent().dropdown().removeClass('open')
            }
        }
    }
    });
    $.combobox.build({
        id:"packageAddMember",
        label: "Package <span style='color:red;'> *</span>",
        placeholder: "กรุณาเลือก Package",
        method: "searchPackage",
        type : "POST"
    });
    $.combobox.build({
        id:"packagePayment",
        label: "Package <span style='color:red;'> *</span>",
        placeholder: "กรุณาเลือก Package",
        method: "searchPackage",
        type : "POST",
        selected  : function(data){
            if(!POONT.isEmpty(data)){
                var res = data[0].data;
                $amountPayment.val($.number(res.amount,0));
                if(res.package_type=="D"){
                    $expirePayment.val(moment().add(0, 'days').format('DD/MM/YYYY'));
                }else if(res.package_type=="M"){
                    $expirePayment.val(moment().add(30, 'days').format('DD/MM/YYYY'));
                }else if(res.package_type=="Y"){
                    $expirePayment.val(moment().add(1, 'years').format('DD/MM/YYYY'));
                }else{
                    console.log('error');
                }
            }
        },
        blur : function(){
            if(POONT.isEmpty($.combobox.getValue('packagePayment'))){
                console.log('Empty');
                $amountPayment.val(null);
                $expirePayment.val(null);
            }
        }
    });
};
function buildDateField(){
    $birthdayAddMember.bootstrapMaterialDatePicker({
        time : false,
        format : 'DD/MM/YYYY'
    });
}
function checkBeforAddMember(){
    return !POONT.isEmpty($nickNameAddMember.val())&&!POONT.isEmpty($.combobox.getValue('packageAddMember'));
}
function checkBeforPaid(){
    return !POONT.isEmpty($.combobox.getValue('memberCodePayment'))&&!POONT.isEmpty($.combobox.getValue('packagePayment'));
}
function clearAddMemberForm(){
    $firstNameAddMember.val(null);
    $lastNameAddMember.val(null);
    $nickNameAddMember.val(null);
    $birthdayAddMember.val(null);
    $.combobox.clear('packageAddMember');
    $saveAddMember.attr('disabled',false);
};
function clearPaymentForm(){
    $.combobox.clear('memberCodePayment');
    $.combobox.clear('packagePayment');
    $nickNamePayment.val(null);
    $amountPayment.val(null);
    $expirePayment.val(null);
    $insertRing.hide();
    $paid.attr('disabled',false);
}
function payPackage(){
    var payParam = new Object();
    payParam.memId = $.combobox.getValue('memberCodePayment');
    payParam.packageId = $.combobox.getValue('packagePayment');
    payParam.amount = $paidPaymentModal.autoNumeric('get');
    payParam.method = 'paymentTransaction';
    $.ajax({
        type: "PUT",
        url: INDEX.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: payParam,
        success: function(d) {
            if(d.success){
                showbill(d.transNo);
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
}
function addNewMember(){
    $('.loader').addClass('action');
    var paramAddNewMember = new Object;
    paramAddNewMember.firstName = $firstNameAddMember.val();
    paramAddNewMember.lastName = $lastNameAddMember.val();
    paramAddNewMember.nickName = $nickNameAddMember.val();
    paramAddNewMember.birthday = $birthdayAddMember.val();
    paramAddNewMember.method = 'addNewMember';
    $.ajax({
        type: "PUT",
        url: INDEX.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: paramAddNewMember,
        success: function(d) {
            if(d.success){
                toastr["success"](d.message,'สำเร็จ');
                $.combobox.render({
                    id:"memberCodePayment",
                    method: "searchMember",
                    type : "POST",
                    loaded : function(comboboxdata){
                        $mainPanel.addClass('hide');
                        $selectMenu.removeClass('action');
                        $('.select-menu[data-index=1]').addClass('action');
                        $.combobox.setValue('memberCodePayment',d.id);
                        $.combobox.setValue('packagePayment',$.combobox.getValue('packageAddMember'));
                        $nickNamePayment.val(paramAddNewMember.nickName);
                        var packageData = _.find(storage.packageAddMember,{code : _.toNumber($.combobox.getValue('packageAddMember'))});
                        if(!POONT.isEmpty(packageData)){
                            $amountPayment.val($.number(packageData.data.amount,0));
                            if(packageData.data.package_type=="D"){
                                $expirePayment.val(moment().add(1,'days').format('DD/MM/YYYY'))
                            }else if(packageData.data.package_type=="M"){
                                $expirePayment.val(moment().add(30,'days').format('DD/MM/YYYY'))
                            }else if(packageData.data.package_type=="Y"){
                                $expirePayment.val(moment().add(1,'years').format('DD/MM/YYYY'))
                            }else{
                                console.log('error');
                            }
                        }
                        $('.loader').removeClass('action');
                        selectPage(1);
                        $saveAddMember.attr('disabled',false);
                        clearAddMemberForm();
                    }
                });
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
function showbill(transNo){
    var billParam = new Object();
    billParam.transNo = transNo;
    billParam.method = 'showbill';
    $.ajax({
        type: "POST",
        url: INDEX.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: billParam,
        async: false,
        success: function(d) {
            if(d.success){
                var status = "<font> ปกติ</font>";
                if(d.rows.billStatus == "C"){
                    status = "<font color='red'> ยกเลิก</font>";
                }
                $billOrgName.text(d.rows.billOrgName);
                $billTranNo.text('#'+d.rows.billTranNo);
                $billTranDate.text('วันที่ทำรายการ : '+moment(d.rows.billTranDate).format('DD/MM/YYYY'));
                $billFirstName.text(' '+d.rows.billFirstName);
                $billStatus.html(status);
                $billPackageDesc.text(d.rows.billPackageDesc);
                $billPackageAmount.text($.number(d.rows.billPackageAmount,0)+' บาท');
                $billExpireDate.text(moment(d.rows.billExpireDate).format('DD/MM/YYYY')+' )');
                $billNetAmount.text($.number(d.rows.billNetAmount,0)+' บาท');
                $billPaid.text($.number(d.rows.billPaid,0)+' บาท');
                $billReturn.text($.number(d.rows.billReturn,0)+' บาท');
                $billModal.modal('show');
                clearPaymentForm();
                $paymentModal.modal('hide');
                $('.loader').removeClass('action');
            }else{
                toastr["error"](d.message,'แจ้งเตือน');
                $('.loader').removeClass('action');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            swal.close();
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
}
function searchHistory(){
    $('.loader').addClass('action');
    var historySearchParam = new Object();
    historySearchParam.method = 'searchHistory';
    $.ajax({
        type: "POST",
        url: INDEX.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: historySearchParam,
        success: function(d) {
            if(d.success){
                var result = '';
                var index = d.rows.length;
                for(var i =0;i<index;i++){
                    var status = '';
                    var disable = ''
                    if(d.rows[i].status == "C"){
                        status = '<font color="red"> (ยกเลิก)</font>';
                        disable = 'disabled';
                    }
                    result += '<tr>'+
                        '<td class="col-sm-3 selectBill" style="cursor:pointer;padding-left: 10px;" data-value="'+d.rows[i].transNo+'"><a>'+d.rows[i].transNo+'</a>'+status+'</td>'+
                        '<td class="text-center col-sm-2">'+moment(d.rows[i].transDate).format('DD/MM/YYYY')+'</td>'+
                        '<td class="text-center col-sm-3">'+d.rows[i].packageData[0].name+'</td>'+
                        '<td class="text-center col-sm-2">'+d.rows[i].memberData[0].nick_name+'</td>'+
                        '<td class="text-center col-sm-2"><button class="btn btn-danger cancelBtn" '+disable+' data-value="'+d.rows[i].id+'">ยกเลิก</button></td>'+
                        '</tr>';
                }
                $historyInfo.children().remove();
                $historyInfo.append(result);
                $('.loader').removeClass('action');
                $('.selectBill').click(function(){
                   var id = $(this).attr('data-value');
                    $('.loader').addClass('action');
                   showbill(id);
                });
                $(".cancelBtn").click(function(){
                    var id = $(this).attr('data-value');
                    swal({
                        title: "ยืนยัน" ,
                        text: "ยืนยันการยกเลิก?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "ยืนยัน",
                        cancelButtonText: "ยกเลิก",
                        closeOnConfirm: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            cancelPayment(id);
                        }
                    });
                })
            }else{
                $('.loader').removeClass('action');
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $('.loader').removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
}
function cancelPayment(id) {
    POONT.loadingShow();
    var cancelParam = new Object();
    cancelParam.id = id;
    cancelParam.method = 'cancelPayment';
    $.ajax({
        type: "PATCH",
        url: INDEX.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: cancelParam,
        success: function (d) {
            POONT.loadingHide();
            if(d.success){
                searchHistory();
                toastr["success"](d.message, 'สำเร็จ');
            }else{
                toastr["error"](d.message, 'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            toastr["error"](xhr.responseJSON.description, 'แจ้งเตือน');
        }
    });
};
function searchIncome(){
    $('.loader').addClass('action');
    var incomeSearchParam = new Object();
    incomeSearchParam.method = 'searchIncome';
    $.ajax({
        type: "POST",
        url: INDEX.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: incomeSearchParam,
        success: function(d) {
            if(d.success){
                var result = '';
                var index = d.rows.length;
                for(var i =0;i<index;i++){
                    var amt = '';
                    if(!POONT.isEmpty(d.rows[i].in_amt)){
                        amt = '<span style="color:green;">+ '+$.number(d.rows[i].in_amt,0)+'</span>';
                    }else{
                        amt = '<span style="color:red;">- '+$.number(d.rows[i].out_amt)+'</span>';
                    }
                    result += '<tr>'+
                        '<td class="col-sm-3 text-center selectBillIncome" style="cursor:pointer;padding-left: 10px;" data-value="'+d.rows[i].transNo+'"><a>'+d.rows[i].transNo+'</a></td>'+
                        '<td class="text-center col-sm-3">'+moment(d.rows[i].transDate).format('DD/MM/YYYY')+'</td>'+
                        '<td class="text-right col-sm-3">'+amt+'</td>'+
                        '<td class="text-right col-sm-3">'+$.number(d.rows[i].balance)+'</td>'+
                        '</tr>';
                }
                $incomeInfo.children().remove();
                $incomeInfo.append(result);
                $('.loader').removeClass('action');
                $('.selectBillIncome').click(function(){
                    var id = $(this).attr('data-value');
                    $('.loader').addClass('action');
                    showbill(id);
                });
                $(".cancelBtn").click(function(){
                    var id = $(this).attr('data-value');
                    swal({
                            title: "ยืนยัน" ,
                            text: "ยืนยันการยกเลิก?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "ยืนยัน",
                            cancelButtonText: "ยกเลิก",
                            closeOnConfirm: true
                        },
                        function(isConfirm){
                            if (isConfirm) {
                                cancelPayment(id);
                            }
                        });
                })
            }else{
                $('.loader').removeClass('action');
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $('.loader').removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};

function searchMember(){
    $('.loader').addClass('action');
    var memberSearchParam = new Object();
    memberSearchParam.method = 'searchMember';
    $.ajax({
        type: "POST",
        url: INDEX.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: memberSearchParam,
        success: function(d) {
            if(d.success){
                var result = '';
                var index = d.rows.length;
                for(var i =0;i<index;i++){
                    var name = '-';
                    var exp = '-';
                    if(!POONT.isEmpty(d.rows[i].firstName)){
                        name = d.rows[i].firstName;
                        if(!POONT.isEmpty(d.rows[i].lastName)){
                            name += d.rows[i].lastName;
                        }
                    }
                    if(d.rows[i].expire[0].status == 1){
                        exp = moment(d.rows[i].expire[0].exp_date).format('DD/MM/YYYY')
                    }

                    result += '<tr>'+
                        '<td class="col-sm-3 text-center selectMemberCode" style="cursor:pointer;" data-value="'+d.rows[i].memId+'"><a>'+d.rows[i].memCode+'</a></td>'+
                        '<td class="col-sm-3">'+name+'</td>'+
                        '<td class="text-center col-sm-3">'+d.rows[i].nickName+'</td>'+
                        '<td class="text-center col-sm-3">'+exp+'</td>'+
                        '</tr>';
                }
                $memberInfo.children().remove();
                $memberInfo.append(result);
                $('.loader').removeClass('action');
                $('.selectMemberCode').click(function(){
                    var id = $(this).attr('data-value');
                    $('.loader').addClass('action');
                    console.log(id)
                    // showbill(id);
                });
                $(".cancelBtn").click(function(){
                    var id = $(this).attr('data-value');
                    swal({
                            title: "ยืนยัน" ,
                            text: "ยืนยันการยกเลิก?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "ยืนยัน",
                            cancelButtonText: "ยกเลิก",
                            closeOnConfirm: true
                        },
                        function(isConfirm){
                            if (isConfirm) {
                                cancelPayment(id);
                            }
                        });
                })
            }else{
                $('.loader').removeClass('action');
                toastr["error"](d.message,'แจ้งเตือน');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $('.loader').removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};