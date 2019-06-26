const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

function checkoutInput() {
  let projectName = process.argv[2];

  const quitLog = msg => {
    console.log(chalk.red(msg));
    process.exit(1);
  };

  if (!projectName) {
    quitLog(
      `\n[Error] 未检测到模块名称, 请输入: npm run ${process.env.npm_lifecycle_event} <module-name>\n`
    );
  }

  let projectPath = path.resolve(__dirname, '../client', projectName);

  if (!fs.existsSync(projectPath)) {
    quitLog(`\n[Error] 指定的项目不存在: ${projectPath}`);
  }

  return {
    projectName,
    projectPath,
  };
}


function checkoutBranch() {
  // 应避免直接在以下分支开发
  const FORBIDAN_BRANCHES = ['master', 'simulation', 'release'];

  return new Promise((resolve, reject) => {
    child_process
      .exec(`git symbolic-ref --short -q HEAD`)
      .stdout.on('data', branchName => {
        if (FORBIDAN_BRANCHES.indexOf(branchName.trim()) > -1) {
          console.log(chalk.yellow(`\n[Warn] 注意当前分支是: ${branchName}`));

          const questions = [{
            type: "input",
            name: "answer",
            message: "仍要继续吗(Y/N)? "
          }];

          inquirer.prompt(questions).then(input => input.answer.toUpperCase() === 'Y' ? resolve(true) : reject());
        }
    });
  }).catch(() => process.exit(1));
}

module.exports = {
  checkoutInput,
  checkoutBranch,
};