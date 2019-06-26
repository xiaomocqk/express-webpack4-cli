
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const ora = require('ora');
const chalk = require('chalk');

const spinner = ora(chalk.cyan('Now building...\n'));
const webpackConfig = require('../webpack.config');
const ip = require('../server/utils/ip.js');
const { port } = require('../config/base.config');
const { checkoutBranch } = require('./legality-checkout');

let projectName = process.env.PROJECT_NAME;

module.exports = async app => {
  await checkoutBranch();

  spinner.start();
  const compiler = webpack(webpackConfig);

  compiler.plugin('done', function(){
    setTimeout(() => {
      spinner.stop();
      console.log(chalk.bgGreen('\n √ Build done ') + '\n');
      console.log(chalk.magenta(`[Tips] visit: http://localhost:${port}/${projectName}/`));
      console.log(chalk.magenta(`            : http://${ip()}:${port}/${projectName}/`) + '\n');
    }, 0);
  });

  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    // html only
    writeToDisk: filePath => /\.html$/.test(filePath),
  });

  // express应用加入 webpack 构建
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
};