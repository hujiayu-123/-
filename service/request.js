import urls from './api'

const service = {
  get (url,data) {
    return new Promise((resolve,reject) => {
      wx.request({
        method: 'get',
        url: url,
        data: data,
        header: {"content-type": "application/json"},
        success: (res) =>{
          // 调用接口成功
          resolve(res)
        },
        fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  },
  post (url,data) {
    return new Promise((resolve,reject) => {
      wx.request({
        method: 'post',
        url: url,
        data: data,
        header: {"content-type": "application/x-www-form-urlencoded"},
        success: (res) =>{
          // 调用接口成功
          resolve(res)
        },
        fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  }
}

module.exports = {
  // 获取4个功能展示位
  getSales: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.sales,data))
    })
  },
  // 获取所有分类列表
  getCateList: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.cateList,data))
    })
  }
}