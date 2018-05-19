<style lang="scss">
    @import "../styles/animation/slideDown.scss";
    @import "style.scss";
    $prefixCls:'daydao_drop_MulSelect';

    .#{$prefixCls}{
        min-width: 80px;
        position: relative;
        height: 32px;
        display: inline-block;
        vertical-align: middle;
        box-sizing:border-box;

        *{
            box-sizing:border-box;
        }

        span.button.switch{
            opacity: 0.5;
        }

        .n-right{
            right: 0;
            position: absolute;
            top: 0;
        }

        &_input{
            width: 100%;
            padding-right: 31px;
            line-height: 26px;
            padding-left: 5px;
            overflow: hidden;
            color: #333;
            text-overflow: ellipsis;
            float: left;
        }
        &_input::-ms-clear{
            display:none;
        }
        &_ico{
            position: absolute;
            right: 1px;
            top: 2px;
            width: 23px;
            height: 25px;
            line-height: 27px;
            text-align: center;
            overflow: hidden;
            color: #657180;
            cursor: pointer;
            font-size: 20px;

            &.down_status{
                transform:rotate(180deg);
            }
            &.up_status{

            }
            span{
                display: none;
            }
        }
        &_clearico{
            position: absolute;
            right: 19px;
            top: 2px;
            width: 26px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            cursor: pointer;
            color: #aeaeae;
            font-size: 13px;
            font-weight: bold;
        }

        &_close{
            position: absolute;
            right: 19px;
            top: 2px;
            width: 22px;
            height: 26px;
            text-align: center;
            line-height: 26px;
            font-size: 18px;
            color: rgb(205, 205, 205);
            cursor: pointer;
        }
        &_disable{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 34px;
            background: #ececec;
            opacity: 0.5;
            filter:alpha(opacity=50);
            cursor: not-allowed;
        }


        /*主树*/
        &_box{
            padding: 5px;
            position: absolute;
            top: 32px;
            left: 0px;
            z-index: 4;
            border: 1px solid #D7DDE4;
            background: #fff;
            width:100%;
            border-top:none;
        }
        &_tree{
            background: #FFFFFF;
            overflow-y: auto;
            overflow-x: auto;
            border-top: none;
            width: 200px;
            box-sizing: border-box;
            padding-top: 0;
            width: 100%;
        }
        /*搜索结果树*/
        &_search_tree{
            background: #FFFFFF;
            overflow-y: auto;
            overflow-x: auto;
            border-top: none;
            width: 200px;
            padding: 5px;
            box-sizing: border-box;
            width:100%;
        }

        /*两棵树的容器*/
        &_tree_wrap{
            overflow: hidden;
            margin-top:2px;
        }

        /*多选控件搜索开始*/
        &_search_input{
            background-color: #FFFFFF;
            position: relative;
            margin: 0 auto;
            width: 96%;
            margin-top: 2px;
            overflow: hidden;

            .search_keyword{
                height: 26px;
                padding-left: 30px;
                -webkit-appearance: none;
                border: 1px solid #D7DDE4;
                outline: none;
                width: 100%;
                float: left;
            }

            .form_submit{
                background: #fff;
                -webkit-appearance: none;
                position: absolute;
                height: 22px;
                width: 28px;
                line-height: 22px;
                top: 2px;
                left: 2px;
                text-align: center;
                font-size: 18px;
                color: #ccc;
            }
        }

        /*多选控件搜索结束*/

        /*包含下级开始*/
        &_contain{
            background: #FFFFFF;
            line-height: 25px;
            padding: 2px 8px;
            border-top: 0;
            color: #333;
            font-size: 12px;
            border-bottom: 1px solid #d7dde4;
            width:calc(100% - 16px);

            input[type=checkbox]{
                position: absolute;
                opacity: 0;
            }

            label.button{
                width:13px;
                height:13px;
                display: inline-block;
                vertical-align: middle;
                margin: 0 3px 0 0;
                background: url(./img/icons.png) no-repeat 0px -24px #fff;
            }

            input[type=checkbox]:checked~label.button{
                background: url(./img/icons.png) no-repeat -14px -24px;
            }
        }
        /*包含下级结束*/

        @include ztreeStyle;

    }


