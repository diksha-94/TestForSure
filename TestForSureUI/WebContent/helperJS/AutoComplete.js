/* Create AutoComplete - 
 * Create input type='text' in html with id
 * In JS, new AutoComplete('id of input', what to search);
 */

var AutoComplete = function(typeId, searchFunction){
	this.dom = null;
	this.typeId = '#'+typeId;
	this.className = typeId;
	this.searchFunction = searchFunction;
	this.selectedItems = [];
	this.Init();
};
AutoComplete.prototype.Init = function()
{
	var html = '<div class="'+this.className+' autocomplete-selecteddiv col-xs-3 col-sm-3 col-md-3 col-lg-3"></div>';
	$(html).insertAfter($(this.typeId));
	html = '<div class="autocomplete-div col-xs-offset-5 col-sm-offset-5 col-md-offset-5 col-lg-offset-5 col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>';
	$(html).insertAfter($(this.typeId));
	
	$(this.typeId).siblings('.autocomplete-div').hide();
	$(this.typeId).unbind().bind('keyup focus', function(evt){
		this.Search();
	}.bind(this));
};
AutoComplete.prototype.Search = function()
{
	var search = $(this.typeId).val();
	var url = '';
	switch(this.searchFunction){
		case 'exams':
			url = remoteServer+'/test2bsure/exam?search='+search;
			break;
		case 'tests':
			url = remoteServer+'/test2bsure/test?search='+search;
			break;
		case 'filters':
			url = remoteServer+'/test2bsure/filter?search='+search;
			break;
		case 'quiz':
			url = remoteServer+'/test2bsure/quiz?search='+search;
			break;
		case 'quizsubject':
			url = remoteServer+'/test2bsure/quizsubject?search='+search;
			break;
	}
	this.SearchData(search, url, function(){
		if(Object.keys(this.result).length > 0){
			$(this.typeId).siblings('.autocomplete-div').show();
			$(this.typeId).siblings('.autocomplete-div').empty();
			this.selectedItems = [];
			if($(this.typeId).siblings('.autocomplete-selecteddiv').find('span').length > 0){
				$(this.typeId).siblings('.autocomplete-selecteddiv').find('span').each(function(key, value){
					this.selectedItems.push($(value).attr('data-id'));
				}.bind(this));
			}
			var html = '';
			for(var item in this.result){
				if(this.selectedItems.indexOf(item) == -1){
					var title = "";
					if(typeof this.result[item]["title"] != 'undefined'){
						title = this.result[item]["title"];
					}
					else if(typeof this.result[item]["name"] != 'undefined'){
						title = this.result[item]["name"];
					}
					html += '<div><span data-id="'+item+'" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+title+'</span></div>';
				}
			}
			$(this.typeId).siblings('.autocomplete-div').html(html);
			this.onSelect();
		}
		else{
			$(this.typeId).siblings('.autocomplete-div').empty();
		}
		if($('.autocomplete-div').find('div').length == 0){
			$('.autocomplete-div').append('<span class="no-results">No Results</span>');
		}
	}.bind(this));
};
AutoComplete.prototype.onSelect =function()
{
	$('.autocomplete-div').find('div').unbind().bind('click', function(e){
		var html = "<span class='outerSpan' title='"+$(e.currentTarget).find("span").text()+"'><span data-id='"+$(e.currentTarget).find("span").attr("data-id")+"'>"+
						$(e.currentTarget).find("span").text()+"</span>"+
						"<span class='btnRemove'>x</span></span>";
		$(e.currentTarget).parents('.autocomplete-div').siblings('.autocomplete-selecteddiv').append(html);
		//$(this.typeId).siblings('.autocomplete-selecteddiv').append(html);
		$(e.currentTarget).remove();
		if($('.autocomplete-div').find('div').length == 0){
			$('.autocomplete-div').append('<span class="no-results">No Results</span>');
		}
		this.onRemove();
	}.bind(this));
};
AutoComplete.prototype.onRemove = function(classVal)
{
	$('.btnRemove').unbind().bind('click', function(e){
		var current = $(e.currentTarget).parent('span').find('span[data-id]');
		var html = '<div>'+
					'<span data-id="'+$(current).attr('data-id')+'" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+$(current).text()+'</span>'+
     			   '</div>';
		if($('.autocomplete-div').find('.no-results').length > 0){
			$('.autocomplete-div').find('.no-results').remove();
		}
		$(e.currentTarget).parents('.autocomplete-selecteddiv').siblings('.autocomplete-div').append(html);
		//$('.autocomplete-div').append(html);
		$(e.currentTarget).parents('span').remove();
		this.onSelect();
	}.bind(this));
};
function GetSelectedValues(element)
{
	var values = [];
	$('.autocomplete-selecteddiv.'+element).find('span.outerSpan').each(function(key, value){
		values.push($(value).find('span[data-id]').attr('data-id'));
	});
	return values;
};
AutoComplete.prototype.SetSelectedValues = function(element, data)
{
	var html = "";
	for(var value in data){
		var title = "";
		if(typeof data[value].title != 'undefined'){
			title = data[value].title;
		}
		else if(typeof data[value].name != 'undefined'){
			title = data[value].name;
		}
		html += "<span class='outerSpan' title='"+title+"'><span data-id='"+data[value].id+"'>"+
		data[value].title+"</span>"+
		"<span class='btnRemove'>x</span></span>";
	}
	$('.'+element).append(html);

	this.onRemove();
};
AutoComplete.prototype.SearchData = function(search, url, callback)
{
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response){
			this.result = {};
			if(response.result.status == true){
				if(response.data != null && ((Array.isArray(response.data) && response.data.length > 0) || (Object.keys(response.data).length > 0))){
					var results = response.data;
					for(var result in results){
						this.result[results[result]["id"]] = results[result];
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