<template>
    <div class="batch">


        <!-- <Table :columns="columns" :data="data" :disabled-hover="true" :height="tableHeight"></Table> -->

        <div class="ivu-table" style="width:100%;overflow:hidden;position:relative;">
            <table class="ivu-table-fixed" :style="`width:${fixedWidth}px;`">
                <tr>
                    <th v-for="colum in columns"  :class="{'batch-th-required':colum.required}" v-if="colum.fixed" :style="{width:colum.width+'px'}">{{colum.title}}</th>
                </tr>
            </table>
            <table :style="`width:${width}px;`" id="fixedHead">
                <colgroup>
                    <col v-for="colum in columns" :width="colum.width"></col>
                </colgroup>
                <thead>
                    <tr>
                        <th v-for="colum in columns" :class="{'batch-th-required':colum.required}">{{colum.title}}</th>
                    </tr>
                </thead>
            </table>
        </div>

        <!-- table body -->
        <div class="ivu-table-body ivu-table" :style="`width:100%; height:${height}px;position: relative;`" @scroll="scrollHandler">
            <table :style="`width:${width}px;`">
                <colgroup>
                    <col v-for="colum in columns" :width="colum.width"></col>
                </colgroup>

                <tbody>
                    <tr v-for="(row , index) in data">
                        <template v-for="colum in columns">
                            <td v-if="colum.render">
                                <div v-if="colum.type === 'inline'">
                                    <div class="batch-inline">
                                        <div class="older-data">{{row[colum.key] || '无' }}</div>
                                        <i class="iconfont_daydao_common">&#xe613;</i>
                                        <td-expand :row="row" :render="colum.render" :index="index"></td-expand>
                                    </div>
                                </div>
                                <td-expand  v-if="!colum.fixed && colum.type!=='inline'" :row="row" :render="colum.render" :index="index"></td-expand>
                            </td>
                            <td v-else-if="colum.type==='index'">{{index+1}}</td>
                            <td v-else>{{row[colum.key] || '无' }}</td>
                        </template>
                    </tr>
                </tbody>
            </table>


            <table class="ivu-table-fixed" id="fixedBody" :style="`width:${fixedWidth}px;`">
                <colgroup>
                    <col v-for="colum in columns" v-if="colum.fixed" :width="colum.width"></col>
                </colgroup>

                <tbody>
                    <tr v-for="(row , index) in data">
                        <template v-for="colum in columns" v-if="colum.fixed">
                            <td v-if="colum.render">
                                <td-expand :row="row" :render="colum.render" :index="index"></td-expand>
                            </td>
                            <td v-else-if="colum.type==='index'">{{index+1}}</td>
                            <td v-else>{{row[colum.key] || '无' }}</td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>



        <footer class="batch-fixed-bottom">
            <div class="pull-right">
                <Button @click="goBack">上一步</Button>
                <Button type="primary" @click="submitHandler">确定</Button>
                <Button @click="goBack">取消</Button>
            </div>
        </footer>


        <Spin size="large" fix v-if="spinShow" class="batch-loading"></Spin>
    </div>
</template>

<script>
    import personSelect from 'commonVueLib/personSelect'
    import tdExpand from './expand'

    export default {
        name: 'tpl',
        data() {
            return {
                height:0,
                fixedWidth:0,
                spinShow : false,
                width : 0,
            }
        },
        props:{
            columns : {
                type: Array,
                default(){
                    return []
                }
            },
            data : {
                type: Array,
                default(){
                    return []
                }
            },
            submit:{
                type:Function,
                default(){

                }
            },
            reset:{
                type:Function,
                default(){}
            },
        },
        mounted() {
            let calHeight = ()=>{this.height = window.innerHeight - 290;}
            window.onresize = ()=>{calHeight()};
            calHeight();
            this.setWidth();

            this.$fixedBody = document.querySelector('#fixedBody');
            this.$fixedHead = document.querySelector('#fixedHead');
            this.$fixed = document.querySelectorAll('.ivu-table-fixed');
        },
        components:{tdExpand,personSelect},
        methods:{
            setWidth(){
                let width = 0;
                this.columns.forEach(col=>{
                    width+=col.width;
                    if (col.fixed) {this.fixedWidth += col.width}
                })

                let batchWidth = document.querySelector('.batch').offsetWidth;
                this.width = batchWidth > width ? batchWidth : width;
            },
            submitHandler(){
                this.submit();
            },
            goBack(){
                this.$router.back();
            },
            resetHander(){
                this.reset();
            },
            scrollHandler(e){
                this.$fixedBody.style.left = e.target.scrollLeft + 'px';
                this.$fixedHead.style.transform = `translateX(${-e.target.scrollLeft}px)`;
                if (e.target.scrollLeft>0) {
                    this.$fixed.forEach(el=>{el.classList.add('fixed-shadow')})
                }else{
                    this.$fixed.forEach(el=>{el.classList.remove('fixed-shadow')})
                }
            }
        }
    }

</script>
