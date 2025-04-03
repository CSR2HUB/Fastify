if (!customElements.get('agree-to-terms-page')) {
  customElements.define(
    'agree-to-terms-page',
    class extends HTMLElement {
      connectedCallback() {
        this.agreeCheckbox = this.querySelector('input');

        if (!this.agreeCheckbox) return;

        if (localStorage.getItem('dbtfy-agree-to-terms-page') === 'true') {
          this.agreeCheckbox.checked = true;
        }

        Fastify.checkout['dbtfy-agree-to-terms-page'] = this.agreeCheckbox.checked;

        checkoutButtonHandler();

        this.agreeCheckboxHanlder();
      }

      agreeCheckboxHanlder() {
        // Listen for changes to the checkbox
        this.agreeCheckbox.addEventListener('change', () => {
          const isChecked = this.agreeCheckbox.checked;
          this.updateTermsConditions(isChecked);
          Fastify.checkout['dbtfy-agree-to-terms-page'] = isChecked;
          checkoutButtonHandler();
        });
      }

      async updateTermsConditions(agree) {
        const cartUpdateData = {
          attributes: {
            agree_condition: agree,
          },
        };

        try {
          const response = await fetch(`${window.routes.cart_update_url}.js`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartUpdateData),
          });

          localStorage.setItem('dbtfy-agree-to-terms-page', agree);

          const cart = await response.json();
          publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: cart });
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    }
  );
}
