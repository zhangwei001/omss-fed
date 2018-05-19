
<template>
    <section class="detaile-full-main-l-item">
        <h4>
            <em class="icon iconfont_daydao_common">&#xe615;</em>
            <span>{{templateItem.title}}</span>
        </h4>

        <Tabs type="card" v-if="isShowReportForm">
            <TabPane label="人员结构分析">
                <!--图表一-->
                <div class="dimensionality_selection">
                    <h3>请选择分析维度</h3>
                    <div class="dimension_label">
                        <p class="dimension_label_item">第一维度：</p>
                        <p class="dimension_label_item">第二维度：</p>
                    </div>

                    <RadioGroup v-for="(dimensionItem, index) in aDimension" v-model="dimensionItem.dimensionValue" :key="index" type="button" class="block_radio_group">

                        <Radio v-for="(option , optionIndex) in dimensionItem.options" :key="optionIndex" :label="option.key">
                            <span>{{option.value}}</span>
                        </Radio>
                    </RadioGroup>
                </div>
                <div class="dimensionality_buttons" v-if="isShowCheckoutBtn">
                    <a href="javascript:void(0);" class="pie iconfont_daydao_common" title="切换为饼状图" @click="checkoutChartType('pie')">&#xe695;</a>
                    <a href="javascript:void(0);" class="showdata iconfont_daydao_common" title="显示标签数据" @click="checkoutChartType('label')">&#xe69f;</a>
                    <a href="javascript:void(0);" class="bar iconfont_daydao_common" title="切换为柱状图" @click="checkoutChartType('bar')">&#xe6e7;</a>
                    <a href="javascript:void(0);" class="bar iconfont_daydao_common" title="还原" @click="checkoutChartType('reset')">&#xe6d0;</a>
                </div>
                <div id="Personnel_structure_analysis">

                </div>
            </TabPane>

            <TabPane label="人员流动分析">
                <!--图表二-->
                <div class="dimensionality_selection">
                    <h3>请选择分析维度</h3>
                    <div class="dimension_label">
                        <p class="dimension_label_item">时间范围：</p>
                    </div>

                    <RadioGroup v-for="(dimensionItem, index) in aDimension1" v-model="dimensionItem.dimensionValue" :key="index" type="button" class="block_radio_group">

                        <Radio v-for="(option , optionIndex) in dimensionItem.options" :key="optionIndex" :label="option.key">
                            <span>{{option.value}}</span>
                        </Radio>
                    </RadioGroup>
                </div>
                <!-- <div class="dimensionality_buttons" v-if="isShowFlowCheckoutBtn">
                                                                    <a href="javascript:void(0);" class="pie" title="折线图切换" @click="checkoutFlowChartType('line')">折线图切换</a>
                                                                    <a href="javascript:void(0);" class="showdata" title="柱形图切换" @click="checkoutFlowChartType('bar')">柱形图切换</a>
                                                                    <a href="javascript:void(0);" class="bar" title="还原" @click="checkoutFlowChartType('reset')">还原</a>
                                                                </div> -->
                <div id="Employee_turnover_in_workplace">

                </div>
            </TabPane>
        </Tabs>

    </section>
</template>

<style lang="scss">
#Personnel_structure_analysis {
    width: 711px;
    height: 380px;
    margin: 20px auto;
}

#Employee_turnover_in_workplace {
    width: 711px;
    height: 380px;
    margin: 20px auto;
}

.block_radio_group {
    display: block;
}

.dimension_label {
    float: left;
    height: 64px;
    margin-right: 14px;
}

.dimension_label_item {
    height: 32px;
    line-height: 32px;
}

.dimensionality_buttons {
    float: right;
    right: 10px;
}

.dimensionality_buttons a {
    font-size: 20px;
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
}

.dimensionality_buttons a.pie {
    background-position: -3px -2px;
}

.dimensionality_buttons a.bar {
    background-position: -28px -2px;
}

