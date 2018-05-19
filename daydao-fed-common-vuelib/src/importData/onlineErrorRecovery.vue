<style lang="scss">
    $prefixCls:'online-error-recovery';

    .#{$prefixCls}{

        &-des{
            font-size: 14px;
            color: #68717C;
        }
        &-title{
            font-size: 16px;
            color: #657180;
            line-height: 16px;
            line-height: 43px;
        }

        /*表格数据*/
        &-table{
            /*overflow: initial!important;*/

            /*.el-table__body-wrapper{
                overflow: initial;
            }*/
            .data-item{
                position: relative;
                width:100%;
            }
            .data-show{
                min-height: 32px;
                padding:5px 5px;
            }
            .data-show-error{
                border: 1px solid red;
                line-height: 28px;
                border-radius: 2px;
                padding:0 10px;
                min-height: 28px;
            }

            /*编辑中的临时表单*/
            .data-editing{
                position: relative;
                z-index: 99;
            }


            /*序号列样式*/
            .cell{
                overflow: initial!important;
            }

        }

        /*序号列的错行误信息提示*/
        &-index-wrap{
            position: relative;
        }
        &-index-row{
            position: absolute;
            top:2px;
            left:-15px;

            .d-icon{
                font-size: 16px;
                cursor: pointer;
                width:20px;
                height:20px;
                line-height: 20px;
                text-align: center;
                color: #ed3f14;
            }

        }
        &-index-number{
            display: inline-block;
            vertical-align: middle;
        }
        &-index-error-msg{
            position: absolute;
            left:-20px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 10px;
            font-size: 12px;
            z-index: 99;
            border-radius: 2px;
            top:-3px;
            transform: translate(0,-100%);
            white-space: nowrap;
            display: none;

            &:after{
                content: " ";
                position: absolute;
                width: 0;
                height: 0;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-top: 5px solid rgba(0, 0, 0, 0.7);
                top:100%;
                left:22px;
            }
        }

        /*错误信息的tips*/
        &-data-error-msg{
            position: absolute;
            top: -40px;
            left: -10px;
            background: rgba(0, 0, 0, 0.7);
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.18);
            border-radius: 2px;
            font-size: 12px;
            color: #FFFFFF;
            padding: 5px 10px;
            display: none;
            max-width: 115px;
            z-index: 9;

            &:after{
                content: " ";
                position: absolute;
                width: 0;
                height: 0;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-top: 5px solid rgba(0, 0, 0, 0.7);
                top:100%;
                left:28px;
            }
        }

    }
</style>
<template>
    <div :class="[prefixCls,'clearfix']">
        <div :class="[prefixCls + '-des']">共导入 {{afterImportMsg.successNum + afterImportMsg.failNum}} 行数据，其中成功导入 <span style="color: green">{{afterImportMsg.successNum}}</span> 行，<span style="color: red">{{afterImportMsg.failNum}}</span>行有误，可以在线纠错，您也可以选择<a :href="afterImportMsg.errorUrl?(gMain.apiBasePath +'route/'+infoSetId+'/downfilelog.do?fileName='+ encodeURIComponent(afterImportMsg.errorUrl)):'javascript:void(0)'" style="color: #4B9FFA;font-size: 14px;">下载错误信息</a>，在excel上维护好之后<Tooltip placement="top" content="重新导入将延用您本次导入选择过的字段"><span style="cursor: pointer;color: #4B9FFA;" @click="step3ContinueImport">再次导入</span></Tooltip>。</div>
        <h1 :class="[prefixCls + '-title']">在线纠错</h1>
        <el-table
            :data="data1"
            :height="iTableHeight"
            :class="[prefixCls + '-table']"
            style="width: 100%">

            <el-table-column
                v-for="item in columns1"
                :prop="item.key"
                :label="item.title"
                :align="item.align"
                :class-name="item.className"
                :cellType="item.cellType"
                :keyValueBean="item.keyValueBean"
                :regExpress="item.regExpress"
                :width="item.width"
                :min-width="item.minWidth" :key="item.key" v-if="item.render">

                <template scope="scope">
                    <Expand v-if="item.render" :scope="scope" :render="item.render"></Expand>
                </template>

            </el-table-column>

            <!--<el-table-column
                v-for="item in columns1"
                :prop="item.key"
                :label="item.title"
                :align="item.align"
                :class-name="item.className"
                :cellType="item.cellType"
                :keyValueBean="item.keyValueBean"
                :regExpress="item.regExpress"
                :width="item.width"
                :min-width="item.minWidth" :key="item.key" v-if="!item.render">
            </el-table-column>-->

        </el-table>
    </div>
