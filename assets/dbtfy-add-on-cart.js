if (!customElements.get('dbtfy-add-on-cart')) {
  customElements.define(
    'dbtfy-add-on-cart',
    class DbtfyAddOnCart extends HTMLElement {
      constructor() {
        super();

        this.data = Fastify.widgets['dbtfy-add-on-cart'];
        this.switchInput = this.querySelector('.switch input');
        this.setupProductData();
        this.showProductInCart = this.data.show_product_in_cart;
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.cartUpdateUnsubscriber = null;
      }

      setupProductData() {
        if (!this.data.product) {
          this.remove();
          return false;
        }
      }

      removeEventListeners() {
        this.cartUpdateUnsubscriber();
      }

      connectedCallback() {
        this.switchInput.addEventListener('change', this.changeCheckbox.bind(this));

        this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
          if (
            Fastify.widgets['dbtfy-add-on-cart'].show_product_in_cart == false &&
            event.source === 'cart-items' &&
            this.switchInput.checked &&
            Fastify.cart.items.length == 1 &&
            Fastify.cart.items[0].id == this.dataset.id
          ) {
            this.switchInput.checked = false;
            const changeEvent = new Event('change');
            this.switchInput.dispatchEvent(changeEvent);
          }

          this.cartUpdateUnsubscriber && this.removeEventListeners();
        });
      }

      changeCheckbox() {
        if (this.switchInput.checked) {
          this.submitAddOnCartProduct();
        } else {
          this.removeAddOnCartProduct();
        }
      }

      removeAddOnCartProduct() {
        const variantId = this.dataset.id;

        const body = JSON.stringify({
          id: variantId,
          quantity: 0,
          sections: document
            .querySelector('cart-drawer-items')
            .getSectionsToRender()
            .map((section) => section.section),
          sections_url: // removed.pathname,
        });

        fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
          .then((response) => {
            return response.text();
          })
          .then((state) => {
            const response = JSON.parse(state);

            if (!response.item_count) {
              this.cart.classList.add('is-empty');
            }
            publish(PUB_SUB_EVENTS.cartUpdate, {
              source: 'add-on-cart',
              cartData: response,
              variantId: variantId,
            });

            publish(PUB_SUB_EVENTS.cartUpdate, {
              source: 'cart-items',
              cartData: response,
              variantId: variantId,
            });

            this.cart.renderContents(response, Fastify.settings.cart_type_action);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      submitAddOnCartProduct() {
        const variantId = Number(this.dataset.id);
        Fastify.ajaxAddToCart({
          id: variantId,
          quantity: 1,
          'properties[_addOnCart]': true,
          'properties[_showProduct]': this.showProductInCart,
        });
      }
    }
  );
}
