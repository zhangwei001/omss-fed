<style lang="css">
.add-person-simple .add-person-header {
    background: #F5F7F9;
    height: 46px;
    line-height: 46px;
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.add-person-simple .add-person-header .add-person-title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #657180;
    text-align: center;
    margin-left: -102px;
}

.add-person-header .left-back-nav {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #657180;
    margin-left: 1.5%;
}

.add-person-header .left-back-nav:hover {
    cursor: pointer;
}

.person-info-list {
    width: 969px;
    margin: 50px auto;
}

.person-info-list .item-width {
    width: 48%;
}

.icon_style {
    color: #6fb7ff;
    font-size: 18px;
}

.person-info-list .item-label {
    display: inline-block;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    white-space: nowrap;
    vertical-align: middle;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #939BA6;
    margin-right: 0.7%;
}

.text-filed-length {
    width: 260px;
}

footer[class=bottom-wrapper] {
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    min-width: 869px;
}

footer .bottom-shade {
    background-color: #000000;
    opacity: 0.65;
    width: 100%;
    height: 100%;
    z-index: 888;
}

.person-info-list .bottom-content {
    position: fixed;
    width: 280px;
    z-index: 889;
    bottom: -18px;
    right: 15px;
}

.person-info-list .bottom-content button {
    margin-right: 10px;
}

.person-info-list .btn-position {
    float: right;
    margin-right: 120px;
    margin-top: 50px;
}

.modal-content-tips .success-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
}

.modal-content-tips .success-tip .success-tip-text {
    margin-left: 10px;
    font-size: 16px;
    color: #657180;
}

.add-person-simple .person-info-list .hideInMonth {
    display: none;
}







/*覆盖默认的 daydao_drop_select  */

.person-info-list .daydao_drop_select {
    width: 260px;
    position: relative;
    height: 32px;
    display: inline-block;
    vertical-align: middle;
}
</style>

<template>
    <div class="add-person-simple">
        <header class="add-person-header">
            <router-link class="left-back-nav" to="/person_list">
                <Icon type="chevron-left"></Icon>
                <span>返回</span>

            </router-link>
            <h1 class="add-person-title">新增员工</h1>
            <span></span>
        </header>
        <!--  ！！！数据放置再每一项的tag里面  :rules="{required: true, message: '项目' + (index + 1) +'不能为空', trigger: 'blur'}"  :oData="dropSelectDatas.position"-->
        <Form :model="allEditColumnsTemplates" ref="allEditColumnsTemplates" :label-width="112" class="person-info-list" :rules="addRules" inline>
            <!--表单项  -->
            <Form-item v-for="(item , index) in allEditColumnsTemplates.editColumnsArray" v-if="item.isEditShow && item.name!='is_phone_show'" :class="{hideInMonth:!allEditColumnsTemplates.isShowEditColumns[item.name]}" :key="index" :label="item.title" class="item-width" :prop="'editColumnsArray.' + index + '.tag'" :required="item.isMust">
                <!-- 输入框处理 -->
                <Input v-if="item.cellType=='text' ||item.cellType==null && item.name!='pos_id'" class="text-filed-length" v-model="item.tag" :name="item.name"></Input>
                <simple-drop-select-for-add style="display:inline-block;" v-if="item.name=='pos_id'" ref="simpleDropSelectForAdd" v-model="item.tag" :relatedNodeName="allEditColumnsTemplates.orgInfos.name" :relatedNodeId="allEditColumnsTemplates.orgInfos.id" :width=260 :itemId="pos_select_item_id" :placeholder="posSelectTip"></simple-drop-select-for-add>

                <!--日期处理 -->
                <DatePicker v-if="item.cellType=='date'" v-model="item.tag" placeholder="请选择" :editable='false' class="text-filed-length" type="date"></DatePicker>
                <!--单选框  -->
                <RadioGroup v-if="item.name=='sex'" v-model="item.tag" class="text-filed-length">
                    <Radio label="1">
                        <span>男</span>
                    </Radio>
                    <Radio label="2">
                        <span>女</span>
                    </Radio>
                </RadioGroup>
                <!--下拉列表 -->
                <daydao-drop-select v-if="item.cellType=='treeSelect' && item.name!='pos_id'" :name="item.name" :data="dropSelectDatas[item.name]" :val="item.tag" :showVal="report_name" ref="daydaoDropSelect" :placeholder="posSelectTip" :onSelected="setDropSelectData" width="260"></daydao-drop-select>
                <!-- 如果是手机号 -->
                <!-- <Checkbox v-if="item.name=='cell_phone'" v-model="extraEditColumns.phone_checked" @click="changePhone">通讯录可见</Checkbox> -->
                <Tooltip v-if="item.name=='pos_id'" placement='top' style="display:inline-block;margin-left:6px;position:relative;top:4px;">
                    <i class="iconfont_daydao_common icon_style">&#xe614;</i>
                    <div slot="content">
                        <p>
                            点击下拉框的提示可以在所选组织下<br/>快速新增一个职位并使用<br/>
                        </p>
                    </div>
                </Tooltip>
                <Tooltip v-if="item.name=='job_id'" placement='top' style="display:inline-block;margin-left:6px;position:relative;top:4px;">
                    <i class="iconfont_daydao_common icon_style">&#xe614;</i>
                    <div slot="content">
                        <p>
                            职务需要配置后才能选择，您可以前往<br/>“组织人事－职位－职务”菜单进行配置<br/>
                        </p>
                    </div>
                </Tooltip>
            </Form-item>
            <Form-item class="btn-position" v-if="showOpeBtn">
                <Button type="primary" @click="validateAddPerson" style="margin-right:12px;">保存</Button>
                <Button type="button" @click="cancelSave">取消</Button>
            </Form-item>
        </Form>

        <!-- <footer class="bottom-wrapper">
                            <div class="bottom-shade"></div>
                        </footer> -->
        <!--新增成功的弹窗  -->
        <Modal v-model="successTip.isShowSuccessModal" width="320" @on-cancel="backToEmployee" :mask-closable=false>
            <p slot="header" style="height:0px;"></p>
            <div class="modal-content-tips">
                <p class="success-tip">
                    <Icon type="checkmark-circled" color="#1BBE6B" size="36"></Icon>
                    <span class="success-tip-text">新增成功</span>
                </p>
                <p v-if="successTip.isShowMessageTip">{{successTip.userName}}已加入系统，默认将收到系统邀请短信，如需更改设置请前往
                    <a href="/manage/admin/base/companySet" style="color:rgb(7, 169, 234);" target="_blank">管理后台-企业设置</a>修改</p>
            </div>

            <div slot="footer" style="text-align:center;">
                <Button type="primary" @click="completeInfos" style="margin-right:20px;">完善信息</Button>
                <Button type="button" @click="continueToAdd" style="margin-left:20px;">继续新增</Button>
            </div>
        </Modal>
        <Spin size="large" fix v-if="isShowSpin"></Spin>
    </div>
