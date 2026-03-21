/**
 * 微信云开发数据同步模块
 *
 * 使用前需要：
 * 1. 在微信公众平台注册小程序，获取真实 AppID（替换 project.config.json 中的 touristappid）
 * 2. 在微信开发者工具中开通云开发，创建云环境
 * 3. 在云开发控制台创建集合 "userData"，权限设为"仅创建者可读写"
 * 4. 将下方 ENV_ID 替换为你的云环境 ID
 */

const ENV_ID = 'cloud1-8gytt4p1d02cff72';

let cloudReady = false;
let db = null;

function initCloud() {
  if (!ENV_ID) {
    console.log('[Cloud] 未配置云环境 ID，使用本地存储模式');
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    try {
      if (!wx.cloud) {
        console.log('[Cloud] 当前环境不支持云开发');
        resolve(false);
        return;
      }
      wx.cloud.init({
        env: ENV_ID,
        traceUser: true
      });
      db = wx.cloud.database();
      cloudReady = true;
      console.log('[Cloud] 初始化成功');
      resolve(true);
    } catch (e) {
      console.log('[Cloud] 初始化失败:', e.message);
      resolve(false);
    }
  });
}

function isReady() {
  return cloudReady;
}

/** 从云端读取一个 key 的数据 */
async function cloudGet(key) {
  if (!cloudReady) return null;
  try {
    const res = await db.collection('userData').where({ dataKey: key }).get();
    if (res.data && res.data.length > 0) {
      return res.data[0].value;
    }
    return null;
  } catch (e) {
    console.log('[Cloud] 读取失败:', key, e.message);
    return null;
  }
}

/** 写入一个 key 的数据到云端（自动判断新增/更新） */
async function cloudSet(key, value) {
  if (!cloudReady) return;
  try {
    const res = await db.collection('userData').where({ dataKey: key }).get();
    if (res.data && res.data.length > 0) {
      await db.collection('userData').doc(res.data[0]._id).update({
        data: { value: value, updatedAt: new Date() }
      });
    } else {
      await db.collection('userData').add({
        data: { dataKey: key, value: value, updatedAt: new Date() }
      });
    }
  } catch (e) {
    console.log('[Cloud] 写入失败:', key, e.message);
  }
}

/** 从云端同步所有数据到本地 */
async function syncFromCloud() {
  if (!cloudReady) return false;
  try {
    const res = await db.collection('userData').limit(100).get();
    if (res.data && res.data.length > 0) {
      res.data.forEach(doc => {
        if (doc.dataKey && doc.value !== undefined) {
          wx.setStorageSync(doc.dataKey, doc.value);
        }
      });
      console.log('[Cloud] 同步完成，共', res.data.length, '条数据');
      return true;
    }
    return false;
  } catch (e) {
    console.log('[Cloud] 同步失败:', e.message);
    return false;
  }
}

/** 将本地所有关键数据上传到云端 */
async function syncToCloud() {
  if (!cloudReady) return;
  const keys = ['settings', 'stars', 'gifts', 'redemptions', 'presetTasks', 'weekdayPresets', 'weekendPresets', 'customRecommendations', 'checklist'];
  for (const key of keys) {
    const value = wx.getStorageSync(key);
    if (value) {
      await cloudSet(key, value);
    }
  }
  console.log('[Cloud] 本地数据已上传到云端');
}

module.exports = {
  initCloud,
  isReady,
  cloudGet,
  cloudSet,
  syncFromCloud,
  syncToCloud
};
