(function($){

	var Button = function(element, options){
		this.$element = $(element);
		this.options = $.extend({}, Button.DEFAULTS, options);
		this.isloading = false;		
	}

	Button.DEFAULTS = {
		loadingText : 'loading...',
		className : {
			loading : 'ui-btn-loading',
			disabled : 'ui-btn-disabled',
			active : 'ui-active',
			parent : 'ui-btn-group'
		}
	}

	Button.prototype.setState = function(state){
		
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

	}

	Button.prototype.toggle = function(){

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

	function Plugin(option){
		return this.each(function(){

			var $this = $(this);
			var data = $this.data('ui.button');
			var options = typeof option == 'object' && {};

			if(!data){
				$this.data('ui.button', (data = new Button(this, options)));
			}

			if(option == 'toggle'){
				alert(1);
				data.toggle();
			}
			else if(typeof option == 'string'){				
				data.setState(option);
			}			
		});
	}

	$.fn.button = Plugin;	

	$(document).on('click.button.ui.data-api', '[data-button]', function(e){
		var $btn = $(e.target);
		if(!$btn.hasClass('ui-btn')){
			$btn = $btn.closest('ui-btn');
		}		
		Plugin.call($btn, 'toggle');
		e.preventDefault();
	});

})(jQuery)