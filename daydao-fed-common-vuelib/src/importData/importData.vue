<style lang="scss">
    @import "./importData.scss";
</style>
<template>
    <div :class="[prefixCls,'clearfix']">
        <div :class="[prefixCls + '-title']">
            <div class="back" @click="close">
                <Icon type="chevron-left" />
                <span>返回</span>
            </div>
            <h1>导入</h1>
            <!--<div class="close iconfont_daydao_common" @click="close()">&#xe6a6;</div>-->
        </div>

        <div :class="[prefixCls + '-step-status']">
            <div :class="[prefixCls + '-step-status-innner']">
                <template v-if="$route.params.importMode == 'single'">
                    <span class="number" :class="{current:currentStep >= 1}">1</span>
                    <span>选择导入方式 <i class="iconfont_daydao_common" style="font-size: 12px;margin-left:10px;">&#xe686;</i><i class="iconfont_daydao_common" style="font-size: 12px;">&#xe686;</i></span>
                    <span class="number" :class="{current:currentStep >= 2}">2</span>
                    <span>选择导入字段 <i class="iconfont_daydao_common" style="font-size: 12px;margin-left:10px;">&#xe686;</i><i class="iconfont_daydao_common" style="font-size: 12px;">&#xe686;</i></span>
                    <span class="number" :class="{current:currentStep >= 3}">3</span>
                    <span>下载模板/导入文件 <i class="iconfont_daydao_common" style="font-size: 12px;margin-left:10px;">&#xe686;</i><i class="iconfont_daydao_common" style="font-size: 12px;">&#xe686;</i></span>
                    <span class="number" :class="{current:currentStep >= 4}">4</span>
                    <span>导入成功</span>
                </template>
            </div>
        </div>

        <div :class="[prefixCls + '-steps']">

            <!--第一步：选择导入方式-->
            <transition name="fade" mode="out-in">
            <div class="step1 clearfix" v-if="currentStep == 1">
                <div class="addOrEdit clearfix" :class="{'single-model':(!modelId.add || !modelId.edit)}">
                    <div class="importbtn add" @click="startImport('0')" v-if="modelId.add">
                        <h1>新增</h1>
                        <div class="des">
                            {{addDes}}
                        </div>
                        <div class="btn">

                        </div>
                        <div class="hrefname" style="color: rgb(188,130,134);">
                            点击进入
                        </div>
                    </div>
                    <div class="importbtn edit" @click="startImport('1')" v-if="modelId.edit">
                        <h1>编辑</h1>
                        <div class="des">
                            {{editDes}}
                        </div>
                        <div class="btn">

                        </div>
                        <div class="hrefname">
                            点击进入
                        </div>
                    </div>
                </div>
            </div>
            </transition>

            <!--第二步-->
            <transition name="fade" mode="out-in">
            <div class="step2 clearfix" v-if="currentStep == 2">
                <div class="select-all clearfix">
                    <Checkbox @on-change="onChangeCheckAll" v-model="checkAllStatus">全选</Checkbox>
                </div>

                <!--如果有分组-->
                <template v-if="columnGroup.length">
                    <!--选项组-->
                    <div class="select-group clearfix" v-for="(value, key, index) in columnGroup">
                        <div class="title">
                            <Checkbox v-model="value.key.isListShow" :title="value.key.name" @on-change="onChangeGroupCheckAll">{{value.key.name}}</Checkbox>
                        </div>
                        <div class="children">
                            <div class="checkbox-item" v-for="item2 in value.value">
                                <Checkbox v-model="item2.isListShow" @on-change="onChangeCheck" :disabled="item2.necessary" :tag="item2.tag" :title="item2.name">{{item2.name}}</Checkbox>
                            </div>
                        </div>
                    </div>
                </template>
                <!--没有分组的情况-->
                <template v-else>
                    <!--选项组-->
                    <div class="select-group clearfix" style="padding-top: 10px;">
                        <div class="children">
                            <div class="checkbox-item" v-for="item2 in tableColumnData">
                                <Checkbox v-model="item2.isListShow" @on-change="onChangeCheck" :disabled="item2.necessary" :title="item2.name">{{item2.name}}</Checkbox>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="steps-btn steps-btn-fixed" :class="{fixedModel:isFixedShowStep2Btn}" v-show="!spinRequestColumnShow">
                    <Button @click="goToPreStep">上一步</Button>
                    <Button type="primary" :style="{marginLeft:'20px'}" @click="goToNextStep">下一步</Button>
                </div>

                <!--字段组的请求遮罩-->
                <Spin size="large" fix v-if="spinRequestColumnShow"></Spin>

            </div>
            </transition>

            <!--第三步-->
            <transition name="fade" mode="out-in">
            <div class="step3 clearfix" v-if="currentStep == 3">

                <!--导入前的状态-->
                <div class="step3-inner clearfix" v-if="!afterImportMsg.failNum">
                    <!--左侧开始-->
                    <div class="step3-left">
                        <div class="d-title">
                            导入说明
                            <Tooltip placement="top" v-if="$route.params.importMode == 'mul'">
                                <div slot="content">
                                    <p style="white-space: normal;">这里用于维护员工的更多内容，导入前请确保重名的员工都有维护工号。</p>
                                </div>
                                <Icon type="help-circled" style="color:rgb(111, 183, 255);"></Icon>
                            </Tooltip>
                        </div>
                        <div class="d-content">
                            <img src="./images/importDes.png" alt="导入说明" width="569">
                        </div>
                    </div>
                    <!--左侧结束-->

                    <!--右侧开始-->
                    <div class="step3-right">
                        <div class="d-title">
                            <template v-if="$route.params.importMode == 'single'">
                                1.下载模板
                            </template>
                            <template v-if="$route.params.importMode == 'mul'">
                                1.选择更多信息下载模板
                            </template>
                        </div>
                        <div class="download-des">
                            <div style="margin-bottom: 10px;" v-if="$route.params.importMode == 'mul'">
                                是否导出已有数据： <i-switch v-model="operationType"></i-switch>
                            </div>
                            <template v-if="$route.params.importMode == 'mul'">
                                <Select v-model="mulSelectModel" style="width:260px">
                                    <Option v-for="item in MultiImportDropModels" :value="item.model_id" :key="item.model_id" :title="item.model_instruction">{{ item.model_name }}</Option>
                                </Select>
                            </template>
                            <Button type="primary" @click="downloadTemplate">点击下载</Button>
                        </div>
                        <div class="d-title" style="margin-top:10px;">
                            2.填写模板文件选择文件，并开始导入
                        </div>

                        <div class="download-des">
                            <div style="margin-bottom: 10px;" v-if="$route.params.importMode == 'mul'">
                                是否删除导入
                                <Tooltip placement="top-start">
                                    <Icon type="help-circled" style="font-size: 14px;color: #6FB7FF;"></Icon>
                                    <div slot="content">
                                        <div style="width:262px;white-space: normal;padding-right: 32px;">删除导入用于清掉您导入的错误数据，仅需要打开这个开关，把导入错误的数据再导入一遍即可清除。</div>
                                    </div>
                                </Tooltip>
                                ： <i-switch v-model="allowDelete"></i-switch>
                            </div>
                            <Input readonly style="width: 260px" v-model="fileName" :class="[prefixCls + '-file-name']"></Input>
                            <Upload
                                :style="{display:'inline-block'}"
                                :before-upload="handleUpload"
                                action="/">
                                <Button type="primary" :class="[prefixCls + '-select-file']">选择文件</Button>
                            </Upload>
                        </div>

                        <div class="download-progress" v-show="iImportProgress">
                            <div class="download-progress-status"><span style="display: inline-block;vertical-align: middle;max-width: 230px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{sImportStatusDes}}</span> <span style="margin-left:30px;">{{iImportProgress}}%</span></div>
                            <Progress :percent="iImportProgress" hide-info></Progress>
                        </div>

                        <!--导入错误信息提示-->
                        <div class="download-error-msg" v-if="sImportErrorMsg">
                            <span class="icon iconfont_daydao_common">&#xe6a0;</span>
                            <span class="error-msg">{{sImportErrorMsg}}</span>
                        </div>
                    </div>
                    <!--右侧结束-->

                    <div style="clear:both;height: 1px;"></div>
                    <div class="steps-btn steps-btn-fixed" :class="{fixedModel:isFixedShowStep2Btn}" :style="{textAlign:'right'}">
                        <Button @click="goToPreStep" v-if="$route.params.importMode == 'single'">上一步</Button>

                        <Tooltip content="请选择文件后开始导入" placement="top" :disabled="!!fileName">
                            <Button type="primary" :style="{marginLeft:'20px'}" @click="uploadAndImportData" :disabled="!fileName || sImportStatusDes!='等待上传'">开始导入</Button>
                        </Tooltip>
                    </div>
                </div>

                <!--导入后 -- 在线纠错模块-->
                <div class="step3-recovery" v-if="!!afterImportMsg.failNum">

                    <template v-if="afterImportMsg.failNum <= afterImportMsg.maxEditNum">
                        <online-error-recovery ref="onlineErrorRecovery" :after-import-msg="afterImportMsg" :info-set-id="infoSetId"></online-error-recovery>

                        <div style="clear:both;height: 1px;"></div>
                        <div class="steps-btn steps-btn-fixed" :class="{fixedModel:isFixedShowStep2Btn}">
                            <Button type="primary" @click="reImportData">提交</Button>
                            <Button @click="close" style="margin-left:20px;">放弃错误数据并退出</Button>
                        </div>

                        <Spin size="large" fix v-if="spinOnlineError"></Spin>

                    </template>
                    <template v-else>
                        <div style="font-size: 14px;color: #68717C;text-align: center;">
                            共导入{{afterImportMsg.successNum + afterImportMsg.failNum}}行数据，其中成功导入<span style="color: rgb(120,200,137);">{{afterImportMsg.successNum}}</span>行，<span style="color: rgb(246,104,106);">{{afterImportMsg.failNum}}</span>行有误，建议您下载错误信息并在excel上维护好之后<Tooltip placement="top" content="重新导入将延用您本次导入选择过的字段"><span style="cursor: pointer;color: #4B9FFA;" @click="step3ContinueImport">再次导入</span></Tooltip>。
                        </div>
                        <div style="text-align: center;margin-top:37px;">
                            <Button type="primary" @click="step3DownloadErrorExcle">下载错误信息</Button>
                        </div>
                    </template>
                </div>


            </div>
            </transition>

            <!--第四步-->
            <transition name="fade" mode="out-in">
            <div class="step4 clearfix" v-if="currentStep == 4">
                <div class="success-icon"></div>
                <div class="success-text" style="line-height: 30px;margin-top:10px;">
                    <span style="font-size: 16px;color: #68717C;display: block;">好棒！没有发现数据错误</span>
                    <span style="font-size: 14px;color: #68717C;display: block;">成功导入数据{{afterImportMsg.successNum}}条</span>
                </div>

                <div class="steps-btn" :style="{textAlign:'center',marginTop:'66px'}">
                    <Button type="primary" @click="close">返回</Button>
                </div>
            </div>
            </transition>

        </div>

        <!--确定是否退出导入-->
        <Modal
            v-model="isShowEscImport"
            title="提示"
            width="435"
            @on-ok="okEscImport"
            @on-cancel="cancelEscImport">
            <p style="text-align: center;font-size: 16px;color: #657180;line-height: 44px;height:44px;">确定要退出导入吗？</p>
            <p style="text-align: center;font-size: 14px;color: #657180;margin-bottom:20px;">退出不影响已成功导入的数据，系统提醒您是否已下载错误数据，便于在excel中维护后上传</p>
        </Modal>

    </div>

</template>
<script>
    export {default} from './importData.js';
</script>
