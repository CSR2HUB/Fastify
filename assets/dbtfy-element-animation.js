if (!customElements.get('element-animator')) {
  customElements.define(
    'element-animator',

    class ElementAnimator extends HTMLElement {
      constructor() {
        super();
        this.animation = this.dataset.animation;
        this.interval = this.dataset.interval;
        this.duration = this.dataset.duration * 1000;
        this.selector = this.dataset.selector;
        this.element = this.querySelector(this.selector);
        this.enabled = this.dataset.enabled;

        this.dependency = null;
        if (this.dataset.dependency) {
          this.dependency = this.dataset.dependency;
        }
        this.init();
      }

      animate() {
        if (this.animation && this.element) {
          this.element.classList.add(this.animation);
          setTimeout(() => {
            this.element.classList.remove(this.animation);
          }, this.duration);
        }
      }

      init() {
        if (this.enabled === 'true') {
          this.animate();

          const interval = (parseInt(this.interval) + parseInt(this.duration / 1000)) * 1000;
          this.animationInterval = setInterval(() => {
            if (this.dependency && Fastify[this.dependency].length < 1) {
              return false;
            }
            this.animate();
          }, interval);
        }
      }

      stopAnimation() {
        this.animationInterval && clearInterval(this.animationInterval);
      }
    }
  );
}
