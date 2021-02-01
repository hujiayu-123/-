const apiService = require('../../service/request') // 导入接口文件

Page({
  data: {
    formValue: {
      mobile: '',
      password: ''
    }
  },
  onLoad() {
    
  },
  // 实时保存input的值
  handleInput(e) {
    let name = e.currentTarget.dataset['name']
    let formValue = this.data.formValue
    formValue[name] = e.detail.value
    this.setData({
      formValue
    })
  },
  // 登录
  handleLogin() {
    let {formValue } = this.data
    if(formValue.mobile =='' || formValue.password =='') {
      wx.showToast({
        title: '请补全登录信息',
        icon: 'none',
        duration: 2000,
        mask: 'true'
      })
      return
    }
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if(!myreg.test(formValue.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000,
        mask: 'true'
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    }) 
    apiService.getLogin(formValue).then((res) => {
      if(res.code === 200) {
        wx.hideLoading()
        wx.setStorage({
          key: 'userInfo',
          data: JSON.stringify(res.data)
        })
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  },
  // 跳转注册页
  handleToRegister() {
    wx.navigateTo({
      url: `/pages/register/register`,
    })
  }
})
