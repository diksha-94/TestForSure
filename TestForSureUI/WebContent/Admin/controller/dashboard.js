var dashboardController = function(){
	this.userId = "";
	this.Init();
};
dashboardController.prototype.Init = function()
{
	$('.page-header').html(this.LoadHeader());
	$('.admin-menu').html(this.LoadMenu());
	this.BindEvents();
	new menuController($('.admin-menu'));
	this.userId = getCookie('test2bsure_admin');
	if(this.userId){
		//Already login
		$('.login-box').css('display', 'none');
		$('.page-header').find('.admin-profile').css('display', 'block');
		$('.after-login').css('display', 'block');
	}
	else{
		$('.login-box').css('display', 'block');
		$('.page-header').find('.admin-profile').css('display', 'none');
		$('.after-login').css('display', 'none');
	}
};
dashboardController.prototype.LoadHeader = function()
{
	var html = "<div class='brand-logo'>"+
					"<img src = '../../Images/Test2bSure_Logo.jpg' alt='TEST2BSURE'/>"+
			   "</div>"+
			   "<div class='admin-profile'>"+
					"<button class='btn btn-default adminChangePassword'>Change Password</button>"+
					"<button id='btnLogout' class='btn btn-primary'>Logout</button>"+
			   "</div>";
	return html;
};
dashboardController.prototype.LoadMenu = function()
{
	var html = "<ul>"+
					"<li id='menuDashboard' data-action='menu_dashoard' data-title='Dashboard' data-controller='backenddashboard'>"+
					"<span>Dashboard</span>"+
				"</li>"+
				"<li id='menuCategory' data-action='menu_category' data-title='Category' data-controller='category'>"+
					"<span>Category</span>"+
				"</li>"+
				"<li id='menuExam' data-action='menu_exam' data-title='Exam' data-controller='exam'>"+
					"<span>Exam</span>"+
				"</li>"+
				"<li id='menuQuestionBank' data-action='menu_question_bank' data-title='Question Bank' data-controller='questionbank'>"+
					"<span>Question Bank</span>"+
				"</li>"+
				"<li id='menuTest' data-action='menu_test' data-title='Test' data-controller='test'>"+
					"<span>Test</span>"+
				"</li>"+
				"<li id='menuQuiz' data-action='menu_quiz' data-title='Quiz' data-controller='quiz'>"+
					"<span>Quiz</span>"+
				"</li>"+
				"<li id='menuUser' data-action='menu_user' data-title='User Tracking' data-controller='usertracking'>"+
					"<span>User Tracking</span>"+
				"</li>"+
				"<li id='menuFilter' data-action='menu_filter' data-title='Filter' data-controller='filter'>"+
					"<span>Filter</span>"+
				"</li>"+
				"<li id='menuAskNAnswer' data-action='menu_asknanswer' data-title='Ask & Answer' data-controller='asknanswer'>"+
					"<span>Ask & Answer</span>"+
				"</li>"+
			"</ul>";
	return html;
};
dashboardController.prototype.BindEvents = function()
{
	$('.adminChangePassword').unbind().bind('click', function(){
		$('#changePasswordModal').modal('show');
		$('#changePasswordModal').find('#btnChangePassword').unbind().bind('click', function(){
			this.ChangePassword();
		}.bind(this));
	}.bind(this));
	$('#btnLogin').unbind().bind('click', function(){
		$('.error-message').empty();
		var email = $('#txtEmail').val();
		var password = $('#passPassword').val();
		if(email == '' || password == ''){
			$('.error-message').html('Email or password cannot be empty');
			return;
		}
		if(!validateEmail(email)){
			$('.error-message').html('Email is not valid');
			return;
		}
		if(password.length < 6){
			$('.error-message').html('Password cannot be smaller than 6 characters');
			return;
		}
		this.Login(email, password);
	}.bind(this));
	$('#btnLogout').unbind().bind('click', function(){
		this.Logout();
	}.bind(this));
};
dashboardController.prototype.Login = function(email, password)
{
	var url = remoteServer+'/test2bsure/authenticate-user'
	var type = 'POST';
	var requestData = {
		"email": email,
		"password": password,
		"isAdmin": 1
	};
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			console.log(response);
			if(response.result.status == true){
				setCookie("test2bsure_admin", response.userId, 1);
				window.location.reload();
			}
			else{
				$('.error-message').html(response.result.message);
			}
			
		},
		error: function(e){
			console.log(e);
		}
	});
}
dashboardController.prototype.Logout = function()
{
	this.userId = "";
	//remove the cookie
	setCookie("test2bsure_admin", "", -1);
	window.location.reload();
}

dashboardController.prototype.ChangePassword = function()
{
	var newPassword = $('#passNew').val();
	var newReenterPassword = $('#passNewReenter').val();
	if(newPassword.length == 0 || newReenterPassword.length == 0){
		$('.password-error').html("Please enter all the fields.");
		return;
	}
	if(newPassword.length < 6){
		$('.password-error').html("Password should contain atleast 6 characters.");
		return;
	}
	if(newPassword != newReenterPassword){
		$('.password-error').html("Please re-enter the same password.");
		return;
	}
	var url = remoteServer+'/test2bsure/changepassword'
	var type = 'PUT';
	var requestData = {
		"emailId": this.userId,
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
				$('.password-error').html(response.message);
			}
			
		},
		error: function(e){
			console.log(e);
		}
	});
}