//获取应用实例
var app = getApp();
import * as  frame from "../../js/frame";
import * as  MethodUitls from "../../js/project";
import * as  util from "../../js/util";

Page({
    data: {
        infoList:null,
        sourceType:null,//资料类型
        sourceTypeIndex:0,
        sourceTypeCode:null,
        sourceTypeText:'全部',
        isDelete:false, 
        page:1,
        lastPage:false,
        projectId:null
    },
    //页面加载完毕时候执行的函数
    onLoad: function(option){
        this.setData({
            projectId:option.projectId
        });
        this.getSourceType();
        wx.removeStorageSync("upload");
    },
    onShow:function(){
          var value = wx.getStorageSync('upload');
          if(value=='add'){
              this.setData({
                  infoList:null,
                  page:1,
                  lastPage:false,
                  isDelete:false,
              })
              this.getInitData();
          }
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
                    let sourceType=[{code:"",label:"全部"}];
                    sourceType=sourceType.concat(rst.data.data);
                    that.setData({
                        sourceType:sourceType
                    });
                    that.getInitData();
                }else{
                    wx.showModal({title: '提示',content: rst.data.info});
                }
            },
            fail:function(fail){
                 wx.showModal({title: '提示',content: '请求出错了'});
            }
        });
    },

    //获取初始化数据
    getInitData:function(){
        let that=this;
        MethodUitls.sourcesPage({
            data:{
                projectId:that.data.projectId,
                infoType:that.data.sourceTypeCode,
                page:that.data.page,
                limit:10,
            },
            success:function(rst){  
                if(rst.data.code=="0000"){
                    let page=that.data.page;
                    if(!rst.data.data.lastPage){
                        page+=1;
                    }else{
                        that.setData({
                            lastPage:true
                        });
                    }
                    let infoList=[];
                    if(that.data.infoList!=null){
                        infoList=infoList.concat(that.data.infoList);
                    }
                    let items=rst.data.data.items;
                    var phoneInfo=app.globalData.phoneInfo;
                    infoList=infoList.concat(items);
                    that.setData({
                        infoList:infoList,
                        page:page
                    });
                }else{
                    wx.showModal({title: '提示',content: rst.data.info});
                }
            },
            fail:function(e){
                wx.showModal({title: '提示',content: '请求出错了'});
            },
            complete:function(e){
            }
        });
        
    },
    formatTime:function(date){
        return util.formatTime(date);
    },
    //选择资料类型执行的函数
    changeInfoType:function(e){
        let sourceType=this.data.sourceType;
        let index=e.detail.value;
        this.setData({
            sourceTypeIndex: index,
            sourceTypeCode:sourceType[index].code,
            sourceTypeText:null,
            infoList:null,
            page:1
        });
        this.getInitData();
    },
   //上传资料
    addInfo:function(){
        wx.navigateTo({url: '/pages/project/add-upload?projectId='+this.data.projectId+''});
    },
    
    
    //获取选中的数据
    getCheckedData:function(){
        let checkeds=[];
        let infoList=this.data.infoList;
        if(infoList.length>0){
            for(let i=0;i<infoList.length;i++){
                if(infoList[i].checked){
                    checkeds.push(infoList[i].sourceID);
                }
            }
        }
        return checkeds;
    },
    
    //查看资料
    heckingMaterials:function(e){
        var source=JSON.stringify(e.currentTarget.dataset.data);
        wx.navigateTo({
            url: 'check-upload?source='+source
        })
    },
    //下拉刷新
    upper: function(e) {
         
    },
    //上拉加载
    onReachBottom: function(e) {
        if(!this.data.lastPage){
            this.getInitData();
        }else{
            wx.stopPullDownRefresh();
        }
    },
})
