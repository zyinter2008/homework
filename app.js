App({
  onLaunch() {
    // 初始化默认设置
    const settings = wx.getStorageSync('settings');
    if (!settings) {
      wx.setStorageSync('settings', {
        studentName: '小明',
        studentAge: 8,
        parentPin: '1234'
      });
    }
    // 初始化星星数据
    const stars = wx.getStorageSync('stars');
    if (!stars) {
      wx.setStorageSync('stars', { total: 0, history: [] });
    }
    // 初始化礼品数据
    const gifts = wx.getStorageSync('gifts');
    if (!gifts) {
      wx.setStorageSync('gifts', [
        { id: 1, name: '小贴纸一套', stars: 5, stock: 10 },
        { id: 2, name: '彩色画笔', stars: 15, stock: 5 },
        { id: 3, name: '故事书一本', stars: 25, stock: 3 },
        { id: 4, name: '小玩具', stars: 40, stock: 2 },
        { id: 5, name: '周末公园游', stars: 60, stock: 99 }
      ]);
    }
    // 初始化兑换记录
    if (!wx.getStorageSync('redemptions')) {
      wx.setStorageSync('redemptions', []);
    }
    // 初始化预设任务
    if (!wx.getStorageSync('presetTasks')) {
      wx.setStorageSync('presetTasks', ['语文作业', '数学作业', '英语作业', '课外阅读']);
    }
  },
  globalData: {}
});

