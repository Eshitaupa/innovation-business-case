

// const CONFIG = {
//   listTitle: "OGC Innovation Business Case",
//   storageKey: "ogcInnovationBusinessCases.v1",

//   sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

//   listFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/de240397094f4fe39a610c6a0a4d5997/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gJM20WCbDMWgARxFc6pbnqc6oq9cpX5Pw-aLgpp5a-s",

//   saveFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f44390bc94a847d29342ab85b1b8ec2d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SkMtR9vKtj7Mf07QWgksvnK8m1OUKOJR4D7TGiZt9bg",

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
//   ]),

//   // Hardcoded fallbacks — used only if the flow doesn't return choices
//   fallbackChoices: {
//     department: ["OGC"],
//     status: ["Intake", "Reviewing", "MVP", "Scaling", "On hold"]
//   }
// };

// // ---------------------------------------------------------------------------
// // STATE
// // ---------------------------------------------------------------------------
// const state = {
//   records: [],
//   choices: {
//     department: [],
//     status: []
//   },
//   mode: "connecting",
//   search: "",
//   statusFilter: "All",
//   busy: false,
//   toastTimer: 0
// };

// const els = {};

// // ---------------------------------------------------------------------------
// // BOOT
// // ---------------------------------------------------------------------------
// document.addEventListener("DOMContentLoaded", init);

// async function init() {
//   cacheElements();
//   bindEvents();

//   // Single flow call — returns both items AND choices
//   await loadFromFlow();

//   populateDropdowns();
//   render();
// }

// // ---------------------------------------------------------------------------
// // MAIN DATA LOAD  (one round-trip for everything)
// // ---------------------------------------------------------------------------
// async function loadFromFlow() {
//   setBusy(true);
//   try {
//     const res = await fetch(CONFIG.listFlowUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({})
//     });

//     if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);

//     const data = await res.json();
//     console.log("Flow response:", data);
//     console.log("Status choices:", data?.choices?.status);
// console.log("Department choices:", data?.choices?.department);
// console.log("Is status array?", Array.isArray(data?.choices?.status));
// console.log("Is dept array?", Array.isArray(data?.choices?.department));

//     // ── Extract choices ──────────────────────────────────────────────────
//     // Preferred: flow returns { items: [...], choices: { status: [...], department: [...] } }
//     // Fallback A: derive unique values from the records themselves
//     // Fallback B: hardcoded constants

//     if (data.choices && Array.isArray(data.choices.status) && data.choices.status.length) {
//       state.choices.status     = data.choices.status;
//       state.choices.department = Array.isArray(data.choices.department)
//         ? data.choices.department
//         : CONFIG.fallbackChoices.department;
//       console.log("✓ Choices from flow:", state.choices);
//     } else {
//       // Flow hasn't been updated yet — derive from records
//       const rows = extractRows(data);
//       state.choices.status     = uniqueChoices(rows, "field_3") || CONFIG.fallbackChoices.status;
//       state.choices.department = uniqueChoices(rows, "field_2") || CONFIG.fallbackChoices.department;
//       console.warn("⚠ Choices derived from records (update the flow for full list):", state.choices);
//     }

//     // ── Extract records ──────────────────────────────────────────────────
//     const rows = extractRows(data);
//     state.records = rows.map(mapItem);
//     state.mode = "flow";

//   } catch (err) {
//     console.error("Flow load failed:", err);
//     state.records = [];
//     state.choices = { ...CONFIG.fallbackChoices };
//     state.mode = "error";
//     showToast("⚠ Could not load SharePoint data — " + err.message);
//   } finally {
//     setBusy(false);
//   }
// }

// // Reload only records (after save) — reuses the same flow
// async function reloadRecords() {
//   setBusy(true);
//   try {
//     const res = await fetch(CONFIG.listFlowUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({})
//     });
//     if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);
//     const data = await res.json();
//     const rows = extractRows(data);
//     state.records = rows.map(mapItem);
//     state.mode = "flow";
//   } catch (err) {
//     console.error("Reload failed:", err);
//     showToast("⚠ Could not refresh data");
//   } finally {
//     setBusy(false);
//   }
// }

// // ---------------------------------------------------------------------------
// // HELPERS — data extraction
// // ---------------------------------------------------------------------------
// function extractRows(data) {
//   if (Array.isArray(data))        return data;
//   if (Array.isArray(data.items))  return data.items;
//   if (Array.isArray(data.value))  return data.value;
//   return [];
// }

// function uniqueChoices(rows, field) {
//   const vals = [...new Set(rows.map(r => choiceText(r[field])).filter(Boolean))].sort();
//   return vals.length ? vals : null;
// }

// function mapItem(item) {
//   return {
//     id:                     item.Id   || item.ID   || "",
//     ideaName:               item.Title || "",
//     owner:                  item.field_1  || "",
//     department:             choiceText(item.field_2),
//     status:                 choiceText(item.field_3) || "Intake",
//     problemStatement:       item.field_4  || "",
//     scaleBusinessImpact:    item.field_5  || "",
//     currentWorkarounds:     item.field_6  || "",
//     proposedSolution:       item.field_7  || "",
//     mvpScope:               item.field_8  || "",
//     enabler:                item.field_9  || "",
//     unfairAdvantage:        item.field_10 || "",
//     valueProposition:       item.field_11 || "",
//     costSavings:            numOrZero(item.field_12),
//     efficiencyGain:         numOrZero(item.field_13),
//     paybackMonths:          numOrZero(item.field_14),
//     activeUsers:            numOrZero(item.field_15),
//     adoptionRate:           numOrZero(item.field_16),
//     revenueImpact:          numOrZero(item.field_17),
//     cycleTimeReduction:     numOrZero(item.field_18),
//     productivityUplift:     numOrZero(item.field_19),
//     scheduleImpact:         item.field_20 || "",
//     goToMarketChannels:     item.field_21 || "",
//     changeManagement:       item.field_22 || "",
//     rolloutPlan:            item.field_23 || "",
//     toolsPlatformCharges:   numOrZero(item.field_24),
//     licenseCost:            numOrZero(item.field_25),
//     developmentCost:        numOrZero(item.field_26),
//     supportMaintenanceCost: numOrZero(item.field_27),
//     recurringCostAvoidance: numOrZero(item.field_28),
//     marginImprovement:      numOrZero(item.field_29),
//     scalabilityNotes:       item.field_30 || "",
//     created:                item.Created  || "",
//     modified:               item.Modified || ""
//   };
// }

// // ---------------------------------------------------------------------------
// // DROPDOWNS
// // ---------------------------------------------------------------------------
// function populateDropdowns() {
//   const deptSelect   = document.querySelector('select[name="department"]');
//   const formStatus   = document.querySelector('select[name="status"]');
//   const filterStatus = document.getElementById("statusFilter");

//   // Clear existing
//   if (deptSelect)   deptSelect.innerHTML   = "";
//   if (formStatus)   formStatus.innerHTML   = "";
//   if (filterStatus) filterStatus.innerHTML = '<option value="All">All statuses</option>';

//   // Department
//   state.choices.department.forEach(choice => {
//     if (!choice) return;
//     const opt = document.createElement("option");
//     opt.value = choice;
//     opt.textContent = choice;
//     deptSelect?.appendChild(opt);
//   });

//   // Status (form + filter)
//   state.choices.status.forEach(choice => {
//     if (!choice) return;

//     const o1 = document.createElement("option");
//     o1.value = choice; o1.textContent = choice;
//     formStatus?.appendChild(o1);

//     const o2 = document.createElement("option");
//     o2.value = choice; o2.textContent = choice;
//     filterStatus?.appendChild(o2);
//   });

//   console.log("Dropdowns populated — dept:", state.choices.department, "| status:", state.choices.status);
// }

// // ---------------------------------------------------------------------------
// // ELEMENT CACHE & EVENTS
// // ---------------------------------------------------------------------------
// function cacheElements() {
//   [
//     "connectionBadge", "refreshButton", "exportButton", "newCaseButton",
//     "caseRows", "searchInput", "statusFilter", "summaryTotal", "summarySavings",
//     "summaryEfficiency", "summaryPayback", "drawerBackdrop", "closeDrawerButton",
//     "cancelButton", "caseForm", "drawerTitle", "saveButton", "toast"
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
//     await reloadRecords();
//     render();
//   });

//   document.addEventListener("keydown", e => {
//     if (e.key === "Escape" && els.drawer.classList.contains("open")) closeDrawer();
//   });

//   // Prevent scroll from changing number inputs
//   document.addEventListener("wheel", e => {
//     if (document.activeElement.type === "number") e.preventDefault();
//   }, { passive: false });
// }

// // ---------------------------------------------------------------------------
// // RENDER
// // ---------------------------------------------------------------------------
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
//   els.summaryTotal.textContent      = f.length;
//   els.summarySavings.textContent    = fmt$(sum(f, "costSavings"));
//   els.summaryEfficiency.textContent = `${fmtN(avg(nums(f, "efficiencyGain")), 1)}%`;
//   els.summaryPayback.textContent    = `${fmtN(avg(nums(f, "paybackMonths")), 0)} mo`;
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

// // ---------------------------------------------------------------------------
// // DRAWER
// // ---------------------------------------------------------------------------
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
//     // Default status to first choice or "Intake"
//     const firstStatus = state.choices.status[0] || "Intake";
//     if (els.caseForm.elements.status) els.caseForm.elements.status.value = firstStatus;
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

// // ---------------------------------------------------------------------------
// // SAVE
// // ---------------------------------------------------------------------------
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
//     await saveViaFlow(record);
//     await reloadRecords();
//     closeDrawer();
//     els.caseForm.reset();
//     render();
//     showToast(record.id ? "✓ Updated in SharePoint." : "✓ Saved to SharePoint.");
//   } catch (err) {
//     console.error("Save failed:", err);
//     showToast(`Save failed: ${err.message}`);
//   } finally {
//     setBusy(false);
//   }
// }

// async function saveViaFlow(record) {
//   const payload = buildSharePointPayload(record);
//   console.log("Saving payload:", payload);

