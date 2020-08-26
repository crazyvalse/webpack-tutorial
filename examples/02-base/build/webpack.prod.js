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

// 抽取css文件
// https://www.npmjs.com/package/mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 生成 html5，并在body中使用script标签引入打包后的js文件。
// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 清理 dist 文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const base = require('./webpack.base')
const config = {
  bundleAnalyzerReport: false,
  productionGzip: true,
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
    splitChunks: { chunks: 'all' }
  },
  module: {
    rules: [
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
      test: new RegExp( //只打包 js和css 文件
        '\\.(js|css)$'
      ),
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
