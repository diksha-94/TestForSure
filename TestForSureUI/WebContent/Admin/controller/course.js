var courseController = function(){
	this.id = -1;
};
courseController.prototype.Init = function()
{
};
courseController.prototype.AddEdit = function()
{
	$('#courseModal').modal('show');
	$('#courseModal').find('.ddCourseDemoVideo').remove();
	$('#courseModal').find('.ddCourseChapters').remove();
	summernoteController.getObj().addEditor('#txtCourseShortDesc');
	summernoteController.getObj().addEditor('#txtCourseDesc');
	RefreshData('courseModal');
	if(this.id > 0){
		this.Edit();
		$('#txtCourseName').unbind('keyup');
	}
	else{
		$('#txtCourseName').unbind().bind('keyup', function(e){
			populateUrlKey($(e.currentTarget).val(), $('#txtCourseUrlKey'));
		});
		new AutoComplete('ddCourseDemoVideo', 'video');
		new AutoComplete('ddCourseChapters', 'chapter');
	}
	$('#txtCourseUrlKey').unbind().bind('keyup', function(e){
		populateUrlKey($(e.currentTarget).val(), $(e.currentTarget));
	});
	$('#courseModal').find('#btnCourseSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
};
courseController.prototype.Delete = function()
{
	$('#deleteCourseModal').modal('show');
	$('#deleteCourseModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteCourseModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
courseController.prototype.SaveData = function()
{
	console.log('Saving (Add/Update) Course');
	var name = $('#txtCourseName').val();
	var urlKey = $('#txtCourseUrlKey').val();
	var imageUrl = $('#txtCourseImageUrl').val();
	var shortDesc = summernoteController.getObj().getValue('#txtCourseShortDesc');
	var desc = summernoteController.getObj().getValue('#txtCourseDesc');
	var displayIndex = $('#txtCourseIndex').val();
	if(name.length == 0 || urlKey.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var demoVideoId = GetSelectedValues('ddCourseDemoVideo')[0];
	var content = GetSelectedValues('ddCourseChapters');
	var published = $('#chkCoursePublish').prop('checked') == true ? 1 : 0;
	
	var url = remoteServer+'/test2bsure/course';
	var type = 'POST';
	var requestData = {
			'name': name,
			'urlKey': urlKey,
			'imageUrl': imageUrl,
			'shortDescription': shortDesc,
			'description': desc,
			'displayIndex': displayIndex,
			'demoVideoId': demoVideoId,
			'content': content,
			'published': published
	};
	console.log(requestData);
	if(this.id > -1){
		requestData.id = this.id;
		type = 'PUT';
	}
	console.log('Call to save course');
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				$('#courseModal').modal('hide');
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
courseController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/course?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteCourseModal').modal('hide');
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
courseController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/course?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#courseModal').find('#txtCourseName').val(item.name);
					$('#courseModal').find('#txtCourseUrlKey').val(item.urlKey);
					$('#courseModal').find('#txtCourseImageUrl').val(item.imageUrl);
					summernoteController.getObj().setValue('#txtCourseShortDesc', item.shortDescription);
					summernoteController.getObj().setValue('#txtCourseDesc', item.description);
					$('#courseModal').find('#txtCourseIndex').val(item.displayIndex);
					if(item.demoVideoId != null && item.demoVideoId.length > 0){
						var data = {};
						for(var video in item.demoVideoId){
							data[item.demoVideoId[video]] = item.demoVideoId[video];
						}
						getVideoTitle(Object.keys(data), function(response){
							for(var r in response){
								data[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["name"]
								};
							}
							new AutoComplete('ddCourseDemoVideo', 'video').SetSelectedValues('ddCourseDemoVideo', data);
						});
					}
					else{
						new AutoComplete('ddCourseDemoVideo', 'video');
					}
					
					if(item.chapter != null && item.chapter.length > 0){
						var data = {};
						for(var chapter in item.chapter){
							data[item.chapter[chapter]] = item.chapter[chapter];
						}
						getChapterTitle(Object.keys(data), function(response){
							for(var r in response){
								data[response[r]["id"]] = {
										"id": response[r]["id"],
										"title": response[r]["name"]
								};
							}
							new AutoComplete('ddCourseChapters', 'chapter').SetSelectedValues('ddCourseChapters', date);
						});
					}
					else{
						new AutoComplete('ddCourseChapters', 'chapter');
					}
					
					var published = false;
					if(item.published == 1){
						published = true;
					}
					$('#courseModal').find('#chkCoursePublish').prop('checked', published);
					
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};