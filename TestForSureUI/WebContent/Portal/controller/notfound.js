var notfoundController = function(){
};
notfoundController.prototype.Init = function(callback)
{
	this.LoadPage();
	callback();
};
notfoundController.prototype.LoadPage = function()
{
	var html = "<div class='outerDiv'>"+
					"<h1>404</h1>"+
					"<h3>Page Not Found</h3>"+
			   "</div>";
	$('body .common-content').append(html);
};