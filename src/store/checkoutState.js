/**
 * 路由切换的动作
 */

/*==========================路由切换 动作 ==============================*/
export default {
    namespaced:true,
    state:{
        isModifiedForm:false // form表单是否编辑了
    },
    //更改状态的唯一方法
    mutations:{
        modifiedform(state,payload){
            console.log(1111,state,payload);
            state.isModifiedForm=payload.isModified;
        }
    },  
    // 异步操作处理
    actions:{

    },
    // 从 store 中的 state 中派生出一些状态
    getters:{

    }
}