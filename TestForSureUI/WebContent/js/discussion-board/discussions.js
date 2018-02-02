var attemptedTests = {};


$('#linkLogout').on('click', function(){
	localStorage.clear();
	window.location.href = 'home.html';
})
$(document).ready(function () {
	console.log("Document is ready");
		
	console.log("Logged in: "+localStorage.getItem('loggedIn'));
	if(localStorage.getItem('loggedIn') == "true"){
		//means the user is logged in
		$('#loggedInUSer').text(" "+localStorage.getItem('username'));
		$('#menuLogin').addClass('hide');
		$('#menuLogin').removeClass('show');
		$('#menuLogout').removeClass('hide');
		$('#menuLogout').addClass('show');
		$('#userProfile').removeClass('hide');
		$('#userProfile').addClass('show');
		//get the attempted tests and mark them
		console.log("Email: "+localStorage.getItem('email'));
	}
	else{
		$('#menuLogin').removeClass('hide');
		$('#menuLogin').addClass('show');
		$('#menuLogout').addClass('hide');
		$('#menuLogout').removeClass('show');
		$('#userProfile').addClass('hide');
		$('#userProfile').removeClass('show');
	}
								
})


