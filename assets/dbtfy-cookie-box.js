if (!customElements.get('dbtfy-cookie-box')) {
  customElements.define(
    'dbtfy-cookie-box',
    class DbtfyCookieBox extends HTMLElement {
      constructor() {
        super();
        this.blockId = this.dataset.blockId;
        this.checkCountryEU = this.dataset.checkCountryEu;
        this.country = window.Shopify.country;
        this.closeIcon = this.dataset.closeIcon;
        this.colorScheme = this.dataset.colorScheme;
        this.customColorScheme = this.dataset.customColorScheme;

        this.countryListEU = (function () {
          return [
            'AT', // Austria
            'BE', // Belgium
            'BG', // Bulgaria
            'HR', // Croatia
            'CY', // Cyprus
            'CZ', // Czech Republic
            'DK', // Denmark
            'EE', // Estonia
            'FI', // Finland
            'FR', // France
            'DE', // Germany
            'GR', // Greece
            'HU', // Hungary
            'IE', // Ireland
            'IT', // Italy
            'LV', // Latvia
            'LT', // Lithuania
            'LU', // Luxembourg
            'MT', // Malta
            'NL', // Netherlands
            'PL', // Poland
            'PT', // Portugal
            'RO', // Romania
            'SK', // Slovakia
            'SI', // Slovenia
            'ES', // Spain
            'SE', // Sweden
          ];
        })();

        // For test mode
        this.testMode = Shopify.designMode;
        this.selectEvent = null;
        this.deselectEvent = null;
      }

      disconnectedCallback() {
        if (this.testMode) {
          this.toast?.destroyToast();
          this.selectEvent();
          this.deselectEvent();
        }
      }

      connectedCallback() {
        if (this.testMode) {
          this.selectEvent = subscribe(PUB_SUB_EVENTS.cookieBoxSelect, (e) => {
            this.toast = new Fastify.toast(this.innerHTML, {
              position: 'bottom-center',
              closeIcon: this.closeIcon,
              colorScheme: this.colorScheme,
              customColorScheme: this.customColorScheme,
              maxWidth: '100%',
            });
          });

          this.deselectEvent = subscribe(PUB_SUB_EVENTS.cookieBoxDeselect, (e) => {
            this.toast?.hideToast();
          });
        } else {
          setTimeout(() => {
            if (this.checkCountryEU === 'true') {
              this.checkCountry();
            } else {
              this.storageValue();
            }
          }, 500);
        }
      }

      checkCountry() {
        setTimeout(() => {
          if (this.checkCountryEU === 'true' && this.countryListEU.includes(this.country)) {
            this.storageValue();
          }
        }, 500);
      }

      storageValue() {
        const storageValue = JSON.parse(localStorage.getItem('FastifyCookieBox')) || [];

        // Check if the current country is already saved
        if (!storageValue.includes(this.country)) {
          this.toast = new Fastify.toast(this.innerHTML, {
            position: 'bottom-center',
            closeIcon: this.closeIcon,
            colorScheme: this.colorScheme,
            customColorScheme: this.customColorScheme,
            maxWidth: '100%',
          });
          this.countryCall();
        }
      }

      cookieSave() {
        this.cookieSaveButton = this.toast.toastContainer.querySelector('.dbtfy-cookie-box--button');
        this.cookieSaveButton.onclick = () => {
          this.localStorage();
        };
      }

      localStorage() {
        const currentValues = JSON.parse(localStorage.getItem('FastifyCookieBox')) || [];

        // Add current country if not already present
        if (!currentValues.includes(this.country)) {
          currentValues.push(this.country);
        }

        // Save updated array back to local storage
        localStorage.setItem('FastifyCookieBox', JSON.stringify(currentValues));
        this.toast?.hideToast();
      }

      countryCall() {
        this.cookieSave();
      }
    }
  );
}
