// const CONFIG = {
//   listTitle: "OGC Innovation Business Case",
//   storageKey: "ogcInnovationBusinessCases.v1",
//   siteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

//   fieldMap: {
//     id: "Id",
//     ideaName: "Title",
//     // owner: "field_1",
//     // department: "field_2",
//     // status: "field_3",
//     // problemStatement: "field_4",
//     // scaleBusinessImpact: "field_5",
//     // currentWorkarounds: "field_6",
//     // proposedSolution: "field_7",
//     // mvpScope: "field_8",
//     // enabler: "field_9",
//     // unfairAdvantage: "field_10",
//     // valueProposition: "field_11",
//     // costSavings: "field_12",
//     // efficiencyGain: "field_13",
//     // paybackMonths: "field_14",
//     // activeUsers: "field_15",
//     // adoptionRate: "field_16",
//     // revenueImpact: "field_17",
//     // cycleTimeReduction: "field_18",
//     // productivityUplift: "field_19",
//     // scheduleImpact: "field_20",
//     // goToMarketChannels: "field_21",
//     // changeManagement: "field_22",
//     // rolloutPlan: "field_23",
//     // toolsPlatformCharges: "field_24",
//     // licenseCost: "field_25",
//     // developmentCost: "field_26",
//     // supportMaintenanceCost: "field_27",
//     // recurringCostAvoidance: "field_28",
//     // marginImprovement: "field_29",
//     // scalabilityNotes: "field_30",
//     created: "Created",
//     modified: "Modified"
//   },

//   numberFields: new Set([
//     // "costSavings",
//     // "efficiencyGain",
//     // "paybackMonths",
//     // "activeUsers",
//     // "adoptionRate",
//     // "revenueImpact",
//     // "cycleTimeReduction",
//     // "productivityUplift",
//     // "toolsPlatformCharges",
//     // "licenseCost",
//     // "developmentCost",
//     // "supportMaintenanceCost",
//     // "recurringCostAvoidance",
//     // "marginImprovement"
//   ])
// };


// const state = {
//   records: [],
//   mode: "local",
//   siteUrl: CONFIG.siteUrl,
//   search: "",
//   status: "All",
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

// function cacheElements() {
//   els.connectionBadge = document.getElementById("connectionBadge");
//   els.refreshButton = document.getElementById("refreshButton");
//   els.exportButton = document.getElementById("exportButton");
//   els.newCaseButton = document.getElementById("newCaseButton");
//   els.caseRows = document.getElementById("caseRows");
//   els.searchInput = document.getElementById("searchInput");
//   els.statusFilter = document.getElementById("statusFilter");
//   els.summaryTotal = document.getElementById("summaryTotal");
//   els.summarySavings = document.getElementById("summarySavings");
//   els.summaryEfficiency = document.getElementById("summaryEfficiency");
//   els.summaryPayback = document.getElementById("summaryPayback");
//   els.drawer = document.getElementById("caseDrawer");
//   els.drawerBackdrop = document.getElementById("drawerBackdrop");
//   els.closeDrawerButton = document.getElementById("closeDrawerButton");
//   els.cancelButton = document.getElementById("cancelButton");
//   els.caseForm = document.getElementById("caseForm");
//   els.drawerTitle = document.getElementById("drawerTitle");
//   els.saveButton = document.getElementById("saveButton");
//   els.toast = document.getElementById("toast");
// }

// function bindEvents() {
//   els.newCaseButton.addEventListener("click", () => openDrawer());
//   els.closeDrawerButton.addEventListener("click", closeDrawer);
//   els.cancelButton.addEventListener("click", closeDrawer);
//   els.drawerBackdrop.addEventListener("click", closeDrawer);
//   els.searchInput.addEventListener("input", (event) => {
//     state.search = event.target.value.trim().toLowerCase();
//     renderTable();
//   });
//   els.statusFilter.addEventListener("change", (event) => {
//     state.status = event.target.value;
//     renderTable();
//   });
//   els.refreshButton.addEventListener("click", async () => {
//     await loadRecords(true);
//     render();
//   });
//   els.exportButton.addEventListener("click", exportCsv);
//   els.caseForm.addEventListener("submit", saveCurrentCase);
//   document.addEventListener("keydown", (event) => {
//     if (event.key === "Escape" && els.drawer.classList.contains("open")) {
//       closeDrawer();
//     }
//   });
// }

