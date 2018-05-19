<template>
    <div>
        <h1>头像</h1>
        <br>
        <head-img :person-id="3569255" :person-name="'张三锋'" :img-url="''" :width="50" :height="50" :font-size="12"></head-img>

        哈撒打发斯蒂芬
    </div>
</template>
<script>
    import headImg from 'src/headImg/index.js'
    export default {
        components:{
            headImg
        }
    }
</script>