import simpleDropSelectForAdd from 'components/simple_drop_select_for_add/index'

function renderSelect(h,params,key,required){
        return h(simpleDropSelectForAdd , {
                    class : {'ivu-form-item-error':this.classControl[params.index][key]},
                    props:{
                        width:140,
                        data:this.beans[key],
                        value:params.row[key],
                        relatedNodeId:this.cloneData[params.index].orgId,
                        relatedNodeName:this.cloneData[params.index].orgName,
                        itemId:key+params.index,
                    },
                    on:{
                        input:(val)=>{
                            this.cloneData[params.index][key] = val;
                            if (required) this.classControl[params.index][key] = false;
                        }
                    }
                })

    }


export default renderSelect;