//   const res = await fetch(CONFIG.saveFlowUrl, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   });

//   let responseText = "";
//   try { responseText = await res.text(); } catch {}

//   if (!res.ok) {
//     throw new Error(`HTTP ${res.status}${responseText ? ": " + responseText : ""}`);
//   }

//   try { return responseText ? JSON.parse(responseText) : {}; }
//   catch { return {}; }
// }

// function buildSharePointPayload(record) {
//   const payload = {
//     operation: record.id ? "update" : "create",
//     id: record.id ? String(record.id) : ""
//   };

//   Object.entries(CONFIG.fieldMap).forEach(([jsKey, spField]) => {
//     if (["created", "modified", "id"].includes(jsKey)) return;

//     const val = record[jsKey];
//     if (val === "" || val === null || val === undefined) return;

//     if (CONFIG.numberFields.has(jsKey)) {
//       const num = Number(val);
//       if (!Number.isNaN(num)) payload[spField] = num;
//     } else {
//       payload[spField] = String(val).trim();
//     }
//   });

//   return payload;
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
//   rec.id     = fd.get("id") || "";
//   rec.status = rec.status || state.choices.status[0] || "Intake";
//   return rec;
// }

// // ---------------------------------------------------------------------------
// // EXPORT CSV
// // ---------------------------------------------------------------------------
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
//     cols.map(([, l]) => csvQ(l)).join(","),
//     ...rows.map(r => cols.map(([k]) => csvQ(r[k])).join(","))
//   ].join("\r\n");

//   const a = Object.assign(document.createElement("a"), {
//     href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })),
//     download: `innovation-cases-${new Date().toISOString().slice(0, 10)}.csv`
//   });
//   document.body.append(a);
//   a.click();
//   a.remove();
// }

// // ---------------------------------------------------------------------------
// // HELPERS
// // ---------------------------------------------------------------------------
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

// function numOrZero(v) {
//   return v === "" || v == null || isNaN(Number(v)) ? 0 : Number(v);
// }

// function choiceText(v) {
//   if (v == null) return "";
//   if (typeof v === "string") return v;
//   if (typeof v === "object") return v.Value || v.value || v.Label || v.label || "";
//   return String(v);
// }

// const sum  = (recs, k) => recs.reduce((t, r) => t + (Number(r[k]) || 0), 0);
// const nums = (recs, k) => recs.map(r => Number(r[k])).filter(v => isFinite(v) && v > 0);
// const avg  = vals => vals.length ? vals.reduce((t, v) => t + v, 0) / vals.length : 0;

// function fmt$(v) {
//   const n = Number(v) || 0;
//   return new Intl.NumberFormat("en-US", {
//     style: "currency", currency: "USD",
//     maximumFractionDigits: n >= 1000 ? 0 : 2
//   }).format(n);
// }

// const fmtPct = v => (v === "" || v == null) ? "" : `${fmtN(Number(v), 1)}%`;
// const fmtMo  = v => (v === "" || v == null) ? "" : `${fmtN(Number(v), 0)} mo`;

// function fmtN(v, d = 0) {
//   const n = Number(v) || 0;
//   return new Intl.NumberFormat("en-US", {
//     maximumFractionDigits: d,
//     minimumFractionDigits: d > 0 && Math.abs(n % 1) > 0 ? d : 0
//   }).format(n);
// }

// function fmtDate(v) {
//   if (!v) return "";
//   const d = new Date(v);
//   return isNaN(d) ? "" : new Intl.DateTimeFormat("en-US", {
//     month: "short", day: "numeric", year: "numeric"
//   }).format(d);
// }

// function esc(v) {
//   return String(v ?? "")
//     .replace(/&/g, "&amp;").replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
//     .replace(/'/g, "&#39;");
// }

// function escAttr(v) { return esc(v).replace(/`/g, "&#96;"); }

// function csvQ(v) {
//   const t = v == null ? "" : String(v);
//   return `"${t.replace(/"/g, '""')}"`;
// }
// =============================================================================
// CONFIG
// =============================================================================
// =============================================================================
// CONFIG
// =============================================================================
// =============================================================================
// CONFIG
// =============================================================================
const CONFIG = {
  listTitle: "OGC Innovation Business Case",
  sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

  listFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/de240397094f4fe39a610c6a0a4d5997/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gJM20WCbDMWgARxFc6pbnqc6oq9cpX5Pw-aLgpp5a-s",

  saveFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f44390bc94a847d29342ab85b1b8ec2d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SkMtR9vKtj7Mf07QWgksvnK8m1OUKOJR4D7TGiZt9bg",

  fieldMap: {
    id:                     "Id",
    ideaName:               "Title",
    department:             "field_2",
    problemStatement:       "field_4",
    currentWorkarounds:     "field_6",
    proposedSolution:       "field_7",
    mvpScope:               "field_8",
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
    confidenceLevel:        "Confidence_x0020_Level",
    created:                "Created",
    modified:               "Modified"
  },

  numberFields: new Set([
    "costSavings","efficiencyGain","paybackMonths","activeUsers","adoptionRate",
    "revenueImpact","cycleTimeReduction","productivityUplift","scheduleImpact",
    "toolsPlatformCharges","licenseCost","developmentCost","supportMaintenanceCost",
    "recurringCostAvoidance","marginImprovement"
  ]),

  richTextFields: new Set([
    "problemStatement","currentWorkarounds","proposedSolution","mvpScope",
    "valueProposition","goToMarketChannels","changeManagement","rolloutPlan","scalabilityNotes"
  ]),

  richTextLimits: {
    problemStatement:   2000,
    currentWorkarounds: 2000,
    proposedSolution:   3000,
    mvpScope:           2000,
    valueProposition:   3000,
    goToMarketChannels: 2000,
    changeManagement:   2000,
    rolloutPlan:        2000,
    scalabilityNotes:   2000
  },

  // Fields that must be 0-100
  percentFields: new Set([
    "efficiencyGain","adoptionRate","cycleTimeReduction",
    "scheduleImpact","productivityUplift","marginImprovement"
  ]),

  fallbackChoices: {
    department: [""],
    confidenceLevel: ["High", "Moderate", "Low"]
  }
};

// =============================================================================
// STATE
// =============================================================================
const state = {
  records:        [],
  allUsers:       [],
  choices: { department: [], confidenceLevel: [] },
  mode:           "connecting",
  search:         "",
  busy:           false,
  toastTimer:     0,
  selectedPerson: null,
  caseWindow:     null   // reference to the popup window
};

const els = {};

// =============================================================================
// BOOT
// =============================================================================
document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  bindEvents();
  await loadFromFlow();
  populateDropdowns();
  buildPeopleSelect();
  render();
}

// =============================================================================
// DATA LOAD
// =============================================================================
async function loadFromFlow() {
  setBusy(true);
  try {
    const res = await fetch(CONFIG.listFlowUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);
    const data = await res.json();

    if (data.choices) {
      state.choices.confidenceLevel =
        Array.isArray(data.choices.confidenceLevel) && data.choices.confidenceLevel.length
          ? data.choices.confidenceLevel : [...CONFIG.fallbackChoices.confidenceLevel];
      state.choices.department =
        Array.isArray(data.choices.department) && data.choices.department.length
          ? data.choices.department : [...CONFIG.fallbackChoices.department];
    } else {
      const rows = extractRows(data);
      state.choices.department     = uniqueChoices(rows, "field_2") || [...CONFIG.fallbackChoices.department];
      state.choices.confidenceLevel = uniqueChoices(rows, "Confidence_x0020_Level") || [...CONFIG.fallbackChoices.confidenceLevel];
    }

    state.allUsers = Array.isArray(data.users) ? data.users.filter(u => u.Email) : [];
    state.records  = extractRows(data).map(mapItem);
    state.mode     = "flow";
  } catch (err) {
    console.error("Flow load failed:", err);
    state.records  = [];
    state.allUsers = [];
    state.choices  = {
      department:     [...CONFIG.fallbackChoices.department],
      confidenceLevel: [...CONFIG.fallbackChoices.confidenceLevel]
    };
    state.mode = "error";
    showToast("⚠ Could not load SharePoint data — " + err.message);
  } finally {
    setBusy(false);
  }
}

async function reloadRecords() {
  setBusy(true);
  try {
    const res = await fetch(CONFIG.listFlowUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);
    const data    = await res.json();
    state.records = extractRows(data).map(mapItem);
    state.mode    = "flow";
  } catch (err) {
    console.error("Reload failed:", err);
    showToast("⚠ Could not refresh data");
  } finally {
    setBusy(false);
  }
}

// =============================================================================
// DATA HELPERS
// =============================================================================
function extractRows(data) {
  if (Array.isArray(data))       return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.value)) return data.value;
  return [];
}

function uniqueChoices(rows, field) {
  const vals = [...new Set(rows.map(r => choiceText(r[field])).filter(Boolean))].sort();
  return vals.length ? vals : null;
}

function mapItem(item) {
  const p = item.person || item.Person || null;
  return {
    id:                     item.Id    || item.ID   || "",
    ideaName:               item.Title || item.title || "",
    personDisplayName:      p?.DisplayName || p?.displayName || "",
    personEmail:            p?.Email       || p?.email       || "",
    personClaims:           p?.Claims      || p?.claims      || "",
    department:             choiceText(item.field_2),
    problemStatement:       item.field_4  || "",
    scaleBusinessImpact:    item.field_5  || "",
    currentWorkarounds:     item.field_6  || "",
    proposedSolution:       item.field_7  || "",
    mvpScope:               item.field_8  || "",
    enabler:                item.field_9  || "",
    unfairAdvantage:        item.field_10 || "",
    valueProposition:       item.field_11 || "",
    costSavings:            numOrZero(item.field_12),
    efficiencyGain:         numOrZero(item.field_13),
    paybackMonths:          numOrZero(item.field_14),
    activeUsers:            numOrZero(item.field_15),
    adoptionRate:           numOrZero(item.field_16),
    revenueImpact:          numOrZero(item.field_17),
    cycleTimeReduction:     numOrZero(item.field_18),
    productivityUplift:     numOrZero(item.field_19),
    scheduleImpact:         numOrZero(item.field_20),
    goToMarketChannels:     item.field_21 || "",
    changeManagement:       item.field_22 || "",
    rolloutPlan:            item.field_23 || "",
    toolsPlatformCharges:   numOrZero(item.field_24),
    licenseCost:            numOrZero(item.field_25),
    developmentCost:        numOrZero(item.field_26),
    supportMaintenanceCost: numOrZero(item.field_27),
    recurringCostAvoidance: numOrZero(item.field_28),
    marginImprovement:      numOrZero(item.field_29),
    scalabilityNotes:       item.field_30 || "",
    confidenceLevel:        choiceText(item.Confidence_x0020_Level),
    created:                item.Created  || "",
    modified:               item.Modified || ""
  };
}

