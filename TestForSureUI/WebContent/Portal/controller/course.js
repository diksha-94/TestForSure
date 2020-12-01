var courseController = function(){
};
courseController.prototype.Init = function(callback)
{
	this.LoadPage();
	callback();
};
courseController.prototype.LoadPage = function()
{ 
	var html = 	"<div>"+
					"Course Content"+
				"</div>";
	$('body .common-content').html(html);
};