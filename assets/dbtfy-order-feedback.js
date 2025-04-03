if (!customElements.get('order-feedback')) {
  customElements.define(
    'order-feedback',
    class OrderFeedback extends HTMLElement {
      constructor() {
        super();
        this.data = Fastify.widgets['dbtfy-order-feedback'];
        this.event = this.data ? this.dataGet() : false;

        this.cartFetch();
        this.selectElement = this.querySelector('.order-feedback-select');
        this.inputElement = this.querySelector('.order-feedback-input');
        this.orderFeedback = this.querySelector('.dbtfy-order-feedback-show');
        this.required = this.data.dbtfy_order_feedback_required;

        if (this.required) {
          if (Fastify.cart.attributes[this.data.dbtfy_order_feedback_question] === undefined) {
            Fastify.checkout['dbtfy-order-feedback'] = false;
          } else {
            Fastify.checkout['dbtfy-order-feedback'] = true;
          }
          checkoutButtonHandler();
          this.selectElement.addEventListener('change', () => {
            Fastify.checkout['dbtfy-order-feedback'] = true;
            checkoutButtonHandler();
          });
        }
      }

      dataGet() {
        // Get the select element
        const selectElement = this.querySelector('#order-feedback-select');

        // Define the options as a string
        const dbtfy_order_feedback_option = this.data.dbtfy_order_feedback_option;

        if (dbtfy_order_feedback_option !== '') {
          // Split the string into an array of options
          var order_feedback_options = dbtfy_order_feedback_option.split(',');

          // Loop through the array and create option elements
          order_feedback_options.forEach((optionText) => {
            const option = document.createElement('option'); // Create an option element
            option.value = optionText.toLowerCase(); // Set the option's value to lowercase (or customize it)
            option.textContent = optionText; // Set the display text of the option
            selectElement.appendChild(option); // Add the option to the select element
          });
        }

        if (order_feedback_options && order_feedback_options.length > 0 && this.data.dbtfy_order_feedback_question) {
          return true;
        } else {
          return false;
        }
      }

      connectedCallback() {
        if (this.event) {
          this.selectElement.addEventListener('change', this.toggleInput.bind(this));
        } else {
          this.remove();
        }
      }

      cartFetch() {
        setTimeout(() => {
          if (Fastify.cart.attributes[this.data.dbtfy_order_feedback_question]) {
            this.orderFeedback.textContent = this.capitalizeEachWord(
              Fastify.cart.attributes[this.data.dbtfy_order_feedback_question]
            );
            if (
              this.selectElement.querySelector(
                'option[value="' + Fastify.cart.attributes[this.data.dbtfy_order_feedback_question] + '"]'
              )
            ) {
              this.selectElement.value = Fastify.cart.attributes[this.data.dbtfy_order_feedback_question];
              this.orderFeedback.textContent = this.capitalizeEachWord(
                Fastify.cart.attributes[this.data.dbtfy_order_feedback_question]
              );
            } else {
              this.orderFeedback.textContent = 'Other';
              this.selectElement.value = 'other';
              this.inputElement.value = Fastify.cart.attributes[this.data.dbtfy_order_feedback_question];
              this.inputElement.classList.remove('hidden');
              this.inputElement.focus();
              this.inputElement.addEventListener('input', this.logInputValue.bind(this));
            }
          }
        }, 100);
      }

      capitalizeEachWord(str) {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
      }

      toggleInput() {
        const selectedValue = this.selectElement.value.trim();
        this.orderFeedback.textContent = this.capitalizeEachWord(selectedValue);

        if (selectedValue.toLowerCase() === 'other') {
          this.inputElement.classList.remove('hidden');
          this.inputElement.focus();
          this.inputElement.addEventListener('input', this.logInputValue.bind(this));
        } else {
          this.inputElement.classList.add('hidden');
          this.updateCartFeedback(selectedValue);
        }
      }

      logInputValue() {
        setTimeout(() => {
          const selectedValue = this.inputElement.value;
          this.updateCartFeedback(selectedValue);
        }, 1000);
      }

      async updateCartFeedback(selectedValue) {
        const cartUpdateData = {
          attributes: {
            [this.data.dbtfy_order_feedback_question]: selectedValue,
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
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    }
  );
}
