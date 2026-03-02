const util = require('../../utils/util.js');

Page({
  data: {
    isUnlocked: false,
    pinInput: '',
    activeSection: 'review', // review | tasks | gifts | redemptions | settings
    // 评价相关
    today: '',
    todayDisplay: '',
    dailyData: null,
    // 预设任务
    presetTasks: [],
    newPresetTask: '',
    // 礼品管理
    gifts: [],
    showAddGift: false,
    newGift: { name: '', stars: '', stock: '' },
    editingGiftId: null,
    // 兑换管理
    redemptions: [],
    // 设置
    settings: {}
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    this.refreshData();
  },

  refreshData() {
    const today = util.getToday();
    this.setData({
      today: today,
      todayDisplay: util.formatDate(today),
      dailyData: util.getDailyData(today),
      presetTasks: util.getPresetTasks(),
      gifts: util.getGifts(),
      redemptions: util.getRedemptions(),
      settings: util.getSettings()
    });
  },

  // ========== 密码验证 ==========
  onPinInput(e) {
    this.setData({ pinInput: e.detail.value });
  },

  onUnlock() {
    if (util.verifyParentPin(this.data.pinInput)) {
      this.setData({ isUnlocked: true, pinInput: '' });
      this.refreshData();
    } else {
      wx.showToast({ title: '密码错误', icon: 'none' });
      this.setData({ pinInput: '' });
    }
  },

  // ========== 切换区域 ==========
  switchSection(e) {
    const section = e.currentTarget.dataset.section;
    this.setData({ activeSection: section });
  },

  // ========== 作业评价 ==========
  onReview(e) {
    const rating = Number(e.currentTarget.dataset.rating);
    const today = util.getToday();
    const result = util.parentReview(today, rating);

    wx.showToast({ title: result.message, icon: 'none', duration: 2000 });
    this.refreshData();
  },

  // ========== 预设任务管理 ==========
  onPresetTaskInput(e) {
    this.setData({ newPresetTask: e.detail.value });
  },

  addPresetTask() {
    const name = this.data.newPresetTask.trim();
    if (!name) {
      wx.showToast({ title: '请输入任务名称', icon: 'none' });
      return;
    }
    const tasks = this.data.presetTasks;
    if (tasks.includes(name)) {
      wx.showToast({ title: '任务已存在', icon: 'none' });
      return;
    }
    tasks.push(name);
    util.savePresetTasks(tasks);
    this.setData({ presetTasks: tasks, newPresetTask: '' });
    wx.showToast({ title: '已添加', icon: 'success' });
  },

  deletePresetTask(e) {
    const index = e.currentTarget.dataset.index;
    const tasks = this.data.presetTasks;
    wx.showModal({
      title: '确认删除',
      content: `确定删除"${tasks[index]}"吗？`,
      success: (res) => {
        if (res.confirm) {
          tasks.splice(index, 1);
          util.savePresetTasks(tasks);
          this.setData({ presetTasks: tasks });
        }
      }
    });
  },

  // 将预设任务应用到今天
  applyPresetToToday() {
    if (this.data.presetTasks.length === 0) {
      wx.showToast({ title: '没有预设任务', icon: 'none' });
      return;
    }
    const dailyData = util.getDailyData();
    if (dailyData.checkedIn) {
      wx.showToast({ title: '今天已打卡，无法修改', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '确认',
      content: '将预设任务设为今日作业？（会覆盖已设置的任务）',
      success: (res) => {
        if (res.confirm) {
          util.loadPresetToToday();
          this.refreshData();
          wx.showToast({ title: '已设置今日任务', icon: 'success' });
        }
      }
    });
  },

  // ========== 礼品管理 ==========
  toggleAddGift() {
    this.setData({
      showAddGift: !this.data.showAddGift,
      newGift: { name: '', stars: '', stock: '' },
      editingGiftId: null
    });
  },

  onGiftNameInput(e) {
    this.setData({ 'newGift.name': e.detail.value });
  },

  onGiftStarsInput(e) {
    this.setData({ 'newGift.stars': e.detail.value });
  },

  onGiftStockInput(e) {
    this.setData({ 'newGift.stock': e.detail.value });
  },

  saveGift() {
    const { name, stars, stock } = this.data.newGift;
    if (!name.trim()) {
      wx.showToast({ title: '请输入礼品名称', icon: 'none' });
      return;
    }
    if (!stars || Number(stars) <= 0) {
      wx.showToast({ title: '请输入正确的星星数', icon: 'none' });
      return;
    }
    if (!stock || Number(stock) < 0) {
      wx.showToast({ title: '请输入正确的库存', icon: 'none' });
      return;
    }

    const giftData = {
      name: name.trim(),
      stars: Number(stars),
      stock: Number(stock)
    };

    if (this.data.editingGiftId) {
      util.updateGift(this.data.editingGiftId, giftData);
      wx.showToast({ title: '已更新', icon: 'success' });
    } else {
      util.addGift(giftData);
      wx.showToast({ title: '已添加', icon: 'success' });
    }

    this.setData({
      showAddGift: false,
      newGift: { name: '', stars: '', stock: '' },
      editingGiftId: null
    });
    this.refreshData();
  },

  editGift(e) {
    const id = e.currentTarget.dataset.id;
    const gift = this.data.gifts.find(g => g.id === id);
    if (gift) {
      this.setData({
        showAddGift: true,
        editingGiftId: id,
        newGift: {
          name: gift.name,
          stars: String(gift.stars),
          stock: String(gift.stock)
        }
      });
    }
  },

  deleteGift(e) {
    const id = e.currentTarget.dataset.id;
    const gift = this.data.gifts.find(g => g.id === id);
    wx.showModal({
      title: '确认删除',
      content: `确定删除"${gift.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          util.deleteGift(id);
          this.refreshData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // ========== 兑换管理 ==========
  onDeliver(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认交付',
      content: '确认已将礼品交给学生了吗？',
      success: (res) => {
        if (res.confirm) {
          util.deliverGift(id);
          this.refreshData();
          wx.showToast({ title: '已交付', icon: 'success' });
        }
      }
    });
  },

  // ========== 设置 ==========
  onNameInput(e) {
    this.setData({ 'settings.studentName': e.detail.value });
  },

  onAgeInput(e) {
    this.setData({ 'settings.studentAge': Number(e.detail.value) });
  },

  onPinChange(e) {
    this.setData({ 'settings.parentPin': e.detail.value });
  },

  saveSettings() {
    util.saveSettings(this.data.settings);
    wx.showToast({ title: '设置已保存', icon: 'success' });
  }
});

