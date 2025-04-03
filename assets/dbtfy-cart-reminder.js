if (!customElements.get('dbtfy-cart-reminder')) {
  customElements.define(
    'dbtfy-cart-reminder',
    class DbtfyCartReminder extends HTMLElement {
      constructor() {
        super();
        this.blockId = this.dataset.blockId;
        this.closeIcon = this.dataset.closeIcon;
        this.colorScheme = this.dataset.colorScheme;
        this.CustomColorScheme = this.dataset.customColorScheme;
        this.img = this.querySelector('dbtfy-cart-reminder .dbtfy-cart-reminder__img');
        this.titleSelector = this.querySelector('dbtfy-cart-reminder .dbtfy-cart-reminder__text');
        this.displayTime = this.dataset.displayTime * 1000;
        this.intervalTime = this.dataset.intervalTime * 1000;
        this.position = this.dataset.position;
        this.interval = parseInt(this.intervalTime) + parseInt(this.displayTime);
        this.showOnDeviceCheck = this.dataset.showOnDevice;
        this.toast = null;
        this.counter = 0;

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
        if (!this.testMode && this.showOnDevice()) {
          this.reminderInterval = setInterval(() => {
            if (Fastify.cart.items.length > 0) {
              this.updateReminder(
                Fastify.cart.items[this.counter]?.image,
                Fastify.cart.items[this.counter]?.product_title
              );
              this.toast = new Fastify.toast(this.innerHTML, {
                position: this.position,
                duration: this.displayTime,
                closeIcon: this.closeIcon,
                colorScheme: this.colorScheme,
                customColorScheme: this.CustomColorScheme,
              });
              this.counter++;
              if (this.counter >= Fastify.cart.items.length) {
                this.counter = 0;
              }
            }
          }, this.interval);
        }
        if (this.testMode) {
          this.selectEvent = subscribe(PUB_SUB_EVENTS.cartReminderSelect, (e) => {
            this.toast = new Fastify.toast(this.innerHTML, {
              position: this.position,
              closeIcon: this.closeIcon,
              colorScheme: this.colorScheme,
              customColorScheme: this.CustomColorScheme,
            });
          });

          this.deselectEvent = subscribe(PUB_SUB_EVENTS.cartReminderDeselect, (e) => {
            this.toast?.hideToast();
          });
        }
      }

      updateReminder(image, title) {
        if (this.titleSelector) {
          this.titleSelector.innerHTML = Fastify.replaceVariables(Fastify.widgets['cart-reminder'].text, {
            product_title: title,
          });
        }

        if (this.img) {
          this.img.src = image; // Set the image source
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
