var usertrackingController = function(){
	this.users = {};
	this.Init();
};
usertrackingController.prototype.Init = function()
{
	console.log('Initiate user');
	this.LoadView();
};
usertrackingController.prototype.BindEvents = function()
{
	//Search user by name/e-mail - textbox
	$("#txtSearchUser").unbind().bind('keypress', function(e){
		if($(e.currentTarget).val().length > 0){
			$('#btnSearchUser').css('pointer-events', 'auto');
		}
		else{
			$('#btnSearchUser').css('pointer-events', 'none');
		}
	});
	//Search user by name/e-mail - button
	$('#btnSearchUser').unbind().bind('click', function(){
		this.SearchUserByName();
	}.bind(this));
	
	//View User
	$('.btnViewUser').unbind().bind('click', function(e){
		$('#userModal').modal('show');
		this.PopulateUser(e);
	}.bind(this));
};
usertrackingController.prototype.LoadView = function()
{
	$('.menu-page-content').load('usertracking.html', function(){
		this.LoadAllUsers(function(){
			this.BindEvents();
		}.bind(this));
	}.bind(this));
};
usertrackingController.prototype.LoadAllUsers = function(callback)
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/users',
		type: 'GET',
		contentType: 'application/json',
		context: this,
		success: function(response){
			if(response.length > 0){
				this.users = response;
				var userObj = "";
				for(var user in response){
					userObj += "<tr>"+
					"<td class='tdUserId'>"+response[user]['id']+"</td>"+
					"<td class='tdUserName'>"+response[user]['name']+"</td>"+
					"<td class='tdUserEmail'>"+response[user]['email']+"</td>"+
					"<td class='tdUserCreatedOn'>"+response[user]['createdOn']+"</td>"+
					"<td>"+
						"<button class='btn btn-default btnViewUser'>View</button>"+
					"</td>"+
					"</tr>";
				}
				$('.existing-users').find('table').find('tbody').append(userObj);
			}
			callback();
		},
		error: function(e){
			console.log(e);
			callback();
		}
	});
};
usertrackingController.prototype.PopulateUser = function(e)
{
	
};
usertrackingController.prototype.SearchUserByName = function()
{
	console.log('Searching user by name/email');
};