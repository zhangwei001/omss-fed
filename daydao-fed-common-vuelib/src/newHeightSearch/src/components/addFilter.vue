<template>

            <div class="select-wrapper">
                <div class="hs-addFilter-list">
                    <p>
                        <b>未选</b>
                        <span>单击选择</span>
                    </p>
                    <ul>
                        <li>
                            <Checkbox v-model="single">啊啊啊啊</Checkbox>
                        </li>
                        <li>
                            <Checkbox v-model="single">啊啊啊啊</Checkbox>
                        </li>
                    </ul>
                </div>
                
                <div class="icon-transfer"></div>
                <div class="hs-addFilter-list">
                    <p>
                        <b>已选</b>
                        <span>单击移除</span>
                    </p>
                    <ul>
                        <li>
                            <label class="ivu-checkbox-wrapper">bbb</label>
                            
                        </li>
                    </ul>
                </div>
            </div>


</template>

<script>

    export default {
        data() {
            return {
                single:false,
                show:false
            }
        }
    }

</script>

<style lang="scss">
    $preCls : '.hs-addFilter';

    #{$preCls} {

        &-model{
            .ivu-modal-mask{
                z-index: 1001;
            }
            .ivu-modal-wrap{
                z-index: 1001;
            }

            .select-wrapper{
                width: 534px;
                margin:0 auto;
                ul{
                    height:287px;
                    width:250px;
                    overflow-y:auto;
                    border:1px solid #E3E8EE;

                    li{
                        
                        cursor: pointer;
                        &:hover{
                            background: #F5F7F9;
                        }

                        .ivu-checkbox-wrapper{
                            font-size:14px;
                            width: 100%;
                            padding: 6px 12px;
                            margin:0;
                        }
                    }
                }
            }
            .icon-transfer{
                width: 26px;
                height:37px;
                vertical-align: center;
                display: inline-block;
                background:url(./jiantou.png) no-repeat;
            }
        }

        &-list{
            display: inline-block;
            vertical-align: middle;

            p{
                display: flex;
                justify-content:space-between;

                b{
                    font-size:16px;
                }

                span{
                    font-size:12px;
                }
            }
        }

    }
    
</style>
