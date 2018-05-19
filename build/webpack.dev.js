/**
 * webpack开发环境配置
 */

var webpack = require('webpack')
var merge = require('webpack-merge');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var baseWebpackConfig = require('./webpack.base');

var config = require('./config')
var env = process.env.NODE_ENV === 'production' ? 'pro' : 'dev';
var envConfig = config[env]; //当前环境的配置

module.exports = merge(baseWebpackConfig, {
    devtool: '#cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname, `../dist`),
        filename: path.posix.join(envConfig.basePath, 'js/[name].js'),
        chunkFilename: path.posix.join(envConfig.basePath, 'js/[name].js'),
        publicPath: envConfig.publicPath,
        hotUpdateMainFilename: path.posix.join(envConfig.basePath, 'js/[hash].hot-update.json'),
        hotUpdateChunkFilename: path.posix.join(envConfig.basePath, 'js/[id].[hash].hot-update.js')
    },
    devServer: {
        compress: true,
        port: 9000,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
        },
        host:'dev.daydao.com',
        proxy: {
            // '/api/*': {
            //     target: 'https://hr.daydao.com',
            //     changeOrigin: true,
            //     secure: false,
            //     pathRewrite: {'^/api': ''}
            // }
        },
        historyApiFallback: true,
        inline: true,
        noInfo: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),

        //在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
        new webpack.NoEmitOnErrorsPlugin(),

        ////友好的错误提示
        new FriendlyErrorsPlugin(),

        //html生产插件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            iviewPath:envConfig.publicPath + envConfig.iviewPath, //view组件的路径
            vueVersion:"vue2.js",
            inject: "body"
        })
    ]
})


