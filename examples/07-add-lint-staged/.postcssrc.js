// .postcssrc.js
module.exports = {
  plugins: [
    require('stylelint'),
    require('postcss-import'), //
    // require('autoprefixer'), // 自动添加浏览器前缀（已经包含在 post-cssnext 中了）
    require('postcss-preset-env')() // 使用下一代css语法
  ]
}
