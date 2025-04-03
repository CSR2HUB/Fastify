class FastifyTranslator {
  constructor() {
    this.settings = {};
    this.languagesMapping = [
      {
        language: 'Filipino',
        google: 'tl',
        shopify: 'fil',
      },
    ];

    this.supportedLanguages = {
      af: 'Afrikaans',
      sq: 'Albanian',
      am: 'Amharic',
      ar: 'Arabic',
      hy: 'Armenian',
      az: 'Azerbaijani',
      eu: 'Basque',
      be: 'Belarusian',
      bn: 'Bengali',
      bs: 'Bosnian',
      bg: 'Bulgarian',
      ca: 'Catalan',
      ceb: 'Cebuano',
      ny: 'Chichewa',
      'zh-CN': 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      co: 'Corsican',
      hr: 'Croatian',
      cs: 'Czech',
      da: 'Danish',
      nl: 'Dutch',
      en: 'English',
      eo: 'Esperanto',
      et: 'Estonian',
      tl: 'Filipino',
      fi: 'Finnish',
      fr: 'French',
      fy: 'Frisian',
      gl: 'Galician',
      ka: 'Georgian',
      de: 'German',
      el: 'Greek',
      gu: 'Gujarati',
      ht: 'Haitian Creole',
      ha: 'Hausa',
      haw: 'Hawaiian',
      iw: 'Hebrew',
      hi: 'Hindi',
      hmn: 'Hmong',
      hu: 'Hungarian',
      is: 'Icelandic',
      ig: 'Igbo',
      id: 'Indonesian',
      ga: 'Irish',
      it: 'Italian',
      ja: 'Japanese',
      jw: 'Javanese',
      kn: 'Kannada',
      kk: 'Kazakh',
      km: 'Khmer',
      ko: 'Korean',
      ku: 'Kurdish (Kurmanji)',
      ky: 'Kyrgyz',
      lo: 'Lao',
      la: 'Latin',
      lv: 'Latvian',
      lt: 'Lithuanian',
      lb: 'Luxembourgish',
      mk: 'Macedonian',
      mg: 'Malagasy',
      ms: 'Malay',
      ml: 'Malayalam',
      mt: 'Maltese',
      mi: 'Maori',
      mr: 'Marathi',
      mn: 'Mongolian',
      my: 'Myanmar (Burmese)',
      ne: 'Nepali',
      no: 'Norwegian',
      ps: 'Pashto',
      fa: 'Persian',
      pl: 'Polish',
      pt: 'Portuguese',
      pa: 'Punjabi',
      ro: 'Romanian',
      ru: 'Russian',
      sm: 'Samoan',
      gd: 'Scottish Gaelic',
      sr: 'Serbian',
      st: 'Sesotho',
      sn: 'Shona',
      sd: 'Sindhi',
      si: 'Sinhala',
      sk: 'Slovak',
      sl: 'Slovenian',
      so: 'Somali',
      es: 'Spanish',
      su: 'Sundanese',
      sw: 'Swahili',
      sv: 'Swedish',
      tg: 'Tajik',
      ta: 'Tamil',
      te: 'Telugu',
      th: 'Thai',
      tr: 'Turkish',
      uk: 'Ukrainian',
      ur: 'Urdu',
      uz: 'Uzbek',
      vi: 'Vietnamese',
      cy: 'Welsh',
      xh: 'Xhosa',
      yi: 'Yiddish',
      yo: 'Yoruba',
      zu: 'Zulu',
    };

    this.initialize();
  }

  initialize() {
    this.currentLanguage = Fastify.language.locale;
    this.defaultLanguage = 'en';
    this.languages = this.settings.languages || [];
    this.customDomains = this.settings.custom_domains || {};
    this.horizontalPosition = this.settings.horizontal_position || 'inline';
    this.verticalPosition = this.settings.vertical_position || null;
    this.wrapperSelector = '.fastify_translator_wrapper';
    this.selectLanguageLabel = this.settings.select_language_label || 'Select Language';
    this.customCss = this.settings.custom_css || '';

    this.uClass = this.generateUniqueClass();

    this.setupWidget();
    this.setupEventListeners();
  }

  generateUniqueClass() {
    return (
      '.fastify_container-' +
      Array.from('translator' + this.wrapperSelector)
        .reduce((h, c) => 0 | (31 * h + c.charCodeAt(0)), 0)
        .toString(36)
    );
  }

  createLanguageSelector() {
    const select = document.createElement('select');
    select.classList.add('fastify_selector', 'notranslate');
    select.setAttribute('aria-label', this.selectLanguageLabel);

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = this.selectLanguageLabel;
    select.appendChild(defaultOption);

    this.languages.forEach((lang) => {
      const option = document.createElement('option');
      option.value = `${this.defaultLanguage}|${lang}`;
      option.innerText = this.supportedLanguages[lang];
      select.appendChild(option);
    });

    return select;
  }

  setupWidget() {
    let widgetCode = '<!-- Fastify Language Translator -->';
    widgetCode += this.createLanguageSelector().outerHTML;
    widgetCode += '<div id="fastify_translate_element"></div>';

    const widgetCss = this.generateWidgetCss();

    if (this.horizontalPosition !== 'inline') {
      widgetCode = `<div class="fastify_switcher_wrapper" style="position:fixed;${this.verticalPosition}:15px;${this.horizontalPosition}:15px;z-index:999999;">${widgetCode}</div>`;
    }

    this.addCustomCss(widgetCss);
    this.appendWidgetToWrapper(widgetCode);
  }

  generateWidgetCss() {
    let css = this.customCss;
    css += 'div.skiptranslate,#fastify_translate_element{display:none!important}';
    css += 'body{top:0!important}';
    css += 'font font{background-color:transparent!important;box-shadow:none!important;position:initial!important}';
    return css;
  }

  addCustomCss(css) {
    const style = document.createElement('style');
    style.classList.add('fastify_translator_css');
    style.textContent = css;
    document.head.appendChild(style);
  }

  appendWidgetToWrapper(widgetCode) {
    document.querySelectorAll(this.wrapperSelector).forEach((element) => {
      element.classList.add(this.uClass.substring(1));
      element.innerHTML += widgetCode;
    });
  }

  fireEvent(element, event) {
    try {
      if (document.createEventObject) {
        const evt = document.createEventObject();
        element.fireEvent('on' + event, evt);
      } else {
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent(event, true, true);
        element.dispatchEvent(evt);
      }
    } catch (e) {
      console.error('Fastify Translator Error:', e);
    }
  }

  loadTranslateLibrary() {
    if (!window.fastify_translate_script) {
      window.fastify_translate_script = document.createElement('script');
      window.fastify_translate_script.src =
        'https://translate.google.com/translate_a/element.js?cb=fastifyTranslateElementInit';
      document.body.appendChild(window.fastify_translate_script);
    }
  }

  translate(langPair) {
    if (typeof langPair === 'object' && langPair.value) langPair = langPair.value;
    if (!langPair) return;

    const lang = langPair.split('|')[1];
    this.executeTranslation(lang);
  }

  executeTranslation(lang) {
    const teCombo = this.findTranslateCombo();

    if (!this.isTranslateElementReady(teCombo)) {
      setTimeout(() => this.translate(this.defaultLanguage + '|' + lang), 500);
      return;
    }

    teCombo.value = lang;
    this.fireEvent(teCombo, 'change');
    this.fireEvent(teCombo, 'change');
  }

  findTranslateCombo() {
    return Array.from(document.getElementsByTagName('select')).find(
      (sel) => sel.className.indexOf('goog-te-combo') !== -1
    );
  }

  isTranslateElementReady(teCombo) {
    const element = document.getElementById('fastify_translate_element');
    return element && element.innerHTML.length > 0 && teCombo && teCombo.length > 0 && teCombo.innerHTML.length > 0;
  }

  setupEventListeners() {
    this.loadTranslateLibrary();

    document.querySelectorAll(`${this.uClass} .fastify_selector`).forEach((element) => {
      element.addEventListener('change', (evt) => {
        this.translate(evt.target.value);
      });
    });
  }

  handleShopifyLocale() {
    document.addEventListener('DOMContentLoaded', () => {
      this.languagesMapping.forEach((lang) => {
        if (this.currentLanguage === lang.shopify) {
          this.loadTranslateLibrary();
          window.fastify_translate_script.onload = () => {
            this.translate('en|' + lang.google);
            document.querySelector(`${this.uClass} .fastify_selector`).value = 'en|' + lang.google;
          };
        } else if (this.currentLanguage !== 'en' && this.supportedLanguages[this.currentLanguage]) {
          this.translate('en|' + this.currentLanguage);
          document.querySelector(`${this.uClass} .fastify_selector`).value = 'en|' + this.currentLanguage;
        }
      });
    });
  }
}

// Initialize Fastify Translate Element
window.fastifyTranslateElementInit = function () {
  new google.translate.TranslateElement(
    {
      pageLanguage: this.defaultLanguage,
      autoDisplay: false,
    },
    'fastify_translate_element'
  );
};

// Usage
const translator = new FastifyTranslator();
translator.handleShopifyLocale();
