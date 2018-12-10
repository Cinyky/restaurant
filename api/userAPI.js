var cf = require("../config.js");
module.exports = {
    GetUserAttention: {
        url: cf.config.configUrl + "userWebService/GetUserAttention.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            currentPage: "?",
            pageSize: "?"
        }
    },
    DelUserAttention: {
        url: cf.config.configUrl + "userWebService/DelUserAttention.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            proId: "?"
        }
    },
    GetAddressList: {
        url: cf.config.configUrl + "userWebService/GetAddressList.html",
        post: {
            wid: cf.config.wid,
            openId: "?"
        }
    },
    GetAddressDetail: {
        url: cf.config.configUrl + "userWebService/GetAddressDetail.html",
        post: {
            wid: cf.config.wid,
            Id: "?"
        }
    },
    AddAddress: {
        url: cf.config.configUrl + "userWebService/AddAddress.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            consignee: "?",
            province: "?",
            city: "?",
            district: "?",
            isDefault: !1,
            detail: "?",
            phone: "?",
            seladstr: "?"
        }
    },
    EditAddress: {
        url: cf.config.configUrl + "userWebService/EditAddress.html",
        post: {
            wid: cf.config.wid,
            id: "?",
            openId: "?",
            consignee: "?",
            province: "?",
            city: "?",
            district: "?",
            detail: "?",
            isDefault: !1,
            phone: "?",
            seladstr: "?"
        }
    },
    DelAddress: {
        url: cf.config.configUrl + "userWebService/DelAddress.html",
        post: {
            wid: cf.config.wid,
            Id: "?"
        }
    },
    EditUserInfo: {
        url: cf.config.configUrl + "userWebService/UpdateUserInfo.html",
        post: {
            Id: "?",
            RealName: "?",
            identityCardNo: "?",
            Email: "?",
            Birthday: "?"
        }
    },
    GetAllPCDList: {
        url: cf.config.configUrl + "userWebService/GetAllPCDList.html",
        post: {
            wid: cf.config.wid
        }
    },
    GetUserCashInfo: {
        url: cf.config.configUrl + "userWebService/GetUserCashInfo.html",
        post: {
            wid: cf.config.wid,
            openId: "?"
        }
    },
    GetPageQRCode: {
        url: cf.config.configUrl + "userWebService/GetPageQRCode.html",
        post: {
            wid: cf.config.wid,
            UserId: "?",
            path: "?",
            width: "?"
        }
    },
    GetUserFans: {
        url: cf.config.configUrl + "userWebService/GetUserFans.html",
        post: {
            wid: cf.config.wid,
            userId: "?",
            openId: "?",
            Level: "?",
            PageIndex: "?"
        }
    },
    getDistributionRankingList: {
        url: cf.config.configUrl + "userWebService/getDistributionRankingList.html",
        post: {
            wid: cf.config.wid,
            timeType: "?"
        }
    },
    GetUserCashBonusesDetail: {
        url: cf.config.configUrl + "userWebService/GetUserCashBonusesDetail.html",
        post: {
            wid: cf.config.wid,
            userId: "?",
            TimeSpan: "?",
            PageIndex: "?"
        }
    },
    SelectUserCashAccount: {
        url: cf.config.configUrl + "userWebService/SelectUserCashAccount.html",
        post: {
            wid: cf.config.wid,
            ChangeType: "?",
            userId: "?",
            PageIndex: "?"
        }
    },
    ApplyToCash: {
        url: cf.config.configUrl + "userWebService/ApplyToCash.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            Price: "?",
            Phone: "?",
            alipayName: "?",
            alipayNum: "?"
        }
    },
    UserInfoPointTotalCashrealName: {
        url: cf.config.configUrl + "userWebService/UserInfoPointTotalCashrealName.html",
        post: {
            wid: cf.config.wid,
            openId: "?"
        }
    },
    SelectUserHaveCashAccount: {
        url: cf.config.configUrl + "userWebService/SelectUserHaveCashAccount.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            PageIndex: "?"
        }
    },
    GetVendorCoupons: {
        url: cf.config.configUrl + "userWebService/GetVendorCoupons.html",
        post: {
            wid: cf.config.wid,
            openId: "?"
        }
    },
    GetUserCouponItem: {
        url: cf.config.configUrl + "userWebService/GetUserCouponItem.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            PageIndex: "?",
            Status: "?"
        }
    },
    GetCouponLimitProduct: {
        url: cf.config.configUrl + "proudctWebService/GetCouponLimitProduct.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            PageIndex: "?",
            CouponId: "?"
        }
    },
    UserReceiveCoupon: {
        url: cf.config.configUrl + "userWebService/UserReceiveCoupon.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            CouponIds: "?",
            IsNewUser: "?",
            Code: "?"
        }
    },
    AddMiniUserSuggestion: {
        url: cf.config.configUrl + "userWebService/AddMiniUserSuggestion.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            Wechat: "?",
            Suggestion: "?",
            Platform: "?",
            Email: "?"
        }
    },
    AddMiniFkSuggestion: {
        url: cf.config.configUrl + "userWebService/AddMiniFkSuggestion.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
            service: "?",
            mtime: "?",
            name: "?",
            phone: "?",
            Suggestion: "?",
            Sbiaoti: "?",
            cid: "?",
            Platform: "?"
        }
    },
    GetYuyueList: {
        url: cf.config.configUrl + "userWebService/GetYuyueList.html",
        post: {
            wid: cf.config.wid,
            openId: "?",
        }
    },
};