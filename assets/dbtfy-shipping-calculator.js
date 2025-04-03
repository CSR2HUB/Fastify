(function () {
  if (!customElements.get('dbtfy-shipping-calculator')) {
    customElements.define(
      'dbtfy-shipping-calculator',
      class DbtfyShippingCalculator extends HTMLElement {
        constructor() {
          super();

          this.data = Fastify.widgets['dbtfy-shipping-calculator'];

          this.countryId = this.dataset.countryId;
          this.provinceId = this.dataset.provinceId;
          this.provinceWrapperId = this.dataset.provinceWrapper;

          this.countryWrapper = this.querySelector('#dbtfy-shipping-calculator-country-wrapper');
          this.country = this.countryWrapper.querySelector(`#${this.countryId}`);

          this.provinceWrapper = this.querySelector(`#${this.provinceWrapperId}`);
          this.province = this.provinceWrapper.querySelector(`#${this.provinceId}`);

          this.zip = this.querySelector('#dbtfy-shipping-calculator-zip');

          this.alert = this.querySelector('#dbtfy-shipping-calculator-alert');
          this.btn = this.querySelector('button');

          if (this.data.length === 0) {
            this.remove();
            return;
          }
          this.initCommonJsScript();

          this.btn.addEventListener('click', this.onSubmit.bind(this));
          this.shippingResponse = localStorage.getItem('shippingResponse');
        }

        async initCommonJsScript() {
          const script = document.createElement('script');
          script.src = this.dataset.shopifyCommonJs;
          document.head.appendChild(script);

          await new Promise((resolve) => setTimeout(resolve, 1000));

          new window.Shopify.CountryProvinceSelector(this.countryId, this.provinceId, {
            hideElement: this.provinceWrapperId,
          });

          this.country.options[0].textContent = this.country.getAttribute('aria-label');

          const self = this;
          this.country.addEventListener('change', function (event) {
            let province = localStorage.getItem('shippingProvince') ?? self.dataset.customerProvince;
            if (province.length) {
              self.province.value = province;
            }
          });

          this.insertCustomerData();

          if (this.shippingResponse) {
            this.updateAlertContent(this.shippingResponse, 'alert-success');
          }
        }

        insertCustomerData() {
          const country = localStorage.getItem('shippingCountry') ?? this.dataset.customerCountry;
          const province = localStorage.getItem('shippingProvince') ?? this.dataset.customerProvince;
          const zip = localStorage.getItem('shippingZip') ?? this.dataset.customerZip;

          if (country.length) {
            this.country.value = country;
            this.country.dispatchEvent(new CustomEvent('change'));
            if (province.length) {
              this.province.value = province;
            }
            if (zip.length) {
              this.zip.value = zip;
            }
          } else {
            fetch('https://api-bdc.io/data/reverse-geocode-client?localityLanguage=en')
              .then((response) => response.json())
              .then((data) => {
                this.country.value = data.countryName;
                this.country.dispatchEvent(new CustomEvent('change'));
                this.province.value = data.principalSubdivision;

                localStorage.setItem('shippingCountry', this.country.value);
                localStorage.setItem('shippingProvince', this.province.value);
                localStorage.removeItem('shippingZip');
              });
          }
        }

        updateAlertClasses(newClass) {
          this.alert.classList.remove('alert-danger', 'alert-warning', 'alert-success');
          this.alert.classList.add(newClass);
        }

        updateAlertContent(content, alertClass) {
          const shippingResponse = `
            <ul>
              ${content}
            </ul>
          `;

          if (alertClass.includes('success')) {
            localStorage.setItem('shippingResponse', content);
          } else {
            localStorage.removeItem('shippingResponse');
          }

          this.alert.innerHTML = shippingResponse;
          this.updateAlertClasses(alertClass);
          this.alert.removeAttribute('hidden');
        }

        async onSubmit() {
          localStorage.setItem('shippingCountry', this.country.value);
          localStorage.setItem('shippingProvince', this.province.value);
          localStorage.setItem('shippingZip', this.zip.value);

          this.btn.classList.add('loading');
          this.btn.querySelector('.loading__spinner').classList.remove('hidden');

          const prepareResponse = await fetch(
            `/cart/prepare_shipping_rates.json?shipping_address[zip]=${this.zip.value}&shipping_address[country]=${this.country.value}&shipping_address[province]=${this.province.value}`,
            {
              method: 'POST',
            }
          );

          if (prepareResponse.ok) {
            const asyncResponse = await fetch(
              `/cart/async_shipping_rates.json?shipping_address[zip]=${this.zip.value}&shipping_address[country]=${this.country.value}&shipping_address[province]=${this.province.value}`
            );

            const data = await asyncResponse.json();

            if (data.shipping_rates.length) {
              const listItems = data.shipping_rates
                .map(
                  ({ presentment_name, price, currency }) => `
                <li>
                  <strong>${presentment_name}</strong>: ${price} ${currency}
                </li>
              `
                )
                .join('');

              this.updateAlertContent(listItems, 'alert-success');
            } else {
              this.updateAlertContent(this.data.text_no_results, 'alert-warning');
            }
          } else {
            const data = await prepareResponse.json();
            const listItems = Object.entries(data)
              .map(
                ([key, value]) => `
                <li>
                  ${value.toString()}
                </li>
                `
              )
              .join('');

            this.updateAlertContent(listItems, 'alert-danger');
          }

          this.btn.classList.remove('loading');
          this.btn.querySelector('.loading__spinner').classList.add('hidden');
        }
      }
    );
  }
})();
