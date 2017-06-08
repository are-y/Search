// pages/project/projectWho/projectWho.js
Page({
  data:{
    whoInfo:[
      {"id":"1","userName":"刘德华","userTel":"15887869875","userPost":"行政总监","userEmail":"5641975656@qq.com"},
      {"id":"1","userName":"刘德华","userTel":"15887869875","userPost":"行政总监","userEmail":"5641975656@qq.com"},
      {"id":"1","userName":"刘德华","userTel":"15887869875","userPost":"行政总监","userEmail":"5641975656@qq.com"},
      ]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  addWho:function(){
    wx.navigateTo({
      url: '../addWho/addWho',
    })
  },
  updateWho:function(){
      wx.navigateTo({
        url: '../updateWho/updateWho',
      })
  }
  
})