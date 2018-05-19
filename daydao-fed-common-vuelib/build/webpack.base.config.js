/**
 * 公共配置
 */
var path = require('path');
var cssLoader = require('./css-loader');
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    externals: {
        'jquery': 'window.jQuery',
        "vue": "window.Vue"
    },
    resolve: {
        extensions: ['.js', '.vue'],
        modules: [
            path.join(__dirname, '../src'),
            path.join(__dirname, '../node_modules')
        ],
        alias: {
            src: path.join(__dirname, '../src'),
            commonVueLib: path.join(__dirname, '../src'),
            assets: path.join(__dirname, '../src/assets')
        }
    },
    // 加载器
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: cssLoader.cssLoaders({
                        sourceMap: true,
                        extract: false
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
                    name: path.posix.join('', 'images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join('', 'fonts/[name].[hash:7].[ext]')
                }
            }
        ].concat(
            cssLoader.styleLoaders({
                sourceMap: true,
                extract: false
            })
        )
    }

};
