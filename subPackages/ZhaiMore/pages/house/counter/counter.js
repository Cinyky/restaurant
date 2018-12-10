function t(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

var a = Object.assign || function(t) {
    for (var a = 1; a < arguments.length; a++) {
        var i = arguments[a];
        for (var e in i) Object.prototype.hasOwnProperty.call(i, e) && (t[e] = i[e]);
    }
    return t;
}, i = (t(require("../../../utils/dg.js")), t(require("../../../utils/data.js"))), e = (t(require("../../../utils/requestUtil.js")), 
t(require("../common/calculator.js")));

i.default.duoguan_host_api_url;
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
    data: {},
    onLoad: function(t) {
      this.setMenu(this);
      app.globalData.getTop(this);
        t.gongjijinlilv = "3.25", t.shangdaililv = "4.9";
        this._initialize(t);
    },
    _initialize: function(t) {
        var i = t.house_total || 0, n = e.default.configData();
        n.house_total = parseFloat(i), n.gongjijinlilv = t.gongjijinlilv, n.shangdaililv = t.shangdaililv, 
        this.setData(a({}, n)), this.compute();
    },
    compute: function() {
        var t = this.data.loanType, i = this.data.mode, n = this.data, o = e.default.compute(t, i, n);
        this.setData(a({}, o));
    },
    changeMode: function(t) {
        var a = t.currentTarget.dataset.mode;
        this.setData({
            mode: a || "等额本息"
        }), this.compute();
    },
    changeLoanType: function(t) {
        var a = t.detail.value;
        this.setData({
            loanType: a || "公积金贷款"
        }), this.compute();
    },
    formSubmit: function(t) {
        var i = t.detail.value, n = this.data.loanType, o = this.data.mode, u = i, s = e.default.compute(n, o, u);
        this.setData(a({}, s));
    },
    changeShoufubili: function(t) {
        var a = t.detail.value;
        this.setData({
            shoufubiliKey: a
        }), this.compute();
    },
    changeYearsArr: function(t) {
        var a = t.detail.value;
        this.setData({
            yearsArrKey: a
        }), this.compute();
    }
}, templateMethods, common));