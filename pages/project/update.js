var app = getApp();
import * as global from "../../js/global";
import * as project from "../../js/project";
import * as frame from "../../js/frame";

Page({
    data: {
        array:null,
        projectTypeText:'全部',
        index: 0,
        date: '2016-09-01',
        inputShowed: false,
        inputVal: "",
        projectList: null,
        projectName: '',
        govCode: '',
        projectTypeCode: '',
        limit:5,
        page: 1,
        scrollHeight: '',     //用户手机的高度
        hidden: true,         //是否显示正在加载
        scrollTop: 0,
        staffID: '',
        hidden: false,
        hasMore:false,          //加载更多
        hasMoreBe:true,         //是否还有更多内容
        loading:true

    },
    onLoad: function (options) {
        //获取系统信息
        var that = this;
        var fes = app.data.ywUser;
        that.setData({ staffID: global.ywUser.staffID });
        that.datas();
        that.setData({
            hidden: true
        });
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                that.setData({
                    scrollHeight: res.windowHeight-48
                });
            }

        });
        that.getProjectType();
    },
    onShow: function () {
        //   在页面展示之后先获取一次数据
        
    },
    //数据初始化
    datas: function () {
        var that = this;
        var shAuthority = wx.getStorageSync('shAuthority');
        project.projectPage({
            data: {
                "projectName": that.data.projectName,
                "projectTypeCode": that.data.projectTypeCode,
                "staffID": that.data.staffID,
                "limit":10,
                "page":that.data.page,
            },
            success: function (res) {
                if (res.data.data) {
                    if(that.data.projectName||that.data.projectTypeCode){
                        that.setData({
                            projectList:res.data.data.items,
                            hidden: true,
                            hasMore:false,
                        });
                    }else{
                        if(res.data.data.totalPages>=that.data.page){
                            var projectList = [];
                            if(that.data.page>1){
                                projectList=projectList.concat(that.data.projectList,res.data.data.items);
                            }else{
                                projectList=projectList.concat(res.data.data.items);
                            }
                            that.setData({
                                projectList: projectList,
                                hidden: true,
                                hasMore:false,
                                page:that.data.page+1,
                            });
                            
                        }else{
                            that.setData({
                                hasMore:true,
                                hasMoreBe:false
                            });
                        }  
                    }
                    that.loadImage();
                } else {
                    console.log(res.data.info);
                }
            }
        })
    },
    //获取项目类型
    getProjectType:function(){
        var that=this;
        frame.getParamType({
            data:{
                paramType:'projectType'
            },
            success:function(res){
                if(res.data.data){
                    var arrays=new Array();
                    for(var i=0;i<res.data.data.length+1;i++){
                        if(i==0){
                          arrays[i]={"code":0,"label":"全部"};  
                        }else{
                            arrays[i]={"code":res.data.data[i-1].code,"label":res.data.data[i-1].label};
                        }
                          
                    }
                    that.setData({
                        array:arrays
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

    //项目类型选择事件
    bindPickerChange: function (e) {
        var that = this;
        that.setData({page:1});
        var indexs = e.detail.value;
        if (e.detail.value == 0) {
            indexs = "";
        }
        that.setData({
            projectTypeCode: indexs,
            projectTypeText:null,
            index: e.detail.value
        });
        that.datas();
        console.log("项目类型搜索：" + this.data.projectList);
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: "",
            projectName:"",
            page:1
        });
        this.datas();
    },
    //搜索事件
    inputSE: function (e) {
        var that = this;
        that.setData({page:1});
        var projectName = e.detail.value;
        that.setData({
            projectName: projectName
        });
        this.datas();
        this.setData({
            inputVal: e.detail.value
        });
        // Console.log(that.data.projectSE);
    },
    loadImage:function(){
        let projectList=this.data.projectList;
        for(var i=0;i<projectList.length;i++){
            if(!projectList[i].isload){
                 if(!projectList[i].profilePhoto){
                    projectList[i].imgUrl="../../resources/images/moren.jpg";
                } else{
                    projectList[i].imgUrl=project.getImageUrl({url:projectList[i].profilePhoto});
                }
                projectList[i].isload=true;
            }
        }
        this.setData({
            projectList:projectList
        })

    },
    //下拉加载更多
    bindDownLoad:function(){
        var that=this;
        that.setData({
          hasMore:true,
          hasMoreBe:true 
        });
        that.datas();
    }
})
