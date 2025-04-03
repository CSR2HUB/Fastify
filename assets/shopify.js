document.addEventListener('DOMContentLoaded', function () {
  // Shopify event section select
  document.addEventListener('shopify:section:select', (e) => {
    publish(PUB_SUB_EVENTS.shopifyEventSectionSelect, e);
  });

  // Shopify event section deselect
  document.addEventListener('shopify:section:deselect', (e) => {
    publish(PUB_SUB_EVENTS.shopifyEventSectionDeselect, e);
  });

  // Shopify event block select
  document.addEventListener('shopify:block:select', (e) => {
    publish(PUB_SUB_EVENTS.shopifyEventBlockSelect, e);

    // cart notification
    if (e.detail.blockId.includes('cart-notification')) {
      publish(PUB_SUB_EVENTS.cartNotificationSelect, e);
    }

    // cart reminder
    if (e.detail.blockId.includes('cart-reminder')) {
      publish(PUB_SUB_EVENTS.cartReminderSelect, e);
    }

    // cookie box
    if (e.detail.blockId.includes('cookie-box')) {
      publish(PUB_SUB_EVENTS.cookieBoxSelect, e);
    }

    // sales popup
    if (e.detail.blockId.includes('sales-popup')) {
      publish(PUB_SUB_EVENTS.salesPopupSelect, e);
    }

    // sticky add to cart
    if (e.detail.blockId.includes('sticky-add-to-cart')) {
      publish(PUB_SUB_EVENTS.stickyAddToCartSelect, e);
    }
  });

  // Shopify event block deselect
  document.addEventListener('shopify:block:deselect', (e) => {
    publish(PUB_SUB_EVENTS.shopifyEventBlockDeselect, e);

    // cart notification
    if (e.detail.blockId.includes('cart-notification')) {
      publish(PUB_SUB_EVENTS.cartNotificationDeselect, e);
    }

    // cart reminder
    if (e.detail.blockId.includes('cart-reminder')) {
      publish(PUB_SUB_EVENTS.cartReminderDeselect, e);
    }

    // cookie box
    if (e.detail.blockId.includes('cookie-box')) {
      publish(PUB_SUB_EVENTS.cookieBoxDeselect, e);
    }

    // sales popup
    if (e.detail.blockId.includes('sales-popup')) {
      publish(PUB_SUB_EVENTS.salesPopupDeselect, e);
    }

    // sticky add to cart
    if (e.detail.blockId.includes('sticky-add-to-cart')) {
      publish(PUB_SUB_EVENTS.stickyAddToCartDeselect, e);
    }
  });

  // Cart drawer select event
  subscribe(PUB_SUB_EVENTS.shopifyEventSectionSelect, (e) => {
    if (e.detail.sectionId === 'cart-drawer') {
      document.querySelector('cart-drawer').classList.add('active');
      document.querySelector('body').classList.add('overflow-hidden');
    }
  });

  // Cart drawer deselect event
  subscribe(PUB_SUB_EVENTS.shopifyEventSectionDeselect, (e) => {
    if (e.detail.sectionId === 'cart-drawer') {
      document.querySelector('cart-drawer').classList.remove('active');
      document.querySelector('body').classList.remove('overflow-hidden');
    }
  });
});
