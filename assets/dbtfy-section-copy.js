if (!customElements.get('dbtfy-section-copy')) {
  customElements.define(
    'dbtfy-section-copy',
    class SectionCopy extends HTMLElement {
      constructor() {
        super();
        this.link = this.querySelector('a');
        this.link.addEventListener('click', this.copyText.bind(this), false);
      }

      connectedCallback() {
        this.initChart();
      }

      copyText() {
        const copyText = this.link.getAttribute('href');
        const text = this.link.dataset.text;
        const copiedText = this.link.dataset.copyText;

        navigator.clipboard.writeText(copyText);

        this.link.textContent = copiedText;

        setTimeout(() => {
          this.link.textContent = text;
        }, 1000);
      }
    }
  );
}
