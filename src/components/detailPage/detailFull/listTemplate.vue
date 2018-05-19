<style lang="scss">
    .detail-block-box {
        position: relative;

        &:hover {

            .detaile-full-main-l-item-content-editbtn>i {
                display: inline-block;
            }
        }
    }

    .detail-list-modeal{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;

        .ivu-modal-footer{
            padding: 24px 18px;
            border-top: none;
        }

        .ivu-modal{
            top: 0;
        }
    }

</style>

<template>
    <div>
        <!-- 非编辑状态 -->
        <div v-if="blockItem.isEdit" class="detail-block-box">
            <div class="detaile-full-main-l-item-content-editbtn">
                <i class="icon iconfont_daydao_common" @click="editRowData">&#xe69c;</i>
                <i class="icon iconfont_daydao_common" @click="deleteRowData">&#xe6ae;</i>
            </div>
            <ul class="detaile-full-main-l-list">
                <li v-for="(showItem, itemIndex) in blockItem.data" :key="itemIndex" v-if="showItem.name == 'is_show' && showItem.cellType=='checkbox' ? false : true" :style="(showItem.name == 'is_show' && showItem.cellType=='checkbox') || showItem.cellType=='textarea' ? 'width: 100%;' : ''">

                    <label v-if="!(showItem.name == 'is_show' && showItem.cellType=='checkbox')" :title="showItem.title">{{showItem.title}}</label>
                    <dl v-if="!(showItem.name == 'is_show' && showItem.cellType=='checkbox')">
                        <span class="detaile-full-main-l-list-content" v-if="showItem.cellType!='switch'" :title="showItem.value">{{showItem.value}}</span>
                        <span class="detaile-full-main-l-list-content" v-if="showItem.cellType=='switch'" :title="showItem.value">{{showItem.value ? '是' : '否'}}</span>
                    </dl>
                </li>
            </ul>
        </div>
        <!-- 编辑状态 -->
        <div v-if="!blockItem.isEdit" class="detail-edit-box detail-add-box">
            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
                <FormItem v-for="(item, itemIndex) in blockItem.data" :key="itemIndex"
                          v-if="!(item.name == 'is_show' && item.cellType=='checkbox')"
                          :label="item.title"
                          :prop="'detail_list_' + (blockItem.uuid || 'add') + '_' + item.name"
                          :required="item.isMust"
                          :style="item.cellType=='textarea' ? 'width: 100%;' : ''">
                    <!-- 文件框 -->
                    <Input v-if="item.cellType=='text' || !item.cellType"
                           v-model="item.value"
                           :maxlength="item.fieldSize"
                           placeholder="请输入..."></Input>

                    <!-- textarea -->
                    <Input v-if="item.cellType=='textarea'" v-model="item.value" :maxlength="item.fieldSize" style="width: calc(((100% + 135px) - 135px) - ((((100% + 135px) / 2) - 135px) * (1 / 3)))" type="textarea" :rows="4" placeholder="请输入..."></Input>

                    <!--日期处理 -->
                    <Date-picker v-if="item.cellType=='date'" :value="item.value" v-model="item.value" placeholder="请选择" class="text-filed-length" type="date"></Date-picker>

                    <!--下拉列表 -->
                    <daydao-drop-select v-if="item.cellType=='treeSelect' || item.cellType=='treeAdviceSelect'"
                                        :isAllowOther="item.cellType=='treeAdviceSelect' ? true : false"
                                        :name="'detail_list_' + (blockItem.uuid || 'add') + '_' + item.name"
                                        :data="treeSelecArray[item.keyValueBean.infoSetId]"
                                        :val="item.value"
                                        :showVal="item.value"
                                        @onSelected="onSelected($event, item.name)"
                                        :ref="'daydaoDropSelect_' + (blockItem.uuid || 'add')"></daydao-drop-select>

                    <!-- switch -->
                    <i-switch v-if="item.cellType=='switch'" v-model="item.value">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem v-for="(item, itemIndex) in blockItem.data" :key="itemIndex"
                          v-if="item.name == 'is_show' && item.cellType=='checkbox'"
                          style="width: calc(100% - ((50% - 135px) * (1 / 3)));  text-align: right;"
                          :prop="'detail_list_' + (blockItem.uuid || 'add') + '_' + item.name" :required="item.isMust">
                    <!-- 是否显示在列表 -->
                    <Checkbox v-model="item.value">{{item.title}}</Checkbox>
                </FormItem>
                <FormItem class="detail-edit-box-btns">
                    <Button type="primary" @click="saveRowData('formCustom')">保存</Button>
                    <Button type="ghost" @click="cancelRowData">取消</Button>
                </FormItem>
            </Form>
        </div>

        <!-- 弹窗 -->
        <Modal
            :title="showModal.title"
            :mask-closable="false"
            :closable="false"
            v-model="modalState"
            width="360px"
            class-name="vertical-center-modal detail-list-modeal">

            <p v-html="showModal.content" style="padding: 5px; font-size: 14px;"></p>

            <div slot="footer" style="text-align: center;">
                <Button type="primary" @click="modalConfirm">确定</Button>
                <Button type="ghost" @click="modalCancel" style="margin-left: 28px;">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { daydaoDropSelect, daydaoDropSelectMul } from 'commonVueLib/daydaoDropSelect/index'

    export default {
        name: "addList",
        props: {
            blockItemData: {
                type: Object,
                default() {
                    return {};
                }
            },
            blockIndexData: {
                type: Number,
            },
            treeSelectData: {
                type: Object,
                default() {
                    return {};
                }//用于改变addlist.vue页面 btn: 新增按钮标识  update: 更新页面
            },
        },
        components: {
            daydaoDropSelect,
        },
        data() {
            return {
                blockItem: {},
                treeSelecArray: {}, // 下拉框数据对象
                formCustom: {}, // 表单数据对象
                ruleCustom: {}, // 表单验证规则
                modalState: false,
                showModal: {state: false, title: '提示', content: ''},   // 删除提示框
            }
        },
        created() {
            // copy 组件传过来的数据
            this.blockItem = this.blockItemData;

            // 下拉框数据集合
            this.treeSelecArray = JSON.parse(JSON.stringify(this.treeSelectData));

            // 重置表单验证条件
            this.formCustom = {};
            this.ruleCustom = {};
        },
        methods: {
            /**
             * 下拉框选择回调函数
             */
            onSelected (node, name){
                var _this = this;

                _this.blockItem.data.forEach((item)=>{
                    if(name != item.name) return false;

                    // 将数据赋予给id
                    if(!node){
                        item.id = '';
                        item.value = '';
                    }
                    else{
                        item.id = node.value;
                        item.value = node.node.name;
                    }
                })
            },
            /**
             * 编辑
             */
            editRowData (){
                try {
                    // 用于改变addlist.vue页面 btn: 新增按钮标识  update: 更新页面  add: 新增   change: 行数据更换编辑
                    this.$emit("changeAddOptionEvent", 'change', this.blockIndexData);
                }
                catch (e) {
                    console.log(e.message);
                }
            },
            /**
             * 删除行操作
             */
            deleteRowData () {
                var _this = this;

                _this.modalState = true;
                // 删除前的提示
                _this.showModal.content = '确定删除该' + _this.$parent.sectionItem.title + '吗？该操作不可恢复。'
            },

            modalConfirm (){
                var _this = this,
                    oSendObj = {};

                oSendObj.editCondition = _this.$parent.$parent.editCondition;
                oSendObj.infoSetId = _this.$parent.sectionItem.templateId;
                oSendObj.uuidLists = [];
                oSendObj.uuidLists.push(_this.blockItem.uuid);
                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "route/" + oSendObj.infoSetId + "/del.do",
                    data: JSON.stringify(oSendObj),
                    success: function(data) {
                        if (data.result == 'true') {
                            // 删除成功
                            _this.modalState = false;
                            _this.$Message.success('删除成功');
                            _this.$emit("changeAddOptionEvent", 'update');  // 用于改变addlist.vue页面 btn: 新增按钮标识  update: 更新页面  add: 新增   change: 行数据更换编辑
                        }
                    }
                });
            },

            modalCancel (){
                this.modalState = false;
            },
            /**
             * 取消
             */
            cancelRowData() {
                try {
                    var _this = this;

                    // 具备新增、修改、删除
                    if (_this.blockItem.uuid) {
                        // 修改， 更新成改动前的数据
                        _this.$emit("changeAddOptionEvent", 'undo', _this.blockIndexData);  // 用于改变addlist.vue页面 btn: 新增按钮标识  update: 更新页面  add: 新增   change: 行数据更换编辑
                    }
                    else {
                        // 新增，删除新增的这个数据
                        _this.$parent.sectionItem.data.splice(_this.blockIndexData, 1);
                        _this.$emit("changeAddOptionEvent", 'btn');  // 用于改变addlist.vue页面 btn: 新增按钮标识  update: 更新页面  add: 新增   change: 行数据更换编辑
                    }
                }
                catch (e) {
                    console.log(e.message);
                }
            },
            /**
             * 保存
             */
            saveRowData(name) {
                var _this = this,
                    oSendObj = {};

                try {
                    // 初始化表单数据和表单验证规则
                    _this.formatFormAndRuleCustom(function() {
                        console.log('formCustom', _this.formCustom, 'ruleCustom', _this.ruleCustom);

                        _this.$refs[name].validate((valid) => {
                            if (!valid) return console.log('表单验证失败!')

                            // 表单验证成功
                            oSendObj.editCondition = _this.$parent.$parent.editCondition;
                            oSendObj.infoSetId = _this.$parent.sectionItem.templateId;
                            oSendObj.dataList = formatSendData(_this.blockItem.data);

                            // 具备新增、修改、删除
                            if (_this.blockItem.uuid) {  // 修改
                                if (oSendObj.dataList && oSendObj.dataList.length <= 0) {
                                    // 没有修改的数据，直接提示修改成功
                                    _this.blockItemData.isEdit = true;
                                    return _this.$Message.success('保存成功');
                                }
                                oSendObj.uuid = _this.blockItem.uuid;  // 修改时加上uuid
                                _this.$daydao.$ajax({
                                    url: gMain.apiBasePath + "route/" + oSendObj.infoSetId + "/update.do",
                                    data: JSON.stringify(oSendObj),
                                    success: function(data) {
                                        if (data.result == "true") {
                                            _this.$Message.success('保存成功');
                                            _this.$emit("changeAddOptionEvent", 'update');  // 用于改变addlist.vue页面 btn: 新增按钮标识  update: 更新页面  add: 新增   change: 行数据更换编辑
                                            _this.$emit("getCellPhone", 1111)
                                        }
                                    }
                                });
                            }
                            else {   // 新增
                                if (oSendObj.dataList && oSendObj.dataList.length <= 0) {
                                    // 没有修改的数据，提示请填写数据
                                    return _this.$Message.warning('请填写数据');
                                }
                                oSendObj.dataList.push(_this.$parent.$parent.editCondition);
                                _this.$daydao.$ajax({
                                    url: gMain.apiBasePath + "route/" + oSendObj.infoSetId + "/insert.do",
                                    data: JSON.stringify(oSendObj),
                                    success: function(data) {
                                        if (data.result == "true") {
                                            _this.$emit("changeAddOptionEvent", 'btn');  // 用于改变addlist.vue页面 btn: 新增按钮标识  update: 更新页面  add: 新增   change: 行数据更换编辑
                                            _this.$emit("changeAddOptionEvent", 'add');  // 用于改变addlist.vue页面 btn: 新增按钮标识  update: 更新页面  add: 新增   change: 行数据更换编辑
                                            _this.$Message.success('新增成功');
                                        }
                                    }
                                });
                            }
                        })
                    })
                }
                catch (e) {
                    console.log(e.message);
                }

                /**
                 * 格式化详情列表数据
                 */
                function formatSendData(items) {
                    var arr = [];
                    items.forEach(function(item) {
                        if (item.cellType == 'date') {
                            // 日期
                            let date = _this.formatCustomDate(item.value, item.cellType);
                            if (uniqData(item.name, date)) {
                                arr.push({
                                    key: item.name,
                                    value: date
                                })
                            }
                        }
                        else if (item.cellType == 'treeAdviceSelect' || item.cellType == 'treeSelect') {
                            // 下拉框
                            if (uniqData(item.name, item.value)) {
                                arr.push({
                                    key: item.name,
                                    value: item.id
                                })
                            }
                        }
                        else if (item.cellType == 'radio') {
                            // 单选框
                            item.treeSelectData.forEach(function(selectItem) {
                                if (selectItem.name != item.value) return false;
                                if (uniqData(item.name, item.value)) {
                                    arr.push({
                                        key: item.name,
                                        value: selectItem.id
                                    })
                                }
                            })
                        }
                        else if (item.cellType == 'switch' || item.cellType == 'sw') {
                            arr.push({
                                key: item.name,
                                value: item.value ? 1 : 0
                            })
                        }
                        else {
                            console.log(item.name)
                            if(item.name == 'fee'){
                                if (uniqData(item.name, item.value)) {
                                    arr.push({
                                        key: item.name,
                                        value: item.value
                                    })
                                }
                            }
                            else{
                                if (uniqData(item.name, item.value)) {
                                    arr.push({
                                        key: item.name,
                                        value: item.value
                                    })
                                }
                            }

                        }

                    })
                    console.log('arr', arr)
                    return arr;
                }

                /**
                 * 判断是否有修改的数据
                 */
                function uniqData(key, value) {
                    let isUniq = true,
                        obj = JSON.parse(JSON.stringify(_this.$parent.addListData));

                    if (_this.blockItem.uuid) {
                        obj.data.forEach((item)=>{
                            if(item.uuid == _this.blockItem.uuid) {
                                obj = item;
                                return false;
                            }
                        })

                        // 修改，去除没有变更的数据
                        obj.data.forEach((item)=>{
                            if(item.name == key && item.value == value) isUniq = false;
                        })
                    }
                    else {
                        // 新增，去除为空的数据
                        if (!value) isUniq = false;
                    }

                    return isUniq;
                }
            },

            /**
             * 格式化表单数据和表单验证规则
             */
            formatFormAndRuleCustom(endFn) {
                var _this = this;

                _this.blockItem.data.forEach((item)=>{
                    let key = item.name,
                        val = item.value;

                    // 表单数据对象
                    if (item.cellType == 'date' || item.cellType == 'time' || item.cellType == 'dateTime') {
                        _this.formCustom['detail_list_' + (_this.blockItem.uuid || 'add') + '_' + key] = _this.formatCustomDate(val, item.cellType);
                    }
                    else if (item.cellType == 'treeSelect' || item.cellType == 'treeAdviceSelect') {
                        _this.formCustom['detail_list_' + (_this.blockItem.uuid || 'add') + '_' + key] = item.id;
                    }
                    else {
                        _this.formCustom['detail_list_' + (_this.blockItem.uuid || 'add') + '_' + key] = val;
                    }

                    // 表单验证规则
                    _this.ruleCustom['detail_list_' + (_this.blockItem.uuid || 'add') + '_' + key] = [];
                    if (item.isMust && item.cellType != 'switch') {    // 必填

                        let json = { required: true };
                        json.trigger = 'false';
                        if (!item.cellType || item.cellType == 'text' || item.cellType == 'textarea') {
                            // 文本框
                            json.message = item.title + '不能为空';
                            //json.trigger = 'blur';
                        }
                        else if (item.cellType == 'date') {
                            // 日期
                            json.message = '请选择' + item.title;
                            //json.trigger = 'change';
                        }
                        else if (item.cellType == 'treeAdviceSelect' || item.cellType == 'treeSelect') {
                            // 下拉选择框
                            json.message = '请选择' + item.title;
                            //json.trigger = 'change';
                        }
                        else if (item.cellType == 'radio') {
                            // 单选框
                            json.message = '请选择' + item.title;
                            //json.trigger = 'change';
                        }
                        else if (item.cellType == 'checkbox') {
                            // 复选框
                            json.min = 1;
                            json.message = '至少选择一个' + item.title;
                            //json.trigger = 'change';
                        }
                        else {
                            console.log('未知的类型，将配置成blur验证规则' + item.title);
                            json.message = item.title + '不能为空';
                            //json.trigger = 'blur';
                        }

                        _this.ruleCustom['detail_list_' + (_this.blockItem.uuid || 'add') + '_' + key].push(json);
                    }

                    if (item.regExpress && item.cellType != 'switch') {    // 获取的数据中有验证规则
                        let json = {};

                        json.pattern = new RegExp(item.regExpress);
                        json.message = item.title + '格式不正确';
                        json.trigger = 'false';

                        _this.ruleCustom['detail_list_' + (_this.blockItem.uuid || 'add') + '_' + key].push(json);
                    }
                })

                endFn && endFn();
            },
            /**
             * 格式化日期对象
             * date 时间对象
             * type 时间类型
             */
            formatCustomDate(date, type) {
                if (!date) return '';

                let str = '',
                    oDate = new Date(date),
                    year = oDate.getFullYear(),
                    month = oDate.getMonth() + 1,
                    day = oDate.getDate(),
                    hours = oDate.getHours(),
                    minutes = oDate.getMinutes(),
                    seconds = oDate.getSeconds(),
                    toDou = function(n) {
                        return n = n < 10 ? '0' + n : n;
                    };


                if (type == 'date') {
                    // 日期 yyyy-MM-dd
                    str = year + '-' + toDou(month) + '-' + toDou(day);
                }
                else if (type == 'time') {
                    // 时间 HH:mm:ss
                    str = toDou(hours) + ':' + toDou(minutes) + ':' + toDou(seconds);
                }
                else if (type == 'dateTime') {
                    // 日期+时间 yyyy-MM-dd HH:mm:ss
                    str = year + '-' + toDou(month) + '-' + toDou(day) + ' ' + toDou(hours) + ':' + toDou(minutes) + ':' + toDou(seconds);
                }
                else if (sDateType == "date_worktime") {
                    // H:mm
                    str = hours + ':' + toDou(minutes);
                }
                else if (sDateType == "date_yyyy_MM_dd_HH_mm") {
                    // yyyy-MM-dd HH:mm
                    str = year + '-' + toDou(month) + '-' + toDou(day) + ' ' + toDou(hours) + ':' + toDou(minutes);
                }
                else if (sDateType == "date_yyyy_MM_dd_HH") {
                    // yyyy-MM-dd HH
                    str = year + '-' + toDou(month) + '-' + toDou(day) + ' ' + toDou(hours)
                }
                else if (sDateType == "date_yyyy_MM") {
                    // 日期 yyyy-MM-dd
                    str = year + '-' + toDou(month) + '-' + toDou(day);
                }
                else if (sDateType == "date_yyyy") {
                    //"yyyy"
                    str = year
                }
                else {
                    console.log('未知的时间类型：' + type);
                }

                return str;
            }
        },
        watch: {
            'blockItemData': {
                handler(newValue, oldValue) {
                    this.blockItem = newValue;

                    // 重置表单验证条件
                    this.formCustom = {};
                    this.ruleCustom = {};
                },
                deep: true
            },
            'treeSelectData': {
                handler(newValue, oldValue) {
                    this.treeSelecArray = JSON.parse(JSON.stringify(newValue));
                },
                deep: true
            }
        },
    }
</script>
