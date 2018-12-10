module.exports = {
    navTo: function(t, o) {
        var a = "" == o ? t : t + "?" + o;
        wx.navigateTo({
            url: a
        });
    },
    swithTo: function(t, o) {
        var a = "" == o ? t : t + "?" + o;
        wx.switchTab({
            url: a
        });
    }
};