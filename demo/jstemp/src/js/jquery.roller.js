(function($) {
	$.fn.roller = function(options) {
		var o = $.extend({
			speed: 300,
			delay: 3000,
			item: 5,
			isAuto: true
		}, options || {});
		return this.each(function() {
			var $t = $(this),
				prev = $t.find('.prev'),
				next = $t.find('.next'),
				$wrapper = $t.find('.wrapper'),
				$roller = $wrapper.children(),
				$item = $roller.children(),
				len = $item.length,
				iWidth = $item.outerWidth(true),
				wWidth = iWidth * o.item,
				rWidth = iWidth * len,
				sWidth = iWidth * (len % o.item),
				minLeft = -(rWidth - wWidth);
			var isRolling = false,
				DISABLED = 'disabled',
				play;
				
			$wrapper.width(wWidth);
			$roller.width(rWidth);
			
			if(rWidth <= wWidth) {
				prev.addClass(DISABLED);
				next.addClass(DISABLED);
			}
			
			function roll(ra) {
				if(!isRolling) {
					var mLeft = parseInt($roller.css('margin-left'), 10);
					if(ra === 'prev') {
						var aniWidth = (-mLeft >= wWidth) ? wWidth : sWidth;
						if(mLeft < 0) {
							isRolling = true;
							if(next.hasClass(DISABLED)) {
								next.removeClass(DISABLED);
							}
							$roller.animate({'margin-left': mLeft + aniWidth}, o.speed, function() {
								if(parseInt($roller.css('margin-left'), 10) <= 0) {
									prev.addClass(DISABLED);
								}
								isRolling = false;
							});
						}
					}else if(ra === 'next') {
						var aniWidth = (mLeft - minLeft >= wWidth) ? wWidth : sWidth;
						if(mLeft > minLeft) {
							isRolling = true;
							if(prev.hasClass(DISABLED)) {
								prev.removeClass(DISABLED);
							}
							$roller.animate({'margin-left': mLeft - aniWidth}, o.speed, function() {
								if(parseInt($roller.css('margin-left'), 10) <= minLeft) {
									next.addClass(DISABLED);
								}
								isRolling = false;
							});
						}
					}
				}
			}
			
			prev.bind({
				'click': function() {
					roll('prev');
					return false;
				}
			});
			next.bind({
				'click': function() {
					roll('next');
					return false;
				}
			});
			
			function autoRoll() {
				if(!isRolling) {
					var mLeft = parseInt($roller.css('margin-left'), 10);
					if(mLeft === minLeft) {
						prev.click();
					}else {
						next.click();
					}
				}
			}
			if(o.isAuto) {
				play = setInterval(autoRoll, o.delay);
				
				$t.bind({
					'mouseenter': function() {
						clearInterval(play);
					},
					'mouseleave': function() {
						play = setInterval(autoRoll, o.delay);
					}
				});
			}
		});
	};
})(jQuery);