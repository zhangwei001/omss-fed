
<template>
    <div>
        <div class="page_top_org_nav">
            <ul class="page-top-left-link">
                <router-link class="org_nav_link" to="/org_list">组织列表</router-link>
                <span class="seperate_ver_line">|</span>
                <router-link class="org_nav_link" style="color:#F18950;" to="/org_chart">组织架构图</router-link>
                <span class="seperate_ver_line">|</span>
                <router-link class="org_nav_link" to="/report_chart">汇报关系图</router-link>
            </ul>
        </div>
        <button class="btn_padding page_btn" @click="exportOrganazationChart">导出架构图</button>
        <div class="right_filter_selection">
            <Checkbox v-for="item in orgFilters" :label="item.label" :key="item.id" v-model="item.value" true-value="true" false-value="false" on-change="show">
                <span>{{item.label}}</span>
            </Checkbox>
        </div>
        <page-tree-menu :navigationData="orgNavDatas" @clickMenuCallback="clickMenuCallback" ref="pageTreeMenu"></page-tree-menu>
        <div class="org_select_tip">&nbsp;&nbsp;点击这里可以切换图形中的顶级组织</div>
        <button v-if="isShowResetBtn" class="reset_page_btn reset_btn" style="float:right;margin:20px 20px;" @click="refreshOrgStructure">
            <i class="iconfont_daydao_common" title="重置">&#xe618;</i>
        </button>
        <div v-if="isShowResetBtn" class="scale_btn" style="float:right;">
            <i class="iconfont_daydao_common btn-padding" style="display:block;" @click="handleZoom('+')" title="放大">&#xe619;</i>
            <i class="iconfont_daydao_common btn-padding" @click="handleZoom('-')" title="缩小">&#xe61a;</i>
        </div>

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

.btn-padding {
    background: #fff;
    padding: 10px;
}

.btn-padding:hover {
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

.org_select_tip {
    background-color: #FFF6EE;
    height: 30px;
    color: #F18950;
    line-height: 30px;
    font-size: 12px;
}

.scale_btn {
    position: absolute;
    margin: 65px 20px;
    right: 0px;
    z-index: 999;
}

.right_filter_selection {
    float: right;
    margin-right: 20px;
    margin-top: 25px;
}


.node {
    cursor: pointer;
}

.node text {
    font: 14px PingFangSC-Regular;
}

.link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
}

// 组织节点的样式
.node rect {
    fill: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(101, 113, 128, 0.12);
    border-radius: 2px;
}
.node-rect{
    fill:#fff;
}

// 组织名称
.node .org-name {
    font: 16px "PingFangSC-Regular";
    fill: #657180;
}

// 组织超编
.node .org-over-fill {
    fill: #FF5557;
}

// 超编文字提示
.node .org-over-fill-tip {
    font: 12px "PingFangSC-Regular";
}

// 分割线
.node .org-chart-line {
    stroke: #E3E8EE;
    stroke-width: 1;
}

// 信息项
.node .org-chart-info-item {
    font: 14px "PingFangSC-Regular";
}

.node .org-chart-info-item-tip {
    fill: #939BA6;
}

.collapse-icon:hover {
    opacity: .7;
}

.collapse-icon-rotate {
    transform: rotate(180deg);
    transform-origin: center;
}

#orgdownloadchart {
    display: none;
}
</style>

<script type="text/babel">

import pageTreeMenu from "commonVueLib/pageTreeMenu/index";
import downImg from "assets/images/down.png"
import upImg from "assets/images/up.png"
const infoSetId = "org_chart";

