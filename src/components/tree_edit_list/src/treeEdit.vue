<style type="scss">
.base_style {
    font-size: 14px;
    color: '#68717C';
}




/* 子节点缩进距离 */

.tree_edit_child_indent {
    margin-left: 20px;
}

.tree_edit_left_vertical_line {
    padding-left: 20px;
    margin-left: 20px;
    border-left: 1px solid #B2B8BF;
}

.tree_edit_left_polyline {
    padding-left: 20px;
    margin-left: 20px;
}

.tree_edit_left_hor_line {}

.hover_item:hover {
    cursor: pointer;
    color: #F18950;
}
</style>

<template>
    <div class="base_style">
        <ul class="">
            <li v-for="item in queryTreeDatas" :key="item.id" class=" tree_edit_left_vertical_line tree_edit_left_hor_line">
                <ul class="tree_eidt_item_li">
                    <tree-edit-item :value="item.name" :id="item.id" @addItem="addItemCallback" @deleteItem="deleteItemCallback"></tree-edit-item>
                    <!-- 如果有子树 -->
                    <li v-if="item.children" v-for="childItem in item.children" :key="childItem.id" class="tree_edit_child_indent">
                        <ul>
                            <tree-edit-item :value="childItem.name" :id="childItem.id" @addItem="addItemCallback" @deleteItem="deleteItemCallback"></tree-edit-item>
                            <li v-if="childItem.children" v-for="grandsonItem in  childItem.children" :key="grandsonItem.id" class="tree_edit_child_indent">
                                <ul>
                                    <tree-edit-item :value="grandsonItem.name" :id="grandsonItem.id" @addItem="addItemCallback" @deleteItem="deleteItemCallback"></tree-edit-item>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="tree_edit_left_polyline">
                <i class="iconfont_daydao_common hover_item" @click="addItem(1)">&#xe69e;</i>
            </li>
        </ul>

    </div>
</template>

<script>
// 新增的树，id为String，默认往上加
// isShowIcon  存在子节点才显示icon
// isShowChild 显示下级节点，false的则隐藏该节点下的所有节点
// isEdit 该节点正在编辑,默认为false,如果新增，则默认为true ，true的时候显示编辑框，编辑框失焦则isEdit为false，判断编辑框的内容不为空则保存（缓存）数据对象
// 
import treeEditItem from "./tree_edit_item.vue";
export default {
    name: "treeEdit",
    props: {
        treeType: {
            type: String,
        }
    }
    , data: function() {
        var _this = this;
        return {
            queryTreeDatas: []
            , isEdit: false
        }
    }
    , components: {
        treeEditItem
    }
    , mounted: function() {
        this.queryTreeData();
    }
    , methods: {
        queryTreeData: function() {
            var _this = this;
            var params = {};
            switch (_this.treeType) {
                case "job":
                    params = {
                        conditionBean: null,
                        conditionFieldId: null,
                        conditionId: null,
                        corpId: null,
                        infoSetId: "hr_job_family",
                        isDateFilter: false,
                        keyId: "family_id",
                        orderBean: null,
                        orderStr: null,
                        parentId: "parent_family_id",
                        valueId: "family_name"
                    }
                    break;
                case "pos":
                    params = {
                        conditionBean: null,
                        conditionFieldId: null,
                        conditionId: null,
                        corpId: null,
                        infoSetId: "hr_job_level",
                        isDateFilter: false,
                        keyId: "level_id",
                        orderBean: null,
                        orderStr: null,
                        parentId: "level_order desc",
                        valueId: "level_name"
                    }
                    break;
                default:
                    console.log("缺少指定类型treeType");
            }
            _this.$daydao.$ajax({
                url: gMain.apiBasePath + "route/getKeyValueData.do",
                data: JSON.stringify(params),
                success: function(data) {
                    _this.queryTreeDatas = data.beans;
                }
            });
        }
        , addItem: function(level) {
            var _this = this;
            var treeDatas = _this.queryTreeDatas;

            _this.queryTreeDatas.push({
                id: "12",
                name: "赤霄",
                children: null
            });
        }
        , showEditList: function() {
            console.log("hover");
        }
        , addItemCallback: function(options) {
            var _this = this;
            var parentId = options.parentId;
            var nodeItem = _this.searchNodeLevel(parentId);
            console.log("当前节点：",nodeItem);

        }
        ,addNodeByLevel:function(nodeItem,addNode){
            var _this=this;
            // 构造新的编辑模板
            var tempTree=_this.queryTreeDatas;
            var cacheTree=[];
            _this.queryTreeDatas.forEach(function(item,index){
                if(item.children){
                    
                }
            });
            // 遍历所有数据
            function traverseNodeTree(nodeTree){
                nodeTree.forEach(function(item,index){
                    console.log(item);
                    
                });
            }
            
        }
        , searchNodeLevel: function(itemId) {
            var _this = this;
            var childrenLevel = 0;
            var currentItem={};
            // 遍历树，找出层级
            _this.queryTreeDatas.forEach(function(item, index) {
                var currentLevel = 1;
                findById(item,index,_this.queryTreeDatas);
                function findById(nodeItem,nodeIndex,parentNode) {
                    if (nodeItem.id != itemId) {
                        // 有子节点
                        if (nodeItem.children) {
                            currentLevel++;
                            nodeItem.children.forEach(function(item, index) {
                                findById(item,index,nodeItem);
                            });
                        }
                    } else {
                        // 相等
                        currentItem["childrenLevel"]=currentLevel;
                        currentItem["childIndex"]=nodeIndex;
                        currentItem['item']=nodeItem;
                        currentItem["parentItem"]=parentNode;
                        //childrenLevel=currentLevel;
                        console.log("当前level:",currentLevel);
                        console.log("当前item:",currentItem);

                    }
                }
            });
            return currentItem;
        }
        , deleteItemCallback: function(options) {
            console.log(options);
            var _this = this;
            var itemId = options.itemId;
            var itemName = options.itemName;
            
        }
    }

}
</script>