<style lang="scss">
    @import "workflowSetting.scss";
</style>
<template>
    <div :class="[prefixCls + '-wrap']">
        <!--流程设置-->
        <div v-show="!spinShow">
            <!--header-->
            <div :class="[prefixCls + '-header-fix']" v-show="getShowHeader">
                <div class="header">
                    <div class="back" @click="goBack">
                        <i class="iconfont_daydao_common">&#xe6a8;</i>
                        <span>返回</span>
                    </div>
                    <div class="title">{{headerTitle}}</div>
                </div>
            </div>

            <!--固定流程-->
            <div :class="[prefixCls + '-fix']" v-if="currentWorkflowType =='0'">
                <!--左侧审批人显示-->
                <div class="left">
                    <div class="auditDataList">
                        <ul>
                            <li class="auditItem" v-for="(item,index) in auditDataList" :class="{'selected':item.isSelected}">
                                <!--节点序列号-->
                                <div class="node_number">{{item.node_number}}</div>
                                <div class="audit_pos_name" @click="showAuditInfo(index,item)">
                                    <template v-if="item.audit_loop.loop_type">
                                        {{ loop_typename[item.audit_loop.loop_type] }}
                                    </template>
                                    <template v-if="!item.audit_loop.loop_type">
                                        <template v-if="item.dataType == 'pos'">{{item.audit_pos_name}}</template>
                                        <template v-if="item.dataType == 'person'">{{item.audit_person_name}}</template>
                                    </template>
                                </div>
                                <!--移除审批人-->
                                <div class="remove" title="移除" v-if="item.node_number != 1 " @click="removeAuditPerson(item,index)">
                                    <i class="iconfont_daydao_common icon-remove">&#xe6a1;</i>
                                </div>
                            </li>
                            <!--添加审批人-->
                            <li class="auditItem">
                                <div class="add" title="添加" :data-des="auditDataList.length" @click="addAuditPerson">+</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--右侧菜单显示-->
                <div class="right">
                    <div class="form_set">
                        <ul>
                            <!--节点类型-->
                            <li>
                                <div class="form_set_l">节点类型</div>
                                <div class="form_set_r">
                                    <div class="auditName" v-if="auditInfo.node_number == '1'">发起人</div>
                                    <div class="auditName" v-if="auditInfo.node_number != '1'">审批人</div>
                                </div>
                            </li>
                            <!--添加抄送人-->
                            <li v-if="auditInfo.node_number == '1'">
                                <div class="form_set_l">抄送人</div>
                                <div class="form_set_r">
                                    <div class="selectPersonList" @click="personSelectBtn('process')">
                                        <div v-if="auditInfo.process_cc.length <= 0" class="chooseName">请选择</div>
                                        <div class="personAdd" v-if="auditInfo.process_cc.length > 0" v-for="item in auditInfo.process_cc"
                                             :data-personid="item.person_id"
                                             @click.prevent="removePersonSelect($event,item,'')"
                                             :title="item.person_name">
                                            <span><i class="iconfont_daydao_common personImg">&#xe6db;</i></span>
                                            <span class="personName">{{item.person_name}}</span>
                                            <span title="移除"><i class="iconfont_daydao_common close">&#xe6a6;</i></span>
                                        </div>

                                    </div>
                                    <a href="javascript:void(0)"
                                       @click="personSelectBtn('process')"
                                       class="choose">选择</a>

                                    <Modal
                                        v-model="is_show_select_person"
                                        width="800"
                                        title="选择人员"
                                        :scrollable=true
                                        @on-ok="processResult"
                                        class="selectModal">
                                        <select-person
                                            ref="selectPersonModel"
                                            :type="selectType"
                                            :selectedPerson="processPersonList"
                                            :multi="isMultiAndSingle"></select-person>
                                    </Modal>

                                </div>
                            </li>
                            <!--跳过重复审批人-->
                            <li v-if="auditInfo.node_number == '1'">
                                <div class="form_set_l">跳过重复审批人</div>
                                <div class="form_set_r">
                                    <RadioGroup v-model="is_skip_same_audit" class="autoAudit" @on-change="skipAutoAudit">
                                        <Radio label="是"></Radio>
                                        <Radio label="否" class="tip"></Radio>
                                    </RadioGroup>
                                    <Tooltip placement="right">
                                        <div class="help">
                                            <i class="iconfont_daydao_common icon-help">&#xe6a2;</i>
                                        </div>
                                        <div slot="content">
                                            <p>开启后，同一审批人在流程中多次出现时，</p>
                                            <p>只需要审批一次，后续自动审批通过</p>
                                        </div>
                                    </Tooltip>
                                </div>
                            </li>

                            <!--节点设置-->
                            <li v-if="auditInfo.node_number != '1'">
                                <div class="form_set_l">节点设置</div>
                                <div class="form_set_r">
                                    <RadioGroup v-model="node_set_value" @on-change="selectNodeType($event)">
                                        <!--指定人员-->
                                        <div class="node_set_list">
                                            <Radio label="指定人员" class="assign_person">
                                                <span>指定人员</span>
                                            </Radio>

                                            <div class="assign_person_list" v-if="is_loop_type == ''">
                                                <div class="select_assign_person" @click="personSelectBtn('assign')">
                                                    <div v-if="!auditInfo.audit_person_id">
                                                        <span class="chooseName">请选择</span>
                                                    </div>

                                                    <div class="personAdd" v-if="auditInfo.audit_person_id"
                                                         :data-personid="auditInfo.audit_person_id"
                                                         @click.prevent="removePersonSelect($event,auditInfo,'assign')"
                                                         :title="auditInfo.audit_person_name">
                                                        <span><i class="iconfont_daydao_common personImg">&#xe6db;</i></span>
                                                        <span class="personName">{{auditInfo.audit_person_name}}</span>
                                                        <span title="移除"><i class="iconfont_daydao_common close">&#xe6a6;</i></span>
                                                    </div>

                                                </div>
                                                <a href="javascript:void(0)"
                                                   @click="personSelectBtn('assign')"
                                                   class="choose">选择</a>
                                            </div>

                                            <Modal
                                                v-model="is_show_select_person"
                                                width="800"
                                                title="选择人员"
                                                :scrollable=true
                                                @on-ok="selectResult"
                                                class="selectModal">
                                                <select-person
                                                    ref="selectPersonModel"
                                                    :type="selectType"
                                                    :selectedPerson="selectPersonList"
                                                    :multi="isMultiAndSingle"></select-person>
                                            </Modal>

                                        </div>

                                        <!--直属上级-->
                                        <div class="node_set_list direct_set">
                                            <Radio label="直属上级" class="direct_up">
                                                <span>直属上级</span>
                                            </Radio>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </li>

                            <!--自动审批  -->
                            <li v-if="auditInfo.node_number != '1'">
                                <div class="form_set_l">自动审批</div>
                                <div class="form_set_r">
                                    <RadioGroup v-model="is_auto_audit_model"  class="autoAudit" @on-change="changeAutoAudit">
                                        <Radio label="是"></Radio>
                                        <Radio label="否" class="tip"></Radio>
                                    </RadioGroup>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
                <!--右侧菜单显示end-->
            </div>

            <!--状态-->
            <div id="btnStatue" v-show="getShowBottom">
                <div class="right">
                    <a href="javascript:void(0)" class="agree" @click="saveDate">保存</a>
                    <a href="javascript:void(0)" class="back" @click="cancel">取消</a>
                </div>
            </div>
        </div>
        <!--loading-->
        <Spin size="large" fix v-show="spinShow" class="loading"></Spin>
    </div>



</template>
<script>
    export {default} from './workflowSetting.js';
</script>

