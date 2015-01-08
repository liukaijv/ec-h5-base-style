// 按钮状态插件

// <a href="#">button</a>
// <a href="#" class="ui-active">button</a>
// <a href="#" class="ui-active ui-btn-loading ui-disabled">button</a>

(function($){

	// Constructor
	var Button = function(element, options){
		this.$element = $(element);
		this.options = $.extend({}, Button.DEFAULTS, options);
		this.isloading = false;
		this.init();		
	}

	Button.DEFAULTS = {
		loadingText : 'loading...',
		className : {
			loading : 'ui-btn-loading',
			disabled : 'ui-disabled',
			active : 'ui-active',
			parent : 'ui-btn-group'
		}
	}

	Button.prototype = {

		init:function() {
			
		},

		// state = loading || reset
		setState: function(state){
			var disabled = 'disabled';
			var options = this.options;
			var $element = this.$element;
			var val = $element.is('input') ? 'val' : 'html';
			var loadingClassName = options.className.disabled + ' ' + options.className.loading;
			state = state + 'Text';

			if(!options.resetText){
				options.resetText = $element[val]();
			}

			$element[val](options[state]);

			setTimeout($.proxy(function(){
				if(state == 'loadingText'){
					$element.addClass(loadingClassName).attr(disabled, disabled);
					this.isloading = true;
				}
				else if(this.isloading){
					$element.removeClass(loadingClassName).removeAttr(disabled);
					this.isLoading = false;
				}
			}, this), 0);
		},	

		toggle: function(){
			var changed = true;
			var $element = this.$element;
			var $parent = this.$element.parent('.' + this.options.className.parent);
			var activeClassName = this.options.className.active;
			
			if($parent.length){				
				var $input = this.$element.find('input');			
				if($input.prop('type') == 'radio'){
					if($input.prop('checked') && $element.hasClass(activeClassName)){
						changed = false;
					}else{
						$parent.find('.' + activeClassName).removeClass(activeClassName);
					}
				}
				if(changed){
					$input.prop('checked', !$element.hasClass(activeClassName)).trigger('change');
				}
			}
			if(changed){
				$element.toggleClass(activeClassName);
				if(!$element.hasClass(activeClassName)){
					$element.blur();
				}
			}
		}

	}	

	//插件
	$.fn.button = function(option){
		return this.each(function(){

			var $this = $(this);
			var data = $this.data('ui.button');
			var options = typeof option == 'object' && {};			

			if(!data){
				$this.data('ui.button', (data = new Button(this, options)));
			}

			if(option == 'toggle'){				
				data.toggle();
			}
			else if(typeof option == 'string'){				
				data.setState(option);
			}			
		});
	}		

})(jQuery)