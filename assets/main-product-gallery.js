if (!customElements.get('main-product-gallery')) {
  customElements.define(
    'main-product-gallery',
    class MainProductGallery extends HTMLElement {
      constructor() {
        super();

        this.mainCarouselSelector = '#main-carousel';
        this.thumbnailCarouselSelector = '#thumbnail-carousel';

        this.init();
        this.syncedVariantImage = this.dataset.syncedVariantImage;
      }

      connectedCallback() {
        subscribe(PUB_SUB_EVENTS.variantChange, this.handleVariantChange.bind(this));
      }

      init() {
        this.mainSlider = new Splide(this.querySelector(this.mainCarouselSelector), {
          type: 'loop',
          rewind: true,
          pagination: false,
          arrows: false,
          autoHeight: true,
          perPage: 1,
          heightRatio: 1,
        });

        if (window.matchMedia('(max-width: 600px)').matches) {
          if (this.querySelector(this.thumbnailCarouselSelector).dataset.showArrowsMobile === 'hide') {
            this.querySelector(this.thumbnailCarouselSelector).classList.add('hidden');
          } else {
            this.querySelector(this.thumbnailCarouselSelector).classList.remove('hidden');
          }
        }

        this.thumbnailSlider = new Splide(this.querySelector(this.thumbnailCarouselSelector), {
          perPage: 5,
          gap: 10,
          pagination: false,
          dragMinThreshold: 10,
          isNavigation: true,
          arrows: this.querySelector(this.thumbnailCarouselSelector).dataset.showArrows === 'true',
          breakpoints: {
            600: {
              destroy: this.querySelector(this.thumbnailCarouselSelector).dataset.showArrowsMobile === 'hide',
            },
          },
          classes: {
            arrow: 'slider-button splide__arrow',
          },
        });

        this.mainSlider.sync(this.thumbnailSlider);
        this.mainSlider.mount();
        this.thumbnailSlider.mount();
      }

      handleVariantChange({ data: { variant } }) {
        if (!variant.featured_media || this.syncedVariantImage !== 'true') return;

        const variantFeaturedMediaId = variant.featured_media.id;

        let mediaPosition = this.querySelector(this.thumbnailCarouselSelector)?.querySelector(
          "[data-media-id='" + `${variantFeaturedMediaId}` + "']"
        )?.dataset.position;

        if (mediaPosition) {
          mediaPosition = parseInt(mediaPosition) - 1;
          this.thumbnailSlider?.go(mediaPosition);
        }
      }
    }
  );
}
