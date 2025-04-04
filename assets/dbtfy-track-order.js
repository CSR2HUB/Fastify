(window.YQ = window.YQ || {}),
  (YQ.configs = YQ.configs || {}),
  (YQ.configs.browserCheck = !1),
  (function (d, u) {
    'use strict';
    function c(e, t) {
      (this[i] = e), (this[s] = t);
    }
    function m(e) {
      this[t] = e;
    }
    function w(e, t, i) {
      (this[n] = e), (this[o] = t), (this[r] = i);
    }
    function p(e, t) {
      if (!(this instanceof p)) return new p(e, t).getResult();
      var i = e || (d && d.navigator && d.navigator.userAgent ? d.navigator.userAgent : ''),
        o = t ? g.extend(k, t) : k,
        r = new c(),
        n = new m(),
        s = new w(),
        a = new x(),
        l = new Q();
      return (
        (this.getBrowser = function () {
          return v.rgx.call(r, i, o.browser), (r.major = g.major(r.version)), r;
        }),
        (this.getCPU = function () {
          return v.rgx.call(n, i, o.cpu), n;
        }),
        (this.getDevice = function () {
          return v.rgx.call(s, i, o.device), s;
        }),
        (this.getEngine = function () {
          return v.rgx.call(a, i, o.engine), a;
        }),
        (this.getOS = function () {
          return v.rgx.call(l, i, o.os), l;
        }),
        (this.getResult = function () {
          return {
            ua: this.getUA(),
            browser: this.getBrowser(),
            engine: this.getEngine(),
            os: this.getOS(),
            device: this.getDevice(),
            cpu: this.getCPU(),
          };
        }),
        (this.getUA = function () {
          return i;
        }),
        (this.setUA = function (e) {
          return (i = e), (r = new c()), (n = new m()), (s = new w()), (a = new x()), (l = new Q()), this;
        }),
        this
      );
    }
    var f = 'function',
      h = 'object',
      o = 'model',
      i = 'name',
      r = 'type',
      n = 'vendor',
      s = 'version',
      t = 'architecture',
      e = 'console',
      a = 'mobile',
      l = 'tablet',
      b = 'smarttv',
      _ = 'wearable',
      g = {
        extend: function (e, t) {
          var i,
            o = {};
          for (i in e) t[i] && t[i].length % 2 == 0 ? (o[i] = t[i].concat(e[i])) : (o[i] = e[i]);
          return o;
        },
        has: function (e, t) {
          return 'string' == typeof e && -1 !== t.toLowerCase().indexOf(e.toLowerCase());
        },
        lowerize: function (e) {
          return e.toLowerCase();
        },
        major: function (e) {
          return 'string' == typeof e ? e.replace(/[^\d\.]/g, '').split('.')[0] : u;
        },
        trim: function (e) {
          return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        },
      },
      v = {
        rgx: function (e, t) {
          for (var i, o, r, n, s, a = 0; a < t.length && !n; ) {
            for (var l = t[a], d = t[a + 1], c = (i = 0); c < l.length && !n; )
              if ((n = l[c++].exec(e)))
                for (o = 0; o < d.length; o++)
                  (s = n[++i]),
                    typeof (r = d[o]) == h && 0 < r.length
                      ? 2 == r.length
                        ? typeof r[1] == f
                          ? (this[r[0]] = r[1].call(this, s))
                          : (this[r[0]] = r[1])
                        : 3 == r.length
                        ? typeof r[1] != f || (r[1].exec && r[1].test)
                          ? (this[r[0]] = s ? s.replace(r[1], r[2]) : u)
                          : (this[r[0]] = s ? r[1].call(this, s, r[2]) : u)
                        : 4 == r.length && (this[r[0]] = s ? r[3].call(this, s.replace(r[1], r[2])) : u)
                      : (this[r] = s || u);
            a += 2;
          }
        },
        str: function (e, t) {
          for (var i in t)
            if (typeof t[i] == h && 0 < t[i].length) {
              for (var o = 0; o < t[i].length; o++) if (g.has(t[i][o], e)) return '?' === i ? u : i;
            } else if (g.has(t[i], e)) return '?' === i ? u : i;
          return e;
        },
      },
      y = {
        browser: {
          oldsafari: {
            version: {
              '1.0': '/8',
              1.2: '/1',
              1.3: '/3',
              '2.0': '/412',
              '2.0.2': '/416',
              '2.0.3': '/417',
              '2.0.4': '/419',
              '?': '/',
            },
          },
        },
        device: {
          amazon: { model: { 'Fire Phone': ['SD', 'KF'] } },
          sprint: { model: { 'Evo Shift 4G': '7373KT' }, vendor: { HTC: 'APA', Sprint: 'Sprint' } },
        },
        os: {
          windows: {
            version: {
              ME: '4.90',
              'NT 3.11': 'NT3.51',
              'NT 4.0': 'NT4.0',
              2e3: 'NT 5.0',
              XP: ['NT 5.1', 'NT 5.2'],
              Vista: 'NT 6.0',
              7: 'NT 6.1',
              8: 'NT 6.2',
              8.1: 'NT 6.3',
              10: ['NT 6.4', 'NT 10.0'],
              RT: 'ARM',
            },
          },
        },
      },
      k = {
        browser: [
          [
            /(opera\smini)\/([\w\.-]+)/i,
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,
            /(opera).+version\/([\w\.]+)/i,
            /(opera)[\/\s]+([\w\.]+)/i,
          ],
          [i, s],
          [/(opios)[\/\s]+([\w\.]+)/i],
          [[i, 'Opera Mini'], s],
          [/\s(opr)\/([\w\.]+)/i],
          [[i, 'Opera'], s],
          [
            /(kindle)\/([\w\.]+)/i,
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
            /(?:ms|\()(ie)\s([\w\.]+)/i,
            /(rekonq)\/([\w\.]+)*/i,
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser)\/([\w\.-]+)/i,
          ],
          [i, s],
          [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],
          [[i, 'IE'], s],
          [/(edge)\/((\d+)?[\w\.]+)/i],
          [i, s],
          [/(yabrowser)\/([\w\.]+)/i],
          [[i, 'Yandex'], s],
          [/(puffin)\/([\w\.]+)/i],
          [[i, 'Puffin'], s],
          [
            /(uc\s?browser)[\/\s]?([\w\.]+)/i,
            /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,
            /juc.+(ucweb)[\/\s]?([\w\.]+)/i,
            /(ucbrowser)\/([\w\.]+)/i,
          ],
          [[i, 'UCBrowser'], s],
          [/(comodo_dragon)\/([\w\.]+)/i],
          [[i, /_/g, ' '], s],
          [/(micromessenger)\/([\w\.]+)/i],
          [[i, 'WeChat'], s],
          [/m?(qqbrowser)[\/\s]?([\w\.]+)/i],
          [i, s],
          [/xiaomi\/miuibrowser\/([\w\.]+)/i],
          [s, [i, 'MIUI Browser']],
          [/;fbav\/([\w\.]+);/i],
          [s, [i, 'Facebook']],
          [/(headlesschrome) ([\w\.]+)/i],
          [s, [i, 'Chrome Headless']],
          [/\swv\).+(chrome)\/([\w\.]+)/i],
          [[i, /(.+)/, '$1 WebView'], s],
          [/android.+samsungbrowser\/([\w\.]+)/i, /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],
          [s, [i, 'Android Browser']],
          [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
          [i, s],
          [/(dolfin)\/([\w\.]+)/i],
          [[i, 'Dolphin'], s],
          [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
          [[i, 'Chrome'], s],
          [/(coast)\/([\w\.]+)/i],
          [[i, 'Opera Coast'], s],
          [/fxios\/([\w\.-]+)/i],
          [s, [i, 'Firefox']],
          [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],
          [s, [i, 'Mobile Safari']],
          [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],
          [s, i],
          [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
          [i, [s, v.str, y.browser.oldsafari.version]],
          [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i],
          [i, s],
          [/(navigator|netscape)\/([\w\.-]+)/i],
          [[i, 'Netscape'], s],
          [
            /(swiftfox)/i,
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
            /(links)\s\(([\w\.]+)/i,
            /(gobrowser)\/?([\w\.]+)*/i,
            /(ice\s?browser)\/v?([\w\._]+)/i,
            /(mosaic)[\/\s]([\w\.]+)/i,
          ],
          [i, s],
        ],
        cpu: [
          [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
          [[t, 'amd64']],
          [/(ia32(?=;))/i],
          [[t, g.lowerize]],
          [/((?:i[346]|x)86)[;\)]/i],
          [[t, 'ia32']],
          [/windows\s(ce|mobile);\sppc;/i],
          [[t, 'arm']],
          [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
          [[t, /ower/, '', g.lowerize]],
          [/(sun4\w)[;\)]/i],
          [[t, 'sparc']],
          [
            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i,
          ],
          [[t, g.lowerize]],
        ],
        device: [
          [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
          [o, n, [r, l]],
          [/applecoremedia\/[\w\.]+ \((ipad)/],
          [o, [n, 'Apple'], [r, l]],
          [/(apple\s{0,1}tv)/i],
          [
            [o, 'Apple TV'],
            [n, 'Apple'],
          ],
          [
            /(archos)\s(gamepad2?)/i,
            /(hp).+(touchpad)/i,
            /(hp).+(tablet)/i,
            /(kindle)\/([\w\.]+)/i,
            /\s(nook)[\w\s]+build\/(\w+)/i,
            /(dell)\s(strea[kpr\s\d]*[\dko])/i,
          ],
          [n, o, [r, l]],
          [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],
          [o, [n, 'Amazon'], [r, l]],
          [/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],
          [
            [o, v.str, y.device.amazon.model],
            [n, 'Amazon'],
            [r, a],
          ],
          [/\((ip[honed|\s\w*]+);.+(apple)/i],
          [o, n, [r, a]],
          [/\((ip[honed|\s\w*]+);/i],
          [o, [n, 'Apple'], [r, a]],
          [
            /(blackberry)[\s-]?(\w+)/i,
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
            /(hp)\s([\w\s]+\w)/i,
            /(asus)-?(\w+)/i,
          ],
          [n, o, [r, a]],
          [/\(bb10;\s(\w+)/i],
          [o, [n, 'BlackBerry'], [r, a]],
          [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i],
          [o, [n, 'Asus'], [r, l]],
          [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i],
          [
            [n, 'Sony'],
            [o, 'Xperia Tablet'],
            [r, l],
          ],
          [/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],
          [
            [n, 'Sony'],
            [o, 'Xperia Phone'],
            [r, a],
          ],
          [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
          [n, o, [r, e]],
          [/android.+;\s(shield)\sbuild/i],
          [o, [n, 'Nvidia'], [r, e]],
          [/(playstation\s[34portablevi]+)/i],
          [o, [n, 'Sony'], [r, e]],
          [/(sprint\s(\w+))/i],
          [
            [n, v.str, y.device.sprint.vendor],
            [o, v.str, y.device.sprint.model],
            [r, a],
          ],
          [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],
          [n, o, [r, l]],
          [
            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,
            /(zte)-(\w+)*/i,
            /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i,
          ],
          [n, [o, /_/g, ' '], [r, a]],
          [/(nexus\s9)/i],
          [o, [n, 'HTC'], [r, l]],
          [/(nexus\s6p)/i],
          [o, [n, 'Huawei'], [r, a]],
          [/(microsoft);\s(lumia[\s\w]+)/i],
          [n, o, [r, a]],
          [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
          [o, [n, 'Microsoft'], [r, e]],
          [/(kin\.[onetw]{3})/i],
          [
            [o, /\./g, ' '],
            [n, 'Microsoft'],
            [r, a],
          ],
          [
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i,
          ],
          [o, [n, 'Motorola'], [r, a]],
          [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
          [o, [n, 'Motorola'], [r, l]],
          [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
          [
            [n, g.trim],
            [o, g.trim],
            [r, b],
          ],
          [/hbbtv.+maple;(\d+)/i],
          [
            [o, /^/, 'SmartTV'],
            [n, 'Samsung'],
            [r, b],
          ],
          [/\(dtv[\);].+(aquos)/i],
          [o, [n, 'Sharp'], [r, b]],
          [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i],
          [[n, 'Samsung'], o, [r, l]],
          [/smart-tv.+(samsung)/i],
          [n, [r, b], o],
          [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i,
          ],
          [[n, 'Samsung'], o, [r, a]],
          [/sie-(\w+)*/i],
          [o, [n, 'Siemens'], [r, a]],
          [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i],
          [[n, 'Nokia'], o, [r, a]],
          [/android\s3\.[\s\w;-]{10}(a\d{3})/i],
          [o, [n, 'Acer'], [r, l]],
          [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
          [[n, 'LG'], o, [r, l]],
          [/(lg) netcast\.tv/i],
          [n, o, [r, b]],
          [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w+)*/i],
          [o, [n, 'LG'], [r, a]],
          [/android.+(ideatab[a-z0-9\-\s]+)/i],
          [o, [n, 'Lenovo'], [r, l]],
          [/linux;.+((jolla));/i],
          [n, o, [r, a]],
          [/((pebble))app\/[\d\.]+\s/i],
          [n, o, [r, _]],
          [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],
          [n, o, [r, a]],
          [/crkey/i],
          [
            [o, 'Chromecast'],
            [n, 'Google'],
          ],
          [/android.+;\s(glass)\s\d/i],
          [o, [n, 'Google'], [r, _]],
          [/android.+;\s(pixel c)\s/i],
          [o, [n, 'Google'], [r, l]],
          [/android.+;\s(pixel xl|pixel)\s/i],
          [o, [n, 'Google'], [r, a]],
          [
            /android.+(\w+)\s+build\/hm\1/i,
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i,
          ],
          [
            [o, /_/g, ' '],
            [n, 'Xiaomi'],
            [r, a],
          ],
          [/android.+a000(1)\s+build/i],
          [o, [n, 'OnePlus'], [r, a]],
          [/\s(tablet)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i],
          [[r, g.lowerize], n, o],
        ],
        engine: [
          [/windows.+\sedge\/([\w\.]+)/i],
          [s, [i, 'EdgeHTML']],
          [
            /(presto)\/([\w\.]+)/i,
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,
            /(icab)[\/\s]([23]\.[\d\.]+)/i,
          ],
          [i, s],
          [/rv\:([\w\.]+).*(gecko)/i],
          [s, i],
        ],
        os: [
          [/microsoft\s(windows)\s(vista|xp)/i],
          [i, s],
          [
            /(windows)\snt\s6\.2;\s(arm)/i,
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i,
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i,
          ],
          [i, [s, v.str, y.os.windows.version]],
          [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
          [
            [i, 'Windows'],
            [s, v.str, y.os.windows.version],
          ],
          [/\((bb)(10);/i],
          [[i, 'BlackBerry'], s],
          [
            /(blackberry)\w*\/?([\w\.]+)*/i,
            /(tizen)[\/\s]([\w\.]+)/i,
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
            /linux;.+(sailfish);/i,
          ],
          [i, s],
          [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
          [[i, 'Symbian'], s],
          [/\((series40);/i],
          [i],
          [/mozilla.+\(mobile;.+gecko.+firefox/i],
          [[i, 'Firefox OS'], s],
          [
            /(nintendo|playstation)\s([wids34portablevu]+)/i,
            /(mint)[\/\s\(]?(\w+)*/i,
            /(mageia|vectorlinux)[;\s]/i,
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
            /(hurd|linux)\s?([\w\.]+)*/i,
            /(gnu)\s?([\w\.]+)*/i,
          ],
          [i, s],
          [/(cros)\s[\w]+\s([\w\.]+\w)/i],
          [[i, 'Chromium OS'], s],
          [/(sunos)\s?([\w\.]+\d)*/i],
          [[i, 'Solaris'], s],
          [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
          [i, s],
          [/(haiku)\s(\w+)/i],
          [i, s],
          [/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i],
          [
            [i, 'iOS'],
            [s, /_/g, '.'],
          ],
          [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i],
          [
            [i, 'Mac OS'],
            [s, /_/g, '.'],
          ],
          [
            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
            /(unix)\s?([\w\.]+)*/i,
          ],
          [i, s],
        ],
      },
      x = c,
      Q = c;
    (p.VERSION = '0.7.12'),
      (p.BROWSER = { NAME: i, MAJOR: 'major', VERSION: s }),
      (p.CPU = { ARCHITECTURE: t }),
      (p.DEVICE = {
        MODEL: o,
        VENDOR: n,
        TYPE: r,
        CONSOLE: e,
        MOBILE: a,
        SMARTTV: b,
        TABLET: l,
        WEARABLE: _,
        EMBEDDED: 'embedded',
      }),
      (p.ENGINE = { NAME: i, VERSION: s }),
      (p.OS = { NAME: i, VERSION: s }),
      (d.UAParser = p);
    var Y,
      E = d.jQuery || d.Zepto;
    void 0 !== E &&
      ((Y = new p()),
      (E.ua = Y.getResult()),
      (E.ua.get = function () {
        return Y.getUA();
      }),
      (E.ua.set = function (e) {
        Y.setUA(e);
        var t,
          i = Y.getResult();
        for (t in i) E.ua[t] = i[t];
      }));
  })('object' == typeof window ? window : this),
  (function (e) {
    e.update_i18n = {
      en: {
        __content1: "System detects it's an outdated browser. It is recommended using the following web browsers:",
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ above version, or other up-to-date webkit browsers for the best possible experience.',
        __seoTitle: 'Outdated Browser',
      },
      'zh-cn': {
        __content1: '你的浏览器版本过低，我们推荐你使用：',
        __content2: 'IE10、Firefox31、Safari4、Chrome41、Opera30以上或其他Webkit内核浏览器，以获得最好的使用体验。',
        __seoTitle: '浏览器版本过低',
      },
      'zh-hk': {
        __content1: '你的瀏覽器版本過低，我們推薦你使用：',
        __content2: 'IE10、Firefox31、Safari4、Chrome41、Opera30以上或其他webkit內核瀏覽器，以獲得最好的使用體驗。',
        __seoTitle: '流覽器版本過低',
      },
      ja: {
        __content1: 'システムが古いバージョンのブラウザを検知しました。下記するウェブブラウザのご使用を推奨します：',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ 以降のバージョン又は最新の webkit ブラウザでより快適にご使用頂けます。',
        __seoTitle: '旧バージョンブラウザ',
      },
      ko: {
        __content1: '이전 버전의 브라우저로 시스템 확인이 되었습니다. 하단의 브라우저로 사용하시는 것을 권장합니다 :',
        __content2:
          '인터넷 익스플로러 10, 파이어 폭스 31, 사파리 4, 크롬 41, 오페라 30+ 이상의 버전, 또는 다른 최신의 웹 브라우저를 통해 최대한의 경험을 접하세요.',
        __seoTitle: '이전 버전의 브라우저',
      },
      fi: {
        __content1: 'Järjestelmä on havainnut vanhentuneen selaimen. Suosittelemme käyttämään seuraavia web-selaimia:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30 + -versio tai jokin muu ajan tasalla oleva web-selain, parhaan mahdollisen käyttökokemuksen takaamiseksi.',
        __seoTitle: 'Vanhentunut selain',
      },
      pl: {
        __content1:
          'System wykrył, że korzystasz ze starej przeglądarki. Rekomendujemy korzystanie z jednej z tych przeglądarek:',
        __content2: 'IE10, Firefox31, Safari4, Chrome41, Opera30+ i wersje nowsze, dla większej wygody.',
        __seoTitle: 'Przestarzała przeglądarka',
      },
      tr: {
        __content1: 'Sistem eski bir tarayıcı olduğunu tespit etti. Aşağıdaki web tarayıcılarını kullanmanız önerilir:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30 + sürümünden veya diğer en güncel web tarayıcılarından yararlanın.',
        __seoTitle: 'Eski Tarayıcı',
      },
      cs: {
        __content1:
          'Systém zjistil, že používáte zastaralý prohlížeč. Doporučujeme použit některý z následujících webových prohlížečů:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30 a vyšší verze nebo jiné aktuální webkit prohlížeče pro nejlepší možné využití.',
        __seoTitle: 'Zastaralý prohlížeč',
      },
      it: {
        __content1:
          "Il sistema ha rilevato un browser obsoleto. Si raccomanda l'utilizzo di uno dei seguenti browser web:",
        __content2:
          "Internet Explorer 10, Opera 30, Firefox 31, Chrome 41, Safari 4 o versioni più recenti. In alternativa è possibile utilizzare anche altri browser aggiornati all'ultima versione per una miglior esperienza possibile.",
        __seoTitle: 'Browser obsoleto',
      },
      de: {
        __content1:
          'Unser System hat identifiziert, dass es einen veralteten Browser ist. Es wird empfohlen, die folgenden Browser zu verwenden:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ und höher, oder die andere aktualisierte Webkit-Browser für die beste Erfahrung.',
        __seoTitle: 'Veralteter Browser',
      },
      es: {
        __content1: '¿Está utilizando un explorador antiguo? Le recomendamos uno de estos:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30 y superiores, o algún otro que esté actualizado para una mejor experiencia.',
        __seoTitle: 'Explorador Antiguo',
      },
      fr: {
        __content1:
          "Notre système détecte que vous utilisez un navigateur obsolète. Il est recommandé d'utiliser les suivants :",
        __content2:
          'IE10, Firefox 31, Safari4, Chrome41, Opera30+ versions supérieures ou autres navigateurs à jours pour la meilleure expérience possible.',
        __seoTitle: 'Navigateur Obsolète',
      },
      ru: {
        __content1: 'Система обнаружила устаревший браузер. Рекомендуется использовать обновленные браузеры:',
        __content2: 'IE10, Firefox31, Safari4, Chrome41, Opera30 +  или выше версии и другие.',
        __seoTitle: 'Устаревший браузер',
      },
      pt: {
        __content1: 'O sistema detecta que é um navegador desatualizado. Recomenda-se usar os seguintes navegadores:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ e versões superiores, ou outros navegadores (webkits) atualizados para obter a melhor experiência possível.',
        __seoTitle: 'Navegador Desatualizado',
      },
      nl: {
        __content1:
          'Systeem heeft een verouderde browser gedetecteerd. Het is aangeraden een van de volgende browsers te gebruiken:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ of nieuwere versie, of andere up-to-date webkit browsers voor de beste ervaring.',
        __seoTitle: 'Verouderde Browser',
      },
      uk: {
        __content1: "System detects it's an outdated browser. It is recommended using the following web browsers:",
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ above version, or other up-to-date webkit browsers for the best possible experience.',
        __seoTitle: 'Outdated Browser',
      },
      hu: {
        __content1: 'A rendszer jelzése szerint elavult veziójú böngészőt használ. Az alábbi böngészőt ajánljuk:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ vagy frissebb verziót, illetve egyéb naprakész webkit böngészőt, mely a legjobb böngészési élményt garantálja.',
        __seoTitle: 'Elavult böngésző',
      },
      sv: {
        __content1: 'Systemet har detekterat att du använder en gammal webbläsare. Följande webbläsare rekommenderas:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ eller högre; alternativt kan du använda någon annan ny webkit-baserad webbläsare.',
        __seoTitle: 'Gammal webbläsare',
      },
      kk: {
        __content1: "System detects it's an outdated browser. It is recommended using the following web browsers:",
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ above version, or other up-to-date webkit browsers for the best possible experience.',
        __seoTitle: 'Outdated Browser',
      },
      el: {
        __content1:
          'Το σύστημα εντοπίζει ότι το πρόγραμμα περιήγησης είναι παλιό. Συνιστάται να χρησιμοποιείτε τα ακόλουθα προγράμματα περιήγησης:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ παραπάνω έκδοση ή άλλα ενημερωμένα προγράμματα περιήγησης webkit για την καλύτερη δυνατή εμπειρία.',
        __seoTitle: 'Μη ενημερωμένο πρόγραμμα περιήγησης',
      },
      th: {
        __content1: "System detects it's an outdated browser. It is recommended using the following web browsers:",
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ above version, or other up-to-date webkit browsers for the best possible experience.',
        __seoTitle: 'Outdated Browser',
      },
      bg: {
        __content1: "System detects it's an outdated browser. It is recommended using the following web browsers:",
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ above version, or other up-to-date webkit browsers for the best possible experience.',
        __seoTitle: 'Outdated Browser',
      },
      sk: {
        __content1:
          'Náš systém zistil, ze používate zastaralý webový prehliadač. Odporúčame použiť niektorý z následujúcich webových prehliadačov:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ a vyššie verzie alebo iný aktuálny webkit prehliadač pre čo najlepší zážitok z používania.',
        __seoTitle: 'Zastaralý prehliadač',
      },
      lt: {
        __content1: "System detects it's an outdated browser. It is recommended using the following web browsers:",
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ above version, or other up-to-date webkit browsers for the best possible experience.',
        __seoTitle: 'Outdated Browser',
      },
      ro: {
        __content1: 'Sistemul a detectat un browser invechit. Este recomandat sa utilizezi urmatoarele browsere:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ sau mai noi, sau alte browsere actualizate pentru o mai buna experienta de utilizare.',
        __seoTitle: 'Browser invechit',
      },
      no: {
        __content1:
          'Systemet har oppdaget at du bruker en utdatert nettleser. Det er anbefalt å bruke følgende nettlesere:',
        __content2:
          'Internet Explorer 10, Firefox 3.1, Safari 4, Chrome 4.1, Opera 30 eller nyere, eller andre nyere nettlesere for best opplevelse.',
        __seoTitle: 'Utdatert nettleser',
      },
      sq: {
        __content1: "System detects it's an outdated browser. It is recommended using the following web browsers:",
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ above version, or other up-to-date webkit browsers for the best possible experience.',
        __seoTitle: 'Outdated Browser',
      },
      sl: {
        __content1: 'Uporabljate nepodprt brskalnik. Priporočam, da uporabljate sledeče brskalnike:',
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ ali višje verzije, za najboljšo uporabniško izkušnjo.',
        __seoTitle: 'Zastarel brskalnik',
      },
      sr: {
        __content1: "System detects it's an outdated browser. It is recommended using the following web browsers:",
        __content2:
          'IE10, Firefox31, Safari4, Chrome41, Opera30+ above version, or other up-to-date webkit browsers for the best possible experience.',
        __seoTitle: 'Outdated Browser',
      },
    };
  })(window, document),
  (function (e, t) {
    var a = [],
      l = [],
      i = {
        _version: '3.5.0',
        _config: { classPrefix: '', enableClasses: !0, enableJSClass: !0, usePrefixes: !0 },
        _q: [],
        on: function (e, t) {
          var i = this;
          setTimeout(function () {
            t(i[e]);
          }, 0);
        },
        addTest: function (e, t, i) {
          l.push({ name: e, fn: t, options: i });
        },
        addAsyncTest: function (e) {
          l.push({ name: null, fn: e });
        },
      },
      d = function () {};
    (d.prototype = i), (d = new d());
    var o = t.documentElement,
      r = 'svg' === o.nodeName.toLowerCase();
    var n,
      s,
      c,
      u,
      m = i._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['', ''];
    (i._prefixes = m),
      d.addTest('csscalc', function () {
        var e = (function (e) {
          return 'function' != typeof t.createElement
            ? t.createElement(e)
            : r
            ? t.createElementNS.call(t, 'http://www.w3.org/2000/svg', e)
            : t.createElement.apply(t, arguments);
        })('a');
        return (e.style.cssText = 'width:' + m.join('calc(10px);width:')), !!e.style.length;
      }),
      (function () {
        var e, t, i, o, r, n, s;
        for (s in l)
          if (l.hasOwnProperty(s)) {
            if (
              ((e = []),
              (t = l[s]).name &&
                (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
            )
              for (i = 0; i < t.options.aliases.length; i++) e.push(t.options.aliases[i].toLowerCase());
            for (o = 'function' == typeof t.fn ? t.fn() : t.fn, r = 0; r < e.length; r++)
              1 === (n = e[r].split('.')).length
                ? (d[n[0]] = o)
                : (!d[n[0]] || d[n[0]] instanceof Boolean || (d[n[0]] = new Boolean(d[n[0]])), (d[n[0]][n[1]] = o)),
                a.push((o ? '' : 'no-') + n.join('-'));
          }
      })(),
      (n = a),
      (c = o.className),
      (u = d._config.classPrefix || ''),
      r && (c = c.baseVal),
      d._config.enableJSClass &&
        ((s = new RegExp('(^|\\s)' + u + 'no-js(\\s|$)')), (c = c.replace(s, '$1' + u + 'js$2'))),
      d._config.enableClasses && ((c += ' ' + u + n.join(' ' + u)), r ? (o.className.baseVal = c) : (o.className = c)),
      delete i.addTest,
      delete i.addAsyncTest;
    for (var w = 0; w < d._q.length; w++) d._q[w]();
    e._Modernizr = d;
  })(window, document),
  (function (o, s) {
    function e() {
      (this.ua = new o.UAParser()),
        (this.browserInfo = this.ua.getBrowser()),
        (this.deviceInfo = this.ua.getDevice()),
        (this.browserCheck = !0),
        o.YQ && o.YQ.configs && void 0 !== o.YQ.configs.browserCheck && (this.browserCheck = o.YQ.configs.browserCheck),
        this.init();
    }
    (e.prototype = {
      init: function () {
        this.browserCheck && this.unSupport() && this.lowVersionBrowserHandle();
      },
      unSupport: function () {
        var e = this.isMobile(),
          t = this.isTablet(),
          i = this.isWebView();
        if (e || t) {
          if (this.browserCheck && i) return !1;
          if (!_Modernizr.csscalc) return !0;
        } else if (
          this.lowBrowserIE(this.browserInfo) ||
          this.lowBrowserRange(this.browserInfo, 'Firefox', '31') ||
          this.lowBrowserRange(this.browserInfo, 'Chrome', '41') ||
          this.lowBrowserRange(this.browserInfo, 'Opera', '30') ||
          this.lowBrowserRange(this.browserInfo, 'Safari', '6')
        )
          return !0;
        return !1;
      },
      isMobile: function () {
        return (
          'mobile' === this.deviceInfo.type ||
          'smarttv' === this.deviceInfo.type ||
          'wearable' === this.deviceInfo.type ||
          'embedded' === this.deviceInfo.type
        );
      },
      isTablet: function () {
        return 'tablet' === this.deviceInfo.type;
      },
      isWebView: function () {
        var e = new RegExp('(^|&)from=([^&]*)(&|$)'),
          t = o.location.search.substr(1).match(e),
          i = !1;
        return null != t && 'app' === unescape(t[2]) && (i = !0), i;
      },
      lowBrowserIE: function (e) {
        return (
          'IE5' === e.name ||
          'IE6' === e.name ||
          'IE7' === e.name ||
          'IE8' === e.name ||
          'IE9' === e.name ||
          ('IE' === e.name && e.major < 10)
        );
      },
      lowBrowserRange: function (e, t, i) {
        if (!_Modernizr.csscalc) return !0;
        (t = t.replace(/\s/g, '').toLowerCase()), (i = parseFloat(i));
        var o = e.name.replace(/\s/g, '').toLowerCase(),
          r = parseFloat(e.major);
        return o === t && r < i;
      },
      updateHtmlTpl: function (e, t) {
        return (
          '<style>body>*{display:none!important}</style><div class="yq-brower-update"><div class="yq-lowbrower-container"><div class="yq-tips-baby"><i></i></div><div class="yq-lbtips-content"><a href="javascript:void(0)" class="yq-lbtips-logo"></a><div class="yq-lbtips-text"><p>' +
          e +
          '</p><p>' +
          t +
          '</p></div><div class="yq-lbtips-download"><div class="icon"><i class="chrome"></i><span>Chrome</span></div><div class="icon"><i class="ie11"></i><span>IE11</span></div></div></div></div></div>'
        );
      },
      lowVersionBrowserHandle: function () {
        var e = s.getElementsByTagName('html')[0].getAttribute('lang'),
          t = update_i18n[e] || update_i18n.en,
          i = t.__content1,
          o = t.__content2,
          r = t.__seoTitle,
          n = this.updateHtmlTpl(i, o);
        (s.body.innerHTML = n), (s.title = r + ' | 17TRACK');
      },
    }),
      (o.YQBrowserCheck = new e());
  })(window, document),
  (window.YQ = window.YQ || {}),
  (YQ.UI = {
    byId: function (e) {
      return e && e.tagName ? e : document.getElementById(e);
    },
    byClass: function (e, t) {
      if (t.getElementsByClass) return (t || document).getElementsByClass(e);
      for (var i = [], o = new RegExp('(^| )' + e + '( |$)'), r = this.byTagName('*', t), n = 0; n < r.length; n++)
        o.test(r[n].className) && i.push(r[n]);
      return i;
    },
    byName: function (e) {
      return document.getElementsByName(e);
    },
    byTagName: function (e, t) {
      return (t || document).getElementsByTagName(e);
    },
    hasClass: function (e, t) {
      return e.className.match(new RegExp('(\\s|^)' + t + '(\\s|$)'));
    },
    addClass: function (e, t) {
      this.hasClass(e, t) || (e.className += ' ' + t);
    },
    removeClass: function (e, t) {
      var i;
      this.hasClass(e, t) && ((i = new RegExp('(\\s|^)' + t + '(\\s|$)')), (e.className = e.className.replace(i, ' ')));
    },
    offset: function (e) {
      for (var t = e.offsetLeft, i = e.offsetTop, o = e.offsetParent; null !== o; )
        (t += o.offsetLeft), (i += o.offsetTop), (o = o.offsetParent);
      return { left: t, top: i };
    },
    winSize: function () {
      var e, t;
      return (
        window.innerWidth
          ? ((e = window.innerWidth), (t = window.innerHeight))
          : document.body &&
            document.body.clientWidth &&
            ((e = document.body.clientWidth), (t = document.body.clientHeight)),
        document.documentElement &&
          document.documentElement.clientWidth &&
          document.documentElement.clientHeight &&
          ((e = document.documentElement.clientWidth), (t = document.documentElement.clientHeight)),
        { width: e, height: t }
      );
    },
    scrollLeft: function () {
      return document.documentElement.scrollLeft || document.body.scrollLeft;
    },
    followPos: function (e, t, i, o) {
      var r = this.offset(e),
        n = this.scrollLeft(),
        s = r.left,
        a = s + e.offsetWidth,
        l = s - n,
        d = l + e.offsetWidth,
        c = this.winSize().width,
        u = 'right' === o ? (0 <= d - t ? a - t + 1 : Math.max(a - c, 0)) : t <= c - l - 20 ? s : c - t - 20 + n;
      return { oLeft: u, oTop: r.top + e.offsetHeight + 10 };
    },
    addEvent: function (e, t, i) {
      e.addEventListener
        ? (e['on' + t] = i)
        : e.attachEvent('on' + t, function () {
            i.call(e);
          });
    },
  }),
  (YQ.FN = {
    getClientLang: function () {
      return navigator.browserLanguage || navigator.language || 'en';
    },
    doTrackAppend: function (e) {
      var t = e.YQ_ContainerId,
        i = e.YQ_Num.toString().replace(/(^\s*)|(\s*$)/g, ''),
        o = e.YQ_Fc || 0,
        r = e.YQ_Sc || 0,
        n = e.YQ_Lang || YQ.FN.getClientLang(),
        s = e.YQ_Height || YQ.ExtCall.maxHeight,
        a = e.YQ_RmAD || !1,
        l = e.YQ_RmHeader || !1,
        d = e.YQ_RmLink,
        c = e.YQ_RK,
        u = e.YQ_Query;
      if (!this.isSupport(n)) return !1;
      for (
        var m,
          w = 'trackIframe-' + Math.floor(1e6 * Math.random()),
          p = { apitype: 1, uheight: s, nums: i, fc: o, sc: r, iframeId: w, rmad: a, rmh: l, rml: d, rk: c, query: u },
          f = this.urlEncode(p),
          h = YQ.ExtCall.url + '/' + n + '/track?timestamp=' + new Date().getTime() + f,
          b = document.getElementById(t);
        b.firstChild;

      )
        b.removeChild(b.firstChild);
      return (
        YQ.UI.byId(t) &&
          ((m = document.createElement('iframe')).setAttribute('src', h),
          m.setAttribute('id', w),
          m.setAttribute('width', '100%'),
          m.setAttribute('height', 310),
          m.setAttribute('frameBorder', 0),
          (m.style.border = '1px solid #e0e0e0'),
          (m.style.boxShadow = '0 0px 1px 0 rgba(0,0,0,.12)'),
          (m.style.minWidth = '260px'),
          (m.style.maxHeight = YQ.ExtCall.maxHeight + 'px'),
          (YQ.UI.byId(t).style.display = 'block'),
          YQ.UI.byId(t).appendChild(m)),
        w
      );
    },
    doTrackBox: function (e) {
      var t,
        i,
        o,
        r = e.YQ_Lang || YQ.FN.getClientLang(),
        n = e.YQ_Num.toString().replace(/(^\s*)|(\s*$)/g, ''),
        s = e.YQ_Fc || 0,
        a = e.YQ_Sc || 0,
        l = e.YQ_Width || 322,
        d = e.YQ_Height || YQ.ExtCall.maxHeight,
        c = e.apiType,
        u = e.YQ_RmAD || !1,
        m = e.YQ_RmHeader || !1,
        w = e.YQ_RmLink,
        p = e.YQ_RK,
        f = e.YQ_Direction,
        h = e.YQ_Query;
      if (!this.isSupport(r)) return !1;
      var b = YQ.UI.winSize().width;
      b - 40 < l && (l = b - 40), (i = (t = YQ.UI.followPos(e.follow, l, d, f)).oTop), (o = t.oLeft);
      var _,
        g = 'trackIframe-' + Math.floor(1e6 * Math.random()),
        v = {
          apitype: c,
          uheight: d,
          nums: n,
          fc: s,
          sc: a,
          close: 1,
          iframeId: g,
          rmad: u,
          rmh: m,
          rml: w,
          rk: p,
          query: h,
        },
        y = this.urlEncode(v),
        k = YQ.ExtCall.url + '/' + r + '/track?timestamp=' + new Date().getTime() + y;
      return (
        (_ = document.createElement('iframe')).setAttribute('id', g),
        _.setAttribute('width', l),
        _.setAttribute('height', 310),
        _.setAttribute('frameBorder', 0),
        _.setAttribute('class', 'jcTrackIframe'),
        (_.style.position = 'absolute'),
        (_.style.left = o + 'px'),
        (_.style.top = i + 'px'),
        (_.style.zIndex = 99999),
        (_.style.background = '#fff'),
        (_.style.border = '1px solid #e0e0e0'),
        (_.style.boxShadow = '0 0px 1px 0 rgba(0,0,0,.12)'),
        (_.style.minWidth = '260px'),
        (_.style.maxHeight = YQ.ExtCall.maxHeight + 'px'),
        _.setAttribute('src', k),
        document.body.appendChild(_),
        g
      );
    },
    isSupport: function (e) {
      if (YQBrowserCheck.unSupport()) {
        var t = (e && update_i18n[e]) || update_i18n.en;
        t.__content1, t.__content2;
        return alert(t.__content1 + '\n' + t.__content2), !1;
      }
      return !0;
    },
    getSubdomain: function () {
      try {
        var e = '',
          t = document.domain,
          i = t.split('.');
        if (
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
            t
          ) ||
          'localhost' === t
        )
          return t;
        var o = [];
        for (o.unshift(i.pop()); i.length; ) o.unshift(i.pop()), (e = o.join('.'));
        return e || document.domain;
      } catch (e) {
        return document.domain;
      }
    },
    urlEncode: function (e, t) {
      if ('[object Object]' !== Object.prototype.toString.call(e)) return '';
      var i = [];
      for (o in e) {
        if ('query' === o) break;
        (!e[o] && 0 !== e[o] && !1 !== e[o]) || i.push(o + '=' + (null == t || t ? encodeURIComponent(e[o]) : e[o]));
      }
      var o,
        r = e.query || { utm_medium: 'Referral', utm_source: this.getSubdomain() },
        n = [],
        s = '';
      for (o in r) void 0 !== r[o] && n.push(o + '=' + (null == t || t ? encodeURIComponent(r[o]) : r[o]));
      return 0 < n.length && ((s += '?'), (s += n.join('&'))), s + '#' + i.join('&');
    },
    emitLifecycle: function (e, t) {
      var i = YQ.ExtCall.instances[e],
        o = ['onLoad', 'onLoaded', 'onClose', 'onClosed'];
      if (0 <= o.indexOf(t) && i && i[t] && 'function' == typeof i[t]) {
        var r,
          n = {};
        for (r in i) i.hasOwnProperty(r) && o.indexOf(r) < 0 && (n[r] = i[r]);
        (n.iframeId = e), i[t](n);
      }
    },
    onLifecycle: function (e, t) {
      var i,
        o = YQ.ExtCall.instances;
      for (i in o) o.hasOwnProperty(i) && !YQ.UI.byId(i) && delete o[i];
      o[e] = t;
    },
  }),
  (function (e, h, b) {
    b.configs && b.configs.env;
    for (
      var t = ['enogy-dchome.com', 'renogy.cn'],
        _ = !(b.ExtCall = { url: 'https://extcall.17track.net', minHeight: 488, maxHeight: 800, instances: {} }),
        i = 0;
      i < t.length;
      i++
    ) {
      var o = t[i];
      -1 < location.host.indexOf(o) && (_ = !0);
    }
    (window.YQV5 = {
      trackSingle: function (e) {
        e.YQ_RmLink = _;
        var t = b.FN.doTrackAppend(e);
        b.FN.onLifecycle(t, e);
      },
      trackMulti: function (e) {
        e.YQ_RmLink = _;
        var t,
          i,
          o,
          r,
          n = b.UI.byId(e.YQ_ContainerId);
        n &&
          ((t = e.YQ_Width || '100%'),
          (i = e.YQ_Height || b.ExtCall.minHeight),
          (o = e.YQ_Lang ? b.ExtCall.url + '/' + e.YQ_Lang + '/multiline' : b.ExtCall.url + '/multiline'),
          (o += '#apitype=2'),
          e.YQ_RmAD && (o += '&rmad=true'),
          e.YQ_RmHeader && (o += '&rmh=true'),
          e.YQ_RmLink && (o += '&rml=true'),
          e.YQ_RK && (o += '&rk=' + e.YQ_RK),
          (r = document.createElement('iframe')).setAttribute('src', o),
          r.setAttribute('width', t),
          r.setAttribute('height', i),
          r.setAttribute('frameBorder', 0),
          (r.style.minHeight = '356px'),
          (r.style.maxHeight = b.ExtCall.maxHeight + 'px'),
          n.appendChild(r));
      },
      trackSingleF1: function (p) {
        p.YQ_RmLink = _;
        var f = b.UI.byId(p.YQ_ElementId);
        f &&
          b.UI.addEvent(f, 'click', function () {
            var e = p.YQ_Width,
              t = p.YQ_Height,
              i = p.YQ_Lang || b.FN.getClientLang(),
              o = p.YQ_Num.replace(/\s+/g, ''),
              r = p.YQ_Fc || 0,
              n = p.YQ_Sc || 0,
              s = p.YQ_RmAD || !1,
              a = p.YQ_RmHeader || !1,
              l = p.YQ_RmLink,
              d = p.YQ_RK,
              c = p.YQ_Direction,
              u = p.YQ_Query,
              m = b.UI.byClass('jcTrackIframe', h)[0];
            m && m.parentNode.removeChild(m);
            var w = b.FN.doTrackBox({
              YQ_Width: e,
              YQ_Height: t,
              YQ_Lang: i,
              YQ_Num: o,
              YQ_Fc: r,
              YQ_Sc: n,
              follow: f,
              apiType: 3,
              YQ_RmAD: s,
              YQ_RmHeader: a,
              YQ_RmLink: l,
              YQ_RK: d,
              YQ_Direction: c,
              YQ_Query: u,
            });
            b.FN.onLifecycle(w, p);
          });
      },
      trackSingleF2: function (e) {
        e.YQ_RmLink = _;
        var t,
          i,
          o,
          r,
          n,
          s,
          a,
          l,
          d,
          c,
          u,
          m,
          w,
          p,
          f = b.UI.byId(e.YQ_ElementId);
        f &&
          ((t = e.YQ_Width),
          (i = e.YQ_Height),
          (o = e.YQ_Lang || b.FN.getClientLang()),
          (r = e.YQ_Num),
          (n = e.YQ_Fc || 0),
          (s = e.YQ_Sc || 0),
          (a = e.YQ_RmAD || !1),
          (l = e.YQ_RmHeader || !1),
          (d = e.YQ_RmLink),
          (c = e.YQ_RK),
          (u = e.YQ_Direction),
          (m = e.YQ_Query),
          (w = b.UI.byClass('jcTrackIframe', h)[0]) && w.parentNode.removeChild(w),
          (p = b.FN.doTrackBox({
            YQ_Width: t,
            YQ_Height: i,
            YQ_Lang: o,
            YQ_Num: r,
            YQ_Fc: n,
            YQ_Sc: s,
            follow: f,
            apiType: 4,
            YQ_RmAD: a,
            YQ_RmHeader: l,
            YQ_RmLink: d,
            YQ_RK: c,
            YQ_Direction: u,
            YQ_Query: m,
          })),
          b.FN.onLifecycle(p, e));
      },
      removeTrackIframe: function () {
        var e = b.UI.byClass('jcTrackIframe', h)[0];
        e && e.parentNode.removeChild(e);
      },
    }),
      (window.yqtrack_v4 = function (e) {
        window.YQV5.trackSingle({
          YQ_ContainerId: e.container.id,
          YQ_Height: e.height,
          YQ_Lang: e.lng,
          YQ_Width: e.width,
          YQ_Num: e.num,
          YQ_Fc: e.et || 0,
        });
      }),
      (e.onmessage = function (e) {
        var t, i, o;
        e.origin &&
          e.origin.match(/^http[s]?:\/\/extcall.17track.net/i) &&
          ((i = (e.data && (e.data.iframeId || e.data.closeIframe)) || ''),
          e.data &&
            e.data.setHeight &&
            e.data.setHeight.iframeId &&
            ((o = e.data.setHeight.msg),
            (trackIframe = document.getElementById(e.data.setHeight.iframeId)),
            trackIframe ? trackIframe.setAttribute('height', o) : console.log('No trackIframe', trackIframe)),
          e.data &&
            (e.data.close || e.data.closeIframe) &&
            (b.FN.emitLifecycle(i, 'onClose'),
            (t = document.getElementById(i)) && document.body.removeChild(t),
            b.FN.emitLifecycle(i, 'onClosed')),
          e.data && e.data.loaded && b.FN.emitLifecycle(i, 'onLoaded'));
      });
  })(window, document, YQ);
