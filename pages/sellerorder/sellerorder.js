let app = getApp();
let $ = require("../../utils/util.js");
let templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, templateMethods, {
  data: {
    tabIndex: 1,
    hasMore: true,
    page: 0,
    orderList: [],
    loading: false,
  },
  onLoad: function (params) {
    this.setMenu(this);
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({url: '/pages/sellerlogin/sellerlogin'});
    }
    let tabIndex = 1;
    if (params.tabIndex) {
      tabIndex = params.tabIndex;
    }
    this.setData({
      tabIndex: tabIndex
    });
  },
  onShow(){
    let t=this;
    let td=t.data;
    this.setData({
      tabIndex: td.tabIndex,
      page: 0,
      orderList: [],
      hasMore: true,
      loading: false,
    });
    // console.log(this.data.page);
    this.getOrderList();
  },
  changeTab(e) {
    console.log(e);
    let dataset = e.currentTarget.dataset;
    let tabIndex = dataset.tabIndex;
    this.setData({
      tabIndex: tabIndex,
      page: 0,
      orderList: [],
      hasMore: true,
      loading: false,
    });
    this.getOrderList();
  },
  scrollBottom() {
    let t=this;
    if(t.data.hasMore){
      t.getOrderList();
    }
  },
  getOrderList() {
    let t = this;
    let tData = t.data;
    if (tData.loading) {
      return false;
    }
    t.setData({
      loading: true
    });
    // 准备参数
    let page = tData.page;
    let tabIndex = tData.tabIndex;
    // 制作请求OBJ
    let orderObj = sellerAPI.orderList;
    orderObj.data = Object.assign({}, orderObj.data, {
      page: page,
      tabIndex: tabIndex,
    });
    orderObj.success = function (resp) {
      let data = resp.data;
      let respList = data.data;
      console.log(respList);
      // 设置参数
      let orderList = tData.orderList;
      let newOrderList = [...orderList, ...respList];
      t.setData({
        page: page + 1,
        hasMore: (respList.length != 0),
        orderList: newOrderList,
      });
    };
    orderObj.complete = function () {
      wx.hideLoading();
      t.setData({
        loading: false
      });
    };
    wx.showLoading({
      title: '加载中',
      mask: 1
    });
    wx.request(orderObj);
  },
}));