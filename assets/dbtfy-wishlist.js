if (!customElements.get('dbtfy-wishlist-badge')) {
  customElements.define(
    'dbtfy-wishlist-badge',
    class extends HTMLElement {
      constructor() {
        super();
        this.url = Fastify.removeLocalFromUrl(this.dataset.productUrl).split('?')[0];
        this.icon = this.querySelector('i');
        this.checked = false;
      }

      connectedCallback() {
        if (!Fastify.settings?.dbtfy_wish_list && !Shopify.designMode) {
          this.remove();
          return;
        }

        subscribe(PUB_SUB_EVENTS.wishlistUpdate, ({ url, checked }) => {
          if (url === this.url) {
            if (checked) {
              this.active();
            } else {
              this.inactive();
            }
          }
        });

        if (Fastify.wishlist.includes(this.url)) {
          this.active();
          this.checked = true;
        }

        this.addEventListener('click', this.toggle);
      }

      toggle() {
        if (this.checked) {
          this.inactive();
          Fastify.wishlist = Fastify.wishlist.filter((url) => url !== this.url);
        } else {
          this.active();
          Fastify.wishlist.push(this.url);
        }
        localStorage.setItem('dbtfy-wishlist', JSON.stringify(Fastify.wishlist));

        publish(PUB_SUB_EVENTS.wishlistUpdate, {
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

if (!customElements.get('dbtfy-wishlist-drawer')) {
  customElements.define(
    'dbtfy-wishlist-drawer',
    class extends HTMLElement {
      constructor() {
        super();
        this.items = [];
        this.itemsContainer = this.querySelector('.dbtfy-wishlist--items');
        this.testMode = Shopify.designMode;
      }

      disconnectedCallback() {
        if (this.testMode) {
          this.deselectEvent();
          this.selectEvent();
        }
      }

      connectedCallback() {
        if (this.testMode) {
          this.deselectEvent = subscribe(PUB_SUB_EVENTS.shopifyEventSectionSelect, (e) => {
            if (e.detail.sectionId === 'dbtfy-wishlist-drawer') {
              this.parentElement.open();
            }
          });

          this.selectEvent = subscribe(PUB_SUB_EVENTS.shopifyEventSectionDeselect, (e) => {
            if (e.detail.sectionId === 'dbtfy-wishlist-drawer') {
              this.parentElement.close();
            }
          });
        } else {
          if (!Fastify.settings?.dbtfy_wish_list) {
            this.remove();
            return;
          }
        }

        const wishlistIcon = document.querySelectorAll('.header__icon--wishlist');
        wishlistIcon.forEach((icon) => {
          icon.addEventListener('click', (e) => {
            e.preventDefault();
            this.parentElement.open();
          });
        });

        this.init();

        subscribe(PUB_SUB_EVENTS.wishlistUpdate, async ({ url, checked }) => {
          if (checked) {
            await this.addItem(url);
          } else {
            this.removeItem(url);
          }
        });
      }

      init() {
        // Use Promise.all to wait for all fetch operations to complete
        const fetchPromises = Fastify.wishlist.map(async (url) => {
          await this.fetchItem(url);
        });

        Promise.all(fetchPromises).then(() => {
          this.updateDrawer();
        });
      }

      updateDrawer() {
        this.itemsContainer.innerHTML = '';
        this.items.forEach(({ html }) => {
          const itemElement = document.createElement('div');
          itemElement.classList.add('grid__item');
          itemElement.innerHTML = html;
          this.itemsContainer.appendChild(itemElement);
        });
        this.drawer_title = this.querySelector('.dbtfy-drawer__heading').attributes['data-title'].value;

        if (this.items.length == 0) {
          this.classList.add('dbtfy-wishlist_drawer_empty');
        } else if (this.items.length > 0) {
          this.classList.remove('dbtfy-wishlist_drawer_empty');
        }
        this.draweCount();
      }

      draweCount() {
        if (this.drawer_title.includes('count')) {
          this.querySelector('.dbtfy-drawer__heading').innerHTML = this.drawer_title.replaceAll(
            '{count}',
            this.items.length
          );
        }
      }

      removeItem(url) {
        this.items = this.items.filter((item) => item.url !== url);
        this.updateDrawer();
      }

      async addItem(url) {
        await this.fetchItem(url);
        this.updateDrawer();
      }

      async fetchItem(url) {
        try {
          let html = await Fastify.fetchProductMarkup(`${url}?view=internal-wishlist`);
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

if (!customElements.get('dbtfy-wishlist-count')) {
  customElements.define(
    'dbtfy-wishlist-count',
    class extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        if (!Fastify.settings?.dbtfy_wish_list && !Shopify.designMode) {
          this.remove();
          return;
        }

        this.wishlistBubblecount();
        subscribe(PUB_SUB_EVENTS.wishlistUpdate, ({ url, checked }) => {
          this.wishlistBubblecount();
        });
      }

      wishlistBubblecount() {
        if (this.querySelector('span')) {
          this.querySelector('span').innerHTML = Fastify.wishlist.length;
        }
      }
    }
  );
}

if (!customElements.get('dbtfy-wishlist')) {
  customElements.define(
    'dbtfy-wishlist',
    class extends HTMLElement {
      constructor() {
        super();
        this.items = [];
        this.itemsContainer = this.querySelector('.dbtfy-wishlist-section--items');
        this.sliderTemplate = this.querySelector('#wishlist-slider');
        this.productToShow = this.dataset.productToShow;
      }

      connectedCallback() {
        if (!Fastify.settings?.dbtfy_wish_list && !Shopify.designMode) {
          this.remove();
          return;
        }

        this.updateWishistlistCount();

        this.init();

        subscribe(PUB_SUB_EVENTS.wishlistUpdate, async ({ url, checked }) => {
          this.updateWishistlistCount();
          if (checked) {
            await this.addItem(url);
          } else {
            this.removeItem(url);
          }
        });
      }

      updateWishistlistCount() {
        if (Fastify.wishlist.length > 0) {
          if (this.classList.contains('dbtfy-wishlist--has-items-empty')) {
            this.classList.remove('dbtfy-wishlist--has-items-empty');
          }
        } else {
          this.classList.add('dbtfy-wishlist--has-items-empty');
        }
      }

      init() {
        // Use Promise.all to wait for all fetch operations to complete
        const fetchPromises = Fastify.wishlist.map(async (url) => {
          await this.fetchItem(url);
        });

        Promise.all(fetchPromises).then(() => {
          this.updateWishlistSection();
        });
      }

      updateWishlistSection() {
        // this.itemsContainer.innerHTML = '';
        // this.items.forEach(({ html }) => {
        //   const itemElement = document.createElement('div');
        //   itemElement.classList.add('grid--4-col-dekstop', 'grid--3-col-tablet', 'grid--6-col');
        //   itemElement.innerHTML = html;
        //   this.itemsContainer.appendChild(itemElement);
        // });

        const parser = new DOMParser();
        const sliderTemplate = parser.parseFromString(this.sliderTemplate.innerHTML, 'text/html');
        let sliderItem = sliderTemplate.querySelector('.dbtfy-wishlist-section--items');

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

        this.querySelector('dbtfy-slider-component')?.classList.add('hidden');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        setTimeout(() => {
          this.querySelector('.loading__spinner').classList.add('hidden');
          this.querySelector('dbtfy-slider-component')?.remove();
          let slider = sliderTemplate.querySelector('dbtfy-slider-component');
          this.sliderTemplate.insertAdjacentElement('afterend', slider);
          this.querySelector('dbtfy-slider-component').classList.remove('hidden');
        }, 1000);
      }

      removeItem(url) {
        this.items = this.items.filter((item) => item.url !== url);
        this.updateWishlistSection();
      }

      async addItem(url) {
        await this.fetchItem(url);
        this.updateWishlistSection();
      }

      async fetchItem(url) {
        try {
          let html = await Fastify.fetchProductMarkup(`${url}?view=internal-wishlist`);
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
