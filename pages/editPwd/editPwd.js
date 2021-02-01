const apiService = require('../../service/request')
const app = getApp()

Page({
  data: {
    isActive: false,
    formValue: {
      usedPwd: "",
      newPwd: "",
      okPwd: ""
    },
    errMsg: ''
  },
  onShow() {
    if(app.globalData.isPreViewApi) {
      app.globalData.isPreViewApi = false
    }
  },
  // 实时获取表单的值
  handleInput(e) {
    let name = e.currentTarget.dataset['name']
    let {formValue} = this.data
    formValue[name] = e.detail
    this.setData({
      formValue,
      isActive: true,
      errMsg: ''
    })
    if(e.detail === "") {
      this.setData({
        isActive: false
      })
    }
  },
  handleSubmit() {
    let {formValue} = this.data
    if(formValue.usedPwd == "" || formValue.newPwd == "" || formValue.okPwd == "") {
      wx.showToast({
        title: '请补表单信息',
        icon: 'none',
        duration: 2000,
        mask: 'true'
      })
      return
    }
    if(formValue.newPwd !== formValue.okPwd) {
      this.setData({
        errMsg: "两次输入的密码不一致"
      })
      return
    }
    let password = {
      oldpwd: formValue.usedPwd,
      newpwd: formValue.newPwd
    }
    apiService.getBasic({password}).then((res) => {
      if(res.code === 200) {
        wx.showToast({
          title: '密码修改成功，请重新登录',
          duration: 2000,
          mask: 'true'
        })
        wx.reLaunch({
          url: '/pages/login/login'
        })
        wx.clearStorage()
      }
    })
  }
})