/**
 * Created by zhangxixi on 2021/5/27.
 */

const inquirer = require('inquirer');

const funList = {
    type: "checkbox",
    message: "选择该项目需要的功能:",
    name: "fun",
    choices: [
        {
            name: "css Pre-processors",
            checked: true
        },
        {
            name: "Babel",
            checked: false
        },
        {
            name: "TypeScript",
            checked: false
        },
        {
            name: "PWA",
            checked: false
        },
        {
            name: "ESlint",
            checked: false
        },
        {
            name: "i18n",
            checked: false
        }
    ],
    pageSize: 6 // 设置行数
};

const cssList = {
    type: 'list',
    message: '请选择一种css编译器:',
    name: 'styleType',
    default:'Less',
    choices: [
        "less",
        "stylus",
        "sass"
    ],
}

//暴漏方式
const moduleOption = {
    type: 'list',
    message: '请选择库暴露方式:',
    name: 'libraryTarget',
    default:'umd',
    choices: [
        "umd",
        "amd",
        "jsonp",
        "window",
        "commonjs",
        "module",
    ],
};

module.exports = function (callback) {
    inquirer.prompt([moduleOption,funList]).then((answers)=>{
        if(answers.fun.includes('css Pre-processors')){
            inquirer.prompt([cssList]).then((answers2)=>{
                callback(Object.assign(answers,answers2))
            })
        }else{
            callback(Object.assign(answers,{styleType:'css'}))
        }
    })
}