</template>

<script type="text/babel">

const infoSetId = "person_list";
import $ from "jquery";
import { daydaoDropSelect, daydaoDropSelectMul } from 'commonVueLib/daydaoDropSelect/index'
import simpleDropSelectForAdd from 'components/simple_drop_select_for_add/index'
import Utils from "commonVueLib/utils/index"
export default {
    name: infoSetId,
    components: {
        daydaoDropSelect  //this.$refs.daydaoDropSelect[index].hiddenValue(id)/showValue(name)
        , simpleDropSelectForAdd
    },
    watch: {
        // 监听组织id变化，对应职位和汇报对象
        'allEditColumnsTemplates.orgInfos.id': function(val, oldVal) {
            //console.log(1111, val, oldVal);
        },
        "allEditColumnsTemplate.editColumnsArray": {
            handler: function(val, oldVal) {
                console.log("数据发生变化");
            },
            deep: true
        }
    },
    data: function() {
        return {
            //请求来的全部编辑数据模板
            allEditColumnsTemplates: {
                editColumnsArray: [],
                //每一项的显示控制，主要控制试用期的显示与关闭
                isShowEditColumns: {

                },
                //监听的组织数据
                orgInfos: {
                    id: "",
                    name: "",
                }
            }
            //额外数据
            , extraEditColumns: {
                phone_checked: true
            }
            //下拉列表数据
            , dropSelectDatas: {
                id_type: [],
                org_id: [],
                person_status: [],
                person_type: [],
                report_id: [],
                sys_ext1__r_hr_org_pos__value: [],
                sex: [],
                position: []
            }
            // 校验规则
            , addRules: {

            }
            //提示的数据
            , successTip: {
                isShowSuccessModal: false
                , isShowMessageTip: true
                , userName: ""
            }
            , isShowSpin: false //显示加载层
            , addTime: 0
            , addPersonId: ""
            , posSelectTip: "请选择"
            , showOpeBtn: false
            , report_name: "" // 汇报关系强赋值名称
            , pos_select_item_id:"pos_select_item"
        }
    },
    mounted: function() {

    },
    created: function() {
        this.initEditDatas();

        // this.getTableColumn()
        // this.getDetailOptionData()
    },
    methods: {
        init2: function() {
            this.$daydao.$ajax({
                url: gMain.apiBasePath + "org/getReporteByCorp.do",
                data: JSON.stringify({}),
                success: function(data) {
                    //_this.addPersonTemplate.editColumns=_this.addPersonTemplate.editColumns.concat(data.columnEdit);
                    try {
                        console.log(data);
                    } catch (e) {
                        console.log(e.message);
                    }

                }
            });
            this.$daydao.$ajax({
                url: gMain.apiBasePath + "org/getOrgPermissionTree.do",
                data: JSON.stringify({}),
                success: function(data) {
                    //_this.addPersonTemplate.editColumns=_this.addPersonTemplate.editColumns.concat(data.columnEdit);
                    try {
                        console.log(data);
                    } catch (e) {
                        console.log(e.message);
                    }

                }
            });

        },
        getOrgReportLeader: function() {
            var _this = this;

        }
        // 组织 员工状态 ，职位，汇报对象
        , getSpecialTreeByType: function(type, item, resolve, index) {
            var _this = this;
            var url = "";
            var params = {};
            switch (type) {
                case "org":
                    url = "org/getOrgPermissionTree.do"
                    break;
                case "report":
                    url = "org/getReporteByCorp.do";
                    break;
                case "pstatus":
                    url = "person/getJobPersonStaus.do";
                    break;
                default:
                    _this.$Message.error("type 不能为空");
            }
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + url,
                data: JSON.stringify(params),
                success: function(data) {
                    data['index'] = index;
                    data['item'] = item;
                    if (type == 'report') {
                        // 汇报对象数据处理

                        formatReportTreeData(data.beans);
                        console.log("==================", data.beans);
                    }

                    resolve(data);

                }
            });
            function formatReportTreeData(treeData) {
                //debugger
                treeData.forEach(function(treeItem) {
                    // debugger
                    if (treeItem.personFlag) {
                        // debugger
                        // true 人员 ，修改id
                        treeItem.id = 'rp_' + treeItem.id;
                        console.log(treeItem.name);
                    }
                    if (treeItem.children) {
                        formatReportTreeData(treeItem.children);
                    }
                });
            }
        },
        //初始化编辑模板
        initEditDatas: function() {
            var _this = this;
            _this.isShowSpin = true;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/person_list/getTableColumn.do",
                data: JSON.stringify({ infoSetId: infoSetId }),
                success: function(data) {
                    //_this.addPersonTemplate.editColumns=_this.addPersonTemplate.editColumns.concat(data.columnEdit);
                    try {
                        _this.isShowSpin = false;// 隐藏遮罩层
                        _this.showOpeBtn = true; //显示编辑按钮
                        _this.addPersonTemplateFilter(data.columnEdit);//编辑模板筛选
                    } catch (e) {
                        console.log(e.message);
                    }

                }
            });
            _this.validateFirstPerson();
        },
        // 验证是否为第一个员工
        validateFirstPerson: function() {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "person/verifyFirstPerson",
                data: JSON.stringify({}),
                success: function(data) {
                    if (data.result=='true') {
                        _this.successTip.isShowMessageTip = true;
                    } else {
                        _this.successTip.isShowMessageTip = false;
                    }

                }
            });
        }
        //编辑数据 过滤
        ,addPersonTemplateFilter: function(datas) {
            var _this = this;
            _this.allEditColumnsTemplates.editColumnsArray = [];//置空
            datas.forEach(function(item, index) {
                if (item.isEditShow) {
                    //保存编辑项
                    _this.allEditColumnsTemplates.editColumnsArray.push(item);
                    // 数据所在数组的具体位置 ，用于对应验证规则的索引
                    var realIndex = _this.allEditColumnsTemplates.editColumnsArray.length - 1;
                    _this.addRules['editColumnsArray.' + realIndex + '.tag'] = [];
                    if (item.name != 'in_month') {
                        _this.allEditColumnsTemplates.isShowEditColumns[item.name] = true;
                    } else {
                        _this.allEditColumnsTemplates.isShowEditColumns[item.name] = false;
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
                        _this.addRules['editColumnsArray.' + realIndex + '.tag'].push({ validator: validator, trigger: "blur" });
                    }
                    // 如果有regExpress 则用于规则判断
                    if (item.regExpress) {
                        if (item.name == "in_month") {
                            console.log(item.regExpress, realIndex);
                        }
                        const validator = (rule, value, callback) => {
                            const reg = new RegExp(item.regExpress);
                            if (value != '' && !reg.test(value)) {
                                callback(new Error(item.title + '格式错误!'));
                            } else {
                                callback();
                            }
                        }
                        _this.addRules['editColumnsArray.' + realIndex + '.tag'].push({ validator: validator, trigger: "blur" });
                    }
                    //日期不能为空的判断
                    if (item.cellType == 'date') {
                        const validateDate = (rule, value, callback) => {
                            if (value == '') {
                                callback(new Error('不能为空!'));
                            } else {
                                callback();
                            }
                        }
                        _this.addRules['editColumnsArray.' + realIndex + '.tag'].push({ validator: validateDate, trigger: "blur" });
                    }
                    //下拉列表获取数据
                    if (item.cellType == 'treeSelect') {
                        //如果是下拉框 template.oData 在该数组对象添加数据
                        new Promise(function(resolve, reject) {
                            //获取下拉数据
                            _this.getKeyValue(item, resolve, _this.allEditColumnsTemplates.editColumnsArray.length);
                        }).then(function(datas) {
                            if (datas.item.name == 'org_id') {
                                _this.dropSelectDatas[datas.item.name] = datas.data;//赋值给dropSelectData
                            } else {
                                _this.dropSelectDatas[datas.item.name] = datas.beans;//赋值给dropSelectData
                            }
                            //给组织默认顶级节点 ，之后请求对应组织下的职位和组织负责人
                            if (datas.item.name == 'org_id') {
                                //_this.getPositionByOrgId(datas.beans[0].id);//获取职位列表
                                _this.getOrgLeaderByOrgId(datas.data[0].id);//获取默认负责人
                                _this.allEditColumnsTemplates.editColumnsArray.forEach(function(item, index) {
                                    if (item.name == 'org_id') {
                                        _this.allEditColumnsTemplates.editColumnsArray[index].tag = datas.data[0].id;
                                        _this.allEditColumnsTemplates.editColumnsArray[index].defaultAddVal = datas.data[0].name; //将下拉列表的name赋值给defaultAddVal
                                        // 同步更新 allEditColumnsTemplates.orgInfos中的数据
                                        _this.allEditColumnsTemplates.orgInfos.id = datas.data[0].id;
                                        _this.allEditColumnsTemplates.orgInfos.name = datas.data[0].name;
                                        console.log(_this.allEditColumnsTemplates.orgInfos.name);
                                    }
                                });
                            }
                        });
                    }
                }
            });
            console.log(_this.allEditColumnsTemplates.editColumnsArray, _this.addRules);
        },
        // 获取下拉框数据的
        /**
         * @param 请求数据
         * @param promise的回调函数
         * @param editColumnsArray的当前长度
         *
         * */
        getKeyValue: function(item, resolve, index) {
            var _this = this;
            if (item.name == 'org_id') {
                _this.getSpecialTreeByType("org", item, resolve, index)
            } else if (item.name == 'report_id') {
                _this.getSpecialTreeByType("report", item, resolve, index);
            } else if (item.name == 'person_status') {
                _this.getSpecialTreeByType("pstatus", item, resolve, index);
            } else if (item.name == 'pos_id') {
                // 不做处理
            } else {
                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "route/getKeyValueData.do",
                    data: JSON.stringify(item.keyValueBean),
                    success: function(data) {
                        data['index'] = index;
                        data['item'] = item;
                        resolve(data);
                    }
                });
            }


        },
        //验证填写的表单
        validateAddPerson() {
            var _this = this;
            _this.$refs.allEditColumnsTemplates.validate((valid) => {
                if (valid) {
                    _this.saveAddPerson();//保存数据
                }

            });
        },
        //保存数据  !!!每一项的tag中取数据
        saveAddPerson: function() {
            var _this = this;
            var dataList = []; //请求参数
            var finalData = _this.allEditColumnsTemplates.editColumnsArray; //最终数据
            finalData.forEach(function(item, index) {
                if (item.isEditShow) {
                    var postItem = { key: item.name, value: item.tag };
                    if (item.cellType == 'date') {
                        //格式化日期数据 yyyy-MM-dd
                        postItem = { key: item.name, value: Utils.dateFormat(item.tag, "yyyy-MM-dd") };
                    }
                    if (item.name == 'is_phone_show') {
                        //通讯录可见
                        if (_this.extraEditColumns.phone_checked) {
                            postItem = { key: item.name, value: 1 };
                        } else {
                            postItem = { key: item.name, value: 2 };
                        }
                    }
                    if (item.name == 'person_name') {
                        _this.successTip.userName = item.tag;
                    }
                    if (item.name == 'report_id') {

                        postItem = { key: item.name, value: item.tag.substring(3) }
                    }
                    dataList.push(postItem);
                }
            });
            var params = {
                dataList: dataList,
                navigationCondition: {
                    and: true
                    , childCondition: null
                    , equal: false
                    , joinAlias: null
                    , joinBean: null
                    , key: "hr_org.org_id_queue"
                    , value: "like '0001!%'"
                }
            }
            _this.isShowSpin = true;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/" + infoSetId + "/insert.do",
                data: JSON.stringify(params),
                success: function(data) {
                    if (data.result && data.result == 'true') {
                        //弹窗提示
                        _this.addPersonId = data.statusCode;
                        _this.isShowSpin = false;
                        _this.successTip.isShowSuccessModal = true;
                    } else {
                        _this.isShowSpin = false;
                    }
                }
            });
        },
        //设置下拉框数据到editColumnsArray的tag中
        setDropSelectData: function(oSelect, type) {
            var _this = this;
            var inMonthIndex = 0;
            _this.allEditColumnsTemplates.editColumnsArray.forEach(function(item, index) {
                if (item.name == oSelect.key) {
                    _this.allEditColumnsTemplates.editColumnsArray[index].tag = oSelect.value;
                    _this.allEditColumnsTemplates.editColumnsArray[index].defaultAddVal = oSelect.node.fullName;
                    if (item.name == 'org_id') {
                        // 同步更新 allEditColumnsTemplates.orgInfos中的数据
                        _this.allEditColumnsTemplates.orgInfos.id = oSelect.value;
                        _this.allEditColumnsTemplates.orgInfos.name = oSelect.node.fullName;
                    }

                }
                //保存in_month数据的下标
                if (item.name == 'in_month') {
                    inMonthIndex = index;
                }
            });
            if (oSelect.key == 'org_id') {
                _this.getOrgLeaderByOrgId(oSelect.value);
                //_this.getPositionByOrgId(oSelect.value);

            }
            //员工类型且为试用期则显示月数，默认为3
            if (oSelect.key == 'person_type' && oSelect.value == '2') {
                _this.allEditColumnsTemplates.editColumnsArray[inMonthIndex].tag = '3';
                // 显示 试用期
                $(".add-person-simple .person-info-list .hideInMonth").css("display", "inline-block");
            } else if (oSelect.key == 'person_type' && oSelect.value != '2') {
                _this.allEditColumnsTemplates.editColumnsArray[inMonthIndex].tag = '';
                // 隐藏 试用期
                $(".add-person-simple .person-info-list .hideInMonth").css("display", "none");
            }

        },
        //跳到完善信息页面完善信息
        completeInfos: function() {
            this.successTip.isShowSuccessModal = false;

            // return;
            this.$router.push({
                name: 'person_complete',
                params: {
                    //origin: "inJob",
                    personId: this.addPersonId,
                    infoSetId: "person_consummate_list", // 当前页面的infosetid
                }
            })
        },
        //继续新增
        continueToAdd: function() {
            var _this = this;
            //清空新增后的人员id
            _this.addPersonId = "";
            _this.successTip.isShowSuccessModal = false;
            // 通讯录显示默认
            _this.extraEditColumns.phone_checked = true;
            //清空之前说所有的数据
            _this.allEditColumnsTemplates.editColumnsArray.forEach(function(item, index) {
                _this.allEditColumnsTemplates.editColumnsArray[index].tag = '';
            });
            // 隐藏 试用期
            $(".add-person-simple .person-info-list .hideInMonth").css("display", "none");
            _this.initEditDatas();
        },
        //返回员工新增页面
        backToEmployee: function() {
            this.$router.push({ path: "/person_list" });
        },
        //取消新增
        cancelSave: function() {
            // this.$router.push({ path: "/person_list" });
            this.$router.go(-1);
        },
        //通过OrgId获取默认汇报人
        getOrgLeaderByOrgId: function(orgId) {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "org/getOrgLeader.do",
                data: JSON.stringify({ orgId: orgId }),
                success: function(data) {
                    if (data.person) {
                        var oSelect = {
                            key: "report_id",
                            node: {
                                fullName: data.person.personName,
                                id: "rp_" + data.person.personId, // id 被重叠了，处理后的数据保存时需要处理一下
                            },
                            value: "rp_" + data.person.personId
                        }
                        // debugger
                        _this.report_name = data.person.personName;
                        _this.setDropSelectData(oSelect, "codeAuto");
                    } else {
                        var oSelect2 = {
                            key: "report_id",
                            node: {
                                fullName: "",
                                id: ""
                            },
                            value: ""
                        }
                        _this.report_name = "";
                        _this.setDropSelectData(oSelect2, "codeAuto");
                    }

                }
            });
        },
    }
}
</script>
