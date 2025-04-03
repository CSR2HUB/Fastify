if (!customElements.get('dbtfy-infinite-scroll')) {
  customElements.define(
    'dbtfy-infinite-scroll',
    class AutoScrollbar extends HTMLElement {
      constructor() {
        super();

        ({
          banner_button_style: this.button_style,
          button_size: this.button_size,
          infinite_scroll_button: this.button_label,
          infinite_scroll_type: this.scroll_type,
          infinite_scroll_loading_image: this.loading_image_url,
        } = Fastify.widgets['infinite-scroll']);

        this.button = this.querySelector('#dbtfy-auto-scrollbar');
        this.loadingImage = this.querySelector('img');
        this.containerClass = '#ProductGridContainer .product-grid';
        this.container = document.querySelector(this.containerClass);

        if (!this.container) {
          this.containerClass = '.main-blog .blog-articles';
        }
        this.container = document.querySelector(this.containerClass);
      }

      connectedCallback() {
        this.init();
      }

      init() {
        if (!this.button || !this.container) return;

        this.setButtonClass();

        if (this.scroll_type == 'click' || !this.loading_image_url) {
          this.button.classList.add(...this.buttonClass.split(' '));
          this.button.appendChild(document.createTextNode(this.button_label));
          this.loadingImage.remove();
        } else if (this.loading_image_url != '') {
          this.loadingImage.src = this.loading_image_url;
          this.loadingImage.classList.remove('hidden');
          this.button.querySelector('.loading__spinner').remove();
          this.button.style.border = '0';
        }

        if (this.scroll_type == 'click') {
          this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.button.querySelector('.loading__spinner').classList.remove('hidden');
            this.loadMoreProducts();
          });
        } else {
          window.addEventListener('scroll', () => this.handleScroll());
        }

        this.classList.remove('hidden');
      }

      setButtonClass() {
        switch (this.button_style) {
          case 'link':
            this.buttonClass = 'link underlined-link button--link';
            break;
          case 'solid':
            this.buttonClass = 'button button-primary';
            break;
          case 'outline':
            this.buttonClass = 'button button--secondary';
            break;
          default:
            this.buttonClass = 'button button--tertiary';
        }
        this.buttonClass += ` ${this.button_size}`;
      }

      isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      }

      async loadMoreProducts() {
        const url = this.button.dataset.url;
        this.button.classList.add('loading');
        this.button.querySelector('.loading__spinner')?.classList.remove('hidden');

        try {
          const response = await fetch(url);
          const responseText = await response.text();
          const parser = new DOMParser();
          const html = parser.parseFromString(responseText, 'text/html');

          const newProducts = html.querySelector(this.containerClass).innerHTML;
          const newButton = html.querySelector('#dbtfy-auto-scrollbar');

          this.container.insertAdjacentHTML('beforeend', newProducts);

          if (newButton.dataset.url !== '') {
            this.button.dataset.url = newButton.dataset.url;
          } else {
            this.button.remove();
          }
        } catch (error) {
          console.error('Error loading more products:', error);
        } finally {
          this.button.classList.remove('loading');
          this.button.querySelector('.loading__spinner').classList.add('hidden');
        }
      }

      handleScroll() {
        if (this.button && this.isInViewport(this.button) && !this.button.classList.contains('loading')) {
          this.loadMoreProducts();
        }
      }
    }
  );
}
