// pages/project/addWho/addWho.js
import * as  project from "../../../js/project";
import * as global from "../../../js/global";
Page({
  data: {
    projectID: null,
    organizationID: '',
    organizationType: '',
    staffID: '',
    name: '',
    mobile: '',
    email: '',
    position: '',
    isAdd:false,
    ywUser:null
  },
  onLoad: function (options) {
    var that = this;
    var staffInfo = wx.getStorageSync('staffInfo');
    wx.setStorageSync('addWhoOptions', options);
    if (staffInfo) {
      that.setData({ 
        name: staffInfo.name, 
        staffID: staffInfo.staffID, 
        mobile: staffInfo.mobile, 
        email: staffInfo.email,
        ywUser: global.ywUser
      });
      var sdf = staffInfo.email;
      wx.removeStorageSync('staffInfo');
    }
    if (options) {
      that.setData({ projectID: options.projectID });
      that.setData({ organizationID: options.organizationID });
      that.setData({ organizationType: options.organizationType });
      var organizationID = that.data.organizationID;
      var projectId = that.data.projectID;
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    if (!wx.getStorageSync('addWhoOptions')) {
      this.onLoad();
    } else {
      wx.removeStorageSync('addWhoOptions');
    }

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  addWhoSubmit: function (e) {
    var that = this;
    if(!that.data.staffID){
       wx.showToast({ //成功弹出框
          title: '请选择参与者',
          icon: 'success',
          duration: 3000
        });
    }else if(!e.detail.value.position){
       wx.showToast({ //成功弹出框
          title: '请输入参与者的岗位',
          icon: 'success',
          duration: 1500
        });
    }else{
      that.setData({
        position: e.detail.value.position
      });
      that.addWho();
    }
    
  },
  //添加参与者
  addWho: function () {
    var that = this;
    let isAdd=that.data.isAdd;
    if(isAdd){
        return;
    }
    that.setData({
      isAdd:true
    });
    project.addParticipant({
      data: {
        "staffID": that.data.staffID,
        "organizationType":that.data.organizationType,
        "projectID": wx.getStorageSync('projectID'),
        "organizationID": global.ywUser.organizationID,
        "position": that.data.position,
        "corporationID":global.ywUser.corporationID
      },
      success: function (res) {
        console.log(res);
        if (res.data.code) {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        } else {
          console.log(res.data.info);
        }
      }
    })
  },
})