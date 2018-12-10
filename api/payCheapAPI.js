let cf = require("../config.js");
module.exports = {
  //获取转账页面的配置信息
  getPayCheapInfo:{
    url:cf.config.configUrl+"payCheap/payCheap.html",
    data:{
      wid:cf.config.wid
    },
    method:'POST'
  },
  pay:{
    url:cf.config.configUrl+"payCheap/pay.html",
    data:{
      wid:cf.config.wid
    },
    method:'POST'
  }
};