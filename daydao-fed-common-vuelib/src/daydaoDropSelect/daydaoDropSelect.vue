<style lang="scss">
    @import "../styles/animation/slideDown.scss";
    @import "style.scss";
    $prefixCls:'daydao_drop_select';

    .#{$prefixCls}{
        position: relative;
        height: 32px;
        display: inline-block;
        vertical-align: middle;
        min-width:80px;

        span.button.switch{
            opacity: 0.5;
        }

        .n-right{
            right: 0;
            position: absolute;
            top: 0;
        }

        &_ico{
            position: absolute;
            right: 1px;
            top: 4px;
            width: 23px;
            height: 25px;
            line-height: 25px;
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
        }

        &_input{
            overflow: hidden;
            text-overflow: ellipsis;
            float: left;
            width: 100%;
        }
        &_input::-ms-clear{
            display:none;
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
            background: #f3f3f3;
            opacity: 0.5;
            filter:alpha(opacity=50);
            cursor: not-allowed;
        }
        /*主树*/
        &_tree{
            border: 1px solid #e3e8ee;
            background: #FFFFFF;
            overflow-y: auto;
            overflow-x: auto;
            border-top: none;
            width: 100%;
            padding: 5px;
            z-index: 98;
            position: absolute;
            top: 32px;
            left: 0;
        }
        /*搜索结果树*/
        &_search_tree{
            border: 1px solid #e3e8ee;
            background: #FFFFFF;
            overflow-y: auto;
            overflow-x: auto;
            border-top: none;
            width: 100%;
            padding: 5px;
            z-index: 99;
            position: absolute;
            top: 32px;
            left: 0;
        }

        @include ztreeStyle;
    }




</style>

<template>
    <div :class="[prefixCls, 'clearfix']" :id="id" :style="{width:realWidth}">
        <input type="text" autocomplete="off" :class="[prefixCls + '_input', 'ivu-input']" :placeholder="placeholder + (isAllowOther?'或者输入':'')" v-model="showValue" :data-is-value-ready="isValueReady" :title="showValue" @keyup="handleSearch" @click="handleClickInput">
        <input type="hidden" :name="name" v-model="hiddenValue">
        <div :class="[prefixCls + '_ico',{'down_status':(isShowResultTree || isShowSearchTree),'up_status':!isShowSearchTree && !isShowResultTree}]" @click.prevent="showOrHideTree">
            <Icon type="android-arrow-dropdown"></Icon>
        </div>
        <div :class="[prefixCls + '_disable']" v-show="!isEdit"></div>
        <transition name="slideDown">
            <ul :class="[prefixCls + '_tree', 'ztree']" v-show="isShowResultTree" :id="'tree-' + id" :style="{maxHeight:maxHeight+'px'}">
                <li>暂无数据</li>
            </ul>
        </transition>
        <ul :class="[prefixCls + '_search_tree', 'ztree']" v-show="isShowSearchTree" :id="'tree-search-'+ id" :style="{maxHeight:maxHeight+'px'}">
            <li>无搜索结果</li>
        </ul>
    </div>
</template>

