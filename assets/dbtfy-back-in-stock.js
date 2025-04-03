if (!customElements.get('dbtfy-back-in-stock')) {
  customElements.define(
    'dbtfy-back-in-stock',
    class DbtfyBackInStock extends HTMLElement {
      constructor() {
        super();

        this.is_message_showing = this.querySelector('.newsletter-form__message');

        this.body_message_input = this.querySelector('.body_message');

        this.animator = this.querySelector('element-animator');

        this.data = Fastify.widgets['dbtfy-back-in-stock'];
        this.errorMessage = this.data.already_subscribed_message;

        this.bodyMessage = this.data.dbtfy_back_in_stock_message;

        this.successMessageBox = this.querySelector('.success_message');

        this.submitButton = this.querySelector('button[type="submit"]');
        this.submitButtonIcon = this.querySelector('button[type="submit"] .material-icon');

        this.form_tag = this.querySelector('input[name="contact[tags]"]')?.value;

        this.errorToast = document.querySelector('.dbtfy-back-in-stock-error');

        this.checkHasAnyError();

        this.init();
      }

      connectedCallback() {
        subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
          const upsellPopup = document.querySelector('dbtfy-upsell-popup');
          if (upsellPopup && upsellPopup?.opened == true) {
            return;
          }

          this.classList.add('hidden');

          if (!event.data.variant.available) {
            const product_name = event.data.variant.name;

            const product_message = this.data.dbtfy_back_in_stock_message.replace('{product_title}', product_name);

            this.body_message_input.value = product_message;

            this.classList.remove('hidden');
          }
        });

        if (this.is_message_showing) {
          this.classList.remove('hidden');
        }
      }

      init() {
        if (this.animator) {
          this.animator.dataset.animation = `dbtfy-element-animation-${this.data.dbtfy_back_in_stock_animation_type}`;
          this.animator.dataset.interval = this.data.dbtfy_back_in_stock_animation_interval;
          this.animator.dataset.duration = this.data.dbtfy_back_in_stock_animation_duration;
        }

        const bodyMessage = this.data.dbtfy_back_in_stock_message.replace('{product_title}', this.dataset.productName);
        this.body_message_input.value = bodyMessage;

        if (this.successMessageBox) {
          this.successMessageBox.innerHTML = this.data.dbtfy_back_in_stock_success_message;
        }

        this.submitButton.insertAdjacentHTML('beforeend', this.data.dbtfy_back_in_stock_button_name);
        if (this.submitButtonIcon) {
          this.submitButtonIcon.dataset.icon = this.data.dbtfy_back_in_stock_icon;
        }
      }

      checkHasAnyError() {
        const urlParams = new URLSearchParams(// removed.search);
        const contactTags = urlParams.get('contact[tags]');

        if (contactTags && contactTags === this.form_tag) {
          if (this.errorToast) {
            this.toast = this.errorToast.closest('.dbtfy-toast');
            this.toast?.remove();
          }
          new Fastify.toast(`<div class="page-width dbtfy-back-in-stock-error"><p>${this.errorMessage}</p></div>`, {
            position: 'bottom-center',
            closeIcon: 'close',
            colorScheme: this.colorScheme,
            customColorScheme: this.customColorScheme,
          });
        }
      }
    }
  );
}
