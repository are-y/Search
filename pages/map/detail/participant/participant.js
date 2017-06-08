// pages/map/info-details/doc/doc.js
import * as  projectUtil from "../../../../js/project";
Page({
  data: {
    participant: {},
    companyName: ''

  },
  onLoad: function (options) {

    var that = this;
    var organizationID = options.organizationID;
    that.setData({
      companyName: options.companyName
    });
    var projectID = options.projectID;

    projectUtil.queryParticipantAll({
      //获取项目某单位的参与者
      // data :{ "projectID": 'fnQM5L0shvVzxpnDFGy', "organizationID": 'otka7y1kOj6qfUBLVqi'},
      data: { "projectID": projectID, "organizationID": organizationID },
      success: function (res) {
        if (res.data.code == "0000") {
          that.setData({
            participant: res.data.data

          });
      
        } else {
          console.log(res.data.info);
        }

      }
    });

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
  }
})