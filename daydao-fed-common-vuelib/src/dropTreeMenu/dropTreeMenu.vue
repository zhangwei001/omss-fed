<style lang="scss">
    @import "../styles/animation/slideDown.scss";
    $prefixCls:'drop-tree-menu';
    $hoverColor:#F18950;

    /*下拉树导航*/
    .#{$prefixCls}{
        position: relative;
        float: left;
        margin-top: 7px;

        &-tree-current-position{
            &:hover{
                .current-name,.iconfont-droptree{
                    color: #67B6FF;
                }
            }
        }

        .iconfont-droptree{
            float: left;
            margin: 0 5px;
            cursor: pointer;
            color: #2D8CF0;
            line-height: 24px;
            height: 24px;
        }
        .current-name{
            float: left;
            max-width:480px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #2D8CF0;
            cursor: pointer;
            line-height: 24px;
            height: 24px;
        }



        .tree-box{
            position: absolute;
            left:0;
            top:35px;
            width:200px;
            z-index: 9;
            display: none;
            background: #FFFFFF;
            box-shadow: 0 0 5px 0 rgba(0,0,0,0.18);

            &-show{
                display: block;
                animation: slideDown-in .3s forwards;
            }

            .controls{
                padding:10px 20px;
                background: #FCFCFC;
                border-bottom:1px solid rgb(216, 223, 232);

                .checkbox-list{
                    line-height: 22px;
                }
            }

            .ztree{
                overflow: auto;
                max-height: 380px;
            }
        }

        &:hover{
            .status-icon{
                transform: rotate(180deg);
            }
        }


        // 过滤
        .search_box{
            background: #FCFCFC;
            height:31px;
            position: relative;
            overflow: hidden;
            padding: 5px 0;
            border-left: 1px solid #E3E8EE;

            input.treeMenuKeyword{
                height: 21px;
                border: 1px solid #D7DDE4;
                border-radius: 11px;
                display: block;
                margin: 0 auto;
                width: calc(100% - 10px);
                padding-left: 5px;
                padding-right: 22px;
            }
            .icon{
                position: absolute;
                right: 8px;
                top: 6px;
                font-size: 12px;
                width: 19px;
                height: 19px;
                line-height: 19px;
                text-align: center;
                color: #D7DDE4;
                cursor: pointer;
                background: #fff;
                border-radius: 50%;
            }
        }

        /*ztree的样式重置*/
        .ztree{
            li{
                span.button{
                    background-image:url("./images/zTreeStandard.png");
                }
                /*a{
                    text-decoration: none!important;
                }*/
                a.curSelectedNode{
                    padding-top: 0;
                    color: #2D8CF0;
                    height: 16px;
                    opacity: .8;
                    background: #D6EBFF;
                    border-radius: 2px;
                    border: none;
                    padding: 1px 2px;
                    text-decoration: none!important;
                }
                ul.line{
                    background: none;
                }
            }
        }
    }
</style>
<template>
    <!--树的容器-->
    <div :class="[prefixCls,'clearfix']">
        <div :class="[prefixCls + '-tree-current-position']">
            <div class="iconfont-droptree iconfont_daydao_common" @click="handleMouseenterTreeMenu($event)">&#xe6b1;</div>
            <div class="current-name" :title="selectedOrgName || gMain.oUser.corpName" @click="handleMouseenterTreeMenu($event)">{{selectedOrgName || '数据加载中...'}}</div>
        </div>
        <div class="tree-box">
            <div class="search_box" v-show="isShowSearch">
                <input type="text" class="treeMenuKeyword" @input="searchTreeData" v-model="searchKeyWord">
                <div class="icon iconfont_daydao_common">&#xe67f;</div>
            </div>
            <div class="controls" v-show="isShowInclude || isShowDisableOrgTool">
                <div class="checkbox-list" v-show="isShowDisableOrgTool"><Checkbox v-model="isShowDisableOrg">显示禁用组织</Checkbox></div>
                <div class="checkbox-list" v-show="isShowInclude"><Checkbox v-model="isInclude" @on-change="onChangeIsInclude">包含下级</Checkbox></div>
            </div>
            <ul :class="['ztree']" :id="[treeStyleId]">数据加载中...</ul>
        </div>
    </div>

