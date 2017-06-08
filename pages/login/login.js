//login.js
//获取应用实例
var app = getApp();

import * as global from "../../js/global";
import * as frame from "../../js/frame";

Page({
  data: {
    avatarUrl: ''
  },
  onLoad: function (option) {
    this.setData({
      avatarUrl: global.shAuthority.avatarUrl
    });
  },
  onShow: function () {
  },
  onReady: function () {
  },

  formSubmitLogin: function (e) {

    wx.showToast({ title: '正在登录', icon: 'loading', duration: 60000 });
    var that = this;

    var loginID = e.detail.value.loginID;
    var pwd = e.detail.value.pwd;


    frame.login({
      data:{
        loginID: loginID,
        pwd:pwd
      },
      success: function (res) {
        if (res.data.code == '0000') {

          global.setYwUser(res.data.data);           //将设置全局变量ywUser

          global.shAuthority.loginID = loginID;
          global.shAuthority.token = res.data.data.token;
          let action = res.data.data.menu.children[0].children[0].action;
          global.shAuthority.flag = action.split('=')[1];
          if (res.data.data.logoBase64) {
            global.shAuthority.avatarUrl = res.data.data.logoBase64;
          }
          //将名称存入缓存
          wx.setStorageSync('userCorporationName', { "nickName": res.data.data.name });
          // 保存认证信息
          global.saveShAuthority();

          wx.hideToast();

          // wx.setStorageSync('isLoginNavigate', 1);

          if (global.ywUser) {
            wx.switchTab({
              url: '../index/index',
            });
          }
          // 跳转到首页

        } else {

          wx.showToast({
            title: '登录失败,账户和密码不匹配',
            icon: 'success',
            duration: 2000
          });
        }
      }
    })
  }
   
});
