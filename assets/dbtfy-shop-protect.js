if (!customElements.get('dbtfy-shop-protect')) {
  customElements.define(
    'dbtfy-shop-protect',
    class DbtfyshopProtect extends HTMLElement {
      constructor() {
        super();
        this.init();
      }

      init() {
        this.protect = Fastify.widgets['shop-protect'];
        this.artical_text = this.protect.dbtfy_shop_protect_disable_article_text_copy;
        this.best_selling = this.protect.dbtfy_shop_protect_disable_best_selling;
        this.image_copy = this.protect.dbtfy_shop_protect_disable_images_copy;
        this.product_text = this.protect.dbtfy_shop_protect_disable_product_text_copy;
        this.image_dragging = this.protect.dbtfy_shop_protect_images_dragging;

        this.articalText = document.querySelector('.article-template');
        this.blogText = document.querySelector('.main-blog');
        this.description = document.querySelector('.product__description');
        this.bestSelling = document.querySelector("#SortBy option[value='best-selling']");
        this.productText = document.querySelectorAll('.product .product__description');
        this.image = document.querySelectorAll('img');

        if (this.protect) {
          this.initProtection();
        }

        this.unsubscribeEvent = subscribe(PUB_SUB_EVENTS.cartUpdate, (e) => {
          setTimeout(() => {
            this.init();
          }, 100);
        });
      }

      disableTextCopying(element) {
        if (element) {
          if (element instanceof NodeList || Array.isArray(element)) {
            element.forEach((el) => el.classList.add('dbtfy-shop-protect'));
          } else {
            element.classList.add('dbtfy-shop-protect');
          }
        }
      }

      disableImageDragging(element) {
        if (element) {
          element.forEach((img) => {
            img.setAttribute('ondragstart', 'return false');
            img.setAttribute('draggable', 'false');
          });
        }
      }

      disableImageCopy(element) {
        if (element) {
          element.forEach((img) => {
            img.addEventListener('contextmenu', (e) => {
              this.protect && e.preventDefault();
            });
          });
        }
      }

      initProtection() {
        if (this.artical_text && this.articalText) {
          this.disableTextCopying(this.articalText);
        }
        if (this.artical_text && this.blogText) {
          this.disableTextCopying(this.blogText);
        }

        if (this.image_dragging && this.image.length > 0) {
          this.disableImageDragging(this.image);
        }

        if (this.image_copy && this.image.length > 0) {
          this.disableImageCopy(this.image);
        }

        if (this.product_text && this.productText.length > 0) {
          this.disableTextCopying(this.productText);
        }

        if (this.best_selling && this.bestSelling) {
          this.bestSelling.remove();
        }
      }
    }
  );
}
