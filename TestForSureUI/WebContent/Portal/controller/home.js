var homeController = function(){
	this.category = {};
	this.exam = {};
	this.testCount = {};
	this.quizCount = {};
	this.Init();
};
homeController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".home-header");
	this.LoadCategoriesExams();
	//Load footer
	test2bsureController.getObj().GetFooter(".home-footer");
};
homeController.prototype.LoadCategoriesExams = function()
{
	fetch(remoteServer+'/test2bsure/home')
	  .then(response => response.json())
	  .then(data => this.SetState({ category: data.category, exam: data.exam, testCount: data.testCount, quizCount: data.quizCount }));
}
homeController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulateAllCategories();
	this.PopulateAllExams();
};
homeController.prototype.PopulateAllCategories = function()
{
	var html = "<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
	html += "<li class='active' category-id='0'>"+
				"<a>All</a>"+
			"</li>";
	for(var category in this.category){
		html += "<li category-id='"+this.category[category].id+"'>"+
					"<img src='"+this.category[category].imageUrl+"' alt='"+this.category[category].title+"'/>"+
					"<a>"+this.category[category].title+"</a>"+
				"</li>";
	}
	html += "</ul>";
	$('.category-listing').html(html);
	//$('.category-listing').find('ul li.active').css('pointer-events', 'none');
	$('.category-listing').find('ul li').unbind().bind("click", function(e){
		var id = $(e.currentTarget).attr('category-id');
		if(id == 0){
			this.PopulateAllExams();
		}
		else{
			this.PopulateAllExams(id);
		}
		$('.category-listing').find('ul li').removeClass('active');
		$(e.currentTarget).addClass('active');
	}.bind(this));
};
homeController.prototype.PopulateAllExams = function(id)
{
	var html = "";
	for(var category in this.category){
		if((typeof id == 'undefined') || (typeof id != 'undefined' && this.category[category].id == id)){
			html += "<div class='outer-category'>"+
						"<div category-id='"+this.category[category].id+"'>"+
						"<h4>"+this.category[category].title+"</h4>"+
						"<ul class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
			for(var exam in this.exam){
				if(this.exam[exam].category == this.category[category].id){
					html += "<li class='col-xs-12 col-sm-12 col-md-3 col-lg-3' exam-id='"+this.exam[exam].id+"'>";
					html += test2bsureController.getObj().ExamCard(this.exam[exam], this.testCount, this.quizCount);
					html +=	"</li>";
				}
			}
			html += "</li>"+
					"</div>"+
					"</div>";
		}
	}
	$('.exam-listing').html(html);
	$('.exam-listing').find('.exam-data').find('.test-count').unbind().bind('click', function(e){
		var examId = $(e.currentTarget).parents('li[exam-id]').attr('exam-id');
		window.location.href = 'exam.html?id='+examId+'#test-listing';
	});
	$('.exam-listing').find('.exam-data').find('.quiz-count').unbind().bind('click', function(e){
		var examId = $(e.currentTarget).parents('li[exam-id]').attr('exam-id');
		window.location.href = 'exam.html?id='+examId+'#quiz-listing';
	});
	$('.exam-listing').find('.btnExplore').unbind().bind('click', function(e){
		var examId = $(e.currentTarget).parents('li[exam-id]').attr('exam-id');
		window.location.href = 'exam.html?id='+examId;
	});
};
