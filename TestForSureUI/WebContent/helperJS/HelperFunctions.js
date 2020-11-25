//var remoteServer = "http://3.6.58.203:8083";
var remoteServer = "http://localhost:8083";
var perPage = 15;
function validateEmail(email){
	 var regEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	 if(regEx.test(email)){
		 return true;
	 }
	 return false;
}
function RefreshData(viewId){
	$('#'+viewId).find('input[type="text"]').val('');
	$('#'+viewId).find('input[type="number"]').val('');
	$('#'+viewId).find('input[type="checkbox"]').prop('checked', false);
	$('#'+viewId).find('#selectedExam').empty();
	$('#'+viewId).find('.autocomplete-div').remove();
	$('#'+viewId).find('select').val('');
	$('#'+viewId).find('.addQuesCategory').hide();
	$('#'+viewId).find('.note-editor').find('.note-editable').html('');
	if(viewId == 'quizModal'){
		$('#'+viewId).find('#txtQuizAttempts').val(1);
		$('#'+viewId).find('#txtQuizIndex').val(0);
		$('#'+viewId).find('#txtRewardPoints').val(0);
	}
	if(viewId == 'categoryModal'){
		$('#'+viewId).find('#txtCategoryIndex').val(0);
	}
	if(viewId == 'examModal'){
		$('#'+viewId).find('#txtExamIndex').val(0);
	}
	if(viewId == 'testDetailsModal'){
		$('#'+viewId).find('#txtTestIndex').val(0);
		$('#'+viewId).find('#txtRewardPoints').val(0);
	}
	if(viewId == 'quizsubjectModal'){
		$('#'+viewId).find('#txtQuizSubjectIndex').val(0);
	}
	if(viewId == 'videoModal'){
		$('#'+viewId).find('#txtVideoIndex').val(0);
	}
	if(viewId == 'notesModal'){
		$('#'+viewId).find('#txtNotesIndex').val(0);
	}
}
function setCookie(cname, cvalue, exdays){
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function pagination(count){
	var html = "<div><span>Select Page</span></div>";
	html += "<div class='pagination' data-records='"+perPage+"'><select class='pagination-dropdown'>";
	var index = 0;
	var done = false;
	while(count >= perPage){
		var className = "page";
		if(done == false){
			className = "page active";
			done = true;
		}
		html += "<option class='"+className+"' data-start='"+(index*perPage)+"' value='"+(index+1)+"'>"+(index+1)+"</option>";
		count -= perPage;
		index++;
	}
	if(count > 0){
		html += "<option class='page' data-start='"+(index*perPage)+"' value='"+(index+1)+"'>"+(index+1)+"</option>";
	}
	html += "</select></div>";
	return html;
}
function showLoader(){
	$('.loader').show();
}
function removeLoader(){
	$('.loader').hide();
}


function LoadCSS(filename) {
	var id = "CSS_" + filename.replace(/[^a-zA-Z0-9_]+/, "_").replace(".", "_");
	if (!document.getElementById(id)) {
		link = document.createElement('link');
		link.id = id;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = "../css/" + filename + ".css";
		document.head.appendChild(link);
	}
};

function LoadJS(src, callback) {
	var id = "JS_" + src.replace(/[^a-zA-Z0-9_]+/, "_").replace(".", "_");
	if (!document.getElementById(id)) {
		var s = document.createElement('script');
		s.id = id;
		s.src = "../controller/" + src + ".js";
		s.async = true;
		s.onreadystatechange = s.onload = function() {
			if ( typeof this.callback != 'undefined') {
				this.callback();
			}
		}.bind({
			obj : s,
			callback : callback
		});
		document.getElementsByTagName('head')[0].appendChild(s);
	} else {
		if ( typeof callback !== "undefined") {
			callback.done = true;
			callback();
		}
	}
};
function getCategories(callback){
	$.ajax({
		url: remoteServer+'/test2bsure/category',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					callback(response.data);
				}
				else{
					callback([]);
				}
			}
			else{
				callback([]);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			callback([]);
		}
	});
}

function getQuestionCategories(callback){
	$.ajax({
		url: remoteServer+'/test2bsure/question-category',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.categories != null || response.subcategories != null){
					callback(response.categories, response.subcategories);
				}
				else{
					callback([], []);
				}
			}
			else{
				callback([], []);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			callback([], []);
		}
	});
}

function getExamTitle(examIds, callback){
	$.ajax({
		url: remoteServer+'/test2bsure/examtitle?exams='+examIds,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					callback(response.data);
				}
				else{
					callback([]);
				}
			}
			else{
				callback([]);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			callback([]);
		}
	});
}
function getTestTitle(testIds, callback){
	$.ajax({
		url: remoteServer+'/test2bsure/testtitle?tests='+testIds,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					callback(response.data);
				}
				else{
					callback([]);
				}
			}
			else{
				callback([]);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			callback([]);
		}
	});
}
function getFilterTitle(filterIds, callback){
	$.ajax({
		url: remoteServer+'/test2bsure/filtertitle?filters='+filterIds,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					callback(response.data);
				}
				else{
					callback([]);
				}
			}
			else{
				callback([]);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			callback([]);
		}
	});
}
function getQuestion(id, callback){
	$.ajax({
		url: remoteServer + "/test2bsure/question?id=" + id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					callback(item);
				}
				else{
					callback(null);
				}
			}
			else{
				callback(null);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			callback(null);
		}
	});
}

function populateUrlKey(value, dom){
	//Remove special characters and replace space with hyphen
	value =  value.replace(/[^a-zA-Z0-9- ]+/g,'').replace(/ /g,'-').toLowerCase();
	$(dom).val(value);
}