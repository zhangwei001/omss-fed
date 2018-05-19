/**
 * webpack生产环境配置
 */

var webpack = require('webpack');
var merge = require('webpack-merge');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin'); //生成js名和hash值对应的json文件
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseWebpackConfig = require('./webpack.base');
var config = require('./config');
var env = process.env.NODE_ENV === 'production' ? 'pro' : 'dev';
var envConfig = config[env]; //当前环境的配置
var oDate = new Date();
var sDate = oDate.getFullYear() +""+ (oDate.getMonth() +1) +""+ oDate.getDate() +""+ oDate.getHours() +""+ oDate.getMinutes() +""+ oDate.getSeconds() +""+ oDate.getMilliseconds();
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(baseWebpackConfig, {
    devtool: envConfig.sourceMap ? '#cheap-module-source-map' : false,
    output: {
        path: path.resolve(__dirname, `../dist`),
        filename: path.posix.join(envConfig.basePath, 'js/[name].[chunkhash].js'),
        chunkFilename: path.posix.join(envConfig.basePath, 'js/[name].[chunkhash].js'),
        publicPath: envConfig.publicPath,
        // libraryTarget:"amd",
        jsonpFunction: "daydaoJs",
    },
    plugins: [

        //配置全局环境为生产环境
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),


        //js文件压缩插件
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true, //去掉console日志
                drop_debugger:true //去掉debugger调试标记
            },
            sourceMap: true
        }),


        //将js中引入的css分离的插件
        new ExtractTextPlugin({
            filename: path.posix.join(envConfig.basePath, 'css/[name].[contenthash].css'),  //分离出的css文件名
            allChunks: true
        }),

        //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                discardComments: {removeAll: true},
                safe: true  // 避免 cssnano 重新计算 z-index
            }
        }),

        //分离公共js到vendor中
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) { // 声明公共的模块来自node_modules文件夹
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),

        //上面虽然已经分离了第三方库,每次修改编译都会改变vendor的hash值，导致浏览器缓存失效。原因是vendor包含了webpack在打包过程中会产生一些运行时代码，运行时代码中实际上保存了打包后的文件名。当修改业务代码时,业务代码的js文件的hash值必然会改变。一旦改变必然会导致vendor变化。vendor变化会导致其hash值变化。
        //下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        //复制文件
        new CopyWebpackPlugin([
            {from:path.resolve(__dirname, '../'+config.dev.iviewPath), to: path.resolve(__dirname, '../dist/'+config.pro.iviewPath) }
        ]),

        //生成html插件
        new HtmlWebpackPlugin({
            filename: envConfig.index,
            template: './src/index.html',
            inject: "body",
            sVersion:sDate,
            iviewPath:envConfig.publicPath + envConfig.iviewPath, //view组件的路径
            // 更多参数：https://github.com/kangax/html-minifier#options-quick-reference
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            vueVersion:"vue2.min.js",
            chunksSortMode: 'dependency'  //引入模块的排序方式
        }),

        //清理目录
        new CleanWebpackPlugin(['dist','zip'],{
            root : path.resolve(__dirname, '../'),
            verbose: true
        })

    ]
})


