if (!customElements.get('trust-badge')) {
  customElements.define(
    'trust-badge',
    class extends HTMLElement {
      constructor() {
        super();
        this.data = Fastify.widgets['dbtfy-trust-badge'];

        ({
          showHeading: this.showHeading,
          showSubheading: this.showSubheading,
          showInformativeText: this.showInformativeText,
          badgeAlignment: this.badgeAlignment,
          alignment: this.alignment,
          layout: this.layout,
        } = this.dataset);

        const templateScript = document.querySelector('#dbtfy-trust-badge');
        if (templateScript) {
          const templateHTML = templateScript.innerHTML;
          const templateElement = document.createElement('div');
          templateElement.innerHTML = templateHTML;
          this.template = templateElement;
        }

        const paymentIconScript = document.querySelector('#dbtfy-trust-payment-icons');
        if (paymentIconScript) {
          const paymentIconHTML = paymentIconScript.innerHTML;
          const paymentIconElement = document.createElement('div');
          paymentIconElement.innerHTML = paymentIconHTML;
          this.paymentIcontemplate = paymentIconElement;
        }

        this.init();
      }

      init() {
        if (!this.template) return;

        this.template = this.template.cloneNode(true);
        this.paymentIcontemplate = this.paymentIcontemplate.cloneNode(true);

        const blockData = this.template.querySelector('dbtfy-slider-component');
        if (!blockData) return;
        this.data.trust_badges_enable_card = blockData.dataset.enableCard == 'true';
        this.data.trust_badges_enable_gray_logos = blockData.dataset.enableGrayLogos == 'true';
        this.data.trust_badges_logo_heading_size = blockData.dataset.headingSize;
        this.data.trust_badges_logo_text_size = blockData.dataset.textSize;
        this.data.desktop_col_width = blockData.dataset.desktopCol;
        this.data.mobile_col_width = blockData.dataset.mobileCol;
        this.data.icon_block_type = blockData.dataset.iconBlockLayout;

        this.innerHTML = '';

        let badge_column_class = 'grid--12-col dbtfy-trust-badge-images--rows-items';
        if (this.data.icon_block_type != 'row') {
          badge_column_class = `grid--${this.data.desktop_col_width}-col-desktop grid--${this.data.desktop_col_width}-col-tablet grid--${this.data.mobile_col_width}-col`;
        } else {
          badge_column_class = `grid--1-col-desktop grid--1-col-tablet grid--1-col single-block`;
        }

        const dynamicStrings = {
          logo_heading_size: this.data.trust_badges_logo_heading_size,
          logo_text_size: this.data.trust_badges_logo_text_size,
          enable_card: this.data.trust_badges_enable_card == true ? 'card-background' : '',
          enable_gray_logos:
            this.data.trust_badges_enable_gray_logos == true ? 'dbtfy-trust-badge--enable-graylogo img' : '',
          badge_column_class: badge_column_class,
          trust_badges_alignment: this.alignment,
        };

        if (this.showInformativeText == 'false') this.template.querySelector('.information').remove();

        if (this.showHeading == 'false') this.template.querySelector('.heading').remove();

        if (this.showSubheading == 'false') this.template.querySelector('.subheading').remove();

        if (this.layout == 'payment_options') {
          this.template.querySelector('.other_option_block').remove();
        } else {
          this.template.querySelector('.payment_option_block').remove();
        }

        const paymentIcons = this.paymentIcontemplate.querySelector('.icons');
        const paymentIconRow = this.template.querySelector('.dbtfy-payment-icon-row:not(.overrided)');

        if (paymentIconRow) {
          paymentIconRow.style.setProperty('--payment-icon-width', paymentIcons.dataset.width);
          paymentIconRow.style.setProperty('--payment-icon-height', paymentIcons.dataset.height);
          paymentIconRow.insertAdjacentHTML('beforeend', paymentIcons.innerHTML);
        }

        this.innerHTML = Fastify.replaceVariables(this.template.innerHTML, dynamicStrings);
      }
    }
  );
}