// async function loadRecords(isManualRefresh = false) {
//   setBusy(true);
//   try {
//     if (state.siteUrl) {
//       state.records = await sharePointStore.fetchItems();
//       state.mode = "sharepoint";
//       if (isManualRefresh) showToast("SharePoint list refreshed.");
//       return;
//     }
//     state.records = localStore.fetchItems();
//     state.mode = "local";
//   } catch (error) {
//     console.warn(error);
//     state.records = localStore.fetchItems();
//     state.mode = "local-warning";
//     showToast("Using local test data. SharePoint list was not reachable.");
//   } finally {
//     setBusy(false);
//   }
// }

// function render() {
//   renderConnection();
//   renderSummaries();
//   renderTable();
// }

// function renderConnection() {
//   if (state.mode === "sharepoint") {
//     els.connectionBadge.textContent = "SharePoint List connected";
//     els.connectionBadge.classList.remove("warning");
//     return;
//   }
//   if (state.mode === "local-warning") {
//     els.connectionBadge.textContent = "Local mode - list unavailable";
//     els.connectionBadge.classList.add("warning");
//     return;
//   }
//   els.connectionBadge.textContent = "Local test mode";
//   els.connectionBadge.classList.add("warning");
// }

// function renderSummaries() {
//   const filtered = getFilteredRecords();
//   const total = filtered.length;
//   const savings = sum(filtered, "costSavings");
//   const efficiencyValues = numbers(filtered, "efficiencyGain");
//   const paybackValues = numbers(filtered, "paybackMonths");

//   els.summaryTotal.textContent = String(total);
//   els.summarySavings.textContent = formatCurrency(savings);
//   els.summaryEfficiency.textContent = `${formatNumber(average(efficiencyValues), 1)}%`;
//   els.summaryPayback.textContent = `${formatNumber(average(paybackValues), 0)} mo`;
// }

// function renderTable() {
//   const rows = getFilteredRecords();
//   renderSummaries();

//   if (!rows.length) {
//     els.caseRows.innerHTML = `<tr class="empty-row"><td colspan="11">No business cases match the current view.</td></tr>`;
//     return;
//   }

//   els.caseRows.innerHTML = rows.map((record) => `
//     <tr>
//       <td class="idea-cell">${escapeHtml(record.ideaName || "Untitled case")}</td>
//       <td><span class="status-pill" data-status="${escapeHtml(record.status || "Intake")}">${escapeHtml(record.status || "Intake")}</span></td>
//       <td>${escapeHtml(record.owner || "")}</td>
//       <td class="text-cell">${escapeHtml(record.valueProposition || "")}</td>
//       <td class="number-cell">${formatCurrency(record.costSavings)}</td>
//       <td class="number-cell">${formatPercent(record.efficiencyGain)}</td>
//       <td class="number-cell">${formatMonths(record.paybackMonths)}</td>
//       <td class="number-cell">${formatPercent(record.adoptionRate)}</td>
//       <td class="number-cell">${formatCurrency(record.revenueImpact)}</td>
//       <td class="number-cell">${formatDate(record.modified || record.created)}</td>
//       <td class="action-col">
//         <button class="icon-button row-action" type="button" title="Edit" aria-label="Edit ${escapeAttribute(record.ideaName || "case")}" data-edit-id="${escapeAttribute(record.id)}">
//           <svg><use href="#icon-edit"></use></svg>
//         </button>
//       </td>
//     </tr>
//   `).join("");

//   els.caseRows.querySelectorAll("[data-edit-id]").forEach((button) => {
//     button.addEventListener("click", () => {
//       const record = state.records.find((item) => String(item.id) === String(button.dataset.editId));
//       if (record) openDrawer(record);
//     });
//   });
// }

// function getFilteredRecords() {
//   const query = state.search;
//   return [...state.records]
//     .filter((record) => state.status === "All" || record.status === state.status)
//     .filter((record) => {
//       if (!query) return true;
//       return [
//         record.ideaName,
//         record.owner,
//         record.department,
//         record.status,
//         record.problemStatement,
//         record.valueProposition,
//         record.proposedSolution
//       ].some((value) => String(value || "").toLowerCase().includes(query));
//     })
//     .sort((a, b) => new Date(b.modified || b.created || 0) - new Date(a.modified || a.created || 0));
// }

