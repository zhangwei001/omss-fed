<template>
    <div class="hr_org_list clearfix">
        <ul class="page-top-left-link">
            <router-link class="org_nav_link" to="/pos_list">职位</router-link>
            <span class="seperate_ver_line">|</span>
            <router-link class="org_nav_link" to="/job_list">职务</router-link>
            <span class="seperate_ver_line">|</span>
            <router-link class="org_nav_link" to="/job_relation_chart" style="color:#F18950;">职务体系图</router-link>
        </ul>
        <!-- <button class="btn_padding page_btn" @click="exportJobChart">导出职务体系图</button> -->
        <div v-if="isPersonListTable" class="table_wrapper" :style="{top:tableAlignTop+'px',left:tableAlignLeft+'px'}">
            <div style="postion:absolute;">
                <i class="table_triangle_up"></i>
                <i class="table_close_icon my_ivu_icon ivu-icon-close" style="font-size:16px;" @click="closeTable"></i>
            </div>
            <div class="main_table_content">
                <Table :columns="personTableColumns" :data="personTableDatas"></Table>
            </div>
        </div>
        <div id="job_system_content">
            <div class="job_system_nav">
                <p id="job_system_nav" class="systemType">
                    <label>显示方向：</label>
                    <span><input type="radio" name="systemRadio" data-state="row" id="row" checked/>
                        <label for="row">横向</label>
                    </span>
                    <span><input type="radio" name="systemRadio" data-state="col" id="col" />
                        <label for="col">纵向</label>
                    </span>
                </p>
                <p id="systemType" class="systemType"></p>
            </div>
            <div id="job_system_table_main"></div>
        </div>
        <Spin size="large" fix v-if="isLoading"></Spin>
    </div>
</template>

