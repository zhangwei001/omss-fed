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
};
