if (!customElements.get('dbtfy-gift-wrap')) {
  customElements.define(
    'dbtfy-gift-wrap',
    class DbtfyGiftWrap extends HTMLElement {
      constructor() {
        super();

        this.enableWidget = true;

        this.data = Fastify.widgets['dbtfy-gift-wrap'];

        this.priceBox = this.querySelector('.price');
        this.checkbox = this.querySelector('.dbtfy-gift-wrap__checkbox');

        this.messageBox = this.querySelector('.dbtfy-gift-wrap__message');
        this.messageInput = this.messageBox.querySelector('.text-area');

        this.setupProductData();

        if (this.enableWidget) {
          this.checkInCart();
        }

        if (this.enableWidget) {
          this.messageInput.addEventListener('input', this.updateMessage.bind(this));
        }

        if (localStorage.getItem('dbtfy_gift_wrap') === 'true') {
          this.checkbox.checked = true;
          this.messageBox.classList.remove('hidden');
          this.querySelector('details').setAttribute('open', true);
          setTimeout(() => {
            localStorage.removeItem('dbtfy_gift_wrap');
          }, 1000);
        }
      }

      async updateMessage() {
        const cartUpdateData = {
          attributes: {
            gift_message: this.messageInput.value,
          },
        };

        // Abort the previous request if it exists
        if (this.abortController) {
          this.abortController.abort();
        }

        // Create a new AbortController instance
        this.abortController = new AbortController();

        try {
          const response = await fetch(`${window.routes.cart_update_url}.js`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartUpdateData),
            signal: this.abortController.signal,
          });
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }

      setupProductData() {
        if (!this.data.dbtfy_gift_wrap_product) {
          this.removeWidget();
          return false;
        }

        this.gift_product = this.data.dbtfy_gift_wrap_product;
      }

      checkInCart() {
        var dbtfy_gift_wrap = this;

        // fetch with fetch method product slug: this.data.dbtfy_gift_wrap_product
        fetch(`/products/${this.gift_product}.js`)
          .then((response) => response.json())
          .then((data) => {
            dbtfy_gift_wrap.gift_product = data.variants[0];

            if (dbtfy_gift_wrap.data.dbtfy_gift_wrap_show_price && dbtfy_gift_wrap.gift_product.price > 0) {
              dbtfy_gift_wrap.priceBox.innerHTML = `(${Fastify.currency.symbol}${
                dbtfy_gift_wrap.gift_product.price / 100
              })`;
            }

            // check Fastify.cart.items loop through and check if this.gift_product.id is in cart
            Fastify.cart.items.forEach((item) => {
              if (item.variant_id == dbtfy_gift_wrap.gift_product.id) {
                dbtfy_gift_wrap.checkbox.checked = true;
                dbtfy_gift_wrap.messageBox.classList.remove('hidden');
                if (Fastify.cart.attributes.gift_message) {
                  dbtfy_gift_wrap.messageInput.value = Fastify.cart.attributes.gift_message;
                }
              }
            });
          })
          .catch((error) => {
            console.log('Error:', error);
            dbtfy_gift_wrap.removeWidget();
          });
      }

      removeWidget() {
        this.enableWidget = false;
        this.remove();
      }

      connectedCallback() {
        this.checkbox.addEventListener('change', this.changeCheckbox.bind(this));
      }

      changeCheckbox() {
        if (this.checkbox.checked) {
          this.submitGiftProduct();
        } else {
          this.removeGiftProduct();
        }
      }

      submitGiftProduct() {
        const variantId = Number(this.gift_product.id);
        Fastify.ajaxAddToCart({ id: variantId, quantity: 1 });
        this.messageBox.classList.remove('hidden');
        localStorage.setItem('dbtfy_gift_wrap', true);
      }

      removeGiftProduct() {
        let shouldBreak = false;
        document.querySelectorAll('cart-remove-button').forEach((removeButton) => {
          if (shouldBreak) return;
          if (removeButton.querySelector('button').dataset.variantId == this.gift_product.id) {
            shouldBreak = true;
            this.messageBox.classList.add('hidden');
            removeButton.click();
          }
        });
      }
    }
  );
}
