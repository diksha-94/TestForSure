var courseController = function(id){
	this.id = id;
	this.courseData = {};
	this.ecommData = {};
	this.userId = -1;
};
courseController.prototype.Init = function(callback)
{
	this.LoadPage();
	this.LoadData();
	callback();
};
courseController.prototype.LoadPage = function()
{ 
	var html = "<div class='course-main col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='course-head col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"<h3></h3>"+
					"</div>"+
					"<div class='course-desc col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
						"<h4 class='shortDesc'></h4>"+
						"<p class='desc'></p>"+
						"<div class='ecomm'></div>"+
					"</div>"+
					"<div class='course-video col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"</div>"+
					"<div class='course-content col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"</div>"+
				"</div>";
						
	$('body .common-content').html(html);
};
courseController.prototype.LoadData = function()
{
	var id = this.id;
	fetch(remoteServer+'/test2bsure/course?id='+id)
	  .then(response => response.json())
	  .then(data => {
		this.SetState({ courseData: data.data[0] });
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
			this.userId = userId;
			fetch(remoteServer+'/test2bsure/user-ecomm?contentId='+id+'&contentType='+ItemType.COURSE+'&userId='+userId)
			  .then(response => response.json())
			  .then(data => {
				  this.SetState({ ecommData: data });
				  this.PopulateCourseOverview();
				  this.PopulateCourseContent();
			  });
		}
		else{
			this.PopulateCourseOverview();
			this.PopulateCourseContent();
		}
	  });
	
	
}
courseController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
};
courseController.prototype.PopulateCourseOverview = function()
{
	console.log("Inside PopulateCourseOverview");
	console.log(this.courseData);
	$('.course-main').find('.course-head h3').html(this.courseData.name);
	$('.course-main').find('.course-desc .shortDesc').html(this.courseData.shortDescription);
	$('.course-main').find('.course-desc .desc').html(this.courseData.description);
	var videoId = this.courseData.demoVideoId;
	fetch(remoteServer+'/test2bsure/video?id='+videoId)
	  .then(response => response.json())
	  .then(data => {
		  var src = (JSON.parse(data.data[0].meta))["youtubeId"];
		  var html = "<iframe src='https://www.youtube.com/embed/"+src+"' height='200' width='200' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
		  $('.course-main').find('.course-video').html(html);
	  });
};
courseController.prototype.PopulateCourseContent = function()
{
	console.log("Inside PopulateCourseContent");
	var html = "";
	if(this.courseData.content.length > 0){
		for(var chapter in this.courseData.content){
			var content = this.courseData.content[chapter];
			html += test2bsureController.getObj().ChapterCard(content);
		}
		$('.course-content').html(html);
		$('.course-content').find('.content').unbind().bind('click', function(e){
			if($(e.currentTarget).hasClass('lock')){
				alert("Please enroll to the course first");
				return;
			}
			var action = $(e.currentTarget).attr('data-action');
			window.location.href = action+"?courseId="+this.id;
		}.bind(this));
	}
	this.HandleEcomm();
};
courseController.prototype.HandleEcomm = function()
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