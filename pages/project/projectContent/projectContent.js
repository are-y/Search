var app = getApp();
import * as frame from "../../../js/frame";
import * as project from "../../../js/project";
import * as global from "../../../js/global";
Page({
  data: {
    project: null,    //项目对象
    projectID: null,
    organizationID: null,
    organizationType: null,  //机构类型
    ataffList: null,
    participantID: '',

    participantIDUp: '',
    participantIDDown: '',

    scrollHeight: 0,
    hidden: false,
    index: 0,
    stageName: '',
    stageCode: '',
    isUpdate: false,
    isDelete: false,
    isMove: false,
    organizationTypeList: null,  //公司参与的机构类型集合
    ataffListArray: null,        //根据机构类型查询参与者

  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    if (options) {
      wx.setStorageSync('projectOptions', options);
      wx.setStorageSync('projectID', options.id);
    }
    var organizationID = global.ywUser.organizationID;
    wx.setStorageSync('organizationID', organizationID);
    that.setData({ projectID: wx.getStorageSync('projectID') });
    that.setData({ organizationID: organizationID });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 46
        })
      },
    })


    //查询系统参数
    var arrayParameter = ["stage", "progressStatus", "investmentStatus", "qualityStatus", "securityStatus"];
    for (var i = 0; i < arrayParameter.length; i++) {
      that.getSystemParameter(arrayParameter[i]);
    }
    //查询单个项目信息
    that.datas();

    //根据projectID和organizationID查询项目所有参与者
    //that.participantAll();
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    var stageType = this.data.stageType;
  },
  onShow: function () {
    let that = this;
    // 生命周期函数--监听页面显示
    if (!wx.getStorageSync('projectOptions')) {
      //根据projectID和organizationID查询项目所有参与者
      this.participantAll();

    } else {
      wx.removeStorageSync('projectOptions');
    }
    this.setData({
      hidden: true
    });
    //更新坐标
    let locationUpdate = wx.getStorageSync("locationUpdate");
    if (locationUpdate) {
      wx.removeStorageSync("locationUpdate");
      that.setData({
        "project.longitude": locationUpdate.longitude,
        "project.latitude": locationUpdate.latitude
      });

    }


    //this.datas();
  },

  //查询单个项目信息
  datas: function () {
    var that = this;
    project.getByProjectId({
      data: {
        "projectID": that.data.projectID,

      },
      success: function (res) {
        console.log(res);
        if (res.data.data) {
          that.setData({
            project: res.data.data,
            stageCode: res.data.data.stageCode
          });
          that.getOrganizationType(res.data.data);//查询机构类型
          that.participantAll();//查询参与者
          var stageType = that.data.stageType;
          if (stageType == null) {
            that.getSystemParameter("stage");
          }
          that.setData({
            stageName: stageType[res.data.data.stageCode - 1].label
          });


        } else {
          console.log(res.data.info);
        }
      }
    })
  },
  //查询所有参与者
  participantAll: function () {
    var that = this;
    let ataffListArray = new Array();
    let organizationTypeList = that.data.organizationTypeList;
    for (let i = 0; i < organizationTypeList.length; i++) {
      project.queryParticipantAll({
        data: {
          "projectID": that.data.projectID,
          "organizationID": that.data.organizationID,
          "organizationType": organizationTypeList[i].code
        },
        success: function (res) {
          if (res.data.code == "0000") {
            ataffListArray[i] = res.data.data;
            that.setData({
              ataffListArray: ataffListArray
            });
            console.log("that.data.ataffListArray:");
            console.log(that.data.ataffListArray);
          } else {
            that.setData({
              ataffList: res.data.data,
            });
            console.log(res.data.info);
          }
        }
      })
    }

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  //获取系统参数类型
  getSystemParameter: function (paramType) {
    var that = this;
    frame.getParamType({
      data: {
        paramType: paramType
      },
      success: function (res) {
        if (res.data.data) {
          if (paramType == "stage") {
            that.setData({
              stageType: res.data.data
            });
          }
          else if (paramType == "progressStatus") {
            that.setData({
              progressStatusType: res.data.data
            });
          }
          else if (paramType == "investmentStatus") {
            that.setData({
              investmentStatusType: res.data.data
            });
          }
          else if (paramType == "qualityStatus") {
            that.setData({
              qualityStatusType: res.data.data
            });
          }
          else {
            that.setData({
              securityStatusType: res.data.data
            });
          }
        } else {
          wx.showModal({ title: '提示', content: rst.data.info });
        }
      }
    })
  },
  //单击"项目阶段"事件函数
  stageOpenUp: function () {
    this.stageOpen();
  },
  stageOpen: function (e) {
    var that = this;
    var stageType = that.data.stageType;
    var num = e.detail.value;
    that.setData({
      "project.stageCode": stageType[num].code,
      stageName: stageType[stageType[num].code - 1].label
    })
  },
  //单击"进度情况"事件函数
  planOpen: function (e) {
    var that = this;
    var progressStatusType = that.data.progressStatusType;
    var num = e.detail.value;
    that.setData({
      "project.progressStatusName": progressStatusType[num].label,
      "project.progressStatusCode": progressStatusType[num].code,

    })
  },
  //单击"投资情况"事件函数
  investOpen: function (e) {
    var that = this;
    var investmentStatusType = that.data.investmentStatusType;
    var num = e.detail.value;
    that.setData({
      "project.investmentStatusName": investmentStatusType[num].label,
      "project.investmentStatusCode": investmentStatusType[num].code
    })
  },
  //单击"质量情况"事件函数
  qualityOpen: function (e) {
    var that = this;
    var qualityStatusType = that.data.qualityStatusType;
    var num = e.detail.value;
    that.setData({
      "project.qualityStatusName": qualityStatusType[num].label,
      "project.qualityStatusCode": qualityStatusType[num].code
    })
  },
  //单击"安全情况"事件函数
  safetyOpen: function (e) {
    var that = this;
    var securityStatusType = that.data.securityStatusType;
    var num = e.detail.value;
    that.setData({
      "project.securityStatusName": securityStatusType[num].label,
      "project.securityStatusCode": securityStatusType[num].code
    })
  },
  //添加参与者
  addWho: function (e) {
    var that = this;
    var participantID = e.currentTarget.id;
    var projectID = that.data.projectID;
    var organizationID = that.data.organizationID;
    var organizationType = e.target.dataset.code;
    wx.navigateTo({
      url: '../addWho/addWho?projectID=' + projectID + '&organizationType=' + organizationType,
    })
  },
  //修改参与者
  updateWho: function (e) {
    var that = this;
    var participantID = e.currentTarget.id;
    wx.navigateTo({
      url: '../updateWho/updateWho?participantID=' + participantID,

    })
  },
  //删除参与者
  delectParticipant: function () {
    var that = this;
    let isDelete = that.data.isDelete;
    if (isDelete) {
      return;
    }
    that.setData({
      isDelete: true
    })
    project.delParticipantById({
      data: {
        "participantID": that.data.participantID,
        "projectID": that.data.projectID,
      },
      success: function (res) {
        if (res.data.code) {
          that.setData({
            isDelete: false
          });
          wx.showToast({//成功弹出框
            title: res.data.info,
            icon: 'success',
            duration: 2000
          });
          that.onShow();
        } else {
          console.log(res.data.info);
        }
      }
    })
  },
  delWho: function (e) {
    var participantID = e.currentTarget.id;
    this.setData({ participantID: participantID });
    this.delectParticipant();
  },
  //项目坐标
  proSite: function () {
    var that = this;
    var longitude = that.data.project.longitude;
    var latitude = that.data.project.latitude;
    if (longitude == null || latitude == null) {
      longitude = global.geographyInfo.longitude;
      latitude = global.geographyInfo.latitude;
    }
    wx.navigateTo({
      url: '../projectContentMap/projectContentMap?longitude=' + longitude + '&latitude=' + latitude,
    })

  },
  //保存项目事件
  projectSave: function () {
    var that = this;

    let isUpdate = that.data.isUpdate;
    if (isUpdate) {
      return;
    }
    that.setData({
      isUpdate: true
    });
    project.updateProjectId({
      data: {
        "project": that.data.project,
        "projectID": that.data.projectID,
        "longitude": that.data.project.longitude,
        "latitude": that.data.project.latitude,
        "locationType": '3'
      },
      success: function (res) {
        if (res.data.code == "0000") {
          wx.navigateBack({//返回上一页面
            delta: 1     //1表示返回的界面数
          });
        }
      },
      fail: function (res) {
        wx.showToast({//成功弹出框
          title: res.data.info,
          icon: 'success',
          duration: 1500
        });
      }
    });
  },
  participantRanks: function () {
    var that = this;
    let isMove = that.data.isMove;
    if (isMove) {
      return;
    }
    that.setData({
      isMove: true
    })
    project.participantRank({
      data: {
        "participantIDUp": that.data.participantIDUp,
        "participantIDDown": that.data.participantIDDown,
        "projectID": that.data.projectID,
        "organizationID": that.data.organizationID,
      },
      success: function (res) {
        if (res.data.code == "0000") {
          that.setData({
            isMove: false
          })
          console.log("移动成功！");
        }
      },
    });
  },
  //上移事件
  topWho: function (e) {
    let index = e.target.dataset.index - 1;
    let nums = e.target.dataset.nums;
    let ataffList = this.data.ataffListArray[nums];
    var that = this;
    if (index >= 0) {
      var participantIDUp = ataffList[index].participantID;
      var participantIDDown = ataffList[e.target.dataset.index].participantID;
      that.setData({
        participantIDUp: participantIDUp,
        participantIDDown: participantIDDown
      });
      that.participantRanks();
      that.participantAll();
    }
  },
  //下移事件
  bottomWho: function (e) {
    let ataffList = this.data.ataffList;
    let index = e.target.dataset.index + 1;
    var that = this;
    if (ataffList.length > index) {
      var participantIDUp = ataffList[index].participantID;
      var participantIDDown = ataffList[e.target.dataset.index].participantID;
      that.setData({
        participantIDUp: participantIDUp,
        participantIDDown: participantIDDown
      });
      that.participantRanks();
      that.participantAll();
    }
  },

  //判断公司在该项目中的机构类型
  getOrganizationType: function (project) {
    let organizationTypeList = new Array();
    let i = 0;
    let ywUserCorporationID = global.ywUser.corporationID;
    if (ywUserCorporationID == project.builderCompanyID) {
      organizationTypeList[i] = { "code": "1", "label": "建设单位" };
      i++;
    }
    if (ywUserCorporationID == project.userCompanyID) {
      organizationTypeList[i] = { "code": "2", "label": "使用单位" };
      i++;
    }
    if (ywUserCorporationID == project.evaluatorCompanyID) {
      organizationTypeList[i] = { "code": "3", "label": "造价单位" };
      i++;
    }
    if (ywUserCorporationID == project.supervisorCompanyID) {
      organizationTypeList[i] = { "code": "4", "label": "监理单位" };
      i++;
    }
    if (ywUserCorporationID == project.contractorCompanyID) {
      organizationTypeList[i] = { "code": "5", "label": "总包单位" };
      i++;
    }
    if (ywUserCorporationID == project.designerCompanyID) {
      organizationTypeList[i] = { "code": "6", "label": "设计单位" };
      i++;
    }
    if (ywUserCorporationID == project.constructionCompanyID) {
      organizationTypeList[i] = { "code": "7", "label": "施工单位" };
      i++;
    }
    if (ywUserCorporationID == project.materialSupplierID) {
      organizationTypeList[i] = { "code": "8", "label": "材料供应商" };
      i++;
    }
    if (ywUserCorporationID == project.deviceSupplierID) {
      organizationTypeList[i] = { "code": "9", "label": "设备供应商" };
      i++;
    }
    if (ywUserCorporationID == project.machineSupplierID) {
      organizationTypeList[i] = { "code": "10", "label": "机械租赁商" };
      i++;
    }
    if (ywUserCorporationID == project.reconnaissanceCompanyID) {
      organizationTypeList[i] = { "code": "11", "label": "勘察单位" };
      i++;
    }
    if (ywUserCorporationID == project.investmentCompanyID) {
      organizationTypeList[i] = { "code": "12", "label": "投资单位" };
      i++;
    }
    if (ywUserCorporationID == project.governmentDepartmentID) {
      organizationTypeList[i] = { "code": "13", "label": "政府协调机构" };
      i++;
    }
    this.setData({
      organizationTypeList: organizationTypeList
    });
  }

})