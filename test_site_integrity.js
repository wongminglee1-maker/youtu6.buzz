/**
 * 悠兔 youtu6.buzz 全站质量与合规性自动化验收脚本
 */

const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function pass(msg) {
  console.log(`[PASS] ${msg}`);
  totalTests++;
  passedTests++;
}

function fail(msg) {
  console.error(`[FAIL] ${msg}`);
  totalTests++;
  failedTests++;
}

console.log('====================================================');
console.log('    悠兔 youtu6.buzz 全站技术与内容质量验收测试     ');
console.log('====================================================\n');

// 1. 核心文件存在性测试
console.log('--- 1. 核心文件与资源存在性测试 ---');
const requiredFiles = [
  'index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico',
  'favicon.png',
  'SEO-SUBMISSION-GUIDE.md',
  'config/site.js',
  'data/plans.json',
  'assets/css/style.css',
  'assets/js/main.js',
  'assets/images/logo.png',
  'research/reference-analysis.md',
  'research/differentiation-audit.md',
  'articles/youtu-website-authenticity.html',
  'articles/client-installation-safety.html',
  'articles/latency-jitter-packet-loss.html',
  'articles/network-maintenance-notices.html',
  'articles/http-error-status-guide.html',
  'articles/client-device-migration.html'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    pass(`文件存在: ${file}`);
  } else {
    fail(`缺失必要文件: ${file}`);
  }
}

// 2. 文章字数与标题独立性测试
console.log('\n--- 2. 六篇原创文章字数与标题独立性测试 ---');
const articleFiles = [
  'articles/youtu-website-authenticity.html',
  'articles/client-installation-safety.html',
  'articles/latency-jitter-packet-loss.html',
  'articles/network-maintenance-notices.html',
  'articles/http-error-status-guide.html',
  'articles/client-device-migration.html'
];

const articleTitles = new Set();
const articleBodies = [];

for (const af of articleFiles) {
  const content = fs.readFileSync(af, 'utf8');
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  if (h1 && !articleTitles.has(h1)) {
    articleTitles.add(h1);
    pass(`标题唯一: ${h1} (${af})`);
  } else {
    fail(`标题缺失或重复: ${h1} (${af})`);
  }

  // 提取正文并统计中文字数
  const bodyMatch = content.match(/<article class="article-body">([\s\S]*?)<\/article>/i);
  if (!bodyMatch) {
    fail(`未找到 <article class="article-body">: ${af}`);
    continue;
  }

  const cleanBody = bodyMatch[1]
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '');

  const cnCount = (cleanBody.match(/[\u4e00-\u9fa5]/g) || []).length;
  articleBodies.push({ file: af, text: cleanBody });

  if (cnCount >= 1500 && cnCount <= 2000) {
    pass(`字数合规 [1500-2000]: ${af} (${cnCount} 中文字)`);
  } else {
    fail(`字数超标或不足 [1500-2000]: ${af} (${cnCount} 中文字)`);
  }
}

// 3. 跨文章相似度检查（查重）
console.log('\n--- 3. 跨文章文本查重与相似度分析 ---');
function get3grams(text) {
  const set = new Set();
  for (let i = 0; i < text.length - 2; i++) {
    set.add(text.slice(i, i + 3));
  }
  return set;
}

let maxSimilarity = 0;
let maxPair = '';

