var testReportController = function(){
	this.id = 0;
	this.reportData = {};
	this.testInfo = {};
	this.Init();
};
testReportController.prototype.Init = function()
{
	//Read id from query string
	this.id = test2bsureController.getObj().QueryString(window.location.href, 'sessionId');
	this.LoadData();
}
testReportController.prototype.LoadData = function()
{
	var id = this.id;
	fetch('http://localhost:8083/test2bsure/testreportdata?sessionId='+id)
	  .then(response => response.json())
	  .then(data => this.SetState({ testInfo: data.testInfo, reportData: data.reportData }));
}
testReportController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateReportHeader();
	this.PopulateBasicReport();
	this.PopulateTopperAverage();
	this.PopulateLeaderboard();
	this.DisplayCharts();
};
testReportController.prototype.PopulateReportHeader = function()
{
	var html = "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'><h4>"+this.testInfo.title+"</h4></div>"+
		       "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divButton'>"+
			   		"<button class='button button-default btnSolution'>Solutions</button>"+
			   "</div>"+
			   "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2 divButton'>"+
					"<button class='button button-default btnDownloadReport'>Download Report</button>"+
			   "</div>";
	$('.report-header').html(html);
	$('.report-header').find('.btnSolution').unbind().bind('click', function(){
		this.SubmitTest();
	}.bind(this));
};
testReportController.prototype.PopulateBasicReport = function()
{
};
testReportController.prototype.PopulateTopperAverage = function()
{
};
testReportController.prototype.PopulateLeaderboard = function()
{
};
testReportController.prototype.DisplayCharts = function()
{
};