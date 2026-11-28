/* 基因实验室 2 — 本地 G25 分析工作台 */
"use strict";

const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

const I18N = {
  zh: {
    dashboard: "总览", matches: "匹配", breakdown: "成分拆解", heatmap: "热力图",
    upload: "上传 / 坐标", saved: "已保存样本",
    sample: "样本", noSample: "未载入样本",
    upgrade: "升级", planFree: "FREE", planPro: "PRO",
    matchesTitle: "最接近的人群", matchesSub: "按 G25 欧氏距离排序，越小越接近",
    closest: "最接近", distance: "距离", tier: "接近度", rank: "#",
    unlockAll: "解锁完整排名", unlockMatches: "免费版只展示前 5 个匹配。",
    unlockBreakdown: "免费版只展示前 4 个成分。",
    unlockHeatmap: "热力图需要解锁。",
    breakdownTitle: "祖源成分拆解", breakdownSub: "用成分模型做非负最小二乘拟合",
    heatmapTitle: "遗传热力图", heatmapSub: "按距离给全球人群上色",
    comingSoon: "施工中",
    totalPop: "库内人群", sampleDim: "坐标维度", bestMatch: "最佳匹配",
    search: "搜索人群名…", pickSample: "选择样本", close: "关闭",
    tabLibrary: "内置人群", tabComposition: "成分换算", tabPaste: "粘贴坐标",
    model: "成分模型", sampleName: "样本名称", sampleNamePh: "留空则自动命名",
    generate: "生成坐标", needPercent: "至少填一项百分比",
    estNameMofang: "23魔方估算", estNameWegene: "微基因估算",
    load: "载入", clear: "清空", save: "保存", delete: "删除",
    savedEmpty: "还没有保存的样本", sampleLoaded: "已载入", notEnough: "至少要 25 个数字",
    langBtn: "EN", themeBtn: "☀", proHint: "已解锁",
    fit: "拟合度", residual: "残差", other: "其他",
    srcOwn: "上传自己的 G25 坐标", srcOwnHint: "已有 25 维坐标？直接粘贴或选文件",
    srcEst: "祖源估算", srcEstHint: "没有坐标？按祖先来源人群估算",
    accuracy: "精确度", pickPop: "选人群", empty2: "未选择",
    parents2: "2 位父母", gp4: "4 位祖父母", gg8: "8 位曾祖父母",
    estimate: "生成估算坐标", clearAll: "全部清空",
    needSlot: "至少选一个人群", fileLoad: "选择文件",
    estName: "祖源估算"
  },
  en: {
    dashboard: "Dashboard", matches: "Matches", breakdown: "Breakdown", heatmap: "Heatmap",
    upload: "Upload / Coordinates", saved: "Saved coordinates",
    sample: "Sample", noSample: "No sample loaded",
    upgrade: "Upgrade", planFree: "FREE", planPro: "PRO",
    matchesTitle: "Closest matches", matchesSub: "Ranked by G25 Euclidean distance",
    closest: "Closest", distance: "Distance", tier: "Proximity", rank: "#",
    unlockAll: "Unlock full ranking", unlockMatches: "Free plan shows the top 5 matches.",
    unlockBreakdown: "Free plan shows the top 4 components.",
    unlockHeatmap: "Heatmap needs an unlock.",
    breakdownTitle: "Ancestral breakdown", breakdownSub: "Non-negative least squares over the component model",
    heatmapTitle: "Genetic heatmap", heatmapSub: "Populations coloured by distance",
    comingSoon: "Work in progress",
    totalPop: "Populations", sampleDim: "Dimensions", bestMatch: "Best match",
    search: "Search population…", pickSample: "Pick a sample", close: "Close",
    tabLibrary: "Library", tabComposition: "From composition", tabPaste: "Paste row",
    model: "Component model", sampleName: "Sample name", sampleNamePh: "Leave blank to auto-name",
    generate: "Generate", needPercent: "Fill at least one percentage",
    estNameMofang: "23Mofang estimate", estNameWegene: "WeGene estimate",
    load: "Load", clear: "Clear", save: "Save", delete: "Delete",
    savedEmpty: "No saved samples yet", sampleLoaded: "Loaded", notEnough: "need at least 25 numbers",
    langBtn: "中文", themeBtn: "☾", proHint: "Unlocked",
    fit: "Fit", residual: "Residual", other: "Other",
    srcOwn: "Upload your own G25 coordinates", srcOwnHint: "Already have 25 values? Paste or pick a file",
    srcEst: "Ancestry estimate", srcEstHint: "No coordinates? Estimate from ancestral populations",
    accuracy: "Accuracy", pickPop: "Pick", empty2: "none",
    parents2: "2 parents", gp4: "4 grandparents", gg8: "8 great-grandparents",
    estimate: "Generate estimate", clearAll: "Clear all",
    needSlot: "pick at least one population", fileLoad: "Choose file",
    estName: "Ancestry estimate"
  }
};

