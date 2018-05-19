<template>
    <div>
        <person-select class="batch-step-wrapper" ref="select" :getPersonListParams="personListParams"></person-select>

        <footer class="batch-fixed-bottom">
            <div class="pull-right">
                <Button type="primary" @click="next">下一步</Button>
                <Button @click="goBack">取消</Button>
            </div>
        </footer>
    </div>
</template>

<script>
    import personSelect from 'commonVueLib/personSelect'

    export default {
        name: 'batchTranfer',
        data() {
            return {
                origin : '',
                personListParams : {
                    "infoSetId": this.infoSetId()
                }
            }
        },
        components:{personSelect},
        methods: {
            next(){
                //get people data
                let resultData = this.$refs.select.resultData;
                if (resultData.length === 0) {
                    this.$Message.warning('请选择需要'+this.$parent.title+'的人员')
                    return
                }
                sessionStorage.setItem('batch_choose' , JSON.stringify(resultData));

                this.$router.push('/batch/'+this.$route.params.origin);
            },
            goBack(){
                this.$router.back();
            },
            resetSelect(){
                this.$refs.select.resetData();
            },
            infoSetId(){
                let path = this.$route.fullPath;
                if (path.includes('probation')) {
                    return 'person_list_probation';
                }else if(path.includes('tranfer')){
                    return 'person_list_transfer';
                }else if(path.includes('resign')){
                    return 'persn_list_resign';
                }else if(path.includes('rehire')){
                    return 'persn_list_rehire';
                }
            }
        }
    }

</script>
