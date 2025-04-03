if (!customElements.get('dbtfy-cart-delivery-time')) {
  customElements.define(
    'dbtfy-cart-delivery-time',
    class DbtfyCartDeliveryTime extends HTMLElement {
      constructor() {
        super();
        this.data = Fastify.widgets['dbtfy-delivery-time'];

        if (this.data && this.data.dbtfy_delivery_time_heading) {
          this.init();
        } else {
          this.remove();
        }
      }

      init() {
        if (this.data.dbtfy_delivery_time_required_checkout) {
          Fastify.checkout['dbtfy-delivery-date'] = false;
          checkoutButtonHandler();
        }
        const { Calendar } = window.VanillaCalendarPro;

        this.deliveryTimeInput = this.querySelector('.dbtfy-cart-delivery-time');

        this.calendar = new Calendar(this.deliveryTimeInput, this.getTimeOptions());
        this.calendar.init();

        this.timeShow = this.querySelector('.dbtfy-cart-delivery-time-show');

        this.populateTime();
      }

      // Populate the hour dropdown with values from 01 to 12
      populateTime() {
        const fastifyTime = Fastify.cart?.attributes?.delivery_time || '';

        // Set selected time from cart or default to 12:00 PM
        if (fastifyTime) {
          this.timeShow.textContent = fastifyTime;
          if (this.data.dbtfy_delivery_time_required_checkout) {
            Fastify.checkout['dbtfy-delivery-date'] = true;
            checkoutButtonHandler();
          }
        }
      }

      getTimeOptions() {
        const selectedTime = Fastify.cart?.attributes?.delivery_time || '';
        const dbtfyDeliveryTime = this;

        if (this.data.dbtfy_delivery_time_min) {
          this.data.dbtfy_delivery_time_min = Math.abs(this.data.dbtfy_delivery_time_min);
        } else {
          this.data.dbtfy_delivery_time_min = 0;
        }
        if (this.data.dbtfy_delivery_time_max) {
          this.data.dbtfy_delivery_time_max = Math.abs(this.data.dbtfy_delivery_time_max);
        } else {
          this.data.dbtfy_delivery_time_max = 23;
        }

        return {
          layouts: {
            default: `<#ControlTime />`,
          },
          selectedTheme: 'light',
          timeMinHour: this.data.dbtfy_delivery_time_min,
          timeMaxHour: this.data.dbtfy_delivery_time_max,
          selectionTimeMode: 12,
          selectedTime: selectedTime,
          onChangeTime(self) {
            dbtfyDeliveryTime.updateCartDeliveryTime(self.context.selectedTime);
          },
        };
      }

      // Update the cart delivery time with the selected time
      async updateCartDeliveryTime(deliveryTime) {
        const cartUpdateData = { attributes: { delivery_time: deliveryTime } };

        // Abort the previous request if it exists
        if (this.abortController) {
          this.abortController.abort();
        }

        this.abortController = new AbortController();

        try {
          const response = await fetch(`${window.routes.cart_update_url}.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartUpdateData),
            signal: this.abortController.signal,
          });
          const cart = await response.json();
          publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: cart });
          this.timeShow.textContent = deliveryTime;
          if (this.data.dbtfy_delivery_time_required_checkout) {
            Fastify.checkout['dbtfy-delivery-date'] = true;
            checkoutButtonHandler();
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Error updating cart:', error);
          }
        }
      }
    }
  );
}
