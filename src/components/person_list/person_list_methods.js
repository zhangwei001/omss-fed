/**
 * 员工列表的公共方法封装
 * */
export default {
    /**
     * 格式化表格数据展示
     * @personList 员工列表组件对象
     * @arr 表头字段的数组
     * @origin 员工列表的类型，在职，离职，未激活
     * */
    formatTableData(personList,arr,origin){
        var _this = this;
        arr = arr || [];
        var newArr = [];
        arr.forEach(function (item,index) {
            //如果是头像字段
            if(item.name == "head_img"){
                item.formatter = (row, column, cellValue) => {
                    return _this.formatHeaderData(row, column, cellValue,personList);
                };
            }else if(item.name == "person_name"){ //员工姓名
                item.formatter = (row, column, cellValue) => {
                    return _this.formatPersonName(row, column, cellValue,personList,origin);
                };
            }
            newArr.push(item);
        });
        return newArr;
    }
    /**
     * 处理头像
     * */
    ,formatHeaderData(row, column, cellValue,personList){
        var aColors = ["#07a9ea","#82c188","#ab97c2","#ffb500","#59ccce","#ff5959"]; //蓝，绿，紫，黄，浅蓝,浅红
        var sPersonId = row.person_id || "";
        var sColor = aColors[parseInt(sPersonId)%6];
        var str = "";
        var oStyle = {
            style:{
                textAlgin:"center"
                ,margin:"10px 0"
            }
        };
        if(row.head_img){
            /*str = h('div',oStyle, [
                h('img', {
                    attrs: {
                        class: 'base_head_img_img'
                        ,src:gMain.imgPath + row.head_img
                    },
                    on:{
                        error:(event) => {
                            $(event.target).hide().parent().append('<i class="base_head_img" style="background-color: '+sColor+'">'+(row.person_name || "").substr(-2)+'</i>');
                        }
                    }
                })
            ]);*/
            str = `<div style="text-align: center;margin: 10px 0;"><img class="base_head_img_img" src="${gMain.imgPath + row.head_img}" alt=""></div>`;
        }else{
            /*str = h('div',oStyle, [
                h('i', {
                    attrs: {
                        class: 'base_head_img'
                    }
                    ,style: {
                        backgroundColor: sColor
                    }
                },(row.person_name || "").substr(-2))
            ]);*/
            str = `<div style="text-align: center;margin: 10px 0;"><i class="base_head_img" style="background-color: ${sColor}">${(row.person_name || "").substr(-2)}</i></div>`;
        }
        return str;
    }
    /**
     * 员工姓名可点击状态显示
     * */
    ,formatPersonName(row, column, cellValue,personList){
        var _this = this;
        let style = '';
        if(personList.infoSetId != 'person_inactive_list'){
            // 非未激活的员工
            style = `cursor:pointer;color:#2D8CF0;`;
        }
        return `<span class="person_name_href" style="${style}">${cellValue}</span>`;
        /*return h('span', {
            attrs: {

            }
            ,style: style
            ,on: {
                click: () => {
                    // 点击员工姓名的事件触发
                    personList.$refs.tableDataList.showDataClick(row);
                    // 未激活的员工，不让点击
                    if(personList.infoSetId == 'person_inactive_list') return;
                    personList.$children.forEach((item)=>{
                        if(item.infoSetId != personList.infoSetId) return false;

                        personList.$router.push({
                            name: 'person_detail',
                            params:{
                                personId: row.person_id,
                                infoSetId: personList.infoSetId, // 当前页面的infosetid
                            }
                        })
                    })
                }
            },
        },(row[params.column.key]));*/
    }
    /**
     * 点击员工链接的跳转
     * */
    ,goPersonLink(opts){
        var _this = this;
        opts = opts || {};
        var personId = opts.row.person_id;
        var row = opts.row;

        // 点击员工姓名的事件触发
        opts.personList.$refs.tableDataList.showDataClick(row);
        // 未激活的员工，不让点击
        if(opts.personList.infoSetId == 'person_inactive_list') return;
        opts.personList.$children.forEach((item)=>{
            if(item.infoSetId != opts.personList.infoSetId) return false;

            opts.personList.$router.push({
                name: 'person_detail',
                params:{
                    id: personId,
                    infoSetId: opts.personList.infoSetId, // 当前页面的infosetid
                }
            })
        })
    }
}
