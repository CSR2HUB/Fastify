if (!customElements.get('dbtfy-product-quantity-break')) {
  customElements.define(
    'dbtfy-product-quantity-break',
    class DbtfyProductQuantityBreaks extends HTMLElement {
      constructor() {
        super();

        this.data = Fastify.widgets['qty-breaks'];

        if (!this.data) return;

        this.productInfo = this.closest('product-info');

        this.currency = Fastify.currency.symbol;

        this.enable_single_quantity = this.data.enable_single_quantity;

        this.currentVariant = this.dataset.currentVariant;
        this.currentVariantPrice = this.dataset.currentVariantPrice;

        const productElement = this.querySelector('[data-quantity-break-product]');
        if (!productElement) return;

        this.product = JSON.parse(productElement.innerHTML);
        this.collections = JSON.parse(this.querySelector('[data-quantity-break-collection]').innerHTML);

        this.visibleBreaks = [];

        this.getVisibleBreaks();

        if (this.visibleBreaks.length > 0) {
          this.init();
          subscribe(PUB_SUB_EVENTS.variantChange, this.handleVariantChange.bind(this));
          subscribe(PUB_SUB_EVENTS.cartUpdate, this.handleCartUpdate.bind(this));
        } else {
          this.remove();
        }
      }

      handleVariantChange({ data: { variant } }) {
        this.currentVariant = variant.id;
        this.currentVariantPrice = variant.price;
        this.init();
      }

      handleCartUpdate() {
        this.setFirstSingleBreak();
      }

      getVisibleBreaks() {
        const collection_handles = this.collections.map((collection) => collection.handle);
        const productBreaks = this.data.product_break;

        const matchingProductBreaks = productBreaks.filter((settings) => {
          switch (settings.product_break_visibility) {
            case 'collection':
              return collection_handles.includes(settings.product_break_collection);
            case 'type':
              return settings.product_break_types.toLowerCase().includes(this.product.type.toLowerCase());
            case 'tag':
              return this.product.tags.some((tag) =>
                settings.product_break_tags.toLowerCase().includes(tag.toLowerCase())
              );
            case 'product':
              return settings.product_break_product === this.product.handle;
            case 'all':
              return true;
            default:
              return false;
          }
        });

        if (matchingProductBreaks.length === 0) return;

        this.visibleBreaks = matchingProductBreaks
          .flatMap((matchingProductBreak) =>
            matchingProductBreak.breaks.map((break_item) => ({
              product_break_range: break_item.product_break_range,
              product_break_discount_code: break_item.product_break_discount_code,
              product_break_discount_type: break_item.product_break_discount_type,
              product_break_discount_amount: break_item.product_break_discount_amount,
              product_break_tag_1: break_item.product_break_tag_1,
              product_break_tag_1_background_color: break_item.product_break_tag_1_background_color,
              product_break_tag_1_text_color: break_item.product_break_tag_1_text_color,
              product_break_tag_1_border_color: break_item.product_break_tag_1_border_color,
              product_break_free_product: break_item.free_product,
              product_break_free_product_quantity: break_item.product_break_free_product_quantity,
              product_break_free_product_img: break_item.product_break_free_product_image,
              product_break_badge_style: break_item.product_break_badge_style,
              badge_title: break_item.badge_title,
              product_break_block_title: break_item.title,
              product_break_block_subtitle: break_item.subtitle,
            }))
          )

          .sort((a, b) => a.product_break_range - b.product_break_range);
      }

      setupDefaultBreak(qb_body) {
        if (this.enable_single_quantity == false) return '';

        const qb_dom = qb_body.querySelector('dbtfy-product-quantity-single-break-template').cloneNode(true);
        return Fastify.replaceVariables(qb_dom.innerHTML, {
          original_price: this.moneyFormat(this.currentVariantPrice),
          item_heading: Fastify.replaceVariables(this.data.single_quantity_text, { COUNT: 1 }),
          single_break_subtext: this.data.single_quantity_subtext,
        });
      }

      async init() {
        try {
          const data = await Fastify.fetchProductMarkup(
            `/products/${this.product.handle}?view=internal-quantity-break`
          );
          if (data) {
            const dom = new DOMParser().parseFromString(data, 'text/html');
            const qb_body = dom.querySelector('body');

            let qb_html = this.setupDefaultBreak(qb_body);

            this.visibleBreaks.forEach((breaks) => {
              // Till here
              qb_html += this.renderQuantityBreaks(breaks, qb_body, breaks.product_break_range);
            });

            qb_html = new DOMParser().parseFromString(qb_html, 'text/html').body;

            this.innerHTML = qb_html.innerHTML;
            const single_quntity__selectBox = this.querySelector(
              '.dbtfy-product-quantity-single-break .dbtfy-product-quantity-break--quantity.hidden:not(.has-only-variant)'
            );
            if (single_quntity__selectBox) {
              single_quntity__selectBox.classList.remove('hidden');
            }

            const variantChangeGroups = this.querySelectorAll('.dbtfy-product-quantity-break--quantity__group');
            if (variantChangeGroups.length > 0) {
              variantChangeGroups.forEach((group) => {
                const selectElement = group.querySelector('select');
                if (selectElement) {
                  selectElement.addEventListener('change', (e) => {
                    const selectGroup = e.target.closest('.dbtfy-product-quantity-break--quantity');
                    this.calculateTotal(selectGroup);
                  });
                }
              });

              this.productInfo.querySelector('variant-selects')?.classList.add('hidden');
            }

            this.handleInputChange();

            if (variantChangeGroups.length > 0) {
              variantChangeGroups.forEach((group) => {
                this.calculateTotal(group);
              });
            }
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error initializing quantity breaks:', error);
        }
      }

      calculateTotal(selectGroup) {
        const selectElement = selectGroup.querySelector('select');
        if (selectElement) {
          const selectGroup = selectElement.closest('.dbtfy-product-quantity-break--quantity');
          const selects = selectGroup.querySelectorAll('select');
          const quantityGroup = selectElement.closest('.dbtfy-product-quantity-break');

          let totalSelectedPrice = 0;
          let totalDiscountPrice = 0;
          let totalSavedAmount = 0;

          selects.forEach((event) => {
            const type = event.dataset.type;
            const discountAmount = parseFloat(event.dataset.amount);
            const selectedOption = event.selectedOptions[0];
            const selectedPrice = parseFloat(selectedOption.getAttribute('data-price'));
            this.typeDiscount = false;

            if (type != '' && !isNaN(discountAmount)) {
              let discountPrice =
                type === '%' ? (selectedPrice * (100 - discountAmount)) / 100 : selectedPrice - discountAmount * 100;

              let savedAmount = selectedPrice - discountPrice;
              totalDiscountPrice += discountPrice;
              totalSavedAmount += savedAmount;
              this.typeDiscount = true;
            }

            totalSelectedPrice += selectedPrice;
          });
          if (this.typeDiscount) {
            quantityGroup.querySelector('.dbtfy-product-quantity-break__right-price').innerHTML =
              this.moneyFormat(totalDiscountPrice);
            quantityGroup.querySelector('.dbtfy-product-quantity-break__left-text').innerHTML =
              Fastify.replaceVariables(this.data.multiple_quantity_subtext, {
                SAVED_AMOUNT: this.moneyFormat(totalSavedAmount),
              });
            quantityGroup.querySelector('.dbtfy-product-quantity-break__right-original-price').innerHTML =
              this.moneyFormat(totalSelectedPrice);
          } else {
            quantityGroup.querySelector('.dbtfy-product-quantity-break__right-original-price')?.classList.add('hidden');
            quantityGroup.querySelector('.dbtfy-product-quantity-break__left-text')?.classList.add('hidden');
            quantityGroup.querySelector('.dbtfy-product-quantity-break__right-price').innerHTML =
              this.moneyFormat(totalSelectedPrice);
          }
        }
      }

      renderQuantityBreaks(breaks, qb_body, accordion_limit) {
        const qb_dom = qb_body.querySelector('dbtfy-product-quantity-break-template').cloneNode(true);
        const qtyBreak = qb_dom.querySelector('.dbtfy-product-quantity-break--quantity.hidden');
        const total_breaks = breaks.product_break_range;
        if (total_breaks > 1) {
          for (let i = 1; i <= total_breaks - 1; i++) {
            const qtySelect = qtyBreak.querySelector('.dbtfy-product-quantity-break--quantity__group');
            const clonedQtySelect = qtySelect.cloneNode(true);
            qtyBreak.appendChild(clonedQtySelect);
          }
        }
        if (!qtyBreak.classList.contains('has-only-variant')) {
          qtyBreak.classList.remove('hidden');
        }

        let discountPrice =
          breaks.product_break_discount_type == '%'
            ? (this.currentVariantPrice * (100 - breaks.product_break_discount_amount)) / 100
            : this.currentVariantPrice - breaks.product_break_discount_amount * 100;

        let saved_amount = this.currentVariantPrice - discountPrice;

        const dynamicStrings = {
          random_number: Math.floor(Math.random() * 1000000),
          range: breaks.product_break_range,
          free_product_title: breaks.product_break_free_product.title,
          free_product_available: breaks.product_break_free_product.available ? true : false,
          free_product_id: breaks.product_break_free_product.available
            ? breaks.product_break_free_product.variants[0].id
            : '',
          free_product_quantity: breaks.product_break_free_product.available
            ? breaks.product_break_free_product_quantity
            : '',
          free_product_img: breaks.product_break_free_product_img
            ? breaks.product_break_free_product_img
            : breaks.product_break_free_product.images,
          tag_1_border_color: breaks.product_break_tag_1_border_color,
          tag_1_background_color: breaks.product_break_tag_1_background_color,
          product_break_discount_type__variant: breaks.product_break_discount_type,
          product_break_discount_amount__variant: breaks.product_break_discount_amount,
          tag_1_text_color: breaks.product_break_tag_1_text_color,
          tag_1: breaks.product_break_tag_1,
          tag_1_breaks: Fastify.replaceVariables(breaks.product_break_tag_1, {
            DISCOUNT: this.moneyFormat(saved_amount),
          }),
          badge_title: breaks.badge_title,
          product_break_badge_style: breaks.product_break_badge_style,
          item_heading: Fastify.replaceVariables(
            breaks.product_break_block_title ? breaks.product_break_block_title : this.data.multiple_quantity_text,
            {
              COUNT: breaks.product_break_range,
            }
          ),
          single_break_subtext: this.data.multiple_quantity_subtext,
          single_break_subtext_breaks: Fastify.replaceVariables(
            breaks.product_break_block_subtitle
              ? breaks.product_break_block_subtitle
              : this.data.multiple_quantity_subtext,
            {
              SAVED_AMOUNT: this.moneyFormat(saved_amount),
            }
          ),
          original_price: this.moneyFormat(this.currentVariantPrice),
          discounted_price: this.moneyFormat(discountPrice),
          discount_code: breaks.product_break_discount_code,
        };

        if (breaks.product_break_badge_style == 'simple') {
          qb_dom.querySelector('.mostpopular_conditionable')?.remove();
        }

        if (!breaks.product_break_tag_1 || accordion_limit <= 1) {
          qb_dom.querySelector('.tag1_conditionable')?.remove();
        }

        if (dynamicStrings.product_break_badge_style == 'most_popular') {
          dynamicStrings.badge_title = '';
        }

        return Fastify.replaceVariables(qb_dom.innerHTML, dynamicStrings);
      }

      handleInputChange() {
        const productInfo = this.closest('product-info');
        const qtyField = productInfo.querySelector('input[name="quantity"]');

        if (!qtyField) {
          productInfo.querySelector('.product-form__buttons').insertAdjacentHTML(
            'beforebegin',
            `
            <input type="hidden" name="quantity" value="1">
          `
          );
        } else {
          qtyField.addEventListener('change', (e) => {
            const quantity = e.target.value;

            const selectedBreak = this.querySelector(
              '.dbtfy-product-quantity-break .dbtfy-product-quantity-break__radio:checked'
            );

            if (selectedBreak) selectedBreak.checked = false;

            let extraQuantityBreak = this.querySelector(
              '.dbtfy-product-quantity-break:not(:first-child) .dbtfy-product-quantity-break__radio[value="' +
                quantity +
                '"]'
            );
            if (this.enable_single_quantity == false) {
              extraQuantityBreak = this.querySelector(
                '.dbtfy-product-quantity-break .dbtfy-product-quantity-break__radio[value="' + quantity + '"]'
              );
            }

            if (extraQuantityBreak) {
              extraQuantityBreak.checked = true;
            } else {
              this.setFirstSingleBreak(quantity);
            }
          });
        }

        this.querySelectorAll('input').forEach((input) => {
          input.addEventListener('change', () => {
            productInfo.querySelector('[name="quantity"]').value = input.value;
          });
        });
      }

      setFirstSingleBreak(quantity = 1) {
        if (this.enable_single_quantity == false) return '';

        const firstBreak = this.querySelector('.dbtfy-product-quantity-break:first-child');
        if (firstBreak) {
          const firstQuantityBreak = firstBreak.querySelector('.dbtfy-product-quantity-break__radio');
          firstQuantityBreak.checked = true;
          firstQuantityBreak.value = quantity;

          const firstQuantityBreakText = firstBreak.querySelector('.textcontent');
          firstQuantityBreakText.innerHTML = Fastify.replaceVariables(this.data.single_quantity_text, {
            COUNT: quantity,
          });
        }
      }

      moneyFormat(money) {
        return `${this.currency}${(money / 100).toFixed(2)}`;
      }
    }
  );
}
