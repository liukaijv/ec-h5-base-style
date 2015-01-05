// 抽屉菜单插件

// @via https://github.com/allmobilize/amazeui
// License: https://github.com/allmobilize/amazeui/blob/master/LICENSE.md

// <div class="ui-panel">
// 	<div class="ui-panel-bar">		
// 		<a href="#" data-close="panel">close</a>			
// 	</div>
// </div>

(function($) {	
	
	var $win = $(window);
	var $doc = $(document);

	//记录滚动条位置
	var scrollPos;	

	// Constructor
	function Panel($element, settings) {
		this.settings = $.extend({},
		Panel.defaultSettings, settings || {});
		this.$element = $element;
		this.active = null;
		this.events();
		return this;
	}

	Panel.defaultSettings = {
		duration: 300,
		effect: 'overlay', //push||overlay
		target: null,
		width: null
	};

	Panel.prototype = {
		open: function() {
			var $element = this.$element;
			if (!$element.length || $element.hasClass('ui-active')) {
				return;
			}
			var effect = this.settings.effect;
			var $html = $('html');
			var $body = $('body');
			var $bar = $element.find('.ui-panel-bar').first();

			// 设置宽度
			if(this.settings.width){
				typeof this.settings.width == 'number'? $bar.width(this.settings.width + 'px') : $bar.width(this.settings.width);
			}

			var dir = $bar.hasClass('ui-panel-bar-flip') ? -1: 1;
			$bar.addClass('ui-panel-bar-' + effect);
			scrollPos = {
				x: window.scrollX,
				y: window.scrollY
			};
			$element.addClass('ui-active');
			$body.css({
				width: window.innerWidth,
				height: $win.height()
			}).addClass('ui-panel-page');
			if (effect !== 'overlay') {				
				$body.css({
					'margin-left': $bar.outerWidth() * dir
				}).width();
			}
			$html.css('margin-top', scrollPos.y * -1);
			setTimeout(function() {
				$bar.addClass('ui-active').width();
			},
			0);
			$element.trigger('open.panel.ui');
			this.active = true;
			$element.off('click.panel.ui').on('click.panel.ui', $.proxy(function(e) {
				var $target = $(e.target);
				if (!e.type.match(/swipe/)) {
					if ($target.hasClass('ui-panel-bar')) {
						return;
					}
					if ($target.parents('.ui-panel-bar').first().length) {
						return;
					}
				}
				e.stopImmediatePropagation();
				this.close();
			},
			this));
			$html.on('keydown.panel.ui', $.proxy(function(e) {
				if (e.keyCode === 27) {
					this.close();
				}
			},
			this));
		},
		close: function() {
			var me = this;
			var $html = $('html');
			var $body = $('body');
			var $element = this.$element;
			var $bar = $element.find('.ui-panel-bar').first();
			if (!$element.length || !$element.hasClass('ui-active')) {
				return;
			}
			$element.trigger('close.panel.ui');
			function complete() {
				$body.removeClass('ui-panel-page').css({
					width: '',
					height: '',
					'margin-left': '',
					'margin-right': ''
				});
				$element.removeClass('ui-active');
				$bar.removeClass('ui-active');
				$html.css('margin-top', '');
				window.scrollTo(scrollPos.x, scrollPos.y);
				$element.trigger('closed.panel.ui');
				me.active = false;
			}
			// 关闭时的动画效果	需要 $.fn.transition插件		
			// transition helper depend http://getbootstrap.com/javascript/#transitions 
			if ($.support.transition) {
				setTimeout(function() {
					$bar.removeClass('ui-active');
				},
				0);
				$body.css('margin-left', '').one($.support.transition.end,
				function() {
					complete();
				}).emulateTransitionEnd(this.settings.duration);
			} else {
				complete();
			}
			$element.off('click.panel.ui');
			$html.off('.panel.ui');
		},
		events: function() {
			$doc.on('click.panel.ui', '[data-close="panel"]', $.proxy(function(e) {
				e.preventDefault();
				this.close();
			}, this));

			// resize 时关闭
			// $win.on('resize.panel.ui orientationchange.panel.ui', $.proxy(function(e) {
			// 	this.active && this.close();
			// },
			// this));
		},
		toggle: function(){
			this.active ? this.close() : this.open();
		}
	}

	//  插件
	$.fn.panel = function(settings) {		
		return this.each(function() {
			var that = this;
			var $trigger = $(this);
			var $target = $($trigger.data('target') ||(that.href && that.href.replace(/.*(?=#[^\s]+$)/, '')));
			var plugin = $trigger.data('ui.panel');
			if(!plugin){
				plugin = new Panel($target, settings);
				$trigger.data('ui.panel', plugin);
			}
			// todo 对后来加的无效
			$trigger.on('click',function(){				
				plugin.toggle();
			});
		});
	}	
	
})(window.jQuery || window.Zepto);