<style lang="scss">
    $prefixCls:'page_table_data_list';  /*前缀*/
    $defaultColor : #657180;
    $activeColor  : #F18950;
    $base : '.page-btns';

    .#{$prefixCls}{
        position: relative;

        //页面名称
        &-page-name{
            float: left;
            font-size: 16px;
            color: $defaultColor;
            height:40px;
            line-height:40px;
            padding-left:10px;
            float: left;
            font-weight: 600;
        }

        &-page-top-right{
            float: right;
        }

        #page_dropdown_inner{
            position: relative;
            height: 34px;
            display: inline-block;

            &.empty-navigationDataStyle{
                height: 10px;
                min-width: 50px;
            }
        }


        .hs-head{
            padding: 8px 8px 0;
        }

        /*头像*/
        @mixin head_img{
            width:36px;
            height:36px;
            border-radius: 50%;
            display: inline-block;
            overflow: hidden;
            vertical-align: middle;
        }
        .base_head_img_img{
            @include head_img;
        }
        .base_head_img{
            @include head_img;
            text-align: center;
            line-height: 36px;
            font-style: normal;
            font-size: 12px;
            color: #fff;
        }

        //左上方按钮容器
        &-page-group-btns{
            position: relative;
        }

    }

</style>

<template>
    <div :class="[prefixCls, 'clearfix']" :style="{minHeight:iPageTableDataListHeight + 'px'}">

        <slot name="page-top">
            <div :class="[prefixCls + '-page-top', 'clearfix']">
                <h1 :class="[prefixCls + '-page-name']">
                    <span>{{$route.meta.title}}</span>
                </h1>

                <div :class="[prefixCls + 'page-top-right']">
                    <!--可被重写的页面标题和页面按钮-->
                    <slot name="page-top-right">

                    </slot>
                </div>
            </div>
        </slot>

        <!--可被重写的页面搜索组件的放置区域-->
        <slot name="page-search">

            <high-search
                v-if="searchCondition.length>0"
                :datePickDefault="datePickDefault"
                :searchCondition="searchCondition"
                :configSearchCondition="configSearchCondition"
                :fetchFuzzySearch="fetchFuzzySearch"
                @getSearchCondition="getSearchCondition"
                ref="highSearch"
                :style="highSearchStyle"
            >
            </high-search>
        </slot>

        <slot name="page-btn-group">
            <div :class="[prefixCls + '-page-group-btns']" :style="oPageGroupStyle">
                <btn-group :btns="defineBtns"></btn-group>
            </div>
        </slot>


        <!--可被重写的页面的下拉树导航-->
        <slot name="page-tree-menu">
            <div id="page_dropdown_inner" :class="[{'empty-navigationDataStyle':!navigationData.length}]">
                <template v-if="navigationData.length">
                    <drop-tree-menu
                        v-if="isDrop"
                        ref="treeMenu"
                        :treeStyleId="leftTreeId"
                        :isAutoInit="false"
                        :isFirstTriggerNodeClick="false"
                        :isShowInclude="false"
                        :isShowDisableOrgTool="isShowDisableOrgTool"
                        @on-treenode-click="clickMenuCallback"
                    ></drop-tree-menu>
                    <page-tree-menu ref="treeMenu" @clickMenuCallback="clickMenuCallback" v-if="!isDrop && Array.isArray(navigationData) && navigationData.length" :navigationData="navigationData" ></page-tree-menu>
                </template>
            </div>
        </slot>

        <!--可被重写的页面表格区域-->
        <div class="page_table clearfix">
            <transition name="fade" mode="out-in">

                <!--可被重写的表格列表-->
                <slot name="table-list">
                    <table-list
                        v-if="tableColumnData.length && showStyle == 'table'"
                        :tableColumnData="tableColumnData"
                        :tableData="tableData"
                        :pageSize="pageSize"
                        :iOperateWidth="iOperateWidth"
                        :isDataLoaded="!spinShow"
                        :iTableHeight="200"
                        :span-method="spanMethod"

                        @onChangePage="changePage"
                        @onShowDataClick="showDataClick"
                        @on-sort-change="onSortChange"

                        @on-current-change="onCurrentChange"
                        @on-row-click="onRowClick"
                        @on-row-dblclick="onRowDblclick"
                        @on-select="onSelect"
                        @on-select-all="onSelectAll"
                        @on-selection-change="onSelectionChange"

                        :isShowSelectionRow="isShowSelectionRow"
                        :getOperateHtml="getOperateHtml"
                        :operateRow="operateRow"
                        @on-click-operate="onClickOperate"
                        @cell-click="cellClick"
                        ref="tableList"></table-list>
                </slot>

                <!--可被重写的卡片列表-->
                <slot name="card-list">
                    <card-list
                        v-if="tableColumnData.length && showStyle == 'card'"
                        :tableColumnData="tableColumnData"
                        :tableData="tableData"
                        :pageSize="pageSize"
                        :cardListOptions="cardListOptions"
                        @onChangePage="changePage"
                    >
                    </card-list>
                </slot>


            </transition>
        </div>


        <Spin size="large" fix v-if="spinShow" :background="'rgba(255, 255, 255, 0.9)'" :zIndex="10">
            <slot>正在为您准备数据...</slot>
        </Spin>
    </div>