<style lang="scss">
    .page-top-left-link {
        padding: 8px 0px;
        color: #657180;
        font-size: 16px;
    }

    .org_nav_link {
        padding-left: 12px;
        padding-right: 12px;
        color: #657180;
    }

    .header_split_line {
        background: #eaebec;
        position: absolute;
        height: 1px;
        width: 190px;
        transform: rotate(16.8855deg);
        margin-left: -12px;
    }

    .org_nav_link:hover {
        color: #F18950;
    }

    .seperate_ver_line {
        color: #E3E8EE;
    }

    .btn_padding {
        margin: 0px 0px 10px 10px;
    }

    .page_btn {
        height: 30px;
        padding: 0 11px;
        display: inline-block;
        background-color: #fff;
        border: 1px solid #E3E8EE;
        border-radius: 2px;
        color: #657180;
        font-size: 14px;
        cursor: pointer;
    }

    .job_relation_head {
        position: relative;
        background-color: #f6f7f8;
        font-size: 14px;
    }

    .job_relation_head_column {
        padding: 0 12px;
        width: 100px;
        border: 1px solid #eaebec;
    }












    /*职务体系图 -- Start*/

    #job_system_table_main {}

    .job_system_box {
        text-align: center;
        position: relative;
    }

    .job_system td {
        padding: 0 10px;
    }

    .lvTable td,
    #lv_header td {
        position: relative;
        font-size: 12px;
    }

    .lvTable span,
    #lv_header span {
        display: block;
        width: 100px;
    }

    #table2>div {
        color: #FFFFFF;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        white-space: nowrap;
        line-height: 20px;
        cursor: pointer;
    }

    #table2 {
        position: relative;
    }

    .job_system span {
        width: 70px;
        max-height: 65px;
        display: block;
    }

    #header_td {
        position: relative;
    }

    #header_td p:first-child {
        padding-left: 50%;
    }

    #header_td p:last-child {
        padding-right: 50%;
    }

    #header_line {
        background: #eaebec;
        position: absolute;
        left: 50%;
        height: 1px;
    }

    .job_system_left {
        position: absolute;
        left: 0;
        background: #FFFFFF;
        padding-left: 20px;
    }

    .job_system_right {
        padding-bottom: 20px;
        /*min-height: 426px;*/
    }

    .job_system_left tr,
    #lv_header tr {
        background: #f6f7f8;
    }

    #header_td,
    #lv_header td {
        border-top: 1px solid #eaebec;
    }

    #header_td,
    #lv_header td,
    .job_system tr,
    .lvTable tr {
        border-bottom: 1px solid #eaebec;
    }

    .job_system td,
    #header_td {
        border-left: 1px solid #eaebec;
    }

    .job_system_right td,
    .job_system_left {
        border-right: 1px solid #eaebec;
    }

    .job_system_nav {
        text-align: left;
        padding: 10px 0;
        background: #ffffff;
    }

    .job_system_box_1 {
        padding-left: 20px;
    }

    .job_system_box_1 td,
    .job_system_box_1 #header_td,
    .job_system_box_1 #header_td,
    .job_system_box_1 #lv_header td,
    .job_system_box_1 tr {
        text-align: center;
        border: 0;
    }

    .job_system_box_1 #table2>div {
        white-space: normal;
    }

    .job_system_box_1 #table2>div>span {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        text-align: center;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        /* IE 9 */
        -moz-transform: translate(-50%, -50%);
        /* Firefox */
        -webkit-transform: translate(-50%, -50%);
        /* Safari 和 Chrome */
        -o-transform: translate(-50%, -50%);
        /* Opera */
    }

    .job_system_box_1 #header_td,
    .job_system_box_1 #table1,
    .job_system_box_1 #lv_header tr,
    .job_system_box_1 #table2 tr {
        border-bottom: 1px solid #eaebec;
    }

    .job_system_box_1 td,
    .job_system_box_1 #header_td {
        border-right: 1px solid #eaebec;
    }

    .job_system_box_1 #header_td,
    .job_system_box_1 #table1 {
        background: #f6f7f8;
    }

    .job_system_box_1 .job_system_top tr tr,
    .job_system_box_1 #header_td {
        border-top: 1px solid #eaebec;
    }

    .job_system_box_1 .job_system_top,
    .job_system_box_1 .job_system_bottom {
        border-left: 1px solid #eaebec;
    }

    .job_system_box_1 span {
        display: inline-block;
    }

    .systemType {
        text-align: left;
        margin-top: 16px;
        padding-left: 22px;
    }

    .systemType label {
        color: #939ba6;
        margin-right: 5px;
    }

    .systemType a,
    .systemType span {
        color: #4C4C4C;
        padding: 1px 5px;
        border-radius: 3px;
        margin-right: 10px;
    }

    .systemType a.on {
        background-color: #F18950;
        padding: 8px 14px;
        color: #fff;
    }



    .my_ivu_icon {
        display: inline-block;
        font-family: Ionicons;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        text-rendering: auto;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
    }

    .table_close_icon {
        position: absolute;
        right: 8px;
        top: 10px;
    }

    .table_close_icon:hover {
        cursor: pointer;
    }

    .table_wrapper {
        position: absolute;
        z-index: 1000;
        width: 600px;
        left: 25%;
        background: #FFFFFF;
        border-radius: 6px;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.20);
        margin-bottom: 30px;
    }

    .main_table_content {
        margin-top: 40px;
        max-height: 280px;
        overflow-y: scroll;
        padding: 0 16px 16px;
    }
    .table_triangle_up{
        position: absolute;
        top: -10px;
        left: 50%;
        width:0;
        height: 0;
        border-left: 9px solid transparent;
        border-right:9px solid transparent;
        border-bottom:9px solid #657180;
    }







    /*.systemType span{margin-right: 15px;}*/

    .systemType span input {
        vertical-align: middle;
    }











    /*职务体系图 -- End */
</style>

