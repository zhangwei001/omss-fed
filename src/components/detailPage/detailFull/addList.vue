<style lang="scss">
.detail-block-box {
    position: relative;

    &:hover {

        .detaile-full-main-l-item-content-editbtn>i {
            display: inline-block;
        }
    }
}
</style>

<template>
    <!-- 新增 -->
    <section class="detaile-full-main-l-item detaile-full-main-l-item-more" :class="'detaile-full-main-l-item-'+ sectionItem.index">
        <h4>
            <em class="icon iconfont_daydao_common">&#xe615;</em>
            <span>{{sectionItem.title}}</span>
            <i class="icon iconfont_daydao_common" v-if="!addState" @click="addRowData">&#xe69e;</i>
        </h4>

        <list-template v-for="(blockItem, blockIndex) in sectionItem.data"
                            :key="blockItem.uuid"
                            :blockItemData="blockItem"
                            :blockIndexData="blockIndex"
                            :treeSelectData="treeSelectData"
                            @changeAddOptionEvent="changeAddOptionEvent"></list-template>
    </section>
</template>

<script>
import listTemplate from "./listTemplate.vue"; //表格列表
import { daydaoDropSelect, daydaoDropSelectMul } from 'commonVueLib/daydaoDropSelect/index'

export default {
    name: "addList",
    props: {
        addListData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    components: {
        daydaoDropSelect,
        listTemplate,
    },
    data() {
        return {
            sectionItem: {},
            treeSelectData: {}, // 下拉框数据对象
            addState: false, // 新增状态的标志
        }
    },
    created() {
        // copy 组件传过来的数据
        this.sectionItem = JSON.parse(JSON.stringify(this.addListData));

        // 初始化下拉框数据集
        this.initSelectTreeData();

        // 初始化表单数据和表单验证规则
        //this.formatFormAndRuleCustom();
    },
    methods: {
        /**
         * 初始化下拉框数据集
         */
        initSelectTreeData() {
            var _this = this;

            _this.sectionItem.addTemplate.data.forEach((item) => {
                // 非select、radio不执行下面逻辑
                if (!(item.cellType == 'treeSelect' || item.cellType == 'treeAdviceSelect' || item.cellType == 'radio')) return false;

                // 如果对应的的下拉选择infosetid有下拉框时，不执行下面的逻辑
                if (_this.treeSelectData[item.keyValueBean.infoSetId] && _this.treeSelectData[item.keyValueBean.infoSetId].length > 0) return false;

                // 为treeSelect\radio时，获取选项数据
                _this.getKeyValueData({
                    data: item.keyValueBean,
                    success: function(data) {
                        _this.treeSelectData[item.keyValueBean.infoSetId] = data.beans;  // 保存起来，方便之后不再重复请求下拉框数据
                        _this.treeSelectData = JSON.parse(JSON.stringify(_this.treeSelectData));    // 因为是对象，改变值时监听不到有所改变，所以用此种方法
                    }
                })
            })
        },
        /**
         * 新增
         */
        addRowData() {
            var _this = this,
                result = {};

            // 改变新增按钮状态
            _this.addState = !_this.addState;

            // 将新增模版数据push到数据数组中
            _this.sectionItem.data.unshift(JSON.parse(JSON.stringify(_this.sectionItem.addTemplate)));
        },
        /**
         * 自定义事件，于用改变新增按钮状态
         * type     传过来的类型，用于判断要执行哪种操作
         *      --btn      新增按钮标识
         *      --update   更新页面
         *      --add      新增
         *      --change   行数据更换编辑
         *      --undo     要还原为原有数据状态
         * index    改变所有编辑状态，并且当前index索引值的行数据为编辑状态
         */
        changeAddOptionEvent (type, index){
            var _this = this;
            if(type == 'btn'){
                // 改变新增按钮状态
                _this.addState = !_this.addState;
            }
            else if(type == 'update' || type == 'add'){
                // 刷新数据 或 新增数据
                _this.getDetailOptionData(type);
            }
            else if(type == 'undo'){
                // 还原编辑状态的数据
                _this.sectionItem.data[index] = findAddList();
                _this.sectionItem = JSON.parse(JSON.stringify(_this.sectionItem));

                /**
                 * 找到编辑状态前的数据
                 */
                function findAddList(){
                    var obj = {}
                    _this.addListData.data.forEach((item)=>{
                        if(item.uuid == _this.sectionItem.data[index].uuid) obj = item;
                    })

                    return obj;
                }
            }
            else if(type == 'change'){
                // 改变编辑行数据。如果有新增数据时，保存在一个变量中，然后将数据对象变为最初的数据，
                let result = '',
                    n = 0;    // 如果有新增，则保存在此变量
                _this.sectionItem.data.forEach((item)=>{
                    if(!item.uuid){
                        n++;
                        result = item;
                    }
                })

                _this.sectionItem = JSON.parse(JSON.stringify(_this.addListData));
                _this.sectionItem.data.forEach((item, sectionIndex) => {
                    if (!item.uuid) return false;   // 新增的数据不用改变
                    if (index - n == sectionIndex) {
                        item.isEdit = false;
                    }
                    else{
                        item.isEdit = true;
                    }
                })

                // 如果有新增数据，则放在数据的最前面
                if(result) _this.sectionItem.data.unshift(result);

                _this.sectionItem = JSON.parse(JSON.stringify(_this.sectionItem));
            }
        },

        /**
         * 获取下拉键值对
         * @options.data
         * @options.success
         * */
        getKeyValueData(options) {

            this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/getKeyValueData.do",
                data: JSON.stringify(options.data),
                success: function(data) {
                    if (data.result == "true") {
                        typeof options.success == "function" && options.success(data);
                    }
                }
            });
        },
        /**
         * 获取单个模版数据
         */
        getDetailOptionData(type) {
            var _this = this,
                oSendObj = {    // 请求子模块数据条件
                    infoSetId: _this.sectionItem.templateId,
                    editCondition: _this.$parent.editCondition
                };

            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/" + _this.sectionItem.templateId + "/getEditDataAndColumn.do",
                data: JSON.stringify(oSendObj),
                success: function(data) {

                    var dataBeans = data.beans[0];
                    var result = []
                    dataBeans.data.forEach(function(item) {
                        var arr = [];
                        dataBeans.columnEdit.forEach(function(columnItme) {

                            if (!columnItme.isEditShow) return;

                            if (columnItme.cellType == 'checkbox') {
                                // checkbox获取到的值（0或1）转换成布尔值。
                                arr.push({
                                    title: columnItme.title,
                                    name: columnItme.name,
                                    cellType: columnItme.cellType,
                                    keyValueBean: columnItme.keyValueBean,
                                    isMust: columnItme.isMust,
                                    regExpress: columnItme.regExpress,
                                    value: item[columnItme.name] == '1' ? true : false
                                })
                            }
                            else {
                                arr.push({
                                    title: columnItme.title,
                                    name: columnItme.name,
                                    cellType: columnItme.cellType,
                                    keyValueBean: columnItme.keyValueBean,
                                    isMust: columnItme.isMust,
                                    regExpress: columnItme.regExpress,
                                    value: item[columnItme.name] || ''
                                })
                            }
                        });

                        result.push({
                            isEdit: true,
                            uuid: item.uuid || '',
                            data: arr
                        });

                    })

                    _this.addListData.data = JSON.parse(JSON.stringify(result));

                    if(type == 'update'){
                        // 修改
                        // 如果原有数据有新增时，则将新增保留，并且其它数据更新
                        _this.sectionItem.data.forEach((item)=>{
                            if(!item.uuid){
                                result.unshift(item);
                            }
                        })
                    }
                    else if(type == 'add'){
                        // 新增
                    }

                    // 清空数据
                    _this.sectionItem.data = {};
                    _this.sectionItem = JSON.parse(JSON.stringify(_this.sectionItem));

                    // 解决新增的数据没有更新，导致选择框与编辑行数据里有冲突
                    setTimeout(function(){
                        _this.sectionItem.data = result;
                        _this.sectionItem = JSON.parse(JSON.stringify(_this.sectionItem));
                    })
                }
            })
        },
    },
    watch: {
        'addListData': {
            handler(newValue, oldValue) {
                this.sectionItem = JSON.parse(JSON.stringify(newValue));

                // 初始化下拉框数据集
                this.initSelectTreeData();
            },
            deep: true
        },
    },
}
</script>