// function openDrawer(record = null) {
//   els.caseForm.reset();
//   els.drawerTitle.textContent = record ? "Edit innovation case" : "New innovation case";

//   if (record) {
//     Object.keys(CONFIG.fieldMap).forEach((key) => {
//       const control = els.caseForm.elements[key];
//       if (control && record[key] !== undefined && record[key] !== null) {
//         control.value = record[key];
//       }
//     });
//     els.caseForm.elements.id.value = record.id;
//   } else {
//     els.caseForm.elements.status.value = "Intake";
//     els.caseForm.elements.id.value = "";
//   }

//   els.drawerBackdrop.hidden = false;
//   els.drawer.classList.add("open");
//   els.drawer.setAttribute("aria-hidden", "false");
//   window.setTimeout(() => els.caseForm.elements.ideaName.focus(), 30);
// }

// function closeDrawer() {
//   els.drawer.classList.remove("open");
//   els.drawer.setAttribute("aria-hidden", "true");
//   els.drawerBackdrop.hidden = true;
// }

// async function saveCurrentCase(event) {
//   event.preventDefault();
//   const formData = new FormData(els.caseForm);
//   const record = recordFromForm(formData);

//   if (!record.ideaName) {
//     showToast("Business case idea is required.");
//     els.caseForm.elements.ideaName.focus();
//     return;
//   }

//   setBusy(true);
//   try {
//     if (state.mode === "sharepoint") {
//       const saved = record.id
//         ? await sharePointStore.updateItem(record)
//         : await sharePointStore.createItem(record);
//       upsertRecord(saved);
//     } else {
//       const saved = record.id ? localStore.updateItem(record) : localStore.createItem(record);
//       upsertRecord(saved);
//     }
//     closeDrawer();
//     els.caseForm.reset();
//     render();
//     showToast("Business case saved.");
//   } catch (error) {
//     console.error(error);
//     showToast(`Save failed: ${error.message}`);
//   } finally {
//     setBusy(false);
//   }
// }

// function recordFromForm(formData) {
//   const record = {};
//   Object.keys(CONFIG.fieldMap).forEach((key) => {
//     if (["created", "modified"].includes(key)) return;
//     const value = formData.get(key);
//     if (CONFIG.numberFields.has(key)) {
//       record[key] = value === "" || value === null ? null : Number(value);
//       return;
//     }
//     record[key] = value === null ? "" : String(value).trim();
//   });
//   record.id = formData.get("id") || "";
//   record.status = record.status || "Intake";
//   return record;
// }

// function upsertRecord(record) {
//   const index = state.records.findIndex((item) => String(item.id) === String(record.id));
//   if (index >= 0) {
//     state.records.splice(index, 1, record);
//   } else {
//     state.records.unshift(record);
//   }
// }

// function setBusy(isBusy) {
//   state.busy = isBusy;
//   document.body.classList.toggle("is-busy", isBusy);
// }

// function showToast(message) {
//   window.clearTimeout(state.toastTimer);
//   els.toast.textContent = message;
//   els.toast.classList.add("show");
//   state.toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 3600);
// }

