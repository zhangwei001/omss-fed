<template>
    <page-slide :pageTitle="title" v-model="isShow">
        <div class="affair-model-content">
            <probation ref="probation" v-if="type==='probation'" :data="data"></probation>
            <transfer ref="transfer" v-if="type==='transfer'" :data="data"></transfer>
            <rehire ref="rehire" v-if="type==='rehire'" :data="data" :personInfo.sync="personInfo"></rehire>
            <resign ref="resign" v-if="type==='resign'" :data="data"></resign>
            <editInfo ref="editInfo" v-if="type==='editInfo'" :data="data"></editInfo>

            <div class="affair-model-btn-group">
                <Button type="primary" @click="saveData">保存</Button>
                <Button type="ghost" @click="hide">取消</Button>
            </div>
        </div>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </page-slide>

</template>


<script>
import pageSlide from 'commonVueLib/pageSlide'
import probation from "./probation"
import transfer from "./transfer"
import rehire from "./rehire"
import resign from "./resign"
import editInfo from "./editInfo"

export default {
    name: 'affairSlideModel'
    ,props:{
        /**
         * 基本信息
         * */
        personInfo: {
            type: Object,
        },


    },
	data () {
        return {
            isShow :false,
            type:'',
            title:'',
            spinShow:false,
            keyValue : {
                //Employee type
                personType:{
                    conditionBean:null,
                    conditionFieldId:null,
                    conditionId:null,
                    corpId:null,
                    filterStr:null,
                    infoSetId:"ct_314",
                    isDateFilter:false,
                    keyId:"code_id",
                    multiType:"G_zh-CN",
                    openSize:null,
                    orderBean:null,
                    orderStr:null,
                    parentId:null,
                    tipId:null,
                    valueId:"code_name"
                },
                //Organization
                orgTree:{
                    conditionBean: null,
                    conditionFieldId: null,
                    conditionId: null,
                    corpId: null,
                    infoSetId: "hr_org",
                    keyId: "org_id",
                    orderBean: null,
                    parentId: "parent_org_id",
                    valueId: "org_name"
                },
                //job list
                posTree:{
                    conditionBean: null,
                    conditionFieldId: null,
                    conditionId: null,
                    corpId: null,
                    filterStr: null,
                    infoSetId: "r_hr_org_pos",
                    isDateFilter: false,
                    keyId: "id",
                    multiType: 'G_zh-CN',
                    openSize: null,
                    orderBean: null,
                    orderStr: 'gid, pos_order',
                    parentId: "parent_id",
                    tipId: null,
                    valueId: "value"
                },
                //level
                level:{
                    conditionBean:null,
                    conditionFieldId:null,
                    conditionId:null,
                    corpId:null,
                    filterStr:null,
                    infoSetId:"hr_job_level",
                    isDateFilter:false,
                    keyId:"level_id",
                    multiType:"G_zh-CN",
                    openSize:null,
                    orderBean:null,
                    orderStr:"level_order",
                    parentId:null,
                    tipId:null,
                    valueId:"level_name",
                },
                //jobName
                jobName:{
                    conditionBean:null,
                    conditionFieldId:null,
                    conditionId:null,
                    corpId:null,
                    filterStr:null,
                    infoSetId:"r_hr_job_family",
                    isDateFilter:false,
                    keyId:"id",
                    multiType:"G_zh-CN",
                    openSize:null,
                    orderBean:null,
                    orderStr:"family_order, job_order",
                    parentId:"parent_id",
                    tipId:null,
                    valueId:"value"
                },
                //Employee status
                status:{
                    conditionBean:null,
                    conditionFieldId:null,
                    conditionId:null,
                    corpId:null,
                    filterStr:null,
                    infoSetId:"ct_310",
                    isDateFilter:false,
                    keyId:"code_id",
                    multiType:"G_zh-CN",
                    openSize:null,
                    orderBean:null,
                    orderStr:null,
                    parentId:"parent_id",
                    tipId:null,
                    valueId:"code_name"
                }
            }
        };
    },
    components:{pageSlide,probation,transfer,rehire,resign,editInfo},
    watch:{
        isShow(val){
            if (!val) {
                setTimeout(_=>{
                    this.type = '';
                },400)
            }
        }
    },
    methods:{
        show(data){
            for(let k in data){
                this[k] = data[k]
            }
            setTimeout(_=>{
                let type = this.type;
                let tips = '<span class="affair-model-title-tips"><i class="iconfont_daydao_common">&#xe614;</i>请填写需要变更的员工信息，如果不需要变更则不填</span>'
                this.title = this.$refs[type].title + tips;
                this.isShow = true;
            },0)

        },
        hide(){
            this.isShow = false;
        },
        loading(){
            this.spinShow = true;
        },
        hideLoad(){
            this.spinShow = false;
        },
        saveData(){
            this.$refs[this.type].save(()=>{
                this.hide();
                this.callback();
            });
        }
    }
}


</script>

<style lang="scss">
    $preCls : ".affair-model";

    #{$preCls}{
        &-content{
            padding : 20px;
            height: 70%;
            height : calc(100% - 66px);
            height : -webkit-calc(100% - 66px);
            height : -ms-calc(100% - 66px);
            height : -moz-calc(100% - 66px);
            overflow-y: auto;
            .ivu-form{
                padding-right:40px;
            }

            .checkbox-inline{
               position: relative;
               top:6px;
            }

            .input-w{
                width: 210px;
            }
            .older-data{
                width: 210px;
                height: 32px;
                line-height: 1.5;
                padding: 4px 7px;
                background:#F5F7F9;
                font-size:14px;
                border-radius: 4px;
            }
            .ivu-form .ivu-form-item-label{
                margin-right:8px;
            }
            .ivu-form-item-content{
                display : flex;
            }
            .ivu-form .ivu-form-item-label , .ivu-form-item-content{
                font-size:14px;
            }
            .ivu-form-item-error-tip{
                left:250px;
            }
            .ivu-form-item{
                margin-bottom : 20px;
            }
        }

        &-text.ivu-form-item{
            margin-bottom : 0;
        }


        &-arrow{
            width: 20px;
            margin :0 10px;
            background:url(./img/affair-model-arrow.svg) no-repeat;
            background-size:contain;
            position: relative;
            top:5px;
        }

        &-btn-group{
            float: right;

            button:first-child{
                margin-right:10px;
            }
        }

        &-title-tips{
            font-size:12px;
            color:#657180;
            margin-left:8px;
            font-weight:normal;
        }

        &-btn-add{
            position: absolute;
            right:-36px;
            color:#2D8CF0;
            font-size:12px;

            &:hover{
                color:#67B6FF;
            }
        }

        &-center{
            padding-left:100px;
            .ivu-form-item-error-tip{
                left:0;
            }
        }

        &-title-tips i{
            font-style: normal;
            color: #6FB7FF;
            font-size:18px;
            margin:0 8px;
            position: relative;
            top:2px;
        }
    }

</style>
