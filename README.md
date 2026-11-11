# CLPS Sons of Liberty

基于 Hexo 的个人博客。GitHub Pages 地址：<https://ranzint.github.io/CLPS-SonsOfLiberty/>。

## 本地预览

在项目目录运行：

```bash
npm ci
npm run server
```

然后访问 Hexo 提示的本地地址（通常是 <http://localhost:4000>）。

## 发布新文章

1. 运行 `npx hexo new post "文章标题"`，在 `source/_posts/` 中编辑生成的 Markdown 文件。
2. 提交并推送到 `main` 分支：

   ```bash
   git add source/_posts
   git commit -m "添加博客文章"
   git push origin main
   ```

推送后，GitHub Actions 会自动安装依赖、生成 Hexo 静态文件并发布到 GitHub Pages。首次启用时，请在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。

## 一键发布

在项目根目录双击 `publish.bat`。脚本会暂存并提交项目中的所有更改，再推送到 `main` 分支；如果 SSH 密钥要求密码，请在打开的窗口中输入。推送完成后会打开 Actions 页面，供你查看网站部署状态。