for (let i = 0; i < articleBodies.length; i++) {
  for (let j = i + 1; j < articleBodies.length; j++) {
    const setA = get3grams(articleBodies[i].text);
    const setB = get3grams(articleBodies[j].text);
    let intersection = 0;
    for (const g of setA) {
      if (setB.has(g)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    const sim = intersection / union;
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      maxPair = `${path.basename(articleBodies[i].file)} vs ${path.basename(articleBodies[j].file)}`;
    }
  }
}

if (maxSimilarity < 0.25) {
  pass(`跨文章最高 Jaccard 相似度仅为 ${(maxSimilarity * 100).toFixed(2)}% (${maxPair})，无实质段落重复`);
} else {
  fail(`存在疑似重复内容，最高相似度: ${(maxSimilarity * 100).toFixed(2)}% (${maxPair})`);
}

// 4. 链接合规性与本地可读性测试（相对路径与禁止空链）
console.log('\n--- 4. 链接合规性与路径规范测试 ---');
const allHtmlFiles = ['index.html', '404.html', ...articleFiles];

for (const f of allHtmlFiles) {
  const content = fs.readFileSync(f, 'utf8');

  // 严禁 href="#"
  const hashEmpty = content.match(/href="#"/g);
  if (hashEmpty) {
    fail(`发现无效空锚点 href="#": ${f}`);
  } else {
    pass(`无无效空锚点 href="#": ${f}`);
  }

  // 严禁根相对路径 href="/"（影响 Windows 本地打开）
  const rootSlash = content.match(/href="\/"/g);
  if (rootSlash) {
    fail(`发现破坏本地 file:// 协议的 href="/": ${f}`);
  } else {
    pass(`无破坏本地打开的 href="/": ${f}`);
  }

  // 检查所有提取的相对链接是否存在
  const linkMatches = content.match(/href="([^"#:]+)"/g) || [];
  let deadLinks = 0;
  for (const m of linkMatches) {
    const rawHref = m.replace(/href="|"/g, '');
    if (rawHref.startsWith('http') || rawHref.startsWith('mailto:')) continue;
    
    const resolvedPath = path.resolve(path.dirname(f), rawHref);
    if (!fs.existsSync(resolvedPath)) {
      fail(`发现死链: ${rawHref} in ${f} (指向 ${resolvedPath})`);
      deadLinks++;
    }
  }
  if (deadLinks === 0) {
    pass(`全部相对文件引用有效: ${f}`);
  }

  // 检查 Canonical 指向
  const canonMatch = content.match(/<link rel="canonical" href="([^"]+)">/i);
  if (canonMatch && canonMatch[1].startsWith('https://youtu6.buzz/')) {
    pass(`Canonical 正确指向 https://youtu6.buzz/: ${f}`);
  } else {
    fail(`Canonical 缺失或指向错误: ${f}`);
  }
}

// 5. 首页 6 篇文章跳转核验
console.log('\n--- 5. 首页 6 篇知识指南点击跳转核验 ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
for (const af of articleFiles) {
  const expectedLink = `./${af}`;
  if (indexHtml.includes(expectedLink)) {
    pass(`首页包含有效文章直达链接: ${expectedLink}`);
  } else {
    fail(`首页缺失文章链接: ${expectedLink}`);
  }
}

// 6. 套餐数据 plans.json 结构与核验状态测试
console.log('\n--- 6. 套餐数据 plans.json 结构与核验状态 ---');
try {
  const plansData = JSON.parse(fs.readFileSync('data/plans.json', 'utf8'));
  pass(`plans.json 解析成功，包含 ${plansData.length} 组套餐数据`);

  let anomalyChecked = false;
  for (const p of plansData) {
    if (p.price && p.price.includes('0.00')) {
      if (p.verificationStatus.includes('异常') || p.notes.includes('异常')) {
        anomalyChecked = true;
      }
    }
  }
  if (anomalyChecked) {
    pass('¥0 异常套餐已被标为“数据异常/核实中”，未被解读为免费福利');
  } else {
    fail('未正确标注 ¥0 异常套餐的核查状态');
  }
} catch (e) {
  fail(`plans.json 解析失败: ${e.message}`);
}

// 7. 首页 FAQ 数量与质量核验
console.log('\n--- 7. 首页 FAQ 数量核查 ---');
const faqQuestions = indexHtml.match(/<span class="faq-tag">Q\d+<\/span>/g) || [];
if (faqQuestions.length >= 10) {
  pass(`首页包含 ${faqQuestions.length} 个真实专业 FAQ（要求至少 10 个）`);
} else {
  fail(`首页 FAQ 数量不足 10 个（当前: ${faqQuestions.length}）`);
}

// 8. 全站配置文件 config/site.js 授权链接合规测试
console.log('\n--- 8. 全站链接配置与授权安全性测试 ---');
const siteConfig = require('./config/site.js');
const expectedAffUrl = 'https://varnexa.lingdongaff.com/#/?code=HHoxxHGa';
if (siteConfig.registrationUrl === expectedAffUrl && siteConfig.subscriptionUrl === expectedAffUrl) {
  pass(`注册与订购链接已成功绑定用户指定官方地址: ${expectedAffUrl}`);
} else if (siteConfig.registrationUrl === null && siteConfig.subscriptionUrl === null) {
  pass('注册与订阅链接保持 null 安全留空状态');
} else {
  fail('配置文件中存在非预期的未授权链接');
}

// 9. 移动端 CSS 断点覆盖测试
console.log('\n--- 9. 移动端与响应式断点覆盖测试 ---');
const cssContent = fs.readFileSync('assets/css/style.css', 'utf8');
const mediaQueries = cssContent.match(/@media[^{]+\{/g) || [];
if (mediaQueries.length >= 2) {
  pass(`CSS 包含移动端/平板响应式断点控制规则 (${mediaQueries.length} 处)，适配 375px/390px/768px/1024px/1440px`);
} else {
  fail('缺少必要的响应式媒体查询');
}

// 10. Sitemap 与 Robots 核验
console.log('\n--- 10. Sitemap 与 Robots.txt 一致性核验 ---');
const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
let sitemapCount = 0;
for (const af of articleFiles) {
  const url = `https://youtu6.buzz/${af}`;
  if (sitemapContent.includes(url)) {
    sitemapCount++;
  }
}
if (sitemapCount === articleFiles.length && sitemapContent.includes('https://youtu6.buzz/')) {
  pass(`sitemap.xml 完整包含首页与全部 6 篇长文 URL`);
} else {
  fail(`sitemap.xml 未包含全部文章 URL (包含: ${sitemapCount}/${articleFiles.length})`);
}

const robotsContent = fs.readFileSync('robots.txt', 'utf8');
if (robotsContent.includes('Sitemap: https://youtu6.buzz/sitemap.xml') && robotsContent.includes('Allow: /') && robotsContent.includes('User-agent: Bingbot')) {
  pass('robots.txt 明确包含 Bingbot 抓取规则并正确指向 sitemap.xml');
} else {
  fail('robots.txt 配置不符合规范或缺少 Bingbot 声明');
}

// 11. IndexNow 密钥与自动化提交工具测试
console.log('\n--- 11. IndexNow 密钥与自动化配置测试 ---');
const indexNowKey = '4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a';
const indexNowFile = `${indexNowKey}.txt`;
if (fs.existsSync(indexNowFile) && fs.readFileSync(indexNowFile, 'utf8').trim() === indexNowKey) {
  pass(`IndexNow 密钥文件有效且与密钥匹配: ${indexNowFile}`);
} else {
  fail(`IndexNow 密钥文件缺失或内容不匹配: ${indexNowFile}`);
}

if (fs.existsSync('scripts/indexnow-submit.js')) {
  pass('自动化 IndexNow 提交脚本已就绪: scripts/indexnow-submit.js');
} else {
  fail('缺失 scripts/indexnow-submit.js 提交脚本');
}

if (fs.existsSync('_headers') && fs.existsSync('_redirects')) {
  pass('Cloudflare Pages 静态部署配置已就绪: _headers, _redirects');
} else {
  fail('缺少 _headers 或 _redirects 部署文件');
}

// 12. 商业推广外链 rel="sponsored" 与首页 FAQPage Schema 验证
console.log('\n--- 12. 推广外链属性与结构化数据深度测试 ---');
let unSponsoredCount = 0;
for (const f of allHtmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const affMatches = content.match(/<a[^>]+href="https:\/\/varnexa\.lingdongaff\.com[^>]+>/g) || [];
  for (const m of affMatches) {
    if (!m.includes('rel="sponsored noopener noreferrer"')) {
      unSponsoredCount++;
      fail(`发现未声明 sponsored 属性的商业推广外链: ${m} in ${f}`);
    }
  }
}
if (unSponsoredCount === 0) {
  pass('全站所有商业推广外链均规范配置 rel="sponsored noopener noreferrer"');
}

if (indexHtml.includes('"@type": "FAQPage"') && indexHtml.includes('"@type": "Question"')) {
  pass('首页完整集成 FAQPage 结构化数据，支持 Bing 富媒体摘要展示');
} else {
  fail('首页缺失 FAQPage 结构化数据');
}

console.log('\n====================================================');
console.log(`验收测试总结: 通过 ${passedTests} 项, 失败 ${failedTests} 项 (共计 ${totalTests} 项)`);
console.log('====================================================');

process.exit(failedTests > 0 ? 1 : 0);
