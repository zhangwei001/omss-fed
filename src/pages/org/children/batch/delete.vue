<template>
    <div class="batch batch-step-wrapper batch-del">
        <section>
            <p class="success">
                <i class="iconfont_daydao_common">&#xe6a0;</i>
                以下员工将永久删除，该操作不可恢复
            </p>
            <Table :columns="colums" :data="dataLeft" height="500" :no-data-text="leftTip" :disabled-hover="true"></Table>
            <Page size="small" placement="top" class="batch-del-page" 
                show-sizer 
                :page-size-opts="pageSizeLimit" 
                :current="pageNoLeft" 
                :total="pageLeftTotal" 
                :page-size="pageSizeLeft" 
                show-total
                @on-change="onChangeLeftPageNo"
                @on-page-size-change="onPageSizeChangeLeft">        
            </Page>
        </section>
        <section>
            <p class="fail">
                <i class="iconfont_daydao_common">&#xe6f0;</i>
                以下员工已产生业务数据，无法删除
            </p>
            <Table :columns="colums" :data="dataRight" height="500" :no-data-text="rightTip" :disabled-hover="true"></Table>
            <Page size="small" placement="top" class="batch-del-page" 
                show-sizer :page-size-opts="pageSizeLimit" 
                :current="pageNoRight" 
                :total="pageRightTotal" 
                :page-size="pageSizeRight" 
                show-total
                @on-change="onChangeRightPageNo"
                @on-page-size-change="onPageSizeChangeRight">
            </Page>
        </section>


        <footer class="batch-fixed-bottom">
            <div class="pull-right">
                <Button @click="goBack">上一步</Button>
                <Button type="primary" :disabled="successUUID.length===0"  @click="submitHandler">确定</Button>
            </div>
        </footer>
    </div>
</template>

<script>


    export default {
        name: 'batchDelete',
        data() {
            return {
               data : JSON.parse(sessionStorage.getItem('batch_choose')),
               //store all datas
               failList : [],
               successList : [],

               successUUID :[],

               //tips for tabel
                leftTip : '数据加载中...',
                rightTip : '数据加载中...',

               //store the data to show
               dataLeft:[],
               dataRight:[],

               colums:[
                    {
                        title: '姓名',
                        key: 'personName',
                        width:100
                    },
                    {
                        title: '工号',
                        key: 'empCode',
                    },
                    {
                        title: '所属组织',
                        key: 'orgName',
                    },
                    {
                        title: '职位名称',
                        key: 'posName',
                        width:'auto'
                    }
               ],
               pageSizeLimit:[10,20,30,40,50,100],
               pageNoLeft : 1,
               pageNoRight : 1,
               pageLeftTotal : 0,
               pageRightTotal : 0,
               pageSizeLeft : 20,
               pageSizeRight :20
            }
        },
        created(){
            if (!this.data) {
                this.$router.back();
                return;
            }


            let uuidLists = this.data.map(item=>item.uuid);

            this.$daydao.$ajax({
                url : gMain.apiBasePath + "person/verifyDeletePersons",
                data : JSON.stringify({uuidLists:uuidLists}),
                success : data=>{
                    if (data.result === 'true') {
                        data.data.personResults.forEach(item=>{
                            if (item.resp.result==="true") {
                                this.successUUID.push(item.uuid);
                                let index = this.data.findIndex(origin=>origin.uuid==item.uuid);
                                let successData = this.data.splice(index,1);
                                this.successList.push(successData[0]);
                            }
                            
                        })
                        this.failList = this.data;
                        this.pageLeftTotal = this.successList.length;
                        this.pageRightTotal = this.failList.length;

                        // calculate the pages
                        this.calcData(this.successList , this.pageNoLeft , this.pageSizeLeft , 'dataLeft');
                        this.calcData(this.failList , this.pageNoRight , this.pageSizeRight , 'dataRight');

                        this.leftTip = '没有可以删除的人员';
                        this.rightTip = '无数据';

                    }
                }
            })

        },
        methods: {
            goBack(){
                this.$router.back();
            },
            submitHandler(){
                let data = {
                    "infoSetId":"person_list",
                    "uuidLists" : this.successUUID
                }

                this.$daydao.$ajax({
                    url : gMain.apiBasePath + 'route/person_list/del.do',
                    data: JSON.stringify(data),
                    success:data=>{
                        if (data.result === 'true') {
                            this.$Message.success('删除成功');
                            this.$router.push('/person_list');
                        }else{
                            this.$Message.error(data.resultDesc || '删除失败');
                        }
                    }
                })
            },
            onChangeLeftPageNo(num){
                this.pageNoLeft = num;
                this.calcData(this.successList , this.pageNoLeft , this.pageSizeLeft , 'dataLeft');
            },
            onPageSizeChangeLeft(num){
                this.pageSizeLeft = num;
                this.calcData(this.successList , this.pageNoLeft , this.pageSizeLeft , 'dataLeft');
            },
            onChangeRightPageNo(num){
                this.pageNoRight = num;
                this.calcData(this.failList , this.pageNoRight , this.pageSizeRight , 'dataRight');
            },
            onPageSizeChangeRight(num){
                this.pageSizeRight = num;
                this.calcData(this.failList , this.pageNoRight , this.pageSizeRight , 'dataRight');
            },
            calcData(data , pageNum , paegSize , result){
                this[result] = JSON.parse(JSON.stringify(data.slice((pageNum-1)*paegSize, (pageNum-1)*paegSize + paegSize)));
            }
        }
    }

</script>


<style lang="scss">
    .batch-del{
        display : flex;

        section{
            width: 50%;
            position: relative;
            .ivu-table-wrapper{
                border : 1px solid #e3e8ee;
            }
            .ivu-table table{
                width: 100% !important;
            }
            &:first-child{
                margin-right:50px;
            }

            p{
                font-size:14px;
                margin: 10px 0 ;
            }
        }

        p{
            &.success{
                color : #F49100;
            }
            &.fail{
                color : #657180;
            }
        }

        .batch-del-page{
            float: right;
            margin-top:15px;
        }
    }

</style>