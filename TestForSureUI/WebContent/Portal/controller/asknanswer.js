var asknanswerController = function(){
	this.connect = "http://3.6.58.203:8086/asknanswer/post/";
	this.posts = {};
	this.state = 0;
	this.exams = [];
	this.getPostUrl = this.connect+'get';
	this.Init();
};
asknanswerController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".asknanswer-header");
	this.BindPageEvents();
	this.GetExams();
	
	
	//Load footer
	test2bsureController.getObj().GetFooter(".asknanswer-footer");
};
asknanswerController.prototype.BindPageEvents = function()
{
	$('.postFilter').unbind().bind('click', function(e){
		if($(e.currentTarget).hasClass('active')){
			return;
		}
		var examIds = [];
		this.getPostUrl = this.connect+'get?';
		$('.exams .check-box').each(function(key, value){
			if($(value).find('input').prop('checked') == true){
				examIds.push($(value).find('input').attr('value'));
			}
		});
		console.log(examIds);
		if(examIds.length > 0){
			this.getPostUrl += 'examid='+examIds;
		}
		if($(e.currentTarget).hasClass('allPosts')){
			//Populate all posts
			$('.right.discussion').find('.all-posts').find('.head h3').text('All Posts');
			this.LoadPosts(this.getPostUrl);
			$('.postFilter').removeClass('active');
			$(e.currentTarget).addClass('active');
		}
		if($(e.currentTarget).hasClass('myPosts')){
			//Populate my posts
			if(userController.getObj().userData == null){
				//User not logged in, show login modal
			}
			else{
				//Display my Posts
				$('.right.discussion').find('.all-posts').find('.head h3').text('My Posts');
				this.getPostUrl += "&userid=diksha-45";//+userController.getObj().userData.id);
				this.LoadPosts(this.getPostUrl);
				$('.postFilter').removeClass('active');
				$(e.currentTarget).addClass('active');
			}
		}
	}.bind(this));
};
asknanswerController.prototype.BindAskPostEvents = function()
{
	var html = "";
	for(var exam in this.exams){
		html += "<option value='"+this.exams[exam]["id"]+"'>"+this.exams[exam]["title"]+"</option>";
	}
	$('.ask-post').find('.ddExam').append(html);
	$('.ask-post').find('textarea').unbind().bind('keydown', this, function (e) {
		e.data.autoSize($(this))
	});
	$('.ask-post').find('.btnSubmitPost').unbind().bind('click', function(){
		if(userController.getObj().userData == null){
			//User not logged in, show login modal
			return;
		}
		this.SubmitPost();
	}.bind(this));
};

