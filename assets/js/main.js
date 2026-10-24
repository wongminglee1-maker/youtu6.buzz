/**
 * 悠兔 youtu6.buzz - 核心交互逻辑
 * 处理站点配置挂载、链接分发与待配置入口模态弹窗
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // 1. 初始化弹窗 DOM 结构（若未静态存在）
    ensureConfigModal();

    // 2. 绑定带有 data-action 的业务按钮
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      handleActionClick(e, action);
    });

    // 3. 模态框关闭事件绑定
    const modalBackdrop = document.getElementById('configModal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop || e.target.closest('[data-modal-close]')) {
          closeModal();
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('is-active')) {
          closeModal();
        }
      });
    }
  });

  function handleActionClick(event, action) {
    event.preventDefault();
    const config = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};

    let targetUrl = null;
    let label = '服务入口';

    if (action === 'register') {
      targetUrl = config.registrationUrl;
      label = '账号注册';
    } else if (action === 'subscribe') {
      targetUrl = config.subscriptionUrl;
      label = '订阅中心';
    } else if (action === 'support') {
      targetUrl = config.supportUrl;
      label = '客户支持';
    }

    if (targetUrl && typeof targetUrl === 'string' && targetUrl.trim().length > 0 && targetUrl.startsWith('http')) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      openModal(label);
    }
  }

  function openModal(actionLabel) {
    const modal = document.getElementById('configModal');
    const titleEl = document.getElementById('modalTitle');
    const msgEl = document.getElementById('modalMessage');

    const config = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};

    if (titleEl) {
      titleEl.textContent = `${actionLabel} · ${config.unconfiguredNoticeTitle || '入口待配置'}`;
    }
    if (msgEl) {
      msgEl.textContent = config.unconfiguredNoticeMessage || 
        '该功能入口当前处于【入口待配置】状态。官方暂未开放公开外部跳转。站长后续在 config/site.js 中添加有效地址后即可直接访问。';
    }
    if (modal) {
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    const modal = document.getElementById('configModal');
    if (modal) {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  function ensureConfigModal() {
    if (document.getElementById('configModal')) return;

    const modalHtml = `
      <div id="configModal" class="config-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="config-modal-card">
          <div class="modal-header-tag">[ 00 / SYSTEM NOTICE ]</div>
          <h3 id="modalTitle" class="modal-title">入口待配置</h3>
          <p id="modalMessage" class="modal-message">
            该功能入口当前处于【入口待配置】状态。官方暂未开放公开外部跳转。
          </p>
          <div class="modal-actions">
            <button type="button" class="btn btn-primary btn-sm" data-modal-close>明白并关闭</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
})();