</style>

<template>

    <div :id="id" :class="[prefixCls]" :style="{'width':realWidth}" @mouseenter="handleDropBoxEnter" @mouseleave="handleDropBoxLeave">
        <input type="text" autocomplete="off" :class="[prefixCls + '_input', 'ivu-input']" readonly :placeholder="placeholder" v-model="showValue" :title="showValue" @click="handleClickInput">
        <input type="hidden" :name="name" v-model="hiddenValue">
        <div :class="[prefixCls + '_ico', {'down_status':(isShowResult || isShowResult),'up_status':!isShowResult && !isShowResult}]"  @click="showOrHideTree">
            <Icon type="android-arrow-dropdown"></Icon>
        </div>
        <!--清空值按钮-->
        <div :class="[prefixCls + '_clearico']" title="清空所有" v-show="isShowClearBtn" @click="clearAll">✕</div>
        <!--只读模式的遮罩层-->
        <div :class="[prefixCls + '_disable']" v-show="!isEdit"></div>

        <transition name="slideDown">
            <div :class="[prefixCls + '_box']" v-show="isShowResult">
                <div :id="'input-search-'+ id" :class="[prefixCls + '_search_input']">
                    <!--搜索文本框-->
                    <input type="text" class="search_keyword ivu-input" v-model="searchKeyword" v-show="isShowSearchbox" @keyup="handleSearch">
                    <!--搜索按钮-->
                    <div class="form_submit" @click="handleSearch">
                        <Icon type="search"></Icon>
                    </div>
                </div>
                <div :id="'tree-contain-'+ id" :class="[prefixCls + '_tree_wrap']">
                    <!--是否包含的设置-->
                    <div :class="[prefixCls + '_contain']" v-show="isShowContain">
                        <input type="checkbox" :id="'tree-contain-input-'+ id" v-model="isContainSelf">
                        <label class="button" :for="'tree-contain-input-' + id"></label>包含下级
                    </div>
                    <!--下拉结果树-->
                    <ul :class="[prefixCls + '_tree', 'ztree']" :id="'tree-'+ id" :style="{'max-height':maxHeight+'px'}" v-show="isShowResultTree"></ul>
                    <!--搜索结果树-->
                    <ul :class="[prefixCls + '_search_tree', 'ztree']" :id="'tree-search-'+ id" :style="{'max-height':maxHeight+'px'}" v-show="isShowSearchTree"></ul>
                </div>
            </div>
        </transition>

    </div>

</template>

