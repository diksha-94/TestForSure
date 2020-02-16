var privacyController = function(){
	this.Init();
};
privacyController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".privacy-header");
	//Load footer
	test2bsureController.getObj().GetFooter(".privacy-footer");
};
$(document).ready(function () {
	new privacyController();
	$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+'px');
});