// function exportCsv() {
//   const rows = getFilteredRecords();
//   const columns = [
//     ["ideaName", "Business case idea"],
//     ["status", "Status"],
//     ["owner", "Owner"],
//     ["department", "Department or GP"],
//     ["problemStatement", "Problem statement"],
//     ["scaleBusinessImpact", "Scale and business impact"],
//     ["currentWorkarounds", "Current workarounds failing"],
//     ["proposedSolution", "Innovation approach"],
//     ["mvpScope", "MVP scope"],
//     ["enabler", "Technology or process enabler"],
//     ["unfairAdvantage", "Unfair advantage"],
//     ["valueProposition", "Value proposition"],
//     ["costSavings", "Cost savings"],
//     ["efficiencyGain", "Efficiency gain %"],
//     ["paybackMonths", "Payback period months"],
//     ["activeUsers", "Active users"],
//     ["adoptionRate", "Adoption rate %"],
//     ["revenueImpact", "Revenue impact"],
//     ["cycleTimeReduction", "Cycle time reduction %"],
//     ["productivityUplift", "Productivity uplift %"],
//     ["scheduleImpact", "Schedule impact"],
//     ["goToMarketChannels", "Digital and direct sales channel"],
//     ["changeManagement", "Change management and training"],
//     ["rolloutPlan", "Phased rollout plan"],
//     ["toolsPlatformCharges", "Tools and platform charges"],
//     ["licenseCost", "License cost"],
//     ["developmentCost", "Development cost"],
//     ["supportMaintenanceCost", "Support and maintenance"],
//     ["recurringCostAvoidance", "Recurring cost avoidance"],
//     ["marginImprovement", "Margin improvement %"],
//     ["scalabilityNotes", "Scalable to all GPs"],
//     ["modified", "Updated"]
//   ];
//   const csv = [
//     columns.map(([, label]) => csvEscape(label)).join(","),
//     ...rows.map((record) => columns.map(([key]) => csvEscape(record[key])).join(","))
//   ].join("\r\n");
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `innovation-business-cases-${new Date().toISOString().slice(0, 10)}.csv`;
//   document.body.append(link);
//   link.click();
//   link.remove();
//   URL.revokeObjectURL(url);
// }

// const localStore = {
//   fetchItems() {
//     const raw = localStorage.getItem(CONFIG.storageKey);
//     return raw ? JSON.parse(raw) : [];
//   },
//   createItem(record) {
//     const now = new Date().toISOString();
//     const saved = { ...record, id: `local-${Date.now()}-${Math.random()}`, created: now, modified: now };
//     const records = [saved, ...this.fetchItems()];
//     this.save(records);
//     return saved;
//   },
//   updateItem(record) {
//     const now = new Date().toISOString();
//     const records = this.fetchItems();
//     const index = records.findIndex((item) => String(item.id) === String(record.id));
//     const previous = index >= 0 ? records[index] : {};
//     const saved = { ...previous, ...record, modified: now, created: previous.created || now };
//     if (index >= 0) records.splice(index, 1, saved);
//     this.save(records);
//     return saved;
//   },
//   save(records) {
//     localStorage.setItem(CONFIG.storageKey, JSON.stringify(records));
//   }
// };

// const sharePointStore = {
//   async fetchItems() {
//     const fields = getSharePointSelectFields();
//     const url = `${state.siteUrl}/_api/web/lists/getbytitle('${encodeODataLiteral(CONFIG.listTitle)}')/items?$select=${fields.join(",")}&$top=5000&$orderby=Modified desc`;
//     const response = await fetch(url, {
//       headers: { "Accept": "application/json;odata=nometadata" },
//       credentials: "same-origin"
//     });
//     await assertOk(response);
//     const data = await response.json();
//     return (data.value || []).map(fromSharePointItem);
//   },
//   async createItem(record) {
//     const response = await fetch(`${state.siteUrl}/_api/web/lists/getbytitle('${encodeODataLiteral(CONFIG.listTitle)}')/items`, {
//       method: "POST",
//       headers: await writeHeaders(),
//       credentials: "same-origin",
//       body: JSON.stringify(toSharePointPayload(record))
//     });
//     await assertOk(response);
//     return fromSharePointItem(await response.json());
//   },
//   async updateItem(record) {
//     const id = encodeURIComponent(record.id);
//     const response = await fetch(`${state.siteUrl}/_api/web/lists/getbytitle('${encodeODataLiteral(CONFIG.listTitle)}')/items(${id})`, {
//       method: "POST",
//       headers: {
//         ...(await writeHeaders()),
//         "IF-MATCH": "*",
//         "X-HTTP-Method": "MERGE"
//       },
//       credentials: "same-origin",
//       body: JSON.stringify(toSharePointPayload(record))
//     });
//     await assertOk(response);
//     await this.fetchItems().then((items) => {
//       state.records = items;
//     });
//     return state.records.find((item) => String(item.id) === String(record.id)) || record;
//   }
// };

// function getSharePointSelectFields() {
//   const fields = new Set(Object.values(CONFIG.fieldMap));
//   fields.add("Created");
//   fields.add("Modified");
//   return [...fields];
// }

