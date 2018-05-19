<style lang="scss">
    /*前缀*/
    $prefixCls: 'cloud-file-plugin';

    .#{$prefixCls}{
        .ivu-modal-header{
            background: #F5F7F9;
            border-radius: 8px 8px 0 0;
        }
        .ivu-modal-close{
            top: 5px;
        }
        .cloud-header{
            height: 15px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex: 1;
            padding-right: 20px;

            .minOrMax{
                float: right;

                i{
                    color: #999;
                }
            }
        }

        .ivu-modal-body{
            padding: 0;
        }
        .cloud-body{
            padding: 16px;

            .title-text{
                font-size: 14px;
                color: #657180;

                .tip{
                    color: #B1B6BF;
                    float: right;
                }
            }

            .cloud-content {
                width: 1000px;
                margin: 0 auto;
                overflow: hidden;
                .left{
                    float: left;
                }
                .right{
                    float: right;
                }
                .left, .right{
                    width: 480px;
                }
                .file-box {
                    min-height: 520px;

                    &.selected {
                        border: 1px solid #c4ceda;
                    }
                }

                .ivu-tabs-bar {
                    margin-bottom: 0;
                }

                .ivu-tabs-tabpane {
                    border: 1px solid #c4ceda;
                    border-top: 0;
                    min-height: 488px;
                }
            }
        }

        .ivu-modal-footer{
            height: 0;
            line-height: 0;
            padding: 0;
            margin: 0;
        }
    }
</style>

<template>
    <Modal
        :class-name="prefixCls"
        :width="width"
        v-model="show"
        title="">
        <div slot="header" class="cloud-header">
            <span>选择文件</span>
            <a class="minOrMax" @click="minOrMax">
                <i class="iconfont_daydao_common" v-show="!maxDialog" title="全屏">&#xe620;</i>
                <i class="iconfont_daydao_common" v-show="maxDialog" title="小屏">&#xe61f;</i>
            </a>
        </div>
        <div class="cloud-body">
            <div class="cloud-content">
                <div class="left">
                    <div class="title-text">选择</div>
                    <div class="file-box">
                        <Tabs type="card" :animated="false">
                            <TabPane label="企业文件">
                                1
                            </TabPane>
                            <TabPane label="我的文件">
                                2
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
                <div class="right">
                    <div class="title-text">
                        已选 <span class="tip">单击移除</span>
                    </div>
                    <div class="file-box selected">

                    </div>
                </div>

            </div>
        </div>
        <div slot="footer" class="cloud-footer"></div>
    </Modal>
</template>

<script>
    export default {
        props: {
            /** 是否打开 */
            value: {
                type: Boolean,
                default(){
                    return true
                }
            }
        },
        data(){
            return {
                prefixCls: 'cloud-file-plugin'
                , show: true
                , defaultWidth: 1024
                , defaultHeight: 600
                , width: 0
                , height: 0
                , winWidth: window.innerWidth
                , winHeight: window.innerHeight
                , maxDialog: false
            };
        },
        methods: {
            minOrMax(){
                let t = this;
                t.maxDialog = !t.maxDialog;
                let ivuModal = t.$el.querySelector('.ivu-modal');
                let cloudContent = ivuModal.querySelector('.cloud-content');
                let fileBoxs =  ivuModal.querySelectorAll('.file-box');
                let tabPanes = ivuModal.querySelectorAll('.ivu-tabs-tabpane');
                if(t.maxDialog){
                    // t.height = cloudContent.style.height;
                    ivuModal.style.width = t.winWidth + 'px';

                    for(let i = 0; i<fileBoxs.length; i++){
                        let box = fileBoxs[i];
                        t.setHeight(box, t.winHeight, box.offsetTop);
                    }
                    let h = parseFloat(fileBoxs[0].style.height);
                    console.log(h)
                    for(let i = 0; i<tabPanes.length; i++){
                        let pane = tabPanes[i];
                        t.setHeight(pane, h, pane.offsetTop);
                    }
                }else{
                    ivuModal.style.width = t.defaultWidth + 'px';
                    t.resetHeight(fileBoxs);
                    t.resetHeight(tabPanes);
                }
            }
            , setHeight(dom, boxH, top){
                dom.style.height = (boxH - top - 16) + 'px';
            }
            , resetHeight(domList){
                for(let i = 0; i<domList.length; i++){
                    domList[i].style.height = 'auto';
                }
            }
        },
        created(){
            let t = this;
            t.width = t.defaultWidth;
        },
        mounted(){

        },
        destroyed(){

        },
        watch: {
            show(val){
                if(!val){
                    this.$emit('input', val);
                }
            },
            value(val){
                let t = this;
                if (val) {
                    t.show = val;
                }
            }
        }
    }
</script>
