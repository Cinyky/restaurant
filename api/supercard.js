var cf = require("../config.js");
module.exports = {
  getSupercard:{
    url: cf.config.configUrl + "supercard/getSupercard.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  support:{
    url: cf.config.configUrl + "supercard/support.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getSupercardBox:{
    url: cf.config.configUrl + "supercard/getSuperCardBox.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  delSupercard:{
    url: cf.config.configUrl + "supercard/delSuperCard.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getSuperCardConfig:{
    url: cf.config.configUrl + "supercard/getSuperCardConfig.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getSuperCardTalkSign:{
    url: cf.config.configUrl + "supercard/getSuperCardTalkSign.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  sendQiYeMessage:{
    url: cf.config.configUrl + "supercard/sendQiyeMessage.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  saveSuperCardtoVistor:{
    url: cf.config.configUrl + "supercard/saveSuperCardtoVistor.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  sharCountAdd:{
    url: cf.config.configUrl + "supercard/shareCountAdd.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  sendTalkMsg:{
    url: cf.config.configUrl + "supercard/sendTalkMsg.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  receiverTalkMsg:{
    url: cf.config.configUrl + "supercard/receiverTalkMsg.html",
      data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  saveCardEvent:{
    url: cf.config.configUrl + "supercard/saveCardEvent.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  saveTalkImage:{
    url: cf.config.configUrl + "supercard/saveTalkImage.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getSupercardFriends:{
    url: cf.config.configUrl + "supercard/getSupercardFriends.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  supercardFriendsSupport:{
    url: cf.config.configUrl + "supercard/supercardFriendsSupport.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  supercardFriendsComment:{
    url: cf.config.configUrl + "supercard/supercardFriendsComment.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  saveSendTplParams:{
    url: cf.config.configUrl + "supercard/saveSendTplParams.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
};