<template>
  <daydao-drop-select-mul :name="id" :data="oData" width="212" :val="defaultVal" :onSelected="onSelected" placeholder="全部" ref="select"></daydao-drop-select-mul>
</template>

<script>

import {daydaoDropSelectMul} from 'commonVueLib/daydaoDropSelect/index'

export default {
  name:'treeMultipleSelect',
  data() {
      return {
        oData:[],
        defaultVal:[],
      }
  },
  props:{
    id :{
      type : String,
      default : ""
    },
    keyValueBean : {
      type : Object,
      default(){
        return null
      }
    },
    value:{
      type : [String , Object],
      default:""
    }
  },
  watch:{
    value(val , old){
      if (val==="") {
        this.$refs.select.setValue('');
      }
    }
  },
  components:{daydaoDropSelectMul},
  mounted(){
    this.$daydao.$ajax({
        url:gMain.apiBasePath +"route/getKeyValueData.do",
        data:JSON.stringify(this.keyValueBean),
        success:data=>{
            if(data.beans && data.beans.length){
              if (this.value.ids && this.value.ids.length>0) {
                this.defaultVal = this.value.ids.map(item=>item.replace(/\'/g,""));
              }
              this.oData = data.beans;
            }
        }
    });

  },
  methods:{
    onSelected(data){
      if (data && data.nodes.length>0) {
        let arr = data.nodes;
        this.dataVal = {
          'ids'  : [],
          'label':[]
        };

        arr.forEach(item=>{
          this.dataVal.ids.push("'"+item.id+"'");
          this.dataVal.label.push(item.name);
        })

      }else{
        this.dataVal = "";
      }
      this.$emit('input' , this.dataVal);
    }
  }
}
</script>