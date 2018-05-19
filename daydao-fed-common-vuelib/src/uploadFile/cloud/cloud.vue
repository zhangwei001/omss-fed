<style lang="scss">
    @import "../icon.css";

    /*前缀*/
    $prefixCls: 'cloud-file-plugin';

    .#{$prefixCls}{
        .ivu-modal-header{
            background: #F5F7F9;
            border-radius: 8px 8px 0 0;
        }
        .ivu-modal-close{
            top: 5px;
        }
        .cloud-header{
            height: 15px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex: 1;
            padding-right: 20px;

            .minOrMax{
                float: right;

                i{
                    color: #999;
                }
            }
        }

        .ivu-modal-body{
            padding: 0;
        }
        .cloud-body{
            padding: 16px;

            .title-text{
                font-size: 14px;
                color: #657180;

                .tip{
                    color: #B1B6BF;
                    float: right;
                }
            }

            .cloud-content {
                width: 1000px;
                margin: 0 auto;
                overflow: hidden;
                .left{
                    float: left;
                }
                .right{
                    float: right;
                }
                .left, .right{
                    width: 480px;
                }
                .file-box {
                    height: 520px;
                    overflow: auto;

                    &.selected {
                        border: 1px solid #c4ceda;
                    }
                }

                .ivu-tabs-bar {
                    margin-bottom: 0;
                }

                .ivu-tabs-tabpane {
                    padding: 10px;
                    border: 1px solid #c4ceda;
                    border-top: 0;
                    height: 488px;
                    overflow: auto;
                }
            }

            .cloud-footer{
                text-align: right;
                margin-top: 16px;
            }
        }

        .ivu-modal-footer{
            height: 0;
            line-height: 0;
            padding: 0;
            margin: 0;
        }

        .m-l-10{
            margin-left: 10px;
        }

        .spin-load-more{
            .ivu-spin-dot{
                display: none;
            }
        }

        .spin-icon-load{
            animation: ani-spin 1s linear infinite;
        }
        @keyframes ani-spin {
            from { transform: rotate(0deg);}
            50%  { transform: rotate(180deg);}
            to   { transform: rotate(360deg);}
        }
    }
</style>

<template>
    <Modal
        :class-name="prefixCls"
        :width="width"
        v-model="show"
        title="">
        <div slot="header" class="cloud-header">
            <span>选择文件</span>
            <a class="minOrMax" @click="minOrMax">
                <i class="iconfont_daydao_common" v-show="!maxDialog" title="全屏">&#xe620;</i>
                <i class="iconfont_daydao_common" v-show="maxDialog" title="小屏">&#xe61f;</i>
            </a>
        </div>
        <div class="cloud-body">
            <div class="cloud-content">
                <div class="left">
                    <div class="title-text">选择</div>
                    <div class="file-box" style="overflow: hidden;">
                        <Tabs type="card" :animated="false" v-model="tabName" @on-click="changeTabs">
                            <TabPane label="企业文件" name="corp">
                                <cloud-list
                                    ref="corpCloudList"
                                    :data="corp.fileList"
                                    :disk-type="diskType.corp"
                                    :readonly="readonly"
                                    :file-type="fileType"
                                    :folder-nav="corp.folderNav"
                                    :is-search="corp.isSearch"
                                    @open-folder="openFolder"
                                    @search="search"
                                    @selected-file="selectedFileList"
                                ></cloud-list>
                                <Spin class="spin-load-more" v-show="loadingMore"><Icon type="load-c" size=18 class="spin-icon-load"></Icon></Spin>
                            </TabPane>
                            <TabPane label="我的文件" name="cloud">
                                <cloud-list
                                    ref="cloudList"
                                    :data="cloud.fileList"
                                    :disk-type="diskType.cloud"
                                    :readonly="readonly"
                                    :file-type="fileType"
                                    :folder-nav="cloud.folderNav"
                                    :is-search="cloud.isSearch"
                                    @open-folder="openFolder"
                                    @search="search"
                                    @selected-file="selectedFileList"
                                ></cloud-list>
                                <Spin class="spin-load-more" v-show="loadingMore"><Icon type="load-c" size=18 class="spin-icon-load"></Icon></Spin>
                            </TabPane>
                        </Tabs>
                        <Spin size="large" fix v-show="loadingData"></Spin>
                    </div>
                </div>
                <div class="right">
                    <div class="title-text">
                        已选 <span class="tip">单击移除</span>
                    </div>
                    <div class="file-box selected">
                        <!-- 企业盘 -->
                        <file-list
                            :data="corp.selectedFileList"
                            :checkbox="false"
                            :file-type="fileType"
                            :need-empty-tip="false"

                            @on-click="(index)=>{
                                clickSelectedFile(index, diskType.corp)
                            }"
                        ></file-list>
                        <!-- 个人盘 -->
                        <file-list
                            :data="cloud.selectedFileList"
                            :checkbox="false"
                            :file-type="fileType"
                            :need-empty-tip="false"

                            @on-click="(index)=>{
                                clickSelectedFile(index, diskType.cloud)
                            }"
                        ></file-list>
                    </div>
                </div>
            </div>
            <div class="cloud-footer">
                <Button type="primary" @click="sub">确定</Button>
                <Button type="ghost" class="m-l-10" @click="show = false">取消</Button>
            </div>
        </div>
        <div slot="footer" ></div>
    </Modal>
