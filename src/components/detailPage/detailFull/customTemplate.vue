<style lang="scss">

</style>


<template>
    <!-- 自定义模版 -->
    <!--<section class="detaile-full-main-l-item">
        <h4>
            <em>◆</em>
            <span>{{sectionItem.title}}</span>
        </h4>

    </section>-->
    <mycomponent :is="sectionItem.templateId"></mycomponent>

</template>

<script>
    import {daydaoDropSelect,daydaoDropSelectMul} from 'commonVueLib/daydaoDropSelect/index'
    import report_form from 'pages/org/customTemplate/report_form.vue'
    import pos_evaluate from 'pages/org/customTemplate/pos_evaluate.vue'
    import person_self from 'pages/org/customTemplate/person_self.vue'
    import org_list_base from 'pages/org/customTemplate/org_baseInfos.vue' 


    export default{
        name:"addList",
        props:{
            customTemplateData: {
                type: Object,
                default(){
                    return {};
                }
            }
        },
        components: {
            daydaoDropSelect,
            report_form,    // 报表
            pos_evaluate,   // 职位评估
            person_self,    // 完善员工信息--基本信息
            org_list_base,  // 组织详情基本信息
        },
        data () {
            return {
                sectionItem: {},
            }
        },
        created(){
            var _this=this;
            this.sectionItem = JSON.parse(JSON.stringify(this.customTemplateData));
            var templateId=this.sectionItem.templateId;
            if(templateId=='org_report_form' || templateId=='job_report_form' || templateId =='pos_report_form'){
                // 报表的组件
                _this.sectionItem.templateId='report_form';
            }
        },
        methods:{

        },
        watch:{
            'customTemplateData': {
                handler (newValue, oldValue) {
                    this.sectionItem = JSON.parse(JSON.stringify(newValue))
                },
                deep: true
            }
        },
    }
</script>
