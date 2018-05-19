<style lang="scss">
    @import "icon.css";
</style>

<template>
    <div class="file-item" :class="[data.status]" @click="itemClick">
        <div class="name">
            <i class="cloud-icon" :class="[data.icon]"></i><span class="text" :title="data.name">{{data.name}}</span>
        </div>
        <div class="size">{{data.sizeText}}</div>
        <div class="status" v-show="!readonly">
            <span class="success"><i class="iconfont_daydao_common">&#xe61b;</i></span>
            <span class="uploading">等待上传</span>
            <span class="error">上传失败</span>
        </div>
        <div class="handler">
            <a @click.stop="restart" title="重试" class="restart" v-show="!readonly"><i class="iconfont_daydao_common">&#xe6fe;</i></a>
            <a @click.stop="del" title="删除" class="m-l-20" v-show="!readonly"><i class="iconfont_daydao_common">&#xe6ff;</i></a>
            <a @click.stop="saveCloud" title="存到网盘" v-show="readonly"><i class="iconfont_daydao_common">&#xe6fd;</i></a>
            <a @click.stop="download" title="下载" class="m-l-20" v-show="readonly"><i class="iconfont_daydao_common">&#xe6ac;</i></a>
        </div>
        <div class="progress" :style="{width: data.process}"></div>
    </div>
</template>

<script>
    export default {
        props: {
            /** 文件数据 */
            data: {
                type: Object,
                default(){
                    return {};
                }
            },
            /** 位置 */
            index: {
                type: Number,
                default(){
                    return 0;
                }
            },
            /** 是否只读 */
            readonly: {
                type: Boolean,
                default(){
                    return false
                }
            }
        },
        data(){
            return {

            };
        },
        created(){

        },
        methods: {
            /**
             * 点击文件
             * */
            itemClick(){
                let t = this;
                t.$emit('item-click', t.index, t.data);
            }
            /**
             * 重试
             * */
            , restart(){
                let t = this;
                t.$emit('restart', t.index);
            }
            /**
             * 删除
             * */
            , del(){
                let t = this;
                t.$emit('del', t.index);
            }
            /**
             * 存到网盘
             * */
            , saveCloud(){
                let t = this;
                t.$emit('save-cloud', t.index);
            }
            /**
             * 下载
             */
            ,download(){
                let t = this;
                t.$emit('download', t.index);
            }
        },
        mounted(){

        },
        destroyed(){

        }
    }
</script>
