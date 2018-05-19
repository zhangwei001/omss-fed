<template>
    <div class="detaile-full-page">
        <template v-if="print">
            <!-- title  -->
            <h3 class="detaile-full-title">
                <slot name="full-detail-title">
                    <span>员工详情</span>
                </slot>
                <div class="detaile-full-close" @click="goToBack"><Icon type="close-round"></Icon></div>
            </h3>


            <slot name="full-detail-nav">
                <!-- nav -->
                <nav class="detaile-full-nav">
                    <ul>
                        <li v-for="(item, index) in suspendNavData"
                            @click="navEventFn(item, index)"
                            :key="index"
                            :class="item.action ? 'active' : ''"><a>{{item.value}}</a></li>
                    </ul>
                </nav>
            </slot>
        </template>

        <slot name="full-detail-header">
            <!-- header -->
            <!--<header class="detaile-full-header">
                <div class="detaile-full-header-img">
                    <img width="86" height="86" src="https://static.daydao.com/group2/M00/03/79/wKgGoFkRpC-AW5cQAADN99k9r-4143.png"/>
                    <p class="name">{{personInfo.personName}}</p>
                    <p class="phone">{{personInfo.cellPhone}}</p>
                </div>
                <div class="detaile-full-header-base">
                    <dl>
                        <span>{{personInfo.orgName}}</span>
                        <span>|</span>
                        <span>{{personInfo.posName}}</span>
                        <span>|</span>
                        <span>总经理</span>
                        <span>|</span>
                        <span>{{personInfo.levelName}}</span>
                        <span>|</span>
                        <span>汇报上级至尊宝</span>
                    </dl>
                    <dl>
                        <label>兼职：</label>
                        <span>市场总监</span>
                        <span>|</span>
                        <span>副总经理</span>
                    </dl>
                    <dl>
                        <span>试用期</span>
                        <span>|</span>
                        <span>全职</span>
                        <span>|</span>
                        <span>2017/05/08入职</span>
                    </dl>
                </div>
                <div class="detaile-full-header-btn">
                    <Button type="warning" v-if="personInfo.validProbation"  @click="showDetailData('probation')">转正</Button>
                    <Button type="ghost" :disabled="!personInfo.validTranfer" @click="showDetailData('transfer')">调动</Button>
                    <Button type="ghost" :disabled="!personInfo.validResign" @click="showDetailData('resign')">离职</Button>
                    <Dropdown placement="bottom-start" v-on:on-click="showDetailData">
                        <Button type="ghost">
                            更多
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <Dropdown-menu slot="list">
                            <Dropdown-item name="del">删除</Dropdown-item>
                            <Dropdown-item name="rehire">重新入职</Dropdown-item>
                            <Dropdown-item name="editInfo" v-if="personInfo.validModify">修改</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </div>
            </header>-->
        </slot>
        <!-- main -->
        <div class="detaile-full-main">
            <div class="detaile-full-main-l">
                <slot name="full-detail-left">
                    <div v-for="(templateItem, index) in templateDataArr" :key="index">
                        <!--
                            specialTabType:
                            0：具备新增、修改、删除
                            1：附件列表
                            5：具备修改
                            36:不可编辑修改，只用于数据展示
                        -->

                        <!-- 编辑 -->
                        <edit-list v-if="sectionItem.specialTabType == '5'"
                                   v-for="(sectionItem, index) in templateItem"
                                   :key="index"
                                   :editListData="sectionItem" :getPersonInfo="getPersonInfo"></edit-list>

                        <!-- 新增 -->
                        <add-list v-else-if="sectionItem.specialTabType == '0'"
                                  :addListData="sectionItem"></add-list>

                        <!-- 列表 -->
                        <attachment-list v-else-if="sectionItem.specialTabType == '1'"
                                         :attachmentListData="sectionItem"></attachment-list>

                        <!-- 表格 -->
                        <table-list v-else-if="sectionItem.specialTabType == '36'"
                                    :tableListData="sectionItem"></table-list>

                        <!-- 自定义模版 templateId -->
                        <custom-template v-else-if="sectionItem.specialTabType == '14'"
                                         :customTemplateData="sectionItem"></custom-template>
                    </div>
                </slot>
            </div>
            <slot name="full-detail-right">
                <div class="detaile-full-main-r" v-if="print">
                    
                        <!--<section class="detaile-full-main-r-item">
                            <h4>考勤</h4>
                            <ul class="detaile-full-main-r-list">
                                <li>
                                    <label>考勤规则：</label>
                                    <dl>规则一</dl>
                                </li>
                                <li>
                                    <label>请假规则：</label>
                                    <dl>规则一</dl>
                                </li>
                            </ul>
                        </section>
                        <section class="detaile-full-main-r-item">
                            <h4>薪酬</h4>
                            <ul class="detaile-full-main-r-list">
                                <li>
                                    <label>薪酬规则：</label>
                                    <dl>规则一</dl>
                                </li>
                                <li>
                                    <label>基本工资：</label>
                                    <dl>4000.00</dl>
                                </li>
                            </ul>
                        </section>
                        <section class="detaile-full-main-r-item">
                            <h4>社保</h4>
                            <ul class="detaile-full-main-r-list">
                                <li>
                                    <label>薪酬规则：</label>
                                    <dl>规则一</dl>
                                </li>
                                <li>
                                    <label>基本工资：</label>
                                    <dl>4000.00</dl>
                                </li>
                            </ul>
                        </section>-->
                    <operate-data ref="operate" @refreshPersonBaseInfo="refreshPersonBaseInfo"></operate-data>
                    
                </div>
            </slot>
        </div>

    </div>
