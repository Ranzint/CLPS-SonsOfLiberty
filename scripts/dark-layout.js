  const root = (hexo.config.root || '/').replace(/\/?$/, '/');
  const stylesheet = `<link rel="stylesheet" href="${root}css/site-dark.css">`;

  hexo.extend.filter.register('after_render:html', function (html, locals) {
    if (!/<\/head>/i.test(html) || html.includes('css/site-dark.css')) return html;
    html = html.replace(/<\/head>/i, `${stylesheet}</head>`);

    // Give the home page a single map focused layout while leaving post and
    // archive pages available through their normal Hexo URLs.
    if (!locals || locals.path !== 'index.html') return html;

    const title = String(hexo.config.title || 'CLPS Sons of Liberty')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const home = `<main class="site-home" aria-labelledby="site-home-title">
  <h1 id="site-home-title" class="site-home__title">${title}</h1>
  <div class="site-home__map-area">
    <object class="site-home__map" id="state-map" type="image/svg+xml" data="${root}images/north-america-map.svg" data-icon-url="${root}images/state-placeholder.png" aria-label="北美洲地图。选择任一美国州查看资料。"></object>
  </div>
  <a class="site-home__credit" href="https://commons.wikimedia.org/wiki/File:North_America_second_level_political_division_2.svg" target="_blank" rel="noopener">Map by Alex Covarrubias · CC BY-SA 2.5 · adapted</a>
  <aside class="state-info" id="state-info" aria-hidden="true" aria-labelledby="state-info-title">
    <div class="state-info__topline">
      <span class="state-info__eyebrow">STATE DOSSIER / US-50</span>
      <button class="state-info__close" type="button" aria-label="关闭州信息">×</button>
    </div>
    <img class="state-info__image" src="${root}images/state-placeholder.png" alt="州资料占位图">
    <p class="state-info__kicker" id="state-info-code">STATE / --</p>
    <h2 class="state-info__title" id="state-info-title">选择一个州</h2>
    <p class="state-info__summary" id="state-info-summary">点击地图上的州或州徽图标，打开对应资料。</p>
    <div class="state-info__sections" id="state-info-sections"></div>
  </aside>
</main>`;

    html = html.replace(/<body(.*?)>/i, '<body$1 class="site-home-page">');
    html = html.replace(/<script[^>]+src="[^"]*\/js\/script\.js"[^>]*><\/script>/i, '');
    html = html.replace(/<header id="header">[\s\S]*?<\/header>[\s\S]*?<footer id="footer">[\s\S]*?<\/footer>/i, home);
    return html.replace(/<\/body>/i, `<script src="${root}js/state-map.js" defer></script></body>`);
  });
