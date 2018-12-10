const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
const kefuAPI = require('../../api/kefuAPI');
let itv=null;
Page(Object.assign({}, {
  data: {
    list: null,
    loading:false,
  },
  onLoad: function (options) {
    this.setMenu(this);
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({url: '/pages/sellerlogin/sellerlogin'});
    }
  },
  loadList(showLoading=false) {
    console.log('刷新消息列表');
    let t = this,td=this.data;
    if(td.loading) return false;
    t.setData({loading:true});
    let api = kefuAPI.list;
    if(showLoading){
      wx.showLoading({title:'加载中...'});
    }
    wx.request({
      url: api.url,
      method: 'POST',
      data: Object.assign({}, api.data, {}),
      success(resp) {
        let rData = resp.data;
        let data = rData.data;
        console.log(rData);
        console.log(data);
        if (rData.status != 'success') {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: false
          });
        } else {
          // 加载数据
          t.setData({
            list: data
          });
        }
      },
      complete() {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        t.setData({loading:false});
      }
    });
  },
  onShow: function () {
    let t = this;
    t.loadList(true);
    itv=setInterval(function  () {
      t.loadList();
    },10000)
  },
  onHide(){
    console.log('清除列表刷新定时器');
    clearInterval(itv);
  },
  onUnload(){
    console.log('清除列表刷新定时器');
    clearInterval(itv);
  },
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    this.loadList();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
}, templateMethods));