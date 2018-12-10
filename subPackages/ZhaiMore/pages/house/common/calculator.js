var o = {
    loanType: "公积金贷款",
    mode: "等额本息",
    shoufu: 0,
    yuegong: 0,
    huankuanzonge: 0,
    lixizonge: 0,
    meiyuedijian: 0,
    daikuanzonge: 0,
    shoufubiliKey: 3,
    shoufubili: [ "2成", "3成", "4成", "5成", "6成", "7成", "8成", "9成" ],
    yearsArrKey: 14,
    yearsArr: [ "1年", "2年", "3年", "4年", "5年", "6年", "7年", "8年", "9年", "10年", "11年", "12年", "13年", "14年", "15年", "16年", "17年", "18年", "19年", "20年", "21年", "22年", "23年", "24年", "25年", "26年", "27年", "28年", "29年", "30年" ],
    gongjijinlilv: 0,
    shangdaililv: 0
};

module.exports = {
    configData: function() {
        return o;
    },
    compute: function() {
        var o = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        console.log(o), console.log(e), console.log(n), console.log("*************************");
        return "公积金贷款" == o ? this.providentFund(e, n) : "商业贷款" == o ? this.business(e, n) : "组合贷款" == o ? this.combinate(e, n) : {};
    },
    providentFund: function() {
        var o = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = {}, i = parseFloat(e.house_total) || 0, a = parseInt(e.shoufubiliKey) + 2;
        n.shoufu = (i * a / 10).toFixed(2), n.daikuanzonge = (i * (10 - a) / 10).toFixed(2);
        var g = 12 * (parseInt(e.yearsArrKey) + 1);
        n.yuegong = 0, n.huankuanzonge = 0, n.lixizonge = 0, n.meiyuedijian = 0;
        var u = parseFloat(e.gongjijinlilv) / 100;
        if ("等额本息" == o) {
            for (var t = n.daikuanzonge * u / 12 * Math.pow(1 + u / 12, g) / (Math.pow(1 + u / 12, g) - 1), l = 0, r = 0; r < g; r++) l += n.daikuanzonge * u / 12;
            n.yuegong = (1e4 * t).toFixed(2), n.huankuanzonge = (parseFloat(n.daikuanzonge) + l).toFixed(2), 
            n.lixizonge = l.toFixed(2);
        } else if ("等额本金" == o) {
            for (var s = parseFloat(n.daikuanzonge), d = s / g, h = 0, v = 0; v < g; v++) {
                var y = s * u / 12;
                s -= d, h += y;
            }
            console.log("yuegong"), console.log(n.daikuanzonge), n.yuegong = n.daikuanzonge * u / 12 * 1e4, 
            console.log(n.yuegong), n.yuegong = (parseFloat(n.yuegong) + 1e4 * d).toFixed(2), 
            console.log(d), console.log(n.yuegong), n.huankuanzonge = (parseFloat(n.daikuanzonge) + h).toFixed(2), 
            n.lixizonge = h.toFixed(2), n.meiyuedijian = (n.daikuanzonge * u / g * 1e4).toFixed(2);
        }
        return n;
    },
    business: function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        var o = {}, e = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).house_total || 0;
        return e = parseFloat(e), o;
    },
    combinate: function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        var o = {}, e = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).house_total || 0;
        return e = parseFloat(e), o;
    }
};