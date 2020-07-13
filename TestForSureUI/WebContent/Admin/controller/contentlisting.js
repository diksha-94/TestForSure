var contentlistingDef = {
		"category":{
			"title": "Category",
			"searchByName": true,
			"addNewBtn": true,
			"totalCount": true,
			"pagination": true,
			"tableFields": [{
								"frontend": "Id",
								"backend": "id"
							},
							{
								"frontend": "Name",
								"backend": "name"
							},
							{
								"frontend": "Title",
								"backend": "title"
							},
							{
								"frontend": "Image",
								"backend": "imageUrl",
								"type": "image"
							},
							{
								"frontend": "Action",
								"backend": undefined
							}],
			"listActions": [{
								"type": "Edit",
								"class": "btnEdit"
							},
							{
								"type": "Delete",
								"class": "btnDelete"
							}],
			"backend": {
				"loadData": "category"
			}
		},
		"exam":{
			"title": "Exam",
			"searchByName": true,
			"searchByCategory": true,
			"addNewBtn": true,
			"totalCount": true,
			"pagination": true,
			"tableFields": [{
								"frontend": "Id",
								"backend": "id"
							},
							{
								"frontend": "Name",
								"backend": "name"
							},
							{
								"frontend": "Title",
								"backend": "title"
							},
							{
								"frontend": "Image",
								"backend": "imageUrl",
								"type": "image"
							},
							{
								"frontend": "Category",
								"backend": "category"
							},
							{
								"frontend": "Action",
								"backend": undefined
							}],
			"listActions": [{
								"type": "Edit",
								"class": "btnEdit"
							},
							{
								"type": "Delete",
								"class": "btnDelete"
							}],
			"backend": {
				"loadData": "exam"
			}
		},
		"questionbank":{
			"title": "Question",
			"searchByName": true,
			"searchByQuesCategory": true,
			"searchByQuesSubcategory": true,
			"addNewBtn": true,
			"totalCount": true,
			"pagination": true,
			"tableFields": [{
								"frontend": "Id",
								"backend": "id"
							},
							{
								"frontend": "Question",
								"backend": "questionText"
							},
							{
								"frontend": "Action",
								"backend": undefined
							}],
			"listActions": [{
								"type": "Edit",
								"class": "btnEdit"
							},
							{
								"type": "Delete",
								"class": "btnDelete"
							}],
			"backend": {
				"loadData": "question"
			}
		},
		"test":{
			"title": "Test",
			"searchByName": true,
			"addNewBtn": true,
			"totalCount": true,
			"pagination": true,
			"tableFields": [{
								"frontend": "Id",
								"backend": "id"
							},
							{
								"frontend": "Name",
								"backend": "name"
							},
							{
								"frontend": "Title",
								"backend": "title"
							},
							{
								"frontend": "Questions",
								"backend": "totalQues"
							},
							{
								"frontend": "Marks",
								"backend": "totalMarks"
							},
							{
								"frontend": "Time",
								"backend": "totalTime"
							},
							{
								"frontend": "Action",
								"backend": undefined
							}],
			"listActions": [{
								"type": "Edit",
								"class": "btnEdit"
							},
							{
								"type": "Delete",
								"class": "btnDelete"
							},
							{
								"type": "Publish",
								"class": "testStatus"
							}],
			"backend": {
				"loadData": "test"
			}
		},
		"quiz":{
			"title": "Quiz",
			"searchByName": true,
			"addNewBtn": true,
			"totalCount": true,
			"pagination": true,
			"tableFields": [{
								"frontend": "Id",
								"backend": "id"
							},
							{
								"frontend": "Name",
								"backend": "name"
							},
							{
								"frontend": "Title",
								"backend": "title"
							},
							{
								"frontend": "Questions",
								"backend": "noOfQues"
							},
							{
								"frontend": "Action",
								"backend": undefined
							}],
			"listActions": [{
								"type": "Edit",
								"class": "btnEdit"
							},
							{
								"type": "Delete",
								"class": "btnDelete"
							},
							{
								"type": "Publish",
								"class": "quizStatus"
							}],
			"backend": {
				"loadData": "quiz"
			}
		},
		"usertracking":{
			"title": "Category",
			"searchByName": true,
			"addNewBtn": true,
			"totalCount": true,
			"pagination": true,
			"tableFields": [{ 
								"frontend": "Id",
								"backend": "id" 
							},
							{
								"frontend": "Name",
								"backend": "name"
							},
							{
								"frontend": "E-mail",
								"backend": "email"
							},
							{
								"frontend": "Created On",
								"backend": "lastUpdatedOn"
							},
							{
								"frontend": "Make Admin",
								"backend": "isAdmin",
								"type": "checkbox"
							},
							{
								"frontend": "Action",
								"backend": undefined
							}],
			"listActions": [{
								"type": "View",
								"class": "btnView"
							}],
			"backend": {
				"loadData": "user"
			}
		},
		"filter":{
			"title": "Category",
			"searchByName": true,
			"addNewBtn": true,
			"totalCount": true,
			"pagination": true,
			"tableFields": [{
								"frontend": "Id",
								"backend": "id"
							},
							{
								"frontend": "Title",
								"backend": "title"
							},
							{
								"frontend": "Action",
								"backend": undefined
							}],
			"listActions": [{
								"type": "Edit",
								"class": "btnEdit"
							},
							{
								"type": "Delete",
								"class": "btnDelete"
							}],
			"backend": {
				"loadData": "filter"
			}
		},
		"asknanswer":{
			"title": "Category",
			"searchByName": true,
			"addNewBtn": true,
			"totalCount": true,
			"pagination": true,
			"tableFields": [{
								"frontend": "Id",
								"backend": "id"
							},
							{
								"frontend": "Name",
								"backend": "name"
							},
							{
								"frontend": "Title",
								"backend": "title"
							},
							{
								"frontend": "Image",
								"backend": "imageUrl"
							},
							{
								"frontend": "Action",
								"backend": undefined
							}],
			"listActions": [{
								"type": "Edit",
								"class": "btnEdit"
							},
							{
								"type": "Delete",
								"class": "btnDelete"
							}],
			"backend": {
				"loadData": "category"
			}
		}
};

