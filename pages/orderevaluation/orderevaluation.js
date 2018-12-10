var app = getApp(),
  $ = require("../../utils/util.js"),
  orderapi = require("../../api/orderAPI.js");
Page({
  data: {
    orderInfo: {},
    products: [],
    evaluations: {},
    // 按钮的禁用状态
    submitBtnDisabled: true,
    starNum: [1, 2, 3, 4, 5]
  },
  onLoad: function (params) {
    app.globalData.getTop();
    let that = this;
    const orderId = params['orderid'];
    //接下来请求到订单信息+商品信息
    that.getOrderInfo(orderId);
  },
  // 获取订单和订单所拥有的商品信息
  getOrderInfo(orderid) {
    let that = this;
    const apiInfo = orderapi.GetOrderToEvaluate;
    const api = {
      url: apiInfo.url,
      data: Object.assign(apiInfo.post, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        orderid: orderid
      }),
      method: 'POST',
      success(resp) {
        const data = resp.data;
        console.log('请求订单和商品信息成功', data);
        const products = data.items;
        let evaluations = {};
        for (let product of products) {
          evaluations[product['ProductId']] = {
            content: null,
            star: 3
          };
        }
        that.setData({
          orderInfo: data,//订单信息
          products,//商品列表
          evaluations,//评论列表
        });
      },
      fail() {
        console.log('请求订单和商品信息失败');
      }
    };
    wx.request(api);
  },
  // 商品评论输入
  evaluationInput(e) {
    let that = this;
    const productId = e.currentTarget.dataset.productId;
    const value = e.detail.value;
    let evaluations = that.data.evaluations;
    evaluations[productId]['content'] = value;
    that.setData({
      evaluations
    });
    that.checkSubmit();
  },
  // 输入的时候检测是否符合提交的条件
  checkSubmit() {
    let that = this;
    let evaluations = that.data.evaluations;
    let flag = false;
    for (let e in evaluations) {
      if (evaluations.hasOwnProperty(e)) {
        if (!evaluations[e]) {
          flag = true;
        }
      }
    }
    that.setData({
      submitBtnDisabled: flag,
    })
  },
  selectStar(e) {
    const starNum = e.currentTarget.dataset.starNum;
    const productId = e.currentTarget.dataset.productId;
    let evaluations = this.data.evaluations;
    evaluations[productId]['star'] = starNum;
    this.setData({
      evaluations
    })
  },
  // 提交商品评价
  submitEvaluationWrap(e){
    let formId=e.detail.formId;
    this.submitEvaluation(formId);
  },
  submitEvaluation(formId) {
    let that = this;
    const api = orderapi.SubmitOrderEvaluate;
    const evaluations = that.data.evaluations;
    const requestObj = {
      url: api.url,
      method: 'POST',
      data: Object.assign(api.post, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        orderid: that.data.orderInfo.id,
        formId:formId,
        evaluations,
      }),
      success(resp) {
        const data = resp.data;
        console.log('评价响应数据', data);
        wx.navigateTo({
          url:'/pages/orderlist/orderlist?type=5&sl=4'
        })
      },
      fail() {
        console.log('请求失败');
      }
    };
    wx.request(requestObj);
  }
});