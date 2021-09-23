/*
 * @Desc:
 * @Author: xuelianYi
 * @Date: 2021-09-01 12:01:18
 * @LastEditors: xuelianYi
 * @LastEditTime: 2021-09-13 16:09:40
 * @FilePath: \kaka_music\pages\songDetail\songDetail.js
 */
import request from '../../../utils/request';
import formatDate from '../../../utils/formatDate';
// 获取全局实例
const appInstance = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否在播放
    song: {}, // 歌曲详情页对象
    index: 0, // 当前歌曲在列表中的位置
    recommendList: [], // 歌曲id列表
    musicLink: '', // 音乐的链接
    currentTime: '00:00', // 实时时间
    durationTime: '00:00', // 总时长
    currentRatio: 0, // 实时进度比例
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options：用于接收路由跳转的query参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长，会自动截取掉

    // 获取音乐详情数据
    const eventChannel = this.getOpenerEventChannel();
    const that = this;
    eventChannel.on('detail', function (data) {
      const durationTime = that.formatTime(data.song.hMusic.playTime);
      that.setData({
        song: data.song,
        index: data.index,
        recommendList: data.recommendList,
        durationTime,
      });
    });

    // 判断当前页面音乐是否在播放
    if (
      appInstance.globalData.isMusicPlay &&
      appInstance.globalData.musicId === this.data.song.id
    ) {
      // 修改当前页面音乐的播放状态为true
      this.setData({
        isPlay: true,
      });
    }
    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();

    // 监听音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      appInstance.globalData.musicId = this.data.song.id;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    // 监听背景音频自然播放结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换至下一首音乐，并且自动播放
      this.switchMusic('next');
      // 将实时进度条的长度还原成0
    });
    this.backgroundAudioManager.onWaiting(() => {
    });

    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('总时长', this.backgroundAudioManager.duration);
      // console.log('实时时间', this.backgroundAudioManager.currentTime);
      let currentTime = this.formatTime(
        this.backgroundAudioManager.currentTime * 1000
      );
      let currentRatio =
        ((this.backgroundAudioManager.currentTime * 1000) /
          this.data.song.hMusic.playTime) *
        100;
      this.setData({
        currentTime,
        currentRatio
      });

      if (currentTime === 100) {
        console.log('播完了');
      }
    });
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay,
    });

    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 点击播放/暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    this.musicControl(isPlay, this.data.song.id, this.data.musicLink);
  },
  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      // 音乐播放
      if (!musicLink) {
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url', {
          id: musicId
        });
        musicLink = musicLinkData.data[0].url;
        console.log('请求到数据了');
      }
      this.setData({
        musicLink,
      });

      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
      console.log('开启音乐播放');
    } else {
      // 暂停音乐
      this.backgroundAudioManager.pause();
    }
  },
  // 点击切歌按钮
  handleSwitch(event) {
    let type = event.currentTarget.id;
    this.switchMusic(type);
  },
  // 实现切歌
  switchMusic(type) {
    let {
      index,
      recommendList
    } = this.data;
    let newIndex = 0;
    if (type === 'pre') {
      if (!index) {
        newIndex = recommendList.length - 1;
      } else {
        newIndex = index - 1;
      }
    } else {
      console.log('next');
      if (index >= recommendList.length - 1) {
        newIndex = 0;
      } else {
        newIndex = index + 1 - 0;
      }
    }
    let song = recommendList[newIndex];
    const durationTime = this.formatTime(song.hMusic.playTime);

    this.musicControl(true, song.id);
    this.setData({
      song,
      durationTime,
      index: newIndex,
    });
  },
  // 时间格式化
  formatTime(time) {
    return formatDate(time, 'mm:ss');
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