const fs = require('fs');
const router = require('express').Router();

// 所有路由
fs.readdirSync(__dirname)
  .filter(file => /\.js/.test(file) && file !== 'router.js')
  .forEach(route => require(`./${route}`)(router));

module.exports = router;