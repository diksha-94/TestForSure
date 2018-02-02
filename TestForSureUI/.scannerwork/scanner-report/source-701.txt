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
	}
	else{
		//the user is not logged in, so first go to home and login
		window.location.href = 'home.html';
	}
})