// =============================================================================
// POPUP WINDOW — opens case form in a real separate window
// =============================================================================
function openCaseWindow(record) {
  // Build the full form HTML as a self-contained page
  const html = buildCaseWindowHTML(record);
  const blob  = new Blob([html], { type: "text/html" });
  const url   = URL.createObjectURL(blob);

  const w = 960, h = window.screen.availHeight;
  const left = Math.round((window.screen.availWidth - w) / 2);
  const win  = window.open(url, "caseForm_" + Date.now(),
    `width=${w},height=${h},left=${left},top=0,resizable=yes,scrollbars=yes`);

  if (!win) {
    showToast("⚠ Pop-up blocked — please allow pop-ups for this site.");
    return;
  }
  state.caseWindow = win;

  // Listen for save/cancel messages from the popup
  window.addEventListener("message", onCaseWindowMessage);
}

function onCaseWindowMessage(e) {
  if (e.data?.type === "CASE_SAVED") {
    reloadRecords().then(render);
    showToast(e.data.isNew ? "✓ Saved to SharePoint." : "✓ Updated in SharePoint.");
    window.removeEventListener("message", onCaseWindowMessage);
  }
  if (e.data?.type === "CASE_CLOSED") {
    window.removeEventListener("message", onCaseWindowMessage);
  }
}

