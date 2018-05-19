<style lang="scss">
    $prefixCls:'page_table'; //样式前缀

    .#{$prefixCls}{
        &_list{
            position: relative;
            margin-left: -1px;


            .el-table th>.cell{
                font-weight: 600;
            }

            /*翻页*/
            .#{$prefixCls}_pager{
                width:100%;
                height:30px;
                padding:3px 0;
                background: rgba(255, 255, 255, 0.45);
                margin-top: 10px;
                margin-bottom: 10px;
                z-index: 5;
                position: relative;

                .ivu-page{
                    transform: translate(-50%,0);
                    position: absolute;
                    left: 50%;
                    white-space: nowrap;
                }
                .ivu-select-item{
                    font-size:12px!important;
                }
            }


            /*隐藏显示列*/
            .#{$prefixCls}_column_show{
                position: absolute;
                top:41px;
                right:0;
                height:100px;
                min-width:310px;
                background: #525665;
                color:#fff;
                padding:20px;
                padding-left: 40px;
                height:500px;
                z-index: 9;
                min-width: 306px;

                .select_all{
                    height:45px;
                    line-height: 45px;
                }

                .select_items{
                    overflow: hidden;

                    ul{
                        overflow: hidden;
                    }
                    li{
                        width:168px;
                        float: left;
                        line-height: 34px;
                        height:34px;

                        .ivu-checkbox{
                            margin-right:10px;
                        }
                    }
                }

            }

        }

        &_list_width_data{
            position: relative;
        }

        /*单元格数据不换行*/
        &-cell-content,.el-table__footer .cell{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /*隐藏列按钮*/
        &_hide_column{
            width: 21px;
            position: absolute;
            right: 1px;
            top: 1px;
            text-align: center;
            overflow: hidden;
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            background: #f5f7f9;
            z-index: 9;

            .show_column_btn{
                font-size: 24px;
                color: #657180;
                font-weight: bold;
                line-height: 40px;
                height: 40px;
                top: 50%;
                position: absolute;
                margin-top: -20px;
                left: 50%;
                margin-left: -11px;
                width: 22px;
            }
        }

        /*暂无数据*/
        &_list_widthout_data{
            position: absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;

            &_inner{
                width:400px;
                height:226px;
                position: absolute;
                left:50%;
                top:122px;
                margin-left:-200px;
            }

            .no_data{
                background: url("./img/no-data.png") no-repeat center center;
                width:400px;
                height: 176px;
            }
            .no_data_text{
                margin-top:20px;
                line-height: 30px;
                font-size: 14px;
                color: #657180;
                text-align: center;
            }
        }
    }

</style>

