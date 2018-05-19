<template>
    <Form :model="modelVal" :rules="rules"  ref="form" :label-width="112">
        <Form-item label="姓名" class="affair-model-text">
            {{reData.personName}}
        </Form-item>

        <Form-item label="工号">
            {{reData.empCode}}
        </Form-item>

        <Form-item label="员工类型">
            <div class="older-data">
                {{reData.personTypeName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <Input v-model="modelVal.personType" class="input-w" disabled></Input>
        </Form-item>

        <Form-item label="组织">
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
            <simpleDropSelectForAdd :width="210" v-model="modelVal.posName" :relatedNodeId="modelVal.orgName" :relatedNodeName="orgName" itemId="posName"></simpleDropSelectForAdd>
        </Form-item>

        <Form-item label="汇报对象">
            <div class="older-data">
                {{reData.reportPersonName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <reportSelect id="report" v-model="modelVal.report"></reportSelect>
        </Form-item>

        <Form-item label="职务">
            <div class="older-data">
                {{reData.jobName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <tree-select :keyValueBean="keyValue.jobName" :id="'dutyTree'" v-model="modelVal.jobId"></tree-select>
        </Form-item>

        <Form-item label="职级">
            <div class="older-data">
                {{reData.levelName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <tree-select :keyValueBean="keyValue.level" :id="'levelTree'" v-model="modelVal.level"></tree-select>
        </Form-item>
        
        <Form-item label="转正说明">
            <Input  type="textarea" v-model="modelVal.remark"></Input>
        </Form-item>

        <Form-item label="转正日期">
            <Date-picker type="date" class="input-w" placement="top-start" placeholder="立即生效"  @on-change="getDate"></Date-picker>
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
        return {
            title:'转正',
        	modelVal:{
                remark : '',
                effectiveDate : '',
                personType :'全职',
                level :'',
                jobId:'',
                report:'',
                posName:'',
                orgName:'',
            },
            orgName:'',
            keyValue : this.$parent.$parent.keyValue,
        };
    },
    computed:{
        reData(){
            let data = {}
            for(let k in this.data){
                data[k] = this.data[k]?this.data[k]:'无';
            }
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
        getDate(date){
            this.modelVal.effectiveDate = date;
        },
        getName(name){
            this.orgName = name;
        },
        save(fn){
                let t = this.modelVal;
                let data = {
                    effectiveDate : t.effectiveDate,
                    jobId :  t.jobId,
                    levelId: t.level,
                    orgId : t.orgName,
                    personId : this.data.personId,
                    posId : t.posName,
                    remark : t.remark,
                    reportPersonId : t.report
                }
                this.submit("affairProbation/probation.do" , data , fn)
        }
    }
}
	

</script>