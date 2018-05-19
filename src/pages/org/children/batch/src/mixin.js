import batch from "./tpl"

export default {
    data(){
        return {
            cloneData:[],
            classControl:[],

            keyValueBean:{
                jobId:{
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
                levelId:{
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
                personTypeId:{
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
                }
            },
            data : JSON.parse(sessionStorage.getItem('batch_choose'))
        }
    },
    components:{batch},
    created(){
        if (!this.data) {
            this.$router.back();
            return;
        }

        this.data.forEach(item=>{
            this.cloneData.push(Object.assign({},this.model,{personId:item.personId}));
            this.classControl.push(Object.assign({},this.model));
        })

        // get tree datas
        for(let k in this.beans){
            if (k==='orgId') {
                this.$daydao.$ajax({
                    url : gMain.apiBasePath + "org/getOrgPermissionTree",
                    data : JSON.stringify({permissionFilter:true}),
                    success : data=>{
                        if (data.result === 'true') {
                            this.beans[k] = data.data;
                        }
                    }
                })
            }
            else if(k === 'reportPersonId'){
                this.$daydao.$ajax({
                url: gMain.apiBasePath + "org/getReporteByCorp.do",
                    success: data => {
                        if (data.result === 'true') {
                            this.beans[k] = data.beans;
                        }
                    }
                })
            }
            else if(k === 'personStatusId'){
                this.$daydao.$ajax({
                    url : gMain.apiBasePath + "person/getJobPersonStaus.do",
                    data: JSON.stringify({}),
                    success : data=>{
                        if (data.result === 'true') {
                            this.beans[k] = data.beans;
                        }
                    }
                })
            }
            else if(k !== 'posId'){
                this.$daydao.$ajax({
                    url:gMain.apiBasePath +"route/getKeyValueData.do",
                    data:JSON.stringify(this.keyValueBean[k]),
                    success:data=>{
                        if(data.beans && data.beans.length){
                          this.beans[k] = data.beans;
                        }
                    }
                });
            }


        }
    },
    beforeDestroy(){
        sessionStorage.removeItem('batch_choose');
    },
    methods: {
        remove (index) {
            this.data.splice(index, 1);
            this.classControl.splice(index, 1);
            this.cloneData.splice(index, 1);

            if (this.data.length === 0) {
                this.$router.back();
            }
        },
        reset(){
            this.data.forEach((item , index)=>{
                this.cloneData.splice(index,1,Object.assign({},this.model));
                this.classControl.splice(index,1,Object.assign({},this.model));
            })
        },
        valid(){
            let valid = true;
            let msg = '';
            let isRequired = true;

            let _validHandler = (val , item , index , k)=>{
                //regExp
                if (this.rules[k].rule && typeof this.rules[k].rule ==='object') {
                    let reg = this.rules[k].rule.reg;
                    if (reg.test(val)) {
                        this.classControl[index][k] = false;
                    }else{
                        this.classControl[index][k] = true;
                        if (isRequired) msg = this.rules[k].rule.msg;
                        valid = false;
                    }
                }
                // custom valid
                else if(this.rules[k].rule && typeof this.rules[k].rule ==='function'){
                    let result = this.rules[k].rule(item,index);
                    if(typeof result === 'string' && result.length>0){
                        this.classControl[index][k] = true;
                        msg = result;
                        valid = false;
                    }else{
                        this.classControl[index][k] = false;
                    }
                }else{
                    // validation passed
                    this.classControl[index][k] = false;
                }
            }
            this.cloneData.forEach((item , index)=>{
                for(let k in this.rules){

                    let val = item[k];
                    //if the data need to be validated
                    if (this.rules[k].required) {
                        if (val) {
                            _validHandler(val , item , index ,k);
                        }
                        // default msg
                        else{
                            valid = false;
                            isRequired = false;
                            this.classControl[index][k] = true;
                            msg = '亲，你还有一些员工信息没填完整~';
                        }
                    }else{
                        val && _validHandler(val , item , index , k);
                    }


                }
            })
            valid || this.$Message.error(msg);
            return valid;
        },
        submit(){
            let valid = this.valid();
            valid && this.send();
        },
        sendAjax(url , datas){

            let title = this.$parent.title;

            this.$daydao.$ajax({
                url : gMain.apiBasePath + url,
                data : JSON.stringify({persons:datas}),
                beforeSend:()=>{
                    this.$children[0].spinShow = true;
                },
                success:data=>{
                    if (data.result==='true') {

                        let results = data.data.personResults;

                        if (data.data.sucNum === datas.length) {
                            this.$Message.success('操作成功');
                            const BACK_LINK = this.$route.path.includes('rehire')?'/person_out_list':'/person_list';
                            this.$router.push(BACK_LINK);

                        }else if(data.data.falNum === datas.length){
                            let msg = results[0].resp.resultDesc;
                            this.$Message.error(msg);
                        }else{
                            this.$Message.warning(`有${data.data.sucNum}人批量${title}成功，${data.data.falNum}人失败，请检查失败原因}`);
                            results.forEach(item=>{
                                if (item.resp.result ==='true') {
                                    let index = this.cloneData.findIndex(data=>data.personId == item.personId);
                                    this.remove(index);
                                }
                            })
                        }


                    }else{
                        this.$Message.error(data.resultDesc || '操作失败');
                    }
                    this.$children[0].spinShow = false;
                },
                error:data=>{
                    this.$Message.error('服务器错误');
                    this.$children[0].spinShow = false;
                }
            })
        }
    }
}
