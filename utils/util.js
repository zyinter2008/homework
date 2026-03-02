/**
 * 作业打卡小程序 - 数据管理工具模块
 */

// ========== 日期时间工具 ==========

/** 获取今天日期 YYYY-MM-DD */
function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 获取当前时间 HH:mm */
function getCurrentTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 格式化日期显示 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${month}月${day}日 周${weekDays[d.getDay()]}`;
}

/** 判断是否在指定时间之前 */
function isBeforeTime(timeStr) {
  const now = getCurrentTime();
  return now < timeStr;
}

// ========== 设置管理 ==========

function getSettings() {
  return wx.getStorageSync('settings') || { studentName: '小明', studentAge: 8, parentPin: '1234' };
}

function saveSettings(settings) {
  wx.setStorageSync('settings', settings);
}

// ========== 预设任务管理 ==========

function getPresetTasks() {
  return wx.getStorageSync('presetTasks') || [];
}

function savePresetTasks(tasks) {
  wx.setStorageSync('presetTasks', tasks);
}

// ========== 每日数据管理 ==========

function getDailyKey(date) {
  return `daily_${date}`;
}

/** 获取某天的打卡数据 */
function getDailyData(date) {
  date = date || getToday();
  const key = getDailyKey(date);
  let data = wx.getStorageSync(key);
  if (!data) {
    data = {
      date: date,
      tasks: [],
      checkedIn: false,
      checkedInTime: null,
      parentReviewed: false,
      parentRating: 0,
      recommendShown: false,
      recommendCompleted: false,
      starsEarned: {
        completion: false,
        timeBonus: false,
        recommend: false,
        parentReview: 0
      }
    };
  }
  return data;
}

/** 保存每日数据 */
function saveDailyData(date, data) {
  wx.setStorageSync(getDailyKey(date), data);
}

/** 设置今天的任务 */
function setTodayTasks(taskNames) {
  const today = getToday();
  const data = getDailyData(today);
  data.tasks = taskNames.map((name, idx) => ({
    id: idx + 1,
    title: name,
    completed: false
  }));
  saveDailyData(today, data);
  return data;
}

/** 从预设加载今日任务 */
function loadPresetToToday() {
  const presets = getPresetTasks();
  if (presets.length > 0) {
    return setTodayTasks(presets);
  }
  return getDailyData();
}

/** 切换任务完成状态 */
function toggleTask(date, taskId) {
  const data = getDailyData(date);
  const task = data.tasks.find(t => t.id === taskId);
  if (task && !data.checkedIn) {
    task.completed = !task.completed;
    saveDailyData(date, data);
  }
  return data;
}

/** 检查是否所有任务都完成 */
function areAllTasksCompleted(date) {
  const data = getDailyData(date);
  return data.tasks.length > 0 && data.tasks.every(t => t.completed);
}

// ========== 打卡逻辑 ==========

/** 执行打卡 */
function checkIn(date) {
  date = date || getToday();
  const data = getDailyData(date);

  if (data.checkedIn) return { success: false, message: '今天已经打卡过了' };
  if (!areAllTasksCompleted(date)) return { success: false, message: '还有未完成的任务' };

  const now = getCurrentTime();
  data.checkedIn = true;
  data.checkedInTime = now;

  // 完成所有作业 +1星
  data.starsEarned.completion = true;
  addStarRecord(1, '完成所有作业', date);

  // 20:30前完成 +1星
  if (now < '20:30') {
    data.starsEarned.timeBonus = true;
    addStarRecord(1, '8:30前完成打卡', date);
  }

  // 21:00前可以看推荐
  if (now < '21:00') {
    data.recommendShown = true;
  }

  saveDailyData(date, data);

  return {
    success: true,
    message: '打卡成功！',
    starsEarned: (data.starsEarned.completion ? 1 : 0) + (data.starsEarned.timeBonus ? 1 : 0),
    canShowRecommend: data.recommendShown,
    timeBonus: data.starsEarned.timeBonus
  };
}

// ========== 星星管理 ==========

function getStars() {
  return wx.getStorageSync('stars') || { total: 0, history: [] };
}

function addStarRecord(amount, reason, date) {
  const stars = getStars();
  stars.total += amount;
  if (stars.total < 0) stars.total = 0;
  stars.history.unshift({
    date: date || getToday(),
    time: getCurrentTime(),
    amount: amount,
    reason: reason
  });
  wx.setStorageSync('stars', stars);
  return stars;
}

function getTotalStars() {
  return getStars().total;
}

function getStarHistory() {
  return getStars().history;
}

// ========== 推荐内容管理 ==========

/** 获取推荐内容（根据年龄） */
function getRecommendations(age) {
  age = age || getSettings().studentAge;

  // 按年龄段推荐
  const allRecommendations = [
    // 6-8岁
    { id: 1, title: '《十万个为什么》精选', type: 'book', duration: '20分钟', ageMin: 6, ageMax: 8, desc: '探索大自然的奥秘，满足小小好奇心' },
    { id: 2, title: '《小小科学家》动画', type: 'video', duration: '18分钟', ageMin: 6, ageMax: 8, desc: '有趣的科学实验动画，边看边学' },
    { id: 3, title: '《成语故事绘本》', type: 'book', duration: '15分钟', ageMin: 6, ageMax: 8, desc: '经典成语故事，图文并茂' },
    { id: 4, title: '《海洋世界探秘》', type: 'video', duration: '20分钟', ageMin: 6, ageMax: 8, desc: '探索神奇的海底世界' },
    { id: 5, title: '《昆虫记》少儿版', type: 'book', duration: '20分钟', ageMin: 6, ageMax: 8, desc: '法布尔经典，认识奇妙昆虫' },
    // 9-10岁
    { id: 6, title: '《宇宙大探险》', type: 'book', duration: '20分钟', ageMin: 9, ageMax: 10, desc: '从太阳系到银河系的奇妙旅程' },
    { id: 7, title: '《编程小达人》入门', type: 'video', duration: '20分钟', ageMin: 9, ageMax: 10, desc: '用Scratch制作小游戏' },
    { id: 8, title: '《中华上下五千年》精选', type: 'book', duration: '20分钟', ageMin: 9, ageMax: 10, desc: '穿越历史长河，品味中华文明' },
    { id: 9, title: '《地球科学趣味讲堂》', type: 'video', duration: '18分钟', ageMin: 9, ageMax: 10, desc: '了解地球的前世今生' },
    { id: 10, title: '《数学思维大冒险》', type: 'book', duration: '20分钟', ageMin: 9, ageMax: 10, desc: '趣味数学游戏和谜题' },
    // 11-12岁
    { id: 11, title: '《人体的秘密》', type: 'book', duration: '20分钟', ageMin: 11, ageMax: 12, desc: '探索人体器官的奇妙运作' },
    { id: 12, title: '《科技前沿少年说》', type: 'video', duration: '20分钟', ageMin: 11, ageMax: 12, desc: 'AI、机器人等前沿科技' },
    { id: 13, title: '《世界名著少年读本》', type: 'book', duration: '20分钟', ageMin: 11, ageMax: 12, desc: '经典名著改编少年版' },
    { id: 14, title: '《物理实验室》', type: 'video', duration: '18分钟', ageMin: 11, ageMax: 12, desc: '有趣的物理现象和实验' },
    { id: 15, title: '《少年百科全书》精选', type: 'book', duration: '20分钟', ageMin: 11, ageMax: 12, desc: '涵盖自然、科学、人文等领域' }
  ];

  // 筛选适合年龄的内容
  const suitable = allRecommendations.filter(r => age >= r.ageMin && age <= r.ageMax);

  if (suitable.length === 0) {
    // 如果没有精确匹配，返回最接近的年龄段
    return allRecommendations.filter(r => r.ageMin <= 8);
  }

  // 随机推荐一本书和一个视频
  const books = suitable.filter(r => r.type === 'book');
  const videos = suitable.filter(r => r.type === 'video');
  const result = [];

  if (books.length > 0) {
    result.push(books[Math.floor(Math.random() * books.length)]);
  }
  if (videos.length > 0) {
    result.push(videos[Math.floor(Math.random() * videos.length)]);
  }

  return result;
}

/** 获取今日推荐（缓存，避免每次刷新都变） */
function getTodayRecommendations() {
  const today = getToday();
  const key = `recommend_${today}`;
  let cached = wx.getStorageSync(key);
  if (cached && cached.length > 0) return cached;

  const settings = getSettings();
  const recs = getRecommendations(settings.studentAge);
  wx.setStorageSync(key, recs);
  return recs;
}

/** 完成推荐内容阅读，获得星星 */
function completeRecommendation(date) {
  date = date || getToday();
  const data = getDailyData(date);
  if (!data.recommendCompleted && data.recommendShown) {
    data.recommendCompleted = true;
    data.starsEarned.recommend = true;
    saveDailyData(date, data);
    addStarRecord(1, '完成推荐阅读/视频', date);
    return true;
  }
  return false;
}

// ========== 家长评价 ==========

/** 家长评价作业质量 */
function parentReview(date, rating) {
  date = date || getToday();
  const data = getDailyData(date);

  if (!data.checkedIn) return { success: false, message: '学生还未打卡' };

  // 如果之前已经评价过，先撤销之前的评价
  if (data.parentReviewed) {
    const prevRating = data.starsEarned.parentReview;
    if (prevRating !== 0) {
      addStarRecord(-prevRating, '撤销之前的家长评价', date);
    }
  }

  data.parentReviewed = true;
  data.starsEarned.parentReview = rating;
  saveDailyData(date, data);

  if (rating !== 0) {
    addStarRecord(rating, rating > 0 ? '家长评价：完成质量优秀 +1⭐' : '家长评价：完成质量待改进 -1⭐', date);
  }

  return { success: true, message: rating > 0 ? '已评价：优秀！' : (rating < 0 ? '已评价：需改进' : '已评价：合格') };
}

// ========== 礼品管理 ==========

function getGifts() {
  return wx.getStorageSync('gifts') || [];
}

function saveGifts(gifts) {
  wx.setStorageSync('gifts', gifts);
}

function addGift(gift) {
  const gifts = getGifts();
  gift.id = Date.now();
  gifts.push(gift);
  saveGifts(gifts);
  return gifts;
}

function updateGift(id, updates) {
  const gifts = getGifts();
  const idx = gifts.findIndex(g => g.id === id);
  if (idx >= 0) {
    Object.assign(gifts[idx], updates);
    saveGifts(gifts);
  }
  return gifts;
}

function deleteGift(id) {
  let gifts = getGifts();
  gifts = gifts.filter(g => g.id !== id);
  saveGifts(gifts);
  return gifts;
}

// ========== 礼品兑换 ==========

function getRedemptions() {
  return wx.getStorageSync('redemptions') || [];
}

function saveRedemptions(redemptions) {
  wx.setStorageSync('redemptions', redemptions);
}

/** 学生兑换礼品 */
function redeemGift(giftId) {
  const gifts = getGifts();
  const gift = gifts.find(g => g.id === giftId);
  if (!gift) return { success: false, message: '礼品不存在' };

  const stars = getStars();
  if (stars.total < gift.stars) return { success: false, message: '星星不够哦，继续加油！' };
  if (gift.stock <= 0) return { success: false, message: '库存不足，请看看其他礼品吧' };

  // 扣除星星
  addStarRecord(-gift.stars, `兑换礼品：${gift.name}`, getToday());

  // 减少库存
  gift.stock -= 1;
  saveGifts(gifts);

  // 如果库存低于2，提醒家长
  const lowStock = gift.stock < 2;

  // 记录兑换
  const redemptions = getRedemptions();
  redemptions.unshift({
    id: Date.now(),
    giftId: gift.id,
    giftName: gift.name,
    stars: gift.stars,
    date: getToday(),
    time: getCurrentTime(),
    delivered: false
  });
  saveRedemptions(redemptions);

  return {
    success: true,
    message: `成功兑换"${gift.name}"！请找家长领取`,
    lowStock: lowStock,
    remainStock: gift.stock
  };
}

/** 家长确认交付礼品 */
function deliverGift(redemptionId) {
  const redemptions = getRedemptions();
  const item = redemptions.find(r => r.id === redemptionId);
  if (item) {
    item.delivered = true;
    saveRedemptions(redemptions);
    return true;
  }
  return false;
}

// ========== 验证家长密码 ==========
function verifyParentPin(pin) {
  const settings = getSettings();
  return pin === settings.parentPin;
}

// ========== 导出 ==========

module.exports = {
  getToday,
  getCurrentTime,
  formatDate,
  isBeforeTime,
  getSettings,
  saveSettings,
  getPresetTasks,
  savePresetTasks,
  getDailyData,
  saveDailyData,
  setTodayTasks,
  loadPresetToToday,
  toggleTask,
  areAllTasksCompleted,
  checkIn,
  getStars,
  addStarRecord,
  getTotalStars,
  getStarHistory,
  getRecommendations,
  getTodayRecommendations,
  completeRecommendation,
  parentReview,
  getGifts,
  saveGifts,
  addGift,
  updateGift,
  deleteGift,
  getRedemptions,
  redeemGift,
  deliverGift,
  verifyParentPin
};

