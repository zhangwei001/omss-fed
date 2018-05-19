<style lang="scss">
.person-info-list .item-width {
    width: 48%;
}

.form-item-width {
    width: 210px;
}

.bottom-content {
    width: 100%;
    margin-left: 0;
}

.bottom-left-content {
    position: absolute;
    left: -90px;
}

.bottom-right-content {
    position: absolute;
    right: 22px;
}

.content_wrapper {
    height: 100%;
    height: calc(100% - 160px);
    height: -ms-calc(100% - 160px);
    height: -moz-calc(100% - 160px);
    overflow-y: auto;
}
</style>
<template>
    <div class="content_wrapper">
        <Form :model="tempEditTpl"
              ref="tempEditTpl"
              :label-width="labelWidth"
              :rules="formRules"
              style="margin-top:20px;" inline>
            <Form-item v-for="(item,index) in tempEditTpl.editTpl"
                       :key="item.id"
                       :label="item.title"
                       :prop="'editTpl.'+index+'.tag'"
                       :required="item.isMust"
                       :style="incenter">

                <Input v-if="item.cellType=='text' || !item.cellType" :name="item.name" v-model="item.tag" :style="inputWidthObj"></Input>

                <DatePicker format="yyyy-MM-dd" v-if="item.cellType=='date'" placeholder="请选择" :editable="false" type="date" v-model="item.tag" :style="inputWidthObj"></DatePicker>

                <daydao-drop-select v-if="item.cellType=='treeSelect'"
                                    :name="item.name"
                                    :data="dropSelectDatas[item.name]"
                                    :val="item.tag"
                                    :onSelected="setDropSelectData"
                                    ref="daydaoDropSekect"
                                    :isEdit="isEditAble"
                                    :width="inputWidth"></daydao-drop-select>

                <Input v-if="item.cellType=='textarea'" type="textarea" :rows="3" class="text-filed-length" v-model="item.tag" :name="item.name" :style="inputWidthObj" style="height:70px;"></Input>

            </Form-item>
            <Form-item class="bottom-content" style="margin-left:0;">
                <Button class="bottom-left-content" type="primary" @click="validate(1)">保存并继续新增</Button>
                <div class="bottom-right-content">
                    <Button type="primary" @click="validate(2)" style="margin-right:6px;">保存</Button>
                    <Button type="ghost" @click="cancelOperate">取消</Button>
                </div>
            </Form-item>
        </Form>
        <Spin size="large" fix v-if="isShowSpin"></Spin>
    </div>
