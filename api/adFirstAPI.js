let cf = require("../config.js");
module.exports = {
	getCoupon:{
		url : cf.config.configUrl + "adFirst/getCoupon.html",
		data: {
			wid: cf.config.wid,
		},
		method: 'POST'
	}
};