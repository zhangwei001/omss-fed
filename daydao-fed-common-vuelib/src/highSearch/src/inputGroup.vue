<template>
    <div class="input-group clearfix">
        <template v-for="(item , index) in newSearchCondition">
            <!-- 关键词 -->
            <div v-if="item.isDefault=='1'" class="input-control">
                <label class="name" for="">关键词：</label>
                <Input class="hs-input-text" v-model.trim="modelList[index]" @input="keywordChange"></Input>
            </div>

            <!-- type: text -->
            <div v-else-if="item.conditionStyle==='text' && item.isDefault!='1'" class="input-control">
                <label class="name" for="">{{item.conditionContent}}：</label>
                <Input class="hs-input-text" v-model.trim="modelList[index]"></Input>
            </div>


            <!-- type: date -->
            <div v-else-if="item.conditionStyle && item.conditionStyle.indexOf('date') != -1" class="input-control">
                <label class="name" for="">{{item.conditionContent}}：</label>
                <Date-picker class="hs-datePicker hs-input-text" :type="item.dateType" placement="bottom-end" v-model="modelList[index]"></Date-picker>
            </div>


            <!-- type: checkbox -->
            <div v-else-if="item.conditionStyle==='checkbox'" class="input-control">
                <label class="name" for="">{{item.conditionContent}}：</label>

                <Checkbox-group v-model="modelCheckbox[index]" class="hs-checkbox-group">
                    <Checkbox v-for="(checkboxs , i) in item.checkboxList" :label="checkboxs" :key="'checkbox'+item.uuid+i"></Checkbox>
                </Checkbox-group>
            </div>

            <!-- type：radio -->
            <div v-else-if="item.conditionStyle==='radio'" class="input-control">
                <label class="name" for="">{{item.conditionContent}}：</label>
                <Radio-group v-model="modelList[index]">
                    <Radio v-for="(radios , j) in item.radioList" :label="radios" :key="'radios'+item.uuid+j"></Radio>
                </Radio-group>
            </div>

            <!-- type: switch -->
            <div v-else-if="item.conditionStyle==='switch'" class="input-control">
                <label class="name" for="">{{item.conditionContent}}：</label>
                <i-switch v-model="modelSwitch[index]"></i-switch>
            </div>

            <!-- type: treeSelect -->
            <div v-else-if="item.conditionStyle==='treeSelect'" class="input-control">
                <label for="">{{item.conditionContent}}：</label>
                <tree-select :id="'hs-treeSelect'+index" :keyValueBean="item.keyValueBean" v-model="modelList[index]"></tree-select>
            </div>

            <!-- type: treeMultipleSelect -->
            <div v-else-if="item.conditionStyle==='treeMultipleSelect'" class="input-control">
                <label class="name" for="">{{item.conditionContent}}：</label>
                <tree-multiple-select :keyValueBean="item.keyValueBean" :id="'hs-treeMultipleSelect'+index" class="hs-input-text" v-model="modelList[index]"></tree-multiple-select>
            </div>

            <div v-else-if="item.conditionStyle==='number_interval'" class="input-control">
                <label class="name" for="">{{item.conditionContent}}：</label>
                <numberRange v-model="modelList[index]"></numberRange>
            </div>

            

        </template>

    </div>
</template>