// function toSharePointPayload(record) {
//   const payload = {};
//   Object.entries(CONFIG.fieldMap).forEach(([key, field]) => {
//     if (["id", "created", "modified"].includes(key)) return;
//     const value = record[key];
//     if (CONFIG.numberFields.has(key)) {
//       payload[field] = value === "" || value === null || Number.isNaN(value) ? null : Number(value);
//       return;
//     }
//     payload[field] = value || "";
//   });
//   return payload;
// }

// function fromSharePointItem(item) {
//   const record = {};
//   Object.entries(CONFIG.fieldMap).forEach(([key, field]) => {
//     record[key] = item[field] ?? "";
//   });
//   return record;
// }

// async function writeHeaders() {
//   return {
//     "Accept": "application/json;odata=nometadata",
//     "Content-Type": "application/json;odata=nometadata",
//     "X-RequestDigest": await getRequestDigest()
//   };
// }

// async function getRequestDigest() {
//   if (window._spPageContextInfo && window._spPageContextInfo.formDigestValue) {
//     return window._spPageContextInfo.formDigestValue;
//   }
//   const response = await fetch(`${state.siteUrl}/_api/contextinfo`, {
//     method: "POST",
//     headers: { "Accept": "application/json;odata=nometadata" },
//     credentials: "same-origin"
//   });
//   await assertOk(response);
//   const data = await response.json();
//   return data.FormDigestValue;
// }

// async function assertOk(response) {
//   if (response.ok) return;
//   let details = "";
//   try {
//     const data = await response.json();
//     details = data.error && data.error.message ? data.error.message : "";
//   } catch (error) {
//     details = await response.text().catch(() => "");
//   }
//   throw new Error(details || `${response.status} ${response.statusText}`);
// }

// function getSharePointSiteUrl() {
//   return CONFIG.siteUrl;
// }

// function encodeODataLiteral(value) {
//   return encodeURIComponent(String(value).replace(/'/g, "''"));
// }

// function sum(records, key) {
//   return records.reduce((total, record) => total + (Number(record[key]) || 0), 0);
// }

// function numbers(records, key) {
//   return records.map((record) => Number(record[key])).filter((value) => Number.isFinite(value) && value > 0);
// }

// function average(values) {
//   if (!values.length) return 0;
//   return values.reduce((total, value) => total + value, 0) / values.length;
// }

// function formatCurrency(value) {
//   const amount = Number(value) || 0;
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: amount >= 1000 ? 0 : 2
//   }).format(amount);
// }

// function formatPercent(value) {
//   if (value === "" || value === null || value === undefined) return "";
//   return `${formatNumber(Number(value), 1)}%`;
// }

// function formatMonths(value) {
//   if (value === "" || value === null || value === undefined) return "";
//   return `${formatNumber(Number(value), 0)} mo`;
// }

// function formatNumber(value, digits = 0) {
//   const number = Number(value) || 0;
//   return new Intl.NumberFormat("en-US", {
//     maximumFractionDigits: digits,
//     minimumFractionDigits: digits > 0 && Math.abs(number % 1) > 0 ? digits : 0
//   }).format(number);
// }

// function formatDate(value) {
//   if (!value) return "";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "";
//   return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
// }

// function escapeHtml(value) {
//   return String(value ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#39;");
// }

// function escapeAttribute(value) {
//   return escapeHtml(value).replace(/`/g, "&#96;");
// }

// function csvEscape(value) {
//   const text = value === null || value === undefined ? "" : String(value);
//   return `"${text.replace(/"/g, '""')}"`;
// }


// =============================================================================
//  Innovation Business Case Registry — app.js
//  SharePoint REST API backend
//  Folder: SiteAssets/innovation business case/
//  List:   OGC Innovation Business Case
// =============================================================================

const CONFIG = {
  listTitle: "OGC Innovation Business Case",
  storageKey: "ogcInnovationBusinessCases.v1",

  // Hardcoded — do NOT use window.location
  sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

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

  numberFields: new Set([
    "costSavings", "efficiencyGain", "paybackMonths", "activeUsers",
    "adoptionRate", "revenueImpact", "cycleTimeReduction", "productivityUplift",
    "toolsPlatformCharges", "licenseCost", "developmentCost",
    "supportMaintenanceCost", "recurringCostAvoidance", "marginImprovement"
  ])
};


