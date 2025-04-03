if (!customElements.get('cart-upsell')) {
  customElements.define(
    'cart-upsell',
    class extends HTMLElement {
      constructor() {
        super();

        this.slider = this.querySelector('.upsell-slider');
        this.slider_template = this.querySelector('#slider_template');

        const _this = this;
        setTimeout(function () {
          _this.data = Fastify.widgets['cart_upsell'];
          _this.cartItems = Fastify.cart.items;
          _this.init();
        }, 1000);
      }

      init() {
        this.getEligibleUpsell();
      }

      getEligibleUpsell() {
        let cartHandles = this.cartItems.map((item) => item.handle);

        let eligibleUpsell = this.data.specific.filter((item) => {
          return cartHandles.includes(item.product_trigger);
        });

        if (!eligibleUpsell.length) {
          this.upsellProduct = this.data.global;
        } else {
          this.upsellProduct = eligibleUpsell;
        }

        if (!this.upsellProduct) return;

        let slider = this.slider_template.innerHTML;
        let slides = '';
        this.upsellProduct.forEach((item) => {
          slides += item.card_html;
        });
        slider = Fastify.replaceVariables(slider, { slides: slides });
        this.slider.innerHTML = slider;
        if (this.querySelectorAll('.card-upsell-slider li').length < 3 && this.dataset.alignment === 'true') {
          this.querySelector('.card-upsell-slider').classList.add('justify-content-center');
        }
      }
    }
  );
}