const T = () => I18N[state.lang];

const state = {
  lang: LS.get("gl2-lang", "zh"),
  theme: LS.get("gl2-theme", "dark"),
  plan: LS.get("gl2-plan", "free"),
  view: LS.get("gl2-view", "dashboard"),
  sample: LS.get("gl2-sample", null),
  saved: LS.get("gl2-saved", []),
  estSize: LS.get("gl2-est-size", 4),
  lib: [],
  sources: [],
  models: null,
  results: [],
  breakdown: null
};

const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

/* ---------------- data ---------------- */
async function fetchJson(paths) {
  for (const p of paths) {
    try { const r = await fetch(p); if (r.ok) return await r.json(); } catch (e) {}
  }
  throw new Error("data not found: " + paths.join(" / "));
}

async function loadModels() {
  state.models = await fetchJson(["assets/data/component-models.json", "../assets/data/component-models.json"]);
}

async function loadLibrary() {
  const data = await fetchJson(["assets/data/g25-library.json", "../assets/data/g25-library.json"]);
  state.sources = data.sources || [];
  const flat = [];
  const seen = new Set();
  for (const s of state.sources) {
    for (const row of s.rows) {
      const name = row[0];
      const v = row.slice(1, 26).map(Number);
      if (v.length !== 25 || !v.every((x) => Number.isFinite(x))) continue;
      if (seen.has(name)) continue;
      seen.add(name);
      flat.push({ name, v, src: s.id, srcLabel: s.label });
    }
  }
  state.lib = flat;
}

/* ---------------- math ---------------- */
function distance(a, b) {
  let s = 0;
  for (let i = 0; i < 25; i++) { const d = a[i] - b[i]; s += d * d; }
  return Math.sqrt(s);
}

function tierOf(d) {
  if (d < 2.5) return { cls: "t1", zh: "非常接近", en: "Very close" };
  if (d < 4) return { cls: "t2", zh: "接近", en: "Close" };
  if (d < 8) return { cls: "t2", zh: "有些接近", en: "Somewhat close" };
  if (d < 15) return { cls: "t3", zh: "有些远", en: "Somewhat distant" };
  return { cls: "t4", zh: "远", en: "Distant" };
}

function rank() {
  const s = state.sample;
  if (!s) { state.results = []; return; }
  const out = [];
  for (const p of state.lib) {
    if (p.name === s.name) continue;
    out.push({ name: p.name, src: p.src, d: distance(s.v, p.v) });
  }
  out.sort((a, b) => a.d - b.d);
  state.results = out;
}

function vsum(arr) { let s = 0; for (const v of arr) s += v; return s; }

