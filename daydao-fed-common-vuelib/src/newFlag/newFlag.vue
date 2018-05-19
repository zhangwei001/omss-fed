<style lang="scss">
    $prefixCls:'new-flag'; /*样式前缀*/

    .#{$prefixCls}{
        display: inline-block;
        vertical-align: middle;
        position: relative;

        &-text{
            position: absolute;
            font-size: 12px;
            top: 6px;
            right: -21px;
            z-index: 10;
        }

        .global{
            color: #ffffff;
        }

        .red{
            color: #FF0004;
        }
    }
</style>

<template>
    <span :class="[prefixCls]" @click="flagClick">
        <slot></slot>
        <i :class="['iconfont_daydao_common', prefixCls + '-text', theme]" v-if="show" :style="oNewStyle">&#xe642;</i>
    </span>
</template>

<script>
    export default {
        name: 'newFlag',
        props: {
            /**
             * 主题：
             *  global: 默认的
             *  red:    红色的
             */
            theme: {
                type: String,
                default: 'global'
            },
            /**
             * 位置
             * top:    右上角
             * right:  右边
             */
            position: {
                type: String,
                default: 'top'
            },
            /**
             * 是否显示new标签
             */
            show: {
                type: Boolean,
                default: true
            },
            //图标的样式
            oNewStyle:{
                type:Object
            }
        },
        data(){
            return {
                prefixCls:'new-flag'  //样式前缀
            };
        },
        methods: {
            flagClick(){
                this.$emit('click');
            }
        },
    }
</script>
