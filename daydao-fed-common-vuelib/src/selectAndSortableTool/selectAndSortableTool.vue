<style lang="scss">
    $prefixCls:'select-and-sortable-tool'; //样式前缀

    .#{$prefixCls}{
        width:100%;
        max-width: 1000px;
        padding:2px;
        position: relative;

        @mixin boxWidth{
            width:calc((100% - 30px)/2);
        }
        /*左侧待选*/
        &-left{
            float: left;
            @include boxWidth;

            /*列表*/
            ul{

                li{
                    overflow:hidden;
                    height:40px;
                    line-height: 40px;
                    cursor: pointer;

                    &:hover{
                        background: #f5f7f9;
                    }
                }
                .checkbox-item{
                    height:40px;
                    line-height: 40px;
                    margin-left:15px;
                }
                .ivu-checkbox-wrapper{
                    font-size: 14px;
                }
                .title-item{
                    margin-left:8px;
                }
            }
        }

        /*右侧已选*/
        &-right{
            float: right;
            @include boxWidth;

            ul{

                li{
                    height: 40px;
                    line-height:40px;
                    overflow: hidden;
                    cursor: pointer;
                    position: relative;

                    //拖动图标
                    .move-icon,.move-icon-frozen{
                        float: left;
                        width:30px;
                        height:40px;
                        text-align: center;
                        line-height:40px;
                    }
                    .title{
                        float: left;
                        width:calc(100% - 30px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    /*冻结按钮*/
                    .frozen-btn-wrap{
                        position: absolute;
                        right: 10px;
                        top:0;
                        height:100%;
                        width:88px;
                    }
                    .frozen-btn{
                        position: absolute;
                        top: 50%;
                        right: 10px;
                        margin-top: -12px;
                    }
                    //鼠标移入的
                    &:hover{
                        border:1px dashed #9CA8B6;
                        line-height:38px;
                    }
                    //正在被拖拽的
                    &.sortable-chosen{
                        background: rgba(255,248,197,0.50);
                        border: none;
                    }
                    &.sortable-drag{
                        border: none;
                    }
                    //冻结的
                    &.is-frozen{
                        background: #f7f7f7;
                        cursor: not-allowed;
                        //鼠标移入的
                        &:hover{
                            border:none;
                            line-height:40px;
                        }

                        .iconfont_daydao_common,.title{
                            opacity: 0.5;
                        }
                    }
                }

                &.is-moving{
                    li{
                        border: none;
                    }
                }
            }
        }

        /*容器头部*/
        &-head{
            height: 32px;
            line-height: 32px;

            h1{
                float: left;
                font-size: 14px;
                color: #657180;
                font-weight: 600;
            }
            .remark{
                float: right;
                font-size: 12px;
                color: #657180;
            }
        }

        /*列表*/
        &-listbox{
            width:100%;
            height:400px;
            background: #FFFFFF;
            border: 1px solid #E3E8EE;
            overflow-x: hidden;
            overflow-y: auto;
        }

        /*全选*/
        &-select-all{
            width:100%;
            border: 1px solid #E3E8EE;
            border-bottom:none;
            height:40px;
            line-height: 40px;
            padding-left:15px;
        }
    }
</style>
<template>
    <div :class="[prefixCls,'clearfix']">

        <div :class="[prefixCls + '-left']">
            <div :class="[prefixCls + '-head']">
                <h1>未选</h1>
                <span class="remark"></span>
            </div>
            <div :class="[prefixCls + '-select-all']">
                <Checkbox v-model="isSelectAll" @on-change="changeSelecAllValue"><span>全选</span></Checkbox>
            </div>
            <div :class="[prefixCls + '-listbox']" style="border-top:none;height: 360px;">
                <ul>
                    <li v-for="item in aAllData" @click="clickLeftItem(item,$event)">
                        <div class="checkbox-item">
                            <Checkbox v-model="item.isListShow" @on-change="changeCheckBoxValue" :disabled="!!item.isFrozen || !!item.isLock"><span class="title-item">{{item.title}}</span></Checkbox>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div :class="[prefixCls + '-right']">
            <div :class="[prefixCls + '-head']">
                <h1>已选</h1>
                <span class="remark">单击移除{{isSort?'，拖动图标排列顺序':''}}</span>
            </div>
            <div :class="[prefixCls + '-listbox',prefixCls + '-drag-list']">
                <draggable element="ul" :list='aResultData' :options="{animation: 150,handle:'.move-icon',filter:isSort?'':'li'}" :move="handleOnMove" @start="handleStartDrag" @end="handleEndDrag">
                    <li v-for="item in aResultData" @click="removeData($event,item)" :class="[{'is-frozen':item.isFrozen}]">
                        <span :class="[{'move-icon':!item.isFrozen},{'move-icon-frozen':item.isFrozen}, 'iconfont_daydao_common']" :style="{cursor:(isSort && !item.isFrozen)?'move':''}">&#xe625;</span>
                        <span class="title">{{item.title}}</span>

                        <div class="frozen-btn-wrap" v-if="isSetFrozen && !item.isLock">
                            <Button :class="'frozen-btn'" size="small" @click="sortFrozenData(item,!!item.isFrozen)">{{item.isFrozen?'取消冻结':'冻结'}}</Button>
                        </div>
                    </li>
                </draggable>
            </div>
        </div>

    </div>
</template>
<script>
    import draggable from '../vuedraggable/vuedraggable.js';
    var _ = require('../utils/underscore.js')._; //工具库

    export default {
        components: {
            draggable
        }
        ,props:{
            //待选得列
            aColumns:{
                type:Array
            }
            //是否可拖拽排序
            ,isSort:{
                type:Boolean
                ,default:false
            }
            //是否可操作冻结
            ,isSetFrozen:{
                type:Boolean
                ,default:false
            }
        }
        ,data(){
            var t = this;
            return {
                prefixCls:'select-and-sortable-tool'  //样式前缀
                ,aAllData:t.formatData(t.aColumns) //左侧准备数据
                ,aResultData:[] //右侧已选数据
                ,isSelectAll:false //是否全选
            }
        }
        ,watch:{
            //左侧数据选中状态监控,赋值给右边的选中的
            aAllData(val,old){
                var t = this;
                if(val.length){
                    t.aResultData = [];
                    var isHasListHide = false; //是否有隐藏的项
                    val.forEach(function(item){
                        //固定现实的,锁定的也必显示
                        if(item.isFrozen){
                            item.isListShow = true;
                        }
                        if(item.isListShow){
                            t.aResultData.push(item);
                        }else{
                            isHasListHide = true;
                        }
                    });
                    //如果有隐藏的
                    if(isHasListHide){
                        t.isSelectAll = false;
                    }else{
                        t.isSelectAll = true;
                    }
                }
            }
        }
        ,created(){
            var t = this;
            t.aAllData = t.formatData(t.aColumns);
        }
        ,methods:{
            /**
             * 格式化数据
             * */
            formatData(arr){
                var t = this;
                var aNew = []; //处理过后的数据
                var aAfterSort = []; //处理并排序之后的数据
                if(Array.isArray(arr) && arr.length){
                    arr.forEach(function (item) {
                        if(item.isLock){
                            item.isFrozen = true;
                        }
                        //过滤掉isHidden为true的数据，它为深度隐藏
                        if(!item.isHidden){
                            item.isListShow = item.isListShow || false;

                            //冻结的就固定显示
                            if(item.isFrozen){
                                item.isListShow = true;
                            }
                            aNew.push(item);
                        }
                    });

                    //排序，frozen的排在前面
                    aNew.forEach(function (item) {
                        if(item.isFrozen){
                            aAfterSort.push(item);
                        }
                    });
                    //非frozen的排在后面
                    aNew.forEach(function (item) {
                        if(!item.isFrozen){
                            aAfterSort.push(item);
                        }
                    });

                }
                return aAfterSort;
            }
            /**
             * 操作复选框
             * */
            ,changeCheckBoxValue(status,event){
                this.aAllData = JSON.parse(JSON.stringify(this.aAllData));
            }
            /**
             * 左侧项目的点击
             * */
            ,clickLeftItem(item,$event){
                var t = this;
                if(!$($event.target).closest('.ivu-checkbox-wrapper').length){
                    item.isListShow = !item.isListShow;
                    t.changeCheckBoxValue();
                }
            }
            /**
             * 移除数据
             * */
            ,removeData($event,item){
                var t = this;
                if(!$($event.target).hasClass('move-icon') && !$($event.target).closest('.frozen-btn-wrap').length){
                    t.aAllData.forEach(function (item2) {
                        if(item.name === item2.name){
                            item.isListShow = false;
                        }
                    });
                    t.aAllData = JSON.parse(JSON.stringify(t.aAllData));
                    t.isSelectAll = false;
                }
            }
            /**
             * 拖拽移动，阻止拖拽判断
             * */
            ,handleOnMove(evt){
                var t = this;
                var iCurrentFrozenIndex = _.findLastIndex(t.aAllData,{isFrozen:true}); //最后一个冻结列的位置
                if(evt.draggedContext.futureIndex <= iCurrentFrozenIndex){
                    return false;
                }
            }
            ,handleStartDrag(){
                var t = this;
                $(t.$el).find("." + t.prefixCls + '-drag-list > ul').addClass('is-moving');
            }
            /**
             * 拖拽完成
             * */
            ,handleEndDrag(event){
                var t = this;
                $(t.$el).find("." + t.prefixCls + '-drag-list > ul').removeClass('is-moving');
                t.sortDragData(event);
            }
            /**
             * 全选状态
             * */
            ,changeSelecAllValue(val){
                var t = this;
                if(val){
                    t.aAllData.forEach(function (item) {
                        item.isListShow = true;
                    });
                }else{
                    t.aAllData.forEach(function (item) {
                        if(!item.isFrozen){
                            item.isListShow = false;
                        }
                    });
                }
                t.aAllData = JSON.parse(JSON.stringify(t.aAllData));
            }
            /**
             * 排序冻结数据
             * @param flag Boolean 当前的冻结状态
             * */
            ,sortFrozenData(item,flag){
                var t = this;
                //如果当前不是冻结的，变成冻结，并且排到前面去

                var iCurrentFrozenIndex = _.findLastIndex(t.aAllData,{isFrozen:true}); //最后一个冻结列的位置

                if(iCurrentFrozenIndex >= 4 && !flag){
                    t.$Message.warning("最多可设置5个冻结列");
                    return false;
                }

                var oCurrent = t.aAllData.find(function (item2) {
                    return item.name == item2.name;
                });
                oCurrent.isFrozen = !flag;
                var iCurrentIndex = t.aAllData.findIndex(function (item2) {
                    return item.name == item2.name;
                });
                t.aAllData.splice(iCurrentIndex,1);
                if(!flag){
                    t.aAllData.splice(iCurrentFrozenIndex + 1,0,oCurrent);
                }else{
                    t.aAllData.splice(iCurrentFrozenIndex,0,oCurrent);
                }
                t.aAllData = JSON.parse(JSON.stringify(t.aAllData)); //双向绑定
            }
            /**
             * 排序拖拽的数据
             * 判断当前项被拖拽在什么的后面，那么把左侧的也拖拽到它的后面
             * */
            ,sortDragData(event){
                var t = this;
                var oCurrent = t.aResultData[event.newIndex]; //拖拽后
                var oCurrentLeft = t.aAllData.find(function (item2) {
                    return oCurrent.name == item2.name;
                });
                var iCurrentLeft = t.aAllData.findIndex(function (item2) {
                    return oCurrent.name == item2.name;
                });

                //如果被拖拽到第0个的位置
                if(event.newIndex == 0){
                    t.aAllData.splice(iCurrentLeft,1); //从左侧的当前位置移除
                    t.aAllData.splice(0,0,oCurrentLeft); //插入到第一个位置
                }else{
                    var oPrev = t.aResultData[event.newIndex - 1]; //拖拽后前面的那个项目
                    t.aAllData.splice(iCurrentLeft,1); //从左侧的当前位置移除
                    //对应的左侧的前面那个项目
                    var iPrevLeft = t.aAllData.findIndex(function (item2) {
                        return oPrev.name == item2.name;
                    });
                    t.aAllData.splice(iPrevLeft + 1,0,oCurrentLeft); //插入到跟右侧一致前面的项目的后面
                }

                t.aAllData = JSON.parse(JSON.stringify(t.aAllData)); //双向绑定

            }

        }
    }
</script>
