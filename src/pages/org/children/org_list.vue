<template>
    <div class="hr_org_list clearfix">

        <table-data-list ref="tableDataList" :infoSetId="infoSetId" :cardListOptions="cardListOptions" :defineBtns="defineBtns" @cell-click="cellClick">

            <!--这里允许通过 <div slot="模块名称"></div> 来重写列表数据组件的模板-->
            <div slot="page-top">
                <ul class="page-top-left-link">
                    <router-link class="org_nav_link" style="color:#F18950;" to="/org_list">组织列表</router-link>
                    <span class="seperate_ver_line">|</span>
                    <router-link class="org_nav_link" to="/org_chart">组织架构图</router-link>
                    <span class="seperate_ver_line">|</span>
                    <router-link class="org_nav_link" to="/report_chart">汇报关系图</router-link>
                </ul>
            </div>
        </table-data-list>
        <page-slide v-model="orgAdd.isShowPageSlide" pageTitle="新增组织">
            <edit-form-infos infoSetId="org_list" :labelWidth="formStyle.labelWidth" :inputWidth="formStyle.inputWidth" @saveSuccessCallback="saveSuccessCallback" @cancelCallback="cancelCallback"></edit-form-infos>
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

.edit_form_input_item {
    width: 210px;
}
</style>

<script type="text/babel">

import tableDataList from "commonVueLib/tableDataList/index"
import pageSlide from "commonVueLib/pageSlide/index"
import editFormInfos from "components/editFormInfos/index"
import FormatClickAble from 'components/format_clickable/format_clickable_methods.js';  //员工列表的公共方法调用
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
                    name: '导入组织',
                    event: () => {
                        sessionStorage.setItem("importData", JSON.stringify({
                            getTableColumnData: t.$refs.tableDataList.getTableColumnData //表格配置
                            , aColumnShowData: t.$refs.tableDataList.$refs.tableList.aColumnShowData //显示列的字段
                            , modelId: "org_list_import" //导入模板的ID
                        }));
                        t.$router.push("/importData/" + infoSetId + "/single");  //单行导入
                    }
                },
                // {
                //     name: '调整记录',
                //     event: () => {
                //         console.log("调整记录");

                //     }
                // },
            ]
            , formStyle: {
                inputWidth: 210
                , labelWidth: 112
            }
            , editInfos: {
                orgName: ""
                , higherOrgId: ""
            }, editRules: {

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
            return FormatClickAble.formatTableData(t, arr, "indent_name");
        }
        /**
         * 重写导出Excel
         * */
        , exportExcelxxxx() {
            alert(1);
        }
        // isClose 是否关闭侧滑
        , saveSuccessCallback: function(isClose) {
            // 刷新表格
            this.$refs.tableDataList.getTableData();
            if(isClose){
                this.orgAdd.isShowPageSlide = false;
            }
        }
        //取消按钮的回调
        , cancelCallback: function() {
            console.log("cancel callback");
            this.orgAdd.isShowPageSlide = false;
        }
        /**
         * 单元格的点击
         * */
        ,cellClick(row, column, cell, event){
            var t = this;
            if(column.property == 'indent_name'){
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


