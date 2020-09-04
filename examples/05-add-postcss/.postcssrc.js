module.exports = {
  plugins: [
    require('precss'),
    // require('autoprefixer'), // 已经包含在 post-cssnext 中了
    require('postcss-cssnext'),
    require('postcss-import'),
  ]
}
