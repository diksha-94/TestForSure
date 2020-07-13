var categoryController = function(){
	this.id = -1;
};
categoryController.prototype.Init = function()
{
};
categoryController.prototype.AddEdit = function()
{
	$('#categoryModal').modal('show');
	RefreshData('categoryModal');
	if(this.id > 0){
		this.Edit();
	}
	$('#categoryModal').find('#btnCategorySave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
	//Show image preview
	$('#txtCategoryImageUrl').unbind().bind('keyup', function(){
		$('#imgCategoryImagePreview').attr('src', $('#txtCategoryImageUrl').val());
	});
};
categoryController.prototype.Delete = function()
{
	$('#deleteCategoryModal').modal('show');
	$('#deleteCategoryModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteCategoryModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
categoryController.prototype.SaveData = function()
{
	console.log('Saving (Add/Update) Category');
	var name = $('#txtCategoryName').val();
	var title = $('#txtCategoryTitle').val();
	var imageUrl = $('#txtCategoryImageUrl').val();
	if(name.length == 0 || title.length == 0 || imageUrl.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = remoteServer+'/test2bsure/category';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'imageUrl': imageUrl,
			'active': 1
	};
	console.log(requestData);
	if(this.id > -1){
		requestData.id = this.id;
		type = 'PUT';
	}
	console.log('Call to save category');
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				$('#categoryModal').modal('hide');
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
categoryController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/category?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteCategoryModal').modal('hide');
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
categoryController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/category?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#categoryModal').find('#txtCategoryName').val(item.name);
					$('#categoryModal').find('#txtCategoryTitle').val(item.title);
					$('#categoryModal').find('#txtCategoryImageUrl').val(item.imageUrl);
					$('#categoryModal').find('#imgCategoryImagePreview').attr('src', item.imageUrl);
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};