// ── State ─────────────────────────────────────────────────────────────────────
const state = {
  records:    [],
  mode:       "connecting",
  siteUrl:    CONFIG.sharePointSiteUrl,
  search:     "",
  statusFilter: "All",
  busy:       false,
  toastTimer: 0
};

const els = {};

document.addEventListener("DOMContentLoaded", init);

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  cacheElements();
  bindEvents();
  await loadRecords();
  render();
}

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
  els.newCaseButton.addEventListener("click",     ()  => openDrawer());
  els.closeDrawerButton.addEventListener("click", closeDrawer);
  els.cancelButton.addEventListener("click",      closeDrawer);
  els.drawerBackdrop.addEventListener("click",    closeDrawer);
  els.exportButton.addEventListener("click",      exportCsv);
  els.caseForm.addEventListener("submit",         saveCurrentCase);

  els.searchInput.addEventListener("input", e => {
    state.search = e.target.value.trim().toLowerCase();
    renderTable();
  });
  els.statusFilter.addEventListener("change", e => {
    state.statusFilter = e.target.value;
    renderTable();
  });
  els.refreshButton.addEventListener("click", async () => {
    await loadRecords(true);
    render();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && els.drawer.classList.contains("open")) closeDrawer();
  });
}

// ── Data ──────────────────────────────────────────────────────────────────────
async function loadRecords(manual = false) {
  setBusy(true);
  try {
    state.records = await sharePointStore.fetchItems();
    state.mode    = "sharepoint";
    if (manual) showToast("✓ SharePoint list refreshed.");
  } catch (err) {
    console.error("SharePoint fetch failed:", err);
    state.records = localStore.fetchItems();
    state.mode    = "local-warning";
    showToast("⚠ Could not reach SharePoint. Showing local data.");
  } finally {
    setBusy(false);
  }
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  renderBadge();
  renderSummaries();
  renderTable();
}

function renderBadge() {
  const b = els.connectionBadge;
  if (state.mode === "sharepoint") {
    b.textContent = "SharePoint List connected";
    b.classList.remove("warning");
  } else {
    b.textContent = state.mode === "local-warning"
      ? "⚠ List unavailable – local mode"
      : "Local test mode";
    b.classList.add("warning");
  }
}

