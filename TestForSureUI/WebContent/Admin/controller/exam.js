var examController = function(){
	this.id = -1
};
examController.prototype.Init = function()
{
};
examController.prototype.AddEdit = function()
{
	$('#examModal').modal('show');
	summernoteController.getObj().addEditor('#txtExamShortDescription');
	summernoteController.getObj().addEditor('#txtExamDescription');
	RefreshData('examModal');
	getCategories(function(data){
		if(data.length > 0){
			var html = "<option value=''>Select</option>";
			for(var cat in data){
				html += "<option value='"+data[cat]['id']+"'>"+data[cat]['title']+"</option>";
			}
			$('#ddCategory').html(html);
		}
		if(this.id > 0){
			this.Edit();
			$('#txtExamTitle').unbind('keyup');
		}
		else{
			$('#txtExamTitle').unbind().bind('keyup', function(e){
				populateUrlKey($(e.currentTarget).val(), $('#txtExamUrlKey'));
			});
		}
		$('#txtExamUrlKey').unbind().bind('keyup', function(e){
			populateUrlKey($(e.currentTarget).val(), $(e.currentTarget));
		});
	}.bind(this));
	
	$('#examModal').find('#btnExamSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
	//Show image preview
	$('#txtExamImageUrl').unbind().bind('keyup', function(){
		$('#imgExamImagePreview').attr('src', $('#txtExamImageUrl').val());
	});
};
examController.prototype.Delete = function()
{
	$('#deleteExamModal').modal('show');
	$('#deleteExamModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteExamModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
examController.prototype.SaveData = function()
{
	console.log('Saving (Add/Update) Exam');
	var name = $('#txtExamName').val();
	var title = $('#txtExamTitle').val();
	var urlKey = $('#txtExamUrlKey').val();
	var displayIndex = $('#txtExamIndex').val();
	var imageUrl = $('#txtExamImageUrl').val();
	var categoryId = $('#ddCategory').val();
	var shortDescription = summernoteController.getObj().getValue('#txtExamShortDescription');
	var description = summernoteController.getObj().getValue('#txtExamDescription');
	if(name.length == 0 || title.length == 0 || urlKey.length == 0 || imageUrl.length == 0 || categoryId.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = remoteServer+'/test2bsure/exam';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'urlKey': urlKey,
			'displayIndex': displayIndex,
			'imageUrl': imageUrl,
			'category': categoryId,
			'shortDescription': shortDescription,
			'description': description,
			'active': 1
	};
	console.log(requestData);
	if(this.id > 0){
		requestData.id = this.id;
		type = 'PUT';
	}
	console.log('Call to save exam');
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				$('#examModal').modal('hide');
				alert(response.message);
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
			else{
				alert(response.message);
				return;
			}
		},
		error: function(e){
			console.log(e);
		}
	});
};
examController.prototype.DeleteItem = function()
{
	//in ajax success, remove the exam from the page
	$.ajax({
		url: remoteServer+"/test2bsure/exam?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteExamModal').modal('hide');
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
		},
		error: function(e){
			alert(e);
		}
	});
};
examController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/exam?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#examModal').find('#txtExamName').val(item.name);
					$('#examModal').find('#txtExamTitle').val(item.title);
					$('#examModal').find('#txtExamUrlKey').val(item.urlKey);
					$('#examModal').find('#txtExamIndex').val(item.displayIndex);
					$('#examModal').find('#txtExamImageUrl').val(item.imageUrl);
					$('#examModal').find('#ddCategory').val(item.category);
					summernoteController.getObj().setValue('#txtExamShortDescription', item.shortDescription);
					summernoteController.getObj().setValue('#txtExamDescription', item.description);
					$('#examModal').find('#imgExamImagePreview').attr('src', item.imageUrl);
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
examController.prototype.SearchByCategory = function()
{
	this.SearchExamByName(0, function(length){
		this.BindTableEvents();
		this.HandleRecords(length);
		var search = 0;
		search = $('#ddSearchCategory').val();
		if(search == 0){
			return false;
		}
		$('.existing-exams').find('table').find('tbody').find('tr').each(function(e){
			if($(this).find('td.tdExamCategoryId').find('span').text() != search){
				$(this).remove();
			}
		});
		var totalRecords = $('.existing-exams').find('table').find('tbody').find('tr').length;
		$('.counter').find('.itemCount').find('span').text(totalRecords);
		var totalPages = $('.paginationDiv').find('.pagination').find('option').length;
		var totalPagesReq = 0;
		while(totalRecords >= perPage){
			totalPagesReq++;
			totalRecords -= perPage;
		}
		if(totalRecords > 0){
			totalPagesReq++;
		}
		var index = 1;
		$('.paginationDiv').find('.pagination').find('option').each(function(e){
			if(index > totalPagesReq){
				$(this).remove();
			}
			index++;
		});
	}.bind(this));
};