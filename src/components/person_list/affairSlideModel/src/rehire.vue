<template>
    <div class="affair-model-center">
        <Form :model="modelVal" :rules="rules" ref="form" :label-width="112">
            <Form-item label="姓名" prop="personName">
                <Input class="input-w" v-model="modelVal.personName"></Input>
            </Form-item>


            <div class="ivu-form-inline">
                <Form-item label="手机号" prop="phone">
                    <Input v-model="modelVal.phone" class="input-w"></Input>
                </Form-item>
                <!-- <Checkbox class="checkbox-inline" v-model="modelVal.isPhoneShow">通讯录可见</Checkbox> -->
            </div>

            <Form-item label="组织" prop="orgName">
                <orgNameSelect id="orgName" v-model="modelVal.orgName" @getName="getName"></orgNameSelect>
            </Form-item>

            <Form-item label="入职日期" prop="effectiveDate">
                <Date-picker class="input-w" type="date" @on-change="getDate" v-model="modelVal.joinDate"></Date-picker>
            </Form-item>

            <Form-item label="员工状态" prop="personStatus">
                <personStatusSelect id="personStatus" v-model="modelVal.personStatus"></personStatusSelect>
            </Form-item>

            <Form-item label="员工类型" prop="personType">
                <tree-select :keyValueBean="keyValue.personType" :id="'reportTree'" v-model="modelVal.personType"></tree-select>
            </Form-item>

            <Form-item label="试用期(月)" prop="inMonth" v-if="modelVal.personType == 2">
                <Input class="input-w" v-model="modelVal.inMonth"></Input>
            </Form-item>

            <Form-item label="职位">
                <simpleDropSelectForAdd :width="210" v-model="modelVal.posName" :relatedNodeId="modelVal.orgName" :relatedNodeName="orgName" itemId="posName"></simpleDropSelectForAdd>
            </Form-item>

            <Form-item label="汇报对象">
                <reportSelect id="report" v-model="modelVal.report"></reportSelect>
            </Form-item>

            <Form-item label="邮箱">
                <Input class="input-w" v-model="modelVal.emailAddress"></Input>
            </Form-item>

            <Form-item label="工号" prop="empCode">
                <Input class="input-w" v-model="modelVal.empCode"></Input>
            </Form-item>

            <Form-item label="性别">
                <Radio-group v-model="modelVal.sex">
                    <Radio label="男"></Radio>
                    <Radio label="女"></Radio>
                </Radio-group>
            </Form-item>
        </Form>
    </div>


</template>


<script>

import treeSelect from "./treeSelect"
import orgNameSelect from "./treeSelect/orgName"
import reportSelect from "./treeSelect/report"

import personStatusSelect from "./treeSelect/personStatus"
import simpleDropSelectForAdd from 'components/simple_drop_select_for_add/index'
import mixin from './mixin.js'

export default {
    name: 'rehire',
    props:{
        personInfo: {
            type: Object,
        },
    },
	data () {

        let phoneCheck = (rule , value , callback)=>{
            if (/^1(3|4|5|7|8|9)\d{9}$/.test(value)) {
                callback();
            }else{
                callback(new Error('手机号码有误'));
            }
        }

        let inMonthCheck = (rule , value , callback)=>{
            if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
                callback();
            }else{
                callback(new Error('试用期只能输入数字'));
            }
        }

        let empCodeCheck = (rule , value , callback)=>{
            if (/^[A-Za-z0-9]*$/.test(value)) {
                callback();
            }else{
                callback(new Error('工号只能输入数字或者字母'));
            }
        }


        return {
            title:'再入职',
        	modelVal:{
                personName:'',
                orgName:'',
                effectiveDate:'',
                personStatus:'',
                inMonth:'3',
                phone:'',
                sex:'',
                emailAddress:'',
                isPhoneShow:true,
                personType:'',
                report:'',
                posName:'',
                joinDate:'',
                empCode:''
            },
            orgName:'',
            rules:{
                personName:[{required: true , trigger:'blur' , message:'姓名不能为空'}],
                phone:[{required: true , trigger:'blur' , message:'手机号不能为空'},{validator:phoneCheck ,trigger:'blur'}],
                empCode:[{validator:empCodeCheck ,trigger:'blur'}],
                orgName:[{required: true, message:'组织不能为空'}],
                effectiveDate:[{required: true , message:'入职日期不能为空'}],
                personStatus:[{required: true ,  message:'员工状态不能为空'}],
                personType:[{required: true ,  message:'员工类型不能为空'}],
                inMonth:[{required: true , trigger:'blur' ,  message:'试用期不能为空'},{validator:inMonthCheck , trigger:'blur'}],
            },
            keyValue : this.$parent.$parent.keyValue,
        };
    },
    mixins: [mixin],
    components:{treeSelect,orgNameSelect,simpleDropSelectForAdd,reportSelect,personStatusSelect},
    watch:{
        'modelVal.orgName':{
            handler(val){
                this.$daydao.$ajax({
                    url : gMain.apiBasePath + "org/getOrgLeader.do",
                    data : JSON.stringify({orgId: val}),
                    success : data=>{
                        if (data.result === 'true') {
                            this.modelVal.report = data.person.personId+"";
                        }
                    }
                })
            }
        }
    },
    mounted(){

        this.modelVal.personName = this.personInfo.personName;
        this.modelVal.phone = this.personInfo.cellPhone;
        this.modelVal.empCode = this.personInfo.empCode;

    },
    methods:{
        getDate(date){
            this.modelVal.effectiveDate = date;
        },
        getName(name){
            this.orgName = name;
        },
        save(fn){

            this.$refs.form.validate(valid=>{
                if (!valid) return;

                let t = this.modelVal;
                let data = {
                    cellPhone: t.phone,
                    emailAddress : t.emailAddress,
                    inMonth :  t.inMonth,
                    isPhoneShow : t.isPhoneShow?1:0,
                    joinDate : t.effectiveDate,
                    orgId : t.orgName,
                    personId : this.data.personId,
                    personName : t.personName,
                    personStatusId : t.personStatus,
                    personTypeId : t.personType,
                    posId : t.posName,
                    reportPersonId: t.report,
                    sex : t.sex==="男"?1:2,
                    empCode : t.empCode
                }

                this.submit("affairReHire/rehire.do" , data , fn)
            })
        }
    }
}


</script>

<style lang="scss">


</style>
