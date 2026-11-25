(function () {
  'use strict';
  const ID = 'G-478KL1B433';
  const CONSENT_KEY = 'sjq-analytics-consent-v1';
  const production = ['sjqlab.top', 'www.sjqlab.top'].includes(location.hostname);
  const pageNames = {
    '/':'home', '/index.html':'home', '/pages/height-prediction.html':'height',
    '/pages/body-fat-calculator.html':'body_fat', '/pages/muscle-potential.html':'muscle',
    '/pages/testosterone.html':'testosterone', '/pages/bio-age-calculator.html':'bio_age',
    '/pages/fitness-calculator.html':'fitness', '/pages/paid-report.html':'report',
    '/pages/private-service.html':'private_service', '/pages/body-fat-share.html':'body_fat_share',
    '/pages/gene-lab.html':'gene_lab', '/pages/records.html':'records', '/pages/privacy.html':'privacy'
  };
  const page = pageNames[location.pathname];
  if (!page) return;
  const productNames = {heightGrowth:'height',bodyFat:'body_fat',testosterone:'testosterone',fitness:'fitness',muscle:'muscle'};
  const allowed = new Set(['page_view','calculator_complete','report_offer_click','report_checkout_click','share_card_download','share_card_share','share_link_copy']);
  let choice = null;
  try { choice = localStorage.getItem(CONSENT_KEY); } catch (_) {}
  let started = false;
  const queue = [];
  const sent = new Set();
  const safeLocation = location.origin + (page === 'home' ? '/' : location.pathname);
  const sourceValue = new URLSearchParams(location.search).get('utm_source');
  let source = ['tiktok','douyin','share_card','instagram','youtube'].includes(sourceValue) ? sourceValue : '';
  let campaign = new URLSearchParams(location.search).get('utm_campaign') || '';
  if (!/^(height|body_fat|muscle|testosterone|video_[a-z0-9_-]{1,32})$/.test(campaign)) campaign = '';
  const referrer = (() => { try { return new URL(document.referrer).origin + '/'; } catch (_) { return ''; } })();

  function product() {
    if (page !== 'report') return page;
    try { return productNames[JSON.parse(localStorage.getItem('paidReportData') || '{}').reportType] || 'report'; }
    catch (_) { return 'report'; }
  }
  function gtag() { window.dataLayer.push(arguments); }
  function send(event, tool) {
    gtag('event', event, {
      send_to: ID, tool_name: tool, page_location: safeLocation,
      page_referrer: referrer, page_title: 'SJQ ' + page,
      transport_type: 'beacon'
    });
  }
  function start() {
    if (started || choice !== 'granted' || !production) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'default', {analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js', new Date());
    const config = {send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
      page_location:safeLocation,page_referrer:referrer,page_title:'SJQ ' + page,cookie_expires:60*60*24*90};
    if (source) { config.campaign_source=source; config.campaign_medium=source==='share_card'?'share':'social'; }
    if (campaign) config.campaign_name=campaign;
    gtag('config', ID, config);
    const script = document.createElement('script');
    script.async = true; script.src='https://www.googletagmanager.com/gtag/js?id='+ID;
    document.head.appendChild(script);
    send('page_view', product());
    queue.splice(0).forEach(item => send(item[0],item[1]));
  }
  function track(event, tool) {
    if (!allowed.has(event) || event === 'page_view' || choice === 'denied') return;
    tool = Object.values(pageNames).includes(tool) ? tool : product();
    const key = event + ':' + tool;
    if (sent.has(key)) return;
    sent.add(key);
    if (started) send(event,tool);
    else if (queue.length < 20) queue.push([event,tool]);
  }
  // This client never emits purchase. Only a verified payment service may do so.
  window.SJQAnalytics = Object.freeze({track});
  window.addEventListener('click', event => {
    if (event.defaultPrevented) return;
    const link = event.target.closest && event.target.closest('a');
    if (!link) return;
    if (link.matches('.paid-report-action')) track('report_offer_click', product());
    if (link.matches('.stripe-pay-btn') && new URL(link.href).hostname === 'buy.stripe.com') track('report_checkout_click', product());
  });
  const panel = document.createElement('div');
  panel.className = 'sjq-analytics-choice'; panel.dataset.noTranslate='true';
  panel.setAttribute('role','region');
  panel.innerHTML='<p></p><a href="/pages/privacy.html"></a><div><button type="button" data-choice="granted"></button><button type="button" data-choice="denied"></button></div>';
  const prefs = document.createElement('button');
  prefs.type='button'; prefs.className='sjq-analytics-settings'; prefs.dataset.noTranslate='true';
  const style=document.createElement('style');
  style.textContent='.sjq-analytics-choice[hidden]{display:none}.sjq-analytics-choice{position:fixed;bottom:16px;left:16px;width:min(440px,calc(100vw - 32px));box-sizing:border-box;padding:20px;background:#112330;color:#dfedf5;border:1px solid #396175;border-radius:14px;box-shadow:0 10px 40px #0007;z-index:1400;font:14px/1.6 "Segoe UI","Microsoft YaHei",sans-serif}.sjq-analytics-choice p{margin:0 0 8px}.sjq-analytics-choice a{color:#74d9fa}.sjq-analytics-choice div{display:flex;gap:12px;margin-top:12px}.sjq-analytics-choice button,.sjq-analytics-settings{font:inherit;color:#e5f4fc;background:#183b4e;border:1px solid #4c8299;border-radius:7px;padding:8px 14px;cursor:pointer}.sjq-analytics-choice button{flex:1}.sjq-analytics-settings{margin:10px auto;font-size:14px;display:block}.sjq-analytics-choice button:focus-visible,.sjq-analytics-settings:focus-visible{outline:2px solid #fff;outline-offset:2px}';
  document.head.appendChild(style);
  function render() {
    const en=document.documentElement.lang.startsWith('en');
    panel.setAttribute('aria-label',en?'Analytics preferences':'访问统计偏好');
    panel.querySelector('p').textContent=en?'Allow Google Analytics cookies to measure visits, calculator use and checkout clicks? We do not send your measurements or report contents. You can change this choice in the footer.':'是否允许使用 Google Analytics Cookie 统计访问、计算完成和购买按钮点击？不会发送你的身体数值或报告内容。可在页脚随时更改选择。';
    panel.querySelector('a').textContent=en?'Privacy & analytics details':'隐私与统计说明';
    panel.querySelector('[data-choice="granted"]').textContent=en?'Allow analytics':'允许统计';
    panel.querySelector('[data-choice="denied"]').textContent=en?'Decline':'拒绝';
    prefs.textContent=en?'Analytics preferences':'访问统计偏好';
  }
  function clearAnalyticsCookies() {
    const names=document.cookie.split(';').map(s=>s.trim().split('=')[0]).filter(s=>s==='_ga'||s.startsWith('_ga_'));
    names.forEach(name=>['',';domain='+location.hostname,';domain=.sjqlab.top'].forEach(domain=>{
      document.cookie=name+'=;Max-Age=0;path=/'+domain+';SameSite=Lax';
    }));
  }
  panel.addEventListener('click', event=>{
    const button=event.target.closest('button[data-choice]'); if(!button)return;
    choice=button.dataset.choice;
    try{localStorage.setItem(CONSENT_KEY,choice);}catch(_){}
    panel.hidden=true;
    if(choice==='granted'){
      window['ga-disable-'+ID]=false;
      if(started)gtag('consent','update',{analytics_storage:'granted'}); else start();
    }else{
      window['ga-disable-'+ID]=true;
      if(started)gtag('consent','update',{analytics_storage:'denied'});
      clearAnalyticsCookies(); queue.length=0;
    }
  });
  prefs.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus();});
  window.addEventListener('sjq-language-change',render);
  render(); panel.hidden=choice==='granted'||choice==='denied';
  document.body.appendChild(panel);
  (document.querySelector('footer')||document.body).appendChild(prefs);
  start();
})();
