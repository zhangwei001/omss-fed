<template>
    <daydaoDropSelect :name="id" :data="oData" :val="defaultVal" width="212" :onSelected="onSelected" ref="select"></daydaoDropSelect>
</template>

<script>
    import { daydaoDropSelect } from '../../daydaoDropSelect/index'

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
                default: ""
            }
        },
        watch:{
            value(val , old){
              if (val==="") {
                this.$refs.select.setValue('');
              }
            }
        },
        components: { daydaoDropSelect },
        mounted() {
            this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/getKeyValueData.do",
                data: JSON.stringify(this.keyValueBean),
                success: data => {
                    if(data.beans && data.beans.length){
                        this.oData = data.beans;
                        if (this.value) {
                            this.defaultVal = this.value.conditionValue;
                        }

                    }
                }
            });
        },
        methods: {
            onSelected(data) {
                let dataVal = {
                  'label' : data.node.name,
                  'conditionValue' : data.value
                }
                this.$emit('input' , dataVal)
            }
        }
    }

</script>
