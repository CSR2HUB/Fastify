if (!customElements.get('dbtfy-recently-viewed-badge')) {
  customElements.define(
    'dbtfy-recently-viewed-badge',
    class extends HTMLElement {
      constructor() {
        super();
        this.url = Fastify.removeLocalFromUrl(this.dataset.productUrl).split('?')[0];
        this.icon = this.querySelector('i');
        this.checked = false;
      }

      connectedCallback() {
        subscribe(PUB_SUB_EVENTS.recentlyUpdated, ({ url, checked }) => {
          if (url === this.url) {
            if (checked) {
              this.active();
            } else {
              this.inactive();
            }
          }
        });

        if (Fastify.recentlyViewed.includes(this.url)) {
          this.active();
          this.checked = true;
        }

        this.toggle();
      }

      toggle() {
        if (!this.checked) {
          this.active();
          Fastify.recentlyViewed.push(this.url);
        }
        localStorage.setItem('dbtfy-recently-viewed', JSON.stringify(Fastify.recentlyViewed));

        publish(PUB_SUB_EVENTS.recentlyUpdated, {
          url: this.url,
          checked: this.checked,
        });
      }

      active() {
        this.classList.add('active');
        this.checked = true;
      }

      inactive() {
        this.classList.remove('active');
        this.checked = false;
      }
    }
  );
}

if (!customElements.get('dbtfy-recently-viewed')) {
  customElements.define(
    'dbtfy-recently-viewed',
    class extends HTMLElement {
      constructor() {
        super();
        this.items = [];
        this.itemsContainer = this.querySelector('.dbtfy-recently-viewed-section--items');
        this.sliderTemplate = this.querySelector('#recently-viewed-slider');
        this.productToShow = this.dataset.productToShow;
        this.imageRatio = `media-${this.dataset.imageRatio}`;
      }

      connectedCallback() {
        this.updateWishistlistCount();

        this.init();

        subscribe(PUB_SUB_EVENTS.recentlyUpdated, async ({ url, checked }) => {
          this.updateWishistlistCount();
          if (checked) {
            await this.addItem(url);
          }
        });
      }

      updateWishistlistCount() {
        if (Fastify.recentlyViewed.length > 0) {
          if (this.classList.contains('dbtfy-recently-viewed--has-items-empty')) {
            this.classList.remove('dbtfy-recently-viewed--has-items-empty');
          }
        } else {
          this.classList.add('dbtfy-recently-viewed--has-items-empty');
        }
      }

      init() {
        // Use Promise.all to wait for all fetch operations to complete
        const fetchPromises = Fastify.recentlyViewed.map(async (url) => {
          if (url.includes('products')) await this.fetchItem(url);
        });

        Promise.all(fetchPromises).then(() => {
          this.recentlyViewedSection();
        });
      }

      recentlyViewedSection() {
        const parser = new DOMParser();
        const sliderTemplate = parser.parseFromString(this.sliderTemplate.innerHTML, 'text/html');
        let sliderItem = sliderTemplate.querySelector('.dbtfy-recently-viewed-section--items');

        this.items.forEach(({ html }, index) => {
          if (index >= this.productToShow) {
            return;
          }

          const itemElement = document.createElement('div');
          itemElement.classList.add('grid__item');
          itemElement.id = `Slide-${index}`;
          itemElement.innerHTML = html;

          sliderItem.appendChild(itemElement);
        });

        let slider = sliderTemplate.querySelector('dbtfy-slider-component');
        // slider find .grid__item .card-wrapper .card loop that and add image--ratio class
        slider.querySelectorAll('.grid__item .card-wrapper').forEach((card_wrapper) => {
          card_wrapper.querySelector('.card').classList.add('image--ratio');
          card_wrapper.querySelectorAll('.card__media .media').forEach((media) => {
            media.classList.add(this.imageRatio);
          });
        });

        this.sliderTemplate.insertAdjacentElement('afterend', slider);
      }

      removeItem(url) {
        this.items = this.items.filter((item) => item.url !== url);
        this.recentlyViewedSection();
      }

      async addItem(url) {
        await this.fetchItem(url);
        this.recentlyViewedSection();
      }

      async fetchItem(url) {
        try {
          let html = await Fastify.fetchProductMarkup(`${url}?view=internal-recently-viewed`);

          if (html) {
            this.items.push({
              url,
              html,
            });
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error: ' + error);
          return null;
        }
      }
    }
  );
}
