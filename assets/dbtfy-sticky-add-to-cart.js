if (!customElements.get('dbtfy-addtocart-sticky')) {
  customElements.define(
    'dbtfy-addtocart-sticky',
    class DbtfyCartSticky extends HTMLElement {
      constructor() {
        super();

        this.testMode = Shopify.designMode;
        this.selectEvent = null;
        this.deselectEvent = null;

        this.toast = null;
        this.variantSelector = this.querySelector('select[name="id"]');
        this.mainVariantInput = document.querySelector('.product .product-form input[name="id"]');
        this.triggerType = this.dataset.triggerType;
        this.scrollDepth = parseInt(this.dataset.scrollDepth);
        this.hasOnlyDefaultVariant = this.dataset.hasOnlyDefaultVariant === 'true';
        this.position = this.dataset.position;
        this.colorScheme = this.dataset.colorScheme;
        this.showon = this.dataset.showon;
        this.CustomColorScheme = this.dataset.customColorScheme;
        this.addtocartSimplified = this.dataset.addtocartSimplified;
        this.variantSelector?.addEventListener('change', (event) => {
          this.onVariantChange(event);
        });

        this.mainVariantInput?.addEventListener('change', (event) => {
          this.onMainProductFormVariantChange(event);
        });

        this.backToTop = document.querySelector('back-to-top');
      }

      connectedCallback() {
        if (this.testMode) {
          this.selectEvent = subscribe(PUB_SUB_EVENTS.stickyAddToCartSelect, (e) => {
            this.show();
          });

          this.deselectEvent = subscribe(PUB_SUB_EVENTS.stickyAddToCartDeselect, (e) => {
            this.toast?.hideToast();
          });
        } else {
          this.init();
        }
      }

      disconnectedCallback() {
        if (this.testMode) {
          this.toast?.destroyToast();
          this.selectEvent();
          this.deselectEvent();
        }
      }

      show() {
        let toastClass = `dbtfy-addtocart-sticky show-on--${this.showon}`;
        if (this.position === 'top') {
          toastClass += ' dbtfy-addtocart-sticky-top';
        }

        if (window.innerWidth < 750) {
          if (this.addtocartSimplified === 'true') {
            toastClass += ' dbtfy-addtocart-simplified';
            this.backToTop && this.backToTop.style.setProperty('--dbtfy-btt-bottom-margin', '10rem');
          } else {
            this.backToTop && this.backToTop.style.setProperty('--dbtfy-btt-bottom-margin', '15rem');
          }
        }

        const toastOptions = {
          position: `${this.position}-center`,
          maxWidth: '100%',
          className: toastClass,
          colorScheme: this.colorScheme,
          customColorScheme: this.CustomColorScheme,
        };

        this.toast = new Fastify.toast(this.innerHTML, toastOptions);
      }

      init() {
        const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
        const scrollDepthTrigger = (this.scrollDepth / 100) * totalScrollHeight;

        window.addEventListener('scroll', () => {
          const topThreshold = document.querySelector('.product product-form').getBoundingClientRect().bottom;
          const scrollPosition = window.scrollY;

          if (
            (this.triggerType === 'scroll' && 0 > topThreshold) ||
            (this.triggerType === 'scroll_depth' && scrollPosition >= scrollDepthTrigger)
          ) {
            if (!this.toast) {
              this.show();
            }
          } else {
            this.toast?.destroyToast();
            this.toast = null;
          }
        });
      }

      onVariantChange(event) {
        event.preventDefault();
        const imgSrc = this.variantSelector.options[this.variantSelector.selectedIndex].dataset.variantImg;

        if (imgSrc) {
          const img = this.querySelector('.dbtfy-addtocart-sticky-img');
          if (img) img.src = imgSrc;
        }
      }

      onMainProductFormVariantChange() {
        this.variantSelector.value = this.mainVariantInput.value;
        this.variantSelector.dispatchEvent(new Event('change'));
      }
    }
  );
}