/* NNLS：投影梯度下降 */
function breakdown(sample) {
  if (!sample || !state.models) return null;
  const model = state.models.mofang ? state.models.mofang : state.models[Object.keys(state.models)[0]];
  const B = model.items.map((it) => it[1]);
  const labels = model.items.map((it) => it[0]);
  const k = B.length;
  const x = sample.v;

  // Gram 矩阵与 B^T x
  const gram = [];
  for (let i = 0; i < k; i++) {
    gram.push(new Array(k).fill(0));
    for (let j = 0; j < k; j++) {
      let s2 = 0;
      for (let d = 0; d < 25; d++) s2 += B[i][d] * B[j][d];
      gram[i][j] = s2;
    }
  }
  const btx = new Array(k).fill(0);
  for (let i = 0; i < k; i++) {
    let s2 = 0;
    for (let d = 0; d < 25; d++) s2 += B[i][d] * x[d];
    btx[i] = s2;
  }
  // Gershgorin 上界 → 安全步长
  let L = 0;
  for (let i = 0; i < k; i++) {
    let row = 0;
    for (let j = 0; j < k; j++) row += Math.abs(gram[i][j]);
    if (row > L) L = row;
  }
  const step = L > 0 ? 1 / L : 1;

  const w = new Array(k).fill(0);
  for (let iter = 0; iter < 20000; iter++) {
    // grad = gram·w − B^T x
    const grad = new Array(k).fill(0);
    for (let i = 0; i < k; i++) {
      let g = -btx[i];
      for (let j = 0; j < k; j++) g += gram[i][j] * w[j];
      grad[i] = g;
    }
    let delta = 0;
    for (let i = 0; i < k; i++) {
      const next = Math.max(0, w[i] - step * grad[i]);
      delta += Math.abs(next - w[i]);
      w[i] = next;
    }
    if (delta < 1e-12) break;
  }

  let sum = w.reduce((a, b) => a + b, 0);
  let used = w;
  let fallback = false;
  if (sum <= 1e-9) {
    // 样本不在模型覆盖范围内（比如用中国成分模型去解释欧洲样本）：
    // 退化成「到各成分的接近度」加权，保证界面永远有可读结果
    fallback = true;
    const dists = B.map((b) => distance(b, x));
    const inv = dists.map((d) => 1 / Math.pow(d + 1e-6, 2));
    const isum = inv.reduce((a, b) => a + b, 0);
    used = inv.map((v) => v / isum);
    sum = 1;
  }
  const parts = used.map((v, i) => ({ label: labels[i], value: sum > 0 ? v / sum : 0 }))
    .filter((p) => p.value > 0.002)
    .sort((a, b) => b.value - a.value);

  let resid = 0;
  for (let d = 0; d < 25; d++) {
    let pred = 0;
    for (let i = 0; i < k; i++) pred += (used[i] / sum) * B[i][d];
    const e = x[d] - pred;
    resid += e * e;
  }
  return { parts, residual: Math.sqrt(resid), modelLabel: model.label, fallback };
}

/* ---------------- persistence ---------------- */
function persist() {
  LS.set("gl2-lang", state.lang);
  LS.set("gl2-theme", state.theme);
  LS.set("gl2-plan", state.plan);
  LS.set("gl2-view", state.view);
  LS.set("gl2-sample", state.sample);
  LS.set("gl2-saved", state.saved);
  LS.set("gl2-est-size", state.estSize);
}

/* ---------------- ui helpers ---------------- */
let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

function openModal(title, bodyNode) {
  $("#modalTitle").textContent = title;
  const body = $("#modalBody");
  body.innerHTML = "";
  body.appendChild(bodyNode);
  $("#modalMask").hidden = false;
}
function closeModal() { $("#modalMask").hidden = true; }

/* ---------------- top bar / sidebar ---------------- */
function renderTopbar() {
  const t = T();
  $("#sampleName").textContent = state.sample ? state.sample.name : t.noSample;
  $("#planBadge").textContent = state.plan === "pro" ? t.planPro : t.planFree;
  $("#langBtn").textContent = state.lang === "zh" ? "EN" : "中文";
  $("#themeBtn").textContent = state.theme === "dark" ? "☀" : "☾";
  $("#upgradeBtn").textContent = state.plan === "pro" ? t.proHint : t.upgrade;
  document.documentElement.setAttribute("data-theme", state.theme);
  document.documentElement.lang = state.lang === "zh" ? "zh" : "en";
}

function renderSidebar() {
  const t = T();
  const nav = $("#sidebar");
  nav.innerHTML = "";
  const items = [
    ["dashboard", "▦", t.dashboard],
    ["matches", "◎", t.matches],
    ["breakdown", "◔", t.breakdown],
    ["heatmap", "◍", t.heatmap]
  ];
  nav.appendChild(el("div", "nav-cap", t.sample));
  for (const [id, ico, label] of items) {
    const b = el("button", "nav-item" + (state.view === id ? " active" : ""));
    b.innerHTML = '<span class="ico">' + ico + "</span><span>" + label + "</span>";
    b.onclick = () => { state.view = id; persist(); render(); };
    nav.appendChild(b);
  }
  nav.appendChild(el("div", "nav-sep"));
  for (const [id, ico, label] of [["upload", "↑", t.upload], ["saved", "★", t.saved]]) {
    const b = el("button", "nav-item" + (state.view === id ? " active" : ""));
    b.innerHTML = '<span class="ico">' + ico + "</span><span>" + label + "</span>";
    b.onclick = () => { state.view = id; persist(); render(); };
    nav.appendChild(b);
  }
}

