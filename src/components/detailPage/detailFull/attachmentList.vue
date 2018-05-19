<style lang="scss">
    /*文件批量上传 -- start*/
    .webuploader-container {
        position: relative;
    }
    .webuploader-element-invisible {
        position: absolute !important;
        clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
        clip: rect(1px,1px,1px,1px);
    }
    .webuploader-pick {
        position: relative;
        display: inline-block;
        cursor: pointer;
        background: #fd9309;
        padding: 6px 15px;
        color: #fff;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
        vertical-align: middle;
    }
    .webuploader-pick-hover {
        background: #e0690a;
    }

    .webuploader-pick-disable {
        opacity: 0.6;
        pointer-events:none;
    }
    .base_file_upload{
        width:430px;
        font-size: 12px;
    }
    .base_file_upload_btns{}
    #base_file_upload_btn1{
        padding: 0;
    }
    #base_file_upload_btn2{}
    .base_file_upload_list{
        margin-top: 10px;
        height: 220px;
        border: 1px solid #ccc;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .base_file_upload_list_title{
        font-size: 12px;

        line-height: 22px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .base_file_upload_list_item{

        border-bottom: 1px dashed #ccc;

        padding: 5px 10px;
        position: relative;

        height: 44px;

    }
    .base_file_upload_list_item:last-child{
        border-bottom:none;
    }
    .base_file_upload_list_progress{
        position: absolute;
        border-radius: 1px;
        width: 128px;    height: 15px;
        left: 10px;
        top: 27px;
    }
    .base_file_upload_list_progress_gray{
        position:absolute;
        left: 0px;
        top: 0px;
        width: 128px;
        height: 15px;
        border: 1px solid #CACACA;
        background: #F4FFFF;
    }
    .base_file_upload_list_progress_green{
        position:absolute;
        left: 0px;
        top: 0px;
        height: 15px;
        //background: url(../images/loading_rectangle.jpg) 0 -17px;
        width: 0%;
        border: 1px solid #CACACA;
        background: forestgreen;
    }
    .base_file_upload_list_info{
        position: absolute;
        height: 20px;
        text-align: right;
        left: 150px;
        width:250px;
    }
    .base_file_upload_list_progress_value{
        position: absolute;
        left: 0;
        top: 0;
    }


    /*文件批量上传 -- end*/


</style>

<template>
    <!-- 列表 -->
    <section class="detaile-full-main-l-item detaile-full-main-l-item-table"
             v-if="sectionItem.specialTabType == '1'">
        <h4>
            <em class="icon iconfont_daydao_common">&#xe615;</em>
            <span>{{sectionItem.title}}</span>
            <i class="icon iconfont_daydao_common" @click="uploadFile(sectionItem.templateId)">&#xe69e;</i>
        </h4>
        <div class="detaile-full-main-l-item-content">
            <Table border
                   v-if="attachmentData && attachmentData.updataColumns && attachmentData.updataColumns.length > 0"
                   :height="(attachmentData && attachmentData.updataData && attachmentData.updataData.length > 0) ? 400 : ''"
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
        </div>
    </section>

</template>

<script>
    import {daydaoDropSelect,daydaoDropSelectMul} from 'commonVueLib/daydaoDropSelect/index'

    export default{
        name:"attachmentList",
        props:{
            attachmentListData: {
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
                pageNO: 1,
                pageSize: 10,
                pagePB: {},
                pageSizeOpts: [10, 20, 50, 100]
            };
        },
        created(){
            this.sectionItem = JSON.parse(JSON.stringify(this.attachmentListData));
            this.attachmentData.updataColumns = [];
            this.attachmentData.updataData = [];

            this.getAttachmentData();
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
                            key: 'code_id',
                            value: _this.$parent.editCondition.value
                        },
                        navigationCondition: {
                            key: "code_set_id",
                            value: _this.sectionItem.specialTabParam
                        },
                        pageBean: {pageNo: "1", pageSize: 20}
                    };
                _this.$daydao.$ajax({
                    url: gMain.apiBasePath+"route/"+ templateId+"/getAll.do",
                    data: JSON.stringify(oSendObj),
                    success: function(data){
                        _this.pagePB = data.pb;
                        _this.attachmentData = formatAttachmenTemplateData(_this.sectionItem.columnEdit, data.maps, templateId);

                        console.log('_this.attachmentData', _this.attachmentData)
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
                    result.updataColumns.push({
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            let style = {
                                margin: '0 10px',
                                width: '16px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }

                            if(params.row.success == '0'){
                                // 失败
                                return h('div', [
                                    h('Icon', {
                                        style: style,
                                        props: {
                                            type: 'refresh'
                                        },
                                        nativeOn: {
                                            click: () => {
                                                console.log('重新上传')
                                            }
                                        }
                                    }),
                                    h('Icon', {
                                        style: style,
                                        props: {
                                            type: 'ivu-icon iconfont_daydao_hr_org icon-xiaoiconshanchu'
                                        },
                                        nativeOn: {
                                            click: () => {
                                                console.log('删除')
                                            }
                                        }
                                    })
                                ]);
                            }
                            else if(params.row.success == '1'){
                                // 上传中
                                return h('div', [
                                    h('Icon', {
                                        style: style,
                                        props: {
                                            type: 'pause'
                                        },
                                        nativeOn: {
                                            click: () => {
                                                console.log('取消')
                                            }
                                        }
                                    }),
                                    h('Icon', {
                                        style: style,
                                        props: {
                                            type: 'ivu-icon iconfont_daydao_hr_org icon-xiaoiconshanchu'
                                        },
                                        nativeOn: {
                                            click: () => {
                                                console.log('删除')
                                            }
                                        }
                                    })
                                ]);
                            }
                            else if(params.row.success == '2'){
                                // 成功
                                return h('div', [
                                    h('Icon', {
                                        style: style,
                                        props: {
                                            type: 'ivu-icon iconfont_daydao_hr_org icon-ordinarydownload'
                                        },
                                        nativeOn: {
                                            click: () => {
                                                console.log('下载');
                                                console.log(params)
                                                var _url = gMain.apiBasePath+'route/'+templateId+'/downfilelog.do?fileName='+params.row.file_url+'&fileRealName='+params.row.file_real_name;
                                                window.location.href = _url;
                                            }
                                        }
                                    }),
                                    h('Icon', {
                                        style: style,
                                        props: {
                                            type: 'ivu-icon iconfont_daydao_hr_org icon-xiaoiconshanchu'
                                        },
                                        nativeOn: {
                                            click: () => {
                                                console.log('删除');
                                                var oSendObj = {
                                                    infoSetId: templateId,
                                                    editCondition: {
                                                        key: 'person_id',
                                                        value: params.row.code_id
                                                    },
                                                    uuidLists: []
                                                }

                                                oSendObj.uuidLists.push(params.row.uuid);
                                                deleteFile(oSendObj)
                                            }
                                        }
                                    })
                                ]);
                            }
                            else{
                                console.log('未知的附件列表状态')
                            }

                        }
                    })

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
                                    if(params.row.type == '.png' || params.row.type == '.jpg' || params.row.type == '.gif' || params.row.type == '.bmp'){
                                        // 图片
                                        style.color = '#00ca7e';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_img'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else if(params.row.type == '.ppt'){
                                        // ppt
                                        style.color = '#fc8575';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_ppt'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else if(params.row.type == '.zip'){
                                        // 压缩包
                                        style.color = '#ffbc0d';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_zip1'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else if(params.row.type == '.txt'){
                                        // 文本
                                        style.color = '#ff8f1c';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_txt'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else if(params.row.type == '.doc' || params.row.type == '.docx'){
                                        // word
                                        style.color = '#57b3ff';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_word'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else if(params.row.type == '.xls' || params.row.type == '.xlsx'){
                                        // excel
                                        style.color = '#00c879';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_xlsx'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else if(params.row.type == '.pdf'){
                                        // pdf
                                        style.color = '#ed0000';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_pdf'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else if(params.row.type == '.mp3' || params.row.type == '.mpeg' || params.row.type == '.wma'){
                                        // 音频
                                        style.color = '#ed0000';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_mp'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else if(params.row.type == '.wmv' || params.row.type == '.rmvb' || params.row.type == '.mpg' || params.row.type == '.mov' || params.row.type == '.mp4' || params.row.type == '.avi'){
                                        // 视频
                                        style.color = '#4ea1ff';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_video'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
                                    else{
                                        // 其它
                                        style.color = '#d00000';
                                        return h('div', [
                                            h('Icon', {
                                                style: style,
                                                props: {
                                                    type: 'ivu-icon iconfont_daydao_hr_org icon-fujian_other'
                                                }
                                            }),
                                            h('strong', params.row[item.name])
                                        ]);
                                    }
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

                /**
                 * 删除文件
                 */
                function deleteFile(options){
                    _this.$daydao.$ajax({
                        url: gMain.apiBasePath +"route/"+ options.infoSetId +"/del.do",
                        data: JSON.stringify(options),
                        success: function(data){
                            // typeof options.success == "function" && options.success(data);
                            _this.$Message.success('删除成功');
                            _this.pageNO = 1;
                            _this.getAttachmentData()
                        }
                    });
                }
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
             * 上传附件
             */
            uploadFile (templateId){
                var _this = this;
                //console.log(templateId, _this.$route.params);

                seajs.use('commonStaticDirectory/plugins/webuploader/FileUpload', function (FileUpload) {
                    new FileUpload({
                        url:gMain.apiBasePath + 'route/'+ _this.$route.params.infoSetId +'/uploadAttachment.do',
                        specialTabParam: _this.sectionItem.specialTabParam,
                        codeId: _this.$route.params.id,
                        infoSetId: templateId
                    });
                });
            },
        },
        watch:{
            'attachmentListData': {
                handler: function(newValue, oldValue){
                    this.sectionItem = JSON.parse(JSON.stringify(newValue));
                },
                deep: true
            }
        },
    }
</script>
