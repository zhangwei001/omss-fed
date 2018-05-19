<template>
    <div class="hr_org_list clearfix">

        <table-data-list ref="tableDataList" :infoSetId="infoSetId" :cardListOptions="cardListOptions" :defineBtns="defineBtns" @cell-click="cellClick">

            <div slot="page-top">
                <ul class="page-top-left-link">
                    <router-link class="org_nav_link" to="/pos_list">职位</router-link>
                    <span class="seperate_ver_line">|</span>
                    <router-link class="org_nav_link" style="color:#F18950;" to="/job_list">职务</router-link>
                    <span class="seperate_ver_line">|</span>
                    <router-link class="org_nav_link" to="/job_relation_chart">职务体系图</router-link>
                </ul>
            </div>
            <!--这里允许通过 <div slot="模块名称"></div> 来重写列表数据组件的模板-->
        </table-data-list>
        <page-slide v-model="isShowPageSlide" :pageTitle="pageSlideTitle">
            <edit-form-infos v-if="isAddJob" infoSetId="job_list" :labelWidth="formStyle.labelWidth" :inputWidth="formStyle.inputWidth" @saveSuccessCallback="saveSuccessCallback" @cancelCallback="cancelCallback"></edit-form-infos>
            <tree-edit-list v-if="isEditJobList" treeType="job" @saveEditCallback="saveSuccessCallback" @cancelEditCallback="cancelCallback"></tree-edit-list>
            <tree-edit-list v-if="isEditLevelList" treeType="jobLevel" @saveEditCallback="saveSuccessCallback" @cancelEditCallback="cancelCallback"></tree-edit-list>
            <!-- <tree-edit treeType="job"></tree-edit> -->
        </page-slide>
        <div id="Main" style="width:300px;height:200px;">

        </div>
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

.org_nav_link:hover {
    color: #F18950;
}

.seperate_ver_line {
    color: #E3E8EE;
}

.job_reset_edit_tip {
    font-size: 12px;
    color: #657180;
    margin-left: 8px;
    font-weight: normal;
}

.job_reset_edit_tip i {
    font-style: normal;
    color: #6FB7FF;
    font-size: 18px;
    margin: 0 8px;
    position: relative;
    top: 2px;
}
</style>

<script type="text/babel">

import tableDataList from "commonVueLib/tableDataList/index"
import FormatClickAble from "components/format_clickable/format_clickable_methods.js"
import pageSlide from "commonVueLib/pageSlide/index";
import editFormInfos from "components/editFormInfos/index"
import { treeEditList, treeEdit } from "components/tree_edit_list/index"
const infoSetId = "job_list";  //页面信息集ID

export default {
    name: infoSetId
    , data() {
        var t = this;
        return {
            infoSetId: infoSetId
            , cardListOptions: {
                boldFields: ["job_name", "family_id"] //加粗显示的字段，最多两个
            }
            , defineBtns: [
                {
                    name: '新增职务',
                    active: true,
                    event: () => {
                        t.pageSlideTitle = "新增职务";
                        t.isShowPageSlide = true;
                        t.isAddJob = true;
                    }
                },
                {
                    name: '序列设置',
                    active: false,
                    event: () => {
                        t.pageSlideTitle = '序列设置 <span class="job_reset_edit_tip"><i class="iconfont_daydao_common">&#xe614;</i>职务可点住拖动</span>';
                        t.isShowPageSlide = true;
                        t.isEditJobList = true;
                    }
                },
                {
                    name: '职级设置',
                    active: false,
                    event: () => {
                        t.pageSlideTitle = '职级设置 <span class="job_reset_edit_tip"><i class="iconfont_daydao_common">&#xe614;</i>职级可点住拖动，位置在上面的职级高于下面的</span>';
                        t.isShowPageSlide = true;
                        t.isEditLevelList = true;
                    }
                },
                {
                    name: '导入职务',
                    active: false,
                    event: () => {
                        sessionStorage.setItem("importData", JSON.stringify({
                            getTableColumnData: t.$refs.tableDataList.getTableColumnData //表格配置
                            , aColumnShowData: t.$refs.tableDataList.$refs.tableList.aColumnShowData //显示列的字段
                            , modelId: "job_list" //导入模板的ID
                        }));
                        t.$router.push("/importData/" + infoSetId + "/single");  //单行导入
                    }
                }
            ]
            , pageSlideTitle: ""
            , isShowPageSlide: false
            , isAddJob: false
            , isEditJobList: false
            , isEditLevelList: false
            , formStyle: {
                labelWidth: 112,
                inputWidth: 210
            }
        };
    }
    , watch: {
        isShowPageSlide: function(val, oldVal) {
            // 当弹窗关闭时，置原始数据
            if (!val) {
                this.isAddJob = false;
                this.isEditJobList = false;
                this.isEditLevelList = false;
            }

        }
    }
    , components: {
        tableDataList
        , editFormInfos
        , pageSlide
        //,treeEdit
        , treeEditList
    }
    , mounted() {
        var t = this;

        //重写方法
        //t.$refs.tableDataList.exportExcel = t.exportExcel;
        t.$refs.tableDataList.formatTableData = t.formatTableData;
        $('#daydao_header_app').css({
            display: 'block'
        });

    }
    , methods: {
        formatTableData(arr) {
            var t = this;
            return FormatClickAble.formatTableData(t, arr, "job_name");
        }
        /**
         * 重写导出Excel
         * */
        , exportExcelxxxxxxxxxxx() {
            alert(1);
        }
        , saveSuccessCallback: function(isClose) {

            this.$refs.tableDataList.getTableData();
            this.getJobNavigation();
            if (isClose) {
                this.isShowPageSlide = false;
            }
        }
        , cancelCallback: function() {
            this.isShowPageSlide = false;
        }
        , getJobNavigation: function() {
            var t = this;
            t.$daydao.$ajax({
                url: gMain.apiBasePath + "route/getKeyValueData.do",
                data: JSON.stringify({
                    conditionBean: null
                    , conditionFieldId: null
                    , conditionId: null
                    , corpId: null
                    , infoSetId: "hr_job_family"
                    , isDateFilter: false
                    , keyId: "family_id"
                    , orderBean: null
                    , orderStr: null
                    , parentId: "parent_family_id"
                    , valueId: "family_name"
                }),
                success: function(data) {
                    t.$refs.tableDataList.navigationData = data.beans;
                }
            });
        }
        /**
         * 单元格的点击
         * */
        ,cellClick(row, column, cell, event){
            var t = this;
            if(column.property == 'job_name'){
                FormatClickAble.goOrgNameLink({
                    row:row
                    ,column:column
                    ,cell:cell
                    ,event:event
                    ,dataList:t
                });
            }
        }

    }

}
</script>



