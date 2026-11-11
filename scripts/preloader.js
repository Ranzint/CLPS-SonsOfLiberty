  const root = (hexo.config.root || '/').replace(/\/?$/, '/');
  const fontUrl = `${root}fonts/911porschav3expand.ttf`;

  const styles = `<style id="site-preloader-styles">
@font-face {
  font-family: "PorscheProgress";
  src: url("${fontUrl}") format("truetype");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
html.site-is-loading,
html.site-is-loading body { overflow: hidden !important; }
#site-preloader {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  opacity: 1;
  visibility: visible;
  transition: opacity 350ms ease, visibility 350ms ease;
}
#site-preloader.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
#site-preloader .progress-track {
  position: relative;
  width: min(74vw, 620px);
  height: 1px;
  background: rgba(255, 255, 255, 0.22);
}
#site-preloader .progress-fill {
  width: 0;
  height: 100%;
  background: #fff;
  transition: width 100ms linear;
}
#site-preloader .progress-percent {
  position: absolute;
  left: 0;
  bottom: calc(100% + 12px);
  color: #fff;
  font: 400 21px/1 "PorscheProgress", sans-serif;
  white-space: nowrap;
  user-select: none;
  transform: translateX(-50%);
}
@media (max-width: 480px) {
  #site-preloader .progress-track { width: 78vw; }
  #site-preloader .progress-percent { font-size: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  #site-preloader, #site-preloader .progress-fill { transition: none; }
}
</style>`;

  const loader = `<div id="site-preloader" role="progressbar" aria-label="页面加载中" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
  <div class="progress-track">
    <div class="progress-fill"></div>
    <span class="progress-percent">0%</span>
  </div>
</div>`;

  const runtime = `<script>
(function () {
  var overlay = document.getElementById('site-preloader');
  if (!overlay) return;

  var fill = overlay.querySelector('.progress-fill');
  var label = overlay.querySelector('.progress-percent');
  var startedAt = performance.now();
  var progress = 0;
  var loaded = false;

  document.documentElement.classList.add('site-is-loading');

  function setProgress(next) {
    progress = Math.max(progress, Math.min(100, next));
    var shown = Math.floor(progress);
    fill.style.width = shown + '%';
    label.style.left = shown + '%';
    label.textContent = shown + '%';
    overlay.setAttribute('aria-valuenow', String(shown));
  }

  function animateWhileLoading() {
    if (loaded) return;
    var elapsed = performance.now() - startedAt;
    var estimate = 90 * (1 - Math.exp(-elapsed / 1100));
    setProgress(Math.min(90, estimate));
    requestAnimationFrame(animateWhileLoading);
  }

  function finishLoading() {
    if (loaded) return;
    loaded = true;
    setProgress(100);

    var remaining = Math.max(0, 2000 - (performance.now() - startedAt));
    window.setTimeout(function () {
      overlay.classList.add('is-hidden');
      document.documentElement.classList.remove('site-is-loading');
      window.setTimeout(function () { overlay.remove(); }, 400);
    }, remaining);
  }

  requestAnimationFrame(animateWhileLoading);
  if (document.readyState === 'complete') {
    finishLoading();
  } else {
    window.addEventListener('load', finishLoading, { once: true });
  }
})();
</script>`;

  hexo.extend.filter.register('after_render:html', function (html) {
    if (!/<\/head>/i.test(html) || !/<body(?:\s[^>]*)?>/i.test(html)) return html;

    html = html.replace(/<\/head>/i, `${styles}</head>`);
    return html.replace(/(<body(?:\s[^>]*)?>)/i, `$1${loader}${runtime}`);
  });
