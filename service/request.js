import {urls,host} from './api'

const exceptionAddrArr = [
   host + '/login/login',
   host + '/register/reg',
   host + '/list/list',
   host + '/list/cata',
   host + '/register/code',
   host + '/list/detail',
   host + '/list/comments'
  
]
const loginApi = host + "/login/login"

function createToken(url) {
  let header = { 'content-type': 'application/json' }
  return new Promise((resolve,reject) => {
    if (exceptionAddrArr.indexOf(url) == -1) {  //排除请求的地址不需要token的地址
      let expiration=wx.getStorageSync("expiration");//拿到过期时间
      var timestamp=Date.parse(new Date());//拿到现在时间
      if(expiration<timestamp){//过期了，清空缓存，跳转到登录
        wx.clearStorageSync();//清空缓存
        wx.showToast({
          title: '用户信息过期，请重新登录',
          icon: 'none',
          duration: 2000,
          mask: 'true'
        })
        wx.redirectTo({
          url: '/pages/login/login'
        })
        return
      }
        wx.getStorageInfo({  
          success(res) {
            if(res.keys.indexOf("token") != -1){

              wx.getStorage({
                key: 'token',
                success: function (res) {
                  header.Authorization = 'Bearer ' + res.data;
                  resolve(header) 
                },
                fail: function (error) {
                  console.log(error);
                },
              });
            }else {
              wx.showToast({
                title: '您没有此权限',
                icon: 'none',
                duration: 2000,
                mask: 'true'
              })
            }
          },
        }) 
      
    } else {
      resolve(header)
    }
  })
}

const service = {
  get(url,data) {
    wx.showLoading({
      title: '加载中',
      mask: true
    }) 
    return new Promise((resolve,reject) => {
      createToken(url).then((res) => {
        wx.request({
          method: 'GET',
          url: url,
          data: data,
          header: res,
          timeout: 5000,
          success: (res) =>{
            if(res.data.code === 200) {
              // 调用接口成功
              resolve(res.data)
              wx.hideLoading()
            }else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
                mask: 'true'
              })
            }
          },
          fail: (err) => {
            // 调用接口失败
            wx.showToast({
              title: '接口调用失败,找向璇',
              icon: 'none',
              duration: 2000,
              mask: 'true'
            })
            reject(err)
          }
        })
      })
    })  
  },
  post (url,data) {
    wx.showLoading({
      title: '加载中',
      mask: true
    }) 
    return new Promise((resolve,reject) => {
      createToken(url).then((res) => {
        wx.request({
          method: 'POST',
          url: url,
          data: data,
          header: res,
          timeout: 5000,
          success: (res) =>{
            if(url === loginApi) {
              var timestamp=Date.parse(new Date())
              var expiration = timestamp + 86400000
              wx.setStorage({
                key: 'expiration',
                data: expiration
              })
              wx.setStorage({
                key: 'token',
                data: res.data.token
              })
            }
            if(res.data.code === 200) {
              // 调用接口成功
              resolve(res.data)
              wx.hideLoading()
            }else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
                mask: 'true'
              })
            }
            
          },
          fail: (err) => {
            // 调用接口失败
            wx.showToast({
              title: '接口调用失败,找向璇',
              icon: 'none',
              duration: 2000,
              mask: 'true'
            })
            reject(err)
            
          }
        })
      })
    })
    
    
  }
}

module.exports = {
  // 登录
  getLogin: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.login,data))
    })
  },
  // 注册
  getRegister: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.reg,data))
    })
  },
  // 获取验证码
  getCode: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.code,data))
    })
  },
  // 获取图书列表
  getBookList: (data) => {
     return new Promise((resolve,reject)=> {
       resolve(service.get(urls.list,data))
    })
  },
  // 获取图书详情
  getBookDetail: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.detail,data))
    })
  },
  // 获取分类列表
  getTypeList:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.cat,data))
    })
  },
  // 添加图书
  getAddBook:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.add,data))
    })
  },
  // 修改图书
  getEditBook:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.update,data))
    })
  },
  // 删除图书
  getDelBook:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.del,data))
    })
  },
  // 添加图书分类
  getAddType:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.cadd,data))
    })
  },
  // 修改图书分类
  getEditType:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.cupdate,data))
    })
  },
  // 删除图书分类
  getDelType:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.cdel,data))
    })
  },
  // 评论列表
  getCommentList:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.comment,data))
    })
  },
  // 添加评论
  getAddComment:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.reply,data))
    })
  },
  // 收藏/取消收藏
  getCollect:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.collect,data))
    })
  },
  // 判断是否收藏
  getIsCollect:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.isCollect,data))
    })
  },
  // 收藏记录
  getEnshrineList:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.enshrine,data))
    })
  },
  // 浏览记录列表
  getHisList:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.hislist,data))
    })
  },
  // 浏览记录埋点
  getHistory:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.history,data))
    })
  },
  // 修改用户信息
  getBasic:(data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.post(urls.basic,data))
    })
  },
}