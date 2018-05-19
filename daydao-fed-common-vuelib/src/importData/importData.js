var _ = require('../utils/underscore.js')._;  //underscore工具库组件
import onlineErrorRecovery from './onlineErrorRecovery.vue';
import utils from '../utils/utils.js';

export default {
    name:"importContent"
    ,components:{
        onlineErrorRecovery
    }
    ,data(){
        var t = this;
        return {
            prefixCls:'daydao-import-data'
            ,currentStep:1  //当前进行到的步骤
            ,importType:'0' //导入模式：新增：0，编辑：1

            ,cacheKey:gMain.oUser.dd +this.$router.history.base+ this.$route.path  //缓存键

            //导入组件的参数
            ,getTableColumnData:{} //表格配置
            ,modelId:{} //导入模板的id
            ,oCustomParam:null  //导入组件给后端的特殊参数
            ,sGoBackPath:'' //返回要跳转的url


            ,tableColumnData:[]   //excle中哪些列可以导入的配置
            ,infoSetId:t.$route.params.infoSetId  //页面信息集ID
            ,columnGroup:[] //分组显示
            ,checkAllStatus:false //全选的状态
            ,isFixedShowStep2Btn:false //是否悬浮显示第三步的按钮

            ,spinRequestColumnShow:true //请求字段组的遮罩
            ,spinOnlineError:false //现在纠错的遮罩

            ,addDes:"" //新增导入的说明
            ,editDes:"" // 编辑导入的说明
            ,file: null
            ,fileName:""
            ,MultiImportDropModels: []  //多行导入的下载模板类型选择
            ,sColumnCachekey:'' //保存列显示信息到后端的缓存key，导入数据的时候要用到
            ,iImportProgress:0 //导入的进度值 0 ~ 100
            ,sImportStatusDes:'等待上传' //上传状态说明
            ,sImportErrorMsg:''  //导入的错信息

            ,isShowEscImport:false //是否显示退出导入的弹窗

            //导入之后的信息收集
            ,afterImportMsg:{
                failNum:0
                ,successNum:0
                ,errorUrl:''
                ,columnList:[]
                ,errorMapMsgList:[]
                ,excelErrorData:[]
                ,errorRowMsgList:[]
                ,maxEditNum:0 //最大展示错误条数
                ,filePath:'' //导入文件的路径
                ,importPath:'' //导入文件的服务器端路径

            }
            ,iTotalData:0 //Excel总数据量，来源于第一次导入的成功加失败的数据总和

            /**
             * 多行导入相关字段
             * */
            ,mulSelectModel:'' //多行导入下载模板下拉框
            ,operationType:false //是否导出已有数据
            ,allowDelete:false //是否依据导入模板删除系统中已有的数据
        }
    }
    ,watch:{
        currentStep(val,old){
            var t = this;
            //如果是单行导入
            if(t.$route.params.importMode == 'single'){
                if(val == 2 && old < 2){
                    t.getImportItemList(); //查询用户选择字段
                }else if(val ==3){
                    t.saveCacheColumns(); //把用户选择的字段显示缓存起来
                    setTimeout(function () {
                        t.setStep2BtnPosition();
                    },800);
                }
            }
            //如果不是第三步就重置上传状态
            if(val != 3){
                t.resetUploadStatus();
            }
        }
    }
    ,created(){
        var t = this;

        //传入参数处理，这里参数接收来自缓存中的
        var oImportData = sessionStorage.getItem("importData");
        if(oImportData){
            oImportData = JSON.parse(oImportData);
            t.getTableColumnData = oImportData.getTableColumnData; //表格数据配置参数
            t.modelId = oImportData.modelId || {}; //导入模板ID参数
            t.oCustomParam = oImportData.oCustomParam; //自定义导入参数
            t.sGoBackPath = oImportData.sGoBackPath; //返回要跳转的url

            if(!t.modelId.add && !t.modelId.edit){
                t.$Message.error('导入模板id不能为空');
            }

            //单行多步骤导入
            if(t.$route.params.importMode == 'single'){
                t.currentStep = 1; //从第一步开始

                var sModelId = t.modelId.add || t.modelId.edit;

                let oPostData = {
                    modelId:sModelId,
                    infoSetId:sModelId
                };

                if(t.modelId.add){
                    //查询"新增"模板信息，单行多步导入用
                    t.$daydao.$ajax({
                        url:gMain.apiBasePath + "import/"+t.modelId.add+"/getSingleImportModelById.do"
                        ,data:JSON.stringify(oPostData)
                        ,success:function (data) {
                            if(data.result == 'true' && data.data){
                                t.addDes = data.data.addInstruction;
                                //t.editDes = data.data.editInstruction;
                            }
                        }
                    });
                }

                if(t.modelId.edit){
                    //查询"编辑"模板信息，单行多步导入用
                    t.$daydao.$ajax({
                        url:gMain.apiBasePath + "import/"+t.modelId.edit+"/getSingleImportModelById.do"
                        ,data:JSON.stringify(oPostData)
                        ,success:function (data) {
                            if(data.result == 'true' && data.data){
                                //t.addDes = data.data.addInstruction;
                                t.editDes = data.data.editInstruction;
                            }
                        }
                    });
                }


            }else if(t.$route.params.importMode == 'mul'){  //多行，一步导入
                t.currentStep = 3; //直接跳转到第3步骤

                //查询模板信息，多行导入用
                t.$daydao.$ajax({
                    url:gMain.apiBasePath + "import/"+t.modelId.add+"/getMultiImportModelByFuncId.do"
                    ,data:JSON.stringify({
                        funcId:t.getTableColumnData.funcId,
                        infoSetId:t.$route.params.infoSetId
                    })
                    ,success:function (data) {
                        if(data.result == 'true'){
                           t.MultiImportDropModels = data.maps || [];
                        }
                    }
                });
            }



        }else{
            t.$Message.error({content:"无表格数据，请从导入按钮点击到这里来，不要直接访问此页面",duration: 5});
            setTimeout(function () {
                //t.$router.push({path:"/" + t.$route.params.infoSetId});
                t.$router.go(-1);
            },1000);
        }

        //t.afterImportMsg = require('./data.json');  //本地假数据在线纠错模拟

    }
    ,mounted(){
        var t = this;
        //主要是为了多行导入那个页面底部的按钮用
        setTimeout(function () {
            t.setStep2BtnPosition();
        },300);

    }
    ,methods:{
        /**
         * 关闭导出界面
         * */
        close(){
            var t = this;
            //如果是在第三步，并且有错误信息在编辑
            if(t.currentStep == 3 && t.afterImportMsg.failNum){
                t.isShowEscImport = true;

                //如果是正常路由跳转过来的，一刷新的模式跳转回去
                if(/^\/importData/.test(t.$route.path)){
                    if(!t.goBackSpecifiedPath()){
                        t.$router.push({path:'/'+t.$route.params.infoSetId, query:{keepAlive: 'false'}}); //刷新跳转，刷新导入成功的数据，适用于使用了keepAlive为true的页面
                    }
                }else{
                    if(!t.goBackSpecifiedPath()){
                        //否则直接回退上一步，适用于管理平台的这种地址："/base/importData/simple_org_list/single"
                        t.$router.go(-1);
                    }
                }

            }else{
                if(t.importTimer){
                    clearInterval(t.importTimer);
                }
                if(t.currentStep == 4){
                    //如果是正常路由跳转过来的，一刷新的模式跳转回去
                    if(/^\/importData/.test(t.$route.path)){
                        if(!t.goBackSpecifiedPath()){
                            t.$router.push({path:'/'+t.$route.params.infoSetId, query:{keepAlive: 'false'}}); //刷新跳转，刷新导入成功的数据，适用于使用了keepAlive为true的页面
                        }
                    }else{
                        if(!t.goBackSpecifiedPath()){
                            //否则直接回退上一步，适用于管理平台的这种地址："/base/importData/simple_org_list/single"
                            t.$router.go(-1);
                        }
                    }
                }else{
                    if(!t.goBackSpecifiedPath()){
                        t.$router.go(-1);
                    }
                }
            }
        }
        /**
         * 跳转到指定的页面
         * */
        ,goBackSpecifiedPath(){
            var t = this;
            if(t.sGoBackPath){
                t.$router.push({path:'/'+t.sGoBackPath}); //跳转到指定的页面
                return true
            }else{
                return false;
            }
        }
        /**
         * 查询用户选择字段
         * */
        ,getImportItemList(){
            var t = this;

            var sModelId = t.modelId[t.importType=='0'?'add':'edit'];
            let oPostData = {
                importType:t.importType //0：表示新增; 1：表示编辑
                ,modelId:sModelId
            };

            //自定义参数
            if(t.oCustomParam){
                $.extend(oPostData,t.oCustomParam);
            }

            t.$daydao.$ajax({
                url:gMain.apiBasePath + "import/"+sModelId+"/getImportItemList.do"
                ,data:JSON.stringify(oPostData)
                ,success:function (data) {
                    if(data.result == 'true'){
                        t.tableColumnData = data.data || [];  //表头列数据
                        //如果有数据才取消遮罩
                        if(t.tableColumnData.length){
                            t.spinRequestColumnShow = false; //取消遮罩
                        }else{
                            t.$Message.error({content:"无导入字段数据，请重试",duration: 5});
                        }
                        t.formatData(); //格式化列的数据

                        //设置按钮的位置
                        setTimeout(function () {
                            t.setStep2BtnPosition();
                        },500);
                    }
                }
            });
        }
        /**
         * 处理所有显示的列
         * */
        ,formatData(){
            var t = this;
            if(t.tableColumnData.length){
                var isHasTag = false; //所有的列中是否含有分组信息
                var isHasNotChecked = false; //是否含有没选中的

                //前端缓存列
                var oCacheShowCol = {};
                if(utils.Cache.getCache(t.cacheKey)){
                    oCacheShowCol = utils.Cache.getCache(t.cacheKey);
                }

                t.tableColumnData.forEach(function (item) {
                    item.isListShow = false;
                    if(!item.tag){
                        item.tag = "其它";
                    }else{
                        isHasTag = true;
                    }

                    //从缓存中读取的显示字段
                    if(oCacheShowCol.checked && oCacheShowCol.checked.indexOf(item.name) != -1){
                        item.isListShow = true;
                    }

                    //从缓存中读取的不显示字段
                    if(oCacheShowCol.noChecked && oCacheShowCol.noChecked.indexOf(item.name) != -1){
                        item.isListShow = false;
                    }

                    //------------下面的更优先
                    if(item.defaultSelect){
                        item.isListShow = true;
                    }


                    //员工工号字段导入必填
                    if(item.name == '工号'){
                        item.necessary = true;
                    }

                    //必显示的，且不能修改状态的
                    if(item.necessary){
                        item.isListShow = true;
                    }


                    if(!item.isListShow){
                        isHasNotChecked = true;
                    }
                });

                //如果有没选中的任意一项，就取消全选状态
                if(isHasNotChecked){
                    t.checkAllStatus = false;
                }

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
                        if(i === '其它'){
                            oTempOther = {key:{name:i,isListShow:false},value:oTemp[i]};
                        }else{
                            t.columnGroup.push({
                                key:{name:i,isListShow:false},
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
         * 选择导入模式
         * */
        ,startImport(val){
            var t = this;
            t.importType = val;
            t.currentStep = 2;
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
         * 上一步
         * */
        ,goToPreStep(){
            var t = this;
            t.currentStep -= 1;

            //如果跳转到第一步了就清空
            if(t.currentStep == 1){
                t.spinRequestColumnShow = true;
                t.tableColumnData = [];
                t.formatData(); //格式化列的数据
            }
        }
        /**
         * 下一步
         * */
        ,goToNextStep(){
            var t = this;
            t.currentStep += 1;
        }
        /**
         * 全选处理
         * */
        ,onChangeCheckAll(val){
            var t = this;
            //改变单个的状态
            t.tableColumnData.forEach(function (item) {
                if(!item.necessary){
                    item.isListShow = !!val;
                }
            });
            //改变组合的状态
            t.columnGroup.forEach(function (item) {
                item.key.isListShow = !!val;
                item.value.forEach(function (item2) {
                    if(!item2.necessary){
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
                            if(!item2.necessary){
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
                            //显示的
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
                        //显示的
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
         * 缓存字段
         * */
        ,saveCacheColumns(){
            var t = this;

            var sModelId = t.modelId[t.importType=='0'?'add':'edit'];
            var sColumns = t.getCheckedColumns().checked.join(",");

            //前端缓存
            utils.Cache.setCache(t.cacheKey,t.getCheckedColumns());

            //后端缓存
            t.$daydao.$ajax({
                url:gMain.apiBasePath + 'import/'+sModelId+'/cacheColumns.do'
                ,data:JSON.stringify({
                    columns:sColumns
                })
                ,success:function (data) {
                    if(data.result == 'true'){
                        t.sColumnCachekey = data.data;
                    }
                }
            })
        }
        /**
         * 上传处理
         * */
        ,handleUpload(file){
            var t = this;
            t.file = file;
            t.fileName = file.name;
            t.sImportErrorMsg = ''; //上传之前清空上次导入失败的错误信息
            return false;
        }
        /**
         * 下载Excel模板
         * */
        ,downloadTemplate(){
            var t = this;
            //单行导入模板
            if(t.$route.params.importMode == 'single'){

                var sModelId = t.modelId[t.importType=='0'?'add':'edit']; //获取导入模板ID
                var customParam = {
                    columns:t.getCheckedColumns().checked.join(",")
                    ,newImport:true
                }

                //自定义下载错误excel的参数
                if(t.oCustomParam){
                    $.extend(customParam,t.oCustomParam);
                }

                var sOperationType = t.importType == '0'?'update':'delete'; //新增还是编辑模式
                window.location.href = gMain.apiBasePath + 'route/'+sModelId+'/downloadImportExcel?funcId=' + t.getTableColumnData.funcId +'&infoSetId='+ t.$route.params.infoSetId +'&modelId='+sModelId+'&operationType='+sOperationType+'&customParam='+encodeURIComponent(JSON.stringify(customParam));

            }else if(t.$route.params.importMode == 'mul'){  //多行导入模板，目前只有组织人事项目使用
                var customParam = {
                    columns:'' //多行不用选择字段
                    ,newImport:true
                }
                if(t.mulSelectModel){
                    //多行导入用新增的模板id
                    window.location.href = gMain.apiBasePath + 'route/'+t.modelId.add+'/downloadImportExcel?funcId=' + t.getTableColumnData.funcId +'&infoSetId='+ t.$route.params.infoSetId +'&modelId='+t.mulSelectModel+'&operationType='+ (t.operationType?'delete':'update') +'&customParam='+encodeURIComponent(JSON.stringify(customParam));
                }else{
                    t.$Message.error("请先选择模板格式");
                    return false;
                }
            }
        }
        /**
         * 上传并导入数据
         * */
        ,uploadAndImportData(){
            var t = this;
            if(!t.file){
                t.$Message.error("请先选择文件");
                return false;
            }

            t.sImportStatusDes = "上传数据中";
            var sModelId = t.modelId[t.importType=='0'?'add':'edit']; //导入模板ID，新增和编辑模式不一样
            //多行导入用新增模式
            if(t.$route.params.importMode == 'mul'){
                sModelId = t.modelId['add'];
            }

            var oFormData = new FormData();
            oFormData.append('file',t.file); //文件对象
            oFormData.append('infoSetId',t.$route.params.infoSetId); //文件对象

            if(t.$route.params.importMode == 'single'){
                var oCustom = {uuid:t.sColumnCachekey, newImport:true};
                //自定义参数
                if(t.oCustomParam){
                    $.extend(oCustom,t.oCustomParam);
                }
                oFormData.append('modelId',sModelId); //模板ID
                oFormData.append('customParam',JSON.stringify(oCustom));  //导入模式，新增还是编辑
                oFormData.append('allowDelete',0);  // 是否依据导入模板删除系统中已有数据
                oFormData.append('allowUpdate',parseInt(t.importType));  //导入模式，新增还是编辑
            }else if(t.$route.params.importMode == 'mul'){
                oFormData.append('modelId',t.mulSelectModel); //模板ID
                oFormData.append('allowDelete',t.allowDelete?1:0);  // 是否依据导入模板删除系统中已有数据
                oFormData.append('allowUpdate',0);  //导入模式，多行固定为：新增模式
                oFormData.append('customParam',JSON.stringify({multilFlag:true, newImport:true}));
            }


            t.$daydao.$ajax({
                url:gMain.apiBasePath + 'route/'+t.$route.params.infoSetId+'/importData.do'
                ,data:oFormData
                ,processData: false
                ,contentType: false
                ,isPassFalse:true //屏蔽顶部提示错误信息
                ,xhr:function() {
                    var xhr = jQuery.ajaxSettings.xhr();
                    //绑定上传进度的回调函数
                    if (xhr.upload) {
                        xhr.upload.onprogress = function(e) {
                            if (e.total > 0) {
                                e.percent = e.loaded / e.total * 100;
                            }
                            //如果上传到了100%，就开始改变状态
                            if(e.percent == 100){
                                t.sImportStatusDes = '校验数据中';
                            }
                            t.iImportProgress = Math.ceil((e.percent || 0)/2);
                        };
                    }
                    return xhr;//一定要返回，不然jQ没有XHR对象用了
                }
                ,error:function (XMLHttpRequest, textStatus, errorThrown) {
                    if (XMLHttpRequest.readyState == 4) {
                        t.$Message.error("请求出错，请重试");
                        t.importTimer && clearInterval(t.importTimer); //取消重复查询导入状态
                        t.resetUploadStatus(); //重置上传状态
                    }
                }
                ,success:function (data) {
                    t.importTimer && clearInterval(t.importTimer); //取消重复查询导入状态
                    if(data.result =='true'){
                        t.iImportProgress = 100; //导入完成

                        var afterImportMsg = {};
                        afterImportMsg.columnList = data.columnList || [];
                        afterImportMsg.errorMapMsgList = data.errorMapMsgList || [];
                        afterImportMsg.excelErrorData = data.excelErrorData || [];
                        afterImportMsg.errorRowMsgList = data.errorRowMsgList || [];
                        afterImportMsg.errorUrl = data.errorUrl || '';
                        afterImportMsg.failNum = data.failNum || 0;
                        afterImportMsg.successNum = data.successNum || 0;
                        afterImportMsg.maxEditNum = data.maxEditNum || 0; //最大展示错误条数

                        afterImportMsg.filePath = data.filePath || '';
                        afterImportMsg.importPath = data.importPath || '';

                        t.afterImportMsg = afterImportMsg;
                        t.iTotalData = afterImportMsg.failNum + afterImportMsg.successNum; //excel总数据量，最后显示用

                        //有失败的条数，说明导入失败
                        if(data.failNum){
                            //设置按钮的位置
                            setTimeout(function () {
                                t.setStep2BtnPosition();
                            },300);
                        }else{
                            t.$Message.success("导入成功");
                            t.currentStep = 4; //导入成功跳到最后一步
                        }

                    }else if(data.result == 'false'){
                        t.sImportErrorMsg = data.resultDesc;
                    }
                    t.resetUploadStatus(); //上传状态恢复到上传之前的状态
                }
            });

            t.queryImportStatus();
        }
        /**
         * 重置上传状态
         * */
        ,resetUploadStatus(){
            var t = this;
            t.file = null;
            t.fileName = null;
            t.sImportStatusDes = '等待上传';
            t.iImportProgress = 0;
        }
        /**
         * 重新导入
         * */
        ,reImportData(){
            var t = this;
            t.spinOnlineError = true; //启用遮罩

            setTimeout(function () {
                var sModelId = t.modelId[t.importType=='0'?'add':'edit']; //导入模板ID，新增和编辑模式不一样
                //多行导入用新增模式
                if(t.$route.params.importMode == 'mul'){
                    sModelId = t.modelId['add'];
                }

                var aDatas = [['说明行']];
                var aHead = [];
                t.$refs.onlineErrorRecovery.columns1.forEach(function (item2) {
                    //排除序号列
                    if(item2.key != '_indexNumber'){
                        aHead.push(item2.title);
                    }
                });
                aDatas.push(aHead);
                t.$refs.onlineErrorRecovery.data1.forEach(function (item) {
                    var aTemp = [];
                    t.$refs.onlineErrorRecovery.columns1.forEach(function (item2) {
                        //排除序号列
                        if(item2.key != '_indexNumber'){
                            aTemp.push(item[item2.key]);
                        }
                    });
                    aDatas.push(aTemp);
                });



                var oFormData = {
                    list:aDatas
                    ,filePath:t.afterImportMsg.filePath
                    ,importPath:t.afterImportMsg.importPath
                };

                if(t.$route.params.importMode == 'single'){
                    oFormData.infoSetId = sModelId;
                    oFormData.allowDelete = 0;  // 是否依据导入模板删除系统中已有数据
                    oFormData.allowUpdate = parseInt(t.importType);  //导入模式，新增还是编辑
                    oFormData.uuid = t.sColumnCachekey; //用户保存字段的标识

                    //自定义参数
                    if(t.oCustomParam){
                        $.extend(oFormData,t.oCustomParam);
                    }

                }else if(t.$route.params.importMode == 'mul'){
                    oFormData.allowDelete = t.allowDelete?1:0;  // 是否依据导入模板删除系统中已有数据
                    oFormData.allowUpdate = 0;  //导入模式，多行固定为：新增模式
                    oFormData.multilFlag = true;
                    oFormData.infoSetId = t.mulSelectModel;
                }

                t.$daydao.$ajax({
                    url:gMain.apiBasePath + 'import/'+sModelId+'/uploadData.do'
                    ,data:JSON.stringify(oFormData)
                    ,complete:function () {
                        t.spinOnlineError = false;
                    }
                    ,success:function (data) {
                        if(data.result == 'true'){

                            var afterImportMsg = {};
                            afterImportMsg.columnList = data.columnList || [];
                            afterImportMsg.errorMapMsgList = data.errorMapMsgList || [];
                            afterImportMsg.excelErrorData = data.excelErrorData || [];
                            afterImportMsg.errorRowMsgList = data.errorRowMsgList || [];
                            afterImportMsg.errorUrl = data.errorUrl || '';
                            afterImportMsg.failNum = data.failNum || 0;
                            afterImportMsg.successNum = data.successNum || 0;
                            afterImportMsg.maxEditNum = data.maxEditNum || 0; //最大展示错误条数

                            afterImportMsg.filePath = data.filePath || '';
                            afterImportMsg.importPath = data.importPath || '';

                            t.afterImportMsg = afterImportMsg;


                            if(data.failNum){
                                t.$Message.error("重新导入有信息有误");

                                //设置按钮的位置
                                setTimeout(function () {
                                    t.setStep2BtnPosition();
                                },300);

                            }else{
                                t.$Message.success("导入成功");
                                t.currentStep = 4; //导入成功跳到最后一步
                            }
                        }else if(data.result == 'false'){
                            if(!data.resultDesc){
                                t.$Message.error("导入出错，请重试");
                            }
                        }
                    }
                });
            },500);

        }
        /**
         * 查询导入状态
         * */
        ,queryImportStatus(){
            var t = this;
            var sModelId = t.modelId[t.importType=='0'?'add':'edit']; //导入模板ID，新增和编辑模式不一样
            //多行导入用新增模式
            if(t.$route.params.importMode == 'mul'){
                sModelId = t.modelId['add'];
            }

            t.importTimer = setInterval(function () {
                t.$daydao.$ajax({
                    url:gMain.apiBasePath + 'import/'+sModelId+'/getUploadStatus.do'
                    ,success:function (data) {
                        if(data.result == 'true'){
                            t.iImportProgress = t.iImportProgress + 1;
                            if(t.iImportProgress >= 99){
                                t.iImportProgress = 99;
                            }
                            t.sImportStatusDes = data.data || '校验数据中';
                        }
                    }
                });
            },1000);
        }
        /**
         * 确定退出
         * */
        ,okEscImport(){
            var t = this;
            t.$router.back();
        }
        /**
         * 取消退出
         * */
        ,cancelEscImport(){
            var t = this;
        }
        /**
         * 导入前面的文件名文本框的点击触发上传选择文件
         * */
        ,handleFileNameClick(){
            var t = this;
            setTimeout(function () {
                $('.ivu-upload-input').trigger("click");
            },100);
        }
        /**
         * 下载错误excel文件
         * */
        ,step3DownloadErrorExcle(){
            var t = this;
            window.location.href = gMain.apiBasePath + 'route/'+t.infoSetId+'/downfilelog.do?fileName=' + encodeURIComponent(t.afterImportMsg.errorUrl);
        }
        /**
         * 继续导入
         * */
        ,step3ContinueImport(){
            var t = this;
            t.afterImportMsg.failNum = 0;
            t.resetUploadStatus();
            setTimeout(function () {
                t.setStep2BtnPosition();
            },300);
        }


    }
    /**
     * 实例销毁之后清理定时器
     * */
    ,destroyed(){
        var t = this;
        if(t.importTimer){
            clearInterval(t.importTimer);
        }
    }

}
