// .postcssrc.js
module.exports = {
  plugins: [
    require('postcss-import'), //
    // require('autoprefixer'), // 自动添加浏览器前缀（已经包含在 postcss-preset-env 中了）
    require('postcss-preset-env')() // 使用下一代css语法
  ]
}
