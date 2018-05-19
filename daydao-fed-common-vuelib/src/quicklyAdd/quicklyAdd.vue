/**
* Created by fws on 2017/7/26.
*/
<template>
    <div class="quickly-add-column-box" :class="[isQuicklyAddColumnBoxActive && 'quickly-add-column-box-active']" :style="columnBoxStyle">
        <a href="javascript:;" @click="showQuickAddFunctionPoints" class="quickly-add-btn" :class="[isColumnFunctionPointsShow && 'quickly-add-btn-active']" :style="quicklyAddBtnStyle"><i class="iconfont_daydao_common icon-quickly-add">&#xe68c;</i>快速新增</a>
        <transition
                name="column-function-points"
                @beforeEnter="columnFunctionPointsBeforeEnter"
                @afterLeave="columnFunctionPointsAfterLeave"
        >
            <column-function-points v-if="isColumnFunctionPointsShow" :columns-list="installedColumnsList" :style="columnFunctionPointsStyle">
                <a href="javascript:;" @click="quicklyAddColumnManagementEvent" class="quickly-add-column-btn" slot="footer" v-text="managementTip"></a>
                <i class="iconfont_daydao_common quickly-add-action-btn" @click="uninstallQuicklyAdd(column,$index,$event)" v-if="isManagement" v-for="(column,$index) in installedColumnsList" :slot="'item-'+$index" v-html="'&#xe601;'"></i>
            </column-function-points>

        </transition>

        <transition name="quickly-add-column">
            <div class="select-quickly-add-column-box" v-if="isManagement">
                <div class="select-quickly-add-column-content">
                    <dl class="select-quickly-add-column-item clearfix" v-for="(project,projectIndex) in unInstallColumnsList">
                        <dt class="select-quickly-add-column-item-header" v-text="project.projectName"></dt>
                        <dd class="select-quickly-add-column-item-body clearfix">
                            <a href="javascript:;" class="quickly-add-column-block" :elindex="projectIndex+'-'+index" v-for="(column,index,$event) in project.projectList">
                                <span class="quickly-add-column-thumb" :class="[column.isInstalled && isManagement && 'quickly-add-column-installed']">
                                    <img src="column.columnThumn" v-if="column.columnThumn" alt="">
                                </span>
                                    <span class="quickly-add-column-title" v-text="column.columnTitle"></span>
                                    <i @click="!column.isInstalled && installQuicklyAdd(project.projectName,projectIndex,index,$event)" class="iconfont_daydao_common quickly-add-action-btn"  v-if="isManagement" v-html="column.isInstalled ? '&#xe601;' : '&#xe602;'"></i>
                            </a>
                        </dd>
                    </dl>
                </div>
            </div>

        </transition>
        <div class="temp-column-function-point" v-show="isCutPonintInstall || isCutPonintUninstall" :class="{'temp-column-function-point-install':isCutPonintInstall,'temp-column-function-point-uninstall':isCutPonintUninstall}" id="tempColumnFunctionPoint">
            <span class="column-function-item-thumb" style="background:#000;"><img :src="currentInstallingColumn && currentInstallingColumn.columnThumn" alt=""></span>
            <span class="column-function-item-name" v-text="currentInstallingColumn && currentInstallingColumn.columnTitle"></span>
        </div>
    </div>
</template>

