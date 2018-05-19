<template>
    <daydao-drop-select :data="oData" ref="select" :name="id" :val="value" :onSelected="onSelected" width="210"></daydao-drop-select>
</template>

<script>
    import { daydaoDropSelect } from 'commonVueLib/daydaoDropSelect'



    export default {
        name: 'reportSelect',
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
            this.$daydao.$ajax({
                url: gMain.apiBasePath + "org/getReporteByCorp.do",
                success: data => {
                    if (data.result === 'true') {
                        this.oData = data.beans;
                    }
                }
            })
        },
        methods: {
            onSelected(data) {
                this.$emit('input', data.value);
            }
        }
    }

</script>