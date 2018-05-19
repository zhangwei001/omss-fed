<style lang="scss">
    .div1{
        width:500px;
        height:500px;
        overflow: auto;
        border: 1px solid red;

        .div2{
            width:100%;
            height:30px;
            line-height: 30px;
            border: 1px solid #ccc;
            margin:10px 0;
        }
    }
</style>
<template>
    <div>
        <h1>
            拖拽排序组件
        </h1>
        <div class="div1">
            <draggable v-model='myList' :options="{animation: 150}">
                <div class="div2" v-for="item in myList">{{item.name}}</div>
            </draggable>
        </div>
    </div>
</template>
<script>
    import draggable from 'src/vuedraggable/vuedraggable.js'
    export default {
        components: {
            draggable
        }
        ,data(){
            return {
                myList:[
                    {id:1,name:'aaaa'},
                    {id:2,name:'bbbb'}
                ]
            }
        },
        created(){
            for(var i =0;i<20;i++){
                this.myList.push({id:i+2,name:'aaaa'+ (i +2)});
            }
        }
    }
</script>