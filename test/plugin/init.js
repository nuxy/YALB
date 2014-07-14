module('YALB (Yet Another Lightbox)', {
	setup : function() {
		$('#qunit-fixture').text('Hello World');

		win = $('#qunit-fixture').YALB();
	},
	teardown : function() {
		// do nothing - preserve element structure
	}
});

test('Generate HTML', function() {
	ok(win, 'Lightbox elements created');
});
