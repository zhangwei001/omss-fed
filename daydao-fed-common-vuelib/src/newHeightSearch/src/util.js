//处理数据返回给后台
function searchDataHandler(list){

	let conditionArr = [];
    list.forEach(item=>{

        let condition = {};
        if (item.conditionId) {
            condition.conditionId = item.conditionId;
        }else{
            condition.uuid = item.uuid;
        }


        if (item.type === 'originTree') {
            condition.value = item.values;
        }else if (Object.prototype.toString.call(item.value) === '[object Object]') {
            condition.value = item.value.value;
        }else if(Array.isArray(item.value)){
            condition.value = [];
            item.value.forEach(v=>{
                condition.value.push(v.value);
            })
        }else if(typeof item.value==='string' && item.value.includes('~')){
            condition.value = item.value.split('~');
        }else{
            condition.value = item.value;
        }
        conditionArr.push(condition);
    })
    return conditionArr;

}


export {searchDataHandler}