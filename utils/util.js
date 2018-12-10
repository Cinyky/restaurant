function Encrypt(e) {
  var t = cj.CryptoJS.enc.Utf8.parse(e),
    n = cj.CryptoJS.AES.encrypt(t, key, {iv: iv, mode: cj.CryptoJS.mode.CBC, padding: cj.CryptoJS.pad.Pkcs7}),
    r = cj.CryptoJS.enc.Base64.stringify(n.ciphertext);
  return stringToHex(r);
}

function Decrypt(e) {
  var t = hexToString(e),
    n = cj.CryptoJS.AES.decrypt(t, key, {iv: iv, mode: cj.CryptoJS.mode.CBC, padding: cj.CryptoJS.pad.Pkcs7}),
    r = n.toString(cj.CryptoJS.enc.Utf8);
  return r.toString();
}

function stringToHex(e) {
  if (e === "") return "";
  var t = [];
  for (var n = 0; n < e.length; n++) t.push(e.charCodeAt(n).toString(16));
  return t.join("");
}

function hexToString(e) {
  var t = e.trim(), n = t, r = n.length;
  if (r % 2 !== 0) return wx.showToast({title: "Illegal Format ASCII Code!"}), "";
  var i, s = [];
  for (var o = 0; o < r; o += 2) i = parseInt(n.substr(o, 2), 16), s.push(String.fromCharCode(i));
  return s.join("");
}

function merge() {
  if (arguments.length > 0) {
    var e = arguments[0];
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) n[r] != undefined && (e[r] = n[r]);
    }
    return e;
  }
  return undefined;
}

function isNull(e) {
  return e == undefined || e == "undefined" || e == null || e == "";
}

function parseJSON(e) {
  try {
    return JSON.parse(e);
  } catch (t) {
    return undefined;
  }
}

function makeUrl(e, t) {
  function v(e, t, n) {
    var r;
    return e == "?" ? n[t] === 0 ? r = 0 : r = n[t] || "" : typeof e == "function" ? r = e(n) : e == "??" ? r = m(t) : n[t] === 0 ? r = 0 : r = n[t] || e, r;
  }

  function m(n) {
    var r = {}, i, s, o, u = t[n], a = e[n] || {};
    for (var f in a) i = f, s = a[f], s == "?" ? u[i] === 0 ? o = 0 : o = u[i] || "" : u[i] === 0 ? o = 0 : o = u[i] || s, r[f] = o;
    return r;
  }

  t = t || {};
  var n = "", r = e.url, i = {}, s = {};
  r = e.url.replace(/{{(\w+)}}/ig, function (e, n) {
    return t[n] || "";
  }), i.method = "get", e.urlEncodeCharset && (i.urlEncodeCharset = e.urlEncodeCharset);
  if (e.get) for (var o in e.get) {
    var u = o, a = e.get[o], f = v(a, u, t);
    s[u] = f, n += (n.length ? "&" : "") + [u, s[u]].join("=");
  }
  if (r.indexOf("?") > -1) {
    var l = r.substring(r.indexOf("?") + 1);
    i.originUrl = r.substring(0, r.indexOf("?"));
    for (var c = 0, h = l.split("&"); c < h.length; c++) {
      var p = h[c].split("=");
      s[p[0]] = p[1] || "";
    }
  } else i.originUrl = e.url;
  i.getData = s, n.length && (r.indexOf("?") > -1 ? r.indexOf("?") == r.length - 1 ? r += n : r += "&" + n : r += "?" + n), i.url = r;
  if (e.post) {
    var d = {};
    for (var o in e.post) {
      var f = v(e.post[o], o, t);
      if (e.post[o] != "?" || f != null || f != "") d[o] = f;
    }
    i.method = "post", i.postData = d;
  }
  return e.isOnlyData == 1 && (i.postData = {data: JSON.stringify(d)}), e.method && (i.method = e.method), i;
}

function xsr() {
  var e = {}, t = 1e4;
  switch (arguments.length) {
    case 1:
      var n = arguments[0];
      typeof n == "object" && wx.request({
        url: n.url,
        method: n.method,
        header: {"content-type": "application/json"},
        success: n.success,
        fail: n.error,
        complete: n.complete
      });
      break;
    case 2:
      var n = arguments[0], r = arguments[1];
      typeof n == "string" && typeof r == "function" ? wx.request({
        url: n,
        method: "GET",
        header: {"content-type": "application/json"},
        success: r,
        fail: n.error,
        complete: n.complete
      }) : typeof n == "object" && typeof r == "function" && (loading(), wx.request({
        url: n.url + "?wid=" + cf.config.wid,
        method: "POST",
        data: isNull(Encrypt(n.postData)) ? "" : {data: Encrypt(JSON.stringify(n.postData))},
        header: {"content-type": "application/json"},
        success: function (e) {
          hideloading(), n.isCache ? r(JSON.parse(e.data.d)) : n.postData.isCache ? r(JSON.parse(e.data.d)) : r(JSON.parse(Decrypt(e.data.d)));
        },
        fail: function (e) {
          console.error("错误信息:", e);
        },
        complete: n.complete
      }));
      break;
    default:
  }
}

