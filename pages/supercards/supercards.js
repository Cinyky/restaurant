// pages/cards/cards.js
const app = getApp();
const api = require('../../api/supercard.js')
var templateMethods = require("../../utils/template_methods.js")

Page(Object.assign({}, {

  /**
   * 页面的初始数据
   */
  data: {
    pageData: []
  },

  /** 获取页面数据 */
    getData: function () {
      wx.showNavigationBarLoading()
      wx.request({
        url: api.getSupercardBox.url,
        data: Object.assign({}, {
          openid: app.globalData.UserInfo.WeiXinOpenId,
        }, api.getSupercard.data),
        method: 'POST',
        success: res => {
          console.log()
          if (res.data.success) {
            this.setData({
              pageData: res.data.data
            })
          } else {
            wx.showModal({
              title: '出错啦',
              content: res.message,
              showCancel: false
            })
          }
          wx.hideNavigationBarLoading()
        }
    })

    // 假数据
    // this.setData({
    //   pageData: testData
    // })
  },

  /** 置顶 / 取消置顶 */
  stickCard: function (e) {
    const index = e.currentTarget.id;
    let data = this.data.pageData.slice();

    // 如果需要请求
    // wx.showLoading({mask: true})
    // request({
    //   url: '',
    //   data: {id: data[index].id},
    //   method: 'GET',
    //   success: res => {
    //     if (res.success) {
    //       if (data[index].star_status) {
    //         data[index].star_status = 0;
    //         wx.showToast({
    //           title: '取消星标成功',
    //           icon: 'none'
    //         })
    //       } else {
    //         data[index].star_status = 1;
    //         wx.showToast({
    //           title: '星标成功',
    //           icon: 'none'
    //         })
    //       }
    //       data[index].update_time = utils.formatTime(new Date);
    //       this.setData({
    //         pageData: data
    //       })
    //     } else {
    //       wx.showModal({
    //         title: '操作失败',
    //         content: res.message,
    //         showCancel: false
    //       })
    //     }
    //     wx.hideLoading()
    //   }
    // })

    // 假数据
    if (data[index].star_status) {
      data[index].star_status = 0;
      wx.showToast({
        title: '取消星标成功',
        icon: 'none'
      })
    } else {
      data[index].star_status = 1;
      wx.showToast({
        title: '星标成功',
        icon: 'none'
      })
    }
    data[index].update_time = utils.formatTime(new Date);
    this.setData({
      pageData: data
    })

  },

  /** 屏蔽 */
  shieldCard: function (e) {
    const index = e.currentTarget.id;
    //如果需要请求
    wx.showLoading({mask: true})
    wx.request({
      url: api.delSupercard.url,
      data:  Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        id:index,
      }, api.getSupercard.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          this.getData()
        } else {
          wx.showModal({
            title: '操作失败',
            content: res.message,
            showCancel: false
          })
        }
        wx.hideLoading()
      }
    })
  },
  // 假数据
  // data.splice(index, 1);
  // this.setData({
  //   pageData: data
  // })


  gotoCardDetail:function(e){
      let cardId = e.currentTarget.id
      wx.navigateTo({
        url: '/pages/supercard/supercard?card_id='+cardId
      });
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.getTop();
     this.setMenu(this);
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
}, templateMethods));