<style type="scss">
.ztree li span.button.tree_edit_list_ico_open {
    width: 0;
    height: 0;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #657180;
    border-top: 10px solid transparent;
}

.ztree li span.button.tree_edit_list_ico_close {
    width: 0;
    height: 0;
    border-top: 10px solid #657180;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
}

#base_job_family {
    margin: 0 auto;
}

.operate_btn {
    float: right;
    margin-right: 30px;
}

.tree_edit_wrapper {
    height: 100%;
    height: calc(100% - 66px);
    height: -ms-calc(100% - 66px);
    height: -moz-calc(100% - 66px);
    overflow-y: auto;
}

.tree_edit_wrapper .init_add_btn {
    width: 300px;
    height: 40px;
    position: absolute;
    top: 50%;
    margin-left: 180px;
    line-height: 40px;
    background-color: #fff;
    border: 1px solid #CBD3DE;
    border-radius: 2px;
}

.tree_edit_wrapper .init_add_btn:hover {
    cursor: pointer;
}

.tree_edit_wrapper .btn-tips {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #657180;
}
</style>

<template>
    <div class="tree_edit_wrapper">
        <div class="tree_wrapper">
            <div id="base_job_family" class="ztree" style="width:315px;height:450px;">

            </div>
            <div class="operate_btn">
                <Button type="primary" style="margin-right:8px;" @click="saveTree">保存</Button>
                <Button @click="cancelEdit">取消</Button>
            </div>
        </div>

        <button v-if="isShowAddBtn" class="init_add_btn" @click="addOperation(opeType)">
            <i class="iconfont_daydao_common">&#xe619;</i>
            <span class="btn-tips">{{btnTips}}</span>
        </button>

    </div>
</template>

