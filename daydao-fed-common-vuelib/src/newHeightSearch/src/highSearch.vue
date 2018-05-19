<template>
	<div id="highSearch" class="newHighSearch clearfix">

		<div class="hs-head clearfix">
			

			<!-- 关键词搜索 -->
			<div class="hs-flag hs-left">

				<!-- 条件模板 -->
				<sceneDropdown
					v-show="cloneCustomSearchCondition.length>0"
					ref="sceneDropdown"
					:customSearchCondition="cloneCustomSearchCondition"
					:addConditionTemplate="addConditionTemplate"
					@showManagePanel="showManagePanel"
					@getTemplate="getTemplate"
					@changeCurrentTpl="changeCurrentTpl"
					>
				</sceneDropdown>
				<div class="dropdownBtn" @click="addConditionTemplate" v-show="cloneCustomSearchCondition.length === 0">新增场景</div>
				

				<!-- 外层搜索条件 -->
<!-- 				<div class="hs-out-input-wrapper">
					<span class="hs-filter-label">测试</span>
					<Select v-model="model1" style="width:200px">
				        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				    </Select>
				</div>
 -->

				<!-- 高级搜索框组 -->
				<span class="hs-out-icon highSearchIcon iconfont_daydao_common" @click="toggleShowSearchGroup">&#xe643;</span>
				

				<!-- 关键词搜索框 -->
				<keywordInput @getKeyword="getKeyword" :placeholder="keyWordData.conditionContent" v-model="keyword"></keywordInput>

			</div>

			<!-- 按钮 -->
	        <div class="hs-right">
	        	<slot>
	        		<btnGroup :btns="btns"></btnGroup>
	        	</slot>
			</div>

		</div>

		<!-- badages -->
		<div class="hs-badages" v-if="badagesList.length>0">
			<span>共搜到{{resulNum}}条</span>
			<ul>
				<li v-for="(item , index) in badagesList" @click="removeBadage(item , index)">
					{{item.title}}: {{item.label}} <i class="iconfont_daydao_common">&#xe6a6;</i>
				</li>
			</ul>
			<span>的结果</span>
			<span href="javascript:;" class="cancle" @click="cancleFilter">取消筛选</span>
		</div>

		
		<!-- 高级搜索组  -->
		<slideDown  class="hs-group" v-model="isShowSearchGroup" :bindEl="['highSearchIcon' , 'addFilter' , 'addTpl']">
			<b class="close iconfont_daydao_common" @click="isShowSearchGroup = false">&#xe6a6;</b>

			<input-group
				v-if="lock"
				:queryCondition="cloneQueryCondition"
				:customSearch="currentCustomSearch"
				:columnEdit="columnEdit"
				btnText="确定"
				@getData="search"
				ref="highGroup"
				></input-group>
		</slideDown>


		<!-- 新增 -->
		<slideDown  class="hs-group" v-model="isShowAddTpl" :bindEl="['highSearchIcon' , 'addFilter' , 'addTpl' , 'ivu-modal-wrap' ,'dropdownBtn']">
			<b class="close iconfont_daydao_common" @click="isShowAddTpl = false">&#xe6a6;</b>

			<input-group
				noSearch
				v-if="isShowAddTpl"
				:queryCondition="queryCondition"
				:columnEdit="columnEdit"
				ref="inputGroupAdd"
				@getData = "addSearch"
				></input-group>
		</slideDown>


		<!-- 场景管理 -->
		<slideDown class="hs-manage-panel" v-model="isShowManagePanel" :bindEl="['manageBtn' , 'ivu-modal-wrap']">
			<h3>场景管理 <i class="iconfont_daydao_common close" @click="isShowManagePanel=false">&#xe6a6;</i></h3>
			<managePanel 
				ref="managePanel"
				:manageSearchCondition="manageSearchCondition" 
				:queryCondition="queryCondition"
				:infoSetId="infoSetId"
				:columnEdit="columnEdit"
				@changeCustomSearch="changeCustomSearch"
				@delCustomSearch="delCustomSearch"
				></managePanel>
		</slideDown>



        <!-- 模板已满 -->
        <Modal title="提示" v-model="isShowEmptyTpl" width="550" ok-text="确定" cancel-text="取消" :transfer="false" @on-ok="fullHandler">
			<fullTpl 
			ref="fullTpl"
			:customSearch="cloneCustomSearchCondition"
			:currentTemplateName="fullName"></fullTpl>
        </Modal>




	</div>
