<style lang="scss">
    $prefixCls:'daydao-export-data';

    .#{$prefixCls}{
        padding-bottom:60px;

        /*导航标题*/
        &-title{
            background: #F5F7F9;
            line-height: 46px;
            height:46px;
            text-align: center;
            position: relative;

            /*返回按钮*/
            .back {
                position: absolute;
                top: 0;
                left: 1.5%;
                cursor: pointer;
                font-size: 14px;
                line-height: 46px;
                height: 46px;

                span {
                    color: #657180;
                }
            }

            /*标题名称*/
            h1{
                font-size: 16px;
                font-weight: bold;
                color: #657180;
                display: inline;
            }

            /*关闭按钮*/
            .close{
                position: absolute;
                line-height: 46px;
                height:46px;
                right:0;
                top:0;
                text-align: center;
                width:46px;
                font-size: 14px;
                color: #657180;
                cursor: pointer;
            }
        }

        &-content{
            position: relative;
            margin:0 180px;
            margin-top:50px;
        }
        &-content-title{
            font-size: 16px;
            color: #68717c;
            line-height: 14px;
            font-weight: bold;
        }

        &-columns-wrap{
            margin-top:20px;

            /*全选*/
            .select-all{
                border-bottom:1px solid rgb(92,104,118);
                color: #68717C;
                line-height: 40px;

                .ivu-checkbox-wrapper{
                    font-size: 16px;
                    color: #68717C;
                    line-height: 14px;
                }
            }

            /*显示字段组*/
            .select-group{
                margin-top:10px;

                .title{
                    height: 53px;
                    line-height: 53px;
                    .ivu-checkbox-wrapper{
                        font-size: 16px;
                        color: #68717C;
                        line-height: 14px;
                    }
                }
                .children{
                    .checkbox-item{
                        float: left;
                        width: 190px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-bottom: 10px;
                    }
                    .ivu-checkbox-wrapper{
                        margin-right:50px;
                        font-size: 14px;
                        color: #68717C;
                        line-height: 14px;
                    }
                }
            }


            /*导出按钮*/
            .steps-btn{
                &.fixedModel{
                    position: fixed;
                    bottom: 0;
                    left: 170px;
                    right: 0;
                    background: rgba(0, 0, 0, 0.53);
                    padding: 10px;
                    z-index: 9;
                }
                &.steps-btn-fixed{
                    padding-right:80px;
                    margin-top:20px;
                    text-align: right;
                }
            }


        }


    }
</style>
<template>
    <div :class="[prefixCls,'clearfix']">
        <div :class="[prefixCls + '-title']">
            <div class="back" @click="close">
                <Icon type="chevron-left" />
                <span>返回</span>
            </div>
            <h1>导出</h1>
            <!--<div class="close iconfont_daydao_common" @click="close">&#xe6a6;</div>-->
        </div>

        <div :class="[prefixCls + '-content','clearfix']">
            <div :class="[prefixCls + '-content-title']">
                选择导出字段
            </div>

            <div :class="[prefixCls + '-columns-wrap','clearfix']">
                <div class="select-all clearfix">
                    <Checkbox @on-change="onChangeCheckAll" v-model="checkAllStatus">全选</Checkbox>
                </div>

                <!--如果有分组-->
                <template v-if="columnGroup.length">
                    <!--选项组-->
                    <div class="select-group clearfix" v-for="(value, key, index) in columnGroup">
                        <div class="title">
                            <Checkbox v-model="value.key.isListShow" :title="value.key.name" @on-change="onChangeGroupCheckAll">{{value.key.name}}</Checkbox>
                        </div>
                        <div class="children">
                            <div class="checkbox-item" v-for="item2 in value.value">
                                <Checkbox v-model="item2.isListShow" @on-change="onChangeCheck" :disabled="item2.isFrozen" :tag="item2.tag" :title="item2.title">{{item2.title}}</Checkbox>
                            </div>
                        </div>
                    </div>
                </template>
                <!--没有分组的情况-->
                <template v-else>
                    <!--选项组-->
                    <div class="select-group clearfix" style="padding-top: 10px;">
                        <div class="children">
                            <div class="checkbox-item" v-for="item2 in tableColumnData">
                                <Checkbox v-model="item2.isListShow" @on-change="onChangeCheck" :disabled="item2.isFrozen" :title="item2.title">{{item2.title}}</Checkbox>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="steps-btn steps-btn-fixed" :class="{fixedModel:isFixedShowStep2Btn}">
                    <Button type="primary" @click="startExport">导出</Button>
                    <Button :style="{marginLeft:'20px'}" @click="close">取消</Button>
                </div>


            </div>

        </div>
    </div>
