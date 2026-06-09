
// const CONFIG = {
//   listTitle: "OGC Innovation Business Case",
//   storageKey: "ogcInnovationBusinessCases.v1",

//   // Hardcoded — do NOT use window.location
//   sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

//   fieldMap: {
//     id:                     "Id",
//     ideaName:               "Title",
//     owner:                  "field_1",
//     department:             "field_2",
//     status:                 "field_3",
//     problemStatement:       "field_4",
//     scaleBusinessImpact:    "field_5",
//     currentWorkarounds:     "field_6",
//     proposedSolution:       "field_7",
//     mvpScope:               "field_8",
//     enabler:                "field_9",
//     unfairAdvantage:        "field_10",
//     valueProposition:       "field_11",
//     costSavings:            "field_12",
//     efficiencyGain:         "field_13",
//     paybackMonths:          "field_14",
//     activeUsers:            "field_15",
//     adoptionRate:           "field_16",
//     revenueImpact:          "field_17",
//     cycleTimeReduction:     "field_18",
//     productivityUplift:     "field_19",
//     scheduleImpact:         "field_20",
//     goToMarketChannels:     "field_21",
//     changeManagement:       "field_22",
//     rolloutPlan:            "field_23",
//     toolsPlatformCharges:   "field_24",
//     licenseCost:            "field_25",
//     developmentCost:        "field_26",
//     supportMaintenanceCost: "field_27",
//     recurringCostAvoidance: "field_28",
//     marginImprovement:      "field_29",
//     scalabilityNotes:       "field_30",
//     created:                "Created",
//     modified:               "Modified"
//   },

//   numberFields: new Set([
//     "costSavings", "efficiencyGain", "paybackMonths", "activeUsers",
//     "adoptionRate", "revenueImpact", "cycleTimeReduction", "productivityUplift",
//     "toolsPlatformCharges", "licenseCost", "developmentCost",
//     "supportMaintenanceCost", "recurringCostAvoidance", "marginImprovement"
//   ])
// };


// // ── State ─────────────────────────────────────────────────────────────────────
// const state = {
//   records:    [],
//   mode:       "connecting",
//   siteUrl:    CONFIG.sharePointSiteUrl,
//   search:     "",
//   statusFilter: "All",
//   busy:       false,
//   toastTimer: 0
// };

// const els = {};

// document.addEventListener("DOMContentLoaded", init);

// // ── Init ──────────────────────────────────────────────────────────────────────
// async function init() {
//   cacheElements();
//   bindEvents();
//   await loadRecords();
//   render();
// }

// function cacheElements() {
//   [
//     "connectionBadge","refreshButton","exportButton","newCaseButton",
//     "caseRows","searchInput","statusFilter","summaryTotal","summarySavings",
//     "summaryEfficiency","summaryPayback","drawerBackdrop","closeDrawerButton",
//     "cancelButton","caseForm","drawerTitle","saveButton","toast"
//   ].forEach(id => els[id] = document.getElementById(id));
//   els.drawer = document.getElementById("caseDrawer");
// }

// function bindEvents() {
//   els.newCaseButton.addEventListener("click",     ()  => openDrawer());
//   els.closeDrawerButton.addEventListener("click", closeDrawer);
//   els.cancelButton.addEventListener("click",      closeDrawer);
//   els.drawerBackdrop.addEventListener("click",    closeDrawer);
//   els.exportButton.addEventListener("click",      exportCsv);
//   els.caseForm.addEventListener("submit",         saveCurrentCase);

//   els.searchInput.addEventListener("input", e => {
//     state.search = e.target.value.trim().toLowerCase();
//     renderTable();
//   });
//   els.statusFilter.addEventListener("change", e => {
//     state.statusFilter = e.target.value;
//     renderTable();
//   });
//   els.refreshButton.addEventListener("click", async () => {
//     await loadRecords(true);
//     render();
//   });
//   document.addEventListener("keydown", e => {
//     if (e.key === "Escape" && els.drawer.classList.contains("open")) closeDrawer();
//   });
// }

// // ── Data ──────────────────────────────────────────────────────────────────────
// async function loadRecords(manual = false) {
//   setBusy(true);
//   try {
//     state.records = await sharePointStore.fetchItems();
//     state.mode    = "sharepoint";
//     if (manual) showToast("✓ SharePoint list refreshed.");
//   } catch (err) {
//     console.error("SharePoint fetch failed:", err);
//     state.records = localStore.fetchItems();
//     state.mode    = "local-warning";
//     showToast("⚠ Could not reach SharePoint. Showing local data.");
//   } finally {
//     setBusy(false);
//   }
// }

// // ── Render ────────────────────────────────────────────────────────────────────
// function render() {
//   renderBadge();
//   renderSummaries();
//   renderTable();
// }

// function renderBadge() {
//   const b = els.connectionBadge;
//   if (state.mode === "sharepoint") {
//     b.textContent = "SharePoint List connected";
//     b.classList.remove("warning");
//   } else {
//     b.textContent = state.mode === "local-warning"
//       ? "⚠ List unavailable – local mode"
//       : "Local test mode";
//     b.classList.add("warning");
//   }
// }

// function renderSummaries() {
//   const f = filtered();
//   els.summaryTotal.textContent      = f.length;
//   els.summarySavings.textContent    = fmt$(sum(f, "costSavings"));
//   els.summaryEfficiency.textContent = `${fmtN(avg(nums(f,"efficiencyGain")),1)}%`;
//   els.summaryPayback.textContent    = `${fmtN(avg(nums(f,"paybackMonths")),0)} mo`;
// }

// function renderTable() {
//   renderSummaries();
//   const rows = filtered();

//   if (!rows.length) {
//     els.caseRows.innerHTML =
//       `<tr class="empty-row"><td colspan="11">No business cases match the current view.</td></tr>`;
//     return;
//   }

//   els.caseRows.innerHTML = rows.map(r => `
//     <tr>
//       <td class="idea-cell">${esc(r.ideaName || "Untitled case")}</td>
//       <td><span class="status-pill" data-status="${esc(r.status||"Intake")}">${esc(r.status||"Intake")}</span></td>
//       <td>${esc(r.owner||"")}</td>
//       <td class="text-cell">${esc(r.valueProposition||"")}</td>
//       <td class="number-cell">${fmt$(r.costSavings)}</td>
//       <td class="number-cell">${fmtPct(r.efficiencyGain)}</td>
//       <td class="number-cell">${fmtMo(r.paybackMonths)}</td>
//       <td class="number-cell">${fmtPct(r.adoptionRate)}</td>
//       <td class="number-cell">${fmt$(r.revenueImpact)}</td>
//       <td class="number-cell">${fmtDate(r.modified||r.created)}</td>
//       <td class="action-col">
//         <button class="icon-button row-action" type="button"
//           title="Edit" aria-label="Edit ${escAttr(r.ideaName||"case")}"
//           data-edit-id="${escAttr(r.id)}">
//           <svg><use href="#icon-edit"></use></svg>
//         </button>
//       </td>
//     </tr>`).join("");