<script>
     export  default {
         name:"daydaoDropSelect"
         ,props:{
             placeholder:{
                 type:String
                 ,default:"请选择"
             }
             //表单项的name，表单中唯一的name,必传
             ,name:{
                 type:String
                 ,required: true
             }
             //宽度
             ,width:{
                 type:[Number,String]
                 ,default:180
             }
             //最大下拉高度
             ,maxHeight:{
                 type:Number
                 ,default:250
             }
             //加载的数据
             ,data:{
                 type:Array
                 ,default(){
                     return [];
                 }
             }
             // function类型，下拉树选中之后的回调
             ,onSelected:{
                 type:Function
             }
             //是否可以编辑
             ,isEdit:{
                 type:Boolean
                 ,default:true
             }
             //是否允许输入其他值
             ,isAllowOther:{
                 type:Boolean
                 ,default:false
             }
             //隐藏值的传入，即 treeNode的id
             ,val:{
                 type:[String,Number]
                 ,default:""
             }
             //显示值的传入，即 treeNode的name
             ,showVal:{
                 type:String
                 ,default:""
             }
         }
         ,data(){
             var t = this;
             return {
                 selfData:[]
                 ,prefixCls:'daydao_drop_select' //前缀
                 ,id:"daydao_drop_select" +"-"+ t.name
                 ,isShowResultTree:false
                 ,isShowSearchTree:false
                 ,isValueReady:'no' //当前显示是否是其他值
                 ,showValue:""
                 ,hiddenValue:""
                 ,searchTimer:null
             }
         }
         ,created(){
             var t = this;

         }
         ,mounted(){
             var t = this;

             t.selfData = t.formatData(t.data);
             t.initTree();

             //点击空白处关闭下拉
             $(document).on("click",function (event) {
                if(!$(event.target).closest("#"+t.id).length){
                    t.handleClose();
                }
             });
         }
         ,watch:{
             data(val,old){
                 var t = this;
                 t.selfData = t.formatData(val);
                 t.initTree();
             }
             ,val(val,old){
                 var t = this;
                 if ($.fn.zTree && $.fn.zTree.getZTreeObj) {
                    t.setValue(val);
                }else{
                    t.initTree(function(){
                        t.setValue(val);
                    })
                }
                 
             }
             ,showVal(val,old){
                 var t = this;
                 t.setValue(null,val);
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
             /**
              * 格式化数据
              * */
             formatData(aData){
                 var t = this;
                 if(!aData.length){
                     return [];
                 }
                 var setData = function(arr){
                     var aTemp = [];
                     for(var i=0;i<arr.length;i++){
                         if(arr[i].tip && arr[i].tip !=="null"){
                             arr[i].fullName = arr[i].name + "（" +arr[i].tip + "）";
                         }else{
                             arr[i].fullName = arr[i].name;
                         }

                        //设置默认选中的值
                        if(arr[i].isSelected){
                            t.defaultCheckedData = arr[i];
                        }

                         if(arr[i].children && arr[i].children.length){
                             arr[i].children = setData(arr[i].children);
                         }
                         aTemp.push(arr[i]);
                     }
                     return aTemp;
                 }
                 return setData(aData);
             }
             /**
              * 初始化树
              * */
             ,initTree(cb){
                 var t = this;
                 t.setting = {
                     view:{showIcon:false,showTitle:true,fontCss:function(treeId, treeNode){
                         if(treeNode.chkDisabled){
                             return {opacity:"0.6"};
                         }
                     }},
                     data: {
                         key: {
                             title: "fullName"
                         }
                     },
                     callback:{
                         onClick:function(event, treeId, treeNode){
                             //单选的情况
                             if(treeNode.chkDisabled){
                                 return false;
                             }

                             t.showValue = treeNode.name;  //key
                             t.hiddenValue = treeNode.id; //value
                             t.isShowResultTree = false;
                             t.isShowSearchTree = false; //隐藏树
                             t.isValueReady = 'yes';

                             //如果不是主树，单独设置主树的选中状态
                             if(treeId.indexOf("tree-search") != -1){
                                 var aNodes = t.ztreeResultObj.transformToArray(t.ztreeResultObj.getNodes());
                                 for(var i=0;i<aNodes.length;i++){
                                     if(aNodes[i].id == treeNode.id){
                                         t.ztreeResultObj.selectNode(aNodes[i]);
                                         break;
                                     }
                                 }
                             }
                             //传送父树的ConditionBean
                             var oSelect = {
                                 key:t.name,  //表单项的name
                                 value:treeNode.id,  //表单项的选值
                                 node:treeNode //节点对象
                             };
                             t.$emit('onSelected' , oSelect);
                             typeof t.onSelected == "function" && t.onSelected(oSelect,"click");  //下拉树选中之后的回调,手动触发的
                         }
                     }
                 };
                 var zNodes;
                 if($.isArray(t.selfData) && t.selfData.length){
                     zNodes = t.selfData;
                 }else if($.isPlainObject(t.selfData) && !$.isEmptyObject(t.selfData)){
                     zNodes = [t.selfData];
                 }else{
                     zNodes = [{id:"none",name:"暂无数据...",chkDisabled:true}];
                 }

                 seajs.use(["commonStaticDirectory/plugins/zTree/zTreeStyle/zTreeStyle.css","commonStaticDirectory/plugins/zTree/jquery.ztree.all.min"],function () {
                     $.fn.zTree.init($("#tree-"+t.id), t.setting, zNodes);
                     t.ztreeResultObj = $.fn.zTree.getZTreeObj("tree-"+t.id);//缓存起树
                     //如果有默认选中的值
                     if(t.defaultCheckedData){
                         t.setValue(t.defaultCheckedData.id,t.defaultCheckedData.name);
                         delete t.defaultCheckedData;
                     }else{
                         t.setValue(t.val,t.showVal);
                     }
                     cb && cb();
                 });
             }
             /**
              * 初始化搜索树
              * */
             ,initSearchTree(aNewNodes){
                 var t = this;
                 $.fn.zTree.init($("#tree-search-"+t.id), t.setting, aNewNodes);
                 t.ztreeSearchObj = $.fn.zTree.getZTreeObj("tree-search-"+t.id);//缓存起树
                 t.isShowResultTree = false;
                 t.isShowSearchTree = true;
             }
             /**
              * 显示隐藏树
              * */
             ,showOrHideTree(){
                var t = this;
                if(t.showValue && t.isShowSearchTree){

                }else{
                    t.isShowResultTree = !t.isShowResultTree;
                }
                //如果结果树隐藏了，搜索树也要隐藏
                if(!t.isShowResultTree){
                    t.isShowSearchTree = false;
                    t.handleBlurInput();
                }
             }
             /**
              * 文本框的点击
              * */
             ,handleClickInput(){
                 var t = this;
                 //如果搜索树没有展开的情况下就展开结果树，防止两个树同时展开
                 if(!t.isShowSearchTree){
                     t.isShowResultTree = true;
                 }
             }
             /**
              * 隐藏树
              * */
             ,handleClose(){
                var t = this;
                t.isShowResultTree = false;
                t.isShowSearchTree = false;
                 t.handleBlurInput();
             }
             /**
              * 收起下拉框的时候开始匹配
              * */
             ,handleBlurInput(){
                 var t = this;
                 //执行一次查询，如果文本框中的结果在树中不存在就清空选择结果
                 var aTreeNodes = t.ztreeResultObj?t.ztreeResultObj.getNodes():[];
                 if(aTreeNodes && aTreeNodes.length){
                     var _val = t.showValue;
                     var aNodes = t.ztreeResultObj.transformToArray(aTreeNodes);
                     if(_val && aNodes.length){
                         var isInNodes = false; //文本框的结果是否在树中
                         for(var i=0;i<aNodes.length;i++){
                             if(aNodes[i].name == _val){
                                 isInNodes = true;
                                 //如果刚好主树种有匹配，并且匹配值是可选的，那么设置成这个值
                                 if(!aNodes[i].chkDisabled){
                                     t.ztreeResultObj.selectNode(aNodes[i]);
                                     t.hiddenValue = aNodes[i].id;
                                     t.isValueReady = 'yes';
                                 }else{
                                     t.clearAll();
                                 }
                                 break;
                             }
                         }
                         //如果没有匹配，或者文本框为空的时候就清空值，并取消主树选中
                         if(!isInNodes){
                             //如果设置了允许其他值，并且值没有匹配上就让其他值生效
                             if(t.isAllowOther){
                                 t.showValue = _val;
                                 t.hiddenValue = _val;
                                 t.isValueReady = 'yes';
                                 t.unSeletedResultTree(); //取下选中
                             }else{
                                 t.clearAll();
                             }
                         }
                         if(t.showValue == ""){
                             t.clearAll();
                         }
                     }
                 }
             }
             /**
              * 清除所有结果，包括（显示文本框，隐藏文本框，树选中）
              * */
             ,clearAll(){
                 var t = this;
                 t.showValue = "";
                 t.hiddenValue = "";
                 t.unSeletedResultTree();
                 t.$emit('onSelected' , '');
                 typeof t.onSelected == "function" && t.onSelected("" , "click");
             }
             /**
              * 取消主树节点的选中,刷新树即可
              * */
             ,unSeletedResultTree:function(){
                 var t = this;
                 t.ztreeResultObj && t.ztreeResultObj.refresh();
             }
             /**
              * 搜索
              * */
             ,handleSearch(){
                 var t = this;
                 t.isValueReady = 'no';
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
                 t.isShowResultTree = false;
                 t.isShowSearchTree = true;
                 if(!t.showValue){
                     t.hiddenValue = ""; //清空结果
                     t.isShowResultTree = true;
                     t.isShowSearchTree = false;
                     t.$emit("onSelected" , "");
                     typeof t.onSelected == "function" && t.onSelected("" , "click");
                     return;
                 }
                 var aNodes = t.ztreeResultObj?t.ztreeResultObj.transformToArray(t.ztreeResultObj.getNodes()):[];
                 //如果没有树结果
                 if(!aNodes.length){
                     t.showValue = "";
                     t.hiddenValue = "";
                     return;
                 }
                 var aNewNodes = [];
                 if(aNodes.length){
                     for(var i=0;i<aNodes.length;i++){
                         if(aNodes[i].name.indexOf(t.showValue) != -1 && !aNodes[i].chkDisabled){  //搜索的时候过滤掉为禁用状态的节点，如果选择组织员工的时候，只有员工节点才能被搜索出来
                             var oTemp = $.extend({},aNodes[i]);
                             oTemp.fullName = aNodes[i].tip && aNodes[i].tip!=="null" ?(aNodes[i] + "（"+aNodes[i].tip+"）"):aNodes[i].name;
                             oTemp.condition = aNodes[i].condition || {};
                             aNewNodes.push(oTemp);
                         }
                     }
                     if(aNewNodes.length){
                         t.initSearchTree(aNewNodes); //初始化搜索树
                     }else{
                         $(t.$el).find('.' + t.prefixCls + '_search_tree').html('<li style="color: #a2a2a2;padding: 0 10px;">无搜索结果</li>');
                     }
                 }
             }
             /*
             * 获取选中的结点的对象
             * "{"name":"分部2","id":"8","children":null,"condition":{"value":"like '0001!0008!%'","key":"org_id_queue","equal":false,"childCondition":null,"and":true,"joinBean":null,"joinAlias":null},"parentId":null,"chkDisabled":false,"open":true,"isRefreshTableStyle":false,"tip":null,"baseName":null,"baseId":null,"baseCode":null,"baseCorpId":null,"fullName":"分部2"}"
             */
             ,getObjValue:function () {
                 var t = this;
                 var oResult = null;
                 if(t.showValue && t.data.length){
                     for(var i=0;i<t.data.length;i++){
                         if(t.showValue == t.data[i].id){
                             oResult = Object.assign({},t.data[i]);
                         }
                     }
                 }
                 return oResult;
             }
             /**
              * val为key
              * name为文本框显示的值
              * */
             ,setValue(val,name){
                 var t = this;
                 var isHasSelected = false; //是否成功匹配选中
                 var treeObj = $.fn.zTree.getZTreeObj("tree-"+t.id);

                 if((!val && !name) || !treeObj){
                     t.showValue = "";
                     t.hiddenValue = "";
                     return;
                 }

                 function setSelectedItem(item){
                     isHasSelected = true;
                     treeObj.selectNode(item);
                     t.showValue = item.name;
                     t.hiddenValue = item.id;
                     t.isValueReady = 'yes';

                     //传送父树的ConditionBean,模拟click选中后的回调
                     var oSelect = {
                         key:t.name,  //表单项的name
                         value:item.id,  //表单项的选值
                         node:item //节点对象
                     };
                     t.$emit('onSelected' , oSelect);
                     typeof t.onSelected == "function" && t.onSelected(oSelect,"codeAuto");  //下拉树选中之后的回调，代码自动触发的
                 }

                 function setSelectedNode(aNodes){
                     if(aNodes.length){
                         for(var i=0;i<aNodes.length;i++){

                             //匹配ID或者name
                             if(aNodes[i].id == val || aNodes[i].name == name){ //选中匹配,用或的关系来处理，要保证树的每个name唯一，因为后端有时候不好同时传id和name过来
                                 setSelectedItem(aNodes[i]);
                             }

                             if(aNodes[i].children && aNodes[i].children.length){
                                 setSelectedNode(aNodes[i].children);
                             }
                         }
                     }
                 }

                 var nodes = treeObj.getNodes();
                 //如果没有匹配选中并且是可以允许其他值模式
                 if(t.isAllowOther && !isHasSelected){
                     t.showValue = name;
                     t.hiddenValue = name;
                     t.isValueReady = 'yes';
                 }else{
                     setSelectedNode(nodes);
                 }
             },
             /**
              * 设置可用状态
              * @status true/false (不可用/可用)
              * */
             setDisabled:function(status){
                 var t = this;
                 t.isEdit = status;
             }

         }
     }
</script>
