/**
 * Created by zhangxixi on 2021/5/25.
 */
const { spawn, exec } = require("child_process");
const logSymbols = require("log-symbols");
const ora = require("ora");
const log = console.log;

const spawnCommand = (shell, cwd) => {
  return new Promise((resole, reject) => {
    const childProcess = spawn(shell, { shell: true, cwd });
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    childProcess.on("close", (data) => {
      resole(data);
    });
    childProcess.stderr.on("data", function (data) {
      reject(data);
    });
    childProcess.stdout.on("data", function (data) {
        console.log(logSymbols.info,data);
    });
  });
};

module.exports = function (name, { styleType, fun },isCu) {
  const rootPath = process.cwd() + '/' + (isCu ? '' : name);

  log(logSymbols.info, "开始安装依赖");
  const spinner = ora();
  spinner.color = "yellow";
  spinner.text = "安装中";
  spinner.start();

  let shellList = [
    "cross-env",
    "compression-webpack-plugin",
    "copy-webpack-plugin",
    "css-loader",
    "css-minimizer-webpack-plugin",
    "file-loader",
    "html-loader",
    "html-webpack-plugin",
    "mini-css-extract-plugin",
    "babel-loader",
    "@babel/core",
    "postcss-loader",
    "postcss-preset-env",
    "style-loader",
    "url-loader",
    "webpack",
    "webpack-cli",
    "webpack-dev-server",
    "thread-loader",
    "@xiui/lib-cli",
    "@xiui/webpack-plugin-notes"
  ];

  if (fun.includes("TypeScript")) {
    shellList.push("ts-loader", "typescript");
  }

  if (fun.includes("Babel")) {
    //'core-js@2','core-js@3'
    shellList.push(
      "@babel/plugin-transform-runtime",
      "@babel/preset-env",
      "@babel/runtime",
      "@babel/runtime-corejs2",
      "@babel/runtime-corejs3"
    );
  }

  if (fun.includes("css Pre-processors")) {
    shellList.push(
      `${styleType}-loader`,
      styleType === "sass" ? "node-sass" : styleType
    );
  }

  if (fun.includes("PWA")) {
    shellList.push("workbox-webpack-plugin");
  }

  if (fun.includes("ESlint")) {
    shellList.push("eslint-webpack-plugin", "eslint");
    if(fun.includes('TypeScript')){
      shellList.push('@typescript-eslint/parser', '@typescript-eslint/eslint-plugin')
    }
  }

  const childProcess = exec(`npm i ${shellList.join(' ')} -D`,{ cwd: rootPath }, function(error, stdout, stderr) {
      if(error){
          log(logSymbols.error,'安装失败！' + error);
          return;
      }

      spinner.stop();
      log(logSymbols.success,'安装完成');
      log(`${(isCu ? '' : ('cd ' + name))} implement npm run dev or npm run build`);
  })
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);

//   spawnCommand(`npm i ${shellList.join(" ")} -D`, process.cwd() + "/" + name)
//     .then(() => {
//       spinner.stop();
//       log(logSymbols.success, "安装完成");
//       log(`cd ${name} implement npm run dev or npm run build`);
//     })
//     .catch((error) => {
//       spinner.stop();
//       log(logSymbols.error, "安装失败！" + error);
//     });
};
