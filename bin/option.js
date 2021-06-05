/**
 * Created by zhangxixi on 2021/5/27.
 */
module.exports = {
    //部署应用包时的基本 URL
    publicPath: './',
    //打包地址
    outputDir: 'build',
    //是否启用Gzip
    gzip:true,
    //插件
    plugins:[],
    //loader
    rules:[],
    css:{
        type: 'css',
        //是否分离css
        separateCss: false,
        //压缩
        compress: false,
        //兼容处理
        postcss: true,
        //输出目录 css/
        outputPath:''
    },
    js:{
        type: 'js',
        //是否添加babel-polyfill
        polyfill:false,
        // 生产环境是否生成 sourceMap 文件
        productionSourceMap: true,
        //压缩
        compress: true,
        //输出目录  js/
        outputPath:''
    },
    img:{
        //打包图片大小
        limit: 4 * 1024,
        //输出目录
        outputPath:'img/'
    }
};