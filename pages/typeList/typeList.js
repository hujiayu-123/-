const apiService = require('../../service/request')

Page({
  data: {
    typeList: [],
    keyword: '',
    typeHasMore: false,
    typeFilter: {
      page: 1
    }
  },
  onShow() {
    this.getTypeList()
  },
  // 搜索关键词
  handleSearch(e) {
    let {typeFilter} = this.data
    typeFilter.page = 1
    this.setData({
      keyword: e.detail,
      typeFilter
    },() => {
      this.getTypeList()
    })
  },
  // 获取分类列表
  getTypeList() {
    let {keyword,typeList,typeFilter} = this.data
    let params = {
      catalog: keyword,
      ...typeFilter
    }
    apiService.getTypeList(params).then((res) => {
      if(res.code === 200) {
        if(res.data.length < 10) {
          this.setData({
            typeHasMore: false
          })
        }else {
          this.setData({
            typeHasMore: true
          })
        }
        if(typeFilter.page === 1) {
          this.setData({
            typeList:res.data
          })
        }else {
          typeList.push(...res.data)
          this.setData({
            typeList
          })
        }
      }
    })
  },
  // 下拉加载
  handleBottom() {
    let {typeFilter,typeHasMore} = this.data
    if(typeHasMore) {
      typeFilter.page = typeFilter.page + 1
      this.setData({
        typeFilter
      },() => {
        this.getTypeList()
      })
    }
  },
  // 点击返回上级页面
  handleToBack(e) {
    let item = e.detail
    console.log(item)
    let pages = getCurrentPages(); // 获取页面栈
    let returnpage = pages[pages.length - 2]; // 上一个页面
    returnpage.setData({
      typeItem: item
    })
    wx.navigateBack({
      delta: 1
    })
  },
  handleToAddTyle() {
    wx.navigateTo({
      url: '/pages/addType/addType',
    })
  },
  // 更新图书列表
  handleUpdateType() {
    this.getTypeList()
  },
})
