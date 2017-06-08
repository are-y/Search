// pages/uPass/uPass.js
//获取应用实例
import * as global from "../../js/global";
import * as frame from "../../js/frame";
var app = getApp();
Page({
  data: {
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false
  },

  onLoad: function (options) {
    var that = this;
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
  formPassSubmit: function (e) {
    var pwd = e.detail.value.pwd;
    var newPwd = e.detail.value.newPwd;
    var confirmPwd = e.detail.value.confirmPwd;
    let lengths=confirmPwd.length;
    if (newPwd == confirmPwd) {
      if(confirmPwd.length<6){
         wx.showToast({//成功弹出框
            title: '密码长度为6位及以上！',
            icon: 'success',
            duration: 3000
          });
          return;
      }
      frame.userPwd({
        data: {
          pwd: pwd,
          newPwd: newPwd,
        },
        success:function(res){
          let code=res.data.code;
          if (code == "0000") {
            wx.redirectTo({
              url: '../login/login',
              success: function (res) {
                // success成功时，清空缓存token
                wx.removeStorageSync("shAuthority ");
                wx.showToast({//成功弹出框
                  title: '密码修改成功,需重新登录！',
                  icon: 'success',
                  duration: 3000
                });
              }
            })
          }else if(code == "9994"){
             wx.showToast({//成功弹出框
              title: '原密码错误',
              icon: 'success',
              duration: 2000
            });
          }
        },
        fail:function(f){
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '新密码和确认密码不一致',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      return;
    }
  }
})