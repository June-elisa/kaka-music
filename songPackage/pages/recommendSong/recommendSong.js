/*
 * @Desc:
 * @Author: xuelianYi
 * @Date: 2021-08-31 11:11:57
 * @LastEditors: xuelianYi
 * @LastEditTime: 2021-09-09 17:32:07
 * @FilePath: \kaka_music\pages\recommendSong\recommendSong.js
 */
import request from '../../../utils/request';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 天
    month: '', // 月
    recommendList: [], // 推荐列表数据
    recommendIdList: [], // 推荐歌曲ID列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000,
        success: () => {
          // 跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login',
          });
        },
      });
    }

    // 更新日期的状态数据
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    });

    this.getRecommendList();
  },

  // 获取推荐列表数据
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs',{
      timerstamp:new Date().getTime()
    });
    console.log(recommendListData);
    this.setData({
      recommendList: recommendListData.data.dailySongs,
    });
    const recommendIdList = [];
    recommendListData.data.dailySongs.map((item) => {
      recommendIdList.push(item.id);
    });
    this.setData({
      recommendIdList,
    });
  },

  // 跳转至songDetail页面
  toSongDetail(event) {
    let song = event.currentTarget.dataset.song;
    let index = event.currentTarget.dataset.index;
    let {
      recommendList
    } = this.data;
    console.log(song.id);
    // 路由跳转传参 query传参
    wx.navigateTo({
      url: `/songPackage/pages/songDetail/songDetail?songId=${song.id}`,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('detail', {
          song,
          index,
          recommendList
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});