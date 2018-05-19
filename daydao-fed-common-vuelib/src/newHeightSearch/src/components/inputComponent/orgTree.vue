<template>
    <div class="hs-org-tree">
        <daydaoDropSelectMul :name="id" width="280" :onSelected="onSelected" :val="defaultVal" :data="data" ref="select"></daydaoDropSelectMul>
        <div class="org-badages">
            <span v-for="(item , index) in badageList" class="org-badage" @click.stop="removeCheck(item , index)">
                <i class="iconfont_daydao_common">&#xe685;</i>
                 {{item.name}}  
                 <i class="iconfont_daydao_common">&#xe6a6;</i>
             </span>
        </div>
    </div>
</template>

<script>
    import {daydaoDropSelectMul} from '../../../../daydaoDropSelect/index'

    export default {
        components:{daydaoDropSelectMul},
        data() {
            return {
                model : '',
                defaultVal :[],
                badageList :[]
            }
        },
        props:{
            value : '',
            id: {
                type : String,
                default :'hs-org-tree'
            },
            valeu :{
                type : [String , Object],
                default : ''
            },
            data:{
                type : Array,
                default(){
                    return [];
                }
            },
        },
        watch:{

        },
        methods:{
            onSelected(data){
                this.badageList = [];
                let nodes = data.nodes;

                if (nodes && nodes.length>0) {
                    for (let i = 0; i < nodes.length; i++) {
                        if (nodes[i].check_Child_State === 2) {
                            this.badageList.push(nodes[i]);
                            let n = nodes[i].children.length;
                            //递归计算children数量
                            const calcChildren = (children)=>{
                                children.forEach(item=>{
                                    if (Array.isArray(item.children) && item.children.length>0) {
                                        n+= item.children.length;
                                        calcChildren(item.children)
                                    }
                                })
                            }

                            calcChildren(nodes[i].children);

                            i += n;
                        }else if(nodes[i].check_Child_State === -1){
                            this.badageList.push(nodes[i]);
                        }
                    }
                }

                this.$emit('getOrgTree' , {values:data.ids , labels:this.badageList});
            },
            removeCheck(node , index){
                this.badageList.splice(index ,1);
                this.$refs.select.ztreeResultObj.checkNode(node , false , true , true);
            }
      }

    }
</script>

<style lang="scss">
    .newHighSearch {
        .hs-org-tree{
            font-size: 12px;
            display: inline-block;
            position: relative;

            .org-badage{
                padding : 4px 10px;
                height : 24px;
                display:inline-block;
                font-size : 12px;
                color: #657180;
                background : #E3E8EE;
                border-radius:2px;
                cursor: pointer;
                margin-right:6px;
                margin-top:6px;

                i{
                    font-size :12px;
                }
            }
        }
    }

</style>