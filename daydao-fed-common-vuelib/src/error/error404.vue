<template>
    <div>
        <div class="bg-404">
            <div class="d-img">
            </div>
            <div class="container">
                <div class="error_des">您要找的页面已飞升上仙！<a href="javascript:history.go(-1)">返回上页</a>
                    <!--<div class="go_des">5秒之后返回首页...</div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .bg-404 {
        width: 100%;
        background: #fff;
        text-align: center;
    }

    .d-img {
        position: relative;
        min-height: 467px;
        background-image: url(//static.daydao.com/static/common/html/error/images/404.png);
        background-position: center center;
        background-repeat: no-repeat;
        margin-top: 56px;
        padding: 0 0 0 0;
        width: auto;
        height: auto;
    }

    .container {
        height: 44px;
        margin: 0 auto;
        text-align: center;
    }

    .error_des {
        padding: 60px 0;
        list-style: none;
        font-size: 30px;
        color: #000;
        position: relative;
    }

    .go_des{
        position: absolute;
        text-align: center;
        width: 100%;
        font-size: 15px;
        top: -6px;
    }

    a {
        display: inline-block;
        width: 152px;
        height: 44px;
        margin-left: 36px;
        background-color: #656B88;
        color: #fff;
        line-height: 44px;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        outline: none;
    }

    a:hover {
        text-decoration: none;
        cursor: pointer;
        outline: none;
    }

    @media (max-width:768px) {
        .bg-404 {
            width: 100%;
            background: #fff;
            text-align: center;
        }
        .d-img {
            position: relative;
            min-height: 467px;
            margin-top: 0px;
            background-image: url(//static.daydao.com/static/common/html/error/images/404m.png);
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 90% 90%;
            width: auto;
            height: auto;
        }
        .container {
            height: 44px;
            margin: 0 auto;
            text-align: center;
        }
        .error_des {
            padding: 0px;
            margin-top: -30px;
            list-style: none;
            font-size: 18px;
            color: #656B88;
            position: relative;
        }
        .go_des{
            top: -39px;
        }
        a {
            display: inline-block;
            width: 152px;
            height: 44px;
            background-color: #656B88;
            color: #fff;
            margin-top: 20px;
            line-height: 44px;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
            outline: none;
        }
        a:hover {
            text-decoration: none;
            cursor: pointer;
            outline: none;
        }
    }
</style>
<script>
    export default {
        name: 'bar',
        data () {
            return {

            }
        }
        ,created:function () {
            var t = this;
            gMain.components.commonHeader.handleShowLeftMenu(false); // 不显示左侧菜单
        }
    }

</script>
