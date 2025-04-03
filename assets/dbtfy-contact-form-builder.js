if (!customElements.get('dbtfy-contact-form-dropdown')) {
  customElements.define(
    'dbtfy-contact-form-dropdown',

    class Dropdown extends HTMLElement {
      constructor() {
        super();
        this.isOpen = false;
      }

      connectedCallback() {
        // Initialize the elements when the custom element is added to the DOM
        this.button = this.querySelector('#dropdownButton');
        this.list = this.querySelector('#dropdown-list');
        this.selectedOptionDisplay = this.querySelector('#selected-option');
        this.caretIcon = this.querySelector('#caret-icon');

        this.button.addEventListener('click', () => this.toggleDropdown());
        this.querySelector('#closeButton').addEventListener('click', () => this.closeDropdown());

        // Attach the dropdown logic to each option
        this.querySelectorAll('.dbtfy-contact__disclosure__item').forEach((item) => {
          item.addEventListener('click', () => this.selectOption(item));
        });
      }

      toggleDropdown() {
        this.isOpen = !this.isOpen;
        this.list.style.display = this.isOpen ? 'block' : 'none';
        this.button.setAttribute('aria-expanded', this.isOpen);
        this.caretIcon.style.transform = this.isOpen ? 'rotate(180deg)' : 'rotate(0)';
      }

      closeDropdown() {
        this.isOpen = false;
        this.list.style.display = 'none';
        this.button.setAttribute('aria-expanded', 'false');
        this.caretIcon.style.transform = 'rotate(0)';
      }

      selectOption(optionElement) {
        const optionText = optionElement.textContent.trim();
        this.selectedOptionDisplay.textContent = optionText;

        // Remove 'active' class from all items and add it to the selected item
        this.querySelectorAll('.dbtfy-contact__disclosure__item').forEach((item) => {
          item.classList.remove('active');
        });

        optionElement.classList.add('active');
        this.closeDropdown();
      }
    }
  );
}
