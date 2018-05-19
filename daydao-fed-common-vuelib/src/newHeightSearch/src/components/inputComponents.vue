
<template>
    <!-- 关键词 -->
    <div>
        <div  class="input-control pull-left"  v-for="(item , index) in cloneData">
            <label class="name" :key="'label'+index" v-if="item.isDefault!='1'">{{item.title}}</label>


            
            <!-- type: 普通输入框  -->
            <Input v-if="item.cellTypeId==='1' && item.isDefault!='1'" class="hs-input-text" v-model.trim="modelList[index]" :key="index"></Input>

            
            <!-- 是否选择框  -->
            <i-switch  v-else-if="item.cellTypeId==='8'" v-model="modelSwitch[index]" :key="index"></i-switch>

            
            <!-- type: 单选下拉树 -->
            <Select  
                v-else-if="item.cellTypeId==='7'" 
                label-in-value
                transfer 
                v-model="modelList[index]" 
                @on-change="getData($event , index)" 
                :key="index" 
                class="hs-input-text">
                <Option v-for="bean in beansStore[item.keyValueBean.infoSetId]" :value="bean.id" :key="bean.id">{{bean.name}}</Option>
            </Select>


            <!-- type: 多选下拉 -->
            <Select
                v-else-if="item.cellTypeId==='9'"
                label-in-value 
                multiple 
                transfer 
                v-model="modelArr[index]" 
                @on-change="getData($event , index)" 
                :key="index"
                class="hs-input-text">
                <Option v-for="bean in beansStore[item.keyValueBean.infoSetId]" :value="bean.id" :key="bean.id">{{bean.name}}</Option>
            </Select>
            
            
            <!-- type: 时间 -->
            <TimePicker class="hs-datePicker hs-input-text" :type="item.type" v-model="modelList[index]" @on-change="getDate($event , index)"
            v-else-if="item.type==='time'" :format="item.format" :key="index"></TimePicker>
            

            <!-- type: 日期范围 -->
            <DatePicker class="hs-datePicker hs-input-text" type="daterange" :value="modelArr[index]" @on-change="getDate($event , index)"
            v-else-if="item.cellTypeId==='18'" :key="index"></DatePicker>

            <!-- type: 日期 -->
            <DatePicker class="hs-datePicker hs-input-text" :type="item.type" :value="modelList[index]" @on-change="getDate($event , index)" :format="item.format"
            v-else-if="item.component==='date'" :key="index"></DatePicker>


            <!-- 数字范围 -->
            <numberRange v-else-if="item.cellTypeId==='19'" v-model="modelArr[index]" :key="index"></numberRange>


            <!-- 单选 -->
            <RadioGroup v-model="modelList[index]"  v-else-if="item.cellTypeId==='3'" :key="index">
                <Radio v-for="(bean , i) in beansStore[item.keyValueBean.infoSetId]" :key="i" :label="bean.name"></Radio>
            </RadioGroup>

            <!-- 多选 -->
            <CheckboxGroup v-model="modelArr[index]" v-else-if="item.cellTypeId==='5'" :key="index" class="hs-input-text">
                <Checkbox v-for="(bean , i) in beansStore[item.keyValueBean.infoSetId]" :key="i" :label="bean.name"></Checkbox>
            </CheckboxGroup>


            <!-- 组织树 -->
            <orgTree v-else-if="item.cellTypeId==='originTree'" :ref="`tree${index}`" :id="'originTree'+index" :data="beansStore[item.keyValueBean.infoSetId]" @getOrgTree="getOrgTree($event , index)"></orgTree>

            <!-- 数据量大的单选 -->
            <treeSelect v-else-if="item.cellTypeId==='20'" :id="`bigTree${new Date().getTime()}${index}`" v-model="modelList[index]" :data="beansStore[item.keyValueBean.infoSetId]"></treeSelect>
            

        </div>
    </div>
</template>

