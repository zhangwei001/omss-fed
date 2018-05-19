<template>
    <div class="column-box" :class="[typeClass,{'delete-column-box':isDel},{'newest-column-box':newest}]" :key="typeClass">
        <div class="column-box-header">
            {{columnTitle}}
            <span class="column-action-box" v-if="isActionShow">
                <button class="column-action-btn" v-for="(item,$index) in switchBtns" :class="[{'column-switch-current-btn':type===item},'column-switch-'+item+'-btn']" @click="switchColumnBox(index,id,item)"></button>
                <button class="column-action-btn column-del-btn el-icon-close iconfont_daydao_common" @click.stop="deleteColumnBox($event,id)">&#xe6a6;</button>
            </span>
        </div>
        <div class="column-box-body">
            <component :is="columnComponent"></component>
        </div>
    </div>
</template>
<style lang="scss">
    @import "../sass/mixin.scss";

    .column-box-small,
    .column-box-primary,
    .column-box-big {
        background: #fff;
        height: 300px;
        margin: 5px;
        box-sizing: border-box;
    }

    .column-box-small {
        @include box-flex(0 0 -webkit-calc(100%/3 - 10px));
        @include box-flex(0 0 -moz-calc(100%/3 - 10px));
        @include box-flex(0 0 calc(100%/3 - 10px));
    }

    .column-box-primary {
        @include box-flex(0 0 -webkit-calc(100%*2/3 - 10px));
        @include box-flex(0 0 -moz-calc(100%*2/3 - 10px));
        @include box-flex(0 0 calc(100%*2/3 - 10px));
    }

    .column-box-big {
        @include box-flex(0 0 calc(100% - 10px));
    }

    .column-box-header {
        text-align: right;
    }

    .column-action-box {
        display: inline-block;
        padding: 5px 10px;
    }

    .column-action-btn {
        background: none;
        border: none;
        display: inline-block;
        width: 30px;
        height: 12px;
        vertical-align: middle;
        cursor: pointer;
        margin: 0 2px;
    }

    .column-switch-small-btn,
    .column-switch-primary-btn,
    .column-switch-big-btn {
        border: 1px solid #666;
        background: #fff;
    }

    .column-switch-current-btn {
        background: #666;
    }

    .column-switch-small-btn {
        width: 25px;
    }

    .column-switch-primary-btn {
        width: 35px;
    }

    .column-switch-big-btn {
        width: 45px;
    }

    .column-del-btn {
        padding: 0;
        color: #999;
        width: 14px;
        height: 14px;
        margin-left: 5px;
        vertical-align: -4px;
    }
    .delete-column-box{
        opacity: 0;
        transition: all 1s linear;
    }
    .column-box-body{
        height: 100%;
        overflow: auto;
    }
    .newest-column-box{
        animation: neweseAnimate 1s linear 3;
    }
    @keyframes neweseAnimate{
        0%{
            background: #fff;
        }
        50%{
            background: #fbdbc7;
        }
        100%{
            background: #fff;
        }
    }
</style>
<script>
    export default {
        props: {
            column:Object,
            columnComponent:Object
        },
        watch:{
            column:{
                handler: function(n,v) {
                    this.index = n.index;
                    this.id = n.id;
                    this.type = n.type;
                    this.columnTitle = n.columnTitle;
                    this.columnThumn = n.columnThumn;
                    this.actionshow = n.actionshow;
                    this.disabledSwitchSize = n.disabledSwitchSize;
                    this.newest = n.newest;
                },
                deep: true
            },
        },
        data: function () {
            return {
                id:this.column.id || 0,
                type: this.column.type || "small",
                columnTitle:this.column.columnTitle || "",
                columnThumn:this.column.columnThumn || "",
                actionshow:this.column.actionshow || false,
                disabledSwitchSize:this.column.disabledSwitchSize,
                index:this.column.index || 0,   //模块的索引，用于找到模块
                isCurrent: false,
                isDel:false,
                newest:this.column.newest
            }
        },
        computed: {
            typeClass: function () {
                return {
                    "column-box-small": this.type === "small",
                    "column-box-primary": this.type === "primary",
                    "column-box-big": this.type === "big"
                }
            },
            isActionShow:function(){
                var t = this;
                return t.actionshow && !this.disabledSwitchSize.includes(this.type)
            },
            switchBtns:function(){
                var btns = ["small","primary","big"];
                var self = this;
                return btns.filter(function(item,index){
                    return !self.disabledSwitchSize.includes(item);
                })
            }
        },
        methods: {
            switchColumnBox: function (index,id,type) {
                this.type = type;
                this.$emit("switchColumnBox",index,id,type);
            },
            deleteColumnBox:function($event,id){
                this.id = id;
                this.isDel = true;
                this.$emit("deleteColumnBox",$event,id);
            }
        }
    }
</script>