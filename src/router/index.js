import Vue from 'vue'
import App from '../App.vue'


var routes = [{
        path: '/',
        component: App, //顶层路由，对应index.html
        meta: {
            title: 'dayhr'
        },
        redirect: "/person_list", //默认跳转到在职员工列表
        children: [{
                path: 'org_list',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/children/org_list.vue'));
                    }, 'org_list');
                },
                meta: {
                    title: "组织维护",
                    keepAlive: true
                }
            }, {
                path: 'job_list',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/children/job_list.vue'));
                    }, 'job_list');
                },
                meta: {
                    title: "职务维护",
                    keepAlive: true
                }
            }
            //员工列表---在职员工
            , {
                path: 'person_list',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/children/person_list.vue'));
                    }, 'person_list');
                },
                meta: {
                    title: "在职员工",
                    keepAlive: true
                }
            }
            //员工列表---离职员工
            , {
                path: 'person_out_list',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/children/person_out_list.vue'));
                    }, 'person_out_list');
                },
                meta: {
                    title: "离职员工"
                }
            }
            //员工列表---未激活员工
            , {
                path: 'person_inactive_list',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/children/person_inactive_list.vue'));
                    }, 'person_inactive_list');
                },
                meta: {
                    title: "未激活员工"
                }
            }
            //员工列表---未来入职员工
            , {
                path: 'person_getin_before',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/children/person_getin_before.vue'));
                    }, 'person_getin_before');
                },
                meta: {
                    title: "待入职员工"
                }
            }
            //新增员工
            , {
                path: "person_add",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require("pages/org/children/person_add.vue"));
                    }, "person_add");
                },
                meta: {
                    title: "新增员工"
                }
            },
            //职务详情
            {
                path: "/job_list_detail/:infoSetId/:id/:jobName/:uuid",
                name: "job_list_detail",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/job_list_detail.vue'));
                    }, 'job_list_detail');
                }
            },
            //组织详情
            {
                path: "/org_list_detail/:infoSetId/:id/:orgName/:uuid",
                name: "org_list_detail",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/org_list_detail.vue'));
                    }, 'org_list_detail');
                }
            },

            // 职位详情
            {
                path: "/pos_list_detial/:infoSetId/:id/:posName/:uuid",
                name: "pos_list_detail",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/pos_list_detail.vue'));
                    }, "pos_list_detail");
                }
            },
            // 员工详情
            {
                path: '/person_detail/:id/:infoSetId',
                name: 'person_detail',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require('pages/org/children/person_detail.vue'));
                    }, 'personDetail')
                },
                meta: {
                    title: "员工详情"
                }
            },

            //批量操作
            {

                path: "batch",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require("pages/org/children/batch/batch.vue"));
                    }, "batch");
                },
                children: [{
                        path: "choose/:origin",
                        component: function (resolve) {
                            require.ensure([], function () {
                                resolve(require("pages/org/children/batch/choose.vue"));
                            }, "choose");
                        },
                    },
                    {
                        path: "probation",
                        component: function (resolve) {
                            require.ensure([], function () {
                                resolve(require("pages/org/children/batch/probation.vue"));
                            }, "batch");
                        },
                        meta: {
                            title: "批量转正"
                        }
                    },
                    {
                        path: "tranfer",
                        component: function (resolve) {
                            require.ensure([], function () {
                                resolve(require("pages/org/children/batch/tranfer.vue"));
                            }, "batch_tranfer");
                        },
                        meta: {
                            title: "批量调整"
                        }
                    },
                    {
                        path: "resign",
                        component: function (resolve) {
                            require.ensure([], function () {
                                resolve(require("pages/org/children/batch/resign.vue"));
                            }, "batch_resign");
                        },
                        meta: {
                            title: "批量离职"
                        }
                    },
                    {
                        path: "rehire",
                        component: function (resolve) {
                            require.ensure([], function () {
                                resolve(require("pages/org/children/batch/rehire.vue"));
                            }, "batch_rehire");
                        },
                        meta: {
                            title: "批量重新入职"
                        }
                    },
                    {
                        path: 'delete',
                        component: function (resolve) {
                            require.ensure([], function () {
                                resolve(require("pages/org/children/batch/delete.vue"));
                            }, "batch_delete");
                        },
                        meta: {
                            title: "批量删除"
                        }
                    }
                ]

            },
            //组织结构图
            {
                path: 'org_chart',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require("pages/org/children/org_chart.vue"));
                    }, "org_chart");
                },
                meta: {
                    title: "组织架构图"
                }
            },
            //汇报关系图
            {
                path: "report_chart",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require("pages/org/children/report_chart.vue"));
                    }, "report_chart");
                },
                meta: {
                    title: "员工汇报图"
                }
            },
            {
                path: "/pos_list",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require("pages/org/children/pos_list.vue"));
                    }, "pos_list");
                },
                meta: {
                    title: "职位维护"
                }
            },
            {
                path: "/job_relation_chart",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require("pages/org/children/job_relation_chart.vue"));
                    });
                },
                meta: {
                    title: "职务体系图"
                }
            },
            /**
             * 导入Excel
             * @infoSetId 页面的信息集ID
             * @importMode 导入模式，single：单行（有步骤的），mul：多行
             * */
            {
                path: "importData/:infoSetId/:importMode",
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require("commonVueLib/importData/importData.vue"));
                    }, "importData");
                },
                meta: {
                    title: "导入数据"
                }
            },
            //测试页面
             {
                path: 'testPersonSelect',
                component: function (resolve) {
                    require.ensure([], function () {
                        resolve(require("pages/org/testPersonSelect.vue"));
                    }, "testPersonSelect");
                },
                meta: {
                    title: "testPersonSelect"
                }
            },
        ]
    },
    //完善员工信息
    {
        path: "/person_complete/:personId/:infoSetId",
        name: 'person_complete',
        component: function (resolve) {
            require.ensure([], function () {
                resolve(require("pages/org/children/person_complete.vue"));
            }, "person_complete");
        },
        meta: {
            title: "完善员工信息"
        }
    },

    {
        path: '*',
        component: function (resolve) {
            require.ensure([], function () {
                resolve(require('commonVueLib/error/error404.vue')); //引入公共组件中的404页面
            }, 'error404');
        },
        meta: {
            title: "error404"
        }
    }

]


export default routes;
