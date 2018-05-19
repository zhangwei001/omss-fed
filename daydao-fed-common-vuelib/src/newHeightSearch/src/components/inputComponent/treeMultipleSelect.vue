<template>
  <daydao-drop-select-mul :name="id" :data="data" width="280" :val="defaultVal" :onSelected="onSelected" ref="select"></daydao-drop-select-mul>
</template>

<script>

import {daydaoDropSelectMul} from '../../../../daydaoDropSelect/index'

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
    value:{
      type : [String , Object],
      default:""
    },
    data:{
      type : Array,
      default(){
        return [];
      }
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