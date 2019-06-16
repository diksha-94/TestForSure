var _obj = null;
var AutoComplete = function(typeId, searchFunction){
	this.dom = null;
	this.typeId = typeId;
	this.searchFunction = searchFunction;
	this.list = {};
	this.selectedItems = [];
	this.Init();
};
AutoComplete.prototype.Init = function()
{
	var html = '<div class="'+this.typeId+' autocomplete-selecteddiv col-xs-3 col-sm-3 col-md-3 col-lg-3"></div>';
	$(html).insertAfter($(this.typeId));
	html = '<div class="autocomplete-div col-xs-offset-5 col-sm-offset-5 col-md-offset-5 col-lg-offset-5 col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>';
	$(html).insertAfter($(this.typeId));
	
	$(this.typeId).siblings('.autocomplete-div').hide();
	$(this.typeId).unbind().bind('keyup', function(evt){
		this.Search();
	}.bind(this));
};
AutoComplete.prototype.Search = function()
{
	switch(this.searchFunction){
		case 'exams':
			this.SearchExams(function(){
				if(Object.keys(this.exams).length > 0){
					$(this.typeId).siblings('.autocomplete-div').show();
					$(this.typeId).siblings('.autocomplete-div').empty();
					this.selectedItems = [];
					if($(this.typeId).siblings('.autocomplete-selecteddiv').find('span').length > 0){
						$(this.typeId).siblings('.autocomplete-selecteddiv').find('span').each(function(key, value){
							this.selectedItems.push($(value).attr('data-id'));
						}.bind(this));
					}
					var html = '';
					for(var item in this.exams){
						if(this.selectedItems.indexOf(item) == -1){
							html += '<div><span data-id="'+item+'" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+this.exams[item]["title"]+'</span></div>';
						}
					}
					$(this.typeId).siblings('.autocomplete-div').html(html);
					this.onSelect();
				}
				else{
					$(this.typeId).siblings('.autocomplete-div').hide();
					$(this.typeId).siblings('.autocomplete-div').empty();
				}
			}.bind(this));
	}
};
AutoComplete.prototype.onSelect =function()
{
	$('.autocomplete-div').find('div').unbind().bind('click', function(e){
		var html = "<span class='outerSpan'><span data-id='"+$(e.currentTarget).find("span").attr("data-id")+"'>"+
						$(e.currentTarget).find("span").text()+"</span>"+
						"<span class='btnRemove'>x</span></span>";
					
		$(this.typeId).siblings('.autocomplete-selecteddiv').append(html);
		$(e.currentTarget).remove();
		this.onRemove();
	}.bind(this));
};
AutoComplete.prototype.onRemove =function(classVal)
{
	$('.btnRemove').unbind().bind('click', function(e){
		var current = $(e.currentTarget).parent('span').find('span[data-id]');
		var html = '<div>'+
					'<span data-id="'+$(current).attr('data-id')+'" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+$(current).text()+'</span>'+
     			   '</div>';
		$('.autocomplete-div').append(html);
		$(e.currentTarget).parents('span').remove();
		this.onSelect();
	}.bind(this));
};
AutoComplete.prototype.SearchExams = function(callback)
{
	var search = $(this.typeId).val();
	$.ajax({
		url: remoteServer+'/test2bsure/exam?search='+search,
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