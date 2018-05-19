<template>
    <div>
        <h1>
            art-dialog弹窗
        </h1>
        <button @click="show">弹出</button>
    </div>
</template>
<script>
    import dialog from 'commonVueLib/artDialog/index.js';
    export default {
        mounted(){

        }
        ,methods:{
            show(){
                var t = this;
                var d = dialog({
                    title: '设置表头字段',
                    isShowFullScreenBtn:true,
                    content: `
                        <div>很多内容 <br> <input autofocus />
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                            <p>撒打发斯蒂芬</p>
                        </div>
                    `,
                    width:800,
                    /*render:function (h,params) {
                        return h('div',{
                            on:{
                                click:function () {
                                    alert(1);
                                }
                            }
                        },'aaa');
                    },*/
                    ok:function () {

                    },
                    cancel:function () {

                    }
                });
                d.showModal();
            }
        }
    }
</script>
