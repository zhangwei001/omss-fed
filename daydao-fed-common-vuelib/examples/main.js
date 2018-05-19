/**
 * Created by zhangqi on 16/6/20.
 */
import 'babel-polyfill'; //添加浏览器es6部分特性支持
import App from './app.vue';
import aRouter from './router.js'
import 'commonVueLib/config/config.js'; //前端配置文件

// 开启debug模式
Vue.config.debug = true;

// 路由配置
const router = new VueRouter({
    routes: aRouter
});


window.vueObj = new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});


