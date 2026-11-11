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
  <img class="site-home__map" src="${root}images/north-america-map.svg" alt="北美洲地图，显示加拿大省区、美国州界和墨西哥州界">
  <a class="site-home__credit" href="https://commons.wikimedia.org/wiki/File:North_America_second_level_political_division_2.svg" target="_blank" rel="noopener">Map by Alex Covarrubias · CC BY-SA 2.5 · adapted</a>
</main>`;

    html = html.replace(/<body(.*?)>/i, '<body$1 class="site-home-page">');
    return html.replace(/<header id="header">[\s\S]*?<\/header>[\s\S]*?<footer id="footer">[\s\S]*?<\/footer>/i, home);
  });
