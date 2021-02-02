Page({
  data: {
    isSet: false
  },
  onLoad() {
    this.handleIsLogin()
  },
  // 判断是否登录
  handleIsLogin() {
    let _this = this
    wx.getStorageInfo({    
      success(res) {
        if(res.keys.indexOf("token") == -1){
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }else {
          _this.handleIsRole()
        }
      },
    })
  },
  // 判断用户身份
  handleIsRole() {
    let _this = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        let userInfo = JSON.parse(res.data)
        if(userInfo.roles === "user") {
          _this.setData({
            isSet: true
          })
        }else {
          _this.setData({
            isSet: false
          })
        }
      },
    });
  },
  // 跳转添加图书表单
  handleToAddBook() {
    wx.navigateTo({
      url: `/pages/addBook/addBook`,
    })
  },
  // 跳转添加图书分类表单
  handleToAddType() {
    wx.navigateTo({
      url: `/pages/addType/addType`,
    })
  },
  // 跳转未开发页面
  handleToNew() {
    wx.showToast({
      title: '功能还未开发，敬请期待',
      icon: 'none',
      duration: 2000,
      mask: 'true'
    })
  }
})