var testController = function(){
	this.sectionCount = 0;
	this.categories = {};
	this.id = 0;
	this.exams = {};
	this.tests = {};
	this.questions = {};
	this.questionCategory = {};
	this.questionSubcategory = {};
	this.selectedQuestions = [];
	this.allExams = {};
	this.Init();
};
testController.prototype.Init = function()
{
	console.log('Initiate Test');
	this.LoadCategories();
	this.LoadExams();
	this.LoadQuestions();
	this.GetQuestionCategories();
	this.LoadView();
};
testController.prototype.BindEvents = function()
{
	//Search quiz by name/title - button
	$('#btnSearchTest').unbind().bind('click', function(){
		this.SearchTestByName(function(){
			this.BindEvents();
		}.bind(this));
	}.bind(this));
	
	//Add/Update Test$(e.currentTarget).val()
	$('.addEditTest').unbind().bind('click', function(e){
		$('#testDetailsModal').modal('show');
		summernoteController.getObj().addEditor('#txtTestInstructions');
		RefreshData('testDetailsModal');
		var obj = AutoComplete.getObj();
		obj.dom = $('#testDetailsModal').find('#selectedExam');
		$('#testDetailsModal').find('#ddTestExam').unbind().bind('keyup', function(evt){
			this.SearchExams($(evt.currentTarget).val(), function(){
				obj.list = this.exams;
				obj.PopulateList($('#testDetailsModal').find('#selectedExam'));
			}.bind(this));
		}.bind(this));
		this.PopulateTestData(e);
		var id = 0;
		var update = $(e.currentTarget).hasClass('update');
		if(update){
			id = $(e.currentTarget).parents('tr').find('.tdTestId').text();
		}
		$('#testDetailsModal').find('#btnTestDetailsSave').unbind().bind('click', function(){
			this.SaveTestDetails(update, id);
		}.bind(this));
		$('#testDetailsModal').find('#btnTestRefresh').unbind().bind('click', function(){
			RefreshData('testDetailsModal');
		}.bind(this));
		$('#testDetailsModal').find('#btnTestCancel').unbind().bind('click', function(){
			$('#testDetailsModal').modal('hide');
			$('.menu-tabs').find('li[class="active"]').find('a').click();
		}.bind(this));
		$('#testDetailsModal').find('.close').unbind().bind('click', function(){
			$('#testDetailsModal').modal('hide');
			$('.menu-tabs').find('li[class="active"]').find('a').click();
		}.bind(this));
		$('#testDetailsModal').find('#chkTestLock').unbind().bind('change', function(e){
			var lockValue = $(e.currentTarget).prop('checked');
			if(lockValue == true){
				$('#txtTestLockPoints').removeClass('lockDetails');
				$('#txtTestLockRupees').removeClass('lockDetails');
			}
			else if(lockValue == false){
				$('#txtTestLockPoints').addClass('lockDetails');
				$('#txtTestLockRupees').addClass('lockDetails');
			}
		});
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
	
	//Publish/Unpublish Test
	$('.testStatus').unbind().bind('click', function(e){
		var testId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		//var testStatus = $(e.currentTarget).attr('test-status');
		this.HandleTestStatus(testId);
	}.bind(this));
	
	//Add section
	$('#testDetailsModal').find('#btnAddSection').unbind().bind('click', function(){
		console.log("Add section");
		this.sectionCount++;
		this.AddSection();
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
						var testStatus = tests[test]['publish'];
						var btnText = testStatus == 1 ? 'Unpublish' : 'Publish';
						var btnCss = testStatus == 1 ? "background-color:red;color:white;font-weight:bold;" : "background-color:green;color:white;font-weight:bold;";
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
											"<button class='btn btn-default testStatus' test-status='"+testStatus+"' style='"+btnCss+"'>"+btnText+"</button>"+
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
testController.prototype.SaveTestDetails = function(update, id, navigate)
{
	if(typeof navigate == 'undefined'){
		navigate = true;
	}
	console.log('Saving (Add/Update) Test');
	var name = $('#txtTestName').val();
	var title = $('#txtTestTitle').val();
	var questions = $('#txtTestQuestions').val();
	var time = $('#txtTestTime').val();
	var marks = $('#txtTestMarks').val();
	var allowedAttempts = $('#txtTestAttempts').val();
	var publish = $('#chkTestPublish').prop('checked') == true ? 1 : 0;
	var exams = [];
	var lock = ($('#chkTestLock').prop('checked') == true) ? 1 : 0;
	var lockPoints = (typeof $('#txtTestLockPoints').val() != 'undefined') ? $('#txtTestLockPoints').val() : 0;
	var lockRupees = (typeof $('#txtTestLockRupees').val() != 'undefined') ? $('#txtTestLockRupees').val() : 0;
	var negativeMarks = $('#txtTestNegative').val();
	var passPercent = $('#txtPassPer').val();
	var shuffleQues = $('#chkShuffleQues').prop('checked') == true ? 1 : 0;
	var shuffleOptions = $('#chkShuffleOptions').prop('checked') == true ? 1 : 0;
	
	$('#testDetailsModal').find('#selectedExam').find('span.selectedExam').each(function(e){
		console.log(this);
		exams.push($(this).attr("data-id"));
	});
	if(name.length == 0 || title.length == 0 || questions.lenght == 0 || time.length == 0 || marks.length == 0 ||
			allowedAttempts.length == 0 || negativeMarks.length == 0 || passPercent.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	//Manage sections
	var totalQues = 0;
	var totalTime = 0;
	var sectionDetails = [];
	var allSections = $('#testDetailsModal').find('.sectionDetails').find('.section');
	for(var i = 0; i<allSections.length; i++){
		var section = allSections[i];
		if($(section).find('.txtSectionName').val().length == 0 || $(section).find('.txtSectionQues').val().length == 0 || $(section).find('.txtSectionTime').val().length == 0){
			alert('Please enter all the section details or remove the section');
			return;
		}
		var obj = {};
		obj.name = $(section).find('.txtSectionName').val();
		obj.questions = $(section).find('.txtSectionQues').val();
		totalQues += parseInt(obj.questions);
		obj.time = $(section).find('.txtSectionTime').val();
		totalTime += parseInt(obj.time);
		sectionDetails.push(obj);
	}
	if(allSections.length > 0 && parseInt(questions) != parseInt(totalQues)){
		alert('Total of questions in section should be equal to the the total number of questions');
		return false;
	}
	if(allSections.length > 0 && parseInt(time) != parseInt(totalTime)){
		alert('Total of time in section should be equal to the the total time');
		return false;
	}
	var url = 'http://localhost:8083/test2bsure/test';
	var type = 'POST';
	var requestData = {
			'name': name,
			'title': title,
			'noOfSections': sectionDetails.length,
			'sectionDetails': JSON.stringify(sectionDetails),
			'totalQues': questions,
			'totalMarks': marks,
			'totalTime': time,
			'noOfAttempts': allowedAttempts,
			'exams': exams,
			'active': 1,
			'publish': publish,
			'lockApply': lock,
			'lockPoints': lockPoints,
			'lockRupees': lockRupees,
			'negativeMarks' : negativeMarks,
			'passPercent' : passPercent,
			'shuffleQues' : shuffleQues,
			'shuffleOptions' : shuffleOptions
	
		};
	console.log(requestData);
	if(update){
		requestData.id = id;
		type = 'PUT';
	}
	else if(parseInt(this.id) > 0){
		requestData.id = this.id;
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
				this.id = response.message;
				if(navigate == true){
					$('#testQuesModal').modal('show');
					this.BindQuestionCategoryEvents();
					$('#testQuesModal').find('#btnTestFinish').unbind().bind('click', function(){
						//Check the no. of ques added and entered are same or not
						//if not same, update the total no. of questions in details as per the no. of questions added
						var entered = $('#testDetailsModal').find('#txtTestQuestions').val();
						var added = $('#testQuesModal').find('.divCountQuesTest').find('span.noOfQues').text();
						if(entered != added){
							alert("Number of questions entered and added are not same," +
									" updating the total number of questions as per the added number of questions");
							$('#testDetailsModal').find('#txtTestQuestions').val(added);
							this.SaveTestDetails(true, this.id, false);
						}
						$('#testQuesModal').modal('hide');
						$('#testDetailsModal').modal('hide');
						$('.menu-tabs').find('li[class="active"]').find('a').click();
					}.bind(this));
					this.HandleTestQuestions();
				}
			}
			else{
				alert(response.message);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
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
	var name = "";
	var title = "";
	var ques = "";
	var time = "";
	var marks = "";
	var attempts = "";
	var exams = "";
	var publish = 0;
	var lock = 0;
	var negativeMarks = 0;
	var passPercent = 0;
	var shuffleQues = 0;
	var shuffleOptions = 0;
	var sectionDetails = {};
	if($(e.currentTarget).hasClass('update')){
		var currentId = $(e.currentTarget).parents('tr').find('.tdTestId').text();
		var test = this.tests[currentId];
		name = test["name"];
		title = test["title"];
		ques = test["totalQues"];
		time = test["totalTime"];
		marks = test["totalMarks"];
		negativeMarks = test["negativeMarks"];
		passPercent = test["passPercent"];
		shuffleQues = test["shuffleQues"];
		shuffleOptions = test["shuffleOptions"];
		attempts = test["noOfAttempts"];
		publish = test["publish"];
		lock = test["lockApply"];
		sectionDetails = test["sectionDetails"];
		if(test["exams"] != null && test["exams"].length > 0){
			var html = "";
			for(var exam in test["exams"]){
				console.log(exam);
				console.log(test["exams"][exam]);
				html += "<span>"+
							"<span class='selectedExam' data-id='"+test["exams"][exam]+"'>"+
							this.allExams[test["exams"][exam]].title+"</span>"+
							"<button>x</button>"+
						"</span>";
			}
			$('#selectedExam').html(html);
			$("#selectedExam").find('button').unbind().bind('click', function(e){
				$(e.currentTarget).parent('span').remove();
			});
		}
		else{
			$('#selectedExam').html('');
		}
		
		if((sectionDetails != null && sectionDetails != "null") && JSON.parse(sectionDetails).length > 0){
			for(var i = 0; i < JSON.parse(sectionDetails).length; i++){
				var section = JSON.parse(sectionDetails)[i];
				$('#testDetailsModal').find('#btnAddSection').click();
				$('#testDetailsModal').find('.section').find('.txtSectionName-'+(i+1)).val(section.name);
				$('#testDetailsModal').find('.section').find('.txtSectionQues-'+(i+1)).val(section.questions);
				$('#testDetailsModal').find('.section').find('.txtSectionTime-'+(i+1)).val(section.time);
			}
		}
	}
	$('#testDetailsModal').find('#txtTestName').val(name);
	$('#testDetailsModal').find('#txtTestTitle').val(title);
	$('#testDetailsModal').find('#txtTestQuestions').val(ques);
	$('#testDetailsModal').find('#txtTestTime').val(time);
	$('#testDetailsModal').find('#txtTestMarks').val(marks);
	$('#testDetailsModal').find('#txtTestNegative').val(negativeMarks);
	$('#testDetailsModal').find('#txtPassPer').val(passPercent);
	$('#testDetailsModal').find('#txtTestAttempts').val(attempts);
	$('#testDetailsModal').find('#ddTestExam').val('');
	var testStatus = false;
	if(publish == 1){
		testStatus = true;
	}
	$('#testDetailsModal').find('#chkTestPublish').prop('checked', testStatus);
	var lockStatus = false;
	if(lock == 1){
		lockStatus = true;
		$('#txtTestLockPoints').removeClass('lockDetails');
		$('#txtTestLockRupees').removeClass('lockDetails');
		$('#txtTestLockPoints').val(test["lockPoints"]);
		$('#txtTestLockRupees').val(test["lockRupees"]);
	}
	else if(lock == 0){
		lockStatus = false;
		$('#txtTestLockPoints').addClass('lockDetails');
		$('#txtTestLockRupees').addClass('lockDetails');
	}
	$('#testDetailsModal').find('#chkTestLock').prop('checked', lockStatus);
	
	var shuffleQuesStatus = false;
	if(shuffleQues == 1){
		shuffleQuesStatus = true;
	}
	$('#testDetailsModal').find('#chkShuffleQues').prop('checked', shuffleQuesStatus);
	
	var shuffleOptionsStatus = false;
	if(shuffleOptions == 1){
		shuffleOptionsStatus = true;
	}
	$('#testDetailsModal').find('#chkShuffleOptions').prop('checked', shuffleOptionsStatus);
};
testController.prototype.SearchTestByName = function(callback)
{
	console.log('Searching test by name/title');
	var search = $('#txtSearchTest').val();
	$.ajax({
		url: 'http://localhost:8083/test2bsure/test?search='+search,
		type: 'GET',
		success: function(response){
			$('.existing-tests').find('table').find('tbody').empty();
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var tests = response.data;
					var testObj = "";
					for(var test in tests){
						this.tests[tests[test]['id']] = tests[test];
						var testStatus = tests[test]['publish'];
						var btnText = testStatus == 1 ? 'Unpublish' : 'Publish';
						var btnCss = testStatus == 1 ? "background-color:red;color:white;font-weight:bold;" : "background-color:green;color:white;font-weight:bold;";
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
											"<button class='btn btn-default testStatus' test-status='"+testStatus+"' style='"+btnCss+"'>"+btnText+"</button>"+
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
testController.prototype.AddSection = function()
{
	var html = '<div class="section" section-id="'+this.sectionCount+'" style="height:auto;border:solid 1px white;">'+
			   		'<div>'+
			   			'<button type="button" section-id="'+this.sectionCount+'" class="btnRemoveSection btn btn-danger col-xs-offset-2 col-sm-offset-2 col-md-offset-2 '+
			   				'col-lg-offset-2 col-xs-1 col-sm-1 col-md-1 col-lg-1">Remove</button>'+
						'<span class="col-xs-2 col-sm-2 col-md-2 col-lg-2">Name<span class="red">*</span></span>'+
				   		'<span class="col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2">Questions<span class="red">*</span></span>'+
				   		'<span class="col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2">Time<span class="red">*</span></span>'+
				   	'</div>'+
				   	'<div>'+
						'<input type="text" class="txtSectionName '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2 txtSectionName-'+this.sectionCount+'"/>'+
				   		'<input type="number" class="txtSectionQues col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2 txtSectionQues-'+this.sectionCount+'"/>'+
				   		'<input type="number" class="txtSectionTime col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 '+
				   			'col-xs-2 col-sm-2 col-md-2 col-lg-2 txtSectionTime-'+this.sectionCount+'"/>'+
				   		
				   	'</div>'+
			   '</div>';
	$('#testDetailsModal').find('.sectionDetails').append(html);
	$('#testDetailsModal').find('.sectionDetails').find('.btnRemoveSection').unbind().bind('click', function(e){
		console.log(e.currentTarget);
		var sectionId = $(e.currentTarget).attr('section-id');
		$('#testDetailsModal').find('.sectionDetails').find('.section[section-id='+sectionId+']').remove();
	});
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
						this.allExams[exams[exam]["id"]] = exams[exam];
					}
				}
			}
			if(typeof callback != 'undefined')
				callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback != 'undefined')
				callback();
		}
	});
};
testController.prototype.SearchExams = function(value, callback)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/exam?search='+value,
		type: 'GET',
		success: function(response){
			this.exams = {};
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var exams = response.data;
					for(var exam in exams){
						this.exams[exams[exam]["id"]] = exams[exam];
					}
				}
			}
			if(typeof callback != 'undefined')
				callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback != 'undefined')
				callback();
		}
	});
};
testController.prototype.LoadQuestions = function(callback)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/question',
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var questions = response.data;
					for(var ques in questions){
						this.questions[questions[ques]["id"]] = questions[ques];
					}
					
				}
			}
			if(typeof callback != 'undefined')
				callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback != 'undefined')
				callback();
		}
	});
};
testController.prototype.HandleTestStatus = function(id)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/teststatus?id='+id,
		type: 'PUT',
		success: function(response){
			console.log(response);
			if(response.status == true){
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
			else{
				alert(response.message);
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
}
testController.prototype.HandleTestQuestions = function()
{
	$('#testQuesModal').find('.all-questions').find('tbody').html('');
	$('#testQuesModal').find('.added-questions').find('tbody').html('');
	this.selectedQuestions = [];
	this.PopulateTestQuestions(function(){
		this.PopulateFilteredQuestions();
	}.bind(this));
};
testController.prototype.PopulateTestQuestions = function(callback)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/testquestion?testid='+this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					$('.divCountQuesTest').find('.noOfQues').text(response.data.length);
					var html = "";
					var questions = response.data;
					for(var ques in questions){
						var quesId = questions[ques];
						this.selectedQuestions.push(quesId);
						html += "<tr>"+
									"<td class='addedQuesId'>"+this.questions[quesId]["id"]+"</td>"+
									"<td class='addedQuesText'>"+this.questions[quesId]["questionText"]+"</td>"+
									"<td><button class='btn btn-primary removeQues'>X</button>"+
								"</tr>";
					}
					$('#testQuesModal').find('.added-questions').find('tbody').html(html);
					$('#testQuesModal').find('.added-questions').find('.removeQues').unbind().bind('click', function(e){
						this.DeleteTestQuestion($(e.currentTarget).parents('tr').find('.addedQuesId').text());
					}.bind(this));
				}
			}
			if(typeof callback != 'undefined')
				callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback != 'undefined')
				callback();
		}
	});
};
testController.prototype.PopulateAllQuestions = function()
{
	var html = "";
	for(var ques in this.questions){
		if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1){
			html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";
		}
	}
	$('#testQuesModal').find('.all-questions').find('tbody').html(html);
	$('#testQuesModal').find('.all-questions').find('.selectQues').unbind().bind('click', function(e){
		this.AddTestQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
	}.bind(this));
};
testController.prototype.AddTestQuestion = function(quesId)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/testquestion',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			"questionId": quesId,
			"testId": this.id
		}),
		success: function(response){
			if(response.status == true){
				this.HandleTestQuestions();
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
testController.prototype.DeleteTestQuestion = function(quesId)
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/testquestion',
		type: 'DELETE',
		contentType: 'application/json',
		data: JSON.stringify({
			"questionId": quesId,
			"testId": this.id
		}),
		success: function(response){
			if(response.status == true){
				this.HandleTestQuestions();
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
testController.prototype.BindQuestionCategoryEvents = function()
{
	if(this.questionCategory.length > 0){
		var catObj = "<option value=''>All</option>";
		for(var category in this.questionCategory){
			catObj += "<option value='"+this.questionCategory[category]['id']+"'>"+this.questionCategory[category]['name']+"</option>";
		}
		$('#testQuesModal').find('#ddQuestionCategory').html(catObj);
	}
	if(this.questionSubcategory.length > 0){
		var subcatObj = "<option value=''>All</option>";
		for(var subcategory in this.questionSubcategory){
			subcatObj += "<option value='"+this.questionSubcategory[subcategory]['id']+"'>"+this.questionSubcategory[subcategory]['name']+"</option>";
		}
		$('#testQuesModal').find('#ddQuestionSubCategory').html(subcatObj);
	}
	$('#testQuesModal').find('#ddQuestionCategory').on('change', function(e){
		console.log($(e.currentTarget).val());
		var html = "<option value=''>All</option>";
		html += this.PopulateQuestionSubcategory($(e.currentTarget).val());
		$('#testQuesModal').find('#ddQuestionSubCategory').html(html);
	}.bind(this));
	$('#testQuesModal').find("#btnSearchQues").unbind().bind('click', function(e){
		this.PopulateFilteredQuestions();
	}.bind(this));
};
testController.prototype.PopulateFilteredQuestions = function()
{
	var category = $('#testQuesModal').find('#ddQuestionCategory').val();
	var subcategory = $('#testQuesModal').find('#ddQuestionSubCategory').val();
	var html = "";
	for(var ques in this.questions){
		if(category.length == 0){
			//All category selected
			if(subcategory.length == 0){
				//All category and all subcategory selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";
				}
			}
			else{
				//All category selected but not all subcategory
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionSubcategory"] == subcategory){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";
				}
			}
		}
		else{
			//All category not selected
			if(subcategory.length == 0){
				//All category not selected but all subcategory selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionCategory"] == category){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";
				}
			}
			else{
				//All category not selected and all subcategory not selected
				if(this.selectedQuestions.indexOf(this.questions[ques]["id"]) == -1 && this.questions[ques]["questionCategory"] == category && this.questions[ques]["questionSubcategory"] == subcategory){
					html += "<tr>"+
						"<td class='addQuesId'>"+this.questions[ques]["id"]+"</td>"+
						"<td class='addQuesText'>"+this.questions[ques]["questionText"]+"</td>"+
						"<td><button class='btn btn-primary selectQues'>Add</button>"+
					"</tr>";

				}
			}
		}
	}
	$('#testQuesModal').find('.all-questions').find('tbody').html(html);
	$('#testQuesModal').find('.all-questions').find('.selectQues').unbind().bind('click', function(e){
		this.AddTestQuestion($(e.currentTarget).parents('tr').find('.addQuesId').text());
	}.bind(this));
};
testController.prototype.GetQuestionCategories = function()
{
	$.ajax({
		url: 'http://localhost:8083/test2bsure/question-category',
		type: 'GET',
		success: function(response){
			console.log(response);
			if(response.result.status == true){
				if(response.categories != null && response.categories.length > 0){
					this.questionCategory = response.categories;
				}
				if(response.subcategories != null && response.subcategories.length > 0){
					this.questionSubcategory = response.subcategories;
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
testController.prototype.PopulateQuestionSubcategory = function(categoryId)
{
	if(categoryId.length != 0 && categoryId == 0){
		this.BindEvents();
		return false;
	}
	var html = "";
	if(this.questionSubcategory.length > 0){
		for(var obj in this.questionSubcategory){
			if(categoryId == ''){
				html += "<option value='"+this.questionSubcategory[obj]['id']+"'>"+this.questionSubcategory[obj]['name']+"</option>";
			}
			else if(this.questionSubcategory[obj]["categoryId"] == categoryId){
				html += "<option value='"+this.questionSubcategory[obj]['id']+"'>"+this.questionSubcategory[obj]['name']+"</option>";
			}
		}
	}
	return html;
};