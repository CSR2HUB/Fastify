if (!customElements.get('dbtfy-size-chart')) {
  customElements.define(
    'dbtfy-size-chart',
    class DbtfySizeChart extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        this.designMode = Shopify.designMode;
        const popupSize = this.getAttribute('data-popup-size');
        document.addEventListener('DOMContentLoaded', () => {
          this.modal = new Fastify.modal({
            closeMethods: ['overlay', 'button', 'escape'],
            size: popupSize, // Use dynamic size
            closeIcon: '',
            selector: '.dbtfy-size-chart',
            boxClass: [],
            overlayClass: [],
            onOpen: function () {
              console.log('Modal opened');
            },
            onClose: function () {
              console.log('Modal closed');
            },
          });
          const openButton = this.querySelector('#open-size-chart');
          if (openButton) {
            openButton.onclick = () => {
              this.modal.open();
            };
          }
        });
      }
    }
  );
}
