const util = require('../../utils/util.js');

Page({
  data: {
    item: null,
    isBook: false,
    isVideo: false,
    // 视频链接类型：mp4 / bilibili / link / none
    videoLinkType: 'none',
    // 拼音相关
    hasPinyin: false,
    pinyinParagraphs: [],
    // 普通文本段落
    paragraphs: [],
    // 阅读计时
    readSeconds: 0,
    readMinutes: 0,
    readDone: false,
    minReadSeconds: 30
  },

  _timer: null,

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
    const videoLinkType = isVideo ? util.detectVideoLinkType(item.videoUrl) : 'none';
    const hasPinyin = isBook && item.hasPinyin && item.pinyinContent;

    let pinyinParagraphs = [];
    let paragraphs = [];

    if (isBook) {
      if (hasPinyin) {
        pinyinParagraphs = util.parsePinyinText(item.pinyinContent);
      }
      // 普通文本作为后备
      if (item.content) {
        paragraphs = item.content.split('\n').map(p => p.trim());
      }
    }

    this.setData({
      item, isBook, isVideo, videoLinkType,
      hasPinyin, pinyinParagraphs, paragraphs
    });

    wx.setNavigationBarTitle({
      title: isBook ? '📖 阅读' : '🎬 观看'
    });

    this.startTimer();
  },

  onUnload() {
    this.stopTimer();
  },

  startTimer() {
    this._timer = setInterval(() => {
      const s = this.data.readSeconds + 1;
      this.setData({
        readSeconds: s,
        readMinutes: Math.floor(s / 60),
        readDone: s >= this.data.minReadSeconds
      });
    }, 1000);
  },

  stopTimer() {
    if (this._timer) clearInterval(this._timer);
  },

  onVideoEnded() {
    this.setData({ readDone: true });
  },

  // 复制链接到剪贴板
  onCopyLink() {
    const url = this.data.item.videoUrl;
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showToast({ title: '链接已复制', icon: 'success' });
      }
    });
  },

  // 切换拼音/普通模式
  togglePinyin() {
    this.setData({ hasPinyin: !this.data.hasPinyin });
  },

  onMarkDone() {
    if (!this.data.readDone) {
      const remaining = this.data.minReadSeconds - this.data.readSeconds;
      wx.showToast({ title: `请再阅读${remaining}秒`, icon: 'none' });
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
