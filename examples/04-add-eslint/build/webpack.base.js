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
      },
      // 在此添加 eslint-loader 的配置
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: true,
          fix: false, // 自动修复，对ide 不够友好
          // failOnError: true, // 如果有格式错误，不进行编译
          // failOnWarning: true
        }
      },
      // END 在此添加 eslint-loader 的配置
      // 在此添加 babel-loader 的配置
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      }
      // END 在此添加 babel-loader 的配置
    ]
  }
}
