/**
 * 悠兔 youtu6.buzz - IndexNow 自动化提交工具
 * 支持全量 sitemap URL 提取、Key 校验、测试 Dry-Run 与生产环境安全推送
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = 'youtu6.buzz';
const KEY = '4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const LOG_FILE = path.join(__dirname, '..', 'logs', 'indexnow.log');
const SITEMAP_FILE = path.join(__dirname, '..', 'sitemap.xml');
const KEY_FILE = path.join(__dirname, '..', `${KEY}.txt`);

function log(msg) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${msg}`;
  console.log(entry);
  try {
    fs.appendFileSync(LOG_FILE, entry + '\n', 'utf8');
  } catch (e) {
    // ignore
  }
}

// 1. 验证本地 Key 文件
if (!fs.existsSync(KEY_FILE)) {
  log(`[ERROR] 找不到 IndexNow Key 文件: ${KEY_FILE}`);
  process.exit(1);
}
const localKeyContent = fs.readFileSync(KEY_FILE, 'utf8').trim();
if (localKeyContent !== KEY) {
  log(`[ERROR] Key 文件内容不匹配! 期望: ${KEY}, 实际: ${localKeyContent}`);
  process.exit(1);
}

// 2. 从 sitemap.xml 提取 URL 列表
if (!fs.existsSync(SITEMAP_FILE)) {
  log(`[ERROR] 找不到 sitemap.xml 文件: ${SITEMAP_FILE}`);
  process.exit(1);
}
const sitemapContent = fs.readFileSync(SITEMAP_FILE, 'utf8');
const urlMatches = sitemapContent.match(/<loc>(https:\/\/[^<]+)<\/loc>/g) || [];
const urlList = urlMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

if (urlList.length === 0) {
  log('[ERROR] 未在 sitemap.xml 中提取到任何有效 URL');
  process.exit(1);
}

log(`成功提取 ${urlList.length} 条待通知 URL:`);
urlList.forEach((u, i) => log(`  [${i + 1}] ${u}`));

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
};

const isDryRun = process.argv.includes('--dry-run') || process.env.NODE_ENV !== 'production';

if (isDryRun) {
  log('\n[DRY-RUN 模式] 验证通过！Payload 构建正常，未向 IndexNow API 发送远程请求。');
  log(`Payload: ${JSON.stringify(payload, null, 2)}`);
  log('正式上线后，执行 `node scripts/indexnow-submit.js --live` 即可向 Bing / IndexNow 发送推送。');
  process.exit(0);
}

// 3. 正式线上推送逻辑
log('\n正在向 IndexNow 官方端点 (api.indexnow.org) 发送通知...');
const data = JSON.stringify(payload);

const req = https.request({
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
    'User-Agent': 'Youtu-IndexNow-Client/1.0'
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      log(`[SUCCESS] 提交成功! HTTP ${res.statusCode}: ${res.statusMessage}`);
      log('IndexNow 已接收 URL 变更通知，Bing 将安排爬网与索引队列。');
    } else {
      log(`[WARN] 响应状态异常 HTTP ${res.statusCode}: ${body || res.statusMessage}`);
      if (res.statusCode === 403) {
        log('提示: 403 通常是因为网站尚未正式解析上线，IndexNow 无法访问 KeyLocation 验证文件所有权。');
      }
    }
  });
});

req.on('error', (err) => {
  log(`[ERROR] 网络请求失败: ${err.message}`);
});

req.write(data);
req.end();
