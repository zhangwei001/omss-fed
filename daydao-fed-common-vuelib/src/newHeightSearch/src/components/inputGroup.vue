<template>
    <div class="input-group clearfix">
            <!-- queryCondition -->
            <inputComponents :conditionList="cloneQueryCondition" ref="queryCondition"></inputComponents>

            <!-- customCondition -->
            <inputComponents :conditionList="customList" ref="customCondition"></inputComponents>
            

            
            <section class="hs-tpl-container">
                <div class="input-control">
                    <a class="hs-btn-add-filter" @click="isShowAddFilter=true">+ 添加更多筛选项</a>
                </div>
                <div :class="['input-control', {'ivu-form-item-error' : showError}]">
                    <Checkbox v-model="isSaveTpl" v-if="!noSearch">保存为模板</Checkbox>
                    <Input class="hs-input-text" v-if="isSaveTpl" v-model="templateName" placeholder="请输入模板名称"></Input>

                    <Input class="hs-input-text" v-if="noSearch" v-model="templateName" placeholder="请输入模板名称"></Input>
                </div>
                <div class="input-control" v-if="isSaveTpl || noSearch">
                    <Checkbox v-model="isDefault">设为默认</Checkbox>
                </div>
            </section>
            

            <div class="hs-button-group">
                <button class="btn" @click="search">{{btnText}}</button>
                <button class="btn btn-outline" @click="reset">重置</button>
            </div>

            <Modal 
                class="hs-addFilter-model addFilter"
                title="筛选项" 
                v-model="isShowAddFilter" 
                width="700" 
                ok-text="确定" 
                cancel-text="取消" 
                @on-ok="getAddList">
                <selectAndSortableTool :aColumns="addedList" isSort ref="addFilter"></selectAndSortableTool>
            </Modal>
            
    </div>
</template>

<script>
    import treeSelect from './inputComponent/treeSelect.vue'
    import treeMultipleSelect from './inputComponent/treeMultipleSelect.vue'
    import numberRange from './inputComponent/numberRange.vue'
    import selectAndSortableTool from '../../../selectAndSortableTool'
    import inputComponents from './inputComponents.vue'

    export default {
        components: { treeSelect, treeMultipleSelect ,numberRange , selectAndSortableTool , inputComponents},
        data() {

            return {

                isDefault:false,
                isSaveTpl: false,

                isShowAddFilter:false,



                //模板名称
                templateName:'',


                addedList: [],

                //用户自定义模板
                customList:[],

                showError:false,

                cloneQueryCondition:[],

            }
        },
        props: {
            queryCondition: {
                type: Array,
                default() {
                    return [];
                },
            },
            noSearch: {
                type: Boolean,
                default : false
            },
            columnEdit: {
                type: Array,
                default(){
                    return [];
                }
            },
            customSearch: {
                type: Object,
                default(){
                    return {};
                }
            },
            btnText: {
                type : String,
                default : '保存'
            },
        },
        created() {
            this.customSearchListHandler();
        },
        watch: {
            customSearch(val){
                this.customSearchListHandler();
            },
            templateName(val){
                this.showError = false;
            }
        },
        methods: {
            addedListHandler(){
                // 选项框里面的list
                this.addedList = this.columnEdit.map(item=>{
                    let obj = Object.assign({} , item);
                    obj.isFrozen = false;
                    obj.isListShow = false;

                    if (this.customSearch.datas) {
                        let isHave = this.customSearch.datas.find(custom=>custom.uuid === obj.uuid);
                        if (isHave) obj.isListShow = true;
                    }
                    return obj;
                })

            },
            customSearchListHandler(){
                this.addedListHandler();

                //处理默认值
                this.cloneQueryCondition = this.queryCondition.map(item=>{
                    if (item.conditionId === '746') {item.cellTypeId = 'originTree'}
                    return item
                });
                
                if (this.customSearch.isDefault && this.noSearch) {
                    this.isDefault = true;
                }

                if (this.customSearch.datas) {
                    if (this.noSearch) {
                        this.templateName = this.customSearch.name;
                    }
                    this.customList = [];
                    this.customSearch.datas.forEach(item=>{
                        if (item.type === 1) {
                            this.cloneQueryCondition.forEach((origin,index)=>{
                                if (origin.conditionId === item.conditionId) {
                                    origin = {...origin , value : item.value};
                                    this.$set(this.cloneQueryCondition , index , origin);
                                }
                            })
                        }
                        else if (item.type === 2) {
                            item.columnBean.value = item.value;
                            this.customList.push(item.columnBean);
                        }
                    })

                }
                
            },

            /*
            * 获取表单数据 , 并且返回
            */ 
            search() {

                let queryResult = this.$refs.queryCondition.searchDataHandler(),
                    customResult = this.$refs.customCondition.searchDataHandler();

                let search = queryResult.search.concat(customResult.search),
                    list   = queryResult.list.concat(customResult.list);

                let customSearch = {
                    isDefault : this.isDefault,
                    name : this.templateName,
                    isSaveTpl: this.isSaveTpl,
                    datas : list
                }

                if (this.isSaveTpl || this.noSearch) {
                    if (!this.templateName) {
                        this.$Message.warning('请输入模板名称');
                        this.showError = true;
                        return
                    }
                }

                this.$emit('getData' , search , customSearch);

                if (!this.noSearch) {
                    this.isSaveTpl = false;
                    this.isDefault = false;
                }
                

            },
            //添加筛选项
            getAddList(){
                let arr = this.$refs.addFilter.aResultData;

                this.customList = arr.map(item=>item);

            },
            reset(){
                this.$refs.queryCondition.reset();
                this.$refs.customCondition.reset();
            },
            removeCondition(condition){
                if (condition.conditionId) {
                    this.$refs.queryCondition.removeCondition(condition);
                }else{
                    this.$refs.customCondition.removeCondition(condition);
                }
                this.search();
            }

        }
    }

</script>






<style lang="scss">
    $preCls : '.hs';

    .newHighSearch {
        
        .separation{
            color : #d2d2d2;
        }
        .input-control {
            margin-bottom: 20px;
            margin-right: 10px;
            min-width: 295px;
        }
        .input-control label.name,
        .checkbox-group span {
            min-width: 88px;
            height: 32px;
            line-height: 32px;
            text-align: right;
            display: inline-block;
            font-size: 14px;
            margin-right:10px;
        }
        .pull-left label.name,
        .checkbox-group span{
            float: left;   
        }
        .input-control .hs-input-text {
            width: 280px;
            font-size: 12px;
            display: inline-block;
            position: relative;
        }
        .checkbox-group,
        .checkbox-group li {
            float: left;
        }
        .input-control .checkbox-control,
        .checkbox-group li label {
            width: auto;
        }
        .input-control .hs-checkbox-group,
        .input-control .hs-datePicker {
            display: inline-block;
        }


        #{$preCls} {
            &-button-group {
                display: flex;
                float: left;
                margin-left: 98px;

                .btn {
                    width: 60px;
                    height: 30px;
                    line-height: 30px;
                    background: #F18950;
                    border: 1px solid #F18950;
                    color: #fff;
                    border-radius: 2px;
                    cursor: pointer;
                }
                .btn-outline {
                    background: #fff;
                    border: 1px solid #D7DDE4;
                    color: #657180;
                }
                button.btn:first-child {
                    margin-right: 10px;
                }
            }

            &-btn-add-filter{
                color: #4B9FFA;
            }
        }

    }
</style>
