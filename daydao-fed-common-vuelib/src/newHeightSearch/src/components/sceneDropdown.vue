<template>
    <!-- 条件模板 -->
    <div class="hs-out-input-wrapper">
        <span class="hs-filter-label">场景</span>
        <div class="hs-condition-wrapper">
            <Dropdown trigger="click" class="dropdown">
                <a href="javascript:void(0)" class="dropdownBtn">
                    {{currentData.name || '请选择场景'}}
                    <Icon type="arrow-down-b" class="icon-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem v-if="customSearchCondition.length>0" @click.native="getTemplate(item ,index)" v-for="(item , index) in customSearchCondition" :key="index">{{item.name}}</DropdownItem>
                    <ul class="condition-btn-group">
                        <DropdownItem @click.native="addConditionTemplate" class="addTpl">+ 新增</DropdownItem>
                        <DropdownItem @click.native="showManagePanel"  :class="['manageBtn' , {'disable': !canManage}]">管理</DropdownItem>
                        <li class="division"></li>
                    </ul> 
                    
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
                
</template>

<script>

    export default {
        name:'sceneDropdown',
        data() {
            return {
                dataArr:[],
                currentIndex:-1,
                currentData: {},
                disableManage: false,
                //是否可以管理模板
                canManage : false,

            }
        },
        props: {
            addConditionTemplate: {
                type: Function,
                default() {}
            },
            customSearchCondition: {
                type: Array,
                default(){
                    return [];
                }
            }
        },
        watch:{
            customSearchCondition(val){
                //判断是否可以管理模板
                this.canManage = false;
                this.customSearchCondition.forEach(item=>{
                    if (item.type === 2) {
                        this.canManage = true;
                    }
                });
            }
        },
        created() {
            if (this.customSearchCondition.length>0) this.init();
        },
        methods: {
            getTemplate(val , index) {
                this.currentData = val;
                this.currentIndex = index;
                this.$emit('getTemplate' , val , index);
            },
            showManagePanel(){
                let customList = this.customSearchCondition.filter(item=>item.type===2);
                let len = this.customSearchCondition.length - customList.length;
                let index = 0;

                if (this.currentIndex>len) {
                    index = this.currentIndex-len;
                }

                if (this.canManage) this.$emit('showManagePanel' , index);
            },
            //找出默认模板
            init(){

                for (let i = 0; i < this.customSearchCondition.length; i++) {
                    if (this.customSearchCondition[i].isDefault) {
                        this.currentData = this.customSearchCondition[i];
                        this.currentIndex = i;
                        break;
                    }
                }

                if (this.currentIndex>-1) {
                    this.$emit('getTemplate' , this.currentData , this.currentIndex);
                }else{
                    this.$emit('getTemplate' , 'noDefault')
                }

                //判断是否可以管理模板
                this.canManage = false;
                this.customSearchCondition.forEach(item=>{
                    if (item.type === 2) {
                        this.canManage = true;
                    }
                });
                
            },
            changeTemplate(uuid){
                for (let i = 0; i < this.customSearchCondition.length; i++) {
                    if (this.customSearchCondition[i].uuid === uuid) {
                        this.currentData = this.customSearchCondition[i];
                        this.currentIndex = i;
                        break;
                    }
                }
                this.$emit('changeCurrentTpl' , this.currentData , this.currentIndex);

            }
        }
    }

</script>


<style lang="scss">

    $preCls : '.hs';
    
    .newHighSearch{

        #{$preCls} {
            &-condition-wrapper{
                display: inline-block;
                .ivu-select-dropdown{
                    padding-bottom: 0;
                }
                .dropdown{
                    width: 150px;
                    
                }
                .condition-btn-group{
                    display: flex;
                    border-top:1px solid #E3E8EE;
                    position: relative;

                    .disable{
                        color : #ccc;
                    }

                    li{
                        flex: 1;
                        text-align: center;
                        cursor: pointer;
                        color:#4B9FFA;

                        &:hover {
                            background: #fff;
                        }

                        &.division{
                            position: absolute;
                            left: 50%;
                            height: 100%;
                            width: 1px;
                            background :#E3E8EE;
                        }
                    }
                }
            }

        }

    }


    
</style>