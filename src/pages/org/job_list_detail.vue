<template>
    <detail-small :pageInfoSetId="pageInfoSetId" :id="id" ref="detailSmall">
        <!-- 重写pagetitle -->
        <div slot="full-detail-title">
            <!-- title  -->
            <span>职务详情</span>
        </div>

        <!-- 通过slot复写组件模板 -->
        <div slot="full-detail-header" style='text-align:center;'>
            <span class="jop_name_span">{{jobName}}</span>
            <btn-group style="display:inline-block;" :btns="btnGroups"></btn-group>
        </div>

        <!--  重写右侧  -->
        <div slot="full-detail-right"></div>
    </detail-small>
</template>

<script>
// 引入组件
/* import editList from "commonVueLib/detailPage/detailFull/editList.vue"; //表格列表
import addList from "commonVueLib/detailPage/detailFull/addList.vue"; //表格列表
import attachmentList from "commonVueLib/detailPage/detailFull/attachmentList.vue"; //表格列表
import operateData from "commonVueLib/detailPage/detailFull/operateData.vue"; //操作记录

import affairSlideModel from "components/person_list/affairSlideModel"
import {daydaoDropSelect,daydaoDropSelectMul} from 'commonVueLib/daydaoDropSelect/index' */

import detailSmall from 'components/detailPage/detailSmall'
import btnGroup from 'commonVueLib/btnGroup/index'

export default {
    name: 'jobListDetail',
    props: {

    },
    components: {
        detailSmall,
        btnGroup,
    },
    data: function() {
        var t = this;
        return {
            pageInfoSetId: '',
            id: {},
            jobName: "",
            uuid: "",
            btnGroups: [
                {
                    name: "删除",
                    active: false,
                    event: () => {
                        t.deleteJob();
                    }
                }
            ]
        }
    },
    created: function() {
        var _this = this;
        gMain.components.commonHeader.handleShowLeftMenu(false); // 不显示左侧菜单

        //_this.getTableColumn()
    },
    mounted: function() {
        console.log('父组件传递过来的数据：', this.$route.params)
        this.pageInfoSetId = this.$route.params.infoSetId;
        this.id = this.$route.params.id;
        this.jobName = decodeURI(decodeURI(this.$route.params.jobName));
        this.uuid = this.$route.params.uuid;

        gMain.components.commonHeader.handleShowLeftMenu(true); // 不显示左侧菜单
    },
    methods: {
        deleteJob: function() {
            var t = this;
            var params = {
                infoSetId: "job_list",
                navigationCondition: {
                    and: true,
                    childCondition: null,
                    equal: false,
                    joinAlias: null,
                    joinBean: null,
                    key: "hr_job_family.family_id_queue",
                    value: "like '0001!%'",

                },
                uuidLists: [t.uuid]
            }
            t.$daydao.$ajax({
                url: gMain.apiBasePath + "route/job_list/del.do",
                data: JSON.stringify(params),
                success: function(data) {
                    if (data.result == 'true') {
                        t.$Message.success("删除成功");
                        setTimeout(function() {
                            t.$router.push({ path: "/job_list" });
                        }, 700);
                    }
                }
            });
        }
    }
}
</script>

<style lang="scss">
.jop_name_span {
    margin-right: 10px;
    font-size: 18px;
    color: #657180;
}
</style>
