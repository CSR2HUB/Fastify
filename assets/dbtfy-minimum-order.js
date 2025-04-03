if (!customElements.get('dbtfy-minimum-order')) {
  customElements.define(
    'dbtfy-minimum-order',
    class extends HTMLElement {
      connectedCallback() {
        this.data = Fastify.widgets['dbtfy-minimum-order'];

        this.event = this.data ? this.dataGet() : false;

        if (this.event) {
          const cartTotal = parseFloat(this.dataset.cartTotal) / 100;
          const minimumTotal = parseFloat(this.data.dbtfy_minimum_order_amount);

          if (cartTotal < minimumTotal) {
            this.querySelector('.dbtfy-minimum-order--message').innerHTML = this.querySelector(
              '.dbtfy-minimum-order--message'
            ).innerHTML.replaceAll('{amount}', `${Fastify.currency.symbol}${(minimumTotal - cartTotal).toFixed(2)}`);
            this.querySelector('.dbtfy-minimum-order--message').classList.remove('hidden');
            this.querySelector('.dbtfy-minimum-order--achieve_message').classList.add('hidden');
            Fastify.checkout['dbtfy-minimum-order'] = false;
            checkoutButtonHandler();
          } else {
            this.querySelector('.dbtfy-minimum-order--message').classList.add('hidden');
            this.querySelector('.dbtfy-minimum-order--achieve_message').classList.remove('hidden');
            Fastify.checkout['dbtfy-minimum-order'] = true;
            checkoutButtonHandler();
          }
        } else {
          this.remove();
        }
      }

      dataGet() {
        if (this.data.dbtfy_minimum_order_amount !== '' && this.data.dbtfy_minimum_order_heading_text !== '') {
          this.querySelector('.material-icon').setAttribute('data-icon', this.data.dbtfy_minimum_order_icon);
          this.querySelector('.dbtfy-minimum-order--message').innerHTML = this.data.dbtfy_minimum_order_message;
          this.querySelector('.dbtfy-minimum-order--achieve_message').innerHTML =
            this.data.dbtfy_minimum_order_achieve_message;

          return true;
        } else {
          return false;
        }
      }
    }
  );
}
