var dashboardController = function(){
	this.userProfile = {};
	this.userRewards = {};
	this.userExams = {};
	this.userId = -1;
	this.Init();
};
dashboardController.prototype.Init = function()
{
	this.LoadPage();
	if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
		this.userId = userController.getObj().userData.id;
	}
	if(this.userId == -1){
		//Show not logged in msg
		$('.dashboard-content').html($('<h4>You are not logged in !!</h4>'));
	}
	else{
		this.LoadUserProfile();
		this.LoadUserRewards();
		this.LoadUserExams();
		$('.dashboard-content').find('.btnLogout').unbind().bind('click', function(){
			userController.getObj().Logout(function(){
				window.location.href = "/";
			});
		});
	}
};
dashboardController.prototype.LoadPage = function()
{
	var html = "<div class='outerDiv col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='top col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
					"<div class='profile col-xs-12 col-sm-12 col-md-8 col-lg-8'>"+
					"</div>"+
					"<div class='rewards col-xs-12 col-sm-12 col-md-4 col-lg-4'>"+
					"</div>"+
				"</div>"+
				"<div class='exams col-xs-12 col-sm-12 col-md-12 col-lg-12'>"+
				"</div>"+
				"<div class='logout col-xs-12 col-sm-12 col-md-12 col-lg-12 hide'>"+
					"<button class='button button-primary btnLogout'>Logout</button>"+
				"</div>"+
				"</div>";
	$('body .common-content').append(html);
	$('body .common-content').addClass('dashboard-content');
};
dashboardController.prototype.LoadUserProfile = function()
{
	fetch(remoteServer+'/test2bsure/user-profile?userId='+this.userId)
	  .then(response => response.json())
	  .then(data => this.SetState({ userProfile: data.userDetails }, 'profile'));
}
dashboardController.prototype.LoadUserRewards = function()
{
	fetch(remoteServer+'/test2bsure/user-rewards?userId='+this.userId)
	  .then(response => response.json())
	  .then(data => this.SetState({ userRewards: data.rewards }, 'rewards'));
}
dashboardController.prototype.LoadUserExams = function()
{
	fetch(remoteServer+'/test2bsure/user-exams?userId='+this.userId)
	  .then(response => response.json())
	  .then(data => this.SetState({ userExams: data.userAttempts }, 'attempts'));
}
dashboardController.prototype.SetState = function(obj, callFunc)
{
	for(var key in obj){
		this[key] = obj[key];
	}
	switch(callFunc){
		case "profile":
			this.PopulateUserProfile();
			break;
		case "rewards":
			this.PopulateUserRewards();
			break;
		case "attempts":
			this.PopulateUserExams();
			break;
	}
};
dashboardController.prototype.PopulateUserProfile = function()
{
	var html = "<div class='user'>"+
					"<i class='fa fa-user' aria-hidden='true'></i>"+
					"<span class='username'>"+this.userProfile.name+"</span>"+
			   "</div>"+
			   "<div class='contact'>"+
			   		"<span>Email- "+this.userProfile.email+"</span>"+
			   		"<span>Mobile No.- "+this.userProfile.mobileno+"</span>"+
			   "</div>"+
		   	   "<div class='action'>"+
		   	   		"<button class='button button-primary btnEditProfile'>Edit Profile</button>"+
		   	   		"<button class='button button-default btnChangePassword'>Change Password</button>"+
		   	   "</div>";
	$('.profile').html(html);
	var self = this;
	$('.btnEditProfile').unbind().bind('click', function(){
		if($('#editProfileModal').length == 0){
			$('body').append(editProfileModal());
		}
		$('#editProfileModal').modal('show');
		$('#editProfileModal').find('#txtName').val(self.userProfile.name);
		$('#editProfileModal').find('#txtEmail').val(self.userProfile.email);
		$('#editProfileModal').find('#txtMobile').val(self.userProfile.mobileno);
		$('#editProfileModal').find('#errorMessage').html("");
		$('#editProfileModal').find('#btnEdit').unbind().bind('click', function(){
			var name = $('#editProfileModal').find('#txtName').val();
			var mobileNo = $('#editProfileModal').find('#txtMobile').val();
			if(name.length == 0 || mobileNo.length == 0){
				$('#editProfileModal').find('#errorMessage').html("Please enter all the fields.");
				return;
			}
			if(mobileNo.length != 10){
				$('#editProfileModal').find('#errorMessage').html("Mobile Number should be of 10 digits.");
				return;
			}
			$('#editProfileModal').find('#errorMessage').html("");
			var url = remoteServer+'/test2bsure/updateprofile'
			var type = 'PUT';
			var userId = -1;
			if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
				userId = userController.getObj().userData.id;
			}
			if(userId == -1){
				alert("You are not logged in");
			}
			var requestData = {
				"id": userId,
				"name": name,
				"mobileno": mobileNo,
			};
			$.ajax({
				url: url,
				type: type,
				contentType: "application/json",
				data: JSON.stringify(requestData),
				success: function(response){
					if(response.status == true){
						alert("Profile updated successfully");
						$('#editProfileModal').modal('hide');
						window.location.reload();
					}
					else{
						$('#editProfileModal').find('#errorMessage').html(response.message);
					}
					
				},
				error: function(e){
					console.log(e);
				}
			});
		});
	});
	$('.btnChangePassword').unbind().bind('click', function(){
		if($('#changePasswordModal').length == 0){
			$('body').append(changePasswordModal());
		}
		$('#changePasswordModal').modal('show');
		$('#changePasswordModal').find('#errorMessage').html("");
		$('#changePasswordModal').find('#btnChangePass').unbind().bind('click', function(){
			var newPassword = $('#changePasswordModal').find('#txtPass').val();
			var newReenterPassword = $('#changePasswordModal').find('#txtConfirmPass').val();
			if(newPassword.length == 0 || newReenterPassword.length == 0){
				$('#changePasswordModal').find('#errorMessage').html("Please enter all the fields.");
				return;
			}
			if(newPassword.length < 6){
				$('#changePasswordModal').find('#errorMessage').html("Password should contain atleast 6 characters.");
				return;
			}
			if(newPassword != newReenterPassword){
				$('#changePasswordModal').find('#errorMessage').html("Please re-enter the same password.");
				return;
			}
			$('#changePasswordModal').find('#errorMessage').html("");
			var url = remoteServer+'/test2bsure/changepassword'
			var type = 'PUT';
			var userId = -1;
			if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
				userId = userController.getObj().userData.id;
			}
			if(userId == -1){
				alert("You are not logged in");
			}
			var requestData = {
				"emailId": userId,
				"newPassword": newPassword,
			};
			$.ajax({
				url: url,
				type: type,
				contentType: "application/json",
				data: JSON.stringify(requestData),
				success: function(response){
					if(response.status == true){
						alert("Password updated successfully");
						$('#changePasswordModal').modal('hide');
					}
					else{
						$('#changePasswordModal').find('#errorMessage').html(response.message);
					}
					
				},
				error: function(e){
					console.log(e);
				}
			});
		});
	});
};
dashboardController.prototype.PopulateUserRewards = function()
{
	console.log(this.userRewards);
	var html = "<div class='earned-points'>"+
					"<img src='WebContent/Portal/images/final/coin.png'>"+
					"<span>"+this.userRewards+"</span>"+
			   "</div>"+
			   "<div class='history'>"+
			   		"<button class='button button-primary btnRewardHistory'>Reward Points History</button>"+
			   "</div>";
	$('.rewards').html(html);
	$('.btnRewardHistory').unbind().bind('click', function(){
		var userId = -1;
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			var userId = userController.getObj().userData.id;
		}
		if(userId == -1){
			window.reload();
		}
		else{
			fetch(remoteServer+'/test2bsure/user-reward-history?userId='+this.userId)
			  .then(response => response.json())
			  .then(data => this.ShowRewardHistory(data));
		}
	}.bind(this));
};
dashboardController.prototype.PopulateUserExams = function()
{
	var html = "<h4>My Attempts</h4>";
	$('.dashboard-content').find('.outerDiv .exams').append(html);
	
	if(this.userExams == null){
		html = "<span style='color:#FF0000;'>No Attempts Yet</span>";
		$('.dashboard-content').find('.outerDiv .exams').append(html);
		return;
	}
	for(var exam in this.userExams){
		console.log(exam);
		if(exam == 0){
			//Populate Others at the end
			continue;
		}
		this.DBExamCard(this.userExams[exam]);
		
	}
	if(typeof this.userExams[0] != 'undefined' && (this.userExams[0].attemptedTestCount > 0 || this.userExams[0].attemptedQuizCount > 0)){
		var otherData = this.userExams[0];
		this.DBExamCard(otherData);
	}
};
dashboardController.prototype.DBExamCard = function(data)
{
	var html = "";
	html += '<div class="collapse-outer col-xs-12 col-sm-12 col-md-12 col-lg-12">';
	html += '<div class="collapsed exam-head col-xs-12 col-sm-12 col-md-12 col-lg-12" data-toggle="collapse" data-examid="'+data.id+'" data-target="#exam_collapse_'+data.id+'" aria-expanded="false">'+
				'<div class="heading col-xs-12 col-sm-12 col-md-4 col-lg-4"><span>'+data.title+'</span></div>';
	if(data.id != 0){
		html += '<div class="count col-xs-12 col-sm-12 col-md-6 col-lg-6">'+
					'<div class="test col-xs-12 col-sm-12 col-md-6 col-lg-6">'+
						'<span>Total Test <b>('+data.totalTestCount+')</b></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
						'<span>Attempted <b>('+data.attemptedTestCount+')</b></span>'+
					'</div>'+
					'<div class="quiz col-xs-12 col-sm-12 col-md-6 col-lg-6">'+
						'<span>Total Quiz <b>('+data.totalQuizCount+')</b></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
						'<span>Attempted <b>('+data.attemptedQuizCount+')</b></span>'+
					'</div>'+
				'</div>'+
				'<div class="buttonDiv col-xs-12 col-sm-12 col-md-2 co2-lg-2">'+
					'<button class="button button-primary btnExplore">Explore</button>'+
				'</div>';
	}
	html += '<div class="collapseImage">'+
				'<img src="WebContent/Portal/images/final/left_arrow.png">'+
			'</div>';
	html += '</div>';
	html += '<div id="exam_collapse_'+data.id+'" class="collapse exam-data col-xs-12 col-sm-12 col-md-12 col-lg-12" aria-expanded="false">'+
			'</div>';
	html += '</div>';
	$('.dashboard-content').find('.outerDiv .exams').append(html);
	$('.btnExplore').unbind().bind('click', function(e){
		e.stopPropagation();
		var examId = $(e.currentTarget).parents('.exam-head').attr('data-examid');
		window.location.href = "exam.html?id="+examId;
	});
	var self = this;
	$('.exam-head').unbind().bind('click', function(e){
		if($(e.currentTarget).hasClass('collapsed')){
			//alert("Expanded");
			$(e.currentTarget).find('.collapseImage img').attr('src', 'WebContent/Portal/images/final/down_arrow.png');
			$(e.currentTarget).find('.collapseImage img').css('transform', 'rotate(180deg)');
			if($(e.currentTarget).siblings('.exam-data').find('div.details').length > 0){
				//Data already populated, just open it
			}
			else{
				//Get the data and populate it
				var examId = $(e.currentTarget).attr('data-examid');
				fetch(remoteServer+'/test2bsure/user-exam-attempts?userId='+self.userId+'&examId='+examId)
				  .then(response => response.json())
				  .then(data => self.PopulateExamItemData(data, e, examId));
			}
		}
		else{
			//alert("Collapsed");
			$(e.currentTarget).find('.collapseImage img').attr('src', 'WebContent/Portal/images/final/left_arrow.png');
			$(e.currentTarget).find('.collapseImage img').css('transform', 'rotate(270deg)');
		}
	});
};
dashboardController.prototype.PopulateExamItemData = function(data, e, examId){
	var html = "";
	html += "<div class='details col-xs-12 col-sm-12 col-md-12 col-lg-12'></div>";
	$(e.currentTarget).siblings('.exam-data').html(html);
	if(data.userAttempts[examId].tests != null && data.userAttempts[examId].tests.length > 0){
		html = "<div class='tests col-xs-12 col-sm-12 col-md-6 col-lg-6'>"+
					"<h5>Tests</h5>"+
				"</div>";
		$(e.currentTarget).siblings('.exam-data').find('.details').append(html);
		for(var test in data.userAttempts[examId].tests){
			var testData = data.userAttempts[examId].tests[test];
			//if test already exists
			if($(e.currentTarget).siblings('.exam-data').find('.details .tests').find('.test-card[data-itemid='+testData.itemId+']').length > 0){
				//Modify the existing test card's action
				var actions = $(e.currentTarget).siblings('.exam-data').find('.details .tests').find('.test-card[data-itemid='+testData.itemId+']').find('.actions');
				if($(actions).find('button').length > 1){
					//Don't do anything
				}
				else{
					var buttonAction = $(actions).find('button').attr('data-action');
					if(buttonAction == "resume" && testData.state == 2 || buttonAction == "report" && testData.state == 1){
						//Add another action
						html = "<button class='button button-default btnTestResume' data-action='resume'>Resume</button>"+
							   "<button class='button button-primary btnTestReport' data-action='report'>Report</button>";
						$(actions).html(html);
					}
				}
			}
			else{
				html = "<div class='test-card' data-itemid='"+testData.itemId+"'>"+
							"<span>"+testData.title+"</span>"+
							"<div class='actions'>";
				if(testData.state == 1){
					//Test in progress
					html += "<button class='button button-default btnTestResume' data-action='resume'>Resume</button>";
				}
				else if(testData.state == 2){
					html += "<button class='button button-primary btnTestReport' data-action='report'>Report</button>";
				}
				html += "</div>"+
						"</div>";
				$(e.currentTarget).siblings('.exam-data').find('.details .tests').append(html);
			}
		}
		$('.btnTestResume').unbind().bind('click', function(e){
			var userId = -1;
			if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
				userId = userController.getObj().userData.id;
			}
			if(userId == -1){
				//User not logged in
				$('#btnLogin').click();
				return false;
			}
			var testId = $(e.currentTarget).parents('.test-card').attr('data-itemid');
			window.open('take-test.html?id='+testId, '_blank');
		});
		$('.btnTestReport').unbind().bind('click', function(e){
			var userId = -1;
			if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
				userId = userController.getObj().userData.id;
			}
			if(userId == -1){
				//User not logged in
				$('#btnLogin').click();
				return false;
			}
			var testId = $(e.currentTarget).parents('.test-card').attr('data-itemid');
			//Get the last session Id
			var url = remoteServer+'/test2bsure/testsessionid?testId='+testId+'&userId='+userId;
			var type = 'GET';
			$.ajax({
				url: url,
				type: type,
				contentType: "application/json",
				context: this,
				success: function(response){
					console.log(response);
					window.open('testreport.html?sessionId='+response+'&report=1', '_blank');
				},
				error: function(e){
					console.log(e);
				}
			});
		});
	}
	if(data.userAttempts[examId].quizzes != null && data.userAttempts[examId].quizzes.length > 0){
		html = "<div class='quizzes col-xs-12 col-sm-12 col-md-6 col-lg-6'>"+
					"<h5>Quizzes</h5>"+
				"</div>";
		$(e.currentTarget).siblings('.exam-data').find('.details').append(html);
		for(var quiz in data.userAttempts[examId].quizzes){
			var quizData = data.userAttempts[examId].quizzes[quiz];
			html = "<div class='quiz-card' data-itemid='"+quizData.itemId+"'>"+
						"<span>"+quizData.title+"</span>"+
						"<div class='actions'>";
			if(quizData.state == 1){
				//Quiz in progress
				html += "<button class='button button-default btnQuizAction'>Resume</button>";
			}
			else if(quizData.state == 2){
				html += "<button class='button button-primary btnQuizAction'>Report</button>";
			}
			html += "</div>"+
					"</div>";
			$(e.currentTarget).siblings('.exam-data').find('.details .quizzes').append(html);
		}
		$('.btnQuizAction').unbind().bind('click', function(e){
			var userId = -1;
			if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
				userId = userController.getObj().userData.id;
			}
			if(userId == -1){
				//User not logged in
				$('#btnLogin').click();
				return false;
			}
			var quizId = $(e.currentTarget).parents('.quiz-card').attr('data-itemid');
			window.open('take-quiz.html?id='+quizId, '_blank');
		});
	}
};
dashboardController.prototype.ShowRewardHistory = function(data){
	if(data.response.status == false){
		alert("No Reward History available !!");
	}
	else{
		var html = '';
		if($('#rewardHistoryModal').length == 0){
			$('body').append(rewardHistoryModal());
		}
		$('#rewardHistoryModal').modal('show');
		//Populate data
		for(var record in data.rewardHistory){
			var history = data.rewardHistory[record];
			var title = (history.itemType == 0) ? data.testTitle[history.itemId] : data.quizTitle[history.itemId] 
			html += "<tr>"+
						"<td>"+history.itemId+"</td>"+
						"<td class='name'>"+title+"</td>"+
						"<td>" + ((history.itemType == 0)? "Test" : "Quiz") + "</td>"+
						"<td>"+history.rewardPoints+"</td>"+
						"<td>"+history.createdOn+"</td>"+
					"</tr>";
		}
		$('#rewardHistoryModal').find('tbody').html(html);
	}
}