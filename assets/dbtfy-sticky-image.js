if (!customElements.get('dbtfy-sticky-image')) {
  customElements.define(
    'dbtfy-sticky-image',
    class DbtfyStickyImage extends HTMLElement {
      constructor() {
        super();

        this.stickyWrapper = this.querySelector('.dbtfy-sticky-image-wrapper');

        window.addEventListener('scroll', () => {
          const windowHeight = window.innerHeight;

          const top = this.getBoundingClientRect().top;
          const bottom = this.getBoundingClientRect().bottom;
          const visibilityTop = Math.round((top / windowHeight) * 100);
          const visibilityBottom = Math.round((bottom / windowHeight) * 100);
          const overlayOpacity = Number(this.stickyWrapper.dataset.overlayOpacity);
          let final = 0;

          if (visibilityTop > 0 && visibilityTop < 100) {
            final = Math.round(((100 - overlayOpacity) * visibilityTop) / 100 + overlayOpacity);
          } else if (visibilityBottom > 0 && visibilityBottom < 100) {
            final = Math.round((100 - overlayOpacity) * (1 - visibilityBottom / 100) + overlayOpacity);
          }

          if (final) this.stickyWrapper.style.setProperty('--overlay-opacity', final + '%');
        });

        const lazyVideosObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.play();
              }
            });
          },
          { rootMargin: '0px 0px 300px 0px' }
        );

        this.querySelectorAll('video[data-autoplay="true"]').forEach((el) => {
          lazyVideosObserver.observe(el);
        });
      }
    }
  );
}
