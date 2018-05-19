// when i wrote these code ,only god and me knowed it
// now, only god knows it , TAT...
<template>
    <div>
        <!-- 表格弹窗 -->
        <div v-if="isShowTable" class="table_report_wrapper">
            <div style="postion:absolute;">
                <i class="table_close_icon my_ivu_icon ivu-icon-close" style="font-size:16px;" @click="closeTable"></i>
            </div>
            <div class="main_table_content">
                <Table :columns="tableColumns" :data="tableDatas"></Table>
            </div>
        </div>
        <!--初始化汇报关系弹窗  -->
        <Modal v-model="isShowInitReportConfirm" width="320" :mask-closable=false>
            <p slot="header" style="text-align:center;color:#657180;">初始化汇报关系</p>
            <div class="modal-content-tips">
                <p style="text-indent:2em;">是否根据组织负责人生成新的汇报关系，这将为汇报关系是空的员工指定组织负责人为汇报对象，但不会修改您当前配置的汇报关系？</p>
            </div>
            <div slot="footer" style="text-align:center;">
                <Button type="primary" @click="confirmToInit" style="margin-right:10px;">确定</Button>
                <Button type="button" @click="cancelToInt" style="margin-left:10px;">取消</Button>
            </div>
        </Modal>
        <Modal v-model="changeReport.isShowChangeReporter" width="417" :mask-closable=false>
            <p slot="header" style="color:#657180;">修改</p>
            <div style="margin-left:20px;">
                <p>变更汇报对象</p>
                <p>变更汇报对象后原下属将全部归到新汇报人</p>
                <div style="margin-top:30px;margin-bottom:20px;">
                    <span :title="changeReport.fullReportName">{{changeReport.oldReportName}}</span>
                    <i class="iconfont_daydao_common">&#xe613;</i>
                    <div style="display:inline-block;position:relative;">
                        <daydao-drop-select name="reporterchange" :data="reportInfos" :val="changeReport.newReportName" ref="daydaoDropSelect" :onSelected="setDropSelectData" width="210"></daydao-drop-select>
                        <span v-if="changeReport.isShowErrorTip" style="display:flex;position:absolute;font-size:12px;color:red;">请选择汇报人</span>
                    </div>
                </div>
            </div>
            <div slot="footer" style="text-align:center;">
                <Button type="primary" @click="confirmToChange" style="margin-right:10px;">确定</Button>
                <Button type="button" @click="cancelToChange" style="margin-left:10px;">取消</Button>
            </div>
        </Modal>
        <div class="page_top_org_nav">
            <ul class="page-top-left-link">
                <router-link class="org_nav_link" to="/org_list">组织列表</router-link>
                <span class="seperate_ver_line">|</span>
                <router-link class="org_nav_link" to="/org_chart">组织架构图</router-link>
                <span class="seperate_ver_line">|</span>
                <router-link class="org_nav_link" to="/report_chart" style="color:#F18950;">汇报关系图</router-link>
            </ul>
        </div>
        <button class="btn_padding page_btn" @click="exportChart">导出汇报关系图</button>
        <button class="btn_padding page_btn" @click="initReportRelation">初始化汇报关系</button>
        <page-tree-menu v-if="reportTree && reportTree.length!=0" :navigationData="reportTree" @clickMenuCallback="clickMenuCallback" ref="pageTreeMenu"></page-tree-menu>
        <button v-if="isShowResetBtn" class="reset_page_btn reset_btn" style="float:right;margin:40px 20px;" @click="refreshReportStructure">
            <i class="iconfont_daydao_common" title="重置">&#xe618;</i>
        </button>
        <div v-if="isShowResetBtn" class="scale_report_btn" style="float:right;">
            <i class="iconfont_daydao_common scale-btn-padding" style="display:block;" @click="handleZoom('+')" title="放大">&#xe619;</i>
            <i class="iconfont_daydao_common scale-btn-padding" @click="handleZoom('-')" title="缩小">&#xe61a;</i>
        </div>
        <div class="report_select_tip">&nbsp;&nbsp;点击这里可以切换图形中的顶级汇报人，仅显示有下属的员工</div>
        <div id="Main" style="width:100%;height:800px;border:1px solid #E3E8EE;background-color:#F5F7F9;">

        </div>

    </div>
</template>

<style lang="scss">
@import "../../../style/style.css";
.page-top-left-link {
    padding: 8px 0px;
    color: #657180;
    font-size: 16px;
}

.report_select_tip {
    background-color: #FFF6EE;
    height: 30px;
    color: #F18950;
    line-height: 30px;
    font-size: 12px;
}

.my_ivu_icon {
    display: inline-block;
    font-family: Ionicons;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    text-rendering: auto;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
}

.table_close_icon {
    position: absolute;
    right: 8px;
    top: 10px;
}

.table_close_icon:hover {
    cursor: pointer;
}

.table_report_wrapper {
    position: absolute;
    top: 30%;
    z-index: 1000;
    width: 600px;
    left: 50%;
    margin-left: -300px;
    background: #FFFFFF;
    border-radius: 6px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.20);
    margin-bottom: 30px;
}

.main_table_content {
    margin-top: 40px;
    max-height: 280px;
    overflow-y: scroll;
    padding: 0 16px 16px;
}

.org_nav_link {
    padding-left: 12px;
    padding-right: 12px;
    color: #657180;
}

.org_nav_link:hover {
    color: #F18950;
}

.seperate_ver_line {
    color: #E3E8EE;
}

.btn_padding {
    margin: 0px 0px 10px 10px;
}

.scale-btn-padding {
    padding: 10px;
    background: #fff;
}

.scale-btn-padding:hover {
    cursor: pointer;
}

.page_btn {
    height: 30px;
    padding: 0 11px;
    display: inline-block;
    background-color: #fff;
    border: 1px solid #E3E8EE;
    border-radius: 2px;
    color: #657180;
    font-size: 14px;
    cursor: pointer;
}

.reset_page_btn {
    height: 30px;
    padding: 0 9px;
    display: inline-block;
    background-color: #fff;
    border: transparent;
    border-radius: 2px;
    color: #657180;
    font-size: 14px;
    cursor: pointer;
}

.reset_btn {
    position: absolute;
    margin: 20px;
    right: 0px;
    z-index: 999;
    background: #ffffff;
}

.scale_report_btn {
    position: absolute;
    margin: 84px 20px;
    right: 0px;
    z-index: 999;
}

.right_filter_selection {
    float: right;
    margin-right: 20px;
}

// 节点
.reportnode .report-node-rect {
    cursor: pointer;
    fill: #fff;
}

.reportnode text {
    font: 14px PingFangSC-Regular;
}

.reportnode .boldtext {
    font: 16px PingFangSC-Regular;
}

.link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
}

.collapse-icon {
    cursor: pointer;
}

.collapse-icon:hover {
    opacity: .7;
}

.collapse-icon-rotate {
    transform: rotate(180deg);
    transform-origin: center;
}

#downloadSvg {
    display: none;
}

.hoverbgtip {
    cursor: pointer;
}

.showicona {
    width: 30px;
    height: 30px;
    display: inline-block;
}

.editIcon_normal {
    display: none;
    cursor: pointer;
}
</style>

<script type="text/babel">
import { daydaoDropSelect, daydaoDropSelectMul } from 'commonVueLib/daydaoDropSelect/index'
import pageTreeMenu from "commonVueLib/pageTreeMenu/index";
import virtualImage from "src/assets/images/virtualImage.png";
import editicon from "src/assets/images/editicon.png";
import downImg from "src/assets/images/up.png"
const infoSetId = "org_chart";

