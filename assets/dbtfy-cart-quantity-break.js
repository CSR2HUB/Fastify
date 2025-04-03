if (!customElements.get('dbtfy-cart-quantity-break')) {
  customElements.define(
    'dbtfy-cart-quantity-break',
    class CarttQuantityBreak extends HTMLElement {
      constructor() {
        super();

        this.cartUpdateUnsubscriber = undefined;

        this.itemCount = Number(this.dataset.itemCount);
        this.breaks = this.querySelectorAll('.dbtfy-cart-quantity-break');
        this.highestDiscount = this.querySelector('.dbtfy-cart-quantity-break__highest-discount');

        this.data = Fastify.widgets['qty-breaks'];
      }

      connectedCallback() {
        if (this.breaks.length > 0) {
          this.renderBreak(this.itemCount);
          this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, this.getCount.bind(this));
        }
      }

      disconnectedCallback() {
        if (this.cartUpdateUnsubscriber) {
          this.cartUpdateUnsubscriber();
        }
      }

      getCount(cart) {
        if (!cart) {
          return;
        }
        const html = cart.cartData.sections['cart-icon-bubble'];
        const itemCount = new DOMParser()
          .parseFromString(html, 'text/html')
          .querySelector('.cart-count-bubble')
          .querySelector('span').textContent;
        this.renderBreak(Number(itemCount));
      }

      renderBreak(count) {
        var message = '';
        if (count > 0) {
          this.breaks.forEach((cartBreak) => {
            const text = this.data.text;
            const range = Number(cartBreak.dataset.range);
            const discount = cartBreak.dataset.discount.trim();

            if (range > count && !message) {
              const addToCount = range - count;
              message = text.replace('{count}', addToCount).replace('{discount}', discount);
            }
          });

          if (!message) message = this.data.highest_discount_text;
        }

        setTimeout(() => {
          const contents = document.querySelectorAll('.dbtfy-cart-break');
          contents.forEach((content) => {
            content.querySelector('span').innerHTML = message;
          });
        }, ON_CHANGE_DEBOUNCE_TIMER);
      }
    }
  );
}
