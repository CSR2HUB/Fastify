if (!customElements.get('dbtfy-newsletter-popup-sidebar')) {
  customElements.define(
    'dbtfy-newsletter-popup-sidebar',
    class DbtfyNewsletterPopup extends HTMLElement {
      constructor() {
        super();
        this.sideBar = this.querySelector('.dbtfy-newsletter-popup-sidebar');
        this.sideBarButton = this.querySelector('.dbtfy-newsletter-popup-sidebar button');
        this.selector = this.dataset.selector;
        this.modalWidth = this.dataset.modalWidth;
        this.activateModal = this.dataset.activateModal;
        this.time = this.dataset.time * 1000;
        this.scroll = this.dataset.scrollWidth;
        this.closeButtonSelector = this.dataset.closeButtonSelector;
        this.copyButtonSelector = this.dataset.copyButtonSelector;
        this.copyButtonValue = this.dataset.copyButtonValue;
        this.sidebarEnabled = this.dataset.sidebarEnabled;
        this.close_icon_hide = this.dataset.closeIconHide;
      }

      connectedCallback() {
        this.designMode = Shopify.designMode;
        this.closeMethods = ['overlay', 'button', 'escape'];
        if (window.matchMedia('(max-width: 540px)').matches && this.close_icon_hide === 'false') {
          this.closeMethods = ['overlay', 'escape'];
        }

        document.addEventListener('DOMContentLoaded', () => {
          this.modal = new Fastify.modal({
            closeMethods: this.closeMethods,
            size: this.modalWidth,
            closeIcon: 'close',
            selector: 'dbtfy-newsletter-popup',
            boxClass: [],
            overlayClass: ['dbtfy-newsletter-popup-overlay'],
            onOpen: function () {
              // console.log('modal open');
            },
            onClose: function () {
              // console.log('modal closed');
            },
          });
        });

        if (!this.designMode) {
          this.storageValue();
        }
      }

      // Check cookie store or not
      storageValue() {
        setTimeout(() => {
          if (localStorage.getItem('dbtfyNewsletterPopup') === 'true') {
            this.modal?.close();
          } else {
            if (this.activateModal === 'after_x_sec') {
              this.timeStart();
            } else if (this.activateModal === 'scroll_depth') {
              this.windowScroll();
            } else if (this.activateModal === 'leaving_store') {
              this.exitIntentTrigger();
            } else if (this.activateModal === 'page_load') {
              this.modal.open();
            }
          }
          if (this.sidebarEnabled) {
            this.newsletterSidebar();
          }
          this.copyButton();
          this.closeButtonEvent();
        }, 500);
      }

      // Close button event
      closeButtonEvent() {
        const closeButton = this.modal.modalBox.querySelector(this.closeButtonSelector);
        if (closeButton) {
          closeButton.onclick = () => {
            this.modal.close();
            localStorage.setItem('dbtfyNewsletterPopup', 'true');
          };
        }
      }

      // Exit intent trigger
      exitIntentTrigger() {
        document.addEventListener('mouseleave', (e) => {
          if (e.clientY <= 0) {
            if (localStorage.getItem('dbtfyNewsletterPopup') !== 'true') {
              this.modal.open();
            }
          }
        });
      }

      // Sidebar button click event
      newsletterSidebar() {
        this.sideBarButton?.addEventListener('click', (e) => {
          this.modal.open();
        });
      }

      // Copy button click event
      copyButton() {
        if (this.copyButtonValue) {
          const closeButtonSelector = this.modal.modalBox.querySelector(this.copyButtonSelector);
          if (closeButtonSelector) {
            closeButtonSelector.onclick = () => {
              navigator.clipboard.writeText(this.copyButtonValue);
              this.modal.close();
            };
          }
        }
      }

      // Scroll event
      windowScroll() {
        let hasScrolled = false;
        window.addEventListener('scroll', () => {
          if (!hasScrolled) {
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
            if (scrollPercentage > this.scroll) {
              this.modal.open();
              hasScrolled = true;
            }
          }
        });
      }

      // Time start event
      timeStart() {
        setTimeout(() => {
          this.modal.open();
        }, this.time);
      }
    }
  );
}
