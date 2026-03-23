const util = require('../../utils/util.js');

const CATEGORY_ORDER = ['笔盒', '语文书袋', '数学书袋', '英语书袋', '科学书袋', '生活物品', '其他'];

const CATEGORY_META = {
  '笔盒': { icon: '🗃️', color: '#FF9800' },
  '语文书袋': { icon: '📕', color: '#E91E63' },
  '数学书袋': { icon: '📗', color: '#4CAF50' },
  '英语书袋': { icon: '📘', color: '#2196F3' },
  '科学书袋': { icon: '🔬', color: '#9C27B0' },
  '生活物品': { icon: '🎽', color: '#FF5722' },
  '其他': { icon: '📦', color: '#607D8B' }
};

const CATEGORY_TABS = CATEGORY_ORDER.map(function (c) {
  return { name: c, icon: CATEGORY_META[c].icon, color: CATEGORY_META[c].color };
});

// 截图推荐配置（一键添加用）
const PRESET_CONFIG = [
  {
    category: '笔盒',
    items: [
      { name: '铅笔', icon: '✏️' },
      { name: '彩铅', icon: '🖍️' },
      { name: '橡皮', icon: '🧹' },
      { name: '尺子', icon: '📏' }
    ]
  },
  {
    category: '语文书袋',
    items: [
      { name: '语文书', icon: '📖' },
      { name: '写字书', icon: '✍️' },
      { name: '小蓝', icon: '📘' },
      { name: '小粉', icon: '📗' },
      { name: '试卷', icon: '📄' },
      { name: '新华字典', icon: '📚' }
    ]
  },
  {
    category: '数学书袋',
    items: [
      { name: '数学书', icon: '📖' },
      { name: '试卷', icon: '📄' },
      { name: '计数器', icon: '🔢' },
      { name: '小棒', icon: '🥢' },
      { name: '积木', icon: '🧱' }
    ]
  },
  {
    category: '英语书袋',
    items: [
      { name: '英语书', icon: '📖' },
      { name: '试卷', icon: '📄' }
    ]
  },
  {
    category: '科学书袋',
    items: [
      { name: '科学书', icon: '📖' },
      { name: '铅笔', icon: '✏️' },
      { name: '橡皮', icon: '🧹' },
      { name: '尺子', icon: '📏' }
    ]
  }
];

// 物品池（按类型组织，可自由添加到任意书袋）
const QUICK_ADD_POOL = [
  {
    label: '✏️ 学习用品',
    items: [
      { name: '铅笔', icon: '✏️' },
      { name: '彩铅', icon: '🖍️' },
      { name: '橡皮', icon: '🧹' },
      { name: '尺子', icon: '📏' },
      { name: '文具盒', icon: '🗃️' },
      { name: '剪刀', icon: '✂️' },
      { name: '胶棒', icon: '🧴' }
    ]
  },
  {
    label: '📖 课本书籍',
    items: [
      { name: '语文书', icon: '📕' },
      { name: '数学书', icon: '📗' },
      { name: '英语书', icon: '📘' },
      { name: '科学书', icon: '🔬' },
      { name: '写字书', icon: '✍️' },
      { name: '小蓝', icon: '📘' },
      { name: '小粉', icon: '📗' },
      { name: '新华字典', icon: '📚' }
    ]
  },
  {
    label: '📄 学习材料',
    items: [
      { name: '试卷', icon: '📄' },
      { name: '计数器', icon: '🔢' },
      { name: '小棒', icon: '🥢' },
      { name: '积木', icon: '🧱' },
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
      { name: '衣服', icon: '👕' },
      { name: '袜子', icon: '🧦' }
    ]
  }
];

function buildQuickAddItems(existingMap, targetCategory) {
  return QUICK_ADD_POOL.map(function (group) {
    return {
      label: group.label,
      items: group.items.map(function (tag) {
        return {
          name: tag.name,
          icon: tag.icon,
          added: !!existingMap[targetCategory + '|' + tag.name]
        };
      })
    };
  });
}

