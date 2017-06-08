
import * as global from "../../js/global";
import * as frame from "../../js/frame";


Page({
  data: {

  },

  onLoad: function (option) {
    var that = this;

    // 未登录时
    if (global.shAuthority.loginID == '' || global.shAuthority.token == '') {
      wx.redirectTo({
        url: '../longin/longin',
      })
    } else {
      that.accountInfo();
    }
  },

  //获取账户信息
  accountInfo: function () {
    let that = this;
    frame.accountInfo({
      data: {},
      success: function (res) {
        if (res.data.code == '0000') {

          global.setYwUser(res.data.data);           //将设置全局变量ywUser

          global.shAuthority.token = global.ywUser.token;

          if (res.data.data.logoBase64) {
            global.shAuthority.avatarUrl = global.ywUser.logoBase64;
          }
          global.saveShAuthority();

          if (global.ywUser) {
            wx.redirectTo({
              url: '../login/login',
            });
          }


          // that.setData({
          //   menu: global.ywUser.menu,
          //   hidden: true,
          //   avatarUrl: global.shAuthority.avatarUrl,
          //   nickName: global.ywUser.name,
          //   corporationName: global.ywUser.corporationName
          // });
        }
        else {
          wx.redirectTo({
            url: '../login/login'
          });
          return;
        }
      }

    });
  }

});

