var quizController = function(id){
	this.id = id;
	this.exam = {};
	this.quizzes = {};
	this.filters = {};
	this.filterValues = "";
	this.from = 0;
	this.count = 8;
	this.needCount = 1;
	this.totalCount = 0;
};
quizController.prototype.Init = function(callback)
{
	this.LoadPage();
	this.LoadData();
	this.LoadFilters();
	this.BindEvents();
	callback();
};
quizController.prototype.LoadPage = function()
{
	var html = "<div class='mobileFilter hide col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<img class='filter-quiz' src='WebContent/Portal/images/filter.svg' alt='Filter Quizzes'/>"+	
			   "</div>"+
			   "<div class='quiz-listing col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='left col-xs-12 col-sm-12 col-md-3 col-lg-3'>"+
					"</div>"+
					"<div class='right col-xs-12 col-sm-12 col-md-9 col-lg-9'>"+
					"</div>"+
				"</div>"+
				"<div class='mobileViewQuiz quizOverlay'></div>";
	$('body .common-content').html(html);
	$('.common-content').addClass('quiz-page');
};
quizController.prototype.BindEvents = function()
{
	$('.filter-quiz').unbind().bind('click', function(){
		$('.quiz-listing').find('.left').addClass('mobile');
		$('.quiz-listing').find('.left').css('height', (screen.height) + 'px');
		$('.quizOverlay').css('height', '100%');
		$("body").addClass("nobodyscroll");
		$('.quiz-listing').find('.left').find('.filterClose').unbind().bind('click', function(){
			$('.quiz-listing').find('.left').removeClass('mobile');
			$('.quizOverlay').css('height', '0px');
			$("body").removeClass("nobodyscroll");
		});
	});
	
	$('.quizOverlay').unbind().bind('click', function(){
		$('.quiz-listing').find('.left').removeClass('mobile');
		$('.quizOverlay').css('height', '0px');
		$("body").removeClass("nobodyscroll");
	})
	
};
quizController.prototype.LoadData = function()
{
	var userId = -1;
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' 
		&& (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) 
		&& typeof userController.getObj().userData.id != 'undefined'){
		userId = userController.getObj().userData.id;
	}
	var url = remoteServer+'/test2bsure/quizzes?userId='+userId+'&subjectId='+this.id+'&from='+this.from+'&count='+this.count+'&totalCount=1';
	if(typeof this.filterValues != 'undefined' && this.filterValues.length > 0){
		url += '&filters=' + this.filterValues;
	}
	fetch(url)
	  .then(response => response.json())
	  .then(data => this.SetState({ quizzes: data.quizzes, totalCount: data.totalCount }));
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
	fetch(remoteServer+'/test2bsure/item-filters?itemtype=1&subjectId='+this.id)
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
	var html = '';
	if(this.needCount != -1){
		html += '<h4>Quizzes</h4>';
		html += "<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	}
	for(var quiz in this.quizzes){
		html += "<li quiz-id='"+this.quizzes[quiz].id+"' data-action='"+this.quizzes[quiz].urlKey+"' class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
		html += test2bsureController.getObj().QuizCard(this.quizzes[quiz]);
		html += "</li>";
	}
	if(this.needCount != -1){
		html += '</ul>';
		$('.quiz-listing .right').html(html);
	}
	else{
		$('.quiz-listing .right ul').append(html);
	}
	$('.quiz-listing .right').find('.btnQuizAction').unbind().bind('click', function(e){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		if(userId == -1){
			//User not logged in
			$('#btnLogin').click();
			return false;
		}
		var action = $(e.currentTarget).parents('li[quiz-id]').attr('data-action');
		window.open(action, "_self");
	});
	$('.quiz-listing').find('span.reward').unbind().bind('click', function(){
		test2bsureController.getObj().ShowRewardInstructions();
	});
	if(this.totalCount > $('.quiz-listing .right ul li').length){
		if($('.btnLoadMore').length == 0){
			html = "<button class='button button-default btnLoadMore'>VIEW MORE</button>";
			$('.quiz-listing .right').append(html);
			$('.btnLoadMore').unbind().bind('click', function(){
				this.from += this.count;
				this.needCount = -1;
				this.LoadData();
			}.bind(this));
		}
	}
	else if($('.btnLoadMore').length > 0){
		$('.btnLoadMore').remove();
	}
};
quizController.prototype.PopulateFilters = function()
{
	var html = '<h4>Quiz Filters<span class="hide filterClose">X</span></h4>';
	html += "<ul class='quiz-filters col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	for(var filter in this.filters){
		//html += "<li filter-id='"+this.filters[filter].id+"'><input class='filterItem' type='checkbox' value='"+this.filters[filter].title+"'>"+this.filters[filter].title+"</input></li>";
		html += "<li filter-id='"+this.filters[filter].id+"'><span class='filterItem' data-value='"+this.filters[filter].title+"'>"+this.filters[filter].title+"</span></li>";
	}
	html += "</ul>";
	html += "<button class='btnReset button button-primary'>Reset</button>";
		
	$('.quiz-listing .left').append(html);
	$('.quiz-listing .left .quiz-filters').find('li[filter-id]').unbind().bind('click', function(e){
		if($(e.currentTarget).find('span').hasClass('selected')){
			$(e.currentTarget).find('span').removeClass('selected');
		}
		else if(!$(e.currentTarget).find('span').hasClass('selected')){
			$(e.currentTarget).find('span').addClass('selected');
		}
		var filterValues = "";
		$('.quiz-listing .left .quiz-filters').find('.filterItem').each(function(key, value){
			if($(value).hasClass('selected')){
				filterValues += $(value).parent('li').attr('filter-id')+',';
			}
		});
		filterValues = filterValues.substring(0, filterValues.length - 1);
		this.filterValues = filterValues;
		this.from = 0;
		this.needCount = 1;
		this.LoadData();
	}.bind(this));
	$('.quiz-listing .left').find('.btnReset').unbind().bind('click', function(e){
		$('.quiz-listing .left .quiz-filters').find('li[filter-id]').find('span').removeClass('selected');
		this.filterValues = "";
		this.from = 0;
		this.needCount = 1;
		this.LoadData();
		$('.quiz-listing').find('.left').removeClass('mobile');
		$('.quizOverlay').css('height', '0px');
		$("body").removeClass("nobodyscroll");
	}.bind(this));
};