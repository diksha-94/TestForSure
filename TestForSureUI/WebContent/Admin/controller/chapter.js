var chapterController = function(){
	this.id = -1;
};
chapterController.prototype.Init = function()
{
};
chapterController.prototype.AddEdit = function()
{
	$('#chapterModal').modal('show');
	$('#chapterModal').find('.ddChapterVideos').remove();
	$('#chapterModal').find('.ddChapterTests').remove();
	$('#chapterModal').find('.ddChapterQuizzes').remove();
	$('#chapterModal').find('.ddChapterNotes').remove();
	summernoteController.getObj().addEditor('#txtChapterDesc');
	RefreshData('chapterModal');
	if(this.id > 0){
		this.Edit();
		$('#txtChapterName').unbind('keyup');
	}
	else{
		$('#txtChapterName').unbind().bind('keyup', function(e){
			populateUrlKey($(e.currentTarget).val(), $('#txtChapterUrlKey'));
		});
		new AutoComplete('ddChapterVideos', 'video');
		new AutoComplete('ddChapterTests', 'tests');
		new AutoComplete('ddChapterQuizzes', 'quiz');
		new AutoComplete('ddChapterNotes', 'notes');
	}
	$('#txtChapterUrlKey').unbind().bind('keyup', function(e){
		populateUrlKey($(e.currentTarget).val(), $(e.currentTarget));
	});
	$('#chapterModal').find('#btnChapterSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
};
chapterController.prototype.Delete = function()
{
	$('#deleteChapterModal').modal('show');
	$('#deleteChapterModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteChapterModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
chapterController.prototype.SaveData = function()
{
	console.log('Saving (Add/Update) Chapter');
	var name = $('#txtChapterName').val();
	var urlKey = $('#txtChapterUrlKey').val();
	var description = summernoteController.getObj().getValue('#txtChapterDesc');
	var displayIndex = $('#txtChapterIndex').val();
	var isDemo = $('#chkChapterDemo').prop('checked') == true ? 1 : 0;
	if(name.length == 0 || urlKey.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var videos = GetSelectedValues('ddChapterVideos');
	var tests = GetSelectedValues('ddChapterTests');
	var quizzes = GetSelectedValues('ddChapterQuizzes');
	var notes = GetSelectedValues('ddChapterNotes');
	
	var content = [];
	for(var value in videos){
		var obj = {
				"contentType": ItemType.VIDEO,
				"contentId": videos[value]
		};
		content.push(obj);
	}
	for(var value in tests){
		var obj = {
				"contentType": ItemType.TEST,
				"contentId": tests[value]
		};
		content.push(obj);
	}
	for(var value in quizzes){
		var obj = {
				"contentType": ItemType.QUIZ,
				"contentId": quizzes[value]
		};
		content.push(obj);
	}
	for(var value in notes){
		var obj = {
				"contentType": ItemType.NOTES,
				"contentId": notes[value]
		};
		content.push(obj);
	}
	
	var url = remoteServer+'/test2bsure/chapter';
	var type = 'POST';
	var requestData = {
			'name': name,
			'urlKey': urlKey,
			'description': description,
			'displayIndex': displayIndex,
			'isDemo': isDemo,
			'content': content
	};
	console.log(requestData);
	if(this.id > -1){
		requestData.id = this.id;
		type = 'PUT';
	}
	console.log('Call to save chapter');
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				$('#chapterModal').modal('hide');
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
chapterController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/chapter?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteChapterModal').modal('hide');
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
chapterController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/chapter?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#chapterModal').find('#txtChapterName').val(item.name);
					$('#chapterModal').find('#txtChapterUrlKey').val(item.urlKey);
					summernoteController.getObj().setValue('#txtChapterDesc', item.description);
					$('#chapterModal').find('#txtChapterIndex').val(item.displayIndex);
					var isDemo = false;
					if(item.isDemo == 1){
						isDemo = true;
					}
					$('#chapterModal').find('#chkChapterDemo').prop('checked', isDemo);
					//TODO: Autocomplete content
					var content = item.content;
					var tests = {};
					var quizzes = {};
					var videos = {};
					var notes = {};
					for(var value in content){
						switch(content[value].contentType){
							case ItemType.TEST:
								tests[content[value].contentId] = content[value].contentId;
								break;
							case ItemType.QUIZ:
								quizzes[content[value].contentId] = content[value].contentId;
								break;
							case ItemType.VIDEO:
								videos[content[value].contentId] = content[value].contentId;
								break;
							case ItemType.NOTES:
								notes[content[value].contentId] = content[value].contentId;
								break;
						}
					}
					if(tests != null && Object.keys(tests).length > 0){
						getTestTitle(Object.keys(tests), function(response){
							for(var r in response){
								tests[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["title"]
								};
							}
							new AutoComplete('ddChapterTests', 'tests').SetSelectedValues('ddChapterTests', tests);
						});
					}
					else{
						new AutoComplete('ddChapterTests', 'tests');
					}
					
					if(videos != null && Object.keys(videos).length > 0){
						getVideoTitle(Object.keys(videos), function(response){
							for(var r in response){
								videos[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["name"]
								};
							}
							new AutoComplete('ddChapterVideos', 'video').SetSelectedValues('ddChapterVideos', videos);
						});
					}
					else{
						new AutoComplete('ddChapterVideos', 'video');
					}
					
					if(quizzes != null && Object.keys(quizzes).length > 0){
						getQuizTitle(Object.keys(quizzes), function(response){
							for(var r in response){
								quizzes[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["title"]
								};
							}
							new AutoComplete('ddChapterQuizzes', 'quiz').SetSelectedValues('ddChapterQuizzes', quizzes);
						});
					}
					else{
						new AutoComplete('ddChapterQuizzes', 'quiz');
					}
					
					if(notes != null && Object.keys(notes).length > 0){
						getNotesTitle(Object.keys(notes), function(response){
							for(var r in response){
								notes[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["name"]
								};
							}
							new AutoComplete('ddChapterNotes', 'notes').SetSelectedValues('ddChapterNotes', notes);
						});
					}
					else{
						new AutoComplete('ddChapterNotes', 'notes');
					}
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};