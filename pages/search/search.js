/*
 * @Desc:
 * @Author: xuelianYi
 * @Date: 2021-09-14 15:03:37
 * @LastEditors: xuelianYi
 * @LastEditTime: 2021-09-23 11:36:27
 * @FilePath: \kaka_music\pages\search\search.js
 */
// pages/search/search.js
import request from '../../utils/request';
let isSend = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', // placeholder内容
    hotList: [], //热搜榜数据
    searchContent: '', // 用户输入的表单项数据
    searchList: [], // 关键字模糊匹配数据
    historyList: [], // 搜索历史记录
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化数据
    this.getInitData();
    // 获取历史记录
    this.getSearchHistory();
  },
  // 获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data,
    });
  },
  // 获取本地历史记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    if (historyList) {
      this.setData({
        historyList,
      });
    }
  },
  // 表单项内容发生改变的回调
  handleInput(event) {
    console.log(event);
    // 更新searchContent的状态数据
    this.setData({
      searchContent: event.detail.value.trim(),
    });

    if (isSend) {
      return;
    }
    isSend = true;
    // 函数节流
    setTimeout(async () => {
      if (!this.data.searchContent) {
        return;
      }
      let { searchContent, historyList } = this.data;
      let searchListData = await request('/search', {
        keywords: searchContent,
        limit: 10,
      });
      this.setData({
        searchList: searchListData.result.songs,
      });
      isSend = false;

      // 将搜索的关键字添加到搜索历史记录中
      if (historyList.indexOf(searchContent) !== -1) {
        historyList.splice(historyList.indexOf(searchContent), 1);
      }

      historyList.unshift(searchContent);
      this.setData({
        historyList,
      });

      wx.setStorageSync('searchHistory', historyList);
    }, 300);
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
