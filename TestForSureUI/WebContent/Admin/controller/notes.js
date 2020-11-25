var notesController = function(){
	this.id = -1;
};
notesController.prototype.Init = function()
{
};
notesController.prototype.AddEdit = function()
{
	$('#notesModal').modal('show');
	RefreshData('notesModal');
	if(this.id > 0){
		this.Edit();
		$('#txtNotesName').unbind('keyup');
	}
	else{
		$('#txtNotesName').unbind().bind('keyup', function(e){
			populateUrlKey($(e.currentTarget).val(), $('#txtNotesUrlKey'));
		});
	}
	$('#txtNotesUrlKey').unbind().bind('keyup', function(e){
		populateUrlKey($(e.currentTarget).val(), $(e.currentTarget));
	});
	$('#notesModal').find('#btnNotesSave').unbind().bind('click', function(){
		this.SaveData();
	}.bind(this));
};
notesController.prototype.Delete = function()
{
	$('#deleteNotesModal').modal('show');
	$('#deleteNotesModal').find('.modal-body').find('p').find('span').text(this.id+" ?");
	$('#deleteNotesModal').find('#btnDeleteYes').unbind().bind('click', function(){
		this.DeleteItem();
	}.bind(this));
};
notesController.prototype.SaveData = function()
{
	console.log('Saving (Add/Update) Notes');
	var name = $('#txtNotesName').val();
	var urlKey = $('#txtNotesUrlKey').val();
	var link = $('#txtNotesLink').val();
	var displayIndex = $('#txtNotesIndex').val();
	if(name.length == 0 || urlKey.length == 0 || link.length == 0){
		alert('Please enter all the mandatory fields');
		return;
	}
	var url = remoteServer+'/test2bsure/notes';
	var type = 'POST';
	var requestData = {
			'name': name,
			'urlKey': urlKey,
			'displayIndex': displayIndex,
			'link': link
	};
	console.log(requestData);
	if(this.id > -1){
		requestData.id = this.id;
		type = 'PUT';
	}
	console.log('Call to save notes');
	$.ajax({
		url: url,
		type: type,
		contentType: "application/json",
		data: JSON.stringify(requestData),
		success: function(response){
			if(response.status == true){
				$('#notesModal').modal('hide');
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
notesController.prototype.DeleteItem = function()
{
	$.ajax({
		url: remoteServer+"/test2bsure/notes?id="+this.id,
		type: 'DELETE',
		success: function(response){
			if(response.status == true){
				$('#deleteNotesModal').modal('hide');
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
notesController.prototype.Edit = function(e)
{
	$.ajax({
		url: remoteServer + "/test2bsure/notes?id=" + this.id,
		type: 'GET',
		success: function(response){
			if(response.result.status == true){
				if(response.data != null && response.data.length > 0){
					var item = response.data[0];
					$('#notesModal').find('#txtNotesName').val(item.name);
					$('#notesModal').find('#txtNotesUrlKey').val(item.urlKey);
					$('#notesModal').find('#txtNotesLink').val(item.link);
					$('#notesModal').find('#txtNotesIndex').val(item.displayIndex);
				}
			}
		}.bind(this),
		error: function(e){
			console.log(e);
		}
	});
};