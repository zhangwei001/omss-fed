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
</style>

<template>
    <detailFull :pageInfoSetId="infoSetId" :id="personId">
        <div slot="full-detail-header">
            <header class="detaile-full-header">
                <div class="detaile-full-header-img">
                    <div class="detaile-full-header-wrapper">
                        <img width="86" height="86" :src="imgPath+personInfo.headImg" v-if="personInfo.headImg" />
                        <div class="detaile-full-header-img-head" v-else :style="{background:portraitColor}">{{reName}}</div>
                    </div>

                    <p class="name">{{personInfo.personName}}</p>
                </div>
            </header>
        </div>
    </detailFull>
</template>

<script>
    import detailFull from 'components/detailPage/detailFull'
    
    export default {
        name:'person_complete',
        components:{detailFull},
        data(){
            return {
                infoSetId: '',
                personId: '',
                imgPath : gMain.imgPath,
                personInfo:{}

            }
        },
        computed:{
            portraitColor(){
                let colors = ["#07a9ea","#82c188","#ab97c2","#ffb500","#59ccce","#ff5959"];
                let _index= parseInt(this.personId)%6;
                return colors[_index];
            },
            reName(){
                let name = this.personInfo.personName;
                if (name) {
                    return name.substr(name.length-2,2);
                }
            }
        },
        created(){

            //:personId/:infoSetId
            this.infoSetId = this.$route.params.infoSetId;
            this.personId = this.$route.params.personId;
            // this.getDetailData();
        },
        methods:{
            getPersonInfo(data){
                console.log(data,222)
                this.personInfo = data;
            }
        }
    }
</script>
