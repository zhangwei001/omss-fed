<template>
    <div>
        <detail-small :pageInfoSetId="pageInfoSetId" :id="id" ref="detailSmall">
            <!-- 重写pagetitle -->
            <div slot="full-detail-title">
                <!-- title  -->
                <span>职位详情</span>
            </div>

            <!-- 通过slot复写组件模板 -->
            <div slot="full-detail-header" style='text-align:center;'>
                <span class="pos_name_span">{{posName}}</span>
                <btn-group style="display:inline-block;" :btns="btnGroups"></btn-group>
            </div>

            <!--  重写右侧  -->
            <div slot="full-detail-right"></div>
        </detail-small>
        <Modal v-model="isShowDeleteTip" width="320" title="提示" @on-ok="deletePos" @on-cancel="cancelOpe" :mask-closable="false">
            <p slot="header">确认删除职位</p>
            <p>该操作不可逆，确认删除？</p>
        </Modal>
    </div>
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
    name: 'posListDetail',
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
            posName: "",
            uuid: ""
            , btnGroups: [
                {
                    name: "删除",
                    active: false,
                    event: () => {
                        t.isShowDeleteTip=true;
                    }
                }
            ]
            ,isShowDeleteTip:false
        }
    },
    created: function() {
        var _this = this;
        gMain.components.commonHeader.handleShowLeftMenu(false); // 不显示左侧菜单
    },
    mounted: function() {
        this.pageInfoSetId = this.$route.params.infoSetId;
        this.id = this.$route.params.id;
        this.posName = decodeURI(decodeURI(this.$route.params.posName));
        this.uuid = this.$route.params.uuid;
    },
    methods: {
        deletePos: function() {
            var t = this;
            t.isShowDeleteTip=false;
            var params = {
                infoSetId: "pos_list",
                navigationCondition: {
                    and: true,
                    childCondition: null,
                    equal: false,
                    joinAlias: null,
                    joinBean: null,
                    key: "hr_org.org_id_queue",
                    value: "like '0001!%'"
                },
                uuidLists: [t.uuid]
            }
            t.$daydao.$ajax({
                url: gMain.apiBasePath + "route/pos_list/del.do",
                data: JSON.stringify(params),
                success: function(data) {
                    if (data.result == 'true') {
                        t.$Message.success("删除成功");
                        // 跳转到pos_list
                        setTimeout(function() {
                            t.$router.push({ path: "/pos_list" });
                        }, 700);
                    }
                }
            });
        }
        ,cancelOpe:function(){
            this.isShowDeleteTip=false;
        }
    }
}
</script>

<style lang="scss">
.pos_name_span {
    margin-right: 10px;
    font-size: 18px;
    color: #657180;
}
</style>