// =============================================================================
// BUILD POPUP HTML — fully self-contained page with embedded CSS + JS
// =============================================================================
function buildCaseWindowHTML(record) {
  const isEdit  = !!record;
  const title   = isEdit ? "Edit innovation case" : "New innovation case";
  const fv      = (k) => record ? (record[k] ?? "") : "";
  const fvN     = (k) => record ? (record[k] || "") : "";

  // Serialise all data the popup needs
  const popupData = JSON.stringify({
    record:         record || null,
    allUsers:       state.allUsers,
    choices:        state.choices,
    saveFlowUrl:    CONFIG.saveFlowUrl,
    fieldMap:       CONFIG.fieldMap,
    numberFields:   [...CONFIG.numberFields],
    richTextFields: [...CONFIG.richTextFields],
    richTextLimits: CONFIG.richTextLimits,
    percentFields:  [...CONFIG.percentFields]
  });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
:root{
  --accent:#155bb5;--accent-strong:#0e3e85;--accent-soft:#e6effc;
  --ink:#0f1c2e;--muted:#6b7c93;--line:#d6e0f0;--panel:#fff;
  --danger:#b42318;--danger-soft:#fff1f0;--danger-line:#fca5a5;
  --bg:#f4f7fb;
}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{min-height:100%;background:var(--bg);color:var(--ink);font-family:"Segoe UI",Arial,sans-serif;font-size:14px;}
body{display:flex;flex-direction:column;}
header{background:#fff;border-bottom:1px solid var(--line);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;}
header h1{font-size:20px;font-weight:700;}
.hdr-actions{display:flex;gap:10px;}
main{flex:1;padding:24px;max-width:900px;width:100%;margin:0 auto;}
footer{background:#fff;border-top:1px solid var(--line);padding:14px 24px;display:flex;justify-content:flex-end;gap:12px;position:sticky;bottom:0;}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 16px;border-radius:8px;border:1px solid var(--line);background:#fff;color:var(--ink);font:inherit;font-weight:600;cursor:pointer;transition:background 120ms,border-color 120ms;}
.btn:hover{background:var(--accent-soft);border-color:var(--accent);color:var(--accent-strong);}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff;}
.btn.primary:hover{background:var(--accent-strong);border-color:var(--accent-strong);}

/* form */
.section{background:#fff;border:1px solid var(--line);border-radius:10px;padding:20px;margin-bottom:16px;}
.section h2{font-size:15px;font-weight:700;margin-bottom:14px;color:var(--accent-strong);}
.grid{display:grid;gap:12px;}
.grid.two{grid-template-columns:repeat(2,minmax(0,1fr));}
.grid.three{grid-template-columns:repeat(3,minmax(0,1fr));}
label{display:flex;flex-direction:column;gap:5px;}
label>span{font-size:12px;font-weight:700;color:#3f4d48;text-transform:uppercase;letter-spacing:.3px;}
input,select,textarea{width:100%;border:1px solid #cdd9d2;border-radius:7px;background:#fff;color:var(--ink);outline:0;font:inherit;}
input,select{min-height:36px;padding:0 10px;}
textarea{padding:8px 10px;resize:vertical;min-height:70px;}
input:focus,select:focus,textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(21,91,181,.14);}
input[type=number]{appearance:textfield;-webkit-appearance:textfield;}
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
select{min-height:38px;}

/* percent field over-range */
input.pct-error{border-color:var(--danger)!important;background:var(--danger-soft)!important;box-shadow:0 0 0 3px rgba(180,35,24,.15)!important;}
.pct-hint{font-size:11px;color:var(--danger);font-weight:600;display:none;margin-top:2px;}
.pct-hint.show{display:block;}

/* field errors */
input.field-error,select.field-error,.rich-editor.field-error{border-color:var(--danger)!important;background:var(--danger-soft)!important;}
.field-error-msg{font-size:11px;color:var(--danger);font-weight:600;margin-top:3px;}

/* people picker */
#peoplePicker{display:flex;flex-direction:column;gap:4px;}
#personSelect{width:100%;max-height:110px;overflow-y:auto;border:1px solid #ccc;border-radius:6px;font:inherit;display:none;}

/* ===== RICH TEXT EDITOR ===== */
.rte-wrap{border:1px solid #cdd9d2;border-radius:8px;overflow:hidden;background:#fff;position:relative;}
.rte-wrap:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(21,91,181,.14);}
.rte-bar{display:flex;align-items:center;gap:2px;padding:5px 8px;background:#f7f9fc;border-bottom:1px solid #e4ecf4;flex-wrap:wrap;}
.rte-btn{display:inline-flex;align-items:center;justify-content:center;min-width:28px;min-height:26px;padding:0 6px;border:1px solid transparent;border-radius:5px;background:transparent;color:var(--ink);font:inherit;font-size:13px;font-weight:700;cursor:pointer;line-height:1;transition:background 100ms,border-color 100ms;user-select:none;}
.rte-btn:hover{background:var(--accent-soft);border-color:var(--line);color:var(--accent-strong);}
.rte-btn.on{background:var(--accent-soft);border-color:var(--accent);color:var(--accent-strong);}
.rte-sep{width:1px;height:18px;background:var(--line);margin:0 3px;flex-shrink:0;}
.rte-body{min-height:90px;max-height:260px;overflow-y:auto;padding:10px 12px;outline:none;font-size:14px;line-height:1.65;color:var(--ink);word-break:break-word;}
.rte-body:empty::before{content:attr(data-ph);color:var(--muted);pointer-events:none;}
.rte-body ul,.rte-body ol{padding-left:20px;margin:4px 0;}
.rte-body li{margin:2px 0;}
.rte-footer{display:flex;justify-content:flex-end;padding:3px 10px;background:#f7f9fc;border-top:1px solid #e4ecf4;font-size:11px;color:var(--muted);}
.rte-footer.over{color:var(--danger);font-weight:700;}
.rte-limit-toast{position:absolute;bottom:calc(100% + 6px);right:0;background:var(--danger);color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.18);white-space:nowrap;display:none;pointer-events:none;z-index:5;}
.rte-limit-toast::after{content:'';position:absolute;top:100%;right:12px;border:5px solid transparent;border-top-color:var(--danger);}
.rte-limit-toast.show{display:block;}

/* error modal */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:50;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal-box{background:#fff;border-radius:12px;padding:24px;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.2);}
.modal-box h3{color:var(--danger);font-size:16px;margin-bottom:14px;}
.modal-box ul{padding-left:18px;margin-bottom:18px;}
.modal-box ul li{font-size:13px;padding:3px 0;color:var(--ink);}
.modal-box ul li b{color:var(--danger);}
.busy-overlay{position:fixed;inset:0;background:rgba(255,255,255,.6);z-index:100;display:none;align-items:center;justify-content:center;font-size:16px;font-weight:600;color:var(--accent);}
.busy-overlay.show{display:flex;}
</style>
</head>
<body>

<header>
  <h1>${title}</h1>
  <div class="hdr-actions">
    <button class="btn" id="cancelBtn" type="button">Cancel</button>
    <button class="btn primary" id="saveBtn" type="button">💾 Save case</button>
  </div>
</header>

<main>
  <input type="hidden" id="f_id" value="${fv("id")}">

  <section class="section">
    <h2>Overview</h2>
    <div class="grid two">
      <label><span>Business Case idea *</span><input id="f_ideaName" type="text" maxlength="120" value="${escAttrW(fv("ideaName"))}"></label>
      <label><span>Owner</span><div id="peoplePicker"></div><input type="hidden" id="f_personClaims"></label>
      <label><span>Department</span><select id="f_department"></select></label>
    </div>
  </section>

  <section class="section">
    <h2>Problem Statement</h2>
    <div class="grid">
      <label><span>Pain point users face today</span><div class="rte-wrap" id="rte_problemStatement"></div></label>
      <label><span>Current workarounds failing</span><div class="rte-wrap" id="rte_currentWorkarounds"></div></label>
    </div>
  </section>

  <section class="section">
    <h2>Proposed or Adopted Solution</h2>
    <div class="grid two">
      <label><span>Innovation approach</span><div class="rte-wrap" id="rte_proposedSolution"></div></label>
      <label><span>MVP scope</span><div class="rte-wrap" id="rte_mvpScope"></div></label>
    </div>
  </section>

  <section class="section">
    <h2>Strategic Benefits</h2>
    <div class="rte-wrap" id="rte_valueProposition"></div>
  </section>

  <section class="section">
    <h2>Value Proposition</h2>
    <div class="grid two">
      <label><span>Cost savings</span><input id="f_costSavings" type="number" value="${fvN("costSavings")}"></label>
      <label><span>Efficiency gain % <small style="font-weight:400;color:var(--muted)">(0–100)</small></span>
        <input id="f_efficiencyGain" type="number" min="0" max="100" value="${fvN("efficiencyGain")}">
        <span class="pct-hint" id="h_efficiencyGain">Must be 0–100</span>
      </label>
      <label><span>Payback period months</span><input id="f_paybackMonths" type="number" min="0" value="${fvN("paybackMonths")}"></label>
      <label><span>Confidence Level</span><select id="f_confidenceLevel"></select></label>
    </div>
  </section>

  <section class="section">
    <h2>Key Metrics</h2>
    <div class="grid three">
      <label><span>Active users</span><input id="f_activeUsers" type="number" min="0" value="${fvN("activeUsers")}"></label>
      <label><span>Adoption rate % <small style="font-weight:400;color:var(--muted)">(0–100)</small></span>
        <input id="f_adoptionRate" type="number" min="0" max="100" value="${fvN("adoptionRate")}">
        <span class="pct-hint" id="h_adoptionRate">Must be 0–100</span>
      </label>
      <label><span>Revenue impact</span><input id="f_revenueImpact" type="number" min="0" value="${fvN("revenueImpact")}"></label>
      <label><span>Cycle time reduction % <small style="font-weight:400;color:var(--muted)">(0–100)</small></span>
        <input id="f_cycleTimeReduction" type="number" min="0" max="100" value="${fvN("cycleTimeReduction")}">
        <span class="pct-hint" id="h_cycleTimeReduction">Must be 0–100</span>
      </label>
      <label><span>Schedule impact % <small style="font-weight:400;color:var(--muted)">(0–100)</small></span>
        <input id="f_scheduleImpact" type="number" min="0" max="100" value="${fvN("scheduleImpact")}">
        <span class="pct-hint" id="h_scheduleImpact">Must be 0–100</span>
      </label>
    </div>
  </section>

  <section class="section">
    <h2>Adoption Criteria</h2>
    <div class="grid">
      <label><span>Centralized channel</span><div class="rte-wrap" id="rte_goToMarketChannels"></div></label>
      <label><span>Change management and training</span><div class="rte-wrap" id="rte_changeManagement"></div></label>
      <label><span>Phased rollout plan</span><div class="rte-wrap" id="rte_rolloutPlan"></div></label>
    </div>
  </section>

  <section class="section">
    <h2>Cost Structure</h2>
    <div class="grid three">
      <label><span>Tools and platform charges</span><input id="f_toolsPlatformCharges" type="number" min="0" value="${fvN("toolsPlatformCharges")}"></label>
      <label><span>License cost</span><input id="f_licenseCost" type="number" min="0" value="${fvN("licenseCost")}"></label>
      <label><span>Development cost</span><input id="f_developmentCost" type="number" min="0" value="${fvN("developmentCost")}"></label>
      <label><span>Support and maintenance</span><input id="f_supportMaintenanceCost" type="number" min="0" value="${fvN("supportMaintenanceCost")}"></label>
      <label><span>Recurring cost avoidance</span><input id="f_recurringCostAvoidance" type="number" min="0" value="${fvN("recurringCostAvoidance")}"></label>
    </div>
  </section>

  <section class="section">
    <h2>Long Term Value Proposition</h2>
    <div class="grid three">
      <label><span>Productivity uplift % <small style="font-weight:400;color:var(--muted)">(0–100)</small></span>
        <input id="f_productivityUplift" type="number" min="0" max="100" value="${fvN("productivityUplift")}">
        <span class="pct-hint" id="h_productivityUplift">Must be 0–100</span>
      </label>
      <label><span>Margin improvement % <small style="font-weight:400;color:var(--muted)">(0–100)</small></span>
        <input id="f_marginImprovement" type="number" min="0" max="100" value="${fvN("marginImprovement")}">
        <span class="pct-hint" id="h_marginImprovement">Must be 0–100</span>
      </label>
    </div>
    <div style="margin-top:12px">
      <label><span>Scalable to all disciplines</span><div class="rte-wrap" id="rte_scalabilityNotes"></div></label>
    </div>
  </section>
</main>

<footer>
  <button class="btn" id="cancelBtn2" type="button">Cancel</button>
  <button class="btn primary" id="saveBtn2" type="button">💾 Save case</button>
</footer>

<div class="busy-overlay" id="busyOverlay">Saving…</div>

<script>
// ---- CONFIG from parent ----
const PD = ${popupData};
const percentFields = new Set(PD.percentFields);
const richTextFields = new Set(PD.richTextFields);
const richTextLimits = PD.richTextLimits;
const numberFields   = new Set(PD.numberFields);

// ---- PEOPLE PICKER ----
let selectedPerson = PD.record
  ? { displayName: PD.record.personDisplayName || "", email: PD.record.personEmail || "", claims: PD.record.personClaims || "" }
  : null;

(function buildPicker(){
  const container = document.getElementById("peoplePicker");
  const fi = document.createElement("input");
  fi.type = "text"; fi.placeholder = "Type name or email…"; fi.autocomplete = "off";
  fi.style.cssText = "width:100%;border:1px solid #cdd9d2;border-radius:7px;min-height:36px;padding:0 10px;font:inherit;outline:0;";
  if(selectedPerson) fi.value = selectedPerson.displayName || selectedPerson.email;

  const sel = document.createElement("select");
  sel.id = "personSelect"; sel.size = 4; sel.style.display = "none";

  container.appendChild(fi); container.appendChild(sel);

  fi.addEventListener("input", () => {
    const q = fi.value.trim().toLowerCase();
    sel.innerHTML = "";
    if(q.length < 2){ sel.style.display="none"; return; }
    const matches = (PD.allUsers||[]).filter(u =>
      (u.Title||"").toLowerCase().includes(q)||(u.Email||"").toLowerCase().includes(q)
    ).slice(0,50);
    if(!matches.length){
      const o=document.createElement("option"); o.disabled=true; o.textContent="No results";
      sel.appendChild(o);
    } else {
      matches.forEach(u=>{
        const o=document.createElement("option");
        o.value=u.LoginName;
        o.setAttribute("data-name",u.Title||"");
        o.setAttribute("data-email",u.Email||"");
        o.textContent=(u.Title||"")+" — "+(u.Email||"");
        sel.appendChild(o);
      });
    }
    sel.style.display="block";
  });

  sel.addEventListener("change",()=>{
    const o = sel.options[sel.selectedIndex];
    if(!o||o.disabled) return;
    selectedPerson = { displayName:o.getAttribute("data-name")||"", email:o.getAttribute("data-email")||"", claims:o.value };
    document.getElementById("f_personClaims").value = o.value;
    fi.value = selectedPerson.displayName || selectedPerson.email;
    sel.style.display="none"; sel.innerHTML="";
  });
})();

// ---- DROPDOWNS ----
(function fillDropdowns(){
  const dept = document.getElementById("f_department");
  const conf = document.getElementById("f_confidenceLevel");
  (PD.choices.department||[]).forEach(c=>{ if(!c) return; const o=document.createElement("option"); o.value=o.textContent=c; dept.appendChild(o); });
  (PD.choices.confidenceLevel||[]).forEach(c=>{ if(!c) return; const o=document.createElement("option"); o.value=o.textContent=c; conf.appendChild(o); });
  if(PD.record){
    dept.value = PD.record.department||"";
    conf.value = PD.record.confidenceLevel||"";
  }
})();

// ---- PERCENT FIELD LIVE VALIDATION ----
const PCT_IDS = ["f_efficiencyGain","f_adoptionRate","f_cycleTimeReduction","f_scheduleImpact","f_productivityUplift","f_marginImprovement"];
PCT_IDS.forEach(id=>{
  const inp = document.getElementById(id);
  if(!inp) return;
  const hintId = "h_" + id.replace("f_","");
  const hint   = document.getElementById(hintId);
  inp.addEventListener("input",()=>{
    const v = parseFloat(inp.value);
    const bad = inp.value !== "" && (isNaN(v) || v < 0 || v > 100);
    inp.classList.toggle("pct-error", bad);
    if(hint) hint.classList.toggle("show", bad);
  });
});

// ---- RICH TEXT EDITOR ----
// Uses the browser's native contenteditable editing commands. This is more reliable
// for typing, bold / italic / underline, lists, alignment, and clear formatting.
function buildRTE(wrapId, fieldName, initialHTML) {
  const wrap  = document.getElementById(wrapId);
  if (!wrap) return;
  const limit = richTextLimits[fieldName] || 2000;

  const bar = document.createElement("div");
  bar.className = "rte-bar";

  function makeBtn(label, command, value, title) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "rte-btn";
    b.innerHTML = label;
    b.title = title || label;
    b.dataset.command = command;
    if (value) b.dataset.value = value;
    return b;
  }
  function makeSep() {
    const s = document.createElement("span");
    s.className = "rte-sep";
    return s;
  }

  const buttons = [
    makeBtn("<b>B</b>", "bold", "", "Bold"),
    makeBtn("<i>I</i>", "italic", "", "Italic"),
    makeBtn("<u>U</u>", "underline", "", "Underline"),
    makeSep(),
    makeBtn("&#8676; L", "justifyLeft", "", "Align left"),
    makeBtn("&#8596; C", "justifyCenter", "", "Align center"),
    makeBtn("R &#8677;", "justifyRight", "", "Align right"),
    makeSep(),
    makeBtn("• List", "insertUnorderedList", "", "Bullet list"),
    makeBtn("1. List", "insertOrderedList", "", "Numbered list"),
    makeSep(),
    makeBtn("✕ Clear", "removeFormat", "", "Clear formatting")
  ];
  bar.append(...buttons);

  const body = document.createElement("div");
  body.className = "rte-body";
  body.contentEditable = "true";
  body.setAttribute("role", "textbox");
  body.setAttribute("aria-multiline", "true");
  body.setAttribute("data-ph", "Type here…");
  body.setAttribute("spellcheck", "true");
  body.innerHTML = initialHTML || "";

  const footer = document.createElement("div");
  footer.className = "rte-footer";

  const toast = document.createElement("div");
  toast.className = "rte-limit-toast";
  toast.textContent = "Maximum " + limit.toLocaleString() + " characters allowed.";

  wrap.append(bar, body, footer, toast);

  let limitTimer = 0;
  function plainText() {
    return (body.innerText || "").replace(/\n$/, "");
  }
  function showLimitToast() {
    toast.classList.add("show");
    clearTimeout(limitTimer);
    limitTimer = setTimeout(() => toast.classList.remove("show"), 2500);
  }
  function updateCounter() {
    const len = plainText().length;
    footer.textContent = len + " / " + limit;
    footer.classList.toggle("over", len > limit);
  }
  function updateButtonStates() {
    bar.querySelectorAll(".rte-btn[data-command]").forEach(btn => {
      const cmd = btn.dataset.command;
      let active = false;
      try {
        active = ["bold", "italic", "underline", "insertUnorderedList", "insertOrderedList", "justifyLeft", "justifyCenter", "justifyRight"].includes(cmd)
          && document.queryCommandState(cmd);
      } catch (_) {}
      btn.classList.toggle("on", active);
    });
  }
  function runCommand(command, value) {
    body.focus();
    if (command === "removeFormat") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        body.innerHTML = plainText().replace(/\n/g, "<br>");
      } else {
        document.execCommand("removeFormat", false, null);
      }
    } else {
      document.execCommand(command, false, value || null);
    }
    updateCounter();
    updateButtonStates();
  }

  bar.addEventListener("mousedown", e => e.preventDefault());
  bar.addEventListener("click", e => {
    const btn = e.target.closest(".rte-btn[data-command]");
    if (!btn) return;
    e.preventDefault();
    runCommand(btn.dataset.command, btn.dataset.value || null);
  });

  body.addEventListener("beforeinput", e => {
    const incoming = e.data || "";
    if (!incoming) return;
    const sel = window.getSelection();
    const selected = sel && sel.rangeCount ? sel.toString().length : 0;
    if (plainText().length - selected + incoming.length > limit) {
      e.preventDefault();
      showLimitToast();
    }
  });

  body.addEventListener("input", () => {
    if (plainText().length > limit) {
      body.innerText = plainText().slice(0, limit);
      showLimitToast();
    }
    updateCounter();
    updateButtonStates();
  });

  body.addEventListener("paste", e => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text/plain") || "";
    const sel = window.getSelection();
    const selected = sel && sel.rangeCount ? sel.toString().length : 0;
    const remaining = Math.max(0, limit - (plainText().length - selected));
    const clipped = text.slice(0, remaining);
    if (text.length > clipped.length) showLimitToast();
    document.execCommand("insertText", false, clipped);
    updateCounter();
  });

  body.addEventListener("keyup", updateButtonStates);
  body.addEventListener("mouseup", updateButtonStates);
  body.addEventListener("focus", updateButtonStates);
  updateCounter();

  wrap._getHTML = () => body.innerHTML;
  wrap._getText = () => plainText();
  wrap._setHTML = h => { body.innerHTML = h || ""; updateCounter(); };
  wrap._clear   = () => { body.innerHTML = ""; updateCounter(); };
}

// Build all RTEs
const rteFields = ["problemStatement","currentWorkarounds","proposedSolution","mvpScope",
  "valueProposition","goToMarketChannels","changeManagement","rolloutPlan","scalabilityNotes"];
rteFields.forEach(f => {
  buildRTE("rte_" + f, f, PD.record ? (PD.record[f]||"") : "");
});

// ---- VALIDATION ----
function getFieldLabel(key){
  const map={
    ideaName:"Business Case idea",efficiencyGain:"Efficiency gain %",
    adoptionRate:"Adoption rate %",cycleTimeReduction:"Cycle time reduction %",
    scheduleImpact:"Schedule impact",productivityUplift:"Productivity uplift %",
    marginImprovement:"Margin improvement %"
  };
  return map[key]||key;
}

function validate(){
  const errors=[];
  const ideaEl=document.getElementById("f_ideaName");
  if(!ideaEl.value.trim()){
    errors.push({field:"f_ideaName",msg:"Business Case idea is required."});
  }
  PCT_IDS.forEach(id=>{
    const inp=document.getElementById(id);
    if(!inp) return;
    const v=parseFloat(inp.value);
    if(inp.value!==""&&(isNaN(v)||v<0||v>100)){
      const key=id.replace("f_","");
      errors.push({field:id,msg:getFieldLabel(key)+" must be 0–100."});
    }
  });
  return errors;
}

function showErrors(errors){
  // clear previous
  document.querySelectorAll(".field-error").forEach(e=>e.classList.remove("field-error"));
  document.querySelectorAll(".field-error-msg").forEach(e=>e.remove());

  errors.forEach(({field,msg})=>{
    const el=document.getElementById(field);
    if(el){
      el.classList.add("field-error");
      const s=document.createElement("span");
      s.className="field-error-msg"; s.textContent=msg;
      el.parentNode.appendChild(s);
    }
  });

  // Show modal
  const existing=document.getElementById("errModal");
  if(existing) existing.remove();
  const bg=document.createElement("div");
  bg.className="modal-bg"; bg.id="errModal";
  const box=document.createElement("div");
  box.className="modal-box";
  box.innerHTML="<h3>⚠ Please fix these errors</h3><ul>"
    +errors.map(e=>"<li><b>"+e.msg.split(":")[0]+"</b>"+(e.msg.includes(":")?": "+e.msg.split(":").slice(1).join(":"):"")+"</li>").join("")
    +"</ul><button class='btn primary' style='width:100%' id='errOkBtn'>OK, fix these</button>";
  bg.appendChild(box);
  document.body.appendChild(bg);
  document.getElementById("errOkBtn").onclick=()=>{
    bg.remove();
    const first=document.querySelector(".field-error");
    if(first){first.scrollIntoView({behavior:"smooth",block:"center"});first.focus();}
  };
  bg.addEventListener("click",e=>{if(e.target===bg)bg.remove();});
}

// ---- COLLECT RECORD ----
function collectRecord(){
  const get=id=>{ const el=document.getElementById(id); return el?el.value:""; };
  const record={
    id:               get("f_id"),
    ideaName:         get("f_ideaName"),
    department:       get("f_department"),
    confidenceLevel:  get("f_confidenceLevel"),
    costSavings:      get("f_costSavings"),
    efficiencyGain:   get("f_efficiencyGain"),
    paybackMonths:    get("f_paybackMonths"),
    activeUsers:      get("f_activeUsers"),
    adoptionRate:     get("f_adoptionRate"),
    revenueImpact:    get("f_revenueImpact"),
    cycleTimeReduction:     get("f_cycleTimeReduction"),
    scheduleImpact:         get("f_scheduleImpact"),
    productivityUplift:     get("f_productivityUplift"),
    marginImprovement:      get("f_marginImprovement"),
    toolsPlatformCharges:   get("f_toolsPlatformCharges"),
    licenseCost:            get("f_licenseCost"),
    developmentCost:        get("f_developmentCost"),
    supportMaintenanceCost: get("f_supportMaintenanceCost"),
    recurringCostAvoidance: get("f_recurringCostAvoidance"),
    personClaims:           get("f_personClaims"),
  };
  // Rich text
  rteFields.forEach(f=>{
    const w=document.getElementById("rte_"+f);
    record[f]=w?w._getHTML():"";
  });
  return record;
}

// ---- SAVE ----
async function doSave(){
  const record=collectRecord();
  const errors=validate();
  if(errors.length){ showErrors(errors); return; }

  const overlay=document.getElementById("busyOverlay");
  overlay.classList.add("show");

  const FM=PD.fieldMap;
  const NF=new Set(PD.numberFields);

  const payload={ operation: record.id?"update":"create", id: record.id?String(record.id):"" };
  const skip=new Set(["created","modified","id"]);
  for(const [jsKey,spField] of Object.entries(FM)){
    if(skip.has(jsKey)) continue;
    const val=record[jsKey];
    const s=(val==null?"":String(val)).trim();
    if(s==="") continue;
    payload[spField]=NF.has(jsKey)?Number(s):s;
  }
  if(record.personClaims) payload.person=record.personClaims;

  try{
    const res=await fetch(PD.saveFlowUrl,{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)
    });
    let text="";
    try{text=await res.text();}catch{}
    if(!res.ok) throw new Error("HTTP "+res.status+": "+text);
    window.opener?.postMessage({type:"CASE_SAVED",isNew:!record.id},window.opener.location.origin);
    window.close();
  }catch(err){
    overlay.classList.remove("show");
    showErrors([{field:"f_ideaName",msg:"Save failed: "+err.message}]);
  }
}

document.getElementById("saveBtn").onclick  = doSave;
document.getElementById("saveBtn2").onclick = doSave;
document.getElementById("cancelBtn").onclick  = ()=>{window.opener?.postMessage({type:"CASE_CLOSED"},window.opener.location.origin);window.close();};
document.getElementById("cancelBtn2").onclick = ()=>{window.opener?.postMessage({type:"CASE_CLOSED"},window.opener.location.origin);window.close();};
</script>
</body>
</html>`;
}

function escAttrW(v) {
  return String(v ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

// =============================================================================
// DROPDOWNS
// =============================================================================
function populateDropdowns() {
  const deptSel = document.querySelector('select[name="department"]');
  const confSel = document.querySelector('select[name="confidenceLevel"]');
  if (deptSel) deptSel.innerHTML = "";
  if (confSel) confSel.innerHTML = "";
  state.choices.department.forEach(c => {
    if (!c) return;
    const o = document.createElement("option"); o.value = o.textContent = c; deptSel?.appendChild(o);
  });
  (state.choices.confidenceLevel || []).forEach(c => {
    if (!c) return;
    const o = document.createElement("option"); o.value = o.textContent = c; confSel?.appendChild(o);
  });
}

// =============================================================================
// PEOPLE PICKER (main page — not really used since form is in popup)
// =============================================================================
function buildPeopleSelect() {
  const container = document.getElementById("peoplePicker");
  if (!container) return;
  container.innerHTML = "";
}

// =============================================================================
// DOM CACHE & EVENTS
// =============================================================================
function cacheElements() {
  ["connectionBadge","refreshButton","exportButton","newCaseButton",
   "caseRows","searchInput",
   "summaryTotal","summarySavings","summaryEfficiency","summaryPayback","toast"
  ].forEach(id => { els[id] = document.getElementById(id); });
}

function bindEvents() {
  els.newCaseButton.addEventListener("click", () => openCaseWindow(null));
  els.exportButton.addEventListener("click",  exportCsv);

  els.searchInput.addEventListener("input", e => {
    state.search = e.target.value.trim().toLowerCase();
    renderTable();
  });

  els.refreshButton.addEventListener("click", async () => {
    await reloadRecords();
    render();
  });
}

// =============================================================================
// RENDER
// =============================================================================
function render() { renderBadge(); renderSummaries(); renderTable(); }

function renderBadge() {
  const b = els.connectionBadge;
  b.textContent = state.mode === "flow" ? "Power Automate connected" : "⚠ Flow unavailable";
  b.classList.toggle("warning", state.mode !== "flow");
}

function renderSummaries() {
  const f = filtered();
  els.summaryTotal.textContent      = f.length;
  els.summarySavings.textContent    = fmt$(sum(f, "costSavings"));
  els.summaryEfficiency.textContent = `${fmtN(avg(nums(f, "efficiencyGain")), 1)}%`;
  els.summaryPayback.textContent    = `${fmtN(avg(nums(f, "paybackMonths")), 0)} mo`;
}

function renderTable() {
  renderSummaries();
  const rows = filtered();
  if (!rows.length) {
    els.caseRows.innerHTML =
      `<tr class="empty-row"><td colspan="10">No business cases match the current view.</td></tr>`;
    return;
  }
  els.caseRows.innerHTML = rows.map(r => `
    <tr>
      <td class="idea-cell">${esc(r.ideaName)}</td>
      <td>${esc(r.personDisplayName)}</td>
      <td class="text-cell">${stripHtml(r.valueProposition)}</td>
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
    </tr>`).join("");

  els.caseRows.querySelectorAll("[data-edit-id]").forEach(btn =>
    btn.addEventListener("click", () => {
      const rec = state.records.find(x => String(x.id) === String(btn.dataset.editId));
      if (rec) openCaseWindow(rec);
    })
  );
}

function filtered() {
  const q = state.search;
  return [...state.records]
    .filter(r => !q || [
      r.ideaName, r.personDisplayName, r.personEmail,
      r.department, r.problemStatement, r.valueProposition, r.confidenceLevel
    ].some(v => String(v || "").toLowerCase().includes(q)))
    .sort((a, b) =>
      new Date(b.modified || b.created || 0) - new Date(a.modified || a.created || 0)
    );
}

// =============================================================================
// EXPORT CSV
// =============================================================================
function exportCsv() {
  const cols = [
    ["ideaName","Business case idea"],["personDisplayName","Person"],
    ["department","Department"],["problemStatement","Problem statement"],
    ["currentWorkarounds","Current workarounds"],["proposedSolution","Innovation approach"],
    ["mvpScope","MVP scope"],["valueProposition","Value proposition"],
    ["costSavings","Cost savings"],["efficiencyGain","Efficiency gain %"],
    ["paybackMonths","Payback period months"],["activeUsers","Active users"],
    ["adoptionRate","Adoption rate %"],["revenueImpact","Revenue impact"],
    ["cycleTimeReduction","Cycle time reduction %"],["productivityUplift","Productivity uplift %"],
    ["scheduleImpact","Schedule impact"],["goToMarketChannels","Centralized channel"],
    ["changeManagement","Change management"],["rolloutPlan","Rollout plan"],
    ["toolsPlatformCharges","Tools and platform"],["licenseCost","License cost"],
    ["developmentCost","Development cost"],["supportMaintenanceCost","Support and maintenance"],
    ["recurringCostAvoidance","Recurring cost avoidance"],
    ["marginImprovement","Margin improvement %"],["scalabilityNotes","Scalability notes"],
    ["confidenceLevel","Confidence Level"],["modified","Updated"]
  ];
  const rows = filtered();
  const csv  = [
    cols.map(([,l]) => csvQ(l)).join(","),
    ...rows.map(r => cols.map(([k]) => csvQ(
      CONFIG.richTextFields.has(k) ? stripHtml(r[k]) : r[k]
    )).join(","))
  ].join("\r\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })),
    download: `innovation-cases-${new Date().toISOString().slice(0,10)}.csv`
  });
  document.body.append(a); a.click(); a.remove();
}

// =============================================================================
// UTILITIES
// =============================================================================
function stripHtml(h) {
  if (!h) return "";
  return h.replace(/<[^>]*>/g,"")
    .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
}

function setBusy(v) {
  state.busy = v;
  document.body.classList.toggle("is-busy", v);
}

function showToast(msg) {
  clearTimeout(state.toastTimer);
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 4000);
}

function numOrZero(v) {
  return (v === "" || v == null || isNaN(Number(v))) ? 0 : Number(v);
}

function choiceText(v) {
  if (v == null)             return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") return v.Value || v.value || v.Label || v.label || "";
  return String(v);
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

const fmtPct = v => (!v || v === "0") ? "" : `${fmtN(Number(v), 1)}%`;
const fmtMo  = v => (!v || v === "0") ? "" : `${fmtN(Number(v), 0)} mo`;

function fmtN(v, d = 0) {
  const n = Number(v) || 0;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: d,
    minimumFractionDigits: d > 0 && n % 1 !== 0 ? d : 0
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
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

function escAttr(v) { return esc(v).replace(/`/g,"&#96;"); }
function csvQ(v) { const t = v==null?"":String(v); return `"${t.replace(/"/g,'""')}"`; }

