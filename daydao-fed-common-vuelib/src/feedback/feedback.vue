<style lang="scss" rel=“stylesheet/sass”>
    $prefixCls:'feedback';

    .#{$prefixCls}-wrap{
        padding:2em 1em;
    .content-item{
        display: flex;
        margin-bottom:1em;
    .feedback-item-title{
        width:80px;
        text-align:right;
    .content-title-wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top:10px;
    .must-need-icon{
        font-size: 18px;
        color: red;
        height: 18px;
    };
    .content-title-text{
        display: inline-block;
        padding: 0px 5px 0px 2px;
        font-size: 14px;
        color: #90A2B9;
    };
    };

    };
    .feedback-item-value{
        position:relative;
        top:10px;

    .textarea-content{
        resize: none;
        border-radius: 5px;
        width: 25em;
        border: 1px solid #D7DDE4;
        border-radius: 2px;
        padding: 3px 0px;
        padding-left:5px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    &:focus{
         border-color: #F18950;
         outline: 0;
         -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
         box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
     }
    &::-webkit-input-placeholder{color:#989b9e;font-size:14px; }
    &::-moz-placeholder{color:#989b9e;font-size:14px; }
    &::-ms-input-placeholder{color:#989b9e;font-size:14px; }
    }
    .tips-wrap{
        position: absolute;
        bottom:0px;
        padding: 7px;
        color: #989b9e;
    }
    }
    .upload-img-wrap{
    .upload-btn-wrap{
    .img-btn{
        border: 1px solid #D7DDE4;
        border-radius: 2px;
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 83px;
        height: 83px;
        font-size: 33px;
        color: #D7DDE4;

    }
    .img-tips{ font-size: 12px;color: #90A2B9;line-height: 12px;padding: 8px 0px;}
    }
    .upload-img-list-wrap{

    }
    }
    }
    }
    .#{$prefixCls}-footer-wrap{
        position:absolute;
        bottom:0px;
        opacity: 0.8;
        background: #747F8C;
        width:100%;
        text-align:right;
        padding:10px 0px;
    .btn-wrap{
        background: #F18950;
        border-radius: 2px;
        padding:5px 10px;
        display: inline-block;
        margin-right: 89px;
        .submit-btn{
            font-size: 14px;
            color: #FFFFFF;
            cursor: pointer;

        }
        &:hover{background:#F8925A }
    }
    }

</style>

<template>
    <div class="">
        <page-slide :pageTitle="title" v-model="isShow" :width="wrapWidth" @input="input">
            <div class="page-slide-overflow">
                <div :class="[prefixCls + '-wrap']" >

                    <div class="content-item">
                        <div class="feedback-item-title feedback-content-title"  >
                            <div class="content-title-wrap">
                                <span class="must-need-icon">*</span><span class="content-title-text">反馈内容</span>
                            </div>
                        </div>
                        <div class="feedback-item-value ">
                            <textarea type="text"
                                      class="textarea-content"
                                      :style="textareaStyle"
                                      :placeholder="placeholder"
                                      @keyup="keyupHandle($event)"
                                      v-model="sFeedbackContent"
                            ></textarea>
                            <div class="tips-wrap">
                                <div v-show="!bIsCompareLess">还差<span v-text="nRemainWordLen"></span>个字，加油啊少年</div>
                                <div v-show="bIsCompareLess">真棒！还可以输入<span  v-text="nRemainWordLen"></span>字</div>

                            </div>


                        </div>

                    </div>

                    <div class="content-item">
                        <div  class="feedback-item-title ">
                            <div class="content-title-wrap ">
                                <span class="content-title-text ">添加图片</span>
                            </div>

                        </div>
                        <div class="upload-img-wrap">
                            <div class="upload-img-list-wrap">
                                <upload-image
                                        :maxsize="maxsize"
                                        :maxlength="maxlength"

                                        :compress-ratio="compressRatio"
                                        v-model="uploadImage"
                                ></upload-image>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="[prefixCls + '-footer-wrap']">
                    <div class="btn-wrap">
                        <div class="submit-btn" @click.stop="submitFeedback">提交反馈</div>
                    </div>

                </div>
            </div>
        </page-slide>
    </div>
</template>


<script>
    import pageSlide from 'commonVueLib/pageSlide';
    import dialog from 'commonVueLib/artDialog/index';
    import UploadImage from 'commonVueLib/uploadImage/index';
    import Ajax from '../Ajax/index'

    export  default {
        name:"feedback",
        components:{  pageSlide,UploadImage
        }
        ,props:{
            //是否显示反馈滑层
            // isShow:{
            //     type:Boolean,
            //     default:false
            // },
            //反馈滑层宽度
            wrapWidth:{
                type:[String , Number],
                default : 660
            },
            //反馈内容的textarea 高度
            feedbackContentHeight:{
                type:[String , Number],
                default : 160
            },
            //反馈内容的textarea placeholder
            placeholder:{
                type:[String ],
                default:"亲爱的用户，请描述您使用daydao遇到的问题和对产品的改进期望，我们将尽快回复您。"
            }

        }
        ,data(){
            return {
                prefixCls:"feedback",
                title  : '我要反馈',
                sFeedbackContent:"",//反馈内容
                nRemainWordLen:10,
                bIsCompareLess:false,
                //isShowPageSlide: this.isShow, //是否显示
                isShow:false,  //是否显示侧滑反馈

                maxsize: 10,
                uploadImage:{},
                maxlength:9,
                imguuids:[],
                readonly:false,
                compressRatio: 0.5
            }
        }
        ,created(){
           // gMain.apiPath ="https://www.daydao.com/";
        }
        ,mounted(){
        }
        ,watch:{
        }
        ,computed: {
            textareaStyle(){
                return {width: this.wrapWidth - 110 - 30 + "px", height: this.feedbackContentHeight + "px"}
            }
        }
        ,methods: {
            //反馈内容keyup事件
            keyupHandle (event){
                var tempLen = this.sFeedbackContent.trim().length;
                if (tempLen < 10) {
                    this.nRemainWordLen = 10 - tempLen;
                    this.bIsCompareLess = false;
                } else if (tempLen <= 200) {
                    this.bIsCompareLess = true;
                    this.nRemainWordLen = 200 - tempLen;
                } else {
                    event.preventDefault()
                    this.sFeedbackContent = this.sFeedbackContent.substr(0, 199)
                }
            },
            //提交反馈
            submitFeedback(){
                var that  = this;
                that.validation() && that.commitInfo()
            },
            /*
             * 数据校验
             * */
            validation(){
                let [retStatus , that]=  [true ,this];
                if( that.sFeedbackContent.length< 10){
                    if(iview.Message){
                        iview.Message.error("还差"+(10-that.sFeedbackContent.length) +"个字，加油啊少年！");
                    }
                    retStatus = false;
                }else{
                    retStatus = true;
                }

                return retStatus;
            },
            //关闭侧滑 slider自定义事件
            input(val){
                this.$emit("close-feedback",false);
            },
            /**
             * 提交反馈信息
             * @param content    //反馈内容
             * @param equipType //设备类型 1、web 2、app
             * @param equipment  //设备（浏览器信息）
             * @param imguuids //图片数组
             * @return {*}
             */
            commitInfo(uuid){
                let  that = this;
                Ajax.ajax({
                    url: gMain.DayHRDomains.sExtraDomain + "feedback/saveFeedback",
                    data: JSON.stringify({
                        content:that.sFeedbackContent,
                        equipType:1,
                        equipment:window.navigator.userAgent,
                        imgList:that.uploadImage.uuids
                    })
                }).then( data=>{
                    if(data.result === "true"){
                        let dialogObj = dialog({
                            title: '提示',
                            width: 300,
                            content: '反馈已收到，我们将尽快回复您!',
                            ok: function () {
                                // t.setHideColumn(t.columnsDialog.vueInstance.aAllData); //从弹窗的vue实例中获取数据 return false
                                that.$emit("close-feedback",false);
                                that.$emit("feedback-success");
                                that.isShow = false;
                            }

                        });
                        dialogObj.showModal();
                    }
            });
            }


        }
    }
</script>