//   els.caseRows.querySelectorAll("[data-edit-id]").forEach(btn =>
//     btn.addEventListener("click", () => {
//       const rec = state.records.find(x => String(x.id) === String(btn.dataset.editId));
//       if (rec) openDrawer(rec);
//     })
//   );
// }

// function filtered() {
//   const q = state.search;
//   return [...state.records]
//     .filter(r => state.statusFilter === "All" || r.status === state.statusFilter)
//     .filter(r => !q || [r.ideaName,r.owner,r.department,r.status,
//                          r.problemStatement,r.valueProposition,r.proposedSolution]
//       .some(v => String(v||"").toLowerCase().includes(q)))
//     .sort((a,b) => new Date(b.modified||b.created||0) - new Date(a.modified||a.created||0));
// }

// // ── Drawer ────────────────────────────────────────────────────────────────────
// function openDrawer(record = null) {
//   els.caseForm.reset();
//   els.drawerTitle.textContent = record ? "Edit innovation case" : "New innovation case";

//   if (record) {
//     Object.keys(CONFIG.fieldMap).forEach(key => {
//       const ctrl = els.caseForm.elements[key];
//       if (ctrl && record[key] != null) ctrl.value = record[key];
//     });
//     els.caseForm.elements.id.value = record.id;
//   } else {
//     if (els.caseForm.elements.status) els.caseForm.elements.status.value = "Intake";
//     els.caseForm.elements.id.value = "";
//   }

//   els.drawerBackdrop.hidden = false;
//   els.drawer.classList.add("open");
//   els.drawer.setAttribute("aria-hidden", "false");
//   setTimeout(() => els.caseForm.elements.ideaName?.focus(), 30);
// }

// function closeDrawer() {
//   els.drawer.classList.remove("open");
//   els.drawer.setAttribute("aria-hidden", "true");
//   els.drawerBackdrop.hidden = true;
// }

// // ── Save ──────────────────────────────────────────────────────────────────────
// async function saveCurrentCase(e) {
//   e.preventDefault();
//   const record = formToRecord(new FormData(els.caseForm));

//   if (!record.ideaName) {
//     showToast("Business case idea is required.");
//     els.caseForm.elements.ideaName.focus();
//     return;
//   }

//   setBusy(true);
//   try {
//     let saved;
//     if (state.mode === "sharepoint") {
//       saved = record.id
//         ? await sharePointStore.updateItem(record)
//         : await sharePointStore.createItem(record);
//       showToast("✓ Saved to SharePoint.");
//     } else {
//       saved = record.id
//         ? localStore.updateItem(record)
//         : localStore.createItem(record);
//       showToast("Saved locally (SharePoint unavailable).");
//     }
//     upsert(saved);
//     closeDrawer();
//     els.caseForm.reset();
//     render();
//   } catch (err) {
//     console.error("Save failed:", err);
//     showToast(`Save failed: ${err.message}`);
//   } finally {
//     setBusy(false);
//   }
// }

// function formToRecord(fd) {
//   const rec = {};
//   Object.keys(CONFIG.fieldMap).forEach(key => {
//     if (["created","modified"].includes(key)) return;
//     const val = fd.get(key);
//     rec[key] = CONFIG.numberFields.has(key)
//       ? (val === "" || val === null ? null : Number(val))
//       : (val === null ? "" : String(val).trim());
//   });
//   rec.id     = fd.get("id") || "";
//   rec.status = rec.status || "Intake";
//   return rec;
// }

// function upsert(record) {
//   const i = state.records.findIndex(x => String(x.id) === String(record.id));
//   i >= 0 ? state.records.splice(i, 1, record) : state.records.unshift(record);
// }

// // ── CSV export ────────────────────────────────────────────────────────────────
// function exportCsv() {
//   const cols = [
//     ["ideaName","Business case idea"],["status","Status"],["owner","Owner"],
//     ["department","Department or GP"],["problemStatement","Problem statement"],
//     ["scaleBusinessImpact","Scale and business impact"],["currentWorkarounds","Current workarounds failing"],
//     ["proposedSolution","Innovation approach"],["mvpScope","MVP scope"],
//     ["enabler","Technology or process enabler"],["unfairAdvantage","Unfair advantage"],
//     ["valueProposition","Value proposition"],["costSavings","Cost savings"],
//     ["efficiencyGain","Efficiency gain %"],["paybackMonths","Payback period months"],
//     ["activeUsers","Active users"],["adoptionRate","Adoption rate %"],
//     ["revenueImpact","Revenue impact"],["cycleTimeReduction","Cycle time reduction %"],
//     ["productivityUplift","Productivity uplift %"],["scheduleImpact","Schedule impact"],
//     ["goToMarketChannels","Digital and direct sales channel"],
//     ["changeManagement","Change management and training"],["rolloutPlan","Phased rollout plan"],
//     ["toolsPlatformCharges","Tools and platform charges"],["licenseCost","License cost"],
//     ["developmentCost","Development cost"],["supportMaintenanceCost","Support and maintenance"],
//     ["recurringCostAvoidance","Recurring cost avoidance"],["marginImprovement","Margin improvement %"],
//     ["scalabilityNotes","Scalable to all GPs"],["modified","Updated"]
//   ];
//   const rows = filtered();
//   const csv  = [
//     cols.map(([,l]) => csvQ(l)).join(","),
//     ...rows.map(r => cols.map(([k]) => csvQ(r[k])).join(","))
//   ].join("\r\n");

//   const a = Object.assign(document.createElement("a"), {
//     href:     URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"})),
//     download: `innovation-cases-${new Date().toISOString().slice(0,10)}.csv`
//   });
//   document.body.append(a); a.click(); a.remove();
// }

// // ── Local storage fallback ────────────────────────────────────────────────────
// const localStore = {
//   all()   { try { return JSON.parse(localStorage.getItem(CONFIG.storageKey)||"[]"); } catch { return []; } },
//   save(r) { localStorage.setItem(CONFIG.storageKey, JSON.stringify(r)); },
//   fetchItems() { return this.all(); },
//   createItem(rec) {
//     const now = new Date().toISOString();
//     const saved = {...rec, id:`local-${Date.now()}`, created:now, modified:now};
//     this.save([saved, ...this.all()]);
//     return saved;
//   },
//   updateItem(rec) {
//     const now  = new Date().toISOString();
//     const recs = this.all();
//     const i    = recs.findIndex(x => String(x.id) === String(rec.id));
//     const prev = i >= 0 ? recs[i] : {};
//     const saved = {...prev, ...rec, modified:now, created:prev.created||now};
//     if (i >= 0) recs.splice(i, 1, saved);
//     this.save(recs);
//     return saved;
//   }
// };

