let cf = require("../config.js");
module.exports = {
  getSetting: {
    url: cf.config.configUrl + "tc/getSetting.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getCateList: {
    url: cf.config.configUrl + "tc/getCateList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getCate: {
    url: cf.config.configUrl + "tc/getCate.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getImgList: {
    url: cf.config.configUrl + "tc/getImgList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getNoticeList: {
    url: cf.config.configUrl + "tc/getNoticeList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  uploadImg: {
    url: cf.config.configUrl + "tc/uploadImg.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  submitMsg: {
    url: cf.config.configUrl + "tc/submitMsg.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMsgByTime: {
    url: cf.config.configUrl + "tc/getMsgByTime.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMsgByCate: {
    url: cf.config.configUrl + "tc/getMsgByCate.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMyMsg: {
    url: cf.config.configUrl + "tc/getMyMsg.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMsgByWord: {
    url: cf.config.configUrl + "tc/getMsgByWord.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMsgByDistance: {
    url: cf.config.configUrl + "tc/getMsgByDistance.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMsgByFav: {
    url: cf.config.configUrl + "tc/getMsgByFav.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMsgById: {
    url: cf.config.configUrl + "tc/getMsgById.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  setUp: {
    url: cf.config.configUrl + "tc/setUp.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  setComment: {
    url: cf.config.configUrl + "tc/setComment.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getUser: {
    url: cf.config.configUrl + "tc/getUser.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  setMark: {
    url: cf.config.configUrl + "tc/setMark.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  requestPay: {
    url: cf.config.configUrl + "tc/requestPay.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  setFav: {
    url: cf.config.configUrl + "tc/setFav.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getComment: {
    url: cf.config.configUrl + "tc/getComment.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  recharge: {
    url: cf.config.configUrl + "tc/recharge.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  setInfo: {
    url: cf.config.configUrl + "tc/setInfo.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};