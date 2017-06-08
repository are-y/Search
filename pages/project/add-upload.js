//获取应用实例
var app = getApp();
import * as  MethodUitls from  "../../js/project";
import * as  frame from "../../js/frame";

Page({
    data: {
        projectId:null,
        stageText:"请选择项目阶段",
        stageIndex:0,
        stageName:null,
        sourceTypeText:"请选择资料类型",
        sourceTypeIndex:0,
        sourceTypeName:null,
        projectStage:null,//项目阶段
        sourceType:null,//资料类型
        fileNumber:null,
        fileTitle:null,
        srcVideo:null,
        srcImage:null,
        fileData:[],
        isUploadAsyn:false,
        hidden:true,
        isNotSubmit:true  //是否没有提交
    },
    //页面加载完毕时候执行的函数
    onLoad: function(option){
        this.setData({
            projectId:option.projectId
        });
        this.getProjectStage();
    },
    //获取项目阶段
    getProjectStage:function(){
        let that=this;

        frame.getParamType({
            data:{
                paramType:'stage'
            },
            success:function(rst){
                 if(rst.data.code=="0000"){
                    that.setData({
                        projectStage:rst.data.data
                    });
                    that.getSourceType();
                }else{
                    wx.showModal({title: '提示',content: rst.data.info});
                }
            },
            fail:function(fail){
                 wx.showModal({title: '提示',content: '请求出错了'});
            }
        });
    },
    //获取资源类型
    getSourceType:function(){
        let that=this;
        frame.getParamType({
            data:{
                paramType:'SourceType'
            },
            success:function(rst){
                 if(rst.data.code=="0000"){
                     that.setData({
                            sourceType:rst.data.data
                    });
                }else{
                    wx.showModal({title: '提示',content: rst.data.info});
                }
            },
            fail:function(fail){
                 wx.showModal({title: '提示',content: '请求出错了'});
            }
        });
    },
    //选择项目阶段回调函数
    pickerChangeStage: function(e) {
        let projectStage=this.data.projectStage;
        let index=e.detail.value;
        this.setData({
            stageIndex: projectStage[index].code,
            stageName:projectStage[index].label,
            stageText:null
        })
        
    },
    //选择资料类型回调函数
    pickerChangeSourceType: function(e) {
        let sourceType=this.data.sourceType;
        let index=e.detail.value;
        this.setData({
            sourceTypeIndex:sourceType[index].code,
            sourceTypeName:sourceType[index].label,
            sourceTypeText:null
        })
    },
    //填写文件序号
    bindInputFileNumber:function(e){
        this.setData({
            fileNumber: e.detail.value
        })
    },
    //填写文件标题
    bindInputFileTitle:function(e){
        this.setData({
            fileTitle: e.detail.value
        })
    },
    //保存上传资料
    uploadSave:function(){
          var that=this;
          let projectId=that.data.projectId;
          let stageIndex=that.data.stageIndex;
          let stageName=that.data.stageName;
          let sourceTypeIndex=that.data.sourceTypeIndex;
          let sourceTypeName=that.data.sourceTypeName;
          let fileTitle=that.data.fileTitle;
          let fileNumber=that.data.fileNumber;
          let isUploadAsyn=that.data.isUploadAsyn;
          let fileData=that.data.fileData;
          let isNotSubmit=that.data.isNotSubmit;

          if(!stageIndex){
                wx.showToast({ title: '请选择项目阶段', icon: 'error', duration: 2000});
                return;
          }          
          if(!sourceTypeIndex){
                wx.showToast({ title: '请选择资料类型', icon: 'error', duration: 2000});
                return;
          }
          if(!fileNumber){
                wx.showToast({ title: '请填写文档序号', icon: 'error', duration: 2000});
                return;
          }
          if(!fileTitle){
                wx.showToast({ title: '请填写资料标题', icon: 'error', duration: 2000});
                return;
          }
          if(!isUploadAsyn){
              wx.showToast({ title: '异步上传未完成', icon: 'error', duration: 2000});
              return;
          }
          if(fileData==null||fileData==undefined||fileData.length==0||fileData[0]==undefined){
                wx.showToast({ title: '请选择资料文件', icon: 'error', duration: 2000});
                return;
          }
          if(!isNotSubmit){
             return;
          }
          that.setData({
                isNotSubmit:false
          });
          MethodUitls.sourcesSave({
                data:{
                    projectId:projectId,
                    stageIndex:stageIndex,
                    stageName:stageName,
                    sourceTypeIndex:sourceTypeIndex,
                    sourceTypeName:sourceTypeName,
                    fileNumber:fileNumber,
                    fileTitle:fileTitle,
                    fileData:JSON.stringify(fileData)
                },
                success:function(rst){
                    if(rst.data.code=='0000'){
                        wx.setStorageSync("upload","add");
                        wx.navigateBack({
                          delta: 1, // 回退前 delta(默认为1) 页面
                          success: function(res){  
                            // success
                            wx.showToast({ 
                                title: '添加资料成功',
                                icon: 'success', 
                                duration: 2000
                            });
                          }
                        })
                        
                    }else{
                        wx.showModal({
                            title: '提示',
                            content:rst.data.info
                        });
                    }
                },
                fail:function(e){                   
                    wx.showModal({title: '提示',content: '请求出错了'});
                }
          });

    },
    //从相册中选择视频
    selectAlbumVideo:function(){
        var that = this;
        wx.chooseVideo({
            sourceType:['album', 'camera'],//album 从相册选视频，camera 使用相机拍摄
            maxDuration:15,//拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
            camera:'back',//默认调起的为前置还是后置摄像头。front: 前置，back: 后置，默认 back
            success:function(rst){//接口调用成功，返回视频文件的临时文件路径，详见返回参数说明


                let filePath=rst.tempFilePath;
                console.log(filePath);
                that.setData({
                    srcVideo: filePath,
                    srcImage:null
                });
                that.uploadFile(filePath,"2");
            },
            fail:function(e){//接口调用失败的回调函数
                wx.showModal({
                        title: '提示',
                        content: '选择视频失败'
                });
            },
            complete:function(result){//接口调用结束的回调函数（调用成功、失败都会执行）
                
            }
        });
    },
    //从相册中选择照片
    selectAlbumImage:function(){
        var that = this;
        wx.chooseImage({
            count:9,//最多可以选择的图片张数，默认9
            sizeType:['original','compressed'],//original 原图，compressed 压缩图，默认二者都有
            sourceType:['album','camera'],//album 从相册选图，camera 使用相机，默认二者都有
            success:function(rst){//成功则返回图片的本地文件路径列表 tempFilePaths
                let srcImage=that.data.srcImage;
                let filePath=rst.tempFilePaths;
                if(srcImage!=null){
                    srcImage.push(filePath);
                }else{
                    srcImage=filePath;
                }
                that.setData({
                    srcImage: srcImage,
                    srcVideo:null
                });
                that.uploadFile(filePath[0],"1");
            },
            fail:function(e){//接口调用失败的回调函数
                wx.showModal({
                        title: '提示',
                        content: '选择图片失败'
                });
            },
            complete:function(result){//接口调用结束的回调函数（调用成功、失败都会执行）
               
            }
        });
    },
    //上传资料方法
    uploadFile:function(filePath,businessType){

        let that=this;
        // that.setData({
        //     hidden:false
        // });
        wx.showToast({
            title: '成功',
            icon: 'loading',
            duration: 200000000000000,
            mask:true
        })
        MethodUitls.uploadFile({
            data:{
                filePath:filePath,
                businessType:businessType
            },
            success:function(rst){
                var data = JSON.parse(rst.data);
                if(data.code=='0000'){
                    let fileData=that.data.fileData;
                    fileData.push(data.data);
                    that.setData({
                        fileData:fileData,
                        isUploadAsyn:true
                    })
                }else{
                    wx.showModal({title: '提示', content: data.info});
                }
            },
            fail:function(e){
                console.log(e);
                wx.showModal({title: '提示',content: '料上传失败'});
            },
            complete:function(){
                // that.setData({
                //         hidden:true
                // });
                wx.hideLoading();
            }
        });
    }

});