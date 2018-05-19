<template>
    <div :class="['hs-keyword-wrapper' , 'hs-out-icon' , {active:isShowKeyworldInput}]">
        <i class="iconfont_daydao_common hs-icon-search" @click="iconSearchHandler">&#xe67f;</i>
        <i class="iconfont_daydao_common hs-icon-close" v-if="isShowIconDel" @click="iconCloseHandler">&#xe6a6;</i>
        <input id="hsKeyword" type="text" 
            :placeholder="placeholder" 
            v-model.trim="keyword" 
            @keydown.up.prevent="heightLine(listIndex-1)"
            @keydown.down.prevent="heightLine(listIndex+1)" 
            @blur="searchBlur" 
            @keydown.enter.stop="handleKeyEnter">                   
        
        <transition name="fade-down">
            <div class="hs-list" v-show="isShowSearchList">
                <ul ref="hsSearchList" class="clearfix">
                    <li v-for="(item , index) in fuzzyList" @mouseenter.prevent="fuzzyMouseEnterHandler(index)" @click="mouseDown(index)">{{item}}</li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>

    export default {
        name:'keywordInput',
        data() {
            return {
                isShowKeyworldInput:false,
                isShowIconDel:false,
                isShowSearchList:false,
                keyword:'',
                fuzzyList: [],
                listIndex: -1,
                iconCloseState:false
            }
        },
        props: {
            placeholder:{
                type: String,
                default : ''
            },
            value:{
                type: String,
                default:''
            }
        },
        watch:{
            value(val){
                if (!val) {
                    this.keyword = '';
                }
            },
            keyword(val, old) {
                this.$emit('input' , this.keyword);

                this.isShowIconDel = val?true:false;

                if (this.keywordInput != document.activeElement) return;
                if (this.fuzzyList[this.listIndex] == this.keyword) return;
                if (!this.$parent.isFetchFuzzySearch) return; 
                // Fuzzy Matching
                this.$daydao.$ajax({
                    url: gMain.apiBasePath + "route/personName/suggest",
                    data: JSON.stringify({ "corpId": gMain.oUser.corpId, "keyword": val }),
                    success : data => {
                        if (Array.isArray(data)) {
                            if (!this.isShowSearchList) {
                                this.listIndex = -1;
                            }
                            if (data.length > 0) {
                                this.fuzzyList = data;

                                this.isShowSearchList = true;
                            } else {
                                this.hideSearchList();
                            }
                        } else {
                            this.hideSearchList();
                            console.error('the parama of cb must be an array');
                        }
                    }
                })
            }
        },
        mounted() {
            this.keywordInput = document.querySelector('#hsKeyword');
        },
        methods: {
            iconSearchHandler(){
                if (!this.isShowKeyworldInput) {
                    this.isShowKeyworldInput = true;
                    this.isShowIconDel = this.keyword?true:false;
                    this.keywordInput.focus();
                    return;
                }

                this.handleKeyEnter()
            },
            iconCloseHandler(){
                this.keyword = '';
                this.iconCloseState = true;
                this.keywordInput.focus();
                setTimeout(_=>{
                    this.iconCloseState = false;
                },150)

            },

            searchBlur() {
                setTimeout(_ => {

                    if (this.keyword || this.iconCloseState) {
                        this.isShowKeyworldInput = true;
                        this.hideSearchList();
                    }else{
                        if (this.isShowSearchList) this.hideSearchList();
                        this.isShowKeyworldInput = false;
                    }
                    
                }, 150);
            },

            hideSearchList() {
                this.isShowSearchList = false;
                let $searchList = this.$refs.hsSearchList.querySelectorAll('li');
                for (let i = 0; i < $searchList.length; i++) {
                    $searchList[i].classList.remove("cur");
                }
            },

            fuzzyMouseEnterHandler(index) {
                this.listIndex = index;
                let $searchList = this.$refs.hsSearchList.querySelectorAll('li');

                for (let i = 0; i < $searchList.length; i++) {
                    $searchList[i].classList.remove("cur");
                }

                $searchList[index].classList.add("cur");
            },

            heightLine(index) {
                if (!this.isShowSearchList) { return };
                let $searchList = this.$refs.hsSearchList.querySelectorAll('li');

                let maxIndex = $searchList.length;

                if (index < 0) {
                    index = 0;
                }
                //down
                if (index > maxIndex - 1) {
                    index = maxIndex - 1;
                }

                this.listIndex = index;
                for (let i = 0; i < $searchList.length; i++) {
                    $searchList[i].classList.remove("cur");
                }
                $searchList[index].classList.add("cur");

                this.keyword = this.fuzzyList[index];
            },
            mouseDown(index){
                this.keyword = this.fuzzyList[index];
                this.handleKeyEnter();
            },
            handleKeyEnter(){
                this.$emit('getKeyword' , this.keyword);
                this.searchBlur();
            }
        }
    }

</script>


<style lang="scss">
    $preCls : '.hs';

    .newHighSearch {
        #{$preCls} {
            &-keyword-wrapper{
                transition: all 0.2s ease;
                position: relative;

                &.hs-out-icon{
                    padding: 3px 10px;
                }
                
                &.active{
                    width: 300px;
                }


                input {
                    width: calc(100% - 22px);
                    height: 20px;
                    line-height: 30px;
                    border:none;
                    float: left;
                    font-size: 14px;
                    color: #657180;

                    &::-webkit-input-placeholder {
                        color: #D7DDE4;
                    }
                }

            }

            &-icon-search{
                display: block;
                cursor: pointer;
                font-size: 18px;
                color: #AFB9C6;
                position: relative;
                top: -3px;
                float: left;
                margin-right: 4px;
            }
            &-icon-close{
                position: absolute;
                right: 6px;
                top: 2px;
                color : #AFB9C6;

                &:hover{
                    color: #ed3f14;
                }
            }

            &-out-icon{
                &:hover .hs-icon-search{
                    border-color:#F18950;
                    color: #F18950;
                }
            }
        }
    }
</style>