asknanswerController.prototype.autoSize = function (dom) 
{
	var el = dom;
	setTimeout(function () {
		el.css('height', 'auto');
		var scrollHeight = Math.max(38, el.prop('scrollHeight'));
		el.css('height', scrollHeight + 'px')
	}, 0)
};
asknanswerController.prototype.SubmitPost = function()
{
	var postId = -1;
	var postType = 0;
	var examId = $('.ask-post').find('.ddExam').val();
	if(examId <= 0){
		alert("Please select exam");
		return;
	}
	var postTitle = $('.ask-post').find('.txtPostTitle').val();
	var postDesc = $('.ask-post').find('.txtPostDesc').val();
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
	var userId  = "diksha-45";
	
	var postData = {
			"postId": postId,
			"postType": postType,
			"examId": examId,
			"userId": userId,
			"content": JSON.stringify(content),
			"outputContent": outputContent
	};
	$.ajax({
		url: this.connect+'add',
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
asknanswerController.prototype.AddAPostCard = function()
{
	var html = "";
	html += "<div class='head'><h3>Ask your Query</h3></div>"+
			"<div class='exam-dd'><select class='ddExam'><option value=-1>Select Exam</option></select></div>"+
			"<div class='post-title'><textarea class='txtPostTitle' placeholder='Enter Post Title'></textarea></div>"+
			"<div class='post-desc'><textarea class='txtPostDesc' placeholder='Enter Post Description'></textarea></div>"+
			"<div class='post-submit'><button class='button button-primary btnSubmitPost'>Submit Post</button></div>";
	return html;
};
asknanswerController.prototype.LoadPosts = function(url)
{
	fetch(url)
	  .then(response => response.json())
	  .then(data => this.SetState({ posts: data.result, state: data.state }));
}
asknanswerController.prototype.SetState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.PopulatePosts();
	$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+'px');
};
asknanswerController.prototype.PopulatePosts = function()
{
	console.log("State: "+this.state);
	console.log(this.posts);
	var html = "";
	for(var post in this.posts){
		console.log("Inside loop");
		var data = this.posts[post];
		data.content = data.content.replace(/\n/g, "\/n");
		var postContent = JSON.parse(data.content);
		var commentCount = typeof data["comments"] != 'undefined' ? data["comments"].length : 0;
		var likeCount = typeof data["likeCount"] != 'undefined' ? data["likeCount"] : 0;
		html += "<div class='post' post-id='"+data["id"]+"'>"+
					"<div class='user-profile'>"+
						"<div class='user-image'><span>"+(data["userId"].substring(0,1)).toUpperCase()+"</span></div>"+
						"<div class='user-name'>"+data["userId"]+"";
		if(typeof data["approvedByAdmin"] != 'undefined'){
			if(data["approvedByAdmin"] == 1){
				html += "<span class=approved>Approved</span>";
			}
			else if(data["approvedByAdmin"] == 0){
				html += "<span class=not-approved>Not Approved</span>";
			}
		}
		html += 		"</div>"+
						"<div class='exam-name'>"+this.GetExamTitle(data["examId"])+"</div>";
		if(typeof data["approvedByAdmin"] != 'undefined'){
			html += "<div class='perform-actions'><div></div><div></div><div></div></div>";
		}
		html += 	"</div>"+
					"<div class='post-content'>"+
						"<div class='post-title'>"+postContent["title"]+"</div>"+
						"<div class='post-desc'>"+postContent["desc"]+"</div>"+
					"</div>"+
					"<div class='post-attributes'>"+
						"<div class='count'>"+
							"<span class='like'><span>"+likeCount+"</span> LIKES</span>"+
							"<span class='comment'><span>"+commentCount+"</span> COMMENTS</span>"+
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
		if(typeof data["comments"] != 'undefined'){
			for(var comment in data["comments"]){
				var commentData = data["comments"][comment];
				html += "<div class='comment-section' comment-id='"+commentData["commentId"]+"'>"+
							"<div class='user-profile'>"+
								"<div class='user-image'><span>"+(commentData["userId"].substring(0,1)).toUpperCase()+"</span></div>"+
								"<div class='user-name'>"+commentData["userId"]+"</div>"+
							"</div>"+
							"<div class='comment-content'>"+
								"<div class='comment-desc'>"+commentData["comment"]+"</div>"+
							"</div>"+
						"</div>";
			}
		}
		html += "</div>";
	}
	$('.asknanswer-content .discussion .all-posts .posts').html(html);
	this.BindEvents();
}
asknanswerController.prototype.GetExams = function()
{
	fetch(remoteServer+'/test2bsure/exam')
	  .then(response => response.json())
	  .then(data => this.SetExamState({ exams: data.data }));
};
asknanswerController.prototype.SetExamState = function(obj)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	this.LoadPosts(this.connect+'get');
	$('.asknanswer-content .discussion .ask-post').append(this.AddAPostCard());
	this.BindAskPostEvents();
	this.PopulateExamFilter();
};
asknanswerController.prototype.GetExamTitle = function(examId)
{
	var examTitle = "";
	for(var exam in this.exams){
		if(this.exams[exam]["id"] == examId){
			examTitle = this.exams[exam]["title"];
			break;
		}
	}
	return examTitle;
};
asknanswerController.prototype.BindEvents = function()
{
	$('.all-posts .post .post-attributes .events').find('.like').unbind().bind('click', function(e){
		if(userController.getObj().userData == null){
			//User not logged in, show login modal
			return;
		}
		this.LikeAPost($(e.currentTarget));
	}.bind(this));
	$('.all-posts .post .write-comment').find('.btnSubmitComment').unbind().bind('click', function(e){
		if(userController.getObj().userData == null){
			//User not logged in, show login modal
			return;
		}
		this.CommentOnAPost($(e.currentTarget));
	}.bind(this));
	$('.all-posts .post .write-comment').find('textarea').unbind().bind('keydown', this, function (e) {
		e.data.autoSize($(this))
	});
};
asknanswerController.prototype.LikeAPost = function(dom)
{
	var postId = $(dom).parents('.post').attr('post-id');
	var currentLikes = parseInt($(dom).parents('.post').find('.post-attributes .count .like').find('span').text());
	$.ajax({
		url: this.connect+'like/'+postId,
		type: 'PUT',
		success: function(response){
			console.log(response);
			if(response.state == 1){
				$(dom).text('LIKED');
				$(dom).unbind();
				$(dom).css('cursor', 'auto');
				$(dom).parents('.post').find('.post-attributes .count .like').find('span').text(currentLikes + 1); 
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
asknanswerController.prototype.CommentOnAPost = function(dom)
{
	var postId = $(dom).parents('.post').attr('post-id');
	var currentComments = parseInt($(dom).parents('.post').find('.post-attributes .count .comment').find('span').text());
	var comment = $(dom).siblings('.txtComment').val();
	if(comment.length == 0){
		alert("Comment cannot be empty");
		return;
	}
	var postData = {
			"comment": comment,
			"userId": "diksha-45"
	};
	$.ajax({
		url: this.connect+'comment/'+postId,
		type: 'POST',
		contentType: "application/json",
		data: JSON.stringify(postData),
		success: function(response){
			console.log(response);
			if(response.state == 1){
				$(dom).parents('.post').find('.post-attributes .count .comment').find('span').text(currentComments + 1);
				this.LoadPosts(this.getPostUrl);
				//alert("Commented added successfully.");
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};

asknanswerController.prototype.PopulateExamFilter = function()
{
	var html = "";
	for(var exam in this.exams){
		html += "<div class='check-box'><input type='checkbox' value='"+this.exams[exam]["id"]+"' data-exam-id='"+this.exams[exam]["id"]+"'><span>"+this.exams[exam]["title"]+"</span></input></div>";
	}
	$('.filters').find('.examFilter .exams').append(html);
	$('.filters').find('.examFilter').find('#btnApply').unbind().bind('click', function(){
		var examIds = [];
		$('.exams .check-box').each(function(key, value){
			if($(value).find('input').prop('checked') == true){
				examIds.push($(value).find('input').attr('value'));
			}
		});
		console.log(examIds);
		if(examIds.length > 0){
			this.getPostUrl = this.connect+'get?';
			this.getPostUrl += 'examid='+examIds;
			if($('.myPosts').hasClass('active')){
				this.getPostUrl += '&userid=diksha-45';//+userController.getObj().userData.id);
			}
			console.log(this.getPostUrl);
			this.LoadPosts(this.getPostUrl);
		}
	}.bind(this));
	$('.filters').find('.examFilter').find('#btnReset').unbind().bind('click', function(){
		$('.exams .check-box').each(function(key, value){
			$(value).find('input').prop('checked', false);
		});
		if($('.allPosts').hasClass('active')){
			this.getPostUrl = this.connect+'get';
			this.LoadPosts(this.getPostUrl);
		}
		else if($('.myPosts').hasClass('active')){
			this.getPostUrl = this.connect+'get?userid=diksha-45';//+userController.getObj().userData.id);
			this.LoadPosts(this.getPostUrl)
		}
	}.bind(this));
};