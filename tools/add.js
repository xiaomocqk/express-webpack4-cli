const fs = require('fs');
const { resolve } = require('path');
const chalk = require('chalk');

const { clientPath, routesPath } = require('../config/base.config.js');
const newProjectName = process.argv.slice(-1)[0];
// const newProjectCamelCaseName = newProjectName.replace(/(-|_)\w/g, match => match[1].toUpperCase());
const clientTargetPath = resolve(clientPath, newProjectName);
const routeFile = resolve(routesPath, `${newProjectName}.js`);

let log = {
  green: msg => console.log(chalk.green(msg)),
  yellow: msg => console.log(chalk.yellow(msg)),
  red: msg => console.log(chalk.red(msg)),
  magenta: msg => console.log(chalk.magenta(msg)),
};


if (fs.existsSync(clientTargetPath)) {
  log.yellow(`[Fail] ${resolve(clientTargetPath)} has already existed.`);
} else if(fs.existsSync(routeFile)){
  log.yellow(`[Fail] ${resolve(routeFile)} has already existed.`);
} else {
  log.green(`[Info] Directories and files has been created:`);
  createDir();
  createDir('js');
  createDir('views');
  createDir('styles');
  createDir('images');

  createFiles();
}

function createDir(dirname = '') {
  const path = resolve(clientTargetPath, dirname);
  fs.mkdirSync(path);
  log.green(`   + ${path}`);
}

function createFiles() {
  const jsfile = resolve(clientTargetPath, 'js', 'index.js');
  const htmlfile = resolve(clientTargetPath, 'views', 'index.html');
  const cssfile = resolve(clientTargetPath, 'styles', 'index.less');
  const jsContent = "import '../styles/index';";
  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${newProjectName}</title>
</head>
<body>
  ${newProjectName}
</body>
</html>`;

  fs.writeFileSync(jsfile, jsContent);
  fs.writeFileSync(htmlfile, htmlContent);
  fs.writeFileSync(cssfile, '');

  fs.writeFileSync(routeFile,
`const { prefix } = require('../../config/base.config');

module.exports = router => {
  router.get('/${newProjectName}/', (req, res) => {
    res.render(\`\${prefix}${newProjectName}/index\`);
  });
};`);

  log.green(`   + ${jsfile}`);
  log.green(`   + ${htmlfile}`);
  log.green(`   + ${cssfile}`) + '\n';
  log.green(`   + ${routeFile}`) + '\n';

  log.magenta(`[Tips] Now run "npm run dev ${newProjectName}" to start your project.`);
}