<style lang="scss">
    %flex{
        display: -webkit-box;
        display: -moz-box;
        display: box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: -moz-flex;
        display: flex;
    }
    %flexcVerticalCenter{
         -webkit-box-align:center;
         -moz-box-align:center;
         -ms-box-align:center;
         box-align:center;
         -webkit-align-items:center;
         align-items:center;
     }
    %flexLevelCenter{
         -webkit-box-pack:center;
         -moz-box-pack:center;
         -ms-box-pack:center;
         box-pack:center;
         -webkit-justify-content:center;
         justify-content:center;
     }
    .quickly-add-box{
        width:126px;
        height:100%;
    }
    .quickly-add-btn{
        @extend %flex;
        @extend %flexcVerticalCenter;
        @extend %flexLevelCenter;
        width:126px;
        font-size:14px;
        line-height:1;
        color: #666;
        position: relative;
        z-index: 999;
    }
    .quickly-add-btn:hover,.quickly-add-btn-active{
        background: #72788F;
        color: #fff;
    }
    .icon-quickly-add{
        vertical-align: -2px;
        margin-right:5px;
    }
    .quickly-add-column-box{
        width:126px;
        position: fixed;
        z-index:999;
        top:0;
        right:0;
    }
    .quickly-add-column-box-active{
        bottom: 0;
    }
    .quickly-add-column-btn{
        display: block;
        color: #fff;
        background: #72788F;
        text-align: center;
        font-size:14px;
        height:40px;
        line-height:40px;
    }
    .quickly-add-column-btn:hover{
        color: #fff;
    }
    .select-quickly-add-column-box{
        @extend %flex;
        @extend %flexcVerticalCenter;
        @extend %flexLevelCenter;
        background: rgba(0,0,0,0.5);
        position: fixed;
        left:0;
        right:0;
        top:0;
        bottom:0;
    }
    .select-quickly-add-column-item{
        margin-bottom:42px;
    }
    .select-quickly-add-column-item-header{
        float: left;
        font-size:20px;
        margin-top:15px;
    }
    .select-quickly-add-column-item-body{
        margin-left:100px;
    }
    .quickly-add-column-block{
        position: relative;
        display: block;
        float: left;
        margin-left:20px;
        margin-right:20px;
        text-align: center;
    }
    .quickly-add-column-thumb{
        display: block;
        width:54px;
        height:54px;
        margin:0 auto;
        background: #f00;
        -webkit-border-radius:4px;
        -moz-border-radius:4px;
        border-radius:4px;
    }
    .quickly-add-column-title{
        display: block;
        color: #fff;
        font-size:14px;
        margin-top:20px;
    }
    .quickly-add-action-btn{
        background: #fff;
        position: absolute;
        right: -5px;
        top: -7px;
        width:20px;
        height:20px;
        line-height: 21px;
        font-size: 20px;
        border-radius: 100%;
        font-size:12px;
        color: #A9AAAD;
    }
    .quickly-add-column-installed{
        opacity:0.5;
    }
    .quickly-add-column-enter-active,.quickly-add-column-leave-active {
        transition: all .3s ease;
    }
    .quickly-add-column-enter,.quickly-add-column-leave-to  {
        opacity: 0;
    }
    .column-function-points-enter-active,.column-function-points-leave-active{
        transition: all 1s ease;
    }
    .column-function-points-enter,.column-function-points-leave-to{
        bottom:100% !important;
    }
    .temp-column-function-point{
        position: fixed;
        z-index: 9999;
    }
    .temp-column-function-point-uninstall{
        width:54px;
        height:96px;
    }
    .temp-column-function-point-uninstall    .column-function-item-thumb{
        width:54px;
        height:54px;
    }
    .temp-column-function-point-intsll{
        width:38px;
        height:75px;
    }
    .temp-column-function-point-intsll .column-function-item-thumb{
        width:38px;
        height:38px;
    }
</style>

