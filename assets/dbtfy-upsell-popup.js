if (!customElements.get('dbtfy-upsell-popup')) {
  customElements.define(
    'dbtfy-upsell-popup',
    class DbtfyUpsellPopup extends HTMLElement {
      constructor() {
        super();
        this.opener = this.querySelector('modal-opener');
        this.blockSettings = [];
        this.querySelectorAll('[data-upsell-popup-block-settings]').forEach((script) => {
          this.blockSettings.push(JSON.parse(script.innerHTML));
        });

        this.opened = false;

        this.productInfo = document.querySelector('product-info');

        this.productTrigger = false;
      }

      cartUpdateUnsubscriber = undefined;

      connectedCallback() {
        const _this = this;
        document.addEventListener('DOMContentLoaded', () => {
          this.modal = new Fastify.modal({
            closeMethods: ['overlay', 'button', 'escape'],
            size: this.dataset.modalWidth,
            closeIcon: '',
            selector: '.dbtfy-upsell-popup___quick-view-wrapper',
            boxClass: ['dbtfy-upsell-popup__modal-wrapper'],
            overlayClass: [],
            onOpen: function () {
              _this.opened = true;
            },
            onClose: function () {
              _this.opened = false;
              if (Fastify.settings.cart_type === 'drawer') {
                Fastify.showCartDrawer();
              } else if (Fastify.settings.cart_type === 'page') {
                document.location.href = window.routes.cart_url;
              }
            },
          });
        });

        this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, this.cartUpdate.bind(this));
      }

      cartUpdate(e) {
        if (e.source === 'product-form') {
          const cartData = e.cartData;
          let productTriggers = this.blockSettings.filter((setting) => setting.productTrigger === cartData.handle);
          if (!productTriggers.length)
            productTriggers = this.blockSettings.filter(
              (setting) => setting.productHandles.indexOf(cartData.handle) !== -1
            );
          if (!productTriggers.length)
            productTriggers = this.blockSettings.filter(
              (setting) => setting.productHandles.length === 0 && setting.productTrigger === ''
            );
          if (!productTriggers.length) {
            if (Fastify.settings.cart_type == 'page') {
              // removed = window.routes.cart_url;
            } else if (this.opened) {
              this.modal.close();
              Fastify.showCartDrawer();
            }
            return;
          }

          if (cartData.handle == productTriggers[0].productOffer) {
            if (this.opened) {
              this.modal.close();
              if (Fastify.settings.cart_type != 'page') {
                Fastify.showCartDrawer();
              } else {
                document.location.href = window.routes.cart_url;
              }
            }
            return;
          }

          Fastify.hideCartDrawer();
          this.productTrigger = productTriggers[0];
          this.initModal(this.productTrigger);
        }
      }

      initModal(settings) {
        fetch('/products/' + settings.productOffer + '?view=internal-upsell-popup')
          .then((response) => response.text())
          .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            let dbtfy_upsell_quick_view = doc.querySelector('.dbtfy-upsell-quick-view');
            if (!dbtfy_upsell_quick_view) return;

            let btn_text = settings.buttonLabel;

            let btn_icon = this.querySelector('.dbtfy-upsell-quick-view-button-icon').innerHTML;
            dbtfy_upsell_quick_view.querySelector('.product-form__submit').innerHTML = btn_icon;

            let span = document.createElement('span');
            span.textContent = btn_text;
            dbtfy_upsell_quick_view.querySelector('.product-form__submit').appendChild(span);

            let upsell_title = this.dataset.upsellTitle.replaceAll('{product_title}', settings.productTitle);

            dbtfy_upsell_quick_view = Fastify.replaceVariables(dbtfy_upsell_quick_view.innerHTML, {
              product_title: upsell_title,
              close_label: this.dataset.declineText,
              checkout_label: this.dataset.checkoutText,
              special_offer_label: settings.offerText,
              description_label: parser.parseFromString(settings.description, 'text/html').body.textContent,
              section_id: this.productInfo?.dataset.section,
            });

            this.modal.modalBox.querySelector('.dbtfy-upsell-popup___quick-view').innerHTML = dbtfy_upsell_quick_view;

            setTimeout(() => {
              this.modal.open();
              this.modal.modalBox.querySelector('.dbtfy-upsell-quick-view-close').onclick = () => {
                this.modal.close();
              };
            }, 500);
          });
      }
    }
  );
}

if (!customElements.get('dbtfy-upsell-popup-variant')) {
  customElements.define(
    'dbtfy-upsell-popup-variant',
    class DbtfyUpsellPopupVariant extends HTMLElement {
      constructor() {
        super();

        this.popup = document.querySelector('dbtfy-upsell-popup');

        this.addEventListener('variant-selects:loaded', ({ target }) => {
          this.preventDuplicatedIDs(target);
        });

        this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
          if (this.querySelector('[type="submit"] span')) {
            this.querySelector('[type="submit"] span').textContent = this.popup.productTrigger.buttonLabel;
          }
        });
      }

      preventDuplicatedIDs(productElement) {
        if (!productElement.dataset.section) {
          productElement.dataset.section = this.productInfo?.dataset.section;
        }
        const sectionId = productElement.dataset.section;
        const oldId = sectionId;
        const newId = `quickadd-${sectionId}`;

        productElement.innerHTML = productElement.innerHTML.replaceAll(oldId, newId);
        Array.from(productElement.attributes).forEach((attribute) => {
          if (attribute.value.includes(oldId)) {
            productElement.setAttribute(attribute.name, attribute.value.replace(oldId, newId));
          }
        });

        productElement.dataset.originalSection = sectionId;
      }
    }
  );
}