Page({
  data: {
    checklist: [],
    categoryGroups: [],
    uncheckedCount: 0,
    packedCount: 0,
    totalCount: 0,
    allPacked: false,
    checklistStarEarned: false,
    showNewDayHint: false,
    newItemName: '',
    newItemCategory: '其他',
    newItemCategoryIdx: 6,
    showAddItem: false,
    showQuickAdd: false,
    quickAddCategory: '笔盒',
    quickAddItems: [],
    categoryTabs: CATEGORY_TABS,
    existingMap: {},
    categoryNames: CATEGORY_ORDER,
    canShowRecommend: false,
    recommendCompleted: false,
    showCelebration: false,
    celebrationEarnedStar: false,
    celebrationStars: []
  },

  onShow() {
    this._detectDailyReset();
    this.refreshData();
    if (util.getChecklist().length === 0) {
      this.setData({ showQuickAdd: true });
    }
  },

  _detectDailyReset() {
    var today = util.getToday();
    var lastVisit = wx.getStorageSync('checklistLastVisit') || '';
    wx.setStorageSync('checklistLastVisit', today);
    if (lastVisit && lastVisit !== today) {
      var list = wx.getStorageSync('checklist') || [];
      if (list.length > 0) {
        this.setData({ showNewDayHint: true });
      }
    }
  },

  dismissNewDayHint() {
    this.setData({ showNewDayHint: false });
  },

  _buildFloatingStars(count) {
    var stars = [];
    var emojis = ['⭐', '🌟', '✨', '💫'];
    for (var i = 0; i < count; i++) {
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

  _showPackCelebration(justEarnedStar) {
    this.setData({
      showCelebration: true,
      celebrationEarnedStar: !!justEarnedStar,
      celebrationStars: this._buildFloatingStars(12)
    });
    this._autoDismiss = setTimeout(() => {
      this.setData({ showCelebration: false });
    }, 5000);
  },

  onCelebrationTap() {
    if (this._autoDismiss) {
      clearTimeout(this._autoDismiss);
    }
    this.setData({ showCelebration: false });
  },

  refreshData() {
    var list = util.getChecklist();

    var existingMap = {};
    list.forEach(function (item) {
      var cat = item.category || '其他';
      existingMap[cat + '|' + item.name] = true;
    });

    var groupMap = {};
    list.forEach(function (item) {
      var cat = item.category || '其他';
      if (!groupMap[cat]) {
        var meta = CATEGORY_META[cat] || CATEGORY_META['其他'];
        groupMap[cat] = {
          category: cat,
          icon: meta.icon,
          color: meta.color,
          items: [],
          checkedCount: 0,
          totalCount: 0,
          uncheckedCount: 0,
          percent: 0
        };
      }
      groupMap[cat].items.push(item);
      groupMap[cat].totalCount++;
      if (item.checked) {
        groupMap[cat].checkedCount++;
      } else {
        groupMap[cat].uncheckedCount++;
      }
    });

    var categoryGroups = [];
    CATEGORY_ORDER.forEach(function (cat) {
      if (groupMap[cat]) {
        var g = groupMap[cat];
        g.percent = g.totalCount > 0 ? Math.round(g.checkedCount / g.totalCount * 100) : 0;
        categoryGroups.push(g);
      }
    });
    Object.keys(groupMap).forEach(function (cat) {
      if (CATEGORY_ORDER.indexOf(cat) === -1) {
        var g = groupMap[cat];
        g.percent = g.totalCount > 0 ? Math.round(g.checkedCount / g.totalCount * 100) : 0;
        categoryGroups.push(g);
      }
    });

    var uncheckedCount = list.filter(function (i) { return !i.checked; }).length;
    var packedCount = list.filter(function (i) { return i.checked; }).length;
    var totalCount = list.length;
    var allPacked = totalCount > 0 && uncheckedCount === 0;

    var today = util.getToday();
    var dailyData = util.getDailyData(today);
    var checklistStarEarned = dailyData.starsEarned && dailyData.starsEarned.checklist;

    if (allPacked && !this.data.allPacked && this._isUserAction) {
      var justEarnedStar = false;
      if (!checklistStarEarned) {
        var earned = util.completeChecklist(today);
        if (earned) {
          checklistStarEarned = true;
          justEarnedStar = true;
        }
      }
      this._showPackCelebration(justEarnedStar);
    }
    this._isUserAction = false;

    this.setData({
      checklist: list,
      categoryGroups: categoryGroups,
      existingMap: existingMap,
      quickAddItems: buildQuickAddItems(existingMap, this.data.quickAddCategory),
      uncheckedCount: uncheckedCount,
      packedCount: packedCount,
      totalCount: totalCount,
      allPacked: allPacked,
      checklistStarEarned: checklistStarEarned,
      canShowRecommend: dailyData.recommendShown,
      recommendCompleted: dailyData.recommendCompleted
    });
  },

  onToggleItem(e) {
    var id = e.currentTarget.dataset.id;
    util.toggleChecklistItem(id);
    this._isUserAction = true;
    this.refreshData();
  },

  onPackAllInCategory(e) {
    var category = e.currentTarget.dataset.category;
    var list = util.getChecklist();
    var changed = false;
    list.forEach(function (item) {
      if ((item.category || '其他') === category && !item.checked) {
        item.checked = true;
        changed = true;
      }
    });
    if (changed) {
      util.saveChecklist(list);
      this._isUserAction = true;
      this.refreshData();
    }
  },

  onUnpackAll() {
    var self = this;
    wx.showModal({
      title: '全部取出',
      content: '将所有物品取出书包，勾选全部重置。物品清单会保留，方便参考调整。',
      confirmText: '全部取出',
      confirmColor: '#FF9800',
      success: function (res) {
        if (res.confirm) {
          var list = util.getChecklist();
          list.forEach(function (item) { item.checked = false; });
          util.saveChecklist(list);
          self.refreshData();
          wx.showToast({ title: '已全部取出', icon: 'success' });
        }
      }
    });
  },

  onUnpackAllInCategory(e) {
    var category = e.currentTarget.dataset.category;
    var list = util.getChecklist();
    var changed = false;
    list.forEach(function (item) {
      if ((item.category || '其他') === category && item.checked) {
        item.checked = false;
        changed = true;
      }
    });
    if (changed) {
      util.saveChecklist(list);
      this.refreshData();
    }
  },

  toggleQuickAdd() {
    this.setData({ showQuickAdd: !this.data.showQuickAdd, showAddItem: false });
  },

  onSwitchQuickCategory(e) {
    var category = e.currentTarget.dataset.category;
    this.setData({
      quickAddCategory: category,
      quickAddItems: buildQuickAddItems(this.data.existingMap, category)
    });
  },

  onQuickAdd(e) {
    var ds = e.currentTarget.dataset;
    var name = ds.name;
    var icon = ds.icon || '';
    var category = this.data.quickAddCategory;
    var key = category + '|' + name;
    if (this.data.existingMap[key]) {
      wx.showToast({ title: '已在「' + category + '」中', icon: 'none' });
      return;
    }
    util.addChecklistItem(name, category, icon);
    this.refreshData();
    wx.showToast({ title: '已添加到' + category, icon: 'success', duration: 1000 });
  },

  onAddPreset() {
    var added = 0;
    var self = this;
    PRESET_CONFIG.forEach(function (preset) {
      preset.items.forEach(function (item) {
        var key = preset.category + '|' + item.name;
        if (!self.data.existingMap[key]) {
          util.addChecklistItem(item.name, preset.category, item.icon);
          added++;
        }
      });
    });
    this.refreshData();
    if (added > 0) {
      wx.showToast({ title: '已添加' + added + '样物品', icon: 'success' });
    } else {
      wx.showToast({ title: '推荐物品已全部添加', icon: 'none' });
    }
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

  onCategoryPick(e) {
    var idx = e.detail.value;
    this.setData({ newItemCategoryIdx: idx, newItemCategory: CATEGORY_ORDER[idx] });
  },

  addItem() {
    var name = this.data.newItemName.trim();
    if (!name) {
      wx.showToast({ title: '请输入物品名称', icon: 'none' });
      return;
    }
    var category = this.data.newItemCategory || '其他';
    var key = category + '|' + name;
    if (this.data.existingMap[key]) {
      wx.showToast({ title: '「' + name + '」已在「' + category + '」中', icon: 'none' });
      return;
    }

    util.addChecklistItem(name, category);
    this.setData({ newItemName: '', showAddItem: false });
    this.refreshData();
    wx.showToast({ title: '已添加到' + category, icon: 'success' });
  },

  goRecommend() {
    wx.navigateTo({ url: '/pages/recommend/recommend' });
  },

  onDeleteItem(e) {
    var id = e.currentTarget.dataset.id;
    var item = this.data.checklist.find(function (i) { return i.id === id; });
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
