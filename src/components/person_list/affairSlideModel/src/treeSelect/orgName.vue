<template>
    <daydao-drop-select :data="oData" :name="id" :val="value" :onSelected="onSelected" width="210"></daydao-drop-select>
</template>

<script>
    import { daydaoDropSelect } from 'commonVueLib/daydaoDropSelect'



    export default {
        name: 'orgName',
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
                url : gMain.apiBasePath + "org/getOrgPermissionTree",
                data : JSON.stringify({permissionFilter:true}),
                success : data=>{
                    if (data.result === 'true') {
                        this.oData = data.data;
                    }
                }
            })
        },
        methods: {
            onSelected(data) {
                this.$emit('input', data.value);
                this.$emit('getName' , data.node.fullName);
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