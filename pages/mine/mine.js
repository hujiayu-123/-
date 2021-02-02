const app = getApp()

Page({
  data: {
    userInfo: {},//微信信息
    userinfo: {}//用户信息
  },
  onLoad() {
    this.handleIsLogin()   // 判断当前是否登录
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onShow() {
    if(app.globalData.isPreViewApi) {
      app.globalData.isPreViewApi = false
    }
    let _this = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(JSON.parse(res.data))
        _this.setData({
          userinfo: JSON.parse(res.data)
        })
      }
    })
  },
  // 跳转收藏记录
  handleToCollect() {
    wx.navigateTo({
      url: '/pages/collect/collect'
    })
  },
  // 跳转浏览记录
  handleToBrowsing() {
    wx.navigateTo({
      url: "/pages/browse/browse"
    })
  },
  // 跳转设置
  handleToSet() {
    wx.navigateTo({
      url: "/pages/editInfo/editInfo"
    })
  },
  getUserInfo() {
    let _this = this
    wx.getUserInfo({
      success: function(res) {
        app.globalData.userInfo = res.userInfo
        _this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  handleIsLogin() {
    wx.getStorageInfo({    
      success(res) {
        if(res.keys.indexOf("token") == -1){
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      },
    })
  },
})