// // ── SharePoint REST ───────────────────────────────────────────────────────────
// const sharePointStore = {

//   async fetchItems() {
//     const select = [...new Set([...Object.values(CONFIG.fieldMap),"Id","Created","Modified"])];
//     const url = `${state.siteUrl}/_api/web/lists/getbytitle('${spTitle(CONFIG.listTitle)}')/items` +
//                 `?$select=${select.join(",")}&$top=5000&$orderby=Modified desc`;

//     const res = await fetch(url, {
//       headers:     { "Accept": "application/json;odata=nometadata" },
//       credentials: "same-origin"
//     });
//     await ok(res);
//     const data = await res.json();
//     return (data.value || []).map(spToRec);
//   },

//   async createItem(record) {
//     const url = `${state.siteUrl}/_api/web/lists/getbytitle('${spTitle(CONFIG.listTitle)}')/items`;
//     const res = await fetch(url, {
//       method:      "POST",
//       headers:     await hdrs(),
//       credentials: "same-origin",
//       body:        JSON.stringify(recToSp(record))
//     });
//     await ok(res);
//     let item = null;
//     try { item = await res.json(); } catch { item = null; }
//     if (item) return spToRec(item);
//     // fallback: re-fetch and return newest
//     const all = await this.fetchItems();
//     state.records = all;
//     return all[0] || record;
//   },

//   async updateItem(record) {
//     const url = `${state.siteUrl}/_api/web/lists/getbytitle('${spTitle(CONFIG.listTitle)}')/items(${Number(record.id)})`;
//     const res = await fetch(url, {
//       method:      "POST",
//       headers:     { ...(await hdrs()), "IF-MATCH": "*", "X-HTTP-Method": "MERGE" },
//       credentials: "same-origin",
//       body:        JSON.stringify(recToSp(record))
//     });
//     await ok(res);
//     const all = await this.fetchItems();
//     state.records = all;
//     return all.find(x => String(x.id) === String(record.id)) || record;
//   }
// };

// // ── SharePoint helpers ────────────────────────────────────────────────────────
// function recToSp(record) {
//   const p = {};
//   Object.entries(CONFIG.fieldMap).forEach(([key, field]) => {
//     if (["id","created","modified"].includes(key)) return;
//     const v = record[key];
//     p[field] = CONFIG.numberFields.has(key)
//       ? (v === "" || v == null || isNaN(Number(v)) ? null : Number(v))
//       : (v ?? "");
//   });
//   return p;
// }

// function spToRec(item) {
//   const rec = {};
//   Object.entries(CONFIG.fieldMap).forEach(([key, field]) => {
//     rec[key] = item[field] ?? "";
//   });
//   rec.id       = item.Id  ?? item.ID  ?? "";
//   rec.created  = item.Created  ?? "";
//   rec.modified = item.Modified ?? "";
//   return rec;
// }

// async function hdrs() {
//   return {
//     "Accept":          "application/json;odata=nometadata",
//     "Content-Type":    "application/json;odata=nometadata",
//     "X-RequestDigest": await digest()
//   };
// }

// async function digest() {
//   // 1. Classic SharePoint __REQUESTDIGEST hidden input (full .aspx pages)
//   const el = document.getElementById("__REQUESTDIGEST");
//   if (el?.value) return el.value;

//   // 2. Try parent frame (same-origin SharePoint iframe host pages)
//   try {
//     const p = window.parent?.document?.getElementById("__REQUESTDIGEST");
//     if (p?.value) return p.value;
//   } catch { /* cross-origin parent – ignore */ }

//   // 3. Fetch fresh digest from contextinfo
//   const res = await fetch(`${state.siteUrl}/_api/contextinfo`, {
//     method:      "POST",
//     headers:     { "Accept": "application/json;odata=nometadata" },
//     credentials: "same-origin"
//   });
//   await ok(res);
//   return (await res.json()).FormDigestValue;
// }

// async function ok(res) {
//   if (res.ok) return;
//   let msg = "";
//   try { msg = await res.text(); } catch { msg = ""; }
//   throw new Error(msg || `HTTP ${res.status} ${res.statusText}`);
// }

// function spTitle(v) { return String(v).replace(/'/g, "''"); }

// // ── UI helpers ────────────────────────────────────────────────────────────────
// function setBusy(v) { state.busy = v; document.body.classList.toggle("is-busy", v); }

// function showToast(msg) {
//   clearTimeout(state.toastTimer);
//   els.toast.textContent = msg;
//   els.toast.classList.add("show");
//   state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 3800);
// }

// // ── Math helpers ──────────────────────────────────────────────────────────────
// const sum  = (recs,k) => recs.reduce((t,r) => t + (Number(r[k])||0), 0);
// const nums = (recs,k) => recs.map(r => Number(r[k])).filter(v => isFinite(v) && v > 0);
// const avg  = vals    => vals.length ? vals.reduce((t,v) => t+v, 0)/vals.length : 0;

// // ── Formatters ────────────────────────────────────────────────────────────────
// function fmt$(v) {
//   const n = Number(v)||0;
//   return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",
//     maximumFractionDigits: n>=1000?0:2}).format(n);
// }
// const fmtPct  = v => (v===""||v==null) ? "" : `${fmtN(Number(v),1)}%`;
// const fmtMo   = v => (v===""||v==null) ? "" : `${fmtN(Number(v),0)} mo`;
// function fmtN(v, d=0) {
//   const n=Number(v)||0;
//   return new Intl.NumberFormat("en-US",{
//     maximumFractionDigits:d,
//     minimumFractionDigits:d>0&&Math.abs(n%1)>0?d:0
//   }).format(n);
// }
// function fmtDate(v) {
//   if (!v) return "";
//   const d = new Date(v);
//   return isNaN(d) ? "" : new Intl.DateTimeFormat("en-US",
//     {month:"short",day:"numeric",year:"numeric"}).format(d);
// }

// // ── Escape helpers ────────────────────────────────────────────────────────────
// function esc(v) {
//   return String(v??"")
//     .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
//     .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
// }
// function escAttr(v) { return esc(v).replace(/`/g,"&#96;"); }
// function csvQ(v) { const t=v==null?"":String(v); return `"${t.replace(/"/g,'""')}"`; }

