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
          wx.showModal({
            title: '提示',
            content: '您还没有登录,请先登录再来查看吧！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }
            }
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
  }
})