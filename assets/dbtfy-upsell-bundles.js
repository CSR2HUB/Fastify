if (!customElements.get('dbtfy-upsell-bundles')) {
  customElements.define(
    'dbtfy-upsell-bundles',
    class DbtfyUpsellBundles extends HTMLElement {
      constructor() {
        super();
      }

      disconnectedCallback() {}

      connectedCallback() {
        this.loadBundle();
      }

      loadBundle() {
        this.setupVars();
        if (!this.specificBundle) this.loadRecommendations();
        else {
          if (this.upsellItem) {
            this.setUpSpecificBundle();
            this.init();
          } else {
            this.remove();
          }
        }
      }

      setupVars() {
        ({
          productId: this.productId,
          productHandler: this.productHandler,
          sectionId: this.sectionId,
          url: this.url,
          specificBundle: this.specificBundle,
          discountAmount: this.discountAmount,
          discountName: this.discountName,
          discountType: this.discountType,
          currency: this.currency,
          formId: this.formId,
          mobileMode: this.mobileMode,
        } = this.dataset);

        const matchingBlocks = Fastify.widgets['upsell_bundles'].blocks.filter(
          (block) => block.product_trigger === this.productHandler
        );
        this.upsellItem = matchingBlocks.length > 0 ? matchingBlocks[matchingBlocks.length - 1] : null;

        this.url = `${this.url}&product_id=${this.productId}&section_id=${this.sectionId}`;

        if (this.upsellItem) {
          this.specificBundle = true;
          this.discountName = this.upsellItem.discount_code;
          this.discountAmount = this.upsellItem.discount_amount;
          this.discountType = this.upsellItem.discount_type;
          if (this.discountType == '$') {
            this.discountAmount = this.discountAmount * 100;
          }
          this.querySelector('product-form').setAttribute('data-discount-code', this.upsellItem.discount_code);
        } else {
          this.specificBundle = this.specificBundle == 'false';
        }

        this.discount = {
          name: this.discountName,
          amount: Number(this.discountAmount) || 0,
          type: this.discountType,
        };
        this.items = this.querySelectorAll('.dbtfy-upsell-bundles__item');
        this.currency = this.currency;
        this.submitButton = this.querySelector('.product-form__submit');
        this.formInput = this.querySelector('.product-variant-id');
        this.selects = this.querySelectorAll('[name="id[]"]');
        this.wrapper = document.getElementById('dbtfy-upsell-bundles-wrapper');
      }

      async setUpSpecificBundle() {
        const otherItems = this.querySelectorAll(
          '.dbtfy-upsell-bundle__list .dbtfy-upsell-bundles__item:nth-child(n+2)'
        );
        otherItems?.forEach((element) => {
          element.remove();
        });

        if (this.upsellItem.product_offer_1) {
          await this.loadSpecificItem(this.upsellItem.product_offer_1);
        }
        if (this.upsellItem.product_offer_2) {
          await this.loadSpecificItem(this.upsellItem.product_offer_2);
        }

        if (this.upsellItem.product_offer_3) {
          await this.loadSpecificItem(this.upsellItem.product_offer_3);
        }

        this.setupVars();
        this.init();
      }

      async loadSpecificItem(product_handle) {
        let html = await Fastify.fetchProductMarkup(`/products/${product_handle}?view=internal-upsell-item`);

        let doc = new DOMParser().parseFromString(html, 'text/html');
        let item = doc.querySelector('.dbtfy-upsell-bundles__item');

        const firstDiv = doc.querySelector('.dbtfy-upsell-bundles__item');

        if (firstDiv && this.mobileMode == 'true') {
          // remove grid classes for mobile view
          firstDiv.classList.remove('grid--6-col-desktop', 'grid--6-col-tablet');
        }

        if (item) {
          item.querySelectorAll('select').forEach((select) => {
            select.setAttribute('form', this.formId);
          });
          item.querySelectorAll('input[type="radio"]').forEach((input) => {
            input.setAttribute('form', this.formId);
          });
          this.querySelector('.dbtfy-upsell-bundle__list').appendChild(item);
        }
      }

      loadRecommendations() {
        fetch(this.url)
          .then((response) => response.text())
          .then((text) => {
            const html = document.createElement('div');
            html.innerHTML = text;
            const recommendations = html.querySelector('dbtfy-upsell-bundles');

            if (recommendations && recommendations.querySelectorAll('.dbtfy-upsell-bundles__item').length > 1) {
              if (recommendations?.innerHTML.trim().length) {
                this.innerHTML = recommendations.innerHTML;
                this.items = this.querySelectorAll('.dbtfy-upsell-bundles__item');
                this.submitButton = this.querySelector('.product-form__submit');
                this.formInput = this.querySelector('.product-variant-id');
                this.selects = this.querySelectorAll('[name="id[]"]');
                this.init();
                this.removeAttribute('hidden');
              }
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }

      init() {
        this.removeAttribute('hidden');
        this.formInput.setAttribute('name', 'id[]');
        this.formInput.disabled = true;
        this.selects.forEach((select) => {
          select.addEventListener('change', this.updateItems.bind(this));
          select.addEventListener('change', this.setTotalPrice.bind(this));
        });
        this.updateItems();
        this.setTotalPrice();
        this.addEventToCheckbox();
        this.setAttribute('data-insert-product', true);
      }

      setTotalPrice() {
        let totalPrice = 0,
          discountPrice = 0,
          savePrice = 0,
          discount_amount = this.discount.amount;

        if (
          this.querySelectorAll('.dbtfy-upsell-bundles__item .dbtfy-upsell-product-item__checkbox:checked').length == 1
        ) {
          discount_amount = 0;
        }

        this.items.forEach((item) => {
          if (!item.querySelector('[name="id[]"]').disabled) {
            const variant = this.getCurrentVariant(item)[0];
            totalPrice += variant.price;
          }
        });

        if (this.discount.type == '%') discountPrice = totalPrice * ((100 - discount_amount) / 100);
        else discountPrice = totalPrice - discount_amount;

        savePrice = totalPrice - discountPrice;

        if (discountPrice < 0) {
          savePrice = totalPrice;
          discountPrice = 0;
        }

        this.querySelector('.dbtfy-upsell-bundles__discount-price').textContent =
          totalPrice > 0 ? this.moneyFormat(discountPrice) : '';
        this.querySelector('.dbtfy-upsell-bundles__original-price').textContent =
          totalPrice > discountPrice ? this.moneyFormat(totalPrice) : '';
        this.querySelector('.dbtfy-upsell-bundles__save-price').innerHTML =
          savePrice > 0 ? `<span class="badge dbtfy-sale-badge">SAVE ${this.moneyFormat(savePrice)}</span>` : '';

        this.submitButton.disabled = totalPrice == 0;
      }

      updateItems() {
        this.items.forEach((item, index) => {
          const product = this.getProduct(item);
          const variant = this.getCurrentVariant(item)[0];
          const header = item.querySelector('.bundle__title .product-title');

          const price = variant.price;
          const compare_at_price = variant.compare_at_price || 0;
          let label = `${product.title} | `;
          if (index > 0) label = `<label for="dbtfy-upsell-product-item--${product.id}">${product.title}</label> | `;

          header.innerHTML = `${label}${
            variant.title && variant.title != 'Default Title' ? variant.title + ' | ' : ''
          }${this.moneyFormat(price)}${
            compare_at_price > price ? ' <del>' + this.moneyFormat(compare_at_price) + '</del>' : ''
          }`;
        });
      }

      getProduct(item) {
        return JSON.parse(item.querySelector('[data-product]').innerHTML);
      }

      getCurrentVariant(item) {
        const product = this.getProduct(item);
        const variantId = item.querySelector('[name="id[]"]').value;
        return product.variants.filter((variant) => {
          return variant.id == variantId;
        });
      }

      moneyFormat(money) {
        return `${this.currency}${(money / 100).toFixed(2)}`;
      }

      addEventToCheckbox() {
        this.items.forEach((item) => {
          item.querySelector('.dbtfy-upsell-product-item__checkbox').addEventListener('change', (e) => {
            const input = e.target.closest('.dbtfy-upsell-bundles__item').querySelector('[name="id[]"]');
            input.disabled = !e.target.checked;
            this.querySelector(`.dbtfy-upsell-bundle__media[data-product-id="${e.target.value}"]`).classList.toggle(
              'disabled'
            );
            this.setTotalPrice();
          });
        });

        this.items.forEach((item) => {
          item.querySelector('.custom_checkbox')?.addEventListener('click', (e) => {
            e.preventDefault();
            const checkBox = e.target
              .closest('.dbtfy-upsell-bundles__item')
              .querySelector('.dbtfy-upsell-product-item__checkbox');
            checkBox.checked = !checkBox.checked;
            checkBox.dispatchEvent(new Event('change', { bubbles: true }));
          });
        });
      }
    }
  );
}
