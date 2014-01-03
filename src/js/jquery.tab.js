/*
 * 选项卡
 */
(function($) {
	$.fn.tab = function(options) {
		var o = $.extend({
			num: 0,
			chose: 'choose',
			contents: ".contents"
		}, options || {});
		var HIDE = "ku_thide";
		this.each(function() {
			var tab = $(this).children("[data-role=tab]"),
				c = Object.prototype.toString.call(o.contents) === '[object String]' ? $(o.contents) : o.contents,
				content = c.children("[data-role=content]");
			tab.eq(o.num).addClass(o.chose).siblings().removeClass(o.chose);
			content.eq(o.num).removeClass(HIDE).siblings().addClass(HIDE);
			tab.bind({
				"click": function() {
					var t = $(this), i = t.index();
					t.addClass(o.chose).siblings("." + o.chose).removeClass(o.chose);
					content.eq(i).removeClass(HIDE).siblings().addClass(HIDE);
				}
			});
			
		});
	};
})(jQuery);