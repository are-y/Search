// pages/message/message.js
import * as global from "../../js/global";
import * as message from "../../js/message";
import * as frame from "../../js/frame";
import * as util from "../../js/util";

Page({
  data: {
    title:'',
    typeName: '1',
    page: 1,
    limit: 9,
    messageList: null,
    hidden: false,                           //加载页面
    hasMore: false,                          //加载更多
    hasMoreBe: true,                         //正在加载更多
    msgTypeList: null,                       //消息类型列表
    navigationBarTitlelist:null,             //标题
    loadMore: true,                          //下拉时，是否加载   

    scrollHeight: null                        //滚动高度
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 45
        })
      },
    })

    frame.getParamType({
      data: {
        paramType: "messageType"
      },
      success: function (res) {
        if (res.data.code == "0000") {
          let msgTypeList=res.data.data;
          that.setData({
            navigationBarTitlelist: msgTypeList,
          })
          for(let msgType of msgTypeList){
            msgType.select = false;
            msgType.label = msgType.label.substr(0,2);
          }
          msgTypeList[0].select=true
          that.setData({
            msgTypeList: msgTypeList
          })
        }
      }
    });

    that.messagePage();
  },


  //初始化数据，查询消息列表
  messagePage: function () {

    var that = this;
    let loadMore = that.data.loadMore;
    if (!loadMore) {
      return;
    }
    that.setData({ loadMore: false });
    let pagesss = that.data.page;
    var imgURLList = new Array();
    message.messagePage({
      data: {
        msgType: that.data.typeName,
        page: that.data.page,
        limit: 10
      },
      success: function (res) {
        if (res.data.code == "0000") {
          if (res.data.data.totalPages >= that.data.page) {
            var messageList = [];
            if (that.data.page > 1) {
              messageList = messageList.concat(that.data.messageList, res.data.data.items);
            } else {
              messageList = messageList.concat(res.data.data.items);
            }

            if (that.data.typeName == '5') {//如果选择的是“图片新闻”
              //设置图片路径及其类型
              for (let i = 0; i < messageList.length; i++) {
                messageList[i].msgTypeName = that.isMsgType(messageList[i].msgType);
                let imgURL = messageList[i].attachs[0].img1ID + "." + messageList[i].attachs[0].ext;
                if (messageList[i].attachs[0].img1ID) {
                  messageList[i].imgURL = imgURL == null ? null : global.ctx + "commons/files/" + imgURL;
                } else {
                  messageList[i].imgURL = imgURL == null ? null : global.ctx + "commons/files/" + imgURL;
                }
              }

              that.setData({
                messageList: messageList,
                hidden: true,
                hasMore: false,
                page: that.data.page + 1
              });



            } else {
              for (let i = 0; i < messageList.length; i++) {
                messageList[i].msgTypeName = that.isMsgType(messageList[i].msgType);
              }
              that.setData({
                messageList: messageList,
                hidden: true,
                hasMore: false,
                page: that.data.page + 1
              });
              
            }

          } else {
            that.setData({
              hasMore: true,
              hasMoreBe: false,
              hidden: true,
            });
          }
        }
      },
      fail: function () { },
      complete: function () {
        that.setData({ loadMore: true });
      }
    });
  },
  //选择消息类型事件
  messaheMenuClick: function (e) {
    var that = this;
    var typeName = e.currentTarget.dataset.type;
    let msgTypeList = that.data.msgTypeList;
    for(let msgType of msgTypeList){
      msgType.select=false
    }
    msgTypeList[parseInt(typeName)-1].select=true
    that.setData({
      msgTypeList: msgTypeList,
      messageList: null,
      typeName: typeName,
      page: 1
    });
    that.messagePage();
  },
  //下拉到底部触发事件
  bindDownLoad: function () {
    var that = this;
    that.setData({
      hasMore: true,
      hasMoreBe: true,
    });
    that.messagePage();
  },
  //判断消息类型
  isMsgType: function (msgType) {
    let that = this;
    let msgTypeName = that.data.navigationBarTitlelist[parseInt(msgType) - 1].label ;

    // if (msgType == "1") {
    //   msgTypeName = "新闻中心";
    // }
    // else if (msgType == "2") {
    //   msgTypeName = "通知公告";
    // }
    // else if (msgType == "3") {
    //   msgTypeName = "标准规范";
    // }
    // else if (msgType == "4") {
    //   msgTypeName = "精品工程";
    // }
    // else if (msgType == "5") {
    //   msgTypeName = "图片新闻";
    // }
    // else if (msgType == "6") {
    //   msgTypeName = "监督检查";
    // }
    wx.setNavigationBarTitle({
      title: msgTypeName
    });
    return msgTypeName;
  },


})