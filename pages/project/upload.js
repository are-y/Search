//获取应用实例
var app = getApp();
import * as frame from "../../js/frame";
import * as  MethodUitls from "../../js/project";

Page({
    data: {
        projectList:null,
        page:1,
        lastPage:false,
        projectType:null,
        projectTypeCode:0,
        projectTypeIndex:null,
        projectTypeAll:'全部',
        projectName:null,
        inputVal:'',
        hidden:false
    },
    //页面加载完毕时候执行的函数
    onLoad: function(option){
         this.getProjectType();
    },
    //获取项目分类
    getProjectType:function(){
        let that=this;
        frame.getParamType({
            data:{
                paramType:'projectType'
            },
            success:function(rst){
                 if(rst.data.code=="0000"){
                    let projectType=[{"code":"0","color":"#C0MBDD","label":"全部"}];
                    projectType=projectType.concat(rst.data.data);
                    that.setData({
                        projectType:projectType
                    });
                    that.getInitData();
                }else{
                    wx.showModal({title:'提示',content:rst.data.info});
                }
            },
            fail:function(fail){
                 wx.showModal({title:'提示',content:'请求出错了'});
            }
        });


    },
    //获取初始化数据
    getInitData:function(){
        let that=this;
        MethodUitls.projectPage({
            data:{
                projectName:that.data.projectName!=null?that.data.projectName:'',
                projectTypeCode:that.data.projectTypeCode!=0?that.data.projectTypeCode:'',
                page:that.data.page,
                limit:15
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
                    let projectList=[];
                    let everyData=rst.data.data.items;
                    if(that.data.projectList!=null){
                        projectList=projectList.concat(that.data.projectList);
                    }
                    projectList=projectList.concat(everyData);
                    that.setData({
                        projectList:projectList,
                        page:page
                    });
                    that.loadImage();
                }else{
                    wx.showModal({title: '提示',content:rst.data.info});
                }
            },
            fail:function(fail){
                wx.showModal({title:'提示',content:'请求出错了'});
            },
            complete:function(complete){
                
            }

        });


    },
    loadImage:function(){
        let projectList=this.data.projectList;
        for(var i=0;i<projectList.length;i++){
            if(!projectList[i].isload){
                if(!projectList[i].profilePhoto){
                    projectList[i].imgUrl="../../resources/images/moren.jpg";
                } else{
                    projectList[i].imgUrl=MethodUitls.getImageUrl({url:projectList[i].profilePhoto});
                }
                projectList[i].isload=true;
            }
        }
        this.setData({
            projectList:projectList
        })

    },
    //上拉加载
    onReachBottom: function(e) {
        if(!this.data.lastPage){
            this.getInitData();
        }else{
            wx.stopPullDownRefresh();
        }
    },
     //选择要删除的项
    checkboxChange:function (e) {
        let projectId=e.currentTarget.dataset.rowdata;
        this.toProjectInfoList(projectId);
    },
    //跳转到项目资料列表
    toProjectInfoList:function(projectId){
          wx.navigateTo({url: '/pages/project/project?projectId='+projectId+''});
    },
    //选择项目类型
    pickerChangeProjectType:function(e){
        let projectType=this.data.projectType;
        let index=e.detail.value;
        this.setData({
            projectTypeCode:projectType[index].code,
            projectTypeIndex:index,
            projectTypeAll:null,
            projectList:null,
            page:1
        });
        this.getInitData();
    },
    bindInputChange:function(e){
        this.setData({
            searchData:e.detail.value
        });
    },
    //输入项目名进行搜索
    searchProject:function(e){
        let searchData=(e.detail.value).trim();
        this.setData({
            projectName:(searchData!=null&&searchData!=undefined)?searchData:'',
            inputVal:(searchData!=null&&searchData!=undefined)?searchData:'',
            projectList:null,
            page:1
        });
        this.getInitData();
    },
    clearInput: function () {
        this.setData({
            inputVal: "",
            projectName:'',
            projectList:null,
            page:1
        });
        this.getInitData();
    },
})
