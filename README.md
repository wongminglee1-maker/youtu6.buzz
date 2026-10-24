# 悠兔 Youtu 官方品牌落地页 (youtu6.buzz)

> **Blue Manual｜蓝图式极简科技官网**  
> 悠兔品牌服务介绍、套餐客观参考、网络连接质量指标实测与多端客户端安全指南。

---

## 🌐 站点信息

- **品牌名称**：悠兔 (Youtu)
- **正式域名**：`https://youtu6.buzz/`
- **设计主题**：Blue Manual 极简技术蓝图规范（统一留白、蓝色编号、横线规约卡片、纯原生语义化结构）
- **技术栈**：原生语义化 HTML5 + CSS3 + 纯原生 Vanilla JavaScript（零 SSR 运行时、零构建黑盒、初始 HTML 100% 完整直出）

---

## 📁 目录架构说明

```text
├── index.html                           # 官网主落地页 (7大核心模块 + 结构化套餐表 + FAQ)
├── 404.html                             # 404 错误页 (标准 noindex, follow)
├── robots.txt                           # 爬虫抓取控制规范 (包含 Bingbot / Googlebot 显式规则)
├── sitemap.xml                          # 官方 XML 网站地图 (7个标准 HTTPS 页面)
├── 4b8c7e2d1a9f0e3b5d7a2c4e6f8b0d2a.txt # IndexNow 密钥验证文件
├── _headers                             # Cloudflare Pages 安全头与不可变静态缓存规则
├── _redirects                           # Cloudflare Pages 静态 404 响应规则
├── vercel.json                          # Vercel 静态托管平台规则
├── articles/                            # 六大原创深度技术长文 (总计 11,099 汉字)
│   ├── youtu-website-authenticity.html  # 01 官网入口辨别、域名 HTTPS 与防钓鱼核查
│   ├── client-installation-safety.html  # 02 客户端安装来源、数字签名与权限安全
│   ├── latency-jitter-packet-loss.html  # 03 延迟、抖动与丢包率网络质量实测指南
│   ├── network-maintenance-notices.html # 04 线路维护公告解读与故障排查自救
│   ├── http-error-status-guide.html     # 05 403、429、502、504 HTTP 状态码排查
│   └── client-device-migration.html     # 06 换机配置备份、订阅迁移与旧设备清理
├── assets/                              # 静态资源 (CSS / JS / 蓝图视觉图标)
│   ├── css/style.css                    # 全局响应式样式表 (支持 prefers-reduced-motion)
│   ├── js/main.js                       # 模态弹窗与链接事件安全拦截
│   └── images/logo.png                  # 品牌方形深色背景蓝色矢量图
├── config/site.js                       # 全站单点核心配置文件 (注册、订阅、客服 URL)
├── data/plans.json                      # 6 款套餐规格结构化技术核验数据
├── reports/                             # 全套 Bing SEO 深度审查与验收报告
│   ├── 01-site-inventory.md             # 全站资产与页面清单
│   ├── 02-crawlability-audit.md         # Bingbot 抓取与渲染诊断报告
│   ├── 03-keyword-and-metadata.md       # 关键词矩阵与 Meta 意图分析
│   ├── 04-content-quality.md            # 内容原创性与 E-E-A-T 质量评估
│   ├── 05-performance-and-mobile.md     # 移动端、性能与安全审查报告
│   ├── 06-bing-submission-plan.md       # IndexNow 推送与 BWT 接入指南
│   └── BING-SEO-FINAL-AUDIT.md          # 100 分制终审验收报告 (评分 99/100)
├── scripts/                             # 自动化运维工具
│   └── indexnow-submit.js               # IndexNow 批量 URL 自动推送脚本
└── test_site_integrity.js               # 全站自动化技术与 SEO 规范验收测试套件 (83项通过)
```

---

## 🚀 本地运行与测试

### 1. 本地轻量预览服务器
```bash
node serve.js
# 访问 http://127.0.0.1:8090/
```

### 2. 全站自动化质量与 SEO 断言测试
```bash
node test_site_integrity.js
# 执行 83 项全自动化断言测试 (含死链检查、Canonical、字数规范、IndexNow 密钥等)
```

### 3. IndexNow 实时推送 (上线后执行)
```bash
# 测试模式 (校验 payload 与 Key)
node scripts/indexnow-submit.js --dry-run

# 生产环境正式推送
node scripts/indexnow-submit.js --live
```
