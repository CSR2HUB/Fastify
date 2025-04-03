if (!customElements.get('dbtfy-cart-favicon')) {
  customElements.define(
    'dbtfy-cart-favicon',
    class CartFavicon extends HTMLElement {
      constructor() {
        super();
        this.faviconUrl = this.dataset.cartFavicon;
        this.errorFaviconUrl = this.dataset.errorFavicon;
        this.errorDuration = parseInt(this.dataset.errorDuration) * 1000;
        this.badgeStyle = this.dataset.badgeStyle;
        this.badgePosition = this.dataset.badgePosition;
        this.badgeBgColor = this.dataset.badgeBgColor;
        this.badgeTextColor = this.dataset.badgeTextColor;
        this.currentItemCount = 0;
      }

      connectedCallback() {
        this.updateBadgeOnLoad();

        this.faviconEvent = subscribe(PUB_SUB_EVENTS.cartUpdate, (e) => {
          setTimeout(() => {
            this.updateBadgeOnCartChange();
            if (Fastify.cart.item_count == 0) {
              this.removeFavicon();
            }
          }, 500);
        });

        subscribe(PUB_SUB_EVENTS.cartError, () => {
          this.setErrorFavicon();
        });
      }

      updateBadgeOnLoad() {
        if (typeof Fastify !== 'undefined' && Fastify.cart) {
          const itemCount = Fastify.cart.item_count;
          this.currentItemCount = itemCount;
          this.checkAndUpdateBadge();
        }
      }

      updateBadgeOnCartChange() {
        if (typeof Fastify !== 'undefined' && Fastify.cart) {
          const newCount = Fastify.cart.item_count;

          if (newCount !== this.currentItemCount) {
            this.currentItemCount = newCount;
            this.checkAndUpdateBadge();
          }
        }
      }

      updateCount() {
        let totalItemCount = this.currentItemCount;
        let itemCount;
        Fastify.cart.items.forEach((item) => {
          if (item.properties && item.properties._showProduct == 'false') {
            totalItemCount -= 1;
          }
        });

        itemCount = totalItemCount;
        return itemCount;
      }

      checkAndUpdateBadge() {
        if (typeof Fastify !== 'undefined' && Fastify.cart) {
          const count = Fastify.cart.item_count;

          if (count > 0) {
            this.setFaviconWithBadge(this.updateCount());
          } else {
            this.removeFavicon();
          }
        }
      }

      setFaviconWithBadge(count) {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = this.faviconUrl;

        img.onload = () => {
          const size = 32;
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, size, size);

          // Badge styles
          ctx.fillStyle = this.badgeBgColor;
          const badgeSize = 16;
          const offset = 4;

          let x, y;
          switch (this.badgePosition) {
            case 'top-left':
              x = offset;
              y = size - badgeSize - offset;
              break;
            case 'bottom-right':
              x = size - badgeSize - offset;
              y = offset;
              break;
            case 'bottom-left':
              x = offset;
              y = offset;
              break;
            case 'top-right':
              x = size - badgeSize - offset;
              y = size - badgeSize - offset;
              break;
            default:
              x = size - badgeSize - offset;
              y = offset;
              break;
          }

          if (this.badgeStyle === 'square') {
            ctx.beginPath();
            ctx.arc(x + badgeSize / 2, y + badgeSize / 2, badgeSize / 2, 0, 2 * Math.PI);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, badgeSize, badgeSize);
          }

          ctx.fillStyle = this.badgeTextColor;
          ctx.font = `bold ${badgeSize / 1.5}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(count, x + badgeSize / 2, y + badgeSize / 2);

          const favicon = this.getOrCreateFavicon();
          favicon.href = canvas.toDataURL('image/png');
        };
      }

      setErrorFavicon() {
        const favicon = this.getOrCreateFavicon();
        favicon.href = this.errorFaviconUrl;

        setTimeout(() => {
          favicon.href = this.faviconUrl;
        }, this.errorDuration);
      }

      removeFavicon() {
        const favicon = this.getOrCreateFavicon();
        const defaultFavicon = Fastify.settings.favicon;
        favicon.href = defaultFavicon;
      }

      getOrCreateFavicon() {
        let favicon = document.querySelector("link[rel='icon']");
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          favicon.type = 'image/png';
          document.head.appendChild(favicon);
        }
        return favicon;
      }
    }
  );
}
