//index.js
//获取应用实例
var app = getApp();

import * as global from "../../js/global";
import * as frame from "../../js/frame";


Page({
  data: {
    city: '',                   //当前定位的行政区划
    avatarUrl: '',
    menu: '',                   //系统菜单
    nickName: '',               //显示的用户名
    corporationName: '',        //公司名称
    hidden: false
  },

  onLoad: function (option) {
    let that = this;
    let ywUser = global.ywUser;

    if (ywUser) {
      that.setData({
        menu: global.ywUser.menu,
        hidden: true,
        avatarUrl: global.shAuthority.avatarUrl,
        nickName: global.ywUser.name,
        corporationName: global.ywUser.corporationName
      });
    }

    // let isLoginNavigate = wx.getStorageSync('isLoginNavigate');

    // if (isLoginNavigate == 1) {
    //   wx.removeStorageSync('isLoginNavigate');
    //   if (ywUser) {
    //     that.setData({
    //       menu: global.ywUser.menu,
    //       hidden: true,
    //       avatarUrl: global.shAuthority.avatarUrl,
    //       nickName: global.ywUser.name,
    //       corporationName: global.ywUser.corporationName
    //     });
    //   } else {
    //     that.accountInfo();// 获取账户信息
    //   }
    // }
    // else {

    //   // 获取账户信息
    //   that.accountInfo();

    // }

    // 获取定位信息
    if (frame.locateStatus == 1) {
      frame.setCbGetlocation(res => {
        var district = res.districts.length == undefined ? res.districts : res.districts[1];
        that.setData({
          city: district.govName
        });
      });
    }
    else {           // 已定位
      var district = global.geographyInfo.districts.length == undefined ? global.geographyInfo.districts : global.geographyInfo.districts[1];
      that.setData({
        city: district.govName
      });
    }
  },

  onShow: function () {

  },
  onHide: function () {
  },
  onUnload: function () {
  },

  // 点击模块
  clickModule: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.action
    })
  },
});