// =============================================================================
// CONFIG
// =============================================================================
// const CONFIG = {
//   listTitle: "OGC Innovation Business Case",
//   sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

//    listFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/de240397094f4fe39a610c6a0a4d5997/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gJM20WCbDMWgARxFc6pbnqc6oq9cpX5Pw-aLgpp5a-s",

//   saveFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f44390bc94a847d29342ab85b1b8ec2d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SkMtR9vKtj7Mf07QWgksvnK8m1OUKOJR4D7TGiZt9bg",

//   fieldMap: {
//     id:                     "Id",
//     ideaName:               "Title",
//     department:             "field_2",
//     problemStatement:       "field_4",
//     currentWorkarounds:     "field_6",
//     proposedSolution:       "field_7",
//     mvpScope:               "field_8",
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

//     confidenceLevel:        "Confidence_x0020_Level",
//     created:                "Created",
//     modified:               "Modified"
//   },

//   numberFields: new Set([
//     "costSavings",
//     "efficiencyGain",
//     "paybackMonths",
//     "activeUsers",
//     "adoptionRate",
//     "revenueImpact",
//     "cycleTimeReduction",
//     "productivityUplift",
//     "scheduleImpact",
//     "toolsPlatformCharges",
//     "licenseCost",
//     "developmentCost",
//     "supportMaintenanceCost",
//     "recurringCostAvoidance",
//     "marginImprovement"
//   ]),

