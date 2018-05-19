/**
* Created by fws on 2017/7/27.
*/
<template>
    <div class="column-function-points-box">
        <div class="column-function-points-header">
            <slot name="header"></slot>
        </div>
        <div class="column-function-points-body">
            <draggable
                 :options="{
                     sort:true,
                     group:{
                         name:'drag',
                         put:true
                     },
                     animate:100
                 }"
                 class="column-function-box clearfix"
                 v-model="dataColumnList"
            >
                <a href="javascript:;" v-for="(column,index) in dataColumnList" class="column-function-item" :key="column.id">
                    <span class="column-function-item-thumb"><img v-if="column.columnThumn" :src="column.columnThumn" alt=""></span>
                    <span class="column-function-item-name" v-text="column.columnTitle"></span>
                    <slot :name="'item-'+index"></slot>
                </a>
                <a href="javascript:;" class="column-function-item" id="lastColumnFunctionItem"></a>
            </draggable>
        </div>
        <div class="column-function-points-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<style lang="scss">
    .column-function-points-box{
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background: #525565;
        z-index:999;
    }
    .column-function-points-body{
        position: absolute;
        top:0;
        bottom:40px;
        left:0;
        right:0;
        padding-left:10px;
        padding-right:10px;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;
    }
    .column-function-box{
        padding-top:30px;
        padding-bottom:30px;
        width:106px;
        overflow: hidden;
    }
    .column-function-item{
        position: relative;
        float: left;
        width: 38px;
        height: 75px;
        text-align: center;
        margin-bottom:17px;
    }
    .column-function-item:nth-child(2n+1){
        margin-left:6px;
        margin-right:9px;
    }
    .column-function-item:nth-child(2n){
        margin-right:6px;
        margin-left:9px;
    }
    .column-function-item-thumb{
        display: block;
        background: #f00;
        width: 38px;
        height: 38px;
        margin: 0 auto;
        border-radius:5px;
    }
    .column-function-item-name{
        display: block;
        text-align: center;
        color: #fff;
        margin-top: 10px;
        font-size: 14px;
    }
    .column-function-points-footer{
        position: absolute;
        bottom: 0;
        left:0;
        right:0;
        color: #fff;
    }
</style>

<script>
    import draggable from 'vuedraggable';
    export default {
        props:{
            columnsList:{
                type: Array
            },
        },
        components: {
            draggable
        },
        data:function(){
            return {
                dataColumnList:this.columnsList,
            }
        },
        methods:{

        }
    }
</script>