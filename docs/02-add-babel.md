## 【step-by-step】02. 使用 babel 转译 ES6 + 语法

> 本篇文档的目的是希望前端同学能够以 `复制粘贴` 的方式，快速在 [webpack 工程](../examples/01-base) 中添加插件。因此，一些说明性质的知识将以`推荐阅读`的方式推荐给大家。

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [2.1 Babel 工具介绍](#21-babel-%E5%B7%A5%E5%85%B7%E4%BB%8B%E7%BB%8D)
  - [@babel/preset-env](#babelpreset-env)
  - [@babel/polyfill](#babelpolyfill)
  - [@babel/preset-env 与 @babel/polyfill](#babelpreset-env-%E4%B8%8E-babelpolyfill)
  - [@babel/plugin-transform-runtime](#babelplugin-transform-runtime)
  - [推荐阅读：](#%E6%8E%A8%E8%8D%90%E9%98%85%E8%AF%BB)
- [2.2 添加的步骤](#22-%E6%B7%BB%E5%8A%A0%E7%9A%84%E6%AD%A5%E9%AA%A4)
- [2.3 具体流程](#23-%E5%85%B7%E4%BD%93%E6%B5%81%E7%A8%8B)
  - [2.3.1 安装依赖](#231-%E5%AE%89%E8%A3%85%E4%BE%9D%E8%B5%96)
  - [2.3.2 调整 webpack 配置](#232-%E8%B0%83%E6%95%B4-webpack-%E9%85%8D%E7%BD%AE)
  - [2.3.3 添加配置文件](#233-%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
  - [2.3.4 指定 browserslist](#234-%E6%8C%87%E5%AE%9A-browserslist)
- [2.4 测试](#24-%E6%B5%8B%E8%AF%95)
  - [调试](#%E8%B0%83%E8%AF%95)
  - [打包](#%E6%89%93%E5%8C%85)
- [2.5 示例工程](#25-%E7%A4%BA%E4%BE%8B%E5%B7%A5%E7%A8%8B)
- [2.6 总结](#26-%E6%80%BB%E7%BB%93)
- [参考](#%E5%8F%82%E8%80%83)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

示例工程：[02-add-babel-loader](../examples/02-add-babel-loader)

![](https://d33wubrfki0l68.cloudfront.net/7a197cfe44548cc1a3f581152af70a3051e11671/78df8/img/babel.svg)

[Babel](https://www.babeljs.cn/) 是一个 JavaScript 编译器，允许我们在项目中使用下一代 JS 语法(ES 6 7 8 9...)。`Babel` 将 ECMAScript 2015+ 版本的代码转译成旧版本浏览器也能运行的代码。

比如箭头函数 ：

```javascript
// Babel 输入： ES2015 箭头函数
;[1, 2, 3].map((n) => n + 1)

// Babel 输出： ES5 语法实现的同等功能
;[1, 2, 3].map(function (n) {
  return n + 1
})
```

你可以通过安装预设（presets，一系列同类插件组合）或 插件（plugins）告诉 Babel 应该如何进行代码转译，例如：`@babel/preset-env` （转译 ES6+ 的语法）、`@babel/preset-react`（转译 React )。

### 2.1 Babel 工具介绍

> 注意：如果安装 `Babel`后**不使用**任何 `plugin`，那么`Babel`是不会转译 `ES6+ 语法`的。

#### @babel/preset-env

Babel 推崇功能的单一性，例如我们想使用 ES6 的箭头函数，需要对应的转化插件。

```bash
yarn add @babel/plugin-transform-arrow-functions -D
```

并在 `babel.config.js` 中注册

```js
// babel.config.js

module.exports = {
  plugins: ['@babel/plugin-transform-arrow-functions']
}
```

但是我们不可能一个个的设置所有需要的`plugin`，例如 `ES2015`就包含了二十几个转译插件。为了解决这个问题，babel 还提供了一组插件的`套餐`，也就是 `preset`。

我们在项目中添加的是 `@babel/preset-env`， 它会根据目标浏览器([2.3.4 指定 browserslist](#234-%E6%8C%87%E5%AE%9A-browserslist))自动引入对应的插件列表，然后再进行编译。可以简单理解，它是一堆 Plugin 的`豪华全家桶`，包含了我们常用的 ES2015、ES2016、ES2017 等最新语法的转化插件。

#### @babel/polyfill

由于 babel 只进行语法转换（如箭头函数），你可以使用 polyfill 来支持新的全局变量，如 Promise、Symbol 或 新的原生方法。

#### @babel/preset-env 与 @babel/polyfill

`@babel/polyfill` 在 @babel 7.4 已经废弃了，可以通过配置 `@babel/preset-env` 来引入 polyfill。

主要是以下两个参数：

- `targets`: 本工程需要支持的目标浏览器列表。
- `useBuiltIns`: 此参数决定了 babel 打包时如何处理@babel/polyfill 语句。
  - `entry`: 去掉目标浏览器已支持的 polyfill 模块，将浏览器不支持的都引入对应的 polyfill 模块。
  - `usage` ✅: 打包时会自动根据实际代码的使用情况，结合 targets 引入代码里实际用到部分 polyfill 模块
  - `false` (默认) : 不会自动引入 polyfill 模块，对 polyfill 模块屏蔽

> 建议使用 useBuiltIns: usage。Babel会根据目标浏览器的支持情况和源代码中出现的语言特性，按需引入用到的 polyfill 文件，这确保了最终包里 polyfill 数量的最小化。

#### @babel/plugin-transform-runtime

`babel-polyfill` 会污染全局变量，它给很多类的原型链上添加新的方法。如果我们也开发一套工具类库或者临时在原型链上添加了方法，那么这些自定义方法有可能会跟 `polyfill` 中的方法互相影响，使得整个工程中的代码都变得不可控。

`@babel/plugin-transform-runtime`以沙箱垫片的方式防止污染全局，并抽离公共的 helper function，以节省代码的冗余。

以 `async/await` 举例，如果不使用这个 plugin (即默认情况)，转换后的代码大概是：

```js
// babel 添加一个方法，把 async 转化为 generator
function _asyncToGenerator(fn) {
  return function () {
    // ....
  }
}

// 具体使用处
var _ref = _asyncToGenerator(function* (arg1, arg2) {
  yield (0, something)(arg1, arg2)
})
```

在使用了 `babel-plugin-transform-runtime` 了之后，转化后的代码会变成

```js
// 从直接定义改为引用，这样就不会重复定义了。
var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator')
var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2)

// 具体使用处是一样的
var _ref = _asyncToGenerator3(function* (arg1, arg2) {
  yield (0, something)(arg1, arg2)
})
```

使用 `babel-plugin-transform-runtime` 避免了代码重复的问题。

#### 推荐阅读：

- [不容错过的 Babel7 知识](https://juejin.im/post/6844904008679686152)
- [Babel 配置傻傻看不懂？](https://juejin.im/post/6863705400773083149)
- [一口(很长的)气了解 babel](https://juejin.im/post/6844903743121522701#heading-1)

### 2.2 添加步骤

根据 [babel-loader](https://github.com/babel/babel-loader#usage) 中的示例说明，我们在 [webpack项目01](../examples/01-base) 中添加 `babel-loader` 的步骤如下：

- 安装依赖
- 添加 `babel-loader` 的配置
- 添加 `.babelrc` 配置文件
- 指定 `browserslist`

示例工程：[02-add-babel-loader](../examples/02-add-babel-loader)

### 2.3 具体流程

#### 2.3.1 安装依赖

在 webpack 项目中使用 `babel` 转义 ES6 以上的语法，最好的方式当然是使用 [babel-loader](https://www.npmjs.com/package/babel-loader) 了。`babel-loader`可以自动帮我们转译 ES6 以上的语法(Loader makes the life easier~ 🎉)。

运行以下命令来安装 `babel-loader`

```bash
yarn add babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime core-js -D
```

#### 2.3.2 调整 webpack 配置

由于开发环境和生产环境都需要使用 `babel` 转译。因此，我们在 `webpack.base.js` 中添加 `babel-loader` 的配置。可参考 [官方例子](https://github.com/babel/babel-loader#usage)。

[build/webpack.base.js](../examples/02-add-babel-loader/build/webpack.base.js)

```javascript
const path = require('path')

module.exports = {
  module: {
    // ...
    rules: [
      // ---- 在此添加 babel-loader 的配置 ----
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
      // **** 在此添加 babel-loader 的配置 END ****
    ]
  }
  // ...
}
```

#### 2.3.3 添加配置文件

在根目录下添加 `.babelrc` 文件：

[.babelrc](../examples/02-add-babel-loader/.babelrc)

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": "3"
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime"
    ]
  ]
}

```

在上面的配置中

- @babel/preset-env：是一系列插件的集合，包含了我们在 babel6 中常用的 es2015、es2016、es2017 等最新的语法转换插件。允许我们使用最新的 js 语法，比如 let、const、箭头函数等。
- "useBuiltIns": "usage"：在项目中按需添加 polyfills 中的方法。由于 `babel` 只进行语法转换（如箭头函数），你可以使用 `polyfill` 来支持新的全局变量，如 Promise 或 新的原生方法。@babel/polyfill 在 @babel 7.4 已经废弃了，可以通过使用 `@babel/preset-env` 来引入 polyfill，即在 `.babelrc` 中，配置 userbuiltIns: 'usage'。具体可以参考 [polyfill](https://babeljs.io/docs/en/babel-polyfill#usage-in-node-browserify-webpack) 及 [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins-usage)。
- "corejs": "3": useBuiltIns 使用 usage 的时候，需要声明 corejs 的版本
- @babel/plugin-transform-runtime：以沙箱垫片的方式防止污染全局，并抽离公共的 helper function，以节省代码的冗余。

#### 2.3.4 指定 browserslist

<img src="../imgs/browserslist.jpg" width="200" height="200" alt="browerslist" align=center />

通过 [browserslist](https://github.com/browserslist/browserslist) 指定了项目的**目标浏览器**的范围。这个值会被 [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html) 和 [Autoprefixer](https://github.com/postcss/autoprefixer) 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。

`browserslist` 广泛应用于多个库中：

- Babel
- postcss-preset-env
- Autoprefixer
- ESLint
- StyleLint

在 `package.json` 中配置 `browserslist`。

```json
{
  "browserslist": ["> 0.25%", "not dead", "last 2 versions", "not ie <= 8"]
}
```

### 2.4 测试

#### 调试

我们在 `index.js` 中添加 `ES6+` 语法，然后进行 `debug` 或者 `打包`，查看 `ES6+` 的语法是否被转译成了 `ES5` 语法 ：

```javascript
const bar = {
  a: {
    b: 123,
    c: {
      d: 'hello',
      e() {
        console.info(123)
      }
    }
  }
}

const bb = {
  ...bar,
  app: [1, 2, 3, 4],
  bpp: 'hello world'.includes('ll')
}

document.body.innerText = `这个是 ${JSON.stringify(bb)}`
```

#### 测试

打开 <http://0.0.0.0:8080/> 页面显示：

```
这个是 {"a":{"b":123,"c":{"d":"hello"}},"app":[1,2,3,4],"bpp":true}
```

运行 `npm run build` 查看打包后的文件：

```javascript
// app.41ff3a5a6bab98ef169d.js
// ...

function u(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {}
    r % 2
      ? c(Object(t), !0).forEach(function (r) {
          o()(e, r, t[r])
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
      : c(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
        })
  }
  return e
}

var i = u(
  u(
    {},
    {
      a: {
        b: 123,
        c: {
          d: 'hello',
          e: function () {
            console.info(123)
          }
        }
      }
    }
  ),
  {},
  {
    app: [1, 2, 3, 4],
    bpp: 'hello world'.includes('ll')
  }
)
document.body.innerText = '这个是 '.concat(i)

// ...
```

通过打包后的文件，可以分析出，ES6 语法已经被转义了。其中 String.prototype.includes 被定义在 vendor~app.js 中。

### 2.5 示例工程

示例工程： [02-add-babel-loader](../examples/02-add-babel-loader)

```
|-- examples
    |-- .babelrc // babel 配置文件
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

### 2.6 总结

在项目中添加 `babel-loader` 的步骤：

- 安装依赖
- 添加 `babel-loader` 的配置
- 添加 `.babelrc` 配置文件
- 指定 `browserslist`

### 推荐阅读

- babel: <https://babeljs.io/>
- babel-loader: <https://github.com/babel/babel-loader>
- polyfill: <https://babeljs.io/docs/en/babel-polyfill>
- babel-preset-env: <https://babeljs.io/docs/en/babel-preset-env>
- babel-plugin-transform-runtime: <https://babeljs.io/docs/en/babel-plugin-transform-runtime>
- browserslist: <https://github.com/browserslist/browserslist#queries>
- 腾讯云 babel： <https://cloud.tencent.com/developer/doc/1260>
- babel 详解： <https://blog.liuyunzhuge.com/tags/babel/>
- 阮一峰-Babel 入门教程：<http://www.ruanyifeng.com/blog/2016/01/babel.html?bsh_bid=1656398345>
- 不容错过的 Babel7 知识：<https://juejin.im/post/6844904008679686152>
