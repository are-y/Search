var app = getApp();
import * as global from "../../../js/global";
import * as projectUtil from "../../../js/project";
import * as pageState from "../pageState";
Page({
    data: {
        isLoad: false,
        projects: [],
        inputVal: '',
        projectName:'',
        inputShowed: false,
        totalCount: 0,
        nextPage: {
            hasNext: true,
            page: 1
        },
        isInsert: false,
        //用于滑动位置定位
        toView: 'element0',
        scrollTop: 100,
        scrollHeight: null
    },
    govCode: '',

    onLoad: function (e) {
        var that = this;
        wx.getSystemInfo({
          success: function(res) {
            that.setData({
              scrollHeight: res.windowHeight- 42,
            })
          },
        })
        that.setData({
            flag: e.flag
        });

        var districts = global.geographyInfo.districts;
        var district = districts.length == undefined ? districts : districts[1];

        //加载获取历史项目
        var pageState = wx.getStorageSync('map.pageState');

        var cacheData = wx.getStorageSync('map.projects');

        if (cacheData != null && cacheData != '' && cacheData != undefined) { //第一次加载
            that.onLoadCache();
        } else {
            that.govCode = district.govCode;

            that.projectHistory();////根据govCode以及range=2查询最近浏览项目记录列表
        }
    },
    onShow: function () {
        pageState.setPageType(1);
    },
    onLoadCache: function (e) {
        var that = this;
        var cacheData = wx.getStorageSync('map.projects');
        that.setData({
            toView: cacheData.selectID,
            nextPage: cacheData.page,
            projects: cacheData.data,
            inputVal: cacheData.inputVal,
            projectName: cacheData.inputVal,
            totalCount: cacheData.totalCount,
            isLoad: true
        });
        that.loadImage();
    },

    showInput: function (e) {
        //显示输入框
        this.setData({
            inputShowed: true
        });
    },

    hideInput: function (e) {
        //隐藏输入框
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function (e) {
        var that = this;
        //清空输入框
        console.log("clear")
        var projectList = wx.getStorageSync('map.project.historyList');
        this.setData({
            inputVal:'',
            projectName: '',
            projects: projectList.list,
            nextPage: projectList.page,
            totalCount: projectList.totalCount,
            toView: 'element0',
        });
        that.loadImage();
    },
    inputTyping: function (e) {
        //输入信息时 //查询相关项目列表
        var that = this;
        var projectName = e.detail.value
        console.log("输入值：" + projectName);
        that.setData({
            totalCount: 0,
            inputVal: projectName,
            nextPage: {
                hasNext: true,
                page: 1
            }
        })
        if (projectName != "") {
            that.setData({
                projects: []
            });
            that.projectSearch();
        }
        else {
            that.clearInput();
        }
    },

    selecteProject: function (e) {
        // 选择项目
        var that = this;

        var projectID = e.currentTarget.dataset.value;
        var selectID = e.currentTarget.id;

        // 保存列表数据到缓存，并记录选择的列表下标
        wx.setStorageSync('map.projects', { inputVal: that.data.inputVal, selectID: selectID, data: that.data.projects, page: that.data.nextPage, totalCount: that.data.totalCount });

        //以下两个数据用于详细界面

        pageState.navigate(3);
        pageState.back();

        wx.setStorageSync('map.search.projectID', projectID);

        projectUtil.projectCheck({
            data: {
                historyType: 1,
                projectID: projectID,
                govCode: that.govCode,
                flag: null
            },
            success: function (res) {
                if (res.data.code == "0000") {
                    console.log("insert");
                    that.setData({
                        isInsert: true,
                        nextPage: {
                            hasNext: true,
                            page: 1
                        }
                    });
                    that.projectHistory();
                } else {
                    console.log(res.data.info);
                }
            }
        });
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
    pullUpLoad: function (e) {
        var that = this;
        if (that.data.nextPage.hasNext) {
            if (that.data.inputVal == '') {
                that.projectHistory();
            } else {
                that.projectSearch();
            }
        }
    },
    projectSearch: function () {
        var that = this;
        if (!isEpmty(that.govCode)) {
            projectUtil.projectPage({
                data: {
                    govCode: that.govCode,
                    projectName: that.data.inputVal,
                    flag: that.data.flag,
                    page: that.data.nextPage.page,
                    limit: 15,
                    range: 1
                },
                success: function (res) {
                    if (res.data.code == "0000") {
                        if (res.data.data != null) {
                            if (that.data.nextPage.hasNext) {
                                var list = res.data.data.items;
                                list = that.data.projects.concat(list);
                                that.setData({
                                    totalCount: res.data.data.totalCount,
                                    projects: list,
                                    nextPage: {
                                        hasNext: res.data.data.hasNextPage,
                                        page: res.data.data.nextPage
                                    },
                                    toView: 'element0',
                                });
                                that.loadImage();
                            }
                        }
                    } else {
                        console.log(res.data.info);
                    }
                }
            });
        }
    },

    projectHistory: function () {
        var that = this;
        if (!isEpmty(that.govCode)) {
            projectUtil.projectPage({
                data: {
                    govCode: that.govCode,
                    range: 2,
                    flag: that.data.flag,
                    page: that.data.nextPage.page,
                    limit: 15
                },
                success: function (res) {
                    if (res.data.code == "0000") {
                        if (res.data.data != null) {
                            if (that.data.nextPage.hasNext) {
                                var list = res.data.data.items;
                                if (!that.data.isInsert) list = that.data.projects.concat(list);
                                that.setData({
                                    totalCount: res.data.data.totalCount,
                                    projects: list,
                                    nextPage: {
                                        hasNext: res.data.data.hasNextPage,
                                        page: res.data.data.nextPage
                                    },
                                    isLoad: true
                                });
                            }
                            wx.setStorageSync('map.project.historyList', { list: that.data.projects, page: that.data.nextPage, totalCount: that.data.totalCount });
                            that.loadImage();

                        }
                    } else {
                        console.log(res.data.info);
                    }

                }

            });
        }
    }

});

function isEpmty(param) {
    if (param == null || param == undefined || param == 'undefined' || param == '') {
        return true;
    }
    return false;
}