if (!customElements.get('dbtfy-parallax-image')) {
  customElements.define(
    'dbtfy-parallax-image',
    class DbtfyParallaxImage extends HTMLElement {
      constructor() {
        super();

        this.injectVendorScript();
      }

      async injectVendorScript() {
        if (!window.Backpax) {
          const script = document.createElement('script');
          script.setAttribute(
            'src',
            'https://cdn.jsdelivr.net/npm/simple-parallax-js@5.6.2/dist/simpleParallax.min.js'
          );
          script.setAttribute('integrity', 'sha256-GBIPMHSjsTxzIyJuhuk7wWz8z2oKeev8qW/c3IgOeVQ=');
          script.setAttribute('crossorigin', 'anonymous');
          script.onload = this.init.bind(this);
          document.head.appendChild(script);
        }
      }

      init() {
        new simpleParallax(this.querySelectorAll('.parallax-img-init'), {
          orientation: this.dataset.parallaxOrientation,
          scale: Number(this.dataset.parallaxScale),
        });
      }
    }
  );
}
