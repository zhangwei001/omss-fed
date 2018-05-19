<template>
    <Form :model="modelVal"  ref="form" :rules="rules" :label-width="112">
        <Form-item label="姓名">
            <div class="older-data">
                {{reData.personName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <Input class="input-w" v-model="modelVal.personName"></Input>   
        </Form-item>

        <Form-item label="工号" prop="empCode">
            <div class="older-data">
                {{reData.empCode}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <Input class="input-w" v-model="modelVal.empCode"></Input>
        </Form-item>

        <Form-item label="组织" prop="orgName">
            <div class="older-data">
                {{reData.orgName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <orgNameSelect id="orgName" v-model="modelVal.orgName" @getName="getName"></orgNameSelect>
        </Form-item>

        <Form-item label="职位">
            <div class="older-data">
                {{reData.posName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <simpleDropSelectForAdd :width="210" v-model="modelVal.posName" :relatedNodeId="modelVal.orgName" :relatedNodeName="orgName" itemId="posName" @addOrgPosCallback="addOrgPosCallback"></simpleDropSelectForAdd>
            <a class="affair-model-btn-add" v-if="!isShow.partPosName" @click="addForm('partPosName')">增加</a>
        </Form-item>

        <Form-item label="兼任职位" v-if="isShow.partPosName">
            <div class="older-data">
                {{reData.partPosName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <partPosName id="partPosName" v-model="modelVal.partPosName" ref="partPosName"></partPosName>
            <a class="affair-model-btn-add" v-if="isShow.partPosName" @click="removeForm('partPosName')">撤销</a>
        </Form-item>

        <Form-item label="职务">
            <div class="older-data">
                {{reData.jobName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <tree-select :keyValueBean="keyValue.jobName" :id="'dutyTree'" v-model="modelVal.jobName"></tree-select>
            <a class="affair-model-btn-add" v-if="!isShow.partJobName" @click="addForm('partJobName')">增加</a>
        </Form-item>

        <Form-item label="兼任职务" v-if="isShow.partJobName">
            <div class="older-data">
                {{reData.partJobName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <tree-select :keyValueBean="keyValue.jobName" :id="'partJobNameTree'" v-model="modelVal.partJobName"></tree-select>
            <a class="affair-model-btn-add" v-if="isShow.partJobName" @click="removeForm('partJobName')">撤销</a>
        </Form-item>

        <Form-item label="汇报对象">
            <div class="older-data">
                {{reData.reportPersonName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <reportSelect id="report" v-model="modelVal.report"></reportSelect>
        </Form-item>

        <Form-item label="职级">
            <div class="older-data">
                {{reData.levelName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <tree-select :keyValueBean="keyValue.level" :id="'levelTree'" v-model="modelVal.level"></tree-select>
        </Form-item>


        <Form-item label="入职日期">
            <div class="older-data">
                {{reData.joinDate}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <Date-picker type="date" class="input-w" @on-change="getDate($event , 'joinDate')"></Date-picker>
        </Form-item>

        <Form-item label="员工状态">
            <div class="older-data">
                {{reData.personStatusName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <personStatusSelect id="personStatus" v-model="modelVal.personStatus"></personStatusSelect>
        </Form-item>        

        <Form-item label="员工类型">
            <div class="older-data">
                {{reData.personTypeName}}
            </div>
            <template  v-if="reData.personType!=='全职'">
                <i class="iconfont_daydao_common affair-model-arrow"></i>
                <tree-select :keyValueBean="keyValue.personType" :id="'reportTree'" v-model="modelVal.personType"></tree-select>
            </template>
        </Form-item>

        <Form-item label="试用期(月)"  class="tips" prop="inMonth" v-if="modelVal.personType == 2">
            <Input class="input-w" v-model="modelVal.inMonth"></Input>
        </Form-item>


        <Form-item label="组织负责人交接" v-if="data.validOrgLeader && !data.validModiyToPerfect">
            <div class="older-data">
                {{reData.personName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <reportSelect  id="OrgLeader" v-model="modelVal.OrgLeader"></reportSelect>
        </Form-item>

        <Form-item label="调整原因" v-if='!data.validModiyToPerfect'>
            <Input v-model="modelVal.remark"></Input>
        </Form-item>

        <Form-item label="生效日期" v-if='!data.validModiyToPerfect'>
            <Date-picker type="date" class="input-w" placement="top-start"  @on-change="getDate($event , 'effectiveDate')" placeholder="立即生效"></Date-picker>
        </Form-item>

    </Form>
	
</template>

<style>
    .affair-model-content .tips .ivu-form-item-error-tip{
        left: 0;
    }
</style>

<script>

import treeSelect from "./treeSelect"
import reportSelect from "./treeSelect/report"
import orgNameSelect from "./treeSelect/orgName"
import partPosName from "./treeSelect/partPosName"
import personStatusSelect from "./treeSelect/personStatus"
import simpleDropSelectForAdd from 'components/simple_drop_select_for_add/index'
import mixin from './mixin.js'


export default {
	data () {

        let empCodeCheck = (rule , value , callback)=>{
            if (/^[A-Za-z0-9]*$/.test(value)) {
                callback();
            }else{
                callback(new Error('工号只能输入数字或者字母'));
            }
        }

        let inMonthCheck = (rule , value , callback)=>{
            if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
                callback();
            }else{
                callback(new Error('试用期只能输入数字'));
            }
        }

        return {
            title:'基本信息调整',
            isShow:{
                partPosName : false,
                partJobName : false
            },
        	modelVal:{
                remark : '',
                empCode:'',
                personName:'',
                joinDate:'',
                partPosName :'',
                level :'',
                jobName:'',
                report:'',
                posName:'',
                orgName:'',
                partJobName:'',
                OrgLeader:'',
                personStatus:'',
                SubPerson:'',
                personType:'',
                effectiveDate : '',
                inMonth : '3'
            },
            orgName:'',
            keyValue : this.$parent.$parent.keyValue,

            rules:{
                empCode:[{validator:empCodeCheck,trigger:'blur'}],
                inMonth:[{required: true , trigger:'blur' ,  message:'试用期不能为空'},{validator:inMonthCheck , trigger:'blur'}],
            }
        };
    },
    computed:{
        reData(){
            let data = {};
            for(let k in this.data){
                data[k] = this.data[k]?this.data[k]:'无';
            }
            this.data.partPosName && (this.isShow.partPosName = true);
            this.data.partJobName && (this.isShow.partJobName = true);
            return data;
        }
    },
    mixins: [mixin],
    components:{treeSelect,partPosName,simpleDropSelectForAdd,reportSelect,orgNameSelect,personStatusSelect},
    methods:{
        getDate(date , type){
            this.modelVal[type] = date;
        },
        getName(name){
            this.orgName = name;
        },
        addForm(val){
            this.isShow[val] = true;
            this.modelVal[val] = '';
        },
        removeForm(val){
            this.isShow[val] = false;
            this.modelVal[val] = -1;
        },
        addOrgPosCallback(){
            this.isShow.partPosName && this.$refs.partPosName.getList();
        },
        save(fn){
            let t = this.modelVal;

            let data = {
                effectiveDate : t.effectiveDate,
                empCode: t.empCode,
                jobId : t.jobName,
                joinDate: t.joinDate,
                levelId : t.level,
                newOrgLeaderPersonId : t.OrgLeader,
                newSubReportPersonId : t.SubPerson,
                orgId : t.orgName,
                partJobId : t.partJobName,
                partPosId : t.partPosName,
                personId : this.data.personId,
                personName : t.personName,
                personTypeId : t.personType,
                posId : t.posName,
                remark : t.remark,
                personStatusId : t.personStatus,
                reportPersonId : t.report
            }

            //Check that the data has been changed
            let isEmpty = true;
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                if (data[keys[i]] !=='' && keys[i]!=='personId') {
                    if (data[keys[i]] != this.data[keys[i]]) {
                        isEmpty = false;
                        break
                    }
                }
            }

            if (isEmpty) {
                this.$Message.success('此次操作无任何修改');
                fn();
                return;
            }


            const AJAXURL = this.data.validModiyToPerfect ? "affairPerfect/perfect.do" : "affairModify/modify.do";

            this.$refs.form.validate(valid=>{
                if (valid) this.submit(AJAXURL , data , fn);
            })

        }
    }
}
	

</script>

<style lang="scss">

	
</style>