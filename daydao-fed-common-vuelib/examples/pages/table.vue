<style lang="less">

    .paste_table_data{

        table{
            width:80%;
            margin:0 auto;
        }
    }

</style>
<template>
    <div class="paste_table_data">
        <Table border :columns="columns2" :data="data3"  @on-row-click="clickRow"></Table>

        <!--<table border="1">
            <tr>
                <th v-for="item in columns2">{{item.title}}</th>
            </tr>
            <tr>
                <td v-for="item in data3">{{item.name}}</td>
            </tr>
        </table>-->
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns2: [
                    {
                        title: '姓名',
                        key: 'name',
                        minWidth: 100
                    },
                    {
                        title: '年龄',
                        key: 'age',
                        minWidth: 100
                    },
                    {
                        title: '省份',
                        key: 'province',
                        minWidth: 100
                    },
                    {
                        title: '市区',
                        key: 'city',
                        minWidth: 100
                    },
                    {
                        title: '地址',
                        key: 'address',
                        minWidth: 200
                    },
                    {
                        title: '邮编',
                        key: 'zip',
                        minWidth: 100
                    }
                ],
                data3: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居',
                        province: '北京市',
                        city: '朝阳区',
                        zip: 100000
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗',
                        province: '北京市',
                        city: '海淀区',
                        zip: 100000
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道',
                        province: '上海市',
                        city: '浦东新区',
                        zip: 100000
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道',
                        province: '广东',
                        city: '南山区',
                        zip: 100000
                    }
                ]
            }
        }
        ,mounted(){
            var t = this;

        }
        ,methods:{
            clickRow(data){
                if(data.$event.target.nodeName.toUpperCase() !== "INPUT" && data.$event.target.parentElement.classList && data.$event.target.parentElement.classList[0] == "ivu-table-cell"){
                    $(data.$event.target.parentElement).append('<div contenteditable = "true" style="display: inline;border:1px solid #ccc;">'+data.$event.target.innerText+'</div>');
                    data.$event.target.style.display = "none";
                }

            }
        }
    }
</script>
