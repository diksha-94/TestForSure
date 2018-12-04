var _obj = null;
var AutoComplete = function(){
	this.dom = null;
	this.list = {};
	this.selectedItems = [];
};
AutoComplete.getObj = function(dom)
{
	if(_obj == null){
		_obj = new AutoComplete();
	}
	return _obj;
};
AutoComplete.prototype.PopulateList =function(dom)
{
	this.selectedItems = [];
	if($(dom).find('span.selectedExam').length > 0){
		$(dom).find('span.selectedExam').each(function(key, value){
			this.selectedItems.push($(value).attr('data-id'));
		}.bind(this));
	}
	var html = '<div class="autocomplete-div col-xs-offset-5 col-sm-offset-5 col-md-offset-5 col-lg-offset-5 col-xs-4 col-sm-4 col-md-4 col-lg-4">';
	for(var item in this.list){
		if(this.selectedItems.indexOf(item) == -1){
			html += '<div><span data-id="'+item+'" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+this.list[item]["title"]+'</span></div>';
		}
	}
	html += '</div>';
	$('.autocomplete-div').remove();
	
	$(html).insertAfter(this.dom);
	this.Select();
	
};
AutoComplete.prototype.Select =function()
{
	$('.autocomplete-div').find('div').unbind().bind('click', function(e){
		var html = "<span>"+
						"<span class='selectedExam' data-id='"+$(e.currentTarget).find("span").attr("data-id")+"'>"+
						$(e.currentTarget).find("span").text()+"</span>"+
						"<button>x</button>"+
					"</span>";
		(this.dom).append(html);
		$(e.currentTarget).remove();
		this.Remove();
	}.bind(this));
};
AutoComplete.prototype.Remove =function()
{
	$(this.dom).find('button').unbind().bind('click', function(e){
		console.log("remove clicked");
		var current = $(e.currentTarget).parent('span').find('span');
		var html = '<div>'+
					'<span data-id="'+$(current).attr('data-id')+'" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+$(current).text()+'</span>'+
     			   '</div>';
		$('.autocomplete-div').append(html);
		$(e.currentTarget).parents('span').remove();
		this.Select();
	}.bind(this));
};