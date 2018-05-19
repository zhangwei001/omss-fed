<template>

    <div class="wrapper">
        <div class="left">
            <a v-for="(item , index) in manageSearchCondition" @click="changeEditTpl(item , index)" :class="{active:index===currentIndex}">{{item.name}}</a>
        </div>
        <div class="right">
            <div class="icon-group">
                <i class="iconfont_daydao_common" @click="delTpl">&#xe6ae;</i>
                <i class="iconfont_daydao_common" @click="toggleShow">&#xe69c;</i>
            </div>


           <div class="input-group clearfix" v-if="!isEdit">
                <div  class="input-control"  v-for="(item , index) in cloneData">
                    <template v-if="item.isDefault!=='1'">
                        <label class="name" :key="'label'+index">{{item.title}}</label>
                        <span>{{item.labelValue}}</span>
                    </template>
                </div>
            </div>  
            
            
            <input-group 
                v-if="lock"
                v-show="isEdit"
                noSearch
                :queryCondition="queryCondition"
                :customSearch="currentCustomSearch"
                :columnEdit="columnEdit"
                @getData="modify"
                ></input-group>
        </div>
    </div>

</template>

<script>
    
    import inputGroup from './inputGroup.vue'
    import {searchDataHandler} from '../util.js'

    const mapActions = window.Vuex.mapMutations;
    const mapGetters = window.Vuex.mapGetters;


    export default {
        name:'managePanel',
        components: {inputGroup},
        data() {
            return {
                currentIndex:0,
                isEdit : false,
                currentName : {},
                currentCustomSearch : {},
                cloneData : [],
                lock:false
            }
        },
        props:{
            manageSearchCondition: {
                type : Array,
                default(){
                    return [];
                }
            },
            queryCondition: {
                type : Array,
                default(){
                    return [];
                }
            },
            infoSetId:{
                type : String,
                default : ''
            },
            //初始默认模板
            initIndex:{
                type : Number,
                default : 0
            },
            columnEdit: {
                type: Array,
                default(){
                    return [];
                }
            }
        },
        computed:{
            ...mapGetters('highSearch',['beansStore'])
        },
        watch: {
           manageSearchCondition(val , old){

                if (val.length<old.length && this.currentIndex>0) {
                    this.currentIndex--;
                    this.changeEditTpl(this.manageSearchCondition[this.currentIndex] , this.currentIndex);
                }else if(val.length<old.length && this.currentIndex===0){
                    this.currentIndex=0;
                    this.changeEditTpl(this.manageSearchCondition[this.currentIndex] , this.currentIndex);
                }
           } 
        },
        methods: {
            ...mapActions('highSearch',['getBeans']),
            changeEditTpl(data , index){

                if (!data) return;

                this.isEdit = false;

                this.currentIndex = index;
                this.currentCustomSearch = data;
                this.currentName  = data.name;
                this.currentTplId = data.uuid;


                this.formatResult(data.datas);

                
            },
            // 修改模板
            modify(conditionList , customSearch , uuid){
                let datas = searchDataHandler(customSearch.datas);
                    customSearch.datas = datas;

                let data = {
                    customSearch,
                    uuid: uuid ? uuid : this.currentTplId,
                    // ccorpId:26,
                    // cdd:100000001,
                    // cpersonId:1
                }

                this.$daydao.$ajax({
                    url : `${gMain.apiBasePath}route/${this.infoSetId}/customSearch/save.do`,
                    // url : `http://extend.daydao.com/apiOrg/route/${this.infoSetId}/customSearch/save.do`,
                    data: JSON.stringify(data),
                    success: data=>{
                        if (data.result === 'true') {
  
                            this.$emit('changeCustomSearch' , data.data);

                            this.$Message.success('修改成功');
                            this.changeEditTpl(data.data , this.currentIndex);
                            this.isEdit = false;
                        }
                    }
                })
            },
            //翻译默认值 ，显示模板
            formatResult(list){

                this.cloneData = [];
                this.cloneData = this.queryCondition.map(item=>item);

                list.forEach(item=>{

                        let labels = '';
                        if (item.value) {
                            labels = Array.isArray(item.label)?item.label.join(' '):item.label;
                        }

                        if (item.type === 1 && labels) {
                            for (let i = 0; i < this.cloneData.length; i++) {
                                if (this.cloneData[i].conditionId === item.conditionId) {
                                    if(this.cloneData[i].cellTypeId === '18' || this.cloneData[i].cellTypeId === '19'){
                                        labels = labels.split(' ').join('~');
                                    }
                                    this.cloneData[i].labelValue = labels;
                                    break;
                                }
                            }
                        }else if(item.type === 2){
                            if (item.columnBean.cellTypeId === '18' || item.columnBean.cellTypeId === '19') {
                                labels = labels.split(' ').join('~');
                            }
                            item.labelValue = labels;
                            item.title = item.columnBean.title;
                            this.cloneData.push(item);
                        }                    
                    
                })
            },
            // 删除模板
            delTpl(){
                this.$Modal.confirm({
                    title : '提示',
                    content : `确定删除${this.currentName}吗？`,
                    onOk : ()=>{
                        let uuid = this.manageSearchCondition[this.currentIndex].uuid;
                        
                        this.$daydao.$ajax({
                            url : `${gMain.apiBasePath}route/${this.infoSetId}/customSearch/del.do`,
                            // url :  `http://extend.daydao.com/apiOrg/route/${this.infoSetId}/customSearch/del.do`,
                            data: JSON.stringify({
                                uuidLists:[uuid],
                                // ccorpId:26,
                                // cdd:100000001,
                                // cpersonId:1
                            }),
                            success: data=>{
                                if (data.result === 'true') {
                                    this.$emit('delCustomSearch' , uuid);
                                    this.$Message.success('删除成功');

                                }
                            }
                        })
                    }
                })
            },
            toggleShow(){
                this.isEdit = !this.isEdit;
                this.lock = true;
            }

        }
    }

</script>