function renderSummaries() {
  const f = filtered();
  els.summaryTotal.textContent      = f.length;
  els.summarySavings.textContent    = fmt$(sum(f, "costSavings"));
  els.summaryEfficiency.textContent = `${fmtN(avg(nums(f,"efficiencyGain")),1)}%`;
  els.summaryPayback.textContent    = `${fmtN(avg(nums(f,"paybackMonths")),0)} mo`;
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
      <td><span class="status-pill" data-status="${esc(r.status||"Intake")}">${esc(r.status||"Intake")}</span></td>
      <td>${esc(r.owner||"")}</td>
      <td class="text-cell">${esc(r.valueProposition||"")}</td>
      <td class="number-cell">${fmt$(r.costSavings)}</td>
      <td class="number-cell">${fmtPct(r.efficiencyGain)}</td>
      <td class="number-cell">${fmtMo(r.paybackMonths)}</td>
      <td class="number-cell">${fmtPct(r.adoptionRate)}</td>
      <td class="number-cell">${fmt$(r.revenueImpact)}</td>
      <td class="number-cell">${fmtDate(r.modified||r.created)}</td>
      <td class="action-col">
        <button class="icon-button row-action" type="button"
          title="Edit" aria-label="Edit ${escAttr(r.ideaName||"case")}"
          data-edit-id="${escAttr(r.id)}">
          <svg><use href="#icon-edit"></use></svg>
        </button>
      </td>
    </tr>`).join("");

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
    .filter(r => !q || [r.ideaName,r.owner,r.department,r.status,
                         r.problemStatement,r.valueProposition,r.proposedSolution]
      .some(v => String(v||"").toLowerCase().includes(q)))
    .sort((a,b) => new Date(b.modified||b.created||0) - new Date(a.modified||a.created||0));
}

// ── Drawer ────────────────────────────────────────────────────────────────────
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

// ── Save ──────────────────────────────────────────────────────────────────────
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
    let saved;
    if (state.mode === "sharepoint") {
      saved = record.id
        ? await sharePointStore.updateItem(record)
        : await sharePointStore.createItem(record);
      showToast("✓ Saved to SharePoint.");
    } else {
      saved = record.id
        ? localStore.updateItem(record)
        : localStore.createItem(record);
      showToast("Saved locally (SharePoint unavailable).");
    }
    upsert(saved);
    closeDrawer();
    els.caseForm.reset();
    render();
  } catch (err) {
    console.error("Save failed:", err);
    showToast(`Save failed: ${err.message}`);
  } finally {
    setBusy(false);
  }
}

function formToRecord(fd) {
  const rec = {};
  Object.keys(CONFIG.fieldMap).forEach(key => {
    if (["created","modified"].includes(key)) return;
    const val = fd.get(key);
    rec[key] = CONFIG.numberFields.has(key)
      ? (val === "" || val === null ? null : Number(val))
      : (val === null ? "" : String(val).trim());
  });
  rec.id     = fd.get("id") || "";
  rec.status = rec.status || "Intake";
  return rec;
}

function upsert(record) {
  const i = state.records.findIndex(x => String(x.id) === String(record.id));
  i >= 0 ? state.records.splice(i, 1, record) : state.records.unshift(record);
}

// ── CSV export ────────────────────────────────────────────────────────────────
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
  const csv  = [
    cols.map(([,l]) => csvQ(l)).join(","),
    ...rows.map(r => cols.map(([k]) => csvQ(r[k])).join(","))
  ].join("\r\n");

  const a = Object.assign(document.createElement("a"), {
    href:     URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"})),
    download: `innovation-cases-${new Date().toISOString().slice(0,10)}.csv`
  });
  document.body.append(a); a.click(); a.remove();
}

// ── Local storage fallback ────────────────────────────────────────────────────
const localStore = {
  all()   { try { return JSON.parse(localStorage.getItem(CONFIG.storageKey)||"[]"); } catch { return []; } },
  save(r) { localStorage.setItem(CONFIG.storageKey, JSON.stringify(r)); },
  fetchItems() { return this.all(); },
  createItem(rec) {
    const now = new Date().toISOString();
    const saved = {...rec, id:`local-${Date.now()}`, created:now, modified:now};
    this.save([saved, ...this.all()]);
    return saved;
  },
  updateItem(rec) {
    const now  = new Date().toISOString();
    const recs = this.all();
    const i    = recs.findIndex(x => String(x.id) === String(rec.id));
    const prev = i >= 0 ? recs[i] : {};
    const saved = {...prev, ...rec, modified:now, created:prev.created||now};
    if (i >= 0) recs.splice(i, 1, saved);
    this.save(recs);
    return saved;
  }
};

// ── SharePoint REST ───────────────────────────────────────────────────────────
const sharePointStore = {

  async fetchItems() {
    const select = [...new Set([...Object.values(CONFIG.fieldMap),"Id","Created","Modified"])];
    const url = `${state.siteUrl}/_api/web/lists/getbytitle('${spTitle(CONFIG.listTitle)}')/items` +
                `?$select=${select.join(",")}&$top=5000&$orderby=Modified desc`;

    const res = await fetch(url, {
      headers:     { "Accept": "application/json;odata=nometadata" },
      credentials: "same-origin"
    });
    await ok(res);
    const data = await res.json();
    return (data.value || []).map(spToRec);
  },

  async createItem(record) {
    const url = `${state.siteUrl}/_api/web/lists/getbytitle('${spTitle(CONFIG.listTitle)}')/items`;
    const res = await fetch(url, {
      method:      "POST",
      headers:     await hdrs(),
      credentials: "same-origin",
      body:        JSON.stringify(recToSp(record))
    });
    await ok(res);
    let item = null;
    try { item = await res.json(); } catch { item = null; }
    if (item) return spToRec(item);
    // fallback: re-fetch and return newest
    const all = await this.fetchItems();
    state.records = all;
    return all[0] || record;
  },

  async updateItem(record) {
    const url = `${state.siteUrl}/_api/web/lists/getbytitle('${spTitle(CONFIG.listTitle)}')/items(${Number(record.id)})`;
    const res = await fetch(url, {
      method:      "POST",
      headers:     { ...(await hdrs()), "IF-MATCH": "*", "X-HTTP-Method": "MERGE" },
      credentials: "same-origin",
      body:        JSON.stringify(recToSp(record))
    });
    await ok(res);
    const all = await this.fetchItems();
    state.records = all;
    return all.find(x => String(x.id) === String(record.id)) || record;
  }
};

// ── SharePoint helpers ────────────────────────────────────────────────────────
function recToSp(record) {
  const p = {};
  Object.entries(CONFIG.fieldMap).forEach(([key, field]) => {
    if (["id","created","modified"].includes(key)) return;
    const v = record[key];
    p[field] = CONFIG.numberFields.has(key)
      ? (v === "" || v == null || isNaN(Number(v)) ? null : Number(v))
      : (v ?? "");
  });
  return p;
}

function spToRec(item) {
  const rec = {};
  Object.entries(CONFIG.fieldMap).forEach(([key, field]) => {
    rec[key] = item[field] ?? "";
  });
  rec.id       = item.Id  ?? item.ID  ?? "";
  rec.created  = item.Created  ?? "";
  rec.modified = item.Modified ?? "";
  return rec;
}

async function hdrs() {
  return {
    "Accept":          "application/json;odata=nometadata",
    "Content-Type":    "application/json;odata=nometadata",
    "X-RequestDigest": await digest()
  };
}

async function digest() {
  // 1. Classic SharePoint __REQUESTDIGEST hidden input (full .aspx pages)
  const el = document.getElementById("__REQUESTDIGEST");
  if (el?.value) return el.value;

  // 2. Try parent frame (same-origin SharePoint iframe host pages)
  try {
    const p = window.parent?.document?.getElementById("__REQUESTDIGEST");
    if (p?.value) return p.value;
  } catch { /* cross-origin parent – ignore */ }

  // 3. Fetch fresh digest from contextinfo
  const res = await fetch(`${state.siteUrl}/_api/contextinfo`, {
    method:      "POST",
    headers:     { "Accept": "application/json;odata=nometadata" },
    credentials: "same-origin"
  });
  await ok(res);
  return (await res.json()).FormDigestValue;
}

async function ok(res) {
  if (res.ok) return;
  let msg = "";
  try { msg = await res.text(); } catch { msg = ""; }
  throw new Error(msg || `HTTP ${res.status} ${res.statusText}`);
}

function spTitle(v) { return String(v).replace(/'/g, "''"); }

// ── UI helpers ────────────────────────────────────────────────────────────────
function setBusy(v) { state.busy = v; document.body.classList.toggle("is-busy", v); }

function showToast(msg) {
  clearTimeout(state.toastTimer);
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 3800);
}

// ── Math helpers ──────────────────────────────────────────────────────────────
const sum  = (recs,k) => recs.reduce((t,r) => t + (Number(r[k])||0), 0);
const nums = (recs,k) => recs.map(r => Number(r[k])).filter(v => isFinite(v) && v > 0);
const avg  = vals    => vals.length ? vals.reduce((t,v) => t+v, 0)/vals.length : 0;

// ── Formatters ────────────────────────────────────────────────────────────────
function fmt$(v) {
  const n = Number(v)||0;
  return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",
    maximumFractionDigits: n>=1000?0:2}).format(n);
}
const fmtPct  = v => (v===""||v==null) ? "" : `${fmtN(Number(v),1)}%`;
const fmtMo   = v => (v===""||v==null) ? "" : `${fmtN(Number(v),0)} mo`;
function fmtN(v, d=0) {
  const n=Number(v)||0;
  return new Intl.NumberFormat("en-US",{
    maximumFractionDigits:d,
    minimumFractionDigits:d>0&&Math.abs(n%1)>0?d:0
  }).format(n);
}
function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d) ? "" : new Intl.DateTimeFormat("en-US",
    {month:"short",day:"numeric",year:"numeric"}).format(d);
}

// ── Escape helpers ────────────────────────────────────────────────────────────
function esc(v) {
  return String(v??"")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function escAttr(v) { return esc(v).replace(/`/g,"&#96;"); }
function csvQ(v) { const t=v==null?"":String(v); return `"${t.replace(/"/g,'""')}"`; }