const CONFIG = {
  listTitle: "OGC Innovation Business Case",
  storageKey: "ogcInnovationBusinessCases.v1",

  sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

  listFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/de240397094f4fe39a610c6a0a4d5997/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gJM20WCbDMWgARxFc6pbnqc6oq9cpX5Pw-aLgpp5a-s",

  saveFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f44390bc94a847d29342ab85b1b8ec2d/triggers/manual/paths/invoke",

  // Maps JS form field name -> SharePoint internal field name
  fieldMap: {
    id:                     "Id",
    ideaName:               "Title",
    owner:                  "field_1",
    department:             "field_2",
    status:                 "field_3",
    problemStatement:       "field_4",
    scaleBusinessImpact:    "field_5",
    currentWorkarounds:     "field_6",
    proposedSolution:       "field_7",
    mvpScope:               "field_8",
    enabler:                "field_9",
    unfairAdvantage:        "field_10",
    valueProposition:       "field_11",
    costSavings:            "field_12",
    efficiencyGain:         "field_13",
    paybackMonths:          "field_14",
    activeUsers:            "field_15",
    adoptionRate:           "field_16",
    revenueImpact:          "field_17",
    cycleTimeReduction:     "field_18",
    productivityUplift:     "field_19",
    scheduleImpact:         "field_20",
    goToMarketChannels:     "field_21",
    changeManagement:       "field_22",
    rolloutPlan:            "field_23",
    toolsPlatformCharges:   "field_24",
    licenseCost:            "field_25",
    developmentCost:        "field_26",
    supportMaintenanceCost: "field_27",
    recurringCostAvoidance: "field_28",
    marginImprovement:      "field_29",
    scalabilityNotes:       "field_30",
    created:                "Created",
    modified:               "Modified"
  },

  // Fields SharePoint stores as Number
  numberFields: new Set([
    "costSavings", "efficiencyGain", "paybackMonths", "activeUsers",
    "adoptionRate", "revenueImpact", "cycleTimeReduction", "productivityUplift",
    "scheduleImpact", "goToMarketChannels", "changeManagement",
    "toolsPlatformCharges", "licenseCost", "developmentCost",
    "supportMaintenanceCost", "recurringCostAvoidance", "marginImprovement",
    "scalabilityNotes"
  ])
};

const state = {
  records: [],
  mode: "save-flow-only",
  siteUrl: CONFIG.sharePointSiteUrl,
  search: "",
  statusFilter: "All",
  busy: false,
  toastTimer: 0
};

const els = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  bindEvents();
  await loadRecords();
  render();
}

// ---------------------------------------------------------------------------
// DATA LOADING — reads from SharePoint via list flow (read-only direction)
// ---------------------------------------------------------------------------
async function loadRecords() {
  setBusy(true);
  try {
    const res = await fetch(CONFIG.listFlowUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (!res.ok) throw new Error("List flow failed");

    const data = await res.json();
    const rows = Array.isArray(data) ? data : (data.value || []);

    state.records = rows.map(item => ({
      id:               item.Id              || "",
      ideaName:         item.Title           || "",
      owner:            item.field_1         || "",
      department:       item.field_2         || "",
      status:           item.field_3         || "Intake",
      problemStatement: item.field_4         || "",
      scaleBusinessImpact: item.field_5      || "",
      currentWorkarounds: item.field_6       || "",
      proposedSolution: item.field_7         || "",
      mvpScope:         item.field_8         || "",
      enabler:          item.field_9         || "",
      unfairAdvantage:  item.field_10        || "",
      valueProposition: item.field_11        || "",
      costSavings:      item.field_12        || 0,
      efficiencyGain:   item.field_13        || 0,
      paybackMonths:    item.field_14        || 0,
      activeUsers:      item.field_15        || 0,
      adoptionRate:     item.field_16        || 0,
      revenueImpact:    item.field_17        || 0,
      cycleTimeReduction: item.field_18      || 0,
      productivityUplift: item.field_19      || 0,
      scheduleImpact:   item.field_20        || 0,
      goToMarketChannels: item.field_21      || 0,
      changeManagement: item.field_22        || 0,
      rolloutPlan:      item.field_23        || "",
      toolsPlatformCharges: item.field_24    || 0,
      licenseCost:      item.field_25        || 0,
      developmentCost:  item.field_26        || 0,
      supportMaintenanceCost: item.field_27  || 0,
      recurringCostAvoidance: item.field_28  || 0,
      marginImprovement: item.field_29       || 0,
      scalabilityNotes: item.field_30        || 0,
      created:          item.Created         || "",
      modified:         item.Modified        || ""
    }));

    state.mode = "flow";

  } catch (err) {
    console.error(err);
    state.records = [];
    state.mode = "local-warning";
    showToast("⚠ Could not load SharePoint data");
  } finally {
    setBusy(false);
  }
}

// ---------------------------------------------------------------------------
// ELEMENT CACHE & EVENTS
// ---------------------------------------------------------------------------
function cacheElements() {
  [
    "connectionBadge","refreshButton","exportButton","newCaseButton",
    "caseRows","searchInput","statusFilter","summaryTotal","summarySavings",
    "summaryEfficiency","summaryPayback","drawerBackdrop","closeDrawerButton",
    "cancelButton","caseForm","drawerTitle","saveButton","toast"
  ].forEach(id => els[id] = document.getElementById(id));

  els.drawer = document.getElementById("caseDrawer");
}

function bindEvents() {
  els.newCaseButton.addEventListener("click", () => openDrawer());
  els.closeDrawerButton.addEventListener("click", closeDrawer);
  els.cancelButton.addEventListener("click", closeDrawer);
  els.drawerBackdrop.addEventListener("click", closeDrawer);
  els.exportButton.addEventListener("click", exportCsv);
  els.caseForm.addEventListener("submit", saveCurrentCase);

  els.searchInput.addEventListener("input", e => {
    state.search = e.target.value.trim().toLowerCase();
    renderTable();
  });

  els.statusFilter.addEventListener("change", e => {
    state.statusFilter = e.target.value;
    renderTable();
  });

  els.refreshButton.addEventListener("click", async () => {
    await loadRecords();
    render();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && els.drawer.classList.contains("open")) {
      closeDrawer();
    }
  });
}

// ---------------------------------------------------------------------------
// RENDER
// ---------------------------------------------------------------------------
function render() {
  renderBadge();
  renderSummaries();
  renderTable();
}

function renderBadge() {
  const b = els.connectionBadge;
  if (state.mode === "flow") {
    b.textContent = "Power Automate connected";
    b.classList.remove("warning");
  } else {
    b.textContent = "⚠ Flow unavailable";
    b.classList.add("warning");
  }
}

function renderSummaries() {
  const f = filtered();
  els.summaryTotal.textContent = f.length;
  els.summarySavings.textContent = fmt$(sum(f, "costSavings"));
  els.summaryEfficiency.textContent = `${fmtN(avg(nums(f, "efficiencyGain")), 1)}%`;
  els.summaryPayback.textContent = `${fmtN(avg(nums(f, "paybackMonths")), 0)} mo`;
}

