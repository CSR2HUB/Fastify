if (!customElements.get('dbtfy-dropdown')) {
  customElements.define(
    'dbtfy-dropdown',
    class DbtfyDropdown extends HTMLElement {
      constructor() {
        super();
        this.button = this.querySelector('.dbtfy-dropdown__button');
        this.content = this.querySelector('.dbtfy-dropdown__list');
        this.items = this.querySelectorAll('.dbtfy-dropdown__item');
        this.button.addEventListener('click', this.toggleDropdown.bind(this));
        this.items.forEach((item) => {
          item.addEventListener('click', this.onClick.bind(this));
        });
        window.addEventListener('click', this.closeDropdown.bind(this));
      }

      onClick(e) {
        e.stopPropagation();
        const label = e.target.closest('.dbtfy-dropdown__label');
        if (!label) {
          return;
        }
        this.button.querySelector('span').textContent = label.textContent.trim();
        this.toggleDropdown();
      }

      toggleDropdown() {
        this.button.setAttribute('aria-expanded', this.button.getAttribute('aria-expanded') == 'false');
        this.content.toggleAttribute('hidden');
      }

      closeDropdown(e) {
        if (!e.target.closest('dbtfy-dropdown')) {
          this.button.setAttribute('aria-expanded', false);
          this.content.setAttribute('hidden', '');
        }
      }
    }
  );
}
