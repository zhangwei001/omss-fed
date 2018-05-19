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
                this.start = v.replace(/[^\d]/g,'');
                this.$emit('input' , `${this.start},${this.end}`);
                
            },
            end(v){
                this.end = v.replace(/[^\d]/g,'');
                this.$emit('input' , `${this.start},${this.end}`);
            },
            value(v){
            	if (!v) {
            		this.start = '';
            		this.end = '';
            	}
            }
        },
        created(){
            if (this.value) {
                let arr = this.value.split(",");
                this.start = arr[0];
                this.end = arr[1];
            }
        },

    }
</script>

<style>
    .hs-number-range{
        width:95px;
    }
</style>