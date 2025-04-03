if (!customElements.get('dbtfy-search-bar')) {
  customElements.define(
    'dbtfy-search-bar',
    class DbtfySearchBar extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.searchBar();
      }

      searchBar() {
        const searchInput = this.querySelector('.dbtfy-search-bar__button');
        if (searchInput) {
          searchInput.addEventListener('focus', () => {
            this.triggerSearchIconClick();
          });
        }
      }

      triggerSearchIconClick() {
        const searchIcon = document.querySelector('summary.header__icon--search');
        if (searchIcon) {
          setTimeout(() => {
            searchIcon.click();
          }, 200);
        }
      }
    }
  );
}