<script>
    import draggable from 'vuedraggable';
    import columnFunctionPoints from '../columnFunctionPoints/';
    export default {
        data:function(){
            return {
                columnBoxStyle:"",
                quicklyAddBtnStyle:"",
                columnFunctionPointsStyle:"",
                installedColumnsList:[   //功能点列表
                    {
                        id:9,
                        columnTitle:"假勤",
                        columnAlias:"假勤申请",
                        columnThumn:"",
                        projectName:"dayhr",
                        elIndex:"0-4"
                    },
                    {
                        id:10,
                        columnTitle:"投票",
                        columnAlias:"投票",
                        columnThumn:"",
                        projectName:"dayoa",
                        elIndex:"1-2"
                    },
                    {
                        id:11,
                        columnTitle:"阅读",
                        columnAlias:"阅读",
                        columnThumn:"",
                        projectName:"dayoa",
                        elIndex:"1-5"
                    },
                    {
                        id:12,
                        columnTitle:"签到",
                        columnAlias:"移动签到",
                        columnThumn:"",
                        projectName:"dayoa",
                        elIndex:"1-4"
                    },
                    {
                        id:13,
                        columnTitle:"管理",
                        columnAlias:"报表管理",
                        columnThumn:"",
                        projectName:"daycrm",
                        elIndex:"2-2"
                    },
                    {
                        id:14,
                        columnTitle:"应用",
                        columnAlias:"应用中心",
                        columnThumn:"",
                        projectName:"daycrm",
                        elIndex:"2-6"
                    },
                    {
                        id:14,
                        columnTitle:"公告",
                        columnAlias:"公告",
                        columnThumn:"",
                        projectName:"daycrm",
                        elIndex:"2-4"
                    },
                    {
                        id:14,
                        columnTitle:"伯乐",
                        columnAlias:"伯乐",
                        columnThumn:"",
                        projectName:"daycrm",
                        elIndex:"2-5"
                    }
                ],  //已经安装
                unInstallColumnsList:[    //未安装
                    {
                        projectName:"dayhr",
                        projectList:[
                            {
                                id:1,
                                columnTitle:"工作汇报",
                                columnAlias:"汇报",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:2,
                                columnTitle:"电话会议",
                                columnAlias:"电话",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:3,
                                columnTitle:"社保查询",
                                columnAlias:"社保",
                                columnThumn:"",
                                isInstalled:true
                            },
                            {
                                id:4,
                                columnTitle:"数字红包",
                                columnAlias:"红包",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:5,
                                columnTitle:"假勤申请",
                                columnAlias:"假勤",
                                columnThumn:"",
                                isInstalled:true
                            }
                        ]
                    },
                    {
                        projectName:"dayoa",
                        projectList:[
                            {
                                id:1,
                                columnTitle:"工资条",
                                columnAlias:"工资",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:2,
                                columnTitle:"中周舆情",
                                columnAlias:"中周",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:3,
                                columnTitle:"投票",
                                columnAlias:"投票",
                                columnThumn:"",
                                isInstalled:true
                            },
                            {
                                id:4,
                                columnTitle:"管理报表",
                                columnAlias:"报表",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:5,
                                columnTitle:"移动签到",
                                columnAlias:"签到",
                                columnThumn:"",
                                isInstalled:true
                            },
                            {
                                id:5,
                                columnTitle:"阅读",
                                columnAlias:"阅读",
                                columnThumn:"",
                                isInstalled:true
                            }
                        ]
                    },
                    {
                        projectName:"daycrm",
                        projectList:[
                            {
                                id:1,
                                columnTitle:"在线培训",
                                columnAlias:"培训",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:2,
                                columnTitle:"建筑",
                                columnAlias:"建筑",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:3,
                                columnTitle:"报表管理",
                                columnAlias:"管理",
                                columnThumn:"",
                                isInstalled:true
                            },
                            {
                                id:4,
                                columnTitle:"绩效考核",
                                columnAlias:"绩效",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:5,
                                columnTitle:"公告",
                                columnAlias:"公告",
                                columnThumn:"",
                                isInstalled:true
                            },
                            {
                                id:5,
                                columnTitle:"伯乐",
                                columnAlias:"公告",
                                columnThumn:"",
                                isInstalled:true
                            },
                            {
                                id:5,
                                columnTitle:"应用中心",
                                columnAlias:"应用",
                                columnThumn:"",
                                isInstalled:true
                            }
                        ]
                    },
                    {
                        projectName:"dayci",
                        projectList:[
                            {
                                id:1,
                                columnTitle:"day盘",
                                columnAlias:"day盘",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:2,
                                columnTitle:"开发测试",
                                columnAlias:"测试",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:3,
                                columnTitle:"工作流",
                                columnAlias:"工作流",
                                columnThumn:"",
                                isInstalled:true
                            },
                            {
                                id:4,
                                columnTitle:"物品申领",
                                columnAlias:"物品",
                                columnThumn:"",
                                isInstalled:false
                            },
                            {
                                id:5,
                                columnTitle:"项目管理",
                                columnAlias:"项目",
                                columnThumn:"",
                                isInstalled:true
                            },
                            {
                                id:5,
                                columnTitle:"我的团队",
                                columnAlias:"团队",
                                columnThumn:"",
                                isInstalled:true
                            }
                        ]
                    }
                ],
                managementTip:"管理",   //底部按钮文字
                isManagement:false,    //是否在管理模式
                isColumnFunctionPointsShow:false,   //是否显示功能点列表
                isQuicklyAddColumnBoxActive:false,   //这个主要是判断是否是让快速新增的 bottom 为 0
                currentInstallingColumn:null,  //当前被安装或被删掉的应用是哪个
                isCutPonint:false, //是否安装或卸载引用
                isCutPonintInstall:false,
                isCutPonintUninstall:false
            };
        },
        components: {
            draggable,
            columnFunctionPoints
        },
        mounted:function(){
            var t = this;
            let $headerBgBar = document.querySelector(".header_bg");
            let $headerCrosswiseBar = document.querySelector(".header_crosswise_bar");
            let headerBgBarHeight = $headerBgBar.offsetHeight;
            let headerCrosswiseBarHeight = $headerCrosswiseBar.offsetHeight;
            let headerrRsidueHeight = headerCrosswiseBarHeight - headerBgBarHeight;
            t.columnBoxStyle = "top:"+(headerBgBarHeight)+"px;";
            t.columnFunctionPointsStyle = "top:"+headerrRsidueHeight+"px;";
            t.quicklyAddBtnStyle = "height:"+headerrRsidueHeight+"px;";
        },
        methods:{
            quicklyAddColumnManagementEvent:function(){
                let t = this;
                t.managementTip = t.isManagement ? "管理" : "完成";
                t.isManagement = !t.isManagement;
            },
            showQuickAddFunctionPoints:function(){
                let t = this;
                t.isColumnFunctionPointsShow = !t.isColumnFunctionPointsShow;
            },
            columnFunctionPointsBeforeEnter:function(){
                let t = this;
                t.isQuicklyAddColumnBoxActive = true;
            },
            columnFunctionPointsAfterLeave:function(){
                let t = this;
                t.isQuicklyAddColumnBoxActive = false;
            },
            installQuicklyAdd:function(projectName,projectIndex,index,$event){
                var t = this;
                var $target = $event.target;
                var $paraent = $target.parentElement;
                var left = $paraent.offsetLeft;
                var top = $paraent.offsetTop;
                var lastx = $("#lastColumnFunctionItem").offset().left;
                var lasty = $("#lastColumnFunctionItem").position().top;
                var $tempColumnFunctionPoint = document.getElementById("tempColumnFunctionPoint");
                var $columnFunctionPointsBox = document.querySelector(".column-function-points-box");
                var $quicklyAddColumnBox = document.querySelector(".quickly-add-column-box");
                var columnFunctionPointsBoxTop = $columnFunctionPointsBox.offsetTop;
                var quicklyAddColumnBoxTop = $columnFunctionPointsBox.offsetTop;
                $tempColumnFunctionPoint.style.left = left + "px";
                $tempColumnFunctionPoint.style.top = top + "px";
                t.isCutPonintInstall = true;
                t.unInstallColumnsList = t.unInstallColumnsList.map(function(item,columnindex){
                    if(item.projectName === projectName){
                        item.projectList[index].isInstalled = true;
                        let currentInstallColumn = item.projectList[index];
                        for(var i in currentInstallColumn){
                            t.currentInstallingColumn = {
                                id:currentInstallColumn.id,
                                columnTitle:currentInstallColumn.columnAlias,
                                columnThumn:currentInstallColumn.columnThumn,
                                columnAlias:currentInstallColumn.columnTitle,
                                projectName:item.projectName,
                                elIndex:projectIndex+"-"+index
                            }
                        }
                    }
                    return item;
                });
                var start = {
                    x : left,
                    y : top,
                    element:$($tempColumnFunctionPoint)
                };
                var end = {
                    x:lastx,
                    y:lasty + quicklyAddColumnBoxTop + columnFunctionPointsBoxTop
                };   //抛物线动画结束数据
                t.parabola(start,end).then(function(){
                    t.isCutPonintInstall = false;
                    t.installedColumnsList.push(t.currentInstallingColumn);
                });
            }, //安装应用
            uninstallQuicklyAdd:function(column,index,$event){
                let t = this;
                var $tempColumnFunctionPoint = document.getElementById("tempColumnFunctionPoint");
                var $target = $event.target;
                var $paraent = $target.parentElement;
                let parentClientRect = $paraent.getBoundingClientRect()
                var left = parentClientRect.left;
                var top = parentClientRect.top;
                $tempColumnFunctionPoint.style.left = left + "px";
                $tempColumnFunctionPoint.style.top = top + "px";
                t.isCutPonintUninstall = true;
                t.currentInstallingColumn = t.installedColumnsList.splice(index,1);
                var start = {
                    x : left,
                    y : top,
                    element:$($tempColumnFunctionPoint)
                };
                let elIndex = column.elIndex;
                let elIndexAry = elIndex.split("-");
                let projectIndex = elIndexAry[0];
                let pointIndex = elIndexAry[1];
                let lastx = $("[elindex='"+elIndex+"']").offset().left;
                let lasty = $("[elindex='"+elIndex+"']").offset().top;
                var end = {
                    x:lastx,
                    y:lasty
                };
                t.parabola(start,end).then(function(){
                    t.isCutPonintUninstall = false;
                    t.unInstallColumnsList[projectIndex].projectList[pointIndex].isInstalled = false;
                });

            },
            parabola:function(start,end){  //抛物线运动
                return new Promise(function(resolve,reject){
                    var self = this;
                    // 抛物线函数 y = a * x * x + b * x + c
                    var a = 0.0003;
                    var startx = start.x,
                        starty = start.y,
                        endx = end.x,
                        endy = end.y;
                    var diffx = endx - startx;
                    var diffy = endy - starty;
                    var time = 500;
                    var speedx = diffx / time;

                    /**
                     * 已知a, 根据抛物线函数 y = a*x*x + b*x + c 将抛物线起点平移到坐标原点[0, 0]，终点随之平移，那么抛物线经过原点[0, 0] 得出c = 0;
                     * 终点平移后得出：y2 - y1 = a * (x2-x1)* (x2-x1) + b *  (x2-x1)
                     * 即 diffy = a*diffx*diffx + b*diffx;
                     * 可求出常数b的值
                     **/
                    start.element.css({
                        left: startx,
                        top: starty
                    });
                    var b = (diffy - a * diffx * diffx) / diffx;

                    var startTime = new Date().getTime();
                    var timer = setInterval(function(){
                        if(new Date().getTime() - startTime > time){
                            clearInterval(timer);
                            start.element.css({
                                left:endx,
                                top:endy,
                            });
                            resolve();
                            return false;
                        }
                        var x = speedx * (new Date().getTime() - startTime);
                        var y = a * x * x　+ b * x;
                        start.element.css({
                            left: x + startx,
                            top: y + starty
                        });
                    },15)
                })
            }
        }
    }
</script>