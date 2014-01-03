/**
 * @license Copyright 2013
 * jQuery popup v1.0
 *
 * @author yutlee.cn@gmail.com
 * Date 2013-7-13
 */
(function($, window, undefined) {
var Popup = window.Popup = (function() {
		function constructor(options) {
			this.options = $.extend({
				id: null,
				url: '',
				datatype: 'json',
				closeCall: null,
				successCall: function() {
					//IE通过插入元素模拟placeholder
					if ($.browser.msie && $.browser.version < 10){
						$('input[type=text],input[type=password],textarea').each(function(index, element) {
							var placeholder = $(this).attr('placeholder');
							if(placeholder && $.trim(placeholder) !== '') {
								$(this).placeholder({isUseSpan:true});	
							}
						});
					}	
				},
				scrollTop: false,
				title: '温馨提示',
				width: 400,
				height: 'auto',
				animate: true,
				full: null,
				style: ''	
			}, options || {});
			if(window.top.popup === undefined) {
				window.top.popup = [];
			}
			if(window.top.popupIframe === undefined) {
				window.top.popupIframe = [];
			}
		}
		var $temp, $title, $shadow, $closeButton, $container, $content, $parent;
		var play;
		var html = '';
		if(!window.top.popupArray) {
			window.top.popupArray = [];
		}
		function isArray(variable) {
			return Object.prototype.toString.call(variable) === "[object Array]";
		}
		function isFunction(variable) {
			return typeof(variable) === "function";
		};
 		function init() {
			$temp = $('<div class="popup" />');
			$title = $('<div class="title" />');
			$closeButton = $('<div class="close" />'); 
			$container = $('<div class="container" />'); 
		}
		function add(popup) {
			popup.showBefore($temp);
			$closeButton = $closeButton.html('×').appendTo($temp);
			$title.html(popup.options.title).appendTo($temp);
			$content = popup.options.id;
			if($content) {
				$parent = $content.parent();
				$container.append($content.show()).appendTo($temp);
			}else {
				$container.html(html).appendTo($temp);
			}
			$temp = $temp.css({'display': 'none'}).appendTo('body');
			
			popup.setStyle($temp);
			if(!popup.options.full) {
				popup.position($temp);
			}
			$temp.fadeIn();
			popup._close(popup.callback);	
		}
		function addHtml(popup, data) {
			popup.showBefore($temp);
			$closeButton = $closeButton.html('×').appendTo($temp);
			$title.html(popup.options.title).appendTo($temp);

			$container.html(data).appendTo($temp);

			popup.temp = $temp = $temp.css({'display': 'none'}).appendTo('body');
			
			popup.setStyle($temp);
			if(!popup.options.full) {
				popup.position($temp);
			}
			$temp.fadeIn();
			popup._close(popup.callback);	
		}
		function addIframe(popup, url) {
			popup.showBefore($temp);
			$closeButton = $closeButton.html('×').appendTo($temp);
			$title.html(popup.options.title).appendTo($temp);
			var iframe = '<iframe scrolling="no" frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>';
			
			$container.html(iframe).appendTo($temp);

			popup.temp = $temp = $temp.css({'display': 'none'}).appendTo($(window.parent.document.body));
			
			popup.setStyle($temp);
			//$container.height($temp.height - 60);
			if(!popup.options.full) {
				popup.position($temp);
			}
			$temp.fadeIn();
			popup._close(popup.callback);	
		}
		function resize(popup, el) {
			$(window).bind({
				'resize.popup': function() {
					clearTimeout(play);
					play =setTimeout(function() {
						popup.position(el);
					}, 100);
				}	
			});	
		}
		constructor.prototype = {
			init: function() {
				if(window.top.popup === undefined) {
					window.top.popup = [];
				}
				window.top.popup.push(this);
			},
			tempHtml: [],
			loadInto: function(options) {
				var o = $.extend({
						url: '',
						temps: '',
						successCall: null
					}, options || {});
				bt.request({
					url: o.url,
					temps: o.temps,
					isHistory: false,
					callback: function(data) {
						html = bt.getCompleteHtml(data);
						bt.loadCss(data.css_url);
						bt.loadJs(data.js_url);
						$container.html(html)
						if(isFunction(o.successCall)) {
							o.successCall.apply(that);
						}
						return false;
					}
				});
			},
			getData: function() {
				var that = this,
					bt = app.bitty;
				init();
				$shadow = $('<div class="popup_shadow" />').appendTo('body');
				bt.request({
					url: that.options.url,
					temps: that.options.temps,
					isHistory: false,
					callback: function(data) {
						html = bt.getCompleteHtml(data);
						bt.loadCss(data.css_url);
						bt.loadJs(data.js_url);
						add(that);
						if(isFunction(that.options.successCall)) {
							that.options.successCall.apply(that);
						}
						return false;
					}
				});
			},
			getHtml: function(url) {
				var that = this;
				$.ajax({
					url: url,
					success: function(data) {
						addHtml(that, data);
						if(isFunction(that.options.successCall)) {
							that.options.successCall.apply(that);
						}
					}
				});
			},
			getIframe: function(url) {
				var that = this;
				addIframe(that, url);
			},
			showBefore: function(el) {
				var that = this,
					width = that.options.width,
					height = that.options.height;
				if(width && width === 'auto') {
					el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'width': 'auto', 'right': 'auto', 'left': 'auto'});
				}
				if(height && height === 'auto') {
					el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'height': 'auto', 'top': 'auto', 'bottom': 'auto'});
				}
			},
			setStyle: function(el) {
				var that = this,
					width = that.options.width,
					height = that.options.height,
					full = that.options.full,
					style = that.options.style;
					
				if($.trim(style) !== '') {
					el.addClass(style);
					$shadow.addClass(style);	
				}
				if(el.css('position') !== 'absolute') {
					el.css({'position': 'absolute'})	
				}
				if(el.css('z-index') === 'auto') {
					el.css({'z-index': 9999})	
				}
				if(full) {
					var top = full.top,
						right = full.right,
						bottom = full.bottom,
						left = full.left;
					top = (top || top == 0) ? top : 'auto';
					right = (right || right == 0) ? right : 'auto';
					bottom = (bottom || bottom == 0) ? bottom : 'auto';
					left = (left || left == 0) ? left : 'auto';
					//console.log(full);
					el.css({'width': 'auto', 'height': 'auto', 'top': top, 'right': right, 'bottom': bottom, 'left': left});
					//$('body').css({'overflow': 'hidden'});
					$('html').css({'overflow': 'hidden'});
				}else {
					if(width && width === 'auto') {
						//el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'width': 'auto', 'right': 'auto', 'left': 'auto'});
						el.css({'width': $container.width(), 'display': 'none', 'visibility': 'visible'});
					}else {
						el.width(width);	
					}	
					if(height && height === 'auto') {
						//el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'height': 'auto', 'top': 'auto', 'bottom': 'auto'});
						el.css({'height': el.height(), 'display': 'none', 'visibility': 'visible', 'position': 'absolute'});
					}else {
						el.height(height);
					}
				}
				$container.height(el.height() - $title.outerHeight());
			},
			position: function(el) {
				var winWidth = $(window.top).width(),
					winHeight = $(window.top).height(),
					left = (winWidth - el.outerWidth()) * .5,
					top = (winHeight - el.outerHeight()) * .5 + $(window).scrollTop();
				left = left > 0 ? left : 0;
				top = top > 0 ? top : 0;
				el.animate({'left': left, top: top}, 100);
			},
			open: function() {
				var that = this;
				var newIframe;
				if(window.top.popup === undefined) {
					window.top.popup = [];
				}
				window.top.popup.unshift(that);
				if(that.options.id) {
					if(!window.top.shadowArray) {
						$shadow = $('<div class="popup_shadow" />').appendTo('body');
					}
					init();
					add(that);
					if(!that.options.full) {
						resize(that, $temp);
					}
					newIframe = '';
				}else if(that.options.datatype === 'iframe') {
					if(!window.top.shadowArray) {
						$shadow = $('<div class="popup_shadow" />').appendTo($(window.parent.document.body));
					}
					init();
					that.getIframe(that.options.url);
					newIframe = $temp.find('iframe')[0];
				}else if(that.options.datatype === 'json'){
					that.getData();
					newIframe = '';
				}else if(that.options.datatype === 'html') {
					if(!window.top.shadowArray) {
						$shadow = $('<div class="popup_shadow" />').appendTo('body');
					}
					init();
					that.getHtml(that.options.url);
					newIframe = '';
				}
				if(window.top.shadowArray) {
					var pa = window.top.popupArray[window.top.popupArray.length - 1];
					var zIndex = window.top.shadowArray.css('z-index');
					pa.css({'z-index': zIndex - 1});
				}
				window.top.popupIframe.unshift(newIframe);
				window.top.popupArray.push($temp);
				window.top.shadowArray = $shadow ? $shadow : window.top.shadowArray;
				//console.log(window.top.popupArray);
				
			},
			reload: function() {
				var that = this;
				
				if(that.options.datatype === 'iframe') {
					that.temp.find('iframe').attr('src', that.options.url);
					that.setStyle(that.temp);
					if(!that.options.full) {
						that.position(that.temp);
					}
				}else if(that.options.datatype === 'json'){
					that.getData();
				}else if(that.options.datatype === 'html') {
					$.ajax({
						url: that.options.url,
						success: function(data) {
							that.temp.find('.container').html(data);
							that.setStyle(that.temp);
							if(!that.options.full) {
								that.position(that.temp);
							}
							if(isFunction(that.options.successCall)) {
								that.options.successCall.apply(that);
							}
						}
					});
				}
			},
			_close: function() {
				var that = this;
				var shadowNow = window.top.shadowArray ? window.top.shadowArray : $shadow;
				$closeButton.bind({
					'click': function() {
						that._dele();
						return false;	
					}	
				});
				shadowNow.unbind('click.shadow');
				shadowNow.bind({
					'click.shadow': function() {
						that._dele();
						return false;	
					}	
				});
			},
			_dele: function() {
				var that = this;
				var shadowNow = window.top.shadowArray ? window.top.shadowArray : $shadow;
				var len = window.top.popupArray.length;
				var tempNow = window.top.popupArray[len - 1];
				var tempPrev = window.top.popupArray[len - 2];
				tempNow = tempNow ? tempNow : $temp;
				tempPrev = tempPrev ? tempPrev : $temp;
				if($content) {
					$content.hide().appendTo($parent);	
				}
				tempNow.fadeOut();
				if(len === 1) {
					shadowNow.fadeOut();
					if(that.options.animate) {
						tempNow.queue(function() {
							only();
						});
					}else {
						only();
					}
				}else if(len > 1){
					if(that.options.animate) {
						tempNow.queue(function() {
							notOnly();
						});	
					}else {
						notOnly();
					}
				}
				cb();
				function only() {
					that.callClose();
					shadowNow.remove();
					$temp.remove();
					window.top.shadowArray = null;
					window.top.popupIframe = [];
					window.top.popupArray = [];
					$(window).unbind('resize.popup');
					window.top.popup.shift();
				}
				function notOnly() {
					that.callClose();
					tempPrev.css({'z-index': tempPrev.css('z-index') + 2});
					tempNow.remove();
					window.top.popupIframe.shift();
					window.top.popupArray.pop();
					window.top.popup.shift();	
				}
				function cb() {
					if(isFunction(that.options.closeCall)) {
						that.options.closeCall.apply(that);
					}
				}
				//$('body').css({'overflow': 'auto'});
				$('html').css({'overflow-y': 'scroll'});
			},
			close: function() {
				if(isArray(window.top.popup) && window.top.popup.length > 0) {
					this._dele();
				}
			},
			callClose: function(callback) {
				if(isFunction(callback)) {
					callback.apply(this);
				}
			}
		};
		return constructor;
	})();
})(jQuery, window);