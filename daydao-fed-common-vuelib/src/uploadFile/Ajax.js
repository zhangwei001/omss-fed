/**
 * Created by chenbinqun.
 *
 * 后端接口
 */

import Ajax from '../Ajax/index'
import Utils from './Utils'

export default {
    /** 网盘签名信息 */
    cloudSign: {
        // 腾讯云存储目录
        bucketName: 'cloudp',
        // 腾讯云appid
        appid: '10061427',
        // 地域
        region: 'sh'
    }
    /**
     * 获取图片地址
     * @param uuid
     * @return {*}
     */
    , getImgUrl(uuid){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/download.do"
            , data: JSON.stringify({uuid: uuid})
        }).then(data=>{
            if(data.result === "true"){
                return data.data;
            }
        });
    }
    /**
     * 批量获取图片地址
     * @param uuids  字符串：'1, 2 , 3...'
     */
    , batchGetImgUrl(uuids){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/batchDownload.do"
            , data: JSON.stringify({uuids: uuids})
        }).then(data=>{
            if(data.result === "true"){
                return data.data;
            }
        });
    }
    /**
     * 件预上传
     *
     * @param fileName
     * @param fileSize
     * @param fileMd5
     * @return {*}
     */
    , preupLoadFile(fileName, fileSize, fileMd5){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/preupLoadFile.do",
            data: JSON.stringify({fileName: fileName, fileSize: fileSize, fileMd5: fileMd5})
        }).then(data=>{
            if(data.result === "true"){
                return data.data;
            }
        });
    }
    /**
     * 获取签名
     *
     * @param upFileName
     * @param fileName
     * @return {*|Promise.<TResult>}
     */
    , getSign(upFileName, fileName){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/getSign.do",
            data: JSON.stringify({fileName: fileName, upFileName: upFileName})
        }).then(data=>{
            if(data.result === "true"){
                return data.data;
            }
        });
    }
    /**
     * 发送上传云服务成功反馈信息到后台
     *
     * @param fileName
     * @param fileSize
     * @param fileMd5
     * @param fileStorageJsonResponse
     *
     * @return {*|Promise.<TResult>}
     */
    , upLoadFile(fileName, fileSize, fileMd5, fileStorageJsonResponse){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/upLoadFile.do",
            data: JSON.stringify({fileName: fileName, fileSize: fileSize, fileMd5: fileMd5, fileStorageJsonResponse: fileStorageJsonResponse})
        }).then(data=>{
            if(data.result === "true"){
                return data.data;
            }
        });
    }
    /**
     * 获取图片地址
     * @param uuid
     * @return {*}
     */
    , getImgUrl(uuid){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/download.do"
            , data: JSON.stringify({uuid: uuid})
        }).then(data=>{
            if(data.result === "true"){
                return data.data;
            }
        });
    }
    /**
     * 获取文件列表
     * @param fileIdList
     * @return {Promise.<TResult>|*}
     */
    , getFileList(fileIdList){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/listFile.do"
            , data: JSON.stringify({fileIdList: fileIdList})
        }).then(data=>{
            if(data.result === "true"){
                return data.data.list || [];
            }
        });
    }
    /**
     * 获取网盘数据列表
     * @param diskType 1、我的文件；2、企业文件
     * @param pageNo   页码默认第一页
     * @param pageSize  每页大小默认20条
     * @param parentId
     */
    , getCloudFileList({diskType, pageNo = 1, pageSize = 20, parentId = -1}){
        return Ajax.ajax({
            url: gMain.apiPath + "apiCloud/cpCloudCommon/getCloudFile.do"
            , data: JSON.stringify({diskType: diskType, pageNo: pageNo, pageSize: pageSize, parentId: parentId})
        }).then(data=>{
            if(data.result === "true"){
                let fileList = data.data.list || [];
                let file = Utils.fileType.file;
                fileList.forEach(item=>{
                    item.checked = false;
                    item.disabled = false;
                    item.rename = false;
                    item.size = Utils.formatFileSize(item.fileSize, 2);
                    if(item.fileType === file){
                        let icon = Utils.getIcon(item.fileName);
                        item.icon = icon.icon;
                    }else{
                        item.icon = 'folder';
                    }
                });
                return fileList;
            }
        });
    }
    /**
     * 新增文件夹
     *
     * @param folderName
     * @param diskType
     */
    , addFolder(folderName, diskType){

    }
    /**
     * 保存到网盘
     * @param diskType
     * @param folderId
     */
    , saveToCloud(diskType, folderId){

    }
}
