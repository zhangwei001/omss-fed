/**
 * 人员选择组件
 * @param {String} getPersonListUrl 获取员工的接口
 * @param {Object} getPersonListParams 获取员工接口的传参，传给后端用 ，如要过滤离职员工列表， getPersonListParams:{ personStatusFilter:2}
 * @param {Array} aData 传入的已选的人员数组，默认在右边已选区域展示
 * @param {String} selectType：mul/single 选择的类型，是多选还是单选模式，默认多选
 *
 * @method reset 重置，重新初始化所有操作状态
 * @method resetData 重置左侧列表的选中状态
 * */

export {default} from './personSelect.vue';
