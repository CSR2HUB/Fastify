if (!customElements.get('dbtfy-cart-notification')) {
  customElements.define(
    'dbtfy-cart-notification',
    class DbtfyCartNotification extends HTMLElement {
      constructor() {
        super();
        this.blockId = this.dataset.blockId;
        this.img = this.querySelector('.dbtfy-cart-notification .dbtfy-cart-notification__img');
        this.blockText = this.querySelector('.dbtfy-cart-notification .dbtfy-cart-notification__block--text .title');
        this.closeIcon = this.dataset.closeIcon;
        this.colorScheme = this.dataset.colorScheme;
        this.customColorScheme = this.dataset.customColorScheme;
        this.showOnDeviceCheck = this.dataset.showOnDevice;

        // For test mode
        this.testMode = Shopify.designMode;
        this.selectEvent = null;
        this.deselectEvent = null;
      }

      disconnectedCallback() {
        if (this.testMode) {
          this.toast?.destroyToast();
          this.selectEvent();
          this.deselectEvent();
        }
      }

      connectedCallback() {
        if (this.testMode) {
          this.selectEvent = subscribe(PUB_SUB_EVENTS.cartNotificationSelect, (e) => {
            this.toast = new Fastify.toast(this.innerHTML, {
              position: 'bottom-center',
              closeIcon: this.closeIcon,
              colorScheme: this.colorScheme,
              customColorScheme: this.customColorScheme,
              maxWidth: '100%',
            });
          });

          this.deselectEvent = subscribe(PUB_SUB_EVENTS.cartNotificationDeselect, (e) => {
            this.toast?.hideToast();
          });
        } else if (this.showOnDevice()) {
          this.unsubscribe = subscribe(PUB_SUB_EVENTS.cartUpdate, (e) => {
            if (e.source === 'product-form') {
              if (this.img) {
                this.img.src = e.cartData.featured_image.url;
              }

              this.blockText.innerHTML = Fastify.replaceVariables(Fastify.widgets['cart-notification'].text, {
                product_title: e.cartData.product_title,
              });

              setTimeout(() => {
                this.toast = new Fastify.toast(this.innerHTML, {
                  position: 'bottom-center',
                  duration: 3000,
                  closeIcon: this.closeIcon,
                  colorScheme: this.colorScheme,
                  customColorScheme: this.customColorScheme,
                  maxWidth: '100%',
                });
              }, 500);
            }
          });
        }
      }
      showOnDevice() {
        const widthLimit = 750;
        return (
          this.showOnDeviceCheck === 'both' ||
          (this.showOnDeviceCheck === 'desktop-only' && window.innerWidth >= widthLimit) ||
          (this.showOnDeviceCheck === 'mobile-only' && window.innerWidth < widthLimit)
        );
      }
    }
  );
}
