// pages/project/updateWho/updateWho.js
import * as  project from "../../../js/project";
Page({
  data: {
    participantID: '',
    participantInfo: null,
    projectID: null,
    position: '',
    isUpdate:false
  },
  //查询单个参与者
  queryParticipantById: function () {
    var that = this;
    project.getParticipantById({
      data: {
        "participantID": that.data.participantID,
      },
      success: function (res) {
        if (res.data.code) {
          that.setData({ participantInfo: res.data.data });
          that.setData({ participantID: res.data.data.participantID });
        } else {
          console.log(res.data.info);
        }
      }
    })
  },
  //修改参与者岗位
  updatePosition: function () {
    var that = this;
    var fef = that.data.positions;
    let isUpdate=that.data.isUpdate;
    if(isUpdate){
        return;
    }
    that.setData({
        isUpdate:true
    });
    project.updateParticipantById({
      data: {
        "projectID": that.data.projectID,
        "position": that.data.position,
        "participantID": that.data.participantID
      },
      success: function (res) {
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
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({ participantID: options.participantID });
    this.queryParticipantById();
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
  updateWhoSubmit: function (e) {
    var that = this;
    if (!e.detail.value.position) {
      wx.showToast({ //成功弹出框
        title: '请输入参与者的岗位',
        icon: 'success',
        duration: 1500
      });
    } else {
      that.setData({ projectID: wx.getStorageSync('projectID') });
      var position = e.detail.value.position;
      that.setData({ position: position });
      that.updatePosition();
    }
  }
})