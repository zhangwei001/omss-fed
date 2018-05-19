<template>
    <div class="select-person-body clearfix">
        <div class="select-person-left">
            <div class="small-title">
                <span>选择</span>
            </div>
            <div class="select-box">
                <div class="search-bar">
                    <i class="iconfont_daydao_common btn-search" @click="searchData"></i>
                    <Input v-model="keyWord" :placeholder="placeholderText" @on-enter="searchData"></Input>
                </div>
                <div class="breadcrumb">
                    <ul>
                        <li v-if="breadcrumb.length">
                            <a @click="upperLevel">返回上级</a>
                            <span class="line-vertical">|</span>
                        </li>
                        <li v-else>
                            <span v-text="corpInfo.corpName">|</span>
                        </li>
                        <li v-for="(item,index) in breadcrumb" v-show="index > breadcrumb.length-4" :key="item.id" :class="['span span-'+breadcrumb.length]">
                            <template v-if="index!==breadcrumb.length-1">
                                <a v-text="item.name" @click="setCurrData(item)" :title="item.name"></a>
                                <Icon type="ios-arrow-right"></Icon>
                            </template>
                            <template v-else>
                                <span v-text="item.name" :title="item.name"></span>
                            </template>
                        </li>
                    </ul>
                </div>
                <ul class="select-ul" :style="{'overflow-y':spin?'hidden':'auto'}">
                    <!-- 多选 -->
                    <template v-if="multi">
                        <!-- 全选 -->
                        <li v-show="(type===1 || type===2) || (type===3 && currData.personData.length)">
                            <Checkbox v-model="checkAll"  @on-change="checkAllChange">
                                <span>全选</span>
                            </Checkbox>
                        </li>
                        <!-- 组织数据 -->
                        <li v-for="(item,index) in currData.orgData" :key="item.id" :class="['li-org',item._isSelected || item.chkdisable==='true' ? 'is-selected':'']" :data-id="item.id" :data-index="index">
                            <template v-if="type===1 || type===2">
                                <Checkbox @on-change="checkboxChange($event,item,'org')" v-model="item._isSelected" :disabled="item.chkdisable==='true'">
                                    <i class="icon-organize"></i>
                                    <span v-text="item.name"  :title="item.name" class="span-orgname"></span>
                                </Checkbox>
                            </template>
                            <template v-else>
                                <span class="seize">&nbsp;</span>
                                <i class="icon-organize"></i>
                                <span v-text="item.name" :title="item.name" class="span-orgname" @click="setCurrData(item)"></span>
                            </template>
                            <span v-show="type===1 || type===3 || (type===2 && item.children )" :class="['r','btn-subordinate',item._isSelected?'disble':'']" @click="setCurrData(item)"><Icon type="navicon" size="24"></Icon>下级</span>
                        </li>
                        <!-- 人员数据 -->
                        <li v-for="(item,index) in currData.personData" :key="item.personId" :class="['li-person',item._isSelected || item.chkdisable==='true' ? 'is-selected':'']" :data-id="item.personId" :data-index="index">
                            <Checkbox @on-change="checkboxChange($event,item,'person')" v-model="item._isSelected" :disabled="item.chkdisable==='true'">
                                <head-img :person-id="item.personId" :person-name="item.personName" :img-url="item.headImg" :width="22" :height="22" :font-size="10"></head-img>
                                <div class="r person-info">
                                    <Row>
                                        <Col span="6" v-text="item.personName" :title="item.personName"></Col>
                                        <Col span="6" v-text="item.orgName ? item.orgName:'无'" :title="item.orgName" :class="{'none':!item.orgName}"></Col>
                                        <Col span="6" v-text="item.posName ? item.posName:'无'" :title="item.posName" :class="{'none':!item.posName}"></Col>
                                        <Col span="6" v-text="item.empCode ? item.empCode:'无'" :title="item.empCode" :class="{'none':!item.empCode}"></Col>
                                    </Row>
                                </div>
                            </Checkbox>
                        </li>
                    </template>
                    <!-- 单选 -->
                    <template v-else>
                        <RadioGroup v-model="radioGroup" @on-change="radioChange">
                            <!-- 组织数据 -->
                            <li v-for="(item,index) in currData.orgData" :key="item.id" class="li-org" :data-id="item.id" :data-index="index">
                                <template v-if="type===1 || type===2">
                                    <Radio :label="'org-'+item.id" :true-value="index">
                                        <i class="icon-organize"></i>
                                        <span v-text="item.name" :title="item.name" class="span-orgname"></span>
                                    </Radio>
                                </template>
                                <template v-else>
                                    <span class="seize"></span>
                                    <i class="icon-organize"></i>
                                    <span v-text="item.name" :title="item.name" class="span-orgname" @click="setCurrData(item)"></span>
                                </template>
                                <span v-show="type===1 || type===3 || (type===2 && item.children )" :class="['r','btn-subordinate']" @click="setCurrData(item)"><Icon type="navicon" size="24"></Icon>下级</span>
                            </li>
                            <!-- 人员数据 -->
                            <li v-for="(item,index) in currData.personData" :key="item.personId" class="li-person" :data-id="item.personId" :data-index="index">
                                <Radio :label="'person-'+item.personId" :true-value="index">
                                    <head-img :person-id="item.personId" :person-name="item.personName" :img-url="item.headImg" :width="22" :height="22" :font-size="10"></head-img>
                                    <div class="r person-info">
                                        <Row>
                                            <Col span="6" v-text="item.personName" :title="item.personName"></Col>
                                            <Col span="6" v-text="item.orgName ? item.orgName:'无'" :title="item.orgName" :class="{'none':!item.orgName}"></Col>
                                            <Col span="6" v-text="item.posName ? item.posName:'无'" :title="item.posName" :class="{'none':!item.posName}"></Col>
                                            <Col span="6" v-text="item.empCode ? item.empCode:'无'" :title="item.empCode" :class="{'none':!item.empCode}"></Col>
                                        </Row>
                                    </div>
                                </Radio>
                            </li>
                        </radioGroup>
                    </template>
                    <Button type="text" long v-if="moreData" :loading="spin" @click="loadMorePerson">加载更多数据</Button>
                    <Spin size="large" fix v-if="spin"></Spin>
                </ul>
            </div>
        </div>
        <div class="select-person-right">
            <div class="small-title">
                <span>已选</span>
                <span class="r">单击移除</span>
            </div>
            <div class="selected-box">
                <ul class="selected-ul">
                    <li class="li-org" v-for="(item,index) in selectedData.orgData" :key="item.id" :data-id="item.id" :data-index="index" @click="cancelSelect(item,index,'org')">
                        <i class="icon-organize"></i>
                        <span v-text="item.name"></span>
                    </li>
                    <li class="li-person" v-for="(item,index) in selectedData.personData" :key="item.personId" :data-id="item.personId" :data-index="index" @click="cancelSelect(item,index,'person')">
                        <head-img :person-id="item.personId" :person-name="item.personName" :img-url="item.headImg" :width="22" :height="22" :font-size="10"></head-img>
                        <div class="r person-info">
                            <Row>
                                <Col span="6" v-text="item.personName" :title="item.personName"></Col>
                                <Col span="6" v-text="item.orgName ? item.orgName:'无'" :title="item.orgName" :class="{'none':!item.orgName}"></Col>
                                <Col span="6" v-text="item.posName ? item.posName:'无'" :title="item.posName" :class="{'none':!item.posName}"></Col>
                                <Col span="6" v-text="item.empCode ? item.empCode:'无'" :title="item.empCode" :class="{'none':!item.empCode}"></Col>
                            </Row>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import headImg from "commonVueLib/headImg/index"; //头像组件
    export default{
        name:"selectPerson",
        props:{
            //控件类型 1:选择组织和人员 2:选择组织 3:选择人员
            type:{
                type:Number,
                default:1
            },
            //是否多选
            multi:{
                type:Boolean,
                default:true
            },
            //搜索框提示 无特殊情况无需配置
            placeholder:{
                type:String,
                default:null
            },
            //组织API
            ApiOrgURL:{
                type:String,
                default:function(){
                    return gMain.apiPath+"apiOrg/org/getOrgPermissionTree";
                }
            },
            //组织API参数
            ApiOrgParams:{
                type:Object
            },
            //人员API
            ApiPersonURL:{
                type:String,
                default:function(){
                   return gMain.apiPath + "apiOrg/personList/getPersonList"
                }
            },
            //人员API参数
            ApiPersonParams:{
                type:Object
            },
            //已选组织数据 数据格式如注释部分
            selectedOrg:{
                type:Array,
                default:function(){
                    return [
                        // {
                        //     id:"7699",
                        //     name:"部门D"
                        // }
                    ];
                }
            },
            //已选人员数据 数据格式如注释部分
            selectedPerson:{
                type:Array,
                default:function(){
                    return [
                        // {
                        //     personId:2416638,
                        //     personName:"cy2",
                        //     orgName:"图了哭咯",
                        //     posName:"CEO"
                        // }
                    ];
                }
            },
            //是否默认自动初始化数据 默认为true 组件被挂载时将自动请求组织API 建议设置为false 
            //使用init方法来分步加载以减轻对服务器的压力 只需初始化一次
            autoInit:{
                type:Boolean,
                default:true
            }
        },
        data:function(){
            return {
                placeholderText:"",
                corpInfo:{
                    corpName:gMain.oUser.corpName
                },
                keyWord:"",
                cacheData:{
                    orgData:[]
                },
                breadcrumb:[],
                currData:{
                    orgData:[],
                    personData:[]
                },
                selectedData:{
                    orgData:[],
                    personData:[]
                },
                orgParams:{
                    archive:false
                },
                personParams:{
                    infoSetId:"person_list",
                    personStatusFilter:1,
                    pageBean:{
                        pageNo:"1",
                        pageSize:"500"
                    }
                },
                radioGroup:"",
                spin:true,
                checkAll:false,
                moreData:false
            }
        },
        components:{
            headImg  
        },
        beforeMount(){
            var t = this;
            //判断用户是否自定义了搜索框提示
            if(t.placeholder){
                t.placeholderText= t.placeholder;
            }else{
                switch (t.type) {
                    case 2:
                        t.placeholderText="请输入您要搜索的组织"
                        break;
                    default:
                        t.placeholderText="请输入您要搜索的组织或人员"
                        break;
                }
            }
            
            if(t.ApiOrgParams){
                $.extend(t.orgParams,t.ApiOrgParams);
            }

            if(t.ApiPersonParams){
                $.extend(t.personParams,t.ApiPersonParams);
            }

            if(t.autoInit){
                t.init();
            }
        },
        watch:{
            //监控已选组织数据
            selectedOrg:function(val){
                var t = this;
                if(!t.multi){
                    if(val.length===0){
                        t.selectedData.orgData = [];
                        t.radioGroup = "";
                    }else{
                        t.selectedData.orgData.push(val[0]);
                        t.radioGroup = "org-"+val[0].id;
                    }
                }else{
                    if(val.length===0){
                        t.selectedData.orgData = [];
                    }else{
                        t.selectedData.orgData = val;
                    }
                }
            },
            //监控已选人员数据
            selectedPerson:function(val){
                var t = this;
                if(!t.multi){
                    if(val.length===0){
                        t.selectedData.personData = [];
                        t.radioGroup = "";
                    }else{
                        t.selectedData.personData.push(val[0]);
                        t.radioGroup = "person-"+val[0].personId;
                    }
                }else{
                     t.selectedData.personData = val;
                }
            }
        },
        methods:{
            /**
             * 初始化
             * */
            init(){
                var t = this;
                t.loadOrgData(function(){
                    //清空组织导航树
                    t.breadcrumb=[];
                    //设置已选数据
                    t.selectedData.orgData = t.selectedOrg;
                    t.selectedData.personData = t.selectedPerson;
                    //设置当前要显示的数据
                    t.setCurrData();
                });
            },
            /**
             * 获取组织数据
             * */
            loadOrgData(callBack){
                var t = this;
                //如果缓存数据中有组织数据
                if(!t.cacheData.orgData.length){
                    t.$daydao.$ajax({
                        url:t.ApiOrgURL
                        ,data:JSON.stringify(t.orgParams)
                        ,success:function (data) {
                            if(data.result == "true"){
                                if(data.data){
                                    //设置每个组织节点的路径导航
                                    function setItemBreadcrumb (arr,old) {
                                        for (var index = 0; index < arr.length; index++) {
                                            const item = arr[index];
                                            item._nav = [];
                                            item._isSelected = false;
                                            if (old && old._nav){
                                                for(var j=0;j<old._nav.length;j++){
                                                    item._nav.push(old._nav[j]);
                                                }
                                            }
                                            item._nav.push({
                                                name:item.name,
                                                id:item.id,
                                                index:index
                                            });
                                            if (item.children){
                                                setItemBreadcrumb(item.children,item);
                                            }
                                        }
                                    }
                                    setItemBreadcrumb(data.data);
                                    t.cacheData.orgData = data.data;

                                    typeof callBack==="function" && callBack();
                                }
                            }
                            t.spin = false;
                        }
                    });
                }else{
                    typeof callBack==="function" && callBack();
                }
            },
            /**
             * 获取人员数据
             * */
            loadPersonData(item){
                var t = this;
                //开启加载状态
                t.spin = true;
                //先清空
                if(!t.moreData){
                    t.currData.personData = [];
                }
                //如果是全局搜索
                if($.trim(t.keyWord)!==""&&!item){
                    t.personParams.orgIds = "";
                    t.personParams.pageBean.pageNo = 1;
                    t.personParams.searchCondition = t.keyWord;
                }else{
                    t.personParams.searchCondition = "";
                    t.personParams.orgIds = item.id;
                }
                t.$daydao.$ajax({
                    url:t.ApiPersonURL
                    ,data:JSON.stringify(t.personParams)
                    ,success:function (data) {
                        if( data.result == "true" && data.data){
                            var items = data.data.persons;
                            if(items){
                                for(var i=0;i<items.length;i++){
                                    //获取人员数据选中状态
                                    items[i]._isSelected = t.getItemSelectState(items[i],'person');
                                    t.currData.personData.push(items[i]);
                                }
                            }
                            //判断还有没有更多数据
                            if(t.personParams.pageBean.pageNo*t.personParams.pageBean.pageSize<data.data.totalNum){
                                t.moreData = true;
                            }else{
                                t.moreData = false;
                            }
                        }
                        t.spin = false;
                        //设置全选状态
                        if(t.multi){
                            t.$nextTick(function(){
                                t.setCheckAllState();
                            });
                        }
                    }
                });
            },
            /**
             * 加载更多人员数据
             * */
            loadMorePerson(){
                var t = this;
                t.personParams.pageBean.pageNo = t.personParams.pageBean.pageNo*1 + 1;
                t.loadPersonData(t.breadcrumb[t.breadcrumb.length-1]);
            },
            /**
             * 全局搜索
             * */
            searchData:function(){
                var t = this;
                //如果关键字为空
                if($.trim(t.keyWord)===""){
                    t.breadcrumb = [];
                    t.setCurrData();
                    return false;
                }
                //清空显示数据
                t.currData.orgData=[];
                t.currData.personData=[];
                t.breadcrumb = [];
                //搜索组织
                function searchOrg(item){
                    for(var i=0;i<item.length;i++){
                        if(item[i].name.indexOf(t.keyWord)!==-1){
                            t.currData.orgData.push(item[i]);
                        }
                        if(item[i].children){
                            searchOrg(item[i].children);
                        }
                    }
                }
                searchOrg(t.cacheData.orgData);
                //搜索人员
                if(t.type===1 || t.type===3){
                    t.loadPersonData();
                }
            },
            /**
             * 设置当前要显示的数据
             * @item 组织父节点
             * */
            setCurrData(item){
                var t = this ,arr = [];
                //清空搜索条件
                t.keyWord = "";
                t.personParams.pageBean.pageNo = 1;
                t.moreData = false;
                //判断是否可以前往下一级
                if(item && item._isSelected && t.multi) return false;
                //清空显示组织
                t.currData.orgData = [];
                //清空显示人员
                t.currData.personData = [];
                if(item){
                    if(item.children && item.children.length!==0){
                        t.currData.orgData = item.children;
                    }
                    //获取当前组织下的人员
                    if(t.type===1 || t.type===3){
                        t.loadPersonData(item);
                    }
                    //设置组织路径
                    t.setBreadcrumb(item);
                }else{
                    t.currData.orgData = t.cacheData.orgData;
                    t.spin = false;
                    //设置全选状态
                    if(t.multi){
                        t.$nextTick(function(){
                            t.setCheckAllState();
                        });
                    }
                }
                //获取组织数据已选状态
                for(var i=0;i<t.currData.orgData.length;i++){
                    t.currData.orgData[i]._isSelected = t.getItemSelectState(t.currData.orgData[i],'org');
                }
                if(t.type===2){
                    //设置全选状态
                    if(t.multi){
                        t.$nextTick(function(){
                            t.setCheckAllState();
                        });
                    }
                }
            },
            /**
             * 设置组织路径
             * @item 当前组织节点
             * */
            setBreadcrumb(item){
                var t = this ,indexArr = [] , obj = {};
                //清空路径
                t.breadcrumb=[];
                for(let i =0;i<item._nav.length;i++){
                    indexArr.push(item._nav[i].index);
                }
                for(let i=0; i<indexArr.length;i++){
                    i===0 ? obj = t.cacheData.orgData[indexArr[i]] : obj = obj.children[indexArr[i]];
                    t.breadcrumb.push(obj);
                }
            },
            /**
             * 返回上级组织
             * */
            upperLevel(){
                var t = this, item = t.breadcrumb[t.breadcrumb.length-2];
                if(!item) t.breadcrumb = [];
                t.setCurrData(item);
            },
            /**
             * 单选事件
             * @label 勾选的label值
             * */
            radioChange(label){
                var t = this ,selectItem = {} ,arr = label.split("-");
                //清空已选数据
                t.selectedData.orgData = [];
                t.selectedData.personData = [];
                if(arr[0]==="org"){
                    var index = $(".select-ul .li-org[data-id='"+arr[1]+"']").attr("data-index");
                    t.selectedData.orgData.push(t.currData.orgData[index]);
                }else{
                    var index = $(".select-ul .li-person[data-id='"+arr[1]+"']").attr("data-index");
                    t.selectedData.personData.push(t.currData.personData[index]);
                }
            },
            /**
             * 多选事件
             * @state 选中状态
             * @item 选中的数据
             * @str 勾选类型 org:组织 | person:人员
             * */
            checkboxChange(state,item,str){
                var t = this;
                //勾选组织
                if(str==="org"){
                    if(state){
                        t.selectedData.orgData.push(item);
                    }else{
                        //删除已选组织
                        var index = $(".selected-ul .li-org[data-id='"+item.id+"']").attr("data-index");
                        t.selectedData.orgData.splice(index,1);
                    }
                //勾选人员
                }else{
                    if(state){
                        t.selectedData.personData.push(item);
                    }else{
                        //删除已选人员
                        var index = $(".selected-ul .li-person[data-id='"+item.personId+"']").attr("data-index");
                        t.selectedData.personData.splice(index,1);
                    }
                }
                //设置全选状态
                t.$nextTick(function(){
                    t.setCheckAllState();
                });
            },
            /**
             * 单击移除
             * @item 要取消的数据
             * @index 要取消的数据的index
             * @str 数据类型 org:组织 | person:人员
             * */
            cancelSelect(item,index,str){
                var t = this;
                if(str==="org"){
                    var i = $(".select-ul .li-org[data-id='"+item.id+"']").attr("data-index");
                    if(i){ t.currData.orgData[i]._isSelected = false;}
                    t.selectedData.orgData.splice(index,1);
                }else{
                    var i = $(".select-ul .li-person[data-id='"+item.personId+"']").attr("data-index");
                    if(i){ t.currData.personData[i]._isSelected = false;}
                    t.selectedData.personData.splice(index,1);
                }
                
                if(t.multi){
                    //设置全选状态
                    t.$nextTick(function(){
                        t.setCheckAllState();
                    });
                }else{
                    //去掉单选值
                    t.radioGroup = "";
                }
            },
            /**
             * 全选事件
             * @state 状态
             * */
            checkAllChange(state){
                var t = this ,orgData=t.currData.orgData ,personData=t.currData.personData;
                if(state){
                    //选中当前所有组织
                    if(t.type!==3){
                        for(var i=0;i<orgData.length;i++){
                            if(!orgData[i]._isSelected && !(orgData[i].chkdisable && orgData[i].chkdisable==="true")){
                                t.currData.orgData[i]._isSelected = true;
                                t.selectedData.orgData.push(orgData[i]);
                            }
                        }
                    }
                    //选中当前所有人员
                    for(var i=0;i<personData.length;i++){
                        if(!personData[i]._isSelected && !(personData[i].chkdisable && personData[i].chkdisable==="true")){
                            t.currData.personData[i]._isSelected = true;
                            t.selectedData.personData.push(personData[i]);
                        }
                    }
                }else{
                    //取消当前所有组织
                    if(t.type!==3){
                        for(var i=0;i<orgData.length;i++){
                            if(orgData[i]._isSelected){
                                t.currData.orgData[i]._isSelected = false;
                                for(var j=0;j<t.selectedData.orgData.length;j++){
                                    if(orgData[i].id===t.selectedData.orgData[j].id){
                                        t.selectedData.orgData.splice(j,1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    //取消当前所有人员
                    for(var i=0;i<personData.length;i++){
                        if(personData[i]._isSelected){
                            t.currData.personData[i]._isSelected = false;
                            for(var j=0;j<t.selectedData.personData.length;j++){
                                if(personData[i].personId==t.selectedData.personData[j].personId){
                                    t.selectedData.personData.splice(j,1);
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            /**
             * 设置全选状态
             * */
            setCheckAllState:function(){
                var t = this ,state = true;
                if(t.currData.orgData.length===0&&t.currData.personData.length===0){
                    state = false;
                }else{
                    if(t.type!==3){
                        state = $(".select-ul .li-org.is-selected").length===t.currData.orgData.length;
                    }
                    if(state){
                        state = $(".select-ul .li-person.is-selected").length===t.currData.personData.length;
                    }
                }
                t.checkAll = state;
            },
            /**
             * 获取某条数据的选中状态
             * @item 需要判断的数据
             * @str 数据类型  org：组织  person：人员
             * */
            getItemSelectState(item,str){
                var t = this ,state = false;
                if(str==="org"){
                    state = $(".selected-ul .li-org[data-id='"+item.id+"']").length === 1;
                }else{
                    state = $(".selected-ul .li-person[data-id='"+item.personId+"']").length === 1;
                }
                return state;
            },
            /**
             * 重置选中的数据
             * */
            reset(){
                this.breadcrumb = [];
                this.selectedData.orgData = [];
                this.selectedData.personData = [];
                this.radioGroup = "";
                //设置当前要显示的数据
                this.setCurrData();
            }
        }
    }
</script>

<style lang="scss">
    .select-person-body {
        .select-person-left ,.select-person-right {
            float: left;
            width: 50%;
            .small-title {
                padding-bottom: 8px;
                .r {
                    color: #B1B6BF;
                }
            }
        }
        .select-person-left {
            padding-right: 15px;
        }
        .select-person-right {
            padding-left: 15px;
        }
        .select-box ,.selected-box{
            border: 1px solid #E3E8EE;
            height: 520px;
            ul.select-ul ,ul.selected-ul {
                li {
                    height: 40px;
                    line-height: 40px;
                    padding: 0 10px;
                    font-size: 14px;
                    color: #657180;
                    overflow: hidden;
                    .ivu-checkbox-wrapper {
                        width: calc(100% - 80px);
                        width: -ms-calc(100% - 80px);
                        width: -moz-calc(100% - 80px);
                        .ivu-checkbox {
                            float: left;
                            position: relative;
                            bottom: -13px;
                            margin-right: 20px;
                        }
                        .span-orgname {
                            float: left;
                            display: block;
                            cursor: default;
                            width: calc(100% - 70px);
                            width: -ms-calc(100% - 70px);
                            width: -moz-calc(100% - 70px);
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }
                    .ivu-radio-wrapper {
                        width: calc(100% - 80px);
                        width: -ms-calc(100% - 80px);
                        width: -moz-calc(100% - 80px);
                        .ivu-radio {
                            float: left;
                            position: relative;
                            bottom: -13px;
                            margin-right: 21px;
                        }
                        .span-orgname {
                            cursor: default;
                        }
                    }
                    .daydao-head-img {
                        float: left;
                        position: relative;
                        bottom: -8px;
                    }
                    span {
                        font-size: 14px;
                        &.span-orgname {
                            float: left;
                            display: block;
                            cursor: pointer;
                            width: calc(100% - 140px);
                            width: -ms-calc(100% - 140px);
                            width: -moz-calc(100% - 140px);
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }
                    .icon-organize {
                        float: left;
                        position: relative;
                        display: block;
                        width: 24px;
                        height: 24px;
                        background-image: url(images/icon-organize.png);
                        background-position:  center center;
                        background-repeat:  no-repeat;
                        bottom: -6px;
                        margin-right: 10px;
                    }
                    .btn-subordinate {
                        color: #3399FF;
                        cursor: pointer;
                        font-size: 14px;
                        margin-right: 4px;
                        .ivu-icon-navicon {
                            position: relative;
                            bottom: -4px;
                            margin-right: 6px;
                        }
                        &.disble{
                            color: #B5D6F9;
                        }
                    }
                    &.li-person {
                        .ivu-checkbox-wrapper {
                            width: 100%;
                        }
                        .ivu-radio-wrapper {
                            width: 100%;
                        }
                        .person-info {
                            display: block;
                            height: 40px;
                            width: calc(100% - 74px);
                            width: -ms-calc(100% - 74px);
                            width: -moz-calc(100% - 74px);
                            overflow: hidden;
                            font-size: 14px;
                            .ivu-row {
                                width: 100%;
                            }
                            .ivu-col {
                                text-overflow:ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                &.none {
                                    line-height: 99999px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .select-box {
            .search-bar {
                margin:10px; 
                position: relative;
                .btn-search {
                    position: absolute;
                    display: inline-block;
                    width: 36px;
                    height: 32px;
                    line-height: 32px;
                    cursor: pointer;
                    font-size: 18px;
                    text-align: center;
                    z-index: 1;
                    color: #AFB9C6;
                }
                .ivu-input {
                    text-indent: 26px;
                }
            }
            .breadcrumb {
                font-size: 14px;
                color: #657180;
                height: 30px;
                padding: 0 10px 0px 10px;
                ul {
                    li {
                        float: left;
                        padding-right: 5px;
                        position: relative;
                        a {
                            color: #2D8CF0;
                        }
                        &.span {
                            float: left;
                            display: block;
                            max-width: calc(33% - 24px);
                            max-width: -ms-calc(33% - 24px);
                            max-width: -moz-calc(33% - 24);
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            padding-right: 15px;
                        }
                        &.span-1 {
                            float: left;
                            display: block;
                            max-width: calc(100% - 40px);
                            max-width: -ms-calc(100% - 40px);
                            max-width: -moz-calc(100% - 40px);
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            padding-right: 15px;
                        }
                        &.span-2{
                            float: left;
                            display: block;
                            max-width: calc(50% - 40px);
                            max-width: -ms-calc(50% - 40px);
                            max-width: -moz-calc(50% - 40px);
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            padding-right: 15px;
                        }
                        .ivu-icon-ios-arrow-right {
                            position: absolute;
                            right: 5px;
                            top: 4px;
                        }
                    }
                    .line-vertical {
                        position: relative;
                        top: -1px;
                        padding: 0 2px;
                        color: #657180;
                    }
                }
                .ivu-spin-fix {
                    top: auto;
                }
            }
            ul.select-ul {
                position:relative;
                height: 436px;
                overflow-y: auto;
                li {
                    &.no-data {
                        text-align:center;
                        color:#999;
                    }
                    .seize {
                        float: left;
                        display: block;
                        width:34px;
                        height: 40px;
                    }
                    .ivu-col {
                        overflow:hidden;
                    }
                }
                .ivu-radio-group {
                    width:100%;
                }
            }
        }
        .selected-box {
            overflow-y: auto;
            ul.selected-ul {
                li {
                     &.li-person {
                        .person-info {
                            display: block;
                            height: 40px;
                            width: calc(100% - 36px);
                            width: -ms-calc(100% - 36px);
                            width: -moz-calc(100% - 36px);
                            overflow: hidden;
                            font-size: 14px;
                        }
                    }
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>