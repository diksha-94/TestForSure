var filterController = function(){
	this.id = -1;
};
filterController.prototype.Init = function()
{
};
filterController.prototype.AddEdit = function()
{
	$('#filterModal').modal('show');
	RefreshData('filterModal');
	if(this.id > 0){
		this.Edit();
	}
	$('#filterModal').find('#btnFilterSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
};
filterController.prototype.Delete = function()
{
	$('#deleteFilterModal').modal('show');
	$('#deleteFilterModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteFilterModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
filterController.prototype.SaveData = function()
{
	var name = $('#txtFilterName').val();
	if(name.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = remoteServer+'/test2bsure/filter';
	var type = 'POST';
	var requestData = {
		'title': name
	};
	if(this.id > 0){
		requestData.id = this.id;
		type = 'PUT';
	}
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				$('#filterModal').modal('hide');
				alert(response.message);
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
			else{
				alert(response.message);
			}
		},
		error: function(e){
			console.log(e);
		}
	});
};
filterController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/filter?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteFilterModal').modal('hide');
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
			else{
				alert(response.message);
			}
		},
		error: function(e){
			alert(e);
		}
	});
};
filterController.prototype.Edit = function()
{
	$.ajax({
		url: remoteServer + "/test2bsure/filter?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#filterModal').find('#txtFilterName').val(item.title);
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};