</template>


<script type="text/babel">

import tableList from "commonVueLib/tableList/index"; //表格列表
import pageTreeMenu from "commonVueLib/pageTreeMenu/index"; //组织树
import dropTreeMenu from "commonVueLib/dropTreeMenu/index"; //组织树
import highSearch from 'commonVueLib/highSearch'; //高级搜索
import btnGroup from 'commonVueLib/btnGroup'; //高级搜索
import changeTableCard from 'commonVueLib/changeTableCard/index'; //表格卡片切换
import cardList from 'commonVueLib/cardList/index'; //卡片列表
import utils from 'commonVueLib/utils/index' //工具库


    export default {
        name: 'tableDataList'
        ,props:{
            /**
             * 页面信息集的ID
             * */
            infoSetId:{
                type:String
                ,default:""
            }
            ,cardListOptions:{
                type:Object
                ,default(){
                    return {};
                }
            }
            //操作列的宽度
            ,iOperateWidth:{
                type:Number
                ,default:100
            }
            //操作列函数，getOperateHtml(scope){return '字符串就是操作列要显示的内容';}
            ,getOperateHtml:{
                type:Function
            }
            ,operateRow:{
                type:Object,
                default(){
                    return {
                        fixed:true,
                        label:"操作",
                        align:"left"
                    };
                }
            }
            //自定义按钮
            ,defineBtns:{
                type:Array
                ,default(){
                    return [];
                }
            }
            //是否显示表格复选框
            ,isShowSelectionRow:{
                type:Boolean
                ,default:false
            }
            /**
             * 表格数据接口传的参数
             * */
            ,queryData:{
                type:Object
            }
            //是否首次组件自动加载表格数据
            ,isFirstAutoGetData:{
                type:Boolean
                ,default:true
            }
            //获取表头的接口
            ,getTableColumnUrl:{
                type:String
            }
            //获取表头接口的自定义参数
            ,getTableColumnParams:{
                type:Object
            }
            //获取表格数据的接口
            ,getAllUrl:{
                type:String
            }
            //是否启用模糊搜索
            ,isFetchFuzzySearch:{
                type:Boolean
                ,default:true
            }
            //是否使用默认的dropTree组织导航
            ,isDrop:{
                type:Boolean
                ,default:true
            }
            //每页条数,默认20
            ,iPageSize:{
                type:Number
                ,default:20
            }
            //是否显示导航树上的“禁用组织”按钮
            ,isShowDisableOrgTool:{
                type:Boolean
                ,default:false
            }
            //合并单元格方法
            ,spanMethod:{
                type:Function
            }
        }
        /**
         * 组件
         * */
        ,components:{
            tableList  //表格列表组件
            ,dropTreeMenu //组织树
            ,pageTreeMenu //组织树
            ,highSearch //高级搜索
            ,cardList //卡片列表
            ,changeTableCard //卡片表格切换按钮
            ,btnGroup
        }
        ,data:function () {
            var t = this;
            return {
                 prefixCls:'page_table_data_list'  /*样式前缀*/
                ,tableColumnData:[]  //表头数据
                ,tableData: {} //表体数据,
                ,oQueryData:{"pageBean":{"pageNo":"1","pageSize":20}}
                ,navigationData:[] //左侧下拉树导航数据
                ,isShowPageDataInfo:false //是否弹出详情
                ,datePickDefault:''
                ,searchCondition:[]
            	,configSearchCondition:null
            	,showStyle:sessionStorage.getItem("listShowStyle"+gMain.sDdh+this.$route.fullPath) || "table" // table/card (表格/卡片) 两种模式，默认是表格
	    	    ,pageSize:t.iPageSize //每页条数
                ,extBtn: []    // 其他按钮数据
                ,functionRange: []    // 基础按钮数据
                ,detailConfigMap: {
                    addListRows: 2,         // 新增单据列表的列数
                    tableColumn: {},        // 当前表格数据
                    selectRowData: {},

                    addListItmes: [],       // 新增列表数据
                    detailListItems: {},    // 详情页面数据
                    detailTitle: '',        // 详情标题
                    detailType: '',         // 详情标题后面的图标 '&#xe6a2;'
                }
                ,detailStateMap: {
                    importListFlag: false,
                    detailListFlag: false,
                    addListFlag: false
                }
                ,spinShow: true  //数据加载前的遮罩

                //getTableColumn.do接口获取的原始数据
                ,getTableColumnData:null
                ,iPageTableDataListHeight:$(window).height() - $("#header_crosswise_bar").height() - 100 //表格容器一屏的最小高度，为了遮罩loading居中服务的
                ,highSearchStyle:''
                ,leftTreeId:'leftTreeId'+(new Date()).getTime()
            }
        }
        ,watch:{
            /**
             * 传过来的查询数据
             * */
            queryData(val,old){
                var t = this;
                $.extend(t.oQueryData,val);
            },
            /**
             * 信息集ID，信息集ID改变，重新查询表格
             * */
            infoSetId(val,old){
                var t = this;
                t.oQueryData.infoSetId = val;
                t.getTableColumn();
            }
        }
        ,computed:{
            oPageGroupStyle(){
                var t = this;
                if(t.searchCondition.length){
                    return {'position':'absolute','top':'43px','left':'8px','marginLeft':'initial','marginTop':'initial'};
                }else{
                    return {'position':'relative','top':'initial','left':'initial','marginLeft':'8px','marginTop':'2px'};
                }
            }
        }
        ,created:function () {
            var t = this;


            t.oQueryData.infoSetId = t.infoSetId;
            $.extend(t.oQueryData,t.queryData);

        }
        ,activated(){
            var t = this;
            //此处应用于刷新跳转 this.$router.push({path:'/person_list', query: { keepAlive: 'false' }});
            if(t.$route.query.keepAlive == 'false'){
                t.getTableColumn();
            }
        }
        ,mounted:function () {
            var _this = this;
            var t = this;

            t.getTableColumn();

            //TODO搜索旁边的日期框，临时
            setTimeout(function () {
                t.datePickDefault = utils.dateFormat(new Date(),"yyyy-MM-dd"); //初始化为今天的
            },200);


            // 新增页面中的操作按钮
            _this.detailConfigMap.addListButtons = [
                {
                    text: '保存并继续新增',
                    style: 'background: #F18950; float: left;',
                    click: function () {
                        console.log('保存并继续新增');
                        // TODO

                    }
                },
                {
                    text: '保存',
                    style: 'background: #F18950',
                    click: function () {
                        console.log('保存');
                        // TODO
                        _this.addPersonList(_this.formatAddListItem());
                    }
                },
                {
                    text: '取消',
                    style: 'background: #fff; color: #000;',
                    click: function () {
                        console.log('取消');
                        _this.isShowPageDataInfo = false;   // 隐藏右侧滑动框
                        console.log(_this.formatAddListItem())  // 获取格式化后的数据，方便开发者拿到数据直接做操作
                    }
                }
            ]

            //初始化数据
            var timerResize = null;
            $(window).on("resize",function () {
                clearTimeout(timerResize);
                timerResize = setTimeout(function () {
                    t.setPageTableDataListHeight();
                },200);
            });
            t.setPageTableDataListHeight();

        }
        ,methods: {
            /**
             * 点击左侧下拉树导航的回调
             * @data 被点击树节点的节点数据
             * */
            clickMenuCallback:function (event, treeId, treeNode) {
                var t = this;
                $.extend(t.oQueryData,{navigationCondition:t.isDrop ? treeNode.condition : event.condition});
                t.getTableData(); //第一次默认选中第一个树导航菜单之后进行的一次数据查询
            }
            /**
             * 设置组件的最小高度
             * */
            ,setPageTableDataListHeight(){
                var t = this;
                t.iPageTableDataListHeight = $(window).height() - $(t.$el).offset().top - 150;
            }
            ,getTableColumn(){
                var t = this;
                let oPostData = {infoSetId: t.infoSetId};
                if(t.getTableColumnParams){
                    $.extend(oPostData,t.getTableColumnParams);
                }
                /**
                 * 获取表头及其他配置数据
                 * */
                t.$daydao.$ajax({
                    url: t.getTableColumnUrl || gMain.apiBasePath + "route/"+t.infoSetId+"/getTableColumn.do"
                    ,data:JSON.stringify(oPostData)
                    ,success:function (data) {
                        if(data.result == "true"){
                            t.getTableColumnData = data;
                            t.tableColumnData = t.formatTableData(data.columnEdit);
                            t.navigationData = data.navigationData || [];
                            t.searchCondition = data.searchCondition;
                            t.detailConfigMap.addListItmes = data.columnEdit || [];
                            t.detailConfigMap.tableColumn = data;
                            t.extBtn = data.extBtn || [];
                            t.functionRange = data.functionRange || [];


                            setTimeout(function(){
                                if (Array.isArray(t.navigationData) && t.navigationData.length) {
                                    //初始化表格数据
                                    var navigationCondition = null;
                                    var searchConditionList = [];

                                    if(t.$refs.treeMenu){

                                        var getTreeMenu = new Promise(function(resolve , reject){
                                            t.$refs.treeMenu.treeMenuName = t.$refs.treeMenu.treeMenuName || "dropTreeMenu";
                                            if (t.$refs.treeMenu.treeMenuName === "dropTreeMenu") {
                                                t.$refs.treeMenu.getLeftTreeMenuData({archive:false} , resolve)
                                            }else if(t.$refs.treeMenu.treeMenuName === "pageTreeMenu"){
                                                t.$refs.treeMenu.getMyNavigationData(data.navigationData , resolve);
                                            }
                                        })
                                        getTreeMenu.then(function(node){

                                            if(t.$refs.treeMenu.treeMenuName === "dropTreeMenu"){
                                                if(node.condition){
                                                    navigationCondition = t.$refs.treeMenu?node.condition:null;
                                                }else{
                                                    return false;
                                                }
                                            }else if(t.$refs.treeMenu.treeMenuName === "pageTreeMenu"){
                                                navigationCondition = t.$refs.treeMenu?node.condition:null;
                                            }

                                            searchConditionList = t.$refs.highSearch?t.$refs.highSearch.getSearchList():[];
                                            $.extend(t.oQueryData,{
                                                navigationCondition:navigationCondition,
                                                searchConditionList:searchConditionList
                                            });

                                            //判断是否需要首次自动加载表格数据
                                            if(t.isFirstAutoGetData){
                                                t.getTableData();
                                            }
                                        })


                                    }else if(t.$slots["page-tree-menu"]){
                                        /*
                                         *判断是否重写了treeMenu
                                         * 影响功能：组织与人员
                                         */
                                        searchConditionList = t.$refs.highSearch?t.$refs.highSearch.getSearchList():[];
                                        $.extend(t.oQueryData,{
                                            navigationCondition:navigationCondition,
                                            searchConditionList:searchConditionList
                                        });
                                        t.$emit('after-get-table-column'); //表头数据获取完回调

                                        //判断是否需要首次自动加载表格数据
                                        if(t.isFirstAutoGetData){
                                            t.getTableData();
                                        }
                                    }

                                }else{
                                    t.highSearchStyle = {'marginBottom' : '10px'};
                                    var searchConditionList = t.$refs.highSearch?t.$refs.highSearch.getSearchList():[];
                                    $.extend(t.oQueryData,{
                                        navigationCondition:null,
                                        searchConditionList:searchConditionList
                                    });
                                    t.$emit('after-get-table-column'); //表头数据获取完回调

                                    //判断是否需要首次自动加载表格数据
                                    if(t.isFirstAutoGetData){
                                        t.getTableData();
                                    }
                                }

                                t.$refs.tableList && t.$refs.tableList.setTableHeight();
                            },100)



                        }
                    }
                });
            }
            /**
             * 获取表格数据
             * @param data {Object} 调用getAll.do接口额外传递的一些参数
             * */
            ,getTableData:function (data) {
                var t = this;
                data = data || {}
                t.$daydao.$ajax({
                    url: t.getAllUrl || (gMain.apiBasePath + "route/"+t.infoSetId+"/getAll.do")
                    ,beforeSend:function () {
                        t.spinShow = true;
                    }
                    ,complete:function () {
                        t.spinShow = false;
                    }
                    ,data:JSON.stringify($.extend(t.oQueryData,data))
                    ,success:function (data) {
                        if(data.result == "true"){
                            t.tableData = data || {};
                            $("body").scrollTop(0); //查询完数据滚动条滚动到顶部
                        }
                    }
                });
            }
            /**
             * 翻页传数据
             * */
            ,changePage:function (opts) {
		        var t = this;
	            t.pageSize = opts.pageSize;
	            $.extend(t.oQueryData,{pageBean:opts});

	            //这里延迟调用获取数据请求，因为改变pageSize会同时触发onChangePageNo事件，这里会被再次回调，再次回调的平均时间为0.3ms，超过这个延迟时间即可
	            clearTimeout(t.timerGetTableData);
                t.timerGetTableData = setTimeout(function () {
                    t.getTableData();
                },10)
            }
            /**
             * 新增按钮
             * */
            ,buttonsAdd:function () {
                this.isShowPageDataInfo = true;
            }
            /**
             * 排序
             * */
            ,onSortChange(opts){
                var t = this;
                t.getTableData({
                    "sort":{"sortName":opts.prop|| '',"sortStatus":opts.order?(opts.order=='descending'?'desc':'asc'):''}
                });
            }
            /**
             * 导出Excel
             * */
            ,exportExcel(){
                var t = this;

                sessionStorage.setItem("exportData", JSON.stringify({
                    tableColumnData: t.tableColumnData //显示列的字段
                    ,aColumnShowData: t.$refs.tableList.aColumnShowData //显示列的字段
                    ,oQueryData:t.oQueryData //getAll参数对象
                }));
                t.$router.push("/exportData/" + t.infoSetId);

            }
            /**
             * 搜索组件执行搜索的回调
             * */
            ,getSearchCondition(condition ,  resolve){
                var t = this;
                t.getTableData({searchConditionList:condition}); //重新查询表格数据
                resolve(function () {
                    setTimeout(function () {
                        t.$refs.tableList && t.$refs.tableList.setTableHeight();
                    },100);
                });
            }
            /**
             * 处理表头数据
             * */
            ,formatTableData(arr){
                var t = this;
                arr = arr || [];
                var newArr = [];
                arr.forEach(function (item,index) {
                    //这里可以加逻辑判断，判断是哪个字段来生成特殊样式的数据，如头像，或者是加下划线的数据
                    newArr.push(item);
                });
                return newArr;
            }
            /**
             * 改变显示风格
             * */
            ,afaterChangeTableCard(status){
                var t = this;
                t.showStyle = status;
            	sessionStorage.setItem("listShowStyle"+gMain.sDdh+t.$route.fullPath,status); //把当前页面的显示模式缓存起来
            }
	        /**
	         * 点击表格序号旁边的查看按钮，获取一行的数据对象
	         * */
	        , showDataClick: function (oRow) {
	            var _this = this;
                _this.detailConfigMap.selectRowData = oRow;

	        }
            /**
             * 模糊搜索
             * */
	        , fetchFuzzySearch(val, cb) {
	            if(this.isFetchFuzzySearch){
                    this.$daydao.$ajax({
                        url: gMain.apiBasePath + "route/personName/suggest",
                        data: JSON.stringify({ "corpId": gMain.oUser.corpId, "keyword": val }),
                        success: function (data) {
                            cb(data);
                        }
                    })
                }
	        }
            /**
             * 新增员工
             * */
            , addPersonList: function (items) {
                var _this = this;
                var oSendObj = {};
                oSendObj.dataList = items;
                oSendObj.infoSetId = 'person_list';
                oSendObj.navigationCondition = {
                    and: true,
                    childCondition: null,
                    equal: false,
                    joinAlias: null,
                    joinBean: null,
                    key: "hr_org.org_id_queue",
                    value: "like '0001!%'"
                }

                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "route/person_list/insert.do",
                    data: JSON.stringify(oSendObj),
                    beforeSend: function () {
                        t.spinShow = true;
                    },
                    complete: function () {
                        t.spinShow = false;
                    },
                    success: function (data) {
                        console.log(data)
                    }
                })
            }
            /**
             * 格式化新增列表数据
             * @returns {Array}
             */
            , formatAddListItem: function () {
                var _this = this;
                var resultItmes = [];
                _this.detailConfigMap.addListItmes.forEach(function (item, index) {
                    if (item.cellType == 'treeSelect' || item.cellType == 'treeMultipleSelect') {
                        if (item.value) {
                            resultItmes.push({
                                key: item.name,
                                value: item.value.conditionValue
                            })
                        }
                        else {
                            resultItmes.push({
                                key: item.name,
                                value: ''
                            })
                        }
                    }
                    else {
                        if (item.value) {
                            resultItmes.push({
                                key: item.name,
                                value: item.value
                            })
                        }
                        else {
                            resultItmes.push({
                                key: item.name,
                                value: ''
                            })
                        }
                    }
                });

                return resultItmes;
            }
            /**
             * 获取选中所有行的数据
             * */
            ,getSelectedRows(){
                var t = this;
                return t.$refs.tableList.aSelectionData || [];
            }
            /**
             * 删除表格数据
             * */
            ,deleteTableData(){
                var t = this;
                var aSelect = t.getSelectedRows();
                if(aSelect.length){
                    t.$Modal.confirm({
                        title: '删除提示',
                        content: '<p>请确定是要删除选中的<strong style="color: #00a2e5;font-weight: bold;">'+aSelect.length+'</strong>条数据吗？</p>',
                        onOk: () => {
                            var aSendData = {infoSetId:t.infoSetId,uuidLists:[]};

                            for(var i=0;i<aSelect.length;i++){
                                aSendData.uuidLists.push(aSelect[i].uuid);
                            }

                            t.$daydao.$ajax({
                                url:gMain.apiBasePath +"route/"+ t.infoSetId +"/del.do",
                                data:JSON.stringify(aSendData),
                                success:function(data){
                                    if(data.result == "true"){
                                        //更新导航组织树
                                        if(data.statusCode && data.statusCode == "2000"){
                                            t.$Message.success('删除成功，2秒后刷新页面');
                                            //t.quickMenuNav.updateTreeDataAndDom({isReloadMmg:true});
                                        }else{
                                            t.$Message.success('删除成功');
                                            if(t.infoSetId == 'multi_org'){
                                                //t.initMainMenu();   // 更新组织树
                                            }
                                            else{
                                                t.getTableData(); //重新加载数据
                                            }
                                        }
                                    }
                                }
                            });
                        },
                        onCancel: () => {

                        }
                    });
                }else{
                    t.$Message.warning('请先选择需要删除的数据');
                }
            }
            /**
             * 当表格的当前行发生变化的时候会触发
             * */
            ,onCurrentChange(currentRow, oldCurrentRow) {
                var t = this;
                t.$emit("on-current-change",currentRow, oldCurrentRow);
            }
            /**
             * 行的单击事件
             * */
            ,onRowClick(oItem){
                var t = this;
                t.$emit("on-row-click",oItem);
            }
            /**
             * 行的双击事件
             * */
            ,onRowDblclick(oItem){
                var t = this;
                t.$emit("on-row-dblclick",oItem);
            }
            /**
             * 选择数据
             * */
            ,onSelect(selection,row){
                var t = this;
                t.$emit("on-select",selection,row);
            }
            /**
             * 选择全部数据
             * */
            ,onSelectAll(selection){
                var t = this;
                t.$emit("on-select-all",selection);
            }
            /**
             * 选择数据的改变
             * */
            ,onSelectionChange(selection){
                var t = this;
                t.$emit("on-selection-change",selection);
            }
            /**
             * 操作列的点击
             * */
            ,onClickOperate($event,scope){
                var t = this;
                t.$emit("on-click-operate",$event,scope);
            }
            /**
             * 单元格的点击
             * */
            ,cellClick(row, column, cell, event){
                var t = this;
                t.$emit("cell-click",row, column, cell, event);
            }
        }
    }
</script>


