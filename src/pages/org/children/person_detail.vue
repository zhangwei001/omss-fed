
<template>
    <detailFull :pageInfoSetId="infoSetId" :id="personId" ref="detailFull" :getPersonInfo="getDetailData" :print="print" v-if="reloadFlag" @refreshPersonBaseInfo="refreshPersonBaseInfo">
        <div slot="full-detail-header">
            <header class="detaile-full-header">
                <div class="detaile-full-header-img">

                    <div class="detaile-full-header-wrapper">
                        <img width="86" height="86" :src="imgPath+personInfo.headImg" v-if="personInfo.headImg" />
                        <div class="detaile-full-header-img-head" v-else :style="{background:portraitColor}">{{reName}}</div>
                    </div>

                    <p class="name">{{personInfo.personName}} <i class="icon-bagde-job" :style="iconBagdeJob">{{iconBagdeStatus}}</i></p>
                    <p class="phone" v-if="personInfo.empCode">{{personInfo.empCode}}</p>
                </div>
                <div class="detaile-full-header-base" v-if="infoSetId === 'person_list' || infoSetId === 'person_out_list'">
                    <dl>
                        <span v-if="personInfo.orgName">{{personInfo.orgName}}</span>
                        <span v-if="personInfo.posName"> | {{personInfo.posName}}</span>
                        <span v-if="personInfo.jobName"> | {{personInfo.jobName}}</span>
                        <span v-if="personInfo.levelName"> | {{personInfo.levelName}}</span>
                        <span v-if="personInfo.reportPersonName"> | 汇报上级至{{personInfo.reportPersonName}}</span>
                    </dl>
                    <dl v-if="infoSetId === 'person_list'">
                        <label v-if="personInfo.partPosName || personInfo.partJobName">兼任：</label>
                        <span v-if="personInfo.partPosOrgId">{{personInfo.partPosOrgName}}</span>
                        <span v-if="personInfo.partPosName"> | {{personInfo.partPosName}}</span>
                        <span v-if="personInfo.partJobName"> | {{personInfo.partJobName}}</span>
                    </dl>
                    <dl>
                        <span v-if="personInfo.personStatusName">{{personInfo.personStatusName}}</span>
                        <span v-if="personInfo.personTypeName"> | {{personInfo.personTypeName}}</span>
                        <span v-if="personInfo.joinDate"> | {{personInfo.joinDate}}入职</span>
                        <span v-if="personInfo.resignDate && infoSetId === 'person_out_list'"> | {{personInfo.resignDate}}离职</span>
                    </dl>
                </div>

                <template v-if="print">
                    <div class="detaile-full-header-btn" v-if="isInJob">

                        <Button type="primary" v-if="personInfo.validProbation"  @click="showDetailData('probation')">转正</Button>

                        <Tooltip content="有一个调整还未生效，请撤销后再试" v-if="!personInfo.validTranfer" placement="top-start">
                            <Button type="ghost" :disabled="true" @click="showDetailData('transfer')">调动</Button>
                        </Tooltip>
                        <Button type="ghost" v-else @click="showDetailData('transfer')">调动</Button>

                        <Tooltip content="有一个调整还未生效，请撤销后再试" v-if="!personInfo.validResign" placement="top-start">
                            <Button type="ghost" :disabled="true" @click="showDetailData('resign')">离职</Button>
                        </Tooltip>
                        <Button type="ghost" v-else @click="showDetailData('resign')">离职</Button>

                        <Dropdown placement="bottom-start" v-on:on-click="showDetailData">
                            <Button type="ghost">
                                更多
                                <Icon type="arrow-down-b"></Icon>
                            </Button>
                            <Dropdown-menu slot="list">
                                <Dropdown-item name="editInfo" v-if="personInfo.validModify">修改</Dropdown-item>
                                <Dropdown-item name="print">打印</Dropdown-item>
                                <Dropdown-item name="del">删除</Dropdown-item>
                            </Dropdown-menu>
                        </Dropdown>
                    </div>


                    <div class="detaile-full-header-btn" v-if="infoSetId === 'person_out_list'">
                        <Button type="ghost" @click="showDetailData('rehire')">再入职</Button>
                        <Button type="ghost" @click="showDetailData('print')">打印</Button>
                        <Button type="ghost" @click="showDetailData('del')">删除</Button>
                    </div>

                    <div class="detaile-full-header-btn" v-if="infoSetId === 'person_getin_before'">
                        <Button type="ghost" @click="showDetailData('print')">打印</Button>
                        <Button type="ghost" @click="showDetailData('del')">删除</Button>
                    </div>

                </template>


            </header>

            <affairSlideModel ref="affairSlideModel" :personInfo.sync="personInfo"></affairSlideModel>
        </div>
    </detailFull>
