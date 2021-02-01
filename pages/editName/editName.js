const apiService = require('../../service/request')
const app = getApp()

Page({
  data: {
    name: '昵称',
    isActive: false
  },
  onLoad() {
    let _this = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        let userInfo = JSON.parse(res.data)
        _this.setData({
          name: userInfo.name ? userInfo.name : '昵称'
        })
      }
    })
  },
  onShow() {
    if(app.globalData.isPreViewApi) {
      app.globalData.isPreViewApi = false
    }
  },
  handleInput(e) {
    this.setData({
      name: e.detail,
      isActive: true
    })
    if(e.detail === "") {
      this.setData({
        isActive: false
      })
    }
  },
  // 提交
  handleSubmit() {
    let {name} = this.data
    apiService.getBasic({name}).then((res) => {
      if(res.code === 200) {
        wx.getStorage({
          key: 'userInfo',
          success: function(res) {
            let userInfo = JSON.parse(res.data)

            userInfo.name = name
            wx.setStorage({
              key: 'userInfo',
              data: JSON.stringify(userInfo)
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  }
})