// pages/installCenter/installCenter.js
//获取应用实例
var app = getApp();
import * as frame  from "../../js/frame";
import * as global from "../../js/global";

Page({
  data: {
    nickName: '紫牛',
    pageParameter: {},
    avatarUrl: ''
  },
  onLoad: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    //从缓存中获取头像
    if( global.shAuthority.avatarUrl){
      that.setData({
        avatarUrl: global.shAuthority.avatarUrl,
        nickName: global.ywUser.name,
      });
    }
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    //从缓存中获取头像
    if( global.shAuthority.avatarUrl){
      this.setData({
        avatarUrl: global.shAuthority.avatarUrl,
        nickName: global.ywUser.name,
      });
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  /*setPhotoInfo: function () {//修改用户头像
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({ imgUrl: tempFilePaths });
        wx.getStorage({
          key: 'wxUser',
          success: function (res) {
            console.log(res.data)
          }
        })
      },
      fail: function () {
        { imgUrl: null };
      }
    })
  },*/
  //退出系统；清空数据缓存
  listenerStorageSynClear: function () {
    var that = this;
    wx.navigateTo({
      url: '../login/login',
      success: function (res) {
        // success
        var data = {};
        frame.logout(data, function (res) {
          if (res.data.code = "0000") {
            console.log("退出系统成功！");
            // success成功时，清空缓存shAuthority
            wx.removeStorageSync("shAuthority");
          }
        });
        wx.showToast({//成功弹出框
          title: '系统退出成功',
          icon: 'success',
          duration: 2000
        });
      },
    })
  }
})