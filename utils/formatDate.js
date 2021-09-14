/*
 * @Desc:
 * @Author: xuelianYi
 * @Date: 2021-09-10 10:21:50
 * @LastEditors: xuelianYi
 * @LastEditTime: 2021-09-10 10:49:49
 * @FilePath: \kaka_music\utils\formatDate.js
 */
/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
export default (time, format = 'YY-MM-DD hh:mm:ss') => {
  let date = new Date(time);
  let year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  let preArr = Array.apply(null, Array(10)).map(function (elem, index) {
    return '0' + index;
  }); ////开个长度为10的数组 格式为 00 01 02 03

  let newTime = format
    .replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec);

  return newTime;
};
