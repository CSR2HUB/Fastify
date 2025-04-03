if (!customElements.get('dbtfy-cart-countdown-timer')) {
  customElements.define(
    'dbtfy-cart-countdown-timer',
    class DbtfyCartCountdownTimer extends HTMLElement {
      constructor() {
        super();

        this.timerSetting =
          Fastify.widgets['cart_countdown_timer'].length > 0 ? Fastify.widgets['cart_countdown_timer'][0] : null;

        if (!this.timerSetting) return;

        this.duration = this.timeToSeconds(
          this.timerSetting.hours,
          this.timerSetting.minutes,
          this.timerSetting.seconds
        );

        this.storageKey = 'dbtfy_cart_countdown';
        this.timeRemaining = this.getStoredTime() || this.duration;
      }

      timeToSeconds(hours, minutes, seconds) {
        const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
        return totalSeconds;
      }

      getStoredTime() {
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) return null;

        const { expiry } = JSON.parse(stored);
        const now = new Date().getTime();

        if (now >= expiry) {
          localStorage.removeItem(this.storageKey);
          return null;
        }

        return Math.floor((expiry - now) / 1000);
      }

      setStoredTime() {
        const now = new Date().getTime();
        const expiry = now + this.timeRemaining * 1000;

        localStorage.setItem(
          this.storageKey,
          JSON.stringify({
            timeRemaining: this.timeRemaining,
            expiry,
          })
        );
      }

      connectedCallback() {
        if (!this.timerSetting) {
          this.remove();
          return;
        }

        this.timerSetting.text = Fastify.replaceVariables(this.timerSetting.text, {
          hours: '<span class="dbtfy-cart-countdown__hours">' + this.timerSetting.hours + '</span>',
          minutes: '<span class="dbtfy-cart-countdown__minutes">' + this.timerSetting.minutes + '</span>',
          seconds: '<span class="dbtfy-cart-countdown__seconds">' + this.timerSetting.seconds + '</span>',
        });

        if (this.timerSetting?.custom_icon != '') {
          this.querySelector('.material_icon').remove();
        } else {
          this.querySelector('.custom_icon').remove();
        }

        this.innerHTML = Fastify.replaceVariables(this.innerHTML, {
          message: this.timerSetting.text,
          icon: this.timerSetting.icon,
          custom_icon: this.timerSetting?.custom_icon_tag,
          alignment: this.timerSetting.alignment,
        });

        this.hoursElement = this.querySelector('.dbtfy-cart-countdown__hours');
        this.minutesElement = this.querySelector('.dbtfy-cart-countdown__minutes');
        this.secondsElement = this.querySelector('.dbtfy-cart-countdown__seconds');

        this.timeRemaining = this.getStoredTime() || this.duration;
        this.startTimer();

        this.classList.remove('hidden');
      }

      disconnectedCallback() {
        if (this.interval) {
          clearInterval(this.interval);
        }
      }

      startTimer() {
        this.updateDisplay();
        this.setStoredTime();

        this.interval = setInterval(() => {
          this.timeRemaining--;
          this.setStoredTime();

          if (this.timeRemaining <= 0) {
            clearInterval(this.interval);
            localStorage.removeItem(this.storageKey);
            this.remove();
            return;
          }

          this.updateDisplay();
        }, 1000);
      }

      updateDisplay() {
        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;

        this.hoursElement.textContent = `${hours}`;
        this.minutesElement.textContent = `${minutes}`;
        this.secondsElement.textContent = `${seconds}`;
      }
    }
  );
}
