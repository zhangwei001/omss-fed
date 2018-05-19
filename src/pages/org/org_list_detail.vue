<template>
    <div class="org-detail">
        <detail-small :pageInfoSetId="pageInfoSetId" :id="id" ref="detailSmall">
            <!-- 重写pagetitle -->
            <div slot="full-detail-title">
                <!-- title  -->
                <span>组织详情</span>
            </div>

            <div slot="full-detail-header" class="org_detail_header">
                <span class="org_name_span">{{orgName}}</span>
                <div style="display:inline-block">
                    <ul style="display:flex;">
                        <li v-for='btn in btnGroups' :key="btn.id">
                            <Tooltip v-if="btn.isShowTip" :content="btn.tip">
                                <Button type="ghost" :disabled="true" style="margin-right:6px;">{{btn.name}}</Button>
                                <!-- <button type="ghost" :disabled="true" class="page_btn">{{btn.name}}</button> -->
                            </Tooltip>

                            <button v-else class="page_btn" @click="btnOperate(btn.id)" style="height:34px;">{{btn.name}}</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div slot="full-detail-right"></div>

            <!--  重写右侧  -->
            <div slot="full-detail-right"></div>
        </detail-small>
        <Modal v-model="isShowOperateTip" width="320" title="提示" @on-ok="okToOperate(opeType)" @on-cancel="cancelOpe" :mask-closable="false">
            <p slot="header">{{operateTitle}}</p>
            <p>{{operateTip}}</p>
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

