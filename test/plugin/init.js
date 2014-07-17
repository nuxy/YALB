module('YALB (Yet Another Lightbox)', {
	setup : function() {
		win = $('#qunit-fixture').YALB();
	},
	teardown : function() {
		// do nothing - preserve element structure
	}
});

done(function() {
	$('div.yalb').remove();
});

test('Generate HTML', function() {
	ok(win, 'Lightbox elements created');
});
