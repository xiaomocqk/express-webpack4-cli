const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const dev_ = 'dev_';

module.exports = {
  port: 8080,
  isDev,
  clientPath: path.resolve(__dirname, '../client'),
  outputPath: path.resolve(__dirname, '../server/public'),
  routesPath: path.resolve(__dirname, '../server/routes'),
  cdn: isDev ? '' : '//static.seeyouyima.com/nodejs-common',
  prefix: isDev ? dev_ : '',
  dev_,
};