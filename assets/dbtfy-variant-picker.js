if (!customElements.get('dbtfy-variant-picker')) {
  customElements.define(
    'dbtfy-variant-picker',
    class DbtfyVariantPicker extends HTMLElement {
      constructor() {
        super();
        this.id = this.dataset.id;
        this.url = this.dataset.url;
        this.pickerWrapper = this.querySelector('.dbtfy-variant-picker__picker');
        this.select = this.querySelector('.dbtfy-variant-picker__selector');
        this.optionUnavailable = this.dataset.optionUnavailable;
        this.picker = undefined;

        this.testMode = Shopify.designMode;
        this.selectEvent = null;
      }

      disconnectedCallback() {
        if (this.testMode) {
          this.selectEvent();
        }
      }

      connectedCallback() {
        if (this.testMode) {
          this.selectEvent = subscribe(PUB_SUB_EVENTS.shopifyEventBlockSelect, (e) => {
            if (e.detail.blockId.includes('product_variant_picker')) {
              this.init();
            }
          });
        }
        this.init();
      }

      init() {
        if (this.select) {
          if (this.pickerWrapper.innerHTML.trim() === '') this.fetchVariantPicker();
          else this.addEventChangePicker();
        }
      }

      async fetchVariantPicker() {
        try {
          let data = await Fastify.fetchProductMarkup(this.url);
          if (data) {
            const responseHTML = new DOMParser().parseFromString(data, 'text/html');
            const pickerElement = responseHTML.querySelector('variant-selects');
            const sectionId = pickerElement.dataset.section;
            pickerElement.innerHTML = pickerElement.innerHTML
              .replaceAll(sectionId, this.id)
              .replaceAll('disabled', '')
              .replaceAll(this.optionUnavailable, '');
            pickerElement.querySelectorAll('fieldset').forEach((fieldset, index) => {
              fieldset.querySelectorAll('input, select').forEach((ele) => {
                ele.setAttribute('name', `${this.id}-${index + 1}`);
              });
            });
            this.pickerWrapper.innerHTML = '';
            this.pickerWrapper.appendChild(pickerElement);
            this.addEventChangePicker();
          } else {
            console.error('HTTP-Error: ' + res.status);
            return null;
          }
        } catch (error) {
          console.error('Error: ' + error);
          return null;
        }
      }

      addEventChangePicker() {
        this.picker = this.pickerWrapper.querySelector('variant-selects');
        this.picker?.querySelectorAll('label').forEach((label) => {
          label.addEventListener('click', (e) => {
            e.preventDefault();
            const input = e.target.closest('label').previousElementSibling;
            if (input.disabled) return;
            input.checked = true;
            this.changePicker();
          });
        });

        this.picker?.querySelectorAll('.select__select').forEach((select) => {
          select.addEventListener('change', (e) => {
            e.preventDefault();
            this.changePicker();
          });
        });
      }

      changePicker() {
        const variantTitle = Array.from(this.picker.querySelectorAll('input:checked, .select__select'))
          .map((option) => option.value)
          .join(' / ');
        this.select.value = this.select.querySelector(`option[data-title="${variantTitle}"]`).value;
        this.select.dispatchEvent(new Event('change'));
      }
    }
  );
}
