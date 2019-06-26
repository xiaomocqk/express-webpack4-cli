module.exports = {
  "extends": "eslint:recommended",
  "root": true,
  "parser": "babel-eslint",// 需先安装 npm install babel-eslint -g
  "env": {
    "amd": true,
    "es6": true,
    "browser": true,
    "node": true
  },
  "rules": {
    "no-var": "warn",
    "no-unused-vars": "warn",
    "eqeqeq": "warn",
    "semi": "warn",
    "no-console": "off",
    "no-alert": "warn",
    "no-undef": "warn",
    "no-else-return": "warn", // 禁止 if 语句中 return 语句之后有 else 块
    "radix": "warn", // 强制在parseInt()使用基数参数
    "no-mixed-spaces-and-tabs": "warn",
    "no-missing-end-of-source-newline": 0,
  },
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",// 支持export及import
  }
};