<script>
    import treeSelect from './inputComponent/treeSelect.vue'
    import treeMultipleSelect from './inputComponent/treeMultipleSelect.vue'
    import orgTree from './inputComponent/orgTree.vue'
    import numberRange from './inputComponent/numberRange.vue'
    import selectAndSortableTool from '../../../selectAndSortableTool'

    const mapActions = window.Vuex.mapMutations;
    const mapGetters = window.Vuex.mapGetters;

    export default {
        components: { treeSelect, treeMultipleSelect ,numberRange , selectAndSortableTool , orgTree},
        data() {

            return {

                //v-model
                modelList   : [],
                modelArr    : [],
                modelSwitch : [],
                modelOther  : [],
                beans:[],


                cloneData : [],


                addedList: [],


            }
        },
        props: {
            conditionList: {
                type: Array,
                default() {
                    return [];
                },
            }
        },
        computed:{
            ...mapGetters('highSearch',['beansStore'])
        },
        created() {
            for (let i = 0; i < 30; i++) {
                this.modelOther.push('');
                this.modelList.push('');
                this.modelArr.push([]);
                this.modelSwitch.push(false);
            }

            this.defaultDataHandler();
        },
        watch: {
            conditionList(newArr , oldArr){
                /*
                * 重新计算model
                * 存下原来的model , 再进行比较
                **/
                let modelOther = this.modelOther.map(item=>item);
                let modelList = this.modelList.map(item=>item);
                let modelArr = this.modelArr.map(item=>item);
                let modelSwitch = this.modelSwitch.map(item=>item);



                this.modelOther=[];
                this.modelList=[];
                this.modelArr=[];
                this.modelSwitch=[];



                newArr.forEach((newItem , newIndex)=>{
                    let origin = null,
                        index = null;

                    for (let i = 0; i < oldArr.length; i++) {
                        if(oldArr[i].uuid === newItem.uuid){
                            origin = oldArr[i];
                            index = i;
                            break;
                        }
                    }


                    if (origin) {
                        //如果有 ， 就用原来的
                        this.modelList.push(modelList[index]);
                        this.modelOther.push(modelOther[index]);
                        this.modelArr.push(modelArr[index]);
                        this.modelSwitch.push(modelSwitch[index]);

                    }else{
                        //如果没有 ， 用新的
                        this.modelList.push('')
                        this.modelOther.push('');
                        this.modelArr.push([]);
                        this.modelSwitch.push(false);
                    }
                })

                this.defaultDataHandler();
            }
        },
        methods: {
            ...mapActions('highSearch',['getBeans']),
            getData(data , index){
                this.modelOther[index] = data;
            },
            getDate(date , index){
                if (Array.isArray(date)) {
                    this.modelArr[index] = date;
                }else{
                    this.modelList[index] = date;
                }
            },
            getOrgTree({values , labels},index){
                // console.log(values , labels);
                this.modelList[index] = {values, labels};
            },
            // init default data
            defaultDataHandler() {
                this.cloneData = [];

                this.conditionList.forEach((item,index)=>{

                    this.getBeans(item , index);

                    switch(item.cellTypeId){
                        case '2' :
                            item.type = 'date';
                            item.component = 'date';
                            break
                        case '4' :
                            item.type = 'time'
                            break
                        case '11' :
                            item.type = 'time'
                            item.format = 'HH:mm'
                            break
                        case '13' :
                            item.type = 'datetime';
                            item.component = 'date';
                            break
                        case '14' :
                            item.type = 'month';
                            item.component = 'date';
                            break
                        case '15' :
                            item.type = 'datetime';
                            item.component = 'date';
                            item.format = 'yyyy-MM-dd HH';
                            break
                        case '16' :
                            item.type = 'year';
                            item.component = 'date';
                            break
                    }

                    
                    //checkbox and radio
                    if ((item.cellTypeId === '5' || item.cellTypeId === '3') && item.value) {
                        let bean = this.beansStore[item.keyValueBean.infoSetId];
                        const setData = ()=>{
                            if (Array.isArray(item.value)) {
                                let arr = []
                                item.value.forEach((val,i)=>{
                                    let {name} = bean.find(b=>b.id===val);
                                    arr[i]=name;
                                })
                                this.$set(this.modelArr , index , arr);
                            }else{
                                let {name} = bean.find(b=>b.id===item.value);
                                this.modelList[index] = name;
                            }
                        }
                        if (!bean) {
                            this.$store.dispatch('highSearch/getBeans', {keyValueBean:item.keyValueBean , cb:(data)=>{
                                bean = data;
                                setData();
                            }});
                        }else{
                            setData();
                        }
                    }
                    //可以直接填值的
                    let simpleType = ['1' , '7' , '9' ,'18' ,'19' , '20'];
                    if ((simpleType.includes(item.cellTypeId) || item.component==='date') && item.value) {
                        if (Array.isArray(item.value)) {
                            this.$set(this.modelArr , index , item.value);
                        }else{
                            this.$set(this.modelList , index , item.value)
                        }
                    }


                    this.cloneData.push(item);
                })
                
            },
            searchDataHandler(){
                let search = [],
                    list   = [];

                this.cloneData.forEach((item , index)=>{
                    const TYPE = item.cellTypeId;

                    let obj = {
                        title : item.title,
                        flag : index,
                        type : TYPE,
                        uuid : item.uuid,
                        conditionId : item.conditionId
                    };

                    // Filter value 
                    // input
                    if(TYPE === '1'){
                        obj.value = this.modelList[index];
                        if (this.modelList[index]) search.push(obj);
                    }
                    // switch
                    else if(TYPE === '8'){
                        obj.value = this.modelSwitch[index];
                        search.push(obj);
                    }
                    // simple select
                    else if(TYPE === '7'){
                        let bean = this.beansStore[item.keyValueBean.infoSetId];
                        if (bean && this.modelList[index]) {
                            let id = this.modelList[index];
                            bean = bean.find(select=>select.id === id);
                            obj.value = {
                                value : id,
                                label : bean.name
                            }
                            search.push(obj);
                        }
                    }
                    // multiple select
                    else if(TYPE === '9'){
                        obj.value = this.modelOther[index];
                        if (this.modelArr[index].length>0) search.push(obj);
                    }
                    //  daterange
                    else if(TYPE === '18'){
                        if (this.modelArr[index][0]) {
                            obj.value = this.modelArr[index].join('~');
                            search.push(obj)
                        };
                    }
                    //date , time
                    else if(item.component === 'date' || item.type === 'time'){
                        obj.value = this.modelList[index];
                        if (this.modelList[index] && item.type !== 'daterange') search.push(obj);
                    }
                    //  number range 
                    else if(TYPE === '19'){
                        if (this.modelArr[index][0]) {
                            obj.value = this.modelArr[index].join('~');
                            if (this.modelArr[index][0] && this.modelArr[index][1]) search.push(obj);
                        }
                        
                    }
                    // checkbox
                    else if(TYPE === '5' ){
                        obj.value = [];

                        this.modelArr[index].forEach(model=>{
                            let bean = this.beansStore[item.keyValueBean.infoSetId].find(checkbox=>checkbox.name === model);
                            obj.value.push({label:bean.name , value:bean.id})
                        })
                        if (this.modelArr[index].length>0) search.push(obj);
                    }
                    // radio
                    else if(TYPE === '3'){

                        if (this.modelList[index]){
                            let bean = this.beansStore[item.keyValueBean.infoSetId];
                            if (bean) {
                                bean = bean.find(radio=>radio.name === this.modelList[index]);

                                obj.value = {label:bean.name , value:bean.id};
                                search.push(obj);
                            }
                        };
                    }
                    // 组织树
                    else if(TYPE === 'originTree'){
                        if (this.modelList[index] && this.modelList[index].values.length>0) {
                            obj.values = this.modelList[index].values;
                            obj.labels = this.modelList[index].labels;
                            search.push(obj);
                        }
                    }
                    //大数据单选
                    else if(TYPE === '20'){
                        if(this.modelList[index] && this.modelList[index].value){
                            obj.value = this.modelList[index];
                            search.push(obj);
                        }
                    }



                    if (item.conditionId) {
                        obj.conditionId = item.conditionId;
                    }else{
                        obj.uuid = item.uuid;
                    }

                    list.push(obj);
                    
                })

                return {search , list};
            },
            getBeans(item){
                let flagArr = ['9' , '7' ,'3' , '5' , 'originTree' , '20'];
                if (flagArr.includes(item.cellTypeId)) {
                    this.$store.dispatch('highSearch/getBeans', {keyValueBean:item.keyValueBean});
                }
            },
            keywordChange() {
                this.$emit("keywordBind", this.modelList[0]);
            },
            // remove condition and reRender
            removeCondition(condition) {
                
                if (condition.type === 'originTree') {
                    this.$refs[`tree${condition.flag}`][0].removeCheck(condition);
                }else if (condition.hasOwnProperty('childIndex')) {

                    let modelArr = this.modelArr[condition.flag];
                        modelArr.splice(condition.childIndex,1);
                        
                    let modelOther = this.modelOther[condition.flag];
                    Array.isArray(modelOther) && modelOther.splice(condition.childIndex,1);

                    this.$set(this.modelArr , condition.flag , modelArr);
                    this.$set(this.modelOther , condition.flag , modelOther);

                }else{
                    this.$set(this.modelList , condition.flag , '');
                    this.$set(this.modelOther , condition.flag , '');
                    this.$set(this.modelSwitch , condition.flag , false);
                    this.$set(this.modelArr , condition.flag , []);
                }
    
            },
            reset() {
                this.cloneData.forEach((item, index) => {
                    this.$set(this.modelOther , index , '');
                    this.$set(this.modelList , index , '');
                    this.$set(this.modelArr , index , []);
                    this.$set(this.modelSwitch , index , false);
                })
            }
        }
    }

</script>