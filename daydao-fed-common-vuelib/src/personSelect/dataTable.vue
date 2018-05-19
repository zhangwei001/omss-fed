<style lang="scss">
    $prefixCls:'select-data-table';

    /*数据表格*/
    .#{$prefixCls}-dataTable{
        font-size: 14px;

        thead{
            th{
                background-color: #f5f7f9;
                height: 37px;
                padding:0 10px;
            }
        }
        tbody{
            tr{
                &:hover{
                    background-color: rgb(245,247,249);
                }

                &.chkdisable{
                    cursor: not-allowed;
                }
            }
            td{
                height: 37px;
                border-bottom: 1px solid #e9eaec;
            }
        }
    }
    .#{$prefixCls}-dataTable-wrap{
        height:411px;
        overflow-y: auto;
        border:1px solid #e9eaec;
        border-top:none;
    }

    .#{$prefixCls}-data-td{

    }
    .#{$prefixCls}-data-item{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding:0 10px;
    }


</style>
<template>
    <div>
        <table :class="[prefixCls + '-dataTable']" :style="{width:'100%',border:'1px solid #e9eaec'}">
            <colgroup>
                <col v-for="item in aColumns" :width="item.width  || iEmptyWidth">
            </colgroup>
            <thead>
                <tr>
                    <th v-for="item in aColumns" :width="item.width">
                        <div v-if="item.type == 'selection'" style="text-align: center">
                            <template v-if="selectType == 'mul'">
                                <Checkbox v-model="valueCheckAll" @on-change="changeAllValue"><span style="display: none;">Checkbox</span></Checkbox>
                            </template>
                            <template v-else>
                                <span>单选</span>
                            </template>
                        </div>
                        <div v-else>
                            {{item.title}}
                        </div>
                    </th>
                </tr>
            </thead>
        </table>
        <div :class="[prefixCls + '-dataTable-wrap']">
            <table :class="[prefixCls + '-dataTable']" :style="{width:'100%'}">
                <colgroup>
                    <col v-for="item2 in aColumns" :width="item2.width || iEmptyWidth">
                </colgroup>
                <tbody>
                    <tr v-for="(item,index1) in aData" @click="onRowClick($event,item)" :class="{chkdisable:!!item.chkdisable}">
                        <td v-for="item2 in aColumns" :class="[prefixCls + '-data-td']">
                            <div v-if="item2.type == 'selection'" :style="{textAlign:'center',width:item2.width?(item2.width+'px'):''}">
                                <!--多选-->
                                <template v-if="selectType == 'mul'">
                                    <!--此处用chkdisable == 'true',判断是否为空即可-->
                                    <Checkbox v-model="item.selectStatus" @on-change="changeValue" :disabled="!!item.chkdisable"><span style="display: none;">Checkbox</span></Checkbox>
                                </template>
                                <!--单选-->
                                <template v-else>
                                    <Radio v-model="item.selectStatus" @on-change="changeValue" :disabled="!!item.chkdisable" :name="index1"><span style="display: none;">Radio</span></Radio>
                                </template>
                            </div>
                            <div :class="[prefixCls + '-data-item']" :title="item[item2.key]" :style="{width:item2.width?(item2.width+'px'):(iEmptyWidth+'px')}" v-else>
                                {{item[item2.key]}}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            //列的集合
            aColumns:{
                type:Array
                ,default(){
                    return [];
                }
            }
            //已选的数据
            ,aData:{
                type:Array
                ,default(){
                    return [];
                }
            }
            //选择模式，有单选和多选
            ,selectType:{
                type:String
                ,default:'mul'  //默认多选 ，单选为 ‘single’
            }
        }
        ,data(){
            return {
                prefixCls:"select-data-table"
                ,valueCheckAll:false
                ,iEmptyWidth:100
            };
        }
        ,watch:{
            aData(val,old){
                if (this.selectType === 'selection') {
                    this.valueCheckAll = false;
                }
            }
        }
        ,mounted(){
            var t = this;
            var sumWidth = $(t.$el).find('.'+t.prefixCls + '-dataTable-wrap').width();
            t.aColumns.forEach(function (item) {
                sumWidth = sumWidth - (item.width || 0);
            });
            t.iEmptyWidth = sumWidth - 10;
        }
        ,methods:{
            /**
             * 选中全部
             * */
            changeAllValue(status){
                console.log("changeAllValue:",status)
                var t = this;
                if(status){
                    t.aData.forEach(function (item,index) {
                        /*此处用chkdisable == 'true',判断是否为空即可*/
                        if(!item.chkdisable){
                            item.selectStatus = true;
                        }
                    })
                }else{
                    t.aData.forEach(function (item,index) {
                        item.selectStatus = false;
                    })
                }
                t.$emit("change-checked-val",JSON.parse(JSON.stringify(t.aData)));
            }
            /**
             * 改变单个的选中状态
             * */
            ,changeValue(status,event){
                var t = this;
                if(!status){
                    t.valueCheckAll = false;
                }

                //如果是单选就只能选择一个
                if(t.selectType === 'single'){
                    //先取消其他的
                    t.aData.forEach(function (item) {
                        item.selectStatus = false;
                    });
                    if(event.target.getAttribute('name')){
                        t.aData[parseInt(event.target.getAttribute('name'))].selectStatus = true;
                    }
                }

                t.$emit("change-checked-val",JSON.parse(JSON.stringify(t.aData)));
            }
            /**
             * 行的点击
             * */
            ,onRowClick($event,item){
                var t = this;
                //禁用的行不能 被点击
                if(($event.target.type === "checkbox" && $event.target.className === "ivu-checkbox-input") || $($event.target).closest('tr.chkdisable').length){
                    return false;
                }

                var bCurrentStatus = item.selectStatus;

                //如果是单选就只能选择一个
                if(t.selectType === 'single'){
                    //先取消其他的
                    t.aData.forEach(function (item) {
                        item.selectStatus = false;
                    });
                }

                item.selectStatus = !bCurrentStatus; //反选

                this.$emit('on-row-click',JSON.parse(JSON.stringify(item)));
                t.$emit("change-checked-val",JSON.parse(JSON.stringify(t.aData)));
            }
        }
    }
</script>
