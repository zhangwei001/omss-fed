/**
 * Created by chenbinqun.
 * 后端接口
 */

import Ajax from '../Ajax/index'

export default {
    /**
     * 获取文件地址
     * @param uuid
     * @return {*|Promise.<TResult>}
     */
    getFileUrl(uuid){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/preview.do"
            , data: JSON.stringify({uuid: uuid})
        }).then(data=>{
            if(data.result === "true"){
                return data.data;
            }
        });
    }
}
