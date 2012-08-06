/*
 *  YALB (Yet Another Lightbox)
 *  A lightweight, dead simple, and extremely flexible lightbox generator
 *
 *  Copyright 2011-2012, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

(function($) {
	var methods = {
		init : function(options) {

			// default options
			var settings = $.extend({
				maskColor  : '#000000',
				viewEasing : 'linear',
				hideEasing : 'linear',
				hideSpeed  : 250,
				viewSpeed  : 500
			}, options);

			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				// remove vertical margins
				$('html, body').css({
					marginBottom : 0,
					marginTop    : 0
				});

				if ( $.isEmptyObject(data) ) {
					var main = createWindow($this, settings);

					$this.data({
						lightbox : main.children('.yalb_lightbox'),
						mask     : main.children('.yalb_mask'),
						options  : settings
					});
				}
			});

			// force window height in IE
			if ($.browser.msie) {
				$('body').height('100%');
			}
		},

		destroy : function() {
			return this.each(function() {
				$(this).removeData();
			});
		},

		view : function() {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				data.lightbox
					.fadeTo( (data.options.viewSpeed + 500), 1, data.options.viewEasing,
						function() {
							$(this).css('cursor','pointer');
						}
					);

				setWindowProps(data.lightbox);

				data.mask
					.fadeTo(data.options.viewSpeed, 0.40, data.options.viewEasing,
						function() {
							$(this).css('cursor','pointer');
						}
					);

				setMaskProps(data.mask);

				// bind mouse event to hide window
				data.mask.click(function() {
					$this.YALB('hide');
				});
			});
		},

		hide : function() {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data();

				data.lightbox
					.fadeTo(data.options.hideSpeed, 0, data.options.hideEasing,
						function() {
							$(this).css({
								cursor  : 'auto',
								display : 'none',
								zIndex  : 0
							});
						}
					);

				data.mask
					.fadeTo(data.options.hideSpeed, 0, data.options.hideEasing,
						function() {
							$(this).css({
								cursor  : 'auto',
								display : 'none',
								zIndex  : 0
							});
						}
				);
			});
		}
	};

	$.fn.YALB = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1) );
		}
		else
		if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.YALB');
		}
	};

	/*
	 * Create lighbox elements
	 */
	function createWindow(node, options) {
		var modal
			= $('<div></div>')
				.addClass('yalb_lightbox')
				.css({
					backgroundColor : 'transparent',
					display         : 'none',
					height          : node.outerHeight(),
					width           : node.outerWidth(),
					opacity         : 0
				})
				.append(node);

		var mask
			= $('<div></div>')
				.addClass('yalb_mask')
				.css({
					backgroundColor : options.maskColor,
					display         : 'none',
					height          : '100%',
					width           : '100%',
					opacity         : 0
				});

		var main = $('<div></div>')
			.append(modal, mask);

		$('body').append(main);

		return main;
	}

	/*
	 * Set window properties based on the browser window size
	 */
	function setWindowProps(node) {
		var posX = getBrowserCenterX() - (node.outerWidth()  / 2);
		var posY = getBrowserCenterY() - (node.outerHeight() / 2);

		node.css({
			position : 'absolute',
			left     : (posX > 0) ? posX : 0,
			top      : (posY > 0) ? posY : 0,
			zIndex   : 150
		});

		// update on browser resize event
		window.onresize = function() { setWindowProps(node) };
	}

	/*
	 * Set mask properties based on the browser window size
	 */
	function setMaskProps(node) {
		node.css({
			position : 'absolute',
			top      : 0,
			left     : 0,
			height   : getDocHeight(),
			zIndex   : 100
		});
	}

	/*
	 * Return the web browser inner center X position
	 */
	function getBrowserCenterX() {
		return $(window).outerWidth() / 2;
	}

	/*
	 * Return the web browser inner center Y position
	 */
	function getBrowserCenterY() {
		return $(window).outerHeight() / 2;
	}

	/*
	 * Return the scrollable window document height
	 */
	function getDocHeight() {
		return Math.max(
			Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
			Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
			Math.max(document.body.clientHeight, document.documentElement.clientHeight)
		);
	}
})(jQuery);
