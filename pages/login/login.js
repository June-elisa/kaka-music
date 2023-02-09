/*
 说明：登录流程
 1.收集表单项数据
 2.前端验证
    1)验证用户信息（账号,密码）是否合法
    2)前端验证不通过就提示用户，不需要发请求给后端
    3)前端验证通过了，发请求（携带账号，密码）给服务端
3.后端验证
    1)验证用户是否存在
    2)用户不存在直接返回，告诉前端用户不存在
    3)用户存在需验证密码是否正确
    4)密码不正确返回给前端，提示密码不正确
    5)密码正确返回给前端数据，提示用户登录成功(会携带用户的相关信息)
 */
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', // 手机号
    captcha: '', // 用户密码
    loginType: 'phone', // phone:手机号登录，QR:扫码登录
    key: '', // QR key
    isWaitConfirm: false, // 等待确认二维码
    qrimg: '', // base64
    timeInter: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 表单项内容发生改变的回调
  handleInput(event) {
    let type = event.currentTarget.id;
    // console.log(event);
    this.setData({
      [type]: event.detail.value
    })
  },

  // 发送验证码
  async sendCode() {
    let {
      phone
    } = this.data;
    console.log(phone);
    if (!this.checkPhone(phone)) {
      return;
    }
    let res = await request('/captcha/sent', {
      phone
    });
    if (res.code == 200) {
      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      })
    }

  },

  // 验证手机号码格式
  checkPhone(phone) {
    /*
      手机号验证：
      1.内容为空
      2.手机号格式不正确
      3.手机号格式正确，验证通过
    */

    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false;
    }

    // 定义正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return false;
    }
    return true;
  },

  // 登录的回调
  async login() {
    // 1.收集表单项数据
    let {
      phone,
      captcha
    } = this.data;
    // 2.前端验证
    if (!this.checkPhone(phone)) {
      return;
    }

    if (!captcha) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    // 3.后端验证
    let res = await request('/login/cellphone', {
      phone,
      captcha
    })

    if (res.code === 200) {
      wx.showToast({
        title: '登录成功',
      })

      // 将用户信息存储至本地
      wx.setStorageSync('userInfo', JSON.stringify(res.profile))

      // 跳转至个人中心personal页面
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    } else if (res.code === 400) {
      wx.showToast({
        title: '该手机号尚未注册',
        icon: 'none'
      })
    } else if (res.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '手机号或密码错误，请重新登录',
        icon: 'none'
      })
    }

  },

  // 切换到扫码登录
  async toggleQRLogin() {
    this.setData({
      loginType: 'QR'
    })

    // step1、生成二维码key
    let res1 = await request('/login/qr/key', {
      timerstamp: new Date().getTime()
    });
    let key = res1.data.unikey;
    this.setData({
      key
    })

    // step2、生成二维码
    let res2 = await request('/login/qr/create', {
      key,
      qrimg: true,
      timerstamp: new Date().getTime(),
    });
    this.setData({
      qrimg: res2.data.qrimg
    })

    let testTimer = setInterval(() => {
      console.log('1');
    }, 100)

    clearInterval(testTimer);


    // step3、检测扫码状态
    this.data.timeInter = setInterval(async () => {
      let res3 = await request('/login/qr/check', {
        key,
        timerstamp: new Date().getTime(),
        isLogin: true
      });
      if (res3.code == '802') {
        console.log('扫码成功')
        this.setData({
          isWaitConfirm: true
        })
      } else if (res3.code == '803') {
        clearInterval(this.data.timeInter);
        this.getPersonalInfo()
        // 跳转至个人中心personal页面
        wx.reLaunch({
          url: '/pages/personal/personal'
        })

      }
    }, 2000)
  },

  // 存储用户信息
  async getPersonalInfo() {
    let res = await request('/user/account');
    // 将用户信息存储至本地
    wx.setStorageSync('userInfo', JSON.stringify(res.profile))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timeInter);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})