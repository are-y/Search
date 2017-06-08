// pages/project/projectContentMap/projectContentMap.js
Page({
  data: {
    longitude:0,
    latitude:0,
    windowHeight:0,
    controlsWidth:0,
    controlsHeight:0,
    controls: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    
    wx.getSystemInfo({
      success: function(res) {

        that.setData({
          windowHeight:res.windowHeight-44,
        });
        var controlsWidth=res.windowWidth/2-24;
        var controlsHeight = (res.windowHeight-44 )/2-48;
        var controls=[{
          id: 1,
          iconPath: '../../../resources/images/location.png',
          position: {
            left:controlsWidth,
            top:controlsHeight,
            width: 48,
            height: 48
          },
          clickable: true
        }];
        that.setData({
          controls:controls
        });
      }
    })
    this.setData({
      longitude:options.longitude,
      latitude:options.latitude,
      // "markers.longitude":options.longitude,
      // "markers.latitude":options.latitude
    });
  },
  onReady: function () {
    // 页面渲染完成
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap');
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
  regionchange(e) {
    var that = this;
    if (e.type == "end") {
      this.mapCtx.getCenterLocation({
        success: function (res) {
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
          });
        }
      })
    }
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  //确认修改坐标
  affirmUpdate: function () {
    var that = this;
    var locationUpdate = { "longitude": that.data.longitude, "latitude": that.data.latitude };
    wx.setStorageSync('locationUpdate', locationUpdate);
    wx.navigateBack();
  }
})