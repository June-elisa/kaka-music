import request from '../../utils/request';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签数据
    navId: '', //导航的标识
    videoList: [], // 视频列表数据
    videoId: '', // 视频id标识
    videoUpdateTime: [], // 记录video播放的时长
    isTriggered: false, // 标识下拉刷新是否被触发
    shareVideo: {}, // 分享视频信息
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

    // 获取导航数据
    this.getvideoGroupListData();
  },

  // 获取导航数据
  async getvideoGroupListData() {
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id,
    });

    // 获取视频列表
    this.getVideoList(this.data.navId);
  },

  // 获取视频列表数据
  async getVideoList(navId) {
    let videoListData = await request('/video/group', {
      id: navId,
    });
    // 关闭消息提示框
    wx.hideLoading();
    // 关闭下拉刷新
    this.setData({
      videoList: videoListData.datas,
      isTriggered: false,
    });
  },

  // 点击切换导航的回调
  changeNav(event) {
    let navId = event.currentTarget.id; // 通过id向event传参的时候，如果传的是number，会自动转换成String
    this.setData({
      navId: navId * 1,
      videoList: [],
    });

    // 显示正在加载
    wx.showLoading({
      title: '正在加载',
    });

    // 动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId);
  },

  // 点击播放/继续播放的的回调
  handlePlay(event) {
    // 需求：在播放新视频之前需要关闭上一个正在播放的视频
    let vid = event.currentTarget.id;
    // 关闭上一个播放的视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // this.vid = vid;

    // 更新data中videoId的状态数据
    this.setData({
      videoId: vid,
    });

    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    // 判断当前的视频是否有播放记录，如果有，跳转至指定的播放位置
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find((item) => item.vid === vid);
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    }

    this.videoContext.play();
  },

  // 监听视频播放进度的回调
  handleTimeUpdate(event) {
    // console.log(event);
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime,
    };
    let { videoUpdateTime } = this.data;
    // 判断记录播放时长的videoUpdateTime数组中是否有记录当前视频的播放记录
    let videoItem = videoUpdateTime.find(
      (item) => item.vid === videoTimeObj.vid
    );
    if (videoItem) {
      //之前有
      videoItem.currentTime = videoTimeObj.currentTime;
    } else {
      // 之前没有
      videoUpdateTime.push(videoTimeObj);
    }
    // 更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime,
    });
  },

  // 视频播放结束调用的回调
  handleEnded(event) {
    // console.log('播放结束');
    // 移除记录播放时长数组中当前视频的对象
    let { videoUpdateTime } = this.data;

    videoUpdateTime.splice(
      videoUpdateTime.findIndex((item) => item.vid === event.currentTarget.id),
      1
    );
    this.setData({
      videoUpdateTime,
    });
  },

  // 跳转至搜索页面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },

  // 自定义下拉刷新的回调：scroll-view
  handleRefresher() {
    // console.log('scroll-view 下拉刷新');
    // 再次发请求，获取最新的视频列表数据
    this.getVideoList(this.data.navId);
  },

  // 自定义上拉触底的回调
  handleToLower() {
    // console.log('scroll-view 上拉触底');
    // 数据分页： 1.后端分页 2. 前端分页
    // console.log('发请求 || 获取最新列表');
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
  onShareAppMessage: function ({ from, target }) {
    let { videoList } = this.data;
    let shareVideo = videoList.find((item) => item.data.vid === target.id).data;

    if (from === 'button') {
      return {
        title: shareVideo.title,
        page: '/pages/video/video',
        imageUrl: shareVideo.coverUrl,
      };
    }
  },
});
