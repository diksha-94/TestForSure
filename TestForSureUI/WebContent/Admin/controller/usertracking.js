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
	//Search user by name/e-mail - button
	$('#btnSearchUser').unbind().bind('click', function(){
		this.SearchUserByName(function(){
			this.BindEvents();
		}.bind(this));
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
		url: 'http://localhost:8083/test2bsure/user',
		type: 'GET',
		contentType: 'application/json',
		context: this,
		success: function(response){
			if(response.response.status == true){
				if(response.data != null && response.data.length > 0){
					var users = response.data;
					var userObj = "";
					$('.userCount').text(response.response.message.split(":")[1].trim());
					for(var user in users){
						this.users[users[user]['id']] = users[user];
						if(users[user]['lastUpdatedOn'] == null){
							users[user]['lastUpdatedOn'] = '-';
						}
						userObj += "<tr>"+
						"<td class='tdUserId'>"+users[user]['id']+"</td>"+
						"<td class='tdUserName'>"+users[user]['name']+"</td>"+
						"<td class='tdUserEmail'>"+users[user]['email']+"</td>"+
						"<td class='tdUserCreatedOn'>"+users[user]['lastUpdatedOn']+"</td>"+
						"<td>"+
							"<button class='btn btn-default btnViewUser'>View</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-users').find('table').find('tbody').append(userObj);
				}
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
	var id = $(e.currentTarget).parents('tr').find('.tdUserId').text();
	var html = "<div>"+
					"<table>"+
						"<tr><td>User Id:    </td><td>"+this.users[id].id+"</td></tr>"+
						"<tr><td>Name:    </td><td>"+this.users[id].name+"</td></tr>"+
						"<tr><td>Email:    </td><td>"+this.users[id].email+"</td></tr>"+
						"<tr><td>Mobile Number:    </td><td>"+this.users[id].mobileno+"</td></tr>"+
						"<tr><td>Created On:    </td><td>"+this.users[id].lastUpdatedOn+"</td></tr>"+
						"<tr><td>Verified:    </td><td>"+this.users[id].verified+"</td></tr>"+
					"</table>"+
				"</div>";
	$('#userModal').find('.modal-body').empty();
	$('#userModal').find('.modal-body').html(html);
};
usertrackingController.prototype.SearchUserByName = function(callback)
{
	console.log('Searching user by name/email');
	var search = $('#txtSearchUser').val();
	$.ajax({
		url: 'http://localhost:8083/test2bsure/user?search='+search,
		type: 'GET',
		success: function(response){
			$('.existing-users').find('table').find('tbody').empty();
			if(response.response.status == true){
				if(response.data != null && response.data.length > 0){
					$('.userCount').text(response.response.message.split(":")[1].trim());
					var userObj = "";
					var users = response.data;
					for(var user in users){
						if(users[user]['lastUpdatedOn'] == null){
							users[user]['lastUpdatedOn'] = '-'
						}
						userObj += "<tr>"+
						"<td class='tdUserId'>"+users[user]['id']+"</td>"+
						"<td class='tdUserName'>"+users[user]['name']+"</td>"+
						"<td class='tdUserEmail'>"+users[user]['email']+"</td>"+
						"<td class='tdUserCreatedOn'>"+users[user]['lastUpdatedOn']+"</td>"+
						"<td>"+
							"<button class='btn btn-default btnViewUser'>View</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-users').find('table').find('tbody').append(userObj);
				}
			}
			callback();
		},
		error: function(e){
			console.log(e);
			callback();
		}
	});
};