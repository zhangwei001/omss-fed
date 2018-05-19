<style lang="scss">
    @import "../styles/animation/slideDown.scss";

    .page-dropdown-tree-box{
        position: relative;
    }
    .page-dropdown-tree-body-box{
        display: inline-block;
    }
    /*页面的下拉树导航区域*/
    #page_dropdown_treenav{
        padding-top:5px;

        #page_dropdown_inner{
            display: inline-block;

            &:hover{
                .open_btn,.current_name{
                    color: #67B6FF;
                }
            }
        }
        .open_btn{
            float: left;
            width: 12px;
            height: 16px;
            text-align: center;
            line-height: 17px;
            margin-top: 5px;
            margin-right: 10px;
            cursor: pointer;
            color: #2D8CF0;
            margin-left: 5px;
        }

        .current_name{
            float: left;
            height:28px;
            line-height:28px;
            color: #4B9FFA;
            cursor: pointer;

        }
    }

    /*组织树*/
    #page_dropdown_tree_menu{
        position: absolute;
        width:200px;
        top:38px;
        left:0;
        background: #fff;
        overflow: hidden;
        z-index:70;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.18);

        .search_box{
            background: #F5F7F9;
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
        .page_dropdown_tree_ztree_box{
            max-height: 380px;
            overflow: auto;
        }
        #page_dropdown_tree_ztree{
            width:100%;
            box-sizing: border-box;
            border-left: 1px solid #E3E8EE;
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

    <div class="page-dropdown-tree-box">
        <!--页面的下拉树导航开关-->
        <div class="page-dropdown-tree-body-box" v-clickoutside="closeDropDownMenu">
            <div id="page_dropdown_treenav" class="clearfix">
                <div id="page_dropdown_inner" @click="openDropDownMenu">
                    <div class="open_btn">
                        <div class="iconfont_daydao_common">&#xe6b1;</div>
                    </div>
                    <div class="current_name">
                        {{currentMenuName}}
                    </div>
                </div>
            </div>
            <transition name="slideDown" v-on:after-leave="afterHideDropDownMenu">
                <div id="page_dropdown_tree_menu" v-show="isShowDropDownMenuWrap">
                    <div class="search_box" style="display: none;">
                        <input type="text" class="treeMenuKeyword" v-model="treeMenuKeyword">
                        <div class="icon iconfont_daydao_common">&#xe67f;</div>
                    </div>
                    <div class="page_dropdown_tree_ztree_box">
                        <ul id="page_dropdown_tree_ztree" class="ztree" @scroll="treeScroll"></ul>
                    </div>
                </div>
            </transition>
        </div>
    </div>


</template>

<script>
    import clickoutside from '../directives/clickoutside';
    export default{
        name:"pageDropdownTreeMenu"
        ,props:{
            navigationData:{
                type:Array
                ,default(){
                    return [];
                }
            }
        }
        ,directives: { clickoutside }
        ,data:function () {
            var t = this;
            return {
                treeMenuName:"pageTreeMenu",
                treeMenuKeyword:"" //搜索关键词
                ,myNavigationData:[] //本组件从父组件中传过来的数据
                ,isShowDropDownMenu:false //是否显示下拉树导航菜单
                ,isShowDropDownMenuWrap:false //是否显示下拉树导航菜单的容器
                ,iTreeMenuLeftStyle:39 //下拉树菜单居左的样式
                ,oSelectedNode:{} //已经选中的树节点
                ,currentMenuName:"" //当前导航定位到的菜单名称
                ,zTreeObj:null //组织树对象
                ,selectedNodeArr:[] //选中的组织树节点
                ,leftMenuHeight:200
            }
        }
        ,watch:{
            navigationData:function (val,newVal) {
                var t = this;
                t.myNavigationData = t.getMyNavigationData(val);
            }
            ,myNavigationData:function (val,newVal) {
                var t = this;
                if(val.length){
                    // t.$emit("clickMenuCallback",val[0]); //以第一个树节点为导航条件进行一次查询
                    t.currentMenuName = t.setNavShow(val[0]); //显示树的第一个节点名称
                    t.initTree(t.myNavigationData);  //有了导航数据之后再次初始化树
                }
            }
            // 组织树筛选
            ,treeMenuKeyword(val){
                var t = this;
                var nodeIndex = 0;
                if (val.length==0){

                    if (t.selectedNodeArr.length>0) {
                        var id = t.selectedNodeArr[0].id;
                        t.initTree(t.myNavigationData);
                        var nodes = t.zTreeObj.getNodes();
                        var node = null;
                        filterId(nodes);
                        t.zTreeObj.selectNode(node);
                    }else{
                        t.initTree(t.myNavigationData);
                    }

                    function filterId(data){
                        data.forEach(item=>{
                            if (item.id == id) {
                                node = item;
                                return
                            }
                            if (item.children&&item.children.length>0) {
                                filterId(item.children);
                            }
                        })
                    }

                }else{
                    var dataStore = [];
                    function filterData(data){
                        data.forEach(item=>{
                            if (item.name && item.name.indexOf(val)!=-1) {
                                var obj = {
                                    condition:item.condition,
                                    id:item.id,
                                    name:item.name
                                }
                                dataStore.push(obj);
                            }
                            if (item.children&&item.children.length>0) {
                                filterData(item.children);
                            }
                        })
                    }

                    filterData(t.myNavigationData)
                    t.initTree(dataStore);
                }

            }
        }
        ,created:function () {
            var t = this;
            t.myNavigationData = t.getMyNavigationData(t.navigationData);
            t.initTree(t.myNavigationData);
        }
        ,mounted:function () {
            var t = this;
            gMain.components.$pageDropdownTreeMenu = t; //把此组件挂到gMain中去方便调用

            t.setLeftMenuHeight(); //设置左侧菜单的高度

            //监控window窗口大小，改变菜单高度
            var timer = null;
            $(window).on("resize.setLeftMenuHeight",function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    t.setLeftMenuHeight();
                },500);
            });
