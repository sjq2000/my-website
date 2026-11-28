/* WG Lab — 本地 G25 分析工作台（v1：样本 / 匹配 / 付费墙） */
"use strict";

const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

const I18N = {
  zh: {
    dashboard: "总览", matches: "匹配", breakdown: "成分拆解", heatmap: "热力图",
    upload: "上传 / 坐标", saved: "已保存样本", sample: "样本",
    noSample: "未载入样本", loadSample: "载入样本", random: "随机样本",
    upgrade: "升级", planFree: "FREE", planPro: "PRO",
    matchesTitle: "最接近的人群", matchesSub: "按 G25 欧氏距离排序，越小越接近",
    closest: "最接近", distance: "距离", tier: "接近度", rank: "排名",
    unlockAll: "解锁完整排名", unlockText: "免费版只展示前 5 个匹配。完整排名、成分拆解和热力图需要解锁。",
    breakdownTitle: "祖源成分拆解", heatmapTitle: "遗传热力图",
    comingSoon: "施工中", comingSoonText: "这一个模块还没接上，按下面的计划来做：",
    totalPop: "库内人群", sampleDim: "坐标维度", bestMatch: "最佳匹配",
    search: "搜索人群名…", pickSample: "选择样本", close: "关闭",
    pasteTitle: "粘贴 G25 坐标", pasteHint: "一行：名称 + 25 个数字（逗号或空格分隔）",
    load: "载入", clear: "清空", save: "保存",
    savedEmpty: "还没有保存的样本", delete: "删除",
    sampleLoaded: "已载入", notEnough: "至少要 25 个数字",
    langBtn: "EN", themeBtn: "☀",
    freeHint: "免费版", proHint: "已解锁",
    tabLibrary: "内置人群", tabComposition: "成分换算", tabPaste: "粘贴坐标",
    model: "成分模型", sampleName: "样本名称", sampleNamePh: "留空则自动命名",
    generate: "生成坐标", needPercent: "至少填一项百分比",
    estNameMofang: "23魔方估算", estNameWegene: "微基因估算",
  },
  en: {
    dashboard: "Dashboard", matches: "Matches", breakdown: "Breakdown", heatmap: "Heatmap",
    upload: "Upload / Coordinates", saved: "Saved coordinates", sample: "Sample",
    noSample: "No sample loaded", loadSample: "Load sample", random: "Random sample",
    upgrade: "Upgrade", planFree: "FREE", planPro: "PRO",
    matchesTitle: "Closest matches", matchesSub: "Ranked by G25 Euclidean distance — lower is closer",
    closest: "Closest", distance: "Distance", tier: "Proximity", rank: "#",
    unlockAll: "Unlock full ranking", unlockText: "Free plan shows the top 5 matches. Full ranking, breakdown and heatmap need an unlock.",
    breakdownTitle: "Ancestral breakdown", heatmapTitle: "Genetic heatmap",
    comingSoon: "Work in progress", comingSoonText: "This module is not wired yet. Plan:",
    totalPop: "Populations", sampleDim: "Dimensions", bestMatch: "Best match",
    search: "Search population…", pickSample: "Pick a sample", close: "Close",
    pasteTitle: "Paste G25 coordinates", pasteHint: "One line: name + 25 numbers (comma or space separated)",
    load: "Load", clear: "Clear", save: "Save",
    savedEmpty: "No saved samples yet", delete: "Delete",
    sampleLoaded: "Loaded", notEnough: "need at least 25 numbers",
    langBtn: "中文", themeBtn: "☾",
    freeHint: "Free", proHint: "Unlocked",
    tabLibrary: "Library", tabComposition: "From composition", tabPaste: "Paste row",
    model: "Component model", sampleName: "Sample name", sampleNamePh: "Leave blank to auto-name",
    generate: "Generate", needPercent: "Fill at least one percentage",
    estNameMofang: "23Mofang estimate", estNameWegene: "WeGene estimate",
  }
};

