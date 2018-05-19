<template>
    <daydao-drop-select :data="oData" ref="select" :name="id" :val="value" :onSelected="onSelected" width="210"></daydao-drop-select>
</template>

<script>
    import { daydaoDropSelect } from 'commonVueLib/daydaoDropSelect'

    export default {
        name: 'partPosName',
        data() {
            return {
                oData: []
            }
        },
        props: {
            id: {
                type: String,
                default: ""
            },
            value: {
                type: [String, Number],
                default: ""
            },
        },
        components: { daydaoDropSelect },
        created() {
            this.getList();
        },
        methods: {
            onSelected(data) {
                this.$emit('input', data.value);
            },
            getList(){
                this.$daydao.$ajax({
                    url : gMain.apiBasePath + "pos/queryPosList.do",
                    data : JSON.stringify({changeStyle:true,orgId:null}),
                    success : data=>{
                        if (data.result === 'true') {
                            this.oData = data.data;
                        }
                    }
                })
            }
        }
    }

</script>