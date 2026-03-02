const util = require('../../utils/util.js');

Page({
  data: {
    totalStars: 0,
    gifts: [],
    redemptions: []
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.refreshData();
  },

  refreshData() {
    this.setData({
      totalStars: util.getTotalStars(),
      gifts: util.getGifts().filter(g => g.stock > 0),
      redemptions: util.getRedemptions()
    });
  },

  // 兑换礼品
  onRedeem(e) {
    const giftId = e.currentTarget.dataset.id;
    const gift = util.getGifts().find(g => g.id === giftId);

    if (!gift) return;

    wx.showModal({
      title: '确认兑换',
      content: `确定要用 ${gift.stars} 颗星兑换"${gift.name}"吗？\n当前星星：${this.data.totalStars}⭐`,
      success: (res) => {
        if (res.confirm) {
          const result = util.redeemGift(giftId);
          if (result.success) {
            wx.showToast({ title: result.message, icon: 'none', duration: 2500 });

            if (result.lowStock) {
              setTimeout(() => {
                wx.showToast({
                  title: `📢 "${gift.name}"库存不足，已提醒家长补充`,
                  icon: 'none',
                  duration: 3000
                });
              }, 2800);
            }

            this.refreshData();
          } else {
            wx.showToast({ title: result.message, icon: 'none' });

            // 库存不足时推荐其他礼品
            if (gift.stock <= 0) {
              const otherGifts = util.getGifts().filter(g => g.id !== giftId && g.stock > 0);
              if (otherGifts.length > 0) {
                const recommend = otherGifts[0];
                setTimeout(() => {
                  wx.showModal({
                    title: '推荐其他礼品',
                    content: `"${gift.name}"暂时没有库存了，要看看"${recommend.name}"（${recommend.stars}⭐）吗？`,
                    confirmText: '好的',
                    cancelText: '算了',
                    success() {}
                  });
                }, 1500);
              }
            }
          }
        }
      }
    });
  }
});

