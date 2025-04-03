if (!customElements.get('progress-bar')) {
  customElements.define(
    'progress-bar',
    class ProgressBar extends HTMLElement {
      constructor() {
        super();
        this.type = this.dataset.type;
        this.pie = this.querySelector('.pie');
        this.leftSide = this.querySelector('.left-side');
        this.rightSide = this.querySelector('.right-side');
        this.shadow = this.querySelector('.shadow');
        this.num = this.querySelector('.num');
        this.percent = Number(this.num.textContent);
      }

      connectedCallback() {
        this.initChart();
      }

      initChart() {
        console.log(this.type);
        this.percent = Math.round(this.percent);
        var deg = Math.round(360 * (this.percent / 100));

        if (this.percent > 50) {
          this.pie.style.clip = 'rect(auto, auto, auto, auto)';
          this.rightSide.style.transform = 'rotate(180deg)';
        } else {
          this.pie.style.clip = 'rect(0, 5em, 5em, 2.5em)';
          this.rightSide.style.transform = 'rotate(0deg)';
        }
        if (this.type == 'donut-chart') {
          this.rightSide.style.borderWidth = '0.5em';
          this.leftSide.style.borderWidth = '0.5em';
          this.shadow.style.borderWidth = '0.5em';
        } else {
          this.rightSide.style.borderWidth = '2.5em';
          this.leftSide.style.borderWidth = '2.5em';
          this.shadow.style.borderWidth = '2.5em';
        }
        this.leftSide.style.transform = 'rotate(' + deg + 'deg)';
      }
    }
  );
}