/* ---------------- cards ---------------- */
function paywallLine(text, btnLabel) {
  const pw = el("div", "paywall");
  pw.innerHTML = "<p>" + text + "</p>";
  const b = el("button", "btn primary", btnLabel);
  b.onclick = () => { toast(state.lang === "zh" ? "Stripe 结账待接入" : "Stripe checkout not wired yet"); };
  pw.appendChild(b);
  return pw;
}

function matchesTable(limit, freeLimit) {
  const t = T();
  const wrap = el("div", "table-wrap");
  const table = el("table", "rows");
  table.innerHTML = '<thead><tr><th class="rank">' + t.rank + "</th><th>" + t.sample +
    '</th><th class="num">' + t.distance + "</th><th>" + t.tier + "</th></tr></thead>";
  const tb = el("tbody");
  state.results.slice(0, limit).forEach((r, i) => {
    const locked = state.plan !== "pro" && i >= freeLimit;
    const tr = el("tr", locked ? "locked-row" : "");
    const tier = tierOf(r.d);
    tr.innerHTML = '<td class="rank">' + (i + 1) + "</td><td>" + r.name +
      '</td><td class="num">' + r.d.toFixed(3) + '</td><td><span class="tier ' + tier.cls + '">' +
      (state.lang === "zh" ? tier.zh : tier.en) + "</span></td>";
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  wrap.appendChild(table);
  return wrap;
}

function cardsRow(limit, preview, freeLimit) {
  const t = T();
  const card = el("div", "card");
  const head = el("div", "card-head");
  head.innerHTML = '<h2>' + t.matchesTitle + "</h2><span class=\"sub\">" + t.matchesSub + "</span>";
  card.appendChild(head);
  if (!state.sample) { card.appendChild(el("div", "empty", t.noSample)); return card; }
  card.appendChild(matchesTable(limit, preview ? freeLimit : limit));
  return card;
}

/* ---------------- breakdown view pieces ---------------- */
function breakdownCard(preview) {
  const t = T();
  const card = el("div", "card");
  const head = el("div", "card-head");
  const fitTxt = state.breakdown ? (t.fit + " " + state.breakdown.residual.toFixed(3)) : "";
  head.innerHTML = '<h2>' + t.breakdownTitle + "</h2><span class=\"sub\">" + (preview ? t.breakdownSub : fitTxt) + "</span>";
  card.appendChild(head);

  if (!state.breakdown || !state.breakdown.parts.length) {
    card.appendChild(el("div", "empty", t.noSample));
    return card;
  }

  const list = el("div", "bars");
  const seen = preview && state.plan !== "pro" ? 4 : state.breakdown.parts.length;
  state.breakdown.parts.slice(0, seen).forEach((p) => {
    const row = el("div", "bar-row");
    row.innerHTML = '<span class="bl">' + p.label + '</span>' +
      '<span class="bt"><i style="width:' + (p.value * 100).toFixed(1) + '%"></i></span>' +
      '<span class="bv">' + (p.value * 100).toFixed(1) + "%</span>";
    list.appendChild(row);
  });
  if (preview && state.plan !== "pro" && state.breakdown.parts.length > 4) {
    const rest = state.breakdown.parts.slice(4).reduce((a, b) => a + b.value, 0);
    const row = el("div", "bar-row");
    row.innerHTML = '<span class="bl">' + t.other + ' (' + (state.breakdown.parts.length - 4) + ')</span>' +
      '<span class="bt"><i style="width:' + (rest * 100).toFixed(1) + '%"></i></span>' +
      '<span class="bv">' + (rest * 100).toFixed(1) + "%</span>";
    row.style.opacity = ".55";
    list.appendChild(row);
  }
  card.appendChild(list);

  if (state.breakdown.fallback) {
    const warn = el("p", "note-line");
    warn.style.color = "var(--warn)";
    warn.textContent = state.lang === "zh"
      ? "这个成分模型只覆盖东亚人群。当前样本不在覆盖范围内，百分比是按到各成分的接近度近似出来的。"
      : "This component model only covers East Asian populations. The sample is outside its range, so the percentages are an approximation by proximity.";
    card.appendChild(warn);
  }

  if (!preview) {
    const meta = el("p", "note-line");
    meta.textContent = (state.breakdown.modelLabel || "") + " · " + t.residual + " " + state.breakdown.residual.toFixed(4);
    card.appendChild(meta);
  }
  return card;
}

function heatmapCard(preview) {
  const t = T();
  const card = el("div", "card");
  const head = el("div", "card-head");
  head.innerHTML = '<h2>' + t.heatmapTitle + "</h2><span class=\"sub\">" + t.heatmapSub + "</span>";
  card.appendChild(head);
  const ph = el("div", "todo");
  ph.innerHTML = t.comingSoon + "：" + (state.lang === "zh"
    ? "补一张国家中心点表 → Canvas 画世界地图 → 按距离着色 → 图例 0–20 / 导出 PNG → 之后做 3D 球"
    : "country centroids → canvas world map → colour by distance → legend 0–20 / export PNG → 3D globe");
  card.appendChild(ph);
  if (preview && state.plan !== "pro") card.appendChild(paywallLine(t.unlockHeatmap, t.unlockAll));
  return card;
}

/* ---------------- views ---------------- */
function viewDashboard() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.dashboard + "</h1><p>" + (state.sample ? state.sample.name : t.noSample) + "</p>";
  wrap.appendChild(head);

  if (!state.sample) {
    const c = el("div", "card");
    c.appendChild(el("div", "empty", t.noSample + " — " + t.upload));
    wrap.appendChild(c);
    return wrap;
  }

  // 1) 匹配
  wrap.appendChild(cardsRow(5, true, 5));
  if (state.plan !== "pro") wrap.appendChild(paywallLine(t.unlockMatches, t.unlockAll));

  // 2) 成分拆解
  wrap.appendChild(breakdownCard(true));
  if (state.plan !== "pro") wrap.appendChild(paywallLine(t.unlockBreakdown, t.unlockAll));

  // 3) 热力图
  wrap.appendChild(heatmapCard(true));

  return wrap;
}

function viewMatches() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.matches + "</h1><p>" + t.matchesSub + "</p>";
  wrap.appendChild(head);
  const c = cardsRow(state.plan === "pro" ? 50 : 12, state.plan !== "pro", 5);
  wrap.appendChild(c);
  if (state.plan !== "pro") wrap.appendChild(paywallLine(t.unlockMatches, t.unlockAll));
  return wrap;
}