function xsr1() {
  var e = {}, t = 1e4;
  switch (arguments.length) {
    case 1:
      var n = arguments[0];
      typeof n == "object" && wx.request({
        url: n.url,
        method: n.method,
        header: {"content-type": "application/json"},
        success: n.success,
        fail: n.error,
        complete: n.complete
      });
      break;
    case 2:
      var n = arguments[0], r = arguments[1];
      typeof n == "string" && typeof r == "function" ? wx.request({
        url: n,
        method: "GET",
        header: {"content-type": "application/json"},
        success: r,
        fail: n.error,
        complete: n.complete
      }) : typeof n == "object" && typeof r == "function" && wx.request({
        url: n.url + "?wid=" + cf.config.wid,
        method: "POST",
        data: isNull(Encrypt(n.postData)) ? "" : {data: Encrypt(JSON.stringify(n.postData))},
        header: {"content-type": "application/json"},
        success: function (e) {
          n.isCache ? r(JSON.parse(e.data.d)) : r(JSON.parse(Decrypt(e.data.d)));
        },
        fail: function (e) {
          console.error("错误信息:", e);
        },
        complete: n.complete
      });
      break;
    default:
  }
}

function alert(e, t, n) {
  wx.showToast({icon: "success", title: e || "成功", duration: n || 2e3, success: t});
}

function loading(e, t, n) {/* wx.showLoading({ mask: !0, title: e || "loading...", success: n }) */
}

function hideloading() {
  var e = setTimeout(function () {
    wx.hideLoading();
  }, 1e3);
}

function confirm(e, t, n) {
  wx.showModal({title: "提示", content: e, showCancel: n || !1, success: t});
}

function gopage(e, t) {
  wx.navigateTo({url: e, success: t});
}

function gotopage(e, t) {
  wx.redirectTo({url: e, success: t});
}

function backpage(e, t) {
  wx.navigateBack({delta: e || 1, success: t});
}

function setCache(e, t, n) {
  wx.setStorage({key: e, data: t, success: n});
}

function getCache(e, t, n) {
  wx.getStorage({key: e, success: t, fail: n});
}

function removeCache(e, t) {
  wx.removeStorage({key: e, success: t});
}

function FormatTime(e) {
  e = e.replace(/-/g, "/");
  var t = (new Date).getTime(), e = (new Date(e)).getTime();
  e = e > t ? e : t;
  if (!(e <= t)) {
    var n = e - t, r = Math.floor(n / 1e3 / 60 / 60 / 24) + 1, i = Math.floor(n / 1e3 / 60 / 60 % 24),
      s = Math.floor(n / 1e3 / 60 % 60), o = Math.floor(n / 1e3 % 60);
    return {day: doubleNum(r), hour: doubleNum(i), min: doubleNum(s), sec: doubleNum(o)};
  }
  clearInterval();
}

function doubleNum(e) {
  return e < 10 ? "0" + e : e + "";
}

function sendTpl(e) {
  xsr(makeUrl(e.api, e.value), function (t) {
    var n = {
      access_token: t.dataList.AccessToken,
      touser: e.WeiXinOpenId,
      template_id: t.dataList.WXTmessage_key,
      page: e.pages,
      form_id: e.formId,
      data: t.dataList.data
    };
    wx.request({
      url: cf.config.configUrl + "TemplateMsgList/sendTemplateMessage.html",
      method: "POST",
      data: {data: JSON.stringify(n)},
      header: {"content-type": "application/json"},
      success: function (t) {
        console.log("模版消息发送成功", t, e);
      },
      fail: function (e) {
        console.log("模版消息发送失败");
      }
    });
  });
}

function formatTime() {
  var e = (new Date).getTime(), t = e.getFullYear(), n = e.getMonth() + 1, r = e.getDate(), i = e.getHours(),
    s = e.getMinutes(), o = e.getSeconds();
  return [t, n, r].map(formatNumber).join("/") + " " + [i, s, o].map(formatNumber).join(":");
}

var cj = require("CryptoJS-AES.js"), cf = require("../config.js"), keyval = cf.config.ASEkey, ivval = cf.config.ASEIv,
  key = cj.CryptoJS.enc.Utf8.parse(keyval), iv = cj.CryptoJS.enc.Utf8.parse(ivval);
module.exports = {
  merge: merge,
  isNull: isNull,
  parseJSON: parseJSON,
  makeUrl: makeUrl,
  xsr: xsr,
  xsr1: xsr1,
  alert: alert,
  loading: loading,
  gopage: gopage,
  confirm: confirm,
  gotopage: gotopage,
  backpage: backpage,
  setCache: setCache,
  getCache: getCache,
  removeCache: removeCache,
  hideloading: hideloading,
  FormatTime: FormatTime,
  formatTime: formatTime,
  doubleNum: doubleNum,
  sendTpl: sendTpl
};