var cf = require("../config.js");
module.exports = {
    GetShopInfo: {
        url: cf.config.configUrl + "shopWebService/GetShopInfo.html",
        postData: {
            wid: cf.config.wid
        }
    },
    AddNewUserAndGetShopInfo: {
        url: cf.config.configUrl + "userWebService/AddNewUserAndGetShopInfo.html",
        post: {
            wid: cf.config.wid,
            NickName: "?",
            sex: "?",
            photo: "?",
            WXCountry: "?",
            WXCity: "?",
            code: "?",
            WXProvince: "?",
            Uid: "?",
            storeId: "?"
        }
    },
    GetIndexData: {
        url: cf.config.configUrl + "indexWebService/GetIndexData.html",
        post: {
            wid: cf.config.wid,
            PageId: "?",
            lat: "?",
            lng: "?"
        }
    },
    GetIndexAnimation: {
        url: cf.config.configUrl + "indexWebService/GetIndexAnimation.html",
        postData: {
            wid: cf.config.wid
        }
    },
    GetIndexKeyWords: {
        url: cf.config.configUrl + "indexWebService/GetIndexKeyWords.html",
        postData: {
            wid: cf.config.wid
        }
    },
};