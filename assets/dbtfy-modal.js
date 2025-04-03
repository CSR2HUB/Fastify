/* global define, module */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Fastify.modal = factory();
  }
})(this, function () {
  /* ----------------------------------------------------------- */
  /* == modal */
  /* ----------------------------------------------------------- */

  var isBusy = false;

  function Modal(options) {
    var defaults = {
      onClose: null,
      onOpen: null,
      beforeOpen: null,
      beforeClose: null,
      boxClass: [],
      size: 'medium',
      selector: null,
      overlayClass: [],
      // pending for setup
      closeIcon: 'close',
      closeMethods: ['overlay', 'button', 'escape'],
    };

    // extends config
    this.opts = extend({}, defaults, options);

    // init modal
    this.init();
  }

  Modal.prototype.init = function () {
    if (this.modal) {
      return;
    }

    _build.call(this);
    _bindEvents.call(this);

    // insert modal in dom
    document.body.appendChild(this.modal, document.body.firstChild);

    if (this.opts.selector) {
      this.setContent(document.querySelector(this.opts.selector).innerHTML);
      document.querySelector(this.opts.selector).remove();
    }

    return this;
  };

  Modal.prototype._busy = function (state) {
    isBusy = state;
  };

  Modal.prototype._isBusy = function () {
    return isBusy;
  };

  Modal.prototype.destroy = function () {
    if (this.modal === null) {
      return;
    }

    // restore scrolling
    if (this.isOpen()) {
      this.close(true);
    }

    // unbind all events
    _unbindEvents.call(this);

    // remove modal from dom
    this.modal.parentNode.removeChild(this.modal);

    this.modal = null;
  };

  Modal.prototype.isOpen = function () {
    return !!this.modal.classList.contains('dbtfy-modal--visible');
  };

  Modal.prototype.open = function () {
    if (this._isBusy()) return;
    this._busy(true);

    var self = this;

    // before open callback
    if (typeof self.opts.beforeOpen === 'function') {
      self.opts.beforeOpen();
    }

    if (this.modal.style.removeProperty) {
      this.modal.style.removeProperty('display');
    } else {
      this.modal.style.removeAttribute('display');
    }

    // prevent text selection when opening multiple times
    document.getSelection().removeAllRanges();

    // prevent double scroll
    this._scrollPosition = window.pageYOffset;
    document.body.classList.add('dbtfy-enabled');
    document.body.style.top = -this._scrollPosition + 'px';

    // show modal
    this.modal.classList.add('dbtfy-modal--visible');

    // onOpen callback
    if (typeof self.opts.onOpen === 'function') {
      self.opts.onOpen.call(self);
    }

    self._busy(false);

    // check if modal is bigger than screen height
    this.checkOverflow();

    return this;
  };

  Modal.prototype.close = function (force) {
    if (this._isBusy()) return;
    this._busy(true);
    force = force || false;

    //  before close
    if (typeof this.opts.beforeClose === 'function') {
      var close = this.opts.beforeClose.call(this);
      if (!close) {
        this._busy(false);
        return;
      }
    }

    document.body.classList.remove('dbtfy-enabled');
    document.body.style.top = null;
    window.scrollTo({
      top: this._scrollPosition,
      behavior: 'instant',
    });

    this.modal.classList.remove('dbtfy-modal--visible');

    // using similar setup as onOpen
    var self = this;

    self.modal.style.display = 'none';

    // onClose callback
    if (typeof self.opts.onClose === 'function') {
      self.opts.onClose.call(this);
    }

    // release modal
    self._busy(false);
  };

  Modal.prototype.setContent = function (content) {
    // check type of content : String or Node
    if (typeof content === 'string') {
      this.modalBox.innerHTML = content;
    } else {
      this.modalBox.innerHTML = '';
      this.modalBox.appendChild(content);
    }

    if (this.isOpen()) {
      // check if modal is bigger than screen height
      this.checkOverflow();
    }

    return this;
  };

  Modal.prototype.getContent = function () {
    return this.modalBox;
  };

  Modal.prototype.isOverflow = function () {
    var viewportHeight = window.innerHeight;
    var modalHeight = this.modalBox.clientHeight;

    return modalHeight >= viewportHeight;
  };

  Modal.prototype.checkOverflow = function () {
    // only if the modal is currently shown
    if (this.modal.classList.contains('dbtfy-modal--visible')) {
      if (this.isOverflow()) {
        this.modal.classList.add('dbtfy-modal--overflow');
      } else {
        this.modal.classList.remove('dbtfy-modal--overflow');
      }
    }
  };

  /* ----------------------------------------------------------- */
  /* == private methods */
  /* ----------------------------------------------------------- */

  function closeIcon() {
    return '<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.3 9.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3L5 6.4l3.3 3.3c.2.2.5.3.7.3.2 0 .5-.1.7-.3.4-.4.4-1 0-1.4L6.4 5l3.3-3.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L5 3.6 1.7.3C1.3-.1.7-.1.3.3c-.4.4-.4 1 0 1.4L3.6 5 .3 8.3c-.4.4-.4 1 0 1.4z" fill="#000" fill-rule="nonzero"/></svg>';
  }

  function _build() {
    // wrapper
    this.modal = document.createElement('div');
    this.modal.classList.add('dbtfy-modal');

    // remove cusor if no overlay close method
    if (this.opts.closeMethods.length === 0 || this.opts.closeMethods.indexOf('overlay') === -1) {
      this.modal.classList.add('dbtfy-modal--noOverlayClose');
    }

    this.modal.style.display = 'none';

    // custom overlayClass
    this.opts.overlayClass.forEach(function (item) {
      if (typeof item === 'string') {
        this.modal.classList.add(item);
      }
    }, this);

    // close btn
    if (this.opts.closeMethods.indexOf('button') !== -1) {
      this.modalCloseBtn = document.createElement('button');
      this.modalCloseBtn.type = 'button';
      this.modalCloseBtn.classList.add('dbtfy-modal__close');

      this.modalCloseBtnIcon = document.createElement('span');
      this.modalCloseBtnIcon.classList.add('dbtfy-modal__closeIcon');
      this.modalCloseBtnIcon.innerHTML = closeIcon();

      this.modalCloseBtn.appendChild(this.modalCloseBtnIcon);
    }

    // modal
    this.modalBox = document.createElement('div');
    this.modalBox.classList.add('dbtfy-modal-box');
    this.modalBox.classList.add('global-settings-popup');

    // custom overlayClass
    this.opts.boxClass.forEach(function (item) {
      if (typeof item === 'string') {
        this.modalBox.classList.add(item);
      }
    }, this);

    if (this.opts.size === 'small') {
      this.modalBox.classList.add('dbtfy-modal-box--small');
    } else if (this.opts.size === 'medium') {
      this.modalBox.classList.add('dbtfy-modal-box--medium');
    } else if (this.opts.size === 'large') {
      this.modalBox.classList.add('dbtfy-modal-box--large');
    }

    if (this.opts.closeMethods.indexOf('button') !== -1) {
      this.modal.appendChild(this.modalCloseBtn);
    }

    this.modal.appendChild(this.modalBox);
  }

  function _bindEvents() {
    this._events = {
      clickCloseBtn: this.close.bind(this),
      clickOverlay: _handleClickOutside.bind(this),
      keyboardNav: _handleKeyboardNav.bind(this),
    };

    if (this.opts.closeMethods.indexOf('button') !== -1) {
      this.modalCloseBtn.addEventListener('click', this._events.clickCloseBtn);
    }

    this.modal.addEventListener('mousedown', this._events.clickOverlay);
    document.addEventListener('keydown', this._events.keyboardNav);
  }

  function _handleKeyboardNav(event) {
    // escape key
    if (this.opts.closeMethods.indexOf('escape') !== -1 && event.which === 27 && this.isOpen()) {
      this.close();
    }
  }

  function _handleClickOutside(event) {
    // on macOS, click on scrollbar (hidden mode) will trigger close event so we need to bypass this behavior by detecting scrollbar mode
    var scrollbarWidth = this.modal.offsetWidth - this.modal.clientWidth;
    var clickedOnScrollbar = event.clientX >= this.modal.offsetWidth - 15; // 15px is macOS scrollbar default width
    var isScrollable = this.modal.scrollHeight !== this.modal.offsetHeight;
    if (navigator.platform === 'MacIntel' && scrollbarWidth === 0 && clickedOnScrollbar && isScrollable) {
      return;
    }

    // if click is outside the modal
    if (
      this.opts.closeMethods.indexOf('overlay') !== -1 &&
      !_findAncestor(event.target, 'dbtfy-modal') &&
      event.clientX < this.modal.clientWidth
    ) {
      this.close();
    }
  }

  function _findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  function _unbindEvents() {
    if (this.opts.closeMethods.indexOf('button') !== -1) {
      this.modalCloseBtn.removeEventListener('click', this._events.clickCloseBtn);
    }
    this.modal.removeEventListener('mousedown', this._events.clickOverlay);
    document.removeEventListener('keydown', this._events.keyboardNav);
  }

  /* ----------------------------------------------------------- */
  /* == helpers */
  /* ----------------------------------------------------------- */

  function extend() {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }
    return arguments[0];
  }

  /* ----------------------------------------------------------- */
  /* == return */
  /* ----------------------------------------------------------- */

  return Modal;
});
