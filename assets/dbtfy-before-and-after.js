if (!customElements.get('dbtfy-before-and-after')) {
  customElements.define(
    'dbtfy-before-and-after',
    class DbtfyBeforeAndAfter extends HTMLElement {
      constructor() {
        super();
        this.content = this.querySelector('.dbtfy-before-after');
        this.direction = this.dataset.layout;
      }

      size = undefined;
      isSliderLocked = false;

      connectedCallback() {
        this.content.addEventListener('mousedown', this.sliderStart.bind(this));
        this.content.addEventListener('touchstart', this.sliderStart.bind(this));
        window.addEventListener('mouseup', this.sliderEnd.bind(this));
        window.addEventListener('touchstop', this.sliderEnd.bind(this));
        this.content.addEventListener('touchmove', this.sliderMove.bind(this));
        this.content.addEventListener('mousemove', this.sliderMove.bind(this));
      }

      sliderStart(e) {
        if (e.target.closest('a')) {
          isSliderLocked = false;
          return;
        }

        this.isSliderLocked = true;
        this.size = this.content.getBoundingClientRect();
      }

      sliderEnd(e) {
        this.isSliderLocked = false;
      }

      sliderMove(e) {
        if (!this.isSliderLocked) return;
        const event = e.touches ? e.touches[0] : e;
        let position = ((event.clientX - this.size.x) / this.size.width) * 100;
        if (this.direction == 'vertical') position = 100 - ((event.clientY - this.size.y) / this.size.height) * 100;
        this.content.style.setProperty('--position', `${position}%`);
      }
    }
  );
}
