<style lang="scss">
    /*前缀*/
    $prefixCls: 'upload-image-plugin';

    $itemWidth: 83px;
    $itemHeight: 83px;
    $borderColor: #D7DDE4;

    .#{$prefixCls}{
        background-color: #ffffff;

        .img-list{
            width: 515px;
            overflow: hidden;

            .add-img, .img-item{
                position: relative;
                border-radius: 2px;
                float: left;
                width: $itemWidth;
                height: $itemHeight;
                border: 1px solid $borderColor;
                margin: 10px 20px 10px 0;
            }

            .img-item{

                .img-box{
                    position: relative;
                    overflow: hidden;
                    width: $itemWidth;
                    height: $itemHeight;
                    border: 1px solid $borderColor;
                    margin: -1px;

                    img {
                        position: absolute;
                        cursor: pointer;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        max-width: $itemWidth;
                        left: 50%;
                    }

                    .waiting, .error, .progress{
                        position: absolute;
                        text-align: center;
                        font-size: 12px;

                        width: $itemWidth;
                        height: $itemHeight;

                        z-index: 1;
                    }

                    .waiting{
                        background: $borderColor;
                        color: #BBC3CC;
                        line-height: $itemHeight;
                    }

                    .error{
                        background: #E3E3E3;
                        padding-top: 25px;

                        .error-text{
                            font-size: 14px;
                            color: #FF5557;
                        }

                        .error-reset{
                            a{
                                color: #2D8CF0;
                            }
                        }
                    }

                    .progress{
                        line-height: $itemHeight;

                        .mark{
                            position: absolute;
                            width: $itemWidth;
                            height: $itemHeight;
                            background: #000000;
                            opacity: 0.5;
                        }

                        .ivu-progress-outer{
                            padding: 0 12px;

                            .ivu-progress-bg{
                                background-color: #BBC3CC;
                            }
                        }
                    }

                }

                .remove{
                    position: absolute;
                    cursor: pointer;
                    color: #ffffff;
                    background-color: #FF5557;
                    border-radius: 100%;
                    width: 17px;
                    height: 17px;
                    line-height: 17px;
                    top: -10px;
                    right: -10px;

                    text-align: center;
                    z-index: 12;

                    i{
                        font-size: 12px;
                    }
                }
            }

            .add-img{
                color: $borderColor;
                line-height: $itemHeight;
                text-align: center;

                .iconfont_daydao_common{
                    font-size: 36px;
                }

                .file{
                    cursor: pointer;
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: $itemHeight;
                    width: $itemWidth;
                    z-index: 1;
                }
            }
        }

        .max-size-text{
            margin-top: -10px;
            font-size: 12px;
            color: #90A2B9;
        }

        .clearfix:after,
        .clearfix:before{
            visibility: hidden;
            display: block;
            font-size: 0;
            content: " ";
            clear: both;
            height: 0;
        }
    }
</style>

<template>
    <div :class="[prefixCls]">
        <div class="img-list clearfix">
            <div class="img-item" v-for="(item, index) in fileList">
                <div class="img-box" @click="previewImg(index)">
                    <img :src="item.src" v-img-load="item" >
                    <Spin fix size="large" v-show="item.loading"></Spin>
                    <div class="waiting" v-show="item.status === status.waiting">
                        等待上传
                    </div>
                    <div class="error" v-show="item.status === status.error">
                        <p class="error-text">上传失败</p>
                        <p class="error-reset">
                            <a @click="restart(item)">点击重新上传</a>
                        </p>
                    </div>
                    <div class="progress" v-show="item.status === status.uploading">
                        <div class="mark"></div>
                        <Progress :percent="item.process" hide-info :stroke-width="5"></Progress>
                    </div>
                </div>
                <div class="remove" v-show="!readonly" title="删除" @click="del(item, index)"><i class="iconfont_daydao_common">&#xe61a;</i></div>
            </div>
            <div class="add-img" v-if="!readonly && fileList.length < maxlength">
                <i class="iconfont_daydao_common">&#xe619;</i>
                <input type="file" class="file" title="请选择要上传图片" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg+xml,image/bmp,image/x-icon" multiple @change="selectFile">
            </div>
        </div>
        <div class="max-size-text clearfix" v-if="!readonly">
            图片不超过{{maxSizeText}}
        </div>
        <!-- 图片预览 -->
        <image-preview
            :src="srcs"
            :index="previewIndex"
            v-model="showPreview"
        ></image-preview>
    </div>
