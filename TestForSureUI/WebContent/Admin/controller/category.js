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
		this.SearchCategoryByName(0, function(length){
			this.HandleRecords(length);
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
		var currentCategory = $(e.currentTarget).parents('tr');
		var title = currentCategory.find('.tdCategoryTitle').text();
		$('#deleteCategoryModal').modal('show');
		$('#deleteCategoryModal').find('.modal-body').find('p').find('span').text(title+" ?");
		$('#deleteCategoryModal').find('#btnDeleteYes').unbind().bind('click', function(){
			this.DeleteCategory(categoryId, e);
		}.bind(this));
	}.bind(this));
};
categoryController.prototype.LoadView = function()
{
	$('.menu-page-content').load('category.html', function(){
		this.LoadAllCategories(0, function(length){
			this.HandleRecords(length);
		}.bind(this));
	}.bind(this));
};
categoryController.prototype.LoadAllCategories = function(start, callback)
{
	$.ajax({
		url: remoteServer+'/test2bsure/category?count='+perPage+'&start='+start,
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
						"<td class='tdCategoryImageUrl'><img src='"+categories[category]['imageUrl']+"' alt='Not Available'/></td>"+
						"<td>"+
							"<button class='btn btn-default addEditCategory update'>Edit</button>"+
							"<button class='btn btn-default deleteCategory'>Delete</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-categories').find('table').find('tbody').html(catObj);
					this.BindEvents();
				}
			}
			else{
				$('.existing-categories').html('<h3>'+response.result.message+' !!</h3>');
			}
			if(typeof callback == 'function'){
				callback(response.result.length);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback == 'function'){
				callback(0);
			}
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
	var url = remoteServer+'/test2bsure/category';
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
		url: remoteServer+"/test2bsure/category?id="+categoryId,
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
		imageUrl = currentCategory.find('.tdCategoryImageUrl').find('img').attr('src');
	}
	$('#categoryModal').find('#txtCategoryName').val(name);
	$('#categoryModal').find('#txtCategoryTitle').val(title);
	$('#categoryModal').find('#txtCategoryImageUrl').val(imageUrl);
};
categoryController.prototype.SearchCategoryByName = function(start, callback)
{
	var search = $('#txtSearchCategory').val();
	$.ajax({
		url: remoteServer+'/test2bsure/category?search='+search+'&count='+perPage+'&start='+start,
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
						"<td class='tdCategoryImageUrl'><img src='"+categories[category]['imageUrl']+"' alt='Not Available'/></td>"+
						"<td>"+
							"<button class='btn btn-default addEditCategory update'>Edit</button>"+
							"<button class='btn btn-default deleteCategory'>Delete</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-categories').find('table').find('tbody').html(catObj);
					this.BindEvents();
				}
			}
			if(typeof callback == 'function'){
				callback(response.result.length);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback == 'function'){
				callback(0);
			}
		}
	});
};
categoryController.prototype.HandleRecords = function(len){
	$('.counter').find('.itemCount').find('span').text(len);
	if(len > 0){
		$('.paginationDiv').html(pagination(len));
		$('.paginationDiv').find('.pagination').find('select').unbind().bind('change', function(e){
			var search = $('#txtSearchCategory').val();
			var start = $(e.currentTarget).find(":selected").attr('data-start');
			if(search.length > 0){
				this.SearchCategoryByName(start);
			}
			else{
				this.LoadAllCategories(start);
			}
		}.bind(this));
	}
};