<style lang="scss">
@import "../../../style/person_list.scss";
</style>
<template>
    <div class="hr_org_list clearfix">

        <table-data-list ref="tableDataList" :infoSetId="infoSetId" :cardListOptions="cardListOptions" :defineBtns="defineBtns" @cell-click="cellClick">

            <!--这里允许通过 <div slot="模块名称"></div> 来重写列表数据组件的模板-->

            <div slot="page-top-right">
                <ul class="page-top-right-link">
                    <router-link to="/person_inactive_list">{{inactiveCount}}名员工未激活</router-link>
                    <span>|</span>
                    <router-link to="/person_getin_before">{{futureInJobCount}}名员工待入职</router-link>
                    <span>|</span>
                    <router-link to="/person_out_list" style="color: #657180;">离职员工</router-link>
                </ul>
            </div>

        </table-data-list>

    </div>
</template>

<style lang="scss">

</style>

<script type="text/babel">

import tableDataList from "commonVueLib/tableDataList/index";
import personListMethods from 'components/person_list/person_list_methods.js';  //员工列表的公共方法调用

const infoSetId = "person_list";  //页面信息集ID

export default {
    name: infoSetId
    , data() {
        var t = this;
        return {
            //信息集ID
            infoSetId: infoSetId
            //卡片字段
            , cardListOptions: {
                isShowImg: true //是否显示头像
                , imgFields: { img: "head_img", title: "person_name", id: "person_id" }  //显示头像的关联字段名，三个
                , boldFields: ["person_name", "person_type"] //加粗显示的字段，两个
            }
            //表格左上方按钮
            , defineBtns: [
                {
                    name: '新增员工',
                    active: true,
                    event: () => {
                        this.$router.push({ path: '/person_add' });
                    }
                },
                {
                    name: '导入导出',
                    children: [
                        {
                            name: '导入在职员工', event: () => {

                                sessionStorage.setItem("importData", JSON.stringify({
                                    getTableColumnData: t.$refs.tableDataList.getTableColumnData //表格配置
                                    , aColumnShowData: t.$refs.tableDataList.$refs.tableList.aColumnShowData //显示列的字段
                                    , modelId: "on_job_person_import" //导入模板的ID
                                }));
                                t.$router.push("/importData/" + infoSetId + "/single");  //单行导入

                            }
                        },
                        {
                            name: '导出在职员工', event: () => {
                                t.$refs.tableDataList.exportExcel();
                            }
                        },
                        {
                            name: '导入更多信息', event: () => {

                                sessionStorage.setItem("importData", JSON.stringify({
                                    getTableColumnData: t.$refs.tableDataList.getTableColumnData //表格配置
                                    , aColumnShowData: t.$refs.tableDataList.$refs.tableList.aColumnShowData //显示列的字段
                                    , modelId: "on_job_person_import" //导入模板的ID
                                }));
                                t.$router.push("/importData/" + infoSetId + "/mul");  //多行导入

                            }
                        }
                    ],
                    event: () => { }
                },
                {
                    name: '批量操作',
                    children: [
                        { name: '转正', event: () => { this.$router.push('/batch/choose/probation') } },
                        { name: '调动', event: () => { this.$router.push('/batch/choose/tranfer') } },
                        { name: '离职', event: () => { this.$router.push('/batch/choose/resign') } },
                        { name: '删除', event: () => { this.$router.push('/batch/choose/delete') } },
                    ]
                }
            ]
            , inactiveCount: 0
            , futureInJobCount: 0
        };
    }
    , components: {
        tableDataList
    }
    , created() {
        var t = this;
    }
    , mounted() {
        var t = this;
        t.$refs.tableDataList.formatTableData = t.formatTableData;

        $('#daydao_header_app').css({
            display: 'block'
        })
        t.countStaffInActive();
        t.countFutureInJob();
    }
    , methods: {
        /**
         * 格式化表格数据
         * */
        formatTableData(arr) {
            var t = this;
            return personListMethods.formatTableData(t, arr, 'inJob');
        },
        /**
         * 获取未激活的在职员工数量
         */
        countStaffInActive() {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "addPersonUI/countStaffInActive.do",
                success: function(data) {
                    // 保存失败
                    if (data.result == "true" && data.ext && data.ext.count) {
                        _this.inactiveCount = data.ext.count
                    }
                }
            });
        },
        countFutureInJob() {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "addPersonUI/countFutureInJob.do",
                success: function(data) {
                    // 保存失败
                    if (data.result == "true" && data.ext && data.ext.count) {
                        _this.futureInJobCount = data.ext.count
                    }
                }
            });
        }
        /**
         * 单元格的点击
         * */
        ,cellClick(row, column, cell, event){
            var t = this;
            if(column.property == 'person_name'){
                personListMethods.goPersonLink({
                    row:row
                    ,column:column
                    ,cell:cell
                    ,event:event
                    ,personList:t
                });
            }
        }

    }

}
</script>
