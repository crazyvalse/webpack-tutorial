# 手把手教你创建一个 webpack的骨架
这个文档中包括
* 初始化项目
* 创建 webpack 测试模式与开发模式
* 添加 babel
* 添加 eslint
* 添加 prettier
* 添加 postcss
* 添加 stylelint

## 1. 初始化项目
使用 `npm init -y` 快速创建 [package.json][10] 文件，也可以使用 `npm init` 命令，分步创建 [package.json][10] 文件。

Example：[01](./examples/01-init-project/package.json)
```
CodingNutsZ:postcss CodingNutsZac$ npm init -y
Wrote to /Users/CodingNutsZac/Documents/github/webpack-examples-new/postcss/package.json:

{
  "name": "postcss",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```
> [10]: https://docs.npmjs.com/creating-a-package-json-file

## 2. 创建webpack工程

通过运行一下命令来安装 webpack的依赖：

```bash
yarn add webpack webpack-cli
```

为了运行方便，创建三个脚本：

webpack 公共配置：[02/build/webpack.base.js](./examples/02-create-webpack-project/build/webpack.base.js)

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

webpack **开发**模式的配置：[02/build/webpack.dev.js](./examples/02-create-webpack-project/build/webpack.dev.js)

```javascript
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: '../dist',
    hot: true
  },
  devtool: 'cheap-module-eval-source-map' // 'eval-source-map'
})

```
webpack **生产**模式的配置：[02/build/webpack.prod.js](./examples/02-create-webpack-project/build/webpack.prod.js)

```javascript
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist')
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: { chunks: 'all' }
  },
  module: {
    rules: [
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.css$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true,
          },
        }, 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['zh-cn'],
    }),
    new CompressionPlugin(),
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    })
  ]
}

```
