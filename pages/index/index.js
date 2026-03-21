const util = require('../../utils/util.js');

const CHEERS = [
  '太棒了！', '你真厉害！', '好样的！', '干得漂亮！',
  '超级棒！', '真了不起！', '你是最棒的！', '厉害厉害！',
  '给你点赞！', '牛牛牛！', '漂亮！', '就是这么强！'
];

const ALL_DONE_CHEERS = [
  '全部搞定！你太强了！', '完美通关！', '今日任务大满贯！',
  '全部完成！你是小天才！', '所有作业都搞定啦！', '大功告成！'
];

const CHEER_EMOJIS = ['🌟', '🎉', '👏', '💪', '🔥', '✨', '🏅', '👍'];
const ALL_DONE_EMOJIS = ['🏆', '🎊', '🥇', '👑', '🌈'];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
    checklistTotal: 0,
    checklistUnchecked: 0,
    checklistAllDone: false,
    // celebration overlay
    showCelebration: false,
    celebrationType: '', // 'task' or 'allDone'
    celebrationEmoji: '',
    celebrationText: '',
    celebrationSub: '',
    celebrationStars: []
  },

  onLoad() {
    this.initToday();
  },

  onShow() {
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
    const clStats = util.getChecklistStats();

    this.setData({
      dailyData: dailyData,
      totalStars: util.getTotalStars(),
      completedCount,
      totalCount,
      allCompleted,
      progressPercent,
      checklistTotal: clStats.total,
      checklistUnchecked: clStats.unchecked,
      checklistAllDone: clStats.allDone
    });
  },

  _buildFloatingStars(count) {
    const stars = [];
    const emojis = ['⭐', '🌟', '✨', '💫'];
    for (let i = 0; i < count; i++) {
      stars.push({
        id: i,
        emoji: emojis[i % emojis.length],
        left: Math.floor(Math.random() * 80) + 10,
        delay: Math.floor(Math.random() * 600),
        size: Math.floor(Math.random() * 20) + 30
      });
    }
    return stars;
  },

  _showTaskCelebration(taskTitle) {
    this.setData({
      showCelebration: true,
      celebrationType: 'task',
      celebrationEmoji: randomPick(CHEER_EMOJIS),
      celebrationText: randomPick(CHEERS),
      celebrationSub: taskTitle + '  +1⭐',
      celebrationStars: this._buildFloatingStars(8)
    });
    this._autoDismissCelebration = setTimeout(() => {
      this.setData({ showCelebration: false });
    }, 5000);
  },

  _showAllDoneCelebration() {
    this.setData({
      showCelebration: true,
      celebrationType: 'allDone',
      celebrationEmoji: randomPick(ALL_DONE_EMOJIS),
      celebrationText: randomPick(ALL_DONE_CHEERS),
      celebrationSub: '额外奖励 +3⭐',
      celebrationStars: this._buildFloatingStars(16)
    });
  },

  onMaskTap() {
    if (this.data.celebrationType === 'task') {
      this.onDismissCelebration();
    }
  },

  onCardTap() {
    if (this.data.celebrationType === 'task') {
      this.onDismissCelebration();
    }
  },

  onDismissCelebration() {
    if (this._autoDismissCelebration) {
      clearTimeout(this._autoDismissCelebration);
    }
    this.setData({ showCelebration: false });
  },

  onCelebrationGoChecklist() {
    this.setData({ showCelebration: false });
    wx.navigateTo({ url: '/pages/checklist/checklist' });
  },

  onCheckInTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const today = util.getToday();
    const result = util.checkInTask(today, taskId);

    if (!result.success) {
      wx.showToast({ title: result.message, icon: 'none' });
      return;
    }

    this.refreshData();

    if (result.allDone) {
      this._showAllDoneCelebration();
    } else {
      this._showTaskCelebration(result.taskTitle);
    }
  },

  onUndoCheckIn(e) {
    const taskId = e.currentTarget.dataset.id;
    const today = util.getToday();

    wx.showModal({
      title: '撤销打卡',
      content: '确定要撤销这项打卡吗？对应的星星也会扣除。',
      confirmText: '撤销',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          const result = util.undoCheckInTask(today, taskId);
          if (!result.success) {
            wx.showToast({ title: result.message, icon: 'none' });
            return;
          }
          this.refreshData();
          let msg = '「' + result.taskTitle + '」已撤销 -1⭐';
          if (result.undoneBonus) {
            msg = '「' + result.taskTitle + '」已撤销 -1⭐\n全部完成奖励也已扣除 -3⭐';
          }
          wx.showToast({ title: msg, icon: 'none', duration: 2000 });
        }
      }
    });
  },

  showAddTask() {
    this.setData({ showAddTask: true });
  },

  hideAddTask() {
    this.setData({ showAddTask: false, newTaskName: '' });
  },

  onTaskNameInput(e) {
    this.setData({ newTaskName: e.detail.value });
  },

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

    this.setData({ newTaskName: '', showAddTask: false });
    this.refreshData();
    wx.showToast({ title: '任务已添加', icon: 'success' });
  },

  onDeleteTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const today = util.getToday();
    const dailyData = util.getDailyData(today);
    const task = dailyData.tasks.find(t => t.id === taskId);

    if (task && task.completed) {
      wx.showToast({ title: '已打卡的任务无法删除', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          dailyData.tasks = dailyData.tasks.filter(t => t.id !== taskId);
          util.saveDailyData(today, dailyData);
          this.refreshData();
        }
      }
    });
  },

  goChecklist() {
    wx.navigateTo({ url: '/pages/checklist/checklist' });
  },

  goRecommend() {
    wx.navigateTo({ url: '/pages/recommend/recommend' });
  }
});
