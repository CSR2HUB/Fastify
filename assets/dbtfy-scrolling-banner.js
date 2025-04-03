if (!customElements.get('dbtfy-scrolling-banner')) {
  class DbtfyScrollingBanner extends HTMLElement {
    constructor() {
      super();

      this.init();

      document.addEventListener('shopify:section:load', (e) => {
        console.log(e.target);
        if (e.target.querySelector('.dbtfy-scrolling-banner')) {
          init();
        }
      });
    }

    init() {
      const list = this.querySelector('ul');
      let marqueeWidth = list.scrollWidth;
      const windowWidth = window.innerWidth * 2;
      const marqueeLength = list.querySelectorAll('li').length;

      let html = list.innerHTML;
      if (marqueeWidth < windowWidth) {
        const itemsToAdd = parseInt(windowWidth / marqueeWidth);
        for (let i = 1; i < itemsToAdd; i++) {
          html += list.innerHTML;
        }
      }
      list.insertAdjacentHTML('beforeEnd', html);

      list.querySelectorAll('li').forEach((item, index) => {
        if (index >= marqueeLength) {
          item.setAttribute('aria-hidden', 'true');
        }
      });

      let style = `
        <style>
          #dbtfy-scrolling-banner-${this.dataset.sectionId} ul {
            animation-name: dbtfy-scrolling-banner-animation-${this.dataset.sectionId};
            animation-duration: ${this.dataset.animationDuration}s;
          }
          @keyframes dbtfy-scrolling-banner-animation-${this.dataset.sectionId} {
            to { transform: translateX(-${marqueeWidth}px); }
          }
        </style>
      `;
      if (this.dataset.marqueeDirection === 'right' || this.dataset.marqueeDirection === 'normal') {
        style += `
          <style>
            @keyframes dbtfy-scrolling-banner-animation-${this.dataset.sectionId} {
              from { transform: translateX(-${marqueeWidth}px); }    
              to { transform: 0); }    
            }
          </style>
        `;
      }

      this.insertAdjacentHTML('beforeBegin', style);
    }
  }
  customElements.define('dbtfy-scrolling-banner', DbtfyScrollingBanner);
}
