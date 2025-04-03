if (!customElements.get('inactive-tab-message')) {
  customElements.define(
    'inactive-tab-message',

    class InactiveTabMessage extends HTMLElement {
      constructor() {
        super();
        this.blocks = Fastify.widgets['inactive-tab-message'].blocks;
      }

      connectedCallback() {
        this.intervalId = null;
        this.originalTitle = document.title;
        this.counter = 0;
        this.delay = this.dataset.delay * 1000;
        if (this.blocks.length > 0) {
          document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        }
      }

      handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
          this.startInterval();
        } else {
          this.clearInterval();
        }
      }

      startInterval() {
        if (!this.intervalId) {
          this.intervalId = setInterval(() => {
            if (this.counter >= this.blocks.length) {
              this.counter = 0;
            }
            const message = Fastify.removeHTMLTags(this.blocks[this.counter]['message']);
            if (message !== '') {
              document.title = message;
            }
            this.counter++;
          }, this.delay);
        }
      }

      clearInterval() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
          document.title = this.originalTitle;
        }
      }
    }
  );
}
