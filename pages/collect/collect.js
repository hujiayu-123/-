const apiService = require('../../service/request')

Page({
  data: {
    userInfo: {},
    bookList: []
  },
  onLoad() {
    let _this = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        _this.setData({
          userInfo: JSON.parse(res.data)
        })
      }
    })
  },
  onShow() {
    this.getList()
  },
  // 获取收藏记录
  getList() {
    apiService.getEnshrineList().then((res) => {
      if(res.code === 200) {
        this.setData({
          bookList: res.data
        })
      }
    })
  },
  // 更新列表
  handleUpdateBook() {
    this.getList()
  }
})