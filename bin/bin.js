#! /usr/bin/env node
const program = require('commander');
const { spawn,exec } = require('child_process');
const {resolve} = require('path');
const package = require('../package.json');
const fs = require( 'fs' );
const log = console.log;
const install = require('./install.js');
const switchFn =  require('./inquirer.js');
const option = require('./option.js');
const createFile = require('./createFile');
const logSymbols = require('log-symbols');
const transfromLang = require('./transfromLang');

const spawnCommand = (...args) => {
    return new Promise((resole, reject) => {
      const childProcess = spawn(...args,{ shell: true });
      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);
      childProcess.on('close', () => {
        resole();
      })
    })
}

program.version(package.version, '-v, --version');

program.command('run <sheet>')
.description('启动编译项目')
.option('-d,--development','开发环境',false)
.option('-p,--production','生产环境',false)
.action((sheet,option) => {
    
    if(sheet === 'dev'){
        const mode = option.production ? 'production' : 'development';
        spawnCommand(`cross-env NODE_ENV=development webpack server --config webpack/webpack.config.js --mode=${mode}`)
    }else if(sheet === 'build'){
        const mode = option.development ? 'development' : 'production';
        spawnCommand(`cross-env NODE_ENV=production webpack --config webpack/webpack.config.js --mode=${mode}`)
    }else{
        log(logSymbols.error,'无效指令！');
    }

});

program.command('init <project>')
.alias('i')  //简称
.description('创建项目 <project>项目名称')
.option('-c,--current','是否当前目录',false)
.action((project,option) => {

    if(!/^[0-9a-zA-Z]*$/g.test(project)){
        return log(logSymbols.error,'只能是数字或字母!');
    }

    switchFn(function (setting) {
        //创建文件
        createFile(setting,project,option.current);
        //安装依赖
        install(project,setting,option.current);
    });

    // log('process.cwd()',process.cwd());
    // log('__dirname',__dirname);
    // log('process.execPath',process.execPath);
    // log("resolve(__dirname,'../')",resolve(__dirname,'../'))
    //return;
});

program.command('lang <template> <type...>')  //lang zh-CN en de ja  lib l template zh-CH ja -e / -o ppp
.alias('l')  //简称
.description('转换语言 template-模板文件名 type-语言类型可传多个')
.option('-o,--output [path]','输出地址目录','lang')
.option('-e,--entry [path]','引入模板目录','/')
.action((template,type,option) => {

    const rootPath = process.cwd();

    //模板json
    const tempPath = `${rootPath}/${option.entry}/${template}.json`;
    let tempJson;
    try {
        tempJson = fs.readFileSync(tempPath);
    } catch (error) {
        log(logSymbols.error,'找不到语言模板文件!');
        return;
    };
    
    //创建文件
    const langcatal = rootPath + `/src/${option.output}`;
    if(!fs.existsSync(langcatal)){
        fs.mkdirSync(langcatal);
    }

    type.forEach((t)=>{

        const langJson = JSON.parse(tempJson);
        const PromiseList = [];

        dg(langJson,t,PromiseList);

        Promise.all(PromiseList).then(()=>{
            fs.writeFileSync (`${langcatal}/${t}.json`, JSON.stringify(langJson,null, 4), 'utf8');
        })

    });

    function dg(obj,t,PromiseList){
        for(let k in obj){
            const item = obj[k];
            if( Object.prototype.toString.call(item) === '[object Object]'){

                dg(item,t,PromiseList)
            }else if(Array.isArray(item)){
                item.forEach((v,i)=>{
                    PromiseList.push(transfromLang(v,t).then((s)=>{
                        item[i] = s;
                    }))
                })
            }else{
                PromiseList.push(transfromLang(item,t).then((s)=>{
                    obj[k] = s;
                }))
            }
        }
    }
});

program.parse(process.argv);

