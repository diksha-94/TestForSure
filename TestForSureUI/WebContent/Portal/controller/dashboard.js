var dashboardController = function(){
	this.userProfile = {};
	this.userRewards = {};
	this.userExams = {};
	this.userId = -1;
	this.Init();
};
dashboardController.prototype.Init = function()
{
	//Load header
	test2bsureController.getObj().GetHeader(".dashboard-header", function(){
		if(typeof userController != 'undefined' && typeof userController.getObj() != 'undefined' && (typeof userController.getObj().userData != 'undefined' && userController.getObj().userData != null) && typeof userController.getObj().userData.id != 'undefined'){
			this.userId = userController.getObj().userData.id;
		}
		if(this.userId == -1){
			//Show not logged in msg
			$('.dashboard-content').html($('<h4>You are not logged in !!</h4>'));
			//Load footer
			test2bsureController.getObj().GetFooter(".dashboard-footer");
			$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+'px');
		}
		else{
			this.LoadUserProfile();
			this.LoadUserRewards();
			this.LoadUserExams();
		}
	}.bind(this));
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
			test2bsureController.getObj().GetFooter(".dashboard-footer");
			$('.common-footer').css('top',$('.common-header').height() + $('.common-content').height()+'px');
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
					"<img src='../images/final/coin.png'>"+
					"<span>"+this.userRewards+"</span>"+
			   "</div>"+
			   "<div class='history'>"+
			   		"<button class='button button-primary btnRewardHistory'>Reward Points History</button>"+
			   "</div>";
	$('.rewards').html(html);
};
dashboardController.prototype.PopulateUserExams = function()
{
	var html = "<h4>My Attempts</h4>";
	$('.dashboard-content').find('.outerDiv .exams').append(html);
	
	for(var exam in this.userExams){
		console.log(exam);
		if(exam == 0){
			//Populate Others at the end
			continue;
		}
		this.DBExamCard(this.userExams[exam]);
		
	}
	if(typeof this.userExams[0] != 'undefined'){
		var otherData = this.userExams[0];
		this.DBExamCard(otherData);
	}
};
dashboardController.prototype.DBExamCard = function(data)
{
	var html = "";
	html += '<div class="collapsed exam-head col-xs-12 col-sm-12 col-md-12 col-lg-12" data-toggle="collapse" data-examid="'+data.id+'" data-target="#exam_collapse_'+data.id+'" aria-expanded="false">'+
				'<div class="heading col-xs-12 col-sm-12 col-md-4 col-lg-4"><span>'+data.title+'</span></div>';
	if(data.id != 0){
		html += '<div class="count col-xs-12 col-sm-12 col-md-6 col-lg-6">'+
					'<div class="test col-xs-12 col-sm-12 col-md-6 col-lg-6">'+
						'<span>Total Test - '+data.totalTestCount+'</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
						'<span>Attempted - '+data.attemptedTestCount+'</span>'+
					'</div>'+
					'<div class="quiz col-xs-12 col-sm-12 col-md-6 col-lg-6">'+
						'<span>Total Quiz - '+data.totalQuizCount+'</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
						'<span>Attempted - '+data.attemptedQuizCount+'</span>'+
					'</div>'+
				'</div>'+
				'<div class="buttonDiv col-xs-12 col-sm-12 col-md-2 co2-lg-2">'+
					'<button class="button button-primary btnExplore">Explore</button>'+
				'</div>';
	}
	html += '<div class="collapseImage">'+
				'<img src="../images/final/left_arrow.png">'+
			'</div>';
	html += '</div>';
	html += '<div id="exam_collapse_'+data.id+'" class="collapse exam-data" aria-expanded="false">ljhg'+
			'</div>';
	$('.dashboard-content').find('.outerDiv .exams').append(html);
	$('.btnExplore').unbind().bind('click', function(e){
		e.stopPropagation();
		var examId = $(e.currentTarget).parents('.exam-head').attr('data-examid');
		window.location.href = "exam.html?id="+examId;
	});
	$('.exam-head').unbind().bind('click', function(e){
		if($(e.currentTarget).hasClass('collapsed')){
			//alert("Expanded");
			$(e.currentTarget).find('.collapseImage img').css('transform', 'rotate(90deg)');
		}
		else{
			//alert("Collapsed");
			$(e.currentTarget).find('.collapseImage img').css('transform', 'rotate(270deg)');
		}
	})
};