.dimensionality_buttons a.showdata {
    background-position: -109px -2px;
}
</style>


<script>
import Tools from "commonVueLib/utils/index"
import echarts from "echarts/lib/echarts"
import "echarts/lib/chart/pie.js"
import "echarts/lib/chart/bar.js"
import "echarts/lib/chart/line.js"
import "echarts/lib/component/legend"
import "echarts/lib/component/toolbox"
import "echarts/lib/component/tooltip"
import "echarts/lib/model/Series.js"
export default {
    name: 'job_report_form',
    data() {
        return {
            templateItem: {},
            aDimension: [
                {
                    name: "第一维度",
                    dimensionValue: "SEX",//第一维度的值
                    options: [
                        { key: "SEX", value: "性别", isChoosed: false },
                        { key: "AGE", value: "年龄", isChoosed: false },
                        { key: "EDUCATIONLEVEL", value: "学历", isChoosed: false },
                        { key: "PERSONSTATUS", value: "人员状态", isChoosed: false }
                    ]
                },
                {
                    name: "第二维度",
                    dimensionValue: "",//第二维度的值
                    options: [
                        { key: "SEX", value: "性别" },
                        { key: "AGE", value: "年龄" },
                        { key: "EDUCATIONLEVEL", value: "学历" },
                        { key: "PERSONSTATUS", value: "人员状态" }
                    ]
                }
            ],
            aDimension1: [
                {
                    name: "时间范围",
                    dimensionValue: "ONEMONTH", //人员流动的筛选范围
                    options: [
                        { key: "ONEMONTH", value: "一个月" },
                        { key: "THRMONTH", value: "三个月" },
                        { key: "HALFYEAR", value: "半年" },
                        { key: "ONEYEAR", value: "一年" },
                        { key: "THRYEAR", value: "三年" }
                    ]
                }
            ]
            , chartType: "pie" // 默认为饼状图
            , flowChartType: "line" // 默认为折线图
            , personStructureEcharts: {}
            , personFlowEcharts: {} // 人员流动报表
            , routeId: "" // 请求的标志位 
            , isShowLabelData: false //是否显示标签数据
            , personStructureOptions: {} // 员工结构参数
            , personFlowOptions: {} // 人员流动参数
            , oldPersonStruDimen1: "SEX"
            , oldPersonStruDimen2: ""
            , oldPersonFlowDimen: "" // 人员流动的旧请求参数
            , oldPersonFlowDimen2: "" //参数二
            , conditionId: ""
            , isShowCheckoutBtn: true //显示切换按钮 ,默认显示
            , isShowFlowCheckoutBtn: true // 显示人员流动分析的切换按钮
            , isShowReportForm: true // 是否显示报表
        }
    },
    watch: {
        "aDimension": {
            handler: function(val, oldVal) {
                var _this = this;
                var oldDimension1 = _this.oldPersonStruDimen1 //旧的 一二维数据
                var oldDimension2 = _this.oldPersonStruDimen2;
                var nowDimension1 = val[0].dimensionValue;// 当前一二维数据
                var nowDimension2 = val[1].dimensionValue;
                var isD1Modified = false;
                var isD2Modified = false;
                if (oldDimension1 != nowDimension1) {
                    isD1Modified = true;
                }
                if (oldDimension2 != nowDimension2) {
                    isD2Modified = true;
                }
                console.log(oldDimension1, nowDimension1, oldDimension2, nowDimension2);
                if (nowDimension1 == nowDimension2) {
                    // 一二维度相等则要修改回原来的数据
                    if (isD1Modified) {
                        // 第一维度更改的,改回原来的数据
                        _this.aDimension[0].dimensionValue = oldDimension1;
                    }
                    if (isD2Modified) {
                        //第二维度修改的
                        _this.aDimension[1].dimensionValue = oldDimension2;
                    }
                } else {
                    console.log("请求了两次？？？");
                    // 请求数据
                    // 保存现在的数据作为旧数据 以后可以比较
                    _this.oldPersonStruDimen1 = nowDimension1;
                    _this.oldPersonStruDimen2 = nowDimension2;

                    var oSend = {
                        dateParam: Tools.dateFormat(new Date(), "yyyy-MM-dd"),
                        firCondition: nowDimension1,
                        conditionId: _this.conditionId,
                        secCondition: nowDimension2
                    }
                    _this.getPersonStructureChart({
                        data: oSend,
                        routeReportId: _this.routeId
                    });
                }


            },
            deep: true
        }
        , "aDimension1": {
            handler: function(val, oldVal) {
                var _this = this;
                _this.oldPersonFlowDimen = val[0].dimensionValue;
                var oSend = {
                    conditionId: _this.conditionId,
                    timeScope: val[0].dimensionValue,
                    personStatus: ""
                };
                if (val.length > 1) {
                    oSend['personStatus'] = val[1].dimensionValue;
                    _this.oldPersonFlowDimen2 = val[0].dimensionValue;
                }
                _this.getPersonFlowChart({
                    data: oSend,
                    routeReportId: _this.routeId
                });

            },
            deep: true
        }
    },
    mounted: function() {
        // 放在mounted中执行，不能放在created中执行
        var _this = this;
        // 获取模板编辑数据
        _this.templateItem = JSON.parse(JSON.stringify(this.$parent.sectionItem));
        //this.queryPersonFlowReportCode('pos_list');
        // 获取请求参数
        _this.conditionId = _this.$parent.$parent.id;
        _this.routeId = _this.$parent.$parent.pageInfoSetId;
        // 初始化personStructureEcharts（人员结构分析） echarts 对象
        _this.personStructureEcharts = echarts.init(document.getElementById("Personnel_structure_analysis"), "macarons");
        _this.personFlowEcharts = echarts.init(document.getElementById("Employee_turnover_in_workplace"), "macarons");
        // 初始化数据
        _this.initPersonStructureChart();
        _this.initPersonFlowChart({
            routeReportId: _this.routeId
        });
    }
    , created: function() {
        var _this = this;
    },
    methods: {
        // 初始化人员结构分析图，默认为饼状图
        initPersonStructureChart: function() {
            var _this = this;
            var oSend = {
                dateParam: Tools.dateFormat(new Date(), "yyyy-MM-dd")
                , firCondition: "SEX"
                , conditionId: _this.conditionId
                , secCondition: ""
            };

            // 请求结构的数据
            _this.getPersonStructureChart({
                data: oSend,
                routeReportId: _this.routeId
            });

            //绑定结构的点击事件
        }
        , getPersonStructureChart: function(params) {
            params = params || {};
            var _this = this;
            var pData = params.data;
            var requestRouteId = params.routeReportId;
            //过度效果
            _this.personStructureEcharts.showLoading({
                text: "正在努力的读取数据中..."
            });

            var realUrl = "orgPersonReportForm/queryOrgPersonStructureReport.do";
            if (requestRouteId == 'org_list')
                realUrl = 'orgPersonReportForm/queryOrgPersonStructureReport.do';
            else if (requestRouteId == 'pos_list')
                realUrl = 'posPersonReportForm/queryPosPersonStructureReport.do';
            else if (requestRouteId == 'job_list')
                realUrl = 'jobPersonReportForm/queryJobPersonStructureReport.do';

            _this.$daydao.$ajax({
                url: gMain.apiBasePath + realUrl,
                data: JSON.stringify(pData),
                success: function(data) {
                    // 隐藏加载中
                    _this.personStructureEcharts.hideLoading();
                    //拼装echarts数据

                    if (data.beans && data.beans.length != 0) {
                         var aSeriesData = [];
                        var aLegendData = [];
                        var aValueData = [];
                        if (data.beans && data.beans.length) {
                            $(".dimensionality_buttons").show();
                            for (var i = 0; i < data.beans.length; i++) {
                                aSeriesData.push({ value: data.beans[i].value, name: data.beans[i].key });
                                aLegendData.push(data.beans[i].key);
                                aValueData.push(data.beans[i].value);
                            }
                        } else {
                            //如果没有数据就隐藏饼状和柱状的切换按钮
                            //$(".dimensionality_buttons").hide();
                            _this.isShowCheckoutBtn = false;
                        }
                        // aSeriesData排序
                        aSeriesData.sort(function(item1, item2) {
                            return -(item1.value - item2.value);
                        });
                        //aSeriesData = _.sortBy(aSeriesData, 'value').reverse();

                        var oOptions1 = {};
                        if (_this.chartType == "pie") {
                            oOptions1 = {
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                                },
                                legend: {
                                    orient: 'vertical',
                                    left: "left",
                                    data: aLegendData
                                },
                                calculable: true,
                                series: [
                                    {
                                        name: '人员结构',
                                        type: 'pie',
                                        radius: '55%',
                                        center: ['50%', '60%'],
                                        data: aSeriesData
                                    }
                                ]
                            };
                            //如果需要显示标签数据
                            if (_this.isShowLabelData) {
                                oOptions1.series[0].itemStyle = {
                                    normal: {
                                        label: { show: true, position: 'top', formatter: '{b} : {c} ({d}%)' }
                                    }
                                }
                            }
                        } else if (_this.chartType == "bar") {
                            var mySeries = [];
                            aLegendData.forEach(function(item, index) {
                                mySeries.push({
                                    name: item,
                                    type: "bar",
                                    data: aValueData[index]
                                });
                            });
                            var oOptions1 = {
                                tooltip: {
                                    trigger: 'axis'
                                },
                                calculable: true,
                                legend: {
                                    data: aLegendData,
                                    x: 'center'
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        data: aLegendData,
                                        axisLabel: {
                                            rotate: 20
                                        }
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        name: '人',
                                        axisLabel: {
                                            formatter: '{value} 人'
                                        }
                                    },
                                ],
                                series: [
                                    {
                                        name: "人",
                                        type: "bar",
                                        data: aValueData
                                    }
                                ]
                            }
                        }
                        _this.personStructureOptions = oOptions1;
                        // 图表清空-------------------
                        _this.personStructureEcharts.clear();
                        _this.personStructureEcharts.setOption(oOptions1);
                        
                    } else {
                       _this.isShowReportForm = false;
                    }


                }
            });
        }
        // 初始化人员流动分析图表
        , initPersonFlowChart: function(params) {
            var _this = this;
            var routeReportId = params.routeReportId;
            // 请求员工流动报表的查询条件
            //先请求查询条件,只有当routeReportId为org_list时才请求
            // org_list 才需要做的处理
            if (routeReportId == "org_list") {
                var realUrl = "orgPersonReportForm";

                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + realUrl + "/queryPersonFlowReportCode.do",
                    data: JSON.stringify({}),
                    success: function(data) {
                        // 添加晒选条件

                        var personStatusMap = {
                            name: "在册状态",
                            options: []
                        };
                        for (var i in data.personStatusMap) {
                            personStatusMap.options.push({
                                key: i,
                                value: data.personStatusMap[i]
                            });
                        }

                        //排序人员状态
                        //先把全部放第一
                        var oFirst2 = null;
                        for (var i = 0; i < personStatusMap.options.length; i++) {
                            if (personStatusMap.options[i].value == "全部") {
                                oFirst2 = personStatusMap.options[i];
                                personStatusMap.options.splice(i, 1);
                                break;
                            }
                        }

                        // 有数据时，把全部放到第一位
                        if (oFirst2) {
                            personStatusMap.options.unshift(oFirst2);
                        }
                        //再把其他xx放最后
                        var oLast2 = null;
                        for (var i = 0; i < personStatusMap.options.length; i++) {
                            if (personStatusMap.options[i].value.indexOf("其他") != -1 || personStatusMap.options[i].value.indexOf("其它") != -1) {
                                oLast2 = personStatusMap.options[i];
                                personStatusMap.options.splice(i, 1);
                                break;
                            }
                        }

                        // 有“其他”时，把该对象放到数组最后
                        if (oLast2) {
                            personStatusMap.options.push(oLast2);
                        }
                        personStatusMap['dimensionValue'] = personStatusMap.options[0].key;
                        _this.aDimension1.push(personStatusMap);


                        var reqData = {
                            conditionId: _this.conditionId,
                            timeScope: _this.aDimension1[0].dimensionValue,
                            personStatus: personStatusMap.options[0].key
                        };
                        // 请求数据????

                        _this.getPersonFlowChart({
                            data: reqData,
                            routeReportId: _this.routeId
                        });

                    }
                });
            } else {
                var reqData = {
                    conditionId: _this.conditionId,
                    timeScope: _this.aDimension1[0].dimensionValue,
                    personStatus: ""
                };
                // 请求数据????

                _this.getPersonFlowChart({
                    data: reqData,
                    routeReportId: _this.routeId
                });
            }

        }
        , getPersonFlowChart: function(params) {
            var _this = this;
            var pData = params.data;
            var routeReportId = params.routeReportId;

            var realUrl = "orgPersonReportForm/queryOrgPersonFlowReport.do";
            switch (routeReportId) {
                case "org_list":
                    realUrl = 'orgPersonReportForm/queryOrgPersonFlowReport.do';
                    break;
                case "pos_list":
                    realUrl = 'posPersonReportForm/queryPosPersonFlowReport.do';
                    break;
                case "job_list":
                    realUrl = 'jobPersonReportForm/queryJobPersonFlowReport.do';
                    break;
            }
            _this.personFlowEcharts.showLoading({
                text: '正在努力的读取数据中...'    //loading话术
            });
            // ajax getting data...............
            _this.personFlowEcharts.hideLoading();
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + realUrl,
                data: JSON.stringify(pData),
                success: function(data) {
                    data.beans = data.beans == null ? [] : data.beans;
                    if (data.result == "true") {
                        var aMouth = []; //对应时间点
                        var aInNum = []; //流入
                        var aOutNum = []; //流出
                        var aBaseNum = []; //基数
                        if (data.beans && data.beans.length) {
                            for (var i = 0; i < data.beans.length; i++) {
                                var item = data.beans[i];
                                aMouth.push(item.timeStr);
                                aInNum.push(item.inNum);
                                aOutNum.push(item.outNum);
                                aBaseNum.push(item.baseNum);
                            }
                        }
                        //aSeriesData = _.sortBy(aSeriesData, 'value').reverse();
                        var oOptions2 = {
                            tooltip: {
                                trigger: 'axis'
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    magicType: { show: true, type: ['line', 'bar'] },
                                    restore: { show: true }
                                }
                            },
                            calculable: true,
                            legend: {
                                data: ['流入人数', '流出人数', '在册人数'],
                                x: 'center'
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: aMouth,
                                    axisLabel: {
                                        rotate: 20
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '人',
                                    axisLabel: {
                                        formatter: '{value} 人'
                                    }
                                }
                            ],
                            series: [

                                {
                                    name: '流入人数',
                                    type: 'bar',
                                    data: aInNum
                                },
                                {
                                    name: '流出人数',
                                    type: 'bar',
                                    data: aOutNum
                                },
                                {
                                    name: '在册人数',
                                    type: 'line',
                                    yAxisIndex: 0,
                                    data: aBaseNum
                                }
                            ]
                        };
                        console.log(oOptions2);

                        _this.personFlowOptions = oOptions2;
                        // 图表清空-------------------
                        _this.personFlowEcharts.clear();
                        _this.personFlowEcharts.setOption(oOptions2);

                    }


                }
            });
        }

        /**
         * 请求员工流动报表的查询条件
         * @options.data
         * @options.success
         * */
        , queryPersonFlowReportCode(routeId) {
            var _this = this,
                realUrl = "orgPersonReportForm";
            switch (routeId) {
                case 'org_list':
                    realUrl = 'orgPersonReportForm';
                    break;
                case 'pos_list':
                    realUrl = 'posPersonReportForm';
                    break;
                case 'job_list':
                    realUrl = 'jobPersonReportForm';
                    break;
                default:
                    console.log('未知的routeId:' + routeId);
            }

            _this.$daydao.$ajax({
                url: gMain.apiBasePath + realUrl + "/queryPersonFlowReportCode.do",
                data: JSON.stringify({}),
                success: function(data) {
                    if (data.result == "true") {
                        var personStatusMap = {
                            name: "在册状态",
                            options: []
                        };
                        for (var i in data.personStatusMap) {
                            personStatusMap.options.push({
                                key: i,
                                value: data.personStatusMap[i]
                            });
                        }

                        //排序人员状态
                        //先把全部放第一
                        var oFirst2 = null;
                        for (var i = 0; i < personStatusMap.options.length; i++) {
                            if (personStatusMap.options[i].value == "全部") {
                                oFirst2 = personStatusMap.options[i];
                                personStatusMap.options.splice(i, 1);
                                break;
                            }
                        }

                        // 有数据时，把全部放到第一位
                        if (oFirst2) {
                            personStatusMap.options.unshift(oFirst2);
                        }
                        //再把其他xx放最后
                        var oLast2 = null;
                        for (var i = 0; i < personStatusMap.options.length; i++) {
                            if (personStatusMap.options[i].value.indexOf("其他") != -1 || personStatusMap.options[i].value.indexOf("其它") != -1) {
                                oLast2 = personStatusMap.options[i];
                                personStatusMap.options.splice(i, 1);
                                break;
                            }
                        }

                        // 有“其他”时，把该对象放到数组最后
                        if (oLast2) {
                            personStatusMap.options.push(oLast2);
                        }

                        _this.aDimension1.push(personStatusMap);
                        console.log('_this.aDimension1', _this.aDimension1)

                        seajs.use(["commonStaticDirectory/plugins/echarts/echarts-all.min"], function() {
                            _this.personFlowEcharts = echarts.init(document.getElementById('Employee_turnover_in_workplace'), 'macarons');
                        });

                        //t.myChart2 = echarts.init(document.getElementById('Employee_turnover_in_workplace'),'macarons');
                        //t.bindEvent2(); //绑定第二个图表的维度点击事件
                    }
                }
            });
        }
        , checkoutChartType: function(type) {
            var _this = this;
            var oSend = {
                dateParam: Tools.dateFormat(new Date(), "yyyy-MM-dd")
                , firCondition: _this.aDimension[0].dimensionValue
                , conditionId: _this.conditionId
                , secCondition: _this.aDimension[1].dimensionValue
            }
            switch (type) {
                case 'pie':
                    _this.chartType = 'pie';

                    break;
                case 'bar':
                    _this.chartType = 'bar';
                    break;
                case 'label':
                    if (_this.isShowLabelData) {
                        _this.isShowLabelData = false;
                    } else {
                        _this.isShowLabelData = true;
                    }

                    break;
                default:
                    _this.chartType = 'pie';
            }
            _this.getPersonStructureChart({
                data: oSend,
                routeReportId: _this.routeId
            });
        }
        , checkoutFlowChartType: function(type) {
            var _this = this;
            var oSend = {
                conditionId: _this.conditionId,
                timeScope: _this.oldPersonFlowDimen,
                personStatus: _this.oldPersonFlowDimen2
            };
            switch (type) {
                case 'pie':
                    _this.flowChartType = 'line';

                    break;
                case 'bar':
                    _this.flowChartType = 'bar';
                    break;
                default:
                    _this.flowChartType = 'line';
            }
            _this.getPersonFlowChart({
                data: oSend,
                routeReportId: _this.routeId
            });

        }
        , chooseDimension: function(itemKey, index) {
            var _this = this;

        }
    }

}
</script>
