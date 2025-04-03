if (!customElements.get('dbtfy-lookbook')) {
  customElements.define(
    'dbtfy-lookbook',
    class DbtfyLookBook extends HTMLElement {
      constructor() {
        super();
        this.lookBookItems = this.querySelectorAll('.dbtfy-lookbook-point-list-item');
        this.init();
      }

      init() {
        this.lookBookItems.forEach((elem) => {
          this.handleTooltip(elem);
        });
      }

      handleTooltip(elem) {
        const btn = elem.querySelector('button');
        const tooltip = elem.querySelector('.dbtfy-tooltip');

        const update = () => {
          window.FloatingUIDOM.computePosition(btn, tooltip, {
            middleware: [window.FloatingUIDOM.offset(0), window.FloatingUIDOM.autoPlacement()],
          }).then(({ x, y }) => {
            Object.assign(tooltip.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          });
        };

        const showTooltip = () => {
          tooltip.classList.add('show');
          update();
        };

        const hideTooltip = () => {
          setTimeout(() => {
            tooltip.classList.remove('show');
            tooltip.classList.add('hiding');
            setTimeout(() => {
              tooltip.classList.remove('hiding');
            }, 200);
          }, 100);
        };

        if (window.matchMedia('(pointer: coarse)').matches) {
          [
            ['mouseenter', showTooltip],
            ['mouseleave', hideTooltip],
            ['focus', showTooltip],
            ['blur', hideTooltip],
          ].forEach(([event, listener]) => {
            btn.addEventListener(event, listener);
          });
        } else {
          [
            ['focus', showTooltip],
            ['blur', hideTooltip],
          ].forEach(([event, listener]) => {
            btn.addEventListener(event, listener);
          });
        }
      }
    }
  );
}
