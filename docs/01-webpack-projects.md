## 【step-by-step】1. webpack 工程

[01]: https://webpack.js.org/guides/
[02]: https://www.webpackjs.com/guides/
[11]: http://momentjs.cn/
[21]: https://docs.npmjs.com/creating-a-package-json-file

目录：

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [1.1 目录结构](#11-%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)
- [1.2 文件分析](#12-%E6%96%87%E4%BB%B6%E5%88%86%E6%9E%90)
  - [1.2.1 webpack 配置](#121-webpack-%E9%85%8D%E7%BD%AE)
    - [配置](#%E9%85%8D%E7%BD%AE)
    - [mode](#mode)
    - [devtool](#devtool)
  - [1.2.2 package.json](#122-packagejson)
  - [1.2.3 其他文件](#123-%E5%85%B6%E4%BB%96%E6%96%87%E4%BB%B6)
- [1.3 运行结果](#13-%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C)
- [1.4 示例工程](#14-%E7%A4%BA%E4%BE%8B%E5%B7%A5%E7%A8%8B)
- [参考](#%E5%8F%82%E8%80%83)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

这是根据 [官方文档](https://webpack.docschina.org/guides/production/) 中的示例搭建的工程，只是增加了几个常用的 `plugin`。在 [/examples](../examples) 目录下的所有后继**示例工程**都是基于这个工程扩展的。我们会逐步在这个工程中添加 [babel](./02-add-babel.md) 、 [eslint](./05-add-eslint.md) 、 [postcss](./07-add-postcss.md) 、 [stylelint](./08-add-stylelint.md) 等插件。

如果，前端同学对于这个工程有诸多不清楚的地方，那么我强烈建议你先系统地学习一下 `webpack`，可以参考 [官方文档][01]，也可以看一下[中文文档][02]，里面的教程非常棒！！！

> **注意**：中文文档更新不及时，里面的很多示例不适用于新版本的 webpack。因此，建议可以多多查看[官方文档][01]。

### 1.1 目录结构

[示例工程(01-base)](../examples/01-base) 的目录结构

```
|-- examples
    |-- index.html // html模板
    |-- package.json
    |-- build // 配置文件文件夹
    |   |-- webpack.base.js // webpack的通用配置
    |   |-- webpack.dev.js // webpack开发环境的配置
    |   |-- webpack.prod.js // webpack生产环境的配置
    |-- src
        |-- index.js // 入口文件
        |-- assets
            |-- style.css // 样式
```

### 1.2 文件分析

#### 1.2.1 webpack 配置

开发环境和生产环境的**构建目标**差异很大：

- 在开发环境中，我们需要强大的 [热更新](https://webpack.docschina.org/concepts/hot-module-replacement/#how-it-works) 功能，及 [dev server](https://webpack.docschina.org/configuration/dev-server/#devserver) 和 [proxy](https://webpack.docschina.org/configuration/dev-server/#devserverproxy) 。
- 在生产环境中，我们的目标则转向于关注更小的 bundle、更轻量级的 [source map](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html) 和**优化资源**，以**改善**加载时间。

> 热更新：
>
> - 保留在完全重新加载页面期间丢失的应用程序状态。
> - 只更新变更内容，以节省宝贵的开发时间。
> - 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。

##### 配置

> 本例是参考了 [官方的例子](https://webpack.js.org/guides/production/) ，并做了一点调整。 [中文文档](https://www.webpackjs.com/guides/production/) 中的例子有点老，不适用于 webpack 4+。

遵循逻辑分离，我们通常为每个环境编写彼此独立的**webpack 配置**：

[build/webpack.base.js](../examples/01-base/build/webpack.base.js):

```javascript
const path = require('path')

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

在 `webpack.base.js` 中，我们设置了 `entry` 和 `output` ，并且在文件中引入了两个环境共用的插件。

> **注意**: output.filename 不能使用 [chunkhash]，只能使用 [hash]，否则在 **开发模式(dev)** 下会报错。

[build/webpack.dev.js](../examples/01-base/build/webpack.dev.js)

```javascript
// 合并数组和对象，但不是覆盖！！！
// https://www.npmjs.com/package/webpack-merge
const { merge } = require('webpack-merge')

// 生成 html5，并在body中使用script标签引入打包后的js文件。
// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'development', // 声明开发模式
  devServer: {
    contentBase: '../dist',
    hot: true, // 热模块更新 - 局部更新
    host: '0.0.0.0', // 设置后，其他机器可以通过ip访问
    // port: '8080', // 端口
    quiet: false,
    clientLogLevel: 'warning',
    proxy: {} // 跨域代理
  },
  // 'cheap-module-eval-source-map'低开销的source-map，但只映射行数。
  // 'eval-source-map'，初始化source map的时候比较慢，但是重新构建时，提供比较快的速度，并能正确映射出报错的位置
  // https://www.webpackjs.com/configuration/devtool/
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成的文件名
      template: 'index.html', // 使用的模板文件
      inject: true // 生成的script插到body底部
    })
  ]
})
```

在 `webpack.dev.js` 中，我们将 `mode` 设置为 `development`，并且为此环境添加了强大的 [devtool](https://www.webpackjs.com/configuration/devtool/) （强大的 source map）和 [devServer](https://www.webpackjs.com/guides/development/#%E4%BD%BF%E7%94%A8-webpack-dev-server) 。

[build/webpack.prod.js](../examples/01-base/build/webpack.prod.js)

```javascript
const path = require('path')
// 合并数组和对象，但不是覆盖！！！
// https://www.npmjs.com/package/webpack-merge
const { merge } = require('webpack-merge') // 合并数组和对象，但不是覆盖！！！

// 生成 gzip 文件
// https://www.npmjs.com/package/compression-webpack-plugin
const CompressionPlugin = require('compression-webpack-plugin')

// 分析打包出来的文件
// https://www.npmjs.com/package/webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css和sourceMap
// https://www.npmjs.com/package/mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 生成 html5，并在body中使用script标签引入打包后的js文件。
// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 清理 dist 文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 压缩器 用于代替webpack自带的压缩器。
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const base = require('./webpack.base')
const config = {
  bundleAnalyzerReport: false,
  productionGzip: true
}

const webpackConfig = merge(base, {
  mode: 'production',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist')
  },
  // source-map: 整个source map 作为独立文件生成，并未bundle添加一个引用注释。
  // https://www.webpackjs.com/configuration/devtool/
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: { chunks: 'all' }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      minify: {
        removeComments: true, // 移除html中的注释
        collapseWhitespace: true, // 去掉留白部分
        removeAttributeQuotes: true // 去掉属性中的引号
      },
      inject: true
    })
  ]
})

// 生成 gzip 文件
// https://www.npmjs.com/package/compression-webpack-plugin
if (config.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      test: new RegExp('\\.(js|css)$'), //只打包 js和css 文件
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

// 分析打包出来的文件
// https://www.npmjs.com/package/webpack-bundle-analyzer
if (config.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
```

在 `webpack.prod.js` 中，添加了 `optimization.slitChunks.chunks` ( [SlitChunksPlugin](https://webpack.js.org/guides/code-splitting/#splitchunksplugin) ) ，可以将公共的依赖模块抽象到 chunk 中，或者抽象到一个新生成的 chunk 中。

<!-- 在 `webpack.dev.js` 与 `webpack.prod.js` 中都使用了功能强大的 `mode` 和 `devtool`。 -->

##### mode

webpack 4+ 提供了 [mode](https://webpack.js.org/configuration/mode/) 配置选项，能够自动调用 webpack 的**优化策略**。默认值为 production。

```
string = 'production': 'none' | 'development' | 'production'
```

在 `webpack` 配置文件中

```javascript
module.exports = {
  mode: 'development' // 默认是 production
}
```

- 在 development（开发模式）下，会自动引用 NamedChunksPlugin 和 NameModulesPlugin。
- 在 production（生产模式）下，会自动引用 FlagDependencyUsagePlugin、FlagIncludedChunksPlugin、ModuleConcatenationPlugin、NoEmitOnErrorsPlugin、OccurrenceOrderPlugin、SideEffectsFlagPlugin 及 TerserPlugin。

##### devtool

[devtool](https://www.webpackjs.com/configuration/devtool/) 选项控制**是否**生成以及**如何**生成 [source map](https://blog.teamtreehouse.com/introduction-source-maps) 。

> Source map 就是一个信息文件，里面储存着位置信息。也就是说，source map 能把转换后代码还原成转换前的样子。有了 source map，debug工具可以把压缩代码显示为原始代码。详细可参考：[阮一峰-JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

在 `webpack.dev.js` 中，推荐使用以下两种 `source map`：

- cheap-module-eval-source-map ✅ : 低开销的 [source-map](https://blog.teamtreehouse.com/introduction-source-maps) ，但只映射行数。（推荐）
- eval-source-map: 初始化 source map 的时候比较慢，但是重新构建时，提供比较快的速度，并能正确映射出报错的位置。

在 `webpack.prod.js` 中，推荐使用以下三种 `source map`：

- source-map ✅ : 整个 source map 作为独立文件生成，并为 bundle 添加一个引用注释。(推荐！需在**nginx**中，设置可访问.map 文件的**ip 白名单**，以保护代码安全。)
- hidden-source-map: hidden-source-map 与 source-map 相同，但是不会为 bundle 添加引用注释。
- nosource-source-map: 创建的 source map 不包括 源代码内容。只映射客户端上的堆栈信息，不会暴露所有源代码。

#### 1.2.2 package.json

通常而言，当我们阅读一个项目的源代码时，最好是从 `package.json`开始。这样做可以方便我们找到项目的入口，也就是起始位置。

[package.json](../examples/01-base/package.json)

```json
{
  "name": "01-base",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "webpack-dev-server --config build/webpack.dev.js",
    "build": "webpack --config build/webpack.prod.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.11.4",
    "@babel/plugin-transform-runtime": "^7.11.0",
    "@babel/preset-env": "^7.11.0",
    "babel-loader": "^8.1.0",
    "clean-webpack-plugin": "^3.0.0",
    "compression-webpack-plugin": "^5.0.1",
    "css-loader": "^4.2.2",
    "html-webpack-plugin": "^4.3.0",
    "mini-css-extract-plugin": "^0.10.0",
    "optimize-css-assets-webpack-plugin": "^5.0.4",
    "style-loader": "^1.2.1",
    "terser-webpack-plugin": "^4.1.0",
    "webpack": "^4.44.1",
    "webpack-bundle-analyzer": "^3.8.0",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0",
    "webpack-merge": "^5.1.2"
  }
}
```

在 `package.json` 中，注册了两个 `脚本命令` ，以便于快速进行启动 `devServer` 及 打包文件。

```json
{
  "scripts": {
    "dev": "webpack-dev-server --config build/webpack.dev.js",
    "build": "webpack --config build/webpack.prod.js"
  }
}
```

同时，引用一些常用的`plugin`：

- [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin) ：在 webpack 构建时，清除 dist 文件夹。
- [compression-webpack-plugin](https://www.npmjs.com/package/compression-webpack-plugin) ：打包时，自动生成 js、css 的 gzip 文件。
- [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin) ：生成 html5 文件。并能以 script 标签的形式引入打包后的 `bundle.js` 文件。
- [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) ：抽取 css，并生成文件。
- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) ：分析 `bundle.js` 内的组件成分。
- [webpack-merge](https://www.npmjs.com/package/webpack-merge) : 合并数组和对象。（但`不是`覆盖！！！）
- [terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin) ：用 `terser` 压缩打包后的 JS 代码。
- [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin) ：压缩打包后的 CSS 文件。


#### 1.2.3 其他文件

[src/index.js](../examples/01-base/src/index.js)

```javascript
import './assets/style.css'

function foo() {
  document.body.innerText = 'hello world'
}

foo()
```

[src/assets/style.css](../examples/01-base/src/assets/style.css)

```css
body {
  background-color: red;
}
```

[index.html](../examples/01-base/index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>模板</title>
  </head>
  <body></body>
</html>
```

### 1.3 运行结果

运行以下命令，查看结果

```bash
> yarn
> npm run dev
```

打开 <http://0.0.0.0:8080/> 地址查看结果：

![运行结果](../imgs/01.png)

### 1.4 示例工程

示例工程：[01-base](../examples/01-base)

```
|-- examples
    |-- index.html
    |-- package.json
    |-- build
    |   |-- webpack.base.js // 通用配置
    |   |-- webpack.dev.js // 开发环境下的配置
    |   |-- webpack.prod.js // 生成环境下的配置
    |-- src
        |-- index.js
        |-- assets
            |-- style.css
```

### 参考

- [谈谈如何高效学习开源项目](https://juejin.im/post/6844903657348022280)
- [如何阅读大型前端开源项目的源代码](https://juejin.im/post/6844903607393845255)
- [阮一峰-JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
- [webpack 生成环境](https://webpack.docschina.org/guides/production/)
