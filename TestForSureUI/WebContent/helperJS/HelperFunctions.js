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