var chapterController = function(){
};
chapterController.prototype.Init = function(callback)
{
	this.LoadPage();
	callback();
};
chapterController.prototype.LoadPage = function()
{ 
	var html = 	"<div>"+
					"Chapter Content"+
				"</div>";
	$('body .common-content').html(html);
};