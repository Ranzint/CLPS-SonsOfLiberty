# State articles

Folders `1` through `50` are district numbers. Put HTML documents directly inside the matching numbered folder. The folder number is the district number shown for the selected state (for example, Ohio is district 17, so use `articles/17/`).

Use `.html` or `.htm` files. The site lists files alphabetically, and the file name (without `.html` or `.htm`) is used as the article name both in the list and at the top of the article. Write the article body inside `<body>`; any first `<h1>` is removed from the displayed body to avoid showing the title twice. The five files in `articles/1/` are test examples for district 1 (Delaware); replace or delete them when ready.

After adding or editing articles, run `publish.bat` to rebuild and publish. Article scripts, event-handler attributes, inline styles, forms, and embedded frames are removed before content is displayed; ordinary HTML text, headings, paragraphs, lists, images, and links are supported.
