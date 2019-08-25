var key = "";
var POONT = {
	isEmpty : function(v){
    return v === null || v === undefined || v === '' || ($.isArray(v) && !v.length) || ($.isFunction(v.size) && v.size() === 0 );
	},
	isFunction : function(functionToCheck) {
		 return typeof functionToCheck !== "undefined" && typeof functionToCheck === "function" ;
	},
	getCurrentDay : function(){
		var today = new Date();
	    var dd = today.getDate();
	    var mm = today.getMonth()+1;
	    var yyyy = today.getFullYear();
	    if(dd<10){
	        dd='0'+dd;
	    } 
	    if(mm<10){
	        mm='0'+mm;
	    } 
	    var today = mm+'/'+dd+'/'+yyyy;
	    return today;
	},
	getTime : function(){
		var today = new Date();
		return today.getHours()+':'+today.getMinutes();
	},
  	addMonths : function (date, months) {
		date.setMonth(date.getMonth() + months);
		return date;
	},
	logout: function(){
		window.location = application.contextPath + '/logout';
		window.close();
	},
	getURLParameter : function(sParam) {
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++)
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam)
	        {
	            return decodeURIComponent(sParameterName[1]);
	        }
	    }
	},
	setCookie : function(cname, cvalue) {
	    document.cookie = cname + "=" + cvalue + "; ";
	},
	getCookie : function(cname) {
	    var name = cname + "=";
	    
	    var ca = document.cookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	},
	deleteAllCookies: function() {
		if(!POONT.isEmpty(document.cookie)){
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		}
	},
contextPath : window.location.origin,
	commonURL: window.location.origin+'/common',
	uploadURL: window.location.origin+'/upload',
	loadingShow : function(){
		if(window.location.pathname!="/login"&&window.location.pathname!="/register"){
			$('.pageLoading').modal('show');
		}
	},
	loadingHide : function(){
		if(window.location.pathname!="/login"&&window.location.pathname!="/register"){
			$('.pageLoading').modal('hide');
		}
	},
  isNumber : function(evt)  {
		evt = (evt) ? evt : window.event;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
},getIpAddress : function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
		//compatibility for firefox and chrome
		// How to : POONT.getIpAddress(function(ip){ console.log(ip) });
		var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
		var pc = new myPeerConnection({
				iceServers: []
			}),
			noop = function() {},
			localIPs = {},
			ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
			key;

		function iterateIP(ip) {
			if (!localIPs[ip]) onNewIP(ip);
			localIPs[ip] = true;
		}

		//create a bogus data channel
		pc.createDataChannel("");

		// create offer and set local description
		pc.createOffer().then(function(sdp) {
			sdp.sdp.split('\n').forEach(function(line) {
				if (line.indexOf('candidate') < 0) return;
				line.match(ipRegex).forEach(iterateIP);
			});

			pc.setLocalDescription(sdp, noop, noop);
		}).catch(function(reason) {
			// An error occurred, so handle the failure to connect
		});

		//listen for candidate events
		pc.onicecandidate = function(ice) {
			if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
			ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
		};
	},
	randomInt : function (min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.floor(Math.random() * (max - min + 1) + min);
  	},
	getPicPath :function(code){
		return 'https://cdn.filestackcontent.com/'+code;
	},
	uploadPhoto : function(element,callBack){
		var formData = new FormData();
		if(!POONT.isEmpty(element.val())){
			var file = element.get(0).files[0];
			formData.append('photos', file, file.name);
			$.ajax({
				url: POONT.uploadURL,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(data){
					if(data.success){
						callBack(data.code);
					}else{
						callBack(null);
					}
				},
				xhr: function() {
					var xhr = new XMLHttpRequest();
					xhr.upload.addEventListener('progress', function(evt) {

					}, false);

					return xhr;
				}
			});
		}else{
			callBack(null);
		};
	}
};
$(window).on('load', function() {
	// POONT.loadingShow();
	toastrConfig();
	// setVillageName();
	click();
  window.addEventListener("beforeunload", function(event) {
  	if(false){
    	event.returnValue = "Write something clever here..";
		};
  });
});
$(document).ajaxStop(function() {
	POONT.loadingHide();
});
function click(){
	$(document).keyup(function(e) {
		key = e.key;
	});
	$('.logout').click(function(){
		swal({
			  title: "ยืนยันการออกจากระบบ ?",
			  text: "คุณต้องการออกจากระบบหรือไม่ ?",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonClass: "btn-danger",
			  confirmButtonText: "ยืนยัน",
			  cancelButtonText: "ยกเลิก",
			  closeOnConfirm: false
			},
			function(isConfirm){
				if (isConfirm) {
					window.location = "/logout";
				}
			});
	});
	$('.mainMenu').click(function(){
		var scale = 310;
		if($(this).hasClass('action')){
			scale = 0;
		}
		$(this).toggleClass('action');
		anime({
			targets: '.menu-box,.main-box',
			translateX: scale
		});
	});
	$('.back').click(function(){
		 window.history.back();
	});
}
function setVillageName(){
	var search = new Object();
		search.method = 'setVillageName';
		$.ajax({
			 type: "POST",
			 content: "application/json; charset=utf-8",
			 url: POONT.commonURL,
			 dataType: "json",
		     data: search,
		     success: function(d) {
	            if (true == d.success){
	            	$('#vNameDisplay').text('หมู่บ้าน '+d.vName);
	            }else{
	            	$('#vNameDisplay').text(null);
	            }
		    }
		});
}
function toastrConfig(){
	toastr.options = {
	  "closeButton": true,
	  "debug": false,
	  "newestOnTop": false,
	  "progressBar": true,
	  "positionClass": "toast-top-right",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}
}