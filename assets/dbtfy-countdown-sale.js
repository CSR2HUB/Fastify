if (!customElements.get('dbtfy-countdown')) {
  customElements.define(
    'dbtfy-countdown',
    class DbtfyCountdown extends HTMLElement {
      constructor() {
        super();

        if (!this.dataset.time.length && !(this.dataset.infiniteMinute && this.dataset.infiniteMinute != 0)) {
          this.innerHTML = 'Please add the unix time in the settings';
        }

        this.hideOnExpired = this.dataset.hideOnExpired === 'true';
        this.sectionIdSelector = this.dataset.sectionId;

        let countDownDate = Number(this.dataset.time) * 1000;
        if (this.dataset.infiniteMinute && this.dataset.infiniteMinute != 0) {
          console.log('infiniteMinute', this.dataset.infiniteMinute);
          countDownDate = this.addMinutesToCurrentTimestamp(Number(this.dataset.infiniteMinute));
        }

        const countDownInterval = setInterval(() => {
          const now = new Date().getTime();
          const distance = countDownDate - now;

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const sec = Math.floor((distance % (1000 * 60)) / 1000);

          this.querySelector('[data-days]').innerHTML = `${days} <em>${this.dataset.textDays}</em>`;
          this.querySelector('[data-hours]').innerHTML = `${hours} <em>${this.dataset.textHours}</em>`;
          this.querySelector('[data-min]').innerHTML = `${min} <em>${this.dataset.textMin}</em>`;
          this.querySelector('[data-sec]').innerHTML = `${sec} <em>${this.dataset.textSec}</em>`;

          if (distance < 0) {
            if (this.hideOnExpired && this.sectionIdSelector) {
              clearInterval(countDownInterval);
              document.querySelector(this.sectionIdSelector).classList.add('hidden');
            }
            if (this.dataset.infiniteMinute) {
              countDownDate = this.addMinutesToCurrentTimestamp(Number(this.dataset.infiniteMinute));
            } else {
              clearInterval(countDownInterval);
              this.innerHTML = this.dataset.textExpired;
              this.classList.add('expired');
            }
          }
        }, 1000);
      }

      addMinutesToCurrentTimestamp(minutes) {
        const currentTimestamp = Math.floor(Date.now());
        const minutesInMilliseconds = minutes * 60 * 1000;
        const newTimestamp = currentTimestamp + minutesInMilliseconds;

        return newTimestamp;
      }
    }
  );
}
