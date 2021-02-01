import { host } from '../../service/api'
const apiService = require('../../service/request') // 导入接口文件

Page({
  data: {
    fileList: [],
    formValue: {
      catalog: '',
      sid: ''
    },
    status: 1,
    btnTtx: '添 加'
  },
  onLoad(options) {
    let item = options.item
    if(item) {
      item = JSON.parse(item)
      let formValue = {
        catalog: item.catalog,
        sid: item.sid
      }
      this.setData({
        formValue,
        status: 2,
        btnTtx: '修 改'
      })
    }else {
      this.setData({
        status: 1,
        btnTtx: '保 存'
      })
    }
  },
  // 实时记录表单值
  handleInput(e) {
    let name = e.currentTarget.dataset['name']
    let formValue = this.data.formValue
    formValue[name] = e.detail
    this.setData({
      formValue
    }) 
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
        wx.hideLoading()
        // 上传完成需要更新 fileList
        let data = JSON.parse(res.data)
        const{fileList=[]} = _this.data;
        fileList.push({url:host+'/'+data.data});
        _this.setData({fileList})
      },
    });
  },
  // 删除图片
  deleteImg(file) {
    this.setData({fileList:[]})
  },
  // 表单提交
  handleSubmit() {
    let { fileList,status,formValue } = this.data
    if(fileList.length === 0 || formValue.catalog == '') {
      wx.showToast({
        title: '请补全图书分类信息',
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
    let url = ''
    let params = {
      ...formValue,
      catapic: fileList[0].url
    }
    if(status === 1) {
      url = 'getAddType'
    }else {
      url = 'getEditType'
    }
    if(!params.sid) {
      delete params.sid
    }
    apiService[url](params).then((res) => {
      if(res.code === 200) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '发布成功!',
          confirmText: '返回',
          showCancel: false,
          success(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  }
})