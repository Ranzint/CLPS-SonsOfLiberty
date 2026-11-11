---
title: 测试文章二-GitHub发布流程
date: 2026-11-11 12:02:22
tags:
---

这篇测试文章演示代码块、编号列表和链接。实际发布时，保存 Markdown 文件并推送到 `main` 分支即可触发自动部署。

## 发布步骤

1. 编辑并保存 `source/_posts/` 中的文章。
2. 使用 Git 提交更改。
3. 推送到 GitHub 的 `main` 分支。
4. 等待 Actions 中的 Hexo 部署工作流完成。

## 命令示例

```powershell
git add source/_posts
git commit -m "发布测试文章"
git push
```

成功部署后，可以在[博客主页](https://ranzint.github.io/CLPS-SonsOfLiberty/)查看文章。
