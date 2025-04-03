if (!customElements.get('dbtfy-cart-discount')) {
  customElements.define(
    'dbtfy-cart-discount',
    class DbtfyCartDiscount extends HTMLElement {
      constructor() {
        super();

        this.data = Fastify.widgets['dbtfy-cart-discount'];
        this.querySelector('.delivery-label-icon i').setAttribute(
          'data-icon',
          this.data.dbtfy_cart_discount_label_icon
        );

        this.discountSummaryLabel = this.querySelector('.dbtfy-cart-discount-show');
        this.discountStatus = this.querySelector('.discount-status');
        this.discountCode = '';
        this.button = this.querySelector('.dbtfy-cart-discount__button');
        this.modalHeader = this.querySelector('.dbtfy-discount-modal--header');
        this.relaceText = this.dataset.relaceText;
        this.fetch = false;
        this.setup();
      }

      setup() {
        if (typeof Fastify.modal !== 'undefined') {
          this.loadModel();
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            this.loadModel();
          });
        }
        this.init();
        this.fetchCart('');
      }

      init() {
        if (this.button) {
          this.button.onclick = () => {
            const inputValue = this.querySelector('input').value;
            if (inputValue !== '') {
              this.discountCode = inputValue;
              this.checkExistingDiscountAndApply(inputValue);
              this.fetch = true;
            }
          };
        }
      }

      loadModel() {
        this.modalHeader.textContent = this.relaceText;
        this.modal = new Fastify.modal({
          closeMethods: [],
          size: 'medium',
          closeIcon: '',
          selector: 'dbtfy-discount-modal',
          boxClass: ['dbtfy-discount-box'],
          overlayClass: [],
          onOpen: function () {
            console.log('modal open');
          },
          onClose: function () {
            console.log('modal closed');
          },
        });
      }

      drawerUpdate() {
        if (this.dataset.type === 'cartPage') {
          localStorage.setItem('dbtfy-cart-discount', this.discountCode);
          // removed.reload();
        } else if (this.dataset.type === 'cartDrawer') {
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
      }

      applyDiscount(discountCode) {
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
            localStorage.setItem('dbtfy-cart-discount', discountCode);
            this.drawerUpdate();
          });
      }

      checkExistingDiscountAndApply(discountCode) {
        const existingDiscount = document.querySelector('.discounts__discount');

        if (existingDiscount && existingDiscount.textContent.trim() === '') {
          // No existing discount applied, apply the new discount
          this.applyDiscount(discountCode);
        } else {
          // Check for cart-level discount and ask user to replace
          this.fetchCart(discountCode);
        }
      }

      fetchCart(discountCode) {
        fetch(`${window.routes.cart_url}.js`)
          .then((response) => response.json())
          .then((cart) => {
            let discountApplied = false;
            this.cartItemsDiscount = cart.items;

            this.cartItemsDiscount.forEach((item) => {
              let discountCode = '';
              if (item.discounts.length > 0) {
                discountApplied = true;
                discountCode = item.discounts[0].title;
                document.querySelectorAll('.dbtfy-cart-discount__container input[type="text"]').forEach((input) => {
                  input.value = discountCode;
                });
                this.discountSummaryLabel.textContent = discountCode;
              }
            });

            if (discountApplied) {
              if (this.fetch) {
                console.log(this);

                this.modal.modal.querySelectorAll('.dbtfy-discount-modal-check-yes-no button').forEach((button) => {
                  button.onclick = () => {
                    if (button.value === 'yes') {
                      this.modal.close();
                      console.log('yes', this);

                      this.applyDiscount(discountCode);
                    } else {
                      this.modal.close();
                    }
                  };
                });
                this.modal.open();
              }
            } else if (this.fetch) {
              this.applyDiscount(discountCode);
            }

            if (localStorage.getItem('dbtfy-cart-discount')) {
              this.discountStatus.classList.remove('hidden');
              if (localStorage.getItem('dbtfy-cart-discount') == this.discountSummaryLabel.textContent) {
                this.discountStatus.textContent = ' Applied';
              } else {
                this.discountStatus.textContent = ' Invalid';
              }
              localStorage.removeItem('dbtfy-cart-discount');
            }
          })
          .catch((error) => {
            console.error('Error fetching cart:', error);
          });
      }
    }
  );
}
