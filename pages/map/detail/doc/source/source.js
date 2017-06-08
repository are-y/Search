// pages/map/detail/doc/file/file.js
import * as frameUtil from "../../../../../js/frame";
import * as util from '../../../../../js/util';
let ctx = getApp().globalData.ctx;//URL前缀
Page({
  data: {
    source: {},
    filePath: '',
    attachment: '暂无附件',
    files: null,
    isVideo:null,
  },

  onLoad: function (options) {
    //页面加载
    var that = this;
    var source = JSON.parse(options.source);
    source.insertTime = that.formatTime(source.insertTime);
    that.setData({
      source: source
    });


    frameUtil.getTBasBillAttachmentB({
      data: {
        billID: source.sourceID
      },
      success: function (res) {
        if (res.data.code == "0000") {
          if (res.data.data != null) {
            that.setData({
              files: res.data.data
            });
          }

        } else {
          console.log(res.data.info);
        }
      }

    })

  },
  //时间转换
  formatTime: function (date) {
    if (date) {
      return util.formatTime(date);
    }
    return "";
  },

  bindFile: function (e) {
    var that = this;
    var fileID = e.currentTarget.dataset.id; //fieldID
    var ext = e.currentTarget.dataset.ext; //文件后缀名

    console.log(fileID + "." + ext);

    // var fileExt = ["doc", "docx", "xls", "xlsx", "ppt", "pdf", "pptx"];

    var fileName = fileID + "." + ext;
    frameUtil.downloadDoc({
      data: {
        fileName: fileName //fieldID+文件后缀名
      }, success: function (res) {
        var filePath = res.tempFilePath;

        //视频打开方式
        if (ext == "mp4") {
          that.setData({
            isVideo: filePath
          });
          return;
        }

        //图片打开方式
        if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif") {
          wx.previewImage({
            urls: [filePath],
            success: function () { },
            fail: function () { }
          });
          return;
        } else if (ext == "doc" || ext == "xls" || ext == "ppt" || ext == "pdf" || ext == "docx" || ext == "xlsx" || ext == "pptx") {
          //文档的打开方式
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功');
            }
          });
          return;
        } else {
          wx.showModal({ title: '提示', content: "微信官方暂不支持改文件代开方式" });
          return;
        }
      }
    });
  },
  endPlay:function(){
    this.setData({
      isVideo:null,
    })
  }
});

