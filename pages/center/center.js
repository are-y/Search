
//获取应用实例
var app = getApp();

Page({
    data:{ 
        userInfo:{},
        propertyValue:{"title":"信息发布", "icon":"iconfont icon-xiaoshoutuihuo", "action":"/pages/info/submit","children":[]},
        iconImg:'../../resources/images/photo193.png',
        icon:'../../resources/images/setting.png',
        avatarUrl:'',
        nickName: '',            //显示的用户名
        corporationName: ''      //公司名称
    },


    onLoad:function(){

        var that = this;
        var ywUser=app.getWxUser.ywUser;
        console.log("center:"+ywUser);
        // 获取微信用户信息
        app.getWxUser((res) => {
            that.setData({userInfo: res});
        });
        //从缓存中获取头像
        var avatarUrl = wx.getStorageSync('avatarUrl');
        that.setData({
            avatarUrl:avatarUrl
        });

        var userCorporationName=wx.getStorageSync('userCorporationName');
        if(userCorporationName){
            that.setData({
                nickName:userCorporationName.nickName,
                corporationName:userCorporationName.corporationName
            });
        }
    }
});