<template>

    <div :class="[prefixCls + '_list','clearfix']">

        <!--有数据的时候-->
        <div :class="[prefixCls + '_list_width_data','clearfix']" v-show="myTableData.length">


            <!--表格组件-->
            <el-table
                ref="elTable"
                :data="myTableData"
                :height="myTableHeight"
                border
                @sort-change="onSortChange"
                @select="onSelect"
                @select-all="onSelectAll"
                @selection-change="onSelectionChange"
                @row-click="onRowClick"
                @row-dblclick="onRowDblclick"
                @cell-click="cellClick"
                :summary-method="getSummaries"
                :show-summary="isShowTotalRow"
                :span-method="spanMethod"
                :highlight-current-row="false"
                style="width: 100%">

                <!--复选框列-->
                <el-table-column
                    fixed
                    type="selection"
                    :resizable="false"
                    width="55" v-if="isShowSelectionRow">
                </el-table-column>

                <!--序号列-->
                <el-table-column
                    fixed
                    type="index"
                    label="序号"
                    align="center"
                    :resizable="false"
                    width="66">
                    <!--<template scope="scope">
                        <div style="white-space: nowrap;">{{getIndexHtml(scope)}}</div>
                    </template>-->
                </el-table-column>

                <!--<el-table-column-->
                    <!--fixed-->
                    <!--label="操作"-->
                    <!--:width="iOperateWidth" v-if="getOperateHtml">-->
                    <!--<template scope="scope">-->
                        <!--<div v-html="getOperateHtml(scope)" @click="onClickOperateRow($event,scope)">-->

                        <!--</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->

                <!--操作列-->
                <el-table-column
                    :fixed="operateRow.fixed"
                    :label="operateRow.label"
                    :align="operateRow.align"
                    :resizable="false"
                    :width="operateRow.render ? operateRow.width : iOperateWidth" v-if="getOperateHtml || operateRow.render">
                    <template scope="scope">
                        <TableExpand v-if="operateRow.render" :scope="scope" :render="operateRow.render"></TableExpand>
                        <div v-if="getOperateHtml" v-html="getOperateHtml(scope)" @click="onClickOperateRow($event,scope)"></div>
                    </template>
                </el-table-column>

                <!--没有合并表头的情况---也就是一级表头-->
                <el-table-column
                    v-for="item in myTableColumnData"
                    v-if="!item.label"
                    :fixed="item.fixed"
                    :prop="item.key"
                    :label="item.title"
                    :formatter="item.formatter"
                    :sortable="item.sortable"
                    :align="item.align"
                    :resizable="item.resizable"
                    :helpTipText="item.helpTipText"
                    :min-width="item.minWidth" :key="item.iIndex">

                    <!--特殊渲染模式-->
                    <template scope="scope">
                        <TableExpand v-if="item.render" :scope="scope" :render="item.render"></TableExpand>
                        <div v-else :class="[prefixCls +'-cell-content']" :title="scope.row[scope.column.property]" v-html="getRowHtml(scope)"></div>
                    </template>

                </el-table-column>

                <!--合并表头的情况-->
                <el-table-column v-for="item in myTableColumnData" :key="item.iIndex" v-if="item.label" :label="item.label" :align="'center'">
                    <!--二级表头-->
                    <el-table-column
                        v-for="item2 in item.aColumns"
                        :fixed="item2.fixed"
                        :prop="item2.key"
                        :label="item2.title"
                        :formatter="item2.formatter"
                        :sortable="item2.sortable"
                        :align="item2.align"
                        :resizable="item2.resizable"
                        :helpTipText="item2.helpTipText"
                        :min-width="item2.minWidth" :key="item2.iIndex">

                        <!--特殊渲染模式-->
                        <template scope="scope">
                            <TableExpand v-if="item2.render" :scope="scope" :render="item2.render"></TableExpand>
                            <div v-else :class="[prefixCls +'-cell-content']" :title="scope.row[scope.column.property]" v-html="getRowHtml(scope)"></div>
                        </template>

                    </el-table-column>
                </el-table-column>


            </el-table>

            <!--翻页-->
            <div :class="[prefixCls + '_pager']">
                <Page :total="parseInt(pageTotal)" size="small" :page-size="pageSize" :page-size-opts="pageSizeLimit" :current="parseInt(pageNo)" placement="top" @on-change="onChangePageNo" @on-page-size-change="onPageSizeChange" show-elevator show-sizer show-total></Page>
            </div>

            <!--隐藏显示列的按钮-->
            <div :class="[prefixCls + '_hide_column']" title="设置表头字段" @click="showTableHideColumnTool" :style="{height:iHideColumnHeight + 'px'}" v-if="!isShowTableHideColumnTool">
                <Icon type="ios-more" class="show_column_btn"></Icon>
            </div>

        </div>

        <!--无数据的时候-->
        <div :class="[prefixCls + '_list_widthout_data','clearfix']" v-show="!myTableData.length">
            <!--数据加载完成并且无数据才显示“暂无内容图片”-->
            <div :class="[prefixCls + '_list_widthout_data_inner']" v-show="isDataLoaded && !myTableData.length">
                <div class="no_data">

                </div>
                <div class="no_data_text">
                    暂无内容
                </div>
            </div>
        </div>


    </div>

</template>

