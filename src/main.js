import 'babel-polyfill'; //添加浏览器es6部分特性支持
import $ from "jquery";
import router from './router'; //路由
import store from 'src/store/store.js'; //公共状态管理
import Ajax from 'commonVueLib/Ajax/index.js'; //公共ajax
import 'commonVueLib/config/config.js'; //前端配置文件

//获取最新版本号
$.getScript(gMain.DayHRDomains.baseNoCdnDomain + "static/common/version.js",function () {
    /**
     * seajs配置信息
     */
    seajs.config({
        map: [[ /^(.*\.(?:css|js|html))(.*)$/i, '$1?v='+ sProjectVersion +'-'+gMain.verson]]  //加上版本号，清缓存用
    });

    /**
     * 加载依赖的公共ajax，公共工具库，这两个文件是seajs的风格写的
     * */
    seajs.use([
        "commonStaticDirectory/header_v3/index.js"
    ],function (commonHeader) {

        //页面顶部加载进度条的基本配置
        iview.LoadingBar.config({
            height: 3
            ,color:"#2d8cf0"
        });

        var vueRouter = new VueRouter({
            mode: 'history' // //去掉#号的模式hash(#),history(无#)
            ,base:"/hr/org"
        })
        //路由切换特效
        vueRouter.beforeEach(function (to, from, next) {
             // 表单处于编辑状态 ,在对应编辑页面 如果有编辑操作则调用 this.$store.commit("checkoutState/modifiedform",{isModified:true});
            if (store.state.checkoutState.isModifiedForm) {
                // 弹出提示框
                if (confirm("正在编辑表单，是否继续跳转其他页面？")) {
                    // 更改公共状态 isModifiedForm=false 默认值
                    store.commit("checkoutState/modifiedform", {
                        isModified: false
                    });
                    next();
                } else {
                    console.log("取消导航");
                    next(false);
                }
            } else {
                //正常跳转
                iview.LoadingBar.start(); //启动进度条
                document.title = to.meta.title || "理才网";
                next();
            }
        });
        vueRouter.afterEach(function (route) {
            iview.LoadingBar.finish(); //完成加载进度条
        });

        //通用工具的注入到vue中
        Vue.mixin({
            created: function () {
                this.$daydao = {
                    //公共ajax方法
                    $ajax:function (options) {
                        return Ajax.ajax(options);
                    }
                    ,$Ajax:Ajax
                }
            }
        });

        //所有api的请求前缀，开发模式和生产的代码前缀不一样，开发是跨域请求，生产代码是当前域请求
        gMain.apiPath = "/";
        //如果当前是webpack的开发模式
        if(process.env.NODE_ENV == "development"){
            gMain.apiPath = "https://www.daydao.com/";
        }
        gMain.apiBasePath = gMain.apiPath + "apiOrg/"; //当前模块的接口请求前缀
        gMain.projectSource = "dayhr"; //项目标识

        //入口app
        gMain.components.daydaoApp = new Vue({
            el:"#daydao_main_app",
            data:{
                spinShow: true
            },
            name:"daydaoApp",
            router:vueRouter,
            store:store,
            components:{
                "commonHeader" : commonHeader.default
            }
            ,methods:{
                /**
                 * 获取到用户信息之后再挂载路由
                 * */
                afterGetUserInfo:function (data) {

                    vueRouter.addRoutes(router);
                    this.spinShow = false; //取消屏幕遮罩
                }
            }
        });

    });
});
