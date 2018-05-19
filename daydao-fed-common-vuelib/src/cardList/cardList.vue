<style lang="scss">
    /*卡片列表*/
    .page_card_list{
        background: rgb(245,247,249);
        position: relative;

        .is_select_all{
            position: absolute;
            top:-25px;
            right:10px;
            font-size: 14px;
            color: #657180;
        }

        /*翻页*/
        .page_table_pager{
            width:100%;
            height:30px;
            padding:3px 0;
            background: rgb(245, 247, 249);
            margin-top: 10px;
            margin-bottom: 10px;
            box-sizing: content-box;
            padding-bottom: 10px;

            .ivu-page{
                float: right;
                margin-right:20px;
            }
        }
    }

    /*卡片列表的数据列表*/
    .page_data_list{
        padding:10px;
        position: relative;

        .page_data_list_li{
            width:240px;
            height:210px;
            float: left;
            margin-left:10px;
            margin-right:10px;
            margin-bottom:20px;
            text-align: center;
            background: #FFFFFF;
            box-shadow: 0 0 2px 0 rgba(101,113,128,0.08);
            border-radius: 2px;
            position: relative;

            /*复选框*/
            .ivu-checkbox-wrapper{
                position: absolute;
                left:8px;
                top:5px;

                span.title{
                    display: none;
                }
            }

            /*查看编辑*/
            .preview_row_data{
                position: absolute;
                top:5px;
                right:8px;
                display: none;
                opacity: 1;
            }
        }

        /*基本信息预览*/
        .data_info_preview{
            margin:14px 0;
            padding: 0 20px;

            @mixin imgSize{
                width:72px;
                height:72px;
                border-radius: 50%;
                display: block;
                float: left;
                overflow: hidden;
            }
            .head_img{
                @include imgSize;
            }
            div.head_img{
                line-height: 72px;
                text-align: center;
                background: #ccc;
                font-style: normal;
                font-size: 16px;
                color: #fff;
            }

            .data_info_preview_list{
                width:calc(100% - 72px);
                float: left;
                padding-top:16px;

                li{
                    line-height: 24px;
                    padding-left:8px;

                    .value{
                        text-align: left;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-size: 14px;
                        color: #657180;
                    }

                    &:first-child{
                        .value{
                            font-size: 18px;
                            color: #657180;
                        }
                    }
                }

            }
        }

        /*更多详细信息展示*/
        .page_data_items{
            padding:20px;
            padding-top:0;
            height: 95px;
            overflow: hidden;
        }
        .page_data_items_li{
            display: flex;
            line-height: 24px;
            font-size: 12px;
            color: #657180;

            .title{
                color:#657180;
                width:65px;
                text-align: right;
            }
            .value{
                flex: 1;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        /*卡片按钮组*/
        .page_data_btns{
            background: #f5f7f9;
            overflow: hidden;
            padding: 10px 5px;
            padding-bottom: 5px;
            display: none;
            position: absolute;
            top: calc(100% - 1px);
            left: -2px;
            width: calc(100% + 4px);
            z-index: 9;
            border: 2px solid #4B9FFA;
            box-shadow: 2px 5px 6px 0 rgba(44, 50, 57, 0.14);
            border-radius: 2px;
            border-top: none;

            button{
                float: left;
                margin-left: 5px;
                margin-bottom: 5px;
                padding: 2px 9px;
            }
            button:first-child{
                margin-left:0px;
            }
        }

        .page_data_list_li.current{
            background: #FFFFFF;
            border: 2px solid #4B9FFA;
            box-shadow: 0 0 6px 0 rgba(44,50,57,0.40);
            border-radius: 2px;
            transform: scale(1.05);
            z-index: 5;

            /*按钮组*/
            .page_data_btns{
                display: block;
            }

            /*查看编辑*/
            .preview_row_data{
                display: block;
            }
        }

        /*无数据时候的样式*/
        .no_data{
            line-height: 50px;
            text-align: center;
        }
    }


</style>


<template>
    <div class="page_card_list clearfix">
        <Checkbox v-model="isSelectAll" :class="['is_select_all']" @on-change="onChangeSelectAll">全选</Checkbox>

        <ul class="page_data_list clearfix" v-if="myTableData && myTableData.length" :style="{minHeight:pageListMinHeight}">
            <Checkbox-group v-model="aColumnShowData">
                <li class="page_data_list_li" v-for="(item,index) in myTableData" @mouseenter="setPageDataListEnter($event)" @mouseleave="setPageDataListLeave($event)">
                    <!--复选框-->
                    <Checkbox :label="item.uuid"><span class="title">{{item.uuid}}</span></Checkbox>

                    <!--查看编辑-->
                    <div class="preview_row_data iconfont_daydao_common" :style="{'margin-left':'10px','cursor':'pointer','color':'#848F9D','vertical-align':'middle'}">&#xe6a7;</div>

                    <!--基本信息预览-->
                    <div class="data_info_preview clearfix">
                        <!--头像字段-->
                        <head-img v-if="cardListOptions.isShowImg && cardListOptions.imgFields" :oField="item" :imgFields="cardListOptions.imgFields"></head-img>

                        <!--头像旁边的字段-->
                        <ul class="data_info_preview_list">
                            <li class="clearfix" v-for="(item2,index2) in item.data" v-if="item2.isShow && aBoldImgFields.indexOf(item2.name) != -1">
                                <div :class="['value']">{{item2.value | trim}}</div>
                            </li>
                        </ul>
                    </div>
                    <!--更多详细信息展示-->
                    <ul class="page_data_items clearfix">
                        <li class="page_data_items_li" v-for="(item2,index2) in item.data" v-if="item2.isShow && aBoldImgFields.indexOf(item2.name) == -1 && aImgFields.indexOf(item2.name) == -1">
                            <div class="title">{{item2.title}}：</div>
                            <div class="value">{{item2.value}}</div>
                        </li>
                    </ul>
                    <ul class="page_data_btns" v-if="cardListOptions.aBtns">
                        <template v-for="itemBtn in cardListOptions.aBtns">
                            <Button type="text" size="small" @click="itemBtn.btnFn(item)">{{itemBtn.btnName}}</Button>
                        </template>
                    </ul>
                </li>
            </Checkbox-group>
        </ul>

        <div class="page_data_list no_data clearfix" v-else-if="!myTableData || !myTableData.length" :style="{minHeight:pageListMinHeight}">暂无数据</div>

        <!--翻页-->
        <div class="page_table_pager">
            <Page :total="parseInt(pageTotal)" size="small" :page-size="pageSize" :page-size-opts="pageSizeLimit" :current="parseInt(pageNo)" placement="top" @on-change="onChangePageNo" @on-page-size-change="onPageSizeChange" show-elevator show-sizer></Page>
        </div>

    </div>
</template>


<script>
    export default{
        name:"cardList"
        /**
         * 组件
         * */
        ,components:{
            /**
             * 头像显示组件
             * */
            headImg:{
                name:"headImg"
                ,props:{
                    /**
                     * 当前这条数据的所有字段
                     * */
                    oField:{
                        type:Object
                        ,default:{}
                    }
                    /**
                     * 组成卡片需要的参数
                     * */
                    ,imgFields:{
                        type:Object
                        ,default(){
                            return {};
                        }
                    }
                }
                ,template:`
                        <img class="head_img" v-if="imgUrl" :src="imgUrl">
                        <div class="head_img" :style="{background:bgColor}" v-else-if="!imgUrl">{{personName}}</div>
                    `
                ,data(){
                    return {
                        imgUrl:""
                        ,personName:""
                        ,bgColor:""
                        ,colors:["#07a9ea","#82c188","#ab97c2","#ffb500","#59ccce","#ff5959"] //蓝，绿，紫，黄，浅蓝,浅红
                    }
                }
                ,created(){
                    var t = this;
                    t.oField.data.forEach(function (item,index) {
                        if(item.name == t.imgFields.img){
                            t.imgUrl = item.value?(gMain.imgPath + item.value):null;
                        }else if(item.name == t.imgFields.title){
                            t.personName = item.value.substr(-2);
                        }else if(item.name == t.imgFields.id){
                            t.bgColor = t.colors[parseInt(item.value)%6];
                        }
                    });
                }
            }
        }
        /**
         * 参数
         * */
        ,props:{
            tableColumnData:{
                type:Array
                ,default(){
                    return [];
                }
            }
            ,tableData:{
                type:Object
                ,default(){
                    return {};
                }
            }
            ,pageSize:{
                type:Number
                ,default:20
            }
            /**
             * 组成卡片需要的参数
             * */
            ,cardListOptions:{
                type:Object
                ,default(){
                    return {};
                }
            }
        }
        ,data(){
            var t = this;
            return {
                myTableColumnData:[] //表头
                ,myTableData:[] //表格数据
                ,pageListMinHeight:"200px"
                //翻页信息
                ,pageSizeLimit:[10,20,30,40,50,100]
                ,pageTotal:0
                ,pageNo:1

                ,isSelectAll:false //是否全选
                ,aColumnShowData:[] //选中数据的集合
            }
        }
        ,filters:{
            trim(value){
                var t = this;
                return $.trim(value);
            }
        }
        ,created(){
            var t = this;
            t.myTableColumnData = t.getMyTableColumnData(t.tableColumnData);
            if(!$.isEmptyObject(t.tableData)){
                t.myTableData = t.getMyTableData(t.tableData.maps);

                //后台返回的翻页信息
                var pb = t.tableData.pb;
                t.pageTotal = pb.pageDataCount || 0;
                t.pageNo = pb.pageNo || 1;
            }

            //要发送给后端的翻页对象
            t.oPageBean = {
                "pageNo":t.pageNo
                ,"pageSize":t.pageSize
            };
        }
        ,mounted(){
            var t = this;
            t.pageListMinHeight = $(window).height() - $(t.$el).offset().top + "px";
        }
        ,watch:{
            tableColumnData:function (val,oldVal) {
                var t = this;
                if(val && val.length){
                    t.myTableColumnData = val;
                }
            }
            ,tableData:function (val,oldVal) {
                var t = this;
                t.myTableData = t.getMyTableData(val.maps);

                //后台返回的翻页信息
                var pb = val.pb || {};
                t.pageTotal = pb.pageDataCount || 0;
                t.pageNo = pb.pageNo || 1;
            }
            ,aColumnShowData(val,old){
                var t = this;
                if(val.length != t.myTableData.length){
                    t.isSelectAll = false;
                }
            }
        }
        /**
         * 计算属性
         * */
        ,computed:{
            /**
             * 翻页信息
             * */
            oPageBean(){
                var t = this;
                return {
                    "pageNo":t.pageNo
                    ,"pageSize":t.pageSize
                };
            }
            /**
             * 显示头像所用的字段数组，默认显示过滤用
             * */
            ,aImgFields(){
                var t = this;
                var arr = [];
                if(t.cardListOptions.imgFields){
                    for(var i in t.cardListOptions.imgFields){
                        arr.push(t.cardListOptions.imgFields[i]);
                    }
                }
                return arr;
            }
            /**
             * 头像旁边字段数组，默认显示过滤用，最多显示两个
             * */
            ,aBoldImgFields(){
                var t = this;
                var arr = [];
                if(Array.isArray(t.cardListOptions.boldFields)){
                    t.cardListOptions.boldFields.forEach(function (item,index) {
                        if(index <= 1){
                            arr.push(item);
                        }
                    });
                }
                return arr;
            }
        }
        ,methods:{
            /**
             * 拼接卡片显示数据
             * */
            getMyTableData(arr){
                var t = this;
                arr = arr || [];

                //如果没有表头数据就不生成卡片列表数据
                if(!t.myTableColumnData || !t.myTableColumnData.length){
                    return [];
                }

                var newArr = [];
                arr.forEach(function (item,index) {
                    var oTemp = {
                        data:[]
                        ,uuid:item.uuid
                    };

                    t.myTableColumnData.forEach(function (item2,index2) {
                        if(item2.isListShow && !item2.isHidden){
                            var obj = {
                                name:item2.name
                                ,title:item2.title
                                ,value:item[item2.name]
                                ,isShow:true
                            };
                            oTemp.data.push(obj);
                        }
                    });
                    newArr.push(oTemp);
                });

                //重新把不显示的字段也放到d列表中去
                newArr.forEach(function (item,index) {
                    arr.forEach(function (item2,index2) {
                        //如果当前数据与列表中的数据的UUID一致
                        if(item2.uuid == item.uuid){
                            for(var key in item2){
                                //如果此字段才已有的数据集中不存在，继续往每条记录中追加多余的隐藏字段
                                if(item.data.findIndex(function (item3, index3, arr3) {  return item3.key == key }) == -1){
                                    item.data.push({
                                        name:key
                                        ,title:t.getFieldTitle(key)
                                        ,value:item2[key]
                                        ,isShow:false
                                    });
                                }
                            }
                        }
                    });
                });

                return newArr;
            }
            /**
             * 根据字段的key获取字段的标题title
             * */
            ,getFieldTitle:function (key) {
                var t = this;
                var str = "";
                t.myTableColumnData.forEach(function (item,index) {
                    if(item.name == key){
                        str = item.title;
                        return false;
                    }
                });
                return str;
            }
            /**
             * 拼接表头数据集
             * */
            ,getMyTableColumnData(arr){
                return arr;
            }
            /**
             * 改变翻页码
             * */
            ,onChangePageNo:function (num) {
                var t = this;
                $.extend(t.oPageBean,{pageNo:String(num)})
                t.$emit("onChangePage",t.oPageBean);
            }
            /**
             * 改变每页条数
             * */
            ,onPageSizeChange:function (num) {
                var t = this;
                $.extend(t.oPageBean,{pageSize:num});
                t.$emit("onChangePage",t.oPageBean);
            }
            ,setPageDataListEnter($event){
                var t = this;
                var $target = $($event.target);
                $target.addClass("current");
            }
            ,setPageDataListLeave($event){
                var t = this;
                var $target = $($event.target);
                $target.removeClass("current");
            }
            /**
             * 全选按钮的改变事件
             * */
            ,onChangeSelectAll(val){
                var t = this;
                if(val){
                    t.myTableData.forEach(function (item,index) {
                        t.aColumnShowData.push(item.uuid);
                    })
                }else{
                    t.aColumnShowData = [];
                }
            }
        }
    }
</script>
