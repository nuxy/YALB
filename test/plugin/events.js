test('Show Window', function() {
  stop();

  ok(true, "Test method 'show'");

  win.YALB('show', function() {
    ok($('div.modal').is(':visible'), 'Lightbox is visible');

    start();
  });
});

test('Hide Window', function() {
  stop();

  ok(true, "Test method 'hide'");

  win.YALB('hide', function() {
    ok($('div.modal').is(':hidden'), 'Lightbox is hidden');

    start();
  });
});
