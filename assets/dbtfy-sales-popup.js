if (!customElements.get('dbtfy-sales-popup')) {
  customElements.define(
    'dbtfy-sales-popup',
    class DbtfySalesPopup extends HTMLElement {
      constructor() {
        super();
        this.blockId = this.dataset.blockId;
        this.customerNames = this.dataset.customerNames.split(',');
        this.cityNames = this.dataset.cityNames.split(',');
        this.closeIcon = this.dataset.closeIcon;
        this.colorScheme = this.dataset.colorScheme;
        this.customColorScheme = this.dataset.customColorScheme;
        this.templateStyle = this.dataset.templateStyle;
        this.imageShape = this.dataset.productImageShape;
        this.imageRadius = this.dataset.productImageRadius;
        this.position = this.dataset.position;
        this.positionMobile = this.dataset.positionMobile;
        this.displayTime = Number(this.dataset.displayTime) * 1000;
        this.delayTime = Number(this.dataset.delayTime) * 1000;
        this.queue = this.dataset.queue === 'true';
        this.notification = this.dataset.notification === 'true';
        this.popups = this.querySelectorAll('.dbtfy-sales-popup');

        if (!this.queue) {
          this.delayTime = this.displayTime + 500;
        }

        // For test mode
        this.testMode = Shopify.designMode;
        this.selectEvent = null;
        this.deselectEvent = null;
      }

      disconnectedCallback() {
        this.toast?.destroyToast();
        clearInterval(this.popupInterval);

        if (this.testMode) {
          this.selectEvent();
          this.deselectEvent();
        }
      }

      connectedCallback() {
        if (this.testMode) {
          this.selectEvent = subscribe(PUB_SUB_EVENTS.salesPopupSelect, (e) => {
            this.updatePopup();
          });

          this.deselectEvent = subscribe(PUB_SUB_EVENTS.salesPopupDeselect, (e) => {
            this.toast?.hideToast();
          });
        } else {
          if (localStorage.getItem('hide_sales_popup')) return;

          this.popupInterval = setInterval(() => {
            this.updatePopup();
          }, this.delayTime);
        }
      }

      updatePopup() {
        const popup = this.getRandomPopup();

        if (!popup || localStorage.getItem('hide_sales_popup')) return;

        if (this.notification) {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
          audio.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        }

        let position = this.position;
        if (window.innerWidth <= 767) {
          position = this.positionMobile;
        }
        this.toast = new Fastify.toast(popup.outerHTML, {
          position: position,
          duration: this.testMode ? null : this.displayTime,
          closeIcon: this.closeIcon,
          colorScheme: this.colorScheme,
          customColorScheme: this.customColorScheme,
        });

        this.toast.toastContainer.querySelectorAll('.dbtfy-sales-popup__link').forEach((link) => {
          link.onclick = () => {
            localStorage.setItem('hide_sales_popup', true);
          };
        });

        if (this.imageShape != 'circle') {
          this.toast.toastElement.querySelector('img').style.borderRadius = `${this.imageRadius}px`;
          this.toast.toastElement.querySelector('.global-media-settings').style.borderRadius = `${this.imageRadius}px`;
        }

        switch (this.templateStyle) {
          case 'square':
            this.toast.toastElement.style.borderRadius = '0';
            break;
          case 'radius-edge':
            this.toast.toastElement.style.borderRadius = `${Fastify.settings.popup_corner_radius}px`;
            break;
          case 'round':
            this.toast.toastElement.style.borderRadius = `100px`;
            this.toast.toastElement.querySelector('.dbtfy-toast-close').style.marginTop = '30px';
            this.toast.toastElement.querySelector('.dbtfy-toast-close').style.marginRight = '15px';
            break;
          case 'round-square':
            this.toast.toastElement.style.borderTopLeftRadius = `${this.toast.toastElement.offsetHeight / 2}px`;
            this.toast.toastElement.style.borderBottomLeftRadius = `${this.toast.toastElement.offsetHeight / 2}px`;
            break;
        }
      }

      getRandomPopup() {
        const customerName = this.customerNames[Math.floor(Math.random() * this.customerNames.length)];
        const cityName = this.cityNames[Math.floor(Math.random() * this.cityNames.length)];
        const popup = this.popups[Math.floor(Math.random() * this.popups.length)];
        const textElement = popup.querySelector('.dbtfy-sales-popup__customer-info');
        const text = textElement.dataset.text.trim().replace('{CUSTOMER}', customerName).replace('{CITY}', cityName);
        textElement.textContent = text;

        return popup;
      }
    }
  );
}