</template>
<script>
    /**
     * 导出Excel数据
     * */

    var _ = require('../utils/underscore.js')._; //underscore工具库组件
    import utils from 'commonVueLib/utils/index' //工具库
    import Ajax from 'commonVueLib/Ajax/index.js';

    export default {
        name:"exportData"
        ,data(){
            return {
                prefixCls:'daydao-export-data'
                ,checkAllStatus:false //全选的状态
                ,columnGroup:[] //分组显示
                ,tableColumnData:[] //表头的数组
                ,aColumnShowData:[] //隐藏显示列的数据
                ,oQueryData:{} //getAll参数对象
                ,isFixedShowStep2Btn:false //是否悬浮显示的按钮
                ,infoSetId:""
                ,cacheKey:gMain.oUser.dd +this.$router.history.base+ this.$route.path  //缓存键
            };
        }
        ,created(){
            var t = this;
            var oExportData = sessionStorage.getItem("exportData");
            if(oExportData){
                oExportData = JSON.parse(oExportData);
                t.tableColumnData = oExportData.tableColumnData || [];
                t.aColumnShowData = oExportData.aColumnShowData || [];
                t.oQueryData = oExportData.oQueryData || {};
                t.infoSetId = t.$route.params.infoSetId;

                t.formatData(); //格式化列的数据

                //设置按钮的位置
                setTimeout(function () {
                    t.setStep2BtnPosition();
                },300);
            }else{
                t.$Message.error({content:"无表格数据，请从导出按钮点击到这里来，不要直接访问此页面",duration: 5});
                setTimeout(function () {
                    t.$router.push({path:"/" + t.infoSetId});
                },1000);
            }
        }
        ,methods:{
            /**
             * 处理所有显示的列
             * */
            formatData(){
                var t = this;
                if(t.tableColumnData.length){
                    var isHasTag = false; //所有的列中是否含有分组信息

                    //前端缓存列
                    var oCacheShowCol = {};
                    if(utils.Cache.getCache(t.cacheKey)){
                        oCacheShowCol = utils.Cache.getCache(t.cacheKey);
                    }

                    //过滤掉isHidden为true的
                    t.tableColumnData = t.tableColumnData.filter(function (value) {
                        return !value.isHidden && value.title != '头像';  //头像字段不显示，且不导出
                    });

                    t.tableColumnData.forEach(function (item) {
                        if(!item.tag){
                            item.tag = "其它";
                        }else{
                            isHasTag = true;
                        }

                        //如果在显示列的缓存中，就默认显示
                        if(t.aColumnShowData.indexOf(item.name) != -1){
                            item.isListShow = true;
                        }

                        //从上次导出的选择列记忆缓存中读取已选中的
                        if(oCacheShowCol.checked && oCacheShowCol.checked.indexOf(item.name) != -1){
                            item.isListShow = true;
                        }

                        //从上次导出的选择列记忆缓存中读取没选中的
                        if(oCacheShowCol.noChecked && oCacheShowCol.noChecked.indexOf(item.name) != -1){
                            item.isListShow = false;
                        }

                        //必显示的
                        if(item.isFrozen){
                            item.isListShow = true;
                        }
                    });

                    t.tableColumnData = JSON.parse(JSON.stringify(t.tableColumnData));

                    //如果有分组信息，就分组展示
                    if(isHasTag){
                        //按照tag分组
                        var oTemp = _.groupBy(t.tableColumnData,function (item) {
                            return item.tag;
                        });

                        //把其他这个分组放到最后
                        t.columnGroup = [];
                        var oTempOther = {};
                        for(var i in oTemp){
                            let isSelectAllForCurrentGroup = false;
                            //判断当前分组里面的是否是全部选中的
                            if(Array.isArray(oTemp[i]) && oTemp[i].findIndex(function (itemTemp) {return !itemTemp.isListShow;}) == -1 ){
                                isSelectAllForCurrentGroup = true;
                            }

                            if(i === '其它'){
                                oTempOther = {key:{name:i,isListShow:isSelectAllForCurrentGroup},value:oTemp[i]};
                            }else{
                                t.columnGroup.push({
                                    key:{name:i,isListShow:isSelectAllForCurrentGroup},
                                    value:oTemp[i]
                                });
                            }
                        }
                        if(!$.isEmptyObject(oTempOther)){
                            t.columnGroup.push(oTempOther);
                        }
                    }else{
                        t.columnGroup = [];
                    }
                }else{
                    t.columnGroup = [];
                }

            }
            /**
             * 关闭导出界面
             * */
            ,close(){
                var t = this;
                /*t.$router.push('/'+t.infoSetId);*/
                //t.$router.push({path:'/'+t.infoSetId, query: { keepAlive: 'false' }});  //模拟重新刷新
                t.$router.go(-1);
            }
            /**
             * 设置步骤二的按钮位置
             * */
            ,setStep2BtnPosition(){
                var t = this;
                //如果按钮超过一屏就悬浮显示
                if($(".steps-btn-fixed").length && ($(".steps-btn-fixed").offset().top + 60) > $(window).height()){
                    t.isFixedShowStep2Btn = true;
                }
            }
            /**
             * 全选处理
             * */
            ,onChangeCheckAll(val){
                var t = this;
                //改变单个的状态
                t.tableColumnData.forEach(function (item) {
                    if(!item.isFrozen){
                        item.isListShow = !!val;
                    }
                });
                //改变组合的状态
                t.columnGroup.forEach(function (item) {
                    item.key.isListShow = !!val;
                    item.value.forEach(function (item2) {
                        if(!item2.isFrozen){
                            item2.isListShow = !!val;
                        }
                    });
                });
            }
            /**
             * 各分组的全选控制
             * */
            ,onChangeGroupCheckAll(val,event){
                var t = this;
                var groupName = $(event.target).parent().parent().attr("title");
                if(groupName){
                    t.columnGroup.forEach(function (item) {
                        if(item.key.name == groupName){
                            item.value.forEach(function (item2) {
                                if(!item2.isFrozen){
                                    item2.isListShow = !!val;
                                }
                            });
                        }
                    });
                }
                //如果某个组被设置成未勾选，全局全选取消选中
                if(!val){
                    t.checkAllStatus = false;
                }
            }
            /**
             * 单个选中状态的改变的处理
             * */
            ,onChangeCheck(val,event){
                var t = this;
                if(!val){
                    t.checkAllStatus = false;
                    var sName = $(event.target).parent().parent().attr("tag"); //此处的name值是字段名
                    t.columnGroup.forEach(function (item) {
                        //从组成员中找当前被点击的多选框，如果找到了就改变父级的选中状态
                        if(item.key.name == sName){
                            item.key.isListShow = false;
                        }

                    });
                    t.columnGroup = JSON.parse(JSON.stringify(t.columnGroup));
                }
            }
            /**
             * 获取选中的字段数据
             * @return Array
             * */
            ,getCheckedColumns(){
                var t = this;
                let oColumns = {
                    checked:[],  //选中的
                    noChecked:[] //没选中的
                };
                //分组模式
                if(t.columnGroup.length){
                    t.columnGroup.forEach(function (item) {
                        if(item.value){
                            item.value.forEach(function (item2) {
                                if(item2.isListShow){
                                    oColumns.checked.push(item2.name);
                                }else{
                                    oColumns.noChecked.push(item2.name);
                                }
                            });
                        }
                    });
                }else{
                    //不分组模式
                    if(t.tableColumnData){
                        t.tableColumnData.forEach(function (item) {
                            if(item.isListShow){
                                oColumns.checked.push(item.name);
                            }else{
                                oColumns.noChecked.push(item.name);
                            }
                        });
                    }
                }
                return oColumns;
            }
            /**
             * 点击导出按钮开始导出
             * */
            ,startExport(){
                var t = this;
                //判断session是否过期
                t.$daydao.$ajax({
                    url:gMain.apiBasePath +"route/checkSessionTimeout.do",
                    data:JSON.stringify({}),
                    success: function (data) {
                        if (data.result == "true") {
                            var sInfoSetId = t.infoSetId;
                            var aColumnList = t.getCheckedColumns().checked;

                            //把已经选中的要导出的列存前端缓存
                            utils.Cache.setCache(t.cacheKey,t.getCheckedColumns());

                            var oSendData = JSON.parse(JSON.stringify(Object.assign({},t.oQueryData)));
                            delete oSendData.pageBean; //去掉翻页信息
                            oSendData.columnList = aColumnList.join(",");
                            window.location.href = gMain.apiBasePath + "route/" + sInfoSetId + "/export.do" + encodeURI(Ajax.getParamsStr(oSendData));
                        }
                    }
                });
            }



        }

    }
</script>