</template>

<script>
	import './index.scss'
	import inputGroup from './components/inputGroup.vue'
    import fullTpl from './components/fullTpl.vue'
    import slideDown from './components/slideDown.vue'
    import keywordInput from './components/keywordInput.vue'
    import sceneDropdown from './components/sceneDropdown.vue'
    import managePanel from './components/managePanel.vue'
    import {searchDataHandler} from './util.js'
    import btnGroup from 'commonVueLib/btnGroup'; //高级搜索



	export default {
		components: { inputGroup  , fullTpl , slideDown , keywordInput , sceneDropdown , managePanel ,btnGroup},
		data() {
			return {
				cityList: [
				 	{
                        value: '1',
                        label: 'New York'
                    },
                    {
                        value: '2',
                        label: 'London'
                    }
                 ],
                 model1:'1',

                isSaveTpl:false,
                isSaveDefault:false,
                isShowAddTpl:false,

                maxHeight : 0,

				isShowAddFilter:false,
				isShowEmptyTpl:false,
				isShowManagePanel:false,
				isShowSearchGroup:false,

				currentIndex : 0,


				//input groups model
				modelHeighSearch: [],

				// badages
				badagesList: [],

				// store search conditions
				searchConditionList: [],

				//high search condition props
				highSearchCondition: [],

				//store customeSearchCondition
				cloneCustomSearchCondition:[],

				// store queryConditon
				cloneQueryCondition :[],


				//当前模板
				currentCustomSearch:{},

				//可以管理的模板
				manageSearchCondition:[],

				currentTplId:'',

				//关键词
				keyword:'',
				keyWordData : {},

				//存储条件满了的时候的信息
				fullName:'',
				fullConditionList:[] , 
				fullCustomSearch:{},

				// 是否有打开过高级搜索
				lock : false,



			};


		},
		props: {
			infoSetId:{
				type : String,
				default : ''
			},
			queryCondition: {
				type: Array,
				default() {
					return [];
				},
			},
			customSearchCondition:{
				type: Array,
				default() {
					return [];
				},
			},
			columnEdit:{
				type: Array,
				default(){
					return [];
				}
			},
			btns:{
				type: Array,
				default(){
					return [];
				}
			},
			resulNum:{
				type: [Number , String],
				default: 0
			},
			isFetchFuzzySearch:{
                type: Boolean,
                default : true
            }
		},
		watch: {
			queryCondition(val){
				this.init();
			},
			cloneCustomSearchCondition(val){
                this.manageSearchCondition = val.filter(item=>item.type===2);
                if (this.manageSearchCondition.length===0) {
                	this.isShowManagePanel = false;
                }
			}
		},
		created(){
			if (this.queryCondition.length>0) {
				this.init();
			}
			

		},
		mounted() {
			this.keywordInput = document.querySelector('#keyword');
		},
		methods: {
			/*
			* @description 组件初始化
			*/ 
			init(){
				this.cloneQueryCondition = this.queryCondition.map(item=>item);
				this.keyWordData = this.queryCondition.find(item=>item.isDefault === '1');

				if (this.customSearchCondition.length>0) {
					this.cloneCustomSearchCondition = this.customSearchCondition.map(item=>item);
				}else{
					this.initSearch();
				}

			},
			//展示增加模板
			addConditionTemplate(){
				this.isShowAddTpl = true;
			},
			/*
			* @description 展示管理模板
			* @param index {number} 当前模板位置
			*/
			showManagePanel(index){

				this.$refs.managePanel.changeEditTpl(this.manageSearchCondition[index],index);
				this.isShowManagePanel = true;
				
			},
			/*
			* @description 
			* @params data {Object} 当前模板数据
			* @params index {number} 当前模板位置
			*/ 
			changeCurrentTpl(data , index){
				this.currentIndex = index;
				this.currentTplId = data.uuid;
				this.currentCustomSearch = JSON.parse(JSON.stringify(data));
			},
			//获取模板 , 使用initSearch
			getTemplate(data , index){
				//没有默认模板
				let defaultValue = [];
				if (data === 'noDefault') {
					this.initSearch();
					return;
				}else{
					this.changeCurrentTpl(data , index);
				}


				if (this.lock) {
					setTimeout(_=>{
						this.$refs.highGroup.search();
					},100)
				}else{
					this.initSearch();
				}
				
			},
			
			//回车触发方法
			getKeyword(keyword) {
				this.keyword = keyword;
				if (this.lock) {
					this.$refs.highGroup.search();
				}else{
					this.initSearch();
				}
			},
			//显示已经搜索的条件
			showBadages(list) {
				this.badagesList = [];
				list.forEach(item => {
					if (item.type === 'originTree') {

						item.labels.forEach(orgTree=>{
							orgTree.label = orgTree.name;
							orgTree.title = item.title;
							orgTree.type = item.type;
							orgTree.flag = item.flag;
							orgTree.conditionId = item.conditionId;
							this.badagesList.push(orgTree);
						})

					}else if (typeof item.value === 'boolean') {
						item.label = item.value?'是':'否';
						this.badagesList.push(item);

					}else if(Array.isArray(item.value)){
						item.value.forEach((child,index)=>{
							child.title = item.title;
							child.childIndex = index;
							child.flag = item.flag;
							child.conditionId = item.conditionId;
							child.uuid = item.uuid;
							this.badagesList.push(child);
						})
						return;

					}else if(Object.prototype.toString.call(item.value) === '[object Object]'){
						item.label = item.value.label;
						this.badagesList.push(item);
					}else{
						item.label = item.value;
						this.badagesList.push(item);
					}



				})
				this.isShowSearchGroup = false;
			},

		
			//删除搜索条件
			removeBadage(condition, index) {
				if (condition.isDefault) {
					this.keyword = '';
					this.badagesList.pop();
					this.lock?this.$refs.highGroup.search():this.initSearch();
				}else{
					if (this.lock) {
						this.$refs.highGroup.removeCondition(condition);
					}else{
						this.initRemoveCondition(condition , index);
					}
				}
			},
			//
			initRemoveCondition(condition , index){
				if (condition.isDefault) {
					this.keyword = '';
					this.badagesList.splice(index , 1);
				}else{
					if (this.currentCustomSearch.datas) {
						this.currentCustomSearch.datas.forEach(item=>{
							if (item.conditionId === condition.conditionId || item.uuid === condition.uuid) {
								item.value = null;
								item.label = null;
							}
						})
					}else{
						this.cloneQueryCondition[condition.flag].value = '';
						this.cloneQueryCondition[condition.flag].label = '';
					}
					
					this.badagesList.splice(index , 1);
				}
				
				this.initSearch();
			},
			//替换模板
			fullHandler(){
				this.$refs.managePanel.modify(this.fullConditionList , this.fullCustomSearch , this.$refs.fullTpl.uuid);
			},
			//新增
			addSearch(conditionList , customSearch , isChange , cb){
				let datas = searchDataHandler(customSearch.datas);
                    customSearch.datas = datas;


                if (this.cloneCustomSearchCondition.length === 20) {
                	this.isShowEmptyTpl = true;
                	this.fullName = customSearch.name;
                	this.fullConditionList = conditionList;
                	this.fullCustomSearch = customSearch;
                	return
                }

				this.$daydao.$ajax({
					url : `${gMain.apiBasePath}route/${this.infoSetId}/customSearch/save.do`,
					data: JSON.stringify({
						customSearch,
						infoSetId : this.infoSetId
					}),
					success: data=>{
						if (data.result === 'true') {
							
							if (customSearch.isDefault) {
								this.cloneCustomSearchCondition.forEach(item=>{
									if (item.isDefault) item.isDefault = false;
								})
							}

							this.cloneCustomSearchCondition.push(data.data);
							this.$Message.success('新增成功');
							this.isShowAddTpl =false;

							if (isChange) {
								this.$refs.sceneDropdown.changeTemplate(data.data.uuid);
							}

							cb && cb();

						}
					}
				})
			},
			//没有默认模板,或者没有模板的 初始化搜索
			initSearch(){

				const _search = ( arr , isDefault)=>{
					arr.forEach((item , index)=>{
						let obj = {};
						if (item.value) {
							let label = {flag : index};
							obj.value = item.value;
							
							
							if (item.type === 1 || isDefault) {

								var {cellTypeId , title} = isDefault ? item : this.queryCondition.find(o=>o.conditionId === item.conditionId);

								label.conditionId = item.conditionId;
								obj.conditionId = item.conditionId;
							}else{
								var {cellTypeId , title} = item.columnBean;
								label.uuid = item.uuid;
								obj.uuid = item.uuid;
							}

							
							label.title = title;
							if (cellTypeId === '19' || cellTypeId === '18') { //日期范围或者数字范围
								label.label = item.label.join('~');
								this.badagesList.push(label);
							}else if(Array.isArray(item.label)){
								item.label.forEach((v,i)=>{
									let o = {label:v , childIndex: i , title:title};
									if (item.type === 1) {
										o.conditionId = item.conditionId
									}else{
										o.uuid = item.uuid;
									}
									this.badagesList.push(o);
								})
							}else{
								label.label = item.label;
								this.badagesList.push(label);
							}
							data.push(obj);
						}
					})
				}


				let data = [];
				this.badagesList = [];
				if (this.currentCustomSearch.uuid) {
					let custom = [],
						query  = [];

					this.currentCustomSearch.datas.forEach(item=>{
						item.conditionId ? query.push(item) : custom.push(item);
					})
					_search(query);
					_search(custom);
					
				}else{
					let arr = this.cloneQueryCondition;
					_search(arr , true);
				}

				//关键词
				if (this.keyword) {
					let keywordCondition = {
						conditionId : this.keyWordData.conditionId,
						value : this.keyword,
					};
					let keywordLabel = {
						title : this.keyWordData.conditionContent,
						label : this.keyword,
						isDefault : true
					}
					data.push(keywordCondition);
					this.badagesList.push(keywordLabel)
				}


				this.$emit('getSearchCondition' , data , (cb)=>{cb && cb()});


			},
			//高级搜索
			search(conditionList , customSearch) {
				const _search =()=>{
						//增加关键词
						if (this.keyword) {
							let keywordCondition = {
								conditionId : this.keyWordData.conditionId,
								value : this.keyword,
								title : this.keyWordData.conditionContent,
								isDefault : true
							};
							conditionList.push(keywordCondition);
						}


						let data = searchDataHandler(conditionList);
						console.log(data);

						let self = this;
						let callback = (cb)=>{
							self.showBadages(conditionList);
							cb && cb();
						}

						this.$emit('getSearchCondition' , data , callback);
				} 


				//搜索里面的保存为模板
				if (customSearch && customSearch.isSaveTpl) {
					this.addSearch(conditionList , customSearch , true , _search);
				}else{
					_search();
				}
				
				
			},
			//全部取消
			cancleFilter(){
				if (this.lock) {
					this.$refs.highGroup.reset();
				}else{
					
					if (this.currentCustomSearch.datas && this.currentCustomSearch.datas.length>0) {
						this.currentCustomSearch.datas.forEach(item=>{
							item.value = null;
							item.label = null;
						})
					}else{
						this.cloneQueryCondition.forEach(item=>{
							item.value = null;
							item.label = null;
						})
					}
					
				}
				
				this.badagesList.splice(0, this.badagesList.length);
				this.keyword = '';

				this.search([]);
			},
			// 修改customSearch
			changeCustomSearch(data){

				this.cloneCustomSearchCondition = this.cloneCustomSearchCondition.map(item=>{
					if (data.isDefault) {item.isDefault = false};
					return item.uuid===data.uuid?data:item;
				})

				if (this.currentTplId ===  data.uuid) {
					setTimeout(_=>{
						this.$refs.sceneDropdown.changeTemplate(data.uuid);
					},10)
				}

			},
			//删除customSearch
			delCustomSearch(uuid){
				let index = this.cloneCustomSearchCondition.findIndex(item=>item.uuid===uuid);
				this.cloneCustomSearchCondition.splice(index,1);
			},
			toggleShowSearchGroup() {
				this.lock = true;
				this.isShowAddTpl = false;
				this.isShowSearchGroup = !this.isShowSearchGroup;
			}
		}
	}

</script>






