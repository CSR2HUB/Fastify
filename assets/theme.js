document.addEventListener('DOMContentLoaded', function () {
  // const x = document.querySelectorAll('.dbtfy-show-second-image-on-hover');
  // console.log('🚀 ~ x:', x);
  // x.forEach((e) => {
  //   e.remove();
  // });

  // const y = document.querySelectorAll('.dbtfy-ratio');
  // y.forEach((e) => {
  //   console.log(e);
  //   e.style.setProperty('--ratio-percent', '70%');
  // });

  subscribe(PUB_SUB_EVENTS.cartUpdate, function (cart) {
    if (cart.source === 'cart-items') {
      Fastify.cart = cart.cartData;
    } else if (cart.source === 'product-form') {
      if (Fastify.settings.dbtfy_skip_cart) {
        // removed.href = '/checkout';
      } else {
        fetch(`${routes.cart_url}.js`)
          .then((response) => response.json())
          .then((response) => {
            Fastify.cart = response;
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  });
});
