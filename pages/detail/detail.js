const apiService = require('../../service/request')

Page({
  data: {
    detail: {},
    isCollect: false,
    isValue: false,
    comment: '',
    tid: '',
    commentList: [],
    focus: false,
    isLogin: false
  },
  onLoad(options) {
    this.handleDetail(options.id)
    this.handleComment(options.id)
    this.setData({
      tid: options.id
    },() => {
      this.handleIsLogin()
    })
    
  },
  // 判断用户是否登录
  handleIsLogin() {
    let _this = this
    let {tid} = _this.data
    wx.getStorageInfo({  
      success(res) {
        if(res.keys.indexOf("token") != -1){
          _this.setData({
            isLogin: true
          })
          _this.handleCollect(tid)
          _this.handleBroes(tid)
        }else {
          _this.setData({
            isLogin: false
          })
        }
      }
    })
  },
  // 获取详情数据
  handleDetail(id) {
    apiService.getBookDetail({tid:id}).then((res) => {
      if(res.code === 200) {
        let detail = {
          ...res.data,
          comment: res.total
        }
        this.setData({
          detail
        })
      }
    })
  },
  // 获取评论列表
  handleComment(id) {
    apiService.getCommentList({tid:id}).then((res) => {
      if(res.code === 200) {
        this.setData({
          commentList: res.data
        })
      }
    })
  },
  // 浏览埋点
  handleBroes(id) {
    apiService.getHistory({tid: id})
  },
  // 实时获取表单值
  handleIpnut(e) {
    let value = e.detail.value
    if(value == '') {
      this.setData({
        isValue: false
      })
    }else {
      this.setData({
        isValue: true
      })
    }
    this.setData({
      comment: value
    })
  },
  // 添加评论
  handleSend() {
    let {comment,tid,isLogin} = this.data
    if(!isLogin) {
      this.handleShowModal()
      return
    }
    let params = {
      tid,
      retext: comment
    }
    let _this = this
    apiService.getAddComment(params).then((res) => {
      if(res.code === 200) {
        _this.setData({
          comment: '',
          focus: false
        })
        _this.handleComment(tid)
      }
    })
  },
  // 判断是否收藏
  handleCollect(id) {
    let _this = this
    apiService.getIsCollect({tid: id}).then((res) => {
      if(res.code === 200) {
        _this.setData({
          isCollect: res.data.isCollect == "0" ? false : true
        })
      }
    })
  },
  // 收藏/取消收藏
  handleIsCollect() {
    let{ isCollect,tid,isLogin } = this.data
    if(isLogin) {
      this.setData({
        isCollect: !isCollect
      })
      apiService.getCollect({tid,isCollect: isCollect ? '0' : '1'}).then((res) => {
        if(res.code === 200) {
          if(isCollect) {
            wx.showToast({
              title: '已取消收藏，无法在收藏记录中查看',
              icon: 'none',
              duration: 2000,
              mask: 'true'
            })
          }else {
            wx.showToast({
              title: '已收藏，可以在收藏记录中查看',
              icon: 'none',
              duration: 2000,
              mask: 'true'
            })
          }
          
        }
      })
    }else {
      this.handleShowModal()
    } 
  },
  handleShowModal() {
    wx.showModal({
      title: '提示',
      content: '您还没有登录,请先登录再来收藏吧！',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  }
})
