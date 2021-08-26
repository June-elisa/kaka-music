import request from '../../utils/request'

let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {}, // 用户信息
    recentPlayList: [], // 用户的播放记录

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 更新userInfo的状态
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
    }
    console.log(userInfo);

    // 获取用户播放记录
    this.getUserRencentPlayList(this.data.userInfo.userId)

  },
  // 获取用户播放记录的功能函数
  async getUserRencentPlayList(userId) {
    let recentPlayListData = await request('/user/record', {
      uid: userId,
      type: 1
    })

    this.setData({
      recentPlayList: recentPlayListData.weekData.splice(0, 10)
    })
  },

  handleTouchStart(event) {
    console.log('start');
    startY = event.touches[0].clientY;
    this.setData({
      coverTransition: ''
    })
  },
  handleTouchMove(event) {
    console.log('move');
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return
    }

    if (moveDistance >= 70) {
      moveDistance = 70
    }

    // 动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
    console.log(moveDistance);
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 0.6s linear'
    })
  },
  // 跳转至登录login界面的回调
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
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