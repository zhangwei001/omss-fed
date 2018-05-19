
import {daydaoDropSelect} from 'commonVueLib/daydaoDropSelect'

function renderSelect(h,params,key,required){
        return  h(daydaoDropSelect , {
                    class : {'ivu-form-item-error':this.classControl[params.index][key]},
                    props:{
                        width:140,
                        data:this.beans[key],
                        val:this.cloneData[params.index][key],
                        name:key+params.index,
                        onSelected:(d)=>{
                            this.cloneData[params.index][key] = d.value;

                            if (key === 'orgId') {
                                this.cloneData[params.index].orgName = d.node.fullName;
                            }
                            
                            if (required) this.classControl[params.index][key] = false;
                        }
                    },
                })


    }




export default renderSelect;
