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

      // Default options
      var settings = $.extend({
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

      return this.each(function() {
        var $this = $(this),
             data  = $this.data();

        // Remove vertical margins.
        $('html, body').css({
          marginBottom: 0,
          marginTop:    0
        });

        if ( $.isEmptyObject(data) ) {
          var win = createWindow($this, settings);

          $this.data({
            modal:   win.children('div.modal'),
            mask:    win.children('div.mask'),
            options: settings
          });

          $('body').append(win);
        }
      });
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
      return this.each(function() {
        $(this).removeData();
      });
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
      return this.each(function() {
        var $this = $(this),
            data  = $this.data();

        var attr = { cursor: 'pointer' };

        data.modal
          .fadeTo(data.options.showSpeed, 1, data.options.showEasing,
            function() {
              $(this).css(attr);
            }
          );

        setWindowProps(data.modal);

        data.mask
          .fadeTo(data.options.showSpeed, 0.40, data.options.showEasing,
            function() {
              $(this).css(attr);

              if ( $.isFunction(callback) ) {
                callback($(this));
              }
            }
          );

        setMaskProps(data.mask);
      });
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
      return this.each(function() {
        var $this = $(this),
            data  = $this.data();

        var attr = {
          cursor:  'auto',
          display: 'none',
          zIndex:  0
        };

        data.modal
          .fadeTo(data.options.hideSpeed, 0, data.options.hideEasing,
            function() {
              $(this).css(attr);
            }
          );

        data.mask
          .fadeTo(data.options.hideSpeed, 0, data.options.hideEasing,
            function() {
              $(this).css(attr);

              if ( $.isFunction(callback) ) {
                callback($(this));
              }
            }
          );
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
   * Create lighbox elements.
   *
   * @protected
   *
   * @param Object node jQuery object
   * @param Object options
   *
   * @returns {Object} jQuery object
   */
  function createWindow(node, options) {
    var modal
      = $('<div></div>')
        .addClass('modal')
        .css({
          backgroundColor: 'transparent',
          display: 'none',
          height:  node.outerHeight(),
          width:   node.outerWidth(),
          opacity: 0
        })
        .append(node);

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
  }

  /**
   * Set window properties based on the browser window size.
   *
   * @protected
   *
   * @param {Object} node jQuery object
   */
  function setWindowProps(node) {
    var posX = getBrowserCenterX() - (node.outerWidth()  / 2),
        posY = getBrowserCenterY() - (node.outerHeight() / 2);

    node.css({
      position: 'absolute',
      left:     (posX > 0) ? posX : 0,
      top:      (posY > 0) ? posY : 0,
      zIndex:   150
    });

    // Update on browser resize event.
    window.onresize = function() {
      setWindowProps(node);
    };
  }

  /**
   * Set mask properties based on the browser window size.
   *
   * @protected
   *
   * @param {Object} node jQuery object
   */
  function setMaskProps(node) {
    node.css({
      position: 'absolute',
      top:      0,
      left:     0,
      height:   getDocHeight(),
      zIndex:   100
    });
  }

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
