
import * as global from "../../js/global";
import * as projectUtil from "../../js/project";
import * as frame from "../../js/frame";
import * as pageState from "pageState";

var app = getApp();
Page({
  data: {
    projectTypeList: [],
    map: {},
    mapScale:8,
    markers: [],
    flag: null,
    details: {
    },//页面最下方数据集
    mapLoad: true,
    startPoint: null,
    searchProject: '项目搜索',
    district: {},
    mapHeight: 0,
    scrollHeight: 500,
    mapType: 0,//数据集模板的状态码
    controls: []

  },

  curPoint: {},//用于接收鼠标坐标
  onLoad: function (options) {
    var that = this;
    that.setData({
      flag: options.flag
    });
    pageState.init();
    that.getprojectTypeList();

    wx.setStorageSync('map.search.word', ''); //查询项目名称
    wx.setStorageSync('map.projectList', null);//项目列表缓存
    wx.setStorageSync('map.project.classifyList', null);//分类项目列表缓存
    that.toStat();
  },
  onShow: function () {
    var that = this;

    if (pageState.isBusinessBack()) {
      //逻辑上的跳转，需要操作
      switch (pageState.getSourceType()) {
        case 1: {// 根据行政区划，查询分类统计
          that.toStat();
          break;
        }
        case 2: { //根据分类列表返回的projectD，查询项目详情
          that.find();
          break;
        }
        case 3: { //根据查询项目列表返回的projectD,查询项目详情
          that.find();
          break;
        }
      }
    }
    else {
      if (pageState.getPageType() == 1) {

        that.setData({
          searchProject: ""
        });
        that.toStat();
      }
    }
    pageState.setPageType(0);
  },
  onHide: function () {
    pageState.setBusinessBackFalse();
  },
  onUnload: function () {

    wx.removeStorageSync('map.search.word');
    wx.removeStorageSync('map.projectList');
    wx.removeStorageSync('map.project.classifyList');
    wx.removeStorageSync('map.projects');
    wx.removeStorageSync('map.project.historyList');
    wx.removeStorageSync('map.project.detail');
    wx.removeStorageSync('map.pageState');
  },
  toStat: function () {
    var that = this;
    wx.showToast({ title: '正在加载', icon: 'loading', duration: 60000 });
    var districts = global.geographyInfo.districts;
    var district = districts.length == undefined ? districts : districts[1];
    var govCode = district.govCode;//获取城市编号
    global.geographyInfo.districts = district;
    wx.removeStorageSync('map.projects');
    wx.removeStorageSync('map.project.historyList');
    //根据govCode进行分类查询，并返回数据集
    //静态页面以昆明为例
    if (govCode != undefined && govCode != '') {

      projectUtil.getStats({

        //获取项目分类统计列表
        data: {
          govCode: govCode,
          flag: that.data.flag
        },
        success: function (res) {
          if (res.data.code == "0000") {
            if (res.data.data != null) {
              var count = 0;
              var classifyData = res.data.data;
              that.data.projectTypeList.forEach(function (e, index, arr) {
                e.count = 0;
                classifyData.forEach(function (item) {
                  if (item.projectTypeCode == e.code) {
                    count += item.count;
                    e.count = item.count;
                    return;
                  }
                });

              });
              that.setData({
                district: district,
                map: {
                  latitude: global.geographyInfo.latitude,
                  longitude: global.geographyInfo.longitude
                },
                details: {
                  rowCount: count,
                  classifyData: that.data.projectTypeList,
                  statListState: false,
                },
                controls: [{
                  id: 1,
                  position: {
                    left: (global.phoneInfo.windowWidth / 2) - 12,
                    top: global.phoneInfo.windowHeight - 41,
                    width: 24,
                    height: 12
                  },
                  iconPath: "/resources/images/up.png",
                  clickable: true
                }],
                mapType: 0,
                statListState: false,
                searchProject: "项目搜索",
              });
              wx.setStorageSync('map.classifyList', that.data.details);
            }
          } else {
            console.log(res.data.info);
          }
          wx.hideToast();
        }
      });
    }
  },
  toBackMap: function () {
    var that = this;
    that.setData({
      details: wx.getStorageSync('map.classifyList'),
      mapType: 0,
      statListState: false,
      searchProject: "项目搜索"
    })
  },

  getprojectTypeList: function (e) {
    //获取项目分类参数表
    var that = this;
    frame.getParamType({
      data: {
        paramType: "projectType"
      },
      success: function (res) {
        if (res.data.code = "0000") {
          that.setData({
            projectTypeList: res.data.data
          });
        } else {
          console.log(res.data.info);
        }
      }
    })

  },

  selecteClassify: function (e) {
    //选择分类项目列表
    var that = this;
    //缓存一份列表信息
    var typeCode = e.currentTarget.dataset.code;//获取项目类型编号
    var typeName = e.currentTarget.dataset.name;
    var typeCount = e.currentTarget.dataset.count;
    wx.removeStorageSync('map.project.classifyList');
    if (typeCount != 0) {
      wx.navigateTo({
        url: 'classify/classify?typeCode=' + typeCode + "&typeName=" + typeName + '&flag=' + that.data.flag
      });
    }

  },
  find: function (e) {
    //项目详情(米系)展示
    var that = this;
    var projectID = wx.getStorageSync('map.search.projectID');
    wx.showToast({ title: '正在加载', icon: 'loading', duration: 60000 });
    projectUtil.getByProjectId({
      data: {
        "projectID": projectID
      },
      success: function (res) {

        if (res.data.code == "0000") {
          var project = res.data.data;
          if (project != null) {
            frame.getParamType({
              data: {
                paramType: "stage",
                code: project.stageCode
              },
              success: function (res) {
                if (res.data.code == "0000") {
                  var stageName = res.data.data.label;
                  that.setData({
                    'details.stageName': stageName
                  });
                  wx.setStorageSync('map.project.detail', that.data.details);
                } else {
                  console.log(res.data.info);
                }

              }
            });
            var geography = {
              latitude: project.latitude == "" ? global.geographyInfo.latitude : project.latitude,
              longitude: project.longitude == "" ? global.geographyInfo.longitude : project.longitude,
              districts: {
                govCode: project.govCode,
                govName: project.govName
              }
            }
            global.geographyInfo = geography
            that.setData({
              map: {
                latitude: geography.latitude,
                longitude: geography.longitude,
                markers: [{
                  latitude: geography.latitude,
                  longitude: geography.longitude,
                  iconPath: '/resources/images/location.png'
                }]
              },
              district: {
                govCode: project.govCode,
                govName: project.govName
              },
              controls: [{
                id: 1,
                position: {
                  left: (global.phoneInfo.windowWidth / 2) - 12,
                  top: global.phoneInfo.windowHeight - 155,
                  width: 24,
                  height: 12
                },
                iconPath: "/resources/images/up.png",
                clickable: true
              }],
              statListState: true,
              details: project,
              searchProject: project.projectName,
              mapType: 1,
              mapScale:12
            });
            wx.hideToast();
          }

        } else {
          console.log(res.data.info);
        }

      }, fail: function (res) {
        console.log("请求失败！");
      }

    });

  },

  backTOList: function (e) {
    ///返回列表
    var that = this;
    pageState.setBusinessBackFalse();
    if (pageState.getSourceType() == 2) {
      wx.navigateTo({
        url: 'classify/classify'
      });
    } else if (pageState.getSourceType() == 3) {
      wx.navigateTo({
        url: 'search/search'
      });
    }

  },

  backToDetail: function () {
    this.setData({
      statListState: true,
      mapType: 1
    });
  },

  clickDistrict: function () {
    // 点击行政区划
    var that = this;
    that.setData({
      statListState: false
    });
    wx.navigateTo({ url: '/pages/map/district/district' });
  },


  clickSearch: function (e) {
    // 点击查询条件
    var that = this;
    wx.navigateTo({ url: '/pages/map/search/search?flag=' + that.data.flag });
  },

  touchStat: function (e) {
    // 开始拖动统计信息
    this.setData({ startPoint: [e.touches[0].pageX, e.touches[0].pageY] });
  },


  moveStat: function (e) {
    // 拖动统计信息
    // if(this.data.detailPageState) return;

    this.curPoint = [e.touches[0].pageX, e.touches[0].pageY];
    // var startPoint = this.data.startPoint;

  },

  moveEnd: function (e) {
    var that = this;
    //结束拖动
    var curPoint = that.curPoint;
    var startPoint = that.data.startPoint;

    // 上移
    if (startPoint[1] - curPoint[1] > 20) {
      that.moveUp();
    }
    // 下移
    if (curPoint[1] - startPoint[1] > 10) {
      that.moveDown();
    }
  },
  moveUp: function () {
    if (this.data.mapType == 1) {
      wx.navigateTo({
        url: 'detail/detail'
      });
    } else {
      this.setData({
        statListState: true,
        mapHeight: 0,
        mapLoad: false,
        'details.statListState': true
      });
    }
  },
  moveDown: function () {
    this.setData({
      statListState: false,
      mapLoad: true,
      'details.statListState': false
    });
  }


});
