if (!customElements.get('dbtfy-compare-badge')) {
  customElements.define(
    'dbtfy-compare-badge',
    class extends HTMLElement {
      constructor() {
        super();
        this.url = Fastify.removeLocalFromUrl(this.dataset.productUrl).split('?')[0];
        this.icon = this.querySelector('i');
        this.checked = false;
      }

      connectedCallback() {
        subscribe(PUB_SUB_EVENTS.compareUpdate, ({ url, checked }) => {
          if (url === this.url) {
            if (checked) {
              this.active();
            } else {
              this.inactive();
            }
          }
        });

        if (Fastify.compare.includes(this.url)) {
          this.active();
          this.checked = true;
        }

        this.addEventListener('click', this.toggle);
      }

      toggle() {
        if (this.checked) {
          this.inactive();
          Fastify.compare = Fastify.compare.filter((url) => url !== this.url);
        } else {
          this.active();
          Fastify.compare.push(this.url);
        }
        localStorage.setItem('dbtfy-compare', JSON.stringify(Fastify.compare));

        publish(PUB_SUB_EVENTS.compareUpdate, {
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

if (!customElements.get('dbtfy-compare-drawer')) {
  customElements.define(
    'dbtfy-compare-drawer',
    class extends HTMLElement {
      constructor() {
        super();
        this.items = [];
        this.compareItems = this.dataset.compareItems.split(',') || [];
        this.titleSelector = this.querySelector('.dbtfy-compare-table__row[data-type="title"]');
        this.priceSelector = this.querySelector('.dbtfy-compare-table__row[data-type="price"]');
        this.imageSelector = this.querySelector('.dbtfy-compare-table__row[data-type="image"]');
        this.typeSelector = this.querySelector('.dbtfy-compare-table__row[data-type="type"]');
        this.vendorSelector = this.querySelector('.dbtfy-compare-table__row[data-type="vendor"]');
        this.collectionsSelector = this.querySelector('.dbtfy-compare-table__row[data-type="collections"]');
        this.tagsSelector = this.querySelector('.dbtfy-compare-table__row[data-type="tags"]');
        this.shortDescriptionSelector = this.querySelector('.dbtfy-compare-table__row[data-type="short-description"]');
        this.testMode = Shopify.designMode;
        this.heading = this.querySelector('.dbtfy-drawer__heading');
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
            if (e.detail.sectionId === 'dbtfy-compare-drawer') {
              this.parentElement.open();
            }
          });

          this.selectEvent = subscribe(PUB_SUB_EVENTS.shopifyEventSectionDeselect, (e) => {
            if (e.detail.sectionId === 'dbtfy-compare-drawer') {
              this.parentElement.close();
            }
          });
        }

        document.addEventListener('DOMContentLoaded', () => {
          const compareIcon = document.querySelectorAll('.header__icon--compare');
          compareIcon.forEach((icon) => {
            icon.addEventListener('click', (e) => {
              e.preventDefault();
              this.parentElement.open();
            });
          });
        });

        this.init();

        subscribe(PUB_SUB_EVENTS.compareUpdate, async ({ url, checked }) => {
          if (checked) {
            await this.addItem(url);
          } else {
            this.removeItem(url);
          }
        });
      }

      init() {
        // Use Promise.all to wait for all fetch operations to complete
        const fetchPromises = Fastify.compare.map(async (url) => {
          await this.fetchItem(url);
        });

        Promise.all(fetchPromises).then(() => {
          this.updateDrawer();
        });
      }

      updateDrawer() {
        this.drawer_title = this.heading?.attributes['data-heading'].value;

        if (this.items.length == 0) {
          this.classList.add('dbtfy-compare-drawer--empty');
        } else if (this.items.length > 0) {
          this.classList.remove('dbtfy-compare-drawer--empty');
        }

        this.draweCount();

        const elements = {
          title: {
            selector: this.titleSelector,
            label: 'Title',
            content: (json) => {
              const a = document.createElement('a');
              a.href = '/products/' + json.product.handle;
              a.innerHTML = json.product.title;

              return a;
            },
          },
          price: { selector: this.priceSelector, label: 'Price', content: (json) => json.product.price },
          image: {
            selector: this.imageSelector,
            label: 'Image',
            content: (json) => {
              const div = document.createElement('div');
              div.classList.add('dbtfy-compare-table__image');

              const a = document.createElement('a');
              a.href = '/products/' + json.product.handle;

              const img = document.createElement('img');
              img.src = json.product.featured_image;
              img.alt = json.product.title;

              a.appendChild(img);

              div.appendChild(a);
              div.innerHTML += json.remove_compare_html;

              return div;
            },
          },
          type: { selector: this.typeSelector, label: 'Type', content: (json) => json.product.type || 'N/A' },
          vendor: { selector: this.vendorSelector, label: 'Vendor', content: (json) => json.product.vendor || 'N/A' },
          collections: {
            selector: this.collectionsSelector,
            label: 'Collections',
            content: (json) => {
              const collectionLinks = json.collections.map((c) => {
                const a = document.createElement('a');
                a.href = '/collections/' + c.handle;
                a.textContent = c.title;
                return a.outerHTML;
              });

              return collectionLinks.join(', ');
            },
          },
          tags: { selector: this.tagsSelector, label: 'Tags', content: (json) => json.product.tags || 'N/A' },
          'short-description': {
            selector: this.shortDescriptionSelector,
            label: 'Short Description',
            content: (json) => json.product.description,
          },
        };

        Object.values(elements).forEach((element) => (element.selector.innerHTML = ''));

        this.compareItems.forEach((item) => {
          const element = elements[item];
          if (!element) return;

          const th = document.createElement('th');
          th.classList.add('dbtfy-compare-table__sticky-col', 'dbtfy-compare-table__th');
          th.innerHTML = element.label;
          element.selector.appendChild(th);

          this.items.forEach(({ json }) => {
            const td = document.createElement('td');
            td.classList.add('dbtfy-compare-table__td');

            const content = element.content(json);
            if (content instanceof Node) {
              td.appendChild(content);
            } else {
              td.innerHTML = content;
            }

            element.selector.appendChild(td);
          });
        });
      }

      draweCount() {
        if (this.drawer_title && this.drawer_title.includes('count')) {
          this.heading.innerHTML = this.drawer_title.replaceAll('{count}', this.items.length);
        }
      }

      removeItem(url) {
        this.items = this.items.filter((item) => item.url !== url);
        Fastify.compare = Fastify.compare.filter((url) => url !== this.url);

        this.updateDrawer();
      }

      async addItem(url) {
        await this.fetchItem(url);
        this.updateDrawer();
      }

      async fetchItem(url) {
        try {
          let data = await Fastify.fetchProductMarkup(`${url}?view=internal-compare`);
          if (data) {
            this.items.push({
              url,
              json: JSON.parse(data),
            });
          } else {
            this.removeItem(url);
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

if (!customElements.get('dbtfy-quick-compare-count')) {
  customElements.define(
    'dbtfy-quick-compare-count',
    class extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.quickCompareBubblecount();
        subscribe(PUB_SUB_EVENTS.compareUpdate, () => {
          this.quickCompareBubblecount();
        });
      }

      quickCompareBubblecount() {
        if (this.querySelector('span')) {
          this.querySelector('span').innerHTML = Fastify.compare.length;
        }
      }
    }
  );
}

if (!customElements.get('dbtfy-quick-compare')) {
  customElements.define(
    'dbtfy-quick-compare',
    class extends HTMLElement {
      constructor() {
        super();
        this.items = [];
        this.compareItems = this.dataset.compareItems.split(',') || [];
        this.titleSelector = this.querySelector('.dbtfy-compare-table__row[data-type="title"]');
        this.priceSelector = this.querySelector('.dbtfy-compare-table__row[data-type="price"]');
        this.imageSelector = this.querySelector('.dbtfy-compare-table__row[data-type="image"]');
        this.typeSelector = this.querySelector('.dbtfy-compare-table__row[data-type="type"]');
        this.vendorSelector = this.querySelector('.dbtfy-compare-table__row[data-type="vendor"]');
        this.collectionsSelector = this.querySelector('.dbtfy-compare-table__row[data-type="collections"]');
        this.tagsSelector = this.querySelector('.dbtfy-compare-table__row[data-type="tags"]');
        this.shortDescriptionSelector = this.querySelector('.dbtfy-compare-table__row[data-type="short-description"]');
      }

      connectedCallback() {
        this.init();

        subscribe(PUB_SUB_EVENTS.compareUpdate, async ({ url, checked }) => {
          this.updateComaprelistCount();
          if (checked) {
            await this.addItem(url);
          } else {
            this.removeItem(url);
          }
        });
      }

      init() {
        this.updateComaprelistCount();
        // Use Promise.all to wait for all fetch operations to complete
        const fetchPromises = Fastify.compare.map(async (url) => {
          await this.fetchItem(url);
        });

        Promise.all(fetchPromises).then(() => {
          this.updateCompareSection();
        });
      }

      updateComaprelistCount() {
        if (Fastify.compare.length > 0) {
          if (this.classList.contains('dbtfy-compare--has-items-empty')) {
            this.classList.remove('dbtfy-compare--has-items-empty');
          }
        } else {
          this.classList.add('dbtfy-compare--has-items-empty');
        }
      }

      updateCompareSection() {
        const elements = {
          title: {
            selector: this.titleSelector,
            label: 'Title',
            content: (json) => {
              const a = document.createElement('a');
              a.href = '/products/' + json.product.handle;
              a.innerHTML = json.product.title;
              return a;
            },
          },
          price: { selector: this.priceSelector, label: 'Price', content: (json) => json.product.price },
          image: {
            selector: this.imageSelector,
            label: 'Image',
            content: (json) => {
              const a = document.createElement('a');
              a.href = '/products/' + json.product.handle;

              const img = document.createElement('img');
              img.src = json.product.featured_image;
              img.alt = json.product.title;

              a.appendChild(img);

              return a;
            },
          },
          type: { selector: this.typeSelector, label: 'Type', content: (json) => json.product.type },
          vendor: { selector: this.vendorSelector, label: 'Vendor', content: (json) => json.product.vendor },
          collections: {
            selector: this.collectionsSelector,
            label: 'Collections',
            content: (json) => {
              const collectionLinks = json.collections.map((c) => {
                const a = document.createElement('a');
                a.href = '/collections/' + c.handle;
                a.textContent = c.title;
                return a.outerHTML;
              });

              return collectionLinks.join(', ');
            },
          },
          tags: { selector: this.tagsSelector, label: 'Tags', content: (json) => json.product.tags },
          'short-description': {
            selector: this.shortDescriptionSelector,
            label: 'Short Description',
            content: (json) => json.product.description,
          },
        };

        Object.values(elements).forEach((element) => (element.selector.innerHTML = ''));

        this.compareItems.forEach((item) => {
          const element = elements[item];
          if (!element) return;

          const th = document.createElement('th');
          th.classList.add('dbtfy-compare-table__sticky-col', 'dbtfy-compare-table__th');
          th.innerHTML = element.label;
          element.selector.appendChild(th);

          this.items.forEach(({ json }) => {
            const td = document.createElement('td');
            td.classList.add('dbtfy-compare-table__td');

            const content = element.content(json);
            if (content instanceof Node) {
              td.appendChild(content);
            } else {
              td.innerHTML = content;
            }

            element.selector.appendChild(td);
          });
        });
      }

      removeItem(url) {
        this.items = this.items.filter((item) => item.url !== url);
        this.updateCompareSection();
      }

      async addItem(url) {
        await this.fetchItem(url);
        this.updateCompareSection();
      }

      async fetchItem(url) {
        try {
          let data = await Fastify.fetchProductMarkup(`${url}?view=internal-compare`);
          if (data) {
            this.items.push({
              url,
              json: JSON.parse(data),
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