//   fallbackChoices: {
//     department: [""],
//     confidenceLevel: ["High", "Moderate", "Low"]
//   }
// };

// // =============================================================================
// // STATE
// // =============================================================================
// const state = {
//   records:        [],
//   allUsers:       [],
//   choices: { department: [], confidenceLevel: [] },
//   mode:           "connecting",
//   search:         "",
//   busy:           false,
//   toastTimer:     0,
//   selectedPerson: null 
// };

// const els = {};

// // =============================================================================
// // BOOT
// // =============================================================================
// document.addEventListener("DOMContentLoaded", init);

// async function init() {
//   cacheElements();
//   bindEvents();
//   await loadFromFlow();
//   populateDropdowns();
//   buildPeopleSelect();
//   render();
// }

// // =============================================================================
// // DATA LOAD
// // =============================================================================
// async function loadFromFlow() {
//   setBusy(true);
//   try {
//     const res = await fetch(CONFIG.listFlowUrl, {
//       method:  "POST",
//       headers: { "Content-Type": "application/json" },
//       body:    JSON.stringify({})
//     });
//     if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);
//     const data = await res.json();

//     // Resolve choices — prefer what the flow sends, fall back to CONFIG defaults
//     if (data.choices) {
//       state.choices.confidenceLevel =
//         Array.isArray(data.choices.confidenceLevel) && data.choices.confidenceLevel.length
//           ? data.choices.confidenceLevel
//           : [...CONFIG.fallbackChoices.confidenceLevel];

//       state.choices.department =
//         Array.isArray(data.choices.department) && data.choices.department.length
//           ? data.choices.department
//           : [...CONFIG.fallbackChoices.department];
//     } else {
//       const rows = extractRows(data);
//       state.choices.department     = uniqueChoices(rows, "field_2")                 || [...CONFIG.fallbackChoices.department];
//       state.choices.confidenceLevel = uniqueChoices(rows, "Confidence_x0020_Level") || [...CONFIG.fallbackChoices.confidenceLevel];
//     }