</template>
<script>
    export default {
        props:{
            /**
             * 树的唯一ID值
             * */
            treeStyleId:{
                type:String
                ,required:true
            }
            /**
             * 是否首次选中第一个触发回调
             * */
            ,isFirstTriggerNodeClick:{
                type:Boolean
                ,default:true
            }
            //是否显示“包含下级”的勾选框
            ,isShowInclude:{
                type:Boolean
                ,default:true
            }
            //是否显示“禁用组织”的勾选框
            ,isShowDisableOrgTool:{
                type:Boolean
                ,default:false
            }
            //默认是否显示“禁用组织”
            ,isDefaultShowDisableOrg:{
                type:Boolean
                ,default:false
            }
            //是否自动初始化树
            ,isAutoInit:{
                type:Boolean
                ,default:true
            }
            // 是否显示搜索框
            ,isShowSearch: {
                type: Boolean,
                default: true
            }

        }
        ,data(){
            return {
                treeMenuName:"dropTreeMenu",
                prefixCls:"drop-tree-menu"
                ,gMain:gMain
                ,selectedNode:{} //当前选中的节点
                ,selectedOrgName:""  //左侧选中的组织
                ,isShowDisableOrg:false  //是否显示禁用组织
                ,isInclude:true //是否包含下级
                ,aTreeMenuData:[] //树数据
                ,isNodeClickEmit:false //控制切换选中是否重新刷表格

                ,searchKeyWord: '' //搜索条件
                ,oldTreeMenuData: [] // 树数据
            }
        }
        ,watch:{
            isShowDisableOrg(val,old){
                var t = this;
                t.isNodeClickEmit = true;
                t.getLeftTreeMenuData({archive:!!val});
            }
        }
        ,created(){
            var t = this;
            if (!t.isAutoInit) return;
            t.isShowDisableOrg = t.isDefaultShowDisableOrg;
            t.getLeftTreeMenuData({
                archive:!!t.isShowDisableOrg
            });
        }
        ,mounted(){
            var t = this;
            $(document).on("click",function (event) {
                if(!$(event.target).closest('.tree-box').length){
                    t.handleMouseleaveTreeMenu();
                }
            });
        }
        ,methods:{
            // 组织树筛选
            searchTreeData(e){
                const t = this;
                const val = e.target.value;
                if (val.trim() === ''){
                    t.aTreeMenuData = t.oldTreeMenuData;
                    t.initTree();
                }else{
                    t.aTreeMenuData = t.filterTreeData(t.oldTreeMenuData, val);
                    t.initTree();
                }
                e.target.focus();
            },
            filterTreeData(nodes, key){
                const t = this;
                let dataStore = [];
                nodes.forEach(item => {
                    let name = item.name;
                    let re = new RegExp(key, 'gi');
                    if (re.test(name)) {
                        // if(t.isInclude){
                        //     dataStore.push(item);
                        // }else{
                            let obj = {
                                condition: item.condition,
                                id: item.id,
                                name: item.name
                            };
                            dataStore.push(obj);
                        // }
                    }
                    // if (t.isInclude && item.children && item.children.length > 0) {
                    if (item.children && item.children.length > 0) {
                        dataStore = dataStore.concat(t.filterTreeData(item.children, key));
                    }
                });
                return dataStore;
            },
            handleMouseenterTreeMenu($event){
                var t = this;
                if($(t.$el).find(".tree-box").hasClass("tree-box-show")){
                    $(t.$el).find(".tree-box").removeClass("tree-box-show");
                }else{
                    $(t.$el).find(".tree-box").addClass("tree-box-show");
                }
                $event.stopPropagation();
            }
            ,handleMouseleaveTreeMenu(){
                var t = this;
                $(t.$el).find(".tree-box").removeClass("tree-box-show");
            }
            /***
             * 获取左树数据
             * */
            ,getLeftTreeMenuData(opts , resolve){
                opts = opts || {};
                var t = this;

                t.isShowDisableOrg = !!opts.archive;
                t.$daydao.$ajax({
                    url: gMain.apiPath + "apiOrg/org/getOrgPermissionTree"
                    ,data:JSON.stringify($.extend({
                        archive:true   //是否显示禁用组织,默认:是
                    },opts))
                    ,success:function (data) {
                        if(data.result == "true"){
                            let aTreeMenuDataLeft = t.formatTreeData(data.data);
                            t.oldTreeMenuData = aTreeMenuDataLeft;
                            if(t.searchKeyWord !== ''){
                                aTreeMenuDataLeft = t.filterTreeData(aTreeMenuDataLeft, t.searchKeyWord);
                            }
                            t.aTreeMenuData = aTreeMenuDataLeft;
                            t.initTree(resolve);
                        }
                    }
                });
            }
            /**
             * 格式化树数据，把changeStyle的值转移到chkDisabled上
             * */
            ,formatTreeData(data){
                var t = this;
                data = data || [];
                let _formatdata = function (arr) {
                    arr.forEach(function (item) {
                        item.chkDisabled = item.changeStyle;
                        if(Array.isArray(item.children) && item.children.length){
                            _formatdata(item.children);
                        }
                    });
                }
                _formatdata(data);
                return data;
            }
            ,initTree(resolve){
                var t = this;
                //树设置
                t.treeSetting = {
                    view:{showIcon:false,showTitle:true,fontCss:function(treeId, treeNode){
                        if(treeNode.chkDisabled){
                            return {opacity:"0.6",cursor:'not-allowed','background-color':'transparent',border:'none'};
                        }
                    }},
                    data: {
                        key: {
                            title: "name"
                        }
                    },
                    callback:{
                        onClick:function(event, treeId, treeNode){
                            if(!treeNode.chkDisabled){
                                t.selectedNode = treeNode;
                                t.selectedOrgName = t.setNavShow(treeNode);
                                t.$emit('on-treenode-click',event, treeId, treeNode);
                                $(t.$el).find(".tree-box").removeClass("tree-box-show"); //选择后关闭树下拉
                            }else{
                                return false;
                            }
                        }
                    }
                };

                seajs.use(["commonStaticDirectory/plugins/zTree/zTreeStyle/zTreeStyle.css","commonStaticDirectory/plugins/zTree/jquery.ztree.all.min"],function () {
                    t.selectedOrgName = "空";
                    $.fn.zTree.init($('#' + t.treeStyleId), t.treeSetting, t.aTreeMenuData);
                    t.treeObj = $.fn.zTree.getZTreeObj(t.treeStyleId);//缓存起树
                    var nodes = t.treeObj.getNodes();
                    if(nodes.length){
                        var oNode = t.getFirstNode(nodes);
                        t.selectedNode = oNode;
                        t.treeObj.selectNode(oNode);
                        t.selectedOrgName = t.setNavShow(oNode);

                        if(t.isFirstTriggerNodeClick || t.isNodeClickEmit){
                            t.$emit('on-treenode-click',null, t.treeStyleId, oNode);
                        }
                    }
                    resolve && resolve(oNode);
                });
            }
            /**
             * 深度遍历获取首个没被禁用的节点
             * */
            ,getFirstNode(aNodes){
                var t = this;
                var oNode = {};
                for(var i = 0;i<aNodes.length;i++){
                    //如果为可选
                    if(!aNodes[i].chkDisabled){
                        oNode = aNodes[i];
                        break;
                    }else{
                        if(aNodes[i].children && aNodes[i].children.length){
                            oNode = t.getFirstNode(aNodes[i].children);
                        }
                    }
                }
                return oNode;
            }
            /**
             * 改变包含下级的复选框
             * */
            ,onChangeIsInclude(val){
                var t = this;
                var nodes = t.treeObj.getSelectedNodes();
                if(nodes.length){
                    t.$emit('on-treenode-click',null, t.treeStyleId, nodes[0]);
                }
            }
            /**
             * 显示当前的菜单的路径的拼接
             * */
            ,setNavShow:function(treeNode){
                var arr = [];
                function getNodePath(node){
                    if(node){
                        arr.push(node);
                        if(typeof node.getParentNode === "function"){
                            getNodePath(node.getParentNode());
                        }
                    }
                    return arr;
                }
                var aNodes = getNodePath(treeNode);
                aNodes.length && (aNodes.reverse());
                var sHtml = "";
                if(aNodes.length){
                    for(var i= 0,len=aNodes.length;i<len;i++){
                        sHtml +=  aNodes[i].name+(i==len-1?'':' /')+" ";
                    }
                }
                return sHtml;
            }
            ,reset(){
                var t = this;
                t.isInclude = true;
                t.getLeftTreeMenuData({
                    archive:!!t.isShowDisableOrgTool
                });
            }
        }
    }
</script>