var contentlistingController = function(content){
	this.currentPage = 1;
	this.contentType = content;
	this.content = contentlistingDef[this.contentType];
	this.Init();
};
contentlistingController.prototype.Init = function()
{
	showLoader();
	$('.menu-page-content').empty();
	this.CreateSearchBar();
	this.CreateCounter();
	this.CreateExistingItems();
	this.LoadDataFromServer(function(len){
		this.HandlePagination(len);
		removeLoader();
	}.bind(this));
	this.BindEvents();
	
	/*LoadJS(this.contentType, function(){
		eval("new " + this.contentType + "Controller()");
	}.bind(this));*/
};
contentlistingController.prototype.CreateSearchBar = function()
{
	var searchBar = $('<div class="menu-bar col-xs-12 col-sm-12 col-md-12 col-lg-12"></div>');
	searchBar.appendTo($('.menu-page-content'));
	
	//Name/title Search
	if(this.content.searchByName){
		var nameSearch = '<div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 searchbar">'+
						 	'<span>Search By &nbsp; </span> <input type="text" placeholder="Name/Title" class="txtSearchByName">'+
						 	'<button class="btn btn-primary btnSearchByName">Search</button>'+
						 '</div>';
		$(nameSearch).appendTo(searchBar);
	}

	//Add new button
	if(this.content.addNewBtn){
		var addNewBtn = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 addNew">'+
							'<button class="btn btn-primary btnAddNew">'+
								'<span class="glyphicon glyphicon-plus"></span>&nbsp;Add '+ this.content.title + ''+
							'</button>'+
						'</div>';
		$(addNewBtn).appendTo(searchBar);
	}
};
contentlistingController.prototype.CreateCounter = function()
{
	var counterBar = $('<div class="counter col-xs-12 col-sm-12 col-md-12 col-lg-12"></div>');
	counterBar.appendTo($('.menu-page-content'));
	
	//Show total count
	if(this.content.totalCount){
		var totalCount = '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 itemCount">'+
							'Total ' + this.content.title + ' - <span></span>'+
						 '</div>';
		$(totalCount).appendTo(counterBar);
	}

	//Pagination
	if(this.content.pagination){
		var pagination = '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xs-offset-5 col-sm-offset-5 col-md-offset-5 col-lg-offset-5 paginationDiv">'+
						 '</div>';
		$(pagination).appendTo(counterBar);
	}
};

