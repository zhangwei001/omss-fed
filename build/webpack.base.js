/**
 * webpack基础配置
 */
var cssLoader = require('./css-loader');
var path = require('path');
var config = require('./config');
var env = process.env.NODE_ENV === 'production' ? 'pro' : 'dev';

var envConfig = config[env]; //当前环境的配置

var now = new Date()
var date = now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate();

module.exports = {
    entry: {
        app: './src/main.js'
    },
    externals: {
        'jquery': 'window.jQuery',
        "vue": "window.Vue"
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: [
            path.join(__dirname, '../src'),
            path.join(__dirname, '../node_modules'),
            path.join(__dirname, '../daydao-fed-common-vuelib/src')
        ],
        alias: {
            'src': path.join(__dirname, '../src'),
            'assets': path.join(__dirname, '../src/assets'),
            'pages': path.join(__dirname, '../src/pages'),
            'components': path.join(__dirname, '../src/components'),
            'commonVueLib': path.join(__dirname, '../daydao-fed-common-vuelib/src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: cssLoader.cssLoaders({
                        sourceMap: envConfig.sourceMap,
                        extract: envConfig.extract
                    }),
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 2 versions']
                        })
                    ]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [path.join(__dirname, '../node_modules')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join(envConfig.basePath, 'images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join(envConfig.basePath, 'fonts/[name].[hash:7].[ext]')
                }
            }
        ].concat(
            cssLoader.styleLoaders({
                sourceMap: envConfig.sourceMap,
                extract: envConfig.extract
            })
        )
    }
}

