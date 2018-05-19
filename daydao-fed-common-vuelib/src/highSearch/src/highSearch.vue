<template>
	<div id="highSearch" class="highSearch clearfix">
		<div class="hs-head clearfix">
			<div class="hs-left">
				<slot name="left"></slot>
			</div>

			<!-- 关键词搜索 -->
			<div class="hs-right">
				<input id="keyword" type="text" :placeholder="keywordPlaceholder" v-model.trim="keyword" @keydown.up.prevent="heightLine(listIndex-1)"
				 @keydown.down.prevent="heightLine(listIndex+1)" @blur="searchBlur" @keydown.enter.stop="handleKeyEnter">
				<i :class="['hs-icon-down','iconfont_daydao_common' , {active:isShow.searchGroup}]" @click="toggleShowSearchGroup" v-if="searchCondition.length>1">&#xe6a9;</i>
				<button class="iconfont_daydao_common" @click="handleKeyEnter">&#xe67f;</button>

				<transition name="fade-down">
					<div class="hs-list" v-show="isShow.searchList">
						<ul ref="hsSearchList">
							<li v-for="(item , index) in fuzzyList" @mouseenter.prevent="fuzzyMouseEnterHandler(index)" @click="handleKeyEnter">{{item}}</li>
						</ul>
						<p @click="toggleShowSearchGroup" v-if="!isShow.searchGroup">更多筛选</p>
					</div>
				</transition>
			</div>

		</div>

		<div class="hs-position-control" id="positionWrapper">
			<!-- badages -->
			<div class="hs-badages" v-show="isShow.badages">
				<span v-for="(item , index) in badagesList" :title="item.title">
		            {{item.text}}
		            <i @click="removeBadage(item.flag , index)" class="iconfont_daydao_common">&#xe6a6;</i>
		        </span>
			</div>
		</div>


		<!-- 高级搜索框组 -->
		<div :class="['hs-group','clearfix' , {active:isShow.searchGroup}]">
			<b class="close iconfont_daydao_common" @click="isShow.searchGroup = false">&#xe6a6;</b>

			<input-group :searchCondition="highSearchCondition" ref="highSearchGrop" @keywordBind="keywordBind"></input-group>
			<div class="hs-button-group">
				<button class="btn" @click="search">搜索</button>
				<button class="btn btn-outline" @click="resetHandler">重置</button>
			</div>
		</div>

	</div>
</template>

