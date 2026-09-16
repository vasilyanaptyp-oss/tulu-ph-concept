/* TULU PH — lukk seestpoolt: GSAP timeline + ScrollTrigger scrub.
   Ilma GSAP-ita, reduced-motion'iga või kui skript ei jõua 5 s jooksul — lukk on kohe avatud (CSS + märgistus).
   Tihvtide asendid arvutatakse igal kaadril võtme asendist (võtme profiil), seega kerimine tagasi on täpne. */
(function () {
  'use strict';
  var d = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger || !d.classList.contains('scene-scrub')) return;
  gsap.registerPlugin(ScrollTrigger);
  var q = function (s) { return document.querySelector(s); };
  var stage = q('#stage'), sec = q('#secView');
  if (!stage || !sec) return;
  var mobile = matchMedia('(max-width: 719px)').matches;

  /* kitsal ekraanil näitame lõiget lähemalt: võtmepea jääb otsavaatesse */
  if (mobile) sec.setAttribute('viewBox', '250 20 540 280');

  /* ---------- geomeetria (SVG ühikud) ---------- */
  var PX = [350, 410, 470, 530, 590];      /* tihvtide x */
  var H = [42, 58, 34, 50, 40];            /* alumiste tihvtide pikkus */
  var D = [40, 36, 44, 38, 42];            /* ülemiste tihvtide pikkus */
  var REST = 214, TOP = 60, SPR = 40, TIP = 640;
  var UC = PX.map(function (x) { return TIP - x; });          /* lõiked võtme tipust mõõdetuna */
  var DEP = H.map(function (h) { return h - 34; });           /* lõike sügavus */
  function keyTop(u) {                                        /* võtme ülaserva y kaugusel u tipust */
    if (u < 0) return 999;
    var y = u < 24 ? 216 - 32 * u / 24 : 184;
    for (var i = 0; i < 5; i++) { var c = DEP[i] - Math.abs(u - UC[i]); if (c > 0) y += c; }
    return y;
  }
  var pins = PX.map(function (x, i) { return { k: q('#kp' + i), dr: q('#dp' + i), sp: q('#sp' + i) }; });
  var key = q('#key');
  var st = { tx: -360 };
  function place() {
    for (var i = 0; i < 5; i++) {
      var u = TIP + st.tx - PX[i];
      var yb = Math.min(REST, keyTop(u));
      var kt = yb - H[i], dt = kt - D[i];
      pins[i].k.setAttribute('transform', 'translate(' + PX[i] + ',' + kt.toFixed(2) + ')');
      pins[i].dr.setAttribute('transform', 'translate(' + PX[i] + ',' + dt.toFixed(2) + ')');
      var s = Math.max(.12, (dt - TOP) / SPR);
      pins[i].sp.setAttribute('transform', 'translate(' + PX[i] + ',' + TOP + ') scale(1,' + s.toFixed(3) + ')');
    }
    key.setAttribute('transform', 'translate(' + st.tx.toFixed(2) + ',0)');
  }

  /* ---------- algseisud (mitte timeline'i sees, et tagasikerimine töötaks) ---------- */
  gsap.set('#plug', { rotation: 0, svgOrigin: '150 120' });
  gsap.set('#bowF', { scale: .55, autoAlpha: 0, svgOrigin: '150 120' });
  gsap.set('#cam', { rotation: 0, svgOrigin: '740 205' });
  gsap.set('#bolt', { x: 0 });
  gsap.set('#secPlug', { opacity: 1 });
  gsap.set('#shear', { strokeDashoffset: 600 });
  gsap.set('#door', { rotateY: 0, transformOrigin: 'left center', transformPerspective: 1400 });
  gsap.set('#opened', { autoAlpha: 0, y: 14 });
  gsap.set('#cap1', { autoAlpha: 1 });
  gsap.set(['#cap2', '#cap3', '#cap4'], { autoAlpha: 0 });
  place();

  var tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage, start: 'top top', end: mobile ? '+=170%' : '+=240%',
      pin: true, pinSpacing: true, scrub: mobile ? .45 : .6, anticipatePin: 1, invalidateOnRefresh: true
    }
  });
  tl.to(st, { tx: 0, duration: 4, onUpdate: place }, 0)
    .to('#bowF', { autoAlpha: 1, scale: 1, duration: 3.2, ease: 'power1.out' }, .4)
    .to('#cap1', { autoAlpha: 0, duration: .3 }, 3.5)
    .to('#cap2', { autoAlpha: 1, duration: .3 }, 3.7)
    .to('#shear', { strokeDashoffset: 0, duration: .9, ease: 'power1.inOut' }, 4.0)
    .to('#cap2', { autoAlpha: 0, duration: .3 }, 5.0)
    .to('#cap3', { autoAlpha: 1, duration: .3 }, 5.2)
    .to('#plug', { rotation: 90, duration: 1.6, ease: 'power1.inOut' }, 5.1)
    .to('#cam', { rotation: 90, duration: 1.6, ease: 'power1.inOut' }, 5.1)
    .to('#bolt', { x: -46, duration: 1.2, ease: 'power1.inOut' }, 5.5)
    .to('#secPlug', { opacity: .55, duration: 1.2 }, 5.1)
    .to('#cap3', { autoAlpha: 0, duration: .3 }, 6.9)
    .to('#cap4', { autoAlpha: 1, duration: .3 }, 7.1)
    .to('#door', { rotateY: -108, duration: 2.1, ease: 'power2.inOut' }, 7.0)
    .to('#opened', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power1.out' }, 7.7)
    .to({}, { duration: 1.4 });

  window.TP_TL = tl;
  clearTimeout(window.TP_FALLBACK);
  stage.classList.add('ready');
  ScrollTrigger.refresh();
})();
