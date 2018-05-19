<style lang="scss">

</style>

<template>
    <!-- 表格 -->
    <section class="detaile-full-main-l-item detaile-full-main-l-item-table"
             v-if="sectionItem.specialTabType == '36'">
        <h4>
            <em class="icon iconfont_daydao_common">&#xe615;</em>
            <span>{{sectionItem.title}}</span>
        </h4>
        <div class="detaile-full-main-l-item-content">
            <Table border height="440"
                   v-if="attachmentData && attachmentData.updataData && attachmentData.updataData.length > 0"
                   :columns="attachmentData.updataColumns"
                   :data="attachmentData.updataData"></Table>
            <div style="margin: 10px; text-align: right;" v-if="attachmentData && attachmentData.updataData && attachmentData.updataData.length > 0">
                <Page :total="Number(pagePB.pageDataCount)"
                    :current="pageNO"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                    size="small"
                    show-total
                    show-elevator
                    show-sizer></Page>
            </div>

            <p style="font-size: 14px; color: #B1B6BF;" v-if="!(attachmentData && attachmentData.updataData && attachmentData.updataData.length > 0)" v-html="resultDesc"></p>
        </div>
    </section>

</template>

<script>
    import {daydaoDropSelect,daydaoDropSelectMul} from 'commonVueLib/daydaoDropSelect/index'

    export default{
        name:"tableList",
        props:{
            tableListData: {
                type: Object,
                default(){
                    return {};
                }
            }
        },
        components: {
            daydaoDropSelect,
        },
        data () {
            return {
                sectionItem: {},
                attachmentData: {},
                pageNO: 1,  // 页码
                pageSize: 10,   // 每页数量
                pagePB: {}, // 分页数据
                pageSizeOpts: [10, 20, 50, 100],    // 表格分页部分显示页面数量
                resultDesc: '暂无数据', // 获取到的数据数组为空数组时，则用此显示数据
            };
        },
        created(){
            var _this = this;

            _this.sectionItem = JSON.parse(JSON.stringify(_this.tableListData));
            _this.getAttachmentData();
        },
        methods:{
            /**
             * 获取附件列表数据
             */
            getAttachmentData (){
                var _this = this,
                    templateId = _this.sectionItem.templateId,
                    oSendObj = {
                        infoSetId: templateId,
                        customParam: {
                            uuid: _this.sectionItem.uuid
                        },
                        editCondition: {
                            key: _this.$parent.editCondition.key,
                            value: _this.$parent.editCondition.value
                        },
                        pageBean: {pageNo: _this.pageNO, pageSize: _this.pageSize}
                    };
                _this.$daydao.$ajax({
                    url: gMain.apiBasePath+"route/"+ templateId+"/getAll.do",
                    data: JSON.stringify(oSendObj),
                    success: function(data){
                        if(data.resultDesc) _this.resultDesc = data.resultDesc;
                        _this.pagePB = data.pb;
                        _this.attachmentData = formatAttachmenTemplateData(_this.sectionItem.columnEdit, data.maps, templateId);
                    }
                });

                /**
                 * 格式化附件列表数据
                 */
                function formatAttachmenTemplateData(columnData, listData, templateId){
                    var result = {},
                        columnData = columnData || [],
                        listData = listData || [];
                    result.updataColumns = [];  // 表头数据
                    result.updataData = []; // 附件数据

                    // 格式化附件表头数据
                    columnData.forEach(function(item){
                        if(!item.isListShow) return true;
                        result.updataColumns.push({
                            title: item.title,
                            key: item.name,
                            render: (h, params) => {
                                let style = {
                                    fontSize: '14px',
                                    color: '#24AC17',
                                    marginRight: '5px'
                                }

                                if(item.name == 'file_real_name'){
                                    return h('div', [
                                        h('Icon', {
                                            style: style,
                                            props: {
                                                type: 'image'
                                            }
                                        }),
                                        h('strong', params.row[item.name])
                                    ]);
                                }
                                else{
                                    return h('div', [
                                        h('strong', params.row[item.name])
                                    ]);
                                }
                            }
                        })
                    })

                    // 格式化附件数据
                    listData.forEach(function(item){
                        var json = {};
                        for(var name in item){
                            if(name == 'file_size'){
                                json[name] = bytesToSize(item[name])
                            }
                            else{
                                json[name] = item[name]
                            }
                        }

			            // 附件列表，加上操作
                        if(item.file_real_name){
                            json.type = item.file_real_name.substring(item.file_real_name.lastIndexOf('.'), item.file_real_name.length);
                            json.success = '2';
                        }

                        result.updataData.push(json);
                    })

                    return result;
                }

                /**
                 * 格式化文件大小  1024为单位
                 */
                function bytesToSize(bytes) {
                    if (bytes === 0) return '0 B';

                    var k = 1024,
                        sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                        i = Math.floor(Math.log(bytes) / Math.log(k));

                    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
                    //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
                }
            },
            /**
             * 初始化下拉框数据集
             */
            initSelectTreeData (items){
                var _this = this;

                items.forEach(function(item){
                    // 非select、radio不执行下面逻辑
                    if(!(item.cellType == 'treeSelect' || item.cellType == 'radio')) return false;

                    // 如果对应的的下拉选择infosetid有下拉框时，不执行下面的逻辑
                    if(_this.treeSelectData[item.keyValueBean.infoSetId] && _this.treeSelectData[item.keyValueBean.infoSetId].length>0) {
                        item['treeSelectData'] = _this.treeSelectData[item.keyValueBean.infoSetId];
                        return false;
                    }

                    // 为treeSelect\radio时，获取选项数据
                    _this.getKeyValueData({
                        data: item.keyValueBean,
                        success: function (data) {
                            item['treeSelectData'] = data.beans;
                            _this.treeSelectData[item.keyValueBean.infoSetId] = data.beans;  // 保存起来，方便之后不再重复请求下拉框数据
                        }
                    })
                })
            },
            /**
             * 保存
             */
            saveRowData () {
                var _this = this,
                    oSendObj = {};

                oSendObj.editCondition = _this.$parent.editCondition;
                oSendObj.infoSetId = _this.templateItem.templateId;
                oSendObj.dataList = formatSendData(_this.templateItem.data[0].data);

                oSendObj.uuid = _this.templateItem.data[0].uuid;  // 修改时加上uuid
                _this.$daydao.$ajax({
                    url:gMain.apiBasePath +"route/"+oSendObj.infoSetId+"/update.do",
                    data:JSON.stringify(oSendObj),
                    success: function(data){
                        // 保存失败
                        if(data.result != "true") return _this.$Message.error(data.resultDesc);

                        // 保存成功
                        _this.cancelRowData();
                        _this.getDetailOptionData();
                    }
                });

                /**
                 * 格式化详情列表数据
                 */
                function formatSendData(items){
                    var arr = [];

                    items.forEach(function(item){
                        if(item.cellType == 'date'){
                            // 日期
                            let sDateType = item.cellType;

                            let format = checkDateType(sDateType).format,
                                dateType = checkDateType(sDateType).dateType;

                            let date = dateFormat(item.value, format);
                            arr.push({
                                key: item.name,
                                value: date
                            })
                        }
                        else if(item.cellType == 'treeAdviceSelect' || item.cellType == 'treeSelect'){
                            // 下拉框
                            arr.push({
                                key: item.name,
                                value: $('input[name='+item.name+']').val()
                            })
                        }
                        else if(item.cellType == 'radio'){
                            // 单选框

                            item.treeSelectData.forEach(function(selectItem){
                                if(selectItem.name != item.value) return false;
                                arr.push({
                                    key: item.name,
                                    value: selectItem.id
                                })
                            })
                        }
                        else if(item.cellType == 'checkbox'){
                            arr.push({
                                key: item.name,
                                value: item.value ? 1 : 0
                            })
                        }
                        else {
                            arr.push({
                                key: item.name,
                                value: item.value
                            })
                        }

                    })
                    return arr;
                }

                /*
                 * check dateType
                 * return {forat:"" , dateType:""}
                 */
                function checkDateType(sDateType){
                    var format = "yyyy-MM-dd",
                        dateType = "date";

                    if(sDateType == "datetime"){
                        format = "yyyy-MM-dd HH:mm:ss";
                        dateType = "datetime"
                    }
                    else if(sDateType == "date_worktime"){
                        format = "H:mm";
                        dateType = ""
                    }else if(sDateType == "date_yyyy_MM_dd_HH_mm"){
                        format = "yyyy-MM-dd HH:mm";
                        dateType = "datetime"
                    }else if(sDateType == "date_yyyy_MM_dd_HH"){
                        format = "yyyy-MM-dd HH";
                        dateType = "datetime";
                    }else if(sDateType == "date_yyyy_MM"){
                        format = "yyyy-MM";
                        dateType = "month"
                    }else if(sDateType == "date_yyyy"){
                        format = "yyyy";
                        dateType = "year"
                    }
                    let result = {
                        'format'  : format,
                        'dateType': dateType
                    }

                    return result
                }


                function dateFormat(date, format){
                    if(typeof date == 'string') return date;

                    if(format ===undefined){
                        format = date;
                        date =new Date();
                    }
                    var map ={
                        "M": date.getMonth()+1,//月份
                        "d": date.getDate(),//日
                        "h": date.getHours(),//小时
                        "m": date.getMinutes(),//分
                        "s": date.getSeconds(),//秒
                        "q":Math.floor((date.getMonth()+3)/3),//季度
                        "S": date.getMilliseconds()//毫秒
                    };
                    format = format.replace(/([yMdhmsqS])+/g,function(all, t){
                        var v = map[t];
                        if(v !==undefined){
                            if(all.length >1){
                                v ='0'+ v;
                                v = v.substr(v.length-2);
                            }
                            return v;
                        }else if(t ==='y'){
                            return(date.getFullYear()+'').substr(4- all.length);
                        }
                        return all;
                    });
                    return format;
                }
            },
            /**
             * 取消
             */
            cancelRowData () {
                this.templateItem = JSON.parse(JSON.stringify(this.editListData));
                // 初始化选项的下拉框选项
                this.initSelectTreeData(this.templateItem.data[0].data);
            },
            /**
             * 分页-切换页码事件
             */
            changePage (pageNo){
                var _this = this;

                _this.pageNO = pageNo;
                _this.getAttachmentData();
            },
            /**
             * 分页-切换每页条数
             */
            changePageSize (pageSize){
                var _this = this;

                _this.pageSize = pageSize;
                _this.getAttachmentData();
            },
            /**
             * 获取下拉键值对
             * @options.data
             * @options.success
             * */
            getKeyValueData (options) {

                this.$daydao.$ajax({
                    url: gMain.apiBasePath +"route/getKeyValueData.do",
                    data: JSON.stringify(options.data),
                    beforeSend:function(){
                        //typeof options.beforeSend == "function" && options.beforeSend();
                    },
                    complete:function(){
                        //typeof options.complete == "function" && options.complete();
                    },
                    success: function(data){
                        if(data.result == "true"){
                            typeof options.success == "function" && options.success(data);
                        }
                    }
                });
            },
            /**
             * 获取单个模版数据
             * templateId 模版id
             * isEdit  是否为只可编辑的模版
             */
            getDetailOptionData () {
                var _this = this,
                    oSendObj = {    // 请求子模块数据条件
                        infoSetId: _this.templateItem.templateId,
                        editCondition: _this.$parent.editCondition
                    };

                _this.$daydao.$ajax({
                    url: gMain.apiBasePath + "route/"+ _this.templateItem.templateId +"/getEditDataAndColumn.do",
                    data: JSON.stringify(oSendObj),
                    success: function (data) {

                        var dataBeans = data.beans[0];
                        dataBeans.data.forEach(function(item){
                            var arr = [];
                            dataBeans.columnEdit.forEach(function(columnItme){

                                if(!columnItme.isEditShow) return;

                                if(columnItme.cellType == 'checkbox'){
                                    arr.push({
                                        title: columnItme.title,
                                        name: columnItme.name,
                                        cellType: columnItme.cellType,
                                        keyValueBean: columnItme.keyValueBean,
                                        isMust: columnItme.isMust,
                                        regExpress: columnItme.regExpress,
                                        value: item[columnItme.name] == '1' ? true : false
                                    })
                                }
                                else{
                                    arr.push({
                                        title: columnItme.title,
                                        name: columnItme.name,
                                        cellType: columnItme.cellType,
                                        keyValueBean: columnItme.keyValueBean,
                                        isMust: columnItme.isMust,
                                        regExpress: columnItme.regExpress,
                                        value: item[columnItme.name] || ''
                                    })
                                }
                            });

                            _this.editListData.data[0].data = arr;
                        })
                    }
                })
            },
        },
        watch:{
            'editListData': {
                handler: function(newValue, oldValue){
                    var _this = this;
                    this.templateItem = JSON.parse(JSON.stringify(newValue));
                    _this.initSelectTreeData(_this.templateItem.data[0].data);
                },
                deep: true
            }
        },
    }
</script>