export default {
    name: infoSetId
    , components: {
        pageTreeMenu //组织树
    }
    , data() {
        var t = this;
        return {
            orgNavDatas: []
            // 组织的筛选状态
            , orgFilters: [
                { label: "显示禁用组织", id: "isShowDisableOrg", value: "false" }, //是否禁用组织，默认为禁用
                //{ label: "显示组织负责人", id: "isShowLeader", value: "true" }, //显示组织负责人 默认为true
                //{ label: "显示编制人数", id: "isShowStaff", value: "true" }, //显示编制 默认为true
                //{ label: "显示在职人数", id: "isShowPersonCount", value: "true" }, //显示人数 默认为true
                { label: "人数包含子组织", id: "isHavChild", value: "true" },//人数包含子部门 默认为true
                { label: "显示人数为0的组织", id: "isShowZeroOrg", value: "true" }, // 不显示人数为0的组织 默认为true
            ]
            , orgId: "" //组织Id
            , isShowResetBtn: false
            , zr: {}
            , orgChartTreeData: {} // 组织架构图的数据
            , zoomListener: {} // 监听缩放事件
            , downImg: upImg
            , upImg: upImg
        };
    }
    , watch: {
        // 监听筛选条件变化
        orgFilters: {
            handler: function(val, oldVal) {
                this.refreshOrgStructure();
            },
            deep: true
        }
    }
    , mounted() {
        var t = this;
        t.init();
        //t.$refs.tableDataList.exportExcel = t.exportExcel;
    }
    , methods: {
        initTreeMenu: function() {
            var _this = this;
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "orgStructure/getOrgNavigationData.do",
                data: JSON.stringify({}),
                success: function(data) {
                    //_this.addPersonTemplate.editColumns=_this.addPersonTemplate.editColumns.concat(data.columnEdit);
                    try {
                        _this.orgNavDatas = data.dayHrTreeNodeList;
                        _this.orgId = data.dayHrTreeNodeList[0].id;
                        _this.refreshOrgStructure();
                    } catch (e) {
                        console.log(e.message);
                    }

                }
            });
        },
        refreshOrgStructure: function() {
            var _this = this;
            var oPostData = _this.orgFilters;
            var params = {}
            params["orgId"] = _this.orgId;
            // 遍历拼装请求数据
            oPostData.forEach(function(item, index) {
                if (item.value == 'true') {
                    params[item.id] = true;
                } else {
                    params[item.id] = false;
                }
            });
            // 第一版默认显示组织负责人，显示编制人数，显示在职人数
            params['isShowLeader'] = true;
            params['isShowStaff'] = true;
            params['isShowPersonCount'] = true;
            _this.orgChartTreeData = {};
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "orgStructure/orgStructureData.do",
                data: JSON.stringify(params),
                success: function(data) {
                    //_this.addPersonTemplate.editColumns=_this.addPersonTemplate.editColumns.concat(data.columnEdit);
                    try {
                        if (data.orgDayHrTreeNodeExtBeanList && data.orgDayHrTreeNodeExtBeanList.length > 0) {
                            // 显示按钮
                            _this.isShowResetBtn = true;
                            //_this.paintOrgChart(data);
                            _this.orgChartTreeData = data.orgDayHrTreeNodeExtBeanList[0];
                            $("#mainOrgChart").remove();
                            $("#orgdownloadchart").remove();
                            // 下载图片的绘制
                            _this.downLoadOrganazationChart();
                            _this.paintOrganazationChart();
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

        }
        , paintOrganazationChart() {
            var _this = this;
            require.ensure([], () => {
                require('d3');
                var margin = {
                    top: 20,
                    right: 120,
                    bottom: 20,
                    left: 120
                },
                    // 画布的大小
                    width = $("#Main").width() - 20,
                    height = $("#Main").height();

                var root = _this.orgChartTreeData;
                console.log(root);

                var i = 0,
                    duration = 650,
                    rectW = 270,
                    rectH = 130;

                var tree = d3.layout.tree().nodeSize([rectW + 20, rectH]);
                var diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        return [d.x + rectW / 2, d.y + rectH / 2];
                    });
                var zm = d3.behavior.zoom().scale([0.8]).scaleExtent([0.3, 3]).on("zoom", redraw);
                _this.zoomListener = zm;
                //+ " scale(" + 0.8 + ")"
                var svg = d3.select("#Main").append("svg").attr("id", "mainOrgChart").attr("width", width).attr("height", height)
                    .call(zm).append("g")
                    .attr("transform", "translate(" + (width / 2 - rectW / 2) + "," + 20 + ")" + " scale(" + 0.8 + ")").attr("id", "chartOrgContainer");
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
                        //d.children = null;
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
                        d.y = d.depth * 200;
                    });

                    // Update the nodes…
                    var node = svg.selectAll("g.node")
                        .data(nodes, function(d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {
                            return "translate(" + source.x0 + "," + source.y0 + ")";
                        })
                        .on("click", click);

                    /*创建阴影*/
                    var defs = nodeEnter.append("defs");
                    var filter = defs.append("filter").attr("id", 'rectDef').attr('height', '110%');
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
                        .attr("class", "orgNodeRect")
                        .attr("rx", 6)
                        .attr("ry", 6)
                        .attr("width", rectW)
                        .attr("height", rectH);

                    // 组织名称顶级，靠左 ,如果文字超过了隐藏 显示13字符
                    nodeEnter.append("text")
                        .attr("class", "org-name")
                        .attr("x", 16)
                        .attr("y", 26)
                        .attr("text-anchor", "left")
                        .text(function(d) {
                            var orgName = d.name;
                            if (orgName.length > 12) {
                                orgName = orgName.substring(0, 11) + "..."
                            }
                            return orgName;
                        })
                        .on("mouseover", function(d) {
                            console.log(d);
                        });
                    // title 分割线
                    nodeEnter.append("line")
                        .attr("class", "org-chart-line")
                        .attr("x1", 0)
                        .attr("x2", rectW)
                        .attr("y1", 40)
                        .attr("y2", 40);
                    // 第一个信息项
                    nodeEnter.append('rect')
                        .attr("class", "org-chart-info-item")
                        .attr("width", rectW)
                        .attr("y", 46)
                        .attr("height", 18);

                    // 三行 三个y位置：62 ，88 112
                    var itemy1 = 62, itemy2 = 88, itemy3 = 112;
                    // var isShowOrgLeader = _this.orgFilters[1].value; //显示组织负责人
                    // var isShowStaff = _this.orgFilters[3].value; // 在职人员
                    // var isShowRegist = _this.orgFilters[2].value; //显示编制
                    var isShowOrgLeader = "true"; //显示组织负责人
                    var isShowStaff = "true" // 在职人员
                    var isShowRegist = "true" //显示编制
                    // 控制是否显示负责人
                    if (isShowOrgLeader == 'true') {
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .attr("x", 38)
                            .attr("y", itemy1)
                            .attr("text-anchor", "middle")
                            .text("负责人");
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .attr("x", 76)
                            .attr("y", itemy1)
                            .attr("text-anchor", "right")
                            .text(function(d) {
                                var orgLeader = "未设置负责人";
                                var leaderPosName = ""
                                var verticalLine = " | "
                                if (d.leaderName) {
                                    orgLeader = d.leaderName;
                                }
                                if (d.leaderPosName) {
                                    leaderPosName = d.leaderPosName;
                                }
                                if (leaderPosName == '') {
                                    verticalLine = "";
                                }
                                return orgLeader + verticalLine + leaderPosName;
                            });
                    }
                    var realItemy2 = itemy2;
                    //如果没有负责人，则在第一个位置
                    if (isShowOrgLeader == 'false') {
                        realItemy2 = itemy1;
                    }
                    //控制显示在职人数
                    if (isShowStaff == "true") {
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .attr("x", 30)
                            .attr("y", realItemy2)
                            .attr("text-anchor", "right")
                            .text("在职");
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .attr("x", 76)
                            .attr("y", realItemy2)
                            .attr("text-anchor", "right")
                            .text(function(d) {
                                return d.registerCount + "人";
                            });
                    }
                    var realItemy3 = itemy3;

                    if ((isShowOrgLeader == "true" && isShowStaff == 'false') || (isShowOrgLeader == "false" && isShowStaff == 'true')) {
                        // 只有一项
                        realItemy3 = itemy2;
                    } else if (isShowOrgLeader == 'false' && isShowStaff == 'false') {
                        // 没有
                        realItemy3 = itemy1;
                    }
                    if (isShowRegist == 'true') {
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .attr("x", 30)
                            .attr("y", realItemy3)
                            .attr("text-anchor", "right")
                            .text("编制");

                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .attr("x", 76)
                            .attr("y", realItemy3)
                            .attr("text-anchor", "right")
                            .text(function(d) {
                                if (d.tip && d.tip == '2') {
                                    return "未设置编制"
                                } else {
                                    return d.staffCount + "人";
                                }
                            });
                    }

                    // 超编 ，禁用的显示

                    nodeEnter.append("rect")
                        .attr("class", "org-over-fill")
                        .attr("x", rectW - 44)
                        .attr("y", 10)
                        .attr("width", 36)
                        .attr("height", 20)
                        .style("fill", function(d) {
                            if (d.tip && d.tip == '2') {
                                //未设置编制不现实超编
                                return "transparent"
                            } else {
                                // 在职-编制>0
                                if (d.registerCount - d.staffCount > 0) {
                                    return "#FF5557"
                                } else {
                                    return "transparent";
                                }
                            }

                        });
                    nodeEnter.append("text")
                        .attr("class", 'org-over-fill-tip')
                        .attr("x", rectW - 26)
                        .attr("y", 23)
                        .style('text-anchor', "middle")
                        .style({ 'font': '12px PingFangSC-Regular', "fill": "#fff" })
                        .text(function(d) {
                            if (d.tip && d.tip == '2') {
                                //未设置编制不显示超编
                                return ""
                            } else {
                                // 在职-编制>0
                                if (d.registerCount - d.staffCount > 0) {
                                    return "超编"
                                } else {
                                    return "";
                                }
                            }
                        });
                    nodeEnter.append("rect")
                        .attr("class", "org-over-fill")
                        .attr("x", rectW - 44)
                        .attr("y", 10)
                        .attr("width", 36)
                        .attr("height", 20)
                        .style("fill", function(d) {
                            if (d.chkDisabled) {
                                return "#657180"
                            } else {
                                return "transparent";
                            }
                        });
                    nodeEnter.append("text")
                        .attr("class", 'org-over-fill-tip')
                        .attr("x", rectW - 26)
                        .attr("y", 23)
                        .style('text-anchor', "middle")
                        .style("fill", "#fff")
                        .text(function(d) {
                            if (d.chkDisabled) {
                                return "禁用"
                            } else {
                                return "";
                            }

                        });

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
            }, 'd3');

        }
        , exportOrgChart: function() {
            var _this = this;
            var type = "png";
            _this.zr.resize();
            var imgData = _this.zr.toDataURL("image/octet-stream");
            var filename = "组织架构图" + (new Date()).getTime() + '.' + type;

            saveFile(imgData, filename);
            function saveFile(data, filename) {
                var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                save_link.href = data;
                save_link.download = filename;

                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                save_link.dispatchEvent(event);
            };
        }
        /**
         * 点击左侧下拉树导航的回调
         * @data 被点击树节点的节点数据
         * */
        , clickMenuCallback: function(data) {
            var t = this;
            t.orgId = data.id;
            t.refreshOrgStructure();
        }
        // 导出的图，绘制
        , downLoadOrganazationChart() {
            var _this = this;
            require.ensure([], () => {
                require('d3');
                var margin = {
                    top: 20,
                    right: 120,
                    bottom: 20,
                    left: 120
                },
                    // 画布的大小
                    width = 2000,
                    height = 1000;
                var root = _this.orgChartTreeData;


                var i = 0,
                    duration = 650,
                    rectW = 270,
                    rectH = 130;
                var maxdepth = 1;
                var minLeft = 0;
                var maxRigth = 1000;
                var tree = d3.layout.tree().nodeSize([rectW + 20, rectH]);
                tree.nodes(root).forEach(function(d) {
                    if (d.depth > maxdepth) {
                        
                        maxdepth = d.depth;
                    }
                    if (d.x < minLeft) {
                        minLeft = d.x;
                    }
                    if (d.x > maxRigth) {
                        maxRigth = d.x;
                    }
                });
                width = (maxRigth - minLeft);
                if (width > 1000 && width < 3000) {
                    width = width + 210;
                } else if (width > 3000) {
                    width = width + 210;
                }
                height = (maxdepth + 1) * 200;


                var diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        return [d.x + rectW / 2, d.y + rectH / 2];
                    });
                var zm = d3.behavior.zoom().scaleExtent([0.3, 3]).on("zoom", redraw);
                _this.zoomListener = zm;
                var svg = d3.select("#Main").append("svg").attr("id", "orgdownloadchart").attr("width", width).attr("height", height)
                    .call(zm).append("g")
                    .attr("transform", "translate(" + (width / 2 - rectW / 2) + "," + 30 + ")").attr("id", "chartContainer");

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
                        //d.children = null;
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
                        d.y = d.depth * 200;
                    });

                    // Update the nodes…
                    var node = svg.selectAll("g.node")
                        .data(nodes, function(d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
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
                        .attr('stdDeviation', 4)
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
                        .attr("class", "orgNodeRect")
                        .attr("fill", "#fff")
                        .attr("rx", 6)
                        .attr("ry", 6)
                        .attr("width", rectW)
                        .attr("height", rectH);

                    // 组织名称顶级，靠左 ,如果文字超过了隐藏 显示13字符
                    //font: 16px "PingFangSC-Regular" fill: #657180;
                    nodeEnter.append("text")
                        .attr("class", "org-name")
                        .style({ 'font': '16px PingFangSC-Regular', 'fill': '#657180' })
                        .attr("x", 16)
                        .attr("y", 26)
                        .attr("text-anchor", "left")
                        .text(function(d) {
                            var orgName = d.name;
                            if (orgName.length > 12) {
                                orgName = orgName.substring(0, 11) + "..."
                            }
                            return orgName;
                        })
                        .on("mouseover", function(d) {
                            console.log(d);
                        });
                    // title 分割线
                    //                 stroke: #E3E8EE;
                    // stroke-width: 1;
                    nodeEnter.append("line")
                        .attr("class", "org-chart-line")
                        .style({ 'stroke': '#E3E8EE', 'stroke-width': 1 })
                        .attr("x1", 0)
                        .attr("x2", rectW)
                        .attr("y1", 40)
                        .attr("y2", 40);
                    // 第一个信息项-------------------------------------------------------------------------

                    nodeEnter.append('rect')
                        .attr("class", "org-chart-info-item")
                        .style({ 'font': '14px PingFangSC-Regular', 'fill': '#fff' })
                        .attr("width", rectW)
                        .attr("y", 46)
                        .attr("height", 18);

                    // 三行 三个y位置：62 ，88 112
                    var itemy1 = 62, itemy2 = 88, itemy3 = 112;
                    //var isShowOrgLeader = _this.orgFilters[1].value; //显示组织负责人
                    // var isShowStaff = _this.orgFilters[3].value; // 在职人员
                    // var isShowRegist = _this.orgFilters[2].value; //显示编制
                    var isShowOrgLeader = "true"; //显示组织负责人
                    var isShowStaff = "true"; // 在职人员
                    var isShowRegist = "true"; //显示编制
                    // 控制是否显示负责人 fill: #939BA6;
                    if (isShowOrgLeader == 'true') {
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .style({ "fill": "#939BA6", 'font': '14px PingFangSC-Regular' })
                            .attr("x", 38)
                            .attr("y", itemy1)
                            .attr("text-anchor", "middle")
                            .text("负责人");
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .style({ "fill": "#939BA6", 'font': '14px PingFangSC-Regular' })
                            .attr("x", 76)
                            .attr("y", itemy1)
                            .attr("text-anchor", "right")
                            .text(function(d) {
                                var orgLeader = "未设置负责人";
                                var leaderPosName = ""
                                var verticalLine = " | "
                                if (d.leaderName) {
                                    orgLeader = d.leaderName;
                                }
                                if (d.leaderPosName) {
                                    leaderPosName = d.leaderPosName;
                                }
                                if (leaderPosName == '') {
                                    verticalLine = "";
                                }
                                return orgLeader + verticalLine + leaderPosName;
                            });
                    }
                    var realItemy2 = itemy2;
                    //如果没有负责人，则在第一个位置
                    if (isShowOrgLeader == 'false') {
                        realItemy2 = itemy1;
                    }
                    //控制显示在职人数
                    if (isShowStaff == "true") {
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .style({ "fill": "#939BA6", 'font': '14px PingFangSC-Regular' })
                            .attr("x", 30)
                            .attr("y", realItemy2)
                            .attr("text-anchor", "right")
                            .text("在职");
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .style({ "fill": "#939BA6", 'font': '14px PingFangSC-Regular' })
                            .attr("x", 76)
                            .attr("y", realItemy2)
                            .attr("text-anchor", "right")
                            .text(function(d) {
                                return d.registerCount + "人";
                            });
                    }
                    var realItemy3 = itemy3;

                    if ((isShowOrgLeader == "true" && isShowStaff == 'false') || (isShowOrgLeader == "false" && isShowStaff == 'true')) {
                        // 只有一项
                        realItemy3 = itemy2;
                    } else if (isShowOrgLeader == 'false' && isShowStaff == 'false') {
                        // 没有
                        realItemy3 = itemy1;
                    }
                    if (isShowRegist == 'true') {
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .style({ "fill": "#939BA6", 'font': '14px PingFangSC-Regular' })
                            .attr("x", 30)
                            .attr("y", realItemy3)
                            .attr("text-anchor", "right")
                            .text("编制");
                        nodeEnter.append("text")
                            .attr("class", "org-chart-info-item-tip")
                            .style({ "fill": "#939BA6", 'font': '14px PingFangSC-Regular' })
                            .attr("x", 76)
                            .attr("y", realItemy3)
                            .attr("text-anchor", "right")
                            .text(function(d) {
                                if (d.tip && d.tip == '2') {
                                    return "未设置编制"
                                } else {
                                    return d.staffCount + "人";

                                }
                            });
                    }

                    // 超编 ，禁用的显示

                    nodeEnter.append("rect")
                        .attr("class", "org-over-fill")
                        .attr("x", rectW - 44)
                        .attr("y", 10)
                        .attr("width", 36)
                        .attr("height", 20)
                        .style("fill", function(d) {
                            if (d.tip && d.tip == '2') {
                                return "transparent";
                            } else {
                                if (d.registerCount - d.staffCount) {
                                    return "#FF5557"
                                } else {
                                    return "transparent";
                                }
                            }

                        });
                    nodeEnter.append("text")
                        .attr("class", 'org-over-fill-tip')
                        .attr("x", rectW - 26)
                        .attr("y", 23)
                        .style('text-anchor', "middle")
                        .style({ "fill": "#fff", 'font': '12px PingFangSC-Regular' })
                        .text(function(d) {
                            if (d.tip && d.tip == '2') {
                                return ""
                            } else {
                                if (d.registerCount - d.staffCount) {
                                    return "超编"
                                } else {
                                    return "";
                                }
                            }


                        });
                    nodeEnter.append("rect")
                        .attr("class", "org-over-fill")
                        .attr("x", rectW - 44)
                        .attr("y", 10)
                        .attr("width", 36)
                        .attr("height", 20)
                        .style("fill", function(d) {
                            if (d.chkDisabled) {
                                return "#657180"
                            } else {
                                return "transparent";
                            }
                        });
                    nodeEnter.append("text")
                        .attr("class", 'org-over-fill-tip')
                        .attr("x", rectW - 26)
                        .attr("y", 23)
                        .style('text-anchor', "middle")
                        .style({ "fill": "#fff", 'font': '12px PingFangSC-Regular' })
                        .text(function(d) {
                            if (d.chkDisabled) {
                                return "禁用"
                            } else {
                                return "";
                            }

                        });

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
            }, 'd3');

        }
        // 导出组织架构图
        , exportOrganazationChart: function() {
            var _this = this;
            try {
                var svgTool = require('save-svg-as-png');
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var title = "组织架构图" + year+month+day;
                svgTool.saveSvgAsPng($("#orgdownloadchart")[0], title + ".png");
            } catch (e) {
                console.log(e);
            }
        }
        // 处理放大缩小事件
        , handleZoom: function(type) {
            console.log("---------------");
            var num = type == '+' ? 0.2 : -0.2;
            var scale = this.zoomListener.scale();
            var translate = this.zoomListener.translate();
            scale = scale + num;
            this.zoomListener.scale(scale);
            d3.select('#chartOrgContainer')
                .transition()
                .duration(300)
                .attr("transform",
                "translate(" + translate + ")" +
                " scale(" + scale + ")");
        }
        ,
    }
}

</script>


