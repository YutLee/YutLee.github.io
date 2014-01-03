/**
 * jQuery dialog -- alert, confirm, prompt
 * @license Copyright 2013
 * 
 * @author yutlee.cn@gmail.com
 * Date 2013-10-12 
 */
(function($, window, undefined) {
	'use strict';
	
	var  
		/** 
		 * 应用程序 
		 * @namespace 
		 */
		app = window.app = window.app || {};
		
	var html;
	var $prompt,
		$wrapper,
		$dialog,
		$title,
		$content,
		$button,
		$cancel,
		$ok,
		$close,
		$overlay;
	var isShow = false;
	
	/**
	 * 初始化对话框
	 * @private
	 */
	function init() {
		if(!$wrapper) {
			$wrapper = $(html).appendTo('body');
			$dialog = $wrapper.prev('.modal-dialog');
			$title = $dialog.children('.dialog-title');
			$content = $dialog.children('.dialog-content');
			$button = $dialog.children('.dialog-button');
			$cancel = $button.children().first();
			$ok = $button.children().last();
			$close = $dialog.children('.dialog-close');
			$overlay = $dialog.next('.modal-dialog-overlay');
		}
		$wrapper.hide();
		$cancel.show();
	}
	
	/**
	 * 对话框定位
	 * @private
	 */
	function position() {
		var w = $(window).width(),
			h = $(window).height(),
			dW = $dialog.outerWidth(),
			dH = $dialog.outerHeight(),
			winTop = $(window).scrollTop(),
			winLeft = $(window).scrollLeft(),
			left = (w - dW) * .5 + winLeft,
			top = (h - dH) * .5 + winTop;
		$dialog.css({'top': top, 'left': left});
		$wrapper.show();
		$(window).bind({
			'scroll.dialog': function() {
				$(window).scrollTop(winTop);
				$(window).scrollLeft(winLeft);
			},
			'keydown.dialog': function(e) {
				if(e.keyCode !== 9 || e.keyCode !== 13 || e.keyCode !== 27) {
					return false;
				}
			}
		});
	}
	
	/**
	 * 填充内容到对话框
	 * @private
	 */
	function addContent(msg, value) {
		if(value || value == '') {
			$content.empty().append('<div>' + msg + '</div>');
			$prompt = $('<input class="dialog-input" type="text" name="prompt" tabIndex="10000" value="' + value +'" />').appendTo($content);
		}else {
			console.log(msg);
			msg = msg === undefined ? 'undefined' : msg;
			$content.empty().text(msg);
		}
		position();
		isShow = true;
	}
	
	/**
	 * 隐藏对话框
	 * @private
	 */
	function hideDialog() {
		$wrapper.hide();
		$content.empty();
		unbind();
		$(window).unbind('scroll.dialog');
		$(window).unbind('keydown.dialog');
		isShow = false;
	}
	
	/**
	 * 取消绑定的事件
	 * @private
	 */
	function unbind() {
		$ok.unbind('click');
		$cancel.unbind('click');
		$close.unbind('click');
		//$overlay.unbind('click');
		$(document).unbind('keydown.dialogEsc');
		$(document).unbind('keydown.dialogTab');
		$ok.unbind('keydown.dialogEnter');
		$cancel.unbind('keydown.dialogEnter');
	}
	
	/**
	 * 绑定 取消/关闭 按钮
	 * @private
	 */
	function bindCancel(el, cancel) {
		el.bind({
			'click': function() {
				hideDialog();
				if($.isFunction(cancel)) {
					cancel.call(this);
				}
			}
		});
	}
	
	/**
	 * 绑定键盘事件
	 * @private
	 */
	function bindKeybord($ok, $close, $cancel, $prompt) {
		if($prompt) {
			$prompt.focus().select();
			$prompt.bind({
				'keydown': function(e) {
					if(e.keyCode === 13) {
						$ok.click();
					}
				}
			});
		} else{
			setTimeout(function() {
				$ok.focus();
			}, 20);	//firefox下要大于12毫秒，其它大于2毫秒即可，用20毫秒确保能获取焦点
		}
		$(document).bind({
			'keydown.dialogEsc': function(e) {
				if(e.keyCode === 27) {
					$close.click();
				}
			},
			'keydown.dialogTab': function(e) {
				if(e.keyCode === 9) {
					if(!$cancel) {
						setTimeout(function() {
							$ok.focus();
						}, 1);
					}else if(!$prompt) {
						setTimeout(function() {
							$cancel.blur(function() {
								$ok.focus();
							});
						}, 1);
					}else {
						setTimeout(function() {
							$cancel.blur(function() {
								$prompt.focus();
							});
						}, 1);
					}
				}
			}
		});
		$ok.bind({
			'keydown.dialogEnter': function(e) {
				if(e.keyCode === 13) {
					$ok.click();
				}
			}
		});
		if($cancel) {
			$cancel.bind({
				'keydown.dialogEnter': function(e) {
					if(e.keyCode === 13) {
						$cancel.click();
					}
				}
			});
		}
	}
	
	
	/**
	 * 设置空函数
	 * @private
	 */
	function noop(fn) {
		if(!fn || !$.isFunction(fn)){
			fn = $.noop;
		}
		return fn;
	}
	
	/**
	 * tooltip 对象
	 * @namespace 
	 */
	app.dialog = {
		/**
		 * setup 全局设置
		 * @param {string} dialogClass 弹窗口类名
		 * @param {string} overlayClass 遮罩层类名
		 * @param {string} title 提示的标题
		 * @param {string} ok ok按钮的文本
		 * @param {string} cancel cancel按钮的文本
		 * @example 
		 * app.dialog.setup({title: '=^_^=', ok: 'Yes', cancel: 'No'});
		 */
		setup: function(options) {
			var o = $.extend({
				dialogClass: '',
				overlayClass: '',
				title: '温馨提示',
				ok: '确定',
				cancel: '取消'
			}, options || {});
			
			html = $('<div class="modal-dialog ' + o.dialogClass +'"><div class="dialog-close">×</div><div class="dialog-title">' + o.title + '</div><div class="dialog-content"></div> <div class="dialog-button"><button class="play-button" tabIndex="10002">' + o.cancel + '</button> <button class="play-button" tabIndex="10001">' + o.ok + '</button></div></div><div class="modal-dialog-overlay ' + o.overlayClass +'"></div>');

		},
		/**
		 * alert 对话框
		 * @param {string|number} msg 需要显示的文本信息
		 * @example
		 * app.dialog.alert('o_o|');
		 */
		alert: function(msg) {
			if(isShow) {
				return false;
			}
			init();
			$cancel.hide();
			addContent(msg);
			$ok.bind({
				'click': function() {
					hideDialog();
				}
			});
			bindCancel($close);
			//bindCancel($overlay);
			bindKeybord($ok, $close);
		},
		/**
		 * confirm 对话框
		 * @param {string} msg 需要显示的文本信息
		 * @param {Function} ok 确定时的回调函数
		 * @param {Function} cancel 取消时的回调函数
		 * @return {boolean} 确定时返回 true，取消时返回 false
		 */
		confirm: function(msg, ok, cancel) {
			if(isShow) {
				return false;
			}
			init();
			addContent(msg);
			ok = noop(ok);
			cancel = noop(cancel);
			$ok.bind({
				'click': function() {
					hideDialog();
					ok.call(this);
				}
			});
			bindCancel($cancel, cancel);
			bindCancel($close, cancel);
			//bindCancel($overlay, cancel);
			bindKeybord($ok, $close, $cancel);
		},
		/**
		 * prompt 对话框
		 * @param {string} msg 需要显示的文本信息
		 * @param {string} value 用户输入的值
		 * @param {Function} ok 确定时的回调函数
		 * @param {Function} cancel 取消时的回调函数
		 * @return {boolean} 确定时返回 value，取消时返回 false
		 */
		prompt: function(msg, value, ok, cancel) {
			if(isShow) {
				return false;
			}
			var okFn, cancelFn;
			init();
			if($.isFunction(value)) {
				addContent(msg, '');
				okFn = noop(value);
				cancelFn = noop(ok);	
			}else {
				addContent(msg, value);
				okFn = noop(ok);
				cancelFn = noop(cancel);
			}
			$ok.bind({
				'click': function() {
					hideDialog();
					var val = $prompt.val();
					okFn.call(this, val);
				}
			});
			bindCancel($cancel, cancelFn);
			bindCancel($close, cancelFn);
			//bindCancel($overlay, cancelFn);
			bindKeybord($ok, $close, $cancel, $prompt);
		}
	};
	
	app.dialog.setup();
	
})(jQuery, window);