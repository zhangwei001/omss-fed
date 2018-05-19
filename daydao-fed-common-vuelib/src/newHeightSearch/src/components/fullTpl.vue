<template>

    <div class="hs-emptyTpl">
        <h3>模板库已满</h3>
        <p>是否用<b>{{currentTemplateName}}</b>替换下列模板</p>


        <section>
            <RadioGroup v-model="template">
                <Radio v-for="item in customSearch" v-if="item.type===2" :label="item.name" @click.native="getUuid(item)" :key="item.uuid"></Radio>
            </RadioGroup>
        </section>
    </div>


</template>

<script>

    export default {
        data() {
            return {
                template:'',
                uuid:''
            }
        },
        props:{
            customSearch:{
                type:Array,
                default(){
                    return [];
                }
            },
            currentTemplateName:{
                type : String,
                default : ''
            }
        },
        methods:{
            getUuid(data){
                this.uuid = data.uuid;
            }
        }
    }

</script>

<style lang="scss">
    $preCls : '.hs-emptyTpl';

    #{$preCls} {

        padding: 0 66px;

        h3{
            font-size:16px;
        }

        p{
            line-height:30px;
            margin-bottom:10px;

            b{
                font-weight:600;
            }
        }

        section .ivu-radio-wrapper{
            display : block;
            font-size:14px;
            margin-bottom:18px;
        }
    }
    
</style>
