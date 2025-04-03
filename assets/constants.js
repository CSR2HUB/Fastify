const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  quantityUpdate: 'quantity-update',
  optionValueSelectionChange: 'option-value-selection-change',
  variantChange: 'variant-change',
  cartError: 'cart-error',
  shopifyEventSectionSelect: 'shopify:section:select',
  shopifyEventSectionDeselect: 'shopify:section:deselect',
  shopifyEventBlockSelect: 'shopify:block:select',
  shopifyEventBlockDeselect: 'shopify:block:deselect',
  wishlistUpdate: 'wishlist-update',
  compareUpdate: 'compare-update',
  recentlyUpdated: 'recently-view',
  cartTotalRefreshed: 'cart-total-refreshed',
  quickViewLoaded: 'quick-view-loaded',

  // Blocks events
  // cart notification
  cartNotificationSelect: 'cart-notification-select',
  cartNotificationDeselect: 'cart-notification-deselect',

  pageTransitionSelect: 'page-transition-select',
  pageTransitionDeselect: 'page-transition-deselect',

  // cart reminder
  cartReminderSelect: 'cart-reminder-select',
  cartReminderDeselect: 'cart-reminder-deselect',

  // cookie box
  cookieBoxSelect: 'cookie-box-select',
  cookieBoxDeselect: 'cookie-box-deselect',

  // sales popup
  salesPopupSelect: 'sales-popup-select',
  salesPopupDeselect: 'sales-popup-deselect',

  // sticky add to cart
  stickyAddToCartSelect: 'sticky-add-to-cart-select',
  stickyAddToCartDeselect: 'sticky-add-to-cart-deselect',
};
