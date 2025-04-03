if (!customElements.get('dbtfy-product-tab')) {
  customElements.define(
    'dbtfy-product-tab',
    class DbtfyProductTab extends HTMLElement {
      constructor() {
        super();

        this.productTab = this.querySelectorAll('.dbtfy-product-tab-block');

        this.displayType = this.dataset.displayType;
        this.block = this.dataset.block;

        if (this.block == 'false') {
          this.content = document.querySelector('product-info .dbtfy-product-tabs');
        } else {
          const separteSection = document.querySelector('.dbtfy-product-tabs.shown-as-separate');
          if (separteSection) {
            separteSection.classList.remove('hidden');
            this.content = document.querySelector('.dbtfy-product-tabs.shown-as-separate .d-grid');

            if (this.displayType == 'horizontal') {
              document.querySelectorAll('.dbtfy-product-tab').forEach((element) => {
                element.classList.add('dbtfy-product-tabs-horizontal');
              });
            }
          }
        }

        if (this.displayType == 'horizontal') {
          this.horizontalselector = document.querySelectorAll('dbtfy-product-tab-horizontal');
          this.horizontalselector.forEach((element) => {
            element.setAttribute('data-display-type', this.displayType);
          });
        } else {
          this.verticalSelector = document.querySelectorAll('.dbtfy-product-tab-block');
          this.verticalSelector.forEach((element) => {
            element.classList.add('grid--12-col');
          });
        }

        this.testMode = Shopify.designMode;
      }

      disconnectedCallback() {
        if (this.testMode) {
          this.selectEvent();
        }
      }

      connectedCallback() {
        if (this.testMode) {
          this.selectEvent = subscribe(PUB_SUB_EVENTS.shopifyEventBlockSelect, (e) => {
            if (e.detail.blockId === 'widget-product-tabs') {
              this.init();
            }
          });
          this.init();
        } else {
          this.init();
        }
      }

      init() {
        if (this.content) {
          this.content.innerHTML = '';
          this.content.classList.remove('hidden');

          const product_id = this.content.dataset.product;

          if (this.displayType == 'horizontal' && this.block == 'true') {
            document.querySelector('.shown-as-separate').classList.add('dbtfy-product-tab--horizontal-active');
            this.content = document.querySelector('.dbtfy-product-tabs--description');
            this.productTab = document.querySelectorAll('.product-tab-content');
            if (this.productTab.length > 0) {
              this.productTab[0].classList.remove('hidden');
              this.productTab.forEach((productTab) => {
                if (!this.content.contains(productTab)) {
                  this.content.append(productTab);
                }
              });
            }

            let htmlGet = '';

            document.querySelectorAll('.dbtfy-product-tab-block').forEach((element) => {
              element.querySelector('.summary-icon-caret').remove();
              htmlGet += element.outerHTML;
              element.remove();
            });

            document.querySelector('.dbtfy-product-tabs--title').innerHTML = htmlGet;
            const titleLength = document.querySelectorAll('.dbtfy-product-tabs--title .dbtfy-product-tab-block').length;
            if (titleLength > 0) {
              document
                .querySelectorAll('.dbtfy-product-tabs--title .dbtfy-product-tab-block')[0]
                .querySelector('.product-tab-details')
                .classList.add('product-tab-active');
            }
          } else if (this.productTab) {
            this.productTab.forEach((productTab) => {
              if (!product_id || !productTab.dataset.product || productTab.dataset.product == product_id) {
                this.content.append(productTab);
              }
            });
          }
        }

        const summaries = document.querySelectorAll('.product-tab-details');

        summaries.forEach((summary) => {
          summary.addEventListener('click', () => {
            const contentId = summary.getAttribute('data-id').replace('title', 'content');
            const content = document.querySelector(`.product-tab-content[data-id="${contentId}"]`);

            const allContents = document.querySelectorAll('.product-tab-content');
            allContents.forEach((otherContent) => {
              if (otherContent !== content) {
                otherContent.classList.add('hidden');
              }
            });
            content.classList.toggle('hidden');

            document
              .querySelectorAll(`.dbtfy-product-tabs  .product-tab-details:not([data-id="${contentId}"])`)
              .forEach((otherSummary) => {
                otherSummary.classList.remove('product-tab-active');
              });
            summary.classList.toggle('product-tab-active');
          });
        });

        document.querySelector('.product-rating-badge')?.addEventListener('click', function () {
          const targetDiv = document.getElementById('prouct-tab-review');
          const offset = 100;
          const elementPosition = targetDiv.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
          const productTabDetails = targetDiv.querySelector('.product-tab-details');
          if (!productTabDetails.classList.contains('product-tab-active')) {
            productTabDetails.click();
          }
        });
      }
    }
  );
}
