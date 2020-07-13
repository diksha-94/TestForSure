var usertrackingController = function(){
	this.id = "";
};
usertrackingController.prototype.Init = function()
{
};
usertrackingController.prototype.View = function()
{
	$('#userModal').modal('show');
	$.ajax({
		url: remoteServer + "/test2bsure/user?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					var html = "<div>"+
									"<table>"+
										"<tr><td>User Id    </td><td>"+item.id+"</td></tr>"+
										"<tr><td>Name    </td><td>"+item.name+"</td></tr>"+
										"<tr><td>Email    </td><td>"+item.email+"</td></tr>"+
										"<tr><td>Mobile Number    </td><td>"+item.mobileno+"</td></tr>"+
										"<tr><td>Created On    </td><td>"+item.lastUpdatedOn+"</td></tr>"+
										"<tr><td>Verified    </td><td>"+item.verified+"</td></tr>"+
									"</table>"+
								"</div>";
					$('#userModal').find('.modal-body').empty();
					$('#userModal').find('.modal-body').html(html);
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
usertrackingController.prototype.HandleAdmin = function()
{
	$.ajax({
		url: remoteServer+'/test2bsure/useradmin?id='+this.id,
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