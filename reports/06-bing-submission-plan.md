# 悠兔 youtu6.buzz IndexNow 自动化与 Bing Webmaster 上线操作方案

**执行规划时间**：2026-10-24  
**支持协议**：IndexNow 协议 v1.0 (Bing / Yandex / Seznam / Naver 跨平台联合推送)  
**目标网站**：`https://youtu6.buzz/`  

---

## 一、IndexNow 自动化推送体系配置

IndexNow 是 Bing 官方主推的高效收录协议。当网站有新增或更新内容时，通过 API 实时通知搜索引擎，Bingbot 会优先将其加入爬取队列，无需被动等待漫长的定期巡检。

### 1. 密钥规范与文件部署
- **分配密钥 (API Key)**：`4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a`
- **本地密钥物理文件**：`c:\Users\USERR\Desktop\落地页\youtu6.buzz\4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a.txt`
- **正式线上验证地址**：`https://youtu6.buzz/4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a.txt`
- **文件内容**：纯文本字符串 `4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a`，字符编码为 `UTF-8`。
- **验证机制**：当首次向 IndexNow 发起推送时，Bing 服务器会主动通过 HTTP GET 访问上述 URL 验证您对域名的所有权。

---

### 2. 本地自动化推送工具 (`scripts/indexnow-submit.js`)
项目内部已预置经过测试的 Node.js 自动化提交脚本：
```bash
# 本地测试与数据构建验证 (不向远程发送请求)
node scripts/indexnow-submit.js --dry-run

# 生产环境正式上线后触发实时推送
node scripts/indexnow-submit.js --live
```

#### 推送 Payload 结构明细：
```json
{
  "host": "youtu6.buzz",
  "key": "4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a",
  "keyLocation": "https://youtu6.buzz/4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a.txt",
  "urlList": [
    "https://youtu6.buzz/",
    "https://youtu6.buzz/articles/youtu-website-authenticity.html",
    "https://youtu6.buzz/articles/client-installation-safety.html",
    "https://youtu6.buzz/articles/latency-jitter-packet-loss.html",
    "https://youtu6.buzz/articles/network-maintenance-notices.html",
    "https://youtu6.buzz/articles/http-error-status-guide.html",
    "https://youtu6.buzz/articles/client-device-migration.html"
  ]
}
```

#### API 响应状态排查速查：
- **HTTP 200 / 202 (OK / Accepted)**：推送成功。IndexNow 端点已接受批量 URL 并广播给 Bing 等成员。
- **HTTP 400 (Bad Request)**：JSON 语法错误或 URL 格式无效（脚本已进行内置格式审查）。
- **HTTP 403 (Forbidden)**：Key 无效或线上未检测到 `keyLocation` 文件（通常发生在**网站尚未正式解析上线**时，属于正常现象，待 DNS 生效后再推）。
- **HTTP 422 (Unprocessable)**：提交的 URL 不属于指定的 host。
- **HTTP 429 (Too Many Requests)**：推送频次超标（本站采用批量合并一次性推送，彻底杜绝高频触发）。

---

## 二、Bing Webmaster Tools (BWT) 人工接入实操指南

### 1. 站点所有权验证 (三选一)
在域名正式解析至生产服务器后，登录 [Bing Webmaster Tools](https://www.bing.com/webmasters)：
- **推荐方案 A（极简）**：通过 **Google Search Console (GSC) 一键导入**。若您已在 GSC 验证了该域名，直接授权即可秒级同步。
- **方案 B（静态部署推荐）**：**DNS TXT 记录验证**。在域名 DNS 解析后台添加一条 Bing 提供的 TXT 记录（例如 `MS=xxxxxx`）。
- **方案 C**：**HTML 标记验证**。将 Bing 生成的 `<meta name="msvalidate.01" content="...">` 放入 `index.html` 的 `<head>` 中。

### 2. 提交站点地图 (Sitemap Submission)
1. 登录 BWT 后台，进入左侧菜单 **「Sitemaps」**；
2. 输入完整的地图地址：`https://youtu6.buzz/sitemap.xml`；
3. 点击 **「提交」**；
4. 正常情况下，数分钟至数小时内状态会由 *Processing* 变为 *Success*，并显示发现的 7 个有效 URL。

### 3. URL 检查与实时抓取测试 (Live URL Inspection)
1. 在 BWT 顶部搜索框输入 `https://youtu6.buzz/`，点击「检查」；
2. 点击右上角 **「测试实时 URL (Test Live URL)」**；
3. 检查：
   - HTTP 状态是否为 200；
   - 查看渲染的 DOM 截图，确认首屏标题与蓝图正常呈现；
   - 确认无阻塞资源报错。

---

## 三、上线后全周期复查时间表 (Post-Launch Schedule)

| 时间节点 | 核心任务与检查项目 | 异常应对措施 |
| :--- | :--- | :--- |
| **上线当天 (Day 0)** | 1. 确认 HTTPS 证书生效且无混合内容警报。<br>2. 浏览器打开 `https://youtu6.buzz/robots.txt` 与 `sitemap.xml`。<br>3. 验证 `https://youtu6.buzz/4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a.txt` 可读取。<br>4. 执行 `node scripts/indexnow-submit.js --live`。 | 若 txt 文件 404，检查静态构建根目录复制配置。 |
| **上线后 24 小时 (Day 1)** | 1. 登录 BWT 查看 Sitemap 抓取状态，确认无 XML 错误。<br>2. 运行 BWT 的「Site Scan (站点扫描)」功能进行快速全站扫描。 | 若提示重定向错误，检查 Cloudflare 页面规则是否引起死循环。 |
| **上线后第 3 天 (Day 3)** | 1. 检查 BWT 的「抓取错误 (Crawl Errors)」报告。<br>2. 在 Bing 搜索框输入 `site:youtu6.buzz` 观察首页是否已被收录。 | 若尚未收录属正常周期，在 BWT 对首页使用一次「请求编制索引」。**切勿每天连续重复提交**。 |
| **上线后第 7 天 (Day 7)** | 1. 检查 6 篇技术长文的索引覆盖情况。<br>2. 观察搜索分析（Search Performance）中的品牌词展示量（Impressions）。 | 若某篇长文未收录，使用 Live URL 检查是否有网络超时，必要时通过内部文章互链补充权重。 |
| **上线后第 14 天 (Day 14)** | 1. 综合复盘收录与排名情况。<br>2. 检查是否有用户搜索并点击进入。<br>3. 收集用户反馈优化长文 FAQ。 | 保持站点稳定，避免频繁更改 URL 结构或标题关键词。 |
