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