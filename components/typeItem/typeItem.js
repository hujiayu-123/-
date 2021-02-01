const apiService = require('../../service/request')
const app = getApp()

Component({
  properties: {
    listitem: Object,
  },
  data: {
    isRole: false
  },
  ready() {
    this.setData({
      isRole: app.globalData.isRole
    })
  },
  methods: {
    handleClick(e) {
      let id = e.currentTarget.dataset['id']
      this.triggerEvent("click",id)
    },
    handleEdit(e) {
      let data = e.currentTarget.dataset['item']
      wx.navigateTo({
        url: `/pages/addType/addType?item=${JSON.stringify(data)}`,
      })
    },
    handleDel(e) {
      let id = e.currentTarget.dataset['id']
      let _this = this
      wx.showModal({
        title: '提示',
        content: '删除之后不可恢复，您确定要删除吗？',
        success(res) {
          if (res.confirm) {
            apiService.getDelType({sid: id}).then((res) => {
              if(res.code === 200) {
                _this.triggerEvent('update')
              }
            })
          }
        }
      })
    },
  }
})
