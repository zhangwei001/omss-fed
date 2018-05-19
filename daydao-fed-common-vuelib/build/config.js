/**
 * 公共构建配置文件
 */
var path = require('path');

module.exports = {
    dev: {
        basePath:'/'
    },
    pro: {
        basePath: '../dist/static/common/plugins/iview2',  //dist 静态资源输出目录
        publicPath:"/dist/"
    }
}
