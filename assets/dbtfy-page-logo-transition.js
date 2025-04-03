if (!customElements.get('page-logo-transition')) {
  customElements.define(
    'page-logo-transition',
    class PageLogoTransition extends HTMLElement {
      constructor() {
        super();
        this.transitionElement = this.querySelector('.page-transition');
        this.blockId = this.dataset.blockId;

        // For test mode
        this.testMode = Shopify.designMode;
        this.selectEvent = null;
        this.deselectEvent = null;
      }

      connectedCallback() {
        if (this.transitionElement) {
          if (this.testMode) {
            this.hide();
            this.deselectEvent = subscribe(PUB_SUB_EVENTS.shopifyEventBlockSelect, (e) => {
              if (e.detail.blockId.includes('page-transition')) {
                this.show();
              }
            });

            this.selectEvent = subscribe(PUB_SUB_EVENTS.shopifyEventBlockDeselect, (e) => {
              if (e.detail.blockId.includes('page-transition')) {
                this.hide();
              }
            });
          } else {
            window.addEventListener('load', this.hide.bind(this));
          }
        }
      }

      disconnectedCallback() {
        if (this.testMode) {
          this.hide();
          this.selectEvent();
          this.deselectEvent();
        }
      }

      show() {
        this.transitionElement.classList.remove('hidden');
        this.transitionElement.classList.add('visible');
      }

      hide() {
        this.transitionElement.classList.add('hidden');
        this.transitionElement.classList.remove('visible');
      }
    }
  );
}
