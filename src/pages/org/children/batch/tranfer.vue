<template>
    <batch :columns="columns" :data="data" :submit="submit" :reset="reset"></batch>
</template>

<script>
    import mixin from './src/mixin'
    import selectTree from './src/selectTree'
    import posTree from './src/posTree'
    import {daydaoDropSelect} from 'commonVueLib/daydaoDropSelect'

    export default {
        name: 'batchTranfer',
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
                    personId:''
                },
                //treeSelect
                beans:{
                    orgId:[],
                    posId:[],
                    jobId:[],
                    reportPersonId:[],
                    levelId:[],
                },
                rules : {
                    orgId:{
                        required:true,
                        rule:(data , index)=>{
                            if (data.orgId == this.data[index].orgId) {
                                return '调动的组织不能跟以前的相同';
                            }
                        }
                    },
                    posId:{required:true}
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
                        title: '调动日期',
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
                        key:'personTypeName',
                        width:160
                    },
                    {
                        title: '组织',
                        key : 'orgName',
                        width:360,
                        required:true,
                        type : 'inline',
                        render:(h , params)=>{
                            return  h(daydaoDropSelect , {
                                class : {'ivu-form-item-error':this.classControl[params.index].orgId},
                                props:{
                                    width:140,
                                    data:this.beans.orgId,
                                    val:this.cloneData[params.index].orgId,
                                    name:'orgId'+params.index,
                                    onSelected:(d)=>{
                                        this.cloneData[params.index].orgId = d.value;
                                        this.cloneData[params.index].orgName = d.node.fullName;
                                        if (d.value == this.data[params.index].orgId) {
                                            this.classControl[params.index].orgId = true;
                                            this.$Message.error('调动的组织不能跟以前的相同');
                                            return;
                                        }
                                        this.classControl[params.index].orgId = false;
                                    }
                                },
                            })
                        }
                    },
                    {
                        title : '职位',
                        key : 'posName',
                        width:360,
                        type : 'inline',
                        required:true,
                        render:(h , params)=>posTree.call(this , h , params ,'posId' , true)
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
                        title : '调动说明',
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
                this.sendAjax('affairTransfer/transfer.do' , this.cloneData)
            }
        }
    }

</script>