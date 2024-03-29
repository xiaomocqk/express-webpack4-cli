const webpack = require('webpack');
const ora = require('ora');
const chalk = require('chalk');
const webpackConfig = require('../webpack.config');

const spinner = ora(chalk.cyan('Now building...\n'));

spinner.start();
webpack(webpackConfig, (err, stats) => {
  spinner.stop();

  if (err) throw err;

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n');
});