</template>

<script>
    import Ajax from './Ajax'
    import ImagePreview from '../imagePreview/index'
    import lib from './lib/index'

    let {BrowserMd5File, CosCloud} = lib;

    export default {
        components: {ImagePreview},
        props: {
            /** 值 */
            value: {
                type: Object,
                default(){
                    return {};
                }
            }
            /** 单文件大小默认10M */
            , maxsize: {
                type: Number,
                default(){
                    return 10;
                }
            }
            /** 图片最大张数，默认9张 */
            , maxlength: {
                type: Number,
                default(){
                    return 9;
                }
            }
            /** 是否只读状态 */
            , readonly: {
                type: Boolean,
                default(){
                    return false;
                }
            }
            /** 加载图片uuid */
            , uuids: {
                type: Array,
                default(){
                    return [];
                }
            }
            /** 压缩比率0.1~1;1为不压缩 */
            , compressRatio: {
                type: Number,
                default(){
                    return 0.7;
                }
            }
            /** 图片压缩时宽度，默认1000px(只有在图片压缩情况下有效) */
            , compressWidth: {
                type: Number,
                default(){
                    return 1001;
                }
            }
        },
        data(){
            return {
                // 前缀
                prefixCls: 'upload-image-plugin'
                // 单张图片大小
                , oneImgMaxSize: 0
                // 图片
                , fileList: []
                // 上传状态
                , status: {
                    waiting: 'waiting',
                    uploading: 'uploading',
                    success: 'success',
                    error: 'error'
                }
                // 当前上传数
                , uploading: 0
                // 同时上传个数
                , maxUploading: 1
                // 显示图片预览窗口
                , showPreview: false
                // 图片预览位置
                , previewIndex: 0
            };
        },
        computed: {
            /** 最大大小 */
            maxSizeText(){
                return this.formatFileSize(this.oneImgMaxSize);
            }
            /** 等待上传文件 */
            , waitingFiles(){
                let t = this;
                let status = t.status;
                return t.fileList.filter((item)=>{
                    return item.status === status.waiting;
                });
            }
            /** 图片地址 */
            , srcs(){
                let t = this;
                let srcs = [];
                t.fileList.forEach(item=>{
                    srcs.push(item.src);
                });

                return srcs;
            }
        },
        methods: {
            /**
             *  用户选择文件
             * */
            selectFile(e){
                let t = this;
                let target = e.target;
                let files = target.files;
                t.checkFileType(files);
                target.value = ''
            }
            /**
             *  验证文件类型
             *
             *  @param fileList
             * */
            , checkFileType(fileList){
                let t = this;
                let status = t.status;
                let readyLen = t.fileList.length;
                let len = fileList.length;
                if(len > (t.maxlength - readyLen)){
                    this.$Modal.warning({
                        title: '提示',
                        content: '<p style="text-align: center;">最多只能上传' + t.maxlength + '张图片</p>'
                    });
                    return ;
                }
                let hasExceedSize = false;
                for(let i = 0; i<len; i++){
                    let file = fileList[i];
                    let size = file.size;
                    if(t.oneImgMaxSize < size){
                        hasExceedSize = true;
                        continue;
                    }
                    if(/image\/\w+/.test(file.type)){

                        t.imageToBase64(file, (base64)=>{
                            t.fileList.push({
                                file: file,
                                name: file.name,
                                size: size,
                                src: base64,
                                uuid: '',
                                status: status.waiting,
                                process: 0,
//                                lastLoaded: 0,
//                                lastTime: 0,
                                loading: false,
                                isNew: true
                            });
                        });

                    }
                }

                if(hasExceedSize){
                    this.$Modal.warning({
                        title: '提示',
                        content: '<p style="text-align: center;">单张图片最大不超过' + t.maxSizeText + '</p>'
                    });
                }

            }
            /**
             * 添加队列
             *
             * @param item
             */
            , addQueue(item){
                let t = this;
                if(!item){return ;}
                if(t.uploading < t.maxUploading) {

                    t.uploading++;
                    item.status = t.status.uploading;

                    t.md5(item);
                    t.addQueue(t.waitingFiles[0]);
                }
            }
            /**
             * 文件计算md5值
             */
            , md5(file){
                let t = this;
                file.sparkMd5 = BrowserMd5File(file.file, function (err, md5) {
                    if (err) {
                        t.completeUpload(false, file);
                        return;
                    }

                    file.md5 = md5;

                    if(t.compressRatio > 0 && t.compressRatio < 1){
                        // 压缩图片
                        t.compressImg(file);
                    }else{
                        // 直接上传
                        t.preupLoadFile(file);
                    }
                });
            }
            /**
             *  图片预上传
             *
             *  @param file
             * */
            , preupLoadFile(file){
                let t = this;
                // 1、验证文件在服务器是否存在
                Ajax.preupLoadFile(file.name, file.size, file.md5).then( data =>{
                    if (data && data.uploadFlg === 'true') {
                        file.uuid = data.data.uuid;
                        // 2、秒存
                        t.completeUpload(true, file);
                    } else {
                        // 3、文件在服务器不存在，则需要上传云
                        t.getSign(file, data);
                    }
                });
            }

            /**
             * 图片压缩，非图片不做处理
             *
             * @param file
             */
            , compressImg: function(file){
                const t = this;
                lrz(file.file, {
                    width: t.compressWidth // 图片宽度最大1001
                    , quality: t.compressRatio // 图片压缩比率
                })
                    .then(function (rst) {
                        file.file = rst.file;
                        file.size = rst.fileLen;
                        t.preupLoadFile(file);
                    })
                    .catch(function (e) {
                        // 压缩出错
                        t.completeUpload(false, file);
                    })
                ;
            }
            /**
             * 获取签名
             *
             * @param file
             * @param upFileName
             */
            , getSign(file, upFileName){
                let t = this;
                Ajax.getSign(upFileName, file.name).then((data) => {
                    t.uploadCossh(data, file);
                });
            }
            /**
             * 上传腾讯云
             *
             * @param sign
             * @param file
             */
            , uploadCossh(signInfo, file){
                let t = this;
                let cloudSign = Ajax.cloudSign;
                // 创建上传云服务器对象
                file.cos = new CosCloud({
                    appid: cloudSign.appid,// APPID 必填参数
                    bucket: cloudSign.bucketName,//bucketName 必填参数
                    region: cloudSign.region,//地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
                    getAppSign: function (callback) {
                        callback(signInfo.sign);
                    },
                    getAppSignOnce: function (callback) {
                        callback(signInfo.sign);
                    }
                });

                file.cos.uploadFile(function(data){
                    // 成功回调
                    t.sendCosshResult(data, file);
                }, function(data){
                    // 失败回调
                    if(data.statusText !== 'abort'){
                        t.completeUpload(false, file);
                    }
                }, function(percent, sha1Check){
                    // 上传进度
                    t.fileUploadProgress(percent, sha1Check, file);
                }, cloudSign.bucketName, signInfo.cosPath, file.file, 1, function(taskId){
                    file.taskId = taskId;
                });

            }
            /**
             * 发送上传云服务成功反馈信息到后台
             *
             * @param data
             * @param file
             */
            , sendCosshResult(data, file){
                let t = this;
                let responseJson = typeof data === "string" ? JSON.parse(data): data;
                Ajax.upLoadFile(file.name, file.size, file.md5, responseJson).then( data => {
                    file.uuid = data.uuid;
                    // 文件上传完成
                    t.completeUpload(true, file);
                });
            }
            , fileUploadProgress(percent, sha1Check, file){
                let t = this;
//                let currTime = new Date().getTime();
//                let currLoaded = percent * file.size;

//                let dT = currTime - file.lastTime;
//                let dL = currLoaded - file.lastLoaded;

//                let speed = Math.abs(parseInt(dL / dT));

//                file.lastLoaded = currLoaded;
//                file.lastTime = currTime;

                let progress = parseInt(percent * 100, 10) ;// + '%';
                file.process = progress;
//                t.file.statusDesc = progress + '('+ (speed > 1000 ? (speed / 1024).toFixed(2) + 'M': speed + 'KB') +'/s)';
            }
            /**
             * 上传完成: true完成；false失败
             *
             * @param type
             * @param file
             */
            , completeUpload(type, file){
                let t = this;
                if(type){
                    file.status = t.status.success;
                }else{
                    file.status = t.status.error;
                }
                // 不管成功失败，都算成功
                t.uploading--;
                file.process = 0;

                t.getValue();
            }
            /**
             * 删除
             *
             * @param item
             * @param index
             * */
            , del(item, index){
                let t = this;
                if(item.status === t.status.uploading || item.status === t.status.waiting){
                    // 如果还在计算md5，则取消md5
                    item.sparkMd5 && item.sparkMd5.destroy();
                    // 如果已经开始腾讯云上传，则取消上传
                    item.cos && item.cos.cancelTask(item.taskId);
                    // 去除dom节点
                    t.fileList.splice(index, 1);
                    // 如果图片还在上传中
                    if(item.status === t.status.uploading){
                        t.uploading--;
                    }
                }else{
                    // 图片是用户第二次编辑
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p style="text-align: center">您确定要删除图片吗？</p>',
                        onOk: () => {
                            //
                            t.fileList.splice(index, 1);
                        }
                    });
                }
            }
            /**
             * 重试
             *
             * @param item
             */
            , restart(item){
                item.status = this.status.waiting;
            }
            /**
             *  图片转base64
             *
             *  @param file  图片
             *  @param callback 回调
             * */
            , imageToBase64(file, callback) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    callback(e.target.result);
                };
            }
            /**
             * 格式化图片大小
             * @param val
             * @param decimal
             * @return {*}
             */
            , formatFileSize(val, decimal = 0){

                if (val === 0) {
                    return val
                }

                if (val < 1024) {
                    val = val + 'B';
                } else if (val >= 1024 && val < 1048576) {
                    val = parseInt(val / 1024) + 'K';
                } else if (val >= 1048576 && val < 1073741824) {
                    val = (decimal > 0 ? parseFloat(val / 1048576).toFixed(decimal) : parseInt(val / 1048576)) + 'M';
                } else {
                    val = (decimal > 0 ? parseFloat(val / 1073741824).toFixed(decimal) : parseInt(val / 1073741824)) + 'G';
                }

                return val;
            }
            /**
             * 预览
             *
             * @param index
             */
            , previewImg(index){
                let t = this;
                t.showPreview = true;
                t.previewIndex = index;
            }
            /**
             * 获取最终结果
             */
            , getValue(){
                // [uuid], [{file}], status
                let t = this;
                let status = t.status;
                let files = [], uuids = [], isSuccess = true;
                t.fileList.forEach(item=>{
                    files.push({
                        name: item.name,
                        size: item.size,
                        status: item.status,
                        uuid: item.uuid,
                        isNew: item.isNew
                    });
                    if(item.status === status.success){
                        uuids.push(item.uuid);
                    }else{
                        isSuccess = false;
                    }
                });

                t.$emit('input', {
                    uuids: uuids,
                    files: files,
                    upLoading: !isSuccess
                });

            }
            /**
             * 加载用户传入图片
             */
            , loadImg(){
                let t = this;
                // 批量获取图片
                Ajax.batchGetImgUrl(t.uuids.join(',')).then(data => {
                    for (let uuid in data) {
                        t.fileList.push({
                            src: data[uuid],
                            uuid: uuid,
                            loading: true,
                            isNew: false,
                            status: t.status.success
                        });
                    }
                });
            }
        },
        created(){
            let t = this;

            t.oneImgMaxSize = t.maxsize * 1048576;

            if(t.uuids && t.uuids.length > 0) {
                t.loadImg();
            }
        },
        mounted(){

        },
        destroyed(){

        },
        watch: {
            uuids(val){
                if(val && val.length > 0) {
                    this.loadImg();
                }else{
                    this.fileList = [];
                }
            },
            waitingFiles(val){
                this.addQueue(val[0]);
            },
            fileList(val){
                this.getValue();
            }
        },
        directives: {
            imgLoad: {
                inserted(el, binding){
                    let item = binding.value;
                    el.onload = function(){
                        item.loading = false;
                    }
                }
            }
        }
    }
</script>
