/**
 * Created by chenbinqun.
 *
 * new标签
 */

import NewFlag from './newFlag.vue'
import Ajax from '../Ajax/index'

// 用户已点击new标签
gMain.oNewFlag = {};
/**
 * 保存用户点击new标签(提供给其他模块调用)
 * @param type 模块名称
 * **/
gMain.saveNewFlag = function(type){
    if(!gMain.oNewFlag[type]) {
        Ajax.ajax({
            url: gMain.apiPath + "apiHome/daydaoHome/saveUserClickNewMenu",
            data: JSON.stringify({menuCode: type}),
            success: function (data) {
                let oldData = Object.assign({}, gMain.oNewFlag);
                // 不管更新成不成功
                oldData[type] = true;
                gMain.oNewFlag = oldData;
            }
        });
    }
};


export default NewFlag;
