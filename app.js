const cloud = require('./utils/cloud.js');

App({
  async onLaunch() {
    // 初始化云开发
    const cloudOk = await cloud.initCloud();

    if (cloudOk) {
      // 云端可用：从云端同步最新数据到本地
      await cloud.syncFromCloud();
    }

    // 初始化默认数据（仅首次使用时生效）
    this.initDefaults();
  },

  initDefaults() {
    if (!wx.getStorageSync('settings')) {
      wx.setStorageSync('settings', {
        studentName: '小明',
        studentAge: 8,
        parentPin: '1234'
      });
    }
    if (!wx.getStorageSync('stars')) {
      wx.setStorageSync('stars', { total: 0, history: [] });
    }
    if (!wx.getStorageSync('gifts')) {
      wx.setStorageSync('gifts', [
        { id: 1, name: '小贴纸一套', stars: 5, stock: 10 },
        { id: 2, name: '彩色画笔', stars: 15, stock: 5 },
        { id: 3, name: '故事书一本', stars: 25, stock: 3 },
        { id: 4, name: '小玩具', stars: 40, stock: 2 },
        { id: 5, name: '周末公园游', stars: 60, stock: 99 }
      ]);
    }
    if (!wx.getStorageSync('redemptions')) {
      wx.setStorageSync('redemptions', []);
    }
    if (!wx.getStorageSync('presetTasks')) {
      wx.setStorageSync('presetTasks', ['语文作业', '数学作业', '英语作业', '课外阅读']);
    }
  },

  globalData: {}
});
