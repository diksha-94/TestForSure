var dashboardController = function(){
	this.Init();
};
dashboardController.prototype.Init = function()
{
	$('.page-header').load('header.html', function(){
		$('.admin-menu').load('menu.html', function(){
			$('.page-header').find('.admin-profile').html('<p>Logged in as Admin</p>'+
			'<img src="../../Images/admin_user.jpg" alt="Admin"/>');
			this.BindEvents();
			new menuController($('.admin-menu'));
		}.bind(this));
	}.bind(this));
};
dashboardController.prototype.BindEvents = function()
{
	/*$('body').bind('click', function(e){
		if($('.admin-profile-box').attr('showProfile') == 'true' && e.currentTarget.id != 'adminProfileBox'){
			$('.admin-profile-box').attr('showProfile', 'false');
			$('.admin-profile-box').fadeOut();
		}
	});*/
	$('.page-header').find('.admin-profile').unbind().bind('click', function(){
		$('.admin-profile-box').show();
		$('.admin-profile-box').attr('showProfile', 'true');
		$('.admin-profile-box').find('#btnChangePass').unbind().bind('click', function(){
			
		});
		$('.admin-profile-box').find('#btnLogout').unbind().bind('click', function(){
			//destroy the session
			window.location.href = 'index.html';
		});
	});
};
function AddQuestionModal(e)
{
	$('#questionModal').show();
	
	//Question Category
	$('#questionModal').find('#ddQuestionCategory').on('change', function(e){
		if($(e.currentTarget).val() == '0'){
			$('#questionModal').find('.addQuesCategory').show();
		}
		else{
			$('#questionModal').find('.addQuesCategory').hide();
		}
	});
	
	//Populate QuestionType
	var questionType = Object.keys(QuestionType);
	var quesHtml = "";
	for (var type in questionType){
		quesHtml += '<option value="'+type+'">'+questionType[type]+'</option>';
	}
	$('#ddQuestionType').append(quesHtml);
	
	//Add options
	$('#questionModal').find('#btnAddOption').unbind().bind('click', function(){
		var html = "<div class='divOptions'>"+
						"<span class='col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 "+
							"col-xs-2 col-sm-2 col-md-2 col-lg-2'>"+
							"</span> <input type='text' "+
								"class='col-xs-4 col-sm-4 col-md-4 col-lg-4 txtOptions' />"+
								"<input type='checkbox' class='chkCorrectOption "+
								"col-xs-1 col-sm-1 col-md-1 col-lg-1'/><button type='button' "+
								"class='col-sm-1 col-md-1 col-xs-1 col-lg-1 btnRemoveOption'>"+
								"Remove</button>"+
					"</div>";
		$(html).insertBefore( "#btnAddOption" );
		$('.btnRemoveOption').unbind().bind('click', function(e){
			$(e.currentTarget).parents('.divOptions').remove();
		});
	});
	$('#questionModal').find('#btnQuestionCancel').unbind().bind('click', function(){
		$('#questionModal').hide();
	});
	$('#questionModal').find('#btnQuestionRefresh').unbind().bind('click', function(){
		RefreshQuestionModal();
	});
	$('#questionModal').find('#btnQuestionSave').unbind().bind('click', function(){
		var id = 0;
		var update = $(e.currentTarget).hasClass('update');
		if(update){
			id = $(e.currentTarget).parents('tr').find('.tdQuestionId').text();
		}
		SaveQuestion(update, id);
	});
};
function RefreshQuestionModal()
{
	$('#questionModal').find('input[type="text"]').val('');
	$('#questionModal').find('select').val('');
	$('#questionModal').find('input[type="checkbox"]').attr('checked', false);
	$('#questionModal').find('.addQuesCategory').hide();
};
function SaveQuestion(update, id)
{
	console.log('Saving (Add/Update) Question');
	var categoryId = $('#questionModal').find('#ddQuestionCategory').val();
	var categoryVal = "";
	if(categoryId == 0){
		categoryVal = $('#questionModal').find('#txtQuesCategory').val();
		if(categoryVal.length == 0){
			alert('Please enter all the mandatory fields');
			return;
		}
	}
	var quesType = $('#questionModal').find('#ddQuestionType').val();
	var paraBased =	$('#questionModal').find('#chkParagraph').prop('checked');
	var paraText = $('#questionModal').find('#txtParagraphText').val();
	var quesText = $('#questionModal').find('#txtQuestionText').val();
	var solution = $('#questionModal').find('#txtSolution').val();
	if(categoryId.length == 0 || quesType.length == 0 || quesText.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	if(paraBased == 'true' && paraText.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var allOptions = $('#questionModal').find('.txtOptions');
	var correctOptionDom = $('#questionModal').find('.chkCorrectOption');
	var options = [];
	var correctOptions = [];
	for (var i=0;i<allOptions.length;i++){
		var val = $(allOptions[i]).val();
		if(val.length == 0){
			alert('Please enter all the mandatory fields');
			return;
		}
		options.push(val);
		correctOptions.push($(correctOptionDom[i]).prop('checked'));
	}
	var url = 'http://localhost:8083/test2bsure/question';
	var type = 'POST';
	var requestData = {
			'questionCategory': categoryId,
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
	if(categoryId == 0){
		url += '?category='+categoryVal;
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