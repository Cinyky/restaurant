function i(i) {
    return i && i.__esModule ? i : {
        default: i
    };
}

var e = i(require("../../../utils/dg.js")), n = i(require("../../../utils/data.js")), o = i(require("../../../utils/requestUtil.js")), t = (i(require("../../../utils/underscore.js")), 
e.default.os.isAlipay()), u = n.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse";
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
    data: {
        info: {},
        zhezhaoDisplay: "",
        xiaochengxuName: "",
        isAli: t
    },
    onLoad: function(i) {
      this.setMenu(this);
      app.globalData.getTop(this);
        this.getFang(i.id);
        // this.initialize(i);
    },
    // initialize: function(i) {
    //     var e = this, n = i.id || 0, t = u + "/ResourceApi/getShareInfo", a = {
    //         id: n
    //     };
    //     o.default.get(t, a, function(i) {
    //         console.log(i), e.setData({
    //             info: i
    //         });
    //     });
    // },
    hideZhezhao: function(i) {
        this.setData({
            zhezhaoDisplay: "display-hide"
        });
    }
}, templateMethods, common));