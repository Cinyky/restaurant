Page({
    data: {
        zdIndex: 0,
        chargeIndex: 0,
        zdDuration: [ "1", "2", "3", "4", "5", "6", "7" ],
        chargeArr: [ "1", "2", "3", "4", "5", "6", "7" ]
    },
    zdDurationChange: function(a) {
        this.setData({
            zdIndex: a.detail.value
        });
    },
    chargeChange: function(a) {
        this.setData({
            chargeIndex: a.detail.value
        });
    }
});