import * as projectUtil from "../../../../js/project";
import * as frame from "../../../../js/frame";
import * as global from "../../../../js/global";
import * as util from "../../../../js/util";
var app = getApp();
Page({
  data: {
    List: [],
    stages: [{ code: 0, label: "全部" }],
    sourcesType: [{ code: 0, label: "全部" }],
    scrollHeight: null,
    index: { stage: '0', source: '0' },
    searchData: {
      projectID: null,
      stageCode: null,
      typeCode: null,
    },
    nextPage: {
      page: 1,
      hasNext: true,
    },
    isRefresh: false
  },
  onLoad: function (options) {
    var that = this;

    var projectID = options.projectID;
    var stageCode = options.stageCode;

    that.setData({
      scrollHeight: global.phoneInfo.windowHeight - 34,
      searchData: {
        projectID: projectID,
        stageCode: stageCode
      }
    });
    if (projectID != null) {
      frame.getParamType({
        //获取资料类型列表
        data: {
          paramType: "sourceType"
        },
        success: function (res) {
          if (res.data.code == "0000") {

            var sources = res.data.data;
            sources.unshift({ code: '', label: '全部' });
            that.setData({
              sourcesType: sources
            });
          } else {
            console.log(res.data.info);
          }

        }
      });
      that.getStages({
        //获取项目阶段类型列表
        data: {
          code: ''
        },
        success: function (res) {
          if (res.data.code == "0000") {
            if (res.data.data != null) {
              var stages = res.data.data;
              stages.forEach(function (item, index) {
                if (item.code == stageCode) {
                  that.setData({
                    'index.stage': index.toString()
                  });
                }
              });
              that.setData({
                stages: stages
              })
            }
          } else {
            console.log(res.data.info);
          }

        }

      });
      that.getSourcesPage();
    }
  },

  getStages: function (param) {
    var that = this;
    frame.getParamType({
      //获取项目阶段类型列表
      data: {
        code: that.isEpmty(param.data.code),
        paramType: "stage"
      },
      success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
      fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
      complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
    });

  },
  getSourcesPage: function () {
    var that = this;
    projectUtil.sourcesPage({
      //请求项目资料
      data: {
        limit: 15,
        page: that.data.nextPage.page,
        projectId: that.data.searchData.projectID,
        infoType: that.isEpmty(that.data.searchData.typeCode),
        stageCode: that.isEpmty(that.data.searchData.stageCode)
      },
      success: function (res) {
        if (res.data.code == "0000") {
          if (res.data.data != null) {
            if (that.data.nextPage.hasNext) {
              var newDocList = that.groupByTime(res.data.data.items);
              var list = that.data.List;
              if (list.length != 0) {

                list.forEach(function (item, index, arr) {
                  console.log(index);
                  newDocList.forEach(function (e, value, a) {
                    if (item.time == e.time) {
                      item.docList = item.docList.concat(e.docList);
                      a.baoremove(value);
                    }
                  });
                });
                newDocList = list;
              }
              that.setData({
                nextPage: {
                  hasNext: res.data.data.hasNextPage,
                  page: res.data.data.nextPage
                },
                List: newDocList
              });
            }
          }

        } else {
          console.log(res.data.info);
        }

      }
    })


  },

  //打开条件选择
  bindStageChange: function (e) {
    var that = this;
    this.setData({
      'index.stage': e.detail.value,
      nextPage: {
        hasNext: true,
        page: 1
      }
    });
    that.detarmine();
  },
  bindSourceChange: function (e) {
    var that = this;
    this.setData({
      "index.source": e.detail.value,
      nextPage: {
        hasNext: true,
        page: 1
      }
    });
    that.detarmine();
  },

  //获取资料列表
  detarmine: function (e) {
    var that = this;
    that.setData({
      List: [],
      "searchData.typeCode": that.data.sourcesType[that.data.index.source].code,
      "searchData.stageCode": that.data.stages[that.data.index.stage].code
    });
    that.getSourcesPage(e);
  },

  //资料详情
  bindDoc: function (e) {
    var source = e.currentTarget.dataset.data;
    console.log("source:" + source);
    if (source != "" && source != null && source != undefined) {

      wx.navigateTo({
        url: 'source/source?source=' + JSON.stringify(source)
      });
    }
  },

  stringToDate: function (dateStr) {
    var val = Date.parse(dateStr);
    return new Date(val);
  },
  isEpmty: function (param) {
    if (param == null || param == undefined || param == "null" || param == "undefined") {
      return '';
    }
    return param;
  },
  pullUpLoad: function (e) {
    //上拉加载
    var that = this;
    if (that.data.nextPage.hasNext) {
      that.getSourcesPage();
    };
  },
  pullDownLoad: function () {
    //下拉刷新
    var that = this;
    that.setData({
      isRefresh: true
    });
    projectUtil.sourcesPage({
      data: {
        limit: 15,
        page: 1,
        projectId: that.data.searchData.projectID,
        infoType: that.isEpmty(that.data.searchData.typeCode),
        stageCode: that.isEpmty(that.data.searchData.stageCode)
      },
      success: function (res) {
        if (res.data.code == "0000") {
          if (res.data.data != null) {
            if (that.data.isRefresh) {
              var newDocList = that.groupByTime(res.data.data.items);
              setTimeout(function () {
                that.setData({
                  isRefresh: false,
                  nextPage: {
                    hasNext: res.data.data.hasNextPage,
                    page: res.data.data.nextPage
                  },
                  List: newDocList
                });
              },1000);
            }
          }
        } else {
          console.log(res.data.info);
        }
      }
    });
  },

  groupByTime: function (list) {
    var that = this;

    /*按时间分组
        [
          {
            time: date,
            docList: [{ doc }]
          }

        ]
    */

    var receiveSourceList = [];
    list.forEach(function (item, index, arr) {
      var date = that.stringToDate(item.insertTime); //String 转 Date
      var insertTimes = item.insertTime.split(" "); //字符串按空格分开放到数组内
      var obj = { "time": insertTimes[0], "docList": [item] };
      var len = receiveSourceList.push(obj);//添加数据并返回list数组最后一位下标
      for (var value = index; value < arr.length;) {
        var newDate = that.stringToDate(arr[value].insertTime);
        if ((date.toDateString() == newDate.toDateString()) && (item.sourceID != arr[value].sourceID)) {
          receiveSourceList[len - 1].docList.push(arr[value]);
          arr.baoremove(value);
        } else {
          value++;
        }
      }
    });
    return receiveSourceList;
  }
});
Array.prototype.baoremove = function (dx) {
  if (isNaN(dx) || dx > this.length) { return false; }
  this.splice(dx, 1);
}

