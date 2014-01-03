/**
 * jQuery bitty v1.0
 * @license Copyright 2013
 * 
 * base jquery.history.js
 * @see https://github.com/browserstate/history.js 
 * 
 * base doT.js
 * @see https://github.com/olado/doT 
 *
 * Date 2013-8-23
 * Update 2013-9-26
 */

(function ($, window, undefined) {
	//'use strict';
	
	//============================== 工具函数开始 ==============================
	/**
	 * 去除字符串前后空格
	 * @param {Object} 用于测试的字符串
	 * @return {string}
	 * @memberOf _global_
	 */
	function trim(variable) {
		return variable.replace(/^\s+|\s+$/g, '');
	}
	/**
	 * 检测对象是否为对象
	 * @param {Object} 用于测试是否为对象的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isObject(variable) {
		return variable && !variable.nodeType && Object.prototype.toString.call(variable) === '[object Object]';
	}
	/**
	 * 检测对象是否为函数
	 * @param {Object} 用于测试是否为函数的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isFunction(variable) {
		return typeof(variable) === 'function';
	}
	/**
	 * 检测对象是否为数组
	 * @param {Object} 用于测试是否为数组的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isArray(variable) {
		return Object.prototype.toString.call(variable) === '[object Array]';
	}
	/**
	 * 检测对象是否为字符串
	 * @param {Object} 用于测试是否为字符串的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isString(variable) {
		return Object.prototype.toString.call(variable) === '[object String]';
	}
	/**
	 * 对比返回在 array1 中但是不在 array2 中的值。
	 * @param {Array} array1 必须，要被对比的数组
	 * @param {Array} array2 必须，和这个数组进行比较
	 * @return {Array} 返回一个数组，该数组包括了所有在 array1 中但是不在 array2 中的值。
	 * @memberOf _global_
	 */
	function arrayDiff(array1, array2) {
		var that = this;
		if(!isArray(array1)) {
			console.log('参数 array1：' + array1 + '不是数组');
			return false;
		}
		if(!isArray(array2)) {
			console.log('参数 array2：' + array2 + '不是数组');
			return false;
		}
		if(isArray(array1) && isArray(array2)) {
			var newArray = [],
				k1 = 0,
				len1 = array1.length,
				len2 = array2.length;
			for(; k1 < len1; k1++) {
				for(var k2 = 0; k2 < len2; k2++) {
					if(array1[k1] === array2[k2]) {
						break;
					}
					if(k2 === len2 - 1 && array1[k1] !== array2[k2]) {
						newArray.push(array1[k1]);
					}
				}
			}
			return newArray;
		}
	}
	//============================== 工具函数结束 ==============================
	
	var 
		/** @namespace */
		app = window.app = window.app || {};
	
	/** @namespace */
	app.bitty = {
		tempCache: {},	//缓存模板
		currentUrlCache: [],	//缓存当前模板url
		tempUrlCache: [], //缓存模板url
		pageCache: {}, //缓存页面相关内容
		htmlCache: {},	//缓存模块
		jsCache: {}, //缓存javascript
		cssCache: {}, //缓存css
		dominRegExp: new RegExp('(https|http)://[^/]*/', 'g'),
		/**
		 * 头部信息
		 * @type {Object}
		 */
		headers: {
			'Accept': 'application/json',
			'X-Referer': window.location.href
		},
		/**
		 * 替换文件路径为合法 html标签 ID
		 * @param {string} path 必须，需要替换的文件路径
		 * @return {string} 
		 */
		replacePath: function(path) {
			return path.replace(this.dominRegExp, '').replace(/[^(\-|\w)]/g, '-');
		},
		/**
		 * 初始化
		 * @param {string} url 必须，新页面地址
		 * @param {Json} data 必须，新页面数据和模板
		 */
		init: function(url, data) {
			var that = this,
				tempId = data.temp_id;

			if(isObject(tempId)) {
				var allTemps = data.temp_url;
				var diff = that.currentUrlCache.length > 0 ? arrayDiff(that.currentUrlCache, allTemps) : allTemps;
				var k = 0, 
					l = diff.length;
				
				url = url.replace(that.dominRegExp, '');	//删除网址域名，减少缓存变量名的长度
				if(!that.pageCache[url]) {
					that.pageCache[url] = {};
				}
				if(!that.pageCache[url]['temps']) {
					that.pageCache[url]['temps'] = allTemps.join(',');
				}
				if(!that.pageCache[url]['allTemps']) {
					that.pageCache[url]['allTemps'] = allTemps.join(',');
				}
				
				that.currentUrlCache = allTemps;

				for(var key in tempId) {	//遍历需要更新的模板
					var value = tempId[key],
						id = that.replacePath(value),
						html;
					if(!that.tempCache[value] && !isFunction(that.tempCache[value])) {
						that.tempCache[value] = doT.template(data.temp[key]);
						that.tempUrlCache.push(value);
					}
				}
			}
			that.bindLink();
		},
		/**
		 * 加载页面
		 * @param {string} url 必须，新页面地址
		 * @param {Json} data 必须，新页面数据和模板
		 */
		loadPage: function(url, data) {
			var that = this,
				tempId = data.temp_id,
				hint = data.hint;

			if(isObject(hint)) {
				if(isString(hint.url)) {
					that.request({url: hint.url, title: hint.title});
				}
				if(isString(hint.error_tip) && trim(hint.error_tip) != '') {
					app.tooltip.destroy();
					app.tooltip.error(hint.error_tip);
				}
				if(isString(hint.success_tip) && trim(hint.success_tip) != '') {
					app.tooltip.destroy();
					app.tooltip.success(hint.success_tip, 3000);
				}
				if(isString(hint.warning_tip) && trim(hint.warning_tip) != '') {
					app.tooltip.destroy();
					app.tooltip.warning(hint.warning_tip);
				}
				return false;
			}
			
			if(isObject(tempId)) {
				var allTemps = data.temp_url;
				var diff = that.currentUrlCache.length > 0 ? arrayDiff(that.currentUrlCache, allTemps) : allTemps;
				var allTempsLen = allTemps.length,
					k = 0, 
					l = diff.length;

				for(; k < l; k++) {
					var id = that.replacePath(diff[k]);
					if($('#' + id).length > 0) {
						$('#' + id).remove();	//删除在当前页面但不在新页面的模块
						console.log('删除在当前页面但不在新页面的模块' + id);
					}
				}
				
				url = url.replace(that.dominRegExp, '');	//删除网址域名，减少缓存变量名的长度
				if(!that.pageCache[url]) {
					that.pageCache[url] = {};
				}
				if(!that.pageCache[url]['temps']) {
					that.pageCache[url]['temps'] = allTemps.join(',');
				}
				if(!that.pageCache[url]['allTemps']) {
					that.pageCache[url]['allTemps'] = allTemps.join(',');
				}
				
				that.currentUrlCache = allTemps;

				for(var key in tempId) {	//遍历需要更新的模板
					var idx = parseInt(key.replace(/[^\d]/g, '')), 
						value = tempId[key],
						id = that.replacePath(value),
						html;
					if(!that.tempCache[value] && !isFunction(that.tempCache[value])) {
						that.tempCache[value] = doT.template(data.temp[key]);
						that.tempUrlCache.push(value);
					}
					html = (isObject(data.data)) ? that.tempCache[value](data.data[key]) : that.tempCache[value]('');
					
					if($('#' + id).length > 0) {	
						$('#' + id).remove();	//删除要替换的已存在当前页面的模块
						console.log('删除要替换的已存在当前页面的模块' + id);
					}

					//获取需要插入位置的id
					function insertHtml(idx) {
						idx -= 1;
						if(idx < 0) {
							$(data.mod[key]).prepend($('<div id="' + id +'"/>').html(html));
						}else {
							var existId = that.replacePath(allTemps[idx]),
								prevId = $(data.mod[key]).find('#' + existId);
							if(prevId.length === 1) {
								prevId.after($('<div id="' + id +'"/>').html(html));
							}else {
								insertHtml(idx - 1);
							}
						}
					}
					
					insertHtml(idx);
					
					console.log('载人新模块："' + id + '"');
				}

				that.loadCss(data.css_url);
				that.loadJs(data.js_url);
				
				//统一加载最后的js
				if(isArray(that.finalJs)) {
					for(var i = 0; i < that.finalJs; i++) {
						that.finalJs[i] = that.finalJs[i].replace(that.dominRegExp, '');	
					}
					that.loadJs(that.finalJs);
				}
			}
			//console.log('已缓存的模板', that.tempCache);
			//console.log('ajax请求页面模板id', that.pageCache);
		},
		/**
		 * 获取数据并嵌套好html，供外部js调用
		 * @param {Object} data Json数据
		 * @return 返回套好的html
		 */
		getCompleteHtml: function (data) {
			var that = this,
				tempId = data.temp_id,
				html = '';
			for(var key in tempId) {
				var value = tempId[key];
				if(!that.tempCache[value] && !isFunction(that.tempCache[value])) {
					that.tempCache[value] = doT.template(data.temp[key]);
					that.tempUrlCache.push(value);
				}
				html += (isObject(data.data)) ? that.tempCache[value](data.data[key]) : that.tempCache[value]('');
			}
			return html;
		},
		/**
		 * 加载页面javascript
		 * @param {Array} url <script>标签的src属性
		 * @private
		 */
		loadJs: function (url) {
			var that = this,
				i = 0,
				len;
			if(isArray(url)) {
				len = url.length;
				for (; i < len; i++) {
					var now = url[i];
					if(!that.jsCache[now]) {
						loadOne(now, false);
						that.jsCache[now] = now;
					}else {
						loadOne(now, true);
					}
				}
			}
			function loadOne(url, cache) {
				$.ajax({
					url: url,
					cache: cache,
					dataType: 'script'
				});	
			}
		},
		/**
		 * 加载页面css
		 * @param {Array} url <link>标签的href属性
		 * @private
		 */
		loadCss: function (url) {
			var that = this,
				i = 0,
				len;
			if(isArray(url)) {
				len = url.length;
				for (; i < len; i++) {
					var now = url[i];
					if(!that.cssCache[now]) {
						$('head').append('<link rel="stylesheet" href="' + now + '" />');
						that.cssCache[now] = now;
					}
				}
			}
		},
		/**
		 * 更新所有页面缓存信息
		 * @param {string} url 必须，新页面地址
		 */
		refreshPageCache: function(url) {
			var that = this,
				newTemps,
				reTemps;
			for(var key in that.pageCache) {
				if(key === url && that.pageCache[key]['temps'] && that.currentUrlCache) {
					newTemps = arrayDiff(that.pageCache[key]['allTemps'].split(','), that.currentUrlCache);
					newTemps = arrayDiff(newTemps, that.pageCache[key]['temps'].split(','));
					reTemps = that.pageCache[key]['temps'].split(',');
					for(var i = 0; i < newTemps.length; i++) {
						reTemps.push(newTemps[i]);
					}
					that.pageCache[key]['reTemps'] = reTemps.join(',');
					console.log('更新页面缓存' + key);
					break;
				}
			}
		},
		/**
		 * 设置发送的头部信息
		 * @param {string} url 必须，新页面地址
		 * @param {string} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
		 */
		setHeaders: function(url, temps) {
			var that = this,
				newTemps,
				noExist;
			
			url = url.replace(that.dominRegExp, '');	//删除网址域名，减少缓存变量名的长度
			
			if(!that.pageCache[url]) {
				that.pageCache[url] = {};
			}
			
			if(temps && temps != '') {
				that.headers['Temps'] = that.pageCache[url]['temps'] = that.pageCache[url]['reTemps'] = temps;
				noExist = arrayDiff(temps.split(','), that.tempUrlCache);
				that.headers['No-Exist'] = noExist.join(',');
			}else if(that.pageCache[url]['reTemps']) {
				that.headers['Temps'] = that.pageCache[url]['reTemps'];
				noExist = arrayDiff(that.pageCache[url]['reTemps'].split(','), that.tempUrlCache);
				that.headers['No-Exist'] = noExist.join(',');
			}else {
				that.headers['Temps'] = '';
				that.headers['No-Exist'] = 'none';
			}
			console.log('需要请求的数据', that.headers);
		},
		/**
		 * 加载中... ...
		 */
		loading: {
			/** 
			 * 加载中的提示信息
			 * @type {string}
			 */
			msg: '加载中...',
			/** 
			 * 加载前的回调函数
			 * @param {Array} 页面上需要删除的模块的 id 数组
			 */
			beforeSend: function(mods, url) {
				//app.tooltip.warning(this.msg, 'none');
				for(var i = 0; i < mods.length; i++) {
					$('#' + mods[i]).parent().addClass('loading');
				}
				console.log(mods,'loading');
			},
			/** 
			 * 加载成功的回调函数
			 * @param {Array} 插入页面的模块的 id 数组
			 */
			success: function(mods, url) {
				//app.tooltip.close();
				for(var i = 0; i < mods.length; i++) {
					$('#' + mods[i]).parent().removeClass('loading');
				}
				console.log(mods,'removeloading');
			}
		},
		/**
		 * ajax请求Json数据
		 * @param {string} options 必须
		 * @private
		 */
		ajax: function(options) {
			var that = this,
				o = $.extend({
					url: '',
					dataType: 'json',
					headers: that.headers,
					type: 'GET',
					data: null,
					callback: null
				}, options || {}),
				newMods = [];
			$.ajax({
				url: o.url,
				type: o.type,
				dataType: 'json',
				headers: that.headers,
				data: o.data,
				beforeSend: function() {
					that.latestRequest = o.url;
					if(isFunction(that.loading.beforeSend)) {
						var mods = that.headers.Temps ? arrayDiff(that.currentUrlCache, that.headers.Temps.split(',')) : that.currentUrlCache;
						var i = 0, len = mods.length;
						mods = len > 0 ? mods : that.currentUrlCache;
						len = mods.length;
						for(; i < len; i++) {
							newMods.push(that.replacePath(mods[i]));
						}
						that.loading.beforeSend.call(that.loading, newMods, o.url);
					}
				},
				success: function(data) {
					if(that.latestRequest === o.url) {
						if(o.isHistory) {
							History.pushState('', o.title, o.url);
							History.replaceState('', o.title, o.url);
						}
						that.isLinkClick = false;
						that.refreshPageCache(o.url);
						if(isFunction(that.loading.success)) {
							that.loading.success.call(that.loading, newMods, o.url);
						}
						if(isFunction(o.callback)) {
							var callback = o.callback.call(that, data);
							if(!callback) {
								return false;	
							}
						}
						that.loadPage(o.url, data);
					}
				},
				complete: function() {
					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.error(textStatus);	
				}
			});
		},
		/**
		 * 加载新页面，Ajax请求获取数据
		 * @param {string} url 必须，新页面地址
		 * @param {string} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
		 * @param {boolean} isHistory 可缺省， 新页面地址是否加入历史地址记录， 默认 true 加入
		 * @param {string} title 可缺省，新页面标题，缺省下取当前页面标题
		 */
		request: function(options) {
			var that = this,
				o = $.extend({
					url: '',
					temps: '',
					isHistory: true,
					title: document.title,
					type: 'GET',
					data: null,
					callback: null
				}, options || {});

			that.isLinkClick = true;
			//url = url.replace(/[\u4e00-\u9fa5]/g, encodeURIComponent('$0', true));	//对中文进行编码
			that.setHeaders(o.url, o.temps);
			that.ajax({url: o.url, isHistory: o.isHistory, title: o.title, type: o.type, data: o.data, callback: o.callback});
		},
		/**
		 * 刷新当前页面
		 */
		refresh: function() {
			this.request({url: window.location.href});
		},
		/**
		 * 绑定<a>链接点击事件
		 */
		bindLink: function() {
			var that = this;
			$('body').delegate('a:not([target=_blank],[target=_top],[target=_parent],[target=_self])', 'click', function() {
				var t = $(this),
					url = t.attr('href'),
					temps = t.attr('data-temps'),
					title = t.attr('data-title');
				if( !($.trim(url).match(/#.*/) || $.trim(url).match(/javascript:/)) ) {
					that.request({url: url, temps: temps, title: title});
					return false;
				}	
			});	
		},
		/**
		 * 表单提交
		 * @param {string} formId 可缺省，表单id；缺省时 submitId 参数必填
		 * @param {string} submitId 可缺省，提交的按钮；缺省时 formId 参数必填
		 * @param {string} url 可缺省，提交的地址；缺省时默认提交到当前地址或表单的 action 属性地址
		 * @param {string} method 可缺省，提交的方式；缺省时默认取表单 method 属性的值，method为空时默认'POST'提交
		 * @param {boolean} isHistory 可缺省， 新页面地址是否加入历史地址记录， 默认 true 加入
		 * @param {string} title 可缺省，新页面标题，缺省下取当前页面标题
		 * @param {string} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
		 */
		ajaxForm: function(options) {
			var that = this,
				o = $.extend({
					formId: null, 
					submitId: null, 
					url: null, 
					method: null,
					isHistory: true,
					title: document.title,
					temps: '',
					callback: null
				}, options || {});

			if(!o.formId) {
				if(!o.submitId) {
					console.log('参数 formId 或 submitId 必须有一个');
					return false;
				}else {
					var button = $('#' + o.submitId);	
					o.formId = button.closest('form')[0];
				}
			}
			var $form = isString(o.formId) ? $('#' + o.formId) : $(o.formId);
			
			if(!o.method) {
				var m = $form.attr('method');
				o.method = !m ? 'GET' : m.toLocaleUpperCase(); 
			}
			
			if(!o.url) {
				var action = $form.attr('action');
				o.url = !action ? window.location.href : action; 
			}
			
			var params = $form.serialize();//form序列化, 自动调用了encodeURIComponent方法将数据编码了 
			params = decodeURIComponent(params, true); //将数据解码

			var data;
			if(o.method == 'POST') {
				data = params;
				o.isHistory = false;
			}else {
				data = '';
				o.url = o.url.match(/&$/g) ? o.url + params :  o.url + '&' +  params;
			}
			that.isLinkClick = true;
			that.setHeaders(o.url, o.temps);
			that.ajax({url: o.url, type: o.method, data: data, isHistory: o.isHistory, title: o.title, callback: o.callback});
			return false;
		}
	};
	
	/**
	 * 绑定历史地址事件
	 */
	History.Adapter.bind(window, 'statechange', function() {
		var bt = app.bitty,
			actualState = History.getState(false),
			url = actualState.url;
			
		//url = url.replace(/[\u4e00-\u9fa5]/g, encodeURIComponent('$0', true));	//对中文进行编码
		
		if(!bt.isLinkClick) {
			bt.setHeaders(url);
			bt.ajax({url: url});
		}
	});
	
})(jQuery, window);