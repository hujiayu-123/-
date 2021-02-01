const apiService = require('../../service/request') // 导入接口文件

Page({
  data: {
    isVerCode: false, // 获取验证码按钮样式
    second: 60, // 获取验证码按钮倒计时
    formValue: { // 表单值
      mobile: '',
      password : '',
      code: ''
    },
    authCode: '', // 验证码
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
  // 获取验证码
  handleCode() {
    let {formValue} = this.data
    if(formValue.mobile =='' || formValue.password =='') { // 验证信息是否都输入了
      wx.showToast({
        title: '请补全注册信息',
        icon: 'none',
        duration: 2000,
        mask: 'true'
      })
      return
    }
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/; // 验证手机号是否正确
    if(!myreg.test(formValue.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000,
        mask: 'true'
      })
      return
    }
    this.setData({
      isVerCode: true,
    })
    this.handleCountDown()
    apiService.getCode({number:Number(formValue.mobile)}).then((res) => {
      if(res.code === 200) {
        this.setData({
          authCode: res.authCode
        })
      }
    })
  },
  // 获取验证码倒计时
  handleCountDown() {
    let _this = this
    let second = this.data.second
    second = Number(second) - 1
    setTimeout(()=> {
      _this.setData({
        second
      })
      if(second === -1) {
        _this.setData({
          isVerCode: false
        })
      }else{
        _this.handleCountDown()
      }
    },1000)
  },
  // 提交表单注册
  handleRegister() {
    let {formValue,authCode } = this.data
    if(formValue.mobile =='' || formValue.password =='' || formValue.code == '') {
      wx.showToast({
        title: '请补全注册信息',
        icon: 'none',
        duration: 2000,
        mask: 'true'
      })
      return
    }
    if(formValue.code != authCode){
      wx.showToast({
        title: '验证码错误',
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
    apiService.getRegister(formValue).then((res) => {
      if(res.code === 200) {
        wx.hideLoading()
        wx.navigateTo({
          url: `/pages/login/login`,
        })
      }
    })
  }
})
