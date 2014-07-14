module('YALB (Yet Another Lightbox)', {
	setup : function() {
		var win = $('#content').YALB();

		// bind mouse event
		win.YALB('show');
		});
	},
	teardown : function() {
		// do nothing - preserve element structure
	}
});

test('Generate HTML', function() {
	ok('Lightbox elements created');
});
