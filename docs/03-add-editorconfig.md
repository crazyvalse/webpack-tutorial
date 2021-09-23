## 【step-by-step】3. 使用 .editorconfig 设置 IDE 的配置

> 本篇文档的目的是希望前端同学能够以 `复制粘贴` 的方式，快速在 [webpack 工程](../examples/01-base) 中添加插件。因此，一些说明性质的知识将以`推荐阅读`的方式推荐给大家。

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [TL;DR](#tldr)
- [3.1 添加 .editorconfig 文件](#31-%E6%B7%BB%E5%8A%A0-editorconfig-%E6%96%87%E4%BB%B6)
- [3.2 配置 webstorm](#32-%E9%85%8D%E7%BD%AE-webstorm)
- [推荐文章](#%E6%8E%A8%E8%8D%90%E6%96%87%E7%AB%A0)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

我们期待能有一套自动化工具，帮助我们自动调整代码风格，自动审查代码语法。使我们能够把更多的精力投放到业务开发中，而不是千奇百怪的代码风格上。

因此，我们在工程中添加几个工具：

- [ ] .editorconfig ： 让IDE遵循同样的编写规则。
- [ ] prettier ： 代码格式化工具。
- [ ] eslint ： 审查 js 语法。
- [ ] stylelint ： 审查 css 语法。
- [ ] commitlint ： 审查 git commit 信息格式。

### TL;DR

![](https://editorconfig.org/logo.png)

`.editorconfig` 文件是为了在不同的开发环境上遵循 `.editorconfig` 的配置，以达到拥有同样的代码风格表现。

在前端工程中，即使**已经**有 `eslint` 及 `prettier` 这样的代码格式化工具，也建议使用 `.editorconfig`。 `.editorconfig` 可以对其他文件格式的代码风格进行控制，例如 `.py`、`.md`。

### 3.1 添加 .editorconfig 文件

在工程的根目录下添加 `.editorconfig` 文件

```shell
# editorconfig.org
# 表示是最顶层的配置文件，IDE发现root设为true时，才会停止查找.editorconfig文件
root = true

[*]
# 设置缩进风格(tab是硬缩进，space为软缩进)
indent_style = space
# 用一个整数定义的列数来设置缩进的宽度，如果indent_style为tab，则此属性默认为tab_width
indent_size = 2
# 设置换行符，值为lf、cr和crlf
end_of_line = lf
# 设置编码，值为latin1、utf-8、utf-8-bom、utf-16be和utf-16le，不建议使用utf-8-bom
charset = utf-8
# 设为true表示会去除换行行首的任意空白字符。
trim_trailing_whitespace = true
# 设为true表示使文件以一个空白行结尾
insert_final_newline = true
```

### 3.2 配置 IDE

#### webstorm配置如下：

![](../imgs/webstorm-editorconfig.png)

#### VS Code 配置

推荐文档（由李晋泽推荐）： https://blog.csdn.net/Gabriel_wei/article/details/90286668 

### 推荐文章

- [项目创建从 editorconfig 和 prettier 开始](https://juejin.im/post/6860440041039069191)