export default {
    name: 'orgListDetail',
    props: {

    },
    components: {
        detailSmall,
    },
    data: function() {
        var _this = this;
        return {
            pageInfoSetId: '', // 页面的infoSetId
            id: "", //id
            orgName: "" // 组织名称
            , uuid: "" // uuid，删除时用的
            , btnGroups: [] // 按钮组
            , isDeleteAble: true // 是否可以删除
            , isArchive: true // 是否可以禁用
            , isUnArchive: true // 是否可以启用
            , isShowOperateTip: false //是否显示弹窗提示
            , opeType: ""    // 按钮的操作类型
            , operateTip: "" // 弹窗的内容提示
            , operateTitle: "" // 弹窗的title

        }
    }
    , created: function() {
        var _this = this;
        //gMain.components.commonHeader.handleShowLeftMenu(true); // 不显示左侧菜单

        //_this.getTableColumn()
        $(".daydao_drop_select-parent_org_id input").attr("readonly", "true");
    },
    mounted: function() {
        console.log("路由参数", this.$route.params.uuid);
        this.initBaseInfos();
    },
    methods: {
        /**
         *  获取组织数据
         */
        initBaseInfos: function() {
            var _this = this;
            _this.pageInfoSetId = _this.$route.params.infoSetId;
            _this.id = _this.$route.params.id; // id
            _this.orgName = decodeURI(decodeURI(_this.$route.params.orgName)); // 组织名称
            _this.uuid = this.$route.params.uuid;
            // 获取组织基本事物信息
            _this.initOrgBaseInfos();
        }
        , initOrgBaseInfos: function() {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "org/getOrgAffairInfo.do",
                data: JSON.stringify({ orgId: _this.id }),
                success: function(data) {
                    _this.btnGroups = [];
                    if (data.result == 'true') {
                        try {
                            _this.isDeleteAble = data.data.vaidDelete; //是否可以删除
                            _this.isArchive = data.data.validArchive; //是否可以封存 ,false 不可以禁用 true：可以禁用
                            _this.isUnArchive = data.data.validUnArchive; //是否可以启用 false：不可以启用 true：可以启用
                            var deleteShowTip = false;
                            // false 不可删除 显示提示信息，isShowTip 为true

                            if (_this.isDeleteAble) {
                                deleteShowTip = false;
                            } else {
                                deleteShowTip = true;
                            }
                            // 可以启用 说明被封存了，显示启用按钮
                            if (_this.isUnArchive) {
                                var useShowTip = false;
                                // false 显示提示
                                if (_this.isUnArchive) {
                                    useShowTip = false;
                                } else {
                                    useShowTip = true;
                                }

                                _this.btnGroups = [
                                    {
                                        id: "use",
                                        name: "启用",
                                        isShowTip: useShowTip, // true 的时候显示提示信息
                                        tip: data.data.validUnArchiveDesc,
                                    }, {
                                        id: "delete",
                                        name: "删除",
                                        isShowTip: deleteShowTip,
                                        tip: data.data.validDeleteDesc,
                                    }
                                ];
                            } else {

                                var forbidenShowTip = false;
                                // false 不可禁用，显示提示信息，isShowTip为true
                                if (_this.isArchive) {
                                    forbidenShowTip = false;
                                } else {
                                    forbidenShowTip = true;
                                }

                                _this.btnGroups = [
                                    {
                                        id: "forbiden",
                                        name: "禁用",
                                        isShowTip: forbidenShowTip, //true显示提示，
                                        tip: data.data.validArchiveDesc,
                                    }, {
                                        id: "delete",
                                        name: "删除",
                                        isShowTip: deleteShowTip,
                                        tip: data.data.validDeleteDesc,
                                    }
                                ];
                                // 显示禁用按钮
                                // _this.btnGroups = [
                                //     {
                                //         name: "禁用",
                                //         active: false,
                                //         event: () => {
                                //             _this.isArchiveOrUnArchive(_this.isUnArchive);
                                //         }
                                //     }, {
                                //         name: "删除",
                                //         active: false,
                                //         event: () => {

                                //             _this.deleteOrg();
                                //         }
                                //     }
                                // ];
                            }
                        } catch (e) {
                            console.log(e.message);
                        }
                    }

                }
            });
        }
        // 封存或启封
        , isArchiveOrUnArchive: function(isUnArchive) {
            var _this = this;
            var url = "";
            var successTip = "";
            var params = {
                orgs: [
                    { orgId: _this.id }
                ]
            }
            // 封存
            if (isUnArchive) {
                url = "org/unarchive.do";
                successTip = "启用成功";
            } else {
                url = "org/archive.do"
                successTip = "禁用成功";

            }
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + url,
                data: JSON.stringify(params),
                success: function(data) {
                    if (data.result == "true") {
                        // 失败了
                        if (data.data.falNum == 1) {
                            _this.$Message.error(data.data.orgResults[0].resp.resultDesc);
                        } else {
                            // 成功
                            _this.$Message.success(successTip);
                            _this.initOrgBaseInfos();
                        }
                    }
                }
            });
        }
        , deleteOrg: function() {
            var _this = this;
            var params = {
                infoSetId: "org_list",
                navigationCondition: {
                    and: true,
                    childCondition: null,
                    equal: false,
                    joinAlias: null,
                    joinBean: null,
                    key: "hr_org.org_id_queue",
                    value: "like '0001!%'"
                },
                uuidLists: [_this.uuid]
            }
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/org_list/del.do",
                data: JSON.stringify(params),
                success: function(data) {
                    if (data.result == 'true') {
                        _this.$Message.success("删除成功");
                        setTimeout(function() {
                            _this.$router.push({ path: "/org_list" });
                        }, 700);
                    }
                }
            });
        }
        , btnOperate: function(itemId) {
            var t = this;
            console.log(itemId);
            // 存储opeType
            t.opeType = itemId;

            switch (itemId) {
                case "forbiden":
                    // 禁用
                    t.operateTitle = "确认禁用组织"
                    t.operateTip = "该组织和它的子组织将被禁用，确认禁用？";
                    t.isShowOperateTip = true;
                    break;
                case "delete":
                    // 删除
                    t.operateTitle = "确认删除组织"
                    t.operateTip = "该组织和它的子组织将被删除，该操作不可逆，确认删除？";
                    t.isShowOperateTip = true;
                    break;
                case "use":
                    //启用
                    t.operateTitle = "确认启用组织"
                    t.operateTip = "该组织和它的子组织将被启用，确认启用？";
                    // 该组织和它的子组织将被启用，确认启用？
                    t.isShowOperateTip = true;
                    //t.isArchiveOrUnArchive(true);
                    break;
                default:
                    console.log("未知操作", itemId);
            }

        }
        , okToOperate: function(opeType) {
            var t = this;
            t.isShowOperateTip = false;
            switch (opeType) {
                case "forbiden":
                    // 禁用
                    t.isArchiveOrUnArchive(false);
                    break;
                case "delete":
                    // 删除
                    t.deleteOrg();
                    break;
                case "use":
                    //启用
                    t.isArchiveOrUnArchive(true);
                    break;
                default:
                    console.log("未知操作", itemId);
            }
        }
        , cancelOpe: function() {
            this.isShowOperateTip = false;
        }


    }
}
</script>

<style lang="scss">
.org_detail_header {
    text-align: center;
}

.org_name_span {
    margin-right: 10px;
    font-size: 18px;
    color: #657180;
}

.page_btn {
    line-height: 30px;
    padding: 1px 16px;
    display: inline-block;
    margin-right: 10px;
    background-color: #fff;
    border: 1px solid #E3E8EE;
    border-radius: 2px;
    color: #657180;
    font-size: 14px;
    cursor: pointer;
}

.org-detail .ivu-tooltip-inner {
    white-space: normal;
}
</style>
