const apiService = require('../../service/request')

Page({
  data: {
    bookList: [],
    keyword: '',
    sid: '',
    bookHasMore: false,
    bookFilter: {
      page: 1
    }
  },
  onLoad(options) {
    this.setData({
      sid: options.id ? options.id : '',
      keyword: options.book_name ? options.book_name : ''
    },() => {
      this.getBookList() 
    })
  },
  // 搜索关键词
  handleSearch(e) {
    let {bookFilter} = this.data
    bookFilter.page = 1
    this.setData({
      keyword: e.detail,
      bookFilter
    },() => {
      this.getBookList()
    })
  },
  // 获取图书列表
  getBookList() {
    let { keyword,sid,bookFilter,bookList } = this.data
    let params = {
      sid: sid,
      title: keyword,
      ...bookFilter
    }
    apiService.getBookList(params).then((res) => {
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
          this.setData({
            bookList
          })
        }
        
      }
    })
  },
  // 下拉加载
  handleBottom() {
    let {bookFilter,bookHasMore} = this.data
    if(bookHasMore) {
      bookFilter.page = bookFilter.page + 1
      this.setData({
        bookFilter
      },() => {
        this.getBookList()
      })
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
})