</template>
<script>
    /**
     * 在线纠错组件
     * */

    import {daydaoDropSelect} from '../daydaoDropSelect/index';
    //引入表格组件
    import { ElTable,ElTableColumn } from '../element-table/index.js'
    import Expand from "../tableList/expand.js";
    var _ = require('../utils/underscore.js')._;  //underscore工具库组件

    export default {
        name:"onlineErrorRecovery"
        ,components:{
            ElTable,
            ElTableColumn,
            Expand
        }
        ,props:{
            /**导入信息*/
            afterImportMsg:{
                type:Object
                ,default(){
                    return {}
                }
            }
            ,infoSetId:{
                type:String
            }
        }
        ,data(){
            return {
                prefixCls:"online-error-recovery"
                ,columns1: []
                ,data1: []
                ,error1:[]
                ,errorRow1:[]
                ,gMain:gMain
            }
        }
        ,watch:{
            afterImportMsg(val,old){
                var t = this;
                t.initData();
            }
        }
        ,computed:{
            iTableHeight(){
                var t = this;
                var iTableHeight = '';
                //如果数据小于或等于3条就加一个高度，防止控件撑出来挡住看不到
                if(t.data1.length <= 3){
                    iTableHeight = 300;
                }
                return iTableHeight;
            }
        }
        ,created(){
            var t = this;
            t.initData();
        }
        ,mounted(){
            var t = this;
            $(document).on("click",function (event) {
                if(!$(event.target).closest('.data-item').length){
                    t.closeOtherForm('');
                }
            });
        }
        ,methods:{
            /**
             * 初始化数据
             * */
            initData(){
                var t = this;
                //表头
                var columns1 = [{
                    key:"_indexNumber",
                    width: 66,
                    align: 'center',
                    title:"序号",
                    className:"indexNumer"
                }];
                t.afterImportMsg.columnList.forEach(function (item) {
                    columns1.push({
                        title:item.title
                        ,key:item.name
                        ,minWidth:item.width
                        ,cellType:item.cellType || 'text'
                        ,keyValueBean:item.keyValueBean
                        ,regExpress:item.regExpress
                    });
                });
                t.columns1 = t.formatData(columns1);

                //表数据
                t.data1 = t.afterImportMsg.excelErrorData;
                //表错误信息提示
                t.error1 = t.afterImportMsg.errorMapMsgList;
                //表格行错误信息
                t.errorRow1 = t.afterImportMsg.errorRowMsgList;
            }
            /**
             * 格式化数据
             * */
            ,formatData(arr){
                var t = this;
                arr.forEach(function (item) {
                    //如果是序号列就显示行的错误信息，否则显示单元格的错误信息
                    if(item.key =='_indexNumber'){
                        item.render = function (h,params) {
                            return t.renderIndexRow(h,params)
                        };
                    }else{
                        item.render = function (h,params) {
                            var isErrorField = false;
                            var cellType = t.columns1.find(function (item2) {return item2.key == params.column.property;}).cellType; //表单类型
                            var regExpress = t.columns1.find(function (item2) {return item2.key == params.column.property;}).regExpress; //表单正则
                            var keyValueBean = t.columns1.find(function (item2) {return item2.key == params.column.property;}).keyValueBean; //表单下拉框查询条件

                            var errorContent = t.getErrorContent(h,params);
                            var arrContent = [h('div',{
                                attrs: {
                                    class:'data-show '+ (errorContent?'data-show-error':'')
                                }
                                ,style:{

                                }
                                ,on:{
                                    click:(event) =>{
                                        var $target = $(event.target);
                                        $target.hide();
                                        var tempId = 'data-' + (new Date()).getTime();

                                        //编辑容器
                                        var startHtml = '<div class="data-editing" data-id="'+tempId+'" id="'+tempId+'" data-title="'+params.column.label+'" data-name="'+params.column.property+'" data-index="'+params.index+'" data-regexpress="'+regExpress+'" data-celltype="'+cellType+'">';
                                        var endHtml = '</div>';

                                        //组装控件
                                        switch (cellType){
                                            case 'date': //如果是日历组件
                                                $target.parent().append(startHtml + '<date-picker type="date" placeholder="选择日期" style="width: 100%;min-width:100px;" value="'+params.row[params.column.property]+'"></date-picker>' + endHtml);
                                                break;
                                            case 'datetime':
                                                $target.parent().append(startHtml + '<date-picker type="datetime" placeholder="选择日期时间" style="width: 100%;min-width:100px;" value="'+params.row[params.column.property]+'"></date-picker>' + endHtml);
                                                break;
                                            case 'treeSelect': //如果是树组件
                                                $target.parent().append(startHtml + '<daydao-drop-select name="testname" :data="treeData" :show-val="treeShowVal" ref="treeSelect" width="100%" :max-height="180"></daydao-drop-select>' + endHtml);
                                                break;
                                            case 'treeAdviceSelect': //如果是可以自定义内容的树组件
                                                $target.parent().append(startHtml + '<daydao-drop-select name="testname" :data="treeData" :show-val="treeShowVal" ref="treeSelect" width="100%" :max-height="180" :is-allow-other="true"></daydao-drop-select>' + endHtml);
                                                break;
                                            default:  //默认的
                                                $target.parent().append(startHtml + '<i-input class="data-editing-input" value="'+params.row[params.column.property]+'" style="width: 100%;min-width:100px;"></i-input>' + endHtml);


                                        }


                                        new Vue({
                                            el:'#'+tempId
                                            ,data:{
                                                treeData:[]
                                                ,treeShowVal:params.row[params.column.property] || ''
                                            }
                                            ,mounted(){
                                                var t = this;

                                                //如果是下拉树组件
                                                if(cellType == 'treeSelect' || cellType == 'treeAdviceSelect'){
                                                    t.$daydao.$ajax({
                                                        url:gMain.apiBasePath + 'route/getKeyValueData.do'
                                                        ,data:JSON.stringify(keyValueBean)
                                                        ,success:function (data) {
                                                            if(data.result == 'true'){
                                                                var aBeans = data.beans || [];
                                                                //根据name值来去重复
                                                                aBeans = _.uniq(aBeans,function (itemBean) {
                                                                    return itemBean.name;
                                                                });
                                                                t.treeData = aBeans;
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                            ,components:{
                                                daydaoDropSelect
                                            }
                                        });
                                        t.closeOtherForm(tempId);
                                        event.stopPropagation();
                                    }
                                }
                            },(params.row[params.column.property]))];
                            if(errorContent){
                                arrContent.push(errorContent);
                            }

                            return h('div',{
                                attrs:{
                                    class:'data-item'
                                },
                                on:{
                                    mouseenter:function (event) {
                                        var $current = $(event.currentTarget);
                                        var sText = $current.find("."+t.prefixCls + '-data-error-msg').text();
                                        if(sText){
                                            var iLeft = $current.offset().left;
                                            var iTop = $current.offset().top;
                                            var sStyle = `display:block;left:${iLeft - 20}px;top:${iTop- 35}px;`;
                                            if($("body").find(">."+t.prefixCls + '-data-error-msg').length){
                                                $("body").find(">."+t.prefixCls + '-data-error-msg').remove();
                                            }
                                            $("body").append(`<div class="${t.prefixCls + '-data-error-msg'}" style="${sStyle}">${sText}</div>`);

                                            var $msg = $("body").find(">."+t.prefixCls + '-data-error-msg');
                                            if($msg.length){
                                                var iHeight = $msg.height();
                                                $msg.css({top:iTop - iHeight - 17 + 'px'});
                                            }

                                        }
                                    }
                                    ,mouseleave:function () {
                                        if($("body").find(">."+t.prefixCls + '-data-error-msg').length){
                                            $("body").find(">."+t.prefixCls + '-data-error-msg').remove();
                                        }
                                    }
                                }
                            },arrContent);
                        }
                    }
                });
                return arr;
            }
            /**
             * 索引列显示的处理
             * */
            ,getIndexHtml(scope){
                var t = this;
                console.log(scope);
                return scope.$index + 1;
            }
            /**
             * 渲染序号列的数据
             * */
            ,renderIndexRow(h,params){
                var t = this;

                var aContentHtml = [
                    h('div',{
                        attrs:{
                            class:t.prefixCls + '-index-number'
                        }
                    },(params.index + 1))
                ];

                //如果当前行没有单元格的错误信息，就展示行的错误信息
                if($.isEmptyObject(t.error1[params.index]) && t.errorRow1[params.index].length){
                    var sError = t.errorRow1[params.index].join(',');
                    var sHtml = h('div',{
                        attrs:{
                            class:t.prefixCls + '-index-row'
                        }
                        ,on:{
                            mouseenter:function (event) {
                                var $current = $(event.currentTarget);
                                var sText = $current.find("."+t.prefixCls + '-index-error-msg').text();
                                if(sText){
                                    var iLeft = $current.offset().left;
                                    var iTop = $current.offset().top;
                                    var sStyle = `display:block;left:${iLeft - 20}px;top:${iTop- 5}px;`;
                                    if($("body").find(">."+t.prefixCls + '-index-error-msg').length){
                                        $("body").find(">."+t.prefixCls + '-index-error-msg').remove();
                                    }
                                    $("body").append(`<div class="${t.prefixCls + '-index-error-msg'}" style="${sStyle}">${sText}</div>`);
                                }
                            }
                            ,mouseleave:function (event) {
                                if($("body").find(">."+t.prefixCls + '-index-error-msg').length){
                                    $("body").find(">."+t.prefixCls + '-index-error-msg').remove();
                                }
                            }
                        }
                    },[
                        h('div',{
                            attrs:{
                                class:'d-icon iconfont_daydao_common'
                            },
                            domProps: {
                                innerHTML: '&#xe6a1;'
                            }
                        },''),
                        h('div',{
                            class:t.prefixCls + '-index-error-msg'
                        },sError)
                    ]);
                    aContentHtml.unshift(sHtml);
                }


                return h('div',{
                    attrs:{
                        class:t.prefixCls + '-index-wrap'
                    }
                },aContentHtml);
            }
            /**
             * 关闭其他的表单
             * */
            ,closeOtherForm(tempId){
                var t = this;
                $(t.$el).find('.data-editing').each(function () {
                     if($(this).attr('data-id') != tempId){
                         $(this).parent().find('.data-show').show();

                         var cellType = $(this).attr('data-celltype');  //表单类型
                         var newVal = $(this).find(".ivu-input").val();

                         if(cellType == 'treeSelect'){
                             if($(this).find(".ivu-input").attr("data-is-value-ready") != 'yes'){
                                 newVal = $(this).parent().find(".data-show").text();
                             }
                         }

                         //更新结果集
                         t.updateJsonData({
                             name:$(this).attr('data-name')
                             , index:$(this).attr('data-index')
                             , newVal:newVal
                             , $el:$(this).parent()
                             , regExpress:$(this).attr('data-regexpress')  //正则
                             , cellType:cellType  //表单类型
                             , title:$(this).attr('data-title')  //字段中文名称
                         });
                         $(this).remove();
                     }
                });
            }
            /**
             * 获取错误内容
             * */
            ,getErrorContent(h,params){
                var t = this;
                if(t.error1[params.index][params.column.property]){
                    return h('div',{
                        attrs:{
                            class:t.prefixCls +'-data-error-msg'
                        }
                    },t.error1[params.index][params.column.property]);
                }else{
                    return null;
                }
            }
            /**
             * 更新json数据
             * */
            ,updateJsonData(opts){
                var t = this;
                opts = opts || {}
                var reg = new RegExp(opts.regExpress);

                switch (opts.cellType){
                    case 'treeSelect':  //如果是树类型的只判断是否为空
                    case 'treeAdviceSelect':  //如果是树类型的只判断是否为空
                        if(opts.newVal){
                            //如果错误信息缓存对象
                            t.error1[opts.index][opts.name] = '';
                            opts.$el.find('.data-error-msg').remove();
                        }
                        break;
                    case 'text':   //文本类型,判断正则是否验证通过
                        if(reg.test(opts.newVal)){
                            //如果错误信息缓存对象
                            t.error1[opts.index][opts.name] = '';
                            opts.$el.find('.data-error-msg').remove();
                        }else {
                            t.error1[opts.index][opts.name] = opts.title + '格式验证不通过';
                        }
                        break;
                    case 'date':   //日期类型,判断正则是否验证通过
                    case 'datetime':   //日期类型,判断正则是否验证通过
                        if(reg.test(opts.newVal)){
                            //如果错误信息缓存对象
                            t.error1[opts.index][opts.name] = '';
                            opts.$el.find('.data-error-msg').remove();
                        }else{
                            t.error1[opts.index][opts.name] = opts.title + '格式验证不通过';
                        }
                        break;
                    default:
                        //

                }

                t.data1[opts.index][opts.name] = opts.newVal;
                opts.$el.find('.data-show').removeClass('.data-show-error'); //去掉红色边框
            }
            ,step3ContinueImport(){
                var t = this;
                t.$parent.step3ContinueImport();
            }



        }

    }
</script>
