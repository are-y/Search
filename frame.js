
import * as global from "./global";

// 初始化APP
export let init = function (ctx) {

  global.ctx = ctx;

  // 初始化认证信息   
  global.initShAuthority();

  // 是否非第一次运行
  let isFirstRun = wx.getStorageSync('isFirstRun');
  if (isFirstRun == '') {
    wx.setStorageSync('isFirstRun', '1');
    //获取微信账户,设置头像
    weiXinInfo();
  }
  if (!global.shAuthority.avatarUrl) {
    //获取微信账户,设置头像
    weiXinInfo();
  }

  // 获取定位信息
  getLocation();

  //获取手机信息，存入app.js变量
  wx.getSystemInfo({
    success: function (res) {
      switch (res.platform) {
        case "devtools": {
          res.windowHeight = res.screenHeight - 56;
          break;
        }
        case "ios": {
          res.windowHeight = res.screenHeight - 122;
          break;
        } case "android": {
          res.windowHeight = res.screenHeight - 124;
          break;
        }
      }
      global.phoneInfo = res;
    }
  });
};

//获取微信账户
export let weiXinInfo = function () {
  //调用登录接口
  wx.login({
    success: function () {
      wx.getUserInfo({
        success: function (res) {

          // 微信头像
          global.shAuthority.avatarUrl = res.userInfo.avatarUrl;

          // 保存认证信息
          global.saveShAuthority();
        }
      });

    }
  });
};

//登录函数
export let login = function (param) {     //data：参数json;callback:为回调函数
  wx.request({
    url: global.ctx + 'accounts/login.json',
    data: {
      loginID: param.data.loginID,
      pwd: param.data.pwd,
      clientID: global.shAuthority.clientID
    },
     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
};

//获取账户信息
export let accountInfo = function (param) {     //data：参数json;callback:为回调函数
  wx.request({
    url: global.ctx + 'accounts.json',
    data: {
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}

// 定位状态：0 未定位 1 定位中 2 已定位
export let locateStatus = 0;

let cbGetlocation = null;

export let setCbGetlocation = function (cb) {
  cbGetlocation = cb;
};

//获取定位所在行政区划信息
export let getLocation = function () {

  if (locateStatus != 0) {
    return;
  }

  locateStatus = 1;

  // let geography = wx.getStorageSync('geographyInfo');
  // if(geography != '') global.geographyInfo = geography;

  //获取用户行政区划
  wx.getLocation({

    type: 'wgs84',
    success: function (res) {

      var latitude = res.latitude;
      var longitude = res.longitude;
      var speed = res.speed;
      var accuracy = res.accuracy;

      wx.request({
        url: global.ctx + 'commons/districts.json',
        data: {
          longitude: longitude,
          latitude: latitude,
          govName: '',
          clientID: global.shAuthority.clientID,
          loginID: global.shAuthority.loginID,
          token: global.shAuthority.token
        },
        success: function (ress) {

          if (ress.data.code == "0000") {

            if (ress.data.data.length != 0) {

              var geographyInfo = {
                "latitude": latitude,
                "longitude": longitude,
                "districts": ress.data.data
              };

              global.geographyInfo = geographyInfo;
              // wx.setStorageSync('geographyInfo', geographyInfo);

              typeof cbGetlocation == "function" && cbGetlocation(geographyInfo);
            }

            locateStatus = 2;
          } else {
            console.log("将用户的当前地理信息存入缓存失败" + ress.data.info);
          }
        },
        fail: function (res) {
          wx.redirectTo({
            url: '../pages/login/login',
          })
        }
      });
    }

  });
};

//退出登录
export let logout = function (param) {     //data：参数json;callback:为回调函数
  var shAuthority = wx.getStorageSync('shAuthority');//登录成功之后所存储的：loginID,token,clientID
  let ctx = getApp().globalData.ctx;//URL前缀
  wx.request({
    url: global.ctx + 'accounts/logout.json',
    data: {
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}

//修改密码
export let userPwd = function (param) {     //data：参数json;callback:为回调函数
  wx.request({
    url: global.ctx + 'accounts/pwd.json',
    data: {
      pwd: param.data.pwd,
      newPwd: param.data.newPwd,
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}

export let isEpmty = function (param) {
  if (param == null || param == undefined) {
    return '';
  }
  return param;
}

//组装文件路径
export let getFileUrl = function (fileID) {
  return ctx + 'commons/files/' + fileID;
}

//获取定位所在行政区划信息
export let getDistricts = function (param) {     //data：参数json;callback:为回调函数
  shAuthority = wx.getStorageSync('shAuthority');
  wx.request({
    url: global.ctx + 'commons/districts.json',
    data: {
      longitude: isEpmty(param.data.longitude),
      latitude: isEpmty(param.data.latitude),
      govName: isEpmty(param.data.govName),
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}

//获取文件内容base64编码（根据文件序号）
export let getImageBase64 = function (param) {
  wx.request({
    url: global.ctx + "commons/files/" + param.data.fileID + "/base64.json",
    method: 'GET',
    data: {
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  });
}

//下载文件(图片文件)（根据文件序号）
export let downloadFile = function (param) {     //data：参数json;callback:为回调函数
  wx.request({
    url: global.ctx + 'commons/files/' + param.data.fileID + '.json',
    method: 'GET',
    data: {
      fileID: param.data.fileID,
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}


//下载文件(.doc .docx .xlsx .xls .ppt .pptx .pdf .jpg .jpeg .gif .png)（根据文件序号）
export let downloadDoc = function (param) {
  wx.downloadFile({
    url: global.ctx + 'commons/files/' + param.data.fileName,
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }

  })
}


//上传附件
export let commAttachments = function (data, callback) {     //data：参数json;callback:为回调函数
  wx.request({
    url: global.ctx + 'commAttachments.json',
    data: {
      file: data.file,
      businessType: data.businessType,
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}

//获取系统参数列表
export let getParamType = function (param) {     //data：参数json;callback:为回调函数
  wx.request({
    url: global.ctx + 'commons/params/' + param.data.paramType+'/.json',
    data: {
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}


//获取附件表实体
export let getTBasBillAttachmentB = function (param) {
  wx.request({
    url: global.ctx + 'commAttachments.json',
    data: {
      billID: param.data.billID,
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}
//获取定位所在行政区划信息
export let districtsSearch = function (param) {
  wx.request({
    url: global.ctx + 'commons/districts/page.json',
    data: {
      range: param.data.range,
      govID: isEpmty(param.data.govID).trim(),
      govName: isEpmty(param.data.govName).trim(),
      page: isEpmty(param.data.page),
      limit: isEpmty(param.data.limit),
      clientID: global.shAuthority.clientID,
      loginID: global.shAuthority.loginID,
      token: global.shAuthority.token
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: (param.success != null && param.success != undefined) ? param.success : function (s) { },
    fail: (param.fail != null && param.fail != undefined) ? param.fail : function (f) { },
    complete: (param.complete != null && param.complete != undefined) ? param.complete : function (c) { }
  })
}
