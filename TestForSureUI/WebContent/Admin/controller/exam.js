var examController = function(){
	this.categories = [];
	this.exams = {};
	this.Init();
};
examController.prototype.Init = function()
{
	console.log('Initiate exam');
	this.GetCategories(function(){
		this.LoadView();
	}.bind(this));
};
examController.prototype.BindEvents = function()
{
	if(this.categories.length > 0){
		var catObj = "";
		for(var category in this.categories){
			catObj += "<option value='"+this.categories[category]['id']+"'>"+this.categories[category]['title']+"</option>";
		}
		$('#ddSearchCategory').append(catObj);
	}
	//Search exam by category
	$('#ddSearchCategory').on('change', function(e){
		this.SearchByCategory();
	}.bind(this));
	
	//Search category by name/title - button
	$('#btnSearchExam').unbind().bind('click', function(){
		this.SearchByCategory();
	}.bind(this));
};
examController.prototype.BindTableEvents = function()
{
	//Add/Update Category
	$('.addEditExam').unbind().bind('click', function(e){
		$('#examModal').modal('show');
		summernoteController.getObj().addEditor('#txtExamDescription');
		RefreshData('examModal');
		this.PopulateExamData(e);
		var id = 0;
		var update = $(e.currentTarget).hasClass('update');
		if(update){
			id = $(e.currentTarget).parents('tr').find('.tdExamId').text();
		}
		$('#examModal').find('#btnExamSave').unbind().bind('click', function(){
			this.SaveExam(update, id);
		}.bind(this));
		$('#examModal').find('#btnExamRefresh').unbind().bind('click', function(){
			RefreshData('examModal');
		}.bind(this));
	}.bind(this));
	
	$('.deleteExam').unbind().bind('click', function(e){
		var examId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		console.log(examId);
		$('#deleteExamModal').modal('show');
		$('#deleteExamModal').find('.modal-body').find('p').find('span').text(this.exams[examId].title+" ?");
		$('#deleteExamModal').find('#btnDeleteYes').unbind().bind('click', function(){
			this.DeleteExam(examId, e);
		}.bind(this));
	}.bind(this));
};
examController.prototype.LoadView = function()
{
	$('.menu-page-content').load('exam.html', function(){
		this.LoadAllExams(function(){
			this.BindEvents();
			this.BindTableEvents();
		}.bind(this));
	}.bind(this));
};
examController.prototype.LoadAllExams = function(callback)
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/exam',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var examObj = "";
					var exams = response.data;
					for(var exam in exams){
						this.exams[exams[exam]['id']] = exams[exam];
						examObj += "<tr>"+
						"<td class='tdExamId'>"+exams[exam]['id']+"</td>"+
						"<td class='tdExamName'>"+exams[exam]['name']+"</td>"+
						"<td class='tdExamTitle'>"+exams[exam]['title']+"</td>"+
						"<td class='tdExamImageUrl'>"+exams[exam]['imageUrl']+"</td>"+		
						"<td class='tdExamCategoryId'><span>"+exams[exam]['category']+"</span> - "+this.GetCategoryName(exams[exam]['category'])+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditExam update'>Edit</button>"+
							"<button class='btn btn-default deleteExam'>Delete</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-exams').find('table').find('tbody').append(examObj);
					callback();
					return false;
				}
			}
			callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			callback();
		}
	});
};
examController.prototype.SaveExam = function(update, id)
{
	console.log('Saving (Add/Update) Exam');
	var name = $('#txtExamName').val();
	var title = $('#txtExamTitle').val();
	var imageUrl = $('#txtExamImageUrl').val();
	var categoryId = $('#ddCategory').val();
	var description = summernoteController.getObj().getValue('#txtExamDescription');
	if(name.length == 0 || title.length == 0 || imageUrl.length == 0 || categoryId.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = 'http://www.test2bsure.com:8084/test2bsure/exam';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'imageUrl': imageUrl,
			'category': categoryId,
			'description': description,
			'active': 1
	};
	console.log(requestData);
	if(update){
		requestData.id = id;
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
		},
		error: function(e){
			console.log(e);
		}
	});
};
examController.prototype.DeleteExam = function(examId, e)
{
	console.log('Delete Exam');
	//ajax call to delete the exam
	//in ajax success, remove the exam from the page
	$.ajax({
		url: "http://www.test2bsure.com:8084/test2bsure/exam?id="+examId,
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
examController.prototype.GetCategories = function(callback)
{
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/category',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					this.categories = response.data;
				}
			}
			callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			callback();
		}
	});
};
examController.prototype.PopulateExamData = function(e)
{
	//Populate Category dropdown
	if(this.categories.length > 0){
		var catObj = "";
		for(var category in this.categories){
			catObj += "<option value='"+this.categories[category]['id']+"'>"+this.categories[category]['title']+"</option>";
		}
		$('#ddCategory').append(catObj);
	}
	var name = "";
	var title = "";
	var imageUrl = "";
	var categoryId = "";
	var desc = "";
	if($(e.currentTarget).hasClass('update')){
		var currentExam = $(e.currentTarget).parents('tr');
		name = currentExam.find('.tdExamName').text();
		title = currentExam.find('.tdExamTitle').text();
		imageUrl = currentExam.find('.tdExamImageUrl').text();
		categoryId = currentExam.find('.tdExamCategoryId').find('span').text();
		desc = this.exams[currentExam.find('.tdExamId').text()].description;
	}
	$('#examModal').find('#txtExamName').val(name);
	$('#examModal').find('#txtExamTitle').val(title);
	$('#examModal').find('#txtExamImageUrl').val(imageUrl);
	$('#examModal').find('#ddCategory').val(categoryId);
	summernoteController.getObj().setValue('#txtExamDescription', desc);
	//$('#examModal').find('#txtExamDescription').val(desc);
};
examController.prototype.SearchExamByName = function(callback)
{
	console.log('Searching Exam by name/title');
	var search = $('#txtSearchExam').val();
	$.ajax({
		url: 'http://www.test2bsure.com:8084/test2bsure/exam?search='+search,
		type: 'GET',
		success: function(response){
			$('.existing-exams').find('table').find('tbody').empty();
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var examObj = "";
					var exams = response.data;
					for(var exam in exams){
						examObj += "<tr>"+
						"<td class='tdExamId'>"+exams[exam]['id']+"</td>"+
						"<td class='tdExamName'>"+exams[exam]['name']+"</td>"+
						"<td class='tdExamTitle'>"+exams[exam]['title']+"</td>"+
						"<td class='tdExamImageUrl'>"+exams[exam]['imageUrl']+"</td>"+
						"<td class='tdExamCategoryId'><span>"+exams[exam]['category']+"</span> - "+this.GetCategoryName(exams[exam]['category'])+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditExam update'>Edit</button>"+
							"<button class='btn btn-default deleteExam'>Delete</button>"+
						"</td>"+
						"</tr>";
					}
					$('.existing-exams').find('table').find('tbody').append(examObj);
				}
			}
			callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			callback();
		}
	});
};
examController.prototype.GetCategoryName = function(id)
{
	if(typeof this.categories != 'undefined' && this.categories.length > 0){
		for(var category in this.categories){
			if(this.categories[category].id == id){
				return this.categories[category]["title"];
			}
		}
	}
};
examController.prototype.SearchByCategory = function()
{
	this.SearchExamByName(function(){
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
		this.BindTableEvents();
	}.bind(this));
};