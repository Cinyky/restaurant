/**
 * 金额计算之后舍去两位之后的小数，防止js计算的误差
 * @param num
 * @returns {number}
 */
function toMoney(num) {
  return Math.round(parseFloat(num) * 100) / 100;
}

function rad(d) {
  return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}

/**
 *
 * @param lat1  纬度1
 * @param lng1  经度1
 * @param lat2  纬度2
 * @param lng2  经度2
 */
function geoDistance(lat1, lng1, lat2, lng2) {
  let radLat1 = rad(lat1);
  let radLat2 = rad(lat2);
  let a = radLat1 - radLat2;
  let b = rad(lng1) - rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  return s;
}

// 获取当前的日期
function getNowDate(add = 0) {
  let timestamp = parseInt(Date.parse(new Date()) / 1000);
  timestamp += add;
  let date = new Date(timestamp * 1000);
  return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getDate()}`;
}

function getDateDiff(date1,date2) {
  date1 = Date.parse(date1);
  date2 = Date.parse(date2);
  let diffSeconds = Math.abs(date2 - date1);
  let diffDay = Math.round(diffSeconds / 86400000);
  return diffDay;
}

function showLoading () {
  wx.showLoading({title:'loading',mask:true});
}

function hideLoading () {
  wx.hideLoading();
}

function fixed2Int (num) {
  num=parseInt(num);
  return num<10?`0${num}`:num;
}

function secondsToTime (sec) {
  return `${fixed2Int(sec/3600)}:${fixed2Int((sec%3600)/60)}:${fixed2Int(sec%60)}`
}


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 对象转url参数string */
const objToUrlParams = obj => {
  let str = ''
  const s1 = '&'
  const s2 = '='
  if (typeof obj !== 'object') return str

  for (let k in obj) {
    const kstr = typeof k === 'string' ? k : k.toString()
    const val = typeof obj[k] === 'string' ? obj[k] : obj[k].toString()
    str += (s1 + kstr + s2 + val)
  }
  return str.substring(1)
}


module.exports = {
  toMoney: toMoney,
  geoDistance: geoDistance,
  getNowDate: getNowDate,
  getDateDiff:getDateDiff,
  showLoading:showLoading,
  hideLoading:hideLoading,
  secondsToTime:secondsToTime,
  formatTime: formatTime,
  objToUrlParams: objToUrlParams
};