<style lang="scss">

    .cloud-list{

        .cloud-search{
            .search-input{
                display: flex;
                border: 1px solid  #C4CEDA;
                border-radius: 2px;
                a{
                    display: inline-block;
                    width: 36px;
                    text-align: center;
                }
                input{
                    flex: 1;
                    border: 0;
                }
                a,input{
                    vertical-align: middle;
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
    }

</style>

<template>
    <div class="cloud-list">
        <div class="cloud-search">
            <div class="search-input">
                <a @click="search"><i class="iconfont_daydao_common">&#xe67f;</i></a>
                <input type="text" placeholder="请输入您要搜索的文件名称" v-model="searchKeyword" @keyup.enter="search">
            </div>
        </div>
        <folder-nav
            :data="folderNav"

            @change-folder="changeFolder"
        ></folder-nav>
        <file-list
            :data="data"
            :fileType="fileType"
            :is-search="isSearch"

            @on-click="clickItem"
            @check-all="checkAll"
        ></file-list>
    </div>
</template>

<script>
    import FolderNav from './folderNav.vue'
    import FileList from './fileList.vue'
    import Utils from '../Utils'

    export default {
        components: {FolderNav, FileList},
        props: {
            /** 网盘类型：1、个人盘；2、企业盘 */
            diskType: Number
            /** 文件类型 */
            , fileType: {
                type: Object,
                default(){
                    return {};
                }
            }
            /** 是否需要文本框 */
            , readonly: {
                type: Boolean,
                default(){
                    return false;
                }
            }
            /** 数据 */
            , data: {
                type: Array,
                default(){
                    return [];
                }
            }
            /** 文件夹导航 */
            , folderNav: {
                type: Array,
                default(){
                    return [];
                }
            }
            /** 是否搜索状态 */
            , isSearch: {
                type: Boolean,
                default(){
                    return false
                }
            }
        },
        data(){
            return {
                searchKeyword: ''
            };
        },
        methods: {
            /** 却换导航文件夹 */
            changeFolder(folder){
                let t = this;
                t.$emit('open-folder', folder.uuid, folder.name, t.diskType);
            }
            /** 行点击 */
            , clickItem(index){
                let t = this;
                let item = t.data[index];
                if(item){
                    if(item.fileType === t.fileType.file){
                        // 文件
                        item.checked = !item.checked;

                        t.emitSelectedFile([item]);
                    }else{
                        // 文件夹
                        t.$emit('open-folder', item.uuid, item.fileName, t.diskType);
                    }
                }

            }
            /** 搜索 */
            , search(){
                let t = this;
                t.$emit('search', t.searchKeyword, t.diskType);
            }
            /** 全选 */
            , checkAll(checked){
                let t = this;
                let file = Utils.fileType.file;
                t.data.forEach(item=>{
                    if(item.fileType === file){
                        item.checked = checked;
                    }
                });
                t.emitSelectedFile(t.data);
            }
            , emitSelectedFile(selectedFileList){
                let t = this;
                t.$emit('selected-file', selectedFileList, t.diskType);
            }
        },
        created(){

        },
        mounted(){

        },
        destroyed(){

        },
        watch: {

        }
    }
</script>