</template>
<script>
// 编辑表单信息
import { daydaoDropSelect, daydaoDropSelectMul } from "commonVueLib/daydaoDropSelect/index"
import Utils from "commonVueLib/utils/index"
export default {
    name: "editFormInfos"
    , components: {
        daydaoDropSelect
    },
    props: {
        infoSetId: {
            type: String,
            default: ""
        }
        , inputWidth: {
            type: Number
            , default: 210
        }
        , labelWidth: {
            type: Number
            , default: 112
        }
    }
    , data: function() {
        var _this = this;
        return {
            inputWidthObj: {
                width: _this.inputWidth + 'px'
            },
            incenter: {
                marginLeft: (660 - _this.inputWidth - _this.labelWidth) / 2 - 40 + 'px'
            }
            , tempEditTpl: {
                editTpl: []
                , cacheEditTpl: []
            }
            , formRules: {

            }
            , dropSelectDatas: {
                parent_org_id: []
                , person_id: []
                , org_id: [] //职位的org_id
                , job_id: [] //职位的job_id
                , family_id: [] //职务的family_id
                , level_bottom: [] // 职务的level_bottom
                , level_top: [] // 职务的level_top
            }
            , isShowSpin: false
            , isEditAble: true
        }
    }
    , watch: {
        infoSetId: function(val, oldVal) {

        }
    }
    , mounted: function() {
        this.initEditDatas(this.infoSetId);
    },
    methods: {
        initEditDatas: function(infoSetId) {
            var _this = this;
            _this.tempEditTpl.editTpl = [];// 置空编辑模板
            _this.formRules = {};//置空规则
            // 需要重新请求
            _this.isShowSpin = true;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/" + infoSetId + "/getTableColumn.do",
                data: JSON.stringify({ infoSetId: infoSetId }),
                success: function(data) {
                    if (data.result == 'true') {
                        _this.isShowSpin = false;
                        _this.cahceEditTpl = data.columnEdit;
                        _this.editTplFilter(data.columnEdit);
                    }

                }
            });

        }
        // 编辑数据过滤

        , editTplFilter: function(oDatas) {
            var _this = this;
            oDatas.forEach(function(item, index) {
                // 可编辑的数据
                if (item.isEditShow) {
                    _this.tempEditTpl.editTpl.push(item);
                    var realIndex = _this.tempEditTpl.editTpl.length - 1;
                    _this.formRules['editTpl.' + realIndex + '.tag'] = [];
                    if (item.regExpress) {
                        const validator = (rule, value, callback) => {
                            const reg = new RegExp(item.regExpress);
                            if (!reg.test(value)) {
                                callback(new Error(item.title + '格式错误!'));
                            } else {
                                callback();
                            }
                        }
                        _this.formRules['editTpl.' + realIndex + '.tag'].push({ validator: validator, trigger: "blur" });
                    }

                    //  必填规则
                    if (item.isMust) {
                        //必填规则 根据不同类型添加不同校验规则  editColumnsArray.0.tag
                        const validator = (rule, value, callback) => {
                            if (value == '') {
                                callback(new Error('不能为空!'));
                            } else {
                                callback();
                            }
                        }
                        _this.formRules['editTpl.' + realIndex + '.tag'].push({ validator: validator, trigger: "blur" });
                    }
                    if (item.cellType == 'treeSelect') {
                        // 特殊请求：新增职位 的所属组织使用新版的权限组织树
                        if (_this.infoSetId && _this.infoSetId == 'pos_list' && item.name == 'org_id') {
                            new Promise(function(resolve, reject) {
                                _this.getSpecialKeyValue(resolve, item);
                            }).then(function(data) {
                                _this.dropSelectDatas[data.item.name] = data.data;
                            });
                        } else {
                            // 常规下拉框的请求
                            if (item.keyValueBean) {
                                new Promise(function(resolve, reject) {
                                    _this.getKeyValue(resolve, item.keyValueBean, item);
                                }).then(function(data) {
                                    _this.dropSelectDatas[data.item.name] = data.beans;
                                    console.log(_this.dropSelectDatas);
                                });
                            }
                        }

                    }
                }
            });
            console.log(_this.tempEditTpl, _this.formRules);
        },
        // 特殊请求
        /*
        @params resolve :promise 的成功回调
        @params specialItem 对应编辑项的全部数据
        */
        getSpecialKeyValue: function(resolve, specialItem) {
            var _this=this;
            var url="org/getOrgPermissionTree.do"; // 请求对应的参数
            var params = {};
            switch (specialItem.name) {
                case "org_id":
                    url="org/getOrgPermissionTree.do";
                    break;
                default:
                    cosnole.log("不存在编辑模板的name值");
            }
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + url,
                data: JSON.stringify(params),
                success: function(data) {
                    data['item'] = specialItem;
                    resolve(data);
                }
            });
        }
        , getKeyValue: function(resolve, keyValueBean, item) {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/getKeyValueData.do"
                , data: JSON.stringify(keyValueBean)
                , success: function(data) {
                    if (data.result == 'true') {
                        data['item'] = item;
                        resolve(data);
                    }

                }
            });
        }
        // 保存 和保存并继续新增事件
        , validate: function(type) {
            var _this = this;
            _this.$refs.tempEditTpl.validate((valid) => {
                if (valid) {
                    this.saveAdd(type);
                }
            });
        }
        , saveAdd: function(type) {
            var _this = this;
            //console.log(this.tempEditTpl.editTpl);
            var dataList = [];
            _this.tempEditTpl.editTpl.forEach(function(item, index) {
                if (item.cellType == 'date') {
                    dataList.push({
                        key: item.name,
                        value: Utils.dateFormat(item.tag, "yyyy-MM-dd")
                    });
                } else {
                    dataList.push({
                        key: item.name,
                        value: item.tag
                    });
                }

            })
            var params = {
                infoSetId: _this.infoSetId,
                navigationCondition: {
                    and: true,
                    childCondition: null,
                    equal: false,
                    joinAlias: null,
                    joinBean: null,
                    key: "hr_org.org_id_queue",
                    value: "like '0001!%'"
                },
                dataList: dataList
            };
            //params['dataList']=dataList;
            console.log(params);
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/" + _this.infoSetId + "/insert.do",
                data: JSON.stringify(params),
                success: function(data) {
                    if (data.result == 'true') {
                        _this.$Message.success("新增成功");
                        if (type == 1) {
                            //保存并新增
                            _this.$emit("saveSuccessCallback", false);
                            _this.initEditDatas(_this.infoSetId);

                        } else {
                            // 保存 ，提示保存成功
                            _this.initEditDatas(_this.infoSetId);
                            _this.$emit("saveSuccessCallback", true);
                        }
                    }

                }
            });
        },
        // 设置tag值
        setDropSelectData: function(oSelect, type) {
            console.log(oSelect, type);
            var _this = this;
            var key = oSelect.key;
            var value = oSelect.value;
            _this.tempEditTpl.editTpl.forEach(function(item, index) {
                if (item.name == key) {
                    _this.tempEditTpl.editTpl[index].tag = value;
                }
            });
        }
        //取消操作
        , cancelOperate: function() {
            console.log("cancel");
            this.initEditDatas(this.infoSetId);
            this.$emit("cancelCallback");
        }
        //所有数据重置
        , resetAll: function() {
            var _this = this;
            _this.tempEditTpl.editTpl = [];
            _this.formRules = {};
        }

    }
}
</script>