function viewBreakdown() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.breakdownTitle + "</h1><p>" + t.breakdownSub + "</p>";
  wrap.appendChild(head);
  wrap.appendChild(breakdownCard(false));
  return wrap;
}

function viewHeatmap() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.heatmapTitle + "</h1>";
  wrap.appendChild(head);
  wrap.appendChild(heatmapCard(false));
  return wrap;
}

function viewUpload() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.upload + "</h1>";
  wrap.appendChild(head);

  /* --- 方案 A：自己的坐标 --- */
  const c1 = el("div", "card");
  const h1 = el("div", "card-head");
  h1.innerHTML = "<h2>" + t.srcOwn + "</h2><span class=\"sub\">" + t.srcOwnHint + "</span>";
  c1.appendChild(h1);
  const ta = el("textarea");
  ta.placeholder = "Sample: 0.09,-0.44,0.03,...（25 个数字）";
  c1.appendChild(ta);
  const bar = el("div", "row-actions");
  const bLoad = el("button", "btn primary", t.load);
  bLoad.onclick = () => {
    const parsed = parseG25(ta.value.trim());
    if (!parsed) { toast(t.notEnough); return; }
    loadSample(parsed);
  };
  const fileBtn = el("button", "btn", t.fileLoad);
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt,.csv,text/plain";
  fileInput.style.display = "none";
  fileInput.onchange = () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { ta.value = String(rd.result).trim(); };
    rd.readAsText(f);
  };
  fileBtn.onclick = () => fileInput.click();
  const bSave = el("button", "btn", t.save);
  bSave.onclick = () => {
    const parsed = ta.value.trim() ? parseG25(ta.value.trim()) : null;
    if (!parsed) { toast(t.notEnough); return; }
    state.saved.unshift({ name: parsed.name, v: parsed.v, ts: Date.now() });
    state.saved = state.saved.slice(0, 30);
    persist(); toast("saved"); render();
  };
  bar.append(bLoad, fileBtn, bSave, fileInput);
  c1.appendChild(bar);
  wrap.appendChild(c1);

  /* --- 方案 B：祖源估算 --- */
  const c2 = el("div", "card");
  const h2 = el("div", "card-head");
  h2.innerHTML = "<h2>" + t.srcEst + "</h2><span class=\"sub\">" + t.srcEstHint + "</span>";
  c2.appendChild(h2);

  const accRow = el("div", "field");
  accRow.innerHTML = "<label>" + t.accuracy + "</label>";
  const accSel = document.createElement("select");
  [[2, t.parents2], [4, t.gp4], [8, t.gg8]].forEach(([n, label]) => {
    const o = document.createElement("option");
    o.value = String(n); o.textContent = label;
    if (n === state.estSize) o.selected = true;
    accSel.appendChild(o);
  });
  accSel.onchange = () => { state.estSize = Number(accSel.value); state.estSlots = null; persist(); render(); };
  accRow.appendChild(accSel);
  c2.appendChild(accRow);

  if (!state.estSlots || state.estSlots.length !== state.estSize) {
    state.estSlots = new Array(state.estSize).fill(null);
  }

  const slots = el("div", "slots");
  state.estSlots.forEach((slot, i) => {
    const row = el("div", "slot-row");
    const label = el("span", "sl", slotLabel(i, state.estSize));
    const val = el("span", "sv", slot ? slot.name : t.empty2);
    if (!slot) val.classList.add("empty2");
    const bPick = el("button", "btn ghost small", t.pickPop);
    bPick.onclick = () => pickForSlot(i);
    row.append(label, val, bPick);
    slots.appendChild(row);
  });
  c2.appendChild(slots);

  const bar2 = el("div", "row-actions");
  const bEst = el("button", "btn primary", t.estimate);
  bEst.onclick = () => {
    const chosen = state.estSlots.filter(Boolean);
    if (!chosen.length) { toast(t.needSlot); return; }
    const v = new Array(25).fill(0);
    for (const s of chosen) for (let d = 0; d < 25; d++) v[d] += s.v[d] / chosen.length;
    loadSample({ name: t.estName + " (" + chosen.length + ")", v, src: "estimate" });
  };
  const bClear = el("button", "btn ghost", t.clearAll);
  bClear.onclick = () => { state.estSlots = new Array(state.estSize).fill(null); persist(); render(); };
  bar2.append(bEst, bClear);
  c2.appendChild(bar2);
  wrap.appendChild(c2);

  return wrap;
}