function renderTable() {
  renderSummaries();
  const rows = filtered();

  if (!rows.length) {
    els.caseRows.innerHTML =
      `<tr class="empty-row"><td colspan="11">No business cases match the current view.</td></tr>`;
    return;
  }

  els.caseRows.innerHTML = rows.map(r => `
    <tr>
      <td class="idea-cell">${esc(r.ideaName || "Untitled case")}</td>
      <td><span class="status-pill" data-status="${esc(r.status || "Intake")}">${esc(r.status || "Intake")}</span></td>
      <td>${esc(r.owner || "")}</td>
      <td class="text-cell">${esc(r.valueProposition || "")}</td>
      <td class="number-cell">${fmt$(r.costSavings)}</td>
      <td class="number-cell">${fmtPct(r.efficiencyGain)}</td>
      <td class="number-cell">${fmtMo(r.paybackMonths)}</td>
      <td class="number-cell">${fmtPct(r.adoptionRate)}</td>
      <td class="number-cell">${fmt$(r.revenueImpact)}</td>
      <td class="number-cell">${fmtDate(r.modified || r.created)}</td>
      <td class="action-col">
        <button class="icon-button row-action" type="button"
          title="Edit" aria-label="Edit ${escAttr(r.ideaName || "case")}"
          data-edit-id="${escAttr(r.id)}">
          <svg><use href="#icon-edit"></use></svg>
        </button>
      </td>
    </tr>
  `).join("");

  els.caseRows.querySelectorAll("[data-edit-id]").forEach(btn =>
    btn.addEventListener("click", () => {
      const rec = state.records.find(x => String(x.id) === String(btn.dataset.editId));
      if (rec) openDrawer(rec);
    })
  );
}

function filtered() {
  const q = state.search;
  return [...state.records]
    .filter(r => state.statusFilter === "All" || r.status === state.statusFilter)
    .filter(r => !q || [
      r.ideaName, r.owner, r.department, r.status,
      r.problemStatement, r.valueProposition, r.proposedSolution
    ].some(v => String(v || "").toLowerCase().includes(q)))
    .sort((a, b) => new Date(b.modified || b.created || 0) - new Date(a.modified || a.created || 0));
}

// ---------------------------------------------------------------------------
// DRAWER
// ---------------------------------------------------------------------------
function openDrawer(record = null) {
  els.caseForm.reset();
  els.drawerTitle.textContent = record ? "Edit innovation case" : "New innovation case";

  if (record) {
    Object.keys(CONFIG.fieldMap).forEach(key => {
      const ctrl = els.caseForm.elements[key];
      if (ctrl && record[key] != null) ctrl.value = record[key];
    });
    els.caseForm.elements.id.value = record.id;
  } else {
    if (els.caseForm.elements.status) els.caseForm.elements.status.value = "Intake";
    els.caseForm.elements.id.value = "";
  }

  els.drawerBackdrop.hidden = false;
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
  setTimeout(() => els.caseForm.elements.ideaName?.focus(), 30);
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  els.drawerBackdrop.hidden = true;
}

// ---------------------------------------------------------------------------
// SAVE — writes to SharePoint ONLY via Power Automate flow
// The payload uses SharePoint field names so the flow can pass them straight
// through to SharePoint's AddItem / UpdateItem actions.
//
// Convention agreed with the flow:
//   • "id" present & non-empty  →  flow calls UpdateItem (no new row)
//   • "id" absent / empty       →  flow calls AddItem (new row)
// ---------------------------------------------------------------------------
async function saveCurrentCase(e) {
  e.preventDefault();
  const record = formToRecord(new FormData(els.caseForm));

  if (!record.ideaName) {
    showToast("Business case idea is required.");
    els.caseForm.elements.ideaName.focus();
    return;
  }

  setBusy(true);
  try {
    const isUpdate = !!(record.id);
    const saved = await saveViaFlow(record);

    // Resolve the SharePoint ID returned by the flow (create) or keep existing (update)
    const spId = saved.id || saved.Id || record.id || `temp-${Date.now()}`;
    const now   = new Date().toISOString();

    const merged = {
      ...record,
      id:       spId,
      modified: now,
      created:  isUpdate
        ? (state.records.find(x => String(x.id) === String(record.id))?.created || now)
        : now
    };

    upsert(merged);
    closeDrawer();
    els.caseForm.reset();
    render();
    showToast(isUpdate ? "✓ Updated in SharePoint." : "✓ Saved to SharePoint.");
  } catch (err) {
    console.error("Save failed:", err);
    showToast(`Save failed: ${err.message}`);
  } finally {
    setBusy(false);
  }
}

