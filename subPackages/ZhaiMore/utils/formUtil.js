var t = function() {
    function t() {
        this.data = [], this.groupIndex = 0;
    }
    return t.prototype.addGroup = function(t, e) {
        return void 0 === e && (e = !0), this.data.push({
            title: t,
            is_show_title: e,
            controls: {}
        }), this.useGroup(this.data.length - 1), this;
    }, t.prototype.removeGroup = function(t) {
        return this.data.splice(t, 1), this;
    }, t.prototype.useGroup = function(t) {
        return this.groupIndex = t, this;
    }, t.prototype.clear = function() {
        return this.data = [], this;
    }, t.prototype.setField = function(t, e, a, r, i, o) {
        return void 0 === r && (r = null), void 0 === i && (i = null), void 0 === o && (o = ""), 
        this.data[this.groupIndex].controls[a] = {
            type: t,
            label: e,
            extra: i,
            placeholder: o
        }, this.setFieldValue(this.groupIndex, a, r), this;
    }, t.prototype.setFieldValue = function(e, a, r) {
        var i = this.data[e].controls[a], o = new Date(), n = o.getFullYear() + "-" + o.getMonth() + "-" + o.getDate(), u = o.getHours() + ":" + o.getMinutes();
        if (i.type === t.FieldType.checkbox) {
            i.value = {};
            for (var d in i.extra) -1 !== r.indexOf(d) && (i.value[d] = 1);
        } else i.type === t.FieldType.datetime ? (i.value = r.split(" ", 2), i.value[0] || (i.value[0] = n), 
        i.value[1] || (i.value[1] = u)) : i.type === t.FieldType.date ? i.value = r || n : i.type === t.FieldType.time ? i.value = r || u : i.value = r;
    }, t.prototype.getFieldExtra = function(t, e) {
        return this.data[t].controls[e].extra;
    }, t.prototype.removeField = function(t) {
        return delete this.data[this.groupIndex].controls[t], this;
    }, t.prototype.apply = function(e) {
        var a = this;
        e.onBindChange || (e.onBindChange = function(r) {
            var i = r.currentTarget.dataset.name, o = r.currentTarget.dataset.group, n = r.currentTarget.dataset.type, u = r.detail.value;
            if (n === t.FieldType.datetime) {
                var d = r.currentTarget.dataset.childType, l = a.data[a.groupIndex].controls[i].value;
                l["date" === d ? 0 : 1] = u, u = l.join(" ");
            }
            a.setFieldValue(o, i, u), "change" === r.type && e.setData({
                formData: a.toArray()
            });
        }), e.setData({
            formData: this.toArray()
        });
    }, t.prototype.toArray = function() {
        return this.data;
    }, t;
}();

t.FieldType = {
    text: "text",
    number: "number",
    idcard: "idcard",
    digit: "digit",
    textarea: "textarea",
    checkbox: "checkbox",
    radio: "radio",
    datetime: "datetime",
    date: "date",
    time: "time"
}, module.exports = t;