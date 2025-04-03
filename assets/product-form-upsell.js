if (!customElements.get('upsell-product-form')) {
  customElements.define(
    'upsell-product-form',
    class UpsellProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));

        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');

        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.submitButtonText = this.submitButton.querySelector('span');

        this.replaceProduct = this.dataset.replaceProduct;
      }

      async onSubmitHandler(evt) {
        evt.preventDefault();

        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        let existingProduct = Fastify.cart.items.find((item) => item.handle == this.replaceProduct);

        if (existingProduct) {
          try {
            const formData = {
              id: existingProduct.key,
              quantity: 0,
            };

            await fetch(`${window.Shopify.routes.root}cart/change.js`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            })
              .then((response) => response.json())
              .then(() => {});
          } catch (error) {
            e.target.disabled = false;
            console.error('Error:', error);
          }
        }

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', // removed.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              // removed = window.routes.cart_url;
              return;
            }

            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              });

            this.error = false;

            this.cart.renderContents(response);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading__spinner').classList.add('hidden');
          });
      }
    }
  );
}
