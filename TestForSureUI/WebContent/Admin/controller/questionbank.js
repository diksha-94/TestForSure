var questionbankController = function(){
	this.id = -1;
};
questionbankController.prototype.Init = function()
{
};
questionbankController.prototype.AddEdit = function()
{
	$('#questionModal').modal('show');
	var summernote = summernoteController.getObj();
	summernote.addEditor('#txtParagraphText');
	summernote.addEditor('#txtQuestionText');
	summernote.addEditor('.txtOptions');
	summernote.addEditor('#txtSolution');
	RefreshData('questionModal');
	$('#chkParagraph').unbind().on('change', function(e){
		if($(e.currentTarget).prop('checked')){
			$('#txtParagraphText').parents('div.para').removeClass('hide').addClass('show');
		}
		else{
			$('#txtParagraphText').parents('div.para').removeClass('show').addClass('hide');
		}
	});
	//Add options
	$('#questionModal').find('#btnAddOption').unbind().bind('click', function(){
		var summernote = summernoteController.getObj();
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
	this.LoadQuestionCategories(function(){
		if(this.id > 0){
			this.Edit();
		}
	}.bind(this));
	$('#questionModal').find('#btnQuestionSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
};
questionbankController.prototype.Delete = function()
{
	$('#deleteQuestionModal').modal('show');
	$('#deleteQuestionModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteQuestionModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
questionbankController.prototype.SaveData = function()
{
	console.log('Saving (Add/Update) Question');
	var categoryId = $('#questionModal').find('#ddQuestionCategory').val();
	var subcategoryId = $('#questionModal').find('#ddQuestionSubCategory').val()
	var quesText = summernoteController.getObj().getValue('#txtQuestionText');
	var solution = summernoteController.getObj().getValue('#txtSolution');
	if(categoryId.length == 0 || subcategoryId.length == 0 || quesText.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	//Paragraph
	var paraBased = 0;
	var paraText = "";
	if($('#chkParagraph').prop('checked')){
		paraBased = 1;
		paraText = summernoteController.getObj().getValue('#txtParagraphText');
		if(paraText.length == 0){
			alert("Please enter Paragraph Text");
		}
	}
	var allOptions = $('#questionModal').find('.txtOptions');
	var correctOptionDom = $('#questionModal').find('.chkCorrectOption');
	var options = "<options>";
	var correctOptions = [];
	var markedAnswerCount = 0;
	for (var i=0;i<allOptions.length;i++){
		var val = summernoteController.getObj().getValue($(allOptions[i]));
		if(val.length == 0){
			alert('Please enter all the mandatory fields');
			return;
		}
		options += "<option>"+val+"</option>";
		if($(correctOptionDom[i]).prop('checked') == true){
			markedAnswerCount++;
		}
		correctOptions.push($(correctOptionDom[i]).prop('checked'));
	}
	options += "</options>";
	if(markedAnswerCount == 0){
		alert("Please select atleast one correct answer in options");
		return;
	}
	var url = remoteServer+'/test2bsure/question';
	var type = 'POST';
	var requestData = {
			'questionCategory': categoryId,
			'questionSubcategory': subcategoryId,
			'questionType': 0,
			'paragraph': paraBased,
			'paragraphText': paraText,
			'questionText': quesText,
			'options': JSON.stringify(options),
			'correctOption': JSON.stringify(correctOptions),
			'solution': solution,
			'active': 1
	};
	
	console.log(requestData);
	if(this.id > 0){
		requestData.id = this.id;
		type = 'PUT';
	}
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
questionbankController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/question?id="+this.id,
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
questionbankController.prototype.Edit = function()
{
	$('#questionModal').find('.added-options').remove();

	$.ajax({
		url: remoteServer + "/test2bsure/question?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#questionModal').find('#ddQuestionCategory').val(item.questionCategory);
					this.subcategory = item.questionSubcategory;
					$('#questionModal').find('#ddQuestionCategory').change();
					summernoteController.getObj().setValue('#txtQuestionText', item.questionText);
					if(item.paragraph == 1 || item.paragraph == "true"){
						$('#chkParagraph').prop('checked', true);
						$('#txtParagraphText').parents('div.para').removeClass('hide').addClass('show');
						summernoteController.getObj().setValue('#txtParagraphText', item.paragraphText);
					}
					else{
						$('#chkParagraph').prop('checked', false);
						$('#txtParagraphText').parents('div.para').removeClass('show').addClass('hide');
					}
					summernoteController.getObj().setValue('#txtSolution', item.solution);
					var options = item.options;
					var optionsCount = 0;
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
					
					for (var i = 0; i < optionsCount - 2 ; i++){
						$('#btnAddOption').click();
					}
					var allOptions = $('#questionModal').find('.txtOptions');
					$(options).find('option').each(function(key, value){
						console.log(value);
						summernoteController.getObj().setValue($(allOptions[key]), $(value).html());
					});
					
					$('#questionModal').find('.chkCorrectOption').prop('checked', false);
					var correctOption = JSON.parse(item.correctOption);
					
					for(var i=0; i<correctOption.length; i++){
						if(correctOption[i] ==  true){
							$($('#questionModal').find('.chkCorrectOption')[i]).prop('checked', true);
						}
					}
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};
questionbankController.prototype.LoadQuestionCategories = function(callback){
	getQuestionCategories(function(categories, subcategories){
		var html = "<option value=''>Select</option>";
		for(var cat in categories){
			html += "<option value='"+categories[cat]['id']+"'>"+categories[cat]['name']+"</option>";
		}
		html += '<option class="newCategoryOption" value="-1">+ Add New category</option>';
		$('#questionModal').find('#ddQuestionCategory').html(html);
		callback();
	});
	$('#questionModal').find('#ddQuestionCategory').unbind().bind('change', function(e){
		var categoryId = $(e.currentTarget).val();
		if(categoryId == -1){
			$('#questionModal').find('.addQuesCategory').css('display', 'block');
			$('#questionModal').find('.addQuesCategory').find('#btnAddQuesCategory').unbind().bind('click', function(){
				//Add a new Question category POST question-category(String category)
				this.AddQuestionCategory();
			}.bind(this));
		}
		else{
			$('#questionModal').find('.addQuesCategory').css('display', 'none');
		}
		getQuestionCategories(function(cat, subcat){
			var html = "<option value=''>Select</option>";
			for(var cat in subcat){
				if(subcat[cat]["categoryId"] == categoryId){
					html += "<option value='"+subcat[cat]['id']+"'>"+subcat[cat]['name']+"</option>";
				}
			}
			html += '<option class="newSubcategoryOption" value="-1">+ Add New sub category</option>';
			$('#questionModal').find('#ddQuestionSubCategory').html(html);
			if(this.subcategory != -1){
				$('#questionModal').find('#ddQuestionSubCategory').val(this.subcategory);
			}
			$('#questionModal').find('#ddQuestionSubCategory').change();
		}.bind(this));
	}.bind(this));
	$('#questionModal').find('#ddQuestionSubCategory').unbind().bind('change', function(e){
		var subcategoryId = $(e.currentTarget).val();
		if(subcategoryId == -1){
			$('#questionModal').find('.addQuesSubCategory').css('display', 'block');
			$('#questionModal').find('.addQuesSubCategory').find('#btnAddQuesSubCategory').unbind().bind('click', function(){
				this.AddQuestionSubcategory();
			}.bind(this));
		}
		else{
			$('#questionModal').find('.addQuesSubCategory').css('display', 'none');
		}
	}.bind(this));
};

questionbankController.prototype.AddQuestionCategory = function(){
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
				$("<option value='"+response.message+"'>"+newCategory+"</option>").insertBefore($('#questionModal').find('#ddQuestionCategory').find('option[value=-1]'));
				$('#questionModal').find('.addQuesCategory').hide();
				$('#questionModal').find('#ddQuestionCategory').val(response.message);
				$('#questionModal').find('#ddQuestionSubCategory').change();
			}
		}.bind(this),
		error: function(e){
			alert(e);
		}
	});
};
questionbankController.prototype.AddQuestionSubcategory = function(){
	var newSubcategory = $('#questionModal').find('#txtQuesSubCategory').val();
	if(newSubcategory.length == 0){
		alert("Please enter Question Sub Category.");
		return;
	}
	var categoryId = $('#questionModal').find('#ddQuestionCategory').val();
	if(categoryId == '' || parseInt(categoryId) <= 0){
		alert("Please select Question Category.");
		return;
	}
	$.ajax({
		url: remoteServer+"/test2bsure/question-subcategory?categoryId="+categoryId+"&subcategory="+newSubcategory,
		type: 'POST',
		success: function(response){
			console.log(response);
			if(response.status == true){
				$("<option value='"+response.message+"'>"+newSubcategory+"</option>").insertBefore($('#questionModal').find('#ddQuestionSubCategory').find('option[value=-1]'));
				$('#questionModal').find('.addQuesSubCategory').hide();
				$('#questionModal').find('#ddQuestionSubCategory').val(response.message);
			}
		},
		error: function(e){
			alert(e);
		}
	});
};