var app = angular.module('discussion_board', []);
//Login controller
var loginController = function($scope, $http, $window){
	$scope.loginFunction = function(user){
		
		console.log("Inside login function");
		$http.post("http://localhost:8080/login", user).then(
			function mySuccess(response){
				console.log("Inside success: "+JSON.stringify(response));
				$scope.message = response.data;
				localStorage.setItem('user_id', response.data);
				localStorage.setItem('loggedIn', true);
				$window.location.href = "Dashboard.html";
			},
			function myError(response){
				console.log("Inside error: "+JSON.stringify(response));
				$scope.message = response.data;
			}
		)
	}
}
app.controller('loginController', loginController);

//Register controller
var registerController = function($scope, $http, $window){
	$scope.registerFunction = function(user){
		
		console.log("Inside register function");
		$http.post("http://localhost:8080/register", user).then(
			function mySuccess(response){
				console.log("Inside success: "+JSON.stringify(response));
				$scope.message = response.data;
				localStorage.setItem('user_id', response.data);
				
				$window.location.href = "Dashboard.html";
			},
			function myError(response){
				console.log("Inside error: "+JSON.stringify(response));
				$scope.message = response.data;
			}
		)
	}
}
app.controller('registerController', registerController);

//function to be called on load of Add posts page, to check if the request is from add post or update post
function addPostsOnload($window, $http, $scope){
	console.log("Inside add post on load");
	var query = $window.location.search;
	var fromValue;
	var id;
	console.log("Query: "+JSON.stringify(query));
	if(query != ""){
		var queryStrings = query.split('&');
		fromValue = (queryStrings[0].split('='))[1];
		id = (queryStrings[1].split('='))[1];
		console.log("fromValue: "+fromValue);
		console.log("id: "+id);
	}
	if(fromValue=="edit"){
		console.log("Update post");
		$http.get("http://localhost:8080/get-discussion-by-id?discussion_id="+id).then(
			function mySuccess(response){
				console.log("Inside success: "+JSON.stringify(response.data));
				$scope.updateHeadline = response.data[0].headline;
				$scope.updateDetails = response.data[0].details;
			},
			function myError(response){
				console.log("Inside error: "+JSON.stringify(response.data));
				$scope.posts = response.data;
			}
		)
	}
}

//add discussion
var addDiscussionController = function($scope, $http, $window, $location){
	addPostsOnload($window, $http, $scope);
	$scope.addDiscussionFunction = function(discussion){
		//discussion.id = localStorage.getItem('user_id');
		discussion.id =  "DikshaBajaj-14664";
		discussion.user_id = "DikshaBajaj-14664";
		console.log("Inside add/update discussion function");
		var query = $window.location.search;
		var fromValue;
		var id;
		console.log("Query: "+JSON.stringify(query));
		if(query != ""){
			var queryStrings = query.split('&');
			fromValue = (queryStrings[0].split('='))[1];
			id = (queryStrings[1].split('='))[1];
			console.log("fromValue: "+fromValue);
			console.log("id: "+id);
		}
		if(fromValue=="edit"){
			console.log("Inside updating discussion");
			$http.put("http://localhost:8080/update-discussion", discussion).then(
				function mySuccess(response){
					console.log("Inside success: "+JSON.stringify(response));
					$scope.message = response.data;				
					$window.location.href = "discussions.html";
				},
				function myError(response){
					console.log("Inside error: "+JSON.stringify(response));
					$scope.message = response.data;
				}
			)
		}
		else{
			console.log("Inside adding discussion");
			$http.post("http://localhost:8080/add-discussion", discussion).then(
				function mySuccess(response){
					console.log("Inside success: "+JSON.stringify(response));
					$scope.message = response.data;
					$window.location.href = "discussions.html";
				},
				function myError(response){
					console.log("Inside error: "+JSON.stringify(response));
					$scope.message = response.data;
				}
			)
		}
	}
}
app.controller('addDiscussionController', addDiscussionController);


//Function to be called on load of myposts page, to display all the posts of the person logged in
function myPostsFunction($http, $scope){
	var user_id = localStorage.getItem('user_id');
	console.log("Inside get myPosts function");

	$http.get("http://localhost:8080/get-discussion-by-user-id?user_id="+user_id).then(
		function mySuccess(response){
			console.log("Inside success: "+JSON.stringify(response.data));
			$scope.posts = response.data;
		},
		function myError(response){
			console.log("Inside error: "+JSON.stringify(response.data));
			$scope.posts = response.data;
		}
	)
}
	
//related to my posts, displaying all, edit and delete
var myPostsController = function($scope, $http, $window){
	myPostsFunction($http, $scope);
	$scope.deletePostFunction = function(id){
		console.log("Inside delete discussion function: "+id);
		//var postId = (id.split("-"))[1];
		$http.delete("http://localhost:8080/delete-discussion?id="+id).then(
			function mySuccess(response){
				console.log("Inside success: "+JSON.stringify(response.data));
				myPostsFunction($http, $scope);	
			},
			function myError(response){
				console.log("Inside error: "+JSON.stringify(response.data));
				
			}
		)
	}
	$scope.editPostFunction = function(id){
		console.log("Inside edit discussion function: "+id);
		window.location.href = "add-discussion.html?from=edit&id="+id;
	}
}
app.controller('myPostsController', myPostsController);



//Function to get all discussions of all the users, to be called on the load of All Discussions page(Login or not)
function getAllDiscussionsFunction($http, $scope){
	console.log("Inside get all discussions function");

	$http.get("http://localhost:8080/get-all-discussions").then(
		function mySuccess(response){
			console.log("Inside success: "+JSON.stringify(response.data));
			$scope.allDiscussions = response.data;
		},
		function myError(response){
			console.log("Inside error: "+JSON.stringify(response.data));
			$scope.allDiscussions = response.data;
		}
	)
}

//related to all discussions
var allDiscussionsController = function($scope, $http, $window){
	getAllDiscussionsFunction($http, $scope);
	/*var value = localStorage.getItem('loggenIn');
	if(value == true){
		$scope.login = true;
	}
	else{
		$scope.login = false;
	}*/
}

app.controller('allDiscussionsController', allDiscussionsController);