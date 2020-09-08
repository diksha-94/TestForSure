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
