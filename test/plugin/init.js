module('YALB (Yet Another Lightbox)', {
  setup : function() {
    win = $('#qunit-fixture').YALB();
  },
  teardown : function() {
    // Do nothing - preserve element structure
  }
});

done(function() {
  $('div.yalb').remove();
});

test('Generate HTML', function() {
  ok(win, 'Lightbox elements created');
});
