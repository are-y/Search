Page({
  data:{
    infoTypes: [
            {name: '新闻', value: '0',checked:true},
            {name: '通知', value: '1'},
            {name: '公告', value: '2'},
            {name: '文档', value: '3'}
        ],
      type:"新闻"
  },
   radioChange: function (e) {
    
        var infoTypes = this.data.infoTypes;

        for (var i = 0, len = infoTypes.length; i < len; ++i) {
            infoTypes[i].checked = infoTypes[i].value == e.detail.value;
            if(infoTypes[i].checked){
              this.setData({
                type:infoTypes[i].name
              }); 
            }
        }
        this.setData({
            infoTypes: infoTypes
        });
        
    },
    radioClick:function(){
      wx.redirectTo({
          url:'../add/add?type='+this.data.type
        });
    },
  onLoad:function(options){
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})