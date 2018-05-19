
<style lang="scss">
.show_tab_transition {
    //transition: all .2s ease-in-out;
    transform: rotate(180deg);
}

.hide_tab_transition {
    //transition: all .2s ease-in-out;
    transform: rotate(0deg);
}

.simple_add_drop_input_type:hover {
    cursor: pointer;
}

.simple_add_drop_select_tab_wrapper {
    box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
    position: absolute;
    z-index: 98;
    background: #fff;
    line-height: 25px;
}

.simple_add_drop_select_ul_tab {
    box-shadow: 0 0px 6px rgba(0, 0, 0, .2);
    overflow-y: scroll;
    overflow-x: hidden;
}

.simple_add_drop_select_li_tab {
    margin: 0;
    padding: 4px 8px;
    transition: background .2s ease-in-out;
}

.simple_add_drop_select_button_wrapper {
    margin: 0;
    padding: 4px 8px;
    background: rgba(255,222,204,100);
    color: #F18950;
    width: 100%;
    overflow: hidden;
}

.simple_add_drop_select_button_wrapper:hover {
    cursor: pointer;
}

.simple_add_drop_select_li_tab:hover {
    cursor: pointer;
    background-color: #f3f3f3;
}

.simpleTabSlideDown-enter-active {
    animation: slideDown-in .2s ease-out;
}

.simpleTabSlideDown-leave-active {
    animation: simpleTabSlideDown-out .2s ease-in-out;
}

.simple_add_drop_input_type .ivu-input-icon{
    width: 25px;
}
@keyframes simpleTabSlideDown-in {
    0% {
        transform-origin: 0% 0%;
        transform: scaleY(0.8);
        opacity: 0.3;
    }
    100% {
        transform-origin: 0% 0%;
        transform: scaleY(1);
        opacity: 1;
    }
}

@keyframes simpleTabSlideDown-out {
    0% {
        transform-origin: 0% 0%;
        transform: scaleY(1);
        opacity: 1;
    }
    100% {
        transform-origin: 0% 0%;
        transform: scaleY(0.6);
        opacity: 0;
    }
}
</style>

<template>
    <div>
        <div :id="id" :style="{width:width+'px'}">
            <Input :placeholder="placeholder" icon='arrow-down-b' @on-click="showOrHideSelectTab" :value="value" v-model="inputValue" @on-keyup="doSearch(inputValue)" @on-blur="handleBlurEvent(inputValue)" class="simple_add_drop_input_type"></Input>
            <transition name="simpleTabSlideDown">
                <div v-show="isShowSelectTab" class="simple_add_drop_select_tab_wrapper">
                    <ul class="simple_add_drop_select_ul_tab" :style="{maxHeight:maxHeight+'px',width:width+'px'}">
                        <li v-for="item in selectDatas" :key="item.id" class="simple_add_drop_select_li_tab" @click="selectItem(item)">{{item.name}}</li>
                    </ul>
                    <div class="simple_add_drop_select_button_wrapper" style="background:#f5f7f9;color:#657180;">输入搜索或新增</div>
                </div>

            </transition>
            <transition name="simpleTabSlideDown">
                <div v-show="isShowSearchTab" class="simple_add_drop_select_tab_wrapper">
                    <ul class="simple_add_drop_select_ul_tab" :style="{maxHeight:maxHeight+'px',width:width+'px'}">
                        <li v-for="searchItem in searchResults" :key="searchItem.id" class="simple_add_drop_select_li_tab" @click="selectItem(searchItem)">{{searchItem.name}}</li>
                    </ul>
                    <div v-show="isShowButton" class="simple_add_drop_select_button_wrapper" @click="specialOperate(inputValue)">{{tipForButton}}</div>
                </div>
            </transition>

        </div>
        <!-- 提示新增职位的弹窗 -->
        <Modal v-model="isShowConfirm" width="320" :mask-closable=false>
            <p slot="header">提示</p>
            <div class="modal-content-tips">
                <p>
                    您确定在
                    <span style="color:#1c2438;margin:0 4px;">{{relatedNodeName}}</span>
                    组织下新增
                    <span style="color:#1c2438;margin:0 4px;">{{inputValue}}</span>
                    职位吗？
                </p>
            </div>
            <div slot="footer">
                <Button type="primary" @click="confirmToAdd">确定</Button>
                <Button @click="cancelToAdd">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
/**
 * Demo:
 * <simple-drop-select-for-add
 * ref="simpleDropSelectForAdd"
 * v-model="item.tag" 
 * :relatedNodeId="allEditColumnsTemplates.orgInfos.id" 
 * :relatedNodeName="allEditColumnsTemplates.orgInfos.name" 
 * :width=260 
 * :itemId="demo">
 * </simple-drop-select-for-add>
 * @param v-model 数据绑定的值
 * @param relatedNodeId 关联节点的Id值,
 * @param relatedNodeName 关联节点的Name值
 * @param width 设置框度
 * @param itemId id值 不可为空
 */
