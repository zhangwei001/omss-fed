<template>
    <div style="margin:0 50px;">
        <!--<h1>
            测试页面111   <a href="javascript:void(0)" @click="resetPersonSelect">重置</a>
        </h1>
        <div style="margin:50px auto 0;max-width:1200px;">
            <person-select ref="personSelect"></person-select>
        </div>
        <div style="margin-top:50px;">
            <input type="button" value="上传" @click="uploadimg">
        </div>
        -->

        <div style="margin-top:50px;">
            <daydao-drop-select-mul :data="oData" name="testdrop"></daydao-drop-select-mul>
        </div>

        <div style="margin-top:50px;">
            <daydao-drop-select :data="oData" name="testdrop" :onSelected="onSelected"></daydao-drop-select>
        </div>


        <!--<el-table
            :data="tableData"
            :height="500"
            @sort-change="sortChange"
            style="width: 100%">
            &lt;!&ndash;<el-table-column
                type="selection"
                width="55">
            </el-table-column>&ndash;&gt;
            <el-table-column
                fixed
                type="index"
                label="序号"
                align="center"
                width="66">
            </el-table-column>

            <el-table-column
                fixed
                label="操作"
                width="100" v-if="!isShowOper">
                <template scope="scope">
                    <el-button type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                    <solt>
                        aaaa
                    </solt>
                </template>
            </el-table-column>

            <el-table-column
                v-for="item in tableColumns"
                :fixed="item.fixed"
                :prop="item.key"
                :label="item.title"
                :formatter="item.formatter"
                :sortable="item.sortable"
                :min-width="item.minWidth" :key="item.key">

                &lt;!&ndash;特殊渲染模式&ndash;&gt;
                &lt;!&ndash;<template scope="scope">
                    <div>{{scope.row[scope.column.property]}}</div>
                </template>&ndash;&gt;

            </el-table-column>

        </el-table>-->


    </div>

</template>
<script>
    import personSelect from 'commonVueLib/personSelect/index';
    import {daydaoDropSelectMul,daydaoDropSelect} from 'commonVueLib/daydaoDropSelect/index.js'

    //引入表格组件
    import { ElTable,ElTableColumn } from 'commonVueLib/element-table/index.js'

    export default {
        components:{
            personSelect,
            daydaoDropSelectMul,
            daydaoDropSelect,
            ElTable,
            ElTableColumn
        }
        ,data(){
            return {
                oData:[
                    {id:"1",name:"湖北省",children:[
                        {id:"1-1",name:"武汉市"},
                        {id:"1-2",name:"黄冈市"},
                        {id:"1-3",name:"黄石市"},
                        {id:"1-4",name:"荆州市"},
                        {id:"1-5",name:"宜昌市"}
                    ]},
                    {id:"2",name:"广东省",children:[
                        {id:"2-1",name:"广州市"},
                        {id:"2-2",name:"深圳市"},
                        {id:"2-3",name:"东莞市"},
                        {id:"2-4",name:"惠州市"},
                        {id:"2-5",name:"中山市"}
                    ]}
                ],
                isShowOper:false,
                tableColumns:[
                    {
                        title: '日期',
                        key: 'date',
                        fixed:'left',
                        minWidth:150
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        minWidth:120,
                        sortable:'custom'
                    },
                    {
                        title: '省份',
                        key: 'province',
                        minWidth:120
                    },
                    {
                        title: '市区',
                        key: 'city',
                        minWidth:120
                    },
                    {
                        title: '地址',
                        key: 'address',
                        minWidth:280
                    },
                    {
                        title: '邮编',
                        key: 'zip',
                        minWidth:120
                    }
                ],
                tableData: [{
                    date: '2016-05-03',
                    name: '王小虎-1',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-02',
                    name: '王小虎0',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-04',
                    name: '王小虎1',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎2',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎3',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }]


            };
        }
        ,mounted(){
            var t = this;

        }
        ,methods:{
            uploadimg(){
                seajs.use(['commonStaticDirectory/plugins/imgCropper/imgCropper.css','commonStaticDirectory/plugins/imgCropper/imgAutoCropper.js'],function (css,ImgAutoCropper) {
                    new ImgAutoCropper({
                        url:"https://www.daydao.com/apiAdmin/madmin/file/upload.do"
                        ,fileFormName:"file"
                        ,outPicSize:{
                            width:500
                            ,height:400
                        }
                        ,callback:function(data){
                            if(data){
                                console.log(data);
                            }
                        }
                    });
                });
            }
            ,resetPersonSelect(){
                var t = this;
                t.$refs.personSelect.reset();
            }
            ,handleClick(row) {
                console.log(row);
            }
            ,onSelected(data){
                console.log('回调了',data);
            }
            ,sortChange(obj){
                console.log(obj);
            }
        }
    }
</script>
