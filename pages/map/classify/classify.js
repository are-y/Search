var app = getApp();
import * as projectUtil from "../../../js/project";
import * as global from "../../../js/global";
import * as  pageState from  "../pageState";
Page({
    data: {
        projects: [],
        district: null,
        projectType: {},
        isRefresh: false,
        nextPage: {
            page: 1,
            hasNext: true,
        },

        //用于设置滑动定位
        isLoad: false,
        relevant: 0,
        toView: 'element0',
        scrollTop: 100,
        scrollHeight: null,
        flag: null

    },


    onLoad: function (options) {
        var that = this;
        var districts = global.geographyInfo.districts;
        var district = districts.length == undefined ? districts : districts[1];

        var projectTypeCode = options.typeCode;//工程分类编号
        var projectTypeName = options.typeName;

        that.setData({
            district: district,
            flag: options.flag,
            scrollHeight: global.phoneInfo.windowHeight,
            projectType: {
                code: projectTypeCode,
                name: projectTypeName
            }
        });

        var pageState = wx.getStorageSync('map.pageState');
        var cacheData = wx.getStorageSync('map.project.classifyList');
        if (cacheData == null || cacheData == undefined || cacheData == '') {
            //第一次加载
            that.getProjectList();
            that.loadImage();
        } else {
            that.setData({
                projects: cacheData.data, //项目列表
                toView: cacheData.selectID,
                isLoad: true
            });
            that.loadImage();
        }

    },
    onShow: function () {
        pageState.setPageType(1);
    },
    selecteProject: function (e) {
        var that = this;
        //获取选择项目ID
        var projectID = e.currentTarget.dataset.value;
        var selectID = e.currentTarget.id;

        wx.setStorageSync('map.search.projectID', projectID);

        projectUtil.projectCheck({
            data: {
                historyType: 1,
                projectID: projectID,
                govCode: that.data.district.govCode,
                flag: null
            },
            success: function (res) {
                if (res.data.code == "0000") {
                    wx.removeStorageSync('map.projects');
                    console.log("insert");
                }
                else console.log(res.data.info);

            }
        });

        //设置项列表缓存
        wx.setStorageSync('map.project.classifyList', { "selectID": selectID, "data": this.data.projects });

        pageState.navigate(2);
        pageState.back();

        wx.navigateBack();
    },
    loadImage: function () {
        let projects = this.data.projects;
        for (var i = 0; i < projects.length; i++) {
            if (!projects[i].isload) {
                if (!projects[i].profilePhoto) {
                    projects[i].imgUrl = "../../../resources/images/moren.jpg";
                } else {
                    projects[i].imgUrl = projectUtil.getImageUrl({ url: projects[i].profilePhoto });
                }
                projects[i].isload = true;
            }
        }
        this.setData({
            projects: projects
        })

    },
    pullUpLoad: function () {
        var that = this;
        if (that.data.nextPage.hasNext) {
            that.getProjectList();
        }
    },
    pullDownLoad: function () {
        var that = this;
        that.setData({
            isRefresh: true
        })
        projectUtil.projectPage({
            data: {
                govCode: that.data.district.govCode,
                projectTypeCode: that.data.projectType.code,
                flag: that.data.flag,
                page: 1,
                limit: 15
            },
            success: function (res) {
                if (res.data.code == "0000") {
                    if (res.data.data != null) {
                        var projects = res.data.data.items; //项目列表
                        setTimeout(function () {
                            that.setData({
                                isRefresh: false,
                                projects: projects,
                                nextPage: {
                                    hasNext: res.data.data.hasNextPage,
                                    page: res.data.data.nextPage
                                },
                                isLoad: true
                            });
                            that.loadImage();
                        }, 1000);
                    }
                } else {
                    console.log(res.data.info);
                }
            }
        });
    },
    getProjectList: function (res) {
        var that = this;

        projectUtil.projectPage({
            data: {
                govCode: that.data.district.govCode,
                projectTypeCode: that.data.projectType.code,
                flag: that.data.flag,
                page: that.data.nextPage.page,
                limit: 15
            },
            success: function (res) {
                if (res.data.code == "0000") {
                    if (res.data.data != null) {
                        if (that.data.nextPage.hasNext) {
                            var projects = res.data.data.items; //项目列表
                            projects = that.data.projects.concat(projects);
                            that.setData({
                                projects: projects,
                                nextPage: {
                                    hasNext: res.data.data.hasNextPage,
                                    page: res.data.data.nextPage
                                },
                                isLoad: true
                            });

                            that.loadImage();
                        }
                    }


                } else {
                    console.log(res.data.info);
                }

            }
        });
    },
})