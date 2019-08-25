var REPORT = {};
REPORT.url = POONT.contextPath + '/report';
var menu;
var monthText = {'01':'Jan', '02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun','07':'Jul','08':'Aug','09':'Sep','10':'Oct','11':'Nov','12':'Dec'};
var monthThai = {'01':'มกราคม', '02':'กุมภาพันธ์','03':'มีนาคม','04':'เมษายน','05':'พฤษภาคม','06':'มิถุนายน','07':'กรกฎาคม','08':'สิงหาคม','09':'กันยายน','10':'ตุลาคม','11':'พฤศจิกายน','12':'ธันวาคม'};

function getHeight(element){
    var height = ($(window).height() - 115)+'px';
    if($(window).width() <= 600){
        height = '467px';
    }
    element.css('height',height);
    element.css('max-height',height);
};
$( window ).resize(function() {
    getHeight($leftFrame);
    getHeight($rightFrame);
});
$(document).ready(function() {
    POONT.loadingShow();
    Promise.all([init()]).then(function() {
        action();
    }, function() {
        console.log('error')
    });
});
function init(){
    $loader = $('.loader');
    $leftFrame = $('.left-frame');
    $rightFrame = $('.right-frame');
    $userYearInfo = $('.userYearInfo');
    $workPointInfo = $('.workPointInfo');
    $workPointDateInfo = $('.workPointDateInfo');
    $search = $('.search');
    $yearTitle = $('.yearTitle');
    $navigate = $('.navigate');
    $navigateOne = $('.navigateOne');
    $navigateTwo = $('.navigateTwo');
    $navigateThree = $('.navigateThree');
    $rightFrame.overlayScrollbars({ });
    $pageOne = $('.pageOne');
    $pageTwo = $('.pageTwo');
    $pageThree = $('.pageThree');
    $changePage = $('.changePage');
    $userTitle = $('.userTitle');
    $selectMonth = $('.selectMonth');
    $dayHeader = $('.dayHeader');
    $setHeadYear = $('.setHeadYear');
    buildCombobox();
    getHeight($leftFrame);
    getHeight($rightFrame);

    menu = [{id:0,el:$pageOne},{id:1,el:$pageTwo},{id:2,el:$pageThree}];
};
function action(){
    $search.click(function(){
        selectPage(0);
        $navigateTwo.text(null);
        $navigateThree.text(null);
        if(!_.isEmpty($.combobox.getValue('year'))){
            $navigateOne.text('รายงานสรุปผลประจำปี '+$.combobox.getDesc('year'));
            getAllUser();
        }else{
            toastr["error"]("กรุณาเลือกปีที่ต้องการค้นหาค่ะ",'แจ้งเตือน');
        }
    });
    $navigateOne.click(function(){
        $navigateTwo.text(null);
        $navigateThree.text(null);
        selectPage(0);
    });
    $navigateTwo.click(function(){
        $navigateThree.text(null);
        selectPage(1);
    });
    $selectMonth.click(function(){
        $loader.addClass('action');
        $navigateThree.text(' > รายงานสรุปผมประจำเดือน'+monthThai[$(this).attr('data-month')]);
        selectPage(2);
        setWorkTypeHeader($(this).attr('data-user'),$.combobox.getValue('year'),$(this).attr('data-month'));
    });
};
function selectPage(id){
    $changePage.addClass('hide');
    var result = _.find(menu,{id:_.toNumber(id)});
    result.el.removeClass('hide');
}
function buildCombobox(){
    $.combobox.build({
        id: "year",
        placeholder: "กรุณาเลือกปี",
        method: "searchYear",
        type: "POST"
    });
}
function getAllUser(){
    $loader.addClass('action');
    $userYearInfo.children().remove();
    var param = new Object();
    param.year = $.combobox.getValue('year');
    $yearTitle.text(param.year);
    param.method = 'getAllUser';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                var result = '';
                for(var i = 0;i<data.length;i++){
                    var name = data[i].user_code;
                    if(!_.isEmpty(data[i].first_name)||!_.isEmpty(data[i].last_name)){
                        if(!_.isEmpty(data[i].first_name)){
                            name = data[i].first_name;
                        }
                        if(!_.isEmpty(data[i].last_name)){
                            name += "  "+data[i].last_name;
                        }
                    }
                    result += '<tr>'+
                                '<th class="text-center"><span class="userNameChoose" data-id="'+data[i].user_code+'">'+name+'</span></th>'+
                                '<td class="'+(data[i].user_code+param.year+'01')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'02')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'03')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'04')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'05')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'06')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'07')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'08')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'09')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'10')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'11')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+param.year+'12')+' empty">-</td>'+
                                '<td class="'+(data[i].user_code+'total')+'">-</td>'+
                            '</tr>';
                };
                result += '<tr>'+
                    '<th class="text-center">Total</th>'+
                    '<td class="total'+param.year+'01 empty">-</td>'+
                    '<td class="total'+param.year+'02 empty">-</td>'+
                    '<td class="total'+param.year+'03 empty">-</td>'+
                    '<td class="total'+param.year+'04 empty">-</td>'+
                    '<td class="total'+param.year+'05 empty">-</td>'+
                    '<td class="total'+param.year+'06 empty">-</td>'+
                    '<td class="total'+param.year+'07 empty">-</td>'+
                    '<td class="total'+param.year+'08 empty">-</td>'+
                    '<td class="total'+param.year+'09 empty">-</td>'+
                    '<td class="total'+param.year+'10 empty">-</td>'+
                    '<td class="total'+param.year+'11 empty">-</td>'+
                    '<td class="total'+param.year+'12 empty">-</td>'+
                    '<td class="total'+param.year+'">-</td>'+
                    '</tr>';
                $userYearInfo.append(result);
                getAllPoint();
                $('.userNameChoose').click(function(){
                    $loader.addClass('action');
                    $userTitle.text($(this).text());
                    $navigateTwo.text(' > รายงานตามประเภทของงาน');
                    getAllWorkType($(this).attr('data-id'));
                    selectPage(1);
                });
            }else{
                $loader.removeClass('action');
                console.log('error')
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getAllPoint(){
    var param = new Object();
    param.year = $.combobox.getValue('year');
    param.method = 'getAllPoint';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                var userArray = [];
                for(var i = 0;i<data.length;i++){
                    $('.'+data[i]._id.user+data[i]._id.month).text(data[i].sum);
                    $('.'+data[i]._id.user+data[i]._id.month).removeClass('empty');
                }
                getAllTotalPoint(param.year);
            }else{
                console.log('error');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getAllTotalPoint(year){
    var param = new Object();
    param.year = year;
    param.method = 'getAllTotalPoint';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                var userArray = [];
                for(var i = 0;i<data.length;i++){
                    $('.'+data[i]._id.user+'total').text(data[i].total);
                }
                getMonthTotal(year)
            }else{
                console.log('error');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getMonthTotal(year){
    var param = new Object();
    param.year = year;
    param.method = 'getMonthTotal';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            $loader.removeClass('action');
            if(d.success){
                var data = d.rows;
                var userArray = [];
                var total = 0;
                for(var i = 0;i<data.length;i++){
                    $('.total'+data[i]._id.month).text(data[i].total);
                    $('.total'+data[i]._id.month).removeClass('empty');
                    total += _.toNumber(data[i].total);
                }
                $('.total'+year).text(total);
            }else{
                console.log('error');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getAllWorkType(id){
    $workPointInfo.children().remove();
    var param = new Object();
    param.user = id;
    param.year = $.combobox.getValue('year');
    param.method = 'getAllWorkType';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                var result = '';
                for(var i = 0;i<data.length;i++) {
                    result += '<tr>' +
                        '<td class="text-center">' + data[i].typeName[0].work_type_code + '</td>' +
                        '<td>' + data[i].typeName[0].work_type_name + '</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '01') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '02') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '03') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '04') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '05') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '06') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '07') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '08') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '09') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '10') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '11') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + param.year + '12') + ' empty">-</td>' +
                        '<td class="' + (data[i]._id.type + 'total') + '">-</td>' +
                        '</tr>';
                };
                result += '<tr>' +
                    '<th class="text-center" colspan="2">Total</th>' +
                    '<td class="totalType' + param.year + '01 empty">-</td>' +
                    '<td class="totalType' + param.year + '02 empty">-</td>' +
                    '<td class="totalType' + param.year + '03 empty">-</td>' +
                    '<td class="totalType' + param.year + '04 empty">-</td>' +
                    '<td class="totalType' + param.year + '05 empty">-</td>' +
                    '<td class="totalType' + param.year + '06 empty">-</td>' +
                    '<td class="totalType' + param.year + '07 empty">-</td>' +
                    '<td class="totalType' + param.year + '08 empty">-</td>' +
                    '<td class="totalType' + param.year + '09 empty">-</td>' +
                    '<td class="totalType' + param.year + '10 empty">-</td>' +
                    '<td class="totalType' + param.year + '11 empty">-</td>' +
                    '<td class="totalType' + param.year + '12 empty">-</td>' +
                    '<td class="totalType">-</td>' +
                    '</tr>';
                $workPointInfo.append(result);
                $selectMonth.attr('data-user',id);
                getWorkTypePoint(id);
            }else{
                console.log('error')
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getWorkTypePoint(id){
    var param = new Object();
    param.user = id;
    param.year = $.combobox.getValue('year');
    param.method = 'getWorkTypePoint';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                for(var i = 0;i<data.length;i++){
                    $('.'+data[i]._id.type+data[i]._id.month).text(data[i].sum);
                    $('.'+data[i]._id.type+data[i]._id.month).removeClass('empty');
                }
                getWorkTypeTotalPoint(id,param.year);
            }else{
                console.log('error')
                $loader.removeClass('action');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getWorkTypeTotalPoint(id,year){
    var param = new Object();
    param.user = id;
    param.year = year;
    param.method = 'getWorkTypeTotalPoint';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                for(var i = 0;i<data.length;i++){
                    $('.'+data[i]._id.type+'total').text(data[i].total);
                }
                getTypeMonthTotal(id,year);
            }else{
                console.log('error')
                $loader.removeClass('action');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getTypeMonthTotal(id,year){
    var param = new Object();
    param.user = id;
    param.year = year;
    param.method = 'getTypeMonthTotal';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            $loader.removeClass('action');
            if(d.success){
                var data = d.rows;
                var total = 0;
                for(var i = 0;i<data.length;i++){
                    $('.totalType'+data[i]._id.month).text(data[i].total);
                    $('.totalType'+data[i]._id.month).removeClass('empty');
                    total += _.toNumber(data[i].total);
                }
                $('.totalType').text(total);

            }else{
                console.log('error')
                $loader.removeClass('action');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
var getDaysArray = function(year, month) {
    var date = new Date(year, month - 1, 1);
    var result = [];
    while (date.getMonth() == month - 1) {
        result.push(date.getDate());
        date.setDate(date.getDate() + 1);
    }
    return result;
};
function setWorkTypeHeader(id,year,month){
    var dateArray = getDaysArray(year,month);
    $dayHeader.children().remove();
    $setHeadYear.text(monthText[month.toString()]+'-'+year);
    $setHeadYear.attr('colspan',dateArray.length);
    var result = '<th class="text-center">Code</th><th class="text-center">Work</th>';
    for(var i = 0;i<dateArray.length;i++){
        result += '<th class="text-center">'+_.padStart(dateArray[i],2,'0')+'</th>';
    };
    $dayHeader.append(result);
    getAllDateWorkType(id,year,month,dateArray);
}
function getAllDateWorkType(id,year,month,dateArray){
    $workPointDateInfo.children().remove();
    var param = new Object();
    param.user = id;
    param.month = month;
    param.year = year;
    param.method = 'getAllDateWorkType';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                var result = '';
                for(var i = 0;i<data.length;i++) {
                    result += '<tr>' +
                        '<td class="text-center">' + data[i].typeName[0].work_type_code + '</td>' +
                        '<td>' + data[i].typeName[0].work_type_name + '</td>';
                        for(var j = 0;j<dateArray.length;j++){
                            result += '<td class="' + (data[i]._id.type + param.year + param.month + _.padStart(dateArray[j],2,'0')) + ' empty">-</td>';
                        }
                    result += '<td class="' + (data[i]._id.type + param.year + param.month) +'total">-</td>' +
                        '</tr>';
                };
                result += '<tr><th class="text-center" colspan="2">Total</th>';
                    for(var j = 0;j<dateArray.length;j++){
                        result += '<td class="total' + year+month+ _.padStart(dateArray[j],2,'0') + ' empty">-</td>';
                    }
                result += '<td class="totalAllDay">-</td>' +
                    '</tr>';
                $workPointDateInfo.append(result);
                getWorkTypeMonthPoint(id,year,month);
            }else{
                console.log('error')
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getWorkTypeMonthPoint(id,year,month){
    var param = new Object();
    param.user = id;
    param.month = month;
    param.year = year;
    param.method = 'getWorkTypeMonthPoint';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                for(var i = 0;i<data.length;i++){
                    $('.'+data[i]._id.type+data[i]._id.day).text(data[i].sum);
                    $('.'+data[i]._id.type+data[i]._id.day).removeClass('empty');
                }
                getWorkTypeMonthTotalPoint(id,year,month);
            }else{
                console.log('error')
                $loader.removeClass('action');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getWorkTypeMonthTotalPoint(id,year,month){
    var param = new Object();
    param.user = id;
    param.month = month;
    param.year = year;
    param.method = 'getWorkTypeMonthTotalPoint';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            if(d.success){
                var data = d.rows;
                for(var i = 0;i<data.length;i++){
                    $('.'+data[i]._id.type+year+month+'total').text(data[i].total);
                }
                getDayTotalPoint(id,year,month)
            }else{
                console.log('error')
                $loader.removeClass('action');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};
function getDayTotalPoint(id,year,month){
    var param = new Object();
    param.user = id;
    param.month = month;
    param.year = year;
    param.method = 'getDayTotalPoint';
    $.ajax({
        type: "POST",
        url: REPORT.url,
        content: "application/json; charset=utf-8",
        dataType: "json",
        data: param,
        success: function(d) {
            $loader.removeClass('action');
            if(d.success){
                var data = d.rows;
                var total = 0;
                for(var i = 0;i<data.length;i++){
                    $('.total'+data[i]._id.day).text(data[i].total);
                    $('.total'+data[i]._id.day).removeClass('empty');
                    total += _.toNumber(data[i].total);
                }
                $('.totalAllDay').text(total);
            }else{
                console.log('error')
                $loader.removeClass('action');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $loader.removeClass('action');
            toastr["error"](xhr.responseJSON.description,'แจ้งเตือน');
        }
    });
};