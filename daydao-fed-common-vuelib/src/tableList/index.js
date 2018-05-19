/**
 * by zhangqi
 * 页面表格列表展示组件
 * @param {Array} tableColumnData 表头的对象数组
 * @param {Object} tableData 表体数据，内含 tableData.maps : {Array}表格数据对象数据，tableData.pb:{Object}翻页数据对象
 * @param {Int} pageSize 每页条数
 * @param {Function} onChangePage(opts) 分页改变的回调；返回了：opts.pageSize，opts.pageNo
 * */
export {default} from './tableList.vue';
