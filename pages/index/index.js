const apiService = require('../../service/request')
var app = getApp()

Page({
  data: {
    isActive: 'recommend',// 当前tab高亮
    bookList:[], // 推荐图书列表
    typeList:[],  //分类列表
    bookFilter: { // 图书下拉加载当前页
      page: 1,
    },
    typeFilter: { // 分类下拉加载当前页
      page: 1,
    },
    bookHasMore: false,// 图书列表下拉是否加载
    typeHasMore: false,//分类列表下拉是否加载
  },
  onShow() {
    this.handleIsRole()
    let {isActive,bookFilter,typeFilter} = this.data 
    if(isActive === 'recommend') {
      bookFilter.page = 1
      this.setData({
        bookFilter
      },() => {
        this.getBookList()
      })
    }else {
      typeFilter.page = 1
      this.setData({
        typeFilter
      },() => {
        this.getTypeList()
      })
    }
  },
  // 判断当前用户身份
  handleIsRole() {
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        let userInfo = JSON.parse(res.data)
        if(userInfo.roles === "user") {
          app.globalData.isRole = false
        }else {
          app.globalData.isRole = true
        }
      },
    });
  },
  // 获取图书列表
  getBookList() {
    let {bookFilter,bookList} = this.data
    apiService.getBookList(bookFilter).then((res) => {
      if(res.code === 200) {
        if(res.data.length < 10) {
          this.setData({
            bookHasMore: false
          })
        }else {
          this.setData({
            bookHasMore: true
          })
        }
        if(bookFilter.page === 1) {
          this.setData({
            bookList:res.data
          })
        }else {
          bookList.push(...res.data)
          console.log(bookList)
          this.setData({
            bookList
          })
        }
      }
    })
  },
  // 获取分类列表
  getTypeList() {
    let {typeFilter,typeList} = this.data
    apiService.getTypeList(typeFilter).then((res) => {
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
  // tab切换
  handleTabChange(e) {
    let active = e.currentTarget.dataset['id']
    let {bookFilter,typeFilter} = this.data
    if(active === 'recommend') {
      bookFilter.page = 1
      this.setData({
        bookFilter
      },() => {
        this.getBookList()
      })
    }else {
      typeFilter.page = 1
      this.setData({
        typeFilter
      },() => {
        this.getTypeList()
      })
    }
    this.setData({
      isActive: active
    })
  },
  // 下拉加载
  handleBottom() {
    let {isActive,bookFilter,typeFilter,bookHasMore,typeHasMore} = this.data
    if(isActive === "recommend") {
      if(bookHasMore) {
        bookFilter.page = bookFilter.page + 1
        this.setData({
          bookFilter
        },() => {
          this.getBookList()
        })
      }
    }else {
      if(typeHasMore) {
        typeFilter.page = typeFilter.page + 1
        this.setData({
          typeFilter
        },() => {
          this.getTypeList()
        })
      }
    }
  },
  // 更新图书列表
  handleUpdateBook() {
    let {bookFilter} = this.data
    bookFilter.page = 1
    this.setData({
      bookFilter
    },() => {
      this.getBookList()
    })
  },
  // 更新图书分类列表
  handleUpdateType() {
    let {typeFilter} = this.data
    typeFilter.page = 1
    this.setData({
      typeFilter
    },() => {
      this.getTypeList()
    })
  },
  // 跳到分类图书列表
  handleToList(e) {
    let id = e.detail.sid
    wx.navigateTo({
      url: `/pages/bookList/bookList?id=${id}`,
    })
  },
  //跳转到搜索页
  handleToSearch: function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
})
