/*
 * @Desc: 发送Ajax请求
 * @Author: xuelianYi
 * @Date: 2021-08-16 16:25:51
 * @LastEditors: xuelianYi
 * @LastEditTime: 2021-08-18 12:04:47
 * @FilePath: \kaka_music\utils\request.js
 */

/* 
    1.封装功能函数
        1.功能点明确
        2.函数内部应该保留固定代码（静态的）
        3.将动态的数据抽取成形参，由使用者根据自身的情况动态的传入实参
        4.一个良好的功能函数应该设置形参的默认值（ES6形参的默认值）

    2.封装功能组件
        1.功能点明确
        2.组件内部保留静态的代码
        3.将动态的数据抽取成props参数，由使用者根据自身的情况以标签属性的形式，动态传入props数据
        4.一个良好的组件应该设置组件的必要性及数据类型
            props: {
                msg:{
                    required:true,
                    default:默认值,
                    type:String
                }
            }
*/

import config from './config'

export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        // 1.new Promise 初始化promise实例的状态为pending
        wx.request({
            url: config.mobileHost + url,
            data,
            method,
            success: (res) => {
                // console.log('success!!', res);
                resolve(res.data); // resolve修改promise的状态为成功状态 resolved
            },
            fail: (err) => {
                // console.log('fail!!', err);
                reject(err); // reject修改promise的状态为失败状态 rejected
            }
        })
    })
}