<script>
    import treeSelect from './treeSelect.vue'
    import treeMultipleSelect from './treeMultipleSelect.vue'
    import numberRange from './numberRange.vue'
    import { mapResult, checkDateType, filterType ,dateFormat} from './util.js'
    import utils from '../../utils/index'


    export default {
        data() {
            return {
                // init searchCondition
                newSearchCondition: [],

                //v-model
                modelList: [],
                modelCheckbox: [],
                modelSwitch: [],

            }
        },
        props: {
            searchCondition: {
                type: Array,
                default() {
                    return [];
                },
            },
            value: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        computed: {
            moduleId() {
                let moduleId = this.$route.path + '-hs-' + gMain.oUser.dd;
                return moduleId;
            }
        },
        components: { treeSelect, treeMultipleSelect ,numberRange },
        created() {
            for (let i = 0; i < 30; i++) {
                this.modelList.push("");
                this.modelCheckbox.push([]);
                this.modelSwitch.push(false);
            }
        },
        watch: {
            searchCondition: function (val, old) {
                // sort searchCondition
                let texts = filterType(val, ["text", "treeMultipleSelect", "treeSelect"]),
                    dates = filterType(val, ["date" , "date_interval" , "datetime" , "date_yyyy_MM_dd_HH_mm" , "date_yyyy_MM_dd_HH" , "date_yyyy_MM" , "date_yyyy"]),
                    numberRange = filterType(val, ["number_interval"]),
                    checkboxs = filterType(val, ["checkbox"]),
                    radios = filterType(val, ["radio"]),
                    switchs = filterType(val, ["switch"]);
                this.newSearchCondition = texts.concat(dates, numberRange ,checkboxs, radios, switchs);

                this.newSearchCondition.forEach((item, index) => {
                    if (item.conditionStyle === 'checkbox') {
                        item['checkboxList'] = item.conditionDisplay.split('|');
                    }
                    if (item.conditionStyle === 'radio') {
                        item['radioList'] = item.conditionDisplay.split('|');
                    }
                    if (item.conditionStyle && item.conditionStyle.indexOf("date") != -1) {
                        let date = checkDateType(item.conditionStyle);
                        item['dateType'] = date.dateType;
                        item['format'] = date.format;
                    }
                })


                this.defaultDataHandler();

            }
        },
        methods: {
            // init default date
            defaultDataHandler() {
                this.newSearchCondition.forEach((item, index) => {

                    var defaultValue = item.defaultValue,
                        conditionStyle = item.conditionStyle;


                    if (conditionStyle === 'text' && defaultValue) {
                        this.modelList[index] = defaultValue;
                    }
                    else if (conditionStyle === 'treeMultipleSelect' && defaultValue) {
                        var label = mapResult(defaultValue.replace(/\'/g, "").split(','), this.newSearchCondition[index].conditionValue, this.newSearchCondition[index].conditionDisplay, false);
                        this.modelList[index] = {
                            'ids': defaultValue.split(','),
                            'label': label.split(','),
                        }
                    }
                    else if (conditionStyle === 'treeSelect' && defaultValue) {
                        this.modelList[index] = {
                            'conditionValue': defaultValue
                        }
                    }
                    else if (conditionStyle === 'switch' && defaultValue) {
                        this.modelSwitch[index] = defaultValue == "1" ? true : false;
                    }
                    else if (conditionStyle === 'checkbox' && defaultValue) {
                        var conditionValue = this.newSearchCondition[index].conditionValue.split('|');
                        var defaultValue = defaultValue.replace(/\'|\"/g, "").split(",");
                        defaultValue.forEach(val => {
                            let i = conditionValue.indexOf(val);
                            this.modelCheckbox[index].push(this.newSearchCondition[index]['checkboxList'][i]);
                        })
                    }
                    else if (conditionStyle === 'radio' && defaultValue) {
                        this.modelList[index] = defaultValue;
                    }

                    /*
                    * date handler
                    * check date type , init date
                    */
                    if (conditionStyle && conditionStyle.indexOf("date") != -1 && conditionStyle!== 'date_interval') {
                        var defaultDate = "";
                        if (defaultValue) {
                            if (defaultValue == "current") {
                                defaultDate = new Date();

                            } else if (defaultValue.indexOf("current-") != -1 || defaultValue.indexOf("current+") != -1) {
                                var oDate = new Date();
                                var str = defaultValue;
                                var sOperation = str.substr(7, 1); //计算类型 是 “+” 还是 “-”
                                str = str.substr(8);
                                var iNum = str.match(/\d+/)[0]; //数字
                                var iUnit = str.match(/[a-zA-Z]+/)[0]; //单位
                                if (iUnit == "d") {
                                    if (sOperation == "+") {
                                        oDate.setDate(oDate.getDate() + parseInt(iNum));
                                    } else if (sOperation == "-") {
                                        oDate.setDate(oDate.getDate() - parseInt(iNum));
                                    }
                                }

                                defaultDate = oDate;
                            } else {
                                defaultDate = new Date(defaultValue);
                            }
                        }
                        this.modelList[index] = defaultDate;

                    }


                })


            },
            /*
            * searchHandler
            * handle searchConditionList
            **/
            searchHandler() {
                //store the search condition
                let searchConditionList = [];

                this.newSearchCondition.forEach((item, index) => {

                    //define the necessary data;
                    var result = {
                            conditionId : item.conditionId,
                            flag : index,
                            name : item.conditionContent
                        },
                        conditionDisplay = item.conditionDisplay,
                        conditionStyle = item.conditionStyle,
                        conditionValue = item.conditionValue;

                    if (conditionStyle === 'date_interval') {
                        if (this.modelList[index][0]) {
                            let date = this.modelList[index].map(d=>dateFormat(d, "yyyy-MM-dd"));
                            date = date.join(",")
                            result['conditionValue'] = date
                            searchConditionList.push(result);
                        }
                    }

                    else if(conditionStyle === 'number_interval'){
                        if (/^(\d+)\,(\d+)$/.test(this.modelList[index])) {
                            result['conditionValue'] = this.modelList[index];
                            searchConditionList.push(result);
                        }
                    }

                    else if (this.modelList[index] || this.modelCheckbox[index].length > 0 || conditionStyle === "switch") {
                        // checkbox
                        if (conditionStyle === 'checkbox') {
                            result['conditionValue'] = mapResult(this.modelCheckbox[index], conditionDisplay, conditionValue);/^[\d+]\,[\d+]$/
                            result['label'] = this.modelCheckbox[index].join(',');
                        }
                        // treeMultipleSelect
                        else if (conditionStyle === 'treeMultipleSelect') {
                            result['label'] = this.modelList[index].label.join(",");
                            result['conditionValue'] = this.modelList[index].ids.join(",");
                        }
                        // treeSelect
                        else if (conditionStyle === 'treeSelect') {
                            result['label'] = this.modelList[index].label;
                            result['conditionValue'] = this.modelList[index].conditionValue;
                        }
                        //date
                        else if (conditionStyle && conditionStyle.indexOf("date") != -1) {
                            let date = '';
                            if(this.modelList[index]){
                                date = dateFormat(this.modelList[index] , item.format);
                            }
                            result['conditionValue'] = date
                        }
                        //switch
                        else if (conditionStyle === 'switch') {
                            var conditionDisplay = "";
                            if (this.modelSwitch[index]) {
                                conditionDisplay = item.conditionDisplay.split("|")[0];
                            } else {
                                conditionDisplay = item.conditionDisplay.split("|")[1];
                            }
                            result['conditionValue'] = this.modelSwitch[index] ? "1" : "0";
                            result['label'] = item.conditionContent + ":" + conditionDisplay;
                            result['conditionStyle'] = 'switch';
                        }

                        //other
                        else {
                            result['conditionValue'] = this.modelList[index];
                        }

                        searchConditionList.push(result);
                    }
                })
                return searchConditionList;
            },
            keywordChange() {
                this.$emit("keywordBind", this.modelList[0]);
            },
            removeBadage(flag) {
                this.modelList.splice(flag, 1, "");
                this.modelCheckbox.splice(flag, 1, []);
                this.modelSwitch.splice(flag, 1, false);
            },
            resetData() {
                this.newSearchCondition.forEach((item, index) => {
                    this.modelList.splice(index, index + 1, "");
                    this.modelCheckbox.splice(index, index + 1, []);
                    this.modelSwitch.splice(index, index + 1, false);
                })
            }
        }
    }

</script>






<style lang="scss">
    .highSearch {
        .separation{
            color : #d2d2d2;
        }
        .input-control {
            float: left;
            margin-bottom: 14px;
            margin-right: 10px;
            min-width: 295px;
            height: 32px;
        }
        .input-control label.name,
        .checkbox-group span {
            min-width: 88px;
            height: 32px;
            line-height: 32px;
            text-align: right;
            display: inline-block;
            font-size: 12px;
        }
        .input-control .hs-input-text {
            width: 212px;
            font-size: 12px;
        }
        .checkbox-group,
        .checkbox-group li {
            float: left;
        }
        .input-control .checkbox-control,
        .checkbox-group li label {
            width: auto;
        }
        .input-control .hs-checkbox-group,
        .input-control .hs-datePicker {
            display: inline-block;
        }
    }
</style>
