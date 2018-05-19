import dataTable from './dataTable.vue';
import dropTreeMenu from '../dropTreeMenu/index.js';
export default {
    components:{
        dataTable,
        dropTreeMenu
    }
    ,props:{
        //获取员工列表接口
        getPersonListUrl:{
            type:String
            ,default(){
                return gMain.apiPath + "apiOrg/personList/getPersonList";
            }
        }
        //获取员工列表接口的参数
        ,getPersonListParams:{
            type:Object
            ,default(){
                return {};
            }
        }
        //可传入已选在右边的数据
        ,aData:{
            type:Array
        }
        //选择模式，有单选和多选
        ,selectType:{
            type:String
            ,default:'mul'  //默认多选 ，单选为 ‘single’
        }
    }
    ,data(){
        return {
            prefixCls:'person-select'
            ,gMain:gMain
            ,leftColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'personName',
                    width:100
                },
                {
                    title: '工号',
                    key: 'empCode',
                    width:100
                },
                {
                    title: '所属组织',
                    key: 'orgName',
                    width:100
                },
                {
                    title: '职位名称',
                    key: 'posName'
                }
            ]
            ,rightColumns: [
                {
                    title: '姓名',
                    key: 'personName',
                    width:100
                },
                {
                    title: '工号',
                    key: 'empCode',
                    width:100
                },
                {
                    title: '所属组织',
                    key: 'orgName',
                    width:150
                },
                {
                    title: '职位名称',
                    key: 'posName'
                }
            ]
            ,leftData: []
            ,spinShowLeft:false //左侧loading
            ,leftTreeId:this.prefixCls +'-left-tree'+(new Date()).getTime()
            ,rightTreeId:this.prefixCls +'-right-tree'+(new Date()).getTime()

            //右侧显示的分页数据
            ,rightData:[]

            ,resultData: [] //右侧结果集数据
            ,resultSearchData:[] //右侧搜索的结果

            //翻页信息
            ,pageTotal:0
            ,pageSize:20
            ,pageSizeLimit:[10,20,30,40,50,100]
            ,pageNo:1

            ,pageSizeRight:20
            ,pageNoRight:1
            ,pageRightTotal:0  //右边翻页数据的总数

            //左侧列表关键词
            ,listKeyword:""
            //结果关键词
            ,resultKeyword:""

            ,rightSelectedOrgNode:{} //右侧选中的节点

            //获取人员列表的默认参数
            ,oPostGetPersonData:{
                infoSetId:"person_list"
                ,personStatusFilter:1  //默认获取在职员工
            }

        };
    }
    ,watch:{
        //已选数据监控
        aData(n,o){
            let t = this;
            t.resultData = n;
            t.reGetRightData(n);
            setTimeout(function () {
                t.reCheckData(); //重现检测左侧数据的选中状态
            },300);
        }
    }
    ,created(){
        var t = this;

        if(Array.isArray(t.aData) && t.aData.length){
            t.resultData = t.aData;
            t.reGetRightData(t.resultData);
        }
    }
    ,mounted(){
        var t = this;

    }
    ,methods:{
        /**
         * 改变左侧数据的选中状态
         * */
        changeCheckedVal(data){
            var t = this;

            if(data){

                //如果是多选
                if(t.selectType === 'mul'){
                    data.forEach(function (item,index) {
                        //如果是选中状态 且 该员工不在已选的结果集中
                        if(item.selectStatus){
                            let _index = t.resultData.findIndex(function (obj) {
                                return item.personId == obj.personId;
                            });
                            //如果没有就添加
                            if(_index ==-1){
                                t.resultData.push(JSON.parse(JSON.stringify(item)));
                            }
                        }else{
                            //判断结果集中有没有
                            let _index = t.resultData.findIndex(function (obj) {
                                return item.personId == obj.personId;
                            });
                            //如果有就移除
                            if(_index != -1){
                                t.resultData.splice(_index,1);
                            }

                        }
                    });
                }else{
                    //单选
                    t.resultData = [];
                    data.forEach(function (item,index) {
                        //如果是选中状态 且 该员工不在已选的结果集中
                        if(item.selectStatus){
                            t.resultData.push(JSON.parse(JSON.stringify(item)));
                        }
                    });
                }

                t.reGetRightData(t.resultData);
                if(t.$refs.dropTreeRight.treeObj){
                    var nodes = t.$refs.dropTreeRight.treeObj.getNodes();
                    if (nodes.length>0) {
                        t.$refs.dropTreeRight.treeObj.selectNode(nodes[0]);
                    }
                    t.$refs.dropTreeRight.selectedOrgName = nodes[0].name;
                    t.resultKeyword = "";
                }
            }
        }
        /**
         * 获取左侧列表的数据
         * */
        ,getLeftPersonData(obj){
            var obj = obj || {};
            var t = this;
            t.spinShowLeft = true;
            //获取员工的查询条件
            t.oPostGetPersonData = Object.assign(t.oPostGetPersonData,t.getPersonListParams,{
                "pageBean":{
                    "pageNo":t.pageNo
                    ,"pageSize":t.pageSize
                }
            });

            t.$daydao.$ajax({
                url:t.getPersonListUrl
                ,data:JSON.stringify(t.oPostGetPersonData)
                ,success:function (data) {
                    if(data.result == "true"){
                        if(data.data){
                            t.leftData = data.data.persons || [];
                            t.pageTotal = data.data.totalNum || 0;
                            t.reCheckData(); //重新检查数据是否有选中的
                        }
                    }
                    t.spinShowLeft = false;
                }
            });
        }
        /**
         * 获取所有子节点，包含自身，排除root根节点
         * */
        ,getAllChildrenId(treeNode,type){
            var t = this;
            var aNodes = [];

            //处理子节点，排除子节点chkDisabled为true的节点
            var getNodes = function (arr) {
                if(arr.length){
                    arr.forEach(function (item) {
                        if(!item.chkDisabled){
                            if(type === "name"){
                                aNodes.push(item.name);
                            }else{
                                aNodes.push(item.id);
                            }
                        }
                        if(Array.isArray(item.children)){
                            getNodes(item.children);
                        }
                    });
                }
            };

            //因为根节点是模拟的，所以要排除
            //先把当前选中的节点添加进去，在处理子节点
            if(treeNode.id === 'root'){
                getNodes(treeNode.children);
            }else {
                if(type === "name"){
                    aNodes.push(treeNode.name);
                }else{
                    aNodes.push(treeNode.id);
                }
                if(Array.isArray(treeNode.children)){
                    getNodes(treeNode.children);
                }
            }
            return aNodes;
        }
        /**
         * 左树的点击回调
         * */
        ,onTreenodeClickLeft(event, treeId, treeNode){
            var t = this;
            //执行过滤查询
            t.pageNo = String(1);
            //如果是包含下级
            if(t.$refs.dropTreeLeft.isInclude){
                t.oPostGetPersonData.orgIds = t.getAllChildrenId(treeNode).join(",");
            }else{
                t.oPostGetPersonData.orgIds = treeNode.id === 'root'?'':treeNode.id;
            }
            t.getLeftPersonData();
        }
        /**
         * 右树的点击回调
         * */
        ,onTreenodeClickRight(event, treeId, treeNode){
            var t = this;
            t.rightSelectedOrgNode = treeNode;
            //执行搜索
            t.handleResultSearch();
        }
        /**
         * 改变左侧的页码
         * */
        ,onChangePageNo(num){
            var t = this;
            t.pageNo = num + "";
            num && t.getLeftPersonData();
        }
        /**
         * 改变右侧的页码
         * */
        ,onChangeRightPageNo(num){
            var t = this;
            t.pageNoRight = num;
            t.reGetRightData(t.resultData);
        }
        ,onPageSizeChange(num){
            var t = this;
            t.pageSize = parseInt(num);
            num && t.getLeftPersonData();
        }
        /**
         * 改变右侧的每页条数
         * */
        ,onPageSizeChangeRight(num){
            var t = this;
            t.pageSizeRight = num;
            t.reGetRightData(t.resultData);
        }
        /**
         * 重新检查数据是否有选中的
         * */
        ,reCheckData(){
            var t = this;
            t.leftData.forEach(function (item,index) {
                item.selectStatus = false; //先全部取消选择
                //在判断那些需要选择
                var _index = t.resultData.findIndex(function (obj) {
                    return obj.personId === item.personId;
                });
                if(_index !== -1){
                    item.selectStatus = true;
                }
            });
            t.leftData = JSON.parse(JSON.stringify(t.leftData));
        }
        /**
         * 移除数据
         * */
        ,removeRightData(data){
            var t = this;
            //先从结果集中移除
            t.removeResultData(data,t.resultData);
            //从搜索结果集中移除
            t.removeResultData(data,t.resultSearchData);

            if(t.resultSearchData.length){
                t.reGetRightData(t.resultSearchData);
            }else{
                t.resultKeyword = "";
                t.reGetRightData(t.resultData);
            }

            //再从左边取消选中
            var _index2 = t.leftData.findIndex(function (obj) {
                return obj.personId === data.personId;
            });
            if(_index2 !== -1){
                t.leftData[_index2].selectStatus = false;
                t.leftData = JSON.parse(JSON.stringify(t.leftData));
            }
        }
        /**
         * 重置数据的选中状态
         * */
        ,resetData(){
            var t = this;
            t.resultData=[];
            t.rightData=[];
            t.leftData.forEach(function(item){
                item.selectStatus = false;
            })
            t.leftData = JSON.parse(JSON.stringify(t.leftData));
        }
        /**
         * 从结果接中移除数据
         * */
        ,removeResultData(data,resultData){
            var t = this;
            var _index = resultData.findIndex(function (obj) {
                return obj.personId === data.personId;
            });
            //如果处在最后一页，且最后一页的数据被删除完了就跳转到前一页
            if(resultData.length > 1 && t.pageNoRight > Math.ceil((resultData.length-1)/t.pageSizeRight)){
                t.pageNoRight = t.pageNoRight - 1;
            }
            resultData.splice(_index,1);
        }
        /**
         * 重新获取右侧数据
         * */
        ,reGetRightData(val){
            var t = this;
            t.pageRightTotal = val.length;
            if(t.resultData.length){
                t.rightData = [];
                t.rightData = t.rightData.concat(t.resultData);
            }
            t.rightData = JSON.parse(JSON.stringify(val.slice((t.pageNoRight-1)*t.pageSizeRight, (t.pageNoRight-1)*t.pageSizeRight + t.pageSizeRight)));
        }
        /**
         * 结果集的搜索
         * */
        ,handleResultSearch(){
            var t = this;
            t.pageNoRight = 1; //搜索从第一页开始查看
            var val = $.trim(t.resultKeyword);
            t.resultSearchData = []; //搜索先清空旧的值
            var rightNodeName = t.rightSelectedOrgNode.name;
            if(t.rightSelectedOrgNode.id === 'root'){
                rightNodeName = ''; //如果是根节点，就清空。效果是一样
            }

            //先过滤出组织匹配上的结果
            if(rightNodeName){
                var aOrgNames = [t.rightSelectedOrgNode.name];
                //如果勾选了包含下级
                if(t.$refs.dropTreeRight.isInclude){
                    aOrgNames = t.getAllChildrenId(t.rightSelectedOrgNode,"name");
                }
                t.resultSearchData = t.resultData.filter(function (item) {
                    return aOrgNames.indexOf(item.orgName) !== -1;
                });
            }

            //在过滤关键词
            if(val){
                t.resultSearchData = (t.resultSearchData.length?t.resultSearchData:t.resultData).filter(function (item) {
                    !item.personName && (item.personName = "");
                    !item.posName && (item.posName = "");
                    !item.empCode && (item.empCode = "");
                    return item.personName.indexOf(val) != -1 || item.posName.indexOf(val) != -1 || item.empCode.indexOf(val) != -1;
                });
            }

            //如果有关键词或者选中了组织，搜索结果为空也要展示
            if(val || rightNodeName){
                t.reGetRightData(t.resultSearchData);
            }else{
                t.reGetRightData(t.resultData);
            }
        }
        /**
         * 左侧列表的搜索
         * */
        ,handleListSearch(){
            var t = this;
            t.pageNo = 1;
            var val = $.trim(t.listKeyword);
            if(val){
                t.oPostGetPersonData.searchCondition = val;
            }else{
                t.oPostGetPersonData.searchCondition = "";
            }
            t.getLeftPersonData();
        }
        /**
         * 重置
         * */
        ,reset(){
            var t = this;
            t.oPostGetPersonData.searchCondition = "";//清空左侧搜索关键词
            t.getLeftPersonData();

            t.$refs.dropTreeLeft.reset();
            t.$refs.dropTreeRight.reset();

            t.resultData = [];
            t.reGetRightData(t.resultData);
            //左侧列表关键词
            t.listKeyword = "";
            //结果关键词
            t.resultKeyword = "";
        }


    }



}
