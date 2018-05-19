export default {
    formatTableData(dataList, arr,clickAbleItem) {
        var _this = this;
        arr = arr || [];
        var newArr = [];
        console.log(arr);
        arr.forEach(function (item, index) {
            if(item.name==clickAbleItem){
                item.formatter=(row, column, cellValue)=>{
                    return _this.formatClickAbleItem(row, column, cellValue,dataList);
                }
            }
            newArr.push(item);
        });
        return newArr;
    },
    formatClickAbleItem(row, column, cellValue,dataList){
        var _this=this;
        // 组织名字去空格
        var columnValue='';
        if(column.property=='indent_name'){
            columnValue=cellValue.replace(/\s/g,"");
        }else{
            columnValue=cellValue;
        }

        return `<span class="org_name_href" style="cursor:pointer;color:#2D8CF0;">${columnValue}</span>`;

        /*return h('span',{
            attrs:{

            }
            ,style:{
                cursor:'pointer'
                ,color:'#2D8CF0'
            }
            ,on:{
                click:()=>{
                    //可点击项
                    //dataList.$refs.tableDataList.showDataClick(row);
                    dataList.$children.forEach((item)=>{
                        if(item.infoSetId != dataList.infoSetId) return false;

                        if(item.infoSetId == 'job_list'){
                            dataList.$router.push({
                                name: 'job_list_detail',
                                params: {
                                    infoSetId: dataList.infoSetId,    // 当前页面的infosetid
                                    id: row[item.getTableColumnData.editTemplate.editConditionKey],  // 当前列表数据的id
                                    jobName:encodeURI(row.job_name),
                                    uuid:row['uuid']
                                }
                            })
                        }
                        else if(item.infoSetId == 'org_list') {
                            console.log(params);
                            var orgName=row.indent_name.replace(/\s/g,"");
                            dataList.$router.push({
                                name: 'org_list_detail',
                                params: {
                                    infoSetId: dataList.infoSetId,    // 当前页面的infosetid
                                    id: row[item.getTableColumnData.editTemplate.editConditionKey],  // 当前列表数据的id
                                    orgName:encodeURI(orgName),
                                    uuid:row['uuid']
                                }
                            })
                        }else if(item.infoSetId=='pos_list'){
                            dataList.$router.push({
                                name:"pos_list_detail",
                                params:{
                                    infoSetId:dataList.infoSetId,
                                    id:row[item.getTableColumnData.editTemplate.editConditionKey],
                                    posName:encodeURI(row.pos_name),
                                    uuid:row['uuid']
                                }
                            });
                        }
                    })
                }
            }
        },(columnValue));*/
    }
    /**
     * 点击组织链接的跳转
     * */
    ,goOrgNameLink(opts){
        var _this = this;
        opts = opts || {};

        var row = opts.row;
        //可点击项
        //dataList.$refs.tableDataList.showDataClick(row);
        opts.dataList.$children.forEach((item)=>{
            if(item.infoSetId != opts.dataList.infoSetId) return false;

            if(item.infoSetId == 'job_list'){
                opts.dataList.$router.push({
                    name: 'job_list_detail',
                    params: {
                        infoSetId: opts.dataList.infoSetId,    // 当前页面的infosetid
                        id: row[item.getTableColumnData.editTemplate.editConditionKey],  // 当前列表数据的id
                        jobName:encodeURI(row.job_name),
                        uuid:row['uuid']
                    }
                })
            }
            else if(item.infoSetId == 'org_list') {
                var orgName=row.indent_name.replace(/\s/g,"");
                opts.dataList.$router.push({
                    name: 'org_list_detail',
                    params: {
                        infoSetId: opts.dataList.infoSetId,    // 当前页面的infosetid
                        id: row[item.getTableColumnData.editTemplate.editConditionKey],  // 当前列表数据的id
                        orgName:encodeURI(orgName),
                        uuid:row['uuid']
                    }
                })
            }else if(item.infoSetId=='pos_list'){
                opts.dataList.$router.push({
                    name:"pos_list_detail",
                    params:{
                        infoSetId:opts.dataList.infoSetId,
                        id:row[item.getTableColumnData.editTemplate.editConditionKey],
                        posName:encodeURI(row.pos_name),
                        uuid:row['uuid']
                    }
                });
            }
        })


    }
}
