const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const dev_ = 'dev_';

module.exports = {
  port: 8080,
  isDev,
  outputPath: path.resolve(__dirname, '../server/public'),
  cdn: isDev ? '' : '//static.seeyouyima.com/nodejs-common',
  prefix: isDev ? dev_ : '',
  dev_,
};