//            $(document).on("click",function(e){
//                let $target = $(e.target);
//                console.log($target)
//                t.closeDropDownMenu();
//            })
        }
        ,methods:{
            /**
             * 设置左侧菜单的高度
             * */
            setLeftMenuHeight () {
                var t = this;
                t.leftMenuHeight = $(window).height() - gMain.components.commonHeader.$el.offsetHeight; //窗口高度减去头部高度
            }
            ,getZtreePlugins:function (callback) {
                var t = this;
                //加载ztree
                seajs.use(["commonStaticDirectory/plugins/zTree/zTreeStyle/zTreeStyle.css","commonStaticDirectory/plugins/zTree/jquery.ztree.all.min"],function () {
                    callback();
                });
            }
            ,initTree:function (data) {
                var t = this;
                t.getZtreePlugins(function () {
                    t.zTreeObj = $.fn.zTree.init($("#page_dropdown_tree_ztree"), {
                        view:{
                            showIcon:false
                            ,showTitle:true
                            ,fontCss:function(treeId, treeNode){
                                if(treeNode.chkDisabled){
                                    return {opacity:"0.6",cursor:'not-allowed','background-color':'transparent',border:'none'};
                                }
                            }
                        },
                        data: {
                            key: {
                                title: "name"
                            }
                        },
                        callback:{
                            onClick:function(event, treeId, treeNode){
                                if(!treeNode.chkDisabled){
                                    t.currentMenuName = t.setNavShow(treeNode);
                                    t.oSelectedNode = JSON.parse(JSON.stringify(treeNode));
                                    t.selectedNodeArr = t.zTreeObj.getSelectedNodes();
                                    t.$emit("clickMenuCallback",treeNode); //触发一次点击查询
                                    t.closeDropDownMenu(); //选择节点之后关闭树下拉
                                }else{
                                    return false;
                                }
                            }
                        }
                    }, data);
                });
            }
            /**
             * 重新格式化得到的树数据
             * */
            ,getMyNavigationData:function (arr , resolve) {
                var t = this;
                var newArr = [];
                arr.forEach(function (item,index) {
                    newArr.push($.extend({},item));
                });
                resolve && resolve(newArr[0]);
                return JSON.parse(JSON.stringify(newArr));
            }
            /**
             * 展开树菜单
             */
            ,openDropDownMenu:function () {
                var t = this;

//                if(!t.isShowDropDownMenu){
//                    t.isShowDropDownMenuWrap = true;
//                }
                t.isShowDropDownMenuWrap = !t.isShowDropDownMenuWrap;

                /*if(t.isShowDropDownMenuWrap && typeof gMain.components.$headerLeftMenu !== "undefined"){
                    gMain.components.$headerLeftMenu.closeAllMenu(); //收起公共头部组件里面的左侧菜单
                }*/
            }
            /**
             * 隐藏树菜单
             */
            ,closeDropDownMenu:function ($event) {
                var t = this;
                if(t.isShowDropDownMenuWrap){
                    t.isShowDropDownMenuWrap = false;
                }
            }
            /**
             * 树菜单隐藏之后的回调
             */
            ,afterHideDropDownMenu:function(){
                var t = this;
                t.isShowDropDownMenuWrap = false; //隐藏树菜单的容器
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
            ,treeScroll:function () {
//                console.log("aaaa");
            }
        }
    }
</script>
