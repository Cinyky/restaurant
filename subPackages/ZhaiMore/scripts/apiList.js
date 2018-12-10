let cf         = require("../../../config.js");
module.exports = {
  getSetting   : {
    url   : cf.config.configUrl + "ZhaiMore/getSetting.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getShopInfo  : {
    url   : cf.config.configUrl + "ZhaiMore/getShopInfo.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getShopDetail: {
    url   : cf.config.configUrl + "ZhaiMore/getShopDetail.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  addUserInfo  : {
    url   : cf.config.configUrl + "ZhaiMore/addUserInfo.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getAgentList : {
    url   : cf.config.configUrl + "ZhaiMore/getAgentList.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getAgentInfo : {
    url   : cf.config.configUrl + "ZhaiMore/getAgentInfo.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getShopAgent : {
    url   : cf.config.configUrl + "ZhaiMore/getShopAgent.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getXiaoQu    : {
    url   : cf.config.configUrl + "ZhaiMore/getXiaoQu.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  // 上传图片
  uploadImg    : {
    url   : cf.config.configUrl + "ZhaiMore/uploadImg.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  submitForm   : {
    url   : cf.config.configUrl + "ZhaiMore/submitForm.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  submitForm2   : {
    url   : cf.config.configUrl + "ZhaiMore/submitForm2.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getFang      : {
    url   : cf.config.configUrl + "ZhaiMore/getFang.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  collect      : {
    url   : cf.config.configUrl + "ZhaiMore/collect.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getAgentFang:{
    url   : cf.config.configUrl + "ZhaiMore/getAgentFang.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getSearchList:{
    url   : cf.config.configUrl + "ZhaiMore/getSearchList.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  getFaBu:{
    url   : cf.config.configUrl + "ZhaiMore/getFaBu.html",
    data  : {
      wid: cf.config.wid
    },
    method: 'POST'
  }
};