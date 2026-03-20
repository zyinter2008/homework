/**
 * 作业打卡小程序 - 数据管理工具模块
 */
const cloud = require('./cloud.js');
const { getBookLibrary } = require('./books.js');

// ========== 云同步存储封装 ==========

/** 写入本地存储 + 异步同步到云端 */
function syncSet(key, value) {
  wx.setStorageSync(key, value);
  cloud.cloudSet(key, value);
}

// ========== 拼音解析工具 ==========

/**
 * 解析带拼音标注的文本
 * 格式：你(nǐ)好(hǎo)！ → [{c:'你',p:'nǐ'}, {c:'好',p:'hǎo'}, {c:'！',p:''}]
 * 换行符 \n 分段
 * 返回：二维数组 [[{c,p}...], [{c,p}...], ...]，每个子数组是一段
 */
function parsePinyinText(text) {
  if (!text) return [];
  const lines = text.split('\n');
  return lines.map(function (line) {
    const chars = [];
    var i = 0;
    while (i < line.length) {
      if (i + 1 < line.length && line[i + 1] === '(') {
        var ch = line[i];
        var close = line.indexOf(')', i + 2);
        if (close === -1) {
          chars.push({ c: ch, p: '' });
          i++;
        } else {
          chars.push({ c: ch, p: line.substring(i + 2, close) });
          i = close + 1;
        }
      } else {
        chars.push({ c: line[i], p: '' });
        i++;
      }
    }
    return chars;
  });
}

// ========== 视频链接工具 ==========

/** 检测视频链接类型 */
function detectVideoLinkType(url) {
  if (!url || !url.trim()) return 'none';
  url = url.trim();
  if (url.indexOf('bilibili.com') !== -1 || url.indexOf('b23.tv') !== -1) return 'bilibili';
  if (/\.(mp4|m3u8|mov)(\?|$)/i.test(url)) return 'mp4';
  return 'link';
}

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
  syncSet('settings', settings);
}

// ========== 预设任务管理 ==========

function getPresetTasks() {
  return wx.getStorageSync('presetTasks') || [];
}

function savePresetTasks(tasks) {
  syncSet('presetTasks', tasks);
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
        allBonus: false,
        recommend: false,
        parentReview: 0
      }
    };
  }
  return data;
}

