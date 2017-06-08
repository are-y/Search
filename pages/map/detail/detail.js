// pages/map/info-project/info-project.js
import * as  projectUtil from "../../../js/project";
import * as  frameUtil  from "../../../js/frame";
import * as global from "../../../js/global";
Page({
  data: {
    indicatorDots:false,
    project: {},
    startPoint: null,
    outState: false,
    nextPage: {
      page: 1,
      hasNext: false,
    }
  },
  onLoad: function (options) {
    var that = this;

    ///数据由缓存获得的，缓存在项目米系详情页面存储
    var project = wx.getStorageSync('map.project.detail');
    var imgUrl=global.ctx+'commons/files/';
    project.imgUrl=imgUrl;
    if(project.fileIDs.length>1){
      that.setData({
        indicatorDots:true
      });
    }
    that.setData({
      project: project
    });


  },
  queryPartcipant: function (e) {

    var that = this;
    var companyID = e.target.dataset.id;
    var companyName = e.target.dataset.name;
    if (companyName != '' && companyName != undefined) {

      wx.navigateTo({
        url: 'participant/participant?organizationID=' + companyID + '&companyName=' + companyName + '&projectID=' + that.data.project.projectID,
      });
    }

  },

  viewDoc: function (e) {
    var that = this;
    wx.navigateTo({
      url: 'doc/doc?projectID=' + that.data.project.projectID + '&stageCode=' + that.data.project.stageCode
    });
  },
})