<script type="text/babel">
    import systemCol from "components/job_caculate/systemCol.js"
    import systemRow from "components/job_caculate/systemRow.js"
    const infoSetId = "org_list";  //页面信息集ID

    export default {
        name: infoSetId
        , data() {
            var t = this;
            return {
                infoSetId: infoSetId
                , cardListOptions: {
                    boldFields: ["indent_name"] //加粗显示的字段，最多两个
                }
                , orgAdd: {
                    isShowPageSlide: false
                }
                , defineBtns: [
                    {
                        name: '新增组织',
                        active: true,
                        event: () => {
                            t.orgAdd.isShowPageSlide = true;
                        }
                    },
                    {
                        name: '导入组织架构',
                        event: () => {
                            console.log("导入组织架构");
                        }
                    },
                    {
                        name: '调整记录',
                        event: () => {
                            console.log("调整记录");

                        }
                    },
                ],
                isPersonListTable: false, // 显示person列表
                tableAlignTop:"",
                tableAlignLeft:"",
                isLoading:false,
                personTableColumns: [],
                personTableDatas: [],
                jobColumns: [

                ],
                tempData: {
                    data: {}
                }


            };
        }
        , components: {

        }
        , mounted() {
            var t = this;
            t.init();
            //重写方法
        }
        , methods: {
            initJobSystem: function() {
                var _this = this;
                _this.$daydao.$ajax({
                    url: SVGAnimatedInteger.apiBasePath + "jobSystemManage/getAllJobSystemManage",
                    data: JSON.stringify({}),
                    success: function(data) {
                        console.log(data);
                        _this.jobColumns = data.category;
                        _this.formatJobSystem(data.jobPositions);

                    }
                });
            },
            formatJobSystem: function(allJobPosition) {

            },
            formatTableData(arr) {
                var t = this;
                return FormatClickAble.formatTableData(t, arr, "indent_name");
            }
            /**
             * 重写导出Excel
             * */
            , exportJobChart() {

            }
            , init: function() {
                var t = this;
                this.infoSetId = 'job_list';
                this.systemDirection = 'row';
                this.colArray = []; // 所有列 职务名称
                this.colSum = []; // 单元合并的数量
                this.row = 0; // 行数
                this.colNum = 0; // 列数
                // 定义层数指针
                this.whereCol = 1;
                this.rowChild = 0; // 计算子集行数
                this.colPosition = 0; // 层指针
                this.aposition = []; //根节点Id
                this.depth = new Array();
                //t.initMainMenu([{ "parentId": null, "url": "javascript:void(0);", "title": "组织人事" }, { "parentId": null, "url": "javascript:void(0);", "title": "职务体系" }]);
                t.changeWindowH();
                this.createBTable();
            }
            /**
             * 初始化导航
             * */
            , initMainMenu: function(aNav) {
                var t = this;
                $("#main_menu").html(aNav[aNav.length - 1].title);
                document.title = aNav[aNav.length - 1].title;
            },
            /**
             * 创建表格
             * */
            createBTable: function() {
                var t = this;
                t.$daydao.$ajax({
                    url: gMain.apiBasePath + "jobSystemManage/getAllJobSystemManage"
                    , success: function(data) {
                        if (!data.category || data.category.length == 0) {
                            t.$Message.error("请到基本数据中完善职务类型");
                            return;
                        } else if (!data.level || data.level.length == 0) {
                            t.$Message.error("请到基本数据中完善职务等级");
                            return;
                        }
                        t.getRowCol(data);
                        t.initSystemNav();
                        t.tempData.data = data;
                        t.getSystemHtml();
                    }
                });
            },
            //获取行列数
            getRowCol: function(datas) {
                var t = this;
                t.getColNum(datas.category);
                t.colNum = t.getArrayMax(t.depth);
                t.createArray(datas.category);
                //职务类型导航
                t.initSystemType();
            },
            getColNum: function(data) {
                var t = this;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children) {
                        t.whereCol++;
                        t.getColNum(data[i].children);
                    }
                    else {
                        t.row++;
                        t.depth.push(t.whereCol);
                    }
                }
                t.whereCol--;
            },
            // 创建列数组
            createArray: function(data) {
                var t = this;
                for (var i = t.colNum; i >= 1; i--) {
                    var col = [];
                    var col0 = [];
                    var col1 = [];
                    t.colArray.push(col);
                    t.colSum.push(col0);
                }
                t.getData(data);
            },
            //遍历数据
            getData: function(data) {
                var t = this;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children) {
                        var rowSum = t.getRow(data[i].children);
                        t.colSum[t.colPosition].push(rowSum);
                        t.rowChild = 0;
                        t.colArray[t.colPosition].push(data[i].name);

                        t.colPosition++;
                        t.getData(data[i].children);

                    } else {
                        //把根节点的id 保存进数组
                        //t.aposition.push(data[i].id);
                        t.colArray[t.colPosition].push(data[i].name);
                        t.colSum[t.colPosition].push(1);
                        for (var y = t.colPosition + 1; y < t.colNum; y++) {
                            t.colArray[y].push('');
                            t.colSum[y].push(1);
                        };

                    }

                }
                t.colPosition--;
            },
            //获取子集行数
            getRow: function(data) {
                var t = this;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children) {
                        t.getRow(data[i].children);
                    }
                    else {
                        t.rowChild++;
                    }
                }
                return t.rowChild;
            },
            // 求数组中的最大值
            getArrayMax: function(array) {
                var max = array[0];
                for (var i = 1; i < array.length; i++) {
                    if (array[i] > max) {
                        max = array[i];
                    }
                }
                return max;
            },
            //初始化职务类型导航
            initSystemType: function() {
                var t = this;
                var _html = '<label>职务类型：</label><a href = "javascript:;" class="on">全部</a>';
                for (var i = 0; i < t.colArray[0].length; i++) {
                    _html += '<a href = "javascript:;">' + t.colArray[0][i] + '</a>';

                }
                $('#systemType').html(_html);
                //切换 职务类型导航
                t.systemTypeChange();
            },
            //切换 职务类型导航
            systemTypeChange: function() {
                var t = this;
                $('#systemType').on('click', 'a', function() {
                    t.isPersonListTable=false;
                    var iTemp = $(this).index();
                    var oCategory = [];
                    var aJobPositions = [];
                    $(this).addClass('on').siblings().removeClass('on');
                    // var systemData = tools.Cache.getCache("systemAllData", "session") || {};
                    var systemData = t.tempData;
                    var oDatas = systemData.data;
                    if (iTemp > 1) {
                        oCategory = oDatas.category[iTemp - 2];
                        t.aposition = [];
                        t.getDodeId([oCategory]);
                        if (oDatas.jobPositions && oDatas.jobPositions.length > 0) {
                            aJobPositions = t.filterJobPositions(oDatas.jobPositions);
                        }
                        oDatas.category = [oCategory];
                        oDatas.jobPositions = aJobPositions;
                        //systemData.filterData = oDatas;

                    }
                    t.tempData["filterData"] = oDatas;
                    // tools.Cache.setCache("systemData", systemData, "session");
                    t.getSystemHtml();
                });
            },
            //获取根节点的id
            getDodeId: function(aCategory) {
                var t = this;
                for (var i = 0; i < aCategory.length; i++) {
                    if (aCategory[i].children) {
                        t.getDodeId(aCategory[i].children);
                    }
                    else {
                        t.aposition.push(aCategory[i].id);
                    }
                }
            },
            //筛选 职务等级
            filterJobPositions: function(aData) {
                var t = this;
                var aJobPositions = [];
                for (var i = 0; i < aData.length; i++) {
                    for (var j = 0; j < t.aposition.length; j++) {
                        if (t.aposition[j] == aData[i].familyId) {
                            aJobPositions.push(aData[i]);
                        }
                    }
                }
                return aJobPositions;
            },
            getSystemHtml: function() {
                var t = this;
                var temp = 1;
                var _html = '';
                var sSystemUrl = '';
                if (this.systemDirection == 'row') {
                    sSystemUrl = 'systemRow';
                } else if (this.systemDirection == 'col') {
                    sSystemUrl = 'systemCol';
                }
                // var pageLayer = layer.load(1, { shade: [0.3, '#ffffff'] }); //启用loading遮罩

                if (sSystemUrl == 'systemCol') {
                    _html += systemCol.createJobFamilyTree(t.tempData);
                } else {
                    _html += systemRow.createJobFamilyTree(t.tempData);
                }
                $('#job_system_table_main').html(_html);
                var objiStop = false;
                $('.lvTag').each(function(index, obj) {
                    $(obj).click(function(e) {
                        console.log($(obj).scrollTop,e.offsetY);
                        t.tableAlignTop=$(obj).offset().top-2*$(obj).height();
                        t.tableAlignLeft=$(obj).offset().left-$(obj).width();
                        try {
                            var value = $(obj).attr('jobid');
                            t.showPersonListTable({
                                jobId: value
                            });
                            console.log("点击了", value);
                        }
                        catch (e) {
                            console.log(e.message);
                            _this.isPersonListTable = false;
                        }
                    });
                });
            },
            // 点击事件显示人员列表
            showPersonListTable: function(options) {
                var _this = this;
                var params = {
                    editCondition: {
                        key: "job_id",
                        value: options.jobId
                    },
                    infoSetId: "job_person_tab"
                }
                // 获取表格表头数据
                if (_this.personTableColumns.length == 0) {
                    // 第一次 没有表头数据
                    _this.isLoading=true;
                    _this.$daydao.$ajax({
                        url: gMain.apiBasePath + "route/job_person_tab/getEditDataAndColumn.do",
                        data: JSON.stringify(params),
                        success: function(data1) {
                            _this.isLoading=false;
                            var editColumns = data1.beans[0].columnEdit;

                            // 表头数据处理
                            editColumns.forEach(function(item, index) {
                                if (item.isEditShow) {
                                    _this.personTableColumns.push({
                                        key: item.name,
                                        title: item.title
                                    });
                                }
                                _this.getPersonList(options.jobId);
                            });
                        }
                    });
                } else {
                    // 获取该职务所有人的信息

                    _this.getPersonList(options.jobId);

                }

            },
            // 获取人员信息
            getPersonList: function(jobId) {
                var _this = this;
                var oPostAll = {
                    editCondition: { key: "job_id", value: jobId },
                    infoSetId: "job_person_tab",
                    pageBean: { pageNo: "1", pageSize: 20 }
                }
                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "route/job_person_tab/getAll.do",
                    data: JSON.stringify(oPostAll),
                    success: function(data2) {

                        var allPeople = data2.maps;
                        if (allPeople && allPeople.length != 0) {
                            allPeople.forEach(function(item, index) {
                                var personItem = {};
                                for (var key in item) {
                                    personItem[key] = item[key];
                                }
                                _this.personTableDatas.push(personItem);
                            });
                        }
                        _this.isPersonListTable = true;
                        // 显示列表

                    }
                });
            },
            /*
             * 按钮样式切换 横向/纵向
             * */
            initSystemNav: function() {
                var t = this;
                t.getSystemNav();
                $("#job_system_content").on("click", "#job_system_nav  input", function() {
                    t.isPersonListTable=false;
                    if ($(this).is(":checked")) {
                        t.systemDirection = $(this).attr('data-state');
                        t.getSystemNav();
                        t.getSystemHtml();
                    }
                });
            },

            /*
             * 显示状态 横向/纵向
             * */
            getSystemNav: function() {
                var t = this;
                $("#job_system_content").find('#job_system_nav > a[data-state = "' + t.systemDirection + '"]').addClass('flat-blue').removeClass('flat-white').siblings().addClass('flat-white').removeClass('flat-blue');
            }
            //更改弹窗高度
            , changeWindowH: function() {
                var t = this;
                window.onresize = function() {

                }
                $('#job_system_table_main').css('height', $(window).height() - $('#job_system_table_main').offset().top - 20);
            }
            ,closeTable:function(){
                this.isPersonListTable=false;
            }
        }

    }
</script>


