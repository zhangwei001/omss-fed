<template>
<div>
     <batch :columns="columns" :data="data" :submit="submit" :reset="reset"></batch>
</div>

</template>

<script>
    import mixin from './src/mixin'
    import selectTree from './src/selectTree'
    import posTree from './src/posTree'

    const sex = {
        template: `<Radio-group v-model="sex">
                        <Radio label="男"></Radio>
                        <Radio label="女"></Radio>
                    </Radio-group>`,
        data() {
            return {
                sex:''
            }
        },
        watch:{
            sex:function(val){
                this.$emit('input' , val);
            }
        }
    }



    export default {
        name: 'batchRehire',
        data() {

            return {
                //model data
                model:{
                    personName:'',
                    cellPhone:'',
                    // isPhoneShow : 1,
                    joinDate:'',
                    orgId : '',
                    orgName:'',
                    personStatusId:'',
                    personTypeId:'',
                    inMonth:'',
                    posId:'',
                    emailAddress:'',
                    reportPersonId:'',
                    sex:'',
                    personId:'',
                    empCode:''
                },
                //treeSelect
                beans:{
                    orgId:[],
                    posId:[],
                    personTypeId:[],
                    personStatusId:[],
                    reportPersonId:[],
                },
                rules : {
                    personName:{required:true,msg:''},
                    cellPhone:{
                        required:true,
                        rule:{
                            reg : /^1(3|4|5|7|8|9)\d{9}$/,
                            msg : '手机号码有误~'
                        }
                    },
                    joinDate:{required:true,msg:''},
                    personStatusId:{required:true,msg:''},
                    personTypeId:{required:true,msg:''},
                    orgId:{required:true,msg:''},
                    empCode:{
                        rule:{
                            reg : /^[A-Za-z0-9]*$/,
                            msg : '工号只能输入数字或者字母~'
                        }
                    }
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
                        width:160,
                        required:true,
                        render:(h , params)=>{
                            return h('Input',
                                {
                                    props:{
                                        value : this.cloneData[params.index].personName,
                                    },
                                    class:{'ivu-form-item-error':this.classControl[params.index].personName},
                                    on:{
                                        input:(val)=>{
                                            this.cloneData[params.index].personName = val;
                                            this.classControl[params.index].personName = false;
                                        }
                                    }
                                }
                            )
                        }
                    },
                    {
                        title: '手机号',
                        key: 'cellPhone',
                        width:160,
                        required:true,
                        render:(h , params)=>{
                            return h('Input',
                                {
                                    props:{
                                        value : this.cloneData[params.index].cellPhone,
                                    },
                                    class:{'ivu-form-item-error':this.classControl[params.index].cellPhone},
                                    on:{
                                        input:(val)=>{
                                            this.cloneData[params.index].cellPhone = val;
                                            this.classControl[params.index].cellPhone = false;
                                        }
                                    }
                                }
                            )
                        }
                    },
                    // {
                    //     title: '通讯录可见',
                    //     key: 'isPhoneShow',
                    //     width:120,
                    //     align:'center',
                    //     render:(h , params)=>{
                    //         return h('Checkbox',
                    //             {
                    //                 props:{
                    //                     value:this.cloneData[params.index].isPhoneShow===1
                    //                 },
                    //                 on:{
                    //                     input:(val)=>{
                    //                         this.cloneData[params.index].isPhoneShow = val?1:2;
                    //                     }
                    //                 }
                    //             }
                    //         )
                    //     }
                    // },
                    {
                        title: '入职日期',
                        key : 'joinDate',
                        width : 160,
                        required:true,
                        render: (h, params)=>{
                            return h('DatePicker',
                                {
                                    props:{
                                        value : this.cloneData[params.index].joinDate
                                    },
                                    class: [{'ivu-form-item-error':this.classControl[params.index].joinDate}],
                                    on:{
                                        'on-change':(val)=>{
                                            this.cloneData[params.index].joinDate = val;
                                            this.classControl[params.index].joinDate = false;
                                        }
                                }
                            });
                        }
                    },
                    {
                        title: '组织',
                        key : 'orgId',
                        width:160,
                        required:true,
                        render:(h , params)=>selectTree.call(this , h , params ,'orgId' , true)
                    },
                    {
                        title:'员工状态',
                        key : 'personStatusName',
                        width:160,
                        required:true,
                        render:(h , params)=>selectTree.call(this , h , params ,'personStatusId' ,true)
                    },
                    {
                        title:'员工类型',
                        key:'personTypeName',
                        width:160,
                        required:true,
                        render:(h , params)=>selectTree.call(this , h , params ,'personTypeId' ,true)
                    },
                    {
                        title: '试用期(月)',
                        key: 'inMonth',
                        width:160,
                        render:(h , params)=>{
                            return h('Input',
                                {
                                    props:{
                                        value : this.cloneData[params.index].inMonth,
                                    },
                                    class:{'ivu-form-item-error':this.classControl[params.index].inMonth},
                                    on:{
                                        input:(val)=>{
                                            this.cloneData[params.index].inMonth = val;
                                            this.classControl[params.index].inMonth = false;
                                        }
                                    }
                                }
                            )
                        }
                    },
                    {
                        title : '职位',
                        key : 'posId',
                        width:160,
                        render:(h , params)=>posTree.call(this , h , params ,'posId')
                    },
                    {
                        title : '汇报对象',
                        key : 'reportPersonName',
                        width:160,
                        render:(h , params)=>selectTree.call(this , h , params ,'reportPersonId')
                    },
                    {
                        title: '邮箱',
                        key: 'emailAddress',
                        width:160,
                        render:(h , params)=>{
                            return h('Input',
                                {
                                    props:{
                                        value : this.cloneData[params.index].emailAddress,
                                    },
                                    on:{
                                        input:(val)=>{
                                            this.cloneData[params.index].emailAddress = val;
                                        }
                                    }
                                }
                            )
                        }
                    },
                    {
                        title: '工号',
                        key: 'empCode',
                        width:160,
                        render:(h , params)=>{
                            return h('Input',
                                {
                                    props:{
                                        value : this.cloneData[params.index].empCode
                                    },
                                    class:{'ivu-form-item-error':this.classControl[params.index].empCode},
                                    on:{
                                        input:(val)=>{
                                            this.cloneData[params.index].empCode = val;
                                        }
                                    }
                                }
                            )
                        }
                    },
                    {
                        title : '性别',
                        key : 'sex',
                        width:160,
                        render:(h,params)=>{
                            return h(sex,
                                {
                                    on:{
                                        input:(val)=>{
                                            this.cloneData[params.index].sex = val==='男'?1:2;
                                        }
                                    }
                                }
                            )
                        }
                    }
                ]
            }
        },
        mixins:[mixin],
        created(){
            this.data.forEach((item , index)=>{
                this.cloneData[index].empCode = item.empCode;
                this.cloneData[index].personName = item.personName;
                this.cloneData[index].cellPhone = item.cellPhone;
            })
        },
        methods: {
            send(){
                this.sendAjax('affairReHire/rehire.do' , this.cloneData)
            }
        }
    }

</script>
