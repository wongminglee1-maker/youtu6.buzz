/**
 * 悠兔 youtu6.buzz 站点核心配置文件
 * 
 * 后续如需更新注册链接、订阅管理链接或在线客服支持链接，
 * 仅需修改下方对应的 URL 字段，全站即可全局生效。
 */

const SITE_CONFIG = {
  // 品牌基础信息
  brandName: "悠兔",
  brandEnglish: "Youtu",
  domain: "https://youtu6.buzz",
  theme: "Blue Manual",
  
  // 核心业务链接配置（已配置真实注册与订购链接）
  registrationUrl: "https://varnexa.lingdongaff.com/#/?code=HHoxxHGa",
  subscriptionUrl: "https://varnexa.lingdongaff.com/#/?code=HHoxxHGa",
  supportUrl: null,      // 例: "https://t.me/your_official_support"

  // 状态提示文案
  unconfiguredNoticeTitle: "入口待配置",
  unconfiguredNoticeMessage: "该功能入口当前处于【入口待配置】状态。官方暂未开放公开外部跳转。站长后续添加有效地址后即可直接访问。",
  
  // 联系与版权声明
  contactEmail: null,
  updateDate: "2026-10-24"
};

// 兼容 Node.js 脚本与浏览器环境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
