var _asknanswerObj = null;
var asknanswercommonController = function(){
	this.req = {};
	this.exams = {};
};
asknanswercommonController.getObj = function()
{
	if(_asknanswerObj == null){
		_asknanswerObj = new asknanswercommonController();
	}
	return _asknanswerObj;
};
/* Create Post UI, API call, Validation */
/*
 * req["dom"]: dom,
 * req["examSelection"]: true/false,
 * req["contentType"]: Integer,
 * req["contentId"]: Integer
 */
asknanswercommonController.prototype.CreatePost = function(req, callback){
	this.req = req;
	var html = this.CreatePostCard(req.examSelection);
	$(req.dom).html(html);
	this.BindCreatePostEvents();
}
asknanswercommonController.prototype.CreatePostCard = function()
{
	var html = "";
	html += "<div class='add-post-card'>"+
				"<div class='head'><h3>Ask your Query</h3></div>";
	if(this.req["examSelection"]){
		//TODO: Get all the exams, and set as this.exams
		html += "<div class='exam-dd'><select class='ddExam'><option value=-1>Select Exam</option></select></div>";
	}
	html += "<div class='post-title'><textarea class='txtPostTitle' placeholder='Enter Post Title'></textarea></div>"+
			"<div class='post-desc'><textarea class='txtPostDesc' placeholder='Enter Post Description'></textarea></div>"+
			"<div class='post-submit'><button class='button button-primary btnSubmitPost'>Submit Post</button></div>"+
			"</div>";
	return html;
};
asknanswercommonController.prototype.BindCreatePostEvents = function()
{
	if(this.req["examSelection"]){
		var html = "";
		for(var exam in this.exams){
			html += "<option value='"+this.exams[exam]["id"]+"'>"+this.exams[exam]["title"]+"</option>";
		}
		$(this.req["dom"]).find('.add-post-card').find('.ddExam').append(html);
	}
	$(this.req["dom"]).find('.add-post-card').find('textarea').unbind().bind('keydown', this, function (e) {
		e.data.autoSize($(this))
	});
	$(this.req["dom"]).find('.add-post-card').find('.btnSubmitPost').unbind().bind('click', function(){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		if(userId == "-1"){
			//User not logged in
			$('#btnLogin').click();
			return false;
		}
		this.req["userId"] = userId;
		this.SubmitPost();
	}.bind(this));
};

asknanswercommonController.prototype.SubmitPost = function()
{
	var postId = -1;
	var postType = PostType.QUERY;
	if(this.req["examSelection"]){
		var examId = $(this.req["dom"]).find('.add-post-card').find('.ddExam').val();
		if(examId <= 0){
			alert("Please select exam");
			return;
		}
		this.req["contentType"] = ContentType.EXAM;
		this.req["contentId"] = examId;
	}
	var postTitle = $(this.req["dom"]).find('.add-post-card').find('.txtPostTitle').val();
	var postDesc = $(this.req["dom"]).find('.add-post-card').find('.txtPostDesc').val();
	if(postTitle.length == 0){
		alert("Post title can't be empty");
		return;
	}
	if(postDesc.length == 0){
		alert("Post description can't be empty");
		return;
	}
	var content = {
			"title": postTitle,
			"desc": postDesc
	};
	var outputContent = "";
	
	var postData = {
			"postId": postId,
			"postType": postType,
			"contentType": this.req["contentType"],
			"contentId": this.req["contentId"],
			"userId": this.req["userId"],
			"content": JSON.stringify(content),
			"outputContent": outputContent
	};
	$.ajax({
		url: remoteServer+'/test2bsure/post',
		type: 'POST',
		contentType: "application/json",
		data: JSON.stringify(postData),
		success: function(response){
			console.log(response);
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};

asknanswercommonController.prototype.autoSize = function (dom) 
{
	var el = dom;
	setTimeout(function () {
		el.css('height', 'auto');
		var scrollHeight = Math.max(38, el.prop('scrollHeight'));
		el.css('height', scrollHeight + 'px')
	}, 0)
};
/* Create Post UI, API call, Validation */

/* Populate Posts */
asknanswercommonController.prototype.PopulatePosts = function(data, dom)
{
	var html = "";
	if(data.response.status){
		for(var post in data.data){
			var postData = data.data[post];
			postData.content = postData.content.replace(/\n/g, "\/n");
			var postContent = JSON.parse(postData.content);
			html += "<div class='post' post-id='"+postData["id"]+"'>"+
						"<div class='user-profile'>"+
							"<div class='user-image'><span>"+(postData["userId"].substring(0,1)).toUpperCase()+"</span></div>"+
							"<div class='user-name'>"+postData["userId"]+"</div>"+
						"</div>";
			
			html += 	"<div class='post-content'>"+
							"<div class='post-title'>"+postContent["title"]+"</div>"+
							"<div class='post-desc'>"+postContent["desc"]+"</div>"+
						"</div>"+
						"<div class='post-attributes'>"+
							"<div class='count'>"+
								"<span class='like'><span>"+postData["likeCount"]+"</span> LIKES</span>"+
								"<span class='comment'><span>"+postData["commentCount"]+"</span> COMMENTS</span>"+
							"</div>"+
							"<div class='events'>"+
								"<span class='like'>LIKE</span>"+
								"<span class='comment hide'>COMMENT</span>"+
							"</div>"+
						"</div>"+
						"<div class='write-comment'>"+
							"<textarea class='txtComment' placeholder='Write Comment'></textarea>"+
							"<button class='button button-primary btnSubmitComment'>Submit</button>"+
						"</div>";
			html += "</div>";
		}
	}
	else{
		
	}
	$(dom).html(html);
	this.BindPostEvents(dom);
};
asknanswercommonController.prototype.BindPostEvents = function(dom)
{
	$(dom).find('.post').find('.events .like').unbind().bind('click', function(e){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			userId = userController.getObj().userData.id;
		}
		if(userId == "-1"){
			//User not logged in
			$('#btnLogin').click();
			return false;
		}
		this.LikePost(e, userId);
	}.bind(this));
};
asknanswercommonController.prototype.LikePost = function(e, userId)
{
	var postId = $(e.currentTarget).parents('.post').attr('post-id');
	$.ajax({
		url: remoteServer+'/test2bsure/like-post?postId='+postId+'&userId='+userId,
		type: 'PUT',
		contentType: "application/json",
		success: function(response){
			console.log(response);
			var currentLike = parseInt($(e.currentTarget).parents('.post').find('.count .like').find('span').html());
			$(e.currentTarget).parents('.post').find('.count .like').find('span').html(currentLike+1);
			$(e.currentTarget).unbind('click');
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
/* Populate Posts */