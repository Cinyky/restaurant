var e = require("../util"), t = require("../data.js").duoguan_host_api_url + "/index.php/addon/DuoguanShop/Region/getList.html?data=", a = {
    addDot: function(e) {
        e instanceof Array && e.map(function(e) {
            return e.fullName.length > 4 ? (e.fullNameDot = e.fullName.slice(0, 4) + "...", 
            e) : (e.fullNameDot = e.fullName, e);
        });
    },
    load: function(d, c) {
        d.setData({
            isShow: !1,
            showDistrict: !0
        }), c && !c.showDistrict && d.setData({
            showDistrict: !1
        }), (0, e.Promise)(wx.request, {
            url: t + "0",
            method: "GET"
        }).then(function(c) {
            var l = c.data.result[0];
            return a.addDot(c.data.result), d.setData({
                proviceData: c.data.result,
                "selectedProvince.index": 0,
                "selectedProvince.code": l.code,
                "selectedProvince.fullName": l.fullName
            }), (0, e.Promise)(wx.request, {
                url: t + l.code,
                method: "GET"
            });
        }).then(function(c) {
            var l = c.data.result[0];
            return a.addDot(c.data.result), d.setData({
                cityData: c.data.result,
                "selectedCity.index": 0,
                "selectedCity.code": l.code,
                "selectedCity.fullName": l.fullName
            }), d.data.showDistrict ? (0, e.Promise)(wx.request, {
                url: t + l.code,
                method: "GET"
            }) : void 0;
        }).then(function(e) {
            var t = e.data.result[0];
            a.addDot(e.data.result), d.setData({
                districtData: e.data.result,
                "selectedDistrict.index": 0,
                "selectedDistrict.code": t.code,
                "selectedDistrict.fullName": t.fullName
            });
        }).catch(function(e) {
            console.log(e);
        });
    },
    tapProvince: function(d, c) {
        var l = d.currentTarget.dataset;
        (0, e.Promise)(wx.request, {
            url: t + l.code,
            method: "GET"
        }).then(function(d) {
            if (d.data.result) return a.addDot(d.data.result), c.setData({
                cityData: d.data.result,
                "selectedProvince.code": l.code,
                "selectedProvince.fullName": l.fullName,
                "selectedCity.code": d.data.result[0].code,
                "selectedCity.fullName": d.data.result[0].fullName
            }), c.data.showDistrict ? (0, e.Promise)(wx.request, {
                url: t + d.data.result[0].code,
                method: "GET"
            }) : void c.setData({
                "selectedProvince.index": l.index,
                "selectedCity.index": 0
            });
            c.setData({
                cityData: [],
                "selectedProvince.code": l.code,
                "selectedProvince.fullName": l.fullName
            });
        }).then(function(e) {
            e.data.result ? (a.addDot(e.data.result), c.setData({
                districtData: e.data.result,
                "selectedProvince.index": l.index,
                "selectedCity.index": 0,
                "selectedDistrict.index": 0,
                "selectedDistrict.code": e.data.result[0].code,
                "selectedDistrict.fullName": e.data.result[0].fullName
            })) : c.setData({
                districtData: [],
                "selectedProvince.index": l.index
            });
        }).catch(function(e) {
            console.log(e);
        });
    },
    tapCity: function(d, c) {
        var l = d.currentTarget.dataset;
        c.data.showDistrict ? (0, e.Promise)(wx.request, {
            url: t + l.code,
            method: "GET"
        }).then(function(e) {
            e.data.result ? (a.addDot(e.data.result), c.setData({
                districtData: e.data.result,
                "selectedCity.index": l.index,
                "selectedCity.code": l.code,
                "selectedCity.fullName": l.fullName,
                "selectedDistrict.index": 0,
                "selectedDistrict.code": e.data.result[0].code,
                "selectedDistrict.fullName": e.data.result[0].fullName
            })) : c.setData({
                districtData: [],
                "selectedCity.index": l.index,
                "selectedCity.code": l.code,
                "selectedCity.fullName": l.fullName,
                "selectedDistrict.index": 0,
                "selectedDistrict.code": "",
                "selectedDistrict.fullName": ""
            });
        }).catch(function(e) {
            console.log(e);
        }) : c.setData({
            "selectedCity.index": l.index,
            "selectedCity.code": l.code,
            "selectedCity.fullName": l.fullName
        });
    },
    tapDistrict: function(e, t) {
        var a = e.currentTarget.dataset;
        t.setData({
            "selectedDistrict.index": e.currentTarget.dataset.index,
            "selectedDistrict.code": a.code,
            "selectedDistrict.fullName": a.fullName
        });
    },
    confirm: function(e, t) {
        t.setData({
            address: t.data.showDistrict ? t.data.selectedProvince.fullName + " " + t.data.selectedCity.fullName + " " + t.data.selectedDistrict.fullName : t.data.selectedProvince.fullName + " " + t.data.selectedCity.fullName,
            isShow: !1,
            selectedCode: t.data.showDistrict ? t.data.selectedDistrict.code : t.data.selectedCity.code
        });
    },
    cancel: function(e) {
        e.setData({
            isShow: !1
        });
    },
    choosearea: function(e) {
        e.setData({
            isShow: !0
        });
    }
};

module.exports = {
    SA: a
};