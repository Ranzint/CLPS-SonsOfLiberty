  const fs = require('fs');
  const path = require('path');
  const { execFileSync } = require('child_process');
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
    const libraryAssets = [];
    const sourceDirectory = path.resolve(hexo.base_dir, hexo.config.source_dir || 'source');
    ['images', 'music', 'fonts', 'videos'].forEach(directoryName => {
      const directory = path.join(sourceDirectory, directoryName);
      if (!fs.existsSync(directory)) return;
      const visit = currentDirectory => {
        fs.readdirSync(currentDirectory, { withFileTypes: true }).forEach(entry => {
          if (entry.name === '.gitkeep' || entry.name.toLowerCase().endsWith('.lnk')) return;
          const absolutePath = path.join(currentDirectory, entry.name);
          if (entry.isDirectory()) {
            visit(absolutePath);
            return;
          }
          const relativePath = path.relative(sourceDirectory, absolutePath).split(path.sep).join('/');
          const extension = path.extname(entry.name).toLowerCase();
          const type = /\.(png|jpe?g|gif|webp|svg|avif)$/.test(extension) ? 'image'
            : /\.(mp3|wav|ogg|m4a|flac)$/.test(extension) ? 'audio'
              : /\.(mp4|webm|mov)$/.test(extension) ? 'video'
                : 'file';
          libraryAssets.push({
            name: entry.name,
            path: relativePath,
            url: root + relativePath.split('/').map(encodeURIComponent).join('/'),
            type,
            size: fs.statSync(absolutePath).size
          });
        });
      };
      visit(directory);
    });
    const libraryAssetsJson = JSON.stringify(libraryAssets)
      .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
    const stateDataDirectory = path.resolve(hexo.base_dir, 'state-data', 'states');
    const stateImageDirectory = path.resolve(hexo.base_dir, hexo.config.source_dir || 'source', 'images', 'states');
    const stateProfiles = {};
    if (fs.existsSync(stateDataDirectory)) {
      for (const filename of fs.readdirSync(stateDataDirectory).filter(name => /^\d+\.json$/.test(name)).sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10))) {
        try {
          const profile = JSON.parse(fs.readFileSync(path.join(stateDataDirectory, filename), 'utf8'));
          const code = profile.code;
          if (!/^[A-Z]{2}$/.test(code || '')) throw new Error('Missing state code in district profile');
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
    const recentArticles = [];
    const articleUpdateTimes = Object.create(null);
    try {
      const history = execFileSync('git', ['log', '--format=%ct', '--name-only', '--', 'articles'], {
        cwd: hexo.base_dir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      });
      let commitTime = 0;
      history.split(/\r?\n/).forEach(line => {
        if (/^\d+$/.test(line.trim())) {
          commitTime = Number(line.trim()) * 1000;
        } else if (line.startsWith('articles/') && !articleUpdateTimes[line]) {
          articleUpdateTimes[line] = commitTime;
        }
      });
    } catch (error) {
      // Use file modification times when building outside a Git checkout.
    }
    for (let number = 1; number <= 50; number++) {
      const directory = path.join(articlesDirectory, String(number));
      const files = fs.existsSync(directory)
        ? fs.readdirSync(directory).filter(filename => /\.html?$/i.test(filename)).sort((a, b) => a.localeCompare(b))
        : [];
      districtArticles[number] = files.map(filename => {
        const articlePath = path.join(directory, filename);
        const html = fs.readFileSync(articlePath, 'utf8');
        const title = path.basename(filename, path.extname(filename));
        const relativePath = path.relative(hexo.base_dir, articlePath).replace(/\\/g, '/');
        const updated = articleUpdateTimes[relativePath] || fs.statSync(articlePath).mtimeMs;
        recentArticles.push({ district: number, title, filename, updated });
        return { title, filename, html, updated };
      });
    }
    recentArticles.sort((a, b) => b.updated - a.updated);
    const recentArticlesJson = JSON.stringify(recentArticles.slice(0, 8))
      .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
    const districtArticlesJson = JSON.stringify(districtArticles)
      .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
    const contributionGuidePath = path.join(hexo.base_dir, 'special-articles', '投稿指南.html');
    const contributionGuideHtml = fs.existsSync(contributionGuidePath)
      ? fs.readFileSync(contributionGuidePath, 'utf8')
      : '<article><h1>投稿指南</h1><p>请将文章放入对应区号文件夹。</p></article>';
    const contributionGuideJson = JSON.stringify(contributionGuideHtml)
      .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
    const home = `<main class="site-home" aria-labelledby="site-home-title">
  <h1 id="site-home-title" class="site-home__title">${title}</h1>
  <img class="site-home__moon" id="site-home-moon" src="${root}images/moon.png" alt="" aria-hidden="true">
  <button class="site-home__guide-button" id="site-contribution-guide" type="button" aria-label="打开投稿指南">
    <span>投稿指南</span>
  </button>
  <aside class="site-home__sidepanels" aria-label="站点资料导航">
    <section class="site-home__sidepanel" aria-labelledby="home-recent-title">
      <header class="site-home__sidepanel-heading"><h2 id="home-recent-title">最近更新</h2><button class="site-home__sidepanel-toggle" type="button" aria-label="收起最近更新" aria-expanded="true" aria-controls="home-recent-list"><span aria-hidden="true">‹</span></button></header>
      <nav class="site-home__recent-list" id="home-recent-list" aria-label="最近更新的文章"></nav>
    </section>
    <section class="site-home__sidepanel" aria-labelledby="home-library-title">
      <header class="site-home__sidepanel-heading"><h2 id="home-library-title">资料仓库</h2><button class="site-home__sidepanel-toggle" type="button" aria-label="收起资料仓库" aria-expanded="true" aria-controls="home-repository-list"><span aria-hidden="true">‹</span></button></header>
      <nav class="site-home__repository-list" id="home-repository-list" aria-label="已有素材文件"></nav>
    </section>
  </aside>
  <svg class="site-home__district-link" id="district-map-link" aria-hidden="true" focusable="false">
    <path id="district-map-link-path"></path>
    <circle id="district-map-link-point" r="4"></circle>
  </svg>
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
  <script id="recent-article-data" type="application/json">${recentArticlesJson}</script>
  <script id="site-library-data" type="application/json">${libraryAssetsJson}</script>
  <script id="contribution-guide-data" type="application/json">${contributionGuideJson}</script>
  <audio id="site-music" preload="auto" data-playlist="${musicPlaylist}"></audio>
  <div class="site-audio" id="site-audio-player">
    <button class="site-audio__toggle" id="site-audio-toggle" type="button" aria-label="播放背景音乐">▶</button>
    <button class="site-audio__next" id="site-audio-next" type="button" aria-label="跳过当前曲目">»</button>
    <span class="site-audio__status" id="site-audio-status" aria-live="polite">RANDOM PLAYLIST · ${musicTracks.length} TRACKS</span>
    <label class="site-audio__volume-label" for="site-audio-volume">VOL</label>
    <input class="site-audio__volume" id="site-audio-volume" type="range" min="0" max="1" step="0.01" value="0.15" aria-label="背景音乐音量">
    <output class="site-audio__volume-value" id="site-audio-volume-value" for="site-audio-volume">15%</output>
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
      <nav class="state-articles__districts" id="state-district-list" aria-label="选择区号"></nav>
      <section class="state-articles__list" id="state-articles-list" aria-label="文章列表"></section>
    </div>
  </aside>
  <aside class="state-article-reader" id="state-article-reader" aria-hidden="true" aria-label="文章阅读界面">
    <div class="state-article-reader__page">
      <header class="state-article-reader__header">
        <p class="state-articles__eyebrow" id="state-article-reader-district">DISTRICT / --</p>
        <button class="state-articles__close" id="state-article-reader-close" type="button" aria-label="返回文章列表">×</button>
      </header>
      <article class="state-article-reader__content" id="state-articles-content"></article>
    </div>
  </aside>
</main>`;

    html = html.replace(/<body(.*?)>/i, '<body$1 class="site-home-page">');
    html = html.replace(/<script[^>]+src="[^"]*\/js\/script\.js"[^>]*><\/script>/i, '');
    html = html.replace(/<header id="header">[\s\S]*?<\/header>[\s\S]*?<footer id="footer">[\s\S]*?<\/footer>/i, home);
    return html.replace(/<\/body>/i, `<script src="${root}js/state-map.js" defer></script></body>`);
  });
