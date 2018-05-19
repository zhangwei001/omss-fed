<template>
    <commom-main>
        <div slot="content">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </commom-main>
</template>

<script type="text/babel">
    import commomMain from 'commonVueLib/commMain/index.js';

    export default {
        name: 'App'
        ,components:{
            commomMain
        }
        ,created() {
            var t = this;
            gMain.components.commonHeader.handleShowLeftMenu(true); // 显示公共左侧菜单
        }
    }
</script>
