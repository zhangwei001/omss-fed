<template>
    <div class="diy-column-tpl" :class="[isDiy ? isDiyClassName : '']">
        <button class="diy-column-btn" v-show="!isDiy" @click="startDiyColumn">
            <i class="iconfont_daydao_common icon-diy-column">&#xe68e;</i>
            <span class="diy-column-btn-text">自定义</span>
        </button>
        <transition 
            name="show-diy-column-box"
            @before-enter="showDiyColumnBeforeEnter"
            @enter="showDiyColumnEnter"
            @after-enter="showDiyColumnAfterEnter"
            @before-leave="showDiyColumnBeforeLeave"
            @leave="showDiyColumnLeave"
            @after-leave="showDiyColumnAfterLeave"
            v-bind:css="false"
        >
            <div class="diy-column-box" id="diyColumnBox" v-show="isDiy">
                <div class="diy-column-box-header"><button class="iconfont_daydao_common diy-column-cancel-btn" @click="cancelDiyEvent">&#xe6a6;</button>自定义</div>
                <div class="diy-column-box-body clearfix">
                    <draggable
                        :options="{
                            sort:false,
                            group:{
                                name:'drag',
                                put:true
                            },
                            animate:100
                        }"

                        v-model="diyColumns"
                        :move="columnsMove"
                        @start="startDrag"
                        @end="selectColumnEnd"
                    >
                        <a href="javascript:;" v-for="column in diyColumns" class="diy-column-item" :key="column.id">
                            <span class="diy-column-item-thumb"><img v-if="column.columnThumn" :src="column.columnThumn" alt=""></span>
                            <span class="diy-column-item-name" v-text="column.columnTitle"></span>
                        </a>
                        <a href="javascript:;" class="diy-column-item last-column-item"></a>
                    </draggable>
                </div>
                <div class="diy-column-box-footer">
                    <button class="diy-column-complete" @click="completeDiyColumn">完成</button>
                </div>
            </div>
        </transition>
            <draggable class="select-column-size"
                 v-if="isSelectColumn"
                 :style="{'right':width}"
                :options="{
                            sort:false,
                            group:{
                                name:'drag'
                            }
                        }"
            >
            <div class="select-column-type-box">
                <draggable v-if="isColumnDragSmall" class="select-column-type select-column-type--small" :class="{'select-column-type-active':selectColumnType=='small'}"
                    :options="{
                            sort:false,
                            group:{
                                name:'drag'
                            },
                            dataIdAttr:'small'
                        }">小模块</draggable>
                <draggable v-if="isColumnDragPrimary" class="select-column-type select-column-type--primary" :class="{'select-column-type-active':selectColumnType=='primary'}"
                    :options="{
                            sort:false,
                            group:{
                                name:'drag'
                            },
                            dataIdAttr:'primary'
                        }">大模块</draggable>
            </div>
            </draggable>
    </div>
