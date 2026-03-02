Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "作业",
        icon: "📝"
      },
      {
        pagePath: "/pages/stars/stars",
        text: "星星",
        icon: "⭐"
      },
      {
        pagePath: "/pages/shop/shop",
        text: "商店",
        icon: "🎁"
      },
      {
        pagePath: "/pages/parent/parent",
        text: "家长",
        icon: "👨‍👩‍👧"
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
    }
  }
});

