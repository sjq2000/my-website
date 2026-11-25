(function () {
  'use strict';
  const results = document.getElementById('results');
  if (!results) return;
  const section = document.createElement('section');
  section.className = 'height-share';
  section.dataset.noTranslate = 'true';
  section.hidden = true;
  section.innerHTML = '<div class="height-share-copy"><p class="height-share-eyebrow">SJQ · RESULT CARD</p><h2></h2><p class="height-share-note"></p><label class="height-share-option"><input type="checkbox"><span></span></label><div class="height-share-actions"><button type="button" data-action="download"></button><button type="button" data-action="share"></button><button type="button" data-action="copy"></button></div><p class="height-share-status" role="status" aria-live="polite"></p></div><img class="height-share-image" width="1080" height="1440" alt="">';
  results.appendChild(section);
  const style = document.createElement('style');
  style.textContent = '.height-share[hidden]{display:none}.height-share{display:grid;grid-template-columns:minmax(0,1fr) minmax(200px,300px);gap:32px;align-items:center;margin:24px 0;padding:28px;border:1px solid #245164;border-radius:20px;background:linear-gradient(135deg,#10212b,#0b111b);text-align:left}.height-share h2{font-size:24px;color:#fff;margin:8px 0 14px}.height-share-eyebrow{font-size:12px;letter-spacing:2px;color:#39d7e8}.height-share-note{font-size:16px;color:#b3c4ce;line-height:1.7}.height-share-option{display:flex;gap:10px;align-items:center;margin:20px 0;font-size:14px;color:#c9dae5}.height-share-option input{width:18px;height:18px;accent-color:#00bfff}.height-share-actions{display:flex;flex-wrap:wrap;gap:10px}.height-share-actions button{border:1px solid #356075;border-radius:10px;padding:12px 16px;background:#172d3a;color:#f3faff;font:600 14px/1.4 inherit;cursor:pointer}.height-share-actions button:first-child{background:#00bfff;color:#07131a;border-color:#00bfff}.height-share-actions button:focus-visible{outline:2px solid #fff;outline-offset:3px}.height-share-status{font-size:14px;min-height:24px;color:#9fe0ee;line-height:1.6}.height-share-image{width:100%;height:auto;border-radius:16px;border:1px solid #294958;box-shadow:0 12px 32px #0005}@media(max-width:650px){.height-share{grid-template-columns:1fr;padding:20px;gap:20px}.height-share-image{max-width:300px;margin:auto}.height-share-actions button{flex:1 1 120px}}';
  document.head.appendChild(style);
  const image = section.querySelector('img');
  const includeDetails = section.querySelector('input');
  const status = section.querySelector('[role="status"]');
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  let snapshot = null;
  const en = () => document.documentElement.lang.startsWith('en');
  const label = (zh, english) => en() ? english : zh;
  const buttons = Object.fromEntries(Array.from(section.querySelectorAll('button')).map(b => [b.dataset.action, b]));
  const link = 'https://sjqlab.top/pages/height-prediction.html?utm_source=share_card&utm_medium=share&utm_campaign=height';

  function text(value, x, y, size, color, weight) {
    ctx.fillStyle = color || '#ecf5fb';
    ctx.font = (weight || 400) + ' ' + size + 'px "Segoe UI", "Microsoft YaHei", sans-serif';
    ctx.fillText(value, x, y);
  }
  function render() {
    if (!snapshot) return;
    const english = en();
    section.querySelector('h2').textContent = label('把结果做成分享卡', 'Your result, ready to share');
    section.querySelector('.height-share-note').textContent = label('下载竖版图片，或用系统分享发送。卡片只包含下方预览中显示的内容；测试链接不包含你的身体数据。', 'Download a portrait card or use your device’s share menu. Only the previewed details appear on the card. The calculator link contains no body measurements.');
    section.querySelector('label span').textContent = label('同时展示当前身高和参考百分位', 'Include current height and reference percentile');
    buttons.download.textContent = label('下载图片', 'Download image');
    buttons.share.textContent = label('分享结果卡', 'Share card');
    buttons.copy.textContent = label('复制测试链接', 'Copy calculator link');
    image.alt = label('身高结果分享卡预览', 'Height result card preview');
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1440);
    gradient.addColorStop(0, '#132c3b'); gradient.addColorStop(1, '#070c16');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1080, 1440);
    ctx.strokeStyle = '#224151'; ctx.lineWidth = 1;
    for (let x = 70; x < 1080; x += 94) { ctx.beginPath(); ctx.moveTo(x, 340); ctx.lineTo(x, 940); ctx.stroke(); }
    for (let y = 340; y < 940; y += 94) { ctx.beginPath(); ctx.moveTo(70, y); ctx.lineTo(1010, y); ctx.stroke(); }
    text('SJQ', 80, 125, 58, '#34dbed', 800);
    text(english ? 'BODY DATA LAB' : '身体数据实验室', 225, 121, 30, '#c5d8e4', 600);
    text(english ? 'HEIGHT EXPLORER' : '我的身高参考卡', 80, 270, 32, '#93aeba', 600);
    text(snapshot.isMature ? label('当前成年身高', 'Current adult height') : label('模型估算成年身高', 'Estimated adult height'), 80, 414, english ? 46 : 55, '#eaf6fc', 600);
    text(snapshot.predictedAdult.toFixed(1), 74, 615, 164, '#54deef', 800);
    text('cm', 770, 610, 56, '#a6c7d4', 500);
    text(label('基于当前计算器参考模型', 'Based on the calculator’s reference model'), 80, 698, english ? 30 : 34, '#a1bac7');
    if (includeDetails.checked) {
      text(label('当前身高', 'Current height'), 80, 810, 30, '#a1bac7');
      text(snapshot.currentHeight.toFixed(1) + ' cm', 80, 875, 52, '#eaf6fc', 700);
      text(label('参考百分位', 'Reference percentile'), 560, 810, 30, '#a1bac7');
      text('P' + snapshot.percentile.toFixed(1), 560, 875, 52, '#eaf6fc', 700);
    } else {
      text(label('你在参考曲线的什么位置？', 'Where are you on the reference curve?'), 80, 850, english ? 35 : 44, '#d0e4ee', 500);
    }
    ctx.fillStyle = '#16394a'; ctx.fillRect(80, 985, 920, 170);
    text(label('查看你的身高参考结果', 'Explore your height estimate'), 110, 1052, english ? 37 : 42, '#eaf6fc', 700);
    text('sjqlab.top', 110, 1114, 38, '#54deef', 600);
    text(label('模型估算，不代表确定的成年身高。', 'A model estimate, not a guaranteed adult height.'), 80, 1250, english ? 29 : 32, '#94acba');
    text(label('群体参考位置，不是医学诊断。', 'Reference-population comparison; not a diagnosis.'), 80, 1305, english ? 29 : 32, '#94acba');
    image.src = canvas.toDataURL('image/png');
  }
  function setStatus(zh, english) { status.textContent = label(zh, english); }
  function track(event) { if (window.SJQAnalytics) window.SJQAnalytics.track(event, 'height'); }
  function download() {
    const a = document.createElement('a');
    a.href = image.src; a.download = 'sjq-height-result.png'; a.click();
    track('share_card_download');
    setStatus('图片已生成，可在下载文件中查看；手机也可长按预览保存。', 'Image generated. Check your downloads, or long-press the preview to save.');
  }
  buttons.download.addEventListener('click', download);
  buttons.copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(link); track('share_link_copy'); setStatus('测试链接已复制，不包含你的测量数据。', 'Calculator link copied. It contains no measurements.'); }
    catch (_) { setStatus('请复制这个测试链接：' + link, 'Copy this calculator link: ' + link); }
  });
  buttons.share.addEventListener('click', async () => {
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Image unavailable');
      const file = new File([blob], 'sjq-height-result.png', {type: 'image/png'});
      if (navigator.canShare && navigator.canShare({files: [file]})) {
        await navigator.share({files: [file], title: label('我的身高参考卡', 'My height result card')});
        track('share_card_share');
        setStatus('结果卡已交给系统分享。', 'Card sent to your device’s share menu.');
      } else { download(); }
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('未能打开分享，请使用“下载图片”。', 'Sharing is unavailable. Use Download image instead.');
    }
  });
  includeDetails.addEventListener('change', render);
  window.addEventListener('sjq-language-change', render);
  window.addEventListener('sjq-height-result', () => {
    const data = window.heightPredictionData;
    if (!data || ![data.predictedAdult, data.currentHeight, data.percentile].every(Number.isFinite)) return;
    snapshot = {predictedAdult:data.predictedAdult, currentHeight:data.currentHeight, percentile:data.percentile, isMature:!!data.isMature};
    status.textContent = ''; section.hidden = false; render(); track('calculator_complete');
  });
  function invalidate() { snapshot = null; section.hidden = true; window.heightPredictionData = null; }
  window.addEventListener('sjq-height-invalidated', invalidate);
  ['sex','birthYear','birthMonth','measureYear','measureMonth','currentHeight'].forEach(id => {
    document.getElementById(id).addEventListener('input', invalidate);
    document.getElementById(id).addEventListener('change', invalidate);
  });
})();
