export default {
	props:{
       data:{
            type : Object,
            default(){
                return {};
            }
       } 
    },
	methods:{
		submit(url , datas , fn){

			this.$daydao.$ajax({
                url : gMain.apiBasePath + url,
                data : JSON.stringify({persons:[datas]}),
                beforeSend:()=>{
                    this.$parent.$parent.loading();
                },
                success:data=>{
                    if (data.result==='true') {
                        let res = data.data.personResults[0].resp;
                        if (res.result === 'true') {
                            this.$Message.success('操作成功');
                            if (this.title==='离职' && data.data.personResults[0].isResign) {
                                this.$parent.$parent.$parent.$parent.reload('out');
                                return
                            }
                            if (this.title==='再入职' && data.data.personResults[0].isResign === 'false') {
                                this.$parent.$parent.$parent.$parent.reload('in');
                                return
                            }
                            fn();
                        }else{
                            this.$Message.error(res.resultDesc || '操作失败');
                        }
                    }else{
                        this.$Message.error(data.resultDesc || '操作失败');
                    }
                    this.$parent.$parent.hideLoad();
                },
                error:data=>{
                    this.$Message.error('服务器错误');
                    this.$parent.$parent.hideLoad();
                }
            })
		}
	}
}