async function saveViaFlow(record) {
  // Build the payload with SharePoint field names so the flow can hand them
  // directly to the SharePoint connector without extra mapping steps.
  const payload = buildSharePointPayload(record);

  const res = await fetch(CONFIG.saveFlowUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Flow save failed: HTTP ${res.status}`);
  }

  let data = {};
  try { data = await res.json(); } catch { /* empty body is fine */ }
  return data;
}

/**
 * Converts the JS record (camelCase keys) into an object keyed by SharePoint
 * internal field names.  The flow receives this and can pass each property
 * straight into the SharePoint "Create item" / "Update item" action.
 *
 * Also includes:
 *   • "id"        — empty string for new items, numeric string for updates
 *   • "operation" — "create" | "update"  (easy switch for the flow condition)
 */
function buildSharePointPayload(record) {
  const payload = {
    operation: record.id ? "update" : "create",
    id:        record.id ? String(record.id) : ""
  };

  // Walk every field in the map and emit the SP field name as key
  Object.entries(CONFIG.fieldMap).forEach(([jsKey, spField]) => {
    if (["created", "modified", "id"].includes(jsKey)) return; // SP manages these
    const val = record[jsKey];
    if (CONFIG.numberFields.has(jsKey)) {
      payload[spField] = (val === "" || val == null) ? null : Number(val);
    } else {
      payload[spField] = val == null ? "" : String(val);
    }
  });

  return payload;
}

// ---------------------------------------------------------------------------
// FORM → RECORD (JS model, camelCase keys)
// ---------------------------------------------------------------------------
function formToRecord(fd) {
  const rec = {};

  Object.keys(CONFIG.fieldMap).forEach(key => {
    if (["created", "modified"].includes(key)) return;
    const val = fd.get(key);
    rec[key] = CONFIG.numberFields.has(key)
      ? (val === "" || val === null ? null : Number(val))
      : (val === null ? "" : String(val).trim());
  });

  rec.id     = fd.get("id") || "";
  rec.status = rec.status || "Intake";
  return rec;
}

// In-memory upsert — keeps the UI in sync without a full reload
function upsert(record) {
  const i = state.records.findIndex(x => String(x.id) === String(record.id));
  i >= 0 ? state.records.splice(i, 1, record) : state.records.unshift(record);
}

// ---------------------------------------------------------------------------
// EXPORT CSV
// ---------------------------------------------------------------------------
function exportCsv() {
  const cols = [
    ["ideaName","Business case idea"],["status","Status"],["owner","Owner"],
    ["department","Department or GP"],["problemStatement","Problem statement"],
    ["scaleBusinessImpact","Scale and business impact"],["currentWorkarounds","Current workarounds failing"],
    ["proposedSolution","Innovation approach"],["mvpScope","MVP scope"],
    ["enabler","Technology or process enabler"],["unfairAdvantage","Unfair advantage"],
    ["valueProposition","Value proposition"],["costSavings","Cost savings"],
    ["efficiencyGain","Efficiency gain %"],["paybackMonths","Payback period months"],
    ["activeUsers","Active users"],["adoptionRate","Adoption rate %"],
    ["revenueImpact","Revenue impact"],["cycleTimeReduction","Cycle time reduction %"],
    ["productivityUplift","Productivity uplift %"],["scheduleImpact","Schedule impact"],
    ["goToMarketChannels","Digital and direct sales channel"],
    ["changeManagement","Change management and training"],["rolloutPlan","Phased rollout plan"],
    ["toolsPlatformCharges","Tools and platform charges"],["licenseCost","License cost"],
    ["developmentCost","Development cost"],["supportMaintenanceCost","Support and maintenance"],
    ["recurringCostAvoidance","Recurring cost avoidance"],["marginImprovement","Margin improvement %"],
    ["scalabilityNotes","Scalable to all GPs"],["modified","Updated"]
  ];

  const rows = filtered();
  const csv = [
    cols.map(([,l]) => csvQ(l)).join(","),
    ...rows.map(r => cols.map(([k]) => csvQ(r[k])).join(","))
  ].join("\r\n");

  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type:"text/csv;charset=utf-8" })),
    download: `innovation-cases-${new Date().toISOString().slice(0,10)}.csv`
  });
  document.body.append(a);
  a.click();
  a.remove();
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function setBusy(v) {
  state.busy = v;
  document.body.classList.toggle("is-busy", v);
}

function showToast(msg) {
  clearTimeout(state.toastTimer);
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 3800);
}

const sum  = (recs, k) => recs.reduce((t, r) => t + (Number(r[k]) || 0), 0);
const nums = (recs, k) => recs.map(r => Number(r[k])).filter(v => isFinite(v) && v > 0);
const avg  = vals => vals.length ? vals.reduce((t, v) => t + v, 0) / vals.length : 0;

function fmt$(v) {
  const n = Number(v) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2
  }).format(n);
}

const fmtPct = v => (v === "" || v == null) ? "" : `${fmtN(Number(v), 1)}%`;
const fmtMo  = v => (v === "" || v == null) ? "" : `${fmtN(Number(v), 0)} mo`;

function fmtN(v, d = 0) {
  const n = Number(v) || 0;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: d,
    minimumFractionDigits: d > 0 && Math.abs(n % 1) > 0 ? d : 0
  }).format(n);
}

function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d) ? "" : new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric"
  }).format(d);
}

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escAttr(v) { return esc(v).replace(/`/g, "&#96;"); }
function csvQ(v) {
  const t = v == null ? "" : String(v);
  return `"${t.replace(/"/g, '""')}"`;
}

// const CONFIG = {
//   listTitle: "OGC Innovation Business Case",
//   storageKey: "ogcInnovationBusinessCases.v1",

//   sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

//   listFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/de240397094f4fe39a610c6a0a4d5997/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gJM20WCbDMWgARxFc6pbnqc6oq9cpX5Pw-aLgpp5a-s",

//   saveFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f44390bc94a847d29342ab85b1b8ec2d/triggers/manual/paths/invoke",


//   fieldMap: {
//     id:                     "Id",
//     ideaName:               "Title",
//     owner:                  "field_1",
//     department:             "field_2",
//     status:                 "field_3",
//     problemStatement:       "field_4",
//     scaleBusinessImpact:    "field_5",
//     currentWorkarounds:     "field_6",
//     proposedSolution:       "field_7",
//     mvpScope:               "field_8",
//     enabler:                "field_9",
//     unfairAdvantage:        "field_10",
//     valueProposition:       "field_11",
//     costSavings:            "field_12",
//     efficiencyGain:         "field_13",
//     paybackMonths:          "field_14",
//     activeUsers:            "field_15",
//     adoptionRate:           "field_16",
//     revenueImpact:          "field_17",
//     cycleTimeReduction:     "field_18",
//     productivityUplift:     "field_19",
//     scheduleImpact:         "field_20",
//     goToMarketChannels:     "field_21",
//     changeManagement:       "field_22",
//     rolloutPlan:            "field_23",
//     toolsPlatformCharges:   "field_24",
//     licenseCost:            "field_25",
//     developmentCost:        "field_26",
//     supportMaintenanceCost: "field_27",
//     recurringCostAvoidance: "field_28",
//     marginImprovement:      "field_29",
//     scalabilityNotes:       "field_30",
//     created:                "Created",
//     modified:               "Modified"
//   },

//   numberFields: new Set([
//     "costSavings", "efficiencyGain", "paybackMonths", "activeUsers",
//     "adoptionRate", "revenueImpact", "cycleTimeReduction", "productivityUplift",
//     "toolsPlatformCharges", "licenseCost", "developmentCost",
//     "supportMaintenanceCost", "recurringCostAvoidance", "marginImprovement"
//   ])
// };

// const state = {
//   records: [],
//   mode: "save-flow-only",
//   siteUrl: CONFIG.sharePointSiteUrl,
//   search: "",
//   statusFilter: "All",
//   busy: false,
//   toastTimer: 0
// };

// const els = {};

// document.addEventListener("DOMContentLoaded", init);

// async function init() {
//   cacheElements();
//   bindEvents();
//   await loadRecords();
//   render();
// }
// async function loadRecords() {
//   setBusy(true);
//   try {
//     const res = await fetch(CONFIG.listFlowUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({})
//     });

//     if (!res.ok) throw new Error("List flow failed");

//     const data = await res.json();

//     const rows = Array.isArray(data) ? data : (data.value || []);

