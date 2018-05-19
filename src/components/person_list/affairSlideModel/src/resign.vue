<template>
    <Form :model="modelVal"  :label-width="112">
        <Form-item label="姓名" class="affair-model-text">
            {{reData.personName}}
        </Form-item>

        <Form-item label="工号" class="affair-model-text">
            {{reData.empCode}}
        </Form-item>

        <Form-item label="员工类型" class="affair-model-text">
            {{reData.personTypeName}}
        </Form-item>

        <Form-item label="组织" class="affair-model-text">
            {{reData.orgName}}
        </Form-item>

        <Form-item label="职位" class="affair-model-text"> 
            {{reData.posName}}
        </Form-item>

        <Form-item label="兼任职位" class="affair-model-text">
            {{reData.partPosName}}
        </Form-item>

        <Form-item label="职务" class="affair-model-text">
            {{reData.jobName}}
        </Form-item>

        <Form-item label="兼任职务" class="affair-model-text">
            {{reData.partJobName}}
        </Form-item>

        <Form-item label="汇报对象" class="affair-model-text">
            {{reData.reportPersonName}}
        </Form-item>

        <Form-item label="职级">
            {{reData.levelName}}
        </Form-item>

        <Form-item label="组织负责人交接" v-if="data.validOrgLeader">
            <div class="older-data">
                {{reData.personName}}
            </div>
            <i class="iconfont_daydao_common affair-model-arrow"></i>
            <reportSelect  id="OrgLeader" v-model="modelVal.OrgLeader"></reportSelect>
        </Form-item>

        <Form-item label="离职说明">
            <Input v-model="modelVal.remark"></Input>
        </Form-item>

        <Form-item label="离职日期">
            <Date-picker type="date" placement="top-start" class="input-w" @on-change="getDate" placeholder="立即生效"></Date-picker>
        </Form-item>

    </Form>
	
</template>


<script>

import reportSelect from "./treeSelect/report"
import mixin from './mixin.js'


export default {
	data () {
        return {
            title:'离职',
        	modelVal:{
               OrgLeader:'',
               SubPerson:'',
               effectiveDate:''
            },
            dropData:{
                report:[]
            }
        };
    },
    computed:{
        reData(){
            let data = {};
            for(let k in this.data){
                data[k] = this.data[k]?this.data[k]:'无';
            }
            return data;
        }
    },
    mixins: [mixin],
    components:{reportSelect},
    methods:{
        getDate(date){
            this.modelVal.effectiveDate = date;
        },
        save(fn){
            let t = this.modelVal;
            let data = {
                effectiveDate : t.effectiveDate,
                newOrgLeaderPersonId : t.OrgLeader,
                newSubReportPersonId : t.SubPerson,
                personId : this.data.personId,
                remark : t.remark,
            }

           this.submit("affairResign/resign.do" , data , fn)

        }
    }
}
	

</script>