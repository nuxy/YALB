/**
 *  YALB (Yet Another Lightbox)
 *  A lightweight, dead simple, and extremely flexible lightbox generator.
 *
 *  Copyright 2011-2015, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

if (!window.jQuery || (window.jQuery && parseInt(window.jQuery.fn.jquery.replace('.', '')) < parseInt('1.8.3'.replace('.', '')))) {
  throw new Error('YALB requires jQuery 1.8.3 or greater.');
}

(function($) {

  /**
   * @namespace YALB
   */
  var methods = {

    /**
     * Create new instance of YALB
     *
     * @memberof YALB
     * @method init
     *
     * @example
     * $('#container').YALB(options);
     *
     * @param {Object} options
     *
     * @returns {Object} jQuery object
     */
    "init": function(options) {
      var $this = $(this),
          data  = $this.data();

      // Default options
      var defaults = $.extend({
        maskColor:  '#000000',
        showEasing: 'linear',
        hideEasing: 'linear',
        hideSpeed:  250,
        showSpeed:  500
      }, options);

      // Force window height in IE
      if ($.browser.msie) {
        $('body').height('100%');
      }

      // Remove vertical margins.
      $('html, body').css({
        marginBottom: 0,
        marginTop:    0
      });

      if ( $.isEmptyObject(data) ) {
        var win = $this.YALB('_createWindow', defaults);

        $this.data({
          modal:   win.children('.modal'),
          mask:    win.children('.mask'),
          options: defaults
        });

        $('body').append(win);
      }

      return $this;
    },

    /**
     * Perform cleanup
     *
     * @memberof YALB
     * @method destroy
     *
     * @example
     * $('#container').YALB('destroy');
     */
    "destroy": function() {
      $(this).removeData();
    },

    /**
     * Show modal content with items masked in the background.
     *
     * @memberof YALB
     * @method show
     *
     * @example
     * $('#container').YALB('show', callback);
     *
     * @param {Function} callback
     */
    "show": function(callback) {
      var $this = $(this),
          data  = $this.data();

      var style = { cursor: 'pointer' };

      data.modal
        .fadeTo(data.options.showSpeed, 1, data.options.showEasing,
          function() {
            $(this).css(style);
          }
        );

      $this.YALB('_setWindowProps');

      data.mask
        .fadeTo(data.options.showSpeed, 0.40, data.options.showEasing,
          function() {
            $(this).css(style);

            if ( $.isFunction(callback) ) {
              callback($(this));
            }
          }
        );

      $this.YALB('_setMaskProps');
    },

    /**
     * Hide modal content and background mask.
     *
     * @memberof YALB
     * @method hide
     *
     * @example
     * $('#container').YALB('hide', callback);
     *
     * @param {Function} callback
     */
    "hide": function(callback) {
      var $this = $(this),
          data  = $this.data();

      var style = {
        cursor:  'auto',
        display: 'none',
        zIndex:  0
      };

      data.modal
        .fadeTo(data.options.hideSpeed, 0, data.options.hideEasing,
          function() {
            $(this).css(style);
          }
        );

      data.mask
        .fadeTo(data.options.hideSpeed, 0, data.options.hideEasing,
          function() {
            $(this).css(style);

            if ( $.isFunction(callback) ) {
              callback($(this));
            }
          }
        );
    },

    /**
     * Create lighbox elements.
     *
     * @memberof YALB
     * @method _createWindow
     * @private
     *
     * @param {Object} options
     *
     * @returns {Object} jQuery object
     */
    "_createWindow": function(options) {
      var $this = $(this);

      var modal
        = $('<div></div>')
          .addClass('modal')
          .css({
            backgroundColor: 'transparent',
            display: 'none',
            height:  $this.outerHeight(),
            width:   $this.outerWidth(),
            opacity: 0
          })
          .append($this);

      var mask
        = $('<div></div>')
          .addClass('mask')
          .css({
            backgroundColor: options.maskColor,
            display: 'none',
            height:  '100%',
            width:   '100%',
            opacity: 0
          });

      return $('<div></div>')
        .addClass('yalb')
        .append(modal, mask);
    },

    /**
     * Set window properties based on the browser window size.
     *
     * @memberof YALB
     * @method _createWindow
     * @private
     */
    "_setWindowProps": function() {
      var $this = $(this),
          data  = $this.data();

      // Get window position offset center.
      var posX = getBrowserCenterX() - (data.modal.outerWidth()  / 2),
          posY = getBrowserCenterY() - (data.modal.outerHeight() / 2);

      data.modal.css({
        position: 'absolute',
        left:     (posX > 0) ? posX : 0,
        top:      (posY > 0) ? posY : 0,
        zIndex:   150
      });

      // Update on browser resize event.
      window.onresize = function() {
        $this.YALB('_setWindowProps');
      };
    },

    /**
     * Set mask properties based on the browser window size.
     *
     * @memberof YALB
     * @method _createWindow
     * @private
     *
     * @param {Object} node jQuery object
     */
    "_setMaskProps": function() {
      var $this = $(this),
          data  = $this.data();

      data.mask.css({
        position: 'absolute',
        top:      0,
        left:     0,
        height:   getDocHeight(),
        zIndex:   100
      });
    }
  };

  $.fn.YALB = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    else {
      $.error('Method ' +  method + ' does not exist in jQuery.YALB');
    }
  };

  /**
   * Return the web browser inner center X position.
   *
   * @protected
   *
   * @returns {Number}
   */
  function getBrowserCenterX() {
    return $(window).outerWidth() / 2;
  }

  /**
   * Return the web browser inner center Y position.
   *
   * @protected
   *
   * @returns {Number}
   */
  function getBrowserCenterY() {
    return $(window).outerHeight() / 2;
  }

  /**
   * Return the scrollable window document height.
   *
   * @protected
   *
   * @returns {Number}
   */
  function getDocHeight() {
    return Math.max(
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
      Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
  }
})(jQuery);
