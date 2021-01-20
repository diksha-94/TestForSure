var videoController = function(){
	this.id = -1;
};
videoController.prototype.Init = function()
{
};
videoController.prototype.AddEdit = function()
{
	$('#videoModal').modal('show');
	RefreshData('videoModal');
	if(this.id > 0){
		this.Edit();
		$('#txtVideoName').unbind('keyup');
	}
	else{
		$('#txtVideoName').unbind().bind('keyup', function(e){
			populateUrlKey($(e.currentTarget).val(), $('#txtVideoUrlKey'));
		});
	}
	$('#txtVideoUrlKey').unbind().bind('keyup', function(e){
		populateUrlKey($(e.currentTarget).val(), $(e.currentTarget));
	});
	$('#videoModal').find('#btnVideoSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
};
videoController.prototype.Delete = function()
{
	$('#deleteVideoModal').modal('show');
	$('#deleteVideoModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteVideoModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
videoController.prototype.SaveData = function()
{
	console.log('Saving (Add/Update) Video');
	var name = $('#txtVideoName').val();
	var urlKey = $('#txtVideoUrlKey').val();
	var youtubeId = $('#txtVideoYoutubeId').val();
	var displayIndex = $('#txtVideoIndex').val();
	if(name.length == 0 || urlKey.length == 0 || youtubeId.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var meta = {"youtubeId": youtubeId};
	var url = remoteServer+'/test2bsure/video';
	var type = 'POST';
	var requestData = {
			'name': name,
			'urlKey': urlKey,
			'displayIndex': displayIndex,
			'meta': JSON.stringify(meta)
	};
	console.log(requestData);
	if(this.id > -1){
		requestData.id = this.id;
		type = 'PUT';
	}
	console.log('Call to save video');
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				$('#videoModal').modal('hide');
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
videoController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/video?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteVideoModal').modal('hide');
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
videoController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/video?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#videoModal').find('#txtVideoName').val(item.name);
					$('#videoModal').find('#txtVideoUrlKey').val(item.urlKey);
					$('#videoModal').find('#txtVideoYoutubeId').val((JSON.parse(item.meta)).youtubeId);
					$('#videoModal').find('#txtVideoIndex').val(item.displayIndex);
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};