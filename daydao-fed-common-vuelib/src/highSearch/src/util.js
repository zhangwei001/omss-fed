/*
* @params target : "'11','1A'"
* @params str1   : "10|11|1A|20|21|22|2A|30|31|32|33"
* @params str2   : "在岗|正常在岗|其他在岗|非在岗|待岗|长期休假|其他在册|调出|离职|退休|死亡"
* @isisAddQuotes : is add ''
*
* return  {String}  正常在岗,其他在岗
*/
function mapResult(target, str1, str2, isAddQuotes) {
    let strArr1 = str1.split("|");
    let strArr2 = str2.split("|");
    let result = [];

    target.forEach(item => {
        let i = strArr1.indexOf(item);
        var str;
        if (isAddQuotes === false) {
            str = strArr2[i];
        } else {
            str = "'" + strArr2[i] + "'";
        }
        result.push(str);
    })
    var str = result.join(",");

    return str;
};


/*
* check dateType
* return {forat:"" , dateType:""}
*/
function checkDateType(sDateType) {
    var format = "",
        dateType = "";

    switch (sDateType) {
        case "datetime":
            format = "yyyy-MM-dd HH:mm:ss"
            dateType = "datetime"
            break
        case "date_worktime":
            format = "H:mm"
            dateType = ""
            break
        case "date_yyyy_MM_dd_HH_mm":
            format = "yyyy-MM-dd HH:mm"
            dateType = "datetime"
            break
        case "date_yyyy_MM_dd_HH":
            format = "yyyy-MM-dd HH"
            dateType = "datetime"
            break
        case "date_yyyy_MM":
            format = "yyyy-MM";
            dateType = "month"
            break
        case "date_yyyy":
            format = "yyyy"
            dateType = "year"
            break
        case "date_interval":
            format = "yyyy-MM-dd"
            dateType = "daterange"
            break
        default:
            format= "yyyy-MM-dd"
            dateType= "date"
    }

    let result = {
        'format': format,
        'dateType': dateType
    }

    return result
}


function dateFormat(date, format) {
    if (format === undefined) {
        format = date;
        date = new Date();
    }
    var map = {
        "M": date.getMonth() + 1,//月份
        "d": date.getDate(),//日
        "h": date.getHours(),//小时
        "m": date.getMinutes(),//分
        "s": date.getSeconds(),//秒
        "q": Math.floor((date.getMonth() + 3) / 3),//季度
        "S": date.getMilliseconds()//毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}

function filterType(arr, typeArr) {
    var result = arr.filter(item => {
        var conditionStyle = item.conditionStyle;
        if (Array.isArray(typeArr)) {
            return typeArr.indexOf(conditionStyle) != -1
        } else {
            return conditionStyle.indexOf(typeArr) != -1
        }
    })
    return result
}

export { mapResult, checkDateType, dateFormat, filterType }
