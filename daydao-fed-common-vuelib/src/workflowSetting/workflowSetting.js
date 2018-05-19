/**
 * Created by wubinbin on 2017/11/14.
 */

import selectPerson from 'commonVueLib/selectPerson/index.js'; //组织选人组件

export default {
    name: 'workflowSetting',
    props:{
        //传入参数workflowAuditStyleId
        workflowAuditStyleId:{
            type:[String,Number]
            ,default:''
        },
        //流程设置详情
        getDetail:{
            type:String
            ,default(){
                return gMain.apiPath + "apiWorkflow/wfFlow/detail.do";
            }
        },
        //新增
        getInsertDo:{
            type:String
            ,default(){
                return gMain.apiPath + "apiWorkflow/wfFlow/insert.do";
            }
        },
        //更新
        getUpdateDo:{
            type:String
            ,default(){
                return gMain.apiPath + "apiWorkflow/wfFlow/update.do";
            }
        },
        //是否显示导航头部
        getShowHeader:{
            type:Boolean,
            default:true
        },
        //是否显示底部按钮
        getShowBottom:{
            type:Boolean,
            default:true
        }
    },
    components:{
        selectPerson
    },
    data() {
        return {
            gMain:gMain,
            prefixCls:'workflow-set'
            ,headerTitle:''
            //默认一个审批人的信息
            ,oAudit:{
                node_number : "", //节点
                dataType:"", //审批人的类型
                audit_pos_id : "", //职位ID
                audit_pos_name : "", //职位名称
                audit_person_id : "", // 人员ID
                audit_person_name : "", //人员名称
                audit_person_img : "", //人员头像
                //节点高级特性，如：上级循环，自由节点，直属上级
                audit_loop : {
                    "loop_type" : "",
                    "not_contain" : [], //不包含的人员
                    "cut_off" : ""
                },
                field_permissions : [],  //发起人、审批人的字段权限：json格式数据
                is_auto_audit:false, //是否自动审批
                isSelected:false  //默认不选中
            }
            //默认发起人的信息
            ,oStartPerson:{
                node_number : "1", //发起人默认节点为1
                dataType:"pos", //发起人类型
                audit_pos_id : "",
                audit_pos_name : "发起人",
                audit_person_id : "",
                audit_person_name : "", //审批人名称
                audit_person_img : "", //头像
                audit_loop : {
                    "loop_type" : "",
                    "not_contain" : [],
                    "cut_off" : ""
                },
                field_permissions : [],  //发起人、审批人的字段权限：json格式数据
                process_cc : [],  //抄送人
                process_cc_list : [],  //抄送人回填
                is_auto_audit:false, //是否自动审批
                skip_same_audit:false, //默认不跳过重复审批人标识
                process_cc_field_permissions : [],  // 抄送人字段权限：json格式数据
                conditions_audit:[] //条件审批数据
            }
            ,auditInfo:{} //当前审批人的详情信息
            ,aFields:[] //表单的json
            ,auditDataList: [] //审批流程：审批人节点列表
            ,loop_typename:{
                '':'指定人员',
                "1":"逐级审批",
                "2":"直属上级",
                "3":"自由节点"
            }
            ,is_auto_audit:false  //是否自动审批
            ,is_auto_audit_model:'否'
            ,is_auto_audit_readonly:false //是否自动审批按钮的只读属性
            ,currentWorkflowType:"0"  // 当前流程类型 0:固定流程，1：条件流程
            ,processPersonList:[] //抄送人列表
            ,selectPersonList:[] //指定人员列表
            ,selectPersonType:'mul' //默认选择为多选
            ,is_skip_same_audit:'否'
            ,node_set_value: '指定人员' //节点设置默认为指定人员
            ,is_loop_type:'' //默认为指定人员
            ,is_show_select_person:false
            ,isMultiAndSingle:false //选人组件是否为单选还是多选 false单选 true多选
            ,selectType: 3 //默认人员
            ,spinShow:true //加载中
            ,isShowHeader:true //是否显示头部
            ,auditStyleId:"" //流程Id
        };
    },
    created: function () {
        const t = this;
        t.headerTitle = '流程设置';
    },
    mounted(){
        const t = this;
        t.init();
    },
    methods: {
        //返回
        goBack() {
            this.$router.go(-1)
        },
        init:function () {
            const t = this;
            var oStartPerson = $.extend({},JSON.parse(JSON.stringify(t.oStartPerson))); //默认发起人的信息

            if(t.workflowAuditStyleId === ""){ //默认初始化流程设置
                t.spinShow = false;
                t.auditDataList = [oStartPerson]; //审批人节点列表
                t.auditInfo = t.auditDataList[0]; //当前节点审批人详情
                t.auditDataList[0].isSelected = true; //默认选中发起人

            }else{
                //接口获取流程Json
                t.initAuditDataList();
            }
        },
        /**
         * 获取流程Json
         * @type 流程类型，默认0为固定流程 1为条件流程
         * **/
        initAuditDataList(type = 0) {
            const t = this;
            if(type === 0){
                t.$daydao.$ajax({
                    url:t.getDetail
                    ,data:JSON.stringify({auditStyleId:String(t.workflowAuditStyleId)})
                    ,success:function (data) {
                        if(data.result == "true"){
                            if(data.data.auditStyle){
                                t.spinShow = false;

                                let aAudit = JSON.parse(data.data.auditStyle);
                                for(let i=0;i<aAudit.length;i++){
                                    aAudit[i].node_number = String(i+1);
                                }
                                t.auditDataList =  aAudit;  //获取审批节点json

                                t.showAuditInfo(0,t.auditDataList[0]);  //选中第一个审批节点
                            }

                        }
                    }
                });
            }
        },

        /**
         * 审批人详情信息
         * @$index 节点序列数
         * @item 当前节点
         * */
        showAuditInfo($index,item) {
            const t = this;
            t.auditInfo = JSON.parse(JSON.stringify(item));

            //如果不是发起人
            if($index != 0){
                t.is_auto_audit_model = item.is_auto_audit == true?'是':'否'; //监控是否自动审批
            }else{
                //发起人节点 存在抄送人，需要回填
                if(t.auditInfo.process_cc.length > 1){

                    t.auditInfo.process_cc.forEach(function (item,index) {
                        let obj = {}
                        obj.personId = Number(item.person_id);
                        obj.personName = String(item.person_name);
                        obj.headImg = item.person_img;

                        t.processPersonList.push(obj);
                    });
                }

                //是否跳过重复审批人
                t.is_skip_same_audit = t.auditInfo.skip_same_audit == true?'是':'否';
            }

            //节点设置
            if(t.auditInfo.audit_loop.loop_type == ""){
                t.node_set_value = '指定人员';
            }else if(t.auditInfo.audit_loop.loop_type == "1"){
                t.node_set_value = '逐级考核';
            }else if(t.auditInfo.audit_loop.loop_type == "2"){
                t.node_set_value = '直属上级';
            }
            t.is_loop_type = t.auditInfo.audit_loop.loop_type;

            t.auditDataList.forEach(function (obj,index) {
                obj.isSelected = false;
                //添加选中的状态
                if(obj.node_number == item.node_number){
                    obj.isSelected = true;

                    //节点设置为指定人员时，左侧显示
                    if(t.auditInfo.audit_loop.loop_type === "" && item.audit_person_id === '' && item.node_number != '1'){
                        obj.audit_person_name = '指定人员';
                    }
                }
            });
            t.auditDataList = JSON.parse(JSON.stringify(t.auditDataList));

        },

        /**
         * 删除节点
         * @item 节点
         * @index 节点序数
         * */
        removeAuditPerson(item,index){
            const t = this;
            //移除当前选中的节点，回到发起人节点
            if(t.auditDataList[index].isSelected){
                t.auditDataList[0].isSelected = true;
                t.auditInfo = JSON.parse(JSON.stringify(t.auditDataList[0]));
                t.auditInfo.node_number = "1";
            }
            t.auditDataList.splice(index,1);

            //重新设置节点序号
            t.auditDataList.forEach((item,index) => {
                t.auditDataList[index].node_number = String(index+1);
            });
            t.auditDataList = JSON.parse(JSON.stringify(t.auditDataList));
        },

        /**
         * 添加节点
         * **/
        addAuditPerson(){
            const t = this;
            let len = t.auditDataList.length;
            let personArr = {
                node_number : len+1, //节点
                dataType:"person",
                audit_pos_id : "",
                audit_pos_name : "",
                audit_person_id : "",
                audit_person_name : "未设置",
                audit_person_img : "",
                audit_loop : {
                    "loop_type" : "",
                    "not_contain" : [],
                    "cut_off" : ""
                },
                isSelected:false,  //默认不选中
                is_auto_audit:false, //是否自动审批
                skip_same_audit:false,
                field_permissions : [],  //发起人、审批人的字段权限
                conditions_audit:[] //条件审批数据
            };
            t.auditDataList.push(personArr);
        },

        /**
         * 更新审批节点
         * */
        updateAuditDataList() {
            let t = this;
            t.auditInfo.isSelected = true;  //让当前选中的节点保持选中
            for(let i=0;i<t.auditDataList.length;i++){
                if(t.auditDataList[i].isSelected){
                    t.auditDataList[i] = t.auditInfo;
                }
            }
            t.auditInfo = JSON.parse(JSON.stringify(t.auditInfo));

            t.auditDataList = JSON.parse(JSON.stringify(t.auditDataList));
        },

        /**
         * 节点设置切换
         * */
        selectNodeType($event) {
            let t = this;
            let list = ['指定人员','逐级考核','直属上级'];
            let type = "";
            switch ($event){
                case list[0]:
                    type = "";
                    t.auditInfo.audit_person_name = '指定人员'; //当前节点名称为指定人员
                    break;
                case list[1]:
                    type = "1";
                    break;
                case list[2]:
                    type = "2";
                    break;
                default:
                    break;
            }
            //loop_type：默认指定人员 1（逐级考核），2（直属上级）
            t.auditInfo.audit_loop.loop_type = type;
            t.is_loop_type = type;

            t.updateAuditDataList();
        },

        /**
         * personSelectBtn 选择人员
         * @type process 添加抄送人，assign 修改指定人员
         * */
        personSelectBtn(type) {
            let t = this;
            t.is_show_select_person = true;
            t.$refs.selectPersonModel.reset();

            if(type === 'assign'){
                t.selectType = 3; //选人
                t.isMultiAndSingle = false;
                t.selectPersonList = [];

                if(t.auditInfo.audit_person_id != ''){
                    let oAudit ={};
                    oAudit.posId = t.auditInfo.audit_pos_id;
                    oAudit.posName = t.auditInfo.audit_pos_name;
                    oAudit.personId = t.auditInfo.audit_person_id;
                    oAudit.personName = t.auditInfo.audit_person_name;
                    oAudit.headImg = t.auditInfo.audit_person_img;
                    t.selectPersonList.push(oAudit);
                }

                t.selectPersonList= $.extend(true,[],t.selectPersonList);

            }
            if(type === 'process'){
                t.selectType = 3; //选人
                t.isMultiAndSingle = true;

                t.processPersonList = [];
                for(let i = 0; i<t.auditInfo.process_cc.length; i++){
                    let obj ={
                        personId:"",
                        personName:"",
                        headImg:""
                    };
                    obj.personId = t.auditInfo.process_cc[i].person_id;
                    obj.personName = t.auditInfo.process_cc[i].person_name;
                    obj.headImg = t.auditInfo.process_cc[i].person_img;
                    t.processPersonList.push(obj);
                }
                t.processPersonList= $.extend(true,[],t.processPersonList);
            }
        },
        /**
         * 指定人员 ok
         * **/
        selectResult(data){
            const t = this;
            t.selectPersonList = $.extend(true,[],t.$refs.selectPersonModel.selectedData.personData);

            let aResult = t.selectPersonList[0]; //选人结果集 单选
            let node_number = t.auditInfo.node_number;

            let oAudit = $.extend({},JSON.parse(JSON.stringify(t.oAudit)));
            oAudit.dataType = 'person';
            oAudit.node_number = node_number;
            oAudit.isSelected = true;
            oAudit.audit_person_name = '指定人员';
            if(aResult){
                oAudit.audit_pos_id = aResult.posId;
                oAudit.audit_pos_name = aResult.posName;
                oAudit.audit_person_id = aResult.personId;
                oAudit.audit_person_name = aResult.personName;
                oAudit.audit_person_img= aResult.headImg;
            }
            t.auditInfo = $.extend(t.auditInfo,oAudit);

            t.updateAuditDataList(); //更新审批节点
        },

        /**
         * 抄送人 ok
         * **/
        processResult(){
            let t = this;
            t.processPersonList = $.extend(true,[],t.$refs.selectPersonModel.selectedData.personData);
            let aPersonList = [];
            t.processPersonList.forEach(function (item,index) {
                let obj ={
                    person_id:"",
                    person_name:"",
                    person_img:""
                };
                obj.person_id = item.personId;
                obj.person_name = item.personName;
                obj.person_img = item.headImg;
                aPersonList.push(obj);
            });
            t.auditInfo.process_cc = aPersonList;

            t.updateAuditDataList(); //更新审批节点

        },

        /**
         * 删除选择(抄送人或指定人员)
         * @$event
         * @item
         * @type 类型
         * */
        removePersonSelect($event,item,type){
            const t = this;
            $event.stopPropagation();

            if(type === 'assign'){
                let assignObj = {
                    node_number : item.node_number, //节点
                    dataType:"person",
                    audit_pos_id : "",
                    audit_pos_name : "",
                    audit_person_id : "",
                    audit_person_name : "指定人员",
                    audit_person_img : ""
                };
                t.auditInfo = $.extend(t.auditInfo,assignObj);
            }else{

                t.auditInfo.process_cc.forEach(function (obj,index) {
                    if(obj.person_id == item.person_id){
                        t.auditInfo.process_cc.splice(index,1);
                    }
                });
                //回填
                if(t.processPersonList.length > 0){
                    t.processPersonList.forEach(function (obj,index) {
                        if(obj.personId == item.person_id){
                            t.processPersonList.splice(index,1);
                        }
                    });
                }
            }
            t.updateAuditDataList();
        },

        /**
         * 是否自动跳过重复审批
         * */
        skipAutoAudit(status) {
            let t = this;
            t.is_skip_same_audit = status;

            if(t.currentWorkflowType == "0"){
                t.auditInfo.skip_same_audit = status == '是'?true:false;
                t.updateAuditDataList(); //更新当前选择节点数据
            }
        },

        /**
         * 是否自动审批
         * */
        changeAutoAudit(status) {
            var t = this;
            t.is_auto_audit_model = status;
            t.auditInfo.is_auto_audit = status == '是'?true:false;

            if(t.currentWorkflowType == "0"){
                t.updateAuditDataList(); //更新当前选择节点数据
            }
        },

        /**
         * cancel 取消
         * */
        cancel(){
            let t =this;
            t.$router.go(-1)
        },

        /**
         * 保存
         * **/
        saveDate(){
            const t = this;
            let url = t.workflowAuditStyleId === ""? t.getInsertDo: t.getUpdateDo;

            let aStyle = JSON.parse(JSON.stringify(t.auditDataList));
            if($.isArray(aStyle)) {
                for (let i = 0; i < aStyle.length; i++) {
                    delete aStyle[i].isSelected; //去掉是否选中的属性
                }

                let oJson = {
                    auditStyle: JSON.stringify(aStyle)
                }
                if(t.workflowAuditStyleId != ""){
                    oJson.auditStyleId = t.workflowAuditStyleId
                }

                //未添加审批人
                if (aStyle && aStyle.length < 2) {
                    if(aStyle[0].node_number == '1' && !aStyle[0].skip_same_audit){
                        this.$Message.warning("请添加审批人");
                        return false;
                    }
                }else{
                    for (let i = 0; i < aStyle.length; i++) {
                        if(aStyle[i].node_number != '1' && aStyle[i].audit_person_id == '' && aStyle[i].audit_loop.loop_type == ''){
                            let node_number = i + 1;
                            let messgae = '节点' + node_number + '未选择审批人';
                            this.$Message.warning(messgae);
                            return false;
                        }
                    }
                }

                t.$daydao.$ajax({
                    url:url
                    ,data:JSON.stringify(oJson)
                    ,success:function (data) {
                        if(data.result == "true"){
                            if(data.data.auditStyleId){
                                t.auditStyleId = data.data.auditStyleId;
                                t.$Message.success("保存成功");
                            }
                        }
                    }
                });
            }
        }
    }
}
