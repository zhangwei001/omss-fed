<template>
    <div class="ivu-input-wrapper hs-input-text">
        <input class="ivu-input hs-number-range" v-model="start" />
            <span class="separation"> — </span>
        <input class="ivu-input hs-number-range" v-model="end" />
    </div>
</template>

<script>

    export default {
        data() {
            return {
                start :'',
                end :'',
            }
        },
        props:{
            value : ''
        },
        watch:{
            start(v){
                if (v !== undefined) {
                    this.start = v.replace(/[^\d]/g,'');
                    this.$emit('input' , [this.start,this.end]);
                }
            },
            end(v){
                if (v !== undefined) {
                    this.end = v.replace(/[^\d]/g,'');
                    this.$emit('input' , [this.start,this.end]);
                }
            },
            value(v){
            	if (v.length === 0) {
            		this.start = '';
            		this.end = '';
            	}else if(Array.isArray(v) && v[0] && v[1]){
                    this.start = v[0];
                    this.end = v[1];
                }
            }
        },
        created(){
            if (this.value) {
                this.start = this.value[0];
                this.end = this.value[1];
            }
        },

    }
</script>

<style>
    .hs-number-range{
        width:95px;
    }
</style>