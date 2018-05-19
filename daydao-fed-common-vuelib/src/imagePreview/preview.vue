<style lang="scss">

    /*前缀*/
    $prefixCls: 'image-preview-plugin';

    .#{$prefixCls}{

        .ivu-modal-header{
            background: #F5F7F9;
            border-radius: 8px 8px 0 0;
        }
        .ivu-modal-close{
            top: 2px;
        }
        .preview-header{
            height: 10px;
        }


        .preview-body{
            position: relative;
            overflow: auto;

            img{
                vertical-align: middle;
            }

            .error-tip{
                position: relative;
                width: 100%;
                height: 100%;

                .img-box{
                    width: 298px;
                    position: absolute;
                    cursor: pointer;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    left: 50%;
                }

                .text{
                    font-size: 14px;
                    color: #657180;
                    text-align: center;
                    margin-top: 30px;
                }
            }
        }

        .ivu-modal-footer{
            padding: 0;
        }
        .preview-footer{
            height: 50px;

            .toolbar{
                user-select:none;
                display: flex;
                list-style: none;
                opacity: 0.6;
                background: #1C1F22;
                border-radius: 3px;
                overflow: hidden;
                padding: 12px;
                width: 520px;
                margin: 0 auto;

                li{
                    flex: 1;
                    float: left;
                    border-left: 1px solid #3e3e3e;
                    text-align: center;

                    &:first-child{
                        border-left: 0;
                    }

                    &.icon{
                        a{
                            &:last-child {
                                margin-left: 10px;
                            }

                            i{
                                font-size: 18px;
                            }
                        }
                    }

                    a{
                        color: #ffffff;
                        font-size: 16px;

                        &:hover{
                            color: #F18950;
                        }

                        &:active{
                            color: #E6773B;
                        }
                    }
                }
            }
        }
    }

</style>

<template>
    <Modal
        :class-name="prefixCls"
        :width="width"
        v-model="show"
        title="">
        <div slot="header" class="preview-header"></div>
        <div class="preview-body" :style="{height: previewHeight + 'px'}">
            <img
                v-show="!loading && !loadError"
                :src="currentSrc"
                :style="{
                    transform: 'rotate(' + rotate + 'deg)',
                    width: imgWidth,
                    height: imgHeight,
                    marginLeft: imgMarginLeft + 'px',
                    marginTop: imgMarginTop + 'px'
                }"
                @load="imgLoad"
                @error="imgError"
            >
            <Spin fix size="large" v-show="loading"></Spin>
            <div class="error-tip" v-show="loadError">
                <div class="img-box">
                    <img :src="errorImg" alt="加载失败">
                    <div class="text">加载失败</div>
                </div>
            </div>
        </div>
        <div slot="footer" class="preview-footer">
            <ul class="toolbar">
                <li class="icon" v-if="isMultiple">
                    <a @click="prevImg" ><i class="iconfont_daydao_common">&#xe6a8;</i></a>
                    <a @click="nextImg" ><i class="iconfont_daydao_common">&#xe6aa;</i></a>
                </li>
                <li class="icon">
                    <a @click="rotateImg(-1)"><i class="iconfont_daydao_common">&#xe704;</i></a>
                    <a @click="rotateImg(1)"><i class="iconfont_daydao_common">&#xe702;</i></a>
                </li>
                <li class="icon">
                    <a @click="zoom(1)"><i class="iconfont_daydao_common">&#xe700;</i></a>
                    <a @click="zoom(-1)"><i class="iconfont_daydao_common">&#xe701;</i></a>
                </li>
                <li>
                    <a @click="viewOriginalImage">查看原图</a>
                </li>
                <li>
                    <a @click="download">下载原图</a>
                </li>
            </ul>
        </div>
    </Modal>
</template>

