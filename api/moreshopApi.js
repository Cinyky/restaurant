let cf         = require("../config.js");
module.exports = {
  // 上传图片
  uploadImg   : {
    url   : cf.config.configUrl + "moreshop/uploadImg.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //提交加入申请
  getSellerin : {
    url   : cf.config.configUrl + "moreshop/getSellerin.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //获取基础配置
  getSetting  : {
    url   : cf.config.configUrl + "moreshop/getSetting.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //判断是否已经申请
  is_apply    : {
    url   : cf.config.configUrl + "moreshop/is_apply.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //获取商店列表
  getShopList : {
    url   : cf.config.configUrl + "moreshop/getShopList.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //加入付款
  paySellerIn : {
    url   : cf.config.configUrl + "moreshop/paySellerIn.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //获取商店具体信息
  getShopInfo : {
    url   : cf.config.configUrl + "moreshop/getShopInfo.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //优惠买单
  paycheap    : {
    url   : cf.config.configUrl + "moreshop/paycheap.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //获取商品列表
  getGoodsList: {
    url   : cf.config.configUrl + "moreshop/getGoodsList.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //提交订单
  subOrder    : {
    url   : cf.config.configUrl + "moreshop/subOrder.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //获取订单列表
  getOrderList: {
    url   : cf.config.configUrl + "moreshop/getOrderList.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //申请退款
  refundMoney:{
    url   : cf.config.configUrl + "moreshop/refundMoney.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //确认收货
  receive:{
    url   : cf.config.configUrl + "moreshop/receive.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //提交评论
  subComment:{
    url   : cf.config.configUrl + "moreshop/subComment.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  }
};