const T = () => I18N[state.lang];

const state = {
  lang: LS.get("wg-lang", "zh"),
  theme: LS.get("wg-theme", "dark"),
  plan: LS.get("wg-plan", "free"),
  view: LS.get("wg-view", "dashboard"),
  sample: LS.get("wg-sample", null),
  saved: LS.get("wg-saved", []),
  lib: [],
  sources: [],
  models: null,
  results: []
};

const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

/* ---------------- data ---------------- */
async function loadModels() {
  state.models = await fetchJson(['assets/data/component-models.json', '../assets/data/component-models.json']);
}

async function fetchJson(paths) {
  for (const p of paths) {
    try {
      const r = await fetch(p);
      if (r.ok) return await r.json();
    } catch (e) { /* 试下一个 */ }
  }
  throw new Error('data not found: ' + paths.join(' / '));
}

async function loadLibrary() {
  const data = await fetchJson(['assets/data/g25-library.json', '../assets/data/g25-library.json']);
  state.sources = data.sources || [];
  const flat = [];
  const seen = new Set();
  for (const s of state.sources) {
    for (const row of s.rows) {
      const name = row[0];
      const v = row.slice(1, 26).map(Number);
      if (v.length !== 25 || !v.every((x) => Number.isFinite(x))) continue;
      const key = name;   // 同名只保留第一条（跨来源也去重）
      if (seen.has(key)) continue;
      seen.add(key);
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

/* ---------------- persistence ---------------- */
function persist() {
  LS.set("wg-lang", state.lang);
  LS.set("wg-theme", state.theme);
  LS.set("wg-plan", state.plan);
  LS.set("wg-view", state.view);
  LS.set("wg-sample", state.sample);
  LS.set("wg-saved", state.saved);
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

/* ---------------- top bar ---------------- */
function renderTopbar() {
  const t = T();
  const nm = state.sample ? state.sample.name : t.noSample;
  $("#sampleName").textContent = nm;
  $("#planBadge").textContent = state.plan === "pro" ? t.planPro : t.planFree;
  $("#langBtn").textContent = state.lang === "zh" ? "EN" : "中文";
  $("#themeBtn").textContent = state.theme === "dark" ? "☀" : "☾";
  $("#upgradeBtn").textContent = state.plan === "pro" ? t.proHint : t.upgrade;
  document.documentElement.setAttribute("data-theme", state.theme);
  document.documentElement.lang = state.lang === "zh" ? "zh" : "en";
}

/* ---------------- sidebar ---------------- */
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
  const cap1 = el("div", "nav-cap", t.sample);
  cap1.style.marginTop = "6px";
  nav.appendChild(cap1);
  for (const [id, ico, label] of items) {
    const b = el("button", "nav-item" + (state.view === id ? " active" : ""));
    b.innerHTML = '<span class="ico">' + ico + "</span><span>" + label + "</span>";
    b.onclick = () => { state.view = id; persist(); render(); };
    nav.appendChild(b);
  }
  nav.appendChild(el("div", "nav-sep"));
  const b1 = el("button", "nav-item" + (state.view === "upload" ? " active" : ""));
  b1.innerHTML = '<span class="ico">↑</span><span>' + t.upload + "</span>";
  b1.onclick = () => { state.view = "upload"; persist(); render(); };
  nav.appendChild(b1);
  const b2 = el("button", "nav-item" + (state.view === "saved" ? " active" : ""));
  b2.innerHTML = '<span class="ico">★</span><span>' + t.saved + "</span>";
  b2.onclick = () => { state.view = "saved"; persist(); render(); };
  nav.appendChild(b2);
}

/* ---------------- views ---------------- */
function viewDashboard() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.dashboard + "</h1><p>" + (state.sample ? state.sample.name : t.noSample) + "</p>";
  wrap.appendChild(head);

  const kg = el("div", "grid three");
  const best = state.results[0];
  kg.innerHTML =
    '<div class="kpi"><div class="label">' + t.totalPop + "</div><div class=\"value\">" +
    state.lib.length.toLocaleString() + '</div><div class="hint">modern + ancient</div></div>' +
    '<div class="kpi"><div class="label">' + t.sampleDim + "</div><div class=\"value\">25</div><div class=\"hint\">G25</div></div>" +
    '<div class="kpi"><div class="label">' + t.bestMatch + "</div><div class=\"value\">" +
    (best ? best.d.toFixed(3) : "—") + '</div><div class="hint">' + (best ? best.name : "—") + "</div></div>";
  wrap.appendChild(kg);

  wrap.appendChild(matchesCard(12, true));

  const ph = el("div", "card");
  ph.innerHTML = '<div class="card-head"><h2>' + t.breakdownTitle + '</h2><span class="sub">' + t.comingSoon + "</span></div>" +
    '<div class="todo">' + t.comingSoonText +
    "<ul><li>把 11k 人群聚成 ~20 个祖源组件（PCA / k-means）</li><li>用 NNLS 解出每个组件的权重，输出 fit 分数</li><li>加 West Eurasian / Neolithic 等模型切换</li></ul></div>";
  wrap.appendChild(ph);
  return wrap;
}

function matchesCard(limit, preview) {
  const t = T();
  const card = el("div", "card");
  const head = el("div", "card-head");
  head.innerHTML = '<h2>' + t.matchesTitle + "</h2><span class=\"sub\">" + t.matchesSub + "</span>";
  card.appendChild(head);

  if (!state.sample) {
    card.appendChild(el("div", "empty", t.noSample + " — " + t.loadSample));
    return card;
  }

  const freeLimit = 5;
  const rows = state.results.slice(0, limit);

  const table = el("table", "rows");
  table.innerHTML = "<thead><tr><th class=\"rank\">" + t.rank + "</th><th>" + t.sample +
    "</th><th class=\"num\">" + t.distance + "</th><th>" + t.tier + "</th></tr></thead>";
  const tb = el("tbody");
  rows.forEach((r, i) => {
    const locked = preview && state.plan !== "pro" && i >= freeLimit;
    const tr = el("tr", locked ? "locked-row" : "");
    const tier = tierOf(r.d);
    tr.innerHTML = '<td class="rank">' + (i + 1) + "</td><td>" + r.name +
      '</td><td class="num">' + r.d.toFixed(3) + '</td><td><span class="tier ' + tier.cls + '">' +
      (state.lang === "zh" ? tier.zh : tier.en) + "</span></td>";
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  card.appendChild(table);

  if (preview && state.plan !== "pro") {
    const pw = el("div", "paywall");
    pw.innerHTML = "<p><b>" + t.unlockAll + "</b><br>" + t.unlockText + "</p>";
    const b = el("button", "btn primary", t.unlockAll);
    b.onclick = () => { toast("Stripe 结账待接入"); };
    pw.appendChild(b);
    card.appendChild(pw);
  }
  return card;
}

function viewMatches() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.matches + "</h1><p>" + t.matchesSub + "</p>";
  wrap.appendChild(head);
  wrap.appendChild(matchesCard(state.plan === "pro" ? 50 : 15, state.plan !== "pro"));
  return wrap;
}

function viewBreakdown() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.breakdownTitle + "</h1>";
  wrap.appendChild(head);
  const c = el("div", "card");
  c.innerHTML = '<div class="todo">' + t.comingSoonText +
    "<ul><li>组件库：从 11k 人群里选出 20 个代表人群作为基</li><li>NNLS 求解权重 → 百分比</li><li>模型切换（West Eurasian / East Eurasian / Neolithic / Paleolithic）</li><li>Fit 分数 + 完整组件表</li></ul></div>";
  wrap.appendChild(c);
  return wrap;
}

function viewHeatmap() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.heatmapTitle + "</h1>";
  wrap.appendChild(head);
  const c = el("div", "card");
  c.innerHTML = '<div class="todo">' + t.comingSoonText +
    "<ul><li>人群 → 国家 → 经纬度（需要一张国家中心点表）</li><li>Canvas 画等距圆柱投影世界地图 + 按距离着色</li><li>图例 0–20、Fit matches、导出 PNG</li><li>之后再做 3D 球体旋转</li></ul></div>";
  wrap.appendChild(c);
  return wrap;
}

function viewUpload() {
  const t = T();
  const wrap = el("div");
  const head = el("div", "page-head");
  head.innerHTML = "<h1>" + t.upload + "</h1>";
  wrap.appendChild(head);

  const card = el("div", "card");
  card.innerHTML = '<div class="card-head"><h2>' + t.pasteTitle + '</h2><span class="sub">' + t.pasteHint + "</span></div>";
  const ta = el("textarea");
  ta.id = "coordInput";
  ta.placeholder = "Peruvian_Indo-Mestizo: 0.09,-0.44,0.03,...（共 25 个）";
  card.appendChild(ta);

  const bar = el("div");
  bar.style.marginTop = "10px";
  bar.style.display = "flex";
  bar.style.gap = "10px";
  const bLoad = el("button", "btn primary", t.load);
  bLoad.onclick = () => {
    const line = ta.value.trim();
    if (!line) return;
    const parsed = parseG25(line);
    if (!parsed) { toast(t.notEnough); return; }
    setSample(parsed);
    state.view = "dashboard"; persist(); render();
  };
  const bSave = el("button", "btn", t.save);
  bSave.onclick = () => {
    const line = ta.value.trim();
    const parsed = line ? parseG25(line) : (state.sample ? { name: state.sample.name, v: state.sample.v } : null);
    if (!parsed) { toast(t.notEnough); return; }
    state.saved.unshift({ name: parsed.name, v: parsed.v, ts: Date.now() });
    state.saved = state.saved.slice(0, 30);
    persist(); toast("saved"); render();
  };
  const bClear = el("button", "btn ghost", t.clear);
  bClear.onclick = () => { ta.value = ""; };
  bar.append(bLoad, bSave, bClear);
  card.appendChild(bar);
  wrap.appendChild(card);

  const pick = el("div", "card");
  const ph = el("div", "card-head");
  ph.innerHTML = "<h2>" + t.loadSample + "</h2>";
  pick.appendChild(ph);
  const bPick = el("button", "btn", t.loadSample);
  bPick.onclick = openPicker;
  const bRand = el("button", "btn", t.random);
  bRand.onclick = randomSample;
  const row = el("div");
  row.style.display = "flex";
  row.style.gap = "10px";
  row.append(bPick, bRand);
  pick.appendChild(row);
  wrap.appendChild(pick);
  return wrap;
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
      const bUse = el("button", "btn ghost", t.load);
      bUse.style.marginRight = "6px";
      bUse.onclick = () => { setSample({ name: s.name, v: s.v, src: "saved" }); state.view = "dashboard"; persist(); render(); };
      const bDel = el("button", "btn ghost", t.delete);
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
  const panels = {};
  const mk = (id, label) => {
    const b = el("button", "tab", label);
    b.onclick = () => {
      Object.keys(panels).forEach((k) => { panels[k].hidden = k !== id; });
      Array.from(tabs.children).forEach((c) => c.classList.toggle("active", c === b));
    };
    tabs.appendChild(b);
    return b;
  };

  const pLib = el("div");
  const pComp = el("div");
  const pPaste = el("div");
  panels.lib = pLib; panels.comp = pComp; panels.paste = pPaste;
  pComp.hidden = true; pPaste.hidden = true;

  const bLib = mk("lib", t.tabLibrary);
  mk("comp", t.tabComposition);
  mk("paste", t.tabPaste);
  bLib.classList.add("active");

  /* --- 内置人群 --- */
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
      b.onclick = () => { setSample({ name: p.name, v: p.v.slice(), src: p.src }); closeModal(); state.view = "dashboard"; persist(); render(); };
      list.appendChild(b);
    }
  };
  search.oninput = drawLib;
  drawLib();

  /* --- 成分换算（复用基因实验室的模型） --- */
  const models = state.models;
  const modelKeys = Object.keys(models);
  const selWrap = el("div", "field");
  const selLabel = el("label", "", t.model);
  const sel = el("select");
  modelKeys.forEach((k) => {
    const o = document.createElement("option");
    o.value = k; o.textContent = models[k].label;
    sel.appendChild(o);
  });
  selWrap.append(selLabel, sel);

  const grid = el("div", "comp-grid");
  const nameField = el("div", "field");
  nameField.innerHTML = "<label>" + t.sampleName + "</label>";
  const nameInput = el("input");
  nameInput.type = "text";
  nameInput.placeholder = t.sampleNamePh;
  nameField.appendChild(nameInput);

  const go = el("button", "btn primary", t.generate);
  const msg = el("div", "comp-msg");

  const drawComp = () => {
    const m = models[sel.value];
    grid.innerHTML = "";
    m.items.forEach(([label], i) => {
      const cell = el("div", "comp-cell");
      cell.innerHTML = '<span class="cl">' + label + "</span>";
      const inp = el("input");
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
    const ws = inputs.map((inp) => {
      const v = Number(inp.value);
      const w = Number.isFinite(v) && v > 0 ? v : 0;
      sum += w;
      return w;
    });
    if (sum <= 0) { msg.textContent = t.needPercent; msg.className = "comp-msg warn"; return; }
    const v = new Array(25).fill(0);
    ws.forEach((w, i) => {
      if (!w) return;
      const coords = m.items[i][1];
      for (let d = 0; d < 25; d++) v[d] += (w / sum) * coords[d];
    });
    const nm = (nameInput.value || "").trim() ||
      (sel.value === "mofang" ? t.estNameMofang : t.estNameWegene) + " " + Math.round(sum) + "%";
    setSample({ name: nm, v, src: "composition" });
    closeModal(); state.view = "dashboard"; persist(); render();
  };

  pComp.append(selWrap, nameField, grid, go, msg);

  /* --- 粘贴坐标 --- */
  const ta = el("textarea");
  ta.placeholder = "Sample: 0.09,-0.44,0.03,...（共 25 个数字）";
  const pasteBar = el("div", "row-actions");
  const bLoad = el("button", "btn primary", t.load);
  bLoad.onclick = () => {
    const parsed = parseG25(ta.value.trim());
    if (!parsed) { toast(t.notEnough); return; }
    setSample(parsed);
    closeModal(); state.view = "dashboard"; persist(); render();
  };
  pasteBar.appendChild(bLoad);
  pPaste.append(ta, pasteBar);

  box.append(tabs, pLib, pComp, pPaste);
  openModal(t.pickSample, box);
  setTimeout(() => search.focus(), 40);
}

function randomSample() {
  if (!state.lib.length) return;
  const p = state.lib[Math.floor(Math.random() * state.lib.length)];
  setSample({ name: p.name, v: p.v.slice(), src: p.src });
  persist(); render();
}

function setSample(s) {
  state.sample = s;
  rank();
  persist();
  toast(T().sampleLoaded + ": " + s.name);
}

function parseG25(line) {
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
    toast(state.plan === "pro" ? "PRO（本地模拟）" : "FREE");
  };
}

/* ---------------- boot ---------------- */
(async function boot() {
  bind();
  render();
  try {
    await Promise.all([loadLibrary(), loadModels()]);
    if (state.sample) rank();
    render();
  } catch (e) {
    $("#view").innerHTML = '<div class="card"><div class="empty">数据加载失败：' + e.message + "</div></div>";
  }
})();
