const fs = require( 'fs' );
const {resolve} = require('path');
const rmdirSync = require('./rmdirSync');

const BabelOption = `
                                    options: {
                                        presets: [["@babel/preset-env", { useBuiltIns: "usage" }]],
                                        plugins: [["@babel/plugin-transform-runtime", { corejs: false }]],
                                        cacheDirectory: true,
                                    },
`;
const tsLoader = function (isBabel) {
    const str = isBabel ? `{
                            loader: 'babel-loader',
                            options: {
                                presets: [["@babel/preset-env", { useBuiltIns: "usage" }]],
                                plugins: [["@babel/plugin-transform-runtime", { corejs: false }]],
                                cacheDirectory: true,
                            },
                        },
` : '';

    return `
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: [${str}'ts-loader']
                    },`;
};
const cssSuffixMap = {
    less: 'less',
    stylus: 'styl',
    sass: 'scss',
    css: 'css'
};
const cssLoader = function(type){
    const cssTest = {
        less: 'less',
        stylus: 'styl',
        sass: '(sass|scss)'
    };
    return `
                    {
                        test: /\.${cssTest[type]}$/,
                        use: [
                            ...commonCssLoader,
                            '${type}-loader'
                        ]
                    },
    `
};

const pwaPlugin = `
        if(isProduction){
            plugins.push(
                new WorkboxWebpackPlugin.GenerateSW({
                    clientsClaim: true,
                    skipWaiting: true
                })
            )
        }
`;

const serviceWorkerJS = `
window.addEventListener('load', () => {
    navigator.serviceWorker
    .register('/service-worker.js')
    .then(() => {
        console.log('sw注册成功了~');
    })
    .catch(() => {
        console.log('sw注册失败了~');
    });
});
`;

module.exports = function(setting,name,isCu){
    const isBabel = setting.fun.includes('Babel');
    const isTs = setting.fun.includes('TypeScript');
    const isCssPre = setting.fun.includes('css Pre-processors');
    const isPwa = setting.fun.includes('PWA');
    const isEslint = setting.fun.includes('ESlint');

    const rootPath = process.cwd() + '/' + (isCu ? '' : name);
    const cliPath = resolve(__dirname,'../');
    const jsSuffix = isTs ? 'ts' : 'js';
    const cssSuffix = cssSuffixMap[setting.styleType || 'css'];
    const matchMap = {
        project: name,
        jsType: jsSuffix,
        libraryTarget: setting.libraryTarget,
        babel: isBabel ? BabelOption : '',
        tsLoader: isTs ? tsLoader(isBabel) : '',
        cssType: setting.styleType,
        cssLoader: isCssPre ? cssLoader(setting.styleType) : '',
        requirePwa: isPwa ? "const WorkboxWebpackPlugin = require('workbox-webpack-plugin');" : '',
        pwaPlugin: isPwa ? pwaPlugin : '',
        requireEslint: isEslint ? "const ESLintPlugin = require('eslint-webpack-plugin');" : '',
        eslintPlugin: isEslint ?  `new ESLintPlugin({extensions: '${jsSuffix}', fix: true}),` : '',
        cssSuffix: cssSuffix,
        serviceWorkerJS: isPwa ? serviceWorkerJS : '',
        esExtends: isTs ? '"plugin:@typescript-eslint/recommended"' : '',
        esParser: isTs ? '@typescript-eslint/parser' : '',
        esPlugins:  isTs ? '"@typescript-eslint"' : ''
    };

    //创建检测是否存在
    if(!isCu){
        if(fs.existsSync(rootPath)){
            rmdirSync(rootPath);
            fs.mkdirSync(rootPath);
        }else{
            fs.mkdirSync(rootPath);
        }
    }

    /* package */
    const package = JSON.parse(fs.readFileSync(`${cliPath}/template/package.json`));
    package.name = name;
    fs.writeFileSync (`${rootPath}/package.json`, JSON.stringify(package,null, 4), 'utf8');

    /* src */
    
    const srcipt = fs.readFileSync(`${cliPath}/template/src/index.${jsSuffix}`,"utf-8").toString();
   
    fs.mkdirSync(rootPath + '/src');
    const newSrcipt = srcipt.replace(/{{(\w+)}}/g, function(match, $1) {
        return matchMap[$1]
    });

    fs.writeFileSync(`${rootPath}/src/index.${jsSuffix}`,newSrcipt);

    const sheetStyle = fs.readFileSync(`${cliPath}/template/src/index.css`,"utf-8");
    fs.writeFileSync(`${rootPath}/src/index.${cssSuffix}`,sheetStyle);

    if(isTs){
        fs.copyFile(`${cliPath}/template/tsconfig.json`,`${rootPath}/tsconfig.json`,function(err){
            // if(err) console.log('拉取tsconfig资源失败')
            // else console.log('拉取tsconfig资源成功');
        })
    };

    if(isEslint){
        const eslintrc = fs.readFileSync(`${cliPath}/template/.eslintrc.js`,"utf-8").toString();
        const newEslintrc = eslintrc.replace(/{{(\w+)}}/g, function(match, $1) {
            return matchMap[$1]
        });
        fs.writeFileSync(`${rootPath}/.eslintrc.js`,newEslintrc);
    };

    //i18n
    if(setting.fun.includes('i18n')){
        fs.mkdirSync(rootPath + '/src/lang');
    
    };

    /* webpack */

    fs.mkdirSync(rootPath + '/webpack');
    //读取config文件
    const webpackConfig = fs.readFileSync(`${cliPath}/template/webpack/webpack.config.js`,"utf-8").toString();
    const newWebpack = webpackConfig.replace(/{{(\w+)}}/g, function(match, $1) {
        return matchMap[$1];
    });
    fs.writeFileSync(`${rootPath}/webpack/webpack.config.js`,newWebpack)
    fs.copyFile(`${cliPath}/template/webpack/lib.config.js`,`${rootPath}/webpack/lib.config.js`,function(err){
        // if(err) console.log('拉取webpack资源失败')
        // else console.log('拉取webpack资源成功');
    })
    //变量
    fs.writeFileSync (`${rootPath}/webpack/env.development.json`, JSON.stringify({},null, 4), 'utf8');
    fs.writeFileSync (`${rootPath}/webpack/env.production.json`, JSON.stringify({},null, 4), 'utf8');

    /* public */
    fs.mkdirSync(rootPath + '/public');
    fs.copyFile(`${cliPath}/template/public/public.css`,`${rootPath}/public/public.css`,function(err){
        // if(err) console.log('拉取public资源失败')
        // else console.log('拉取public资源成功');
    })

    /* html */
    fs.copyFile(`${cliPath}/template/index.html`,`${rootPath}/index.html`,function(err){
        // if(err) console.log('拉取html资源失败')
        // else console.log('拉取html资源成功');
    })

}