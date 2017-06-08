Page({
    data:{
        
        //查询出来的信息已经根据时间进行排序
        information:[
            {type:'新闻',title:'让高校思想政治...',
                user:'张三',time:'2016/06/12 18:24:12',
            content:'习近平指出，总统先生就任以来，中美双方就共同关心的问题保持了密切沟通。'},
            {type:'通知',title:'关于员工福利...',
                user:'张三',time:'2017/02/21 16:20:01',
            content:'习近平指出，总统先生就任以来，中美双方就共同关心的问题保持了密切沟通。'}
        ]

    },
    onLoad:function(){
        
    },

    // 添加发布信息
    addInfoTap:function(){
        wx.navigateTo({
            url:"add/add"
        }) ;       

    },

    //删除信息
    deleteInfoTap:function(){
        wx.navigateTo({
            url:"delete/delete"
        })
    },
    selecteType:function(){
        wx.navigateTo({
            url:"infoType/infoType"
        })
    }

});