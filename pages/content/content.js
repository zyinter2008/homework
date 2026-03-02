const util = require('../../utils/util.js');

Page({
  data: {
    item: null,
    isBook: false,
    isVideo: false,
    hasVideoUrl: false,
    paragraphs: [],
    readTimer: null,
    readSeconds: 0,
    readMinutes: 0,
    readDone: false,
    minReadSeconds: 30
  },

  onLoad(options) {
    const id = Number(options.id);
    const item = util.getRecommendationById(id);
    if (!item) {
      wx.showToast({ title: '内容不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const isBook = item.type === 'book';
    const isVideo = item.type === 'video';
    const hasVideoUrl = isVideo && item.videoUrl && item.videoUrl.trim() !== '';
    let paragraphs = [];
    if (isBook && item.content) {
      paragraphs = item.content.split('\n').map(p => p.trim());
    }

    this.setData({ item, isBook, isVideo, hasVideoUrl, paragraphs });

    wx.setNavigationBarTitle({
      title: isBook ? '📖 阅读' : '🎬 观看'
    });

    this.startReadTimer();
  },

  onUnload() {
    this.stopReadTimer();
  },

  startReadTimer() {
    const timer = setInterval(() => {
      const seconds = this.data.readSeconds + 1;
      const readDone = seconds >= this.data.minReadSeconds;
      this.setData({
        readSeconds: seconds,
        readMinutes: Math.floor(seconds / 60),
        readDone: readDone
      });
    }, 1000);
    this.setData({ readTimer: timer });
  },

  stopReadTimer() {
    if (this.data.readTimer) {
      clearInterval(this.data.readTimer);
    }
  },

  onVideoEnded() {
    this.setData({ readDone: true });
  },

  onMarkDone() {
    if (!this.data.readDone) {
      const remaining = this.data.minReadSeconds - this.data.readSeconds;
      wx.showToast({
        title: `请再阅读${remaining}秒`,
        icon: 'none'
      });
      return;
    }

    wx.showToast({ title: '阅读完成 ✓', icon: 'success' });
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.onContentDone) {
      prevPage.onContentDone(this.data.item.id);
    }
    setTimeout(() => wx.navigateBack(), 800);
  },

  goBack() {
    wx.navigateBack();
  }
});
