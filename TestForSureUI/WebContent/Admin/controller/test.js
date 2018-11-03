var testController = function(){
	this.sectionCount = 0;
	this.categories = {};
	this.id = 0;
	this.exams = {};
	this.tests = {};
	this.Init();
};
testController.prototype.Init = function()
{
	console.log('Initiate Test');
	this.LoadCategories();
	this.LoadExams();
	this.LoadView();
};
testController.prototype.BindEvents = function()
{
	//Search test by name/title - button
	$('#btnTestCategory').unbind().bind('click', function(){
		this.SearchTestByName();
	}.bind(this));
	
	//Add/Update Test$(e.currentTarget).val()
	$('.addEditTest').unbind().bind('click', function(e){
		$('#testDetailsModal').modal('show');
		this.PopulateTestData(e);
		
		$('#testDetailsModal').find('#ddCategory').on('change', function(e){
			var selectedCat = $(e.currentTarget).val();
			var examObj = "<option value=''>Select</option>";
			for(var exam in this.exams){
				if(selectedCat == ""){
					examObj += "<option value='"+this.exams[exam]['id']+"'>"+this.exams[exam]['title']+"</option>";
				}
				else{
					if(this.exams[exam]["category"] == selectedCat){
						examObj += "<option value='"+this.exams[exam]['id']+"'>"+this.exams[exam]['title']+"</option>";
					}
				}
			}
			$('#testDetailsModal').find('#ddExam').empty();
			$('#testDetailsModal').find('#ddExam').append(examObj);
		}.bind(this));
		var id = 0;
		var update = $(e.currentTarget).hasClass('update');
		if(update){
			id = $(e.currentTarget).parents('tr').find('.tdCategoryId').text();
		}
		$('#testDetailsModal').find('#btnTestDetailsSave').unbind().bind('click', function(){
			this.SaveTestDetails(update, id);
		}.bind(this));
		$('#testDetailsModal').find('#btnTestRefresh').unbind().bind('click', function(){
			this.RefreshTestModal();
		}.bind(this));
	}.bind(this));
	
	$('.deleteTest').unbind().bind('click', function(e){
		var testId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		console.log(testId);
		$('#deleteTestModal').modal('show');
		$('#deleteTestModal').find('.modal-body').find('p').find('span').text("SSC ?");
		$('#deleteTestModal').find('#btnDeleteYes').unbind().bind('click', function(){
			this.DeleteTest(testId, e);
		}.bind(this));
	}.bind(this));
};
testController.prototype.LoadView = function()
{
	$('.menu-page-content').load('test.html', function(){
		this.LoadAllTests(function(){
			this.BindEvents();
		}.bind(this));
	}.bind(this));
};
testController.prototype.LoadAllTests = function(callback)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/test',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var tests = response.data;
					var testObj = "";
					for(var test in tests){
						this.tests[tests[test]['id']] = tests[test];
						testObj += "<tr>"+
										"<td class='tdTestId'>"+tests[test]['id']+"</td>"+
										"<td class='tdTestName'>"+tests[test]['name']+"</td>"+
										"<td class='tdTestTitle'>"+tests[test]['title']+"</td>"+
										"<td class='tdTestQuestions'>"+tests[test]['totalQues']+"</td>"+
										"<td class='tdTestMarks'>"+tests[test]['totalMarks']+"</td>"+
										"<td class='tdTestTime'>"+tests[test]['totalTime']+"</td>"+
										"<td>"+
											"<button class='btn btn-default addEditTest update'>Edit</button>"+
											"<button class='btn btn-default deleteTest'>Delete</button>"+
										"</td>"+
									"</tr>";
					}
					$('.existing-tests').find('table').find('tbody').append(testObj);
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
testController.prototype.SaveTestDetails = function(update, id)
{
	console.log('Saving (Add/Update) Test');
	var name = $('#txtTestName').val();
	var title = $('#txtTestTitle').val();
	var questions = $('#txtTestQuestions').val();
	var time = $('#txtTestTime').val();
	var marks = $('#txtTestMarks').val();
	var allowedAttempts = $('#txtTestAttempts').val();
	var category = $('#ddCategory').val();
	var exam = $('#ddExam').val();
	if(name.length == 0 || title.length == 0 || questions.lenght == 0 || time.length == 0 || marks.length == 0 ||
			allowedAttempts.length == 0 || category.length == 0 || exam.length == 0){
		//alert('Please enter all the mandatory fields');
		//return;
	}
	var url = 'http://localhost:8083/test2bsure/test';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'noOfSections': 1,
			'totalQues': questions,
			'totalMarks': marks,
			'totalTime': time,
			'noOfAttempts': allowedAttempts,
			'exams': [exam],
			'active': 1
		};
	console.log(requestData);
	if(update){
		requestData.id = id;
		type = 'PUT';
	}
	
	console.log('Call to save test');
	$.ajax({
		url: url,
		type: type,
		data: JSON.stringify(requestData),
		contentType: "application/json",
		success: function(response){
			if(response.status == true){
				$('#testQuesModal').modal('show');
				this.id = response.status.message;
				$.ajax({
					url: "http://localhost:8083/test2bsure/question",
					type: 'GET',
					success: function(response){
						if(response.result.status == true){
							if(response.data != null && response.data.length > 0){
								var questions = response.data;
								var quesObj = "";
								for(var ques in questions){
									quesObj += "<tr>"+
									"<td class='tdAddQuestionId'>"+questions[ques]['id']+"</td>"+
									"<td class='tdAddQuestionText'>"+questions[ques]['questionText']+"</td>"+
									"<td>"+
										"<button class='btn btn-default btnEditQuestion update'>E</button>"+
										"<button class='btn btn-default btnAddQuestion'>+</button>"+
									"</td>"+
									"</tr>";
								}
								$('.add-more-ques').find('table').find('tbody').append(quesObj);
							}
						}
						
					},
					error: function(e){
						alert(e);
					}
				});
			}
			else{
				alert(response.message);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
	//comment after ajax call is done
	/*$('#sectionDetailsModal').modal('show');
	$('#sectionDetailsModal').find('#btnAddSection').unbind().bind('click', function(){
		this.sectionCount ++;
		var html = "<div class='sectionCount' id='section-"+(this.sectionCount)+"'>"+
					"<div>"+
						"<h4 style='font-weight:bold' class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3"+
						"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Section - "+(this.sectionCount)+"</h4>"+
						"<span class='col-xs-4 col-sm-4 col-md-4 col-lg-4'><button class='btn btn-default btnRemoveSection' type='button'>Remove</button></span>"+
					"</div>"+
					"<div>"+
						"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
						"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Name"+
							"*</span> <input id='txtSectionName-"+(this.sectionCount)+"' type='text'"+
							"class='col-xs-4 col-sm-4 col-md-4 col-lg-4' />"+
					"</div>"+
					"<div>"+
						"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
						"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Title"+
							"*</span> <input id='txtSectionTitle-"+(this.sectionCount)+"' type='text'"+
							"class='col-xs-4 col-sm-4 col-md-4 col-lg-4' />"+
					"</div>"+
					"<div>"+
						"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
						"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Number of Ques"+
							"*</span> <input id='txtSectionQues-"+(this.sectionCount)+"' type='number'"+
							"class='col-xs-4 col-sm-4 col-md-4 col-lg-4' />"+
					"</div>"+
					"<div>"+
						"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
						"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Correct Answer Marks"+
							"*</span> <input id='txtSectionCorrect-"+(this.sectionCount)+"' type='number'"+
							"class='col-xs-4 col-sm-4 col-md-4 col-lg-4' />"+
					"</div>"+
					"<div>"+
						"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
						"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Negative Marks"+
							"*</span> <input id='txtSectionIncorrect-"+(this.sectionCount)+"' type='number'"+
							"class='col-xs-4 col-sm-4 col-md-4 col-lg-4' />"+
					"</div>"+
					"<div>"+
						"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
						"col-xs-2 col-sm-2 col-md-2 col-lg-2'>Sectional Time"+
							"</span> <input id='txtSectionTime-"+(this.sectionCount)+"' type='number'"+
							"class='col-xs-4 col-sm-4 col-md-4 col-lg-4' />"+
					"</div>"+
				"</div>";
		$('#sectionDetailsModal').find('.sectionDetails').append(html);
	}.bind(this));
	$('#sectionDetailsModal').find('#btnSectionDetailsSave').unbind().bind('click', function(){
		$('#testQuesModal').show();
	}.bind(this));*/
};

testController.prototype.DeleteTest = function(testId, e)
{
	console.log('Delete Test');
	$.ajax({
		url: "http://localhost:8083/test2bsure?id="+testId,
		type: 'DELETE',
		
		success: function(response){
			if(response.status == true){
				$('#deleteTestModal').modal('hide');
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
		},
		error: function(e){
			alert(e);
		}
	});
};
testController.prototype.PopulateTestData = function(e)
{
	var catObj = "";
	for(var category in this.categories){
		catObj += "<option value='"+this.categories[category]['id']+"'>"+this.categories[category]['title']+"</option>";
	}
	$('#testDetailsModal').find('#ddCategory').append(catObj);
	var examObj = "";
	for(var exam in this.exams){
		examObj += "<option value='"+this.exams[exam]['id']+"'>"+this.exams[exam]['title']+"</option>";
	}
	$('#testDetailsModal').find('#ddExam').append(examObj);
	
	var name = "";
	var title = "";
	var ques = "";
	var time = "";
	var marks = "";
	var attempts = "";
	var exam = "";
	var category = "";
	if($(e.currentTarget).hasClass('update')){
		var currentId = $(e.currentTarget).parents('tr').find('.tdTestId').text();
		var test = this.tests[currentId];
		name = test["name"];
		title = test["title"];
		ques = test["totalQues"];
		time = test["totalTime"];
		marks = test["totalTime"];
		attempts = test["noOfAttempts"];
		exam = test["examId"];
		category = this.exams[exam]["category"];
	}
	$('#testDetailsModal').find('#txtTestName').val(name);
	$('#testDetailsModal').find('#txtTestTitle').val(title);
	$('#testDetailsModal').find('#txtTestQuestions').val(ques);
	$('#testDetailsModal').find('#txtTestTime').val(time);
	$('#testDetailsModal').find('#txtTestMarks').val(marks);
	$('#testDetailsModal').find('#txtTestAttempts').val(attempts);
	$('#testDetailsModal').find('#ddCategory').val(category);
	$('#testDetailsModal').find('#ddExam').val(exam);
};
testController.prototype.RefreshTestModal = function()
{
	$('#testDetailsModal').find('input[type="text"]').val('');
};
testController.prototype.SearchTestByName = function()
{
	console.log('Searching test by name/title');
};
testController.prototype.AddSectionDetails = function()
{
	var sectionCount = parseInt($('#testDetailsModal').find('#txtTestSections').val());
	var exist = $('.sectionDetails').find('.sectionCount').length;
	var start = exist;
	start = start < 0 ? 0 : start;
	for(var i=start; i < sectionCount; i++){
		
		$('#testDetailsModal').find('.sectionDetails').find('.btnRemoveSection').unbind().bind('click', function(e){
			$(e.currentTarget).parent().remove();
			$('#testDetailsModal').find('#txtTestSections').val(parseInt($('#testDetailsModal').find('#txtTestSections').val()) - 1);
		});
	}
};
testController.prototype.LoadCategories = function()
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/category',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var categories = response.data;
					for(var category in categories){
						this.categories[categories[category]["id"]] = categories[category];
					}
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
testController.prototype.LoadExams = function()
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/exam',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var exams = response.data;
					for(var exam in exams){
						this.exams[exams[exam]["id"]] = exams[exam];
					}
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};