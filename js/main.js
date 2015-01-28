/**
 * @author Wood
 */
jQuery.noConflict();
(function(bw){	
	bw(function() {
		console.log('in the main');
		bw('.gift_more,.gift_less').click(function(i){
			console.log('here i go');
			bw(this).toggleClass('gift_more').toggleClass('gift_less').siblings('.gift_title,.gift_desc').slideToggle();
     		bw(this).text(bw(this).hasClass('gift_less') ? 'V' : '^');
		});
	});
})(jQuery);