const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { clientPath, routesPath } = require('../config/base.config.js');

const resolve = (...dir) => path.resolve(__dirname, ...dir);
const newProjectName = process.argv.slice(-1)[0];
const newProjectCamelCaseName = newProjectName.replace(/(-|_)\w/g, match => match[1].toUpperCase());
const clientTargetPath = resolve(clientPath, newProjectName);
const routeFile = resolve(routesPath, `${newProjectName}.js`);

if (fs.existsSync(clientTargetPath)) {
  console.log(chalk.yellow(`[Fail] ${resolve(clientTargetPath)} has already existed.`));
} else if(fs.existsSync(routeFile)){
  console.log(chalk.yellow(`[Fail] ${resolve(routeFile)} has already existed.`));
} else {
  console.log(chalk.green(`[Info] Directories and files has been created:`));
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
  console.log(chalk.green(`   + ${path}`));
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
  router.get('/${newProjectCamelCaseName}/', (req, res) => {
    res.render(\`\${prefix}${newProjectName}/index\`);
  });
};`);

  console.log(chalk.green(`   + ${jsfile}`));
  console.log(chalk.green(`   + ${htmlfile}`));
  console.log(chalk.green(`   + ${cssfile}`) + '\n');
  console.log(chalk.green(`   + ${routeFile}`) + '\n');

  console.log(chalk.magenta(`[Tips] Now run "npm run dev ${newProjectName}" to start your project.`));
}