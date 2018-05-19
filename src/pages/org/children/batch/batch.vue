<template>
    <div class="batch">
        <div class="header">
            <div class="back" @click="goBack">
                <Icon type="chevron-left" />
                <span>返回</span>
            </div>
            <div class="title">批量{{title}}</div>
        </div>

        <div class="batch-step">
            <Steps :current="step">
                <Step title="选择人员"></Step>
                <Step :title="stepSecond"></Step>
            </Steps>
        </div>


        <router-view></router-view>
    </div>
</template>

<script>
    import './src/index.scss'

    export default {
        name: 'batch',
        data() {
            return {
                stepSecond : '',
                step : 0,
                title : '',
                infoSetId : ''
            }
        },
        beforeRouteEnter(to, from, next){
            let title = '',
                stepSecond = '',
                infoSetId = '';

            if (to.fullPath.includes('probation')) {
                title = '转正';
                stepSecond = '转正调整';
            }
            else if(to.fullPath.includes('tranfer')){
                title = '调动';
                stepSecond = '批量调动';
            }
            else if(to.fullPath.includes('resign')){
                title = '离职';
                stepSecond = '批量离职';
            }else if(to.fullPath.includes('rehire')){
                title = '再入职';
                stepSecond = '批量再入职';
            }else if(to.fullPath.includes('delete')){
                title = '删除';
                stepSecond = '删除确认';
            }


            next(vm=>{
                vm.title = title;
                vm.stepSecond = stepSecond;
                vm.step = vm.$route.fullPath.includes('choose')?0:1;
                vm.infoSetId = infoSetId;
                document.title = '批量' + title;
            })
        },
        mounted(){
            this.step = this.$route.fullPath.includes('choose')?0:1;
        },
        beforeRouteUpdate(to,from ,next){
            this.step = to.fullPath.includes('choose')?0:1;
            next();
        },
        methods:{
            goBack(){
                this.$router.back();
            }
        }
    }

</script>