//     state.allUsers = Array.isArray(data.users)
//       ? data.users.filter(u => u.Email)
//       : [];

//     console.log(`✓ Loaded ${state.allUsers.length} site users`);

//     state.records = extractRows(data).map(mapItem);
//     state.mode    = "flow";
//   } catch (err) {
//     console.error("Flow load failed:", err);
//     state.records  = [];
//     state.allUsers = [];
//     state.choices  = {
//       department:     [...CONFIG.fallbackChoices.department],
//       confidenceLevel: [...CONFIG.fallbackChoices.confidenceLevel]
//     };
//     state.mode = "error";
//     showToast("⚠ Could not load SharePoint data — " + err.message);
//   } finally {
//     setBusy(false);
//   }
// }

// async function reloadRecords() {
//   setBusy(true);
//   try {
//     const res = await fetch(CONFIG.listFlowUrl, {
//       method:  "POST",
//       headers: { "Content-Type": "application/json" },
//       body:    JSON.stringify({})
//     });
//     if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);
//     const data    = await res.json();
//     state.records = extractRows(data).map(mapItem);
//     state.mode    = "flow";
//   } catch (err) {
//     console.error("Reload failed:", err);
//     showToast("⚠ Could not refresh data");
//   } finally {
//     setBusy(false);
//   }
// }

// // =============================================================================
// // DATA HELPERS
// // =============================================================================
// function extractRows(data) {
//   if (Array.isArray(data))       return data;
//   if (Array.isArray(data.items)) return data.items;
//   if (Array.isArray(data.value)) return data.value;
//   return [];
// }

// function uniqueChoices(rows, field) {
//   const vals = [...new Set(rows.map(r => choiceText(r[field])).filter(Boolean))].sort();
//   return vals.length ? vals : null;
// }

// function mapItem(item) {
//   const p = item.person || item.Person || null;
//   return {
//     id:                     item.Id    || item.ID   || "",
//     ideaName:               item.Title || item.title || "",
//     personDisplayName:      p?.DisplayName || p?.displayName || "",
//     personEmail:            p?.Email       || p?.email       || "",
//     personClaims:           p?.Claims      || p?.claims      || "",
//     department:             choiceText(item.field_2),
//     problemStatement:       item.field_4  || "",
//     scaleBusinessImpact:    item.field_5  || "",
//     currentWorkarounds:     item.field_6  || "",
//     proposedSolution:       item.field_7  || "",
//     mvpScope:               item.field_8  || "",
//     enabler:                item.field_9  || "",
//     unfairAdvantage:        item.field_10 || "",
//     valueProposition:       item.field_11 || "",
//     costSavings:            numOrZero(item.field_12),
//     efficiencyGain:         numOrZero(item.field_13),
//     paybackMonths:          numOrZero(item.field_14),
//     activeUsers:            numOrZero(item.field_15),
//     adoptionRate:           numOrZero(item.field_16),
//     revenueImpact:          numOrZero(item.field_17),
//     cycleTimeReduction:     numOrZero(item.field_18),
//     productivityUplift:     numOrZero(item.field_19),
//     scheduleImpact:         numOrZero(item.field_20),
//     goToMarketChannels:     item.field_21 || "",
//     changeManagement:       item.field_22 || "",
//     rolloutPlan:            item.field_23 || "",
//     toolsPlatformCharges:   numOrZero(item.field_24),
//     licenseCost:            numOrZero(item.field_25),
//     developmentCost:        numOrZero(item.field_26),
//     supportMaintenanceCost: numOrZero(item.field_27),
//     recurringCostAvoidance: numOrZero(item.field_28),
//     marginImprovement:      numOrZero(item.field_29),
//     scalabilityNotes:       item.field_30 || "",
//     confidenceLevel:        choiceText(item.Confidence_x0020_Level),
//     created:                item.Created  || "",
//     modified:               item.Modified || ""
//   };
// }

// // =============================================================================
// // PEOPLE PICKER
// // Built entirely with DOM API — no innerHTML — so option values are never
// // corrupted by whitespace. The <select> list only appears after ≥2 chars.
// // =============================================================================
// function buildPeopleSelect() {
//   const container = document.getElementById("peoplePicker");
//   if (!container) return;

//   // Clear any previous build (e.g. if called after hot-reload)
//   container.innerHTML = "";

//   const filterInput = document.createElement("input");
//   filterInput.type        = "text";
//   filterInput.id          = "personFilterInput";
//   filterInput.placeholder = "Type name or email…";
//   filterInput.autocomplete = "off";
//   filterInput.setAttribute("aria-label", "Search for a person");

//   const sel = document.createElement("select");
//   sel.id   = "personSelect";
//   sel.size = 4;
//   sel.setAttribute("aria-label", "Select a person");
//   sel.style.cssText = "display:none;width:100%;";

//   container.appendChild(filterInput);
//   container.appendChild(sel);

//   filterInput.addEventListener("input", () => {
//     const q = filterInput.value.trim().toLowerCase();

//     if (q.length < 2) {
//       sel.style.display = "none";
//       while (sel.firstChild) sel.removeChild(sel.firstChild);
//       return;
//     }

//     const matches = state.allUsers
//       .filter(u =>
//         (u.Title || "").toLowerCase().includes(q) ||
//         (u.Email || "").toLowerCase().includes(q)
//       )
//       .slice(0, 50);

//     while (sel.firstChild) sel.removeChild(sel.firstChild);

//     if (!matches.length) {
//       const empty = document.createElement("option");
//       empty.disabled    = true;
//       empty.textContent = "No results found";
//       sel.appendChild(empty);
//     } else {
//       matches.forEach(u => {
//         const opt = document.createElement("option");
//         opt.value = u.LoginName;
//         opt.setAttribute("data-name",  u.Title || "");
//         opt.setAttribute("data-email", u.Email || "");
//         opt.textContent = (u.Title || "") + " — " + (u.Email || "");
//         sel.appendChild(opt);
//       });

//       // Restore highlight if user already chose someone
//       if (state.selectedPerson?.claims) {
//         for (let i = 0; i < sel.options.length; i++) {
//           if (sel.options[i].value === state.selectedPerson.claims) {
//             sel.options[i].selected = true;
//             break;
//           }
//         }
//       }
//     }

//     sel.style.display = "block";
//   });

//   sel.addEventListener("change", () => {
//     const opt = sel.options[sel.selectedIndex];
//     if (!opt || opt.disabled) return;

//     const claims      = opt.value;
//     const displayName = opt.getAttribute("data-name")  || "";
//     const email       = opt.getAttribute("data-email") || "";

//     state.selectedPerson = { displayName, email, claims };

//     const hiddenField = els.caseForm?.elements.personClaims;
//     if (hiddenField) hiddenField.value = claims;

//     filterInput.value = displayName || email;
//     sel.style.display = "none";
//     while (sel.firstChild) sel.removeChild(sel.firstChild);
//   });
// }

// function fillPersonPicker(record) {
//   if (!record.personDisplayName && !record.personEmail) return;

//   state.selectedPerson = {
//     displayName: record.personDisplayName,
//     email:       record.personEmail,
//     claims:      record.personClaims
//   };

//   const filterInput = document.getElementById("personFilterInput");
//   const sel         = document.getElementById("personSelect");
//   if (!filterInput || !sel) return;

//   filterInput.value = record.personDisplayName || record.personEmail;
//   while (sel.firstChild) sel.removeChild(sel.firstChild);
//   sel.style.display = "none";

//   const hiddenField = els.caseForm?.elements.personClaims;
//   if (hiddenField) hiddenField.value = record.personClaims;
// }

// function resetPersonPicker() {
//   state.selectedPerson = null;

//   const filterInput = document.getElementById("personFilterInput");
//   const sel         = document.getElementById("personSelect");
//   if (filterInput) filterInput.value = "";
//   if (sel) {
//     while (sel.firstChild) sel.removeChild(sel.firstChild);
//     sel.style.display = "none";
//   }

//   const hiddenField = els.caseForm?.elements.personClaims;
//   if (hiddenField) hiddenField.value = "";
// }

// // =============================================================================
// // DROPDOWNS
// // =============================================================================
// function populateDropdowns() {
//   const deptSel    = document.querySelector('select[name="department"]');
//   const confSel    = document.querySelector('select[name="confidenceLevel"]');

//   // Clear first
//   if (deptSel)    deptSel.innerHTML    = "";
//   if (confSel)    confSel.innerHTML    = "";
//   state.choices.department.forEach(c => {
//     if (!c) return;
//     const o = document.createElement("option");
//     o.value = o.textContent = c;
//     deptSel?.appendChild(o);
//   });

//   (state.choices.confidenceLevel || []).forEach(c => {
//     if (!c) return;
//     const o = document.createElement("option");
//     o.value = o.textContent = c;
//     confSel?.appendChild(o);
//   });
// }

// // =============================================================================
// // DOM CACHE & EVENTS
// // =============================================================================
// function cacheElements() {
//   [
//     "connectionBadge", "refreshButton", "exportButton", "newCaseButton",
//     "caseRows", "searchInput",
//     "summaryTotal", "summarySavings", "summaryEfficiency", "summaryPayback",
//     "drawerBackdrop", "closeDrawerButton", "cancelButton",
//     "caseForm", "drawerTitle", "saveButton", "toast"
//   ].forEach(id => { els[id] = document.getElementById(id); });
//   els.drawer = document.getElementById("caseDrawer");
// }

// function bindEvents() {
//   els.newCaseButton.addEventListener("click",    () => openDrawer());
//   els.closeDrawerButton.addEventListener("click", closeDrawer);
//   els.cancelButton.addEventListener("click",      closeDrawer);
//   els.drawerBackdrop.addEventListener("click",    closeDrawer);
//   els.exportButton.addEventListener("click",      exportCsv);
//   els.caseForm.addEventListener("submit",         saveCurrentCase);

//   els.searchInput.addEventListener("input", e => {
//     state.search = e.target.value.trim().toLowerCase();
//     renderTable();
//   });

