const util = require('../../utils/util.js');

Page({
  data: {
    recommendations: [],
    dailyData: null,
    settings: {},
    allRead: false,
    readStatus: {}
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 刷新阅读状态（从内容页返回后）
    if (this.data.recommendations.length > 0) {
      const allRead = this.data.recommendations.every(r => this.data.readStatus[r.id]);
      this.setData({ allRead });
    }
  },

  loadData() {
    const today = util.getToday();
    const dailyData = util.getDailyData(today);
    const settings = util.getSettings();
    const recommendations = util.getTodayRecommendations();

    const readStatus = {};
    recommendations.forEach(r => {
      readStatus[r.id] = false;
    });

    this.setData({
      dailyData,
      settings,
      recommendations,
      readStatus,
      allRead: false
    });
  },

  // 点击进入阅读/观看
  onViewContent(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/content/content?id=${id}`
    });
  },

  // 从内容页返回时标记已读
  onContentDone(id) {
    const readStatus = this.data.readStatus;
    readStatus[id] = true;
    const allRead = this.data.recommendations.every(r => readStatus[r.id]);
    this.setData({ readStatus, allRead });
  },

  // 完成全部推荐，获得星星
  onComplete() {
    if (!this.data.allRead) {
      wx.showToast({ title: '请先完成所有推荐内容', icon: 'none' });
      return;
    }

    const result = util.completeRecommendation();
    if (result) {
      wx.showModal({
        title: '太棒了！',
        content: '完成推荐阅读，获得1颗星！\n\n继续保持，明天也要加油哦！',
        showCancel: false,
        confirmText: '好的',
        success: () => {
          wx.navigateBack();
        }
      });
    } else {
      wx.showToast({ title: '今天已经完成过了', icon: 'none' });
    }
  },

  goBack() {
    wx.navigateBack();
  }
});
