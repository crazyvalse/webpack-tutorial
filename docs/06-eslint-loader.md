## 【step-by-step】6. 使用 eslint-loader 自动审查代码

> 本篇文档的目的是希望前端同学能够以 `复制粘贴` 的方式，快速在 [webpack 工程](../examples/01-base) 中添加插件。因此，一些说明性质的知识将以`推荐阅读`的方式推荐给大家。

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [TL;DR](#tldr)
- [6.1 步骤](#61-%E6%AD%A5%E9%AA%A4)
- [6.2 具体流程](#62-%E5%85%B7%E4%BD%93%E6%B5%81%E7%A8%8B)
  - [6.2.1 安装 eslint-loader](#621-%E5%AE%89%E8%A3%85-eslint-loader)
  - [6.2.2 调整 `webpack.base.js` 中的配置](#622-%E8%B0%83%E6%95%B4-webpackbasejs-%E4%B8%AD%E7%9A%84%E9%85%8D%E7%BD%AE)
- [6.3 测试 eslint 是否生效](#63-%E6%B5%8B%E8%AF%95-eslint-%E6%98%AF%E5%90%A6%E7%94%9F%E6%95%88)
- [6.4 示例工程](#64-%E7%A4%BA%E4%BE%8B%E5%B7%A5%E7%A8%8B)
- [6.5 总结](#65-%E6%80%BB%E7%BB%93)
- [推荐阅读](#%E6%8E%A8%E8%8D%90%E9%98%85%E8%AF%BB)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### TL;DR

<img src="../imgs/eslint-loader.png" height="200" alt="browerslist" align=center />

在 [使用 ESLint 审查 JS 代码](./05-add-eslint.md) 文档中，我们添加了 eslint 和 prettier。我们通过在项目中添加 [eslint-loader](https://github.com/webpack-contrib/eslint-loader) ，让`webpack` 自动检查 JS 代码中的问题，自动提醒、自动报错。

### 6.1 步骤

根据 [eslint-loader](https://www.npmjs.com/package/eslint-loader#options) 官方文档中的示例说明，我们在 [webpack工程03](../examples/03-add-prettier) 中添加 `eslint-loader` ：

- 安装依赖
- 调整 webpack 的配置

示例工程： [04-add-eslint](../examples/04-add-eslint)

### 6.2 具体流程

#### 6.2.1 安装 eslint-loader

```bash
yarn add eslint-loader -D
```

#### 6.2.2 调整 `webpack.base.js` 中的配置

在 `module.rules` 中添加 `babel-loader` 的配置：

[build/webpack.base.js](../examples/04-add-eslint/build/webpack.base.js)

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // 在此添加 eslint-loader 的配置
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: true,
          fix: false // 自动修复，对 ide 不够友好。如果，webstorm也开启了自动修复，会与eslint-loader互相冲突。
          // failOnError: true, // 如果有格式错误，不进行编译
          // failOnWarning: true
        }
      }
      // END 在此添加 eslint-loader 的配置
    ]
  }
  // ...
}
```

### 6.3 测试 eslint 是否生效

在开发模式下，我们故意编写错误代码，以验证 webpack 是否能够自动审查代码，并提示我们报错信息。

运行 `yarn run dev` 启动工程后，改写 `index.js`

[src/index.js](../examples/04-add-eslint/src/index.js)

```
const bar = {
  a: {
    b: 123,
    c: {
      d: 'hello',
      e () {
        // XXXXXX e后括号的格式不对
        console.info(123)
      }
    }
  }
}

// XXXXXX规则中，不能以分号结尾。
const bb = {
  ...bar,
  app: [1, 2, 3, 4],
  bpp: 'hello world'.includes('ll')
};

document.body.innerText = `这个是 ${JSON.stringify(bb)}`
```

修改`index.js`文件后，`webpack`在控制台中提示了代码的**格式错误**。

```
ERROR in ./src/index.js
Module Error (from /Users/CodingNutsZac/Documents/gitee/webpack-project-tutorial/node_modules/eslint-loader/dist/cjs.js):

/Users/CodingNutsZac/Documents/gitee/webpack-project-tutorial/examples/04-add-eslint/src/index.js
   6:8  error  Delete `·`  prettier/prettier
  17:2  error  Delete `;`  prettier/prettier

✖ 2 problems (2 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.

ℹ ｢wdm｣: Failed to compile.

```

如果控制台显示了上面的提示信息，说明我们已经成功地在webpack工程中，添加了 `eslint-loader`。工程中的 webpack 可以通过 `eslint-loader` 自动审查代码错误，并提示我们报错信息。

使用 webstorm 快捷键、或者 vscode 快捷键，或者手动修复错误后，项目恢复正常。

### 6.4 示例工程

示例工程：[04-add-eslint](../examples/04-add-eslint)

```
|-- examples
    |-- .babelrc
    |-- .editorconfig
    |-- .eslintrc.js // 新添加的 eslint 配置
    |-- .prettierrc.js
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

### 6.5 总结

添加 eslint-loader 的步骤：

- 安装依赖
- 调整 webpack 的配置

### 推荐阅读

- 轻松上手 Eslint： <https://juejin.im/post/6861925256995700744>
- ESlint 使用总结：<https://juejin.im/post/6844903877012111368>
- ESLint 工作原理探讨： <https://juejin.im/entry/6844903749886935053>
- 深入浅出 eslint： <https://juejin.im/post/6844903684522917902>
