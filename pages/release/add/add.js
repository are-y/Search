
Page({
    data:{
       type:"",

       files:[]
    },
    onLoad:function(options){
      this.setData({
          type:options.type
      });
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sourceType: ['album', 'camera'], 
            success: function (res) {
               
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id,
            urls: this.data.files 
        })
    }
});