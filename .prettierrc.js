module.exports = {
  printWidth: 120, //每行字数
  semi: false, // 结尾不加分号 `.vscode/settings.json` 的`prettier.semi`
  singleQuote: true, // 使用单引号 `.vscode/settings.json` 的`prettier.semi`
  trailingComma: 'all', //拖尾逗号
  bracketSpacing: true, //对象文本中括号之间的打印空格
  jsxBracketSameLine: true, //将多行 JSX 元素的 > 放在最后一行的末尾，而不是单独放在下一行(不适用于自关闭元素)。
  arrowParens: 'avoid', //在唯一的箭头函数参数周围包括括号
  insertPragma: false,
  tabWidth: 2,
  useTabs: false,
}
/* 更多配置请转至 https://prettier.io/docs/en/options.html */
