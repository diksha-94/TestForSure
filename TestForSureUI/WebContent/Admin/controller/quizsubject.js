var quizsubjectController = function(){
	this.id = -1;
};
quizsubjectController.prototype.Init = function()
{
};
quizsubjectController.prototype.AddEdit = function()
{
	$('#quizsubjectModal').modal('show');
	$('#quizsubjectModal').find('.ddSubjectQuiz').remove();
	RefreshData('quizsubjectModal');
	if(this.id > 0){
		this.Edit();
		$('#txtQuizSubjectName').unbind('keyup');
	}
	else{
		$('#txtQuizSubjectName').unbind().bind('keyup', function(e){
			populateUrlKey($(e.currentTarget).val(), $('#txtQuizSubjectUrlKey'));
		});
		new AutoComplete('ddSubjectQuiz', 'quiz');
	}
	$('#quizsubjectModal').find('#btnSubjectSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
};
quizsubjectController.prototype.Delete = function()
{
	$('#deleteQuizSubjectModal').modal('show');
	$('#deleteQuizSubjectModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteQuizSubjectModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
quizsubjectController.prototype.SaveData = function()
{
	console.log('Saving (Add/Update) Quiz Subject');
	var name = $('#txtQuizSubjectName').val();
	var urlKey = $('#txtQuizSubjectUrlKey').val();
	var displayIndex = $('#txtQuizSubjectIndex').val();
	var quizzes = GetSelectedValues('ddSubjectQuiz');
	if(name.length == 0 || urlKey.length == 0){
		alert('Please enter all the mandatory fields.');
		return;
	}
	var url = remoteServer+'/test2bsure/quizsubject';
	var type = 'POST';
	var requestData = {
			'name': name,
			'urlKey': urlKey,
			'displayIndex': displayIndex,
			'quizIds': quizzes
	};
	console.log(requestData);
	if(this.id > -1){
		requestData.id = this.id;
		type = 'PUT';
	}
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				$('#quizsubjectModal').modal('hide');
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
quizsubjectController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/quizsubject?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteQuizSubjectModal').modal('hide');
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
quizsubjectController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/quizsubject?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && Object.keys(response.data).length > 0){
					var item = response.data[this.id];
					$('#quizsubjectModal').find('#txtQuizSubjectName').val(item.name);
					$('#quizsubjectModal').find('#txtQuizSubjectUrlKey').val(item.urlKey);
					$('#quizsubjectModal').find('#txtQuizSubjectIndex').val(item.displayIndex);
					$('#quizsubjectModal').find('#ddSubjectQuiz').val('');
					if(item.quizzes != null && item.quizzes.length > 0){
						new AutoComplete('ddSubjectQuiz', 'quiz').SetSelectedValues('ddSubjectQuiz', item.quizzes);
					}
					else{
						new AutoComplete('ddSubjectQuiz', 'quiz');
					}
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};