$(document).ready(function(){
	(function() {
		var pgc = $('.page_goods_gListHeaderCate'),
			title = pgc.children('h1').children('a'),
			list = pgc.children('dl'),
			fc = list.children('dt').children('a'),
			sc = list.find('h4').children('a'),
			currFc, currSc;

		function showNext(el) {
			title.text(el.text()).attr('href', el.attr('href'));
			curr = el.parent().next();
			el.parent().hide().siblings().hide();
			curr.show();
			$('html, body').animate({scrollTop: 0}, 200);
			return curr;
		}

		fc.bind('click', function(e) {
			currFc = showNext($(this));
			return false;
		});

		sc.bind('click', function(e) {
			currSc = showNext($(this));
			return false;
		});
	})();
});