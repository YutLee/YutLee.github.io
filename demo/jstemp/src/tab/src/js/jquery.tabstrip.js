/*
 * 选项卡
 */
(function($) {
	$.fn.tab = function(options) {
		var o = $.extend({
			idx: 0,
			choseClass: 'chose',
			hideClass: 'ku_thide',
			contents: '.contents'
		}, options || {});
		
		this.each(function() {
			var tab = $(this).children('[data-role=tab]'),
				c = Object.prototype.toString.call(o.contents) === '[object String]' ? $(o.contents) : o.contents,
				content = c.children('[data-role=content]');
			tab.eq(o.idx).addClass(o.choseClass).siblings().removeClass(o.choseClass);
			content.eq(o.idx).removeClass(o.hideClass).siblings().addClass(o.hideClass);
			tab.bind({
				'click': function() {
					var t = $(this), i = t.index();
					t.addClass(o.choseClass).siblings('.' + o.choseClass).removeClass(o.choseClass);
					content.eq(i).removeClass(o.hideClass).siblings().addClass(o.hideClass);
				}
			});
			
		});
	};
})(jQuery);