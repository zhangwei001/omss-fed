/**
 * 公共头部状态
 */

/*==========================header 相关接口==============================*/

export default {
    namespaced: true,
    state: {

    },
    mutations: {
        setState(state, { key, value }) {
            state[key] = value;
        }
    },
    actions: {
        /* getTotal:function({commit},paramData){
            var result = paramData.a + paramData.b;
            commit('setCommonStateData',{key:"total",data:result});
         }*/
    },
    getters: {
        
    }
}
