var disclaimerController = function(){
	this.Init();
};
disclaimerController.prototype.Init = function()
{
	$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+'px');
	//Load header
	test2bsureController.getObj().GetHeader(".disclaimer-header");
	//Load footer
	test2bsureController.getObj().GetFooter(".disclaimer-footer");
};