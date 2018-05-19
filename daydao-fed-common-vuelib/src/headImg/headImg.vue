<style lang="scss">
    $prefixCls:'daydao-head-img';

    .#{$prefixCls}{
        display: inline-block;
        vertical-align: middle;

        &-headwrap{
            width:100px;
            height:100px;
            border-radius: 50%;
            position: relative;
            color:#fff;
            font-size: 16px;
            overflow: hidden;
        }
        &-pic{

        }
        &-text{
            text-align: center;
            position: absolute;
            width:100%;
            height:100%;
            left:0;
            top:0;
        }
    }
</style>
<template>
    <div :class="[prefixCls]">
        <div :class="[prefixCls + '-headwrap']" :style="{backgroundColor:bgColor, width:width + 'px', height:height + 'px'}">
            <img v-if="imgUrl" :class="[prefixCls + '-pic']" :src="imgUrl" :alt="personName" :style="{backgroundColor:bgColor, width:width + 'px', height:height + 'px'}">
            <div v-else :class="[prefixCls + '-text']" :style="{fontSize:fontSize + 'px',lineHeight:height + 'px'}">{{personName.substr(-2)}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            //头像地址
            imgUrl:{
                type:String
            }
            //用户id
            ,personId:{
                type:[String,Number]
                ,default:'100000001'
                ,required:true
            }
            //用户名称
            ,personName:{
                type:String
                ,default:'未知'
                ,required:true
            }
            //头像字体大小
            ,fontSize:{
                type:Number
            }
            //宽度
            ,width:{
                type:Number
                ,default:100
            }
            //高度
            ,height:{
                type:Number
                ,default:100
            }
        }
        ,data(){
            var t = this;
            return{
                 prefixCls:'daydao-head-img'
                ,aColors:["#FF8585","#FFA35D","#F2BA3D","#DD8CED","#9999FA","#62D0B7","#85ADF3","#A8D17B"] //八种头像配色
            }
        }
        ,computed:{
            bgColor(){
                var t = this;
                var sPersonId = t.personId;
                var sColor = t.aColors[parseInt(sPersonId)%8];
                return sColor;
            }
        }
    }
</script>