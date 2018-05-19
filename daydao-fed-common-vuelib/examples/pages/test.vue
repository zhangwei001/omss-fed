<style lang="scss">
    $fontSize:20px;

    .test{
        font-size: $fontSize;

        a{
            color: red;
        }
    }

</style>
<template>
    <div class="test" style="width: 300px;">
        测试组件

        <router-link to="/test">呵呵链接</router-link>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                value11: '',
                value12: '',
                value13: '',
                select1: 'http',
                select2: 'com',
                select3: 'day',
                autofocus: true
            }
        }
    }
</script>