<script>
    //引入表格组件
    import { ElTable,ElTableColumn } from 'commonVueLib/element-table/index.js'
    import TableExpand from "./expand.js";
    var _ = require('../utils/underscore.js')._;  //underscore工具库组件
    import selectAndSortableTool from 'commonVueLib/selectAndSortableTool/index'; //隐藏显示列工具
    import dialog from 'commonVueLib/artDialog/index.js';
    import utils from 'commonVueLib/utils/utils.js';

    var timerResize = null;
    var selectionConfig = {
        type: 'selection',
        width: 60,
        align: 'center',
        resizable:false //此列不可拖拽
    };
    export default{
        name:"tableList"
        ,components:{
            ElTable,
            ElTableColumn,
            TableExpand,
            selectAndSortableTool
        }
        ,props:{
            //表格表头数据
            tableColumnData:{
                type:Array
                ,default(){
                    return [];
                }
            }
            //表格内容数据，包含列表数组，翻页信息，翻页信息格式参考getAll.do返回，如：{maps:[],pb:{pageTotal:100,pageNo:1}}
            ,tableData:{
                type:Object
                ,default(){
                    return {};
                }
            }
            //翻页每页条数
            ,pageSize:{
                type:Number
                ,default:20
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
            //操作列的配置
            ,operateRow:{
                type:Object,
                default(){
                    return {
                        fixed:true,
                        label:"操作",
                        align:"left",
                        width:100
                    };
                }
            }
            //是否显示表格复选框
            ,isShowSelectionRow:{
                type:Boolean
                ,default:false
            }
            //是否表格数据加载完成
            ,isDataLoaded:{
                type:Boolean
            }
            //表格高度
            ,iTableHeight:{
                type:Number
            }
            //合并单元格方法
            ,spanMethod:{
                type:Function
            }
        }
        ,data () {
            var t = this;
            return {
                 prefixCls:'page_table'  //样式前缀
                ,myTableColumnData:[]  //真实的表头的数据
                ,myTableData: [] //表格数据
                ,myTotalData:{} //合计数据
                //翻页信息
                ,pageSizeLimit:[10,20,30,40,50,100]
                ,pageTotal:0  //总记录数
                ,pageNo:1 //当前页码

                ,isHasFixed:false //是否有冻结的列


                ,isSelectAllTableData:false //是否选中所有表格数据

                ,iColumnNum:0 //可显示的列的个数
                ,iColumnShowWidth:0 //显示隐藏
                ,aColumnShowData:[] //已经设置为显示的列
                ,isCheckAllColumn:false //是否已经设置了显示全部列

                ,aSelectionData:[] //多选选中的数据
                ,myTableHeight : this.iTableHeight || ''
                ,iHideColumnHeight:39 //隐藏列按钮的高度
            };
        }
        ,created(){
            var t = this;
            t.myTableColumnData = t.getTableColumnData(t.tableColumnData);

            //提取有用数据
            t.getTableData(t.tableData);

            //要发送给后端的翻页对象
            t.oPageBean = {
                "pageNo":t.pageNo
                ,"pageSize":t.pageSize
            };

        }
        /**
         * 组件el渲染之后
         * */
        ,mounted () {
            var t = this;
            var iTableWrapLeft = $(t.$el).offset().left; //容器距离左边距离

            //窗口变化
            t.timerResize = null;
            $(window).on("resize.setHeight",function () {
                clearTimeout(t.timerResize);
                t.timerResize = setTimeout(function () {
                    t.setTableHeight();
                },50);
            });


            t.timerHideCol = setInterval(function () {
                if(t.$refs.elTable && $(t.$refs.elTable.$el).find(".el-table__header-wrapper").is(":visible")){
                    clearInterval(t.timerHideCol);
                    t.setHideColumnHeight();
                }
            },100);

        }
        /**
         * keep-alive 组件激活时调用重新布局表格
         * */
        ,activated(){
            var t = this;
            if(t.$refs.elTable){
                t.$refs.elTable.doLayout(); //重新布局
            }
        }
        ,watch:{
            tableColumnData (val,oldVal) {
                var t = this;
                if(val && val.length){
                    this.myTableColumnData = t.getTableColumnData(val);
                }
            }
            ,tableData (val,oldVal) {
                var t = this;
                t.getTableData(val);
            }
            ,isSelectAllTableData(){
                var t = this;
                $(t.$el).find(".ivu-table-header").find(".ivu-checkbox-wrapper").trigger("click");
            }
            /**
             * 已经显示的列的数组
             * */
            ,aColumnShowData(val,old){
                var t = this;
                //如果勾选取消列只剩下最后一个的时候就禁用最后一个不许再取消，至少保持一个
                if(val.length == 1){
                    for(var i=0;i<t.tableColumnData.length;i++){
                        if(t.tableColumnData[i].name == val[0]){
                            t.tableColumnData[i].disabled = true; //禁用其中至少一个列要被选中
                            break;
                        }
                    }
                }else{
                    for(var i=0;i<t.tableColumnData.length;i++){
                        t.tableColumnData[i].disabled = false; //取消所有的禁用
                    }
                }
                if(val.length >= t.iColumnNum){
                    t.isCheckAllColumn = true;
                }else{
                    t.isCheckAllColumn = false;
                }
            }
            //是否显示复选框
            ,isShowSelectionRow(val,old){
                var t = this;
                if(!val){
                    t.$refs.elTable.clearSelection(); //取消选择复选框
                }
            }
            //监控翻页变化，使表格数据滚动条滚动到顶部
            ,pageNo(){
                var t = this;
                $(t.$el).find(".el-table__body-wrapper").scrollTop(0);
            }
            ,iTableHeight(val,old){
                var t = this;
                if(val){
                    t.myTableHeight = val;
                }
            }

        }
        ,computed:{
            //是否显示合计行
            isShowTotalRow(){
                return !$.isEmptyObject(this.myTotalData);
            }
            //是否显示隐藏显示列工具
            ,isShowTableHideColumnTool(){
                var t = this;
                return typeof t.spanMethod === 'function';
            }
        }
        ,methods:{
            /**
             * 重新格式化处理表头数据
             * @param arr 参数传过来的原始表头
             * @param aTempColumns 隐藏显示列组件处理之后的数据
             * */
            getTableColumnData (arr, aTempColumns) {
                var t = this;
                aTempColumns = aTempColumns || [];
                var aCloneArr = $.extend(true,[],arr);

                var isHasGroup = false; //是否有分组
                var iColumnNum = 0; //可显示的列的个数
                t.aColumnShowData = []; //重新初始化
                var aColumnCache = utils.Cache.getCache('table_columns_data'+ t.getRouterPath()) || aTempColumns; //如果存在路由地址（也就是单独的表格列表页，排除详情页）才使用缓存，否则不使用

                //表头样式设置
                aCloneArr.forEach(function (item,index) {
                    item.iIndex = 9999999;
                    //如果曾经改列设置显示过，这次在列表里面就直接显示
                    aColumnCache.forEach(function (item2) {
                       if(item2 && item.name === item2.name){
                           item.isListShow = item2.isListShow;
                           item.isLock = item2.isLock;
                           item.isFrozen = item2.isFrozen;
                           item.iIndex = item2.iIndex;
                       }
                    });

                    //如果不是固定隐藏的列
                    if(!item.isHidden){
                        iColumnNum++;
                        if(item.isListShow){
                            t.aColumnShowData.push(item.name);
                        }
                    }

                    //如果是冻结的列
                    if(item.isFrozen){
                        t.isHasFixed = true;
                    }

                    //如果是显示的列
                    if(item.isListShow && !item.isHidden){
                        item.width = item.width || 100; //没有设置宽度的默认为100处理
                        item.width = item.width < 100 ? 100:item.width; //数据的最小宽度为100
                    }
                });

                //排序
                if(Array.isArray(aColumnCache) && aColumnCache.length){
                    aCloneArr = aCloneArr.sort(function (a,b) {
                        return a.iIndex - b.iIndex;
                    });
                }


                t.iColumnNum = iColumnNum;
                selectionConfig.fixed = t.isHasFixed?"left":''; //设置复选框是否冻结

                var newArr = [];

                //表头属性赋值
                aCloneArr.forEach(function (item,index) {
                    if(item.isListShow && !item.isHidden){
                        var oItem = {
                            title:item.title
                            ,key:item.name
                            ,align:item.alignX
                            ,resizable:true //此列可拖拽
                            ,render:item.render
                            ,minWidth:item.width //列的最小宽度
                            ,sortable:item.isSortable?"custom":false //排序
                            ,groupName:item.groupName //分组名称
                            ,helpTipText:item.instruction  //表头注释说明
                            ,showFormat:item.showFormat //格式化模式，如：2保留2位小数
                            ,showType:item.showType //格式化类型，如：number
                            ,iIndex:item.iIndex //排序的序号
                        };
                        //表格冻结列
                        if(item.isFrozen){
                            oItem.fixed = 'left';
                        }
                        //表格数据格式化
                        if(item.formatter){
                            oItem.formatter = item.formatter;
                        }

                        if(oItem.groupName){
                            isHasGroup = true;
                        }else{
                            oItem.groupName = 'defalutGroup';
                        }

                        newArr.push(oItem);
                    }

                });

                //如果有分组
                if(isHasGroup){
                    newArr = _.groupBy(newArr,function (item2) {
                        return item2.groupName;
                    });

                    var newArr2 = [];
                    for(var item3 in newArr){
                        if(item3 === 'defalutGroup'){
                            newArr[item3].forEach(function (item4) {
                                newArr2.push(item4);
                            });
                        }else{
                            newArr2.push({
                                label:item3,
                                aColumns:newArr[item3]
                            });
                        }
                    }

                    return newArr2;
                }

                return newArr;
            }
            /**
             * 格式化表格数据
             * */
            ,getTableData(val){
                var t = this;
                if(val && !$.isEmptyObject(val)){
                    //表格数据
                    if(val.maps && Array.isArray(val.maps)){
                        t.myTableData = JSON.parse(JSON.stringify(val.maps));
                    }else{
                        t.myTableData = [];
                    }
                    //如果有合计数据
                    if(val.beans && Array.isArray(val.beans) && val.beans.length === 1){
                        t.myTotalData = JSON.parse(JSON.stringify(val.beans[0]));
                    }else{
                        t.myTotalData = {}; //置空
                    }

                    //后台返回的翻页信息
                    var pb = val.pb || {};
                    t.pageTotal = parseInt(pb.pageDataCount) || 0;
                    t.pageNo = parseInt(pb.pageNo) || 1;


                    //重新布局table
                    setTimeout(function () {
                        if(t.$refs.elTable){
                            t.$refs.elTable.doLayout(); //重新布局
                        }
                    },300);
                }
            }
            /**
             * 计算表格高度
             * */
            ,setTableHeight(){
                var t = this;
                //只有在tableDataList中调用的这个表格组件才自动计算高度
                if(t.$parent.prefixCls === 'page_table_data_list' && document.querySelector('.'+t.prefixCls+'_list')){
                    var rectY = document.querySelector('.'+t.prefixCls+'_list').getBoundingClientRect().top;
                    t.myTableHeight = window.innerHeight-rectY-68;
                }
            }
            /**
             * 设置隐藏列高度
             * */
            ,setHideColumnHeight(){
                var t = this;
                t.iHideColumnHeight = $(t.$refs.elTable.$el).find(".el-table__header-wrapper").height() - 1;  //减1是为了防止挡住底部的边框
            }
            /**
             * 展示数据
             * */
            ,showDataClick (index) {
                var t = this;
                t.$emit("onShowDataClick",t.myTableData[index]);
            }
            /**
             * 索引列显示的处理
             * */
            ,getIndexHtml(scope){
                var t = this;
                return (parseInt(t.pageNo) -1) * parseInt(t.pageSize) + (scope.$index + 1);
            }
            /**
             * 展示数据处理
             * */
            ,getRowHtml(scope){
                var t = this;
                if(scope.column.formatter){
                    return scope.column.formatter(scope.row, scope.column, scope.row[scope.column.property]); //三个参数分别代表row, column, cellValue
                }else{
                    return t.getFormatTypeData(scope.column.property,scope.row[scope.column.property]);
                }
            }
            /**
             * 格式化之后的数据
             * @param key 要格式化的字段的name
             * @param value 要格式化字段的值
             * */
            ,getFormatTypeData(key,value){
                var t = this;
                let cellvalue = value; //原始值
                //当前表头对象
                let oCurrentColumn = t.tableColumnData.find(function (item2) {
                    return item2.name == key;
                });
                if(oCurrentColumn && !$.isEmptyObject(oCurrentColumn)){
                    let showType = oCurrentColumn.showType;
                    let showFormat = oCurrentColumn.showFormat;

                    //根据现实类型格式化
                    if(showType){
                        switch (showType){
                            //如果是数值型
                            case "number":
                                if(showFormat){
                                    if(!cellvalue){
                                        cellvalue = 0;
                                    }
                                    cellvalue = parseFloat(cellvalue).toFixed(parseInt(showFormat));
                                }
                                break;
                            //如果没有类型，就当成是字符串处理
                            default:
                                cellvalue = cellvalue || "";

                        }
                    }else{
                        //处理所有的日期类型，把时间戳转换成时间字符串
                        var sDateType = oCurrentColumn.cellType || '';
                        //字段为date或相关date类型，并且不包含"-"、"/"、":"符号，并且日期要有值
                        if(cellvalue && !/[-\/:]/.test(cellvalue) && String(cellvalue).length >=13 && sDateType.indexOf('date') !=-1){
                            var sDateFmt = "yyyy-MM-dd"; //默认是日期型的
                            if(sDateType == "datetime"){  //如果是时间型的
                                sDateFmt = "yyyy-MM-dd HH:mm:ss";
                            }else if(sDateType == "date_worktime"){
                                sDateFmt = "H:mm";
                            }else if(sDateType == "date_yyyy_MM_dd_HH_mm"){
                                sDateFmt = "yyyy-MM-dd HH:mm";
                            }else if(sDateType == "date_yyyy_MM_dd_HH"){
                                sDateFmt = "yyyy-MM-dd HH";
                            }else if(sDateType == "date_yyyy_MM"){
                                sDateFmt = "yyyy-MM";
                            }else if(sDateType == "date_yyyy"){
                                sDateFmt = "yyyy";
                            }else if(sDateType == "date_HH_mm"){
                                sDateFmt = "HH:mm";
                            }
                            cellvalue = utils.dateFormat((new Date(cellvalue)),sDateFmt);
                        }

                    }
                    if(cellvalue !== 0){
                        cellvalue = cellvalue || "";
                    }
                }
                return cellvalue;
            }
            /**
             * 改变翻页码
             * */
            ,onChangePageNo (num) {
                var t = this;
                $.extend(t.oPageBean,{pageNo:String(num)})
                t.$emit("onChangePage",t.oPageBean);
            }
            /**
             * 改变每页条数
             * */
            ,onPageSizeChange (num) {
                var t = this;
                $.extend(t.oPageBean,{pageSize:num});
                t.$emit("onChangePage",t.oPageBean);
            }
            /**
             * 设置隐藏显示列
             * */
            ,setHideColumn(aColumns){
                var t = this;
                /*if(t.$route && t.$route.path){
                    localStorage.setItem("column_data_" + t.$route.path + gMain.sDdh,t.aColumnShowData); //把设置显示的列缓存起来
                }*/
                //给索引
                aColumns.forEach(function (item,index) {
                    item.iIndex = index; //序号
                });
                t.aTableSortCols = aColumns;
                //如果父组件是tableDataList组件就启用缓存列
                if(t.$parent.prefixCls === "page_table_data_list"){
                    utils.Cache.setCache('table_columns_data'+ t.getRouterPath(),aColumns);
                }


                //t.myTableColumnData = JSON.parse(JSON.stringify(t.getTableColumnData(aColumns))); //更新表头数据
                t.myTableColumnData = t.getTableColumnData(t.tableColumnData,aColumns); //更新表头数据

                t.columnsDialog.close().remove(); //隐藏操作隐藏列的界面

                setTimeout(function () {
                    t.setHideColumnHeight();
                },300);
            }
            /**
             * 取消设置隐藏显示列
             * */
            ,cancelSetHideColumn(){
                var t = this;
                t.aColumnShowData = JSON.parse(JSON.stringify(t.aColumnShowData_old)); //取消还原为原来的
            }
            /**
             * 全选状态发生改变的时候
             * */
            ,onCheckAllStatusChange(val){
                var t = this;
                if(val){
                    t.aColumnShowData = [];
                    t.tableColumnData.forEach(function (o,i) {
                        o.disabled = false; //取消所有的禁用
                        if(!o.isHidden){
                            t.aColumnShowData.push(o.name);
                        }
                    });
                }else{
                    t.aColumnShowData = [];
                    t.tableColumnData.forEach(function (o,i) {
                        if(o.isFrozen){
                            t.aColumnShowData.push(o.name);
                        }
                    });

                    //如果一个都没有被匹配中，就选择第一个不是深度隐藏的列
                    if(!t.aColumnShowData.length){
                        for(var i=0;i<t.tableColumnData.length;i++){
                            if(!t.tableColumnData[i].isHidden){
                                t.tableColumnData[i].disabled = true; //禁用其中至少一个列要被选中
                                t.aColumnShowData.push(t.tableColumnData[i].name);
                                break;
                            }
                        }
                    }
                }
            }
            /**
             * 表格显示隐藏按钮
             * */
            ,showTableHideColumnTool(flag){
                var t =this;
                //把原有系统设置的冻结的设置为“锁定彻底冻结”
                var aTableColumnData = $.extend(true,[],t.tableColumnData);
                aTableColumnData.forEach(function (item) {
                   if(item.isFrozen){
                       item.isLock = true;
                   }
                });

                //每次弹出的临时缓存，非确定之后的localStorage缓存
                t.aTableSortCols = $.extend(true,[],(t.aTableSortCols || aTableColumnData)); //排序列
                var aCacheTableCols = utils.Cache.getCache('table_columns_data'+t.getRouterPath());
                if(aCacheTableCols){
                    //添加序号
                    t.aTableSortCols.forEach(function (item) {
                        item.iIndex = 9999999; //一个列数的极限
                        aCacheTableCols.forEach(function (item2) {
                            if(item2 && item.name == item2.name){
                                item.isListShow = item2.isListShow;
                                item.isLock = item2.isLock;
                                item.isFrozen = item2.isFrozen;
                                item.iIndex = item2.iIndex;
                            }
                        });
                    });
                    //按照iIndex的从小到大排序
                    t.aTableSortCols = t.aTableSortCols.sort(function (a,b) {
                        return a.iIndex - b.iIndex;
                    });
                }

                //操作列的弹窗
                t.columnsDialog = dialog({
                    title:'设置表头字段'
                    ,width:800
                    ,render:function (h,options) {
                        //用选择和排序列组件来渲染
                        return h(selectAndSortableTool,{
                            //传参
                            props:{
                                aColumns:$.extend(true,[],t.aTableSortCols) //拷贝一份数据，不然再次弹窗状态不变
                                ,isSort:true
                                ,isSetFrozen:t.$parent.prefixCls === 'page_table_data_list'?true:false
                            }
                        });
                    }
                    ,ok:function () {
                        t.setHideColumn(t.columnsDialog.vueInstance.aAllData);
                        return false
                    }
                    ,cancel:function () {

                    }
                });
                t.columnsDialog.showModal();
            }
            /**
             * 获取路由路径
             * */
            ,getRouterPath(){
                var t = this;
                var sPath = '';
                if(t.$router && t.$router.history && t.$router.history.base){
                    sPath = t.$router.history.base;
                }
                if(t.$route && t.$route.path){
                    sPath = sPath + t.$route.path;
                }
                return sPath;
            }
            /**
             * 排序
             * */
            ,onSortChange(opts) {
                var t = this;
                t.$emit("on-sort-change",opts);
            }
            /**
             * 选择数据
             * */
            ,onSelect(selection,row){
                var t = this;
                t.$emit("on-select",selection,row);
            }
            /**
             * 选择数据
             * */
            ,onSelectAll(selection){
                var t = this;
                t.aSelectionData = selection;
                t.$emit("on-select-all",selection);
            }

            /**
             * 选择数据
             * */
            ,onSelectionChange(selection){
                var t = this;
                t.aSelectionData = selection;
                t.$emit("on-selection-change",selection);
            }
            /**
             * 行的单击事件
             * */
            ,onRowClick(row, event, column,$index){
                var t = this;
                //console.log(row, event, column,$index);return false;
                t.$emit("on-row-click",{
                    $event:event
                    ,iIndex:$index
                    ,rowData:row
                });
            }
            /**
             * 行的双击事件
             * */
            ,onRowDblclick(row, event, column,$index){
                var t = this;
                t.$emit("on-row-dblclick",{
                    $event:event
                    ,iIndex:$index
                    ,rowData:row
                });
            }
            /**
             * 操作列的点击
             * */
            ,onClickOperateRow($event,scope){
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
            /**
             * 获取合计行的数据
             * */
            ,getSummaries(param){
                var t = this;
                let arr = ['合计'];  //在序号那一列显示合计两个字
                //如果有显示复选框
                if(t.isShowSelectionRow){
                    arr.unshift('');
                }
                //从显示列的数组中组装数据
                t.aColumnShowData.forEach(function (item,index) {
                    arr.push(t.getFormatTypeData(item,t.myTotalData[item]));
                });
                return arr;
            }
        }
        /**
         * 组件销毁之前
         * */
        ,beforeDestroy() {
            var t = this;
            clearTimeout(t.timerResize);
            clearInterval(t.timerHideCol);
            $(window).off("resize.setHeight");
        }
    }
</script>
