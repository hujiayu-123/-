export const host = 'https://37k09696v7.goho.co'

export const urls = {
  login: host + '/login/login',// 登录
  reg: host + '/register/reg', // 注册
  code: host + '/register/code', //获取验证码
  list: host + '/list/list', // 图书列表
  detail: host + '/list/detail', //文章详情列表
  cat: host + '/list/cata', // 图书分类列表
  add: host + '/article/add', // 添加图书
  update: host + '/article/update', // 修改图书
  del: host + '/article/del',// 删除图书
  cadd: host + '/catalog/add', // 添加图书分类
  cupdate: host + '/catalog/update', // 修改图书分类
  cdel: host + '/catalog/del',// 删除图书分类
  comment: host + '/list/comments',// 获取评论列表
  reply: host + '/comments/reply', //添加评论
  collect: host + '/users/set-collect',// 收藏/取消收藏
  isCollect: host + '/users/collect',// 判断是否收藏
  enshrine: host + '/users/enshrine',// 收藏记录
  hislist: host + '/users/hislist',// 浏览记录列表
  history: host + '/users/history',// 浏览记录埋点
  basic: host + '/users/basic',// 修改用户信息
}