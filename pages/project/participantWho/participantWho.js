// pages/project/participantWho/participantWho.js
import * as project from "../../../js/project";
import * as global from "../../../js/global";
Page({
    data: {
        whoInfo:null,
        projectID: '',
        organizationID: '',
        staffsList:'',
        keyword:'',
        scrollHeight:''

    },
    onLoad: function (options) {
        var that=this;
        that.setData({ 
            projectID: options.projectID,
            organizationID: options.organizationID,
            organizationType:options.organizationType
        });
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                that.setData({
                    scrollHeight: res.windowHeight-48
                });
            }
        });
        that.queryWhoData();
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        var that=this;
        that.setData({
            inputVal: "",
            keyword:""
        });
        that.queryWhoData();
    },
    inputTyping: function (e) {
        var that=this;
            that.setData({
                keyword:e.detail.value,
                inputVal: e.detail.value
            });
            that.queryWhoData();
        
    },
     //根据公司ID和参与机构类型查询没有参与的公司人员
    queryWhoData:function(){
          var that=this;
          project.queryStaffsAll({
            data: {
                "projectID": that.data.projectID,
                "corporationID": global.ywUser.corporationID,
                "organizationType":that.data.organizationType,
                "keyword":that.data.keyword
            },
            success: function (res) {
                console.log(res);
                if (res.data.data) {
                    that.setData({
                        staffsList: res.data.data
                    });
                } else {
                    console.log(res.data.info);
                }
            }
        })
    },
    //选择某个员工事件
    formStaffInfo:function(e){
        var anme=e.currentTarget.class;
        console.log(e.currentTarget.id)
        console.log(typeof e.currentTarget.id)

        var staffInfo = JSON.parse(e.currentTarget.id);
    
        wx.setStorageSync('staffInfo', staffInfo);
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
        
    }
})