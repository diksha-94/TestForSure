var quizController = function(){
	this.exam = {};
	this.quizzes = {};
	this.filters = {};
	this.Init();
};
quizController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".quiz-header");
	this.LoadData();
	this.LoadFilters();
	//Load footer
	test2bsureController.getObj().GetFooter(".quiz-footer");
};
quizController.prototype.LoadData = function(filterValues)
{
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && typeof userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	var url = remoteServer+'/test2bsure/quizzes?userId='+userId;
	if(typeof filterValues != 'undefined' && filterValues.length > 0){
		url += '?filters='+filterValues;
	}
	fetch(url)
	  .then(response => response.json())
	  .then(data => this.SetState({ quizzes: data.quizzes }));
}
quizController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateQuizzes();
};
quizController.prototype.LoadFilters = function()
{
	fetch(remoteServer+'/test2bsure/item-filters?itemtype=1')
	  .then(response => response.json())
	  .then(data => this.SetFilterState({ filters: data.filters }));
}
quizController.prototype.SetFilterState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateFilters();
};
quizController.prototype.PopulateQuizzes = function()
{
	var html = '<h4>Quizzes</h4>';
	html += "<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	for(var quiz in this.quizzes){
		html += "<li quiz-id='"+this.quizzes[quiz].id+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += test2bsureController.getObj().QuizCard(this.quizzes[quiz]);
		html += "</li>";
	}
	$('.quiz-listing .right').html(html);
	$('.quiz-listing .right').find('.btnQuizAction').unbind().bind('click', function(e){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && typeof userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		if(userId == -1){
			//User not logged in
			$('#btnLogin').click();
			return false;
		}
		var quizId = $(e.currentTarget).parents('li[quiz-id]').attr('quiz-id');
		window.location.href = 'take-quiz.html?id='+quizId;
	});
};
quizController.prototype.PopulateFilters = function()
{
	var html = '<h4>Quiz Filters</h4>';
	html += "<ul class='quiz-filters col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	for(var filter in this.filters){
		html += "<li filter-id='"+this.filters[filter].id+"'><input class='filterItem' type='checkbox' value='"+this.filters[filter].title+"'>"+this.filters[filter].title+"</input></li>";
	}
	html += "</ul>";
	html += "<button class='btnReset button button-primary'>Reset</button>";
		
	$('.quiz-listing .left').append(html);
	$('.quiz-listing .left .quiz-filters').find('.filterItem').unbind().bind('click', function(e){
		var filterValues = "";
		$('.quiz-listing .left .quiz-filters').find('.filterItem').each(function(key, value){
			if($(value).prop('checked') == true){
				filterValues += $(value).parent('li').attr('filter-id')+',';
			}
		});
		filterValues = filterValues.substring(0, filterValues.length - 1);
		this.LoadData(filterValues);
	}.bind(this));
	$('.quiz-listing .left').find('.btnReset').unbind().bind('click', function(e){
		this.LoadData();
	}.bind(this));
};