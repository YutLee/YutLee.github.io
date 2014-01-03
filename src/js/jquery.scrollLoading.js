// Copyright 2009 

/**
 * @fileoverview 滚动加载
 * @author yutlee.cn@gmail.com
 */
(function($, undefined) {
	$.fn.scrollLoading = function(options) {
		var o = $.extend({
			range: 200,
			maxNum: 20,
			callback: $.noop
		}, options || {});
		
		var that = $(this),
			olderScrollTop = 0,
			isWindow = $.trim(that.selector) === '' && that.length !== 0;
		    $wrapp = isWindow ? $(window) : that;
		
		function loading() {
			var	wrapperHeight = $wrapp.height(),
				wrapperTop = isWindow ? $wrapp.scrollTop() : $wrapp.offset().top;
			
			that.each(function() {
				var t = $(this),
					isScrollBottom,
					num = t.data('next') || 1,
					totalHeight = $wrapp.height() + wrapperTop,
					post = isWindow ? $(document).height() - o.range : $wrapp.children().last().offset().top + $wrapp.children().last().outerHeight(true) - o.range;
				
				t.data('next', num);
				t.data('max-num', o.maxNum);
				if(olderScrollTop === 0) {
					isScrollBottom = (post < totalHeight);
				}else {
					isScrollBottom = (post < totalHeight && wrapperTop > olderScrollTop);
				}
				olderScrollTop = wrapperTop;
				if(isScrollBottom) {
					if($.isFunction(o.callback) && num < o.maxNum) {
						o.callback.call(this, num);
					}
				}
			});
		}
		
		loading();
		$wrapp.bind('scroll.loadmore', function() {
			setTimeout(loading, 100);
		});
		return this;
	};
})(jQuery);