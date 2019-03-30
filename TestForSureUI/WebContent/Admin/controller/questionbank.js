var questionbankController = function(){
	this.questions = {};
	this.questionCategory = {};
	this.questionSubcategory = {};
	this.Init();
};
questionbankController.prototype.Init = function()
{
	console.log('Initiate question bank');
	this.GetQuestionCategories(function(){
		this.LoadView();
	}.bind(this));
};
questionbankController.prototype.BindEvents = function()
{
	if(this.questionCategory.length > 0){
		var catObj = "<option value=''>All</option>";
		for(var category in this.questionCategory){
			catObj += "<option value='"+this.questionCategory[category]['id']+"'>"+this.questionCategory[category]['name']+"</option>";
		}
		$('#ddSearchQuesCategory').html(catObj);
	}
	if(this.questionSubcategory.length > 0){
		var subcatObj = "<option value=''>All</option>";
		for(var subcategory in this.questionSubcategory){
			subcatObj += "<option value='"+this.questionSubcategory[subcategory]['id']+"'>"+this.questionSubcategory[subcategory]['name']+"</option>";
		}
		$('#ddSearchQuesSubCategory').html(subcatObj);
	}
	$('#ddSearchQuesCategory').on('change', function(e){
		console.log($(e.currentTarget).val());
		var html = "<option value=''>All</option>";
		html += this.PopulateQuestionSubcategory($(e.currentTarget).val());
		$('#ddSearchQuesSubCategory').html(html);
	}.bind(this));
	$("#btnSearchQuestion").unbind().bind('click', function(e){
		this.PopulateFilteredQuestions($('#ddSearchQuesCategory').val(), $('#ddSearchQuesSubCategory').val());
	}.bind(this));
	
};
questionbankController.prototype.BindTableEvents = function()
{
	//Add/Update Question
	$('.addEditQuestion').unbind().bind('click', function(e){
		this.AddQuestionModal();
		this.PopulateQuestionData(e);
	}.bind(this));
	
	$('.deleteQuestion').unbind().bind('click', function(e){
		var questionId = $(e.currentTarget).parents('tr').find('td:first-child').text();
		$('#deleteQuestionModal').modal('show');
		$('#deleteQuestionModal').find('#btnDeleteYes').unbind().bind('click', function(){
			this.DeleteQuestion(questionId, e);
		}.bind(this));
	}.bind(this));
};
questionbankController.prototype.LoadView = function()
{
	$('.menu-page-content').load('questionbank.html', function(){
		this.LoadAllQuestions(0, function(length){
			this.HandleRecords(length);
			this.BindEvents();
			this.BindTableEvents();
		}.bind(this));
	}.bind(this));
};
questionbankController.prototype.LoadAllQuestions = function(start, callback)
{
	$.ajax({
		url: remoteServer+'/test2bsure/question?count='+perPage+'&start='+start,
		type: 'GET',
		contentType: 'application/json',
		success: function(response){
			if(response.result.status == true){
				if(response.data !=  null && response.data.length > 0){
					var questions = response.data;
					var quesObj = "";
					for(var ques in questions){
						this.questions[questions[ques]["id"]] = questions[ques];
						quesObj += "<tr>"+
							"<td class='tdQuestionId'>"+questions[ques]['id']+"</td>"+
							"<td class='tdQuestionName'>"+questions[ques]['questionText']+"</td>"+
							"<td>"+
								"<button class='btn btn-default addEditQuestion update'>Edit</button>"+
								"<button class='btn btn-default deleteQuestion'>Delete</button>"+
							"</td>"+
							"</tr>";
					}
					$('.existing-questions').find('table').find('tbody').html(quesObj);
				}
			}
			if(typeof callback == 'function')
				callback(response.result.length);
		}.bind(this),
		error: function(e){
			console.log(e);
			if(typeof callback == 'function')
				callback();
		}
	});
};
questionbankController.prototype.AddQuestionModal = function()
{
	$('#questionModal').show();
	console.log(this.questionCategory);
	var summernote = summernoteController.getObj();
	summernote.addEditor('#txtParagraphText');
	summernote.addEditor('#txtQuestionText');
	summernote.addEditor('.txtOptions');
	summernote.addEditor('#txtSolution');
	RefreshData('questionModal');
	$('#questionModal').find('.added-options').remove();
	//Question Category
	var categoryHtml = "<option value=''>Select</option>";
	for(var category in this.questionCategory){
		categoryHtml += "<option value = '"+this.questionCategory[category].id+"'>"+this.questionCategory[category].name+"</option>"
	}
	categoryHtml += "<option value='0'>+ Add new category</option>";
	$('#questionModal').find('#ddQuestionCategory').html(categoryHtml);
	
	$('#questionModal').find('#ddQuestionCategory').on('change', function(e){
		if($(e.currentTarget).val() == '0'){
			$('#questionModal').find('.addQuesCategory').show();
			$('#questionModal').find('.addQuesCategory').find('#btnAddQuesCategory').unbind().bind('click', function(){
				//Add a new Question category POST question-category(String category)
				var newCategory = $('#questionModal').find('#txtQuesCategory').val();
				if(newCategory.length == 0){
					alert("Please enter Question Category.");
					return;
				}
				$.ajax({
					url: remoteServer+"/test2bsure/question-category?category="+newCategory,
					type: 'POST',
					success: function(response){
						console.log(response);
						if(response.status == true){
							$("<option value='"+response.message+"'>"+newCategory+"</option>").insertBefore($('#questionModal').find('#ddQuestionCategory').find('option[value=0]'));
							$('#questionModal').find('.addQuesCategory').hide();
							$('#questionModal').find('#ddQuestionCategory').val(response.message);
							var html = "<option value=''>Select</option>";
							html += this.PopulateQuestionSubcategory(response.message);
							html += "<option value='0'>+ Add new subcategory</option>";
							$('#questionModal').find('#ddQuestionSubCategory').html(html);
						}
						
					}.bind(this),
					error: function(e){
						alert(e);
					}
				});
			}.bind(this));
		}
		else{
			$('#questionModal').find('.addQuesCategory').hide();
			var html = "<option value=''>Select</option>";
			html += this.PopulateQuestionSubcategory($(e.currentTarget).val());
			html += "<option value='0'>+ Add new subcategory</option>";
			$('#questionModal').find('#ddQuestionSubCategory').html(html);
		}
	}.bind(this));
	//Question Subcategory
	var subcategoryHtml = "<option value=''>Select</option>";
	for(var subcategory in this.questionSubcategory){
		subcategoryHtml += "<option value = '"+this.questionSubcategory[subcategory].id+"'>"+this.questionSubcategory[subcategory].name+"</option>"
	}
	subcategoryHtml += "<option value='0'>+ Add new subcategory</option>";
	$('#questionModal').find('#ddQuestionSubCategory').html(subcategoryHtml);
	$('#questionModal').find('#ddQuestionSubCategory').on('change', function(e){
		if($(e.currentTarget).val() == '0'){
			$('#questionModal').find('.addQuesSubCategory').show();
			$('#questionModal').find('.addQuesSubCategory').find('#btnAddQuesSubCategory').unbind().bind('click', function(){
				//Add a new Question category POST question-subcategory(int categoryId, String subcategory)
				var newSubcategory = $('#questionModal').find('#txtQuesSubCategory').val();
				if(newSubcategory.length == 0){
					alert("Please enter Question Sub Category.");
					return;
				}
				$.ajax({
					url: remoteServer+"/test2bsure/question-subcategory?categoryId="+$('#questionModal').find('#ddQuestionCategory').val()+"&subcategory="+newSubcategory,
					type: 'POST',
					success: function(response){
						console.log(response);
						if(response.status == true){
							$("<option value='"+response.message+"'>"+newSubcategory+"</option>").insertBefore($('#questionModal').find('#ddQuestionSubCategory').find('option[value=0]'));
							$('#questionModal').find('.addQuesSubCategory').hide();
							$('#questionModal').find('#ddQuestionSubCategory').val(response.message);
						}
					},
					error: function(e){
						alert(e);
					}
				});
			});
		}
		else{
			$('#questionModal').find('.addQuesSubCategory').hide();
		}
	});
	
	//Populate QuestionType
	var questionType = Object.keys(QuestionType);
	var quesHtml = "";
	quesHtml += '<option value="">Select</option>';
	for (var type in questionType){
		quesHtml += '<option value="'+type+'">'+questionType[type]+'</option>';
	}
	$('#ddQuestionType').html(quesHtml);
	
	//Add options
	$('#questionModal').find('#btnAddOption').unbind().bind('click', function(){
		var html = "<div class='divOptions added-options'>"+
						"<span class='col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 "+
							"col-xs-2 col-sm-2 col-md-2 col-lg-2'>"+
							"</span> " +
							"<button type='button' "+
								"class='col-sm-1 col-md-1 col-xs-1 col-lg-1 btnRemoveOption'>"+
								"Remove</button>"+
							"<input type='checkbox' class='chkCorrectOption "+
							"col-xs-1 col-sm-1 col-md-1 col-lg-1'/>"+
							"<div "+
								"class='col-xs-4 col-sm-4 col-md-4 col-lg-4 txtOptions'></div>"+
								
					"</div>";
		$(html).insertBefore( "#btnAddOption" );
		summernote.addEditor('.txtOptions');
		$('.btnRemoveOption').unbind().bind('click', function(e){
			$(e.currentTarget).parents('.divOptions').remove();
		});
	});
	$('#questionModal').find('#btnQuestionCancel').unbind().bind('click', function(){
		$('#questionModal').hide();
	});
	$('#questionModal').find('#btnQuestionRefresh').unbind().bind('click', function(){
		RefreshData('questionModal');
	});
	$('#questionModal').find('#btnQuestionSave').unbind().bind('click', function(e){
		var id = 0;
		var update = $(e.currentTarget).hasClass('update');
		if(update){
			id = $(e.currentTarget).parents('tr').find('.tdQuestionId').text();
		}
		this.SaveQuestion(update, id);
	}.bind(this));
	$('#questionModal').find('.close').unbind().bind('click', function(){
		$('#questionModal').hide();
	});
};
questionbankController.prototype.SaveQuestion = function(update, id)
{
	console.log('Saving (Add/Update) Question');
	var categoryId = $('#questionModal').find('#ddQuestionCategory').val();
	var subcategoryId = $('#questionModal').find('#ddQuestionSubCategory').val()
	var quesType = $('#questionModal').find('#ddQuestionType').val();
	var paraBased =	$('#questionModal').find('#chkParagraph').prop('checked');
	var paraText = summernoteController.getObj().getValue('#txtParagraphText');
	var quesText = summernoteController.getObj().getValue('#txtQuestionText');
	var solution = summernoteController.getObj().getValue('#txtSolution');
	if(categoryId.length == 0 || subcategoryId.length == 0 || quesType.length == 0 || quesText.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	if(paraBased == 'true' && paraText.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var allOptions = $('#questionModal').find('.txtOptions');
	var correctOptionDom = $('#questionModal').find('.chkCorrectOption');
	var options = "<options>";
	var correctOptions = [];
	for (var i=0;i<allOptions.length;i++){
		var val = summernoteController.getObj().getValue($(allOptions[i]));
		if(val.length == 0){
			alert('Please enter all the mandatory fields');
			return;
		}
		options += "<option>"+val+"</option>";
		correctOptions.push($(correctOptionDom[i]).prop('checked'));
	}
	options += "</options>";
	var url = remoteServer+'/test2bsure/question';
	var type = 'POST';
	var requestData = {
			'questionCategory': categoryId,
			'questionSubcategory': subcategoryId,
			'questionType': quesType,
			'paragraph': paraBased,
			'paragraphText': paraText,
			'questionText': quesText,
			'options': JSON.stringify(options),
			'correctOption': JSON.stringify(correctOptions),
			'solution': solution,
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
		data: JSON.stringify(requestData),
		contentType: "application/json",
		success: function(response){
			if(response.status == true){
				$('#questionModal').modal('hide');
				$('#questionModal').css('display', 'none');
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
questionbankController.prototype.DeleteQuestion = function(questionId, e)
{
	console.log('Delete Question');
	$.ajax({
		url: remoteServer+"/test2bsure/question?id="+questionId,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteQuestionModal').modal('hide');
				$('.menu-tabs').find('li[class="active"]').find('a').click();
			}
		},
		error: function(e){
			alert(e);
		}
	});
};
questionbankController.prototype.PopulateQuestionData = function(e)
{
	var quesCategory = "";
	var quesSubcategory = "";
	var quesType = "";
	var paraBased = "";
	var paraText = "";
	var quesText = "";
	var options = "";
	var correctOption = "";
	var solution = "";
	if($(e.currentTarget).hasClass('update')){
		var currentQues = $(e.currentTarget).parents('tr').find('.tdQuestionId').text();
		quesCategory = this.questions[currentQues]["questioncategory"];
		quesSubcategory = this.questions[currentQues]["questionSubcategory"];
		quesType = this.questions[currentQues]["questionType"];
		paraBased = this.questions[currentQues]["paragraph"];
		paraText = this.questions[currentQues]["paragraphText"];
		quesText = this.questions[currentQues]["questionText"];
		options = this.questions[currentQues]["options"];
		correctOption = JSON.parse(this.questions[currentQues]["correctOption"]);
		solution = this.questions[currentQues]["solution"];
	}
	$('#questionModal').find('#ddQuestionCategory').val(quesCategory);
	$('#questionModal').find('#ddQuestionSubCategory').val(quesSubcategory);
	$('#questionModal').find('#ddQuestionType').val(quesType);
	if(paraBased == 'true'){
		$('#questionModal').find('#chkParagraph').prop('checked', true);
	}
	else if(paraBased == 'false'){
		$('#questionModal').find('#chkParagraph').prop('checked', false);
	}
	summernoteController.getObj().setValue('#txtParagraphText', paraText);
	summernoteController.getObj().setValue('#txtQuestionText', quesText);
	if(options.startsWith('"')){
		options = options.substring(1);
	}
	if(options.endsWith('"')){
		options = options.substring(0, options.length-1);
	}
	var optionsCount = 0;
	$(options).find('option').each(function(key, value){
		optionsCount++;
	});
	
	for (var i = 0; i < optionsCount - 1 ; i++){
		$('#btnAddOption').click();
	}
	var allOptions = $('#questionModal').find('.txtOptions');
	$(options).find('option').each(function(key, value){
		console.log(value);
		summernoteController.getObj().setValue($(allOptions[key]), $(value).html());
	});
	
	$('#questionModal').find('.chkCorrectOption').prop('checked', false);
	for(var i=0; i<correctOption.length - 1; i++){
		if(correctOption[i] ==  true){
			$($('#questionModal').find('.chkCorrectOption')[i]).prop('checked', true);
		}
	}
	//$('#questionModal').find('.chkCorrectOption[value="'+correctOption+'"]').prop('checked', true);
	summernoteController.getObj().setValue('#txtSolution', solution);
};
questionbankController.prototype.GetQuestionCategories = function(callback)
{
	$.ajax({
		url: remoteServer+'/test2bsure/question-category',
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
			callback();
		}.bind(this),
		error: function(e){
			console.log(e);
			callback();
		}
	});
};
questionbankController.prototype.PopulateQuestionSubcategory = function(categoryId)
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
questionbankController.prototype.PopulateFilteredQuestions = function(category, subcategory)
{
	var html = "";
	for(var ques in this.questions){
		if(category.length == 0){
			//All category selected
			if(subcategory.length == 0){
				//All category and all subcategory selected
				html += "<tr>"+
							"<td class='tdQuestionId'>"+this.questions[ques]['id']+"</td>"+
							"<td class='tdQuestionName'>"+this.questions[ques]['questionText']+"</td>"+
							"<td>"+
								"<button class='btn btn-default addEditQuestion update'>Edit</button>"+
								"<button class='btn btn-default deleteQuestion'>Delete</button>"+
							"</td>"+
						"</tr>";
			}
			else{
				//All category selected but not all subcategory
				if(this.questions[ques]["questionSubcategory"] == subcategory){
					html += "<tr>"+
						"<td class='tdQuestionId'>"+this.questions[ques]['id']+"</td>"+
						"<td class='tdQuestionName'>"+this.questions[ques]['questionText']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditQuestion update'>Edit</button>"+
							"<button class='btn btn-default deleteQuestion'>Delete</button>"+
						"</td>"+
					"</tr>";
				}
			}
		}
		else{
			//All category not selected
			if(subcategory.length == 0){
				//All category not selected but all subcategory selected
				if(this.questions[ques]["questionCategory"] == category){
					html += "<tr>"+
								"<td class='tdQuestionId'>"+this.questions[ques]['id']+"</td>"+
								"<td class='tdQuestionName'>"+this.questions[ques]['questionText']+"</td>"+
								"<td>"+
									"<button class='btn btn-default addEditQuestion update'>Edit</button>"+
									"<button class='btn btn-default deleteQuestion'>Delete</button>"+
								"</td>"+
							"</tr>";
				}
			}
			else{
				//All category not selected and all subcategory not selected
				if(this.questions[ques]["questionCategory"] == category && this.questions[ques]["questionSubcategory"] == subcategory){
					html += "<tr>"+
						"<td class='tdQuestionId'>"+this.questions[ques]['id']+"</td>"+
						"<td class='tdQuestionName'>"+this.questions[ques]['questionText']+"</td>"+
						"<td>"+
							"<button class='btn btn-default addEditQuestion update'>Edit</button>"+
							"<button class='btn btn-default deleteQuestion'>Delete</button>"+
						"</td>"+
					"</tr>";
				}
			}
		}
	}
	$('.existing-questions').find('table').find('tbody').empty();
	$('.existing-questions').find('table').find('tbody').append(html);
	this.BindTableEvents();
};
questionbankController.prototype.HandleRecords = function(len){
	$('.counter').find('.itemCount').find('span').text(len);
	if(len > 0){
		$('.paginationDiv').html(pagination(len));
		$('.paginationDiv').find('.pagination').find('select').unbind().bind('change', function(e){
			var start = $(e.currentTarget).find(":selected").attr('data-start');
			this.LoadAllQuestions(start);
		}.bind(this));
	}
};