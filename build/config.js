/**
 * 公共构建配置文件
 */
var path = require('path');
var basePath = 'static/hr_daydao_com/org';

module.exports = {
    dev: {
        basePath: basePath
        , publicPath: '/'
        , sourceMap: true
        , extract: false
        , iviewPath: 'daydao-fed-common-vuelib/src/iview2/'
    },
    pro: {
        basePath: basePath  //dist 静态资源输出目录
        , publicPath: '//static.daydao.com/'  //静态资源域名
        , sourceMap: true //是否启用调试sourceMap
        , extract: true //css提取
        , index: path.resolve(__dirname, '../dist/views/www_daydao_com/hr/org/index.html') //入口文输出的路径
        , iviewPath:basePath + '/lib/iview2/'
    }
}
