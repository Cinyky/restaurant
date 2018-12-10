let cf = require("../config.js");
module.exports = {
  // 获取游戏信息
  getGameInfo: {
    url: cf.config.configUrl + "wordsgame/getGameInfo.html",
    data: {
      wid: cf.config.wid
    },
    method: 'POST'
  },
  //抽字
  getWord:{
    url:cf.config.configUrl + "wordsgame/getWord.html",
    data:{
      wid:cf.config.wid
    },
    method:'POST'
  },
  //是否中奖
  ifPrize:{
    url:cf.config.configUrl + "wordsgame/ifPrize.html",
    data:{
      wid:cf.config.wid
    },
    method:'POST'
  },
  //助力抽字
  getHelpInfo:{
    url:cf.config.configUrl + "wordsgame/getHelpInfo.html",
    data:{
      wid:cf.config.wid
    },
    method:'POST'
  },
};