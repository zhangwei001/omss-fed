<style lang="scss">
    @import "../../../style/person_list.scss";
    $prefixCls:hr_person_list;

    /*头部返回*/
    .#{$prefixCls}{
        &-header-bar{
            background: #F5F7F9;
            height: 46px;
            line-height: 46px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            .left-back-nav {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #657180;
                margin-left: 1.5%;

                &:hover{
                    cursor: pointer;
                }
            }
        }

        &-header-title{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #657180;
            text-align: center;
            margin-left: -102px;
        }

        .page_table{
            //margin-top:10px;
        }

    }

    .person-inactive-search{

        .page-btn-group{
            display: inline-block;
        }
    }

    .person-inactive-search-icon{
        font-size: 14px;
        color: #2D8CF0;
    }

    .person-inactive-search-content{
        font-size: 12px;
        color: #657180;
    }

    .detail-list-modeal{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;

        .ivu-modal-footer{
            padding: 24px 18px;
            border-top: none;
        }

        .ivu-modal{
            top: 0;
        }
    }
</style>
<template>
    <div :class="[prefixCls,'clearfix']">
        <!--页面返回条-->
        <header :class="[prefixCls + '-header-bar']">
            <router-link class="left-back-nav" to="/person_list">
                <Icon type="chevron-left"></Icon>
                <span>返回</span>
            </router-link>
            <h1 :class="[prefixCls + '-header-title']">未激活员工</h1>
            <span></span>
        </header>

        <table-data-list ref="tableDataList" :infoSetId="infoSetId" :cardListOptions="cardListOptions" @cell-click="cellClick">
            <!--这里允许通过 <div slot="模块名称"></div> 来重写列表数据组件的模板-->
            <!--重写顶部为空-->
            <div slot="page-top">

            </div>

            <div slot="page-btn-group" class="person-inactive-search">
                <btn-group :btns="defineBtns"></btn-group>
                <!--<i class="icon iconfont_daydao_common person-inactive-search-icon">&#xe614;</i>
                <span class="person-inactive-search-content">每位员工每天最多收到一条邀请短信</span>-->
            </div>
        </table-data-list>

        <!-- 弹窗 -->
        <Modal
            :title="showModal.title"
            :mask-closable="false"
            :closable="false"
            v-model="modalState"
            width="360px"
            class-name="vertical-center-modal detail-list-modeal">

            <p v-html="showModal.content" style="padding: 5px; font-size: 14px;"></p>

            <div slot="footer" style="text-align: right;">
                <Button type="primary" @click="modalCancel">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script type="text/babel">

    import tableDataList from "commonVueLib/tableDataList/index"
    import personListMethods from 'components/person_list/person_list_methods.js';  //员工列表的公共方法调用
    import btnGroup from 'commonVueLib/btnGroup'; //高级搜索


    const infoSetId = "person_inactive_list";  //页面信息集ID

    export default {
        name:infoSetId
        ,data(){
            var t = this;
            return {
                //信息集ID
                infoSetId:infoSetId
                ,prefixCls:'hr_person_list'
                ,modalState: false
                ,showModal: {state: false, title: '提示', content: '<i class="icon iconfont_daydao_common person-inactive-search-icon" style="margin-right: 5px">&#xe614;</i>每位员工每天最多收到一条邀请短信'}   // 发送激活邀请后的提示框
                //卡片字段
                ,cardListOptions:{
                     isShowImg:true //是否显示头像
                    ,imgFields:{img:"head_img",title:"person_name",id:"person_id"}  //显示头像的关联字段名，三个
                    ,boldFields:["person_name","person_type"] //加粗显示的字段，两个
                }
                //表格左上方按钮
                ,defineBtns:[
                    {
                        name:'一键发送激活邀请',
                        active: true,
                        event:()=>{
                            t.sendMsm();
                        }
                    },
                    {
                        name:'导出未激活员工',
                        //active: true,
                        event:()=>{
                            //t.sendMsm();
                            t.$refs.tableDataList.exportExcel();
                        }
                    },
                ]
            };
        }
        ,components:{
            tableDataList,
            btnGroup
        }
        ,mounted(){
            var t = this;
            t.$refs.tableDataList.formatTableData = t.formatTableData;

        }
        ,methods:{
            /**
             * 格式化表格数据
             * */
            formatTableData(arr){
                var t = this;
                return personListMethods.formatTableData(t,arr);
            },
            /**
             * 发送激活请求
             * */
            sendMsm (){
                var _this = this;

                _this.$daydao.$ajax({
                    url: gMain.apiBasePath +"addPersonUI/sendMsm.do",
                    data:JSON.stringify({}),
                    success: function(data){
                        if(data.result === "true") {
                            _this.$Message.success("发送成功");

                            // 显示提示框
                            _this.modalState = true;
                        }else{
                            _this.$Message.error("发送失败");
                        }
                    }
                });
            },
            /**
             * 点击确定按钮，取消弹框
             */
            modalCancel (){
                this.modalState = false;
            }
            /**
             * 单元格的点击
             * */
            ,cellClick(row, column, cell, event){
                var t = this;
                if(column.property == 'person_name'){
                    personListMethods.goPersonLink({
                        row:row
                        ,column:column
                        ,cell:cell
                        ,event:event
                        ,personList:t
                    });
                }
            }

        }

    }
</script>
