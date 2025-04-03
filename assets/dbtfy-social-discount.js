if (!customElements.get('dbtfy-social-discount')) {
  customElements.define(
    'dbtfy-social-discount',
    class DbtfySocialDiscount extends HTMLElement {
      constructor() {
        super();
        this.socialMedia = this.querySelectorAll('.dbtfy-social-discount-modal-social-sharing');
        this.discountName = this.dataset.discountName;
        this.sharingButton = this.querySelector('.dbtfy-social-discount-sharing-modal button');
        this.sharingButtonWrapper = this.querySelector('.dbtfy-social-discount-sharing-modal');
      }

      connectedCallback() {
        if (typeof Fastify.modal !== 'undefined') {
          this.loadModels();
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            this.loadModels();
          });
        }
      }

      loadModels() {
        this.socialSharing = new Fastify.modal({
          closeMethods: ['overlay', 'button', 'escape'],
          size: 'medium',
          closeIcon: 'close',
          selector: 'dbtfy-social-discount-modal',
          boxClass: ['dbtfy-social-discount-modal'],
          overlayClass: [],
          onOpen: function () {
            console.log('modal open');
          },
          onClose: function () {
            console.log('modal closed');
          },
        });

        this.thankYou = new Fastify.modal({
          closeMethods: ['overlay', 'button', 'escape'],
          size: 'medium',
          closeIcon: 'close',
          selector: 'dbtfy-social-discount-thank-you-modal',
          boxClass: ['dbtfy-social-discount-modal'],
          overlayClass: [],
          onOpen: function () {
            console.log('modal open');
          },
          onClose: function () {
            console.log('modal closed');
          },
        });

        this.designMode = Shopify.designMode;
        if (!this.designMode) {
          this.storageValue();
        }
      }

      storageValue() {
        const storageValue = localStorage.getItem('FastifySocialDiscount');
        if (storageValue) {
          this.socialSharing.close();
          this.socialMediaShow();
          if (this.sharingButtonWrapper) {
            this.sharingButtonWrapper.classList.add('hidden');
          }
        } else {
          this.socialLinks = this.socialSharing.modalBox.querySelectorAll(
            '.dbtfy-social-discount-modal-social-sharing a'
          );

          if (this.sharingButtonWrapper) {
            this.sharingButtonWrapper.classList.remove('hidden');
          }
          this.socialShareButton();
          this.socialDiscount();
        }
      }

      // Modal social media hide
      socialMediaShow() {
        this.socialMedia.forEach((element) => {
          if (element.classList.contains('hidden')) {
            element.classList.remove('hidden');
          }
        });
      }

      // Modal open on button click
      socialShareButton() {
        this.sharingButton.onclick = () => {
          this.socialSharing.open();
        };
      }

      socialDiscount() {
        const copyButton = this.thankYou.modalBox.querySelector('.dbtfy-close-thankyou');

        // Copy discount code
        if (copyButton) {
          copyButton.onclick = () => {
            navigator.clipboard.writeText(this.discountName);
            if (this.thankYou) this.thankYou.close();
          };
        }

        // Social sharing click event
        if (this.socialLinks) {
          this.socialLinks.forEach((element) => {
            element.onclick = () => {
              if (this.socialSharing) this.socialSharing.close();
              if (this.thankYou) this.thankYou.open();
              localStorage.setItem('FastifySocialDiscount', 'Yes');
              this.storageValue();
            };
          });
        }
      }
    }
  );
}