<script>
    import ErrorImg from './images/error.png'
    export default {
        props: {
            /** 图片地址 */
            src: [Array, String]
            /** 打开第几张图片 */
            , index: {
                type: Number,
                default(){
                    return 0;
                }
            }
            /** 是否打开 */
            , value: {
                type: Boolean,
                default(){
                    return false
                }
            }
        },
        data(){
            return {
                prefixCls: 'image-preview-plugin'
                , show: false
                , errorImg: ErrorImg
                // 弹窗高宽
                , width: 1024
                // 容器高宽
                , previewWidth: 0
                , previewHeight: 580
                // 当前显示图片地址
                , currentSrc: ''
                // 当前图片位置
                , currentIndex: 0
                // 图片加载时loading层
                , loading: true
                // 加载失败
                , loadError: false
                // 旋转角度
                , rotate: 0
                // 图片对象
                , imageObj: null
                // 图片高宽
                , imgWidth: 'auto'
                , imgHeight: 'auto'
                // 图片外填充
                , imgMarginLeft: 0
                , imgMarginTop: 0
                // 缩放比率：20%
                , zoomRatio: 0.2
                // 每次缩放量
                , zoomWidth: 0
                , zoomHeight: 0
                // 缩放次数
                , zoomTime: 0
                // 最大缩放次数
                , maxZoomTime: 20
            };
        },
        computed: {
            /** 是否多张图片 */
            isMultiple(){
                return Array.isArray(this.src) && this.src.length > 1;
            }
            /** 第一张图片 */
            , firstImg(){
                return this.currentIndex === 0;
            }
            /** 最后一张图片 */
            , lastImg(){
                return this.currentIndex === (this.src.length - 1);
            }
        },
        methods: {
            /** 图片加载完成 */
            imgLoad(e){
                let t = this;
                // 图片高宽
                let image = e.target,
                    imgW = image.width,
                    imgH = image.height;

                // 图片容器高宽
                let previewBody = image.parentNode,
                    pW = previewBody.offsetWidth,
                    pH = previewBody.offsetHeight;

                let box = t.computeBox(imgW, imgH, pW, pH);

                // 设置缩放量
                t.zoomWidth = box.width * t.zoomRatio;
                t.zoomHeight = box.height * t.zoomRatio;

                // 设置图片初始化高度宽度
                t.imgWidth = box.width + 'px';
                t.imgHeight = box.height + 'px';

                // 设置图片初始化外填充
                t.imgMarginLeft = (box.left < 0? 0: box.left);
                t.imgMarginTop = (box.top < 0? 0: box.top);

                t.imageObj = image;
                t.loading = false;
            }
            /** 图片加载失败 */
            , imgError(){
                this.loadError = true;
            }
            /**
             *  计算盒子高宽和位置
             *
             *  @param imgWidth
             *  @param imgHeight
             *  @param previewWidth
             *  @param previewHeight
             *
             */
            , computeBox(imgWidth, imgHeight, previewWidth, previewHeight){
                let t = this;
                // 计算图片新高度
                let width = imgWidth, height = imgHeight;

                let box = {
                    width: width,
                    height: height
                };

                if(imgWidth > previewWidth){
                    box = t.computeWidth(imgWidth, imgHeight, previewWidth);
                }else if(imgHeight > previewHeight){
                    box = t.computeHeight(imgWidth, imgHeight, previewHeight);
                }

                // 如果计算后图片宽度还大于容器宽度
                if(width > previewWidth){
                    box = t.computeWidth(imgWidth, imgHeight, previewWidth);
                }
                // 如果计算后图片高度还高于容器高度
                if(height > previewHeight){
                    box = t.computeHeight(imgWidth, imgHeight, previewHeight);
                }

                width = box.width;
                height = box.height;

                // 图片显示位置
                let top = (previewHeight - height) / 2,
                    left = (previewWidth - width) / 2;

                return {
                    width: width,
                    height: height,
                    left: left,
                    top: top
                }
            }
            /**
             * 计算宽度
             * @param imgWidth
             * @param imgHeight
             * @param previewWidth
             */
            , computeWidth(imgWidth, imgHeight, previewWidth){
                let width = previewWidth;
                let ratio = previewWidth / imgWidth;// 比率
                let height = imgHeight * ratio;
                return {
                    width: width,
                    height: height
                }
            }
            /**
             * 计算高度
             *
             * @param imgWidth
             * @param imgHeight
             * @param previewHeight
             */
            , computeHeight(imgWidth, imgHeight, previewHeight){
                let height = previewHeight;
                let ratio = previewHeight / imgHeight;// 比率
                let width = imgWidth * ratio;
                return {
                    width: width,
                    height: height
                }
            }
            /** 重置参数 */
            , resetParam(){
                let t = this;
                t.currentSrc = '';
                t.loading = true;
                t.loadError = false;

                t.rotate = 0;

                t.imgHeight = 'auto';
                t.imgWidth = 'auto';

                t.zoomTime = 0;
            }
            /**
             * 上一张
             */
            , prevImg(){
                let t = this;
                // 第一张和加载中不能上一张
                if(!t.firstImg && !t.loading){
                    t.resetParam();
                    t.currentSrc = t.src[--t.currentIndex];
                }
            }
            /**
             * 下一张
             */
            , nextImg(){
                let t = this;
                // 最后一张和加载中不能上一张
                if(!t.lastImg && !t.loading){
                    t.resetParam();
                    t.currentSrc = t.src[++t.currentIndex];
                }
            }
            /**
             * 旋转图片
             */
            , rotateImg(ori){
                let t = this;
                let r = t.rotate + ori * 90;
                let plus = Math.abs(r);

                if(plus>360){
                    t.rotate = ori * 90
                }else{
                    t.rotate = r;
                }

                let imgObj = t.imageObj;
                let width = imgObj.width,
                    height = imgObj.height;

                let previewBody = t.$el.querySelector('.preview-body'),
                    previewW = previewBody.offsetWidth,
                    previewH = t.previewHeight;


                // 图片旋转后高宽不会自动转换，手动计算
                if(t.rotate === 90 || t.rotate === 270){
                    if(width > previewH && height < previewW){
                        t.imgMarginTop = (width - height) / 2;
                        // 如果是宽图，则需计算图片右边距
                        t.imgMarginLeft = (previewW - height) / 2 + (height - width) / 2;
                    }
                    if(height > previewW){
                        t.imgMarginLeft = (height - width) / 2;
                        // 如果是长图，则滚动条定位到最中间
                        previewBody.scrollTop = (previewBody.scrollHeight - previewH)/2;
                    }
                }else {
                    // 图片旋转回原来原来角度时左右外填充续重新计算
                    if(width < previewW){
                        t.imgMarginLeft = (previewW - width) / 2;
                    }else{
                        t.imgMarginLeft = 0;
                    }

                    if(height < t.previewHeight){
                        t.imgMarginTop = (t.previewHeight - height) / 2;
                    }else{
                        t.imgMarginTop = 0;
                    }
                }
            }
            /**
             * 图片缩放
             *
             * @param zoom 1放大；-1缩小
             */
            , zoom(zoom){
                let t = this;
                let time = t.zoomTime + zoom;
                // 在缩放次数内
                if(Math.abs(time) <= t.maxZoomTime){
                    // 计数
                    t.zoomTime = time;

                    let previewBody = t.$el.querySelector('.preview-body'),
                        previewW = previewBody.offsetWidth,
                        previewH = t.previewHeight;

                    let width = t.imageObj.width,
                        height = t.imageObj.height;

                    let zoomW = width  + t.zoomWidth * zoom,
                        zoomH = height + t.zoomHeight * zoom;

                    // 如果图片高或宽小于10个像素则不继续缩小
                    if(zoomW < 10 || zoomH < 10){
                        return ;
                    }

                    if(t.rotate === 90 || t.rotate === 270){
                        if(width > previewH && height < previewW){
                            t.imgMarginTop = (width - height) / 2;
                            // 如果是宽图，则需计算图片右边距
                            t.imgMarginLeft = (previewW - height) / 2 + (height - width) / 2;
                        }
                        if(height > previewW){
                            t.imgMarginLeft = (height - width) / 2;
                            // 如果是长图，则滚动条定位到最中间
                            previewBody.scrollTop = (previewBody.scrollHeight - previewH)/2;
                        }
                    }else {
                        let left = (previewW - zoomW) / 2;
                        t.imgMarginLeft = (left < 0 ? 0 : left);

                        let top = (previewH - zoomH) / 2;
                        t.imgMarginTop = (top < 0 ? 0 : top);
                    }

                    t.imgWidth = zoomW + 'px';
                    t.imgHeight = zoomH + 'px';
                }
            }
            /**
             * 查看原图
             */
            , viewOriginalImage(){
                let t = this;
                let win = window.open();
                let image = document.createElement('img');
                image.src = t.currentSrc;
                win.document.body.appendChild(image)
            }
            /**
             * 下载原图
             */
            , download(){
                let t = this;
                if(t.currentSrc.startsWith('http')){
                    window.location.href = t.currentSrc;
                }else{
                    let obj = t.base64ToBolb(t.currentSrc);
                    t.saveAs(obj.blob, new Date().getTime() + '.' + obj.suffix);
                }
            }
            /**
             * base64转bolb对象
             * @param base64Str
             */
            , base64ToBolb(base64Str){
                let typeAndBase64 = base64Str.split(',');
                let bytes = window.atob(typeAndBase64[1]);
                let ia = new Uint8Array(bytes.length);
                for (let i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }
                let imageType = typeAndBase64[0].split(':')[1];
                let startIndex = imageType.indexOf(':');
                let endIndex = imageType.indexOf(';');
                let type = imageType.substring(startIndex+1, endIndex);
                return {blob: new Blob( [ia] , {type : type}), suffix: type.split('/')[1]};
            }
            /**
             * 另存为
             *
             * @param data blob数据
             * @param fileName 文件名
             * */
            , saveAs(data, fileName) {
                let a = document.createElement("a");
                a.href = window.URL.createObjectURL(data);
                a.download = fileName;
                document.body.appendChild(a);

                try{
                    a.click();
                }catch (e){
                    // ie安全问题无法直接访问click
                    navigator.msSaveBlob(data, fileName)
                }
            }
        },
        created(){
            let t = this;
            let winHeight = window.innerHeight;
            let winWidth = window.innerWidth;

            if(winWidth > 1024 && winHeight > 700){
                t.width = 1024;
                t.previewHeight = 580;
            }else if(winWidth < 1024){
                t.width = 585;
                t.previewHeight = 280;
            }else if(winHeight < 700){
                t.width = 585;
                t.previewHeight = 280;
            }

        },
        watch: {
            show(val){
                if(!val){
                    this.$emit('input', val);
                }
            },
            value(val){
                let t = this;
                if(val){
                    t.resetParam();
                    t.$nextTick(()=>{
                        t.currentIndex = t.index;
                        if(Array.isArray(t.src)){
                            t.currentSrc = t.src[t.index > t.src.length ? 0: t.index];
                        }else{
                            t.currentSrc = t.src;
                        }
                        t.show = val;
                    });
                }
            },
            src(val){
                let t = this;
                if(val) {
                    t.currentIndex = t.index;
                    if (Array.isArray(val)) {
                        t.currentSrc = val[t.index > val.length ? 0 : t.index];
                    } else {
                        t.currentSrc = val;
                    }
                }
            }
        }
    }
</script>
