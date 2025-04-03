class DbtfyToast {
  constructor(content, options = {}) {
    this.content = content;
    this.options = {
      position: options.position || 'bottom-left', // Default to 'bottom-left'
      duration: options.duration || null, // Default to null
      closeIcon: options.closeIcon || null, // Default to null
      colorScheme: options.colorScheme || 'scheme-3', // Default to color scheme 3
      customColorScheme: options.customColorScheme || 'scheme-1', // Default to color scheme 1
      maxWidth: options.maxWidth || '500px', // Default to 500px
      className: options.className || '', // Default to empty string
    };
    this.toastContainer = this.getOrCreateContainer();
    this.toastElement = this.createToastElement();
    this.showToast();
  }

  getOrCreateContainer() {
    let container = document.querySelector(`.dbtfy-toast-${this.options.position}`);

    if (!container) {
      container = document.createElement('div');
      container.className = `dbtfy-toast-container dbtfy-toast-${this.options.position}` + ' ' + this.options.className;
      document.body.appendChild(container);
    }
    return container;
  }

  createToastElement() {
    const toast = document.createElement('div');
    toast.className = `dbtfy-toast global-settings-popup color-${this.options.customColorScheme} dbtfy-color-${this.options.colorScheme} gradient`;
    toast.style.maxWidth = this.options.maxWidth;

    const toastBox = document.createElement('div');
    toastBox.className = 'dbtfy-toast-box';
    toastBox.innerHTML = this.content;
    toast.appendChild(toastBox);

    if (this.options.closeIcon) {
      toastBox.style.paddingRight = `3.6rem`;
      const closeButton = document.createElement('i');
      closeButton.className = 'dbtfy-toast-close material-icon outlined';
      closeButton.style.marginTop = `1.2rem`;
      closeButton.setAttribute('translate', 'no');
      closeButton.setAttribute('area-hidden', 'true');
      closeButton.setAttribute('data-icon', this.options.closeIcon);
      closeButton.onclick = () => this.hideToast();
      toast.appendChild(closeButton);
    }

    return toast;
  }

  showToast() {
    this.toastContainer.appendChild(this.toastElement);
    if (this.options.duration) {
      setTimeout(() => this.hideToast(), this.options.duration);
    }
  }

  hideToast() {
    this.toastElement.classList.add('dbtfy-toast-hide');
    setTimeout(() => {
      if (this.toastElement && this.toastContainer) {
        this.toastContainer.removeChild(this.toastElement);
      }
    }, 500);
  }

  destroyToast() {
    if (this.toastElement && this.toastContainer) {
      this.toastContainer.removeChild(this.toastElement);
    }
  }
}

Fastify.toast = DbtfyToast;
