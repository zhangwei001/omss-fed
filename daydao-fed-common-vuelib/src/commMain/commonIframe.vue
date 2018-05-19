<style lang="scss">
    #daydao_iframe_data_content{
        .iframe-pages{
            background: #fff;
        }
    }
</style>
<template>
    <div id="daydao_iframe_data_content">
        <div class="iframe-pages">
            <iframe width="100%" name="iframe-pages" id="iframe-pages" :style="{height:iHeight + 'px'}" frameborder="0" allowtransparency="true" :src="sUrl"></iframe>
        </div>
    </div>
</template>
<script>
    export default {
        name:"page"
        ,props:{
            sUrl:{
                type:String
                ,default:""
            }
        }
        ,data(){
            var t = this;
            return {

            }
        }

        ,created() {
            var t = this;
        }
        ,mounted(){
            var t = this;

            t.iHeight = $(window).height() - 92;
            $(window).resize(function () {
                t.iHeight = $(window).height() - 92;
            });

        }
        ,methods:{

        }

    }
</script>
