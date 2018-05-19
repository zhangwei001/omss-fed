<template>
    <div>
        <el-table
                :data="tableData"
                :height="500"
                @row-click="rowClick"
                border
                :span-method="arraySpanMethod"
                style="width: 100%">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    :fixed="'left'"
                    width="66">
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="100" v-if="!isShowOper"
                    :fixed="'left'"
            >
                <template scope="scope">
                    <a >查看</a>
                    <a >编辑</a>
                </template>
            </el-table-column>

            <el-table-column
                    v-for="item in tableColumns"
                    :prop="item.key"
                    :label="item.title"
                    :formatter="item.formatter"
                    :sortable="item.sortable"
                    :fixed="item.fixed"
                    :help-tip-text="item.helpTipText"
                    :min-width="item.minWidth" :key="item.key">

                <!--特殊渲染模式-->
                <!--<template scope="scope">
                    <div>{{scope.row[scope.column.property]}}</div>
                </template>-->

            </el-table-column>

        </el-table>

        <br>
        <h1>带有合计行的</h1>
        <br>
        <el-table
                :data="tableData"
                :height="500"
                border
                show-summary
                @selection-change="selectionChange"
                style="width: 100%">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    :fixed="'left'"
                    width="66">
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="100" v-if="!isShowOper"
                    :fixed="'left'"
            >
                <template scope="scope">
                    <a >查看</a>
                    <a >编辑</a>
                </template>
            </el-table-column>

            <el-table-column
                    v-for="item in tableColumns"
                    :prop="item.key"
                    :label="item.title"
                    :formatter="item.formatter"
                    :sortable="item.sortable"
                    :fixed="item.fixed"
                    :min-width="item.minWidth" :key="item.key">
            </el-table-column>

        </el-table>

    </div>
</template>
<script>

    //引入表格组件
    import { ElTable,ElTableColumn } from 'src/element-table/index.js'
    export default {
        components:{
            ElTable,
            ElTableColumn
        }
        ,data(){
            return {
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
                        minWidth:320
                    },
                    {
                        title: '市区',
                        key: 'city',
                        minWidth:520
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
                tableData: [
                    {
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
                }
                ]


            };
        }
        ,created(){
            var t = this;
            t.tableColumns.forEach(function (item) {
                if(item.key === 'province'){
                    item.helpTipText = '这里是关于省份的介绍';
                    item.formatter = function () {
                        return `<div style="width:100px;height:100px;background: #ccc;border-radius: 50%;"></div>`
                    }
                }
            })
            //t.tableColumns = JSON.parse(JSON.stringify(t.tableColumns));
        }
        ,methods:{
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                //第2列
                if (columnIndex === 1) {
                    if (rowIndex % 2 === 0) {
                        return {
                            rowspan: 2,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }else if (columnIndex === 5) {  //第6列
                    return [1, 2];
                }else if (columnIndex === 6) {  //第6列
                    return [0, 0];
                }

            }
            ,rowClick(row, event, column,$index){
                var t = this;
                console.log(row, event, column,$index)
            }
            ,selectionChange(selection){
                console.log("selection:",selection);
            }
        }
    }
</script>