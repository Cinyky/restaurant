var e = require("data.js");

module.exports = {
    requestUrl: function(e, t, o, u) {
        wx.request({
            url: t,
            data: e,
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                if (200 == e.statusCode && e.data.code > 0) o.apply(u, [ e.data ]); else {
                    var t = "error:接口请求错误";
                    "null" == e.data.info && "" == e.data.info || (t = e.data.info), wx.showModal({
                        title: "提示",
                        content: t,
                        showCancel: !1
                    });
                }
            },
            complete: function() {}
        });
    },
    httpRequest: function(e, t, o, u) {
        wx.request({
            url: t,
            data: e,
            header: {
                "Content-Type": "application/json"
            },
            success: function(e) {
                200 != e.statusCode ? wx.showModal({
                    title: "提示",
                    content: "error:接口请求错误",
                    showCancel: !1
                }) : (o.apply(u, [ e.data ]), 2 != e.data.status && 1 != e.data.status && wx.showModal({
                    title: "提示",
                    content: e.data.msg,
                    showCancel: !1
                }));
            },
            fail: function() {
                wx.showModal({
                    title: "提示",
                    content: "error:网络请求失败",
                    showCancel: !1
                });
            }
        });
    },
    getShareData: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            mmodule: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_get_share_data_url, o, u);
    },
    getSwiperList: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_swiper_url, t, o);
    },
    getCmsCateList: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            beginnum: t,
            endnum: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_cms_cate_url, u, n);
    },
    getCmsList: function(t, o, u, n, _, r) {
        var a = {
            token: e.duoguan_user_token,
            cate_id: o,
            keyword: t,
            pagesize: u,
            pagenum: n,
            _: Date.now()
        };
        this.requestUrl(a, e.duoguan_cms_url, _, r);
    },
    getCmsInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            id: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_cms_read_url, u, n);
    },
    postComment: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            cid: o,
            content: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_comment_add_url, n, _);
    },
    getCommentList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            cid: t,
            pagesize: o,
            pagenum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_comment_list_url, n, _);
    },
    postCommentGood: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            cid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_comment_good_url, o, u);
    },
    getUserInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_user_info_url, o, u);
    },
    postUserInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            udata: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_user_info_post_url, u, n);
    },
    getUserAddressList: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_user_address_list_url, o, u);
    },
    addAddress: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            ainfo: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_user_address_add_url, u, n);
    },
    getAddressInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            aid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_user_address_info_url, u, n);
    },
    delAddress: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            aid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_user_address_del_url, u, n);
    },
    getUserPaylog: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            pagesize: o,
            pagenum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_get_user_paylog_url, n, _);
    },
    makePayData: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            cid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_make_paydata_url, u, n);
    },
    getUserPostList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            pagesize: o,
            pagenum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_get_user_postlist_url, n, _);
    },
    getUserOrderList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            pagesize: o,
            pagenum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_get_user_orderlist_url, n, _);
    },
    deleteOrderInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_delete_user_order_url, u, n);
    },
    shouhuoOrderInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_shouhuo_user_order_url, u, n);
    },
    postCommentOrder: function(t, o, u, n, _, r) {
        var a = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            fval: u,
            fcon: n,
            _: Date.now()
        };
        this.requestUrl(a, e.duoguan_post_comment_order, _, r);
    },
    getBbsCategory: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_get_bbs_cate_url, t, o);
    },
    getBbsGonggaoId: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_get_bbs_gonggao_id, t, o);
    },
    getBbsTwoCategory: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_get_bbs_cate_two_url, t, o);
    },
    getBbsPostList: function(t, o, u, n, _, r) {
        var a = {
            token: e.duoguan_user_token,
            wid: t,
            isjinghua: o,
            pagesize: u,
            pagenum: n,
            _: Date.now()
        };
        this.requestUrl(a, e.duoguan_get_bbs_postlist_url, _, r);
    },
    postBBs: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            t_data: o,
            t_wb_name: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_bbs_post_url, n, _);
    },
    imgUpload: function(t, o, u, n) {
        wx.uploadFile({
            url: e.duoguan_imgupload_url,
            filePath: u,
            name: "file",
            formData: {
                token: e.duoguan_user_token,
                utoken: o,
                pid: t
            },
            success: function(e) {
                n(e.data);
            }
        });
    },
    getPostInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            pid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_post_info_url, o, u);
    },
    checkBBSManage: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_check_bbs_manage_url, o, u);
    },
    delPostAction: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            pid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_post_del_url, u, n);
    },
    addPostReply: function(t, o, u, n, _, r) {
        var a = {
            token: e.duoguan_user_token,
            utoken: t,
            pid: o,
            rp_id: u,
            content: n,
            _: Date.now()
        };
        this.requestUrl(a, e.duoguan_post_replyadd_url, _, r);
    },
    getReplyList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            pid: t,
            pagesize: o,
            pagenum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_post_replylist_url, n, _);
    },
    postXihuanAct: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            pid: o,
            ptype: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_post_xihuan_url, n, _);
    },
    postReportAct: function(t, o, u, n, _, r) {
        var a = {
            token: e.duoguan_user_token,
            utoken: t,
            pid: o,
            ptype: u,
            content: n,
            _: Date.now()
        };
        this.requestUrl(a, e.duoguan_post_report_url, _, r);
    },
    getShopConfig: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_get_shop_config_url, t, o);
    },
    getShopQuanInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            qid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_shop_get_quan_info_url, o, u);
    },
    getShopQuanLingqu: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            qid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_shop_get_quan_lingqu_url, u, n);
    },
    getUserOneQuanInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            quan_id: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_shop_get_user_quan_info_url, u, n);
    },
    getShopUserQuanlist: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            qtype: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_shop_get_user_quanlist_url, u, n);
    },
    getShopPsOrderInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            oid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_shop_get_psorder_info_url, o, u);
    },
    getShopPsUserInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_shop_get_psuser_info_url, o, u);
    },
    getShopPsConfirm: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_shop_get_ps_confrim_url, u, n);
    },
    getShopWuliuInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            oid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_shop_get_wuliu_info_url, o, u);
    },
    getShopCategory: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_get_shop_cate_url, t, o);
    },
    getGoodsList: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            searchData: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_get_good_list_url, o, u);
    },
    getGoodsInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            sid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_get_good_info_url, o, u);
    },
    addGoodsCart: function(t, o, u, n, _, r) {
        var a = {
            token: e.duoguan_user_token,
            utoken: t,
            gid: o,
            gnumber: u,
            gattr: n,
            _: Date.now()
        };
        this.requestUrl(a, e.duoguan_add_good_cart_url, _, r);
    },
    getCartList: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_get_cart_list_url, o, u);
    },
    delCartList: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            cid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_del_cart_list_url, u, n);
    },
    editCartList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            cid: o,
            cnum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_edit_cart_list_url, n, _);
    },
    orderPost: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oinfo: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_order_post_url, u, n);
    },
    getOrderInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_order_info_url, u, n);
    },
    makeOrderPayData: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_make_order_pay_url, u, n);
    },
    getAddressList: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_get_address_list_url, o, u);
    },
    getUserMenu: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            ver_id: e.duoguan_config_version,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_get_user_menu_url, t, o);
    },
    duoguanData: e,
    getTuanCategory: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_get_tuan_cate_url, t, o);
    },
    getTuanGoodsList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            cid: t,
            pagesize: o,
            pagenum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_get_tuan_good_list_url, n, _);
    },
    getTuanGoodsInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            sid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_get_tuan_good_info_url, o, u);
    },
    addTuanGoodsCart: function(t, o, u, n, _, r, a, s) {
        var d = {
            token: e.duoguan_user_token,
            utoken: t,
            gid: o,
            gnumber: u,
            gattr: n,
            btype: _,
            chengtuan_id: r,
            _: Date.now()
        };
        this.requestUrl(d, e.duoguan_add_tuan_good_cart_url, a, s);
    },
    getTuanCartList: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_get_tuan_cart_list_url, o, u);
    },
    orderTuanPost: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oinfo: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_order_tuan_post_url, u, n);
    },
    makeTuanOrderPayData: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_make_tuan_order_pay_url, u, n);
    },
    getTuanInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            tid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_get_tuan_info_url, o, u);
    },
    getTuanWuliuInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            oid: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_tuan_get_wuliu_info_url, o, u);
    },
    getUserTuanOrderList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            pagesize: o,
            pagenum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_get_user_tuan_orderlist_url, n, _);
    },
    getTuanOrderInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_tuan_order_info_url, u, n);
    },
    deleteTuanOrderInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_delete_user_tuan_order_url, u, n);
    },
    shouhuoTuanOrderInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_shouhuo_user_tuan_order_url, u, n);
    },
    getCardMyInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_card_my_info_url, o, u);
    },
    getCardUserInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            cid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_card_user_info_url, u, n);
    },
    postCardInfo: function(t, o, u, n) {
        var o = {
            token: e.duoguan_user_token,
            utoken: t,
            data: o,
            _: Date.now()
        };
        this.requestUrl(o, e.duoguan_card_post_info_url, u, n);
    },
    postChangePhoneInfo: function(t, o, u, n) {
        var o = {
            token: e.duoguan_user_token,
            utoken: t,
            data: o,
            _: Date.now()
        };
        this.requestUrl(o, e.duoguan_card_change_phone_url, u, n);
    },
    getCardViewInfo: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            uid: t,
            fid: o,
            ctype: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_card_view_info_url, n, _);
    },
    getMyCardList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            ctype: o,
            ltype: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_card_get_list_url, n, _);
    },
    getUserPhoneCode: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            phone: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_get_user_phone_code_url, u, n);
    },
    getHotelListData: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            utoken: t,
            _: Date.now()
        };
        this.httpRequest(n, e.duoguan_h_gethotellist_url, o, u);
    },
    getHotelData: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: o,
            hotel_id: t,
            _: Date.now()
        };
        this.httpRequest(_, e.duoguan_h_gethoteldata_url, u, n);
    },
    getHotelEvaData: function(t, o, u, n, _, r) {
        var a = {
            hotel_id: t,
            token: e.duoguan_user_token,
            utoken: n,
            _: Date.now(),
            pageIndex: o,
            pageSize: u
        };
        this.httpRequest(a, e.duoguan_h_gethotelevadata_url, _, r);
    },
    getRoomListData: function(t, o, u, n, _, r) {
        var a = {
            hotel_id: t,
            token: e.duoguan_user_token,
            utoken: n,
            _: Date.now(),
            startTime: o,
            stopTime: u
        };
        this.httpRequest(a, e.duoguan_h_getroomlist_url, _, r);
    },
    makeHotelOrder: function(t, o, u, n, _, r, a, s, d, i, g, k, l) {
        var h = {
            hotel_id: t,
            token: e.duoguan_user_token,
            utoken: g,
            _: Date.now(),
            checkintime: o,
            leavetime: u,
            name: n,
            tel: _,
            paytype: i,
            roomid: r,
            mealid: a,
            roomnums: s,
            price: d
        };
        this.httpRequest(h, e.duoguan_h_makeorder_url, k, l);
    },
    makeHotelComment: function(t, o, u, n) {
        var t = {
            token: e.duoguan_user_token,
            utoken: o,
            _: Date.now(),
            data: t
        };
        this.httpRequest(t, e.duoguan_h_makecomment_url, u, n);
    },
    getOrderList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: u,
            _: Date.now(),
            pageIndex: t,
            pageSize: o
        };
        this.httpRequest(r, e.duoguan_h_getorderlist_url, n, _);
    },
    deleteOrder: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: o,
            _: Date.now(),
            ordernumber: t
        };
        this.httpRequest(_, e.duoguan_h_deleteorder_url, u, n);
    },
    cancelOrder: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: o,
            _: Date.now(),
            ordernumber: t
        };
        this.httpRequest(_, e.duoguan_h_cancelorder_url, u, n);
    },
    payHotelOrder: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: o,
            _: Date.now(),
            ordernumber: t
        };
        this.httpRequest(_, e.duoguan_h_payHotelorder_url, u, n);
    },
    dishGetDishConfig: function(t, o) {
        var u = {
            token: e.duoguan_user_token,
            _: Date.now()
        };
        this.requestUrl(u, e.duoguan_dish_get_dish_config, t, o);
    },
    dishGetDishList: function(t, o, u, n, _, r) {
        var a = {
            token: e.duoguan_user_token,
            ws_lat: t,
            ws_lng: o,
            pagesize: u,
            pagenum: n,
            _: Date.now()
        };
        this.requestUrl(a, e.duoguan_dish_get_dish_list, _, r);
    },
    dishGetDishInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            dish_id: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_dish_get_dish_info, u, n);
    },
    dishGetDishOneInfo: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            dish_id: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_dish_get_dish_one_info, o, u);
    },
    dishGetGoodsInfo: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            dish_id: o,
            goods_id: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_dish_get_goods_info, n, _);
    },
    dishGetOneGoodsAttr: function(t, o, u) {
        var n = {
            token: e.duoguan_user_token,
            goods_id: t,
            _: Date.now()
        };
        this.requestUrl(n, e.duoguan_dish_get_one_goods_attr, o, u);
    },
    dishAddGoodsCart: function(t, o, u, n, _, r, a) {
        var s = {
            token: e.duoguan_user_token,
            utoken: t,
            dish_id: o,
            gid: u,
            gnumber: n,
            gattr: _,
            _: Date.now()
        };
        this.requestUrl(s, e.duoguan_dish_add_cart_info, r, a);
    },
    dishGetCartList: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            dish_id: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_dish_get_cart_info, u, n);
    },
    dishEditCartList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            cid: o,
            cnum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_dish_edit_cart_info, n, _);
    },
    dishDeleteCartList: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            dish_id: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_dish_delete_cart_info, u, n);
    },
    dishOrderPost: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oinfo: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_dish_order_post_info, u, n);
    },
    dishMakeOrderPayData: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_dish_order_pay_url, u, n);
    },
    dishGetUserOrderList: function(t, o, u, n, _) {
        var r = {
            token: e.duoguan_user_token,
            utoken: t,
            pagesize: o,
            pagenum: u,
            _: Date.now()
        };
        this.requestUrl(r, e.duoguan_dish_get_user_orderlist_url, n, _);
    },
    dishGetOrderInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_dish_order_info_url, u, n);
    },
    dishDeleteOrderInfo: function(t, o, u, n) {
        var _ = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            _: Date.now()
        };
        this.requestUrl(_, e.duoguan_dish_delete_user_order_url, u, n);
    },
    dishPostOrderComment: function(t, o, u, n, _, r) {
        var a = {
            token: e.duoguan_user_token,
            utoken: t,
            oid: o,
            fval: u,
            fcon: n,
            _: Date.now()
        };
        this.requestUrl(a, e.duoguan_dish_post_comment_order, _, r);
    },
    dishImgUpload: function(t, o, u, n) {
        wx.uploadFile({
            url: e.duoguan_dish_imgupload_url,
            filePath: u,
            name: "file",
            formData: {
                token: e.duoguan_user_token,
                utoken: o,
                pid: t
            },
            success: function(e) {
                n(e.data);
            }
        });
    }
};