//   els.refreshButton.addEventListener("click", async () => {
//     await reloadRecords();
//     render();
//   });

//   document.addEventListener("keydown", e => {
//     if (e.key === "Escape" && els.drawer.classList.contains("open")) closeDrawer();
//   });

//   document.addEventListener("wheel", e => {
//     if (document.activeElement.type === "number") e.preventDefault();
//   }, { passive: false });
// }

// // =============================================================================
// // RENDER
// // =============================================================================
// function render() { renderBadge(); renderSummaries(); renderTable(); }

// function renderBadge() {
//   const b = els.connectionBadge;
//   b.textContent = state.mode === "flow" ? "Power Automate connected" : "⚠ Flow unavailable";
//   b.classList.toggle("warning", state.mode !== "flow");
// }

// function renderSummaries() {
//   const f = filtered();
//   els.summaryTotal.textContent      = f.length;
//   els.summarySavings.textContent    = fmt$(sum(f, "costSavings"));
//   els.summaryEfficiency.textContent = `${fmtN(avg(nums(f, "efficiencyGain")), 1)}%`;
//   els.summaryPayback.textContent    = `${fmtN(avg(nums(f, "paybackMonths")), 0)} mo`;
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
//       <td class="idea-cell">${esc(r.ideaName)}</td>
//       <td>${esc(r.personDisplayName)}</td>
//       <td class="text-cell">${esc(r.valueProposition)}</td>
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
//     .filter(r => !q || [
//       r.ideaName, r.personDisplayName, r.personEmail,
//       r.department, r.problemStatement, r.valueProposition, r.confidenceLevel
//     ].some(v => String(v || "").toLowerCase().includes(q)))
//     .sort((a, b) =>
//       new Date(b.modified || b.created || 0) - new Date(a.modified || a.created || 0)
//     );
// }

// // =============================================================================
// // DRAWER
// // =============================================================================
// function openDrawer(record = null) {
//   els.caseForm.reset();
//   resetPersonPicker();
//   els.drawerTitle.textContent = record ? "Edit innovation case" : "New innovation case";

//   if (record) {
//     for (const key of Object.keys(CONFIG.fieldMap)) {
//       const ctrl = els.caseForm.elements[key];
//       if (!ctrl) continue;
//       const v = record[key];
//       if (v != null) ctrl.value = v;
//     }
//     els.caseForm.elements.id.value = record.id;
//     fillPersonPicker(record);
//   } else {
//     els.caseForm.elements.id.value = "";
//     const c = els.caseForm.elements.confidenceLevel;
//     if (c) c.value = state.choices.confidenceLevel[0] || "";
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
//   resetPersonPicker();
// }

// // =============================================================================
// // SAVE
// // =============================================================================
// async function saveCurrentCase(e) {
//   e.preventDefault();

//   const fd     = new FormData(els.caseForm);
//   const record = formToRecord(fd);

//   if (!record.ideaName.trim()) {
//     showToast("Business case idea is required.");
//     els.caseForm.elements.ideaName?.focus();
//     return;
//   }

//   setBusy(true);
//   try {
//     const payload = buildSharePointPayload(record);
//     console.log("📤 Saving payload:", JSON.stringify(payload, null, 2));
//     await saveViaFlow(payload);
//     await reloadRecords();
//     closeDrawer();
//     render();
//     showToast(record.id ? "✓ Updated in SharePoint." : "✓ Saved to SharePoint.");
//   } catch (err) {
//     console.error("Save failed:", err);
//     showToast("Save failed: " + err.message);
//   } finally {
//     setBusy(false);
//   }
// }

// async function saveViaFlow(payload) {
//   const res = await fetch(CONFIG.saveFlowUrl, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(payload)
//   });
//   let text = "";
//   try { text = await res.text(); } catch { /* ignore */ }
//   if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
//   try { return text ? JSON.parse(text) : {}; } catch { return {}; }
// }

// function buildSharePointPayload(record) {
//   const payload = {
//     operation: record.id ? "update" : "create",
//     id:        record.id ? String(record.id) : ""
//   };

//   for (const [jsKey, spField] of Object.entries(CONFIG.fieldMap)) {
//     if (["created", "modified", "id"].includes(jsKey)) continue;

//     const val = record[jsKey];
//     const s   = (val == null ? "" : String(val)).trim();
//     if (s === "") continue;

//     payload[spField] = CONFIG.numberFields.has(jsKey) ? Number(s) : s;
//   }

//   if (record.personClaims) {
//     payload.person = record.personClaims;
//   }

//   return payload;
// }

// function formToRecord(fd) {
//   const rec = {};
//   for (const key of Object.keys(CONFIG.fieldMap)) {
//     if (["created", "modified"].includes(key)) continue;
//     const raw = fd.get(key);
//     rec[key]  = raw == null ? "" : String(raw).trim();
//   }
//   rec.id     = fd.get("id") || "";
//   rec.personClaims      = fd.get("personClaims") || "";
//   rec.personDisplayName = state.selectedPerson?.displayName || "";
//   rec.personEmail       = state.selectedPerson?.email       || "";

//   return rec;
// }

// // =============================================================================
// // EXPORT CSV
// // =============================================================================
// function exportCsv() {
//   const cols = [
//     ["ideaName",              "Business case idea"],
//     ["personDisplayName",     "Person"],
//     ["department",            "Department or GP"],
//     ["problemStatement",      "Problem statement"],
//     ["scaleBusinessImpact",   "Scale and business impact"],
//     ["currentWorkarounds",    "Current workarounds failing"],
//     ["proposedSolution",      "Innovation approach"],
//     ["mvpScope",              "MVP scope"],
//     ["enabler",               "Technology or process enabler"],
//     ["unfairAdvantage",       "Unfair advantage"],
//     ["valueProposition",      "Value proposition"],
//     ["costSavings",           "Cost savings"],
//     ["efficiencyGain",        "Efficiency gain %"],
//     ["paybackMonths",         "Payback period months"],
//     ["activeUsers",           "Active users"],
//     ["adoptionRate",          "Adoption rate %"],
//     ["revenueImpact",         "Revenue impact"],
//     ["cycleTimeReduction",    "Cycle time reduction %"],
//     ["productivityUplift",    "Productivity uplift %"],
//     ["scheduleImpact",        "Schedule impact"],
//     ["goToMarketChannels",    "Digital and direct sales channel"],
//     ["changeManagement",      "Change management and training"],
//     ["rolloutPlan",           "Phased rollout plan"],
//     ["toolsPlatformCharges",  "Tools and platform charges"],
//     ["licenseCost",           "License cost"],
//     ["developmentCost",       "Development cost"],
//     ["supportMaintenanceCost","Support and maintenance"],
//     ["recurringCostAvoidance","Recurring cost avoidance"],
//     ["marginImprovement",     "Margin improvement %"],
//     ["scalabilityNotes",      "Scalable to all GPs"],
//     ["confidenceLevel",       "Confidence Level"],
//     ["modified",              "Updated"]
//   ];

//   const rows = filtered();
//   const csv  = [
//     cols.map(([, l]) => csvQ(l)).join(","),
//     ...rows.map(r => cols.map(([k]) => csvQ(r[k])).join(","))
//   ].join("\r\n");

//   const a = Object.assign(document.createElement("a"), {
//     href:     URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })),
//     download: `innovation-cases-${new Date().toISOString().slice(0, 10)}.csv`
//   });
//   document.body.append(a);
//   a.click();
//   a.remove();
// }

// // =============================================================================
// // UTILITIES
// // =============================================================================
// function setBusy(v) {
//   state.busy = v;
//   document.body.classList.toggle("is-busy", v);
// }

// function showToast(msg) {
//   clearTimeout(state.toastTimer);
//   els.toast.textContent = msg;
//   els.toast.classList.add("show");
//   state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 4000);
// }

// function numOrZero(v) {
//   return (v === "" || v == null || isNaN(Number(v))) ? 0 : Number(v);
// }

// function choiceText(v) {
//   if (v == null)             return "";
//   if (typeof v === "string") return v;
//   if (typeof v === "object") return v.Value || v.value || v.Label || v.label || "";
//   return String(v);
// }

// const sum  = (recs, k) => recs.reduce((t, r) => t + (Number(r[k]) || 0), 0);
// const nums = (recs, k) => recs.map(r => Number(r[k])).filter(v => isFinite(v) && v > 0);
// const avg  = vals => vals.length ? vals.reduce((t, v) => t + v, 0) / vals.length : 0;

// function fmt$(v) {
//   const n = Number(v) || 0;
//   return new Intl.NumberFormat("en-US", {
//     style:                "currency",
//     currency:             "USD",
//     maximumFractionDigits: n >= 1000 ? 0 : 2
//   }).format(n);
// }

// const fmtPct = v => (!v || v === "0") ? "" : `${fmtN(Number(v), 1)}%`;
// const fmtMo  = v => (!v || v === "0") ? "" : `${fmtN(Number(v), 0)} mo`;

// function fmtN(v, d = 0) {
//   const n = Number(v) || 0;
//   return new Intl.NumberFormat("en-US", {
//     maximumFractionDigits: d,
//     minimumFractionDigits: d > 0 && n % 1 !== 0 ? d : 0
//   }).format(n);
// }

// function fmtDate(v) {
//   if (!v) return "";
//   const d = new Date(v);
//   return isNaN(d) ? "" : new Intl.DateTimeFormat("en-US", {
//     month: "short", day: "numeric", year: "numeric"
//   }).format(d);
// }

// function esc(v) {
//   return String(v ?? "")
//     .replace(/&/g,  "&amp;")
//     .replace(/</g,  "&lt;")
//     .replace(/>/g,  "&gt;")
//     .replace(/"/g,  "&quot;")
//     .replace(/'/g,  "&#39;");
// }

// function escAttr(v) { return esc(v).replace(/`/g, "&#96;"); }

// function csvQ(v) {
//   const t = v == null ? "" : String(v);
//   return `"${t.replace(/"/g, '""')}"`;
// }
