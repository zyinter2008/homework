const util = require('../../utils/util.js');

const QUICK_ADD_GROUPS = [
  {
    label: '✏️ 学习用品',
    items: [
      { name: '书包', icon: '🎒' },
      { name: '铅笔', icon: '✏️' },
      { name: '橡皮', icon: '🧹' },
      { name: '尺子', icon: '📏' },
      { name: '文具盒', icon: '🗃️' },
      { name: '彩笔', icon: '🖍️' },
      { name: '剪刀', icon: '✂️' },
      { name: '胶棒', icon: '🧴' }
    ]
  },
  {
    label: '📖 课本作业',
    items: [
      { name: '语文书', icon: '📕' },
      { name: '数学书', icon: '📗' },
      { name: '英语书', icon: '📘' },
      { name: '语文本', icon: '📓' },
      { name: '数学本', icon: '📒' },
      { name: '英语本', icon: '📔' },
      { name: '作业', icon: '📝' }
    ]
  },
  {
    label: '🎽 生活物品',
    items: [
      { name: '水壶', icon: '🥤' },
      { name: '纸巾', icon: '🧻' },
      { name: '红领巾', icon: '🧣' },
      { name: '饭盒', icon: '🍱' },
      { name: '雨伞', icon: '☂️' },
      { name: '口罩', icon: '😷' },
      { name: '钥匙', icon: '🔑' }
    ]
  }
];

Page({
  data: {
    checklist: [],
    uncheckedItems: [],
    checkedItems: [],
    newItemName: '',
    showAddItem: false,
    showQuickAdd: false,
    quickAddGroups: QUICK_ADD_GROUPS,
    existingNames: [],
    existingMap: {},
    uncheckedCount: 0,
    totalCount: 0,
    allPacked: false,
    canShowRecommend: false,
    recommendCompleted: false
  },

  onShow() {
    this.refreshData();
    if (util.getChecklist().length === 0) {
      this.setData({ showQuickAdd: true });
    }
  },

  refreshData() {
    const list = util.getChecklist();
    const unchecked = list.filter(i => !i.checked);
    const checked = list.filter(i => i.checked);
    const existingNames = list.map(i => i.name);
    const existingMap = {};
    existingNames.forEach(n => {
      existingMap[n] = true;
      var spIdx = n.indexOf(' ');
      if (spIdx > 0 && spIdx <= 3) existingMap[n.slice(spIdx + 1)] = true;
    });

    const today = util.getToday();
    const dailyData = util.getDailyData(today);

    this.setData({
      checklist: list,
      uncheckedItems: unchecked,
      checkedItems: checked,
      existingNames: existingNames,
      existingMap: existingMap,
      uncheckedCount: unchecked.length,
      totalCount: list.length,
      allPacked: list.length > 0 && unchecked.length === 0,
      canShowRecommend: dailyData.recommendShown,
      recommendCompleted: dailyData.recommendCompleted
    });
  },

  onToggleItem(e) {
    const id = e.currentTarget.dataset.id;
    util.toggleChecklistItem(id);
    this.refreshData();
  },

  toggleQuickAdd() {
    this.setData({ showQuickAdd: !this.data.showQuickAdd, showAddItem: false });
  },

  onQuickAdd(e) {
    const ds = e.currentTarget.dataset;
    const name = ds.name;
    const icon = ds.icon || '';
    if (this.data.existingMap[name]) {
      wx.showToast({ title: '「' + name + '」已在清单中', icon: 'none' });
      return;
    }
    util.addChecklistItem(icon ? icon + ' ' + name : name);
    this.refreshData();
    wx.showToast({ title: '已添加「' + name + '」', icon: 'success', duration: 1000 });
  },

  showAddItem() {
    this.setData({ showAddItem: true, showQuickAdd: false });
  },

  hideAddItem() {
    this.setData({ showAddItem: false, newItemName: '' });
  },

  onItemNameInput(e) {
    this.setData({ newItemName: e.detail.value });
  },

  addItem() {
    const name = this.data.newItemName.trim();
    if (!name) {
      wx.showToast({ title: '请输入物品名称', icon: 'none' });
      return;
    }
    if (this.data.existingNames.indexOf(name) !== -1) {
      wx.showToast({ title: '「' + name + '」已在清单中', icon: 'none' });
      return;
    }

    util.addChecklistItem(name);
    this.setData({ newItemName: '', showAddItem: false });
    this.refreshData();
    wx.showToast({ title: '已添加', icon: 'success' });
  },

  goRecommend() {
    wx.navigateTo({ url: '/pages/recommend/recommend' });
  },

  onDeleteItem(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.checklist.find(i => i.id === id);
    wx.showModal({
      title: '删除物品',
      content: '确定不再需要带「' + (item ? item.name : '') + '」了吗？',
      confirmText: '删除',
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          util.deleteChecklistItem(id);
          this.refreshData();
        }
      }
    });
  }
});
