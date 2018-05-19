<style type='scss'>
.tree_edit_item_wrapper {
    padding-top: 8px;
    padding-bottom: 8px;
}

.icon_normal_style:hover {
    cursor: pointer;
    color: #F18950;
}

.hover_style:hover {
    cursor: pointer;
}
</style>

<template>
    <div @mouseover="showEditIcon" @mouseout="hideEditIcon">
        <div class="tree_edit_item_wrapper">
            <Input v-if="isEdit" v-model="value" size="medium" style="width:210px;" @on-blur="handleEditBlur"></Input>
            <span v-if="!isEdit" class="hover_item">{{value}}</span>
            <div style="display:inline-block;" class="hover_style">
                <i class="iconfont_daydao_common icon_normal_style" @click="editItem">&#xe69c;</i>
                <i class="iconfont_daydao_common icon_normal_style" @click="deleteItem">&#xe6ae;</i>
                <i class="iconfont_daydao_common icon_normal_style" @click="addItem">&#xe69e;</i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "treeEditItem"
    , props: {
        value: {
            type: String,
            default: "默认值"
        }
        ,id:{
            type:[String,Number],
            default:0
        }
    }
    , data: function() {
        return {
            isEdit: false
            , isShowEditIcon: false //显示可编辑的按钮
        }
    }
    , mounted: function() {

    }
    , methods: {
        //显示编辑按钮
        showEditIcon: function() {
            var _this = this;
            _this.isShowEditIcon = true;
        }
        // 隐藏编辑按钮,缓冲隐藏时间
        , hideEditIcon: function() {
            var _this = this;
            setTimeout(function() {
                _this.isShowEditIcon = false;
            }, 1000);

        }
        //处理编辑失焦
        ,handleEditBlur:function(){
            // 跳处编辑,保留数据
            this.isEdit=false;
        }
        , editItem: function() {
            var _this=this;
            _this.isEdit=true;
        }
        ,addItem:function(){
            // 增加 传给父组件
            this.$emit("addItem",{
                parentId:this.id, // 父级id
                parentName:this.value
            });
        }
        ,deleteItem:function(){
            // 删除 传给父组件处理删除
            this.$emit("deleteItem",{
                itemId:this.id, //项目id
                itemName:this.value
            });
        }
    }
}
</script>

