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
	var html = "<div class='dashboard-div col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='top-options col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div>"+
						"<span class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>Start Date</span>"+ 
						"<input id='dateStart' type='date' "+
							" class='col-xs-2 col-sm-2 col-md-2 col-lg-2' />"+
					"</div>"+
					"<div>"+
						"<span class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>End Date</span>"+ 
						"<input id='dateEnd' type='date' "+
							" class='col-xs-2 col-sm-2 col-md-2 col-lg-2' />"+
					"</div>"+
					"<div>"+
						"<button id='btnDataSearch' type='button' "+
							" class='col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 btn btn-primary'>Done</button>"+
					"</div>"+
				"</div>"+
				"<div class='dashboard-data col-xs-10 col-sm-10 col-md-10 col-lg-10 col-sm-offset-1 col-xs-offset-1 col-md-offset-1 col-lg-offset-1'>"+
					"<div class='user-details'>"+
						"<span>Users Registered - </span>"+
						"<span class='userCount count'></span>"+
					"</div>"+
					"<div class='test-details'>"+
						"<span>Tests Taken - </span>"+
						"<span class='testCount count'></span>"+
					"</div>"+
					"<div class='quiz-details'>"+
						"<span>Quizzes Attempted - </span>"+
						"<span class='quizCount count'></span>"+
					"</div>"+
				"</div>"+
			"</div>";

	$('.menu-page-content').html(html);
	this.BindEvents();
	var d = new Date();
	$('#dateEnd').val(d.getFullYear() + "-" + this.FormatNumber(d.getMonth()+1) + "-" + this.FormatNumber(d.getDate()));
	d.setDate(d.getDate() - 6);
	$('#dateStart').val(d.getFullYear() + "-" + this.FormatNumber(d.getMonth()+1) + "-" + this.FormatNumber(d.getDate()));
		
	this.LoadData();
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