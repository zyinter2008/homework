const util = require('../../utils/util.js');

Page({
  data: {
    today: '',
    todayDisplay: '',
    dailyData: null,
    totalStars: 0,
    completedCount: 0,
    totalCount: 0,
    allCompleted: false,
    progressPercent: 0,
    newTaskName: '',
    showAddTask: false,
    checkInResult: null
  },

  onLoad() {
    this.initToday();
  },

  onShow() {
    // 更新自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    this.refreshData();
  },

  initToday() {
    const today = util.getToday();
    this.setData({
      today: today,
      todayDisplay: util.formatDate(today)
    });
  },

  refreshData() {
    const today = util.getToday();
    let dailyData = util.getDailyData(today);

    // 如果今天还没有任务，自动从预设加载
    if (dailyData.tasks.length === 0) {
      const presets = util.getPresetTasks();
      if (presets.length > 0) {
        dailyData = util.loadPresetToToday();
      }
    }

    const completedCount = dailyData.tasks.filter(t => t.completed).length;
    const totalCount = dailyData.tasks.length;
    const allCompleted = totalCount > 0 && completedCount === totalCount;
    const progressPercent = totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0;

    this.setData({
      dailyData: dailyData,
      totalStars: util.getTotalStars(),
      completedCount,
      totalCount,
      allCompleted,
      progressPercent
    });
  },

  // 切换任务完成状态
  onToggleTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const today = util.getToday();
    const dailyData = util.toggleTask(today, taskId);
    const completedCount = dailyData.tasks.filter(t => t.completed).length;
    const totalCount = dailyData.tasks.length;
    const allCompleted = totalCount > 0 && completedCount === totalCount;
    const progressPercent = totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0;
    this.setData({ dailyData, completedCount, totalCount, allCompleted, progressPercent });
  },

  // 显示添加任务
  showAddTask() {
    this.setData({ showAddTask: true });
  },

  hideAddTask() {
    this.setData({ showAddTask: false, newTaskName: '' });
  },

  onTaskNameInput(e) {
    this.setData({ newTaskName: e.detail.value });
  },

  // 添加临时任务
  addTask() {
    const name = this.data.newTaskName.trim();
    if (!name) {
      wx.showToast({ title: '请输入任务名称', icon: 'none' });
      return;
    }

    const today = util.getToday();
    const dailyData = util.getDailyData(today);
    const maxId = dailyData.tasks.reduce((max, t) => Math.max(max, t.id), 0);
    dailyData.tasks.push({
      id: maxId + 1,
      title: name,
      completed: false
    });
    util.saveDailyData(today, dailyData);

    this.setData({
      dailyData: dailyData,
      newTaskName: '',
      showAddTask: false
    });

    wx.showToast({ title: '任务已添加', icon: 'success' });
  },

  // 打卡
  onCheckIn() {
    const today = util.getToday();
    const result = util.checkIn(today);

    if (!result.success) {
      wx.showToast({ title: result.message, icon: 'none' });
      return;
    }

    this.setData({ checkInResult: result });
    this.refreshData();

    // 显示打卡成功弹窗
    let msg = `🎉 打卡成功！获得 ${result.starsEarned} 颗星`;
    if (result.timeBonus) {
      msg += '\n⏰ 8:30前完成，额外+1⭐';
    }
    if (result.canShowRecommend) {
      wx.showModal({
        title: '打卡成功！',
        content: msg + '\n\n📚 完成推荐阅读还能再得1颗星哦！',
        confirmText: '去看看',
        cancelText: '稍后再看',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/recommend/recommend' });
          }
        }
      });
    } else {
      wx.showModal({
        title: '打卡成功！',
        content: msg,
        showCancel: false,
        confirmText: '好的'
      });
    }

    // 提醒家长检查
    setTimeout(() => {
      wx.showToast({
        title: '📢 已提醒家长检查作业',
        icon: 'none',
        duration: 2000
      });
    }, 2000);
  },

  // 跳转到推荐页
  goRecommend() {
    wx.navigateTo({ url: '/pages/recommend/recommend' });
  },

  // 删除任务
  onDeleteTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const today = util.getToday();
    const dailyData = util.getDailyData(today);
    
    if (dailyData.checkedIn) {
      wx.showToast({ title: '已打卡，无法修改', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          dailyData.tasks = dailyData.tasks.filter(t => t.id !== taskId);
          util.saveDailyData(today, dailyData);
          this.setData({ dailyData });
        }
      }
    });
  }
});

