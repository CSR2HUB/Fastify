if (!customElements.get('dbtfy-order-tracking-form')) {
  customElements.define(
    'dbtfy-order-tracking-form',
    class DbtfyOrderTrackingForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector('form');
        this.trackingNumber = this.querySelector('#order-tracking-number');
        this.button = this.querySelector('button');
      }

      connectedCallback() {
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      }

      onSubmitHandler(e) {
        e.preventDefault();
        this.button.setAttribute('disabled', 'disabled');
        const trackingNumber = this.trackingNumber.value;
        const labelText = this.trackingNumber.nextElementSibling.textContent.trim();
        const _this = this;

        if (trackingNumber == '') {
          alert(labelText);
          _this.button.removeAttribute('disabled');
          return;
        }

        try {
          _this.initOrderTracking(trackingNumber);
        } finally {
          setTimeout(function () {
            _this.button.removeAttribute('disabled');
          }, 1500);
        }
      }

      initOrderTracking(trackingNumber) {
        YQV5.trackSingle({
          // Required, Specify the container ID of the carrier content.
          YQ_ContainerId: 'ot-container',
          // Optional, specify tracking result height, max height 800px, default is 560px.
          YQ_Height: 560,
          // Optional, select carrier, default to auto identify.
          YQ_Fc: '0',
          // Optional, specify UI language, default language is automatically detected based on the browser settings.
          YQ_Lang: 'en',
          // Required, specify the number needed to be tracked.
          YQ_Num: trackingNumber,
        });
      }
    }
  );
}
