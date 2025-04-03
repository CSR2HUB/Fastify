if (!customElements.get('announcement-bar')) {
  customElements.define(
    'announcement-bar',
    class extends HTMLElement {
      constructor() {
        super();
        this.colLength = this.querySelectorAll(this.dataset.selectorLength).length;
        this.sliderButtons = this.querySelectorAll(this.dataset.selectorArrow);
        this.slider = this.querySelector('dbtfy-slider-component');
        this.gridClass = this.querySelector('.page-width');
        this.everywhere = this.querySelector('.slider--everywhere');
        this.init();
      }

      init() {
        const announcement_left = this.querySelector('.announcement-bar-left');
        const announcement_right = this.querySelector('.announcement-bar-right');
        const announcement_contents = this.querySelector('.announcement-contents');
        let slideCount = 0;
        if (this.slider) {
          const slides = this.slider.querySelectorAll('.slideshow__slide');
          slideCount = slides.length;
        }

        this.removeEmptyAnnouncement(announcement_left);
        this.removeEmptyAnnouncement(announcement_right);

        let grid_size = this.determineGridSize(slideCount, announcement_contents);
        if (grid_size != 3) {
          this.gridClass.classList.remove('utility-bar__grid--3-col');
          this.gridClass.classList.add(`utility-bar__grid--${grid_size}-col`);
        }
      }

      removeEmptyAnnouncement(announcement) {
        if (announcement && announcement.textContent.trim() === '') {
          announcement.remove();
        }
      }

      determineGridSize(slideCount, announcement_contents) {
        let grid_size = 3;

        if (slideCount === 0) {
          grid_size = 2;
        } else if (announcement_contents.children.length === 1) {
          grid_size = 1;
        }

        return grid_size;
      }
    }
  );
}