</template>

<script>
    import CloudList from './cloudList.vue'
    import FileList from './fileList.vue'
    import Ajax from '../Ajax'
    import Utils from '../Utils'

    export default {
        components: {CloudList, FileList},
        props: {
            /** 是否打开 */
            value: {
                type: Boolean,
                default(){
                    return false;
                }
            }
            , readonly: {
                type: Boolean,
                default(){
                    return false;
                }
            }
        },
        data(){
            return {
                prefixCls: 'cloud-file-plugin'
                , show: false
                , defaultWidth: 1024
                , width: 0
                , top: 0
                , left: 0
                , tabpaneHeight: 488
                , fileBoxHeight: 520
                , winWidth: window.innerWidth
                , winHeight: window.innerHeight
                , maxDialog: false
                , diskType: Utils.diskType
                , currDiskType: Utils.diskType.corp
                , fileType: Utils.fileType
                // corp: 公司；cloud：个人
                , tabName: 'corp'
                // 企业盘
                , corp: {
                    // 文件列表
                    fileList: []
                    // 文件夹导航
                    , folderNav: [{name: '企业文件', uuid: -1}]
                    // 是否已经全部加载完毕
                    , isLastData: false
                    // 当前页码
                    , pageNo: 1
                    // 是否处于搜索状态
                    , isSearch: false
                    // 已选文件
                    , selectedFileList: []
                }
                // 个人盘
                , cloud: {
                    // 文件列表
                    fileList: []
                    // 文件夹导航
                    , folderNav: [{name: '我的文件', uuid: -1}]
                    // 是否已经全部加载完毕
                    , isLastData: false
                    // 当前页码
                    , pageNo: 1
                    // 是否处于搜索状态
                    , isSearch: false
                    // 已选文件
                    , selectedFileList: []
                }
                // 是否加载新数据
                , loadingData: false
                // 加载更多
                , loadingMore: false
            };
        },
        methods: {
            /** 初始化 */
            init(){
                let t = this;
                t.tabName = 'corp';

                t.corp = {
                    // 文件列表
                    fileList: []
                        // 文件夹导航
                        , folderNav: [{name: '企业文件', uuid: -1}]
                        // 是否已经全部加载完毕
                        , isLastData: false
                        // 当前页码
                        , pageNo: 1
                        // 是否处于搜索状态
                        , isSearch: false
                        // 已选文件
                        , selectedFileList: []
                };
                // 个人盘
                t.cloud = {
                    // 文件列表
                    fileList: []
                        // 文件夹导航
                        , folderNav: [{name: '我的文件', uuid: -1}]
                        // 是否已经全部加载完毕
                        , isLastData: false
                        // 当前页码
                        , pageNo: 1
                        // 是否处于搜索状态
                        , isSearch: false
                        // 已选文件
                        , selectedFileList: []
                };

                // 加载企业盘
                t.getCloudFileList(t.diskType.corp).then(data=>{
                    t.corp.fileList = data;
                });

                // 加载个人盘
                t.getCloudFileList(t.diskType.cloud).then(data=>{
                    t.cloud.fileList = data;
                });

            }
            /** 最大化/最小化 */
            , minOrMax(){
                let t = this;
                t.maxDialog = !t.maxDialog;
                t.setModalSize();
            }
            /** 设置模态窗口大小 */
            , setModalSize(){
                let t = this;
                let ivuModal = t.$el.querySelector('.ivu-modal');
                let fileBoxs =  ivuModal.querySelectorAll('.file-box');
                let tabPanes = ivuModal.querySelectorAll('.ivu-tabs-tabpane');
                let modalStyle = ivuModal.style;

                if(t.maxDialog){
                    t.top = modalStyle.top;
                    t.left = modalStyle.left;

                    modalStyle.width = t.winWidth + 'px';
                    modalStyle.top = 0;
                    modalStyle.left = 0;

                    for(let i = 0; i<fileBoxs.length; i++){
                        let box = fileBoxs[i];
                        box.style.height = (t.winHeight - box.offsetTop - 65) + 'px';
                    }
                    let h = parseFloat(fileBoxs[0].style.height);
                    let top = tabPanes[0].offsetTop;
                    let height = h - top;
                    for(let i = 0; i<tabPanes.length; i++){
                        let pane = tabPanes[i];
                        pane.style.height = height + 'px';
                    }
                }else{
                    for(let i = 0; i<fileBoxs.length; i++){
                        let box = fileBoxs[i];
                        box.style.height = t.fileBoxHeight + 'px';
                    }
                    for(let i = 0; i<tabPanes.length; i++){
                        tabPanes[i].style.height = t.tabpaneHeight + 'px';
                    }
                    modalStyle.width = t.defaultWidth + 'px';
                    if(t.top !== 0){
                        modalStyle.top = t.top;
                        modalStyle.left = t.left;
                    }
                }
            }
            /** 打开文件夹 */
            , openFolder(folderId, folderName, disType){
                let t = this;

                t.getCloudFileList(disType, folderId).then(data=>{
                    if(disType === t.diskType.corp){
                        t.corp.fileList = data;
                        t.corp.folderNav = t.changeFolderNav(t.corp.folderNav, folderName, folderId);
                        t.corp.isLastData = false;
                        t.corp.pageNo = 1;
                    }else{
                        t.cloud.fileList = data;
                        t.cloud.folderNav = t.changeFolderNav(t.cloud.folderNav, folderName, folderId);
                        t.cloud.isLastData = false;
                        t.cloud.pageNo = 1;
                    }
                });
            }
            /** 导航栏文件夹变化 */
            , changeFolderNav(nav, name, uuid){
                let temp = [];

                for(let i = 0, len = nav.length; i<len; i++){
                    let item = nav[i];
                    if(item.uuid !== uuid){
                        temp.push(item);
                    }else{
                        break;
                    }
                }
                temp.push({name: name, uuid: uuid});

                return temp;
            }
            /** 搜索 */
            , search(keyword, diskType){
                let t = this;
                console.log(keyword, diskType)
                if(diskType === t.diskType.corp){
                    t.corp.isSearch = !!keyword;
                }else{
                    t.cloud.isSearch = !!keyword;
                }
            }
            /** 确定 */
            , sub(){
                let t = this;
                let selecteds = t.corp.selectedFileList.concat(t.cloud.selectedFileList);
                t.$emit('selected', selecteds);
                t.show = false;
            }
            /** 已选文件 */
            , selectedFileList(fileList, diskType){
                let t = this;
                if(diskType === t.diskType.corp){
                    t.corp.selectedFileList = t.contrastFile(t.corp.selectedFileList, fileList);
                }else{
                    t.cloud.selectedFileList = t.contrastFile(t.cloud.selectedFileList, fileList);
                }
            }
            /** 比较数组 */
            , contrastFile(oldFileList, newFileList){
                let t = this;
                let temp = [];
                for(let i = 0, len = newFileList.length; i<len; i++){
                    let item = newFileList[i];
                    let index = t.indexOfArr(item, oldFileList);
                    if(item.checked && index === -1){
                        // 选中并且不在已选目录中
                        temp.push(item);
                    }else if(!item.checked && index !== -1){
                        // 未选中并且在已选目录中
                        oldFileList.splice(index, 1);
                    }
                }
                return oldFileList.concat(temp);
            }
            /** 对象存在数组中 */
            , indexOfArr(obj, arr){
                for(let i = 0, len = arr.length; i<len; i++){
                    if(obj.uuid === arr[i].uuid){
                        return i;
                    }
                }
                return -1;
            }
            /** 点击已选文件 */
            , clickSelectedFile(index, diskType){
                let t = this;

                if(diskType === t.diskType.corp){
                    let item = t.corp.selectedFileList.splice(index, 1);
                    let fileIndex = t.indexOfArr(item[0], t.corp.fileList);
                    if(fileIndex !== -1){
                        t.corp.fileList[fileIndex].checked = false;
                    }
                }else{
                    let item = t.cloud.selectedFileList.splice(index, 1);
                    let fileIndex = t.indexOfArr(item[0], t.cloud.fileList);
                    if(fileIndex !== -1){
                        t.cloud.fileList[fileIndex].checked = false;
                    }
                }
            }
            /** 切换标签 */
            , changeTabs(name){
                let t = this;
                this.currDiskType = t.diskType[name];
            }
            /** 回选文件 */
            , chooseFileList(newFileList, oldFileList){
                let t = this;
                for(let i = 0, len = newFileList.length; i<len; i++){
                    let item = newFileList[i];
                    if(t.indexOfArr(item, oldFileList) !== -1){
                        item.checked = true;
                    }
                }
            }
            /** 获取文件列表 */
            , getCloudFileList(diskType, parentId = -1, pageNo = 1, pageSize = 20){
                let t = this;
                t.loadData = true;
                return Ajax.getCloudFileList({diskType, pageNo, pageSize, parentId}).then(data=>{
                    t.loadData = false;
                    if(t.currDiskType === t.diskType.corp){
                        t.chooseFileList(data, t.corp.selectedFileList);
                    }else{
                        t.chooseFileList(data, t.cloud.selectedFileList);
                    }
                    return data;
                });
            }
            /** 加载更多 */
            , loadMoreData(diskType, parentId, pageNo, pageSize=20){
                let t = this;
                t.loadingMore = true;
                return Ajax.getCloudFileList({diskType, pageNo, pageSize, parentId}).then(data=>{
                    t.loadingMore = false;
                    let corp = diskType === t.diskType.corp;
                    if(data && data.length > 0){
                        if(corp){
                            t.chooseFileList(data, t.corp.selectedFileList);
                            t.corp.fileList = t.corp.fileList.concat(data);
                        }else{
                            t.chooseFileList(data, t.cloud.selectedFileList);
                            t.cloud.fileList = t.cloud.fileList.concat(data);
                        }
                    }else{
                        if(corp){
                            t.corp.isLastData = true;
                        }else{
                            t.cloud.isLastData = true;
                        }
                    }
                });
            }
            /** 滚动加载 */
            , scrollLoading(e){
                let t = this;
                let target = e.target;

                let corp = t.currDiskType === t.diskType.corp;
                if(!t.loadingMore && ((corp && !t.corp.isLastData) || (!corp && !t.cloud.isLastData))){
                    let height = target.offsetHeight;
                    let scrollTop = target.scrollTop;
                    let scrollHeight = target.scrollHeight;
                    if((height + scrollTop) >= scrollHeight){
                        let pageNo = 1;
                        let parentId = -1;
                        if(corp){
                            pageNo = ++t.corp.pageNo;
                            parentId = t.corp.folderNav[t.corp.folderNav.length-1].uuid;
                        }else{
                            pageNo = ++t.cloud.pageNo;
                            parentId = t.cloud.folderNav[t.cloud.folderNav.length-1].uuid;
                        }
                        t.loadMoreData(t.currDiskType, parentId, pageNo);
                    }
                }
            }
        },
        created(){
            let t = this;
            t.width = t.defaultWidth;
            t.init();
        },
        mounted(){
            let t = this;

            let tabPanes = t.$el.querySelectorAll('.ivu-tabs-tabpane');
            for(let i = 0; i<tabPanes.length; i++){
                tabPanes[i].addEventListener('scroll', t.scrollLoading);
            }

        },
        beforeDestroy(){
            let t = this;

            let tabPanes = t.$el.querySelectorAll('.ivu-tabs-tabpane');
            for(let i = 0; i<tabPanes.length; i++){
                tabPanes[i].removeEventListener('scroll', t.scrollLoading);
            }
        },
        watch: {
            show(val){
                let t = this;
                if(!val){
                    t.$emit('input', val);
                    t.maxDialog = false;
                    t.setModalSize();
                    t.init();
                }
            },
            value(val){
                let t = this;
                if (val) {
                    t.show = val;
                }
            }
        }
    }
</script>
