<style lang="scss">

    /*前缀*/
    $prefixCls: 'file-preview-plugin';

    .#{$prefixCls}{

        .ivu-modal-header{
            background: #F5F7F9;
            border-radius: 8px 8px 0 0;
        }
        .ivu-modal-close{
            top: 2px;
        }
        .preview-header{
            height: 15px;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex: 1;
            margin-right: 15px;
        }

        .preview-body{

            iframe{
                width: 100%;
                height: 100%;
            }
        }

        .ivu-modal-footer{
            height: 0;
            line-height: 0;
            padding: 0;
            margin: 0;
        }
    }

</style>

<template>
    <Modal
        :class-name="prefixCls"
        :width="width"
        v-model="show"
        title="">
        <div slot="header" class="preview-header" :title="fileName">{{fileName}}</div>
        <div class="preview-body" :style="{height: previewHeight + 'px'}">
            <iframe :src="fileSrc"></iframe>
        </div>
        <div slot="footer" class="preview-footer"></div>
    </Modal>
</template>

<script>
    import Ajax from './Ajax'

    export default {
        props: {
            /** 文件名 */
            fileName: {
                type: String,
                default: ''
            }
            /** 文件uuid */
            , uuid: [String, Number]
            /** 是否打开 */
            , value: {
                type: Boolean,
                default(){
                    return true
                }
            }
        },
        data(){
            return {
                prefixCls: 'file-preview-plugin'
                , show: false
                , width: 1024
                , previewHeight: 580
                , fileSrc: ''
            };
        },
        methods: {
            /**
             * 获取文件地址
             */
            getFileUrl(){
                let t = this;
                Ajax.getFileUrl(t.uuid).then(data=>{
                    t.fileSrc = data;
                });
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
                if (val) {
                    t.show = val;
                    t.getFileUrl();
                }
            },
            uuid(val){
                if(!val){
                    this.fileSrc = '';
                }
            }
        }
    }
</script>
