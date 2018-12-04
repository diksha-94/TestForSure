var categoryController = function(){
	this.Init();
};
categoryController.prototype.Init = function()
{
	console.log('Initiate category');
	this.LoadView();
};
categoryController.prototype.BindEvents = function()
{
	//Search category by name/title - button
	$('#btnSearchCategory').unbind().bind('click', function(){
		this.SearchCategoryByName(function(){
			this.BindEvents();
		}.bind(this));
	}.bind(this));
	
	//Add/Update Category
	$('.addEditCategory').unbind().bind('click', function(e){
		$('#categoryModal').modal('show');
		RefreshData('categoryModal');
		this.PopulateCategoryData(e);
		var id = 0;
		var update = $(e.currentTarget).hasClass('update');
		if(update){
			id = $(e.currentTarget).parents('tr').find('.tdCategoryId').text();
		}
		$('#categoryModal').find('#btnCategorySave').unbind().bind('click', function(){
			this.SaveCategory(update, id);
		}.bind(this));
		$('#categoryModal').find('#btnCategoryRefresh').unbind().bind('click', function(){
			RefreshData('categoryModal');
		}.bind(this));
	}.bind(this));
	
	$('.deleteCategory').unbind().bind('click', function(e){
		var categoryId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		console.log(categoryId);
		$('#deleteCategoryModal').modal('show');
		$('#deleteCategoryModal').find('.modal-body').find('p').find('span').text("SSC ?");
		$('#deleteCategoryModal').find('#btnDeleteYes').unbind().bind('click', function(){
			this.DeleteCategory(categoryId, e);
		}.bind(this));
	}.bind(this));
};
categoryController.prototype.LoadView = function()
{
	$('.menu-page-content').load('category.html', function(){
		this.LoadAllCategories(function(){
			this.BindEvents();
		}.bind(this));
	}.bind(this));
};
categoryController.prototype.LoadAllCategories = function(callback)
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/category',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var categories = response.data;
					var catObj = "";
					for(var category in categories){
						catObj += "<tr>"+
						"<td class='tdCategoryId'>"+categories[category]['id']+"</td>"+
						"<td class='tdCategoryName'>"+categories[category]['name']+"</td>"+
						"<td class='tdCategoryTitle'>"+categories[category]['title']+"</td>"+
						"<td class='tdCategoryImageUrl'>"+categories[category]['imageUrl']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditCategory update'>Edit</button>"+
							"<button class='btn btn-default deleteCategory'>Delete</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-categories').find('table').find('tbody').append(catObj);
				}
			}
			else{
				alert(response.result.message);
			}
			callback();
		},
		error: function(e){
			console.log(e);
			callback();
		}
	});
};
categoryController.prototype.SaveCategory = function(update, id)
{
	console.log('Saving (Add/Update) Category');
	var name = $('#txtCategoryName').val();
	var title = $('#txtCategoryTitle').val();
	var imageUrl = $('#txtCategoryImageUrl').val();
	if(name.length == 0 || title.length == 0 || imageUrl.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = 'http://www.test2bsure.com:8084/test2bsure/category';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'imageUrl': imageUrl,
			'active': 1
	};
	console.log(requestData);
	if(update){
		requestData.id = id;
		type = 'PUT';
	}
	console.log('Call to save category');
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		
		//contentType: 'application/json',
		data: JSON.stringify(requestData),
		//"Content-Type": "application/json",
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
categoryController.prototype.DeleteCategory = function(categoryId, e)
{
	console.log('Delete Category');
	//ajax call to delete the category
	//in ajax success, remove the category from the page
	$.ajax({
		url: "http://www.test2bsure.com:8084/test2bsure/category?id="+categoryId,
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
categoryController.prototype.PopulateCategoryData = function(e)
{
	var name = "";
	var title = "";
	var imageUrl = "";
	if($(e.currentTarget).hasClass('update')){
		var currentCategory = $(e.currentTarget).parents('tr');
		name = currentCategory.find('.tdCategoryName').text();
		title = currentCategory.find('.tdCategoryTitle').text();
		imageUrl = currentCategory.find('.tdCategoryImageUrl').text();
	}
	$('#categoryModal').find('#txtCategoryName').val(name);
	$('#categoryModal').find('#txtCategoryTitle').val(title);
	$('#categoryModal').find('#txtCategoryImageUrl').val(imageUrl);
};
categoryController.prototype.SearchCategoryByName = function(callback)
{
	console.log('Searching category by name/title');
	var search = $('#txtSearchCategory').val();
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/category?search='+search,
		type: 'GET',
		success: function(response){
			$('.existing-categories').find('table').find('tbody').empty();
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var categories = response.data;
					var catObj = "";
					for(var category in categories){
						catObj += "<tr>"+
						"<td class='tdCategoryId'>"+categories[category]['id']+"</td>"+
						"<td class='tdCategoryName'>"+categories[category]['name']+"</td>"+
						"<td class='tdCategoryTitle'>"+categories[category]['title']+"</td>"+
						"<td class='tdCategoryImageUrl'>"+categories[category]['imageUrl']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditCategory update'>Edit</button>"+
							"<button class='btn btn-default deleteCategory'>Delete</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-categories').find('table').find('tbody').append(catObj);
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