//     state.records = rows.map(item => ({
//       id: item.Id || "",
//       ideaName: item.Title || "",
//       owner: item.field_1 || "",
//       department: item.field_2 || "",
//       status: item.field_3 || "Intake",
//       valueProposition: item.field_11 || "",
//       costSavings: item.field_12 || 0,
//       efficiencyGain: item.field_13 || 0,
//       paybackMonths: item.field_14 || 0,
//       adoptionRate: item.field_16 || 0,
//       revenueImpact: item.field_17 || 0,
//       created: item.Created || "",
//       modified: item.Modified || ""
//     }));

//     state.mode = "flow";

//   } catch (err) {
//     console.error(err);
//     state.records = [];
//     state.mode = "local-warning";
//     showToast("⚠ Could not load SharePoint data");
//   } finally {
//     setBusy(false);
//   }
// }

// function cacheElements() {
//   [
//     "connectionBadge","refreshButton","exportButton","newCaseButton",
//     "caseRows","searchInput","statusFilter","summaryTotal","summarySavings",
//     "summaryEfficiency","summaryPayback","drawerBackdrop","closeDrawerButton",
//     "cancelButton","caseForm","drawerTitle","saveButton","toast"
//   ].forEach(id => els[id] = document.getElementById(id));

//   els.drawer = document.getElementById("caseDrawer");
// }

// function bindEvents() {
//   els.newCaseButton.addEventListener("click", () => openDrawer());
//   els.closeDrawerButton.addEventListener("click", closeDrawer);
//   els.cancelButton.addEventListener("click", closeDrawer);
//   els.drawerBackdrop.addEventListener("click", closeDrawer);
//   els.exportButton.addEventListener("click", exportCsv);
//   els.caseForm.addEventListener("submit", saveCurrentCase);

//   els.searchInput.addEventListener("input", e => {
//     state.search = e.target.value.trim().toLowerCase();
//     renderTable();
//   });

//   els.statusFilter.addEventListener("change", e => {
//     state.statusFilter = e.target.value;
//     renderTable();
//   });

//   els.refreshButton.addEventListener("click", async () => {
//   await loadRecords();
//   render();
// });

//   document.addEventListener("keydown", e => {
//     if (e.key === "Escape" && els.drawer.classList.contains("open")) {
//       closeDrawer();
//     }
//   });
// }

// function loadLocalRecords() {
//   state.records = localStore.fetchItems();
// }

// function render() {
//   renderBadge();
//   renderSummaries();
//   renderTable();
// }

// function renderBadge() {
//   const b = els.connectionBadge;

//   if (state.mode === "flow") {
//     b.textContent = "Power Automate connected";
//     b.classList.remove("warning");
//   } else {
//     b.textContent = "⚠ Flow unavailable";
//     b.classList.add("warning");
//   }
// }


// function renderSummaries() {
//   const f = filtered();
//   els.summaryTotal.textContent = f.length;
//   els.summarySavings.textContent = fmt$(sum(f, "costSavings"));
//   els.summaryEfficiency.textContent = `${fmtN(avg(nums(f, "efficiencyGain")), 1)}%`;
//   els.summaryPayback.textContent = `${fmtN(avg(nums(f, "paybackMonths")), 0)} mo`;
// }

// function renderTable() {
//   renderSummaries();
//   const rows = filtered();

//   if (!rows.length) {
//     els.caseRows.innerHTML =
//       `<tr class="empty-row"><td colspan="11">No business cases match the current view.</td></tr>`;
//     return;
//   }

//   els.caseRows.innerHTML = rows.map(r => `
//     <tr>
//       <td class="idea-cell">${esc(r.ideaName || "Untitled case")}</td>
//       <td><span class="status-pill" data-status="${esc(r.status || "Intake")}">${esc(r.status || "Intake")}</span></td>
//       <td>${esc(r.owner || "")}</td>
//       <td class="text-cell">${esc(r.valueProposition || "")}</td>
//       <td class="number-cell">${fmt$(r.costSavings)}</td>
//       <td class="number-cell">${fmtPct(r.efficiencyGain)}</td>
//       <td class="number-cell">${fmtMo(r.paybackMonths)}</td>
//       <td class="number-cell">${fmtPct(r.adoptionRate)}</td>
//       <td class="number-cell">${fmt$(r.revenueImpact)}</td>
//       <td class="number-cell">${fmtDate(r.modified || r.created)}</td>
//       <td class="action-col">
//         <button class="icon-button row-action" type="button"
//           title="Edit" aria-label="Edit ${escAttr(r.ideaName || "case")}"
//           data-edit-id="${escAttr(r.id)}">
//           <svg><use href="#icon-edit"></use></svg>
//         </button>
//       </td>
//     </tr>
//   `).join("");

//   els.caseRows.querySelectorAll("[data-edit-id]").forEach(btn =>
//     btn.addEventListener("click", () => {
//       const rec = state.records.find(x => String(x.id) === String(btn.dataset.editId));
//       if (rec) openDrawer(rec);
//     })
//   );
// }

// function filtered() {
//   const q = state.search;
//   return [...state.records]
//     .filter(r => state.statusFilter === "All" || r.status === state.statusFilter)
//     .filter(r => !q || [
//       r.ideaName, r.owner, r.department, r.status,
//       r.problemStatement, r.valueProposition, r.proposedSolution
//     ].some(v => String(v || "").toLowerCase().includes(q)))
//     .sort((a, b) => new Date(b.modified || b.created || 0) - new Date(a.modified || a.created || 0));
// }

// function openDrawer(record = null) {
//   els.caseForm.reset();
//   els.drawerTitle.textContent = record ? "Edit innovation case" : "New innovation case";

//   if (record) {
//     Object.keys(CONFIG.fieldMap).forEach(key => {
//       const ctrl = els.caseForm.elements[key];
//       if (ctrl && record[key] != null) ctrl.value = record[key];
//     });
//     els.caseForm.elements.id.value = record.id;
//   } else {
//     if (els.caseForm.elements.status) els.caseForm.elements.status.value = "Intake";
//     els.caseForm.elements.id.value = "";
//   }

//   els.drawerBackdrop.hidden = false;
//   els.drawer.classList.add("open");
//   els.drawer.setAttribute("aria-hidden", "false");
//   setTimeout(() => els.caseForm.elements.ideaName?.focus(), 30);
// }

// function closeDrawer() {
//   els.drawer.classList.remove("open");
//   els.drawer.setAttribute("aria-hidden", "true");
//   els.drawerBackdrop.hidden = true;
// }

// async function saveCurrentCase(e) {
//   e.preventDefault();
//   const record = formToRecord(new FormData(els.caseForm));

//   if (!record.ideaName) {
//     showToast("Business case idea is required.");
//     els.caseForm.elements.ideaName.focus();
//     return;
//   }

//   setBusy(true);
//   try {
//     const saved = await saveViaFlow(record);

