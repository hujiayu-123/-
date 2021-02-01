Page({
  data: {
    history: [],
    isshow: false
  },
  onLoad() {
    let _this = this
    wx.getStorageInfo({    //判断缓存中是否有搜索历史
      success(res) {
        if(res.keys.indexOf("history") != -1){
          wx.getStorage({
            key: 'history',
            success(res) {
              _this.setData({
                history: res.data,
                isshow: true
              })
            },
          })
        }
      },
    })
  },
  // 搜索
  handleSearch(e) {
    let book_name = e.detail
    wx.navigateTo({
      url: `/pages/bookList/bookList?book_name=${book_name}`,
    })
    let history = this.data.history
    for(var i=0;i<history.length;i++){
      if (history[i] == e.detail){
        history.splice(i,1)
      }
    }
    history.push(e.detail)
    this.setData({
      history,
      isshow: true
    })
    wx.setStorage({
      key: 'history',
      data: history
    })
  },
  // 点击搜索历史直接搜索
  handleToList(e) {
    let book_name = e.target.dataset.name
    wx.navigateTo({
      url: `/pages/bookList/bookList?book_name=${book_name}`,
    })
  },
  // 清空搜索
  handleEmpty() {
    wx.removeStorage({
      key: 'history',
      success(res) {
        console.log(res)
      }
    })
    this.setData({
      isshow: false,
      history: []
    })
  },
  // 取消 跳回主页
  handleToCancel() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
