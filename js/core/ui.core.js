// via https://github.com/allmobilize/amazeui.git
// License https://github.com/allmobilize/amazeui/blob/master/LICENSE.md

var UI = UI || {};

(function($, UI){

	UI.support = {};

	UI.support.transition = (function() {
	  var transitionEnd = (function() {
	    // https://developer.mozilla.org/en-US/docs/Web/Events/transitionend#Browser_compatibility
	    var element = window.document.body || window.document.documentElement;
	    var transEndEventNames = {
	      WebkitTransition: 'webkitTransitionEnd',
	      MozTransition: 'transitionend',
	      OTransition: 'oTransitionEnd otransitionend',
	      transition: 'transitionend'
	    };
	    var name;

	    for (name in transEndEventNames) {
	      if (element.style[name] !== undefined) {
	        return transEndEventNames[name];
	      }
	    }
	  })();

	  return transitionEnd && {end: transitionEnd};
	})();

	UI.support.animation = (function() {
  var animationEnd = (function() {
    var element = window.document.body || window.document.documentElement;
    var animEndEventNames = {
      WebkitAnimation: 'webkitAnimationEnd',
      MozAnimation: 'animationend',
      OAnimation: 'oAnimationEnd oanimationend',
      animation: 'animationend'
    };
    var name;

    for (name in animEndEventNames) {
      if (element.style[name] !== undefined) {
        return animEndEventNames[name];
      }
    }
  })();

  return animationEnd && {end: animationEnd};
	})();

	UI.support.requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

	UI.support.touch = (
		('ontouchstart' in window &&
			navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
		(window.DocumentTouch && document instanceof window.DocumentTouch) ||
		(window.navigator['msPointerEnabled'] &&
		window.navigator['msMaxTouchPoints'] > 0) || //IE 10
		(window.navigator['pointerEnabled'] &&
		window.navigator['maxTouchPoints'] > 0) || //IE >=11
		false);

	// https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver
	UI.support.mutationobserver = (window.MutationObserver ||
	window.WebKitMutationObserver || window.MozMutationObserver || null);

	UI.utils = {};

	UI.utils.debounce = function(func, wait, immediate) {
	  var timeout;
	  return function() {
	    var context = this;
	    var args = arguments;
	    var later = function() {
	      timeout = null;
	      if (!immediate) {
	        func.apply(context, args);
	      }
	    };
	    var callNow = immediate && !timeout;

	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);

	    if (callNow) {
	      func.apply(context, args);
	    }
	  };
	};

	UI.utils.isInView = function(element, options) {
	  var $element = $(element);
	  var visible = !!($element.width() || $element.height()) &&
	    $element.css('display') !== 'none';

	  if (!visible) {
	    return false;
	  }

	  var windowLeft = $win.scrollLeft();
	  var windowTop = $win.scrollTop();
	  var offset = $element.offset();
	  var left = offset.left;
	  var top = offset.top;

	  options = $.extend({topOffset: 0, leftOffset: 0}, options);

	  return (top + $element.height() >= windowTop &&
	  top - options.topOffset <= windowTop + $win.height() &&
	  left + $element.width() >= windowLeft &&
	  left - options.leftOffset <= windowLeft + $win.width());
	};

	UI.utils.options = function(string) {
	  if ($.isPlainObject(string)) {
	    return string;
	  }

	  var start = (string ? string.indexOf('{') : -1);
	  var options = {};

	  if (start != -1) {
	    try {
	      options = (new Function('',
	        'var json = ' + string.substr(start) +
	        '; return JSON.parse(JSON.stringify(json));'))();
	    } catch (e) {
	    }
	  }

	  return options;
	};

	UI.utils.generateGUID = function(namespace) {
		var uid = namespace + '-' || 'ui-';

		do {
			uid += Math.random().toString(36).substring(2, 7);
		} while (document.getElementById(uid));

		return uid;
	};

	$.support.transition = UI.support.transition ;

	// http://blog.alexmaccaw.com/css-transitions
	$.fn.emulateTransitionEnd = function(duration) {
		var called = false;
		var $el = this;

		$(this).one(UI.support.transition.end, function() {
			called = true;
		});

		var callback = function() {
			if (!called) {
				$($el).trigger(UI.support.transition.end);
			}
			$el.transitionEndTimmer = undefined;
		};
		this.transitionEndTimmer = setTimeout(callback, duration);
		return this;
	};

	$.fn.redraw = function() {
	  $(this).each(function() {    
	    var redraw = this.offsetHeight;
	  });
	  return this;
	};

	$.fn.transitionEnd = function(callback) {
		var endEvent = UI.support.transition.end;
		var dom = this;

		function fireCallBack(e) {
			callback.call(this, e);
			endEvent && dom.off(endEvent, fireCallBack);
		}

		if (callback && endEvent) {
			dom.on(endEvent, fireCallBack);
		}

		return this;
	};

	// handle multiple browsers for requestAnimationFrame()
	// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	// https://github.com/gnarf/jquery-requestAnimationFrame
	UI.utils.rAF = (function() {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
      // if all else fails, use setTimeout
      function(callback) {
      return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
    };
  })();

	// handle multiple browsers for cancelAnimationFrame()
	UI.utils.cancelAF = (function() {
	  return window.cancelAnimationFrame ||
	    window.webkitCancelAnimationFrame ||
	    window.mozCancelAnimationFrame ||
	    window.oCancelAnimationFrame ||
	    function(id) {
	      window.clearTimeout(id);
	    };
	})();

	// via http://davidwalsh.name/detect-scrollbar-width
	UI.utils.measureScrollbar = function() {
	  if (document.body.clientWidth >= window.innerWidth) {
	    return 0;
	  }

	  // if ($html.width() >= window.innerWidth) return;
	  // var scrollbarWidth = window.innerWidth - $html.width();
	  var $measure = $('<div ' +
	  'style="width: 100px;height: 100px;overflow: scroll;' +
	  'position: absolute;top: -9999px;"></div>');

	  $(document.body).append($measure);

	  var scrollbarWidth = $measure[0].offsetWidth - $measure[0].clientWidth;

	  $measure.remove();

	  return scrollbarWidth;
	};

	UI.utils.imageLoader = function($image, callback) {
	  function loaded() {
	    callback($image[0]);
	  }

	  function bindLoad() {
	    this.one('load', loaded);
	    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	      var src = this.attr('src'),
	        param = src.match(/\?/) ? '&' : '?';

	      param += 'random=' + (new Date()).getTime();
	      this.attr('src', src + param);
	    }
	  }

	  if (!$image.attr('src')) {
	    loaded();
	    return;
	  }

	  if ($image[0].complete || $image[0].readyState === 4) {
	    loaded();
	  } else {
	    bindLoad.call($image);
	  }
	};

	/**
	* https://github.com/cho45/micro-template.js
	* (c) cho45 http://cho45.github.com/mit-license
	*/	
	UI.template = function(id, data) {
	var me = UI.template;

	if (!me.cache[id]) {
	  me.cache[id] = (function() {
	    var name = id;
	    var string = /^[\w\-]+$/.test(id) ?
	      me.get(id) : (name = 'template(string)', id); // no warnings

	    var line = 1;
	    var body = ('try { ' + (me.variable ?
	    'var ' + me.variable + ' = this.stash;' : 'with (this.stash) { ') +
	    "this.ret += '" +
	    string.
	      replace(/<%/g, '\x11').replace(/%>/g, '\x13'). // if you want other tag, just edit this line
	      replace(/'(?![^\x11\x13]+?\x13)/g, '\\x27').
	      replace(/^\s*|\s*$/g, '').
	      replace(/\n/g, function() {
	        return "';\nthis.line = " + (++line) + "; this.ret += '\\n";
	      }).
	      replace(/\x11-(.+?)\x13/g, "' + ($1) + '").
	      replace(/\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '").
	      replace(/\x11(.+?)\x13/g, "'; $1; this.ret += '") +
	    "'; " + (me.variable ? "" : "}") + "return this.ret;" +
	    "} catch (e) { throw 'TemplateError: ' + e + ' (on " + name +
	    "' + ' line ' + this.line + ')'; } " +
	    "//@ sourceURL=" + name + "\n" // source map
	    ).replace(/this\.ret \+= '';/g, '');
	   
	    var func = new Function(body);
	    var map = {
	      '&': '&amp;',
	      '<': '&lt;',
	      '>': '&gt;',
	      '\x22': '&#x22;',
	      '\x27': '&#x27;'
	    };
	    var escapeHTML = function(string) {
	      return ('' + string).replace(/[&<>\'\"]/g, function(_) {
	        return map[_];
	      });
	    };

	    return function(stash) {
	      return func.call(me.context = {
	        escapeHTML: escapeHTML,
	        line: 1,
	        ret: '',
	        stash: stash
	      });
	    };
	  })();
	}

	return data ? me.cache[id](data) : me.cache[id];
	};

	UI.template.cache = {};

	UI.template.get = function(id) {
		if (id) {
		  var element = document.getElementById(id);
		  return element && element.innerHTML || '';
		}
	};

	$.UI = UI;

})(jQuery, UI)