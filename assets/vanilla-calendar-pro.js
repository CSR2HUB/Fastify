/*! name: vanilla-calendar-pro v3.0.0 | url: https://github.com/uvarov-frontend/vanilla-calendar-pro */
!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(((e = 'undefined' != typeof globalThis ? globalThis : e || self).VanillaCalendarPro = {}));
})(this, function (e) {
  'use strict';
  var t = Object.defineProperty,
    n = Object.defineProperties,
    a = Object.getOwnPropertyDescriptors,
    o = Object.getOwnPropertySymbols,
    l = Object.prototype.hasOwnProperty,
    s = Object.prototype.propertyIsEnumerable,
    i = (e, n, a) => (n in e ? t(e, n, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (e[n] = a)),
    r = (e, t) => {
      for (var n in t || (t = {})) l.call(t, n) && i(e, n, t[n]);
      if (o) for (var n of o(t)) s.call(t, n) && i(e, n, t[n]);
      return e;
    },
    c = (e, t, n) => (i(e, 'symbol' != typeof t ? t + '' : t, n), n);
  const d = (e) => `${e} is not found, check the first argument passed to new Calendar.`,
    u = 'The calendar has not been initialized, please initialize it using the "init()" method first.',
    m =
      'You specified an incorrect language label or did not specify the required number of values ​​for «locale.weekdays» or «locale.months».',
    v = 'The value of the time property can be: false, 12 or 24.',
    h =
      'For the «multiple» calendar type, the «displayMonthsCount» parameter can have a value from 2 to 12, and for all others it cannot be greater than 1.',
    p = (e, t, n) => {
      e.context[t] = n;
    };
  function y(e) {
    if (!e || !e.getBoundingClientRect) return { top: 0, bottom: 0, left: 0, right: 0 };
    const t = e.getBoundingClientRect(),
      n = document.documentElement;
    return {
      bottom: t.bottom,
      right: t.right,
      top: t.top + window.scrollY - n.clientTop,
      left: t.left + window.scrollX - n.clientLeft,
    };
  }
  function x() {
    return {
      vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
    };
  }
  function g(e) {
    const { top: t, left: n } = {
        left: window.scrollX || document.documentElement.scrollLeft || 0,
        top: window.scrollY || document.documentElement.scrollTop || 0,
      },
      { top: a, left: o } = y(e),
      { vh: l, vw: s } = x(),
      i = a - t,
      r = o - n;
    return { top: i, bottom: l - (i + e.clientHeight), left: r, right: s - (r + e.clientWidth) };
  }
  function b(e, t, n = 5) {
    const a = { top: !0, bottom: !0, left: !0, right: !0 },
      o = [];
    if (!t || !e) return { canShow: a, parentPositions: o };
    const { bottom: l, top: s } = g(e),
      { top: i, left: r } = y(e),
      { height: c, width: d } = t.getBoundingClientRect(),
      { vh: u, vw: m } = x(),
      v = m / 2,
      h = u / 2;
    return (
      [
        { condition: i < h, position: 'top' },
        { condition: i > h, position: 'bottom' },
        { condition: r < v, position: 'left' },
        { condition: r > v, position: 'right' },
      ].forEach(({ condition: e, position: t }) => {
        e && o.push(t);
      }),
      Object.assign(a, { top: c <= s - n, bottom: c <= l - n, left: d <= r, right: d <= m - r }),
      { canShow: a, parentPositions: o }
    );
  }
  const M = (e, t) => {
      var n;
      e.popups &&
        (null == (n = Object.entries(e.popups)) ||
          n.forEach(([n, a]) =>
            ((e, t, n, a) => {
              var o;
              const l = a.querySelector(`[data-vc-date="${t}"]`);
              if (!l) return;
              const s = l.querySelector('[data-vc-date-btn]');
              if (
                ((null == n ? void 0 : n.modifier) && s.classList.add(...n.modifier.trim().split(' ')),
                !(null == n ? void 0 : n.html))
              )
                return;
              const i = document.createElement('div');
              (i.className = e.styles.datePopup),
                (i.dataset.vcDatePopup = ''),
                (i.innerHTML = e.sanitizerHTML(n.html)),
                (s.ariaExpanded = 'true'),
                (s.ariaLabel = `${s.ariaLabel}, ${
                  null == (o = null == i ? void 0 : i.textContent)
                    ? void 0
                    : o.replace(/^\s+|\s+(?=\s)|\s+$/g, '').replace(/&nbsp;/g, ' ')
                }`),
                l.appendChild(i),
                requestAnimationFrame(() => {
                  if (!i) return;
                  const { canShow: e } = b(l, i),
                    t = e.bottom ? l.offsetHeight : -i.offsetHeight,
                    n =
                      e.left && !e.right
                        ? l.offsetWidth - i.offsetWidth / 2
                        : !e.left && e.right
                        ? i.offsetWidth / 2
                        : 0;
                  Object.assign(i.style, { left: `${n}px`, top: `${t}px` });
                });
            })(e, n, a, t)
          ));
    },
    f = (e) => new Date(`${e}T00:00:00`),
    D = (e) =>
      `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, '0')}-${String(e.getDate()).padStart(2, '0')}`,
    E = (e) =>
      e.reduce((e, t) => {
        if (t instanceof Date || 'number' == typeof t) {
          const n = t instanceof Date ? t : new Date(t);
          e.push(n.toISOString().substring(0, 10));
        } else
          t.match(/^(\d{4}-\d{2}-\d{2})$/g)
            ? e.push(t)
            : t.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/g, (t, n, a) => {
                const o = f(n),
                  l = f(a),
                  s = new Date(o.getTime());
                for (; s <= l; s.setDate(s.getDate() + 1)) e.push(D(s));
                return t;
              });
        return e;
      }, []),
    w = (e, t, n, a = '') => {
      t ? e.setAttribute(n, a) : e.getAttribute(n) === a && e.removeAttribute(n);
    },
    T = (e, t, n, a, o, l, s) => {
      var i, r, c, d;
      const u =
        f(e.context.displayDateMin) > f(l) ||
        f(e.context.displayDateMax) < f(l) ||
        (null == (i = e.context.disableDates) ? void 0 : i.includes(l)) ||
        (!e.selectionMonthsMode && 'current' !== s) ||
        (!e.selectionYearsMode && f(l).getFullYear() !== t);
      w(n, u, 'data-vc-date-disabled'),
        a && w(a, u, 'aria-disabled', 'true'),
        a && w(a, u, 'tabindex', '-1'),
        w(n, !e.disableToday && e.context.dateToday === l, 'data-vc-date-today'),
        w(n, !e.disableToday && e.context.dateToday === l, 'aria-current', 'date'),
        w(n, null == (r = e.selectedWeekends) ? void 0 : r.includes(o), 'data-vc-date-weekend');
      const m = (null == (c = e.selectedHolidays) ? void 0 : c[0]) ? E(e.selectedHolidays) : [];
      if (
        (w(n, m.includes(l), 'data-vc-date-holiday'),
        (null == (d = e.context.selectedDates) ? void 0 : d.includes(l))
          ? (n.setAttribute('data-vc-date-selected', ''),
            a && a.setAttribute('aria-selected', 'true'),
            e.context.selectedDates.length > 1 &&
              'multiple-ranged' === e.selectionDatesMode &&
              (e.context.selectedDates[0] === l && n.setAttribute('data-vc-date-selected', 'first'),
              e.context.selectedDates[e.context.selectedDates.length - 1] === l &&
                n.setAttribute('data-vc-date-selected', 'last'),
              e.context.selectedDates[0] !== l &&
                e.context.selectedDates[e.context.selectedDates.length - 1] !== l &&
                n.setAttribute('data-vc-date-selected', 'middle')))
          : n.hasAttribute('data-vc-date-selected') &&
            (n.removeAttribute('data-vc-date-selected'), a && a.removeAttribute('aria-selected')),
        !e.context.disableDates.includes(l) &&
          e.enableEdgeDatesOnly &&
          e.context.selectedDates.length > 1 &&
          'multiple-ranged' === e.selectionDatesMode)
      ) {
        const t = f(e.context.selectedDates[0]),
          a = f(e.context.selectedDates[e.context.selectedDates.length - 1]),
          o = f(l);
        w(n, o > t && o < a, 'data-vc-date-selected', 'middle');
      }
    },
    k = (e, t) => {
      const n = f(e),
        a = (n.getDay() - t + 7) % 7;
      n.setDate(n.getDate() + 4 - a);
      const o = new Date(n.getFullYear(), 0, 1),
        l = Math.ceil(((+n - +o) / 864e5 + 1) / 7);
      return { year: n.getFullYear(), week: l };
    },
    $ = (e, t, n, a, o, l) => {
      const s = f(o).getDay(),
        i = 'string' == typeof e.locale && e.locale.length ? e.locale : 'en',
        r = document.createElement('div');
      let c;
      (r.className = e.styles.date),
        (r.dataset.vcDate = o),
        (r.dataset.vcDateMonth = l),
        (r.dataset.vcDateWeekDay = String(s)),
        ('current' === l || e.displayDatesOutside) &&
          ((c = document.createElement('button')),
          (c.className = e.styles.dateBtn),
          (c.type = 'button'),
          (c.role = 'gridcell'),
          (c.ariaLabel = ((e, t, n) => new Date(`${e}T00:00:00.000Z`).toLocaleString(t, n))(o, i, {
            dateStyle: 'long',
            timeZone: 'UTC',
          })),
          (c.dataset.vcDateBtn = ''),
          (c.innerText = String(a)),
          r.appendChild(c)),
        e.enableWeekNumbers &&
          ((e, t, n) => {
            const a = k(n, e.firstWeekday);
            a && (t.dataset.vcDateWeekNumber = String(a.week));
          })(e, r, o),
        ((e, t, n) => {
          var a, o, l, s, i;
          const r = null == (a = e.disableWeekdays) ? void 0 : a.includes(n),
            c = e.disableAllDates && !!(null == (o = e.context.enableDates) ? void 0 : o[0]);
          (!r && !c) ||
            (null == (l = e.context.enableDates) ? void 0 : l.includes(t)) ||
            (null == (s = e.context.disableDates) ? void 0 : s.includes(t)) ||
            (e.context.disableDates.push(t),
            null == (i = e.context.disableDates) || i.sort((e, t) => +new Date(e) - +new Date(t)));
        })(e, o, s),
        T(e, t, r, c, s, o, l),
        n.appendChild(r),
        e.onCreateDateEls && e.onCreateDateEls(e, r);
    },
    A = (e) => {
      const t = new Date(e.context.selectedYear, e.context.selectedMonth, 1),
        n = e.context.mainElement.querySelectorAll('[data-vc="dates"]'),
        a = e.context.mainElement.querySelectorAll('[data-vc-week="numbers"]');
      n.forEach((n, o) => {
        e.selectionDatesMode || (n.dataset.vcDatesDisabled = ''), (n.textContent = '');
        const l = new Date(t);
        l.setMonth(l.getMonth() + o);
        const s = l.getMonth(),
          i = l.getFullYear(),
          r = (new Date(i, s, 1).getDay() - e.firstWeekday + 7) % 7,
          c = new Date(i, s + 1, 0).getDate();
        ((e, t, n, a, o) => {
          let l = new Date(n, a, 0).getDate() - (o - 1);
          const s = 0 === a ? n - 1 : n,
            i = 0 === a ? 12 : a < 10 ? `0${a}` : a;
          for (let a = o; a > 0; a--, l++) $(e, n, t, l, `${s}-${i}-${l}`, 'prev');
        })(e, n, i, s, r),
          ((e, t, n, a, o) => {
            for (let l = 1; l <= n; l++) {
              const n = new Date(a, o, l);
              $(e, a, t, l, D(n), 'current');
            }
          })(e, n, c, i, s),
          ((e, t, n, a, o, l) => {
            const s = l + n,
              i = 7 * Math.ceil(s / 7) - s,
              r = o + 1 === 12 ? a + 1 : a,
              c = o + 1 === 12 ? '01' : o + 2 < 10 ? `0${o + 2}` : o + 2;
            for (let n = 1; n <= i; n++) {
              const o = n < 10 ? `0${n}` : String(n);
              $(e, a, t, n, `${r}-${c}-${o}`, 'next');
            }
          })(e, n, c, i, s, r),
          M(e, n),
          ((e, t, n, a, o) => {
            if (!e.enableWeekNumbers) return;
            a.textContent = '';
            const l = document.createElement('b');
            (l.className = e.styles.weekNumbersTitle),
              (l.innerText = '#'),
              (l.dataset.vcWeekNumbers = 'title'),
              a.appendChild(l);
            const s = document.createElement('div');
            (s.className = e.styles.weekNumbersContent), (s.dataset.vcWeekNumbers = 'content'), a.appendChild(s);
            const i = document.createElement('button');
            (i.type = 'button'), (i.className = e.styles.weekNumber);
            const r = o.querySelectorAll('[data-vc-date]'),
              c = Math.ceil((t + n) / 7);
            for (let t = 0; t < c; t++) {
              const n = r[0 === t ? 6 : 7 * t].dataset.vcDate,
                a = k(n, e.firstWeekday);
              if (!a) return;
              const o = i.cloneNode(!0);
              (o.innerText = String(a.week)),
                (o.dataset.vcWeekNumber = String(a.week)),
                (o.dataset.vcWeekYear = String(a.year)),
                (o.role = 'rowheader'),
                (o.ariaLabel = `${a.week}`),
                s.appendChild(o);
            }
          })(e, r, c, a[o], n);
      });
    },
    C = (e) =>
      `\n  <div class="${e.styles.header}" data-vc="header" role="toolbar" aria-label="${e.labels.navigation}">\n    <#ArrowPrev [month] />\n    <div class="${e.styles.headerContent}" data-vc-header="content">\n      <#Month />\n      <#Year />\n    </div>\n    <#ArrowNext [month] />\n  </div>\n  <div class="${e.styles.wrapper}" data-vc="wrapper">\n    <#WeekNumbers />\n    <div class="${e.styles.content}" data-vc="content">\n      <#Week />\n      <#Dates />\n      <#DateRangeTooltip />\n    </div>\n  </div>\n  <#ControlTime />\n`,
    S = (e) =>
      `\n  <div class="${e.styles.header}" data-vc="header" role="toolbar" aria-label="${e.labels.navigation}">\n    <div class="${e.styles.headerContent}" data-vc-header="content">\n      <#Month />\n      <#Year />\n    </div>\n  </div>\n  <div class="${e.styles.wrapper}" data-vc="wrapper">\n    <div class="${e.styles.content}" data-vc="content">\n      <#Months />\n    </div>\n  </div>\n`,
    Y = (e) =>
      `\n  <div class="${e.styles.controls}" data-vc="controls" role="toolbar" aria-label="${e.labels.navigation}">\n    <#ArrowPrev [month] />\n    <#ArrowNext [month] />\n  </div>\n  <div class="${e.styles.grid}" data-vc="grid">\n    <#Multiple>\n      <div class="${e.styles.column}" data-vc="column" role="region">\n        <div class="${e.styles.header}" data-vc="header">\n          <div class="${e.styles.headerContent}" data-vc-header="content">\n            <#Month />\n            <#Year />\n          </div>\n        </div>\n        <div class="${e.styles.wrapper}" data-vc="wrapper">\n          <#WeekNumbers />\n          <div class="${e.styles.content}" data-vc="content">\n            <#Week />\n            <#Dates />\n          </div>\n        </div>\n      </div>\n    <#/Multiple>\n    <#DateRangeTooltip />\n  </div>\n  <#ControlTime />\n`,
    N = (e) =>
      `\n  <div class="${e.styles.header}" data-vc="header" role="toolbar" aria-label="${e.labels.navigation}">\n    <#ArrowPrev [year] />\n    <div class="${e.styles.headerContent}" data-vc-header="content">\n      <#Month />\n      <#Year />\n    </div>\n    <#ArrowNext [year] />\n  </div>\n  <div class="${e.styles.wrapper}" data-vc="wrapper">\n    <div class="${e.styles.content}" data-vc="content">\n      <#Years />\n    </div>\n  </div>\n`,
    L = {
      ArrowNext: (e, t) =>
        `<button type="button" class="${e.styles.arrowNext}" data-vc-arrow="next" aria-label="${e.labels.arrowNext[t]}"></button>`,
      ArrowPrev: (e, t) =>
        `<button type="button" class="${e.styles.arrowPrev}" data-vc-arrow="prev" aria-label="${e.labels.arrowPrev[t]}"></button>`,
      ControlTime: (e) =>
        e.selectionTimeMode
          ? `<div class="${e.styles.time}" data-vc="time" role="group" aria-label="${e.labels.selectingTime}"></div>`
          : '',
      Dates: (e) =>
        `<div class="${e.styles.dates}" data-vc="dates" role="grid" aria-live="assertive" aria-label="${
          e.labels.dates
        }" ${'multiple' === e.type ? 'aria-multiselectable' : ''}></div>`,
      DateRangeTooltip: (e) =>
        e.onCreateDateRangeTooltip
          ? `<div class="${e.styles.dateRangeTooltip}" data-vc-date-range-tooltip="hidden"></div>`
          : '',
      Month: (e) => `<button type="button" class="${e.styles.month}" data-vc="month"></button>`,
      Months: (e) =>
        `<div class="${e.styles.months}" data-vc="months" role="grid" aria-live="assertive" aria-label="${e.labels.months}"></div>`,
      Week: (e) => `<div class="${e.styles.week}" data-vc="week" role="row" aria-label="${e.labels.week}"></div>`,
      WeekNumbers: (e) =>
        e.enableWeekNumbers
          ? `<div class="${e.styles.weekNumbers}" data-vc-week="numbers" role="row" aria-label="${e.labels.weekNumber}"></div>`
          : '',
      Year: (e) => `<button type="button" class="${e.styles.year}" data-vc="year"></button>`,
      Years: (e) =>
        `<div class="${e.styles.years}" data-vc="years" role="grid" aria-live="assertive" aria-label="${e.labels.years}"></div>`,
    },
    H = (e, t) =>
      t
        .replace(/[\n\t]/g, '')
        .replace(/<#(?!\/?Multiple)(.*?)>/g, (t, n) => {
          const a = (n.match(/\[(.*?)\]/) || [])[1],
            o = n.replace(/[/\s\n\t]|\[(.*?)\]/g, ''),
            l = L[o];
          const s = l ? l(e, null != a ? a : null) : '';
          return e.sanitizerHTML(s);
        })
        .replace(/[\n\t]/g, ''),
    W = (e, t) => {
      const n = { default: C, month: S, year: N, multiple: Y };
      if (
        (Object.keys(n).forEach((t) => {
          const a = t;
          e.layouts[a].length || (e.layouts[a] = n[a](e));
        }),
        (e.context.mainElement.className = e.styles.calendar),
        (e.context.mainElement.dataset.vc = 'calendar'),
        (e.context.mainElement.dataset.vcType = e.context.currentType),
        (e.context.mainElement.role = 'application'),
        (e.context.mainElement.tabIndex = 0),
        (e.context.mainElement.ariaLabel = e.labels.application),
        'multiple' !== e.context.currentType)
      ) {
        if ('multiple' === e.type && t) {
          const n = e.context.mainElement.querySelector('[data-vc="controls"]'),
            a = e.context.mainElement.querySelector('[data-vc="grid"]'),
            o = t.closest('[data-vc="column"]');
          return (
            n && e.context.mainElement.removeChild(n),
            a && (a.dataset.vcGrid = 'hidden'),
            o && (o.dataset.vcColumn = e.context.currentType),
            void (o && (o.innerHTML = e.sanitizerHTML(H(e, e.layouts[e.context.currentType]))))
          );
        }
        e.context.mainElement.innerHTML = e.sanitizerHTML(H(e, e.layouts[e.context.currentType]));
      } else
        e.context.mainElement.innerHTML = e.sanitizerHTML(
          ((e, t) =>
            t
              .replace(new RegExp('<#Multiple>(.*?)<#\\/Multiple>', 'gs'), (t, n) => {
                const a = Array(e.context.displayMonthsCount).fill(n).join('');
                return e.sanitizerHTML(a);
              })
              .replace(/[\n\t]/g, ''))(e, H(e, e.layouts[e.context.currentType]))
        );
    },
    q = (e, t, n, a) => {
      (e.style.visibility = n ? 'hidden' : ''), (t.style.visibility = a ? 'hidden' : '');
    },
    P = (e) => {
      if ('month' === e.context.currentType) return;
      const t = e.context.mainElement.querySelector('[data-vc-arrow="prev"]'),
        n = e.context.mainElement.querySelector('[data-vc-arrow="next"]');
      if (!t || !n) return;
      const a = {
        default: () =>
          ((e, t, n) => {
            const a = f(D(new Date(e.context.selectedYear, e.context.selectedMonth, 1))),
              o = new Date(a.getTime()),
              l = new Date(a.getTime());
            o.setMonth(o.getMonth() - e.monthsToSwitch), l.setMonth(l.getMonth() + e.monthsToSwitch);
            const s = f(e.context.dateMin),
              i = f(e.context.dateMax);
            e.selectionYearsMode || (s.setFullYear(a.getFullYear()), i.setFullYear(a.getFullYear()));
            const r =
                !e.selectionMonthsMode ||
                o.getFullYear() < s.getFullYear() ||
                (o.getFullYear() === s.getFullYear() && o.getMonth() < s.getMonth()),
              c =
                !e.selectionMonthsMode ||
                l.getFullYear() > i.getFullYear() ||
                (l.getFullYear() === i.getFullYear() && l.getMonth() > i.getMonth());
            q(t, n, r, c);
          })(e, t, n),
        year: () =>
          ((e, t, n) => {
            const a = f(e.context.dateMin),
              o = f(e.context.dateMax),
              l = !!(a.getFullYear() && e.context.displayYear - 7 <= a.getFullYear()),
              s = !!(o.getFullYear() && e.context.displayYear + 7 >= o.getFullYear());
            q(t, n, l, s);
          })(e, t, n),
      };
      a['multiple' === e.context.currentType ? 'default' : e.context.currentType]();
    },
    F = (e) => {
      const t = e.context.mainElement.querySelectorAll('[data-vc="month"]'),
        n = e.context.mainElement.querySelectorAll('[data-vc="year"]'),
        a = new Date(e.context.selectedYear, e.context.selectedMonth, 1);
      [t, n].forEach((t) =>
        null == t
          ? void 0
          : t.forEach((t, n) =>
              ((e, t, n, a, o) => {
                const l = new Date(a.setFullYear(e.context.selectedYear, e.context.selectedMonth + n)).getFullYear(),
                  s = new Date(a.setMonth(e.context.selectedMonth + n)).getMonth(),
                  i = e.context.locale.months.long[s],
                  r = t.closest('[data-vc="column"]');
                r && (r.ariaLabel = `${i} ${l}`);
                const c = { month: { id: s, label: i }, year: { id: l, label: l } };
                (t.innerText = String(c[o].label)),
                  (t.dataset[`vc${o.charAt(0).toUpperCase() + o.slice(1)}`] = String(c[o].id)),
                  (t.ariaLabel = `${e.labels[o]} ${c[o].label}`);
                const d = { month: e.selectionMonthsMode, year: e.selectionYearsMode },
                  u = !1 === d[o] || 'only-arrows' === d[o];
                u && (t.tabIndex = -1), (t.disabled = u);
              })(e, t, n, a, t.dataset.vc)
            )
      );
    },
    I = (e, t, n, a, o) => {
      var l;
      const s = { month: '[data-vc-months-month]', year: '[data-vc-years-year]' },
        i = {
          month: {
            selected: 'data-vc-months-month-selected',
            aria: 'aria-selected',
            value: 'vcMonthsMonth',
            selectedProperty: 'selectedMonth',
          },
          year: {
            selected: 'data-vc-years-year-selected',
            aria: 'aria-selected',
            value: 'vcYearsYear',
            selectedProperty: 'selectedYear',
          },
        };
      o &&
        (null == (l = e.context.mainElement.querySelectorAll(s[n])) ||
          l.forEach((e) => {
            e.removeAttribute(i[n].selected), e.removeAttribute(i[n].aria);
          }),
        p(e, i[n].selectedProperty, Number(t.dataset[i[n].value])),
        F(e),
        'year' === n && P(e)),
        a && (t.setAttribute(i[n].selected, ''), t.setAttribute(i[n].aria, 'true'));
    },
    _ = (e) => {
      if ('multiple' !== e.type) return 0;
      const t = e.context.mainElement.querySelectorAll('[data-vc="column"]'),
        n = Array.from(t).findIndex((e) => e.closest('[data-vc-column="month"]'));
      return n > 0 ? n : 0;
    },
    O = (e, t, n, a, o, l, s) => {
      const i = t.cloneNode(!1);
      return (
        (i.className = e.styles.monthsMonth),
        (i.innerText = a),
        (i.ariaLabel = o),
        (i.role = 'gridcell'),
        (i.dataset.vcMonthsMonth = `${s}`),
        l && (i.ariaDisabled = 'true'),
        l && (i.tabIndex = -1),
        (i.disabled = l),
        I(e, i, 'month', n === s, !1),
        i
      );
    },
    R = (e, t) => {
      var n, a;
      const o =
          null == (n = null == t ? void 0 : t.closest('[data-vc="header"]'))
            ? void 0
            : n.querySelector('[data-vc="year"]'),
        l = o ? Number(o.dataset.vcYear) : e.context.selectedYear,
        s = (null == t ? void 0 : t.dataset.vcMonth) ? Number(t.dataset.vcMonth) : e.context.selectedMonth;
      p(e, 'currentType', 'month'), W(e, t), F(e);
      const i = e.context.mainElement.querySelector('[data-vc="months"]');
      if (!e.selectionMonthsMode || !i) return;
      const r =
          e.monthsToSwitch > 1
            ? e.context.locale.months.long
                .map((t, n) => s - e.monthsToSwitch * n)
                .concat(e.context.locale.months.long.map((t, n) => s + e.monthsToSwitch * n))
                .filter((e) => e >= 0 && e <= 12)
            : Array.from(Array(12).keys()),
        c = document.createElement('button');
      c.type = 'button';
      for (let t = 0; t < 12; t++) {
        const n = f(e.context.dateMin),
          a = f(e.context.dateMax),
          o =
            (t < n.getMonth() + _(e) && l <= n.getFullYear()) ||
            (t > a.getMonth() + _(e) && l >= a.getFullYear()) ||
            (t !== s && !r.includes(t)),
          d = O(e, c, s, e.context.locale.months.short[t], e.context.locale.months.long[t], o, t);
        i.appendChild(d), e.onCreateMonthEls && e.onCreateMonthEls(e, d);
      }
      null == (a = e.context.mainElement.querySelector('[data-vc-months-month]')) || a.focus();
    },
    K = (e, t, n, a, o) =>
      `\n  <label class="${t}" data-vc-time-input="${e}">\n    <input type="text" name="${e}" maxlength="2" aria-label="${
        n[`input${e.charAt(0).toUpperCase() + e.slice(1)}`]
      }" value="${a}" ${o ? 'disabled' : ''}>\n  </label>\n`,
    z = (e, t, n, a, o, l, s) =>
      `\n  <label class="${t}" data-vc-time-range="${e}">\n    <input type="range" name="${e}" min="${a}" max="${o}" step="${l}" aria-label="${
        n[`range${e.charAt(0).toUpperCase() + e.slice(1)}`]
      }" value="${s}">\n  </label>\n`,
    j = (e, t, n, a) => {
      ({ hour: () => p(e, 'selectedHours', n), minute: () => p(e, 'selectedMinutes', n) })[a](),
        p(
          e,
          'selectedTime',
          `${e.context.selectedHours}:${e.context.selectedMinutes}${
            e.context.selectedKeeping ? ` ${e.context.selectedKeeping}` : ''
          }`
        ),
        e.onChangeTime && e.onChangeTime(e, t, !1),
        e.inputMode && e.context.inputElement && e.context.mainElement && e.onChangeToInput && e.onChangeToInput(e, t);
    },
    U = (e, t) => {
      var n;
      return (
        (null ==
        (n = {
          0: { AM: '00', PM: '12' },
          1: { AM: '01', PM: '13' },
          2: { AM: '02', PM: '14' },
          3: { AM: '03', PM: '15' },
          4: { AM: '04', PM: '16' },
          5: { AM: '05', PM: '17' },
          6: { AM: '06', PM: '18' },
          7: { AM: '07', PM: '19' },
          8: { AM: '08', PM: '20' },
          9: { AM: '09', PM: '21' },
          10: { AM: '10', PM: '22' },
          11: { AM: '11', PM: '23' },
          12: { AM: '00', PM: '12' },
        }[Number(e)])
          ? void 0
          : n[t]) || String(e)
      );
    },
    B = (e) =>
      ({
        0: '12',
        13: '01',
        14: '02',
        15: '03',
        16: '04',
        17: '05',
        18: '06',
        19: '07',
        20: '08',
        21: '09',
        22: '10',
        23: '11',
      }[Number(e)] || String(e)),
    Z = (e, t, n, a) => {
      (e.value = n), (t.value = a);
    },
    G = (e, t, n, a, o, l, s) => {
      const i = {
          hour: (i, r, c) => {
            if (!e.selectionTimeMode) return;
            const d = {
              12: () => {
                if (!e.context.selectedKeeping) return;
                const d = Number(U(r, e.context.selectedKeeping));
                if (!(d <= l && d >= s))
                  return (
                    Z(n, t, e.context.selectedHours, e.context.selectedHours),
                    void (e.onChangeTime && e.onChangeTime(e, c, !0))
                  );
                Z(n, t, B(r), U(r, e.context.selectedKeeping)),
                  i > 12 &&
                    ((e, t, n) => {
                      t && n && (p(e, 'selectedKeeping', n), (t.innerText = n));
                    })(e, a, 'PM'),
                  j(e, c, B(r), o);
              },
              24: () => {
                if (!(i <= l && i >= s))
                  return (
                    Z(n, t, e.context.selectedHours, e.context.selectedHours),
                    void (e.onChangeTime && e.onChangeTime(e, c, !0))
                  );
                Z(n, t, r, r), j(e, c, r, o);
              },
            };
            d[e.selectionTimeMode]();
          },
          minute: (a, i, r) => {
            if (!(a <= l && a >= s))
              return (n.value = e.context.selectedMinutes), void (e.onChangeTime && e.onChangeTime(e, r, !0));
            (n.value = i), (t.value = i), j(e, r, i, o);
          },
        },
        r = (e) => {
          const t = Number(n.value),
            a = n.value.padStart(2, '0');
          i[o] && i[o](t, a, e);
        };
      return (
        n.addEventListener('change', r),
        () => {
          n.removeEventListener('change', r);
        }
      );
    },
    J = (e, t, n, a, o) => {
      const l = (l) => {
        const s = Number(t.value),
          i = t.value.padStart(2, '0'),
          r = 'hour' === o,
          c = 24 === e.selectionTimeMode,
          d = s > 0 && s < 12;
        r &&
          !c &&
          ((e, t, n) => {
            t && (p(e, 'selectedKeeping', n), (t.innerText = n));
          })(e, a, 0 === s || d ? 'AM' : 'PM'),
          ((e, t, n, a, o) => {
            (t.value = o), j(e, n, o, a);
          })(e, n, l, o, !r || c || d ? i : B(t.value));
      };
      return (
        t.addEventListener('input', l),
        () => {
          t.removeEventListener('input', l);
        }
      );
    },
    X = (e) => e.setAttribute('data-vc-input-focus', ''),
    V = (e) => e.removeAttribute('data-vc-input-focus'),
    Q = (e, t) => {
      const n = t.querySelector('[data-vc-time-range="hour"] input[name="hour"]'),
        a = t.querySelector('[data-vc-time-range="minute"] input[name="minute"]'),
        o = t.querySelector('[data-vc-time-input="hour"] input[name="hour"]'),
        l = t.querySelector('[data-vc-time-input="minute"] input[name="minute"]'),
        s = t.querySelector('[data-vc-time="keeping"]');
      if (!(n && a && o && l)) return;
      const i = (e) => {
          e.target === n && X(o), e.target === a && X(l);
        },
        r = (e) => {
          e.target === n && V(o), e.target === a && V(l);
        };
      return (
        t.addEventListener('mouseover', i),
        t.addEventListener('mouseout', r),
        G(e, n, o, s, 'hour', e.timeMaxHour, e.timeMinHour),
        G(e, a, l, s, 'minute', e.timeMaxMinute, e.timeMinMinute),
        J(e, n, o, s, 'hour'),
        J(e, a, l, s, 'minute'),
        s &&
          ((e, t, n, a, o) => {
            const l = (l) => {
              const s = 'AM' === e.context.selectedKeeping ? 'PM' : 'AM',
                i = U(e.context.selectedHours, s);
              Number(i) <= a && Number(i) >= o
                ? (p(e, 'selectedKeeping', s),
                  (n.value = i),
                  j(e, l, e.context.selectedHours, 'hour'),
                  (t.ariaLabel = `${e.labels.btnKeeping} ${e.context.selectedKeeping}`),
                  (t.innerText = e.context.selectedKeeping))
                : e.onChangeTime && e.onChangeTime(e, l, !0);
            };
            t.addEventListener('click', l);
          })(e, s, n, e.timeMaxHour, e.timeMinHour),
        () => {
          t.removeEventListener('mouseover', i), t.removeEventListener('mouseout', r);
        }
      );
    },
    ee = (e) => {
      const t = e.selectedWeekends ? [...e.selectedWeekends] : [],
        n = [...e.context.locale.weekdays.long].reduce(
          (n, a, o) => [
            ...n,
            { id: o, titleShort: e.context.locale.weekdays.short[o], titleLong: a, isWeekend: t.includes(o) },
          ],
          []
        ),
        a = [...n.slice(e.firstWeekday), ...n.slice(0, e.firstWeekday)];
      e.context.mainElement.querySelectorAll('[data-vc="week"]').forEach((t) => {
        const n = document.createElement('button');
        (n.type = 'button'),
          a.forEach((a) => {
            const o = n.cloneNode(!0);
            (o.innerText = a.titleShort),
              (o.className = e.styles.weekDay),
              (o.role = 'columnheader'),
              (o.ariaLabel = a.titleLong),
              (o.dataset.vcWeekDay = String(a.id)),
              a.isWeekend && (o.dataset.vcWeekDayOff = ''),
              t.appendChild(o);
          });
      });
    },
    te = (e, t, n, a, o) => {
      const l = t.cloneNode(!1);
      return (
        (l.className = e.styles.yearsYear),
        (l.innerText = String(o)),
        (l.ariaLabel = String(o)),
        (l.role = 'gridcell'),
        (l.dataset.vcYearsYear = `${o}`),
        a && (l.ariaDisabled = 'true'),
        a && (l.tabIndex = -1),
        (l.disabled = a),
        I(e, l, 'year', n === o, !1),
        l
      );
    },
    ne = (e, t) => {
      var n;
      const a = (null == t ? void 0 : t.dataset.vcYear) ? Number(t.dataset.vcYear) : e.context.selectedYear;
      p(e, 'currentType', 'year'), W(e, t), F(e), P(e);
      const o = e.context.mainElement.querySelector('[data-vc="years"]');
      if (!e.selectionYearsMode || !o) return;
      const l = 'multiple' !== e.type || e.context.selectedYear === a ? 0 : 1,
        s = document.createElement('button');
      s.type = 'button';
      for (let t = e.context.displayYear - 7; t < e.context.displayYear + 8; t++) {
        const n = t < f(e.context.dateMin).getFullYear() + l || t > f(e.context.dateMax).getFullYear(),
          i = te(e, s, a, n, t);
        o.appendChild(i), e.onCreateYearEls && e.onCreateYearEls(e, i);
      }
      null == (n = e.context.mainElement.querySelector('[data-vc-years-year]')) || n.focus();
    },
    ae = { value: !1, set: () => (ae.value = !0), check: () => ae.value },
    oe = (e, t) => (e.dataset.vcTheme = t),
    le = (e, t) => {
      if ((oe(e.context.mainElement, t.matches ? 'dark' : 'light'), 'system' !== e.selectedTheme || ae.check())) return;
      const n = (e) => {
        const t = document.querySelectorAll('[data-vc="calendar"]');
        null == t || t.forEach((t) => oe(t, e.matches ? 'dark' : 'light'));
      };
      t.addEventListener ? t.addEventListener('change', n) : t.addListener(n), ae.set();
    },
    se = (e, t) => {
      const n = e.themeAttrDetect.length ? document.querySelector(e.themeAttrDetect) : null,
        a = e.themeAttrDetect.replace(/^.*\[(.+)\]/g, (e, t) => t);
      if (!n || 'system' === n.getAttribute(a)) return void le(e, t);
      const o = n.getAttribute(a);
      o
        ? (oe(e.context.mainElement, o),
          ((e, t, n) => {
            new MutationObserver((e) => {
              for (let a = 0; a < e.length; a++)
                if (e[a].attributeName === t) {
                  n();
                  break;
                }
            }).observe(e, { attributes: !0 });
          })(n, a, () => {
            const t = n.getAttribute(a);
            t && oe(e.context.mainElement, t);
          }))
        : le(e, t);
    },
    ie = (e) => e.charAt(0).toUpperCase() + e.slice(1).replace(/\./, ''),
    re = (e) => {
      var t, n, a, o, l, s, i, c;
      if (
        !(
          e.context.locale.weekdays.short[6] &&
          e.context.locale.weekdays.long[6] &&
          e.context.locale.months.short[11] &&
          e.context.locale.months.long[11]
        )
      )
        if ('string' == typeof e.locale) {
          if ('string' == typeof e.locale && !e.locale.length) throw new Error(m);
          Array.from({ length: 7 }, (t, n) =>
            ((e, t, n) => {
              const a = new Date(`1978-01-0${t + 1}T00:00:00.000Z`),
                o = a.toLocaleString(n, { weekday: 'short', timeZone: 'UTC' }),
                l = a.toLocaleString(n, { weekday: 'long', timeZone: 'UTC' });
              e.context.locale.weekdays.short.push(ie(o)), e.context.locale.weekdays.long.push(ie(l));
            })(e, n, e.locale)
          ),
            Array.from({ length: 12 }, (t, n) =>
              ((e, t, n) => {
                const a = new Date(`1978-${String(t + 1).padStart(2, '0')}-01T00:00:00.000Z`),
                  o = a.toLocaleString(n, { month: 'short', timeZone: 'UTC' }),
                  l = a.toLocaleString(n, { month: 'long', timeZone: 'UTC' });
                e.context.locale.months.short.push(ie(o)), e.context.locale.months.long.push(ie(l));
              })(e, n, e.locale)
            );
        } else {
          if (
            !(
              (null == (n = null == (t = e.locale) ? void 0 : t.weekdays) ? void 0 : n.short[6]) &&
              (null == (o = null == (a = e.locale) ? void 0 : a.weekdays) ? void 0 : o.long[6]) &&
              (null == (s = null == (l = e.locale) ? void 0 : l.months) ? void 0 : s.short[11]) &&
              (null == (c = null == (i = e.locale) ? void 0 : i.months) ? void 0 : c.long[11])
            )
          )
            throw new Error(m);
          p(e, 'locale', r({}, e.locale));
        }
    },
    ce = (e) => {
      const t = {
        default: () => {
          ee(e), A(e);
        },
        multiple: () => {
          ee(e), A(e);
        },
        month: () => R(e),
        year: () => ne(e),
      };
      ((e) => {
        'not all' !== window.matchMedia('(prefers-color-scheme)').media
          ? 'system' === e.selectedTheme
            ? se(e, window.matchMedia('(prefers-color-scheme: dark)'))
            : oe(e.context.mainElement, e.selectedTheme)
          : oe(e.context.mainElement, 'light');
      })(e),
        re(e),
        W(e),
        F(e),
        P(e),
        ((e) => {
          const t = e.context.mainElement.querySelector('[data-vc="time"]');
          if (!e.selectionTimeMode || !t) return;
          const [n, a] = [e.timeMinHour, e.timeMaxHour],
            [o, l] = [e.timeMinMinute, e.timeMaxMinute],
            s = e.context.selectedKeeping
              ? U(e.context.selectedHours, e.context.selectedKeeping)
              : e.context.selectedHours,
            i = 'range' === e.timeControls;
          var r;
          (t.innerHTML = e.sanitizerHTML(
            `\n    <div class="${e.styles.timeContent}" data-vc-time="content">\n      ${K(
              'hour',
              e.styles.timeHour,
              e.labels,
              e.context.selectedHours,
              i
            )}\n      ${K('minute', e.styles.timeMinute, e.labels, e.context.selectedMinutes, i)}\n      ${
              12 === e.selectionTimeMode
                ? ((r = e.context.selectedKeeping),
                  `<button type="button" class="${e.styles.timeKeeping}" aria-label="${
                    e.labels.btnKeeping
                  } ${r}" data-vc-time="keeping" ${i ? 'disabled' : ''}>${r}</button>`)
                : ''
            }\n    </div>\n    <div class="${e.styles.timeRanges}" data-vc-time="ranges">\n      ${z(
              'hour',
              e.styles.timeRange,
              e.labels,
              n,
              a,
              e.timeStepHour,
              s
            )}\n      ${z(
              'minute',
              e.styles.timeRange,
              e.labels,
              o,
              l,
              e.timeStepMinute,
              e.context.selectedMinutes
            )}\n    </div>\n  `
          )),
            Q(e, t);
        })(e),
        t[e.context.currentType]();
    },
    de = (e) => {
      const t = () => Array.from(e.context.mainElement.querySelectorAll('[data-vc="calendar"] button'));
      let n = 0;
      const a = {
          ArrowUp: (e, t) => Math.max(0, e - t),
          ArrowDown: (e, n) => Math.min(t().length - 1, e + n),
          ArrowLeft: (e) => Math.max(0, e - 1),
          ArrowRight: (e) => Math.min(t().length - 1, e + 1),
        },
        o = (e) => {
          var o, l;
          if (!a[e.key] || 'button' !== (null == (o = e.target) ? void 0 : o.localName)) return;
          const s = t(),
            i = s[n].hasAttribute('data-vc-date-btn')
              ? 7
              : s[n].hasAttribute('data-vc-months-month')
              ? 4
              : s[n].hasAttribute('data-vc-years-year')
              ? 5
              : 1;
          (n = a[e.key](n, i)), null == (l = s[n]) || l.focus();
        };
      return (
        e.context.mainElement.addEventListener('keydown', o),
        () => {
          e.context.mainElement.removeEventListener('keydown', o);
        }
      );
    },
    ue = (e, t) => {
      const n = f(D(new Date(e.context.selectedYear, e.context.selectedMonth, 1)));
      ({
        prev: () => n.setMonth(n.getMonth() - e.monthsToSwitch),
        next: () => n.setMonth(n.getMonth() + e.monthsToSwitch),
      })[t](),
        p(e, 'selectedMonth', n.getMonth()),
        p(e, 'selectedYear', n.getFullYear()),
        F(e),
        P(e),
        A(e);
    },
    me = (e) =>
      void 0 === e.enableDateToggle ||
      ('function' == typeof e.enableDateToggle ? e.enableDateToggle(e) : e.enableDateToggle),
    ve = (e, t, n) => {
      const a = t.dataset.vcDate,
        o = t.closest('[data-vc-date][data-vc-date-selected]'),
        l = me(e);
      if (o && !l) return;
      const s = o ? e.context.selectedDates.filter((e) => e !== a) : n ? [...e.context.selectedDates, a] : [a];
      p(e, 'selectedDates', s);
    },
    he = (e, t, n) => {
      if (!t) return;
      if (!n) return (t.dataset.vcDateRangeTooltip = 'hidden'), void (t.textContent = '');
      const a = e.context.mainElement.getBoundingClientRect(),
        o = n.getBoundingClientRect();
      (t.style.left = o.left - a.left + o.width / 2 + 'px'),
        (t.style.top = o.bottom - a.top - o.height + 'px'),
        (t.dataset.vcDateRangeTooltip = 'visible'),
        (t.innerHTML = e.sanitizerHTML(e.onCreateDateRangeTooltip(e, n, t, o, a)));
    },
    pe = {
      self: null,
      lastDateEl: null,
      isHovering: !1,
      rangeMin: void 0,
      rangeMax: void 0,
      tooltipEl: null,
      timeoutId: null,
    },
    ye = (e, t, n) => {
      var a, o, l;
      if (!(null == (o = null == (a = pe.self) ? void 0 : a.context) ? void 0 : o.selectedDates[0])) return;
      const s = D(e);
      (null == (l = pe.self.context.disableDates) ? void 0 : l.includes(s)) ||
        (pe.self.context.mainElement
          .querySelectorAll(`[data-vc-date="${s}"]`)
          .forEach((e) => (e.dataset.vcDateHover = '')),
        t && (t.dataset.vcDateHoverFirst = ''),
        n && (n.dataset.vcDateHoverLast = ''));
    },
    xe = () => {
      var e, t;
      if (!(null == (t = null == (e = pe.self) ? void 0 : e.context) ? void 0 : t.mainElement)) return;
      pe.self.context.mainElement
        .querySelectorAll('[data-vc-date-hover], [data-vc-date-hover-first], [data-vc-date-hover-last]')
        .forEach((e) => {
          e.removeAttribute('data-vc-date-hover'),
            e.removeAttribute('data-vc-date-hover-first'),
            e.removeAttribute('data-vc-date-hover-last');
        });
    },
    ge = (e) => (t) => {
      pe.isHovering ||
        ((pe.isHovering = !0),
        requestAnimationFrame(() => {
          e(t), (pe.isHovering = !1);
        }));
    },
    be = ge((e) => {
      var t, n;
      if (!e.target || !(null == (n = null == (t = pe.self) ? void 0 : t.context) ? void 0 : n.selectedDates[0]))
        return;
      if (!e.target.closest('[data-vc="dates"]'))
        return (pe.lastDateEl = null), he(pe.self, pe.tooltipEl, null), void xe();
      const a = e.target.closest('[data-vc-date]');
      if (!a || pe.lastDateEl === a) return;
      (pe.lastDateEl = a), he(pe.self, pe.tooltipEl, a), xe();
      const o = a.dataset.vcDate,
        l = f(pe.self.context.selectedDates[0]),
        s = f(o),
        i = pe.self.context.mainElement.querySelector(`[data-vc-date="${pe.self.context.selectedDates[0]}"]`),
        r = pe.self.context.mainElement.querySelector(`[data-vc-date="${o}"]`),
        [c, d] = l < s ? [i, r] : [r, i],
        [u, m] = l < s ? [l, s] : [s, l];
      for (let e = new Date(u); e <= m; e.setDate(e.getDate() + 1)) ye(e, c, d);
    }),
    Me = ge((e) => {
      const t = e.target.closest('[data-vc-date-selected]');
      if (!t && pe.lastDateEl) return (pe.lastDateEl = null), void he(pe.self, pe.tooltipEl, null);
      t && pe.lastDateEl !== t && ((pe.lastDateEl = t), he(pe.self, pe.tooltipEl, t));
    }),
    fe = (e) => {
      pe.self &&
        'Escape' === e.key &&
        ((pe.lastDateEl = null),
        p(pe.self, 'selectedDates', []),
        pe.self.context.mainElement.removeEventListener('mousemove', be),
        pe.self.context.mainElement.removeEventListener('keydown', fe),
        he(pe.self, pe.tooltipEl, null),
        xe());
    },
    De = () => {
      null !== pe.timeoutId && clearTimeout(pe.timeoutId),
        (pe.timeoutId = setTimeout(() => {
          (pe.lastDateEl = null), he(pe.self, pe.tooltipEl, null), xe();
        }, 50));
    },
    Ee = (e, t) => {
      (pe.self = e),
        (pe.lastDateEl = t),
        xe(),
        e.disableDatesGaps &&
          ((pe.rangeMin = pe.rangeMin ? pe.rangeMin : e.context.displayDateMin),
          (pe.rangeMax = pe.rangeMax ? pe.rangeMax : e.context.displayDateMax)),
        e.onCreateDateRangeTooltip &&
          (pe.tooltipEl = e.context.mainElement.querySelector('[data-vc-date-range-tooltip]'));
      const n = null == t ? void 0 : t.dataset.vcDate;
      if (n) {
        const t = 1 === e.context.selectedDates.length && e.context.selectedDates[0].includes(n),
          a =
            t && !me(e)
              ? [n, n]
              : t && me(e)
              ? []
              : e.context.selectedDates.length > 1
              ? [n]
              : [...e.context.selectedDates, n];
        p(e, 'selectedDates', a),
          e.context.selectedDates.length > 1 && e.context.selectedDates.sort((e, t) => +new Date(e) - +new Date(t));
      }
      ({
        set: () => (
          e.disableDatesGaps &&
            (() => {
              var e, t, n, a;
              if (
                !(null == (n = null == (t = null == (e = pe.self) ? void 0 : e.context) ? void 0 : t.selectedDates)
                  ? void 0
                  : n[0]) ||
                !(null == (a = pe.self.context.disableDates) ? void 0 : a[0])
              )
                return;
              const o = f(pe.self.context.selectedDates[0]),
                [l, s] = pe.self.context.disableDates
                  .map((e) => f(e))
                  .reduce(([e, t], n) => [o >= n ? n : e, o < n && null === t ? n : t], [null, null]);
              l && p(pe.self, 'displayDateMin', D(new Date(l.setDate(l.getDate() + 1)))),
                s && p(pe.self, 'displayDateMax', D(new Date(s.setDate(s.getDate() - 1)))),
                pe.self.disableDatesPast &&
                  !pe.self.disableAllDates &&
                  f(pe.self.context.displayDateMin) < f(pe.self.context.dateToday) &&
                  p(pe.self, 'displayDateMin', pe.self.context.dateToday);
            })(),
          he(pe.self, pe.tooltipEl, t),
          pe.self.context.mainElement.removeEventListener('mousemove', Me),
          pe.self.context.mainElement.removeEventListener('mouseleave', De),
          pe.self.context.mainElement.removeEventListener('keydown', fe),
          pe.self.context.mainElement.addEventListener('mousemove', be),
          pe.self.context.mainElement.addEventListener('mouseleave', De),
          pe.self.context.mainElement.addEventListener('keydown', fe),
          () => {
            pe.self.context.mainElement.removeEventListener('mousemove', be),
              pe.self.context.mainElement.removeEventListener('mouseleave', De),
              pe.self.context.mainElement.removeEventListener('keydown', fe);
          }
        ),
        reset: () => {
          const [n, a] = [e.context.selectedDates[0], e.context.selectedDates[e.context.selectedDates.length - 1]],
            o = e.context.selectedDates[0] !== e.context.selectedDates[e.context.selectedDates.length - 1],
            l = E([`${n}:${a}`]).filter((t) => !e.context.disableDates.includes(t)),
            s = o ? (e.enableEdgeDatesOnly ? [n, a] : l) : [e.context.selectedDates[0], e.context.selectedDates[0]];
          if (
            (p(e, 'selectedDates', s),
            e.disableDatesGaps && (p(e, 'displayDateMin', pe.rangeMin), p(e, 'displayDateMax', pe.rangeMax)),
            pe.self.context.mainElement.removeEventListener('mousemove', be),
            pe.self.context.mainElement.removeEventListener('mouseleave', De),
            pe.self.context.mainElement.removeEventListener('keydown', fe),
            e.onCreateDateRangeTooltip)
          )
            return (
              e.context.selectedDates[0] ||
                (pe.self.context.mainElement.removeEventListener('mousemove', Me),
                pe.self.context.mainElement.removeEventListener('mouseleave', De),
                he(pe.self, pe.tooltipEl, null)),
              e.context.selectedDates[0] &&
                (pe.self.context.mainElement.addEventListener('mousemove', Me),
                pe.self.context.mainElement.addEventListener('mouseleave', De),
                he(pe.self, pe.tooltipEl, t)),
              () => {
                pe.self.context.mainElement.removeEventListener('mousemove', Me),
                  pe.self.context.mainElement.removeEventListener('mouseleave', De);
              }
            );
        },
      })[1 === e.context.selectedDates.length ? 'set' : 'reset']();
    },
    we = (e) => {
      e.context.mainElement.querySelectorAll('[data-vc-date]').forEach((t) => {
        const n = t.querySelector('[data-vc-date-btn]'),
          a = t.dataset.vcDate,
          o = f(a).getDay();
        T(e, e.context.selectedYear, t, n, o, a, 'current');
      });
    },
    Te = ['month', 'year'],
    ke = (e, t, n) => {
      const a = e.context.mainElement.querySelectorAll('[data-vc="column"]'),
        o = Array.from(a).findIndex((e) => e.closest(`[data-vc-column="${t}"]`)),
        l = Number(a[o].querySelector(`[data-vc="${t}"]`).getAttribute(`data-vc-${t}`));
      return 'month' === e.context.currentType && o >= 0
        ? n - o
        : 'year' === e.context.currentType && e.context.selectedYear !== l
        ? n - 1
        : n;
    },
    $e = (e, t, n, a) => {
      var o;
      const l = {
        year: () => {
          if ('multiple' === e.type)
            return ((e, t) => {
              const n = ke(e, 'year', Number(t.dataset.vcYearsYear)),
                a = f(e.context.dateMin),
                o = f(e.context.dateMax),
                l = e.context.selectedMonth < a.getMonth() && n <= a.getFullYear(),
                s = e.context.selectedMonth > o.getMonth() && n >= o.getFullYear(),
                i = n < a.getFullYear(),
                r = n > o.getFullYear();
              p(e, 'selectedYear', l || i ? a.getFullYear() : s || r ? o.getFullYear() : n),
                p(e, 'selectedMonth', l || i ? a.getMonth() : s || r ? o.getMonth() : e.context.selectedMonth);
            })(e, a);
          p(e, 'selectedYear', Number(a.dataset.vcYearsYear));
        },
        month: () => {
          if ('multiple' === e.type)
            return ((e, t) => {
              const n = t.closest('[data-vc-column="month"]').querySelector('[data-vc="year"]'),
                a = ke(e, 'month', Number(t.dataset.vcMonthsMonth)),
                o = Number(n.dataset.vcYear),
                l = f(e.context.dateMin),
                s = f(e.context.dateMax),
                i = a < l.getMonth() && o <= l.getFullYear(),
                r = a > s.getMonth() && o >= s.getFullYear();
              p(e, 'selectedYear', o), p(e, 'selectedMonth', i ? l.getMonth() : r ? s.getMonth() : a);
            })(e, a);
          p(e, 'selectedMonth', Number(a.dataset.vcMonthsMonth));
        },
      };
      l[n]();
      ({
        year: () => {
          var n;
          return null == (n = e.onClickYear) ? void 0 : n.call(e, e, t);
        },
        month: () => {
          var n;
          return null == (n = e.onClickMonth) ? void 0 : n.call(e, e, t);
        },
      })[n](),
        e.context.currentType !== e.type
          ? (p(e, 'currentType', e.type),
            ce(e),
            null == (o = e.context.mainElement.querySelector(`[data-vc="${n}"]`)) || o.focus())
          : I(e, a, n, !0, !0);
    },
    Ae = (e, t) => {
      const n = { month: e.selectionMonthsMode, year: e.selectionYearsMode };
      Te.forEach((a) => {
        n[a] &&
          t.target &&
          ((e, t, n) => {
            var a;
            const o = t.target,
              l = o.closest(`[data-vc="${n}"]`),
              s = { year: () => ne(e, o), month: () => R(e, o) };
            if ((l && e.onClickTitle && e.onClickTitle(e, t), l && e.context.currentType !== n)) return s[n]();
            const i = o.closest(`[data-vc-${n}s-${n}]`);
            if (i) return $e(e, t, n, i);
            const r = o.closest('[data-vc="grid"]'),
              c = o.closest('[data-vc="column"]');
            ((e.context.currentType === n && l) || ('multiple' === e.type && e.context.currentType === n && r && !c)) &&
              (p(e, 'currentType', e.type),
              ce(e),
              null == (a = e.context.mainElement.querySelector(`[data-vc="${n}"]`)) || a.focus());
          })(e, t, a);
      });
    },
    Ce = (e) => {
      const t = (t) => {
        ((e, t) => {
          const n = t.target.closest('[data-vc-arrow]');
          if (n) {
            if (['default', 'multiple'].includes(e.context.currentType)) ue(e, n.dataset.vcArrow);
            else if ('year' === e.context.currentType && void 0 !== e.context.displayYear) {
              const a = { prev: -15, next: 15 }[n.dataset.vcArrow];
              p(e, 'displayYear', e.context.displayYear + a), ne(e, t.target);
            }
            e.onClickArrow && e.onClickArrow(e, t);
          }
        })(e, t),
          ((e, t) => {
            if (!e.onClickWeekDay) return;
            const n = t.target.closest('[data-vc-week-day]'),
              a = t.target.closest('[data-vc="column"]'),
              o = a
                ? a.querySelectorAll('[data-vc-date-week-day]')
                : e.context.mainElement.querySelectorAll('[data-vc-date-week-day]');
            if (!n || !o[0]) return;
            const l = Number(n.dataset.vcWeekDay),
              s = Array.from(o).filter((e) => Number(e.dataset.vcDateWeekDay) === l);
            e.onClickWeekDay(e, l, s, t);
          })(e, t),
          ((e, t) => {
            if (!e.enableWeekNumbers || !e.onClickWeekNumber) return;
            const n = t.target.closest('[data-vc-week-number]'),
              a = e.context.mainElement.querySelectorAll('[data-vc-date-week-number]');
            if (!n || !a[0]) return;
            const o = Number(n.innerText),
              l = Number(n.dataset.vcWeekYear),
              s = Array.from(a).filter((e) => Number(e.dataset.vcDateWeekNumber) === o);
            e.onClickWeekNumber(e, o, l, s, t);
          })(e, t),
          ((e, t) => {
            var n;
            const a = t.target,
              o = a.closest('[data-vc-date-btn]');
            if (
              !e.selectionDatesMode ||
              !['single', 'multiple', 'multiple-ranged'].includes(e.selectionDatesMode) ||
              !o
            )
              return;
            const l = o.closest('[data-vc-date]');
            ({ single: () => ve(e, l, !1), multiple: () => ve(e, l, !0), 'multiple-ranged': () => Ee(e, l) })[
              e.selectionDatesMode
            ](),
              null == (n = e.context.selectedDates) || n.sort((e, t) => +new Date(e) - +new Date(t)),
              e.onClickDate && e.onClickDate(e, t),
              e.inputMode &&
                e.context.inputElement &&
                e.context.mainElement &&
                e.onChangeToInput &&
                e.onChangeToInput(e, t);
            const s = a.closest('[data-vc-date-month="prev"]'),
              i = a.closest('[data-vc-date-month="next"]');
            ({
              prev: () => (e.enableMonthChangeOnDayClick ? ue(e, 'prev') : we(e)),
              next: () => (e.enableMonthChangeOnDayClick ? ue(e, 'next') : we(e)),
              current: () => we(e),
            })[s ? 'prev' : i ? 'next' : 'current']();
          })(e, t),
          Ae(e, t);
      };
      return (
        e.context.mainElement.addEventListener('click', t), () => e.context.mainElement.removeEventListener('click', t)
      );
    },
    Se = (e, t) =>
      'today' === e
        ? (() => {
            const e = new Date();
            return new Date(e.getTime() - 6e4 * e.getTimezoneOffset()).toISOString().substring(0, 10);
          })()
        : e instanceof Date || 'number' == typeof e || 'string' == typeof e
        ? E([e])[0]
        : t,
    Ye = (e) => {
      p(e, 'currentType', e.type),
        ((e) => {
          if ('multiple' === e.type && (e.displayMonthsCount <= 1 || e.displayMonthsCount > 12)) throw new Error(h);
          if ('multiple' !== e.type && e.displayMonthsCount > 1) throw new Error(h);
          p(e, 'displayMonthsCount', e.displayMonthsCount ? e.displayMonthsCount : 'multiple' === e.type ? 2 : 1);
        })(e),
        ((e) => {
          var t, n, a;
          const o = Se(e.dateMin, e.dateMin),
            l = Se(e.dateMax, e.dateMax),
            s = Se(e.displayDateMin, o),
            i = Se(e.displayDateMax, l);
          p(e, 'dateToday', Se(e.dateToday, e.dateToday)),
            p(e, 'displayDateMin', s ? (f(o) >= f(s) ? o : s) : o),
            p(e, 'displayDateMax', i ? (f(l) <= f(i) ? l : i) : l);
          const r = e.disableDatesPast && !e.disableAllDates && f(s) < f(e.context.dateToday);
          p(e, 'displayDateMin', r || e.disableAllDates ? e.context.dateToday : s),
            p(e, 'displayDateMax', e.disableAllDates ? e.context.dateToday : i),
            p(
              e,
              'disableDates',
              e.disableDates[0] && !e.disableAllDates
                ? E(e.disableDates)
                : e.disableAllDates
                ? [e.context.displayDateMin]
                : []
            ),
            e.context.disableDates.length > 1 && e.context.disableDates.sort((e, t) => +new Date(e) - +new Date(t)),
            p(e, 'enableDates', e.enableDates[0] ? E(e.enableDates) : []),
            (null == (t = e.context.enableDates) ? void 0 : t[0]) &&
              (null == (n = e.context.disableDates) ? void 0 : n[0]) &&
              p(
                e,
                'disableDates',
                e.context.disableDates.filter((t) => !e.context.enableDates.includes(t))
              ),
            e.context.enableDates.length > 1 && e.context.enableDates.sort((e, t) => +new Date(e) - +new Date(t)),
            (null == (a = e.context.enableDates) ? void 0 : a[0]) &&
              e.disableAllDates &&
              (p(e, 'displayDateMin', e.context.enableDates[0]),
              p(e, 'displayDateMax', e.context.enableDates[e.context.enableDates.length - 1])),
            p(e, 'dateMin', e.displayDisabledDates ? o : e.context.displayDateMin),
            p(e, 'dateMax', e.displayDisabledDates ? l : e.context.displayDateMax);
        })(e),
        ((e) => {
          var t;
          if (
            e.enableJumpToSelectedDate &&
            (null == (t = e.selectedDates) ? void 0 : t[0]) &&
            void 0 === e.selectedMonth &&
            void 0 === e.selectedYear
          ) {
            const t = f(E(e.selectedDates)[0]);
            return p(e, 'selectedMonth', t.getMonth()), void p(e, 'selectedYear', t.getFullYear());
          }
          const n = void 0 !== e.selectedMonth && Number(e.selectedMonth) >= 0 && Number(e.selectedMonth) < 12,
            a = void 0 !== e.selectedYear && Number(e.selectedYear) >= 0 && Number(e.selectedYear) <= 9999;
          p(e, 'selectedMonth', n ? Number(e.selectedMonth) : f(e.context.dateToday).getMonth()),
            p(e, 'selectedYear', a ? Number(e.selectedYear) : f(e.context.dateToday).getFullYear()),
            p(e, 'displayYear', e.context.selectedYear);
        })(e),
        ((e) => {
          var t;
          p(e, 'selectedDates', (null == (t = e.selectedDates) ? void 0 : t[0]) ? E(e.selectedDates) : []);
        })(e),
        ((e) => {
          var t, n, a;
          if (!e.selectionTimeMode) return;
          if (![12, 24].includes(e.selectionTimeMode)) throw new Error(v);
          const o = 12 === e.selectionTimeMode,
            l = o ? /^(0[1-9]|1[0-2]):([0-5][0-9]) ?(AM|PM)?$/i : /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
          let [s, i, r] =
            null != (a = null == (n = null == (t = e.selectedTime) ? void 0 : t.match(l)) ? void 0 : n.slice(1))
              ? a
              : [];
          s
            ? o && !r && (r = 'AM')
            : ((s = o ? B(String(e.timeMinHour)) : String(e.timeMinHour)),
              (i = String(e.timeMinMinute)),
              (r = o ? (Number(B(String(e.timeMinHour))) >= 12 ? 'PM' : 'AM') : null)),
            p(e, 'selectedHours', s.padStart(2, '0')),
            p(e, 'selectedMinutes', i.padStart(2, '0')),
            p(e, 'selectedKeeping', r),
            p(e, 'selectedTime', `${e.context.selectedHours}:${e.context.selectedMinutes}${r ? ` ${r}` : ''}`);
        })(e);
    },
    Ne = (e, { year: t, month: n, dates: a, time: o, locale: l }) => {
      var s;
      const i = { year: e.selectedYear, month: e.selectedMonth, dates: e.selectedDates, time: e.selectedTime };
      if (
        ((e.selectedYear = t ? i.year : e.context.selectedYear),
        (e.selectedMonth = n ? i.month : e.context.selectedMonth),
        (e.selectedTime = o ? i.time : e.context.selectedTime),
        (e.selectedDates =
          'only-first' === a && (null == (s = e.context.selectedDates) ? void 0 : s[0])
            ? [e.context.selectedDates[0]]
            : !0 === a
            ? i.dates
            : e.context.selectedDates),
        l)
      ) {
        p(e, 'locale', { months: { short: [], long: [] }, weekdays: { short: [], long: [] } });
      }
      Ye(e),
        ce(e),
        (e.selectedYear = i.year),
        (e.selectedMonth = i.month),
        (e.selectedDates = i.dates),
        (e.selectedTime = i.time),
        'multiple-ranged' === e.selectionDatesMode && a && Ee(e, null);
    };
  const Le = (e, t, n) => {
      if (!e) return;
      const a =
          'auto' === n
            ? (function (e, t) {
                const n = 'left';
                if (!t || !e) return n;
                const { canShow: a, parentPositions: o } = b(e, t),
                  l = a.left && a.right;
                return (
                  (l && a.bottom
                    ? 'center'
                    : l && a.top
                    ? ['top', 'center']
                    : Array.isArray(o)
                    ? ['bottom' === o[0] ? 'top' : 'bottom', ...o.slice(1)]
                    : o) || n
                );
              })(e, t)
            : n,
        o = {
          top: -t.offsetHeight,
          bottom: e.offsetHeight,
          left: 0,
          center: e.offsetWidth / 2 - t.offsetWidth / 2,
          right: e.offsetWidth - t.offsetWidth,
        },
        l = Array.isArray(a) ? a[0] : 'bottom',
        s = Array.isArray(a) ? a[1] : a;
      t.dataset.vcPosition = l;
      const { top: i, left: r } = y(e),
        c = i + o[l];
      let d = r + o[s];
      const { vw: u } = x();
      if (d + t.clientWidth > u) {
        const e = window.innerWidth - document.body.clientWidth;
        d = u - t.clientWidth - e;
      } else d < 0 && (d = 0);
      Object.assign(t.style, { left: `${d}px`, top: `${c}px` });
    },
    He = (e, t = !0) => {
      const n = document.createElement('div');
      return (
        (n.className = e.styles.calendar),
        (n.dataset.vc = 'calendar'),
        (n.dataset.vcInput = ''),
        (n.dataset.vcCalendarHidden = ''),
        (n.style.visibility = 'hidden'),
        p(e, 'inputModeInit', !0),
        p(e, 'mainElement', n),
        document.body.appendChild(e.context.mainElement),
        t &&
          queueMicrotask(() => {
            Le(e.context.inputElement, n, e.positionToInput),
              (e.context.mainElement.style.visibility = 'visible'),
              e.show();
          }),
        Ne(e, { year: !0, month: !0, dates: !0, time: !0, locale: !0 }),
        e.onInit && e.onInit(e),
        de(e),
        Ce(e)
      );
    },
    We = (e) => (
      p(e, 'originalElement', e.context.mainElement.cloneNode(!0)),
      p(e, 'isInit', !0),
      e.inputMode
        ? ((e) => {
            const t = [];
            p(e, 'inputElement', e.context.mainElement);
            const n = () => Le(e.context.inputElement, e.context.mainElement, e.positionToInput),
              a = (t) => {
                var n, o;
                'Escape' === t.key &&
                  ((null == (n = null == e ? void 0 : e.context) ? void 0 : n.inputElement) &&
                    (null == (o = null == e ? void 0 : e.context) ? void 0 : o.mainElement) &&
                    e.hide(),
                  document.removeEventListener('keydown', a));
              },
              o = (t) => {
                e &&
                  t.target !== e.context.inputElement &&
                  !e.context.mainElement.contains(t.target) &&
                  (e.context.inputElement && e.context.mainElement && e.hide(),
                  window.removeEventListener('resize', n),
                  document.removeEventListener('click', o, { capture: !0 }));
              },
              l = () => {
                e.context.inputModeInit
                  ? (Le(e.context.inputElement, e.context.mainElement, e.positionToInput),
                    (e.context.mainElement.style.visibility = 'visible'),
                    e.show())
                  : t.push(He(e)),
                  window.addEventListener('resize', n),
                  document.addEventListener('click', o, { capture: !0 }),
                  document.addEventListener('keydown', a);
              };
            return (
              e.context.inputElement.addEventListener('click', l),
              e.context.inputElement.addEventListener('focus', l),
              () => {
                t.forEach((e) => e());
              }
            );
          })(e)
        : (Ye(e), ce(e), e.onInit && e.onInit(e), de(e), Ce(e))
    ),
    qe = (e, t) => {
      const n = Object.keys(t);
      for (let a = 0; a < n.length; a++) {
        const o = n[a];
        'object' != typeof e[o] || 'object' != typeof t[o] || t[o] instanceof Date || Array.isArray(t[o])
          ? void 0 !== t[o] && (e[o] = t[o])
          : qe(e[o], t[o]);
      }
    },
    Pe = {
      application: 'Calendar',
      navigation: 'Calendar Navigation',
      arrowNext: { month: 'Next month', year: 'Next list of years' },
      arrowPrev: { month: 'Previous month', year: 'Previous list of years' },
      month: 'Select month, current selected month:',
      months: 'List of months',
      year: 'Select year, current selected year:',
      years: 'List of years',
      week: 'Days of the week',
      weekNumber: 'Numbers of weeks in a year',
      dates: 'Dates in the current month',
      selectingTime: 'Selecting a time ',
      inputHour: 'Hours',
      inputMinute: 'Minutes',
      rangeHour: 'Slider for selecting hours',
      rangeMinute: 'Slider for selecting minutes',
      btnKeeping: 'Switch AM/PM, current position:',
    },
    Fe = {
      calendar: 'vc',
      controls: 'vc-controls',
      grid: 'vc-grid',
      column: 'vc-column',
      header: 'vc-header',
      headerContent: 'vc-header__content',
      month: 'vc-month',
      year: 'vc-year',
      arrowPrev: 'vc-arrow vc-arrow_prev',
      arrowNext: 'vc-arrow vc-arrow_next',
      wrapper: 'vc-wrapper',
      content: 'vc-content',
      months: 'vc-months',
      monthsMonth: 'vc-months__month',
      years: 'vc-years',
      yearsYear: 'vc-years__year',
      week: 'vc-week',
      weekDay: 'vc-week__day',
      weekNumbers: 'vc-week-numbers',
      weekNumbersTitle: 'vc-week-numbers__title',
      weekNumbersContent: 'vc-week-numbers__content',
      weekNumber: 'vc-week-number',
      dates: 'vc-dates',
      date: 'vc-date',
      dateBtn: 'vc-date__btn',
      datePopup: 'vc-date__popup',
      dateRangeTooltip: 'vc-date-range-tooltip',
      time: 'vc-time',
      timeContent: 'vc-time__content',
      timeHour: 'vc-time__hour',
      timeMinute: 'vc-time__minute',
      timeKeeping: 'vc-time__keeping',
      timeRanges: 'vc-time__ranges',
      timeRange: 'vc-time__range',
    };
  class Ie {
    constructor() {
      c(this, 'type', 'default'),
        c(this, 'inputMode', !1),
        c(this, 'positionToInput', 'left'),
        c(this, 'firstWeekday', 1),
        c(this, 'monthsToSwitch', 1),
        c(this, 'themeAttrDetect', 'html[data-theme]'),
        c(this, 'locale', 'en'),
        c(this, 'dateToday', 'today'),
        c(this, 'dateMin', '1970-01-01'),
        c(this, 'dateMax', '2470-12-31'),
        c(this, 'displayDateMin'),
        c(this, 'displayDateMax'),
        c(this, 'displayDatesOutside', !0),
        c(this, 'displayDisabledDates', !1),
        c(this, 'displayMonthsCount'),
        c(this, 'disableDates', []),
        c(this, 'disableAllDates', !1),
        c(this, 'disableDatesPast', !1),
        c(this, 'disableDatesGaps', !1),
        c(this, 'disableWeekdays', []),
        c(this, 'disableToday', !1),
        c(this, 'enableDates', []),
        c(this, 'enableEdgeDatesOnly', !0),
        c(this, 'enableDateToggle', !0),
        c(this, 'enableWeekNumbers', !1),
        c(this, 'enableMonthChangeOnDayClick', !0),
        c(this, 'enableJumpToSelectedDate', !1),
        c(this, 'selectionDatesMode', 'single'),
        c(this, 'selectionMonthsMode', !0),
        c(this, 'selectionYearsMode', !0),
        c(this, 'selectionTimeMode', !1),
        c(this, 'selectedDates', []),
        c(this, 'selectedMonth'),
        c(this, 'selectedYear'),
        c(this, 'selectedHolidays', []),
        c(this, 'selectedWeekends', [0, 6]),
        c(this, 'selectedTime'),
        c(this, 'selectedTheme', 'system'),
        c(this, 'timeMinHour', 0),
        c(this, 'timeMaxHour', 23),
        c(this, 'timeMinMinute', 0),
        c(this, 'timeMaxMinute', 59),
        c(this, 'timeControls', 'all'),
        c(this, 'timeStepHour', 1),
        c(this, 'timeStepMinute', 1),
        c(this, 'sanitizerHTML', (e) => e),
        c(this, 'onClickDate'),
        c(this, 'onClickWeekDay'),
        c(this, 'onClickWeekNumber'),
        c(this, 'onClickTitle'),
        c(this, 'onClickMonth'),
        c(this, 'onClickYear'),
        c(this, 'onClickArrow'),
        c(this, 'onChangeTime'),
        c(this, 'onChangeToInput'),
        c(this, 'onCreateDateRangeTooltip'),
        c(this, 'onCreateDateEls'),
        c(this, 'onCreateMonthEls'),
        c(this, 'onCreateYearEls'),
        c(this, 'onInit'),
        c(this, 'onUpdate'),
        c(this, 'onDestroy'),
        c(this, 'onShow'),
        c(this, 'onHide'),
        c(this, 'popups', {}),
        c(this, 'labels', r({}, Pe)),
        c(this, 'layouts', { default: '', multiple: '', month: '', year: '' }),
        c(this, 'styles', r({}, Fe));
    }
  }
  const _e = class e extends Ie {
    constructor(t, o) {
      var l, s;
      super(),
        c(this, 'init', () => We(this)),
        c(this, 'update', (e) =>
          ((e, t) => {
            if (!e.context.isInit) throw new Error(u);
            e.inputMode && !e.context.inputModeInit && He(e, !1),
              Ne(e, r(r({}, { year: !0, month: !0, dates: !0, time: !0, locale: !0 }), t)),
              e.onUpdate && e.onUpdate(e);
          })(this, e)
        ),
        c(this, 'destroy', () =>
          ((e) => {
            var t, n, a, o, l;
            if (!e.context.isInit) throw new Error(u);
            e.inputMode
              ? (null == (t = e.context.mainElement.parentElement) || t.removeChild(e.context.mainElement),
                null == (a = null == (n = e.context.inputElement) ? void 0 : n.replaceWith) ||
                  a.call(n, e.context.originalElement),
                p(e, 'inputElement', void 0))
              : null == (l = (o = e.context.mainElement).replaceWith) || l.call(o, e.context.originalElement),
              p(e, 'mainElement', e.context.originalElement),
              e.onDestroy && e.onDestroy(e);
          })(this)
        ),
        c(this, 'show', () => {
          var e;
          (e = this).context.currentType
            ? (e.context.mainElement.removeAttribute('data-vc-calendar-hidden'), e.onShow && e.onShow(e))
            : e.context.mainElement.click();
        }),
        c(this, 'hide', () => {
          var e;
          (e = this).context.currentType &&
            ((e.context.mainElement.dataset.vcCalendarHidden = ''), e.onHide && e.onHide(e));
        }),
        c(this, 'set', (e, t) =>
          ((e, t, n) => {
            qe(e, t), Ne(e, r(r({}, { year: !0, month: !0, dates: !0, time: !0, locale: !0 }), n));
          })(this, e, t)
        ),
        c(this, 'context'),
        (this.context =
          ((s = r({}, this.context)),
          n(s, a({ locale: { months: { short: [], long: [] }, weekdays: { short: [], long: [] } } })))),
        p(
          this,
          'mainElement',
          'string' == typeof t ? (null != (l = e.memoizedElements.get(t)) ? l : this.queryAndMemoize(t)) : t
        ),
        o && qe(this, o);
    }
    queryAndMemoize(t) {
      const n = document.querySelector(t);
      if (!n) throw new Error(d(t));
      return e.memoizedElements.set(t, n), n;
    }
  };
  c(_e, 'memoizedElements', new Map());
  let Oe = _e;
  (e.Calendar = Oe), Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
});
