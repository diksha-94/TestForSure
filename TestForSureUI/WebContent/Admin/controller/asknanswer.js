var asknanswerController = function(){
	this.data = null;
	this.Init();
};
asknanswerController.prototype.Init = function()
{
	console.log('Initiate Ask n Answer');
	showLoader();
	this.LoadView();
};
asknanswerController.prototype.BindEvents = function()
{
	$('#btnDataSearch').unbind().bind('click', function(){
		this.LoadData();
	}.bind(this));
};
asknanswerController.prototype.LoadView = function()
{
	$('.menu-page-content').load('asknanswer.html', function(){
		this.BindEvents();
		
		this.LoadData();
	}.bind(this));
};
asknanswerController.prototype.LoadData = function()
{
	$.ajax({
		url: remoteServer+'/test2bsure/backenddashboard/summary?startDate='+startDate+'&endDate='+endDate,
		type: 'GET',
		success: function(response){
			this.data = response;
			this.PopulateData();
			removeLoader();
		}.bind(this),
		error: function(e){
			console.log(e);
			removeLoader();
		}
	});
};
asknanswerController.prototype.PopulateData = function()
{
	$('.dashboard-data').find('.user-details').find('.userCount').text(this.FormatNumber(this.data.userDetails.usersCount));
	$('.dashboard-data').find('.test-details').find('.testCount').text(this.FormatNumber(this.data.testDetails.testsTakenCount));
	$('.dashboard-data').find('.quiz-details').find('.quizCount').text(this.FormatNumber(this.data.quizDetails.quizzesTakenCount));
};