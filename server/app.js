
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const favicon = require('serve-favicon');
const router = require('./routes/router');
const { port, isDev } = require('../config/base.config');
const webpackDev = () => require('../tools/webpack.dev');

(async () => {
  const app = express();
  const PUBLIC_PATH = path.resolve(__dirname, 'public');

  app.engine('html', ejs.renderFile);
  app.set('views', PUBLIC_PATH);
  app.set('view engine', 'html');

  app.use(favicon(PUBLIC_PATH + '/favicon.ico'));

  // 本地开发环境
  if (isDev) await webpackDev()(app);

  // 全部业务路由
  app.use(router);

  app.get('/', (req, res) => {
    res.send('Welcome home page.');
  });

  app.get('*', (req, res) => {
    res.send(['404 Error!']);
  });
  
  app.listen(port, ()=>{
    console.log(`\n[Server] http://localhost:${port}/`);
  });
})();