</template>

<style lang="scss">
    .detaile-full-header-wrapper{
        margin-bottom :20px;
    }
    .detaile-full-header-img p:last-child{
        margin-bottom:16px;
    }
    .detaile-full-header-img-head{
        width: 86px;
        height:86px;
        border-radius:50%;
        text-align: center;
        font-size: 24px;
        line-height: 86px;
        color: #fff;
        display:inline-block;
    }
    .detaile-full-page{
        .page-slide , .page-slide-cover{
            top:0;
        }

        .icon-bagde-job{
            font-size:12px;
            color:#fff;
            font-style :normal;
            padding : 4px 8px;
            border-radius:2px;
            position: relative;
            bottom:1px;
        }
        .icon-bagde-job-out{
            background : #8998AB;
        }
    }
</style>


<script>
    import affairSlideModel from "components/person_list/affairSlideModel"
    import detailFull from 'components/detailPage/detailFull'


    export default {
        name:'person_detail',
        data(){

            let params = this.$route.params
            return {
                infoSetId : params.infoSetId,
                personId : params.id,
                personInfo:{},//基本信息
                imgPath : gMain.imgPath,
                print:true,
                reloadFlag:true,
                iconBagdeStatus:'',
                iconBagdeJob:''
            };
        },
        components:{affairSlideModel,detailFull},
        computed:{
            portraitColor(){
                let colors = ["#07a9ea","#82c188","#ab97c2","#ffb500","#59ccce","#ff5959"];
                let _index= parseInt(this.personId)%6;
                return colors[_index];
            },
            isInJob(){

                switch(this.infoSetId){
                    case 'person_list' :
                        this.iconBagdeStatus = '在职';
                        this.iconBagdeJob =  {background:'#67C443'}
                        break
                    case 'person_out_list' :
                        this.iconBagdeStatus = '离职';
                        this.iconBagdeJob =  {background:'#8998AB'}
                        break
                    case 'person_getin_before' :
                        this.iconBagdeStatus = '待入职';
                        this.iconBagdeJob =  {background:'#FFB532'}
                        break
                }


                return this.infoSetId==='person_list';
            },
            reName(){
                let name = this.personInfo.personName;
                if (name) {
                    return name.substr(name.length-2,2);
                }
            }
        },
        created(){
            this.getDetailData();
        },
        methods:{
            reload(flag){
                this.reloadFlag = false;
                this.infoSetId = flag === 'in'?"person_list":"person_out_list";
                this.$router.push({
                    name:'person_detail',
                    params:{
                        personId:this.personId,
                        infoSetId : this.infoSetId
                    }
                })
                setTimeout(_=>{
                    this.reloadFlag = true;
                },10)
            },
            getPersonInfo(data){
                this.personInfo = data;
            },
            getDetailData(){
                const PERSON_DETAIL_LINK = this.infoSetId==='person_out_list'?'person/getOutJobPersonBaseInfo':'person/getOnJobPersonBaseInfo';

                this.$daydao.$ajax({
                    url:gMain.apiBasePath + PERSON_DETAIL_LINK,
                    data:JSON.stringify({personId:this.personId}),
                    success:data=>{
                        if(data.result === 'true'){
                            this.personInfo = data.data;
                        }
                    }
                });
            },
            showDetailData(type){
                if (type==='del') {
                    this.$Modal.confirm({
                        content: '确认删除该员工，该操作不可恢复',
                        onOk: () => {
                            this.delPeople();
                        }
                    })
                    return;
                }else if(type === 'print'){
                    this.print = false;
                    setTimeout(_=>{
                        window.print();
                        this.print = true;

                    },10)
                    return
                }

                this.$refs.affairSlideModel.show({
                    data : this.personInfo,
                    type : type,
                    callback:()=>{
                        this.getDetailData();
                        this.$refs.detailFull.$refs.operate.getRecordList();
                    }
                });

            },
            delPeople(){
                let data = {
                    "infoSetId":"person_list",
                    "uuidLists" :[this.personInfo.uuid]
                }
                this.$daydao.$ajax({
                    url : gMain.apiBasePath + 'route/person_list/del.do',
                    data: JSON.stringify(data),
                    success:data=>{
                        if (data.result === 'true') {
                            this.$Message.success('删除成功');
                            this.$router.back();
                        }else{
                            this.$Message.error(data.resultDesc || '删除失败');
                        }
                    }
                })
            },
            /**
             * 自定义事件，如果操作记录“撤销”成功，则会刷新基本信息
             */
            refreshPersonBaseInfo (){
                this.getDetailData();
            }
        }

    }
</script>
