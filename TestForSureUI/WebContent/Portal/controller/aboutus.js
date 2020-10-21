var aboutusController = function(){
};
aboutusController.prototype.Init = function(callback)
{
	this.LoadPage();
	callback();
};
aboutusController.prototype.LoadPage = function()
{ 
	var html = 	"<div class='aboutus-html col-xs-10 col-sm-10 col-md-8 col-lg-8 col-xs-offset-1 col-sm-offset-1 col-md-offset-2 col-lg-offset-2'>"+
					"<div class='heading'>"+
						"<h4>Who we are?</h4>"+
					"</div>"+
					"<div class='content'>"+
						"<p>Test2BSure.com is an online portal for all types of competitive exams (Technical and Non-Technical) "+
							"to check performance/capability of a candidate before the actual exam. This portal is especially focussed "+
							"on those competitive exams which are not easily available online. Using this portal, a candidate can take a "+
							"test free of cost and analyze his/her weak and strong points with the help of statistics in the form "+
							"of graphs provided in the report section after end of the test and able to improve his/her weak points."+
						"</p>"+
					"</div>"+
				"</div>";
	$('body .common-content').html(html);
	$('.common-content').addClass('about-us');
	$('.common-footer').addClass('aboutus-footer');
};