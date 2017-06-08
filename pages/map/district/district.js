import * as  projectUtil from "../../../js/project";
import * as frame from "../../../js/frame";
import * as global from "../../../js/global";
import * as pageState from "../pageState";
var app = getApp();
Page({
    data: {
        districts: [],
        history: {},
        nextPage: {
            hasNext: true,
            page: 1
        },
        totalCount: 0,
        inputVal: '',
        govName:'',
        inputShowed: true,
        scrollHeight: null,
        isRefresh: false,
    },

    onLoad: function () {
        var that = this;

        wx.getSystemInfo({
          success: function(res) {
            that.setData({
              scrollHeight: res.windowHeight-42
            });
          },
        })


        this.districtHistrit();
    },

    // 选择行政区划
    selectDistrict: function (e) {

        var that = this;

        // 设置地图页面行政区划
        var district = e.target.dataset.data;
        global.geographyInfo.districts = district;

        pageState.navigate(1);
        pageState.back();

        projectUtil.projectCheck({
            data: {
                historyType: 2,
                projectID: district.govID
            },
            success: function (res) {
                if (res.data.code == "0000") {
                    console.log("insert");
                    that.districtHistrit();
                } else {
                    console.log(res.data.info);
                }

            }
        });
        wx.navigateBack();
    },
    //显示输入框
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    //隐藏输入框
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    //清空输入框
    clearInput: function () {
        console.log("clear");
        this.setData({
            inputVal: "",
            govName:'',
            districts: [],
            nextPage: {
                hasNext: true,
                page: 1
            }
        });
    },
    //输入信息时
    inputTyping: function (e) {
        var that = this;
        var govName = e.detail.value
        this.setData({
            totalCount: 0,
            inputVal: govName,
            nextPage: {
                hasNext: true,
                page: 1
            }

        });
        //用户输入时做一个查询，并且显示出来
        if (govName != "") {
            that.setData({
                districts: []
            });
            that.districtsSearch();
        } else {
            that.clearInput();
        }
    },
    pullUpLoad: function () {
        var that = this;
        if (that.data.nextPage.hasNext) {
            that.districtsSearch();
        }
    },
    districtsSearch: function () {
        var that = this;
        frame.districtsSearch({
            data: {
                range: 1,
                govName: that.data.inputVal,
                page: that.data.nextPage.page,
                limit: 15
            },
            success: function (res) {
                if (res.data.code == "0000") {
                    if (res.data.data != null) {
                        if (that.data.nextPage.hasNext) {
                            var districts = res.data.data.items;
                            if (districts.length > 0) {
                                districts = that.data.districts.concat(districts);
                                that.setData({
                                    totalCount: res.data.data.totalCount,
                                    districts: districts,
                                    nextPage: {
                                        hasNext: res.data.data.hasNextPage,
                                        page: res.data.data.nextPage
                                    }
                                });
                            }
                        }
                    }

                } else {
                    console.log(res.data.info);
                }
            }
        });
    },


    districtHistrit: function () {

        var that = this;
        //查询历史记录
        frame.districtsSearch({
            data: {
                range: 2,
                page: that.data.nextPage.page,
                limit: 9
            },
            success: function (res) {
                if (res.data.code == "0000") {
                    //获取历史数据成功
                    if (res.data.data != null) {
                        var history = res.data.data.items;
                        that.setData({
                            history: history
                        });
                    }
                } else {
                    console.log(res.data.info);
                }

            }
        });
    }

})
