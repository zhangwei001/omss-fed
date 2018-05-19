<template>
    <batch :columns="columns" :data="data" :submit="submit" :reset="reset"></batch>
</template>

<script>
    import mixin from './src/mixin'

    export default {
        name: 'batchRegin',
        data() {
            
            return {
                //model data
                model:{
                    effectiveDate:'',
                    remark:'',
                },

                columns: [
                    {
                        title: '序号',
                        type:'index',
                        width:70,
                        fixed:"left"
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width:70,
                        fixed:"left",
                        render: (h, params) => {
                            return h('span', {
                                attrs:{
                                    class:'btn-cancle'
                                },
                                on:{
                                    click: () => {
                                        this.remove(params.index)
                                    },
                                }
                            } , '取消');
                        }
                    },
                    {
                        title: '姓名',
                        key: 'personName',
                        fixed:"left",
                        width:120,
                    },
                    {
                        title: '离职日期',
                        key : 'date',
                        width : 200,
                        render: (h, params) => {
                            return h('DatePicker', {
                                class: 'input-w',
                                props:{
                                    value : this.cloneData[params.index].effectiveDate
                                },
                                on:{
                                    'on-change':(val)=>{
                                        this.cloneData[params.index].effectiveDate = val;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title:'工号',
                        key:'empCode',
                        width:160
                    },
                    {
                        title:'员工类型',
                        key:'personType',
                        width:160
                    },
                    {
                        title: '组织',
                        key : 'orgName',
                        width:160
                    },
                    {
                        title : '职位',
                        key : 'posName',
                        width:160
                    },
                    {
                        title : '兼任职位',
                        key : 'partPosName',
                        width:160
                    },
                    {
                        title : '职务',
                        key : 'jobName',
                        width:160
                    },
                    {
                        title : '兼任职务',
                        key : 'partJobName',
                        width:160
                    },
                    {
                        title : '汇报对象',
                        key : 'reportName',
                        width:160
                    },
                    {
                        title : '职级',
                        key : 'levelName',
                        width:160
                    },
                    {
                        title : '离职说明',
                        key : 'remark',
                        width:360,
                        render:(h , params)=>{
                            return h('Input',
                                {
                                    props:{
                                        value : this.cloneData[params.index].remark,
                                    },
                                    on:{
                                        input:(val)=>{
                                            this.cloneData[params.index].remark = val;
                                        }
                                    }
                                }
                            )
                        }
                    },
                ]
            }
        },
        mixins:[mixin],
        methods: {
            send(){
                this.sendAjax('affairResign/resign.do' , this.cloneData)
            }
        }
    }

</script>