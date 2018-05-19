<style lang="scss">
    @import "../icon.css";

    .cloud-file-list{

        .cloud-file-item{
            height: 40px;
            line-height: 40px;
            cursor: pointer;

            &:hover{
                background: #F5F7F9;
            }

            .info, .check-box{
                display: inline-block;
            }

            .check-box{
                width: 25px;
            }

            .info{
                .name{
                    display: inline-block;
                    width: 320px;
                    margin-left: 5px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    vertical-align: middle;
                }

                .size{
                    display: inline-block;
                    text-align: right;
                    width: 60px;
                }

                .rename{
                    margin-left: 5px;

                    input{
                        height: 30px;
                        border: 1px solid #C4CEDA;
                        border-radius: 2px;
                        padding-left: 5px;
                    }

                    a{
                        margin-left: 5px;
                    }
                }
            }
        }

        .opacityFile{
            opacity: 0.5;
        }

        .empty-content{
            text-align: center;
            margin-top: 30px;

            .text{
                margin-top: 10px;
            }
        }
    }
</style>

<template>
    <div class="cloud-file-list">
        <div class="cloud-file-item" v-if="checkbox" @click="clickCheckAll">
            <div class="check-box"><Checkbox  :value="checkAll" @on-change="changeCheckAll"></Checkbox></div>
            <div class="info">全选</div>
        </div>
        <template v-for="(item, index) in data">
            <div class="cloud-file-item" @click="clickItem(index)" :class="{opacityFile: opacityFile && item.fileType == fileType.file}">
                <div class="check-box" v-if="checkbox"><Checkbox v-show="item.fileType == fileType.file" :value="item.checked" :disabled="item.disabled"></Checkbox></div>
                <div class="info">
                    <i class="cloud-icon" :class="[item.icon]"></i>
                    <template v-if="!item.rename">
                        <span class="name" :title="item.fileName">{{item.fileName}}</span>
                        <span class="size" v-if="item.fileType == fileType.file">{{item.size}}</span>
                    </template>
                    <template v-else>
                        <span class="rename" >
                            <input type="text" @click.stop v-model="item.fileName" v-select-text>
                            <a title="确定" @click.stop="addFolder(item, index)"><i class="iconfont_daydao_common">&#xe705;</i></a>
                            <a title="取消" @click.stop="cancelFolder(item, index)"><i class="iconfont_daydao_common">&#xe6ff;</i></a>
                        </span>
                    </template>
                </div>
            </div>
        </template>
        <div class="empty-content" v-show="needEmptyTip && data.length === 0">
            <img :src="empty.src" :alt="empty.text">
            <div class="text">{{empty.text}}</div>
        </div>
    </div>
</template>

<script>
    import emptySearchImg from '../images/empty_search.png'
    import emptyContentImg from '../images/empty_content.png'

    export default {
        props: {
            /** 文件类型 */
            fileType: {
                type: Object,
                default(){
                    return {};
                }
            }
            /** 数据 */
            , data: {
                type: Array,
                default(){
                    return [];
                }
            }
            /** 当前是否是搜索 */
            , isSearch: {
                type: Boolean,
                default(){
                    return false;
                }
            }
            /** 是否需要空文件提醒 */
            , needEmptyTip: {
                type: Boolean,
                default(){
                    return true;
                }
            }
            /** 是否需要选择框 */
            , checkbox: {
                type: Boolean,
                default(){
                    return true;
                }
            }
            /** 文件半透明值 */
            , opacityFile: {
                type: Boolean,
                default(){
                    return false;
                }
            }
        },
        data(){
            return {
                checkAll: false
                , emptySearchImg: emptySearchImg
                , emptyContentImg: emptyContentImg
            };
        },
        computed: {
            empty(){
                let t =  this;
                return t.isSearch ? {src: emptySearchImg, text: '没有搜索到任何内容'}: {src: emptyContentImg, text: '该文件夹下没有内容'};
            }
            , isCheckedAll(){
                let t = this;
                if(t.data.length === 0){
                    return false;
                }
                let checedList = t.data.filter(item=>{
                    return item.checked;
                });
                return checedList.length === t.data.length;
            }
        },
        methods: {
            /**
             * 行点击
             * @param index
             */
            clickItem(index){
                this.$emit('on-click', index)
            }
            , changeCheckAll(checked){
                this.$emit('check-all', checked);
            }
            , clickCheckAll(){
                let t = this;
                t.checkAll = !t.checkAll;
                t.changeCheckAll(t.checkAll);
            }
            /**
             * 确定添加文件夹
             *
             * @param item
             * @param index
             */
            , addFolder(item, index){
                this.$emit('add-folder', true, item.fileName, index);
            }
            /**
             * 取消添加文件夹
             *
             * @param item
             * @param index
             */
            , cancelFolder(item, index){
                this.$emit('add-folder', false, item.fileName, index);
            }
        },
        created(){
        },
        mounted(){

        },
        destroyed(){

        },
        watch: {
            data() {
                // this.checkAll = false;
            },
            isCheckedAll(val){
                this.checkAll = val;
            }
        },
        directives: {
            selectText: {
                inserted(el){
                    el.select();
                }
            }
        }
    }
</script>
