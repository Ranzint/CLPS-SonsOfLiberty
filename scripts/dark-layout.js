  const fs = require('fs');
  const path = require('path');
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
    const musicDirectory = path.resolve(hexo.base_dir, hexo.config.source_dir || 'source', 'music');
    const musicTracks = fs.existsSync(musicDirectory)
      ? fs.readdirSync(musicDirectory)
        .filter(filename => /\.mp3$/i.test(filename))
        .sort((a, b) => a.localeCompare(b))
        .map(filename => ({
          title: filename.replace(/\.mp3$/i, '').replace(/[-_]+/g, ' '),
          src: `${root}music/${encodeURIComponent(filename)}`
        }))
      : [];
    const musicPlaylist = JSON.stringify(musicTracks)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const home = `<main class="site-home" aria-labelledby="site-home-title">
  <h1 id="site-home-title" class="site-home__title">${title}</h1>
  <div class="site-home__map-area">
    <object class="site-home__map" id="state-map" type="image/svg+xml" data="${root}images/north-america-map.svg" data-icon-url="${root}images/state-placeholder.png" aria-label="北美洲地图。选择任一美国州查看资料。"></object>
    <div class="map-zoom" role="group" aria-label="地图缩放">
      <button type="button" data-map-zoom="in" aria-label="放大地图">+</button>
      <output id="map-zoom-value" aria-live="polite">1×</output>
      <button type="button" data-map-zoom="out" aria-label="缩小地图">−</button>
      <button type="button" data-map-zoom="reset" aria-label="重置地图缩放">⌂</button>
    </div>
  </div>
  <a class="site-home__credit" href="https://commons.wikimedia.org/wiki/File:North_America_second_level_political_division_2.svg" target="_blank" rel="noopener">Map by Alex Covarrubias · CC BY-SA 2.5 · adapted</a>
  <audio id="site-music" preload="auto" data-playlist="${musicPlaylist}"></audio>
  <div class="site-audio" id="site-audio-player">
    <button class="site-audio__toggle" id="site-audio-toggle" type="button" aria-label="播放背景音乐">▶</button>
    <span class="site-audio__status" id="site-audio-status" aria-live="polite">RANDOM PLAYLIST · 2 TRACKS</span>
  </div>
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
