// artDialog - 默认配置
export default {

    /* -----已注释的配置继承自 popup.js，仍可以再这里重新定义它----- */

    // 对齐方式
    //align: 'bottom left',

    // 是否固定定位
    //fixed: false,

    // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
    //zIndex: 1024,

    // 设置遮罩背景颜色
    backdropBackground: 'rgb(55,55,55)',

    // 设置遮罩透明度
    backdropOpacity: 0.6,

    // 消息内容
    content: '<span class="art-ui-dialog-loading">Loading..</span>',

    // 标题
    title: '',

    //是否显示全屏按钮
    isShowFullScreenBtn:false,

    // 对话框状态栏区域 HTML 代码
    statusbar: '',

    // 自定义按钮
    button: null,

    // 确定按钮回调函数
    ok: null,

    // 取消按钮回调函数
    cancel: null,

    // 确定按钮文本
    okValue: '确定',

    // 取消按钮文本
    cancelValue: '取消',

    cancelDisplay: true,

    // 内容宽度
    width: '',

    // 内容高度
    height: '',

    // 内容与边界填充距离
    padding: '',

    // 对话框自定义 className
    skin: '',

    // 是否支持快捷关闭（点击遮罩层自动关闭）
    quickClose: false,

    // 模板（使用 table 解决 IE7 宽度自适应的 BUG）
    // js 使用 i="***" 属性识别结构，其余的均可自定义
    innerHTML: `
        <div i="dialog" class="art-ui-dialog"> 
            <div class="art-ui-dialog-arrow-a"></div> 
            <div class="art-ui-dialog-arrow-b"></div> 
            <table class="art-ui-dialog-grid"> 
                <tr> 
                    <td i="header" class="art-ui-dialog-header"> 
                        <button i="close" class="art-ui-dialog-close iconfont_daydao_common" title="关闭">&#xe6a6;</button> 
                        <div class="art-ui-dialog-fullscreen-btn iconfont_daydao_common" title="全屏" style="display: none;">&#xe620;</div>
                        <div i="title" class="art-ui-dialog-title"></div> 
                    </td> 
                </tr> 
                <tr> 
                    <td i="body" class="art-ui-dialog-body"> 
                        <div i="content" class="art-ui-dialog-content"></div> 
                    </td> 
                </tr> 
                <tr> 
                    <td i="footer" class="art-ui-dialog-footer"> 
                        <div i="statusbar" class="art-ui-dialog-statusbar"></div> 
                        <div i="button" class="art-ui-dialog-button"></div> 
                    </td> 
                </tr> 
            </table> 
        </div>`

};