//     // keep local UI in sync immediately
//     const localSaved = record.id
//       ? localStore.updateItem({ ...record, id: saved.id || record.id })
//       : localStore.createItem({ ...record, id: saved.id || `flow-${Date.now()}` });

//     upsert(localSaved);
//     closeDrawer();
//     els.caseForm.reset();
//     render();
//     showToast("✓ Saved to SharePoint list.");
//   } catch (err) {
//     console.error("Save failed:", err);
//     showToast(`Save failed: ${err.message}`);
//   } finally {
//     setBusy(false);
//   }
// }

// async function saveViaFlow(record) {
//   const res = await fetch(CONFIG.saveFlowUrl, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(record)
//   });

//   if (!res.ok) {
//     throw new Error(`Flow save failed: HTTP ${res.status}`);
//   }

//   let data = {};
//   try {
//     data = await res.json();
//   } catch {
//     data = {};
//   }

//   return data;
// }

// function formToRecord(fd) {
//   const rec = {};

//   Object.keys(CONFIG.fieldMap).forEach(key => {
//     if (["created", "modified"].includes(key)) return;
//     const val = fd.get(key);
//     rec[key] = CONFIG.numberFields.has(key)
//       ? (val === "" || val === null ? null : Number(val))
//       : (val === null ? "" : String(val).trim());
//   });

//   rec.id = fd.get("id") || "";
//   rec.status = rec.status || "Intake";
//   return rec;
// }

// function upsert(record) {
//   const i = state.records.findIndex(x => String(x.id) === String(record.id));
//   i >= 0 ? state.records.splice(i, 1, record) : state.records.unshift(record);
// }

// function exportCsv() {
//   const cols = [
//     ["ideaName","Business case idea"],["status","Status"],["owner","Owner"],
//     ["department","Department or GP"],["problemStatement","Problem statement"],
//     ["scaleBusinessImpact","Scale and business impact"],["currentWorkarounds","Current workarounds failing"],
//     ["proposedSolution","Innovation approach"],["mvpScope","MVP scope"],
//     ["enabler","Technology or process enabler"],["unfairAdvantage","Unfair advantage"],
//     ["valueProposition","Value proposition"],["costSavings","Cost savings"],
//     ["efficiencyGain","Efficiency gain %"],["paybackMonths","Payback period months"],
//     ["activeUsers","Active users"],["adoptionRate","Adoption rate %"],
//     ["revenueImpact","Revenue impact"],["cycleTimeReduction","Cycle time reduction %"],
//     ["productivityUplift","Productivity uplift %"],["scheduleImpact","Schedule impact"],
//     ["goToMarketChannels","Digital and direct sales channel"],
//     ["changeManagement","Change management and training"],["rolloutPlan","Phased rollout plan"],
//     ["toolsPlatformCharges","Tools and platform charges"],["licenseCost","License cost"],
//     ["developmentCost","Development cost"],["supportMaintenanceCost","Support and maintenance"],
//     ["recurringCostAvoidance","Recurring cost avoidance"],["marginImprovement","Margin improvement %"],
//     ["scalabilityNotes","Scalable to all GPs"],["modified","Updated"]
//   ];

//   const rows = filtered();
//   const csv = [
//     cols.map(([,l]) => csvQ(l)).join(","),
//     ...rows.map(r => cols.map(([k]) => csvQ(r[k])).join(","))
//   ].join("\r\n");

//   const a = Object.assign(document.createElement("a"), {
//     href: URL.createObjectURL(new Blob([csv], { type:"text/csv;charset=utf-8" })),
//     download: `innovation-cases-${new Date().toISOString().slice(0,10)}.csv`
//   });

//   document.body.append(a);
//   a.click();
//   a.remove();
// }

// const localStore = {
//   all() {
//     try { return JSON.parse(localStorage.getItem(CONFIG.storageKey) || "[]"); }
//     catch { return []; }
//   },
//   save(r) { localStorage.setItem(CONFIG.storageKey, JSON.stringify(r)); },
//   fetchItems() { return this.all(); },
//   createItem(rec) {
//     const now = new Date().toISOString();
//     const saved = { ...rec, id: rec.id || `local-${Date.now()}`, created: now, modified: now };
//     this.save([saved, ...this.all()]);
//     return saved;
//   },
//   updateItem(rec) {
//     const now = new Date().toISOString();
//     const recs = this.all();
//     const i = recs.findIndex(x => String(x.id) === String(rec.id));
//     const prev = i >= 0 ? recs[i] : {};
//     const saved = { ...prev, ...rec, modified: now, created: prev.created || now };
//     if (i >= 0) recs.splice(i, 1, saved);
//     this.save(recs);
//     return saved;
//   }
// };

// function setBusy(v) {
//   state.busy = v;
//   document.body.classList.toggle("is-busy", v);
// }

// function showToast(msg) {
//   clearTimeout(state.toastTimer);
//   els.toast.textContent = msg;
//   els.toast.classList.add("show");
//   state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 3800);
// }

// const sum = (recs,k) => recs.reduce((t,r) => t + (Number(r[k]) || 0), 0);
// const nums = (recs,k) => recs.map(r => Number(r[k])).filter(v => isFinite(v) && v > 0);
// const avg = vals => vals.length ? vals.reduce((t,v) => t + v, 0) / vals.length : 0;

// function fmt$(v) {
//   const n = Number(v) || 0;
//   return new Intl.NumberFormat("en-US", {
//     style:"currency",
//     currency:"USD",
//     maximumFractionDigits: n >= 1000 ? 0 : 2
//   }).format(n);
// }

// const fmtPct = v => (v === "" || v == null) ? "" : `${fmtN(Number(v),1)}%`;
// const fmtMo  = v => (v === "" || v == null) ? "" : `${fmtN(Number(v),0)} mo`;

// function fmtN(v, d = 0) {
//   const n = Number(v) || 0;
//   return new Intl.NumberFormat("en-US", {
//     maximumFractionDigits:d,
//     minimumFractionDigits:d > 0 && Math.abs(n % 1) > 0 ? d : 0
//   }).format(n);
// }

// function fmtDate(v) {
//   if (!v) return "";
//   const d = new Date(v);
//   return isNaN(d) ? "" : new Intl.DateTimeFormat("en-US", {
//     month:"short", day:"numeric", year:"numeric"
//   }).format(d);
// }

// function esc(v) {
//   return String(v ?? "")
//     .replace(/&/g,"&amp;")
//     .replace(/</g,"&lt;")
//     .replace(/>/g,"&gt;")
//     .replace(/"/g,"&quot;")
//     .replace(/'/g,"&#39;");
// }

// function escAttr(v) { return esc(v).replace(/`/g,"&#96;"); }
// function csvQ(v) {
//   const t = v == null ? "" : String(v);
//   return `"${t.replace(/"/g,'""')}"`;
// }