<script>
    export default {
        name:"daydaoDropSelectMul"
        ,props:{
            //文本区域的提示文字
            placeholder:{
                type:String
                ,default:"请选择"
            }
            //宽度
            ,width:{
                type:[Number,String]
                ,default:200
            }
            //下框框的下拉最大可视高度
            ,maxHeight:{
                type:[Number,String]
                ,default:200
            }
            //下拉框的树数据
            ,data:{
                type:Array
                ,default(){
                    return [];
                }
            }
            //表单的name值
            ,name:{
                type:String
                ,required:true
            }
            //选择的回调
            ,onSelected:{
                type:Function
            }
            //是否可编辑
            ,isEdit:{
                type:Boolean
                ,default:true
            }
            //是否显示搜索框
            ,isShowSearchbox:{
                type:Boolean
                ,default:true
            }
            //默认是否“包含下级”
            ,isContain:{
                type:Boolean
                ,default:true
            }
            //是否显示包含下级功能
            ,isShowContain:{
                type:Boolean
                ,default:false
            }
            //隐藏值的传入，即 treeNode的id
            ,val:{
                type:Array
            }
            //显示值的传入，即 treeNode的name
            ,showVal:{
                type:Array
            }
        }
        ,data(){
            var t = this;
            return {
                id: "daydaoDropSelectMul-" + t.name
                ,prefixCls:'daydao_drop_MulSelect' //样式前缀
                ,showValue:"" //显示文本框的值
                ,selectedIds:[] //选中的id组

                ,hiddenValue:"" //隐藏文本框的值
                ,selectedVals:[] //选中的值的组

                ,chkboxType:{} //父子级联动关系

                ,isShowResult:false //是否显示下拉结果
                ,isShowResultTree:true // 主树
                ,isShowSearchTree:false //搜索结果树

                ,isShowClearBtn:false //是否显示清除按钮
                ,searchKeyword:"" //搜索关键词
                ,searchTimer:null //输入自动搜索定时器

                ,isContainSelf:true //包含下级
            };
        }
        ,created(){
            var t = this;

        }
        ,mounted(){
            var t = this;
            t.isContainSelf = t.isContain;
            t.setChboxType(t.isContainSelf);

            t.initTree();

            //点击空白处关闭下拉
            $(document).on("click",function (event) {
                if(!$(event.target).closest("#"+t.id).length){
                    t.handleClose();
                }
            });
        }
        ,watch:{
            isContainSelf(val,old){
                this.setChboxType(val);
            }
            ,selectedVals(val){
                var t = this;
                t.showValue = val.join(",");
            }
            ,selectedIds(val){
                var t = this;
                t.hiddenValue = val.join(",");
            }
            ,data(val,old){
                var t = this;
                t.initTree();  //树的data改变，重新初始化树
            }
        }
        ,computed:{
            realWidth(){
                var t = this;
                if(/%/.test(t.width)){
                    return t.width;
                }else{
                    return t.width + "px";
                }
            }
        }
        ,methods:{
            setChboxType(val){
                var t = this;
                if(val){ //“包含下级”默认是否被选中
                    t.chkboxType = { "Y": "ps", "N": "ps" };
                }else {
                    t.chkboxType = { "Y": "", "N": "" };
                }
                if(t.ztreeResultObj){
                    t.ztreeResultObj.setting.check.chkboxType = t.chkboxType; //重新设置树的关联关系
                }
            }
            /**
             * 初始化树
             * */
            ,initTree:function(){
                var t = this;
                t.setting = {
                    check: {
                        enable: true,
                        chkStyle: "checkbox",
                        radioType: "all",
                        chkboxType: t.chkboxType
                    },
                    view:{showIcon:false},
                    callback:{
                        onCheck:function(event, treeId, treeNode){
                            //多选的情况
                            var tree = $.fn.zTree.getZTreeObj(treeId);
                            var nodes = tree.getCheckedNodes();
                            t.selectedIds = [];
                            t.selectedVals = [];
                            var contain = t.isContainSelf; //是否包含下级
                            if(nodes.length){
                                for(var i= 0;i<nodes.length;i++){
                                    if(!nodes[i].isNotAllowSelected){ //是否不允许选中
                                        if(contain){
                                            if(nodes[i].check_Child_State!==1){
                                                t.selectedIds.push(nodes[i].id);
                                                t.selectedVals.push(nodes[i].name);
                                            }
                                        }else{
                                            t.selectedIds.push(nodes[i].id);
                                            t.selectedVals.push(nodes[i].name);
                                        }

                                    }
                                }
                            }

                            //传送父树的ConditionBean,模拟click选中后的回调
                            var oSelect = {
                                key:t.name,  //表单项的name
                                values:t.selectedVals,  //表单项的选值
                                nodes:tree.getCheckedNodes(true), //节点对象
                                ids:t.selectedIds
                            };
                            typeof t.onSelected == "function" && t.onSelected(oSelect,"click");  //下拉树选中之后的回调，代码自动触发的
                        }
                    }
                };
                var zNodes;
                if($.isArray(t.data) && t.data.length){
                    zNodes = t.data;
                }else{
                    zNodes = [];
                }
                //多选控件取消禁用checkbox
                if(zNodes.length){
                    function setNochkDisabled(aNodes){
                        for(var i=0;i<aNodes.length;i++){
                            if(aNodes[i].chkDisabled){
                                aNodes[i].chkDisabled = false;
                                aNodes[i].isNotAllowSelected = true; //是否不允许选中
                                //aNodes[i].nocheck = true;
                            }
                            if(aNodes[i].children && aNodes[i].children.length){
                                setNochkDisabled(aNodes[i].children);
                            }
                        }
                    }
                    setNochkDisabled(zNodes);
                }
                //多选控件按需取消checkbox
                if(zNodes.length){
                    function setNochkForbidden(aNodes){
                        for(var i=0;i<aNodes.length;i++){
                            if(aNodes[i].chkForbidden){
                                aNodes[i].nocheck = true;
                            }
                            if(aNodes[i].children && aNodes[i].children.length){
                                setNochkForbidden(aNodes[i].children);
                            }
                        }
                    }
                    setNochkForbidden(zNodes);
                }
                t.zNodes = zNodes;

                seajs.use(["commonStaticDirectory/plugins/zTree/zTreeStyle/zTreeStyle.css","commonStaticDirectory/plugins/zTree/jquery.ztree.all.min"],function () {
                    $.fn.zTree.init($("#tree-"+t.id), t.setting, zNodes);
                    t.ztreeResultObj = $.fn.zTree.getZTreeObj("tree-"+t.id);//缓存起树
                    t.setValue(t.val,t.showVal);
                });
            }
            /**
             * 关闭下拉框
             * */
            ,handleClose(){
                var t = this;
                t.isShowResult = false;
                t.searchKeyword = ""; //清空关键词
                t.isShowSearchTree = false; //关闭搜索树
                t.isShowResultTree = true; //显示主树
            }
            /**
             * 显示隐藏树
             * */
            ,showOrHideTree(){
                var t = this;
                t.isShowResult = !t.isShowResult;
            }
            /**
             * 文本框的点击
             * */
            ,handleClickInput(){
                var t = this;
                t.isShowResult = true;
            }
            /**
             * 鼠标移入
             * */
            ,handleDropBoxEnter(){
                var t = this;
                if(t.isEdit){
                    t.isShowClearBtn = true;
                }
            }
            /**
             * 鼠标移出
             * */
            ,handleDropBoxLeave(){
                var t = this;
                t.isShowClearBtn = false;
            }
            /**
             * 清空结果
             * */
            ,clearAll(){
                var t = this;
                t.selectedIds = [];
                t.selectedVals = [];

                $.fn.zTree.getZTreeObj("tree-"+t.id) && $.fn.zTree.getZTreeObj("tree-"+t.id).checkAllNodes(false); //全部取消选择
                $.fn.zTree.getZTreeObj("tree-search-"+t.id) && $.fn.zTree.getZTreeObj("tree-search-"+t.id).checkAllNodes(false); //全部取消选择

                typeof t.onSelected == "function" && t.onSelected("","click",t.selectedIds);  //下拉树选中之后的回调，代码自动触发的
            }
            /**
             * 输入搜索
             * */
            ,handleSearch(){
                var t = this;
                clearTimeout(t.searchTimer);
                t.searchTimer = setTimeout(function(){
                    t.doSearch();
                },300);
            }
            /**
             * 执行搜索
             * */
            ,doSearch(){
                var t = this;
                var sVal = t.searchKeyword; //关键词
                if(!sVal){
                    t.isShowResultTree = true;
                    t.isShowSearchTree = false;
                    return;
                }
                var aNodes = t.ztreeResultObj?t.ztreeResultObj.transformToArray(t.ztreeResultObj.getNodes()):[];
                //如果没有树结果
                if(!aNodes.length){
                    t.selectedIds = [];
                    return;
                }
                var aNewNodes = [];
                if(aNodes.length){
                    for(var i=0;i<aNodes.length;i++){
                        if(aNodes[i].name.indexOf(sVal) != -1 && !aNodes[i].chkDisabled){  //搜索的时候过滤掉为禁用状态的节点，如果选择组织员工的时候，只有员工节点才能被搜索出来
                            var oTemp = {
                                id:aNodes[i].id,
                                name:aNodes[i].name,
                                chkDisabled:aNodes[i].chkDisabled,
                                fullName:aNodes[i].tip && aNodes[i].tip!=="null" ?(aNodes[i] + "（"+aNodes[i].tip+"）"):aNodes[i].name
                            };
                            aNewNodes.push(oTemp);
                        }
                    }
                    if(aNewNodes.length){
                        //初始化搜索树
                        var search_setting = {
                            check: {
                                enable: true,
                                chkStyle: "checkbox",
                                radioType: "all",
                                chkboxType:{ "Y": "", "N": "" }
                            },
                            view:{showIcon:false},
                            callback:{
                                onCheck:function(event, treeId, treeNode){
                                    //多选的情况
                                    var tree = $.fn.zTree.getZTreeObj(treeId);
                                    var resultTree=$.fn.zTree.getZTreeObj("tree-"+ t.id);
                                    var nodes = tree.getNodes();
                                    var resultNodes=resultTree.transformToArray(resultTree.getNodes());
                                    if(nodes.length && resultNodes.length){
                                        for(var j=0;j<nodes.length;j++){
                                            for(var i=0;i<resultNodes.length;i++){
                                                if(nodes[j].id==resultNodes[i].id){
                                                    if(nodes[j].checked){
                                                        resultTree.checkNode(resultNodes[i], true, true,true);
                                                    }else {
                                                        resultTree.checkNode(resultNodes[i], false, true,true);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        };
                        $.fn.zTree.init($("#tree-search-"+t.id), search_setting, aNewNodes);
                        t.ztreeSearchObj = $.fn.zTree.getZTreeObj("tree-search-"+t.id);//缓存起树

                        //勾选search树中已选择的节点
                        var treeObj_search=t.ztreeSearchObj;
                        var nodeAll_search= t.ztreeResultObj.transformToArray(treeObj_search.getNodes());
                        for (var i=0;i<nodeAll_search.length; i++) {
                            for(var j=0;j<t.selectedIds.length;j++){
                                if(nodeAll_search[i].id==t.selectedIds[j]){
                                    treeObj_search.checkNode(nodeAll_search[i], true, true);
                                }
                            }
                        }
                        t.isShowResultTree = false; //隐藏主树
                        t.isShowSearchTree = true; //显示搜索树
                    }else{
                        //t.isShowSearchTree = false; //隐藏搜索树
                        t.isShowResultTree = false; //隐藏主树
                        t.isShowSearchTree = true; //显示搜索树
                    }
                }
            }
            /**
             * 设置选中值
             * @param val Array
             * @param showVal Array
             * */
            ,setValue(val,showVal){
                var t = this;
                var isHasSelected = false; //是否成功匹配选中

                if((!val && !showVal) || !t.ztreeResultObj){
                    t.selectedVals = [];
                    t.selectedIds = [];
                    var aCheckedNodes = t.ztreeResultObj?t.ztreeResultObj.getCheckedNodes(true):[];
                    for (var i=0, l=aCheckedNodes.length; i < l; i++) {
                        t.ztreeResultObj.checkNode(aCheckedNodes[i], false, false);
                    }
                    return;
                }
                var nodes = t.ztreeResultObj.getNodes();
                var aVal = val || []; //隐藏值的数组
                var aShowVal = showVal || []; //显示值的数组
                function setSelectedNode(aNodes){
                    if(aNodes.length){
                        for(var i=0;i<aNodes.length;i++){
                            if(aVal.indexOf(aNodes[i].id) != -1 || aShowVal.indexOf(aNodes[i].name) != -1){ //选中匹配,用或的关系来处理，要保证树的每个name唯一，因为后端有时候不好同时传id和name过来
                                isHasSelected = true;
                                t.ztreeResultObj.checkNode(aNodes[i],true,false,true); //布尔值的含义：选中，不关联树，触发onCheck回调

                                //传送父树的ConditionBean,模拟click选中后的回调
                                var oSelect = {
                                    key:t.name,  //表单项的name
                                    values:t.selectedVals,  //表单项的选值
                                    nodes:t.ztreeResultObj.getCheckedNodes(true), //节点对象
                                    ids:t.selectedIds
                                };
                                typeof t.onSelected == "function" && t.onSelected(oSelect,"codeAuto");  //下拉树选中之后的回调，代码自动触发的
                            }
                            if(aNodes[i].children && aNodes[i].children.length){
                                setSelectedNode(aNodes[i].children);
                            }
                        }
                    }
                }
                setSelectedNode(nodes);
                //如果没成功匹配选中就放开选择框，并且清空值
                if(!isHasSelected){
                    t.selectedVals = [];
                    t.selectedIds = [];
                }
            }


        }
    }
</script>
