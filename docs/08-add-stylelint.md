## 【step-by-step】8. 添加 stylelint

> 本篇文档的目的是希望前端同学能够以 `复制粘贴` 的方式，快速在 [webpack 工程](../examples/01-base) 中添加插件。因此，一些说明性质的知识将以`推荐阅读`的方式推荐给大家。

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [8. 添加 stylelint](#8-%E6%B7%BB%E5%8A%A0-stylelint)
  - [TL;DR](#tldr)
  - [8.1 步骤](#81-%E6%AD%A5%E9%AA%A4)
  - [8.2 具体流程](#82-%E5%85%B7%E4%BD%93%E6%B5%81%E7%A8%8B)
    - [8.2.1 安装 stylelint](#821-%E5%AE%89%E8%A3%85-stylelint)
    - [8.2.2 添加配置文件](#822-%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
    - [8.2.3 调整 `.postcssrc.js` 文件](#823-%E8%B0%83%E6%95%B4-postcssrcjs-%E6%96%87%E4%BB%B6)
    - [8.3 测试](#83-%E6%B5%8B%E8%AF%95)
  - [8.4 添加 stylelint-prettier](#84-%E6%B7%BB%E5%8A%A0-stylelint-prettier)
    - [安装依赖](#%E5%AE%89%E8%A3%85%E4%BE%9D%E8%B5%96)
    - [调整配置文件](#%E8%B0%83%E6%95%B4%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
  - [8.5 示例工程](#85-%E7%A4%BA%E4%BE%8B%E5%B7%A5%E7%A8%8B)
  - [8.6 总结](#86-%E6%80%BB%E7%BB%93)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

我们期待能有一套自动化工具，帮助我们自动调整代码风格，自动审查代码语法。使我们能够把更多的精力投放到业务开发中，而不是千奇百怪的代码风格上。

因此，我们在工程中添加几个工具：

- [x] .editorconfig ： 让IDE遵循同样的编写规则。
- [x] prettier ： 代码格式化工具。
- [x] eslint ： 审查 js 语法。
- [ ] stylelint ： 审查 css 语法。
- [ ] commitlint ： 审查 git commit 信息格式。

### TL;DR

![](../imgs/stylelint.png)

[stylelint](https://stylelint.io/user-guide/usage/postcss-plugin) 是强大的 css 代码审查工具，由`PostCSS`提供技术支持。与 `ESLint` 类似，是通过定义一系列的编码风格规则帮助我们避免在样式中出现错误。目前，我们可以把`stylelint`作为`postcss`的`plugin`来使用。

### 8.1 步骤

根据 [stylelint](https://stylelint.io/user-guide/usage/postcss-plugin) 文档中的示例说明，我们在 [webpack 工程 05](../examples/05-add-postcss) 项目中，添加 `stylelint` 的步骤如下：

- 安装依赖
- 添加配置文件
- 调整 postcss 的配置

示例工程：[06-add-stylelint](../examples/06-add-stylelint)

### 8.2 具体流程

#### 8.2.1 安装 stylelint

运行脚本命令安装 `stylelint`

```bash
yarn add stylelint stylelint-config-standard -D
```

#### 8.2.2 添加配置文件

创建 `.stylelintrc` 文件

```json
{
  "extends": "stylelint-config-standard"
}
```

#### 8.2.3 调整 `.postcssrc.js` 文件

调整 `.postcssrc.js` 文件，添加 `stylelint` plugin

```javascript
module.exports = {
  plugins: [
    require('stylelint'), // 添加 stylelint 插件，需要放在最上面。
    require('postcss-import'), //
    // require('autoprefixer'), // 自动添加浏览器前缀（已经包含在 postcss-preset-env 中了）
    require('postcss-preset-env')() // 使用下一代css语法
  ]
}
```

> stylelint 插件需要放在`plugin`列表的最上面。

#### 8.3 测试

我们故意破坏 `style.css` 的格式后，运行 `stylelint` 的命令查看审查结果。

[src/assets/style.css](../examples/06-add-stylelint/src/assets/style.css)

```
::placeholder {
  color: gray;
}

body {
  background-color: #00;
}


.example {
  display: flex;
  position: relative;
  transform: translate(10, 10);
}
```

运行 `stylelint` 命令

> 文件的匹配规则可以参考 [glob](https://github.com/isaacs/node-glob#readme) 库中的介绍 。

```bash
npx stylelint src/**/*.css
```

在控制台会出现以下提醒

```
npx stylelint src/**/*.css

src/assets/style.css
 6:21  ✖  Unexpected invalid hex color "#00"   color-no-invalid-hex
 9:1   ✖  Expected no more than 1 empty line   max-empty-lines
```

调整后，程序恢复正常

### 8.4 添加 stylelint-prettier

通过安装 [stylelint-prettier](https://github.com/prettier/stylelint-prettier) ，`stylelint` 会使用 prettier 中的配置规则对工程进行检查。

#### 安装依赖

```bash
yarn add stylelint-prettier stylelint-config-prettier -D
```

#### 调整配置文件

调整配置文件 `.stylelintrc` ， 把原来的配置替换成下面的这个

```json
{
  "extends": ["stylelint-prettier/recommended"]
}
```

再次进行测试

### 8.5 示例工程

示例工程：[06-add-stylelint](../examples/06-add-stylelint)

```
|-- examples
    |-- .babelrc
    |-- .editorconfig
    |-- .eslintignore
    |-- .eslintrc.js
    |-- .postcssrc.js
    |-- .prettierignore
    |-- .prettierrc.js
    |-- .stylelintrc // 新添加的 stylelint 配置文件
    |-- index.html
    |-- package.json
    |-- build
    |   |-- webpack.base.js
    |   |-- webpack.dev.js
    |   |-- webpack.prod.js
    |-- src
        |-- index.js
        |-- assets
            |-- style.css
```

### 8.6 总结

添加 stylelint 的 步骤

- 安装依赖
- 添加配置文件
- 调整 postcss 的配置
- 安装 stylelint-prettier
- 调整配置文件

### 推荐阅读

- [glob](https://github.com/isaacs/node-glob#readme)