function slotLabel(i, size) {
  const zh = state.lang === "zh";
  if (size === 2) return zh ? (i === 0 ? "父系来源" : "母系来源") : (i === 0 ? "Father" : "Mother");
  if (size === 4) {
    const map = zh ? ["祖父", "祖母", "外祖父", "外祖母"] : ["Grandfather", "Grandmother", "Maternal grandfather", "Maternal grandmother"];
    return map[i];
  }
  const map = zh
    ? ["父·祖父", "父·祖母", "母·祖父", "母·祖母", "父·外祖父", "父·外祖母", "母·外祖父", "母·外祖母"]
    : ["GF father", "GM father", "GF mother", "GM mother", "MGF", "MGM", "MMGF", "MMGM"];
  return map[i];
}

function viewSaved() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.saved + "</h1>";
  wrap.appendChild(head);
  const card = el("div", "card");
  if (!state.saved.length) {
    card.appendChild(el("div", "empty", t.savedEmpty));
  } else {
    const table = el("table", "rows");
    table.innerHTML = '<thead><tr><th>' + t.sample + '</th><th class="num">dim</th><th></th></tr></thead>';
    const tb = el("tbody");
    state.saved.forEach((s, i) => {
      const tr = el("tr");
      tr.innerHTML = "<td>" + s.name + '</td><td class="num">' + s.v.length + "</td><td></td>";
      const td = tr.lastElementChild;
      const bUse = el("button", "btn ghost small", t.load);
      bUse.onclick = () => loadSample({ name: s.name, v: s.v, src: "saved" });
      const bDel = el("button", "btn ghost small", t.delete);
      bDel.onclick = () => { state.saved.splice(i, 1); persist(); render(); };
      td.append(bUse, bDel);
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    card.appendChild(table);
  }
  wrap.appendChild(card);
  return wrap;
}

/* ---------------- sample picker ---------------- */
function openPicker() {
  const t = T();
  const box = el("div");
  const tabs = el("div", "tabs");
  const pLib = el("div"), pComp = el("div"), pPaste = el("div");
  const panels = { lib: pLib, comp: pComp, paste: pPaste };
  pComp.hidden = true; pPaste.hidden = true;
  const mk = (id, label) => {
    const b = el("button", "tab", label);
    b.onclick = () => {
      Object.keys(panels).forEach((k) => { panels[k].hidden = k !== id; });
      Array.from(tabs.children).forEach((c) => c.classList.toggle("active", c === b));
    };
    tabs.appendChild(b);
    return b;
  };
  mk("lib", t.tabLibrary).classList.add("active");
  mk("comp", t.tabComposition);
  mk("paste", t.tabPaste);

  /* 内置 */
  const search = el("input");
  search.type = "search";
  search.placeholder = t.search;
  pLib.appendChild(search);
  const list = el("div");
  list.style.marginTop = "10px";
  pLib.appendChild(list);
  const drawLib = () => {
    const q = search.value.trim().toLowerCase();
    const pool = state.lib.filter((p) => !q || p.name.toLowerCase().includes(q)).slice(0, 200);
    list.innerHTML = "";
    if (!pool.length) { list.appendChild(el("div", "empty", "—")); return; }
    for (const p of pool) {
      const b = el("button", "pick-item");
      b.innerHTML = '<span class="nm">' + p.name + '</span><span class="src">' + p.src + "</span>";
      b.onclick = () => { loadSample({ name: p.name, v: p.v.slice(), src: p.src }); };
      list.appendChild(b);
    }
  };
  search.oninput = drawLib;
  drawLib();

  /* 成分换算 */
  const models = state.models || {};
  const selWrap = el("div", "field");
  selWrap.innerHTML = "<label>" + t.model + "</label>";
  const sel = document.createElement("select");
  Object.keys(models).forEach((k) => {
    const o = document.createElement("option");
    o.value = k; o.textContent = models[k].label;
    sel.appendChild(o);
  });
  selWrap.appendChild(sel);
  const nameField = el("div", "field");
  nameField.innerHTML = "<label>" + t.sampleName + "</label>";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = t.sampleNamePh;
  nameField.appendChild(nameInput);

  const grid = el("div", "comp-grid");
  const go = el("button", "btn primary", t.generate);
  const msg = el("div", "comp-msg");
  const drawComp = () => {
    const m = models[sel.value];
    if (!m) return;
    grid.innerHTML = "";
    m.items.forEach(([label], i) => {
      const cell = el("div", "comp-cell");
      cell.innerHTML = '<span class="cl">' + label + "</span>";
      const inp = document.createElement("input");
      inp.type = "number"; inp.min = "0"; inp.step = "0.01"; inp.placeholder = "0";
      inp.setAttribute("data-ci", String(i));
      cell.appendChild(inp);
      grid.appendChild(cell);
    });
  };
  sel.onchange = drawComp;
  drawComp();
  go.onclick = () => {
    const m = models[sel.value];
    const inputs = Array.from(grid.querySelectorAll("input[data-ci]"));
    let sum = 0;
    const ws = inputs.map((inp) => { const v = Number(inp.value); const w = Number.isFinite(v) && v > 0 ? v : 0; sum += w; return w; });
    if (sum <= 0) { msg.textContent = t.needPercent; msg.className = "comp-msg warn"; return; }
    const v = new Array(25).fill(0);
    ws.forEach((w, i) => {
      if (!w) return;
      const coords = m.items[i][1];
      for (let d = 0; d < 25; d++) v[d] += (w / sum) * coords[d];
    });
    const nm = (nameInput.value || "").trim() ||
      (sel.value === "mofang" ? t.estNameMofang : t.estNameWegene) + " " + Math.round(sum) + "%";
    loadSample({ name: nm, v, src: "composition" });
  };
  pComp.append(selWrap, nameField, grid, go, msg);

  /* 粘贴 */
  const ta = el("textarea");
  ta.placeholder = "Sample: 0.09,-0.44,0.03,...（25 个数字）";
  const bar = el("div", "row-actions");
  const bLoad = el("button", "btn primary", t.load);
  bLoad.onclick = () => {
    const parsed = parseG25(ta.value.trim());
    if (!parsed) { toast(t.notEnough); return; }
    loadSample(parsed);
  };
  bar.appendChild(bLoad);
  pPaste.append(ta, bar);

  box.append(tabs, pLib, pComp, pPaste);
  openModal(t.pickSample, box);
  setTimeout(() => search.focus(), 40);
}

/* 给祖源估算的某一栏选人群 */
function pickForSlot(index) {
  const t = T();
  const box = el("div");
  const search = el("input");
  search.type = "search";
  search.placeholder = t.search;
  box.appendChild(search);
  const list = el("div");
  list.style.marginTop = "10px";
  box.appendChild(list);
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    const pool = state.lib.filter((p) => !q || p.name.toLowerCase().includes(q)).slice(0, 200);
    list.innerHTML = "";
    for (const p of pool) {
      const b = el("button", "pick-item");
      b.innerHTML = '<span class="nm">' + p.name + '</span><span class="src">' + p.src + "</span>";
      b.onclick = () => {
        state.estSlots[index] = { name: p.name, v: p.v.slice() };
        persist(); closeModal(); render();
      };
      list.appendChild(b);
    }
  };
  search.oninput = draw;
  draw();
  openModal(slotLabel(index, state.estSize) + " · " + t.pickPop, box);
  setTimeout(() => search.focus(), 40);
}

