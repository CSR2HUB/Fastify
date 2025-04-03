if (!customElements.get('product-bullet-point')) {
  customElements.define(
    'product-bullet-point',
    class extends HTMLElement {
      constructor() {
        super();
        this.content = document.querySelector('.dbtfy-product-bullet-points');
        this.bulletPointsBlock = this.querySelectorAll('.dbtfy-product-bullet-point-block');
        this.blockId = this.dataset.blockId;
        this.testMode = Shopify.designMode;

        this.bulletType = this.dataset.bulletType;
        this.bulletBoxes = this.querySelectorAll('.product__accordion .summary__title .svg-wrapper');
        this.bulletPointsHtml = this.querySelector('bullet-point').innerHTML;
      }

      connectedCallback() {
        this.init();
      }
      init() {
        const position = this.dataset.position;
        const positionInDescription = this.dataset.positionInDescription;
        if (this.content) {
          const product_id = this.content.dataset.product;
          this.content.innerHTML = '';
          this.bulletPointsBlock.forEach((bulletPoint) => {
            if (!product_id || !bulletPoint.dataset.product || bulletPoint.dataset.product == product_id) {
              this.content.append(bulletPoint);
            }
          });
          this.content.classList.remove('hidden');

          if (position === 'in-description') {
            this.placeInDescription(positionInDescription);
          }
        }

        if (this.bulletBoxes.length > 0) {
          this.bulletBoxes.forEach((bulletBox) => {
            bulletBox.innerHTML = this.bulletPointsHtml;
          });

          if (this.bulletType == 'numbers') {
            this.bulletBoxes.forEach((bulletBox, index) => {
              bulletBox.querySelector('.bullet-number').innerHTML = index + 1;
            });
          }

          if (this.bulletType == 'icon') {
            this.bulletBoxes.forEach((bulletBox) => {
              bulletBox.querySelector('.material-icon').dataset.icon = bulletBox.dataset.bannerIcon;
            });
          }

          document
            .querySelector('.dbtfy-product-bullet-points .product__accordion.dbtfy-product-bullet-point-block')
            ?.classList.add('bullet-type--' + this.bulletType);

          document.querySelector('.dbtfy-product-bullet-points')?.classList.add(...this.classList);
        }
      }
      placeInDescription(positionInDescription) {
        const description = document.querySelector('.product .product__description ');
        if (description) {
          if (positionInDescription === 'above') {
            description.insertAdjacentElement('beforebegin', this.content);
          } else if (positionInDescription === 'below') {
            description.insertAdjacentElement('afterend', this.content);
          }
        } else {
          this.content.classList.add('hidden');
        }
      }
    }
  );
}
