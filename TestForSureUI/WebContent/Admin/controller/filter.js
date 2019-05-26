var filterController = function(){
	this.Init();
};
filterController.prototype.Init = function()
{
	console.log('Initiate filter');
	showLoader();
	this.LoadView();
};
filterController.prototype.BindEvents = function()
{
	//Search filter by name - button
	$('#btnSearchFilter').unbind().bind('click', function(){
		this.SearchFilterByName(0, function(length){
			this.HandleRecords(length);
		}.bind(this));
	}.bind(this));
	
	//Add/Update Filter
	$('.addEditFilter').unbind().bind('click', function(e){
		$('#filterModal').modal('show');
		RefreshData('filterModal');
		this.PopulateFilterData(e);
		var id = 0;
		var update = $(e.currentTarget).hasClass('update');
		if(update){
			id = $(e.currentTarget).parents('tr').find('.tdFilterId').text();
		}
		$('#filterModal').find('#btnFilterSave').unbind().bind('click', function(){
			this.SaveFilter(update, id);
		}.bind(this));
		$('#filterModal').find('#btnFilterRefresh').unbind().bind('click', function(){
			RefreshData('filterModal');
		}.bind(this));
	}.bind(this));
	
	$('.deleteFilter').unbind().bind('click', function(e){
		var filterId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		console.log(filterId);
		var currentFilter = $(e.currentTarget).parents('tr');
		var title = currentFilter.find('.tdFilterName').text();
		$('#deleteFilterModal').modal('show');
		$('#deleteFilterModal').find('.modal-body').find('p').find('span').text(title+" ?");
		$('#deleteFilterModal').find('#btnDeleteYes').unbind().bind('click', function(){
			this.DeleteFilter(filterId, e);
		}.bind(this));
	}.bind(this));
};
filterController.prototype.LoadView = function()
{
	$('.menu-page-content').load('filter.html', function(){
		this.LoadAllFilters(0, function(length){
			this.HandleRecords(length);
			removeLoader();
		}.bind(this));
	}.bind(this));
};
filterController.prototype.LoadAllFilters = function(start, callback)
{
	$.ajax({
		url: remoteServer+'/test2bsure/filter?count='+perPage+'&start='+start,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var filters = response.data;
					var obj = "";
					for(var filter in filters){
						obj += "<tr>"+
						"<td class='tdFilterId'>"+filters[filter]['id']+"</td>"+
						"<td class='tdFilterName'>"+filters[filter]['name']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditFilter update'>Edit</button>"+
							"<button class='btn btn-default deleteFilter'>Delete</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-filters').find('table').find('tbody').html(obj);
				}
			}
			else{
				$('.existing-filters').html('<h3>'+response.result.message+' !!</h3>');
			}
			if(typeof callback == 'function'){
				callback(response.result.length);
			}
			this.BindEvents();
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback == 'function'){
				callback(0);
			}
		}
	});
};
filterController.prototype.SaveFilter = function(update, id)
{
	console.log('Saving (Add/Update) Filter');
	var name = $('#txtFilterName').val();
	if(name.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = remoteServer+'/test2bsure/filter';
	var type = 'POST';
	var requestData = {
		'name': name
	};
	console.log(requestData);
	if(update){
		requestData.id = id;
		type = 'PUT';
	}
	console.log('Call to save filter');
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
filterController.prototype.DeleteFilter = function(filterId, e)
{
	console.log('Delete Filter');
	$.ajax({
		url: remoteServer+"/test2bsure/filter?id="+filterId,
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
filterController.prototype.PopulateFilterData = function(e)
{
	var name = "";
	if($(e.currentTarget).hasClass('update')){
		var currentFilter = $(e.currentTarget).parents('tr');
		name = currentFilter.find('.tdFilterName').text();
	}
	$('#filterModal').find('#txtFilterName').val(name);
};
filterController.prototype.SearchFilterByName = function(start, callback)
{
	var search = $('#txtSearchFilter').val();
	showLoader();
	$.ajax({
		url: remoteServer+'/test2bsure/filter?search='+search+'&count='+perPage+'&start='+start,
		type: 'GET',
		success: function(response){
			$('.existing-filters').find('table').find('tbody').empty();
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var filters = response.data;
					var obj = "";
					for(var filter in filters){
						obj += "<tr>"+
						"<td class='tdFilterId'>"+filters[filter]['id']+"</td>"+
						"<td class='tdFilterName'>"+filters[filter]['name']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditFilter update'>Edit</button>"+
							"<button class='btn btn-default deleteFilter'>Delete</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-filters').find('table').find('tbody').html(obj);
					this.BindEvents();
				}
			}
			else{
				$('.existing-filters').html('<h3>'+response.result.message+' !!</h3>');
			}
			if(typeof callback == 'function'){
				callback(response.result.length);
			}
			removeLoader();
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback == 'function'){
				callback(0);
			}
			removeLoader();
		}
	});
};
filterController.prototype.HandleRecords = function(len){
	$('.counter').find('.itemCount').find('span').text(len);
	if(len > 0){
		$('.paginationDiv').html(pagination(len));
		$('.paginationDiv').find('.pagination').find('select').unbind().bind('change', function(e){
			var search = $('#txtSearchFilter').val();
			var start = $(e.currentTarget).find(":selected").attr('data-start');
			if(search.length > 0){
				this.SearchFilterByName(start);
			}
			else{
				this.LoadAllFilters(start);
			}
		}.bind(this));
	}
};