<script>
	import { mapResult, dateFormat , checkDateType} from './util.js'
	import inputGroup from './inputGroup.vue'
    import utils from '../../utils/index'


	export default {
		data() {
			return {
				value1: '',

				// control show or hide
				isShow: {
					searchList: false,
					searchGroup: false,
					badages: true
				},
				listIndex: -1,

				// datePicker
				datePickerValue: '',

				//the placeholder of keyword input
				keywordPlaceholder: '',

				//keyword model
				keyword: "",

				//input groups model
				modelHeighSearch: [],

				// badages
				badagesList: [],

				// store search conditions
				searchConditionList: [],

				//highsearch lock
				lock: true,

				//high search condition props
				highSearchCondition: [],

				//fuzzy search data
				fuzzyList: [],

			};


		},
		props: {
			dateCallback: {
				type: Function,
				default() { }
			},
			searchCondition: {
				type: Array,
				default() {
					return [];
				},
			},
			fetchFuzzySearch: {
				type: Function,
				defalut() { }
			}
		},
		computed: {
			moduleId() {
				let moduleId = this.$route.path + '-hs-' + gMain.oUser.dd;
				return moduleId;
			}
		},
		components: { inputGroup },
		watch: {
			keyword: function (val, old) {
				if (this.keywordInput != document.activeElement) { return }

				this.changeKeyword();
				if (this.fuzzyList[this.listIndex] == this.keyword) {
					return
				}
				// fetch Fuzzy search data
				this.fetchFuzzySearch(this.keyword, (list) => {
					if (Array.isArray(list)) {
						if (!this.isShow.searchList) {
							this.listIndex = -1;
						}
						if (list.length > 0) {
							this.fuzzyList = list;
							this.isShow.searchList = true;
						} else {
							this.hideSearchList();
						}
					} else {
						this.hideSearchList();
						console.error('the parama of cb must be an array');
					}
				});
			},
			searchCondition(val) {
				this.initSearchCondition();
			}
		},
		mounted() {
			this.keywordInput = document.querySelector('#keyword');
			setTimeout(_=>{
				this.searchCondition.length>0 && this.initSearchCondition();
			},0)

			this.foucsHide();

		},
		activated(){
			this.foucsHide();
		},
		methods: {
			initSearchCondition(){
				//get modelHeighSearch cash
				this.searchCondition.forEach((item, index) => {
					if (item.isDefault == "1") {
						this.keywordPlaceholder = '请输入' + item.conditionContent;
					}

					if (item.defaultValue) {
						var obj = {};
						obj = {
							conditionId: item.conditionId,
							flag: index
						}

						if (item.conditionStyle === 'text') {
							obj['conditionValue'] = item.defaultValue;
						}
						else if (item.conditionStyle === 'treeMultipleSelect') {
							var label = mapResult(item.defaultValue.replace(/\'/g, "").split(','), item.conditionValue, item.conditionDisplay, false);
							obj['label'] = label;
							obj['conditionValue'] = item.defaultValue;
						}
						else if (item.conditionStyle === 'treeSelect') {
							obj['label'] = item.conditionDisplay;
							obj['conditionValue'] = item.defaultValue;
						}
						else if (item.conditionStyle === 'switch') {
							if (item.defaultValue == "1") {
								obj['label'] = item.conditionDisplay.split("|")[0];
								obj['conditionValue'] = "1";
							} else {
								obj['label'] = item.conditionDisplay.split("|")[1];
								obj['conditionValue'] = "0";
							}
							obj['label'] = item.conditionContent + ':' + obj['label'];
							obj['conditionStyle'] = 'switch';
						}
						else if (item.conditionStyle === 'checkbox') {
							item['checkboxList'] = item.conditionDisplay.split('|');
							obj['label'] = mapResult(item.defaultValue.replace(/\'/g, "").split(','), item.conditionValue, item.conditionDisplay,false);
							obj['conditionValue'] = item.defaultValue;
						}
						else if (item.conditionStyle === 'radio') {
							obj['label'] = item.defaultValue;
						}
						else if (item.conditionStyle && item.conditionStyle.indexOf("date") != -1) {
							var defaultDate = "";
							if (item.defaultValue == "current") {
								let formate = checkDateType(item.conditionStyle).format;
								defaultDate = dateFormat(new Date, formate)
							} else if (item.defaultValue.indexOf("current-") != -1 || item.defaultValue.indexOf("current+") != -1) {
								var oDate = new Date();
								var str = item.defaultValue;
								var sOperation = str.substr(7, 1); //计算类型 是 “+” 还是 “-”
								str = str.substr(8);
								var iNum = str.match(/\d+/)[0]; //数字
								var iUnit = str.match(/[a-zA-Z]+/)[0]; //单位
								if (iUnit == "d") {
									if (sOperation == "+") {
										oDate.setDate(oDate.getDate() + parseInt(iNum));
									} else if (sOperation == "-") {
										oDate.setDate(oDate.getDate() - parseInt(iNum));
									}
								}

								defaultDate = oDate;
							}
							obj['conditionValue'] = defaultDate;
						}
						obj['name'] = item.conditionContent;
						this.modelHeighSearch.push(obj);
					}
				})

				this.showBadages();
			},
			//点击其他地方隐藏
			foucsHide(){
				if (this.searchCondition.length>1) {
					document.onclick  = (event)=>{
						if (!event.path) return;
						let hasParent = false;
						for (let i = 0; i < event.path.length-2; i++) {
							if (event.path[i].classList && (event.path[i].classList.contains('hs-group') || event.path[i].classList.contains('hs-right'))) {
								hasParent= true;
								break;
							}
						}
						if (!hasParent) {this.isShow.searchGroup = false}
					}
				}
			},
			//模糊搜索上下键操作
			heightLine(index) {
				if (!this.isShow.searchList) { return };
				var $searchList = this.$refs.hsSearchList.querySelectorAll('li');

				var maxIndex = $searchList.length;

				if (index < 0) {
					index = 0;
				}
				//down
				if (index > maxIndex - 1) {
					index = maxIndex - 1;
				}

				this.listIndex = index;
				for (let i = 0; i < $searchList.length; i++) {
					$searchList[i].classList.remove("cur");
				}
				$searchList[index].classList.add("cur");

				this.keyword = this.fuzzyList[index];
			},
			searchBlur() {
				if (!this.isShow.searchList) { return }
				setTimeout(_ => {
					this.hideSearchList();
				}, 150);
			},

			//隐藏高级搜索下拉
			hideSearchList() {
				this.isShow.searchList = false;
				var $searchList = this.$refs.hsSearchList.querySelectorAll('li');
				for (let i = 0; i < $searchList.length; i++) {
					$searchList[i].classList.remove("cur");
				}
				this.fuzzyList = [];
				this.listIndex = -1;
			},

			// 模糊搜索方法
			fuzzyMouseEnterHandler(index) {
				this.listIndex = index;
				var $searchList = this.$refs.hsSearchList.querySelectorAll('li');

				for (let i = 0; i < $searchList.length; i++) {
					$searchList[i].classList.remove("cur");
				}

				$searchList[index].classList.add("cur");
			},

			//回车触发方法
			handleKeyEnter() {
				this.keyword = this.fuzzyList[this.listIndex] ? this.fuzzyList[this.listIndex] : this.keyword;

				if (this.lock) {
					if (this.modelHeighSearch[0] && this.modelHeighSearch[0].flag == 0) {
						if (this.keyword.length > 0) {
							this.modelHeighSearch[0] = {
								'conditionId': this.searchCondition[0].conditionId,
								'conditionValue': this.keyword,
								'flag': 0
							}
						} else {
							this.modelHeighSearch.shift();
						}
					} else {
						if (this.keyword.length > 0) {
							var obj = {
								'conditionId': this.searchCondition[0].conditionId,
								'conditionValue': this.keyword,
								'flag': 0
							}
							this.modelHeighSearch.unshift(obj);
						}
					}
				}

				setTimeout(_ => {
					this.hideSearchList();
					this.search();
				}, 0)

				// set local cash
				// this.setCache();
			},

			//改变高级搜索里面的关键词
			changeKeyword() {
				if (!this.lock) {
					this.$refs.highSearchGrop.modelList.splice(0, 1, this.keyword);
				} else {
					this.searchCondition[0]["defaultValue"] = this.keyword;
				}
			},

			// 关键词双向绑定
			keywordBind(key) {
				this.keyword = key;
			},

			// 返回搜索条件
			returnCondition() {
				// define resolve();
				var self = this;
				var showBadages = function (callback) {
					self.showBadages();
					self.$nextTick(_=>{
						callback && callback();
					})
				}
				var searchList = this.getSearchList();
				this.$emit("getSearchCondition", searchList, showBadages);
			},

			// getSearchList
			getSearchList() {
				this.searchConditionList = this.modelHeighSearch;
				let searchList = this.searchConditionList.map(item => {
					var obj = Object.assign({}, item);
					delete obj.flag;
					delete obj.name;

					return obj
				})
				return searchList;
			},

			//显示已经搜索的条件
			showBadages() {
				this.badagesList.splice(0, this.badagesList.length);
				this.modelHeighSearch.forEach(item => {
					if (item.conditionStyle === 'switch' && item.conditionValue === "0") return;

					var data = { 'flag': item.flag };
					if (item.hasOwnProperty('label')) {
						data['text'] = item.label
						data.title = data.text;
					} else {
						data['text'] = item.conditionValue;
						if (item.name) {
							data.title = item.name + '：' + data.text;
						}
					}

					this.badagesList.push(data);

				})
				this.isShow.searchGroup = false;
				this.setMinHeight();
			},


			setMinHeight() {
				setTimeout(_ => {
					this.highSearch = document.querySelector('#highSearch');
					this.positionWrapper = document.querySelector('#positionWrapper');
					let h = this.positionWrapper.offsetHeight + 44;

					//如果树导航和搜索条件面包屑的总宽度小于 页面右侧总宽度，意思是不交叉的时候，一行显示条件面包屑（允许50宽度的交叉误差）
                    if(document.querySelector("#page_dropdown_inner") && document.querySelector("#daydao_content_app_content")){
                        if(document.querySelector("#page_dropdown_inner").offsetWidth + this.positionWrapper.offsetWidth + 50 < document.querySelector("#daydao_content_app_content").offsetWidth){
                            h = this.positionWrapper.offsetHeight + 15;
                        }
                    }

                    if (Array.isArray(this.$parent.navigationData) && this.$parent.navigationData.length===0) h-=8;

					this.highSearch.style.minHeight = h + 'px';
				}, 0)
			},

			//重置高级搜索
			resetHandler() {
				this.badagesList.splice(0, this.badagesList.length);
				this.$refs.highSearchGrop.resetData();
				this.searchConditionList = [];
				this.keyword = "";
				this.isShow.searchGroup = true;
			},
			removeBadage(flag, index) {
				if (this.lock) {
					this.searchCondition[flag].defaultValue = null;
				} else {
					this.$refs.highSearchGrop.removeBadage(flag);
				}
				if (flag === 0) {
					this.keyword = ""
				}
				this.modelHeighSearch.splice(index, 1);

				this.search();
			},

			//搜索
			search() {
				if (!this.lock) this.modelHeighSearch = this.$refs.highSearchGrop.searchHandler();
				this.searchConditionList = this.modelHeighSearch;
				this.returnCondition();
				// this.setCache();
			},
			toggleShowSearchGroup() {
				this.isShow.searchGroup = !this.isShow.searchGroup;
				this.$emit("toggleShowSearchGroup", this.isShow.searchGroup); //回调是否显示搜索详细框

				if (this.lock && this.searchCondition && this.searchCondition.length > 0) {
					this.highSearchCondition = this.searchCondition;
					this.lock = false;
				}
			},

			//将搜索过的条件存入localStorage
			setCache() {
				utils.Cache.setCache(this.moduleId, {
					modelHeighSearch: this.modelHeighSearch,
				}, 'local')
			}
		}
	}

</script>






<style lang="scss">

	$preCls : '.hs';

	.highSearch {
		width: 100%;
		background: #fff;
		position: relative;

		#{$preCls} {
			&-head {
				padding: 8px 8px 0 8px;
			}
			&-list {
				position: absolute;
				width: 100%;
				top: 30px;
				border: 1px solid #D7DDE4;
				border-top: 0;
				background: #fff;
				z-index: 100;
			}
			&-list ul li,
			&-list p {
				height: 30px;
				line-height: 30px;
				padding: 0 10px;
				cursor: pointer;
			}
			&-list ul li {
				color: #657180;
			}
			&-list ul li.cur,
			&-list ul li:hover {
				background: #F3F9FF;
			}
			&-search-list p {
				background: #F18950;
				color: #fff;
				text-align: center;
			}

			&-left {
				float: left;
			}

			&-right {
				float: right;
				position: relative;
				input {
					width: 320px;
					height: 30px;
					line-height: 30px;
					padding: 3px 10px;
					border-top-left-radius: 2px;
					border-bottom-left-radius: 2px;
					border: 1px solid #D7DDE4;
					border-right: none;
					float: left;
					font-size: 14px;
					color: #657180;
					transition: border .2s ease-in-out;

					&::-webkit-input-placeholder {
						color: #D7DDE4;
					}

					&:focus{
						border-color:#F18950;
					}
				}
				button {
					height: 30px;
					width: 60px;
					background: #F18950;
					border: none;
					border-top-right-radius: 2px;
					border-bottom-left-radius: 2px;
					float: left;
					color: #fff;
					font-size: 18px;
					cursor: pointer;

					&:hover{
						background:#F8925A;
					}
					&:active{
						background:#E6773B;
					}
				}
			}


			&-icon-down {
				display: block;
				position: absolute;
				right: 66px;
				top: 4px;
				cursor: pointer;
				color: #D2D2D2;
				transform: rotate(0deg);
				transition: all 0.2s;

				&.active {
					transform: rotate(180deg);
				}
			}

			&-group {
				position: absolute;
				z-index: 10;
				max-height: 0px;
				padding: 0 14px;
				transition: all .3s ease;
				background: #FAFBFC;
				opacity:0;
				overflow: hidden;
				width: 100%;

				&.active {
					padding: 14px;
					max-height: 300px;
					overflow: visible;
					opacity:1;
					box-shadow:2px 2px 7px rgba(0, 0, 0, 0.23);
				}

				.close {
					position: absolute;
					right: 10px;
					top: 4px;
					color: #657180;
					cursor: pointer;
					font-size: 14px;
				}
			}

			&-position-control {
				position: absolute;
				/*width: 100%;*/
				z-index: 1;
				top: 43px;
				right: 0;
			}

			&-badages {
				margin-top: 4px;
				padding: 0 8px;
				float: right;
				span {
					max-width: 160px;
					height: 24px;
					line-height: 24px;
					color: #657180;
					padding: 0 20px 0 10px;
					border: 1px solid #D7DDE4;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: auto;
					font-size: 12px;
					position: relative;
					margin-left: 8px;
					display: inline-block;
					box-sizing: border-box;
					-moz-box-sizing: border-box;
					transition: all .2s ease;
					&:hover {
						color: #F18950;
						border-color: #F18950;
					}
				}

				i {
					position: absolute;
					right: 6px;
					top: 0;
					cursor: pointer;
					font-size: 12px;
					transform: scale(0.8);
				}
			}

			&-button-group {
				display: flex;
				float: right;

				.btn {
					width: 60px;
					height: 30px;
					line-height: 30px;
					background: #F18950;
					border: 1px solid #F18950;
					color: #fff;
					border-radius: 2px;
					cursor: pointer;
				}
				.btn-outline {
					background: #fff;
					border: 1px solid #D7DDE4;
					color: #657180;
				}
				button.btn:first-child {
					margin-right: 10px;
				}
			}
		}

		.fade-down-enter-active {
			transition: all .3s ease;
		}
		.fade-down-leave-active {
			transition: all 0s ease;
		}
		.fade-down-enter,
		.fade-down-leave-to {
			transform: translateY(10px);
			opacity: 0;
		}
	}
</style>
