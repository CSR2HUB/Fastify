if (!customElements.get('dbtfy-cart-delivery-calendar')) {
  customElements.define(
    'dbtfy-cart-delivery-calendar',
    class DbtfyCartDeliveryCalendar extends HTMLElement {
      constructor() {
        super();
        this.data = Fastify.widgets['dbtfy-delivery-date'];
        this.init();
      }

      init() {
        if (this.data.length === 0) {
          this.remove();
          return;
        }

        if (this.data.dbtfy_delivery_date_required_checkout) {
          Fastify.checkout['dbtfy-delivery-date'] = false;
          checkoutButtonHandler();
        }

        const { Calendar } = window.VanillaCalendarPro;

        const iniDate = this.formateDate(Fastify.cart.attributes.delivery_date);

        if (iniDate && iniDate !== 'NaN-NaN-NaN') {
          this.current_day = iniDate;
          const date = new Date(this.current_day);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);
          this.querySelector('.dbtfy-cart-delivery-calendar-show').textContent = formattedDate;
          if (this.data.dbtfy_delivery_date_required_checkout) {
            Fastify.checkout['dbtfy-delivery-date'] = true;
            checkoutButtonHandler();
          }
        } else {
          this.current_day = new Date().toISOString().split('T')[0];
        }

        this.day = new Date().toISOString().split('T')[0];

        const disabledDaysList = this.data.dbtfy_delivery_date_exclude_days
          .split(',')
          .map((day) => day.trim().toUpperCase());

        // Mapping days to numbers for VanillaCalendar
        const dayMap = {
          SUN: 0,
          MON: 1,
          TUE: 2,
          WED: 3,
          THU: 4,
          FRI: 5,
          SAT: 6,
        };

        const disabledDays = disabledDaysList.map((day) => dayMap[day]);

        const options = {
          onClickDate: (self, event) => {
            const selectedDate = event.target.ariaLabel;
            if (selectedDate) {
              this.handleDateSelection(selectedDate);
            }
          },
          selectedTheme: 'light',
          dateMin: this.day,
          dateToday: this.current_day,
          disableDates: this.getDisabledDates(disabledDays),
          displayDateMax: new Date(new Date().getFullYear() + 100, 11, 31).toISOString().split('T')[0],
        };

        this._calendar = this.querySelector('.dbtfy-calendar');
        this.calendar = new Calendar(this._calendar, options);
        this.calendar.init();
      }

      // Return an array of dates to disable
      getDisabledDates(disabledDays) {
        const disabledDates = [];
        const startDate = new Date();
        const currentYear = new Date().getFullYear();
        const endDate = new Date(currentYear + 100, 11, 31);

        // Loop through all days in the year to find disabled days
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
          const dayOfWeek = date.getDay();
          if (disabledDays.includes(dayOfWeek)) {
            const disabledDate = date.toISOString().split('T')[0];
            disabledDates.push(disabledDate);
          }
        }

        return disabledDates;
      }

      // date select after all places in date set
      handleDateSelection(selectedDate) {
        this.querySelector('.dbtfy-cart-delivery-calendar-show').textContent = selectedDate;

        this.updateCartDeliveryDate(selectedDate);
        this.calendar.dateToday = this.formateDate(selectedDate);
      }

      formateDate(selectedDate) {
        const date = new Date(selectedDate);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
      }

      // update cart on delivery change
      async updateCartDeliveryDate(deliveryDate) {
        const cartUpdateData = {
          attributes: {
            delivery_date: deliveryDate,
          },
        };

        try {
          const response = await fetch(`${window.routes.cart_update_url}.js`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartUpdateData),
          });

          const cart = await response.json();
          publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: cart });
          if (this.data.dbtfy_delivery_date_required_checkout) {
            Fastify.checkout['dbtfy-delivery-date'] = true;
            checkoutButtonHandler();
          }
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    }
  );
}
