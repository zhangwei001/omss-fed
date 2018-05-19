<!-- 

 @description 拉下组件

 @props value {Boolean} 控制显示隐藏于
 @props bindEl {Array} 绑定的el ID , 用于控制是否隐藏, id 内的元素点击不隐藏

 -->

<template>
    <div 
    :class="['hs-slide-down' , 'clearfix' , {active:show}]" 
    :style="[{maxHeight:maxHeight}, {display:display}]"
    v-clickoutside="handleClose"
    >
        <slot></slot>
    </div>

</template>

<script>
    import clickoutside from './directives/clickoutside';
    export default {
        directives:{clickoutside},
        data() {
            return {
                maxHeight:'0px',
                display:'none',
                show : false
            }
        },
        props: {
           value:{
                type : Boolean,
                default : false
            },
            bindEl:{
                type : Array,
                default(){
                    return [];
                }
            }
        },
        watch: {
            value(val){
                if (val) {
                    let h =  window.innerHeigh || document.body.clientHeight;
                    this.maxHeight = `${h -174}px`;
                    this.display = 'block';
                    setTimeout(_=>{this.show = true;},10);
                }else{
                    this.maxHeight = '0px';
                    this.show = false;
                    setTimeout(_=>{this.display = 'none';},100);
                }
            }
        },
        methods: {
            handleClose(){
                this.$emit('input' , false);    
            }
        }
        
    }

</script>

<style lang="scss">
    $preCls : '.hs-slide-down';

    .newHighSearch{
        #{$preCls} {
            position: absolute;
            left: 0;
            top:50px;
            z-index: 10;
            max-height: 0px;
            transition: all .3s ease;
            opacity:0;
            overflow: hidden;
            width: 100%;

            &.active {
                overflow: visible;
                opacity:1;
                box-shadow:2px 2px 7px rgba(0, 0, 0, 0.23);
                overflow-y:auto;
            }


            .close{
                cursor: pointer;
                font-size: 18px;
            }
        }

    }
</style>
