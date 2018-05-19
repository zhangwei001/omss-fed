<template>
    <div class="change_table_card">
        <span class="iconfont_daydao_common table" :class="{'current':showStyle=='table'}" @click="changeStatus('table')">&#xe6b3;</span>
        <span class="iconfont_daydao_common card" :class="{'current':showStyle=='card'}" @click="changeStatus('card')">&#xe6b1;</span>
    </div>
</template>

<style lang="scss" scoped>
    .change_table_card{
        width: 60px;
        height: 30px;
        border: 1px solid #D7DDE4;
        border-radius: 2px;
        overflow: hidden;
        position: relative;

        span{
            font-size: 18px;
            display: inline-block;
            width: 30px;
            text-align: center;
            height: 30px;
            line-height: 26px;
            cursor: pointer;
            border-radius: 2px;
        }
        span.table{
            position: absolute;
            left:0px;
            top:0;
        }
        span.card{
            position: absolute;
            right:0px;
            top:0;
        }
        span.current{
            background: #F18950;
            color:#fff;
            width:30px;
        }
        span.table.current{
            left: 0;
        }
        span.card.current{
            right: 0;
        }
    }

</style>

<script>

    export default{
        name:"changeTableCard"
        ,props:{
            showStyle:{
                type:String
                ,default:"table"
            }
        }
        ,data(){
            return {

            }
        }
        ,methods:{
            changeStatus:function (status) {
                this.$emit("afterChange",status);
            }
        }
    }

</script>
