const apiService = require('../../service/request')
import { host } from '../../service/api'
const app = getApp()

Page({
  data: {
    fileList: [],
    userInfo: {},
    name: '昵称'
  },
  onShow() { // 只要路由变化就获取当前的用户信息回显
    if(app.globalData.isPreViewApi) {return false}
    let _this = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        let userInfo = JSON.parse(res.data)
        let fileList = []
        if(userInfo.avater) {
          fileList.push({url:userInfo.avater});
        }
        _this.setData({
          userInfo: res.data,
          fileList,
          name: userInfo.name ? userInfo.name : '昵称'
        })
      }
    })
    app.globalData.isPreViewApi = true
  },
  // 上传图片
  afterRead:function(event){
    wx.showLoading({
      title: '加载中',
      mask: true
    }) 
    let _this = this
    const { file } = event.detail;
    wx.uploadFile({
      url: host+'/upload/upload',
      filePath: file.url,
      name: 'file',
      formData: { file: file },
      success(res) {
        // 上传完成需要更新 fileList
        let data = JSON.parse(res.data)
        let fileList = []
        fileList.push({url:host+'/'+data.data});
        _this.setData({fileList},() => {
          _this.handleSubmit()
        }) 
      },
    });
  },
  // 删除图片
  deleteImg(file) {
    this.setData({fileList:[]})
  },
  // 修改图片
  handleSubmit() {
    let {fileList} = this.data
    apiService.getBasic({avater: fileList[0].url}).then((res) => {
      if(res.code === 200) {
        wx.hideLoading()
        wx.getStorage({
          key: 'userInfo',
          success: function(res) {
            let userInfo = JSON.parse(res.data)
            userInfo.avater = fileList[0].url
            wx.setStorage({
              key: 'userInfo',
              data: JSON.stringify(userInfo)
            })
          }
        })
      }
    })
  },
  // 跳转修改昵称
  handleToEditName() {
    wx.navigateTo({
      url: '/pages/editName/editName'
    })
  },
  // 跳转修改密码
  handleToEditPwd() {
    wx.navigateTo({
      url: '/pages/editPwd/editPwd'
    })
  },
  // 退出登录
  handleLogout() {
    wx.reLaunch({
      url: '/pages/login/login'
    })
    wx.clearStorage()
  }
})