import { host } from '../../service/api'
const apiService = require('../../service/request') // 导入接口文件
var app = getApp()

Page({
  data: {
    formValue: {  // 表单
      auther: '',
      title: '',
      content: '',
      catalog: '',
      sid: '',
      link: ''
    },
    fileList:[],  // 上传图片
    btnTtx: '保 存',
    stuats: 1,
    link: ''
  },
  onLoad(options) {
    let item = options.item
    if(item) {
      item = JSON.parse(item)
      this.handleEcho(item) // 如果是编辑的 就回显数据
    }else {
      this.setData({
        btnTtx: '保 存',
        stuats: 1
      })
    }
  },
  // 记录回传的分类值
  onShow() {
    let item = this.data.typeItem
    if(item) {
      let {formValue} = this.data
      formValue.catalog = item.catalog
      formValue.sid = item.sid
      this.setData({
        formValue,
      })
    } 
  },
  // 回显数据
  handleEcho(item) {
    let formValue = {
      auther: item.auther,
      title: item.title,
      content: item.content,
      catalog: item.catalog,
      sid: item.sid,
      tid: item.tid,
      link: item.link
    }
    let fileList = []
    fileList.push({url:item.artpic});
    this.setData({
      formValue,
      fileList,
      btnTtx: '修 改',
      stuats: 2
    })
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
  // 跳转图书分类列表页
  handleToTypeList() {
    this.setData({
      link: 'typelist'
    })
    wx.navigateTo({
      url: `/pages/typeList/typeList`,
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
  // 提交表单
  handleSubmit() {
    let {formValue,fileList,stuats }= this.data
    if(formValue.title =='' || formValue.auther =='' || formValue.content == '' || formValue.catalog == '' || fileList.length == 0) {
      wx.showToast({
        title: '请补全文章信息',
        icon: 'none',
        duration: 2000,
        mask: 'true'
      })
      return
    }
    let params = {
      ...formValue,
      artpic: fileList[0].url
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    }) 
    let _this = this
    let url = ''
    if(stuats === 1) {
      url = 'getAddBook'
    }else {
      url = 'getEditBook'
    }
    apiService[url](params).then((res) => {
      if(res.code === 200) {
        app.globalData.editInfo = null
        let id = params.tid?params.tid:res.data
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '发布成功啦，快去看看吧！',
          confirmText: '去查看',
          cancelText: '再写一篇',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `/pages/detail/detail?id=${id}`,
              })
            }else if (res.cancel) {
              let formValue = {
                auther: '',
                title: '',
                content: '',
                catalog: '',
                sid: '',
                link: ''
              }
              _this.setData({
                formValue,
                fileList: []
              })
            }
          }
        })
      }
    })
  }
})
