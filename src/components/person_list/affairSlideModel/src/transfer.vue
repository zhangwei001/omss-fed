<template>
    <Form :model="modelVal" :rules="rules"  ref="form" :label-width="112">
        <Form-item label="姓名" class="affair-model-text">
            {{reData.personName}}
        </Form-item>

        <Form-item label="工号" class="affair-model-text">
            {{reData.empCode}}
        </Form-item>

        <Form-item label="员工类型">
            {{reData.personTypeName}}
        </Form-item>

        <Form-item label="组织" prop="orgName">
            <div class="older-data">
                {{reData.orgName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <orgNameSelect id="orgName" v-model="modelVal.orgName" @getName="getName"></orgNameSelect>
        </Form-item>

        <Form-item label="职位" prop="posName">
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
            <tree-select :keyValueBean="keyValue.jobName" id="jobName" v-model="modelVal.jobName"></tree-select>
            <a class="affair-model-btn-add" v-if="!isShow.partJobName" @click="addForm('partJobName')">增加</a>
        </Form-item>

        <Form-item label="兼任职务" v-if="isShow.partJobName">
            <div class="older-data">
                {{reData.partJobName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <tree-select :keyValueBean="keyValue.jobName" id="partJobName" v-model="modelVal.partJobName"></tree-select>
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

        <Form-item label="组织负责人交接" v-if="data.validOrgLeader">
            <div class="older-data">
                {{reData.personName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <reportSelect  id="OrgLeader" v-model="modelVal.OrgLeader"></reportSelect>
        </Form-item>
        
        <Form-item label="调动说明">
            <Input v-model="modelVal.remark"></Input>
        </Form-item>

        <Form-item label="调动日期">
            <Date-picker type="date" placement="top-start" class="input-w" v-model="modelVal.effectiveDate" @on-change="getDate" placeholder="立即生效"></Date-picker>
        </Form-item>

    </Form>
	
</template>


<script>

import treeSelect from "./treeSelect"
import reportSelect from "./treeSelect/report"
import orgNameSelect from "./treeSelect/orgName"
import partPosName from "./treeSelect/partPosName"
import simpleDropSelectForAdd from 'components/simple_drop_select_for_add/index'
import mixin from './mixin.js'

export default {
	data () {

        let orgCheck = (rule , value , callback)=>{
            if (value == this.reData.orgId) {
                callback(new Error('调动的组织不能跟以前的相同'));
            }else{
                callback();
            }
        }

        return {
            title:'调动',
            isShow:{
                partPosName : false,
                partJobName : false
            },
        	modelVal:{
                remark : '',
                effectiveDate : '',
                partPosName :'',
                level :'',
                jobName:'',
                report:'',
                posName:'',
                orgName:'',
                partJobName:'',
                OrgLeader:'',
                SubPerson:'',
            },
            orgName:'',
            rules:{
                orgName:[
                    {required: true, message: '组织不能为空'},
                    {validator : orgCheck}
                ],
                posName:[{required: true, message: '职位不能为空'}]

            },
            keyValue : this.$parent.$parent.keyValue,
        };
    },
    computed:{
        reData(){
            let data = {};
            for(let k in this.data){
                data[k] = this.data[k]?this.data[k]:'无';
            }
            this.data.partPosName || (this.isShow.partPosName = false);
            this.data.partJobName || (this.isShow.partJobName = false);
            return data;
        }
    },
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
    mixins: [mixin],
    components:{treeSelect,simpleDropSelectForAdd,reportSelect,orgNameSelect,partPosName},
    methods:{
        addForm(val){
            this.isShow[val] = true;
            this.modelVal[val] = '';
        },
        getDate(date){
            this.modelVal.effectiveDate = date;
        },
        getName(name){
            this.orgName = name;
        },
        removeForm(val){
            this.isShow[val] = false;
            this.modelVal[val] = '';
        },
        addOrgPosCallback(){
            this.isShow.partPosName && this.$refs.partPosName.getList();
        },
        save(fn){
            this.$refs.form.validate(valid=>{
                if (!valid) return;

                let t = this.modelVal;
                let data = {
                    effectiveDate : t.effectiveDate,
                    jobId : t.jobName,
                    levelId: t.level,
                    newOrgLeaderPersonId : t.OrgLeader,
                    newSubReportPersonId : t.SubPerson,
                    orgId : t.orgName,
                    partJobId : t.partJobName,
                    partPosId : t.partPosName,
                    personId : this.data.personId,
                    posId : t.posName,
                    remark : t.remark,
                    reportPersonId : t.report
                }

                this.submit("affairTransfer/transfer.do" , data , fn)

            })
        }
    }
}
	

</script>