</template>

<script>
    // 引入组件
    import editList from "./editList.vue"; //表格列表
    import addList from "./addList.vue"; //表格列表
    import attachmentList from "./attachmentList.vue"; //表格列表
    import operateData from "./operateData.vue"; //操作记录
    import tableList from "./tableList.vue"; //表格
    import customTemplate from "./customTemplate.vue"; //自定义模版

    import {daydaoDropSelect,daydaoDropSelectMul} from 'commonVueLib/daydaoDropSelect/index'


    export default{
        name: 'detailFull',
        props: {
            /*editCondition: {
                type: Object,
                default(){
                    return {};
                }
            },
            tableData: {    // 表格对象，通过getTableColumn获取到的数据
                type: Object,
                default (){
                    return {}
                }
            },*/

            pageInfoSetId: {
                type: String,
                default(){
                    return '';
                }
            },
            getPersonInfo:{
                type: Function,
                default(){}
            },
            print:{
                type:Boolean,
                default:true
            },
            id: [Number,String],
            //pageInfoSetId
        },
        components: {
            daydaoDropSelect,
            editList,
            addList,
            attachmentList,
            operateData,
            tableList,
            customTemplate,
        },
        data: function(){
            return {
                personInfo:{},
                editState: true,
                suspendNavData: [],     // 悬浮导航数据
                templateDataArr: [],    // 详情数据
                editCondition: {},
                tableData: {},
            }
        },
        created: function(){
            gMain.components.commonHeader.handleShowLeftMenu(false); // 不显示左侧菜单

            $('#daydao_main_app').addClass('daydao_full_page');


        },
        mounted: function(){
            this.getTableColumn();
            this.scrollChangeNav();
        },
        beforeDestroy : function(){
            gMain.components.commonHeader.handleShowLeftMenu(true);
            $('#daydao_main_app').removeClass('daydao_full_page');
        },
        watch: {
            'pageInfoSetId': function (newValue, oldValue){
                this.getTableColumn();
            }
        },
        methods: {
	        /**
             * 返回
             */
            goToBack: function(){

                if (this.pageInfoSetId === 'person_list' || this.pageInfoSetId === 'person_out_list') {
                    this.$router.push('/'+this.pageInfoSetId);
                    return
                }
                this.$router.back();
            },
            /**
             * 自定义事件，如果操作记录“撤销”成功，则会刷新基本信息
             */
            refreshPersonBaseInfo (){
                this.$emit('refreshPersonBaseInfo', 'refresh');
            },
            /**
             * 获取各个模版的数据
             */
            getDetailTemplateData (){
                var _this = this,
                    templateIds = _this.tableData.editTemplate.templateIds;   // 模版的id集合,用于获取模版数据
                    //templateIds = _this.tableData.editTemplate.templateIds;   // 模版的id集合,用于获取模版数据

                templateIds.forEach(function(element, index) {
                    var templateData = [],  // 存储子模块里的数据集合
                        templateNames = _this.tableData.editTemplate.templateNames[index],    // 子模块的title
                        //templateNames = _this.tableData.editTemplate.templateNames[index],    // 子模块的title
                        oSendObj = {    // 请求子模块数据条件
                            infoSetId: element,
                            editCondition: _this.editCondition
                        };

                    _this.templateDataArr.push(templateData);
                    _this.$daydao.$ajax({
                        url: gMain.apiBasePath + "route/"+ element +"/getEditDataAndColumn.do",
                        data: JSON.stringify(oSendObj),
                        success: function (data) {

                            try{
                                if(data.result != 'true') return;
                                if(data.beans && data.beans.length > 0){
                                    data.beans.forEach(function(item, sIndex){
                                        try{
                                            if(item.specialTabType == '0'){
                                                // 有新增按钮

                                                templateData.push({
                                                    title: templateNames.split(',')[sIndex],
                                                    filePrefix: item.filePrefix,
                                                    //showMode: item.showMode,    // 0:列表模式、 1:卡片模式、 2:语句模式、 6:特殊模式  10:有新增按钮   11：无新增按钮
                                                    specialTabType: item.specialTabType,
                                                    templateId: element.split(',')[sIndex],  // 模版ID
                                                    data: formatTemplateData(item, true),
                                                    index: index,
                                                    addTemplate: fomatAddTemplateData(item),    // 新增时模版数据
                                                })
                                            }
                                            else if(item.specialTabType == '5'){
                                                // 只有编辑按钮

                                                templateData.push({
                                                    title: templateNames.split(',')[sIndex],
                                                    filePrefix: item.filePrefix,
                                                    //showMode: item.showMode,    // 0:列表模式、 1:卡片模式、 2:语句模式、 6:特殊模式  10:有新增按钮   11：无新增按钮
                                                    specialTabType: item.specialTabType,
                                                    templateId: element.split(',')[sIndex],  // 模版ID
                                                    data: formatTemplateData(item, false),
                                                    index: index,
                                                    isEdit: true
                                                })
                                            }
                                            else if(item.specialTabType == '1'){
                                                // 附件列表

                                                templateData.push({
                                                    title: templateNames.split(',')[sIndex],
                                                    filePrefix: item.filePrefix,
                                                    specialTabType: item.specialTabType,
                                                    templateId: element.split(',')[sIndex],  // 模版ID
                                                    data: [],
                                                    uuid: item.uuid,
                                                    specialTabParam: item.specialTabParam,
                                                    columnEdit: item.columnEdit,
                                                    isEdit: true
                                                })
                                            }
                                            else if(item.specialTabType == '36'){
                                                // 表格
                                                templateData.push({
                                                    title: templateNames.split(',')[sIndex],
                                                    filePrefix: item.filePrefix,
                                                    specialTabType: item.specialTabType,
                                                    templateId: element.split(',')[sIndex],  // 模版ID
                                                    data: [],
                                                    uuid: _this.$parent.uuid,
                                                    isEdit: true
                                                })

                                                /* var templateId = element.split(',')[sIndex],
                                                    oSendObj = {
                                                        infoSetId: templateId,
                                                        customParam: {
                                                            uuid: _this.$parent.uuid
                                                        },
                                                        editCondition: {
                                                            key: _this.editCondition.key,
                                                            value: _this.editCondition.value
                                                        },                                                    
                                                        pageBean: {pageNo: "1", pageSize: 20}
                                                    };
                                                _this.$daydao.$ajax({
                                                    url: gMain.apiBasePath+"route/"+ templateId+"/getAll.do",
                                                    data: JSON.stringify(oSendObj),
                                                    success: function(data){
                                                        templateData.push({
                                                            title: templateNames.split(',')[sIndex],
                                                            filePrefix: item.filePrefix,
                                                            //showMode: item.showMode,    // 0:列表模式、 1:卡片模式、 2:语句模式、 6:特殊模式  10:有新增按钮   11：无新增按钮
                                                            specialTabType: item.specialTabType,
                                                            templateId: templateId,  // 模版ID
                                                            data: formatAttachmenTemplateData(item.columnEdit, data.maps, templateId, item.specialTabType),//data.maps,//formatTemplateData(item, false),
                                                            isEdit: true
                                                        })
                                                    }
                                                }); */
                                            }
                                            else if(item.specialTabType == '14'){
                                                // 自定义模版类型

                                                templateData.push({
                                                    title: templateNames.split(',')[sIndex],
                                                    filePrefix: item.filePrefix,
                                                    //showMode: item.showMode,    // 0:列表模式、 1:卡片模式、 2:语句模式、 6:特殊模式  10:有新增按钮   11：无新增按钮
                                                    specialTabType: item.specialTabType,
                                                    templateId: element.split(',')[sIndex],  // 模版ID
                                                    data: formatTemplateData(item, false),
                                                    isEdit: true
                                                })
                                            }
                                            else{
                                                console.log('未知的specialTabType类型：'+ item.specialTabType);
                                            }
                                        }
                                        catch (e){
                                            console.log(e.message)
                                        }
                                    })
                                }
                            }
                            catch(e){
                                console.log(e.message)
                            }
                        }
                    })
                }, this);

                /**
                 * 格式化模版里子模块的数据
                 */
                function formatTemplateData(options, isEdit){
                    var result = [],
                        columnEdit = options.columnEdit,
                        data = options.data || [];

                        if(data && data.length>0){
                            data.forEach(function(item){
                                var arr = []
                                columnEdit.forEach(function(columnItme){

                                    if(!columnItme.isEditShow) return;

                                    if(columnItme.cellType == 'checkbox'){
                                        arr.push({
                                            title: columnItme.title,
                                            name: columnItme.name,
                                            cellType: columnItme.cellType,
                                            keyValueBean: columnItme.keyValueBean,
                                            isMust: columnItme.isMust,
                                            regExpress: columnItme.regExpress,
                                            isEditShow: columnItme.isEditShow,
                                            fieldSize: columnItme.fieldSize,
                                            fieldType: columnItme.fieldType,
                                            value: item[columnItme.name] == '1' ? true : false
                                        })
                                    }
                                    else if(columnItme.cellType == 'switch'){
                                        arr.push({
                                            title: columnItme.title,
                                            name: columnItme.name,
                                            cellType: columnItme.cellType,
                                            keyValueBean: columnItme.keyValueBean,
                                            isMust: columnItme.isMust,
                                            regExpress: columnItme.regExpress,
                                            isEditShow: columnItme.isEditShow,
                                            fieldSize: columnItme.fieldSize,
                                            fieldType: columnItme.fieldType,
                                            value: item[columnItme.name] == '是' ? true : false
                                        })
                                    }
                                    else{
                                        arr.push({
                                            title: columnItme.title,
                                            name: columnItme.name,
                                            cellType: columnItme.cellType,
                                            keyValueBean: columnItme.keyValueBean,
                                            isMust: columnItme.isMust,
                                            regExpress: columnItme.regExpress,
                                            isEditShow: columnItme.isEditShow,
                                            fieldSize: columnItme.fieldSize,
                                            fieldType: columnItme.fieldType,
                                            value: item[columnItme.name] || ''
                                        })
                                    }
                                })

                                arr.forEach((arrItem)=>{
                                    // 如果是手机号码，将判断'is_active'字段（1：激活状态；2：未激活状态），用于确定输入框是否可以编辑
                                    if(arrItem.name == 'cell_phone'){
                                        if(item['is_active']){
                                            arrItem.disabled = item['is_active'] == '1' ? true : false;
                                        }
                                        else{
                                            arrItem.disabled = false;
                                        }
                                    }
                                })

                                if(isEdit){
                                    // showMode=10 每列数据都有一个编辑的标识
                                    result.push({
                                        isEdit: true,
                                        uuid: item.uuid || '',
                                        data: arr
                                    });
                                }
                                else{
                                    // showMode=11 整个子模块一个编辑的标识
                                    result.push({
                                        uuid: item.uuid || '',
                                        data: arr
                                    });
                                }
                            })
                        }
                        else{

                            if(options.specialTabType == '14' || options.specialTabType == '5'){
                                var arr = []
                                columnEdit.forEach(function(columnItme){

                                    if(!columnItme.isEditShow) return;

                                    if(columnItme.cellType == 'checkbox'){
                                        arr.push({
                                            title: columnItme.title,
                                            name: columnItme.name,
                                            cellType: columnItme.cellType,
                                            keyValueBean: columnItme.keyValueBean,
                                            isMust: columnItme.isMust,
                                            regExpress: columnItme.regExpress,
                                            isEditShow: columnItme.isEditShow,
                                            fieldSize: columnItme.fieldSize,
                                            fieldType: columnItme.fieldType,
                                            value: false
                                        })
                                    }
                                    if(columnItme.cellType == 'switch'){
                                        arr.push({
                                            title: columnItme.title,
                                            name: columnItme.name,
                                            cellType: columnItme.cellType,
                                            keyValueBean: columnItme.keyValueBean,
                                            isMust: columnItme.isMust,
                                            regExpress: columnItme.regExpress,
                                            isEditShow: columnItme.isEditShow,
                                            fieldSize: columnItme.fieldSize,
                                            fieldType: columnItme.fieldType,
                                            value: false
                                        })
                                    }
                                    else{
                                        arr.push({
                                            title: columnItme.title,
                                            name: columnItme.name,
                                            cellType: columnItme.cellType,
                                            keyValueBean: columnItme.keyValueBean,
                                            isMust: columnItme.isMust,
                                            regExpress: columnItme.regExpress,
                                            isEditShow: columnItme.isEditShow,
                                            fieldSize: columnItme.fieldSize,
                                            fieldType: columnItme.fieldType,
                                            value: ''
                                        })
                                    }
                                })

                                if(isEdit){
                                    // showMode=10 每列数据都有一个编辑的标识
                                    result.push({
                                        isEdit: true,
                                        uuid: '',
                                        data: arr
                                    });
                                }
                                else{
                                    // showMode=11 整个子模块一个编辑的标识
                                    result.push({
                                        uuid: '',
                                        data: arr
                                    });
                                }
                            }
                        }

                    return result;
                }

                /**
                 * 获取treeselect数据
                 */
                function formatTreeSelectData(items){
                    items.forEach(function(item){
                        if(item.cellType == 'treeSelect' || item.cellType == 'radio'){
                            _this.getKeyValueData({
                                data: item.keyValueBean,
                                success: function(data){
                                    item.treeSelectData = data.beans;
                                }
                            })
                        }
                    })
                }

                /**
                 * 格式化新增时模版
                 */
                function fomatAddTemplateData(options){
                    var result = [],
                        columnEdit = options.columnEdit;

                    if(columnEdit && columnEdit.length > 0){
                        columnEdit.forEach(function(item){
                            if(!item.isEditShow) return;

                            if(item.cellType == 'switch'){
                                result.push({
                                    title: item.title,
                                    name: item.name,
                                    cellType: item.cellType,
                                    keyValueBean: item.keyValueBean,
                                    isMust: item.isMust,
                                    regExpress: item.regExpress,
                                    fieldSize: item.fieldSize,
                                    fieldType: item.fieldType,
                                    value: false
                                })
                            }
                            else{
                                result.push({
                                    title: item.title,
                                    name: item.name,
                                    cellType: item.cellType,
                                    keyValueBean: item.keyValueBean,
                                    isMust: item.isMust,
                                    regExpress: item.regExpress,
                                    fieldSize: item.fieldSize,
                                    fieldType: item.fieldType,
                                    value: ''
                                })
                            }
                        })
                    }
                    return {
                        isEdit: false,
                        data: result
                    }
                }

                /**
                 * 格式化表格数据
                 */
                function formatTableListTemplateData(columnData, listData){
                    console.log('columnData', columnData, 'listData', listData)

                    var result = {};
                    result.updataColumns = [];  // 表头数据
                    result.updataData = []; // 附件数据

                    // 格式化附件表头数据
                    columnData.forEach(function(item){
                        if(!item.isListShow) return true;
                        result.updataColumns.push({
                            title: item.title,
                            key: item.name,
                            render: (h, params) => {
                                let style = {
                                    fontSize: '14px',
                                    color: '#24AC17',
                                    marginRight: '5px'
                                }

                                if(item.name == 'file_real_name'){
                                    return h('div', [
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'image'
                                            }
                                        }),
                                        h('strong', params.row[item.name])
                                    ]);
                                }
                                else{
                                    return h('div', [
                                        h('strong', params.row[item.name])
                                    ]);
                                }
                            }
                        })
                    });

                    // 格式化附件数据
                    if(listData && listData.length > 0) {
                        listData.forEach(function (item) {
                            var json = {};
                            for (var name in item) {
                                json[name] = item[name]
                            }

                            result.updataData.push(json);
                        });
                    }

                    return result;
                }

                /**
                 * 格式化附件列表数据
                 */
                function formatAttachmenTemplateData(columnData, listData, templateId, type){
                    var result = {},
                        columnData = columnData || [],
                        listData = listData || [];
                    result.updataColumns = [];  // 表头数据
                    result.updataData = []; // 附件数据

                    if(type == '1'){

                        // 格式化附件表头数据
                        result.updataColumns.push({
                            title: '操作',
                            key: 'action',
                            width: 150,
                            align: 'center',
                            render: (h, params) => {
                                let style = {
                                    margin: '0 10px',
                                    width: '16px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }

                                return h('div', [
                                    h('Icon', {
                                        style: style,
                                        props: {
                                            type: 'ios-cloud-download'
                                        },
                                        nativeOn: {
                                            click: () => {
                                                console.log('下载');
                                                var _url = gMain.apiBasePath+'route/'+templateId+'/downfilelog.do?fileName='+params.row.file_url+'&fileRealName='+params.row.file_real_name;
                                                window.location.href = _url;
                                            }
                                        }
                                    }),
                                    h('Icon', {
                                        style: style,
                                        props: {
                                            type: 'trash-a'
                                        },
                                        nativeOn: {
                                            click: () => {
                                                console.log('删除');
                                                var oSendObj = {
                                                    infoSetId: templateId,
                                                    editCondition: {
                                                        key: 'person_id',
                                                        value: params.row.code_id
                                                    },
                                                    uuidLists: []
                                                }

                                                oSendObj.uuidLists.push(params.row.uuid);
                                                deleteFile(oSendObj)
                                            }
                                        }
                                    })
                                ]);

                                /* if(params.row.success == '0'){
                                    // 失败
                                    return h('div', [
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'refresh'
                                            },
                                            nativeOn: {
                                                click: () => {
                                                    console.log('重新上传')
                                                }
                                            }
                                        }),
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'trash-a'
                                            },
                                            nativeOn: {
                                                click: () => {
                                                    console.log('删除')
                                                }
                                            }
                                        })
                                    ]);
                                }
                                else if(params.row.success == '1'){
                                    // 上传中
                                    return h('div', [
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'pause'
                                            },
                                            nativeOn: {
                                                click: () => {
                                                    console.log('取消')
                                                }
                                            }
                                        }),
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'trash-a'
                                            },
                                            nativeOn: {
                                                click: () => {
                                                    console.log('删除')
                                                }
                                            }
                                        })
                                    ]);
                                }
                                else if(params.row.success == '2'){
                                    // 成功
                                    return h('div', [
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'ios-cloud-download'
                                            },
                                            nativeOn: {
                                                click: () => {
                                                    console.log('下载');
                                                    console.log(params)
                                                    var _url = gMain.apiBasePath+'route/'+templateId+'/downfilelog.do?fileName='+params.row.file_url+'&fileRealName='+params.row.file_real_name;
                                                    window.location.href = _url;
                                                }
                                            }
                                        }),
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'trash-a'
                                            },
                                            nativeOn: {
                                                click: () => {
                                                    console.log('删除');
                                                    var oSendObj = {
                                                        infoSetId: templateId,
                                                        editCondition: {
                                                            key: 'person_id',
                                                            value: params.row.code_id
                                                        },
                                                        uuidLists: []
                                                    }

                                                    oSendObj.uuidLists.push(params.row.uuid);

                                                    console.log(params,oSendObj)
                                                    deleteFile(oSendObj)
                                                }
                                            }
                                        })
                                    ]);
                                }
                                else{
                                    console.log('未知的附件列表状态')
                                } */

                            }
                        })
                    }
                    columnData.forEach(function(item){
                        if(!item.isListShow) return true;
                        result.updataColumns.push({
                            title: item.title,
                            key: item.name,
                            render: (h, params) => {
                                let style = {
                                    fontSize: '14px',
                                    color: '#24AC17',
                                    marginRight: '5px'
                                }

                                if(item.name == 'file_real_name'){
                                    return h('div', [
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'image'
                                            }
                                        }),
                                        h('strong', params.row[item.name])
                                    ]);
                                }
                                else{
                                    return h('div', [
                                        h('strong', params.row[item.name])
                                    ]);
                                }
                            }
                        })
                    })

                    // 格式化附件数据
                    listData.forEach(function(item){
                        var json = {};
                        for(var name in item){
                            if(name == 'file_size'){
                                json[name] = bytesToSize(item[name])
                            }
                            else{
                                json[name] = item[name]
                            }
                        }
                        
			// 附件列表，加上操作
                        if(item.file_real_name){
                            json.type = item.file_real_name.substring(item.file_real_name.lastIndexOf('.'), item.file_real_name.length);
                            json.success = '2';
                        }

                        result.updataData.push(json);
                    })

                    return result;
                }

                /**
                 * 格式化文件大小  1024为单位
                 */
                function bytesToSize(bytes) {
                    if (bytes === 0) return '0 B';

                    var k = 1024,
                        sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                        i = Math.floor(Math.log(bytes) / Math.log(k));

                    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
                    //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
                }

                function deleteFile(options){
                    _this.$daydao.$ajax({
                        url: gMain.apiBasePath +"route/"+ options.infoSetId +"/del.do",
                        data: JSON.stringify(options),
                        beforeSend:function(){
                            //_formLayer= layer.load(1, {shade: [0.3,'#ffffff']}); //启动loading遮罩
                        },
                        complete:function(){
                            //layer.close(_formLayer); //关闭loading遮罩
                        },
                        success: function(data){
                            //typeof options.success == "function" && options.success(data);
                        }
                    });
                }
            },
            /**
             * 获取表头及其他配置数据
             */
            getTableColumn (){
                var _this = this;

                if(!_this.pageInfoSetId || typeof _this.pageInfoSetId != 'string') return;
                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "route/"+ _this.pageInfoSetId +"/getTableColumn.do",
                    data:JSON.stringify({
                        infoSetId: _this.pageInfoSetId
                    }),
                    success:function (data) {
                        if(data.result == "true"){
                            console.log(data)

                            _this.editCondition = {
                                key: data.editTemplate.editConditionKey,
                                value: _this.id
                            }

                            _this.tableData = data;

                            _this.tableData.editTemplate.tabNames.forEach(function(item, index){
                                if(index == 0){
                                    _this.suspendNavData.push({
                                        value: item,
                                        action: true
                                    })
                                }
                                else{
                                    _this.suspendNavData.push({
                                        value: item,
                                        action: false
                                    })
                                }
                            })
                            //_this.suspendNavData = _this.tableData.editTemplate.tabNames;

                            _this.getDetailTemplateData();
                        }
                    }
                });
            },
            /**
             * 导航点击事件
             * @param item
             * @param index
             */
            navEventFn (item, index){
                var _this = this;

                // 改变导航当前选择的哪项
                _this.suspendNavData.forEach(function(i){
                    i.action = false;
                })
                _this.suspendNavData[index].action = true;

                // 运动的高度 = 当前div的offsetTop - 固定的高度
                var totalH = $('.detaile-full-main-l>div').eq(index).offset().top - $('.detaile-full-title').height() - $('.detaile-full-nav').height();
                $("html,body").animate({scrollTop: totalH}, 400, "swing");
            },
            /**
             * 滚动页面，来判断当前显示的是哪个导航内容
             */
            scrollChangeNav (){
                var _this = this;

                $(window).off('scroll').on('scroll', function(){
                    //console.log($('body').scrollTop())
                    var h = $('body').scrollTop() + $('.detaile-full-title').height() + $('.detaile-full-nav').height();
                    $('.detaile-full-main-l>div').each(function(index, element){
                        //console.log($(element).offset().top)

                        if(h >= $(element).offset().top && h <= $(element).offset().top + $(element).height()){
                            // 改变导航当前选择的哪项
                            _this.suspendNavData.forEach(function(i){
                                i.action = false;
                            })
                            _this.suspendNavData[index].action = true;
                        }
                    })

                    /* $('.detaile-full-title').css({
                        top: $('body').scrollTop()
                    })

                    $('.detaile-full-nav').css({
                        top: $('body').scrollTop() + $('.detaile-full-title').height()
                    }) */
                })
            }
        }
    }
