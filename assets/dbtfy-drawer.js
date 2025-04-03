//  ----------------------------------------
//       Usage
//  ----------------------------------------
/* <style>
  dbtfy-wishlist-drawer {
    width: 50%;
  }
</style>

<dbtfy-drawer
  data-position="right"
  data-state-class="open"
  data-color-scheme="color-scheme-1"
>
  <dbtfy-wishlist-drawer class="flex flex-column">
    <div class="dbtfy-drawer__header">
      <h2 class="dbtfy-drawer__heading">Cart • 2 items</h2>
      <button
        class="dbtfy-drawer__close"
        type="button"
        onclick="this.closest('dbtfy-drawer').close()"
        aria-label="Close"
      >
        {% render 'material-icon', icon: 'close' %}
      </button>
    </div>
    <div class="dbtfy-drawer__contents">
      <p>content goes here</p>
    </div>
    <div class="dbtfy-drawer__footer">
      <p>footer content goes here</p>
    </div>
  </dbtfy-wishlist-drawer>
</dbtfy-drawer> */
//  ----------------------------------------

if (!customElements.get('dbtfy-drawer')) {
  customElements.define(
    'dbtfy-drawer',
    class DbtfyDrawer extends HTMLElement {
      constructor() {
        super();
        this.stateClass = this.dataset.stateClass || '';
        this.position = this.dataset.position || 'right';
        this.container = this.children[0];
        this.colorScheme = this.dataset.colorScheme || '';
        this.customColorScheme = this.dataset.customColorScheme || '';
      }

      connectedCallback() {
        this.classList.add('dbtfy-drawer__position--' + this.position);
        if (this.colorScheme && this.container) {
          this.container.classList.add('gradient');
          this.container.classList.add(this.customColorScheme);
          this.container.classList.add(this.colorScheme);
        }
        if (this.container) {
          this.container.setAttribute('role', 'dialog');
          this.container.setAttribute('aria-modal', 'true');
          this.container.setAttribute('tabindex', '-1');
        }
        this.addEventListener('click', (event) => {
          if (event.target === this) {
            this.close();
          }
        });
      }

      open() {
        this.style.visibility = 'visible';
        this.container.classList.add(this.stateClass);
        console.log('drawer open');
      }

      close() {
        this.style.visibility = 'hidden';
        this.container.classList.remove(this.stateClass);
        console.log('drawer close');
      }
    }
  );
}
