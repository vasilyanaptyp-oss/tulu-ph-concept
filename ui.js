/* TULU PH — kell, öövaate lüliti ja kiire helistamise riba. Ei oota GSAP-i. */
(function () {
  'use strict';
  var d = document.documentElement;
  var q = function (s) { return document.querySelector(s); };

  /* ---------- kell ---------- */
  var clock = q('#clock');
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    if (!clock) return;
    var now = new Date();
    var txt = 'kell ' + two(now.getHours()) + ':' + two(now.getMinutes());
    clock.textContent = txt;
    clock.setAttribute('datetime', two(now.getHours()) + ':' + two(now.getMinutes()));
    clock.hidden = false;
  }
  tick();
  setInterval(tick, 30000);

  /* ---------- öövaade ---------- */
  var btn = q('#modeBtn'), meta = q('#themeColor');
  function sync() {
    var night = d.classList.contains('night');
    if (btn) btn.setAttribute('aria-pressed', night ? 'true' : 'false');
    if (meta) meta.setAttribute('content', night ? '#0B0F17' : '#FF5A1F');
  }
  if (btn) btn.addEventListener('click', function () { d.classList.toggle('night'); sync(); });
  sync();

  /* ---------- kiire helistamise riba ---------- */
  var bar = q('#callbar'), hero = q('#heroCall');
  if (bar && hero && 'IntersectionObserver' in window) {
    var mq = matchMedia('(min-width: 1024px)');
    function setBar(h) { d.style.setProperty('--barh', h + 'px'); }
    var io = new IntersectionObserver(function (es) {
      var show = !es[0].isIntersecting && es[0].boundingClientRect.bottom < 0;
      bar.classList.toggle('show', show);
      setBar(show && !mq.matches ? 68 : 0);
    }, { threshold: 0 });
    io.observe(hero);
    mq.addEventListener('change', function () { setBar(bar.classList.contains('show') && !mq.matches ? 68 : 0); });
  }
})();
