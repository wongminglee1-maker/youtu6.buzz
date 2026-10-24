# 悠兔 Youtu (youtu6.buzz) 搜索引擎提交与技术 SEO 操作指南

> **声明**：本指南为站长正式上线部署后的实操指引。由于本站目前处于本地开发验收阶段，尚未完成正式线上域名解析，**本站严正声明：尚未向 Bing、Google 执行最终验证与成功提交**。待域名部署上线后，请按照以下步骤依次操作。不可保证收录时间或搜索首页排名。

---

## 一、上线前技术 SEO 审查核验

本站已在代码层面预置全部标准技术 SEO 属性：

1. **规范 URL（Canonical）**：
   - 首页：`https://youtu6.buzz/`
   - 六篇独立文章分别指向自身绝对规范 URL，杜绝跨域名、跨协议的重复内容竞争。
2. **元数据标签（Title / Description / Keywords）**：
   - 首页与 6 篇知识指南均配置了独一无二的元标题、精准描述和语义化关键词，自然融入“悠兔”、“Youtu”、“悠兔官网”、“悠兔套餐”、“悠兔客户端”等核心词，无强行堆砌。
3. **结构化数据（JSON-LD）**：
   - 首页：`WebSite` 与 `Organization` 模式。
   - 文章页：`Article` 与 `BreadcrumbList` 模式，便于搜索引擎解析面包屑路径与文章作者信息。
4. **爬虫协议与站点地图**：
   - `robots.txt` 放行公网抓取并声明 Sitemap 地址。
   - `sitemap.xml` 完整包含首页及 6 篇已发布长文。

---

## 二、Bing Webmaster Tools（必应站长平台）配置指引

1. **登录控制台**：
   - 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters/) 并使用 Microsoft 账号登录。

2. **添加站点**：
   - 输入正式站点地址：`https://youtu6.buzz/`。

3. **所有权验证方式（任选其一）**：
   - **方式 A（推荐，基于 DNS）**：在 Cloudflare 或域名解析商后台添加一条 TXT 记录，主机记录填写 `@`，记录值填写必应给出的验证哈希。
   - **方式 B（XML 文件验证）**：从控制台下载 `BingSiteAuth.xml`，放置于网站根目录，确认能通过 `https://youtu6.buzz/BingSiteAuth.xml` 打开后点击验证。
   - **方式 C（Meta 标签验证）**：将必应给出的 `<meta name="msvalidate.01" content="..." />` 复制并粘贴至 `index.html` 的 `<head>` 区域。

4. **Sitemap 提交**：
   - 站点验证通过后，在左侧导航点击 **Sitemaps（站点地图）**。
   - 在提交输入框中填入：`https://youtu6.buzz/sitemap.xml`，点击提交。

---

## 三、Google Search Console（谷歌站长平台）配置指引

1. **登录平台**：访问 [Google Search Console](https://search.google.com/search-console)。
2. **添加资源类型**：
   - 推荐选择“网址前缀”，输入 `https://youtu6.buzz/`。
3. **验证所有权**：
   - 推荐使用 DNS TXT 记录或上传 Google HTML 验证文件至根目录。
4. **提交 Sitemap**：
   - 验证成功后，点击左侧“站点地图”，输入 `sitemap.xml` 并点击提交。

---

## 四、IndexNow 极速索引提交配置（可选）

IndexNow 支持在文章更新时秒级推送至 Microsoft Bing 和 Yandex 搜索引擎。

### 1. 生成 API 密钥
生成一个 32 位十六进制随机字符串（例如 `8f3d1b9e2c4a7056e184c9f2a015db74`）。

### 2. 在网站根目录放置验证文件
创建文件：`8f3d1b9e2c4a7056e184c9f2a015db74.txt`，内容仅包含该 Key 本身。

### 3. 调用 API 批量通知 Bing
通过 POST 请求向 `https://api.indexnow.org/indexnow` 发送 JSON 负载：

```json
{
  "host": "youtu6.buzz",
  "key": "8f3d1b9e2c4a7056e184c9f2a015db74",
  "keyLocation": "https://youtu6.buzz/8f3d1b9e2c4a7056e184c9f2a015db74.txt",
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

响应状态码为 `200` 或 `202` 即代表已成功接收排队。

---

## 五、跨域名 SEO 隔离策略

针对站长拥有的其他悠兔域名（如 `youtu6.mom`、`youtu6.lol`）：

1. **绝对禁止交叉 Canonical 指向**：本站各页面 Canonical 必须严格锚定 `https://youtu6.buzz/`，绝不可指向 `youtu6.lol` 或 `youtu6.mom`，防止搜索引擎误判为镜像搬运站。
2. **内容全面隔离**：本站 6 篇长文（入口辨别、安装安全、网络三要素、维护公告、HTTP状态码、换机迁移）与既有站点的故障自检、跨网出行、后台保活形成完全不同的搜索意图互补，互不干扰，不产生关键词自相蚕食（Keyword Cannibalization）。
