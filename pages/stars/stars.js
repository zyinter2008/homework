const util = require('../../utils/util.js');

Page({
  data: {
    totalStars: 0,
    history: [],
    todayEarned: 0
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    this.refreshData();
  },

  refreshData() {
    const stars = util.getStars();
    const today = util.getToday();

    // 计算今日获得
    const todayEarned = stars.history
      .filter(h => h.date === today)
      .reduce((sum, h) => sum + h.amount, 0);

    // 按日期分组
    const groupedHistory = this.groupByDate(stars.history);

    this.setData({
      totalStars: stars.total,
      history: groupedHistory,
      todayEarned: todayEarned
    });
  },

  groupByDate(history) {
    const groups = {};
    history.forEach(item => {
      if (!groups[item.date]) {
        groups[item.date] = {
          date: item.date,
          dateDisplay: util.formatDate(item.date),
          items: [],
          total: 0
        };
      }
      groups[item.date].items.push(item);
      groups[item.date].total += item.amount;
    });
    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }
});