/** 保存每日数据 */
function saveDailyData(date, data) {
  syncSet(getDailyKey(date), data);
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

/** 单个任务打卡 */
function checkInTask(date, taskId) {
  const data = getDailyData(date);
  const task = data.tasks.find(t => t.id === taskId);

  if (!task) return { success: false, message: '任务不存在' };
  if (task.completed) return { success: false, message: '该任务已打卡' };

  task.completed = true;
  addStarRecord(1, '完成作业：' + task.title, date);

  const allDone = data.tasks.length > 0 && data.tasks.every(t => t.completed);

  if (allDone) {
    data.checkedIn = true;
    data.checkedInTime = getCurrentTime();
    data.starsEarned.allBonus = true;
    addStarRecord(3, '全部作业打卡完成奖励', date);

    if (getCurrentTime() < '21:00') {
      data.recommendShown = true;
    }
  }

  saveDailyData(date, data);

  return {
    success: true,
    taskTitle: task.title,
    allDone: allDone,
    starsEarned: 1,
    bonusStars: allDone ? 3 : 0,
    canShowRecommend: allDone && data.recommendShown
  };
}

/** 撤销单个任务打卡 */
function undoCheckInTask(date, taskId) {
  const data = getDailyData(date);
  const task = data.tasks.find(t => t.id === taskId);

  if (!task) return { success: false, message: '任务不存在' };
  if (!task.completed) return { success: false, message: '该任务未打卡' };

  // 如果全部完成奖励已发放，先撤销奖励
  const hadAllBonus = data.starsEarned.allBonus;
  if (hadAllBonus) {
    data.checkedIn = false;
    data.checkedInTime = null;
    data.starsEarned.allBonus = false;
    addStarRecord(-3, '撤销全部完成奖励', date);

    if (!data.recommendCompleted) {
      data.recommendShown = false;
    }
  }

  task.completed = false;
  addStarRecord(-1, '撤销打卡：' + task.title, date);

  saveDailyData(date, data);

  return {
    success: true,
    taskTitle: task.title,
    undoneBonus: hadAllBonus
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
  syncSet('stars', stars);
  return stars;
}

function getTotalStars() {
  return getStars().total;
}

function getStarHistory() {
  return getStars().history;
}

// ========== 书库管理 ==========

function getEnabledBookIds() {
  var ids = wx.getStorageSync('enabledBookIds');
  if (ids && ids.length > 0) return ids;
  return getBookLibrary().map(function (b) { return b.id; });
}

function setEnabledBookIds(ids) {
  syncSet('enabledBookIds', ids);
  clearTodayRecommendCache();
}

function getFullBookLibrary() {
  return getBookLibrary();
}

// ========== 推荐内容管理 ==========

/** 获取内置推荐内容库（含实际内容） */
function getBuiltinRecommendations() {
  var enabledIds = getEnabledBookIds();
  var enabledBooks = getBookLibrary().filter(function (b) {
    return enabledIds.indexOf(b.id) !== -1;
  });

  return enabledBooks.concat([
    // === 6-8岁 视频 ===
    {
      id: 2, title: '《小小科学家》— 彩虹的秘密', type: 'video', duration: '18分钟',
      ageMin: 6, ageMax: 8, desc: '动手做实验，在家制造彩虹',
      videoUrl: ''
    },
    {
      id: 4, title: '《海洋世界探秘》— 神奇的珊瑚礁', type: 'video', duration: '20分钟',
      ageMin: 6, ageMax: 8, desc: '潜入海底，探索五彩缤纷的珊瑚世界',
      videoUrl: ''
    },
    // === 9-10岁 电子书 ===
    {
      id: 6, title: '《宇宙大探险》— 太阳系的八大行星', type: 'book', duration: '20分钟',
      ageMin: 9, ageMax: 10, desc: '从太阳系到银河系的奇妙旅程',
      content: '如果你坐上一艘超级飞船，从太阳出发，你会依次遇到哪些行星呢？让我们一起来一场太阳系大冒险！\n\n☀️ 太阳\n太阳系的中心，一颗巨大的恒星。它的表面温度高达5500°C，核心温度更是达到1500万°C！太阳系中99.86%的质量都集中在太阳上。\n\n1️⃣ 水星 Mercury\n距离太阳最近的行星，也是最小的行星。白天温度可达430°C，晚上却骤降到-180°C。它没有大气层保护，所以温差极大。\n\n2️⃣ 金星 Venus\n大小和地球差不多，但表面温度高达465°C（比水星还热！）。原因是它有极厚的二氧化碳大气层，造成了严重的温室效应。\n\n3️⃣ 地球 Earth 🌍\n我们的家！目前已知唯一存在生命的行星。地球有液态水、适宜的温度和大气层，这些条件让生命得以诞生。\n\n4️⃣ 火星 Mars\n被称为"红色星球"，因为表面覆盖着氧化铁（铁锈）。火星上有太阳系最高的山——奥林匹斯山，高度是珠穆朗玛峰的近3倍！\n\n5️⃣ 木星 Jupiter\n太阳系最大的行星，体积是地球的1321倍！它的"大红斑"其实是一个持续了几百年的超级风暴，大小可以装下3个地球。\n\n6️⃣ 土星 Saturn\n以美丽的光环闻名。这些光环由无数冰块和岩石碎片组成，宽度达28万公里，但厚度只有几十米！\n\n7️⃣ 天王星 Uranus\n一颗"躺着转"的行星，自转轴倾斜了98度。它呈现蓝绿色，是因为大气中的甲烷吸收了红光。\n\n8️⃣ 海王星 Neptune\n太阳系中风速最快的行星，最高风速超过2000km/h！它深邃的蓝色让人联想到大海。\n\n🧠 记忆口诀：\n"水金地火木土天海"\n（水星、金星、地球、火星、木星、土星、天王星、海王星）\n\n🤔 思考题：\n冥王星为什么在2006年被"开除"出行星行列？它现在被归类为什么？'
    },
    {
      id: 8, title: '《中华上下五千年》— 四大发明', type: 'book', duration: '20分钟',
      ageMin: 9, ageMax: 10, desc: '了解改变世界的中国古代智慧',
      content: '中国古代有四项伟大的发明，它们不仅改变了中国，也深深影响了整个世界的发展。让我们一起来认识这四大发明！\n\n📜 一、造纸术\n发明者：蔡伦（东汉，约公元105年改进）\n\n在纸发明之前，人们用竹简、丝帛来写字。竹简太重，一部书要用牛车来拉；丝帛太贵，普通人用不起。\n\n蔡伦用树皮、麻头、破布、旧鱼网等便宜的材料，经过浸泡、蒸煮、捶打、抄造等工序，制成了轻便又便宜的纸张。从此，知识的传播变得容易多了！\n\n🧭 二、指南针\n最早形态：司南（战国时期）\n\n中国人发现天然磁石能指示南北方向，最初制成"司南"用于占卜。后来经过不断改进，变成了航海指南针。\n\n指南针传入欧洲后，直接推动了大航海时代的到来——哥伦布发现新大陆、麦哲伦环球航行，都离不开指南针的帮助！\n\n💥 三、火药\n发现时间：唐朝（约9世纪）\n\n有趣的是，火药最初是炼丹家们想要炼制长生不老药时"意外"发现的。他们把硫磺、硝石、木炭混在一起加热，结果"砰"的一声爆炸了！\n\n火药先被用来制作烟花和鞭炮，后来被用于军事。传到欧洲后，改变了整个战争的方式。\n\n📖 四、印刷术\n- 雕版印刷：唐朝（约7世纪）\n- 活字印刷：毕昇（北宋，约1040年）\n\n雕版印刷是在木板上刻字，一块板只能印一页。毕昇发明了活字印刷——用泥做成一个个单独的字，可以重新排列组合，重复使用。\n\n这个原理比德国古登堡的金属活字印刷早了约400年！印刷术让书籍变得便宜，让更多人能读到书，极大推动了文化和科学的发展。\n\n💡 今日思考：\n四大发明都有一个共同点：它们让"传播"变得更容易——纸和印刷术传播知识，指南针帮助人们到达远方，火药改变了力量的传递方式。在今天的互联网时代，你觉得什么发明相当于新的"四大发明"？'
    },
    {
      id: 10, title: '《数学思维大冒险》— 神奇的斐波那契数列', type: 'book', duration: '20分钟',
      ageMin: 9, ageMax: 10, desc: '发现隐藏在大自然中的数学密码',
      content: '你相信吗？大自然中到处都隐藏着一组神奇的数字密码！让我们一起来揭开这个秘密。\n\n🔢 一个特别的数列\n先来看这组数字：\n1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...\n\n你发现规律了吗？\n从第三个数开始，每个数都等于前面两个数相加：\n1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13...\n\n这就是"斐波那契数列"，以意大利数学家斐波那契的名字命名。\n\n🌻 向日葵的秘密\n仔细观察向日葵花盘中间的种子排列——它们形成了两组旋转的螺旋线。数一数：一个方向通常是34条螺旋，另一个方向是55条。34和55，正是斐波那契数列中相邻的两个数！\n\n🐚 鹦鹉螺的螺旋\n鹦鹉螺的外壳是一个完美的螺旋形状，这个螺旋的生长比例正好符合"黄金比例"1.618...——而斐波那契数列中相邻两个数的比值，越往后越接近这个黄金比例！\n55÷34 ≈ 1.618\n89÷55 ≈ 1.618\n\n🌿 植物叶子的排列\n很多植物的叶子从上往下看，是按照特定角度螺旋排列的。常见的螺旋比例有2/5、3/8、5/13——分子分母都是斐波那契数！这样排列能让每片叶子接收到最多的阳光。\n\n🎹 钢琴键盘\n一个八度音阶中有：13个键，其中8个白键、5个黑键。8、5、13——全是斐波那契数！\n\n✏️ 动手试试：\n在纸上画一系列正方形：边长分别是1、1、2、3、5、8、13...\n把它们像蜗牛壳一样拼在一起，然后在每个正方形里画一个四分之一圆弧连起来——你就得到了一个漂亮的"黄金螺旋"！\n\n🤔 课后挑战：\n斐波那契数列的第20个数是多少？（提示：第15个是610，第16个是987...）'
    },
    // === 9-10岁 视频 ===
    {
      id: 7, title: '《编程小达人》— Scratch入门', type: 'video', duration: '20分钟',
      ageMin: 9, ageMax: 10, desc: '用Scratch制作你的第一个小游戏',
      videoUrl: ''
    },
    {
      id: 9, title: '《地球科学趣味讲堂》— 火山是怎么爆发的', type: 'video', duration: '18分钟',
      ageMin: 9, ageMax: 10, desc: '了解地球内部的力量',
      videoUrl: ''
    },
    // === 11-12岁 电子书 ===
    {
      id: 11, title: '《人体的秘密》— 大脑是怎么工作的', type: 'book', duration: '20分钟',
      ageMin: 11, ageMax: 12, desc: '探索人类最强大的"超级计算机"',
      content: '你的大脑重约1.4千克，只占体重的2%，却消耗了全身20%的能量。它是已知宇宙中最复杂的结构——让我们来认识这个不可思议的器官！\n\n🧠 大脑的基本结构\n\n大脑分为左右两个半球，通过"胼胝体"（约2亿条神经纤维）相连。\n\n大脑皮层分为四个区域（脑叶）：\n- 额叶（前方）：思考、决策、自控力、人格\n- 顶叶（顶部）：触觉、空间感知\n- 颞叶（两侧）：听觉、记忆、语言理解\n- 枕叶（后方）：视觉处理\n\n⚡ 神经元——大脑的"电路"\n\n大脑中有约860亿个神经元（神经细胞），每个神经元可以与其他7000~10000个神经元建立连接。这意味着大脑中的"连接点"（突触）数量超过100万亿个！\n\n神经信号在神经元之间传递的速度可达每秒120米（约432公里/小时），比高铁还快！\n\n💤 睡眠与大脑\n\n睡觉时大脑并没有休息，反而在做很重要的工作：\n- 整理白天学到的知识，把短期记忆转化为长期记忆\n- 清除白天积累的代谢废物（就像大扫除）\n- 修复受损的神经连接\n\n这就是为什么充足的睡眠对学习特别重要——考试前熬夜复习反而不如早点睡觉！\n\n🏋️ 锻炼你的大脑\n\n大脑有"可塑性"——它会根据你的行为不断重新塑造自己：\n- 学习新技能时，相关区域的神经连接会变得更强\n- 经常练习的事情会变得越来越"自动化"\n- 不用的连接会逐渐变弱（用进废退）\n\n伦敦出租车司机的研究发现：他们大脑中负责空间导航的"海马体"比普通人大很多，因为他们每天都在记忆和使用复杂的城市地图！\n\n🤔 深度思考：\n人工智能（AI）现在已经能在很多方面超过人类大脑，比如计算速度、记忆容量。但大脑有什么是AI目前无法复制的？（提示：想想创造力、情感、直觉……）'
    },
    {
      id: 13, title: '《世界名著少年读本》— 《海底两万里》导读', type: 'book', duration: '20分钟',
      ageMin: 11, ageMax: 12, desc: '跟随凡尔纳的想象力潜入深海',
      content: '📖 作品简介\n《海底两万里》是法国作家儒勒·凡尔纳于1870年出版的科幻小说，被誉为"科幻小说之父"的代表作之一。\n\n令人惊叹的是，凡尔纳在书中描写的很多"幻想"后来都变成了现实——电动潜水艇、水下呼吸装置、海底电缆……\n\n📋 故事梗概\n\n1866年，海上出现了一个"神秘怪物"，各国船只纷纷遭到袭击。法国生物学家阿罗纳克斯教授受邀参加追捕行动。\n\n追捕中，教授和仆人康塞尔、鱼叉手尼德·兰意外落水，被"怪物"救起——原来这并不是海洋生物，而是一艘名为"鹦鹉螺号"的先进潜水艇！\n\n潜艇的主人尼摩船长是一个才华横溢但性格神秘的人。他带着三位"客人"开始了一段海底环球之旅：\n\n🌊 精彩历程：\n- 穿越太平洋的珊瑚王国\n- 在印度洋采集珍珠，与鲨鱼搏斗\n- 通过阿拉伯海底隧道（苏伊士运河海底通道）\n- 探索沉没的亚特兰蒂斯古城遗迹\n- 抵达南极冰盖下的海域\n- 遭遇巨型章鱼的惊险战斗\n- 卷入北冰洋的大漩涡\n\n👤 尼摩船长——最复杂的角色\n\n尼摩船长是这部小说最迷人的角色。他：\n- 精通多国语言，博学多才\n- 对人类社会深感失望，选择隐居海底\n- 用海底的财富暗中帮助被压迫的人民\n- 厌恶战争和殖民主义\n\n他是英雄还是隐士？是理想主义者还是逃避者？这正是凡尔纳留给读者思考的问题。\n\n💡 科学与想象\n\n凡尔纳写这本书时（1869年），现代潜水艇还没有发明。但他想象的"鹦鹉螺号"有很多超前的设计：\n- 全电力驱动（从海水中提取钠制造电池）\n- 最大潜水深度16000米\n- 船上有图书馆、博物馆、大型观景窗\n\n1954年，美国第一艘核动力潜艇下水，名字就叫"鹦鹉螺号"——向凡尔纳致敬！\n\n🤔 读后思考：\n1. 尼摩船长选择离开人类社会，你觉得他这个选择对吗？\n2. 如果你有一艘潜水艇，你最想去探索哪片海域？\n3. 凡尔纳在150多年前就能想象出这些科技，你觉得今天的哪些科幻想象可能在未来变成现实？'
    },
    {
      id: 15, title: '《少年百科》— 人工智能简史', type: 'book', duration: '20分钟',
      ageMin: 11, ageMax: 12, desc: '从图灵到ChatGPT，AI是怎么一步步发展的',
      content: '你可能已经用过语音助手、人脸解锁、智能推荐……这些都是人工智能（AI）的应用。但AI是怎么发展到今天的呢？\n\n🏛️ 起源（1950年代）\n\n1950年，英国数学家艾伦·图灵发表论文《计算机器与智能》，提出了著名的"图灵测试"：如果一台机器能让人类无法分辨它是机器还是人，那就可以认为这台机器具有"智能"。\n\n1956年，在美国达特茅斯学院的一次会议上，"人工智能"（Artificial Intelligence）这个词正式诞生。科学家们乐观地预测：20年内就能造出和人一样聪明的机器。\n\n❄️ AI的寒冬（1970-1990年代）\n\n现实远比想象困难。早期AI只能解决简单的逻辑问题，面对复杂的现实世界无能为力。两次"AI寒冬"中，资金大幅减少，研究陷入低谷。\n\n问题在于：当时的计算机算力太弱，数据太少，算法也不够好。\n\n🌅 深度学习的崛起（2010年代）\n\n三个条件终于同时成熟了：\n1. 大数据：互联网产生了海量数据用于训练\n2. 强算力：GPU（显卡）让计算速度飞跃提升\n3. 好算法：深度学习（多层神经网络）被重新发现\n\n2012年，深度学习在图像识别比赛中大幅领先传统方法，震惊学术界。\n\n2016年，Google的AlphaGo以4:1击败世界围棋冠军李世石。要知道，围棋的可能局面数量比宇宙中的原子还多！\n\n🤖 大语言模型时代（2020年代）\n\n2022年底，ChatGPT横空出世，让全世界认识到AI已经能够：\n- 流畅地理解和生成人类语言\n- 写作、编程、翻译、分析\n- 通过各种专业考试\n\n它的原理是"Transformer"架构——通过阅读互联网上的海量文本，学会了语言的规律和知识。\n\n⚖️ AI的挑战与思考\n\nAI带来便利的同时也有挑战：\n- 偏见问题：AI从数据中学习，如果数据有偏见，AI也会有偏见\n- 就业影响：一些工作可能被AI取代\n- 真假难辨：AI可以生成逼真的假图片、假视频\n- 安全风险：如何确保AI始终为人类服务？\n\n🤔 思考题：\n1. 你觉得AI有一天能真正"思考"吗？还是它只是在模仿思考？\n2. 你希望AI帮你做哪些事情？有哪些事情你觉得不应该交给AI？\n3. 如果你能发明一种AI产品，你会做什么？'
    },
    // === 11-12岁 视频 ===
    {
      id: 12, title: '《科技前沿少年说》— AI是怎样学习的', type: 'video', duration: '20分钟',
      ageMin: 11, ageMax: 12, desc: '了解机器学习和神经网络的基本原理',
      videoUrl: ''
    },
    {
      id: 14, title: '《物理实验室》— 光的折射与彩虹', type: 'video', duration: '18分钟',
      ageMin: 11, ageMax: 12, desc: '用三棱镜分解白光，在家制造彩虹',
      videoUrl: ''
    }
  ]);
}

/** 获取所有推荐内容（内置 + 家长自定义） */
function getAllRecommendations() {
  const builtin = getBuiltinRecommendations();
  const custom = wx.getStorageSync('customRecommendations') || [];
  return builtin.concat(custom);
}

/** 获取自定义推荐内容 */
function getCustomRecommendations() {
  return wx.getStorageSync('customRecommendations') || [];
}

/** 保存自定义推荐内容 */
function saveCustomRecommendations(list) {
  syncSet('customRecommendations', list);
}

/** 添加自定义推荐内容 */
function addCustomRecommendation(item) {
  const list = getCustomRecommendations();
  item.id = Date.now();
  item.custom = true;
  list.push(item);
  saveCustomRecommendations(list);
  return list;
}

/** 删除自定义推荐内容 */
function deleteCustomRecommendation(id) {
  let list = getCustomRecommendations();
  list = list.filter(r => r.id !== id);
  saveCustomRecommendations(list);
  return list;
}

/** 获取推荐内容（根据年龄筛选） */
function getRecommendations(age) {
  age = age || getSettings().studentAge;
  const all = getAllRecommendations();
  const suitable = all.filter(r => age >= r.ageMin && age <= r.ageMax);
  if (suitable.length === 0) {
    return all.filter(r => r.ageMin <= 8);
  }

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

/** 根据 ID 查找推荐内容 */
function getRecommendationById(id) {
  return getAllRecommendations().find(r => r.id === id) || null;
}

/** 获取今日推荐（缓存） */
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

/** 清除今日推荐缓存（家长更新内容后刷新） */
function clearTodayRecommendCache() {
  const today = getToday();
  wx.removeStorageSync(`recommend_${today}`);
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
  syncSet('gifts', gifts);
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
  syncSet('redemptions', redemptions);
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

// ========== 物品清单管理 ==========

function _resetChecklistIfNewDay() {
  const today = getToday();
  const lastReset = wx.getStorageSync('checklistResetDate');
  if (lastReset !== today) {
    const list = wx.getStorageSync('checklist') || [];
    if (list.length > 0) {
      list.forEach(item => { item.checked = false; });
      wx.setStorageSync('checklist', list);
    }
    wx.setStorageSync('checklistResetDate', today);
  }
}

function getChecklist() {
  _resetChecklistIfNewDay();
  return wx.getStorageSync('checklist') || [];
}

function saveChecklist(list) {
  syncSet('checklist', list);
}

function addChecklistItem(name) {
  const list = getChecklist();
  const exists = list.some(i => i.name === name);
  if (exists) return list;
  list.push({ id: Date.now(), name: name, checked: false });
  saveChecklist(list);
  return list;
}

function deleteChecklistItem(id) {
  let list = getChecklist();
  list = list.filter(item => item.id !== id);
  saveChecklist(list);
  return list;
}

function toggleChecklistItem(id) {
  const list = getChecklist();
  const item = list.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    saveChecklist(list);
  }
  return list;
}

function getChecklistStats() {
  const list = getChecklist();
  const unchecked = list.filter(i => !i.checked).length;
  return { total: list.length, unchecked: unchecked, allDone: list.length > 0 && unchecked === 0 };
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
  checkInTask,
  undoCheckInTask,
  getStars,
  addStarRecord,
  getTotalStars,
  getStarHistory,
  getChecklist,
  saveChecklist,
  addChecklistItem,
  deleteChecklistItem,
  toggleChecklistItem,
  getChecklistStats,
  getRecommendations,
  getFullBookLibrary,
  getEnabledBookIds,
  setEnabledBookIds,
  parsePinyinText,
  detectVideoLinkType,
  getRecommendationById,
  getAllRecommendations,
  getCustomRecommendations,
  addCustomRecommendation,
  deleteCustomRecommendation,
  getTodayRecommendations,
  clearTodayRecommendCache,
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

