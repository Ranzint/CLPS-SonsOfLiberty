  const root = (hexo.config.root || '/').replace(/\/?$/, '/');
  const stylesheet = `<link rel="stylesheet" href="${root}css/site-dark.css">`;

  hexo.extend.filter.register('after_render:html', function (html) {
    if (!/<\/head>/i.test(html) || html.includes('css/site-dark.css')) return html;
    return html.replace(/<\/head>/i, `${stylesheet}</head>`);
  });
