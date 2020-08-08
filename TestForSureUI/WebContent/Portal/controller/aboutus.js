var aboutusController = function(){
	this.Init();
};
aboutusController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".aboutus-header");
	//Load footer
	test2bsureController.getObj().GetFooter(".aboutus-footer");
	$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height() + 20 +'px');
};