</script>

<style lang="scss">
    $titltH: 46px;
    $navH: 50px;
    
    .daydao_full_page {
        #daydao_content_app_content{
            margin-left:0 !important;
        }
        #daydao_header_app {
            display : none !important; 
        }
    }


    .detaile-full-page{
        padding-top: $titltH + $navH;
    }

    // title部分
    .detaile-full-title{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: $titltH;
        line-height: $titltH;
        text-align: center;
        font-size: 16px;
        overflow: hidden;
        background: #FAFBFC;
        color: #657180;
    }

    .detaile-full-close{
        position: absolute;
        right: 0;
        top: 0;
        width: $titltH;
        height: $titltH;
        line-height: $titltH;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        //transition: 0.8s ease-out;

        /* &:hover{
             transform:rotate(360deg);
        } */
    }

    // 导航部分
    .detaile-full-nav{
        position: fixed;
        left: 0;
        top: $titltH;
        width: 100%;
        background: #fff;
        text-align: center;
        z-index: 99;

        li{
            position: relative;
            display: inline-block;
            margin-right: 12px;
            line-height: $navH;

            &:after{
                content: '';
                position: absolute;
                top: calc(50% - 1px);
                width: 12px;
                border-bottom: 1px dotted #ccc;
            }

            &:last-child{
                margin-right: 0;

                &:after{
                    display: none;
                }
            }

            a{
                display: inline-block;
                line-height: 18px;
                padding: 0 3px;
                font-size: 12px;
                color: #657180;
                background-color: #fff;
                transition: 0.3s ease-out;

                &:hover{
                    color: #F18950;
                }
            }

            &.active a{
                color: #F18950;
            }
        }
    }

    // header部分
    .detaile-full-header{
        //padding-top: 94px;
    }

    .detaile-full-header-img{
        text-align: center;

        img{
            border-radius: 50%;
            overflow: hidden;
        }

        >p{
            color: #3D4651;

            &.name{
                font-size: 18px;
                font-weight: bold;
                color : #657180;
            }

            &.phone{
                font-size: 16px;
            }
        }
    }

    .detaile-full-header-base{
        text-align: center;

        >dl{
            margin-bottom: 5px;
            line-height: 20px;
            font-size: 14px;
            color: #657180;

            >span{
                padding: 0 3px;
            }

            &:last-child{
                margin-bottom: 0;
            }
        }
    }

    .detaile-full-header-btn{
        margin-top: 15px;
        text-align: center;

        >button{
            margin-right: 10px;
        }
    }

    // 内容区域
    .detaile-full-main{
        max-width: 1440px;
        margin: 0 auto;
        display: table;
        width: 100%;
        min-width: 820px;
        padding: 0 40px;
        box-sizing: border-box;
        table-layout: fixed;
    }

    // 内容左侧
    .detaile-full-main-l{
        display: table-cell;
        width: 100%;
    }

    .detaile-full-main-l-item{
        margin-bottom: 40px;
        min-height: 120px;

        >h4{
            margin-bottom: 30px;
            position: relative;
            display: flex;
            padding-right: 36px;
            border-bottom: 1px solid #C1C6CC;
            color: #657180;
            box-sizing: border-box;

            em{
                margin-right: 6px;
                display: block;
                line-height: 36px;
                font-size: 14px;
                color: #657180;
            }

            span{
                display: block;
                line-height: 36px;
                padding-right: 5px;
                background-color: #fff;
                font-size: 18px;
            }

            i{
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

                &:hover{
                    color: #F18950;
                }
            }
        }

        &:hover{
            >h4 i{
                display: block;
            }
        }
    }

    .detaile-full-main-l-item-content{
        position: relative;
        margin-bottom: 30px;
        transition: 0.3s linear;
    }

    .detaile-full-main-l-list{
        display: flex;
        flex-wrap: wrap;
        margin: 30px 0 10px;

        >li{
            display: flex;
            width: 50%;
            line-height: 20px;
            padding-bottom: 20px;
            align-items: center;

            >label{
                width: 120px;
                padding-right: 15px;
                color: #A0A7B1;
                text-align: right;
                font-size: 14px;
            }

            >dl{
                flex: 1;
                font-size: 14px;
                color:  #3D4651;
                overflow: hidden;

                >span{
                    display: block;
                    width: (2 / 3) * 100%;
                    box-sizing: border-box;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

            }
        }
    }

    .detaile-full-main-l-item-more{
        ul.detaile-full-main-l-list{
            margin: 30px 0;
            padding: 20px 0;
            //border: 1px solid transparent;
            background: #FCFCFC;
            box-sizing: border-box;
        }

        .detaile-full-main-l-item-content{

            &:hover{

                .detaile-full-main-l-item-content-editbtn{

                    >i{
                        display: inline-block;
                    }
                }

                .detaile-full-main-l-list{
                    background: #FCFCFC;
                    //border: 1px solid #D7DDE4;
                    border-radius: 2px;
                }
            }
        }

        .detaile-full-main-l-item-content-edit{
            .detaile-full-main-l-list{
                background: #FCFCFC;
                //border: 1px solid #D7DDE4;
                border-radius: 2px;
            }
        }
    }

    .detaile-full-main-l-item-content-editbtn{
        position: absolute;
        right: 10px;
        top: 20px;

        >i{
            display: none;
            height: 20px;
            line-height: 20px;
            margin-right: 5px;
            text-align: center;
            color: #848F9D;
            cursor: pointer;
            transition: 0.3s ease-out;

            &:hover{
                color: #F18950;
            }
        }
    }

    .detaile-full-main-l-item-add{
        height: 40px;
        border-radius: 2px;
        font-size: 14px;
        color: #657180;
    }

    // 编辑状态下的样式
    .detail-edit-box{
        margin: 30px 0;
        padding: 20px 0;
        box-sizing: border-box;

        .ivu-form{
            display: flex;
            flex-wrap: wrap;
        }

        .ivu-form-item{
            display: flex;
            width: 50%;
        }

        .detail-edit-box-btns{
            width: 100%;
            text-align: right;

            .ivu-btn{
                display: inline-block;
                margin-left: 8px;
            }
        }

        .ivu-form-item-label{
            width: 120px;
            font-size: 14px;
            color: #A0A7B1;
        }

        .ivu-form-item-content{
            flex: 1;

            >div{
                width: (2 / 3) * 100%;
            }

            .daydao_drop_select_input, .daydao_drop_select_tree{
                width: 100% !important;
            }
        }

        .ivu-tooltip-rel, .ivu-tooltip{
            width: 100%;
        }
    }

    .detail-add-box{
        position: relative;
        margin: 30px 0 80px 0;
        padding: 20px 0 0 0;
        background: #FCFCFC;

        .detail-edit-box-btns{
            position: absolute;
            bottom: -70px;
        }
    }

    // 内容右侧
    .detaile-full-main-r{
        display: table-cell;
        width: 360px;
        padding-left: 40px;
    }

    .detaile-full-main-r-item{
        margin-bottom: 16px;
        background: #FAFBFC;
        border: 1px solid #CEDAE8;

        >h4{
            height: 35px;
            line-height: 35px;
            padding: 0 12px;
            font-size: 18px;
            color: #285DA4;
            background-color: #E6EFFA;
            box-sizing: border-box;
        }
    }

    .detaile-full-main-r-list{
        padding: 15px 17px;

        li{
            display: flex;
            line-height: 20px;
            padding: 5px 0;
            font-size: 14px;
            color: #657180;

            >label{
                width: 80px;
            }

            >dl{
                flex: 1;
            }
        }
    }
</style>
