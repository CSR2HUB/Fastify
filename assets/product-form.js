if (!customElements.get('product-form')) {
  class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.variantIdInput.disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');
      this.submitButtonText = this.submitButton.querySelector('span');

      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

      this.hideErrors = this.dataset.hideErrors === 'true';
    }

    onSubmitHandler(evt) {
      evt.preventDefault();

      let product_form = this.closest('product-info');

      if (!product_form) {
        product_form = document.querySelector('product-info');
      }

      const customizableOptions = product_form?.querySelectorAll('.dbtfy-customizable-product__input.required');

      var validateForm = true;
      let scrolled = false;
      customizableOptions?.forEach((option) => {
        if (option.getAttribute('type') == 'checkbox' && !option.checked) {
          option.closest('.checkbox').classList.add('error');
          validateForm = false;
        }
        if (option.getAttribute('type') == 'text' && !option.value) {
          option.closest('.field').classList.add('error');
          validateForm = false;
        }
        if (!validateForm && !scrolled) {
          option.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          scrolled = true;
        }
      });

      if (!validateForm) {
        return;
      }

      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading__spinner')?.classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);

      if (evt.submitter.id.endsWith('sticky-add-to-cart') && customizableOptions) {
        customizableOptions.forEach((option) => {
          formData.append(option.getAttribute('name'), option.value);
        });
      }

      if (this.cart) {
        formData.append(
          'sections',
          this.cart.getSectionsToRender().map((section) => section.id)
        );
        formData.append('sections_url', // removed.pathname);
        this.cart.setActiveElement(document.activeElement);
      }

      let freeProduct = false;
      let hasQuantityBreak = false;
      let productVariantID = formData.get('id');

      let discountCode = false;

      if (product_form?.querySelector('dbtfy-product-quantity-break')) {
        const selectedBreak = product_form?.querySelector('.dbtfy-product-quantity-break__radio:checked');
        const selectedBreakWrapper = selectedBreak?.closest(
          '.dbtfy-product-quantity-break:not(.dbtfy-product-quantity-single-break)'
        );

        if (selectedBreakWrapper) {
          selectedBreak
            .closest('.dbtfy-product-quantity-break')
            .querySelectorAll('select')
            .forEach((select, index) => {
              formData.set(`items[${index}][id]`, `${select.selectedOptions[0].id}`);
              formData.set(`items[${index}][quantity]`, 1);
            });

          discountCode = selectedBreak?.dataset.discountCode || false;

          const freeProductWrapper = selectedBreakWrapper?.querySelector('.product-quantity-break__gift');
          freeProduct = freeProductWrapper?.dataset.freeProductId;

          if (freeProduct) {
            const freeProductIndex = selectedBreak.value;

            formData.set(`items[${freeProductIndex}][id]`, freeProduct);
            formData.set(`items[${freeProductIndex}][quantity]`, freeProductWrapper.dataset.freeProductQuantity);
          }
          formData.delete('quantity');
          formData.delete('id');

          hasQuantityBreak = true;
        }
      }

      if (this.dataset.discountCode) {
        discountCode = this.dataset.discountCode;
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
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButtonText.classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (Fastify.settings.cart_type == 'page') {
            if (Fastify.settings.cart_type_action && Fastify.settings.dbtfy_upsell_popup == false && !discountCode) {
              // removed = window.routes.cart_url;
            }
          }

          if (discountCode) {
            this.executeDiscount(discountCode);
          }

          let updatedResponse = response;
          if (hasQuantityBreak) {
            updatedResponse = response.items[0] ? { ...response.items[0] } : {};
            updatedResponse.sections = response.sections;
          }

          if (!this.error)
            publish(PUB_SUB_EVENTS.cartUpdate, {
              source: 'product-form',
              productVariantId: productVariantID,
              cartData: updatedResponse,
            });
          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener(
              'modalClosed',
              () => {
                setTimeout(() => {
                  this.cart.renderContents(updatedResponse, Fastify.settings.cart_type_action);
                });
              },
              { once: true }
            );
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(updatedResponse, Fastify.settings.cart_type_action);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading__spinner')?.classList.add('hidden');
        });
    }

    executeDiscount(discountCode) {
      fetch(`/discount/${discountCode}`, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.error('Failed to apply discount: ' + response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error applying discount:', error);
        })
        .finally(() => {
          if (Fastify.settings.cart_type === 'page') {
            // removed.reload();
          } else if (Fastify.settings.cart_type === 'drawer') {
            fetch(`${routes.cart_url}?section_id=cart-drawer`)
              .then((response) => response.text())
              .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');
                const thisDrawer = html.querySelector('#shopify-section-cart-drawer #CartDrawer');
                document.querySelector('#shopify-section-cart-drawer #CartDrawer').replaceWith(thisDrawer);
              })
              .catch((e) => {
                console.error(e);
              });
          }
        });
    }

    handleErrorMessage(errorMessage = false) {
      if (this.hideErrors) return;

      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }

    toggleSubmitButton(disable = true, text) {
      if (disable) {
        this.submitButton.setAttribute('disabled', 'disabled');
        if (text) this.submitButtonText.textContent = text;
      } else {
        this.submitButton.removeAttribute('disabled');
        this.submitButtonText.textContent = window.variantStrings.addToCart;
      }
    }

    get variantIdInput() {
      return this.form.querySelector('[name=id]') || this.form.querySelector('[name="id[]"]');
    }
  }

  customElements.define('product-form', ProductForm);

  if (!customElements.get('sticky-product-form') && customElements.get('product-form')) {
    class StickyProductForm extends ProductForm {
      constructor() {
        super();
      }
    }
    customElements.define('sticky-product-form', StickyProductForm);
  }
}
