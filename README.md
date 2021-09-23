# 一个易维护的 webpack 工程

## 前言

很多前端同学在**快速**实现产品经理**验证性**需求的时候，往往把功能点写在一个 html 页面上。单独的 html 页面确实可以快速搭建一个 demo，但是随着迭代的推进，越来越多的功能堆砌在了这个页面上，最终导致整个工程变得难以扩展、难以维护。

不仅如此，很多前端同学会直接在 `html` 页面上，使用 ES6+语法或者新的CSS语法，也会凭着自己的心情随意转换代码风格。这就导致了同样一套代码在不同版本的浏览器上会有不同的表现，大大降低了页面的稳定性和代码的可维护性。

> 开发人员一定要有远见！无论什么项目都应使用一个易扩展、易维护的架构。
>
> 避免给自己挖坑，将来反复代码重构。

随着前端技术的快速发展，越来越多成熟稳定的开源工具可以应用到项目当中。这些工具可以帮助我们提升开发效率，增强代码的可读性、健壮性，例如`babel`和`postcss` 这样的代码转义工具，以及eslint 和 stylelint 这样的语法审查工具。

希望前端同学通过这个文档学会：

1. [webpack 工程](./docs/01-webpack-projects.md) ： 开发与生产分离的 webpack工程。
2. [添加 babel](./docs/02-add-babel.md)：把 `ES6+` 的语法转译成**多数浏览器**都能识别的语法。
3. [添加 .editorconfig](./docs/03-add-editorconfig.md)：规范 IDE 的**编码风格**。
4. [添加 prettier](./docs/04-add-prettier.md)：确保团队使用统一的代码风格。
5. [添加 eslint](./docs/05-add-eslint.md)：使用**命令行**审查 js 语法。
6. [添加 eslint-loader](./docs/06-eslint-loader.md)：开发和打包过程中**自动**审查 js 代码。
7. [添加 postcss-loader](./docs/07-add-postcss.md)：允许我们在工程中使用**新一代**的 css 语法。
8. [添加 stylelint](./docs/08-add-stylelint.md)：以**命令行**的形式审查工程中的 css 语法。
9. [添加 Pre-commit Hook](./docs/09-add-husky.md)：**提交代码前**，强制进行代码检查。
10. [添加 commitizen](./docs/10-add-commitizen.md)：规范Git日志信息的**格式**。
11. [添加 commitlint](./docs/11-add-commitlint.md)：提交代码前，强制审查Git提交的**日志格式**。

并且，能以`复制粘贴`的方式，把上面的工具集成到自己的工程中。

![](./imgs/readme.jpeg)

如果添加新的插件后，引起了文件报错，`不要慌~ 吃口药，还能救！`。我们可以把出现的问题当成普通 bug，例如添加 eslint 之后，大部分的文件报错，我们就把每一个报错的文件当成是一个"bug"。相信我，前端同学花不了多长时间就能解决一个这样的"bug"。

> **架构未必最优！如有好的建议，欢迎指出~**

---

## TODO

- [ ] 调整 webpack.prod.js 把 css压缩plugin加上。
- [ ] 调整 TL;DR 中的描述
- [ ] stylelint 仍有问题，需要补充

## 参考

npm 文档： <https://docs.npmjs.com> \
webpack 官方文档： <https://webpack.js.org/> \
webpack 中文文档： <https://webpack.docschina.org/>

### 推荐网站：

十分钟学会 markdown 语法： <https://commonmark.org/help/>

