var backenddashboardController = function(){
	this.data = null;
	this.Init();
};
backenddashboardController.prototype.Init = function()
{
	console.log('Initiate dashboard');
	showLoader();
	this.LoadView();
};
backenddashboardController.prototype.BindEvents = function()
{
	$('#btnDataSearch').unbind().bind('click', function(){
		this.LoadData();
	}.bind(this));
};
backenddashboardController.prototype.LoadView = function()
{
	$('.menu-page-content').load('backenddashboard.html', function(){
		this.BindEvents();
		//Set default Dates
		var d = new Date();
		$('#dateEnd').val(d.getFullYear() + "-" + this.FormatNumber(d.getMonth()+1) + "-" + this.FormatNumber(d.getDate()));
		d.setDate(d.getDate() - 6);
		$('#dateStart').val(d.getFullYear() + "-" + this.FormatNumber(d.getMonth()+1) + "-" + this.FormatNumber(d.getDate()));
		
		this.LoadData();
	}.bind(this));
};
backenddashboardController.prototype.LoadData = function()
{
	var startDate = $('#dateStart').val();
	var endDate = $('#dateEnd').val();
	if(startDate > endDate){
		alert('Start Date should be before end Date');
		return false;
	}
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
backenddashboardController.prototype.PopulateData = function()
{
	$('.dashboard-data').find('.user-details').find('.userCount').text(this.FormatNumber(this.data.userDetails.usersCount));
	$('.dashboard-data').find('.test-details').find('.testCount').text(this.FormatNumber(this.data.testDetails.testsTakenCount));
	$('.dashboard-data').find('.quiz-details').find('.quizCount').text(this.FormatNumber(this.data.quizDetails.quizzesTakenCount));
};
backenddashboardController.prototype.FormatNumber = function(num)
{
	return (parseInt(num) < 10 && parseInt(num) > 0) ? ('0' + parseInt(num)) : parseInt(num);
}