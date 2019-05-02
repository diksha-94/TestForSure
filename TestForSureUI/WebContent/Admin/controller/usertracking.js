var usertrackingController = function(){
	this.users = {};
	this.Init();
};
usertrackingController.prototype.Init = function()
{
	console.log('Initiate user');
	showLoader();
	this.LoadView();
};
usertrackingController.prototype.BindEvents = function()
{
	//Search user by name/e-mail - button
	$('#btnSearchUser').unbind().bind('click', function(){
		this.SearchUserByName(0, function(length){
			this.HandleRecords(length);
		}.bind(this));
	}.bind(this));
	
	//View User
	$('.btnViewUser').unbind().bind('click', function(e){
		$('#userModal').modal('show');
		this.PopulateUser(e);
	}.bind(this));
	
	$('.chkIsAdmin').unbind().bind('change', function(e){
		this.UserAdmin(e);
	}.bind(this));
};
usertrackingController.prototype.LoadView = function()
{
	$('.menu-page-content').load('usertracking.html', function(){
		this.LoadAllUsers(0, function(length){
			this.HandleRecords(length);
			removeLoader();
		}.bind(this));
	}.bind(this));
};
usertrackingController.prototype.LoadAllUsers = function(start, callback)
{
	$.ajax({
		url: remoteServer+'/test2bsure/user?count='+perPage+'&start='+start,
		type: 'GET',
		contentType: 'application/json',
		context: this,
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var users = response.data;
					var userObj = "";
					$('.userCount').text(response.result.message.split(":")[1].trim());
					for(var user in users){
						this.users[users[user]['id']] = users[user];
						if(users[user]['lastUpdatedOn'] == null){
							users[user]['lastUpdatedOn'] = '-';
						}
						var chkValue = "";
						if(users[user]['isAdmin'] == 1){
							chkValue = "checked = checked";
						}
						userObj += "<tr>"+
						"<td class='tdUserId'>"+users[user]['id']+"</td>"+
						"<td class='tdUserName'>"+users[user]['name']+"</td>"+
						"<td class='tdUserEmail'>"+users[user]['email']+"</td>"+
						"<td class='tdUserCreatedOn'>"+users[user]['lastUpdatedOn']+"</td>"+
						"<td>"+
							"<button class='btn btn-default btnViewUser'>View</button>"+
						"</td>"+
						"<td>"+
							"<input type='checkbox' class='chkIsAdmin' "+chkValue+"/>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-users').find('table').find('tbody').html(userObj);
					this.BindEvents();
				}
			}
			else{
				$('.existing-users').html('<h3>'+response.result.message+' !!</h3>');
			}
			if(typeof callback == 'function')
				callback(response.result.length);
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback == 'function')
				callback(0);
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
usertrackingController.prototype.SearchUserByName = function(start, callback)
{
	showLoader();
	var search = $('#txtSearchUser').val();
	$.ajax({
		url: remoteServer+'/test2bsure/user?search='+search+'&count='+perPage+'&start='+start,
		type: 'GET',
		success: function(response){
			$('.existing-users').find('table').find('tbody').empty();
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					$('.userCount').text(response.result.message.split(":")[1].trim());
					var userObj = "";
					var users = response.data;
					for(var user in users){
						if(users[user]['lastUpdatedOn'] == null){
							users[user]['lastUpdatedOn'] = '-'
						}
						var chkValue = "";
						if(users[user]['isAdmin'] == 1){
							chkValue = "checked = checked";
						}
						userObj += "<tr>"+
						"<td class='tdUserId'>"+users[user]['id']+"</td>"+
						"<td class='tdUserName'>"+users[user]['name']+"</td>"+
						"<td class='tdUserEmail'>"+users[user]['email']+"</td>"+
						"<td class='tdUserCreatedOn'>"+users[user]['lastUpdatedOn']+"</td>"+
						"<td>"+
							"<button class='btn btn-default btnViewUser'>View</button>"+
						"</td>"+
						"<td>"+
							"<input type='checkbox' class='chkIsAdmin' "+chkValue+"/>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-users').find('table').find('tbody').html(userObj);
					this.BindEvents();
				}
			}
			else{
				$('.existing-users').html('<h3>'+response.result.message+' !!</h3>');
			}
			if(typeof callback == 'function')
				callback(response.result.length);
			removeLoader();
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback == 'function')
				callback(0);
			removeLoader();
		}
	});
};
usertrackingController.prototype.HandleRecords = function(len){
	$('.counter').find('.itemCount').find('span').text(len);
	if(len > 0){
		$('.paginationDiv').html(pagination(len));
		$('.paginationDiv').find('.pagination').find('select').unbind().bind('change', function(e){
			var search = $('#txtSearchUser').val();
			var start = $(e.currentTarget).find(":selected").attr('data-start');
			if(search.length > 0){
				this.SearchUserByName(start);
			}
			else{
				this.LoadAllUsers(start);
			}
		}.bind(this));
	}
};
usertrackingController.prototype.UserAdmin = function(e){
	var id = $(e.currentTarget).parents('tr').find('.tdUserId').text();
	$.ajax({
		url: remoteServer+'/test2bsure/useradmin?id='+id,
		type: 'PUT',
		success: function(response){
			if(response.result.status == true){
				
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};