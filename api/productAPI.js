var cf = require("../config.js");
module.exports = {
  GetProductInfo: {
    url: cf.config.configUrl + "proudctWebService/GetProductInfo.html",
    post: {wid: cf.config.wid, openId: "?", proId: "?", eventId: "?"}
  },
  GetProductList: {
    url: cf.config.configUrl + "proudctWebService/GetProductList.html",
    post: {wid: cf.config.wid, cid: "?", pname: "?", orderby: "?", sort: "?", isnew: "?", pageindex: "?"}
  },
  GetProductlistSpc: {
    url: cf.config.configUrl + "proudctWebService/GetProductlistSpc.html",
    post: {wid: cf.config.wid, Spec: "?", eventId: "?", proId: "?"}
  },
  AddAttention: {
    url: cf.config.configUrl + "userWebService/AddUserAttention.html",
    post: {wid: cf.config.wid, openId: "?", proId: "?"}
  },
  DelUserAttention: {
    url: cf.config.configUrl + "userWebService/DelUserAttention.html",
    post: {wid: cf.config.wid, openId: "?", proId: "?"}
  },
  getProductCommentList: {
    url: cf.config.configUrl + "ShoppingCartWebService.asmx/getProductCommentList",
    post: {wid: cf.config.wid, ProductNumber: "?", VendorId: "?", Grade: "?", pageIndex: "?"}
  },
  GetGroupsList: {
    url: cf.config.configUrl + "proudctWebService/GetGroupsList.html",
    post: {wid: cf.config.wid, cid: "?", pname: "?", orderby: "?", sort: "?", isnew: "?", pageindex: "?"}
  },
  GetEvaluationList: {
    url: cf.config.configUrl + "orderWebService/GetEvaluationList.html",
    post: {wid: cf.config.wid, product_id:null,page:null}
  },
  GetAccessToken:{
    url: cf.config.configUrl+'proudctWebService/GetAccessToken.html',
    method: 'POST',
    data:{
      wid:cf.config.wid
    }
  }
};