</template>
<style lang="scss">
    .mask-box{
        background: rgba(0,0,0,0.5);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .diy-column-btn{
        background: #525565;
        border-radius: 50%;
        width: 72px;
        height: 72px;
        border: none;
        cursor: pointer;
        color: #fff;
        font-size: 20px;
        position: absolute;
    }
    .icon-diy-column{
        font-size: 21px
    }
    .diy-column-btn-text{
        font-size: 15px;
        display: block;
        margin-top: -4px;
    }
    .diy-column-init{
        width: 100%;
    }
    .diy-column-box{
        background: rgba(0,0,0,0.5);
        padding-top: 20px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        transform: translateX(125px);
    }
    .diy-column-box-header{
        color: #fff;
        padding: 0 15px;
        font-size: 14px;
    }
    .diy-column-cancel-btn{
        float: right;
        background: none;
        border: none;
        cursor: pointer;
        color: #fff;
        opacity: 0.5;
    }
    .diy-column-box-body{
        position: absolute;
        top: 50px;
        bottom: 30px;
        padding: 10px 10px;
        overflow-y: auto;
    }
    .diy-column-item{
        float: left;
        width: 45px;
        height: 75px;
        text-align: center;
        margin: 0 1px 10px;
    }
    .diy-column-item-thumb{
        display: block;
        background: #f00;
        width: 38px;
        height: 38px;
        margin: 0 auto;
        border-radius:5px;
    }
    .diy-column-item-name{
        display: block;
        text-align: center;
        color: #fff;
        margin-top: 10px;
        font-size: 14px;
    }
    .diy-column-box-footer{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .diy-column-complete{
        background: #999;
        color: #fff;
        width: 100%;
        height: 30px;
        border: none;
        cursor: pointer;
    }
    /*.show-diy-column-box-enter-active{*/
        /*animation:showDiyColumnEnter .5s linear;*/
    /*}*/
    /*.show-diy-column-box-leave-active{*/
        /*animation: showDiyColumnLeave .5s linear;*/
    /*}*/
    .select-column-size{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(255,255,255,0.5);
    }
    .select-column-type-box{width: 240px;height: 213px;position: absolute;top: 50%;margin-top: -150px;left: 50%;margin-left: -120px;}
    .select-column-type{display: block;padding: 30px 20px;background: #000;color: #fff;text-align: center;margin: 0 auto 50px;}
    .select-column-type--small{width: 100px;}
    .select-column-type--primary{width: 200px;}
    .select-column-type-active{opacity: 0.5;}
    .last-column-item{visibility: hidden;}
    @keyframes showDiyColumnEnter{
        0%{
            transform: translateX(100%);
        }
        100%{
            transform: translateX(0);
        }
    }
    @keyframes showDiyColumnLeave{
        0%{
            transform: translateX(0);
        }
        100%{
            transform: translateX(100%);
        }
    }
</style>
<script>
    import draggable from 'vuedraggable';
    export default {
        props:{
            "isDiyClass":{
                type:String,
                default:"diy-column-init"
            },
            "width":{
                type:String
            },
            columns:{
                type:Array,
                default:function(){
                    return [];
                }
            }
        },
        components: {
            draggable
        },
        data:function(){
            return {
                isDiy:false,
                isDiyClassName:this.isDiyClass,
                diyColumns:this.columns,
                selectColumnType:"",
                isSelectColumn:false,
                isColumnDragSmall:false,
                isColumnDragPrimary:false,
                currentDragColumn:null
            }
        },
        watch:{
            "columns":function(n,o){
                this.diyColumns = n;
            }
        },
        methods:{
            startDiyColumn:function(){
                this.isDiy = true;
                
                $("#diyColumnBox").off("animationend").on("animationend",function(){
                    console.log($(this).offset().left)
                })
                this.$emit("startDiyColumn");
            },
            completeDiyColumn:function(){
                this.isDiy = false;
                if($(".mask-box").length){
                    $(".mask-box").remove();
                }
                this.isColumnDragSmall = this.isColumnDragPrimary = false;
                this.$emit("completeDiyColumn");
            },
            startDrag:function(e){
                var index = parseInt(e.oldIndex);
                var types = this.diyColumns[index].types;
                this.currentDragColumn = this.diyColumns.splice(index,1)[0];
                this.isSelectColumn = true;
                this.isColumnDragSmall = types.includes("small");
                this.isColumnDragPrimary = types.includes("primary");
            },
            columnsMove:function(e){
                var vm = e.relatedContext.component;
                var dataIdAttr = vm.options.dataIdAttr;
                this.selectColumnType = dataIdAttr;
                return false;
            },
            selectColumnEnd:function(e){
                var selectColumnType = this.selectColumnType;
                var index = e.newIndex;
                this.currentDragColumn.type = selectColumnType;
                selectColumnType && this.$emit("selectColumnEnd",this.currentDragColumn) || this.diyColumns.splice(index,0,this.currentDragColumn);
                this.selectColumnType = "";
                this.isSelectColumn = false;
                this.isColumnDragSmall = this.isColumnDragPrimary = false;
                this.currentDragColumn = null;
            },
            cancelDiyEvent:function(){
                this.isDiy = false;
                this.$emit("cancelDiyEvent");
            },
            showDiyColumnBeforeEnter:function(el){
                this.$emit("showDiyColumnBeforeEnter",el)
            },
            showDiyColumnEnter:function(el,done){
                this.$emit("showDiyColumnEnter",el,done);
            },
            showDiyColumnAfterEnter:function(el){
                this.$emit("showDiyColumnAfterEnter",el);
            },
            showDiyColumnBeforeLeave:function(el){
                this.$emit("showDiyColumnBeforeLeave",el);
            },
            showDiyColumnLeave:function(el,done){
                this.$emit("showDiyColumnLeave",el,done);
            },
            showDiyColumnAfterLeave:function(el){
                this.$emit("showDiyColumnAfterLeave",el);
            }
        }
    }
</script>

