// pages/project/check-upload.js
import * as  frame  from "../../js/frame";
import * as  MethodUitls  from "../../js/project";
Page({
  data: {
    source: null,
    attachment: null,
    attachmentText: '',
    isVideo:null,
    isDelete:false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var source = JSON.parse(options.source);
    that.setData({
      source: source
    });
  },
  onReady: function () {
    // 页面渲染完成
    this.getTBasBillAttachmentB();
    // this.videoContext = wx.createVideoContext('myVideo');
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
  //获取附件
  getTBasBillAttachmentB: function () {
    var that=this;
    frame.getTBasBillAttachmentB({
      data: {
        billID: that.data.source.sourceID
      },
      success: function (res) {
        if (res.data.data) {
          that.setData({
            attachment: res.data.data
          });
        } else {
          that.setData({
            attachmentText: '暂无附件'
          });
        }
      }
    });
  },
  //删除资料
  delSource: function (e) {
    let that = this;
    var sourceID=e.currentTarget.dataset.id;
    let isDelete=that.data.isDelete;
    if(isDelete){
        return;
    }
    that.setData({
      isDelete:true
    });
    MethodUitls.sourcesDel({
      data: {
        ids: sourceID.toString()
      },
      success: function (rst) {
        if (rst.data.code == '0000' && rst.data.data) {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        } else {
          wx.showModal({ title: '提示', content: rst.data.info });
        }
      },
      fail: function (e) {
        wx.showModal({ title: '提示', content: '删除失败' });
      },
    });
    return false;
  },
  //单击查看附件
  bindFile: function (e) {
    var that = this;
    var fileID = e.currentTarget.dataset.data;
    var ext = e.currentTarget.dataset.ext;

    var fileName = fileID + "." + ext;

    frame.downloadDoc({
      data: {
        fileName: fileName
      }, 
      success: function (res) {
          var filePath = res.tempFilePath;

          //视频打开方式
          if(ext=="mp4"){
              that.setData({
                isVideo:filePath
              });
              return;
          }

          //图片打开方式
          if(ext=="jpg"||ext=="jpeg"||ext=="png"||ext=="gif"){
             wx.previewImage({
                urls: [filePath],
                success: function () {},
                fail: function () {}
              });
              return;
          }else if(ext=="doc"||ext=="xls"||ext=="ppt"||ext=="pdf"||ext=="docx"||ext=="xlsx"||ext=="pptx"){
              //文档的打开方式
               wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  console.log('打开文档成功');
                }
              });
              return;
          }else{
               wx.showModal({title: '提示',content: "微信官方暂不支持改文件代开方式"});
              return;
          }

      }
    });
  },
})