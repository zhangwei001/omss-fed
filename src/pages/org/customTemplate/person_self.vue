<style lang="scss">

@import "../../../style/style.css";
.detaile-full-main-l-item {
    margin-bottom: 40px;

    >h4 {
        margin-bottom: 30px;
        position: relative;
        display: flex;
        padding-right: 36px;
        border-bottom: 1px solid #657180;
        color: #657180;
        box-sizing: border-box;

        em {
            margin-right: 6px;
            display: block;
            line-height: 36px;
            font-size: 14px;
            color: #657180;
        }

        span {
            display: block;
            line-height: 36px;
            padding-right: 5px;
            background-color: #fff;
            font-size: 18px;
        }

        i {
            display: none;
            position: absolute;
            right: 0;
            top: 0;
            height: 36px;
            line-height: 36px;
            width: 36px;
            text-align: center;
            color: #848F9D;
            cursor: pointer;
            transition: 0.3s ease-out;

            &:hover {
                color: #F18950;
            }
        }
    }

    &:hover {
        >h4 i {
            display: block;
        }
    }
}

.detaile-full-main-l-item-content {
    position: relative;
    margin-bottom: 30px;
    transition: 0.3s linear;
}

.detaile-full-main-l-list {
    display: flex;
    flex-wrap: wrap;
    margin: 30px 0 10px;

    >li {
        display: flex;
        width: 50%;
        line-height: 20px;
        padding-bottom: 20px;
        align-items: center;

        >label {
            width: 120px;
            padding-right: 15px;
            color: #A0A7B1;
            text-align: right;
            font-size: 14px;

            >span.must {
                color: #EA5413;
                font-size: 12px;
            }
        }

        >dl {
            flex: 1;
            font-size: 14px;
            color: #3D4651;

            >span.detaile-full-main-l-list-content {
                display: block;
                width: (2 / 3) * 100%;
                padding: 0 10px;
                box-sizing: border-box;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            >.ivu-input-type,
            >div>.ivu-input-type,
            .daydao_drop_select,
            .ivu-date-picker {
                width: (2 / 3) * 100%;
                /* padding: 0 10px;
                                    height: 30px;
                                    border: 1px solid #D7DDE4;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    color: #657180;
                                    box-sizing: border-box; */
            }

            .daydao_drop_select {
                >input {
                    width: 100%!important;
                }

                .daydao_drop_select_tree,
                .daydao_drop_select_search_tree {
                    width: 100%!important;
                }
            }
        }
    }
}

.person-self-pos-select {
    >div {
        width: 100% !important;
        position: relative;
    }

    .simple_add_drop_select_ul_tab{
        width: 100% !important;
        
    }

    .simple_add_drop_select_tab_wrapper{
        width: 100% !important;
    }
}
.detaile-full-main-l-btn{
    float: right;
}
</style>

<template>
    <!-- 编辑 -->
    <section class="detaile-full-main-l-item">
        <h4>
            <em class="icon iconfont-daydao-hr" style="font-size:28px;">◆</em>
            <span>{{templateItem.title}}</span>
            <i class="icon iconfont_daydao_common" v-if="templateItem.isEdit && data.validModify" @click="templateItem.isEdit = !templateItem.isEdit">&#xe69c;</i>
        </h4>
        <div class="detaile-full-main-l-item-content">

            <!-- 非编辑状态 -->
            <div v-if="templateItem.isEdit">
                <ul class="detaile-full-main-l-list" v-for="(blockItem, index) in templateItem.data" :key="index">
                    <li v-for="item in blockItem.data" :key="item.uuid" v-if="item.name != 'is_phone_show' && item.isEditShow" :style="item.cellType=='textarea' ? 'width: 100%;' : ''">
                        <label :title="item.title">{{item.title}}</label>
                        <dl>
                            <span :title="item.value">{{item.value}}</span>
                        </dl>
                    </li>
                </ul>
            </div>
            <!-- 编辑状态 -->
            <div v-if="!templateItem.isEdit" class="detail-edit-box">
                <Form v-for="(blockItem, blockIndex) in templateItem.data" :key="blockIndex" ref="formCustom" :model="formCustom" :rules="ruleCustom">
                    <FormItem v-for="(item, itemIndex) in blockItem.data" :key="itemIndex" 
                            v-if="item.name != 'is_phone_show' && item.isEditShow" 
                            :label="item.title" 
                            :prop="item.name" 
                            :required="item.isMust" 
                            :style="item.cellType=='textarea' ? 'width: 100%;' : ''">
                        <!-- 文件框 -->
                        <Input v-if="(item.cellType=='text' || !item.cellType) && item.name != 'cell_phone'"
                                v-model="item.value"
                                :maxlength="item.fieldSize"
                                placeholder="请输入..."></Input>

                        <!-- 手机号 -->
                        <div v-if="(item.cellType=='text' || !item.cellType) && item.name == 'cell_phone'">
                            <Tooltip content="该账号已激活，只能由员工自助更改手机号" placement="bottom-end" v-if="item.disabled">
                                <Input v-model="item.value" :maxlength="item.fieldSize" :disabled="item.disabled" placeholder="请输入..."></Input>
                            </Tooltip>
                            <Input v-if="!item.disabled" v-model="item.value" :maxlength="item.fieldSize" placeholder="请输入..."></Input>
                            <Checkbox v-for="phoneItem in blockItem.data"
                                        :key="phoneItem.id"
                                        v-model="phoneItem.value"
                                        v-if="phoneItem.name == 'is_phone_show'">{{phoneItem.title}}</Checkbox>
                        </div>

                        <!-- textarea -->
                        <Input v-if="item.cellType=='textarea'"
                                v-model="item.value"
                                :maxlength="item.fieldSize"
                                style="width: calc(((100% + 135px) - 135px) - ((((100% + 135px) / 2) - 135px) * (1 / 3)))"
                                type="textarea" :rows="4" placeholder="请输入..."></Input>

                        <!--日期处理 -->
                        <Date-picker v-if="item.cellType=='date'"
                                    v-model="item.value" placeholder="请选择"
                                    class="text-filed-length"
                                    type="date"  
                                    format="yyyy-MM-dd"></Date-picker>

                        <!--下拉列表 -->
                        <daydao-drop-select v-if="(item.cellType=='treeSelect' || item.cellType=='treeAdviceSelect')  && item.name != 'posId' && item.name != 'partPosId' && item.name !='reportPersonId' && item.name !='orgId'"
                                            :isAllowOther="item.cellType=='treeAdviceSelect' ? true : false"
                                            :name="item.name"
                                            :data="treeSelectData[item.keyValueBean.infoSetId]"
                                            :val="item.value"
                                            :showVal="item.value"            
                                            ref="daydaoDropSelect"></daydao-drop-select>

                        <!-- 汇报关系/组织 -->
                        <daydao-drop-select v-if="(item.cellType=='treeSelect' || item.cellType=='treeAdviceSelect') && (item.name =='reportPersonId' || item.name =='orgId' || item.name == 'partPosId')"
                                            :isAllowOther="item.cellType=='treeAdviceSelect' ? true : false"
                                            :name="item.name"
                                            :data="treeSelectData[item.name]"
                                            :val="item.value"
                                            :showVal="item.value" 
                                            :onSelected="onSelected"                                        
                                            ref="daydaoDropSelect"></daydao-drop-select>

                        <!--职位 -->
                        <simple-drop-select-for-add v-if="(item.cellType=='treeSelect' || item.cellType=='treeAdviceSelect') && item.name == 'posId'" 
                                                    ref="simpleDropSelectForAdd" v-model="item.id" 
                                                    :value="item.id" 
                                                    :relatedNodeName="item.value" 
                                                    :relatedNodeId="orgId" 
                                                    :itemId="item.name" 
                                                    class="person-self-pos-select"></simple-drop-select-for-add>

                        <!-- switch -->
                        <i-switch v-if="item.cellType=='switch'">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>

                        <!-- Radio -->
                        <RadioGroup v-if="item.cellType=='radio'" v-model="item.value">
                            <Radio v-for="radioItem in item.treeSelectData" :key="radioItem.id" :label="radioItem.name"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem class="detail-edit-box-btns">
                        <Button type="ivu-btn ivu-btn-primary" @click="saveRowData">保存</Button>
                        <Button type="ghost" @click="cancelRowData">取消</Button>
                    </FormItem>
                </Form>
            </div>

        </div>
    </section>
</template>

<script>
import { daydaoDropSelect, daydaoDropSelectMul } from 'commonVueLib/daydaoDropSelect/index'
import simpleDropSelectForAdd from 'components/simple_drop_select_for_add/index'
import Utils from "commonVueLib/utils/index"
export default {
    name: "person_self",
    props: {
        editListData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    components: {
        daydaoDropSelect,
        simpleDropSelectForAdd,
    },
    data() {
        return {
            templateItem: {},   // 列表数据
            treeSelectData: {}, // 下拉框数据对象
            data: {},
            orgId: "",
            orgName: "" // 关联组织名称
        };
    },
    created() {
        var _this = this;

        _this.getOnJobPersonBaseInfo()
    },
    methods: {
        /**
         * 获取在职员工基本信息
         */
        getOnJobPersonBaseInfo() {
            var _this = this;

            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "person/getOnJobPersonBaseInfo",
                data: JSON.stringify({ personId: _this.$route.params.personId }),
                success: function(data) {
                    if (data.result == "true") {
                        _this.data = data.data;

                        _this.$parent.$parent.$parent.getPersonInfo(_this.data);
                        //validModify:false   不可编辑状态
                        //validModify:true + validModiyToPerfect:false   affairModify/modify.do接口
                        //validModify:true + validModiyToPerfect:true    affairPerfect/perfect接口

                        // 初始化列表数据对象
                        _this.templateItem = _this.formatTemplateAndData(JSON.parse(JSON.stringify(_this.$parent.sectionItem)), _this.data);

                        _this.templateItem.data[0].data.forEach((item,index) => {
                            // 显示/隐藏 试用期字段
                            if (item.name == 'personTypeId' && item.value == '2') {
                                _this.showAndHiddenInMonth(_this.templateItem.data[0].data, true);
                            }
                            else if(item.name == 'personTypeId' && item.value != '2'){
                                _this.showAndHiddenInMonth(_this.templateItem.data[0].data, false);
                            }
                            else if(item.name=='in_month'){
                                _this.templateItem.data[0].data[index].value = _this.templateItem.data[0].data[index].value || 3; // 如果没有填试用期，默认为3
                            }
                        })

                        // 初始化选项的下拉框选项
                        _this.initSelectTreeData(_this.templateItem.data[0].data);
                    }
                }
            });
        },
        /**
         * 初始化下拉框数据集
         */
        initSelectTreeData(items) {
            var _this = this;

            // 特殊下拉框 职位"posId"根据组织"orgId"获取下拉框数据    汇报对象"reportPersonId"通过接口获取下拉框数据
            items.forEach(function(item) {
                // 非select、radio不执行下面逻辑
                if (!(item.cellType == 'treeSelect' || item.cellType == 'treeAdviceSelect' || item.cellType == 'radio')) return false;

                if(item.name == 'posId'){
                    // 职位"posId"根据组织"orgId"获取下拉框数据
                    console.log('职位')
                }
                else if(item.name == 'orgId'){
                    // 组织
                    getReportSelectData(item, item.name)
                }
                else if(item.name == 'reportPersonId'){
                    // 汇报对象"reportPersonId"通过接口获取下拉框数据
                    getReportSelectData(item, item.name)
                }
                else if(item.name == 'partPosId'){
                    // 兼任职位 
                    getJobSelectData(item);
                }
                else{
                    // 其它
                    // 如果对应的的下拉选择infosetid有下拉框时，不执行下面的逻辑
                    if(_this.treeSelectData[item.keyValueBean.infoSetId] && _this.treeSelectData[item.keyValueBean.infoSetId].length>0) return false;
                    
                    // 为treeSelect\radio时，获取选项数据
                    _this.getKeyValueData({
                        data: item.keyValueBean,
                        success: function (data) {
                            _this.treeSelectData[item.keyValueBean.infoSetId] = data.beans;  // 保存起来，方便之后不再重复请求下拉框数据
                        }
                    })
                }
            })

            /**
             * 获取 职位/兼任职位 的下拉框数据
             * item
             * orgId 组织id
             */
            function getJobSelectData(item, orgId){
                orgId = orgId || undefined

                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "pos/queryPosList.do",
                    data: JSON.stringify({changeStyle: true, orgId: orgId }),
                    success: function(data) {
                        if(data.result == 'true'){
                            console.log('职位/兼任职位 的下拉框数据', data)
                            _this.treeSelectData[item.name] = data.data;
                        }
                    }
                });
            }

            /**
             * 获取 汇报对象/组织 的下拉框数据
             * item
             * type 字段名称name
             */
            function getReportSelectData(item, type){
                var url = "",
                    params = {};

                switch (type) {
                    case 'reportPersonId':  // 汇报对象
                        url = "org/getReporteByCorp.do";
                        break;
                    case "orgId": // 组织
                        url = "org/getOrgPermissionTree.do"
                        break;
                    default:
                        console.log('未知的type类型：'+ type)
                }

                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + url,
                    data: JSON.stringify(params),
                    success: function(data) {
                        if(data.result == 'true'){
                            console.log('汇报对象/组织', data)
                            switch (type) {
                                case 'reportPersonId':  // 汇报对象
                                    _this.treeSelectData[item.name] = data.beans;  // 保存起来，方便之后不再重复请求下拉框数据
                                    break;
                                case "orgId": // 组织
                                    _this.treeSelectData[item.name] = data.data;  // 保存起来，方便之后不再重复请求下拉框数据
                                    break;
                                default:
                                    console.log('未知的type类型：'+ type)
                            }
                        }
                    }
                })
            }

            /**
             * 将下拉框值id转换成value
             */
            function getTreeSelectValue(id, items) {
                var name = '';

                if (id && items && items.length > 0) {
                    function fn(id, items) {
                        items.forEach((item) => {
                            if (item.id == id) {
                                name = item.name;
                            }
                            else {
                                if (item.children && item.children.length > 0) {
                                    fn(id, item.children);
                                }
                            }
                        })
                    }

                    fn(id, items)
                }

                return name;
            }
        },
        /**
         * 下拉框选择事件
         */
        onSelected(node, type) {
            var _this = this;
            
            if (node && node.key == 'personTypeId' && node.value == '2') {
                _this.showAndHiddenInMonth(_this.templateItem.data[0].data, true);
            }
            else if(node.key == 'personTypeId' && node.value != '2'){
                _this.showAndHiddenInMonth(_this.templateItem.data[0].data, false);
            }
            else if (node && node.key == 'orgId') {
                _this.orgId = node.value;
            }

            // 下拉框选择赋值
            // 组织，员工状态，员工类型，职务，职级，，汇报对象
            changeTreeSelectData(node.key, node.value);

            /**
             * 修改下拉框模板的数据
             * key 为字段的名称
             * value 为字段的值
             */
            function changeTreeSelectData(key, value) {
                _this.templateItem.data[0].data.forEach(function(item, index) {
                    if (item.name == key) {
                        // 修改下拉框模板的数据
                        _this.templateItem.data[0].data[index].value = value;
                    }
                });
            }
        },
        /**
         * 显示/隐藏 试用期字段
         * items  需要做处理的数组
         * isHidden  布尔值   false: 隐藏   true: 显示
         */
        showAndHiddenInMonth(items, isHidden) {
            items.forEach((item) => {
                if (item.name == 'inMonth') item.isEditShow = isHidden;
            })
        },
        /**
         * 取消
         */
        cancelRowData() {
            var _this = this;

            _this.templateItem = _this.formatTemplateAndData(JSON.parse(JSON.stringify(_this.$parent.sectionItem)), _this.data);

            _this.templateItem.data[0].data.forEach((item) => {
                if (item.name == 'personTypeId' && item.value == '2') {
                    _this.showAndHiddenInMonth(_this.templateItem.data[0].data, true);
                }
                else if(item.name == 'personTypeId' && item.value != '2'){
                    _this.showAndHiddenInMonth(_this.templateItem.data[0].data, false);
                }
            })
        },
        /**
         * 将模版与获取到的数据格式化
         */
        formatTemplateAndData(template, obj) {
            var items = template.data[0].data;

            items.forEach((item) => {
                if(item.name == 'personStatus'){
                    // 员工状态
                    item.value = obj['personStatusName'] || '';
                }
                else if(item.name == 'orgId'){
                    // 组织
                    item.value = obj['orgName'] || '';
                }
                else if(item.name == 'personTypeId'){
                    // 员工类型
                    item.value = obj['personTypeName'] || '';
                }
                else if(item.name == 'jobId'){
                    // 职务
                    item.value = obj['jobName'] || '';
                }
                else if(item.name == 'levelId'){
                    // 职级
                    item.value = obj['levelName'] || '';
                }
                else if(item.name == 'reportPersonId'){
                    // 汇报对象
                    item.value = obj['reportPersonName'] || '';
                }
                else if(item.name == 'partJobId'){
                    // 兼任职务
                    item.value = obj['partJobName'] || '';
                }
                else if(item.name == 'posId'){
                    // 职位
                    item.value = obj['posName'] || '';
                    item.id = obj['posId'] || '';
                }
                else if(item.name == 'partPosId'){
                    // 兼任职位
                    item.value = obj['partPosName'] || '';
                }
                else{
                    item.value = obj[item.name] || '';
                }
            })
            return template;
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
                beforeSend: function() {
                    //typeof options.beforeSend == "function" && options.beforeSend();
                },
                complete: function() {
                    //typeof options.complete == "function" && options.complete();
                },
                success: function(data) {
                    if (data.result == "true") {
                        typeof options.success == "function" && options.success(data);
                    }
                }
            });
        },
        /**
         * 保存
         */
        saveRowData() {
            var _this = this;

            //validModify:false   不可编辑状态
            //validModify:true + validModiyToPerfect:false   affairModify/modify.do接口
            //validModify:true + validModiyToPerfect:true    affairPerfect/perfect接口

            if (_this.$route.params.infoSetId === "person_consummate_list") {
                affairPerfect();
                return;
            }

            if (!_this.data.validModify) {
                // 不可编辑   validModify:false   不可编辑状态
                console.log('不可编辑状态，无法保存')
            }
            else if (_this.data.validModify && !_this.data.validModiyToPerfect) {
                // 可编辑，调用员工调动接口  validModify:true + validModiyToPerfect:false   affairModify/modify.do接口
                affairModify();
            }
            else if (_this.data.validModify && _this.data.validModiyToPerfect) {
                // 可编辑，调用完善信息接口  validModify:true + validModiyToPerfect:true    affairPerfect/perfect接口
                affairPerfect();
            }
            else {
                console.log('未知的validModify或者validModiyToPerfect状态')
            }

            /**
             * affairModify/modify.do接口
             */
            function affairModify() {
                let oSendObj = {};
                oSendObj.persons = [];

                oSendObj.persons.push(formatSendData(_this.templateItem.data[0].data));

                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "affairModify/modify.do",
                    data: JSON.stringify(oSendObj),
                    success: function(data) {
                        if (data.result == 'true') {
                            if (data.data.falNum > 0) {
                                // 修改失败的
                                _this.$Message.error({ content: data.data.personResults[0].resp.resultDesc, duration: 2 });
                            } else {
                                //修改成功
                                _this.$Message.success("修改成功");
                            }
                        }
                        // 保存成功
                        _this.cancelRowData();
                        _this.getOnJobPersonBaseInfo();
                        // _this.getDetailOptionData();
                    }
                });
            }

            /**
             * affairPerfect/perfect接口
             */
            function affairPerfect() {
                let oSendObj = {};
                oSendObj.persons = [];
                oSendObj.persons.push(formatSendData(_this.templateItem.data[0].data));
                
                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "affairPerfect/perfect",
                    data: JSON.stringify(oSendObj),
                    success: function(data) {
                        if (data.result === "true") {
                            if (data.data.personResults[0].resp.result === "true") {
                                _this.getOnJobPersonBaseInfo();
                            }else{
                                _this.$Message.error(data.data.personResults[0].resp.resultDesc);
                            }
                        }else{
                            _this.$Message.error(data.resultDesc || '服务器错误');
                        }

                        // 保存成功
                        
                        // _this.getDetailOptionData();
                    }
                });
            }

            /**
             * 格式化详情列表数据
             */
            function formatSendData(items) {
                var result = {};

                items.forEach((item) => {
                    let key = item.name,
                        value = item.value;

                    if(item.cellType == 'date' || item.cellType == 'time' || item.cellType == 'dateTime' || item.cellType == 'date_worktime' || item.cellType == 'date_yyyy_MM_dd_HH_mm' || item.cellType == 'date_yyyy_MM_dd_HH' || item.cellType == 'date_yyyy_MM' || item.cellType == 'date_yyyy'){
                        result[key] = _this.formatCustomDate(value, item.cellType);
                    }
                    else if(item.cellType == 'treeAdviceSelect' || item.cellType == 'treeSelect'){
                        if(item.name == 'posId'){
                            // 职位
                            result[key] = item.id;
                        }
                        else{
                            result[key] = $('input[name='+item.name+']').val();
                        }
                    }
                    else{
                        result[key] = value;
                    }
                })

                //oSendObj.editCondition = _this.$parent.editCondition
                result['personId'] = _this.$route.params.personId;

                return result;
            }
        },
        /**
         * 格式化日期对象
         * date 时间对象
         * type 时间类型
         */
        formatCustomDate (date, type){
            if(!date) return '';

            let str = '',
                oDate = new Date(date),
                year = oDate.getFullYear(),
                month = oDate.getMonth() + 1,
                day = oDate.getDate(),
                hours = oDate.getHours(),
                minutes = oDate.getMinutes(),
                seconds = oDate.getSeconds(),
                toDou = function(n){
                    return n = n < 10 ? '0' + n : n;
                };


            if(type == 'date'){
                // 日期 yyyy-MM-dd
                str = year + '-' + toDou(month) + '-' + toDou(day);
            }
            else if(type == 'time'){
                // 时间 HH:mm:ss
                str = toDou(hours) + ':' + toDou(minutes) + ':' + toDou(seconds);
            }
            else if(type == 'dateTime'){
                // 日期+时间 yyyy-MM-dd HH:mm:ss
                str = year + '-' + toDou(month) + '-' + toDou(day) + ' ' + toDou(hours) + ':' + toDou(minutes) + ':' + toDou(seconds);
            }
            else if(sDateType == "date_worktime"){
                // H:mm
                str = hours + ':' + toDou(minutes);
            }
            else if(sDateType == "date_yyyy_MM_dd_HH_mm"){
                // yyyy-MM-dd HH:mm
                str = year + '-' + toDou(month) + '-' + toDou(day) + ' ' + toDou(hours) + ':' + toDou(minutes);
            }
            else if(sDateType == "date_yyyy_MM_dd_HH"){
                // yyyy-MM-dd HH
                str = year + '-' + toDou(month) + '-' + toDou(day) + ' ' + toDou(hours)
            }
            else if(sDateType == "date_yyyy_MM"){
                // 日期 yyyy-MM-dd
                str = year + '-' + toDou(month) + '-' + toDou(day);
            }
            else if(sDateType == "date_yyyy"){
                //"yyyy"
                str = year
            }
            else{
                console.log('未知的时间类型：' + type);
            }

            return str;
        },
    },
}
</script>
