if (!customElements.get('back-to-top')) {
  customElements.define(
    'back-to-top',
    class BackToTop extends HTMLElement {
      constructor() {
        super();
        this.display_after_scrolling = this.dataset.displayAfterScrolling;
        this.addEventListener('click', this.backToTop.bind(this), false);
      }

      connectedCallback() {
        window.addEventListener('scroll', this.updateScrollPercentage.bind(this));
      }

      backToTop() {
        if (document.documentElement.scrollTop > 0 || document.body.scrollTop > 0) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }

      updateScrollPercentage() {
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        this.style.setProperty('--scroll-back-to-to-height', scrollPercentage.toFixed(2) + '%');
        if (scrollTop > this.display_after_scrolling) {
          this.style.display = 'flex';
        } else {
          this.style.display = 'none';
        }
      }
    }
  );
}
