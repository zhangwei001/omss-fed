<template>
    <div v-transfer-dom :data-transfer="transfer">
        <div :class="['page-slide' , {active : value}]" :style="{width:`${width}px`}">
            <h2 v-if="pageTitle"><span v-html="pageTitle"></span> <i class="iconfont_daydao_common close" @click="iconHideHandler">&#xe6a6;</i></h2>
            <slot></slot>
        </div>
        <div :class="['page-slide-cover' , {active : value}]" v-if="cover" @click="hide"></div>
    </div>


</template>


<style lang="scss">
    .page-slide{
        position: fixed;
        right:0;
        top:86px;
        width:660px;
        height:100%;
        height:calc(100% - 86px);
        background: #fff;
        z-index: 189;
        box-shadow: 0 0 12px 0 rgba(0,0,0,0.23);
        transform: translate3d(100%,0,0);
        transition: transform .25s ease;

        .page-slide{
            top:0;
            height :100%;  
        }

        .ivu-select-dropdown{
            position: absolute !important;
        }

        &.active{
            transform: translate3d(0,0,0);
        }
        h2{
            padding: 10px 18px;
            font-size: 18px;
            color: #657180;
            border-bottom: 1px solid #E9EAEC;
            font-weight: bold;
            position: relative;

            .close{
                position: absolute;
                right: 18px;
                cursor: pointer;
            }
        }


    }
    .page-slide-cover {
        position: fixed;
        width: 100%;
        height: 100%;
        left:0;
        top:46px;
        z-index: 188;
        display:none;
        opacity:0;

        &.active{
            display:block;
        }

    }
    .page-slide-overflow{
        height: 70%;
        height: calc(100% - 66px);
        height: -ms-calc(100% - 66px);
        height: -moz-calc(100% - 66px);
        overflow-y: auto;
        overflow-x: hidden;
    }

</style>
<script>
    import TransferDom from '../directives/transfer-dom';

    export default{
        name:"pageSlide",
        directives: { TransferDom },
        props:{
            value:{
                type:Boolean,
                default:false
            },
            cover:{
                type:Boolean,
                default:true
            },
            width:{
                type:[String , Number],
                default : 660
            },
            transfer: {
                type: Boolean,
                default: false
            },
            pageTitle: ''
        },
        methods:{
            hide(){
                this.$emit('input' , false);
            },
            iconHideHandler(){
                this.$emit('iconHideHandler');
                this.$emit('input' , false);
            }
        }

    }

</script>
