/**
 * Created by chenbinqun.
 *
 * 工具类
 */

export default {
    /**
     * 格式化图片大小
     * @param val
     * @param decimal
     * @return {*}
     */
    formatFileSize(val, decimal = 0){

        if (val === 0) {
            return val
        }

        if (val < 1024) {
            val = val + 'B';
        } else if (val >= 1024 && val < 1048576) {
            val = parseInt(val / 1024) + 'K';
        } else if (val >= 1048576 && val < 1073741824) {
            val = (decimal > 0 ? parseFloat(val / 1048576).toFixed(decimal) : parseInt(val / 1048576)) + 'M';
        } else {
            val = (decimal > 0 ? parseFloat(val / 1073741824).toFixed(decimal) : parseInt(val / 1073741824)) + 'G';
        }

        return val;
    }
    /**
     * 获取文件icon
     * @param fileName
     */
    , getIcon(fileName){
        let file = {icon: 'other', type: 99};

        const index = fileName.lastIndexOf('.');
        fileName = fileName.substring(index + 1).toLowerCase();
        switch (fileName) {
            case 'pdf':
                file.icon = 'pdf';
                file.type = 1;
                break;

            case 'rar':
            case 'zip':
            case '7z':
                file.icon = 'zip';
                file.type = 99;
                break;

            case 'txt':
                file.icon = 'txt';
                file.type = 1;
                break;

            case 'doc':
            case 'docx':
            case 'wps':
                file.icon = 'word';
                file.type = 1;
                break;

            case 'xlsx':
            case 'xls':
                file.icon = 'excel';
                file.type = 1;
                break;

            case 'ppt':
            case 'pptx':
                file.icon = 'ppt';
                file.type = 1;
                break;

            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'ico':
            case 'psd':
            case 'tif':
            case 'pic':
                file.icon = 'img';
                file.type = 2;
                break;

            case 'html':
            case 'css':
            case 'js':
            case 'php':
            case 'jsp':
            case 'xml':
            case 'svg':
                file.icon = 'other';
                file.type = 1;
                break;

            case 'rtf':
                file.icon = 'other';
                file.type = 1;
                break;


            case 'mp3':
            case 'wav':
            case 'aif':
            case 'ram':
            case 'wma':
            case 'flac':
                file.icon = 'music';
                file.type = 3;
                break;

            case 'wmv':
            case 'rm':
            case 'rmvb':
            case 'mpg':
            case 'mpeg':
            case "mpe":
            case "mov":
            case "mp4":
            case "avi":
            case "dat":
            case "mkv":
            case "flv":
            case "flash":
                file.icon = 'media';
                file.type = 4;
                break;

            default:
                file.icon = 'other';
                file.type = 99;
                break;
        }

        return file;
    }
    /** 网盘类型 **/
    , diskType: {
        corp: 2, // 企业盘
        cloud: 1 // 个人盘
    }
    /** 文件类型 */
    , fileType: {
        file: 2, //文件
        folder: 1 // 文件夹
    }
};
