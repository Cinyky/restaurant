function e(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

function t(e) {
    if ("checkbox" == e.type) {
        if (!e.options) return e;
        e.value = null == e.value || e.value instanceof Array ? e.value : [ e.value ];
        for (var t = [], a = e.options.items, n = 0; n < a.length; n++) {
            var o = a[n];
            null == e.value ? t.push({
                value: o,
                checked: !1
            }) : t.push({
                value: o,
                checked: -1 != e.value.indexOf(o)
            });
        }
        e.options.items = t;
    } else if ("datetime" == e.type) {
        var r = new Date();
        e.value ? e.value = e.value.split(" ", 2) : e.value = [ r.getFullYear() + "-" + (r.getMonth() + 1) + "-" + r.getDate(), r.getHours() + ":" + r.getMinutes() ];
    } else if ("date" == e.type) {
        var i = new Date();
        e.value = e.value || i.getFullYear() + "-" + (i.getMonth() + 1) + "-" + i.getDate();
    } else if ("time" == e.type) {
        var u = new Date();
        e.value = e.value || u.getHours() + ":" + u.getMinutes();
    } else if ("images" == e.type) {
        e.value = e.value || [], e.options = e.options || {
            count: 6
        }, e.state = [];
        for (var s = 0; s < e.value.length; s++) e.state.push(1);
    }
    return e;
}

function a(e) {
    return !0 === e || !1 === e;
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var n = function() {
    function e(e, t) {
        for (var a = 0; a < t.length; a++) {
            var n = t[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), 
            Object.defineProperty(e, n.key, n);
        }
    }
    return function(t, a, n) {
        return a && e(t.prototype, a), n && e(t, n), t;
    };
}(), o = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./dg.js")), r = require("./data.js"), i = function() {
    function i(t) {
        var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "form";
        if (e(this, i), !t) throw new Error("pageObj必须是一个Page对象！");
        if (!a) throw new Error("name必须！");
        t.onFormPrevImage = t.onFormPrevImage || this.onFormPrevImage.bind(this), t.onFormCheckboxChange = t.onFormCheckboxChange || this.onFormGroupChange.bind(this), 
        t.onFormRadioChange = t.onFormRadioChange || this.onFormGroupChange.bind(this), 
        t.onFormSwitchChange = t.onFormSwitchChange || this.onFormGroupChange.bind(this), 
        t.onFormSliderChange = t.onFormSliderChange || this.onFormGroupChange.bind(this), 
        t.onFormDateChange = t.onFormDateChange || this.onFormGroupChange.bind(this), t.onFormRegionChange = t.onFormRegionChange || this.onFormGroupChange.bind(this), 
        t.onFormBlur = t.onFormBlur || this.onFormGroupChange.bind(this), t.onFormChooseImageTap = t.onFormChooseImageTap || this.onFormChooseImageTap.bind(this), 
        t.onFormRemoveImageTap = t.onFormRemoveImageTap || this.onFormRemoveImageTap.bind(this), 
        t.onFormPreviewImageTap = t.onFormPreviewImageTap || this.onFormPreviewImageTap.bind(this), 
        this.pageObj = t, this.name = a, this.items = [];
    }
    return n(i, [ {
        key: "add",
        value: function(e, a, n) {
            var o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null, r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
            return this.items.push(t({
                title: e,
                name: a,
                type: n,
                value: o,
                options: r
            })), this;
        }
    }, {
        key: "insert",
        value: function(e, a, n, o) {
            var r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null, i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {};
            return this.items.splice(e, 1, t({
                title: a,
                name: n,
                type: o,
                value: r,
                options: i
            })), this;
        }
    }, {
        key: "set",
        value: function(e, a, n, o) {
            var r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null, i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {};
            this.items[e] = t({
                title: a,
                name: n,
                type: o,
                value: r,
                options: i
            });
        }
    }, {
        key: "remove",
        value: function(e) {
            return this.items.splice(e, 1), this;
        }
    }, {
        key: "clear",
        value: function() {
            return this.items = [], this;
        }
    }, {
        key: "render",
        value: function() {
            var e = {};
            e[this.name] = this.items, this.pageObj.setData(e);
        }
    }, {
        key: "getValues",
        value: function() {
            for (var e = {}, t = 0; t < this.items.length; t++) {
                var a = this.items[t];
                if ("images" == a.type) {
                    for (var n = [], o = 0; o < a.value.length; o++) a.state[o] && n.push(a.value[o]);
                    e[a.name] = n;
                } else "datetime" == a.type ? e[a.name] = a.value.join(" ") : e[a.name] = a.value;
            }
            return e;
        }
    }, {
        key: "getSerializeValues",
        value: function() {
            for (var e = {}, t = 0; t < this.items.length; t++) {
                var a = this.items[t];
                if ("checkbox" == a.type) {
                    a.value = a.value || [];
                    for (var n = 0; n < a.value.length; n++) e[a.name + "[" + n + "]"] = a.value[n];
                } else if ("images" == a.type) for (var o = 0; o < a.value.length; o++) a.state[o] && (e[a.name + "[" + o + "]"] = a.value[o]); else "datetime" == a.type ? e[a.name] = a.value.join(" ") : e[a.name] = a.value;
            }
            return e;
        }
    }, {
        key: "getControl",
        value: function(e) {
            for (var t = 0; t < this.items.length; t++) if (this.items[t].name == e) return this.items[t];
            return null;
        }
    }, {
        key: "onFormPrevImage",
        value: function(e) {
            var t = e.currentTarget.dataset.src;
            wx.previewImage({
                urls: [ t ]
            });
        }
    }, {
        key: "onFormGroupChange",
        value: function(e) {
            var t = e.currentTarget.dataset, n = e.detail.value, o = e.currentTarget.id, r = t.refresh, i = this.getControl(o);
            if (i) {
                if ("datetime" == i.type) {
                    var u = t.type, s = i.value;
                    "date" == u ? s[0] = n : s[1] = n;
                } else i.value = a(n) ? n ? 1 : 0 : n;
                r && this.render(), console.log(e, i);
            }
        }
    }, {
        key: "onFormChooseImageTap",
        value: function(e) {
            var t = this, a = (e.currentTarget.dataset, e.currentTarget.id), n = this.getControl(a);
            n && o.default.chooseImage({
                count: n.options.count - n.value.length,
                success: function(e) {
                    console.log(e.tempFilePaths);
                    var a = e.tempFilePaths, i = [];
                    !function u(s) {
                        o.default.showLoading("正在上传第" + (s + 1) + "张图片..."), o.default.uploadFile({
                            url: r.duoguan_host_api_url + "/index.php?s=/home/file/uploadPicture",
                            filePath: a[s],
                            name: "download",
                            success: function(e) {
                                e = JSON.parse(e.data), console.log(e), 1 == e.status ? (a[s] = e.url, i.push(1)) : (i.push(0), 
                                o.default.showToast(e.info));
                            },
                            fail: function(e) {
                                i.push(0), 11 == e.statusCode ? o.default.showToast("文件不存在！") : 13 == e.statusCode && o.default.showToast("没有权限！");
                            },
                            complete: function() {
                                s >= a.length - 1 ? (n.value = n.value.concat(e.tempFilePaths), n.state = n.state.concat(i), 
                                t.render()) : u(s + 1), o.default.hideLoading();
                            }
                        });
                    }(0);
                }
            });
        }
    }, {
        key: "onFormRemoveImageTap",
        value: function(e) {
            var t = this, a = e.currentTarget.dataset, n = a.name, r = a.index;
            o.default.confirm("你确定要移除这张图片吗？", function(e) {
                if (e.confirm) {
                    var a = t.getControl(n);
                    a && (a.value.splice(r, 1), t.render());
                }
            }, "温馨提示");
        }
    }, {
        key: "onFormPreviewImageTap",
        value: function(e) {
            var t = e.currentTarget.dataset, a = t.name, n = t.index, r = this.getControl(a);
            r && o.default.previewImage({
                current: r.value[n],
                urls: r.value
            });
        }
    } ]), i;
}();

exports.default = i;