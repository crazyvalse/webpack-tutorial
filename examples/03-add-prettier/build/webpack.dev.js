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
    port: '8080', // 端口
    quiet: true,
    clientLogLevel: 'warning',
  },
  // 'cheap-module-eval-source-map'低开销的source-map，但只映射行数。
  // 'eval-source-map'，初始化source map的时候比较慢，但是重新构建时，提供比较快的速度，并能正确映射出报错的位置
  // https://www.webpackjs.com/configuration/devtool/
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成的文件名
      template: 'index.html', // 使用的模板文件
      inject: true, // 生成的script插到body底部
    })
  ]
})
