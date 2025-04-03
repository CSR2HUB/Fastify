{
  /*
     <dbtfy-slider-component
        data-autoplay="true"                              // true or false
        data-speed="5"                                    // in seconds
        data-loop="true"                                  // true or false

        data-arrows="true"                                // true or false
        data-arrows-selector="common"                     // common or custom
        data-next-selector=".next"                        // selector if arrows-selector is custom
        data-prev-selector=".prev"                        // selector if arrows-selector is custom

        data-dots="true"                                  // true or false

        data-controls-position="inside"                   // inside or outside - default is outside
        data-controls-class="slider-buttons"              // class name for controls wrapper - default is slider-buttons
      >
   */
}
class DbtfySliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');
    if (!this.slider) return;

    this.debug = this.dataset.debug === 'true';

    this.currentPage = 1;
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.totalPages = 0;
    this.currentPageElement = this.querySelector('.slider-counter--current');
    this.pageTotalElement = this.querySelector('.slider-counter--total');

    this.initPages();

    const resizeObserver = new ResizeObserver(() => {
      this.initPages();
      this.connectedCallback();
    });

    resizeObserver.observe(this.slider);

    this.slider.addEventListener('scroll', this.update.bind(this));

    this.autoPlay = this.dataset.autoplay === 'true';
    this.autoplaySpeed = this.dataset.speed * 1000 || 5000;
    this.loop = this.dataset.loop === 'true';

    this.arrows = this.dataset.arrows === 'true';
    this.dots = this.dataset.dots === 'true';

    this.controlsPosition = this.dataset.controlsPosition || 'bottom';
    this.controlsClass = this.dataset.controlsClass || 'slider-buttons';
  }

  connectedCallback() {
    if (this.controlsPosition === 'inside') {
      const controls = this.querySelector(`.${this.controlsClass}`);
      if (controls) {
        if (!controls.classList.contains('slideshow__controls--top')) {
          controls.style.position = 'relative';
        }
        const height = this.querySelector('.slider-buttons').offsetHeight;
        let slider = this.querySelector('.slider');
        let sliderMarginBottom = 0 + 'px';

        if (slider) {
          sliderMarginBottom = window.getComputedStyle(slider).getPropertyValue('margin-bottom');
        }

        let item = this.querySelector('.grid__item');
        let itemPaddingBottom = 0 + 'px';
        if (item) {
          itemPaddingBottom = window.getComputedStyle(item).getPropertyValue('padding-bottom');
        }

        controls.style.marginTop =
          'calc(0px - (' + height + 'px + ' + sliderMarginBottom + ' + ' + itemPaddingBottom + '))';
      }
    }

    if (this.autoPlay && this.totalPages > 1) {
      this.play();
    }
    if (this.arrows && this.totalPages > 1) {
      this.initializeArrows();
    }
    if (this.dots && this.totalPages > 1) {
      this.initializeDots();
    }
  }

  update() {
    if (!this.slider) return;

    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

    if (this.dots) this.handleDotState();

    if (this.arrows && !this.loop && this.prevButton && this.nextButton) {
      if (this.currentPage === 1) {
        this.prevButton.setAttribute('disabled', 'true');
      } else {
        this.prevButton.removeAttribute('disabled');
      }

      if (this.currentPage === this.totalPages) {
        this.nextButton.setAttribute('disabled', 'true');
      } else {
        this.nextButton.removeAttribute('disabled');
      }
    }
  }

  handleDotState() {
    if (!this.dotsWrapper) return;

    const dots = this.dotsWrapper.querySelectorAll('.slider-counter__link--dots');
    dots.forEach((dot) => {
      dot.classList.remove('slider-counter__link--active');
      if (dot.getAttribute('data-slide') == this.currentPage) {
        dot.classList.add('slider-counter__link--active');
      }
    });
  }

  initializeDots() {
    this.dotsWrapper = this.querySelector('.slideshow__control-wrapper');
    if (!this.dotsWrapper) return;

    this.dotsWrapper.innerHTML = '';
    for (let i = 1; i <= this.totalPages; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-counter__link', 'slider-counter__link--dots', 'link');
      dot.setAttribute('data-slide', i);
      dot.setAttribute('aria-label', 'Slide ' + i);
      const span = document.createElement('span');
      span.classList.add('dot');
      dot.appendChild(span);
      dot.addEventListener('click', (e) => {
        this.goToSlide(i);
      });
      this.dotsWrapper.appendChild(dot);
    }

    this.dotsWrapper.parentElement.classList.remove('hidden');
    this.handleDotState();
  }

  initializeArrows() {
    this.arrowsSelector = this.dataset.arrowsSelector | 'common';
    this.nextSelector = this.dataset.nextSelector;
    this.prevSelector = this.dataset.prevSelector;

    if (this.nextSelector && this.prevSelector && this.arrowsSelector === 'custom') {
      this.prevButton = document.querySelector(this.prevSelector);
      this.nextButton = document.querySelector(this.nextSelector);
    } else {
      this.prevButton = this.querySelector('button[name="previous"]');
      this.nextButton = this.querySelector('button[name="next"]');
    }

    if (!this.prevButton || !this.nextButton) return;

    this.prevButton.classList.remove('hidden');
    this.nextButton.classList.remove('hidden');

    if (this.prevButton) this.prevButton.addEventListener('click', this.goToPreviousSlide.bind(this));
    if (this.nextButton) this.nextButton.addEventListener('click', this.goToNextSlide.bind(this));
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter((element) => element.clientWidth > 0);
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
    this.slidesPerPage = Math.floor(
      (this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset
    );
    if (this.sliderItemsToShow[0].offsetLeft > 0) {
      this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    } else {
      this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage;
    }

    this.update();
  }

  resetPages() {
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }

  setSlidePosition(position) {
    this.slider.scrollTo({
      left: position,
    });
  }

  play() {
    clearInterval(this.autoplay);
    this.autoplay = setInterval(this.goToNextSlide.bind(this), this.autoplaySpeed);
  }

  goToNextSlide() {
    if (this.currentPage === this.totalPages && this.loop) {
      this.goToSlide(1);
      return;
    }

    this.goToSlide(this.currentPage + 1);
  }

  goToPreviousSlide() {
    if (this.currentPage === 1 && this.loop) {
      this.goToSlide(this.totalPages);
      return;
    }

    this.goToSlide(this.currentPage - 1);
  }

  goToSlide(slideNumber) {
    this.slideScrollPosition = (slideNumber - 1) * this.sliderItemOffset;
    this.setSlidePosition(this.slideScrollPosition);
  }
}

customElements.define('dbtfy-slider-component', DbtfySliderComponent);
