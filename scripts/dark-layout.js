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
    const stateDataDirectory = path.resolve(hexo.base_dir, 'state-data', 'states');
    const stateImageDirectory = path.resolve(hexo.base_dir, hexo.config.source_dir || 'source', 'images', 'states');
    const stateProfiles = {};
    if (fs.existsSync(stateDataDirectory)) {
      for (const filename of fs.readdirSync(stateDataDirectory).filter(name => /^[A-Z]{2}\.json$/.test(name)).sort()) {
        const code = filename.slice(0, 2);
        try {
          const profile = JSON.parse(fs.readFileSync(path.join(stateDataDirectory, filename), 'utf8'));
          const resolveImageUrl = imageName => {
            const safeName = path.basename(String(imageName || ''));
            const imagePath = path.join(stateImageDirectory, code, safeName);
            return safeName && fs.existsSync(imagePath)
              ? `${root}images/states/${code}/${encodeURIComponent(safeName)}`
              : `${root}images/state-placeholder.png`;
          };
          profile.imageUrl = resolveImageUrl(profile.image || 'cover.png');
          profile.iconUrl = resolveImageUrl(profile.icon || 'icon.png');
          stateProfiles[code] = profile;
        } catch (error) {
          hexo.log.warn(`Unable to read state profile ${filename}: ${error.message}`);
        }
      }
    }
    const stateProfilesJson = JSON.stringify(stateProfiles)
      .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
    const articlesDirectory = path.resolve(hexo.base_dir, 'articles');
    const districtArticles = {};
    for (let number = 1; number <= 50; number++) {
      const directory = path.join(articlesDirectory, String(number));
      const files = fs.existsSync(directory)
        ? fs.readdirSync(directory).filter(filename => /\.html?$/i.test(filename)).sort((a, b) => a.localeCompare(b))
        : [];
      districtArticles[number] = files.map(filename => {
        const html = fs.readFileSync(path.join(directory, filename), 'utf8');
        const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
        const title = titleMatch
          ? titleMatch[1].replace(/<[^>]+>/g, '').trim()
          : path.basename(filename, path.extname(filename));
        return { title, filename, html };
      });
    }
    const districtArticlesJson = JSON.stringify(districtArticles)
      .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
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
  <script id="state-profile-data" type="application/json">${stateProfilesJson}</script>
  <script id="district-article-data" type="application/json">${districtArticlesJson}</script>
  <audio id="site-music" preload="auto" data-playlist="${musicPlaylist}"></audio>
  <div class="site-audio" id="site-audio-player">
    <button class="site-audio__toggle" id="site-audio-toggle" type="button" aria-label="播放背景音乐">▶</button>
    <button class="site-audio__next" id="site-audio-next" type="button" aria-label="跳过当前曲目">»</button>
    <span class="site-audio__status" id="site-audio-status" aria-live="polite">RANDOM PLAYLIST · 2 TRACKS</span>
    <label class="site-audio__volume-label" for="site-audio-volume">VOL</label>
    <input class="site-audio__volume" id="site-audio-volume" type="range" min="0" max="1" step="0.01" value="0.52" aria-label="背景音乐音量">
    <output class="site-audio__volume-value" id="site-audio-volume-value" for="site-audio-volume">52%</output>
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
  <button class="state-info__articles-toggle" id="state-articles-toggle" type="button" aria-label="打开该区文章" aria-expanded="false"><span aria-hidden="true"></span></button>
  <aside class="state-articles" id="state-articles" aria-hidden="true" aria-labelledby="state-articles-title">
    <header class="state-articles__header">
      <div><p class="state-articles__eyebrow" id="state-articles-code">DISTRICT / --</p><h2 id="state-articles-title">区文章</h2></div>
      <button class="state-articles__close" id="state-articles-close" type="button" aria-label="关闭文章栏">×</button>
    </header>
    <div class="state-articles__body">
      <nav class="state-articles__list" id="state-articles-list" aria-label="文章列表"></nav>
      <article class="state-articles__content" id="state-articles-content"><p class="state-articles__empty">选择一篇文章阅读。</p></article>
    </div>
  </aside>
</main>`;

    html = html.replace(/<body(.*?)>/i, '<body$1 class="site-home-page">');
    html = html.replace(/<script[^>]+src="[^"]*\/js\/script\.js"[^>]*><\/script>/i, '');
    html = html.replace(/<header id="header">[\s\S]*?<\/header>[\s\S]*?<footer id="footer">[\s\S]*?<\/footer>/i, home);
    return html.replace(/<\/body>/i, `<script src="${root}js/state-map.js" defer></script></body>`);
  });
