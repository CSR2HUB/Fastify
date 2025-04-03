if (!customElements.get('customizable-product')) {
  customElements.define(
    'customizable-product',
    class CustomizableProduct extends HTMLElement {
      constructor() {
        super();
        this.requireOption = this.querySelector('input.required');
        this.checkboxGroup = this.querySelector('.dbtfy-customizable-product__checkbox-group');
        this.checkBoxs = this.querySelectorAll('.dbtfy-customizable-product__checkbox');

        this.renderContent();
      }

      renderContent() {
        this.checkBoxs.forEach((checkbox) => {
          checkbox.addEventListener('change', this.changeCheckboxGroup.bind(this));
        });
        this.addFormId();
        if (!this.requireOption) {
          return;
        }
        this.requireOption.addEventListener('keyup', this.validation.bind(this));
        this.requireOption.addEventListener('change', this.validation.bind(this));
      }

      validation(e) {
        const option = e.target;
        if (option.getAttribute('type') == 'text') {
          if (option.value) {
            option.closest('.field').classList.remove('error');
          } else {
            option.closest('.field').classList.add('error');
          }
        } else {
          if (option.checked) {
            option.closest('.checkbox').classList.remove('error');
          } else {
            option.closest('.checkbox').classList.add('error');
          }
        }
      }

      changeCheckboxGroup() {
        var arr = [];
        this.checkBoxs.forEach((checkbox) => {
          if (checkbox.checked) arr.push(checkbox.value);
        });
        this.checkboxGroup.value = arr.join(',');
      }

      addFormId() {
        const formID = document.querySelector('product-info [data-type="add-to-cart-form"]').getAttribute('id');
        const fields = this.querySelectorAll('input, select');
        fields.forEach((field) => {
          field.setAttribute('form', formID);
        });
      }
    }
  );
}

if (!customElements.get('customizable-product-block')) {
  customElements.define(
    'customizable-product-block',
    class CustomizableProductBlock extends HTMLElement {
      constructor() {
        super();

        const customizable_product = document.querySelector('.customizable_products');
        if (customizable_product) {
          this.innerHTML = customizable_product.innerHTML;
        }

        if (this.dataset.formId) {
          this.updateFormId();
        }
        this.showCustomizable();
      }

      updateFormId() {
        const formID = this.dataset.formId;
        const fields = this.querySelectorAll('input, select');
        fields.forEach((field) => {
          field.setAttribute('form', formID);
        });
      }

      showCustomizable() {
        this.querySelectorAll('customizable-product').forEach((product) => {
          product.classList.remove('hidden');
        });
      }
    }
  );
}
