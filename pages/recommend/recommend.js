const util = require('../../utils/util.js');

Page({
  data: {
    recommendations: [],
    dailyData: null,
    settings: {},
    allRead: false,
    readStatus: {} // { id: true/false }
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    const today = util.getToday();
    const dailyData = util.getDailyData(today);
    const settings = util.getSettings();
    const recommendations = util.getTodayRecommendations();

    // 初始化阅读状态
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

  // 标记已阅读
  onMarkRead(e) {
    const id = e.currentTarget.dataset.id;
    const readStatus = this.data.readStatus;
    readStatus[id] = !readStatus[id];

    // 检查是否全部已读
    const allRead = this.data.recommendations.every(r => readStatus[r.id]);

    this.setData({ readStatus, allRead });
  },

  // 完成推荐，获得星星
  onComplete() {
    if (!this.data.allRead) {
      wx.showToast({ title: '请先完成所有推荐内容', icon: 'none' });
      return;
    }

    const result = util.completeRecommendation();
    if (result) {
      wx.showModal({
        title: '🎉 太棒了！',
        content: '完成推荐阅读，获得1颗星！⭐\n\n继续保持，明天也要加油哦！',
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

  // 返回
  goBack() {
    wx.navigateBack();
  }
});

