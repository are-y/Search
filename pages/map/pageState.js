function init() {
    let pageState = {};
    pageState.pageType = 0;
    pageState.sourceType = 0;
    pageState.isBusinessBack = false;
    wx.setStorageSync('map.pageState', pageState);
};

function navigate(sourceType) {
    let pageState = wx.getStorageSync('map.pageState');
    pageState.sourceType = sourceType;
    wx.setStorageSync('map.pageState', pageState);
};
function back() {
    let pageState = wx.getStorageSync('map.pageState');
    pageState.isBusinessBack = true;
    wx.setStorageSync('map.pageState', pageState);
};
function setBusinessBackFalse() {
    let pageState = wx.getStorageSync('map.pageState');
    pageState.isBusinessBack = false;
    wx.setStorageSync('map.pageState', pageState);
}
function getSourceType() {
    let pageState = wx.getStorageSync('map.pageState');
    return pageState.sourceType;
};
function isBusinessBack() {
    let pageState = wx.getStorageSync('map.pageState');
    return pageState.isBusinessBack;
};
function setPageType(pageType) {
    let pageState = wx.getStorageSync('map.pageState');
    pageState.pageType = pageType;
    wx.setStorageSync('map.pageState', pageState);
};
function getPageType(){
    let pageState = wx.getStorageSync('map.pageState');
    return pageState.pageType;
};

module.exports = {
    init: init,
    navigate: navigate,
    back: back,
    getSourceType: getSourceType,
    isBusinessBack: isBusinessBack,
    setBusinessBackFalse: setBusinessBackFalse,
    getPageType:getPageType,
    setPageType:setPageType
};