function randomSample() {
  if (!state.lib.length) return;
  const p = state.lib[Math.floor(Math.random() * state.lib.length)];
  loadSample({ name: p.name, v: p.v.slice(), src: p.src });
}

function loadSample(s) {
  state.sample = s;
  rank();
  state.breakdown = breakdown(s);
  persist();
  closeModal();
  state.view = "dashboard";
  render();
  toast(T().sampleLoaded + ": " + s.name);
}

function parseG25(line) {
  if (!line) return null;
  const m = line.split(":");
  let name = "sample";
  let body = line;
  if (m.length >= 2) { name = m[0].trim(); body = m.slice(1).join(":"); }
  const nums = body.split(/[,\s]+/).map(Number).filter((x) => Number.isFinite(x));
  if (nums.length < 25) return null;
  return { name: name || "sample", v: nums.slice(0, 25), src: "manual" };
}

/* ---------------- render ---------------- */
function render() {
  renderTopbar();
  renderSidebar();
  const v = $("#view");
  v.innerHTML = "";
  let node;
  switch (state.view) {
    case "matches": node = viewMatches(); break;
    case "breakdown": node = viewBreakdown(); break;
    case "heatmap": node = viewHeatmap(); break;
    case "upload": node = viewUpload(); break;
    case "saved": node = viewSaved(); break;
    default: node = viewDashboard();
  }
  v.appendChild(node);
}

/* ---------------- events ---------------- */
function bind() {
  $("#sampleChip").onclick = openPicker;
  $("#modalClose").onclick = closeModal;
  $("#modalMask").addEventListener("click", (e) => { if (e.target.id === "modalMask") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  $("#langBtn").onclick = () => { state.lang = state.lang === "zh" ? "en" : "zh"; persist(); render(); };
  $("#themeBtn").onclick = () => { state.theme = state.theme === "dark" ? "light" : "dark"; persist(); render(); };
  $("#upgradeBtn").onclick = () => {
    state.plan = state.plan === "pro" ? "free" : "pro";
    persist(); render();
    toast(state.plan === "pro" ? "PRO" : "FREE");
  };
}

/* ---------------- boot ---------------- */
(async function boot() {
  bind();
  render();
  try {
    await Promise.all([loadLibrary(), loadModels()]);
    if (state.sample) { rank(); state.breakdown = breakdown(state.sample); }
    render();
  } catch (e) {
    $("#view").innerHTML = '<div class="card"><div class="empty">数据加载失败：' + e.message + "</div></div>";
  }
})();
