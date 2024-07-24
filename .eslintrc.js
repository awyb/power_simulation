module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  // cx工程自定义
  globals: {
    appVue: 'writable',
    vm: 'writable',
    cx: 'writable',
    $g: 'writable',
    $app: 'writable',
    comCx: 'writable',
    plugCx: 'writable',
    cxe: 'writable'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    // cx工程自定义
    quotes: ['error', 'single', { allowTemplateLiterals: true }],        // 优先单引号
    'generator-star-spacing': 'off',                                     // 关闭-强制 generator 函数中 * 号周围有空格
    'no-undef': 'warn',                                                  // 未声明的变量，除非它们在 /*global */ 注释中被提到
    'no-new': 'warn',                                                    // 没把new的对象赋值到变量
    'no-tabs': 'off',                                                    // 关闭-tab键
    'spaced-comment': 'warn',                                              // 关闭-注释有一个空格
    indent: ['error', 2],                                                // 每行缩进空格数
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],           // 不能用多余的空格，且忽略行尾注释前的空格
    'brace-style': ['error', 'allman'],                                  // 函数的化括号独占一行
    semi: ['error', 'never'],                                            // 语句后面不显示分号
    'comma-spacing': ['error', { before: false, after: true }],          // 逗号前后的空格
    'no-trailing-spaces': ['error', { skipBlankLines: true }],           // 禁用行尾空格
    'no-array-constructor': 'error',                                     // 禁止使用数组构造器
    'no-new-object': 'error',                                            // 禁止使用new Object()
    'no-eval': 'off',                                                    // 关闭-禁止使用eval
    'keyword-spacing': ['error', { after: true }],                       // 关键字后面一个空格
    'no-multiple-empty-lines': [1, { max: 2 }],                          // 空行最多不能超过2行
    'space-before-function-paren': ['error', 'never'],                   // 函数的参数圆括号前面无空格
    curly: ['error', 'multi-or-nest'],                                   // if等只包含一条语句省虐大括号
    'block-scoped-var': 'error',                                         // 在块级作用域范围之内不能使用var
    'no-unneeded-ternary': 'off',                                        // 关闭-禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
    'prefer-const': 'off',                                               // 关闭-要求使用 const 声明那些声明后不再被修改的变量
    'one-var': 'off',                                                    // 每个作用域声明多个变量 ['error', {var: 'never', let: 'consecutive', const: 'never'}]
    'one-var-declaration-per-line': 'off',                               // 一行定义多个变量
    'no-template-curly-in-string': 'warn',                               // 禁止在常规字符串中出现模板字面量占位符语法
    'vue/multi-word-component-names': 'off'                              // 关闭组件命名规则
  }
}
  