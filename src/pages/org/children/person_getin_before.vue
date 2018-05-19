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
            <h1 :class="[prefixCls + '-header-title']">待入职员工</h1>
            <span></span>
        </header>

        <table-data-list ref="tableDataList" :infoSetId="infoSetId" :cardListOptions="cardListOptions" :defineBtns="defineBtns" @cell-click="cellClick">
            <!--这里允许通过 <div slot="模块名称"></div> 来重写列表数据组件的模板-->
            <!--重写顶部为空-->
            <div slot="page-top">

            </div>
        </table-data-list>

    </div>
</template>

<style lang="scss">


</style>

<script type="text/babel">

    import tableDataList from "commonVueLib/tableDataList/index"
    import personListMethods from 'components/person_list/person_list_methods.js';  //员工列表的公共方法调用


    const infoSetId = "person_getin_before";  //页面信息集ID

    export default {
        name:infoSetId
        ,data(){
            var t = this;
            return {
                //信息集ID
                infoSetId:infoSetId
                ,prefixCls:'hr_person_list'
                //卡片字段
                ,cardListOptions:{
                    isShowImg:true //是否显示头像
                    ,imgFields:{img:"head_img",title:"person_name",id:"person_id"}  //显示头像的关联字段名，三个
                    ,boldFields:["person_name","person_type"] //加粗显示的字段，两个
                }
                //表格左上方按钮
                ,defineBtns:[
                    /*{
                        name:'一键发送激活邀请',
                        active: true,
                        event:()=>{

                        }
                    }*/
                ]
            };
        }
        ,components:{
            tableDataList
        }
        ,created(){
            var t = this;

        }
        ,mounted(){
            var t = this;
            t.$refs.tableDataList.formatTableData = t.formatTableData;
            $('#daydao_header_app').css({
                display: 'block'
            });

            //员工链接点击
            $(t.$el).on("click",'span.person_name_href',function () {
                personListMethods.goPersonLink({
                    $obj:$(this)
                    ,personList:t
                });
            });
        }
        ,methods:{
            /**
             * 格式化表格数据
             * */
            formatTableData(arr){
                var t = this;
                return personListMethods.formatTableData(t,arr);
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