export default {
    name: "simpleDropSelectForAdd"
    , props: {
        itemId: {
            type: String,
            default: ""
        }
        , value: {
            type: [String, Number],
            default: ""
        }
        , maxHeight: {
            type: Number,
            default: 230
        }
        , width: {
            type: Number,
            default: 180
        }
        , relatedNodeName: {
            type: String,
            default: ""
        }
        , relatedNodeId: {
            type: String,
            default: ""
        }
        ,placeholder:{
            type:String,
            default:""
        }
        // ,onHandleBlurEvent:{
        //     type:Function
        // }

    }
    , watch: {
        selectDatas: {
            handler: function(val, oldVal) {
                this.inputValue = "";
                this.inputId = "";
            },
            deep: true
        },
        relatedNodeId: function(val, oldVal) {
            this.updatePosSelectListByOrgId(val, "update");
        }
    }
    , data() {
        var _this = this;
        return {
            id: "simple_drop_select_" + _this.itemId
            , inputValue: "" //文本输入值
            , inputId: ""
            , oldValue: "" //保留原先的数据
            , oldId: ""
            , defaultVal: ""
            , tipForButton: "" //按钮上显示的样式
            , isShowSelectTab: false //显示选项tab
            , isShowSearchTab: false //显示搜索tab
            , isShowButton: true //提示新增按钮
            , isShowConfirm: false //显示新增弹窗
            , searchResults: [] //搜索结果面板
            , selectDatas: [] // 下拉框选项，监听是否变化，变化了则置空inputValue inputId
            , rotateIcon: false //图标的显示与否 ,不显示showSelectTab
        }
    }
    , mounted() {
        var t = this;
        //点击空白处关闭下拉
        $(document).on("click", function(event) {
            if (!$(event.target).closest("#" + t.id).length) {
                t.hideAllTab();
            }
        });
    }
    , created() {

        this.updatePosSelectListByOrgId(this.relatedNodeId, "init");
    }
    , methods: {
        updatePosSelectListByOrgId: function(orgId, type) {
            if (!this.relatedNodeId) return;
            var _this = this;
            console.log("value：", _this.value);

            //先置空之前的数据
            _this.selectDatas = [];
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "pos/queryPosList.do",
                data: JSON.stringify({ orgId: orgId }),
                success: function(data) {
                    var maps = [];
                    data.data.forEach(function(item, index) {
                        var obj = {};
                        obj['id'] = item.posId;
                        obj['name'] = item.posName;
                        maps.push(obj);
                    });
                    // 赋值
                    //debugger
                    _this.selectDatas = maps;

                    // 初始化时，如果存在值   
                    if (type == 'init' || type=='update') {
                        
                        if (_this.value && _this.value != '') {
                            var selectName = "";
                            _this.selectDatas.forEach(function(item, index) {
                                if (item.id == _this.value) {
                                    selectName = item.name;
                                }
                            });
                            // 监听selectData的变化有毒，延迟提交修改value和id
                            setTimeout(function() {
                                _this.setValue(selectName, _this.value);
                            });
                        }
                    }
                    $(".simple_add_drop_input_type .ivu-input-icon").css("font-size", "14px");
                    if (type == 'addAndUpdate') {
                        setTimeout(function() {
                            _this.inputValue = _this.oldValue;
                            _this.inputId = _this.oldId;
                            _this.$emit('input', _this.oldId)
                        });
                    }
                    if(type=='update'){
                        
                        _this.$emit("input",'');
                    }
                }
            });
        },
        // 搜索数据
        searchData: function(query, datas) {
            var obj = {};
            if (datas.length != 0) {
                datas.forEach(function(item, index) {
                    if (item.name == query) {
                        obj = item;
                    }
                });
            }
            return obj;
        },
        //显示或隐藏下拉选项列表
        showOrHideSelectTab: function() {
            var _this = this;
            //只要有一个是展开的 ，图标就向上 ,这时的动作要收起
            if (_this.isShowSearchTab || _this.isShowSelectTab) {
                _this.rotateIcon = false;// 图标向下
                _this.isShowSelectTab = false; //隐藏选择面板
                _this.isShowSearchTab = false;
                $(".simple_add_drop_input_type i").removeClass('show_tab_transition').addClass('hide_tab_transition');
            } else {
                _this.rotateIcon = true; //图标向上
                _this.isShowSelectTab = true; //显示选择面板
                _this.isShowSearchTab = false;
                $(".simple_add_drop_input_type i").removeClass('hide_tab_transition').addClass('show_tab_transition');
            }
        }
        , showOrHideSearchTab: function() {
            var _this = this;
            if (_this.isShowSearchTab) {
                //显示搜索
                _this.rotateIcon = true; //图标向上
                _this.isShowSelectTab = false; //显示选择面板
                $(".simple_add_drop_input_type i").removeClass('hide_tab_transition').addClass('show_tab_transition');
            } else {
                _this.rotateIcon = false;// 图标向下
                $(".simple_add_drop_input_type i").removeClass('show_tab_transition').addClass('hide_tab_transition');
            }
        }
        , selectItem: function(oItem) {

            var _this = this;
            _this.inputValue = oItem.name; //赋值
            _this.inputId = oItem.id;
            this.$emit('input', oItem.id);
            _this.hideAllTab();
        }
        , hideAllTab: function() {
            var _this = this;
            _this.rotateIcon = false; //图标向下
            $(".simple_add_drop_input_type i").removeClass('show_tab_transition').addClass('hide_tab_transition');
            _this.isShowSearchTab = false; // 隐藏搜索，选项列表
            _this.isShowSelectTab = false;
        }
        , doSearch: function(queryData) {
            var _this = this;
            var allData = _this.selectDatas;
            _this.isShowSelectTab = false; //隐藏下拉列表
            _this.searchResults = []; //先置空搜索数据
            if (queryData != '') {
                var isMatchAll = false;//是否存在完全匹配的数据
                allData.forEach(function(item, index) {
                    if (item.name.includes(queryData)) {
                        _this.searchResults.push(item);
                    }
                    if (item.name == queryData) {
                        isMatchAll = true;
                    }
                });
                // 有存在完全匹配的数据则隐藏按钮，没有完全匹配的则显示按钮  
                if (isMatchAll) {
                    _this.isShowButton = false;
                } else {
                    _this.isShowButton = true;
                    _this.tipForButton = "点击新增 " + queryData;
                }
                _this.isShowSearchTab = true; //显示搜索tab
                _this.showOrHideSearchTab();
            } else {
                // 为空则关闭搜索tab
                _this.isShowSearchTab = false;
                _this.showOrHideSearchTab();
            }
        }
        , specialOperate: function(queryData) {
            console.log(this.relatedNodeId, this.inputValue);
            if (!this.relatedNodeId && this.inputValue !== '') {
                this.$Message.warning('请先选择组织');
                return;
            }
            this.isShowConfirm = true;
        },
        //处理失焦事件
        handleBlurEvent: function(inputData) {


            var _this = this;
            var allData = _this.selectDatas;
            _this.hideAllTab(); //隐藏所有的tab
            var isNoNeedToConfirm = false; //默认失去焦点后需要执行方法
            if (inputData == '') {
                isNoNeedToConfirm = true; //不需执行方法
            }
            allData.forEach(function(item, index) {
                if (inputData == item.name) {
                    _this.setValue(item.name, item.id); //赋值
                    isNoNeedToConfirm = true; // 失去焦点不需要执行方法
                }
            });
            //显示弹窗
            if (!isNoNeedToConfirm) {

                if (!this.relatedNodeId && inputData !== '') {
                    this.$Message.warning('请先选择组织');
                    return;
                }
                _this.isShowConfirm = true;
            }
        },
        /**
         * 赋值
         * value    当前需设置的值
         * id       当前需设置的id
         */
        setValue: function(value, id) {
            var _this = this;
            _this.inputValue = value;
            _this.inputId = id;
            this.$emit('input', id)
        },
        confirmToAdd: function() {
            var _this = this;
            //重新更新数据 添加职位之后请求数据
            _this.oldValue = _this.inputValue; // 保留输入框中的值到oldValue中，刷新数据后在设置中需要用到
            _this.oldId = _this.inputId;
            _this.addOrgPos(_this.relatedNodeId, _this.oldValue);
            //_this.updatePosSelectListByOrgId(_this.relatedNodeId,"addAndUpdate");
            _this.isShowConfirm = false; // 关闭弹窗
        },
        cancelToAdd: function() {
            var _this = this;
            _this.isShowConfirm = false; // 关闭弹窗
            _this.inputValue = '';

        }
        , addOrgPos: function(orgId, posName) {
            var _this = this;
            var params = {
                org_id: orgId,
                pos_id: posName
            }

            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "pos/insertPosInOrg.do",
                data: JSON.stringify(params),
                success: function(data) {
                    _this.oldId = data.ext;
                    _this.updatePosSelectListByOrgId(orgId, "addAndUpdate");
                    _this.$emit('addOrgPosCallback')
                }
            });
        }

    }
}
</script>