contentlistingController.prototype.CreateExistingItems = function()
{
	var html = "<div class='existing-items'>"+
					"<table>"+
						"<thead>"+
							"<tr class='table-header'>";
	for(var field in this.content.tableFields){
		html += "<th>"+this.content.tableFields[field]["frontend"]+"</th>";
	}
	html += "</tr>"+
			"</thead>"+
			"<tbody>"+
							
			"</tbody>"+
			"</table>"+
			"</div>";
	$(html).appendTo($('.menu-page-content'));
};
//Consider Search and pagination here
contentlistingController.prototype.LoadDataFromServer = function(callback)
{
	var start = $('.paginationDiv').find('.pagination').find('select').find(":selected").attr('data-start');
	if(typeof start == 'undefined'){
		start = 0;
	}
	var search = "";
	if(this.content.searchByName){
		search = $('.txtSearchByName').val();
	}
	var url = remoteServer + "/test2bsure/"+this.content.backend.loadData+"?count="+perPage;
	if(search.length > 0){
		url += "&search="+search;
		start = 0;
		this.currentPage = 1;
	}
	url += "&start="+start;
	console.log(url)
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var items = response.data;
					var html = "";
					for(var item in items){
						html += "<tr data-id = '" + items[item]["id"] + "'>";
						for(var field in this.content.tableFields){
							if(typeof this.content.tableFields[field]["backend"] != 'undefined'){
								if(typeof this.content.tableFields[field]["type"] != 'undefined'){
									if(this.content.tableFields[field]["type"] == 'checkbox'){
										var chkValue = "";
										if(items[item][this.content.tableFields[field]["backend"]] == 1){
											chkValue = "checked = checked";
										}
										html += "<td class='td"+this.contentType+this.content.tableFields[field]["backend"]+"'>"+
													"<input type='checkbox' " + chkValue + "/>"+
												"</td>";
									}
									else if(this.content.tableFields[field]["type"] == 'image'){
										html += "<td class='td"+this.contentType+this.content.tableFields[field]["backend"]+"'>"+
													"<img src = '"+items[item][this.content.tableFields[field]["backend"]]+"' alt = 'Not Available'>"+
												"</td>";
									}
								}
								else{
									html += "<td class='td"+this.contentType+this.content.tableFields[field]["backend"]+"'>"+
												items[item][this.content.tableFields[field]["backend"]]+
											"</td>";
								}
							}
						}
						if(typeof this.content.listActions != 'undefined'){
							html += "<td>";
							for(var action in this.content.listActions){
								html += "<button class='btn btn-default "+this.content.listActions[action]["class"]+"'>"+
											this.content.listActions[action]["type"]+
										"</button>";
							}
							html += "</td>";
						}
						html += "</tr>";
					}
					$('.existing-items').find('table').find('tbody').html(html);
				}
			}
			else{
				$('.existing-items').html('<h3>'+response.result.message+' !!</h3>');
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
contentlistingController.prototype.HandlePagination = function(len){
	$('.counter').find('.itemCount').find('span').text(len);
	
	if(len > 0){
		$('.paginationDiv').html(pagination(len));
		$('.paginationDiv').find('.pagination').find('select').val(this.currentPage);
		$('.paginationDiv').find('.pagination').find('select').unbind().bind('change', function(e){
			this.currentPage = $(e.currentTarget).val();
			showLoader();
			this.LoadDataFromServer(function(len){
				this.HandlePagination(len);
				removeLoader();
			}.bind(this));
		}.bind(this));
	}
};
contentlistingController.prototype.BindEvents = function()
{
	//Search
	if($('.btnSearchByName').length > 0){
		$('.btnSearchByName').unbind().bind('click', function(){
			this.LoadDataFromServer(function(len){
				this.HandlePagination(len);
				removeLoader();
			}.bind(this));
		}.bind(this))
	}
	
	//Create New Item
	if($('.btnAddNew').length > 0){
		$('.btnAddNew').unbind().bind('click', function(){
			LoadJS(this.contentType, function(){
				var obj = eval("new " + this.contentType + "Controller()");
				obj.id = -1;
				obj.AddEdit();
			}.bind(this));
		}.bind(this));
	}
	
	//Edit an Item
	if($('.btnEdit').length > 0){
		$('.btnEdit').unbind().bind('click', function(e){
			var id = $(e.currentTarget).parents('tr[data-id]').attr('data-id');
			LoadJS(this.contentType, function(){
				var obj = eval("new " + this.contentType + "Controller()");
				obj.id = id;
				obj.AddEdit();
			}.bind(this));
		}.bind(this));
	}
	
	//Delete an Item
	if($('.btnDelete').length > 0){
		$('.btnDelete').unbind().bind('click', function(e){
			var id = $(e.currentTarget).parents('tr[data-id]').attr('data-id');
			LoadJS(this.contentType, function(){
				var obj = eval("new " + this.contentType + "Controller()");
				obj.id = id;
				obj.Delete();
			}.bind(this));
		}.bind(this));
	}
	//View an Item
	if($('.btnView').length > 0){
		$('.btnView').unbind().bind('click', function(e){
			var id = $(e.currentTarget).parents('tr[data-id]').attr('data-id');
			LoadJS(this.contentType, function(){
				var obj = eval("new " + this.contentType + "Controller()");
				obj.id = id;
				obj.View();
			}.bind(this));
		}.bind(this));
	}
	
	//Test Status Change
	if($('.testStatus').length > 0){
		$('.testStatus').unbind().bind('click', function(e){
			var id = $(e.currentTarget).parents('tr[data-id]').attr('data-id');
			LoadJS(this.contentType, function(){
				var obj = eval("new " + this.contentType + "Controller()");
				obj.id = id;
				obj.HandleTestStatus();
			}.bind(this));
		}.bind(this));
	}
	
	//Quiz Status Change
	if($('.quizStatus').length > 0){
		$('.quizStatus').unbind().bind('click', function(e){
			var id = $(e.currentTarget).parents('tr[data-id]').attr('data-id');
			LoadJS(this.contentType, function(){
				var obj = eval("new " + this.contentType + "Controller()");
				obj.id = id;
				obj.HandleTestStatus();
			}.bind(this));
		}.bind(this));
	}
	
	//Make Admin Change
	if($('.tdusertrackingisAdmin').length > 0){
		$('.tdusertrackingisAdmin').find('input').unbind().bind('click', function(e){
			var id = $(e.currentTarget).parents('tr[data-id]').attr('data-id');
			LoadJS(this.contentType, function(){
				var obj = eval("new " + this.contentType + "Controller()");
				obj.id = id;
				obj.HandleAdmin();
			}.bind(this));
		}.bind(this));
	}
};