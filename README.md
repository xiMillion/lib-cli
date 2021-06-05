# 一个基于webpack5 快速搭建js库的cli

在做一个js库 使用webpack开发 需要做很多繁琐配置，比如Babel、TypeScript、Css 预编译等等，或对于新人来讲上手吃力，不好配置，本CLI 解决这些问题，通过简单配置就可以快速开发。

## 功能

+ 基于最新的webpack5，更快的速度优化
+ 支持Babel 可配置 polyfill
+ 集成TypeScript配置
+ 可选 Less、Sass、Stylus 预编译语言
+ 支持 Service Workers 
+ 支持 ESlint，TypeScript也集成
+ 支持 i8n，可生成其他语言包
+ 支持模板变量，可在项目内使用


## 兼容性  

ie9+ &nbsp;&nbsp; nodejs 12.5+    

## 快速使用

安装
<code>
&nbsp;npm i @xiui/lib-cli -g
</code>

使用
<code>
&nbsp;lib init app
</code>  


经过一系列配置  cd app npm run dev  就可以开发了

## 进阶

### 创建项目    
<code>lib init \<project\> [--current]</code>
<pre>
  lib init app
  lib init app --current
</pre>

init 可简写 i ，project 为创建的目录名称,--current或-c 代表本目录下创建项目


### 运行&打包
<code> lib run \<sheet\> [--development] [--production] </code>
<pre>
  lib run dev
  lib run build
  lib run build --development
</pre>

--development --production 代表webpack环境，简写 -d -p 设置命令的环境


### 转换语言包   
通过一个写好的语言作为模板生成不同语言json
<code>lib lang \<template\> \<type...\> [--output] [--entry]</code>

在项目根目录下创建 template.json 文件，配置中文，或英文 模板
执行命令  
<pre> lib lang template zh-CN en de ja </pre>
这时 src 目录下多出lang文件夹，下面有中文，英文，日文语言包

template 语言模板包名称
type 转换的语言 可配多个  
--output或-o 可配置输出地址默认lang  <code>lib lang template zh-CN en -o langs</code>  
--entry或-e 可配置入口地址默认根目录  <code>lib lang template zh-CN en -e src/template </code>


### 环境变量
在项目 webpack 目录下有两个 dev json文件，在运行不同环境下，会将当前的变量注入到全局中，可在项目中使用   
默认有两个 
“process.env.NODE_ENV”  -- 当前环境
“process.env.BASEURL”   -- webpack配置的publicPath


### webpack配置
webpack下还有个lib.config.js 用来快捷配置一些功能，例如代码压缩，打包地址目录等等，如果不满足修改同级的webpack.config.js文件