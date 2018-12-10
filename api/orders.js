var cf = require("../config.js");
module.exports = {
  orderlist: {
    url: cf.config.configUrl + "reserveService/GetReserveList.html",
    post: { wid: cf.config.wid, PageId: "?", pageindex:"?" }
  },
  orderdeta:{
    url: cf.config.configUrl + "reserveService/GetReserveInfo.html",
    post: { wid: cf.config.wid, PageId: "?",id:"?" }
  },
  orderserv:{
    url: cf.config.configUrl + "reserveService/GetShopList.html",
    post: { wid: cf.config.wid, PageId: "?", pageindex:"?"}
  },
  orderwork:{
    url: cf.config.configUrl + "reserveService/GetWorksList.html",
    post: { wid: cf.config.wid, PageId: "?", pageindex: "?", reserveId:"?"}
  },
  orderadd: {
    url: cf.config.configUrl + "reserveService/ReserveOperation.html",
    post: { wid: cf.config.wid, openid: "?",reserveId: "?", serviceId: "?", users: "?", telephone:"?",names:"?",num:"?",times:"?"}
  },
  reserveSeed: {
    url: cf.config.configUrl + "reserveService/ReserveSeed.html",
    post: { wid: cf.config.wid, openid: "?",pageindex:"?" }
  },
  reserveExpired: {
    url: cf.config.configUrl + "reserveService/ReserveExpired.html",
    post: { wid: cf.config.wid, openid: "?", pageindex: "?" }
  },
  reserveToEvaluated: {
    url: cf.config.configUrl + "reserveService/ReserveToEvaluated.html",
    post: { wid: cf.config.wid, openid: "?", pageindex: "?" }
  },
  reserveEvaluated: {
    url: cf.config.configUrl + "reserveService/ReserveEvaluated.html",
    post: { wid: cf.config.wid, openid: "?", pageindex: "?", evaluate:"?",id:"?"}
  },
  cancelOrder: {
    url: cf.config.configUrl + "reserveService/CancelOrder.html",
    post: { wid: cf.config.wid, openid: "?", pageindex: "?",id:"?"}
  }
};