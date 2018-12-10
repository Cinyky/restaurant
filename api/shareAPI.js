let cf = require('../config');
module.exports = {
	shareToCoupon: {
		url: cf.config.configUrl+'sharexcx/shareToCoupon.html',
		method: 'POST',
		data:{
			wid:cf.config.wid
		}
	},
	getIsOpen:{
		url: cf.config.configUrl+'sharexcx/getIsOpen.html',
		method:'POST',
		data:{
			wid:cf.config.wid
		}
	}
};