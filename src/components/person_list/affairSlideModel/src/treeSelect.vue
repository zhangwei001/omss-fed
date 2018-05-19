<template>
    <daydao-drop-select :data="oData" :name="id" :val="value" :onSelected="onSelected" :width="width"></daydao-drop-select>
</template>

<script>
    import { daydaoDropSelect } from 'commonVueLib/daydaoDropSelect'


    export default {
        name: 'treeSelect',
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
            keyValueBean: {
                type: Object,
                default() {
                    return null
                }
            },
            value: {
                type: [String, Object],
                default: ""
            },
            width: {
                type: [Number, String],
                default: 210
            },
        },
        components: { daydaoDropSelect },
        mounted() {

            this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/getKeyValueData.do",
                data: JSON.stringify(this.keyValueBean),
                success: data => {
                    if (data.beans && data.beans.length) {
                        this.oData = data.beans;
                    }
                }
            });
        },
        methods: {
            onSelected(data) {
                this.$emit('input', data.value);
                this.dispatch('FormItem', 'on-form-change', data.value);
            },
            dispatch(componentName, eventName, params) {
                let parent = this.$parent || this.$root;
                let name = parent.$options.name;

                while (parent && (!name || name !== componentName)) {
                    parent = parent.$parent;

                    if (parent) {
                        name = parent.$options.name;
                    }
                }
                if (parent) {
                    parent.$emit.apply(parent, [eventName].concat(params));
                }
            },
        }
    }

</script>