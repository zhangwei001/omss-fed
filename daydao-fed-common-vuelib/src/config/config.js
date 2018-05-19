/**
 * dayhr公共配置文件，create by Zackey
 * */

/**
 * 合作项目信息的配置
 * */
window.oDayhrConfig = {
    oCooperationData:{
        "hk-yun":{
            "logoUrl":"common/images/cooperation/"
            ,"comName":"华中科技云平台"
            ,"copyRight":"广东华中科技大学工业技术研究院"
        }
    }
};

//跟以前的header.jsp中做过度兼容处理
window.gMain = $.extend((typeof gMain === "undefined"?{}:gMain),{
    basePath:"/"  //基础路径
    ,projectSource:""  //项目类型
    ,regExps:{
        "person_name":/^(?!\d+$)[\dA-Za-z\u2E80-\uFE4F]{1,20}$/  //姓名
        ,"cell_phone":/^(1[3-9][0-9])\d{8}$|\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/  //手机号
        ,"tel":/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/  //电话号码
        ,"email":/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/  //邮件
        ,"digits":/^\d+$/   //数字
        ,"letters":/^[a-z]+$/i  //字母
        ,"date":/^\d{4}-\d{2}-\d{2}$/  //日期，格式:yyyy-mm-dd
        ,"time":/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/  //时间，00:00到23:59之间
        ,"url":/^(https?|s?ftp):\/\/\S+$/i  //网址
        ,"qq":/^[1-9]\d{4,}$/  //QQ号
        ,"IDcard":/^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/  //身份证号码
        ,"zipcode":/^\d{6}$/  //编码格式
        ,"chinese":/^[\u0391-\uFFE5]+$/  //中文字符
    }
    /**
     * 公共的域名配置，注意：域名后面要跟上“/”
     * */
    ,DayHRDomains:{
        baseStaticDomain:location.protocol + "//static.daydao.com/"  //静态资源服务器域名
        ,greyStaticDomain:location.protocol + "//static-grey.daydao.com/"  //静态资源灰度服务器域名
        ,baseNoCdnDomain:location.protocol + "//static1.daydao.com/"  //version.js等不需要做CDN的静态资源
        ,passportDomain:"https://login.daydao.com/"   //登录域名
        ,accountDomain:"https://account.daydao.com/"    //注册、用户中心域名
        ,sMoneyDomain:"https://pay.daydao.com/"  //支付中心域名
        ,sMobileDomain:location.protocol + "//mobileadmin.daydao.com/"  //移动后台域名
        ,sMDomain:location.protocol + "//mobile.daydao.com/"  //移动app域名
        ,sCloudDomain:"https://oa.daydao.com/"  //day盘域名
        ,sWorkflowDomain:"https://workflow.daydao.com/"  //dayoa工作流
        ,sDayhrDomain:"https://hr.daydao.com/"  //dayhr
        ,sStoreDomain:"https://store.daydao.com/"  //应用市场的域名
        ,sOpenDomain:"https://admin.daydao.com/"  //天枢平台的域名
        ,sCanyinDomain:location.protocol + "//canyin.daydao.com/oms/"  //餐饮平台的域名
        ,sOmssDomain:location.protocol + "//om.daydao.com/"  //om运营支撑管理平台
        ,sJianZhuDomain:location.protocol + "//jianzhu.daydao.com/"  //day建筑的域名
        ,sUplogsDomain:"https://uplogs.daydao.com/"  //uplogs平台的域名
        ,sExtraDomain:"https://extra.daydao.com/"  //omss对外公开的服务
        ,sEduYoungDomain:"https://edu-young.daydao.com/"  //青葱季域名
        ,sEvaDomain:"https://eva.daydao.com/"  //测评项目域名
        ,sDeveloperDomain:"https://developer.daydao.com/"  //开阳平台域名
    }
    ,jsdir:"static" //默认静态资源目录
    ,imgPath: location.protocol + "//static.daydao.com/" //上传非腾讯云文件的文件服务器的域名前缀
    ,components:{}

    // ,sessionScope:{
    //     "refereeLogoUrl":""  //合作logo相关
    //     ,"refereeWeb":""
    // }
    // ,sSessionId:""
    // ,sDdh:""
    // ,userType:""
    // ,corpId:""
    // ,channel:""  //根据这个判断是否需要跳转到腾讯云的兑换码界面
});

gMain.logoUrl = gMain.basePath + "home.html" //点击logo的


/**
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * */


/**
 * 获取url参数
 * url: /index.php?a=1&b=2
 * 调用方式  tools.getUrlParam("a");
 * @name url参数名称
 * */
gMain.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null){return unescape(r[2]);}else{return null;}
};

//如果有灰度的标识，就把静态资源的目录指向到灰度的目录
var daydaoGreyCookieValue = jQuery.cookie("greyApp"); //灰度cookie值
if(daydaoGreyCookieValue && daydaoGreyCookieValue != '""' && daydaoGreyCookieValue != "''"){
    gMain.DayHRDomains.baseStaticDomain = gMain.DayHRDomains.greyStaticDomain;  //静态资源服务器域名
    gMain.DayHRDomains.baseNoCdnDomain = gMain.DayHRDomains.greyStaticDomain; //非CDN静态资源服务器域名
}

//如果是调试模式
if(gMain.getUrlParam("jsdebug") === "true"){
    gMain.jsdir = "static_src";
}


//增量路径配置
gMain.baseStaticPath = gMain.DayHRDomains.baseStaticDomain + gMain.jsdir+"/";  //静态资源基础路径，最后带了斜杠
gMain.currentStaticPath = gMain.basePath + gMain.jsdir+"/";  //当前tomcat的静态资路径
gMain.commonStaticDirectory = gMain.DayHRDomains.baseStaticDomain + gMain.jsdir+"/common";  //公共组件目录，最后没带斜杠

/**
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * +++++++++++++++++++++++  seajs配置信息  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
var daydaoGreyCookieValue = jQuery.cookie("greyApp"); //灰度cookie值
seajs.config({
    charset: 'utf-8'
    //公共路径
    ,paths:{
        "commonStaticDirectory":gMain.DayHRDomains.baseStaticDomain + gMain.jsdir+"/common",  //最后没带斜杠
        "staticDirectory":gMain.DayHRDomains.baseStaticDomain + gMain.jsdir  //静态资源目录，后面没带斜杠
    }
});
