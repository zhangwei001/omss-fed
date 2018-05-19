<style lang="less">
    h3{
        font-size: 30px;
        line-height: 60px;
        padding-top:10px;
        border-top:3px  solid #ccc;
    }
    dl{
        padding:20px 0;
        margin:20px 0;
        border-top:1px dashed #ccc;
    }

    input[type='button']{
        padding:5px 3px;
    }
</style>
<template>
    <div>
        <h3>
            单选下拉选择框
        </h3>
        <div>
            <daydao-drop-select :data="oData" name="demoDrop" :val="defaultVal" ref="daydaoDropSelect" :isEdit="true" :width="280"></daydao-drop-select>
        </div>
        <dl>
            <input type="text" v-model="newVal">
            <input type="button" value="设置新的val" @click="setNewVal">
        </dl>
        <dl>
            <input type="button" value="设置新的name" @click="setNewName">
        </dl>

        <h3>
            多选下拉选择框
        </h3>
        <div>
            <daydao-drop-select-mul name="demoDrop" :data="oData" :width="280" :val="aMulVal" ref="dropMulSelect"></daydao-drop-select-mul>
        </div>

    </div>
</template>
<script>
    import {daydaoDropSelect,daydaoDropSelectMul} from 'src/daydaoDropSelect/index'

    export default {
        components:{
             daydaoDropSelect
            ,daydaoDropSelectMul
         }
        ,data () {
            return {
                oData:[
                    {id:"1",name:"湖北省",children:[
                        {id:"1-1",name:"武汉市"},
                        {id:"1-2",name:"黄冈市"},
                        {id:"1-3",name:"黄石市"},
                        {id:"1-4",name:"荆州市"},
                        {id:"1-5",name:"宜昌市"}
                    ]},
                    {id:"2",name:"广东省",children:[
                        {id:"2-1",name:"广州市"},
                        {id:"2-2",name:"深圳市"},
                        {id:"2-3",name:"东莞市"},
                        {id:"2-4",name:"惠州市"},
                        {id:"2-5",name:"中山市"}
                    ]}
                ]
                ,defaultVal: '1-1'
                ,newVal:""
                ,aMulVal:[]
            }
        }
        ,mounted(){
            var t = this;
            setTimeout(function () {
                t.$refs.dropMulSelect.setValue(['1-1','1-2']);
            },2000)
        }
        ,methods:{
            setNewVal(){
                this.defaultVal = this.newVal;
            },
            setNewName(){
                this.$refs.daydaoDropSelect.setValue("1-5");
            }
        }
    }
</script>
