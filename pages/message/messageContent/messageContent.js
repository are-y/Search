
import * as global from "../../../js/global";
import * as message from "../../../js/message";
import * as util  from "../../../js/util";
import * as frame from "../../../js/frame";
import * as WxParse from "../../common/plugin/htmlParse/wxParse";

Page({
  data:{
    msgID:'',
    message:null,
    attachment:null,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: options.msgTypeName,
    })
    this.setData({
      msgID:options.msgID
    });

    this.messageMsgID();
    this.getTBasBillAttachmentB();
  },
  
  //查询单个信息
  messageMsgID:function(){
    let that=this;
    message.messageMsgID({
      data:{
        msgID:that.data.msgID
      },
      success:function(res) {
        if(res.data.code=="0000"){
          that.setData({
            message:res.data.data
          });
          that.getMessageContent();
        }
      }
    })
  },
  //获取附件
  getTBasBillAttachmentB: function () {
    var that=this;
    frame.getTBasBillAttachmentB({
      data: {
        billID: that.data.msgID
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
  //获取消息内容
  getMessageContent:function(){
    let that=this;
    message.getContent({
      data:{
        contentID:that.data.message.contentID
      },
       success: function (res) {
          let article=res.data.code;
          let articles=article.replace('../api/commons/files/', global.ctx+"commons/files/");
          WxParse.wxParse('article', 'html', articles, that, 5);
       }
    });
  }
})