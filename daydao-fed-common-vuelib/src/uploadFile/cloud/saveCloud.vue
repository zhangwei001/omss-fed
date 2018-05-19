<style lang="scss">

    $prefixCls: 'save-cloud-plugin';

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
        .cloud-body {
            padding: 16px;


            .cloud-content {
                margin: 0 auto;
                overflow: hidden;
                .file-box {
                    height: 520px;
                    overflow: hidden;
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

                .btn-bar{
                    margin-top: 24px;
                    .right{
                        float: right;
                    }

                }
            }

            .cloud-footer{
                text-align: right;
                margin-top: 16px;
            }

            .max-win{
                .info{
                    display: flex;
                    position: relative;
                    padding-left: 32px;
                    padding-right: 10px;

                    .cloud-icon{
                        position: absolute;
                        left: 10px;
                        top: 8px;
                    }

                    .name{
                        flex: 1;
                    }
                }
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
            <span>选择保存目录</span>
            <a class="minOrMax" @click="minOrMax">
                <i class="iconfont_daydao_common" v-show="!maxDialog" title="全屏">&#xe620;</i>
                <i class="iconfont_daydao_common" v-show="maxDialog" title="小屏">&#xe61f;</i>
            </a>
        </div>
        <div class="cloud-body">
            <div class="cloud-content" :class="{'max-win': maxDialog}">
                <div class="file-box">
                    <Tabs type="card" :animated="false" v-model="tabName" @on-click="changeTabs">
                        <TabPane label="企业文件" name="corp">
                            <folder-nav
                                :data="corp.folderNav"

                                @change-folder="(folder)=>{
                                    changeFolder(folder, diskType.corp)
                                }"
                            ></folder-nav>
                            <!-- 企业盘 -->
                            <file-list
                                :data="corp.fileList"
                                :checkbox="false"
                                :file-type="fileType"
                                :opacity-file="opacityFile"

                                @on-click="(index)=>{
                                    openFolder(index, diskType.corp)
                                }"
                                @add-folder="(isAdd, name, index)=>{
                                    addFolderCallback(isAdd, name, index, diskType.corp)
                                }"
                            ></file-list>
                            <Spin class="spin-load-more" v-show="loadingMore"><Icon type="load-c" size=18 class="spin-icon-load"></Icon></Spin>
                        </TabPane>
                        <TabPane label="我的文件" name="cloud">
                            <folder-nav
                                :data="cloud.folderNav"

                                @change-folder="(folder)=>{
                                    changeFolder(folder, diskType.cloud)
                                }"
                                @add-folder="(isAdd, name, index)=>{
                                    addFolderCallback(isAdd, name, index, diskType.cloud)
                                }"
                            ></folder-nav>
                            <file-list
                                :data="cloud.fileList"
                                :checkbox="false"
                                :file-type="fileType"
                                :opacity-file="opacityFile"

                                @on-click="(index)=>{
                                    openFolder(index, diskType.cloud)
                                }"
                            ></file-list>
                            <Spin class="spin-load-more" v-show="loadingMore"><Icon type="load-c" size=18 class="spin-icon-load"></Icon></Spin>
                        </TabPane>
                    </Tabs>

                    <Spin size="large" fix v-show="loadingData"></Spin>
                </div>
                <div class="btn-bar">
                    <Button type="ghost" @click="addFolder"><i class="iconfont_daydao_common">&#xe703;</i><span class="m-l-10">新建文件夹</span></Button>
                    <Button type="ghost" class="right m-l-10" @click="show = false">取消</Button>
                    <Button type="primary" class="right" @click="saveToCloud">保存</Button>
                </div>
            </div>
        </div>
        <div slot="footer" ></div>
    </Modal>
</template>

