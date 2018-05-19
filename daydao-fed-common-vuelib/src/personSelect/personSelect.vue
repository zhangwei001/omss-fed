<style lang="scss">
    @import "../styles/animation/slideDown.scss";

    $prefixCls:'person-select';
    $hoverColor:#F18950;

    /*placeholder提示文字的颜色*/
    @mixin placeholder($color) {
        // Firefox
        &::-moz-placeholder {
            color: $color;
            opacity: 1; // Override Firefox's unusual default opacity; see https://github.com/twbs/bootstrap/pull/11526
        }
        // Internet Explorer 10+
        &:-ms-input-placeholder {
            color: $color;
        }
        // Safari and Chrome
        &::-webkit-input-placeholder {
            color: $color;
        }
    }

    .#{$prefixCls}{
        &-wrap{
            .ivu-page-item,.ivu-page-item-jump-prev,.ivu-page-item-jump-next{
                display: none;
            }
        }

        &-left{
            float: left;
            width:calc((100% - 60px)/2);
        }

        &-h1{
            font-size: 16px;
            color: #657180;
            height: 40px;
            line-height: 40px;
            font-weight: bold;
        }
        &-resultLength{
            color: $hoverColor;
        }

        &-search-box{

            .#{$prefixCls}-keyword{
                border: 1px solid #D7DDE4;
                border-radius: 2px;
                width: calc(100% - 60px);
                height: 30px;
                line-height: 30px;
                float: left;
                border-right: none;
                padding: 0 10px;

                @include placeholder(#D7DDE4);

                &:hover{
                    border-color:#F18950;
                }
            }
            .#{$prefixCls}-submit{
                background: #F18950;
                border-radius: 2px;
                width: 60px;
                height: 30px;
                text-align: center;
                color: #fff;
                line-height: 30px;
                font-size: 21px;
                font-weight: normal;
                float: left;
                cursor: pointer;
                margin-left: -1px;
            }
        }

        &-tree{
            height:36px;
            line-height: 36px;
        }

        &-table{
            position: relative;
        }

        &-pager{
            margin-top:15px;

            .ivu-page{
                float: right;
            }
            .ivu-select-item{
                font-size:12px!important;
            }
        }

        /*中间按钮区*/
        &-center{
            float: left;
            width:60px;
            position: relative;

            .#{$prefixCls}-btns{
                position: absolute;
                top: 289px;
                left: 16px;
                width:26px;
                height:37px;
                background: url('images/arrows.png') no-repeat;
            }
        }

        /*右侧*/
        &-right{
            float: right;
            width:calc((100% - 60px)/2);

            .#{$prefixCls}-hint{
                float: right;
            }

            .#{$prefixCls}-reset{
                float: right;
                margin-right:10px;
            }
        }

    }


</style>
<template>
    <div :class="[prefixCls + '-wrap','clearfix']">
        <!--左侧选择区域-->
        <div :class="[prefixCls + '-left']">
            <h1 :class="[prefixCls + '-h1']">待选人员</h1>
            <div :class="[prefixCls+'-search-box','clearfix']">
                <input :class="[prefixCls + '-keyword','ivu-input']" type="text" placeholder="请输入姓名、职位、工号" v-model="listKeyword" @keyup.enter="handleListSearch">
                <div :class="[prefixCls + '-submit']" @click="handleListSearch">
                    <Icon type="search"></Icon>
                </div>
            </div>

            <!--树导航-->
            <div :class="[prefixCls + '-tree','clearfix']">
                <!--树的容器-->
                <drop-tree-menu
                    ref="dropTreeLeft"
                    :treeStyleId="leftTreeId"
                    @on-treenode-click="onTreenodeClickLeft"></drop-tree-menu>

            </div>

            <!--左侧数据表格区域-->
            <div :class="[prefixCls + '-table','clearfix']">
                <data-table :aColumns="leftColumns" :aData="leftData" @change-checked-val="changeCheckedVal" :selectType="selectType"></data-table>
                <Spin size="large" fix v-if="spinShowLeft"></Spin>
            </div>

            <!--左侧翻页-->
            <div :class="[prefixCls + '-pager','clearfix']">
                <Page :total="parseInt(pageTotal)" show-elevator :page-size="pageSize" :page-size-opts="pageSizeLimit" :current="parseInt(pageNo)" placement="top" @on-change="onChangePageNo" @on-page-size-change="onPageSizeChange" show-sizer size="small" show-total></Page>
            </div>

        </div>

        <!--中间传递按钮-->
        <div :class="[prefixCls + '-center','clearfix']">
            <div :class="[prefixCls + '-btns']">

            </div>
        </div>

        <!--右侧结果区域-->
        <div :class="[prefixCls + '-right']">
            <h1 :class="[prefixCls + '-h1']">已选人员 <span :class="[prefixCls + '-resultLength']">({{resultData.length}})</span></h1>
            <div :class="[prefixCls+'-search-box','clearfix']">
                <input :class="[prefixCls + '-keyword','ivu-input']" type="text" placeholder="请输入姓名、职位、工号" v-model="resultKeyword" @keyup.enter="handleResultSearch">
                <div :class="[prefixCls + '-submit']" @click="handleResultSearch">
                    <Icon type="search"></Icon>
                </div>
            </div>

            <!--右侧树导航-->
            <div :class="[prefixCls + '-tree','clearfix']">

                <!--树的容器-->
                <drop-tree-menu
                    ref="dropTreeRight"
                    :treeStyleId="rightTreeId"
                    @on-treenode-click="onTreenodeClickRight"></drop-tree-menu>

                <!--操作提示-->
                <div :class="[prefixCls + '-hint']">
                    单击移除
                </div>

                <!--操作提示-->
                <div :class="[prefixCls + '-reset']" @click="reset" style="display: none;">
                    重置
                </div>
            </div>

            <!--右侧表格-->
            <div :class="[prefixCls + '-table']">

                <data-table :aColumns="rightColumns" :aData="rightData" @on-row-click="removeRightData"></data-table>

            </div>

            <!--右侧翻页-->
            <div :class="[prefixCls + '-pager']">
                <Page size="small" placement="top" show-elevator  show-sizer :page-size-opts="pageSizeLimit" :current="pageNoRight" :total="pageRightTotal" :page-size="pageSizeRight" show-total
                      @on-change="onChangeRightPageNo"
                      @on-page-size-change="onPageSizeChangeRight"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    export {default} from './personSelect.js';
</script>
