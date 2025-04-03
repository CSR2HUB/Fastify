if (!customElements.get('dbtfy-rte')) {
  customElements.define(
    'dbtfy-rte',
    class DbtfyRte extends HTMLElement {
      constructor() {
        super();

        this.toggleButton = this.querySelector('.rte-toggle-button');

        if (!this.toggleButton) return;

        this.readMoreText = this.toggleButton.querySelector('.read-more-text');
        this.readLessText = this.toggleButton.querySelector('.read-less-text');

        this.text_content = this.querySelector('.short-description');
      }

      connectedCallback() {
        if (!this.toggleButton) return;
        this.toggleButton.style.display =
          this.text_content.scrollHeight > this.text_content.clientHeight ? 'inline' : 'none';
        this.toggleButton.addEventListener('click', this.onToggleRte.bind(this));
      }

      onToggleRte() {
        this.text_content.classList.toggle('expanded');
        this.readMoreText.style.display = this.text_content.classList.contains('expanded') ? 'none' : 'inline';
        this.readLessText.style.display = this.text_content.classList.contains('expanded') ? 'inline' : 'none';
      }
    }
  );
}