<script>
    import FolderNav from './folderNav.vue'
    import FileList from './fileList.vue'
    import Ajax from '../Ajax'
    import Utils from '../Utils'

    export default {
        components: {FileList, FolderNav},
        props: {
            /** 是否打开 */
            value: {
                type: Boolean,
                default(){
                    return false;
                }
            }
        },
        data(){
            return {
                prefixCls: 'save-cloud-plugin'
                , show: false
                , defaultWidth: 520
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
                , tabName: 'corp'
                , opacityFile: true
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
                }
                // 是否加载新数据
                , loadingData: false
                // 加载更多
                , loadingMore: false
            };
        },
        methods: {
            init(){
                let t = this;
                t.maxDialog = false;

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
                let content = ivuModal.querySelector('.cloud-content');
                let fileBox =  ivuModal.querySelector('.file-box');
                let tabPanes = ivuModal.querySelectorAll('.ivu-tabs-tabpane');
                let modalStyle = ivuModal.style;

                if(t.maxDialog){
                    t.top = modalStyle.top;
                    t.left = modalStyle.left;

                    modalStyle.width = t.winWidth + 'px';
                    modalStyle.top = 0;
                    modalStyle.left = 0;

                    content.style.width = 1000 + 'px';

                    fileBox.style.height = (t.winHeight - fileBox.offsetTop - 76) + 'px';

                    let h = parseFloat(fileBox.style.height);
                    let top = tabPanes[0].offsetTop;
                    let height = h - top;
                    for(let i = 0; i<tabPanes.length; i++){
                        let pane = tabPanes[i];
                        pane.style.height = height + 'px';
                    }
                }else{
                    content.style.width = 'auto';

                    fileBox.style.height = t.fileBoxHeight + 'px';

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
            /** 切换标签 */
            , changeTabs(name){
                let t = this;
                t.currDiskType = t.diskType[name];
            }
            /** 新增文件夹 */
            , addFolder(){
                let t = this;
                let type = 'cloud';
                if(t.currDiskType === t.diskType.corp){
                    type = 'corp';
                }
                if(t.exisNewFolder(t[type].fileList)){
                    return ;
                }
                t[type].fileList.unshift({
                    fileName: '新建文件夹',
                    rename: true,
                    fileType: t.fileType.folder,
                    icon: 'folder'
                });
            }
            /**
             * 新增文件夹回调
             * @param isAdd 是否添加
             * @param name 文件夹名
             * @param index 位置
             * @param diskType 网盘类型
             * */
            , addFolderCallback(isAdd, name, index, diskType){
                let t = this;
                let type = 'cloud';
                if(diskType === t.diskType.corp){
                    type = 'corp';
                }

                if(isAdd){
                    Ajax.addFolder(name, diskType).then(data=>{
                        let nav = t[type].folderNav;
                        t.getCloudFileList(diskType, nav[nav.length -1].uuid);
                    });
                }else{
                    t[type].fileList.splice(index, 1);
                }
            }
            /** 是否存在新建文件夹 */
            , exisNewFolder(fileList){
                for(let i = 0, len = fileList.length; i<len; i++){
                    if(fileList[i].rename){
                        return true;
                    }
                }
                return false;
            }
            /** 保存 */
            , saveToCloud(){
                let t = this;
                let type = 'cloud';
                if(t.currDiskType === t.diskType.corp){
                    type = 'corp';
                }

                let nav = t[type].folderNav;
                Ajax.saveToCloud(t.currDiskType, nav[nav.length - 1].uuid).then(data=>{
                    t.$Message.success('已成功存到云盘');
                });
            }
            /** 却换导航文件夹 */
            , changeFolder(folder, diskType){
                let t = this;
                t.setCloudFileList(diskType, folder.uuid, folder.name);
            }
            /** 打开文件夹 */
            , openFolder(index, diskType){
                let t = this;
                let item;
                if(diskType === t.diskType.corp){
                    item = t.corp.fileList[index];
                }else{
                    item = t.cloud.fileList[index];
                }
                if(item && item.fileType === t.fileType.folder){
                    t.setCloudFileList(diskType, item.uuid, item.fileName);
                }
            }
            /** 设置列表 */
            , setCloudFileList(diskType, folderId, folderName){
                let t = this;
                t.getCloudFileList(diskType, folderId).then(data=>{
                    if(diskType === t.diskType.corp){
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
            /** 获取文件列表 */
            , getCloudFileList(diskType, parentId = -1, pageNo = 1, pageSize = 20){
                let t = this;
                t.loadData = true;
                return Ajax.getCloudFileList({diskType, pageNo, pageSize, parentId}).then(data=>{
                    t.loadData = false;
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
                            t.corp.fileList = t.corp.fileList.concat(data);
                        }else{
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
