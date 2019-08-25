//Create By Kitimetha Thammetha (Poont)
var storage = {};
var showDescription = false;
(function($) {
	$.combobox = { 
		'build': function(config,callBack){
//			var element = document.getElementById(config.id);
//			element.addEventListener("load", function(e) {
//				callBack(e);
//			});
			if(isEmpty(config.url)){
				config.url = application.contextPath+'/combobox.html';
			}
			if(!isEmpty(config.showDescription)){
				showDescription = config.showDescription;
			}
			$('#'+config.id).attr('showDescription',showDescription)
			if($('#'+config.id).parent().children('label').attr('for')==config.id){
				$('#'+config.id).parent().children('label').remove();
				$('#'+config.id).children().remove();
			}
			if(!isEmpty(config.label)){
				$('#'+config.id).parent().prepend('<label for="'+config.id+'">'+config.label+'</label>')
			}
			$('#'+config.id).addClass('input-group');
			$('#'+config.id).css('cursor','pointer');
			$('#'+config.id).append('<input type="text" class="form-control selectedCombobox '+config.id+'Change"  placeholder="'+(!isEmpty(config.placeholder)?config.placeholder:"")+'" aria-describedby="'+(!isEmpty(config.placeholder)?config.placeholder:"")+'"  >');
			$('#'+config.id).prepend('<input type="hidden" id="'+config.id+'Code" class="'+config.id+'Change">');
			$('#'+config.id).append('<span class="input-group-addon" id="'+config.id+'Btn" style="cursor: pointer; border-top-right-radius: 2px; border-bottom-right-radius: 2px;" > <span class="caret"></span></span>');
			$('#'+config.id).append('<ul class="dropdown-menu" id="'+config.id+'list" aria-labelledby="'+config.id+'Btn" style=" max-height: 200px; overflow-y: auto; overflow-x: -moz-hidden-unscrollable;"></ul>');
			if(showDescription){
				$('#'+config.id).append('<input type="text"  class="form-control" id="'+config.id+'Description" style="width:250px;margin-left:10px;" disabled/>');
			}
			var data = new Object();
			if(!isEmpty(config.params)){
				var length = Object.keys(config.params).length;
				for (var i = 0;i<length;i++) {
					data[Object.keys(config.params)[i]] = config.params[Object.keys(config.params)[i]];
				}
			}
			data.method = config.method;
			$.ajax({
				type: "POST",
				url: config.url,
				content: "application/json; charset=utf-8",
				dataType: "json",
				data: data,
				success: function(d) {
					if (d.success == true){
						var data = d.object;
						storage[config.id] = d.object;
						data = searchFunction($('#'+config.id+'>.selectedCombobox').val(),storage[config.id]);
						var result = '';
						$('#'+config.id+'list>li').remove();
						if(data.length>0){
							var result = '';
							for(var i = 0; i<data.length;i++){
								var name ='';
								if(application.user.userLin=="EN"){
									name = data[i].descriptionEn;
								}else{
									name = data[i].descriptionTh;
								}
								result = result + '<li><a code="'+data[i]["code"]+'" style="cursor:pointer; border-bottom:1px solid #eaeaea;">'+name+'</a></li>';
							}
							$('#'+config.id+'list').append(result);
							if(!isEmpty(callBack)){
								callBack();
							}
							$('#'+config.id+'list>li>a').click(function(){
								if($('#'+config.id).attr('showDescription')=='true'){
									$('#'+config.id+'>.selectedCombobox').val($(this).attr('code'));
									$('#'+config.id+'Description').val($(this).text());
								}else{
									$('#'+config.id+'>.selectedCombobox').val($(this).text());
								}
								$('#'+config.id+'Code').val($(this).attr('code')).trigger('change');
								if($('#'+config.id).dropdown().hasClass('open')){
									$('#'+config.id).dropdown().removeClass('open');
								}
							});
						}
					}
				},
				error: function (xhr, textStatus, errorThrown) {
					
				}
			});
			var searchFunction = function (keyword,array){
				var obj = array.filter(function ( obj ) {
					var from = true;
					var to = true;
					var ref = true;
					if(!isEmpty(config.refCombobox)){
						if(!isEmpty($.combobox.getValue(config.refCombobox))){
							ref = (obj.refCode == $.combobox.getValue(config.refCombobox));
						}
					}
					if(!isEmpty(config.toCombobox)){
						if((!isEmpty($('#'+config.toCombobox+'Code').val()))&&(!isEmpty($('#'+config.id+'Code').val()))){
							if($('#'+config.id+'Code').val()>obj.code>$('#'+config.toCombobox+'Code').val()){
								to = false;
								from = false;
							}
						}
						if(!isEmpty($('#'+config.toCombobox+'Code').val())){
							if(!isEmpty($('#'+config.toCombobox+'Code').val())){
								if(obj.code>$('#'+config.toCombobox+'Code').val()){
									to = false;
								}
							}
						}
						if(!isEmpty($('#'+config.id+'Code').val())){
							if(obj.code<$('#'+config.id+'Code').val()){
								from = false;
							}
						}
					}
					if(!isEmpty(config.fromCombobox)){
						if((!isEmpty($('#'+config.id+'Code').val()))&&(!isEmpty($('#'+config.fromCombobox+'Code').val()))){
							if($('#'+config.fromCombobox+'Code').val()>obj.code>$('#'+config.id+'Code').val()){
								to = false;
								from = false;
							}
						}
						if(!isEmpty($('#'+config.id+'Code').val())){
							if(!isEmpty($('#'+config.id+'Code').val())){
								if(obj.code>$('#'+config.id+'Code').val()){
									to = false;
								}
							}
						}
						if(!isEmpty($('#'+config.fromCombobox+'Code').val())){
							if(obj.code<$('#'+config.fromCombobox+'Code').val()){
								from = false;
							}
						}
					}
					return 	ref&&(from&&to)&&(!isEmpty((!isEmpty(obj.descriptionTh)?obj.descriptionTh:'').toString().toLowerCase().match(keyword.toLowerCase()))||
					!isEmpty((!isEmpty(obj.descriptionEn)?obj.descriptionEn:'').toString().toLowerCase().match(keyword.toLowerCase()))||
					!isEmpty((!isEmpty(obj.code)?obj.code:'').toString().toLowerCase().match(keyword.toLowerCase())))
					
				});
				return obj;
			}
			var searchFunctionByCode = function (code,array){
				var obj = array.filter(function ( obj ) {
					return obj.code==code
					
				});
				return obj;
			}
			$('#'+config.id+'Btn,#'+config.id+'>.selectedCombobox').click(function(e){
//				var data = searchFunction($('#'+config.id+'>.selectedCombobox').val(),storage[config.id]);
				var data = searchFunction("",storage[config.id]);
				var result = '';
				$('#'+config.id+'list>li').remove();
				if(data.length>0){
					var result = '';
					for(var i = 0; i<data.length;i++){
						var name ='';
						if(application.user.userLin=="EN"){
							name = data[i].descriptionEn;
						}else{
							name = data[i].descriptionTh;
						}
						result = result + '<li><a code="'+data[i]["code"]+'" style="cursor:pointer; border-bottom:1px solid #eaeaea;">'+name+'</a></li>';
					}
					$('#'+config.id+'list').append(result);
					$('#'+config.id+'list>li>a').click(function(){
//						var event = new CustomEvent("load", {'detail': data});
//						$('#'+config.id)[0].dispatchEvent(event);
						if($('#'+config.id).attr('showDescription')=='true'){
							$('#'+config.id+'>.selectedCombobox').val($(this).attr('code'));
							$('#'+config.id+'Description').val($(this).text());
						}else{
							$('#'+config.id+'>.selectedCombobox').val($(this).text());
						}
						$('#'+config.id+'Code').val($(this).attr('code')).trigger('change');
						if($('#'+config.id+'>.selectedCombobox').parent().dropdown().hasClass('open')){
							$('#'+config.id+'>.selectedCombobox').parent().dropdown().removeClass('open');
						}
					});
				}
				if(!$('#'+config.id+'>.selectedCombobox').parent().dropdown().hasClass('open')){
					$('#'+config.id+'>.selectedCombobox').dropdown('toggle');
				}else{
					$('#'+config.id+'>.selectedCombobox').parent().dropdown().removeClass('open');
				}
			});
			$('#'+config.id+'>.selectedCombobox').keyup(function(e){
				var data = searchFunction($('#'+config.id+'>.selectedCombobox').val(),storage[config.id]);
				var result = '';
				$('#'+config.id+'list>li').remove();
				if(data.length>0){
					var result = '';
					for(var i = 0; i<data.length;i++){
						var name ='';
						if(application.user.userLin=="EN"){
							name = data[i].descriptionEn;
						}else{
							name = data[i].descriptionTh;
						}
						result = result + '<li><a code="'+data[i]["code"]+'" style="cursor:pointer; border-bottom:1px solid #eaeaea;">'+name+'</a></li>';
					}
					$('#'+config.id+'list').append(result);
					$('#'+config.id+'list>li>a').click(function(){
						if($('#'+config.id).attr('showDescription')=='true'){
							$('#'+config.id+'>.selectedCombobox').val($(this).attr('code'));
							$('#'+config.id+'Description').val($(this).text());
						}else{
							$('#'+config.id+'>.selectedCombobox').val($(this).text());
						}
						$('#'+config.id+'Code').val($(this).attr('code')).trigger('change');
						if($('#'+config.id+'>.selectedCombobox').parent().dropdown().hasClass('open')){
							$('#'+config.id+'>.selectedCombobox').parent().dropdown().removeClass('open')
						}
					});
				}
				if(!$(this).parent().dropdown().hasClass('open')){
					$(this).dropdown('toggle');
				}
			});
			$('#'+config.id+'>.selectedCombobox').blur(function(e){
				setTimeout(function(){
					if(!isEmpty($('#'+config.id+'>.selectedCombobox').val())){
						var data = searchFunctionByCode($('#'+config.id+'Code').val(),storage[config.id]);
						var result = '';
						$('#'+config.id+'list>li').remove();
						if(data.length>0){
							var name ='';
							if(application.user.userLin=="EN"){
								name = data[0].descriptionEn;
							}else{
								name = data[0].descriptionTh;
							}
							if($('#'+config.id).attr('showDescription')=='true'){
								$('#'+config.id+'>.selectedCombobox').val(data[0]["code"]);
								$('#'+config.id+'Description').val(name);
							}else{
								$('#'+config.id+'>.selectedCombobox').val(name);
							}
							$('#'+config.id+'Code').val(data[0]["code"]);
						}else{
							$('#'+config.id+'Description').val(null);
							$('#'+config.id+'>.selectedCombobox').val(null);
							$('#'+config.id+'Code').val(null).trigger('change');
						}
					}else{
						$('#'+config.id+'Description').val(null);
						$('#'+config.id+'>.selectedCombobox').val(null);
						$('#'+config.id+'Code').val(null).trigger('change');
					}
					if($('#'+config.id+'>.selectedCombobox').parent().dropdown().hasClass('open')){
						$('#'+config.id+'>.selectedCombobox').parent().dropdown().removeClass('open');
					}
				},200);
				
			});
			if(!isEmpty(config.refCombobox)){
				$('#'+config.refCombobox+'Code').on('change', function() {
					$('#'+config.id+'Code').val(null);
					$('#'+config.id+'Description').val(null);
					$('#'+config.id+'>.selectedCombobox').val(null);
				});
			}
	    },
		'setValue' : function (id,value){
			var searchForSetVale = function (code,array){
				var obj = array.filter(function ( obj ) {
					return obj.code==code
					
				});
				return obj;
			}
			var data = searchForSetVale(value,storage[id]);
			if(data.length>0){
				var name ='';
				if(application.user.userLin=="EN"){
					name = data[0].descriptionEn;
				}else{
					name = data[0].descriptionTh;
				}
				if($('#'+id).attr('showDescription')=='true'){
					$('#'+id+'>.selectedCombobox').val(data[0]["code"]);
					$('#'+id+'Description').val(name);
				}else{
					$('#'+id+'>.selectedCombobox').val(name);
				}
				$('#'+id+'Code').val(data[0].code);
			}else{
				$('#'+id+'>.selectedCombobox').val(null);
				$('#'+id+'Code').val(null);
			}
		},
		'getValue' : function (id){
			return $('#'+id+'Code').val();
		},
		'getDesc' : function (id){
			var result = $('#'+id+'>.selectedCombobox').val();
			if($('#'+id).attr('showDescription')=='true'){
				result = $('#'+id+'Description').val()
			}
			return result;
		},
		'clear' : function (id){
			$('#'+id+'Code').val(null);
			$('#'+id+'Description').val(null);
			$('#'+id+'>.selectedCombobox').val(null);
		}
		
	}
})(jQuery);