<template>
    <div class="hr_org_list clearfix">

        <table-data-list ref="tableDataList" :infoSetId="infoSetId" :cardListOptions="cardListOptions" :defineBtns="defineBtns" @cell-click="cellClick">

            <!--这里允许通过 <div slot="模块名称"></div> 来重写列表数据组件的模板-->
            <div slot="page-top">
                <ul class="page-top-left-link">
                    <router-link class="org_nav_link" style="color:#F18950;" to="/pos_list">职位</router-link>
                    <span class="seperate_ver_line">|</span>
                    <router-link class="org_nav_link" to="/job_list">职务</router-link>
                    <span class="seperate_ver_line">|</span>
                    <router-link class="org_nav_link" to="/job_relation_chart">职务体系图</router-link>
                </ul>
            </div>
        </table-data-list>
        <page-slide v-model="isShowPageSlide" pageTitle="新增职位">
            <edit-form-infos infoSetId="pos_list" :labelWidth="formStyle.labelWidth" :inputWidth="formStyle.inputWidth" @saveSuccessCallback="saveSuccessCallback" @cancelCallback="cancelCallback"></edit-form-infos>
        </page-slide>
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
</style>

<script type="text/babel">

import tableDataList from "commonVueLib/tableDataList/index"
import pageSlide from "commonVueLib/pageSlide/index"
import editFormInfos from "components/editFormInfos/index"
import FormatClickAble from 'components/format_clickable/format_clickable_methods.js';  //员工列表的公共方法调用
const infoSetId = "pos_list";  //页面信息集ID

export default {
    name: infoSetId
    , data() {
        var t = this;
        return {
            infoSetId: infoSetId
            , cardListOptions: {
                boldFields: ["pos_name"] //加粗显示的字段，最多两个
            }
            , isShowPageSlide: false
            , defineBtns: [
                {
                    name: '新增职位',
                    active: true,
                    event: () => {
                        t.isShowPageSlide = true;
                    }
                },
                {
                    name: '导入职位',
                    event: () => {
                        sessionStorage.setItem("importData", JSON.stringify({
                            getTableColumnData: t.$refs.tableDataList.getTableColumnData //表格配置
                            , aColumnShowData: t.$refs.tableDataList.$refs.tableList.aColumnShowData //显示列的字段
                            , modelId: "pos_list" //导入模板的ID
                        }));
                        t.$router.push("/importData/" + infoSetId + "/single");  //多行导入
                    }
                },
            ]
            , formStyle: {
                inputWidth: 210
                , labelWidth: 112
            }
        };
    }
    , components: {
        tableDataList
        , pageSlide
        , editFormInfos
    }
    , mounted() {
        var t = this;
        //重写方法
        t.$refs.tableDataList.formatTableData = t.formatTableData;

        $('#daydao_header_app').css({
            display: 'block'
        })

    }
    , methods: {
        formatTableData(arr) {
            var t = this;
            return FormatClickAble.formatTableData(t, arr, "pos_name", );
        }
        /**
         * 重写导出Excel
         * */
        , exportExcelxxxx() {

        }
        //成功回调
        , saveSuccessCallback: function(isClose) {
            this.$refs.tableDataList.getTableData();
            if (isClose) {
                this.isShowPageSlide = false;
            }
        }
        //取消回调
        , cancelCallback: function() {
            this.isShowPageSlide = false;
        }
        /**
         * 单元格的点击
         * */
        ,cellClick(row, column, cell, event){
            var t = this;
            if(column.property == 'pos_name'){
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


