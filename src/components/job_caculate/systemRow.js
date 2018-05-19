export default {
    options: {
        aItem: undefined,
        aRowIndex: undefined,
        oMetaData: undefined
    },
    /**
     * 初始化函数
     * */
    init: function (options) {
        this.options = $.extend({}, this.options, options);
        this.row = 0; // 行数
        this.colNum = 0; // 列数

        this.rowChild = 0; // 计算子集行数
        this.colPosition = 0; // 层指针
        this.colArray = []; // 所有列

        this.aposition = []; //存放等级坐标

        this.colSum = []; // 单元合并的数量

        this.lvTdWidth = 100; // 等级表格初始宽度
        this.lvTdHeight = 20; // 等级表格初始高度
        this.lvTdB = 2; //等级表格初始垂直距离
        this.lvTrHeigth = 70;
        this.b_html = $('<div class="job_system_box"></div>');
        this.aBgColor = []; //等级条背景颜色备用
        // 定义层数指针
        this.whereCol = 1;
        // 计算最大深度用的临时数组
        this.depth = new Array();
    },

    createJobFamilyTree: function (systemData) {
        var t = this;
        // var systemData = tools.Cache.getCache("systemData","session") || {};
        var datas = systemData.data;
        t.init();
        t.getColNum(datas.category);
        t.colNum = t.getArrayMax(t.depth);
        t.createArray(datas.category);
        t.innitTable(datas);
        t.drawLine();
        t.innitBgColor();
        if (datas.jobPositions && datas.jobPositions.length > 0) {
            datas.jobPositions = t.filterLVData(datas.jobPositions);
        }
        console.log(datas.jobPositions);
        if (!datas.jobPositions || datas.jobPositions.length == 0) {
            //layer.msg("暂无数据", {offset: 0,shift:6});
            console.log("暂无数据");
            //return;
        } else {
            t.createGroupBg(datas.jobPositions);
            t.createLvArray(datas.jobPositions);
        }
        return t.b_html[0].outerHTML;
    },
    //过滤没有最高级活最低级的等级
    filterLVData: function (data) {
        var aData = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].levelBottom && data[i].levelTop) {
                aData.push(data[i]);
            }
        }
        return aData;
    },
    // 求数组中的最大值
    getArrayMax: function (array) {
        var max = array[0];
        for (var i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }
        return max;
    },

    //获取随机颜色
    getTarBgColor: function (num) {
        var t = this;
        return t.aBgColor[num];
    },
    //初始话等几条背景颜色
    innitBgColor: function () {
        var t = this;
        var aBgColor = ['#00A75A', '#0072B7', '#F39D12', '#00C1EF', '#3C8DBD'];
        t.aBgColor = t.randArray(aBgColor);

    },

    //随机打乱颜色数组
    randArray: function (data) {
        //获取数组长度
        var arrlen = data.length;
        //创建数组 存放下标数
        var try1 = new Array();
        for (var i = 0; i < arrlen; i++) {
            try1[i] = i;
        }
        //创建数组 生成随机下标数
        var try2 = new Array();
        for (var i = 0; i < arrlen; i++) {
            try2[i] = try1.splice(Math.floor(Math.random() * try1.length), 1);
        }
        //创建数组，生成对应随机下标数的数组
        var try3 = new Array();
        for (var i = 0; i < arrlen; i++) {
            try3[i] = data[try2[i]];
        }
        return try3;
    },

    //计算等级分组数
    createGroupBg: function (data) {
        var t = this;
        var alvSum = [];

        for (var i = 0; i < data.length; i++) {
            var temp = 0;
            for (var y = 0; y <= i; y++) {
                if (data[y].group == data[i].group) {
                    temp += 1;
                }
            }
            data[i].bgGolor = t.getTarBgColor(temp % t.aBgColor.length);
            alvSum.push(temp);
        }
    },

    getColNum: function (data) {
        var t = this;
        for (var i = 0; i < data.length; i++) {
            if (data[i].children) {
                t.whereCol++;
                t.getColNum(data[i].children);
            } else {
                t.row++;
                t.depth.push(t.whereCol);
            }
        }
        t.whereCol--;
    },
    // 创建列数组
    createArray: function (data) {
        var t = this;
        for (var i = t.colNum; i >= 1; i--) {
            var col = [];
            var col0 = [];
            var col1 = [];
            t.colArray.push(col);
            t.colSum.push(col0);
        }
        t.getData(data);
        console.log("getData", t.aposition,t.colSum,t.colArray);
    },
    //遍历数据
    getData: function (data) {
        var t = this;
        //colSum 数据结构：Array<array>
        // length 代表col数
        // array 中的数组[]每一项代表每一行所占行数
        // 例如 ：
        // arr=[
        //     [1,1,1,1,1,1,2,1]
        //     ,[1,1,1,1,1,1,1,1,1]
        //     ,[1,1,1,1,1,1,1,1,1]
        //     ,[1,1,1,1,1,1,2,1]
        // ]
        // colArray : 每一列每个空格的名称

        for (var i = 0; i < data.length; i++) {
            //t.aposition.push(data[i].id);
            if (data[i].children) {
                var rowSum = t.getRow(data[i].children);
                t.colSum[t.colPosition].push(rowSum);
                t.rowChild = 0;
                t.colArray[t.colPosition].push(data[i].name);
                t.colPosition++;
                t.getData(data[i].children);

            } else {
                //把根节点的id 保存进数组
                t.aposition.push(data[i].id);
                t.colArray[t.colPosition].push(data[i].name);
                t.colSum[t.colPosition].push(1);
                for (var y = t.colPosition + 1; y < t.colNum; y++) {
                    t.colArray[y].push('');
                    t.colSum[y].push(1);
                };

            }
        }
        t.colPosition--;
    },

    //获取子集行数
    getRow: function (data) {
        var t = this;
        for (var i = 0; i < data.length; i++) {
            if (data[i].children) {
                t.getRow(data[i].children);
            } else {
                t.rowChild++;
            }
        }
        return t.rowChild;
    },

    // 创建表格
    createTable: function () {
        var t = this;
        var _html = $('<table class="job_system"></table>');
        var html_table = '';
        var colNum = t.colNum;
        var colSum = t.colSum;
        var colArray = t.colArray;
        var row = t.row;
        var trH = t.lvTrHeigth;
        // 根据行列创建空表格
        for (var i = 0; i < row; i++) {
            var html_td = '';
            for (var t = 0; t < colNum; t++) {
                html_td += '<td>data</td>';
            }
            html_table += '<tr style="height: ' + trH + 'px">' + html_td + '</tr>';
        }
        _html.append(html_table);
        // 合并表格
        // 最外层循环，有n列就执行n-1次
        for (var i = colNum - 2; i > -1; i--) {
            // 里层循环，数组中有多少个数就执行多少次
            var sum = 0;
            for (var j = 0; j < colSum[i].length; j++) {
                _html.find('tr').eq(sum).children().eq(i).attr("rowspan", colSum[i][j]).html('<span>' + colArray[i][j] + '</span>');
                _html.find('tr').slice(sum + 1, sum + colSum[i][j]).find("td:eq(0)").remove();
                sum += colSum[i][j];
            }
        }
        //补充最后一列的值
        for (var i = 0; i < colArray[colNum - 1].length; i++) {
            _html.find('tr').eq(i).children().last().html('<span>' + colArray[colNum - 1][i] + '</span>');
        }
        return _html;
    },


    //初始化等级表格
    lvTable: function (datas) {
        var t = this;
        var lv_table_html = $('<table class="lvTable"></table>');
        //初始化表格
        for (var i = 0; i < t.row; i++) {
            var lv_tr_html, lv_td_html, head_tr;
            var head_td = '';
            for (var y = 0; y < datas.level.length; y++) {
                // 只能遍历出1,2位的数据出来
                lv_td_html += '<td  data-xposition = ' + t.aposition[i] + ' data-yposition = ' + y + '><span></span></td>';
                head_td += '<td><span style="width: ' + t.lvTdWidth + 'px;">' + datas.level[y].code_name + '</span></td>';
            }
            lv_tr_html = '<tr style="height: ' + t.lvTrHeigth + 'px">' + lv_td_html + '</tr>';
            lv_td_html = '';
            lv_table_html.append(lv_tr_html);
        }
        head_tr = '<table><tr style="height: ' + t.lvTrHeigth + 'px">' + head_td + '</tr></table>';
        t.b_html.find('#lv_header').append(head_tr);
        t.b_html.find('#table2').append(lv_table_html);
    },

    //生成等级条
    createLvArray: function (data) {
        var t = this;
        var agSum = [];
        var trDemo = t.b_html.find('#table2').find('tr');
        console.log("createLvArray", trDemo);
        var atr = [];
        for (var i = 0; i < $(trDemo).length; i++) {
            var fid = $(trDemo).eq(i).find('td').attr('data-xposition');

            for (var y = 0; y < data.length; y++) {
                var otr = {};
                console.log(fid, data[y].familyId);
                if (fid == data[y].familyId) {
                    otr.jobId = data[y].jobId;
                    otr.familyId = data[y].familyId;
                    otr.group = data[y].group;
                    otr.levelBottom = data[y].levelBottom - 1;
                    otr.wnum = data[y].levelTop - data[y].levelBottom + 1;
                    otr.jobName = data[y].jobName;
                    otr.gY = 1;
                    otr.gX = 1;
                    atr.push(otr);
                }
            }

            var gNum = 0;
            for (var z = 0; z < atr.length; z++) {
                if (fid == atr[z].familyId) {
                    var num = 0;
                    for (var y = 0; y < z; y++) {
                        if (y != z && atr[z].group == atr[y].group) {
                            num = 1;
                            atr[z].gY = atr[y].gY;
                            atr[z].gX += 1;
                        }
                    }
                    if (!num) {
                        gNum++;
                        atr[z].gY = gNum;
                    }
                }
            }
            agSum.push(gNum);
        }
        t.createLvBox(agSum, atr, trDemo, data);
    },
    createLvBox: function (agSum, atr, trDemo, data) {
        var t = this;
        var atrH = [];
        var trTop = 0;
        for (var i = 0; i < $(trDemo).length; i++) {
            var trH = agSum[i] * (t.lvTdHeight + t.lvTdB);
            if (trH > t.lvTrHeigth) {
                $(trDemo).eq(i).css('height', trH + 'px');
                t.b_html.find('#table1').find('tr').eq(i).css('height', trH + 'px');
                trTop = trH;

            } else {
                trTop = t.lvTrHeigth;
            }
            atrH.push(trTop);

        }
        for (var i = 0; i < $(trDemo).length; i++) {
            var fid = $(trDemo).eq(i).find('td').attr('data-xposition');
            var trSum = 0;
            var temp = 0;
            for (var z = 0; z < i; z++) {
                trSum += atrH[z];
            }
            for (var y = 0; y < atr.length; y++) {
                if (fid == atr[y].familyId) {
                    temp = 1;
                    var pdw = 5;
                    var bgGolor = t.getTarBgColor(atr[y].gX % t.aBgColor.length);
                    var w = atr[y].wnum * (t.lvTdWidth + 1) - 3 - pdw * 2;
                    var l = atr[y].levelBottom * (t.lvTdWidth + 1) + 1;
                    var _t = trSum + (atr[y].gY - 1) * (t.lvTdHeight + t.lvTdB) + 1;
                    var tar_html = '<div  style="position: absolute; width: ' + w + 'px; height: ' + t.lvTdHeight + 'px; top:  ' + _t + 'px; left: ' + l + 'px; padding: 0 ' + pdw + 'px; background:  ' + bgGolor + ';" id = jobId_' + atr[y].jobId + ' jobid = ' + atr[y].jobId + ' class="lvTag">' + atr[y].jobName + '</div>';
                    t.b_html.find('#table2').append(tar_html);

                }
            }
            if (temp) {
                t.innitBgColor();
            }
        }

    },
    //初始化表格
    innitTable: function (datas) {
        var t = this;
        var attr = '<div class="job_system_left">' +
            '<table><tr style="height: ' + t.lvTrHeigth + 'px"><td id="header_td"></td></tr>' +
            '<tr style="height: ' + t.lvTrHeigth + 'px"><td id="table1"></td></tr></table></div>' +
            '<div class="job_system_right">' +
            '<table><tr style="height: ' + t.lvTrHeigth + 'px"><td id="lv_header"></td></tr>' +
            '<tr style="height: ' + t.lvTrHeigth + 'px"><td id="table2"></td></tr></table></div>';

        //var attr0 = '<table><tr><td id="header_td"></td> <td id="lv_header"></td> </tr>'+
        //    '<tr><td id="table1"></td><td id="table2"></td></tr></table>';

        t.b_html.append(attr);
        //创建职位表格
        t.b_html.find('#table1').append(t.createTable());
        //创建等级表格
        t.lvTable(datas);
    },


    //画表头斜线
    drawLine: function () {
        var t = this;
        var x = 91 * t.colNum;
        if (t.colNum == 1) {
            x = 121;
            t.b_html.find('.job_system span').css('width', '100px');
        }
        var y = t.lvTrHeigth;
        // 斜边长
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        // 余弦
        var cos = y / z;
        // 弧度
        var radina = Math.acos(cos);
        // 角度
        var angle = 90 - 180 / (Math.PI / radina);
        var lineW = Math.sqrt(x * x + y * y);

        $(t.b_html).find('#header_td').append('<p>职务等级</p><p id="header_line"></p><p>职务类型</p>');
        $(t.b_html).find('#header_line').css('width', lineW + 'px').css('transform', 'rotate(' + angle + 'deg)').css('marginLeft', -lineW / 2);
        $(t.b_html).find('.job_system_right').css('padding-left', x + 20 + 'px');
        $('#job_system_table_main').css('height', $(window).height() - $('#job_system_table_main').offset().top - 20);
    }
}
