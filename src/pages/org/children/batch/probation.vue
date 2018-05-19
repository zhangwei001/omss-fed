<template>
    <batch :columns="columns" :data="data" :submit="submit" :reset="reset"></batch>
</template>

<script>
    import mixin from './src/mixin'
    import selectTree from './src/selectTree'
    import posTree from './src/posTree'


    export default {
        name: 'batchProbation',
        data() {
            return {
                //model data
                model:{
                    effectiveDate:'',
                    orgId : '',
                    orgName : '',
                    posId:'',
                    jobId:'',
                    reportPersonId:'',
                    levelId:'',
                    remark:'',
                    personId : ''
                },
                //treeSelect
                beans:{
                    orgId:[],
                    posId:[],
                    jobId:[],
                    reportPersonId:[],
                    levelId:[],
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
                        width:100,
                    },
                    {
                        title: '转正日期',
                        key : 'joinDate',
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
                        title:'员工类型',
                        key:'personTypeName',
                        width:360,
                        type : 'inline',
                        render(h , params){
                            return h('div' , {class : 'older-data'} , '全职')
                        }
                    },
                    {
                        title: '组织',
                        key : 'orgName',
                        width:360,
                        type : 'inline',
                        render:(h , params)=>selectTree.call(this , h , params ,'orgId' , true)
                    },
                    {
                        title : '职位',
                        key : 'posName',
                        width:360,
                        type : 'inline',
                        render:(h , params)=>posTree.call(this , h , params ,'posId')
                    },
                    {
                        title : '职务',
                        key : 'jobName',
                        width:360,
                        type : 'inline',
                        render:(h , params)=>selectTree.call(this , h , params ,'jobId')
                    },
                    {
                        title : '汇报对象',
                        key : 'reportPersonName',
                        width:360,
                        type : 'inline',
                        render:(h , params)=>selectTree.call(this , h , params ,'reportPersonId')
                    },
                    {
                        title : '职级',
                        key : 'levelName',
                        width:360,
                        type : 'inline',
                        render:(h , params)=>selectTree.call(this , h , params ,'levelId')
                    },
                    {
                        title : '转正说明',
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
                this.sendAjax('affairProbation/probation.do' , this.cloneData)
            }
        }
    }

</script>