// jquery aside plugin
// @via https://github.com/uikit/uikit/blob/master/src/js/offcanvas.js
(function($) {

	// golobal variables 
	var $win = $(window);
	var $doc = $(document);
	var scrollPos;

	$.fn.mAside = function(settings) {		
		return this.each(function() {
			var that = this;
			var $trigger = $(this);
			var $target = $($trigger.data('target') ||(that.href && that.href.replace(/.*(?=#[^\s]+$)/, '')));
			var plugin = $trigger.data('_mAside');
			if(!plugin){
				plugin = new mAside($target, settings);
				$trigger.data('_mAside', plugin);
			}	
			$trigger.on('click',function(){				
				plugin.toggle();
			});
		});
	}	
	$.fn.mAside.defaultSettings = {
		duration: 300,
		effect: 'overlay', //push||overlay
		target : null
	};
	function mAside($element, settings) {
		this.settings = $.extend({},
		$.fn.mAside.defaultSettings, settings || {});
		this.$element = $element;
		this.active = null;
		this.events();
		return this;
	}
	mAside.prototype = {
		open: function() {
			var $element = this.$element;
			if (!$element.length || $element.hasClass('aside-active')) {
				return;
			}
			var effect = this.settings.effect;
			var $html = $('html');
			var $body = $('body');
			var $bar = $element.find('.aside-bar').first();
			var dir = $bar.hasClass('aside-bar-flip') ? -1: 1;
			$bar.addClass('aside-bar-' + effect);
			scrollPos = {
				x: window.scrollX,
				y: window.scrollY
			};
			$element.addClass('aside-active');
			$body.css({
				width: window.innerWidth,
				height: $win.height()
			}).addClass('aside-page');
			if (effect !== 'overlay') {
				$body.css({
					'margin-left': $bar.outerWidth() * dir
				}).width();
			}
			$html.css('margin-top', scrollPos.y * -1);
			setTimeout(function() {
				$bar.addClass('aside-bar-active').width();
			},
			0);
			$element.trigger('open.mAside');
			this.active = 1;
			$element.off('click.mAside').on('click.mAside', $.proxy(function(e) {
				var $target = $(e.target);
				if (!e.type.match(/swipe/)) {
					if ($target.hasClass('aside-bar')) {
						return;
					}
					if ($target.parents('.aside-bar').first().length) {
						return;
					}
				}
				e.stopImmediatePropagation();
				this.close();
			},
			this));
			$html.on('keydown.mAside', $.proxy(function(e) {
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
			var $bar = $element.find('.aside-bar').first();
			if (!$element.length || !$element.hasClass('aside-active')) {
				return;
			}
			$element.trigger('close.mAside');
			function complete() {
				$body.removeClass('aside-page').css({
					width: '',
					height: '',
					'margin-left': '',
					'margin-right': ''
				});
				$element.removeClass('aside-active');
				$bar.removeClass('aside-bar-active');
				$html.css('margin-top', '');
				window.scrollTo(scrollPos.x, scrollPos.y);
				$element.trigger('closed.mAside');
				me.active = 0;
			}			
			// transition helper depend http://getbootstrap.com/javascript/#transitions 
			if ($.support.transition) {
				setTimeout(function() {
					$bar.removeClass('aside-bar-active');
				},
				0);
				$body.css('margin-left', '').one($.support.transition.end,
				function() {
					complete();
				}).emulateTransitionEnd(this.settings.duration);
			} else {
				complete();
			}
			$element.off('click.mAside');
			$html.off('.mAside');
		},
		events: function() {
			$doc.on('click.mAside', '[data-overlay="aside"]', $.proxy(function(e) {
				e.preventDefault();
				this.close();
			},
			this));
			$win.on('resize.mAside orientationchange.mAside', $.proxy(function(e) {
				this.active && this.close();
			},
			this));
		},
		toggle: function(){
			this.active ? this.close() : this.open();
		}
	}
	
})(window.jQuery || window.Zepto);