<script>
export default {
    name: "treeEditList"
    , props: {
        treeType: {
            type: String
        }
    }
    , data: function() {
        return {
            treeObj: {} // job ztree 对象
            , treeObjNew: {} // joblevel ztree 对象
            , aZTreeData: [] // 职位设置数据
            , aZTreeDataNew: [] // 职级设置数据
            , setting: {} // ztree 配置
            , bRemoveFlag: false
            , bRemoveFlagNew: false
            , btnTips: "" // 按钮提示
            , opeType: 1 // 操作类型 1：职务序列 2：职级设置
            , isShowAddBtn: false // 显示添加按钮
            , settingNew: {} //ztree 设置 
        }
    }
    , watch: {

    }
    , mounted: function() {
        this.init();
    }
    , methods: {
        init: function() {
            var t = this;
            seajs.use(["commonStaticDirectory/plugins/zTree/zTreeStyle/zTreeStyle.css", "commonStaticDirectory/plugins/zTree/jquery.ztree.all.min", "commonStaticDirectory/plugins/underscore.min"], function() {

                if (t.treeType == 'job') {
                    t.initJobTree();
                } else {
                    t.initJobLevelTree();
                }
                //t.setValue(t.val, t.showVal);
            });
        }
        , initJobTree: function() {
            var t = this;
            t.setting = {
                view: {
                    //用于当鼠标移动到节点上时，显示用户自定义控件，显示隐藏状态同 zTree 内部的编辑、删除按钮
                    addHoverDom: function(treeId, treeNode) {
                        var sObj = $("#" + treeNode.tId + "_span");
                        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                            + "' title='添加职务序列' onfocus='this.blur();'></span>";
                        sObj.after(addStr);
                        var btn = $("#addBtn_" + treeNode.tId);
                        if (btn) btn.bind("click", function() {
                            var zTree = $.fn.zTree.getZTreeObj("base_job_family");
                            var arrNodes = zTree.transformToArray(zTree.getNodesByFilter(function(node) {
                                return node.id != "familyRoot";
                            }));
                            //每次遍历树中的最大id，如果默认树中没有节点就从1开始
                            var iNum = 1;
                            if (arrNodes.length) {
                                for (var i = 0; i < arrNodes.length; i++) {
                                    arrNodes[i].id = parseInt(arrNodes[i].id);
                                }
                                iNum = _.max(arrNodes, function(item) { return item.id }).id;
                            }
                            zTree.addNodes(treeNode, { id: (iNum + 1) + "", pId: treeNode.id, name: "新的职务序列" });
                            return false;
                        });
                    },
                    //必须与addHoverDom同时使用
                    removeHoverDom: function(treeId, treeNode) {
                        $("#addBtn_" + treeNode.tId).unbind().remove();
                    },
                    selectedMulti: false
                    , showLine: true
                    , showIcon: false
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    drag: {
                        isCopy: true,
                        isMove: true,
                        prev: true,
                        inner: true,
                        next: true
                    },
                    showRemoveBtn: function(treeId, treeNode) {
                        return treeNode.id != "familyRoot";
                    },
                    showRenameBtn: function(treeId, treeNode) {
                        return treeNode.id != "familyRoot";
                    },
                    removeTitle: "删除",
                    renameTitle: "编辑"
                },
                data: {

                },
                callback: {
                    beforeEditName: function(treeId, treeNode) {
                        t.className = (t.className === "dark" ? "" : "dark");
                        var zTree = $.fn.zTree.getZTreeObj("base_job_family");
                        zTree.selectNode(treeNode);
                    },
                    beforeRemove: function(treeId, treeNode) {
                        t.className = (t.className === "dark" ? "" : "dark");
                        var zTree = $.fn.zTree.getZTreeObj("base_job_family");
                        zTree.selectNode(treeNode);
                        if (!t.bRemoveFlag) {
                            t.bRemoveFlag = true;
                            $("#" + treeNode.tId + "_remove").trigger('click');
                        }
                        return t.bRemoveFlag;
                    },
                    beforeRename: function(treeId, treeNode, newName, isCancel) {
                        t.className = (t.className === "dark" ? "" : "dark");
                        if (newName.length == 0) {
                            t.$Message.error("职务名称不能为空");
                            var zTree = $.fn.zTree.getZTreeObj("base_job_family");
                            setTimeout(function() { zTree.editName(treeNode) }, 10);
                            return false;
                        }
                        return true;
                    },
                    beforeDrag: function() {
                        return true;
                    },
                    beforeDrop: function() {
                        return true;
                    },
                    onRemove: function(event, treeId, treeNode) {
                        t.bRemoveFlag = false; //恢复到默认状态
                    }
                }
            };
            t.$daydao.$ajax({
                url: gMain.apiBasePath + "route/getKeyValueData.do"
                , data: JSON.stringify({
                    conditionBean: null
                    , conditionFieldId: null
                    , conditionId: null
                    , corpId: null
                    , infoSetId: "hr_job_family"
                    , isDateFilter: false
                    , keyId: "family_id"
                    , orderBean: null
                    , orderStr: null
                    , parentId: "parent_family_id"
                    , valueId: "family_name"
                })
                , success: function(data) {
                    if (data.beans && data.beans.length > 0) {
                        //如果只有一个空节点，表示后台没有节点，就去掉这个空节点
                        if (data.beans.length == 1 && !data.beans[0].id) {
                            data.beans[0].name = "新的职务序列";
                            $(".tree_wrapper").css("display", "none");
                            t.isShowAddBtn = true; //显示按钮
                            t.opeType = 1;
                            t.btnTips = "新增职务序列"
                        }
                        // iconSkin 自定义展开折叠图标
                        t.aZTreeData = [{ name: "职务序列", id: "familyRoot", children: data.beans, open: true }];
                        //t.aZTreeData =data.beans;
                        $.fn.zTree.init($("#base_job_family"), t.setting, t.aZTreeData);
                        t.treeObj = $.fn.zTree.getZTreeObj("base_job_family");//缓存起树


                    }
                }
            });
        }
        , initJobLevelTree: function() {
            var t = this;
            t.bRemoveFlagNew = false; //默认点击删除不执行删除节点，而是提示下，为true才删除
            t.settingNew = {
                view: {
                    //用于当鼠标移动到节点上时，显示用户自定义控件，显示隐藏状态同 zTree 内部的编辑、删除按钮
                    addHoverDom: function(treeId, treeNode) {
                        var sObj = $("#" + treeNode.tId + "_span");
                        //if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
                        if ($(treeNode.editNameFlag || "#addBtn_" + treeNode.tId).length > 0 || treeNode.getParentNode()) {
                            return;
                        }
                        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                            + "' title='添加职级' onfocus='this.blur();'></span>";
                        sObj.after(addStr);
                        var btn = $("#addBtn_" + treeNode.tId);
                        if (btn) btn.bind("click", function() {
                            var zTree = $.fn.zTree.getZTreeObj("base_job_family");
                            var arrNodes = zTree.transformToArray(zTree.getNodesByFilter(function(node) {
                                return node.id != "familyRoot";
                            }));
                            //每次遍历树中的最大id，如果默认树中没有节点就从1开始
                            var iNum = 1;
                            if (arrNodes.length) {
                                for (var i = 0; i < arrNodes.length; i++) {
                                    arrNodes[i].id = parseInt(arrNodes[i].id);
                                }
                                iNum = _.max(arrNodes, function(item) { return item.id }).id;
                            }

                            zTree.addNodes(treeNode, { id: (iNum + 1) + "_", pId: treeNode.id, name: "新的职级" });
                            return false;
                        });
                    },
                    //必须与addHoverDom同时使用
                    removeHoverDom: function(treeId, treeNode) {
                        $("#addBtn_" + treeNode.tId).unbind().remove();
                    },
                    selectedMulti: false,
                    showIcon: false
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    drag: {
                        isCopy: true,
                        isMove: true,
                        prev: true,
                        inner: false,
                        next: true
                    },
                    showRemoveBtn: function(treeId, treeNode) {
                        return treeNode.id != "familyRoot";
                    },
                    showRenameBtn: function(treeId, treeNode) {
                        return treeNode.id != "familyRoot";
                    },
                    removeTitle: "删除",
                    renameTitle: "编辑"
                },
                data: {

                },
                callback: {
                    beforeEditName: function(treeId, treeNode) {
                        t.className = (t.className === "dark" ? "" : "dark");
                        var zTree = $.fn.zTree.getZTreeObj("base_job_family");
                        zTree.selectNode(treeNode);
                    },
                    beforeRemove: function(treeId, treeNode) {
                        t.className = (t.className === "dark" ? "" : "dark");
                        var zTree = $.fn.zTree.getZTreeObj("base_job_family");
                        zTree.selectNode(treeNode);
                        if (!t.bRemoveFlagNew) {
                            t.bRemoveFlagNew = true;
                            $("#" + treeNode.tId + "_remove").trigger('click');
                        }
                        return t.bRemoveFlagNew;
                    },
                    beforeRename: function(treeId, treeNode, newName, isCancel) {
                        t.className = (t.className === "dark" ? "" : "dark");
                        if (newName.length == 0) {
                            t.$Message.success("职级名称不能为空");
                            var zTree = $.fn.zTree.getZTreeObj("base_job_family");
                            setTimeout(function() { zTree.editName(treeNode) }, 10);
                            return false;
                        }
                        return true;
                    },
                    beforeDrag: function() {
                        return true;
                    },
                    beforeDrop: function() {
                        return true;
                    },
                    onRemove: function(event, treeId, treeNode) {
                        t.bRemoveFlagNew = false; //恢复到默认状态
                    }
                }
            };

            t.$daydao.$ajax({
                url: gMain.apiBasePath + "route/getKeyValueData.do"
                , data: JSON.stringify({
                    conditionBean: null
                    , conditionFieldId: null
                    , conditionId: null
                    , corpId: null
                    , infoSetId: "hr_job_level"
                    , isDateFilter: false
                    , keyId: "level_id"
                    , orderBean: null
                    , orderStr: 'level_order desc'
                    , parentId: null
                    , valueId: "level_name"
                }),
                success: function(data) {
                    if (data.beans && data.beans.length) {
                        //如果只有一个空节点，表示后台没有节点，就去掉这个空节点
                        if (data.beans.length == 1 && !data.beans[0].id) {
                            $(".tree_wrapper").css("display", "none");
                            data.beans[0].name = "新的职级";
                            t.isShowAddBtn = true; //显示按钮
                            t.btnTips = "新增职级"
                            t.opeType = 2; // 职级设置
                        }

                        t.aZTreeDataNew = [{ name: "职级", id: "familyRoot", children: data.beans, open: true }];
                        //t.aZTreeDataNew = data.beans;
                        $.fn.zTree.init($("#base_job_family"), t.settingNew, t.aZTreeDataNew);

                        t.treeObjNew = $.fn.zTree.getZTreeObj("base_job_family");
                    }
                }
            });
        }
        , saveTree: function() {
            var t = this;

            if (t.treeType == 'job') {
                var aNodes = t.treeObj.getNodes()[0].children; //排除名为“全部”的根节点
                var aSends = []; //简洁性的树传给后端
                if (aNodes.length) {
                    function setNewNodes(arr) {
                        var aTemp = [];
                        for (var i = 0; i < arr.length; i++) {
                            var oNode = {
                                id: arr[i].id,
                                name: arr[i].name
                            };
                            if (arr[i].children && arr[i].children.length) {
                                oNode.children = setNewNodes(arr[i].children);
                            }
                            aTemp.push(oNode);
                        }
                        return aTemp;
                    }
                    aSends = setNewNodes(aNodes);
                }
                t.$daydao.$ajax({
                    url: gMain.apiBasePath + "jobFamily/updateJobFamilyTree"
                    , data: JSON.stringify(aSends)
                    , success: function(data) {
                        if (data.result == "true") {
                            //操作失败的职务类型
                            if (data.notPassJobFamily && $.isArray(data.notPassJobFamily) && data.notPassJobFamily.length && data.notPassInfo && $.isArray(data.notPassInfo) && data.notPassInfo.length) {
                                var sTitle = data.notPassJobFamily[0];
                                var sDes = data.notPassInfo[0];
                                t.$Message.error("操作失败," + '"' + sTitle + '"' + sDes);
                            } else {
                                t.$Message.success("保存成功");
                                t.$emit("saveEditCallback",true);
                            }
                        }
                    }
                });
            } else {
                var aNodes = t.treeObjNew.getNodes()[0].children; //排除名为“全部”的根节点
                var aSends = []; //简洁性的树传给后端
                if (aNodes.length) {
                    function setNewNodes(arr) {
                        var aTemp = [];
                        for (var i = 0; i < arr.length; i++) {
                            var oNode = {
                                id: arr[i].id,
                                name: arr[i].name
                            };
                            if (arr[i].children && arr[i].children.length) {
                                oNode.children = setNewNodes(arr[i].children);
                            }
                            aTemp.push(oNode);
                        }
                        return aTemp;
                    }
                    aSends = setNewNodes(aNodes);
                }
                t.$daydao.$ajax({
                    url: gMain.apiBasePath + "jobLevel/updateJobLevelTree"
                    , data: JSON.stringify(aSends)
                    , success: function(data) {
                        if (data.result == "true") {
                            //操作失败的职务类型
                            if (data.notPassJobFamily && $.isArray(data.notPassJobFamily) && data.notPassJobFamily.length && data.notPassInfo && $.isArray(data.notPassInfo) && data.notPassInfo.length) {
                                var sTitle = data.notPassJobFamily[0];
                                var sDes = data.notPassInfo[0];
                                t.$Message.error("操作失败," + '"' + sTitle + '"' + sDes);
                            } else {
                                t.$Message.success("保存成功");
                                t.$emit("saveEditCallback",true);
                            }
                        }
                    }
                });
            }

        }
        , cancelEdit: function() {
            var _this = this;
            _this.$emit("cancelEditCallback");
        }
        , addOperation: function(opeType) {
            var t = this;

            t.isShowAddBtn = false;
            if (opeType == 1) {
                // 职务
                $(".tree_wrapper").css("display", "block");
            } else {
                // 职级
                $(".tree_wrapper").css("display", "block");
            }
        }
    }
}
</script>
