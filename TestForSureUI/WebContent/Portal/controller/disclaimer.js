var disclaimerController = function(){
	this.Init();
};
disclaimerController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".disclaimer-header");
	//Load footer
	test2bsureController.getObj().GetFooter(".disclaimer-footer");
};
$(document).ready(function () {
	new disclaimerController();	
});