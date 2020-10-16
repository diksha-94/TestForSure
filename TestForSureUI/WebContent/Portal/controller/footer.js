var footerController = function(){ 
	this.Init();
};
footerController.prototype.Init = function()
{
	this.BindEvents();
};
footerController.prototype.BindEvents = function()
{
	$('.footer').find('.website-links').find('li a[data-action]').unbind().bind('click', function(e){
		var action = $(e.currentTarget).attr('data-action');
		window.open(action);
	});
};