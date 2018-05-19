<style lang="less">
    @import "../src/styles/fontIcon.css";
    .container{
        padding: 10px 40px;
        nav.index_menu {
            margin-bottom: 40px;

            ul { display: flex; flex-wrap: wrap; }
            li { display: inline-block; }
            li + li { border-left: solid 1px #bbb; padding-left: 10px; margin-left: 10px; }

            .v-link-active { color: #bbb; }
        }
    }

</style>

<template>
    <div class="container">
        <nav class="index_menu">
            <ul>
                <li><router-link to="/test">test</router-link></li>
                <li><router-link to="/table">table</router-link></li>
                <li><router-link to="/dropSelect">dropSelect</router-link></li>
                <li><router-link to="/tableList">tableList</router-link></li>
                <li><router-link to="/elementTable2">elementTable2</router-link></li>
                <li><router-link to="/vuedraggable">vuedraggable</router-link></li>
                <li><router-link to="/selectAndSortableTool">selectAndSortableTool</router-link></li>
                <li><router-link to="/art-dialog">art-dialog</router-link></li>
                <li><router-link to="/headImg">headImg</router-link></li>
                <li><router-link to="/feedback">feedback</router-link></li>
            </ul>
        </nav>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data: function() {
            return {

            }
        },
        mounted: function() {

        },
        beforeDestroy: function() {

        },
        methods: {

        }
    }
</script>