export default {
    name: infoSetId
    , components: {
        pageTreeMenu //组织树
        , daydaoDropSelect // 下拉框
    }
    , data() {
        var t = this;
        return {
            reportTree: []
            , personId: "" //组织Id
            , reportQueueId: ""
            , noHavChildList: {

            }
            , tableDatas: []
            , tableColumns: [
                {
                    type: 'index',
                    title: "序号",
                    width: 80
                },
                {
                    title: "姓名",
                    key: "name",
                },
                {
                    title: "所属组织",
                    key: "orgName",
                },
                {
                    title: "职位名称",
                    key: "posName",
                }
            ],
            isShowTable: false,
            isShowInitReportConfirm: false,
            isShowResetBtn: false,
            isShowSelectTip: true,
            zr: {},
            filePrefix: "",
            headImgColors: ["#07a9ea", "#82c188", "#ab97c2", "#ffb500", "#59ccce", "#ff5959"] //蓝，绿，紫，黄，浅蓝,浅红
            , tableAlignTop: 200 // 弹窗距离顶部的距离
            , tableAlignLeft: 200 //弹窗距离左侧的距离
            , reportChartDatas: {} // 汇报关系图数据
            , zoomListener: {}
            , downImg: downImg
            , editicon: editicon
            , changeReport: {
                isShowChangeReporter: false//显示更换弹窗
                , isShowErrorTip: false,//显示错误提示
                oldReportName: "" // 原始更改汇报对象的人
                , oldReportId: "" //原始汇报对象的id
                , fullReportName: ""
                , newReportName: "" // 新选择的汇报对象id
            }
            , reportInfos: [] // 更改汇报人下拉框数据
            , nowScale: null // 当前的scale
        };
    }
    , watch: {

    }
    , mounted() {
        var t = this;
        //t.initTreeMenu();
        t.init();
        //t.$refs.tableDataList.exportExcel = t.exportExcel;
    }
    , methods: {
        initTreeMenu: function() {
            var _this = this;
            var isInTree = false;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "personReport/getReportOrgPersonData.do",
                data: JSON.stringify({}),
                success: function(data) {
                    //_this.addPersonTemplate.editColumns=_this.addPersonTemplate.editColumns.concat(data.columnEdit);
                    try {
                        _this.reportTree = data.beans;
                        // 初始化的时候先判断本地是否有缓存
                        var tempPid = localStorage.getItem("reportPersonId");
                        var tempQueId = localStorage.getItem("reportQueueId");
                        isInReportTree(tempPid, _this.reportTree);

                        if (tempPid && tempQueId) {
                            // 是否还存在该人
                            if (isInTree) {
                                //隐藏提示
                                _this.isShowSelectTip = false;
                                _this.personId = tempPid;
                                _this.reportQueueId = tempQueId;
                                _this.refreshReportStructure();
                                console.log("bu请求defaultreport");
                            } else {
                                console.log("之前的人不在组织树了");
                            }

                        } else {
                            // 不存在选择的人则获取企业管理员默认的汇报人信息
                            console.log("请求defaultreport");
                            _this.initDefaultReport();
                        }
                    } catch (e) {
                        console.log(e.message);
                    }

                }
            });
            function isInReportTree(searchId, treeArr) {
                treeArr.forEach(function(item, index) {
                    if (item.id == searchId) {
                        isInTree = true;
                    }
                    if (item.children) {
                        isInReportTree(searchId, item.children);
                    }
                });
            }
        },
        // 刷新员工汇报关系图
        refreshReportStructure: function() {
            var _this = this;
            var params = {}
            params["personId"] = _this.personId;
            params['reportQueueId'] = _this.reportQueueId;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "personReport/getPersonInfo.do",
                data: JSON.stringify(params),
                success: function(data) {
                    //_this.addPersonTemplate.editColumns=_this.addPersonTemplate.editColumns.concat(data.columnEdit);
                    try {
                        if (data.orgDayHrTreeNodeExtBeanList && data.orgDayHrTreeNodeExtBeanList.length > 0) {
                            //显示重置，放大缩小按钮
                            _this.filePrefix = data.filePrefix;
                            _this.isShowResetBtn = true;
                            _this.reportChartDatas = data.orgDayHrTreeNodeExtBeanList[0];
                            //_this.paintReportChart(data);
                            $("#downloadSvg").remove();
                            $("#mainReportChart").remove();
                            _this.reportChart();
                            _this.createHoleChart();
                        }

                    } catch (e) {
                        console.log(e.message);
                    }
                }
            });
        }
        , init: function() {
            var _this = this;
            _this.initTreeMenu();
            _this.initReportList();
        }
        , initReportList: function() {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "org/getReporteByCorp.do"
                , data: JSON.stringify({})
                , success: function(data) {
                    _this.reportInfos = data.beans;
                }
            });
        }
        // 获取当前企业默认的汇报人，
        , initDefaultReport: function() {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "personReport/getDefaultReportPersonData.do",
                data: JSON.stringify({}),
                success: function(data) {
                    try {
                        if (data.orgDayHrTreeNodeExtBean && data.orgDayHrTreeNodeExtBean.personId && data.orgDayHrTreeNodeExtBean.reportIdQueue) {
                            var personInfos = data.orgDayHrTreeNodeExtBean;
                            _this.personId = personInfos.personId;
                            _this.reportQueueId = personInfos.reportIdQueue;
                            _this.isShowSelectTip = false;
                            _this.refreshReportStructure();
                        }
                    } catch (e) {
                        console.log(e.message);
                    }


                }
            });
        }
        //绘制员工汇报关系图
        , reportChart: function() {
            var _this = this;
            require.ensure([], () => {
                require('d3');
                var margin = {
                    top: 20,
                    right: 120,
                    bottom: 20,
                    left: 120
                },
                    // 画布大小
                    width = $("#Main").width() - 20,
                    height = $("#Main").height();

                var root = _this.reportChartDatas;
                var i = 0,
                    duration = 650,
                    rectW = 270,
                    rectH = 130;

                var tree = d3.layout.tree().nodeSize([rectW + 20, rectH]);
                var diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        return [d.x + rectW / 2, d.y + rectH / 2];
                    });
                var zm = d3.behavior.zoom().scaleExtent([0.3, 3]).on("zoom", redraw);
                var initzoom = d3.behavior.zoom();
                var initScale = initzoom.scale([0.5]);
                _this.zoomListener = zm;
                var svg = d3.select("#Main").append("svg").attr("id", "mainReportChart").attr("width", width).attr("height", height)
                    .call(zm).append("g")
                    .attr("transform", "translate(" + (width / 2 - rectW / 2) + "," + 30 + ")").attr("id", "chartReportContainer");

                //necessary so that zoom knows where to zoom and unzoom from
                zm.translate([(width / 2 - rectW / 2), 20]);

                root.x0 = 0;
                root.y0 = height / 2;

                function collapse(d) {
                    if (d.children) {
                        d._children = d.children;
                        if (d._children) {
                            d._children.forEach(collapse);

                        }
                        //默认全部展开
                        // d.children = null;
                    }
                }
                if (root.children) {
                    root.children.forEach(collapse);
                }
                update(root);

                //d3.select("#Main").style("height", "800px");

                function update(source) {

                    tree.separation(function(a, b) {
                        return 1;
                    })
                    // Compute the new tree layout.
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);

                    // Normalize for fixed-depth.
                    nodes.forEach(function(d) {
                        //----------------------------------------------------
                        d.y = d.depth * 180;
                    });

                    // Update the nodes…
                    var node = svg.selectAll("g.reportnode")
                        .data(nodes, function(d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", function(d) {
                            var reportNode = "reportNode_" + d.id;

                            return "reportnode " + reportNode;
                        })
                        .attr("transform", function(d) {
                            return "translate(" + source.x0 + "," + source.y0 + ")";
                        })
                        .on("click", click)
                        .on("mouseover", function(d) {
                            if (d.isHavChild) {
                                // 没有统计节点
                                // handleMouseOver(d)
                                $(".eidticon_" + d.id).css("display", "inline-block");
                            }
                            // 有统计节点 则不处理
                        }).on("mouseout", function(d) {
                            //hideEditIcon(d);
                            $(".eidticon_" + d.id).css("display", "none");
                        });

                    // 处理编辑事件
                    function handleMouseOver(dtarget) {
                        var reportNode = ".reportNode_" + dtarget.id;
                        var reportNode = svg.select(reportNode);

                        if ($(".showicona_" + dtarget.id).length == 0) {
                            reportNode.append("rect")
                                .attr("x", 240)
                                .attr("y", 4)
                                .attr("width", "30")
                                .attr("height", "30")
                                .attr("fill", "transparent")
                                .attr("class", function(d) {
                                    return "showicona_" + dtarget.id + " showicona";
                                })
                                .on("click", function(d) {
                                    event.stopPropagation();
                                    _this.showEditReporter(d);
                                });
                            console.log(".showicona_" + dtarget.id);
                            // 火狐浏览器下 
                            if (navigator.userAgent.indexOf("Firefox") > -1) {
                                $(".showicona_" + dtarget.id).on('click', function(e) {
                                    // debugger
                                    console.log("click-------------------");
                                    e.stopPropagation();
                                    _this.showEditReporter(dtarget);
                                });
                            }
                        }

                        // .select(".showicona_" + dtarget.id)


                    }
                    //隐藏图标
                    function hideEditIcon(dtarget) {
                        var reportNode = svg.select(".reportNode_" + dtarget.id);
                        setTimeout(function() {
                            reportNode.select(".editIcon_normal").remove();
                        }, 450);
                    }
                    /*创建阴影*/
                    var defs = nodeEnter.append("defs");
                    var filter = defs.append("filter").attr("id", 'rectDef').attr('height', '120%');
                    filter.append('feColorMatrix')
                        .attr('result', 'matrixOut')
                        .attr('in', 'offOut')
                        .attr('type', 'matrix')
                        .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0 0 0 0.1 0.1 0')
                    filter.append('feGaussianBlur')
                        .attr('result', 'blurOut')
                        .attr('in', 'matrixOut')
                        .attr('stdDeviation', 3)
                    filter.append('feBlend')
                        .attr('in', 'SourceGraphic')
                        .attr('in2', 'blurOut')
                        .attr('mode', 'normal')
                    nodeEnter.append("rect")
                        .attr('class', 'node-rect')
                        .attr("width", rectW)
                        .attr("height", rectH)
                        .attr('rx', 5)
                        .attr('ry', 5)
                        .style("fill", '#fff')
                        .attr('filter', 'url(#rectDef)');

                    // 组织基础框架
                    nodeEnter.append("rect")
                        .attr("class", "report-node-rect")
                        .attr("rx", 6)
                        .attr("ry", 6)
                        .attr("width", rectW)
                        .attr("height", rectH);
                    // 有头像的
                    // 是否有平级节点-------------------绘制
                    nodeEnter.append('rect')
                        .attr("class", "isHavChild")
                        .style('fill', function(d) {
                            var reportNode = svg.select(".reportNode_" + d.id);
                            if (d.isHavChild) {
                                // 没有同级节点
                                // 编辑按钮长存------------------------------------------------------------------
                                if (navigator.userAgent.indexOf("Firefox") > -1) {
                                    // 火狐浏览器的处理
                                    reportNode.append("image")
                                        .attr("class", function(d) {
                                            return "editIcon_normal eidticon_" + d.id;
                                        })
                                        .attr("x", "240")
                                        .attr("y", "4")
                                        .attr("width", 28)
                                        .attr("height", 28)
                                        .attr("xlink:href", _this.editicon);
                                    $(".eidticon_"+d.id).click(function(e){
                                        e.stopPropagation();
                                        _this.showEditReporter(d);
                                        console.log("click click click");
                                    });
                                } else {
                                    reportNode.append("image")
                                        .attr("class", function(d) {
                                            return "editIcon_normal eidticon_" + d.id;
                                        })
                                        .attr("x", "240")
                                        .attr("y", "4")
                                        .attr("width", 28)
                                        .attr("height", 28)
                                        .attr("xlink:href", _this.editicon)
                                        .on("click", function(d) {
                                            // event.stopPropagation();
                                            _this.showEditReporter(d);
                                            event.stopPropagation();
                                        });
                                }

                                console.log(svg.select(".reportNode_" + d.id));
                                noSameLevel(reportNode);
                            } else {
                                // 有同级节点，还要计算节点个数：2，3，多
                                var showType = d.noHavChildList.length;
                                havSameLevel(reportNode, showType);
                            }
                            return 'transparent';
                        })
                    // 没有平级节点
                    function noSameLevel(reportNode) {
                        reportNode.append('rect')
                            .attr("class", "isHavHeadImg")
                            .style("fill", function(d) {
                                // 存在头像

                                if (d.headImg) {
                                    havHeadImg(reportNode, false);
                                } else {
                                    // 不存在头像
                                    noHeadImg(reportNode, false);
                                }
                                rightSideText(reportNode);
                            })
                    }
                    // 有平级节点
                    function havSameLevel(reportNode, type) {
                        if (type == 2) {
                            // 两个人的情况，取noHavChildList[1]
                            paintTwoImgNode(reportNode);
                        } else if (type == 3) {
                            // 三个人的情况 取noHavChildList[1] noHavChildList[2]
                            paintThreeImgNode(reportNode);
                        } else if (type > 3) {
                            // 右侧图片
                            reportNode.append("image")
                                .attr("x", 80)
                                .attr("y", 20)
                                .attr("width", 120)
                                .attr("height", 80)
                                .attr("xlink:href", virtualImage)
                                .on('mouseover', function(d) {
                                    console.log("----------=============");
                                    handleReportNodeMouseOver(d, reportNode)
                                })
                                .on("mouseout", function(d) {
                                    handleReportNodeMouseOut(d, reportNode);
                                })
                                .on("click", function(d) {
                                    // 点击显示人员列表
                                    reportNode.selectAll(".hoverbgcircle").remove();
                                    reportNode.selectAll(".hoverbgtip").remove();
                                    isShowPersonTable(d);
                                    console.log(d, "click img");
                                });
                            //提示有多少同级节点
                            reportNode.append("text")
                                .attr("x", 135)
                                .attr("y", 114)
                                .attr("text-anchor", "middle")
                                .attr("fill", "#657180")
                                .style("font", "16px PingFangSC-Medium")
                                .text(function(d) {
                                    return "共" + d.noHavChildList.length + "人";
                                });
                        } else if (type == 1) {
                            // 只有一个数据
                            noSameLevel(reportNode);
                        }
                    }

                    // 显示人员列表表格
                    function isShowPersonTable(resourceD) {
                        _this.tableDatas = [];
                        _this.isShowTable = true;
                        _this.tableAlignLeft = 100;
                        _this.tableAlignTop = resourceD.y + rectH * 2 + 30;
                        _this.tableDatas = resourceD.noHavChildList;
                    }
                    // 处理鼠标移入事件
                    function handleReportNodeMouseOver(overd, reportNode) {
                        // if ($(".hovertip_" + overd.id).length == 0) {
                        //     reportNode.append("circle")
                        //         .style({ 'fill': '#000', 'opacity': '0' })
                        //         .attr('class', 'hovertip_' + overd.id)
                        //         .attr('cx', '174')
                        //         .attr('cy', '60')
                        //         .attr('r', '26');
                        // }
                        reportNode.append("text")
                            .attr("class", "hoverbgtip")
                            .attr("x", 174)
                            .attr("y", 64)
                            .attr("text-anchor", "middle")
                            .attr("fill", "#fff")
                            .text(function(d) {
                                return "查看";
                            })
                            .on('click', function(d) {
                                isShowPersonTable(d);
                                reportNode.select(".hovertip_" + overd.id).remove();
                                reportNode.selectAll(".hoverbgtip").remove();
                                console.log(d);
                                // isShowPersonTable(d);
                            })
                            .on("mouseout", function(d) {
                                svg.selectAll(".hoverbgtip").remove();// 隐藏查看
                            });
                    }
                    // 处理鼠标移出事件
                    function handleReportNodeMouseOut(d, reportNode) {
                        setTimeout(function() {
                            // reportNode.selectAll(".hoverbgtip").remove();
                        }, 450);
                    }
                    // 不存在头像
                    function noHeadImg(reportNode, isHasName) {
                        // 没有头像的时候,圆圈
                        reportNode.append("circle")
                            .attr("cx", 60)
                            .attr("cy", 60)
                            .attr("r", 28)
                            .attr("fill", function(d) {
                                return _this.headImgColors[getRandomIntInclusive(0, 5)]
                            });
                        // 没有头像时的 名字
                        reportNode.append("text")
                            .attr("x", 60)
                            .attr("y", 64)
                            .attr("text-anchor", "middle")
                            .attr("fill", "#fff")
                            .text(function(d) {

                                var personName = d.name;
                                var nameLength = d.name.length;
                                if (nameLength > 3) {
                                    personName = d.name.substring(nameLength - 2, nameLength);
                                }
                                return personName;
                            });
                        // 需要有名字
                        if (isHasName) {
                            reportNode.append("text")
                                .attr("x", 60)
                                .attr("y", 114)
                                .attr("text-anchor", "middle")
                                .attr("fill", "#657180")
                                .text(function(d) {
                                    var pname = d.name;
                                    if (pname.length >= 4) {
                                        pname = pname.substring(0, 4) + "...";
                                    }
                                    return pname;
                                });
                        }
                    }
                    // 右侧 名称
                    function rightSideText(reportNode) {
                        // 名称
                        reportNode.append("text")
                            .attr("x", 110)
                            .attr("y", 44)
                            .attr("text-anchor", "left")
                            .attr("fill", "#657180")
                            .attr("class", "boldtext")
                            .text(function(d) {
                                var personName = d.name;
                                if (personName.length > 8) {
                                    personName = personName.substring(0, 8);
                                }
                                return personName;
                            });
                        reportNode.append("text")
                            .attr("x", 110)
                            .attr("y", 70)
                            .attr("text-anchor", "left")
                            .attr("fill", "#657180")
                            .text(function(d) {
                                var reportPosName = '';
                                if (d.posName && d.posName != '') {
                                    reportPosName = d.posName;
                                } else {
                                    if (d.noHavChildList && d.noHavChildList.length > 0 && d.noHavChildList[0].id == d.id && d.noHavChildList[0].posName && d.noHavChildList[0].posName != '') {
                                        reportPosName = d.noHavChildList[0].posName;
                                    }
                                }
                                return reportPosName;
                            });
                        reportNode.append("text")
                            .attr("x", 110)
                            .attr("y", 96)
                            .attr("text-anchor", "left")
                            .attr("fill", "#657180")
                            .text(function(d) {
                                var reportOrgName = '';
                                if (d.orgName && d.orgName != '') {
                                    reportOrgName = d.orgName;
                                } else {
                                    if (d.noHavChildList && d.noHavChildList.length > 0 && d.noHavChildList[0].id == d.id && d.noHavChildList[0].orgName && d.noHavChildList[0].orgName != '') {
                                        reportOrgName = d.noHavChildList[0].orgName;
                                    }
                                }
                                return reportOrgName;
                            });
                    }
                    // 存在头像
                    function havHeadImg(reportNode, isHasName) {
                        // 圆图片处理
                        reportNode.append("defs")
                            .attr("class", "headimg-defs");

                        reportNode.select(".headimg-defs").append("pattern")
                            .attr("id", "circleImg")
                            .attr("patternUnits", "userSpaceOnUse")
                            .attr("width", 60)
                            .attr("height", 60);
                        reportNode.select(".headimg-defs #circleImg").append("image")
                            .attr("class", "report-node-img")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("width", 60)
                            .attr("height", 60)
                            .attr("xlink:href", function(d) {
                                return _this.filePrefix + "/" + d.headImg;
                            });
                        reportNode.append("circle")
                            .attr("cx", 60)
                            .attr("cy", 60)
                            .attr("r", 30)
                            .attr("fill", function(d) {
                                return "url(#circleImg)";
                            });
                        // 需要有名字
                        if (isHasName) {
                            reportNode.append("text")
                                .attr("x", 60)
                                .attr("y", 114)
                                .attr("text-anchor", "middle")
                                .attr("fill", "#657180")
                                .text(function(d) {
                                    return d.name;
                                });
                        }
                    }
                    // 绘制两个头像的
                    function paintTwoImgNode(reportNode) {
                        reportNode.append('rect')
                            .attr("class", 'isHavHeadImg')
                            .style("fill", function(d) {
                                var node1 = d.noHavChildList[0]; // 第一个节点
                                var node2 = d.noHavChildList[1]; // 第一个节点
                                var nodePosition1 = {
                                    normalcy: 60,
                                    normalcx: 95,
                                    normalty: 64,
                                    normaltx: 95,
                                    normaldty: 114,
                                    normaldtx: 95,
                                    imgx: 30,
                                    imgy: 0
                                }
                                var nodePosition2 = {
                                    normalcy: 60,
                                    normalcx: 175,
                                    normalty: 64,
                                    normaltx: 175,
                                    normaldty: 114,
                                    normaldtx: 175,
                                    imgx: 30,
                                    imgy: 0
                                }
                                if (node1.headImg && node1.headImg != '') {
                                    paintHaveImgByPos(reportNode, true, nodePosition1, node1);
                                } else {
                                    paintNoHavImgByPos(reportNode, true, nodePosition1, node1);

                                }
                                if (node2.headImg && node2.headImg != '') {
                                    paintHaveImgByPos(reportNode, true, nodePosition2, node2);

                                } else {
                                    paintNoHavImgByPos(reportNode, true, nodePosition2, node2);

                                }
                            });
                    }
                    // 绘制三个头像的
                    function paintThreeImgNode(reportNode) {

                        reportNode.append('rect')
                            .attr("class", "isHavHeadImg")
                            .style("fill", function(d) {
                                // 存在头像

                                if (d.headImg) {
                                    havHeadImg(reportNode, true);
                                } else {
                                    // 不存在头像
                                    noHeadImg(reportNode, true);
                                }

                                console.log(d);
                                var node2 = d.noHavChildList[1];// 第二个节点
                                var node3 = d.noHavChildList[2]; // 第三个节点
                                // 第二个节点的位置
                                var nodePosition2 = {
                                    normalcy: 60,
                                    normalcx: 132,
                                    normalty: 64,
                                    normaltx: 132,
                                    normaldty: 114,
                                    normaldtx: 132,
                                    imgx: 30,
                                    imgy: 0
                                };
                                // 第三个节点的位置
                                var nodePosition3 = {
                                    normalcy: 60,
                                    normalcx: 205,
                                    normalty: 64,
                                    normaltx: 205,
                                    normaldty: 114,
                                    normaldtx: 205,
                                    imgx: 60,
                                    imgy: 0
                                };
                                if (node2.headImg && node2.headImg != '') {

                                    paintHaveImgByPos(reportNode, true, nodePosition2, node2);
                                } else {
                                    paintNoHavImgByPos(reportNode, true, nodePosition2, node2);
                                }
                                if (node3.headImg && node3.headImg != '') {
                                    paintHaveImgByPos(reportNode, true, nodePosition3, node3);
                                } else {
                                    paintNoHavImgByPos(reportNode, true, nodePosition3, node3);
                                }
                                return "transparent"
                            });
                    }
                    // 根据节点为指绘制有头像的图形
                    /** 
                     content:绘制节点的基本信息
                     position:该节点的位置
                     isHasName:是否需要名字
                     reportNode:该节点
                    */
                    function paintHaveImgByPos(reportNode, isHasName, position, content) {
                        // 圆图片处理
                        reportNode.append("defs")
                            .attr("class", "headimg-defs");

                        reportNode.select(".headimg-defs").append("pattern")
                            .attr("id", "circleImg")
                            .attr("patternUnits", "userSpaceOnUse")
                            .attr("width", 60)
                            .attr("height", 60);
                        reportNode.select(".headimg-defs #circleImg").append("image")
                            .attr("class", "report-node-img")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("width", 60)
                            .attr("height", 60)
                            .attr("xlink:href", function(d) {
                                return _this.filePrefix + "/" + d.headImg;
                            });
                        reportNode.append("circle")
                            .attr("cx", position.normalcx)
                            .attr("cy", position.normalcy)
                            .attr("r", 30)
                            .attr("fill", function(d) {
                                return "url(#circleImg)";
                            });
                        // 需要有名字
                        if (isHasName) {
                            reportNode.append("text")
                                .attr("x", position.normaldtx)
                                .attr("y", position.normaldty)
                                .attr("text-anchor", "middle")
                                .attr("fill", "#657180")
                                .text(function(d) {
                                    return content.name;
                                });
                        }
                    }
                    function paintNoHavImgByPos(reportNode, isHasName, position, content) {
                        // 没有头像的时候,圆圈
                        reportNode.append("circle")
                            .attr("cx", position.normalcx) // cx
                            .attr("cy", position.normalcy) // cy
                            .attr("r", 28)
                            .attr("fill", function(d) {
                                return _this.headImgColors[getRandomIntInclusive(0, 5)]
                            })
                            .on("mouseover", function(d) {
                                var hoverPosition = {
                                    tx: position.normaltx,
                                    ty: position.normalty,
                                    hcx: position.normalcx,
                                    hcy: position.normalcy
                                }
                                paintHoverTipBtPos(reportNode, hoverPosition, content.id);
                            })
                            .on("mouseout", function(d) {

                            });
                        // 没有头像时的 名字
                        reportNode.append("text")
                            .attr("x", position.normaltx) //tx
                            .attr("y", position.normalty) //ty
                            .attr("text-anchor", "middle")
                            .attr("fill", "#fff")
                            .text(function(d) {
                                // 使用content的名字

                                var personName = content.name;
                                var nameLength = personName.length;
                                if (nameLength > 3) {
                                    personName = personName.substring(nameLength - 2, nameLength);
                                }
                                return personName;
                            });
                        // 需要有名字
                        if (isHasName) {
                            reportNode.append("text")
                                .attr("x", position.normaldtx) // dtx 下方的x和y
                                .attr("y", position.normaldty) //dty 
                                .attr("text-anchor", "middle")
                                .attr("fill", "#657180")
                                .text(function(d) {
                                    var pname = content.name;
                                    if (pname.length >= 4) {
                                        pname = pname.substring(0, 4) + "...";
                                    }
                                    return pname;
                                });
                        }
                    }
                    function paintHoverTipBtPos(reportNode, position, hid) {
                        if ($(".hovertip_" + hid).length == 0) {
                            reportNode.append("circle")
                                .style({ 'fill': '#000', 'opacity': '0.45' })
                                .attr('class', 'hovertip_' + hid)
                                .attr('class', 'myhoverbgtip')
                                .attr('cx', position.hcx)
                                .attr('cy', position.hcy)
                                .attr('r', '28')
                                .on("mouseout", function(d) {


                                });
                        }
                        reportNode.append("text")
                            .attr("class", "hoverbgtip")
                            .attr("x", position.tx)
                            .attr("y", position.ty)
                            .attr("text-anchor", "middle")
                            .attr("fill", "#fff")
                            .text(function(d) {
                                return "查看";
                            })
                            .on('click', function(d) {
                                isShowPersonTable(d);
                                reportNode.select(".hovertip_" + hid).remove();
                                reportNode.selectAll(".hoverbgtip").remove();
                                // isShowPersonTable(d);
                            })
                            .on("mouseout", function(d) {
                                svg.selectAll(".hoverbgtip").remove();// 隐藏查看
                                svg.selectAll(".myhoverbgtip").remove();
                            });
                    }
                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    nodeUpdate.select("rect")
                        .attr("font-size", 24)
                        .attr("width", rectW)
                        .attr("height", rectH);

                    nodeUpdate.select("text")
                        .style("fill-opacity", 1)

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + source.x + "," + source.y + ")";
                        })
                        .remove();

                    nodeExit.select("rect")
                        .attr("width", rectW)
                        .attr("height", rectH)
                        .style("fill", "#fff");

                    nodeExit.select("text");

                    // 连线
                    var link = svg.selectAll("path.link")
                        .data(links, function(d) {
                            return d.target.id;
                        });

                    link.enter().insert("path", "g")
                        .data(links)
                        .attr("class", "link")
                        .attr("x", rectW)
                        .attr("y", rectH / 2)
                        .attr("d", connect)
                        .style('opacity', 0)
                        .style('stroke', function(d, i) {
                            return '#D1D8E0'
                        })
                        .style('stroke-width', 1.2)
                        .style('fill', 'none')

                    link.transition()
                        .duration(duration)
                        .attr("d", connect)
                        .style('opacity', 1)

                    link.exit().transition()
                        .duration(duration)
                        .style('opacity', 0)
                        .remove();

                    function connect(d, i) {
                        return "M" + (d.source.x + rectW / 2) + "," + (d.source.y + rectH)
                            + "V" + (d.source.y + 160)
                            + "H" + (d.target.x + rectW / 2)
                            + "V" + (d.target.y);
                    };

                    // 上下图标
                    d3.selectAll('.collapse-icon').remove();
                    node.append('image').attr('x', rectW / 2 - 18).attr('y', 126).attr("width", 36).attr("height", 24)
                        .filter((d) => {
                            return (d.children && d.children.length) || (d._children && d._children.length)
                        })
                        .attr("xlink:href", _this.downImg)
                        .attr('class', function(d) {
                            return d.children ? 'collapse-icon' : 'collapse-icon collapse-icon-rotate'
                        })
                        .on("click", _this.handleCollapseClick)
                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }



                function handleCollapseClick(d) {
                    event.stopPropagation();
                    // var index = _this.openIds.indexOf(d.id);
                    // if (index > -1) {
                    //     _this.openIds.splice(index, 1);
                    // }
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                        d3.select(d3.event.target).attr('class', 'collapse-icon collapse-icon-rotate');
                        _this.updateTree(d);
                        //this.centerNode(d.parent || d);
                    } else {
                        d.children = d._children;
                        d._children = null;
                        d3.select(d3.event.target).attr('class', 'collapse-icon');
                        // _this.openIds.push(d.id);
                        _this.updateTree(d);

                        //this.centerNode(d);
                    }
                }
                // Toggle children on click.
                function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }

                //Redraw for zoom
                function redraw() {
                    //console.log("here", d3.event.translate, d3.event.scale);
                    var rescale = d3.event.scale;
                    if (_this.nowScale) {
                        rescale = _this.nowScale;
                    }
                    svg.attr("transform",
                        "translate(" + d3.event.translate + ")"
                        + " scale(" + d3.event.scale + ")");
                }
                // 随机获取数字
                function getRandomIntInclusive(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
                }
            }, 'd3');
        }
        // 导出员工汇报关系图
        , exportReportChart: function() {
            console.log(this.zr);
            var _this = this;
            var type = 'png';
            if (_this.personId != '' && _this.reportQueueId != '') {
                var reportChartData = _this.zr.toDataURL("image/octet-stream");
                // 下载后的问题名
                var filename = '汇报关系图' + (new Date()).getTime() + '.' + type;
                // download
                saveFile(reportChartData, filename);
                //console.log(_this.zr.toDataURL('image/octet-stream'));
            } else {
                _this.$Message.error("请选择汇报对象");
            }

            function saveFile(data, filename) {
                var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                save_link.href = data;
                save_link.download = filename;

                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                save_link.dispatchEvent(event);
            };


        }
        //绘制员工汇报关系图
        , createHoleChart: function() {
            var _this = this;
            require.ensure([], () => {
                require('d3');
                var margin = {
                    top: 20,
                    right: 120,
                    bottom: 20,
                    left: 120
                },
                    // 画布大小
                    width = 2000,
                    height = 1000;

                var root = _this.reportChartDatas;
                console.log(root);

                var i = 0,
                    duration = 650,
                    rectW = 270,
                    rectH = 130;

                var tree = d3.layout.tree().nodeSize([rectW + 20, rectH]);

                var maxdepth = 1;
                var minLeft = 0;
                var maxRigth = 1000;
                var tree = d3.layout.tree().nodeSize([rectW + 20, rectH]);
                tree.nodes(root).forEach(function(d) {
                    console.log(d);
                    if (d.depth > maxdepth) {
                        maxdepth = d.depth;
                        console.log(maxdepth);
                    }
                    if (d.x < minLeft) {
                        minLeft = d.x;
                        console.log(minLeft);

                    }
                    if (d.x > maxRigth) {
                        maxRigth = d.x;
                    }
                });
                width = (maxRigth - minLeft);
                if (width > 1000 && width < 3000) {
                    width = width + 210;
                } else if (width > 3000) {
                    width = width + 1500;
                }
                height = (maxdepth + 1) * 200;

                var diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        return [d.x + rectW / 2, d.y + rectH / 2];
                    });
                var zm = d3.behavior.zoom().scaleExtent([0.3, 3]).on("zoom", redraw);
                _this.zoomListener = zm;
                var svg = d3.select("#Main").append("svg").attr("id", "downloadSvg").attr("width", width).attr("height", height)
                    .call(zm).append("g")
                    .attr("transform", "translate(" + (width / 2 - rectW / 2) + "," + 30 + ")").attr("id", "chartContainer2");

                //necessary so that zoom knows where to zoom and unzoom from
                zm.translate([(width / 2 - rectW / 2), 20]);

                root.x0 = 0;
                root.y0 = height / 2;

                function collapse(d) {
                    if (d.children) {
                        d._children = d.children;
                        if (d._children) {
                            d._children.forEach(collapse);

                        }
                        //默认全部展开
                        // d.children = null;
                    }
                }
                if (root.children) {
                    root.children.forEach(collapse);
                }
                update(root);
                //d3.select("#Main").style("height", "800px");

                function update(source) {

                    tree.separation(function(a, b) {
                        return 1;
                    })
                    // Compute the new tree layout.
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);

                    // Normalize for fixed-depth.
                    nodes.forEach(function(d) {
                        d.y = d.depth * 180;
                    });

                    // Update the nodes…
                    var node = svg.selectAll("g.reportnode")
                        .data(nodes, function(d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", function(d) {
                            var reportNode = "reportNode_" + d.id;
                            return "reportnode " + reportNode;
                        })
                        .attr("transform", function(d) {
                            return "translate(" + source.x0 + "," + source.y0 + ")";
                        })
                        .on("click", click);

                    /*创建阴影*/
                    var defs = nodeEnter.append("defs");
                    var filter = defs.append("filter").attr("id", 'rectDef').attr('height', '120%');
                    filter.append('feColorMatrix')
                        .attr('result', 'matrixOut')
                        .attr('in', 'offOut')
                        .attr('type', 'matrix')
                        .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0 0 0 0.1 0.1 0')
                    filter.append('feGaussianBlur')
                        .attr('result', 'blurOut')
                        .attr('in', 'matrixOut')
                        .attr('stdDeviation', 3)
                    filter.append('feBlend')
                        .attr('in', 'SourceGraphic')
                        .attr('in2', 'blurOut')
                        .attr('mode', 'normal')
                    nodeEnter.append("rect")
                        .attr('class', 'node-rect')
                        .attr("width", rectW)
                        .attr("height", rectH)
                        .attr('rx', 5)
                        .attr('ry', 5)
                        .style("fill", '#fff')
                        .attr('filter', 'url(#rectDef)');

                    // 组织基础框架
                    nodeEnter.append("rect")
                        .attr("class", "report-node-rect")
                        .style("fill", "#fff")
                        .attr("rx", 6)
                        .attr("ry", 6)
                        .attr("width", rectW)
                        .attr("height", rectH);
                    // 有头像的
                    // 是否有平级节点
                    nodeEnter.append('rect')
                        .attr("class", "isHavChild")
                        .style('fill', function(d) {
                            var reportNode = svg.select(".reportNode_" + d.id);
                            if (d.isHavChild) {
                                // 没有同级节点
                                console.log(svg.select(".reportNode_" + d.id));
                                noSameLevel(reportNode);
                            } else {
                                // 有同级节点
                                var showType = d.noHavChildList.length;
                                havSameLevel(reportNode, showType);
                            }
                            return 'transparent';
                        })
                    // 没有平级节点
                    function noSameLevel(reportNode) {
                        reportNode.append('rect')
                            .attr("class", "isHavHeadImg")
                            .style("fill", function(d) {
                                // 存在头像

                                if (d.headImg) {
                                    havHeadImg(reportNode, false);
                                } else {
                                    // 不存在头像
                                    noHeadImg(reportNode, false);
                                }
                                rightSideText(reportNode);
                            })
                    }
                    // 有平级节点
                    function havSameLevel(reportNode, type) {

                        if (type == 2) {
                            // 两个人的情况，取noHavChildList[1]
                            paintTwoImgNode(reportNode);
                        } else if (type == 3) {
                            // 三个人的情况 取noHavChildList[1] noHavChildList[2]
                            paintThreeImgNode(reportNode);
                        } else if (type > 3) {
                            // 右侧图片
                            reportNode.append("image")
                                .attr("x", 80)
                                .attr("y", 20)
                                .attr("width", 120)
                                .attr("height", 80)
                                .attr("xlink:href", virtualImage)
                                .on('mouseover', function(d) {
                                    console.log("----------=============");
                                    handleReportNodeMouseOver(d, reportNode)
                                })
                                .on("mouseout", function(d) {
                                    handleReportNodeMouseOut(d, reportNode);
                                    // reportNode.select(".hoverbgtip").remove();
                                    // reportNode.select(".hoverbgcircle").remove();
                                })
                                .on("click", function(d) {
                                    // 点击显示人员列表
                                    isShowPersonTable(d);
                                    console.log(d, "click img");
                                });
                            //提示有多少同级节点
                            reportNode.append("text")
                                .attr("x", 135)
                                .attr("y", 114)
                                .attr("text-anchor", "middle")
                                .attr("fill", "#657180")
                                .style("font", "16px PingFangSC-Medium")
                                .text(function(d) {
                                    return "共" + d.noHavChildList.length + "人";
                                });
                        } else if (type == 1) {
                            // 只有一个数据
                            noSameLevel(reportNode);
                        }
                    }
                    // 显示人员列表表格
                    function isShowPersonTable(resourceD) {
                        _this.tableDatas = [];
                        _this.isShowTable = true;
                        _this.tableAlignLeft = 100;
                        _this.tableAlignTop = resourceD.y + rectH * 2 + 30;
                        _this.tableDatas = resourceD.noHavChildList;
                    }
                    // 处理鼠标移入事件
                    function handleReportNodeMouseOver(overd, reportNode) {


                        reportNode.append("text")
                            .attr("class", "hoverbgtip")
                            .attr("x", 214)
                            .attr("y", 64)
                            .attr("text-anchor", "middle")
                            .attr("fill", "#fff")
                            .text(function(d) {
                                return "查看";
                            })
                            .on('mouseover', function(d) {
                                handleReportNodeMouseOver(overd, reportNode)
                            })
                            .on("mouseout", function(d) {
                                reportNode.select(".hoverbgtip").remove();
                                reportNode.select(".hoverbgcircle").remove();
                            });
                    }
                    // 处理鼠标移出事件
                    function handleReportNodeMouseOut(d, reportNode) {
                        setTimeout(function() {
                            reportNode.selectAll(".hoverbgcircle").remove();
                            reportNode.selectAll(".hoverbgtip").remove();
                        }, 150);
                    }
                    // 不存在头像
                    function noHeadImg(reportNode, isHasName) {
                        // 没有头像的时候,圆圈
                        reportNode.append("circle")
                            .attr("cx", 60)
                            .attr("cy", 60)
                            .attr("r", 28)
                            .attr("fill", function(d) {
                                return _this.headImgColors[getRandomIntInclusive(0, 5)]
                            });
                        // 没有头像时的 名字
                        reportNode.append("text")
                            .attr("x", 60)
                            .attr("y", 64)
                            .attr("text-anchor", "middle")
                            .style({ "fill": "#fff", 'font': '14px PingFangSC-Regular' })
                            .text(function(d) {

                                var personName = d.name;
                                var nameLength = d.name.length;
                                if (nameLength > 3) {
                                    personName = d.name.substring(nameLength - 2, nameLength);
                                }
                                return personName;
                            });
                        // 需要有名字
                        if (isHasName) {
                            reportNode.append("text")
                                .attr("x", 60)
                                .attr("y", 114)
                                .attr("text-anchor", "middle")
                                .style({ "fill": "#657180", 'font': '14px PingFangSC-Regular' })
                                .text(function(d) {
                                    return d.name;
                                });
                        }
                    }
                    // 右侧 名称
                    function rightSideText(reportNode) {
                        // 名称
                        reportNode.append("text")
                            .attr("x", 110)
                            .attr("y", 44)
                            .attr("text-anchor", "left")
                            .style({ 'font': "16px PingFangSC-Regular", "fill": "#657180" })
                            .attr("class", "boldtext")
                            .text(function(d) {
                                return d.name;
                            });
                        reportNode.append("text")
                            .attr("x", 110)
                            .attr("y", 70)
                            .attr("text-anchor", "left")
                            .attr("fill", "#657180")
                            .text(function(d) {
                                var reportPosName = '';
                                if (d.posName && d.posName != '') {
                                    reportPosName = d.posName;
                                } else {
                                    if (d.noHavChildList && d.noHavChildList.length > 0 && d.noHavChildList[0].id == d.id && d.noHavChildList[0].posName && d.noHavChildList[0].posName != '') {
                                        reportPosName = d.noHavChildList[0].posName;
                                    }
                                }
                                return reportPosName;
                            });
                        reportNode.append("text")
                            .attr("x", 110)
                            .attr("y", 96)
                            .attr("text-anchor", "left")
                            .attr("fill", "#657180")
                            .text(function(d) {
                                var reportOrgName = '';
                                if (d.orgName && d.orgName != '') {
                                    reportOrgName = d.orgName;
                                } else {
                                    if (d.noHavChildList && d.noHavChildList.length > 0 && d.noHavChildList[0].id == d.id && d.noHavChildList[0].orgName && d.noHavChildList[0].orgName != '') {
                                        reportOrgName = d.noHavChildList[0].orgName;
                                    }
                                }
                                return reportOrgName;
                            });
                    }
                    // 存在头像
                    function havHeadImg(reportNode, isHasName) {
                        // 圆图片处理
                        reportNode.append("defs")
                            .attr("class", "headimg-defs");

                        reportNode.select(".headimg-defs").append("pattern")
                            .attr("id", "circleImg")
                            .attr("patternUnits", "userSpaceOnUse")
                            .attr("width", 60)
                            .attr("height", 60);
                        reportNode.select(".headimg-defs #circleImg").append("image")
                            .attr("class", "report-node-img")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("width", 60)
                            .attr("height", 60)
                            .attr("xlink:href", function(d) {
                                return _this.filePrefix + "/" + d.headImg;
                            });
                        reportNode.append("circle")
                            .attr("cx", 60)
                            .attr("cy", 60)
                            .attr("r", 30)
                            .attr("fill", function(d) {
                                return "url(#circleImg)";
                            });
                        // 需要有名字
                        if (isHasName) {
                            reportNode.append("text")
                                .attr("x", 60)
                                .attr("y", 114)
                                .attr("text-anchor", "middle")
                                .style({ "fill": "#657180", 'font': '14px PingFangSC-Regular' })
                                .text(function(d) {
                                    return d.name;
                                });
                        }
                    }
                    // 绘制两个头像的
                    function paintTwoImgNode(reportNode) {
                        reportNode.append('rect')
                            .attr("class", 'isHavHeadImg')
                            .style("fill", function(d) {
                                var node1 = d.noHavChildList[0]; // 第一个节点
                                var node2 = d.noHavChildList[1]; // 第一个节点
                                var nodePosition1 = {
                                    normalcy: 60,
                                    normalcx: 95,
                                    normalty: 64,
                                    normaltx: 95,
                                    normaldty: 114,
                                    normaldtx: 95,
                                    imgx: 30,
                                    imgy: 0
                                }
                                var nodePosition2 = {
                                    normalcy: 60,
                                    normalcx: 175,
                                    normalty: 64,
                                    normaltx: 175,
                                    normaldty: 114,
                                    normaldtx: 175,
                                    imgx: 30,
                                    imgy: 0
                                }
                                if (node1.headImg && node1.headImg != '') {
                                    paintHaveImgByPos(reportNode, true, nodePosition1, node1);
                                } else {
                                    paintNoHavImgByPos(reportNode, true, nodePosition1, node1);

                                }
                                if (node2.headImg && node2.headImg != '') {
                                    paintHaveImgByPos(reportNode, true, nodePosition2, node2);

                                } else {
                                    paintNoHavImgByPos(reportNode, true, nodePosition2, node2);

                                }
                            });
                    }
                    // 绘制三个头像的
                    function paintThreeImgNode(reportNode) {

                        reportNode.append('rect')
                            .attr("class", "isHavHeadImg")
                            .style("fill", function(d) {
                                // 存在头像

                                if (d.headImg) {
                                    havHeadImg(reportNode, true);
                                } else {
                                    // 不存在头像
                                    noHeadImg(reportNode, true);
                                }

                                console.log(d);
                                var node2 = d.noHavChildList[1];// 第二个节点
                                var node3 = d.noHavChildList[2]; // 第三个节点
                                // 第二个节点的位置
                                var nodePosition2 = {
                                    normalcy: 60,
                                    normalcx: 132,
                                    normalty: 64,
                                    normaltx: 132,
                                    normaldty: 114,
                                    normaldtx: 132,
                                    imgx: 30,
                                    imgy: 0
                                };
                                // 第三个节点的位置
                                var nodePosition3 = {
                                    normalcy: 60,
                                    normalcx: 205,
                                    normalty: 64,
                                    normaltx: 205,
                                    normaldty: 114,
                                    normaldtx: 205,
                                    imgx: 60,
                                    imgy: 0
                                };
                                if (node2.headImg && node2.headImg != '') {

                                    paintHaveImgByPos(reportNode, true, nodePosition2, node2);
                                } else {
                                    paintNoHavImgByPos(reportNode, true, nodePosition2, node2);
                                }
                                if (node3.headImg && node3.headImg != '') {
                                    paintHaveImgByPos(reportNode, true, nodePosition3, node3);
                                } else {
                                    paintNoHavImgByPos(reportNode, true, nodePosition3, node3);
                                }
                                return "transparent"
                            });
                    }
                    // 根据节点为指绘制有头像的图形
                    /** 
                     content:绘制节点的基本信息
                     position:该节点的位置
                     isHasName:是否需要名字
                     reportNode:该节点
                    */
                    function paintHaveImgByPos(reportNode, isHasName, position, content) {
                        // 圆图片处理
                        reportNode.append("defs")
                            .attr("class", "headimg-defs");

                        reportNode.select(".headimg-defs").append("pattern")
                            .attr("id", "circleImg")
                            .attr("patternUnits", "userSpaceOnUse")
                            .attr("width", 60)
                            .attr("height", 60);
                        reportNode.select(".headimg-defs #circleImg").append("image")
                            .attr("class", "report-node-img")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("width", 60)
                            .attr("height", 60)
                            .attr("xlink:href", function(d) {
                                return _this.filePrefix + "/" + d.headImg;
                            });
                        reportNode.append("circle")
                            .attr("cx", position.normalcx)
                            .attr("cy", position.normalcy)
                            .attr("r", 30)
                            .attr("fill", function(d) {
                                return "url(#circleImg)";
                            });
                        // 需要有名字
                        if (isHasName) {
                            reportNode.append("text")
                                .attr("x", position.normaldtx)
                                .attr("y", position.normaldty)
                                .attr("text-anchor", "middle")
                                .attr("fill", "#657180")
                                .text(function(d) {
                                    return content.name;
                                });
                        }
                    }
                    function paintNoHavImgByPos(reportNode, isHasName, position, content) {
                        // 没有头像的时候,圆圈
                        reportNode.append("circle")
                            .attr("cx", position.normalcx) // cx
                            .attr("cy", position.normalcy) // cy
                            .attr("r", 28)
                            .attr("fill", function(d) {
                                return _this.headImgColors[getRandomIntInclusive(0, 5)]
                            });
                        // 没有头像时的 名字
                        reportNode.append("text")
                            .attr("x", position.normaltx) //tx
                            .attr("y", position.normalty) //ty
                            .attr("text-anchor", "middle")
                            .attr("fill", "#fff")
                            .text(function(d) {
                                // 使用content的名字

                                var personName = content.name;
                                var nameLength = personName.length;
                                if (nameLength > 3) {
                                    personName = personName.substring(nameLength - 2, nameLength);
                                }
                                return personName;
                            });
                        // 需要有名字
                        if (isHasName) {
                            reportNode.append("text")
                                .attr("x", position.normaldtx) // dtx 下方的x和y
                                .attr("y", position.normaldty) //dty 
                                .attr("text-anchor", "middle")
                                .attr("fill", "#657180")
                                .text(function(d) {
                                    var pname = content.name;
                                    if (pname.length >= 4) {
                                        pname = pname.substring(0, 4) + "...";
                                    }
                                    return pname;
                                });
                        }
                    }


                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    nodeUpdate.select("rect")
                        .attr("font-size", 24)
                        .attr("width", rectW)
                        .attr("height", rectH);

                    nodeUpdate.select("text")
                        .style("fill-opacity", 1)

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + source.x + "," + source.y + ")";
                        })
                        .remove();

                    nodeExit.select("rect")
                        .attr("width", rectW)
                        .attr("height", rectH)
                        .style("fill", "#fff");

                    nodeExit.select("text");

                    // 连线
                    var link = svg.selectAll("path.link")
                        .data(links, function(d) {
                            return d.target.id;
                        });

                    link.enter().insert("path", "g")
                        .data(links)
                        .attr("class", "link")
                        .attr("x", rectW)
                        .attr("y", rectH / 2)
                        .attr("d", connect)
                        .style('opacity', 0)
                        .style('stroke', function(d, i) {
                            return '#D1D8E0'
                        })
                        .style('stroke-width', 1.2)
                        .style('fill', 'none')

                    link.transition()
                        .duration(duration)
                        .attr("d", connect)
                        .style('opacity', 1)

                    link.exit().transition()
                        .duration(duration)
                        .style('opacity', 0)
                        .remove();

                    function connect(d, i) {
                        return "M" + (d.source.x + rectW / 2) + "," + (d.source.y + rectH)
                            + "V" + (d.source.y + 160)
                            + "H" + (d.target.x + rectW / 2)
                            + "V" + (d.target.y);
                    };

                    // 上下图标
                    d3.selectAll('.collapse-icon').remove();
                    node.append('image').attr('x', rectW / 2 - 18).attr('y', 126).attr("width", 36).attr("height", 24)
                        .filter((d) => {
                            return (d.children && d.children.length) || (d._children && d._children.length)
                        })
                        .attr("xlink:href", _this.downImg)
                        .attr('class', function(d) {
                            return d.children ? 'collapse-icon' : 'collapse-icon collapse-icon-rotate'
                        })
                        .on("click", _this.handleCollapseClick)
                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }



                function handleCollapseClick(d) {
                    event.stopPropagation();
                    // var index = _this.openIds.indexOf(d.id);
                    // if (index > -1) {
                    //     _this.openIds.splice(index, 1);
                    // }
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                        d3.select(d3.event.target).attr('class', 'collapse-icon collapse-icon-rotate');
                        _this.updateTree(d);
                        //this.centerNode(d.parent || d);
                    } else {
                        d.children = d._children;
                        d._children = null;
                        d3.select(d3.event.target).attr('class', 'collapse-icon');
                        // _this.openIds.push(d.id);
                        _this.updateTree(d);

                        //this.centerNode(d);
                    }
                }
                // Toggle children on click.
                function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }

                //Redraw for zoom
                function redraw() {
                    //console.log("here", d3.event.translate, d3.event.scale);
                    svg.attr("transform",
                        "translate(" + d3.event.translate + ")"
                        + " scale(" + d3.event.scale + ")");
                }
                // 随机获取数字
                function getRandomIntInclusive(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
                }
            }, 'd3');

        }
        /**
         * 点击左侧下拉树导航的回调
         * @data 被点击树节点的节点数据
         * */
        , clickMenuCallback: function(data) {
            var t = this;
            console.log(data);
            t.personId = data.id;

            if (data.customerMap.report_id_queue) {
                t.reportQueueId = data.customerMap.report_id_queue;
                // 保存到本地的personid和reportQueueId
                localStorage.setItem("reportPersonId", t.personId);
                localStorage.setItem("reportQueueId", t.reportQueueId);
                //隐藏提示信息
                t.isShowSelectTip = false;
                t.refreshReportStructure();
            } else {
                t.$Message.error('请选择人员');
            }

            // t.refreshOrgStructure();
        },
        // 弹出初始化弹窗
        initReportRelation: function() {
            var _this = this;
            _this.isShowInitReportConfirm = true;
        },
        showChangeReport: function(dtarget) {
            var _this = this;

        }
        // 关闭table
        , closeTable: function() {
            $(".hoverbgtip").remove();
            $(".myhoverbgtip").remove();
            this.isShowTable = false;
            console.log("111");
        },
        // 确认初始化
        confirmToInit: function() {
            var _this = this;
            _this.isShowInitReportConfirm = false;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "personReport/initReportPersonData.do",
                data: JSON.stringify({}),
                success: function(data) {
                    _this.$Message.success("初始化成功");
                    console.log(data);
                    // 不为空
                    if (_this.personId != '' && _this.reportQueueId != '') {
                        _this.refreshReportStructure();
                    }
                }
            });
        },
        // 取消初始化
        cancelToInt: function() {
            this.isShowInitReportConfirm = false;
        }
        //导出 图片 
        , exportChart: function() {
            var _this = this;
            var svgTool = require('save-svg-as-png');
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var title = "汇报关系图" + year + month + day;

            svgTool.saveSvgAsPng($("#downloadSvg")[0], title + ".png");

        }
        // 处理放大缩小事件
        , handleZoom: function(type) {
            var num = type == '+' ? 0.2 : -0.2;
            var scale = this.zoomListener.scale();
            var translate = this.zoomListener.translate();
            scale = scale + num;
            if (scale > 3 || scale < 0.3) {
                if (scale > 3) {
                    scale = 3;
                } else {
                    scale = 0.3;
                }
            }
            this.nowScale = scale;
            this.zoomListener.scale(scale);

            var xpos = ($("#Main").width()) / 2 - 270 / 2;
            d3.select('#chartReportContainer')
                .transition()
                .duration(300)
                .attr("transform",
                "translate(" + xpos + "," + 20 + ")" +
                " scale(" + scale + ")");
        }
        , showEditReporter: function(infos) {
            var _this = this;
            console.log(infos);
            // $("#Main .editIcon_normal").remove();
            var reportName = infos.name;
            if (infos.name.length > 6) {
                reportName = reportName.substring(0, 6) + "...";
            }
            _this.changeReport.fullReportName = infos.name;
            _this.changeReport.oldReportName = reportName;
            _this.changeReport.oldReportId = infos.id;
            _this.changeReport.isShowChangeReporter = true;
        }
        //更改汇报人的信息
        , setDropSelectData: function(node, type) {
            var _this = this;
            console.log(node);
            _this.changeReport.newReportName = node.value;
        }
        , confirmToChange: function() {
            var _this = this;
            //提交修改
            var params = {
                newSubPersonReportId: parseInt(_this.changeReport.newReportName),
                personId: parseInt(_this.changeReport.oldReportId)
            }
            if (_this.changeReport.newReportName == '') {
                _this.changeReport.isShowErrorTip = true;
            } else {
                _this.changeReport.isShowErrorTip = false;
                console.log(params);
                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "personReport/deliverySubPerson"
                    , data: JSON.stringify(params)
                    , success: function(data) {
                        if (data.result == "true") {
                            _this.$Message.success("更改成功！");
                            _this.changeReport.newReportName = ""; // 置空选择的数据
                            // 刷新数据
                            _this.refreshReportStructure();
                        }
                        _this.changeReport.isShowChangeReporter = false;
                    }
                });
            }

        }
        , cancelToChange: function() {
            var _this = this;
            _this.changeReport.oldReportName = "";
            _this.changeReport.oldReportId = "";
            _this.changeReport.newReportName = "";
            _this.changeReport.isShowChangeReporter = false;//隐藏弹窗
            _this.changeReport.isShowErrorTip = false;//隐藏错误提示
        }
    }
}

</script>


