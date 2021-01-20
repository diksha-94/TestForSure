var chapterController = function(id){
	this.id = id;
	this.courseId = -1;
	this.chapterData = {};
};
chapterController.prototype.Init = function(callback)
{
	this.LoadPage();
	this.courseId = test2bsureController.getObj().QueryString(window.location.href, 'courseId');
	this.LoadData();
	callback();
};
chapterController.prototype.LoadPage = function()
{ 
	var html = "<div class='chapter-main col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='chapter-head col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"<h3></h3>"+
						"<p></p>"+
					"</div>"+
					"<div class='chapter-content col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
							"<div class='chapter-video col-xs-9 col-sm-9 col-md-9 col-lg-9'></div>"+
							"<div class='next-chapter col-xs-3 col-sm-3 col-md-3 col-lg-3'></div>"+
						"</div>"+
						"<div class='chapter-addons col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"</div>"
					"</div>"+
				"</div>";
						
	$('body .common-content').html(html);
};
chapterController.prototype.LoadData = function()
{
	fetch(remoteServer+'/test2bsure/chapterpage?courseId='+this.courseId+'&chapterId='+this.id)
	  .then(response => response.json())
	  .then(data => {
		this.SetState({ chapterData: data });
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
			this.userId = userId;
			//TODO: Handle attempt info
			this.PopulateChapterData();
		}
		else{
			this.PopulateChapterData();
		}
	  });
}
chapterController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
};
chapterController.prototype.PopulateChapterData = function()
{
	console.log("Inside PopulateChapterData");
	$('.chapter-main').find('.chapter-head h3').html(this.chapterData.chapterInfo.name);
	$('.chapter-main').find('.chapter-head p').html(this.chapterData.chapterInfo.description);
	if(this.chapterData.videos.length > 0){
		var videoId = this.chapterData.videos[0].contentId;
		fetch(remoteServer+'/test2bsure/video?id='+videoId)
		  .then(response => response.json())
		  .then(data => {
			  var src = (JSON.parse(data.data[0].meta))["youtubeId"];
			  var html = "<iframe src='https://www.youtube.com/embed/"+src+"' height='400' width='100%' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
			  $('.chapter-main').find('.chapter-content').find('.chapter-video').html(html);
		});
	}
	
	if(this.chapterData.nextChapter != null){
		this.chapterData.nextChapter.chapterName = this.chapterData.nextChapter.name;
		var nextChapter = test2bsureController.getObj().ChapterCard(this.chapterData.nextChapter);
		$('.chapter-main').find('.chapter-content').find('.next-chapter').html(nextChapter);
		$('.chapter-content').find('.next-chapter').find('.content').unbind().bind('click', function(e){
			var action = $(e.currentTarget).attr('data-action');
			window.location.href = action+"?courseId="+this.courseId;
		}.bind(this));
	}
	//TODO: Populate Notes, Test, Quiz
	var html = "";
	html += '<div class="tab">';
	if(this.chapterData.tests.length > 0){
		html += '<button class="tablinks tests" data-attr="tests">Tests</button>';
	}
	if(this.chapterData.quizzes.length > 0){
		html += '<button class="tablinks quizzes" data-attr="quizzes">Quizzes</button>';
	}
	if(this.chapterData.notes.length > 0){
		html += '<button class="tablinks notes" data-attr="notes">Notes</button>';
	}
	html += '</div>';

	if(this.chapterData.tests.length > 0){
		html += '<div id="tests" class="tabcontent">Tests';
		for(var test in this.chapterData.tests){
			
		}
		html += '</div>';
	}
	if(this.chapterData.quizzes.length > 0){
		html += '<div id="quizzes" class="tabcontent">Quizzes';
		for(var quiz in this.chapterData.quizzes){
			
		}
		html += '</div>';
	}
	if(this.chapterData.notes.length > 0){
		html += '<div id="notes" class="tabcontent">Notes';
		for(var note in this.chapterData.notes){
			
		}
		html += '</div>';
	}
	$('.chapter-content').find('.chapter-addons').html(html);
	$('.tab .tablinks').unbind().bind('click', function(e){
		$('.tabcontent').css('display', 'none');
		var contentId = $(e.currentTarget).attr('data-attr');
		$('#'+contentId).css('display', 'block');
	});
};

chapterController.prototype.HandleEcomm = function()
{
	var html = "";
	if(this.userId == -1){
		//User not logged in
		/*if(cost > 0){
			Buy button
		}
		else{
			Enroll Button
		}*/
		html += "<button class='btn btn-primary' id='btnCourseEnroll'>Enroll</button>";
	}
	else{
		//User logged in
		/*if(cost > 0){
		   if(this.ecommData.purchased){
		   	 Enrolled
		   }
		   else{
			 Buy button
		   }
		}else{}*/
		if(this.ecommData.purchased){
			html += "<span>Enrolled</span>";
			$('.course-content').find('.content').removeClass('lock');
		}
		else{
			html += "<button class='btn btn-primary' id='btnCourseEnroll'>Enroll</button>";
		}
	}
	$('.course-desc').find('.ecomm').html(html);
};