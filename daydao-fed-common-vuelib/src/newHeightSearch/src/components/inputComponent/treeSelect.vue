<template>
    <daydaoDropSelect :name="id" :data="data" :val="defaultVal" width="280" :onSelected="onSelected" ref="select"></daydaoDropSelect>
</template>

<script>
    import { daydaoDropSelect } from '../../../../daydaoDropSelect/index'

    export default {
        data() {
            return {
                oData:[],
                defaultVal:'',
            }
        },
        props: {
            id: {
                type: String,
                default: ""
            },
            keyValueBean: {
                type: Object,
                default() {
                    return null
                }
            },
            value: {
                type: [String, Object],
                default: ''
            },
            data:{
                type:Array,
                default(){
                    return [];
                }
            }
        },
        watch:{
            //handle default data
            value(val){
                if (this.value === '') {
                    this.$refs.select.setValue('');
                }else if(typeof this.value === 'string'){
                    this.defaultVal = this.value;
                }
            }
        },
        components: { daydaoDropSelect },
        mounted(){
            if (this.value) {
                this.defaultVal = this.value;
            }
        },
        methods: {
            onSelected(data) {
                if (data) {
                    let dataVal = {
                      'label' : data.node.name,
                      'value' : data.value
                    }
                    this.$emit('input' , dataVal)
                }
                
            }
        }
    }

</script>
