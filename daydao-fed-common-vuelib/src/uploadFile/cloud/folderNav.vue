<style lang="scss">

    $color: #2D8CF0;

    .cloud-breadcrumb{
        color: #999;
        font-size: 14px;
        margin: 9px 0;

        .item{

        }

        .item:last-child{
            .breadcrumb-item-separator {
                color: #657180 ;
            }
        }

        .last-item{
            color: #657180;
        }

        a{
            color: $color;
        }

        .breadcrumb-item-link{
            display: inline-block;
            max-width: 100px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
        }

        .breadcrumb-item-separator {
            margin-right: 5px;
            color: $color;
        }

        .cloud-folder-tip{
            white-space: normal;
        }
    }
</style>

<template>
    <div class="cloud-breadcrumb">
        <span class="prev-level" v-show="upFolders.length>0">
            <a class="breadcrumb-item-link" @click="changeFolder(-1)">返回上一级</a>
            <span class="breadcrumb-item-separator">|</span>
        </span>
        <span class="more" v-show="folders.length > 3">
            <Tooltip placement="bottom" content="返回上一级">
                <a class="breadcrumb-item-link" @click="changeFolder(-1)">...</a>
            </Tooltip>
            <span class="breadcrumb-item-separator">&gt;</span>
        </span>
        <template v-for="(item, index) in upFolders">
            <span class="item">
                <Tooltip placement="bottom-start">
                    <a class="breadcrumb-item-link" @click="changeFolder(item.index)">{{item.name}}</a>
                    <div slot="content" class="cloud-folder-tip">{{item.tip}}</div>
                </Tooltip>
                <span class="breadcrumb-item-separator">&gt;</span>
            </span>
        </template>
        <span class="last-item">
            <Tooltip :content="lastFolder.tip" placement="bottom-start">
                <span class="breadcrumb-item-link">{{lastFolder.name}}</span>
                <div slot="content" class="cloud-folder-tip">{{lastFolder.tip}}</div>
            </Tooltip>
        </span>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Array,
                default(){
                    return [];
                }
            }
        },
        data(){
            return {
                folders: []
            };
        },
        computed: {
            /** 当前显示的三个文件夹 */
            upFolders(){
                let t = this;
                let len = t.folders.length;
                if(len > 3){
                    return t.folders.slice(0, len-1).slice(-2);
                } else if(len > 1){
                    return t.folders.slice(0, len-1);
                }else{
                    return [];
                }
            },
            /**  最后一个文件夹 */
            lastFolder(){
                let t = this;
                return t.folders.slice(t.folders.length-1)[0];
            }
        },
        methods: {
            /**
             * 点击文件夹
             * @param index
             */
            changeFolder(index){
                const t = this;
                let item;
                if(index === -1){
                    let len = t.folders.length;
                    item = t.folders[ len - 2 ];
                    // t.folders = t.folders.slice(0, len - 1);
                }else{
                    item = t.folders[index];
                    // t.folders = t.folders.slice(0, index + 1);
                }
                t.$emit('change-folder', item);
            }
            /**
             * 获取文件夹路径
             * @param index
             * @return {string}
             */
            , getFolderRoute(index){
                let t = this;
                let route = [];
                t.data.slice(0, index).forEach(item=>{
                    route.push(item.name);
                });
                return route.join(' / ');
            }
            /** 加工文件夹 */
            , handlingFolder(){
                let t = this;
                let folders = [];
                t.data.forEach((item, index)=>{
                    let obj = Object.assign({}, item);
                    if(index > 0){
                        obj.tip = t.getFolderRoute(index) + ' / ' + obj.name;
                    }else{
                        obj.tip = obj.name;
                    }
                    obj.index = index;
                    folders.push(obj);
                });
                t.folders = folders;
            }
        },
        created(){
            let t = this;
            t.handlingFolder();
        },
        mounted(){

        },
        destroyed(){

        },
        watch: {
            data(){
                let t = this;
                t.handlingFolder();
            }
        }
    }
</script>
