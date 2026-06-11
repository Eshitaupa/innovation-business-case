

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
const CONFIG = {
  listTitle: "OGC Innovation Business Case",

  sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

  listFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/de240397094f4fe39a610c6a0a4d5997/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gJM20WCbDMWgARxFc6pbnqc6oq9cpX5Pw-aLgpp5a-s",

  saveFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f44390bc94a847d29342ab85b1b8ec2d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SkMtR9vKtj7Mf07QWgksvnK8m1OUKOJR4D7TGiZt9bg",

  fieldMap: {
    id:                     "Id",
    ideaName:               "Title",
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

  // ── SPLIT: integer fields vs decimal fields ──────────────────────────────
  // Power Automate schema expects strict Integer for these; send via parseInt.
  integerFields: new Set([
    "paybackMonths", "activeUsers",
    "toolsPlatformCharges", "licenseCost", "developmentCost",
    "supportMaintenanceCost", "recurringCostAvoidance"
  ]),
  // These may have decimals; send via parseFloat.
  floatFields: new Set([
    "costSavings", "efficiencyGain",
    "adoptionRate", "revenueImpact", "cycleTimeReduction",
    "productivityUplift", "marginImprovement"
  ]),

  // Combined for convenience
  get numberFields() {
    const s = new Set([...this.integerFields, ...this.floatFields]);
    return s;
  },

  fallbackChoices: {
    department: ["OGC"],
    status: ["Intake", "Reviewing", "MVP", "Scaling", "On hold"]
  }
};

// =============================================================================
// STATE
// =============================================================================
const state = {
  records:      [],
  allUsers:     [],
  choices:      { department: [], status: [] },
  mode:         "connecting",
  search:       "",
  statusFilter: "All",
  busy:         false,
  toastTimer:   0,
  selectedPerson: null,
  // People picker select filter
  peopleFilterText: ""
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
  buildPeopleSelect();   // build the <select> once users are loaded
  render();
}

// =============================================================================
// DATA LOAD
// =============================================================================
async function loadFromFlow() {
  setBusy(true);
  try {
    const res = await fetch(CONFIG.listFlowUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({})
    });
    if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);
    const data = await res.json();

    if (data.choices && Array.isArray(data.choices.status) && data.choices.status.length) {
      state.choices.status     = data.choices.status;
      state.choices.department = Array.isArray(data.choices.department)
        ? data.choices.department
        : CONFIG.fallbackChoices.department;
    } else {
      const rows = extractRows(data);
      state.choices.status     = uniqueChoices(rows, "field_3") || CONFIG.fallbackChoices.status;
      state.choices.department = uniqueChoices(rows, "field_2") || CONFIG.fallbackChoices.department;
    }

    if (Array.isArray(data.users)) {
      state.allUsers = data.users.filter(u => u.Email);
      console.log(`✓ Loaded ${state.allUsers.length} site users for People Picker`);
    } else {
      state.allUsers = [];
      console.warn("⚠ No users returned from flow.");
    }

    const rows = extractRows(data);
    state.records = rows.map(mapItem);
    state.mode = "flow";

  } catch (err) {
    console.error("Flow load failed:", err);
    state.records  = [];
    state.allUsers = [];
    state.choices  = { ...CONFIG.fallbackChoices };
    state.mode     = "error";
    showToast("⚠ Could not load SharePoint data — " + err.message);
  } finally {
    setBusy(false);
  }
}

async function reloadRecords() {
  setBusy(true);
  try {
    const res = await fetch(CONFIG.listFlowUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({})
    });
    if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);
    const data = await res.json();
    state.records = extractRows(data).map(mapItem);
    state.mode = "flow";
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
    id:                     item.Id || item.ID || "",
    ideaName:               item.Title || "",
    personDisplayName:      p?.DisplayName || p?.displayName || "",
    personEmail:            p?.Email       || p?.email       || "",
    personClaims:           p?.Claims      || p?.claims      || "",
    department:             choiceText(item.field_2),
    status:                 choiceText(item.field_3) || "Intake",
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
    scheduleImpact:         item.field_20 || "",
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
    created:                item.Created  || "",
    modified:               item.Modified || ""
  };
}

// =============================================================================
// PEOPLE PICKER  — select + filter input (no floating list, no layout disruption)
// =============================================================================

/**
 * Build (or rebuild) the hidden <select> and inject the filter input above it.
 * The <select> lives inside #peoplePicker which already has the label in HTML.
 * We replace whatever is in that container with two elements:
 *   1. A text <input> for filtering
 *   2. A <select> showing matched users
 */
function buildPeopleSelect() {
  const container = document.getElementById("peoplePicker");
  if (!container) return;

  // Wipe the old autocomplete markup
  container.innerHTML = "";

  // ── Filter input ────────────────────────────────────────────────────────
  const filterInput = document.createElement("input");
  filterInput.type        = "text";
  filterInput.id          = "personFilterInput";
  filterInput.placeholder = "Type to filter people…";
  filterInput.autocomplete = "off";
  filterInput.setAttribute("aria-label", "Filter people list");

  // ── Select ──────────────────────────────────────────────────────────────
  const sel = document.createElement("select");
  sel.id   = "personSelect";
  sel.size = 5;           // shows 5 rows; still scrollable for more
  sel.setAttribute("aria-label", "Select a person");
  // Show only when there is at least 1 char in the filter
  sel.style.display = "none";

  container.appendChild(filterInput);
  container.appendChild(sel);

  // ── Events ───────────────────────────────────────────────────────────────
  filterInput.addEventListener("input", () => {
    const q = filterInput.value.trim().toLowerCase();
    if (q.length < 1) {
      sel.style.display = "none";
      sel.innerHTML = "";
      return;
    }

    const matches = state.allUsers
      .filter(u =>
        (u.Title || "").toLowerCase().includes(q) ||
        (u.Email || "").toLowerCase().includes(q)
      )
      .slice(0, 50);

    sel.innerHTML = matches.length
      ? matches.map(u =>
          `<option value="${escAttr(u.LoginName)}"
            data-name="${escAttr(u.Title)}"
            data-email="${escAttr(u.Email)}">
            ${esc(u.Title)} — ${esc(u.Email)}
          </option>`
        ).join("")
      : `<option disabled>No results</option>`;

    sel.style.display = "block";
    // Re-select if previously selected person still in list
    if (state.selectedPerson?.claims) {
      const opt = sel.querySelector(`option[value="${escAttr(state.selectedPerson.claims)}"]`);
      if (opt) opt.selected = true;
    }
  });

  sel.addEventListener("change", () => {
    const opt = sel.options[sel.selectedIndex];
    if (!opt || opt.disabled) return;
    state.selectedPerson = {
      displayName: opt.dataset.name,
      email:       opt.dataset.email,
      claims:      opt.value
    };
    // Write claims to hidden form field
    if (els.caseForm?.elements.personClaims) {
      els.caseForm.elements.personClaims.value = opt.value;
    }
  });
}

/** Pre-fill picker when editing a record */
function fillPersonPicker(record) {
  const filterInput = document.getElementById("personFilterInput");
  const sel         = document.getElementById("personSelect");
  if (!filterInput || !sel || !record.personDisplayName) return;

  state.selectedPerson = {
    displayName: record.personDisplayName,
    email:       record.personEmail,
    claims:      record.personClaims
  };

  // Show the name in the filter box so the user sees who is selected
  filterInput.value = record.personDisplayName;

  // Populate select with just this user so it shows as selected
  sel.innerHTML = `<option value="${escAttr(record.personClaims)}"
    data-name="${escAttr(record.personDisplayName)}"
    data-email="${escAttr(record.personEmail)}" selected>
    ${esc(record.personDisplayName)} — ${esc(record.personEmail)}
  </option>`;
  sel.style.display = "block";

  if (els.caseForm?.elements.personClaims) {
    els.caseForm.elements.personClaims.value = record.personClaims;
  }
}

/** Reset picker to empty state */
function resetPersonPicker() {
  state.selectedPerson = null;
  const filterInput = document.getElementById("personFilterInput");
  const sel         = document.getElementById("personSelect");
  if (filterInput) filterInput.value = "";
  if (sel)  { sel.innerHTML = ""; sel.style.display = "none"; }
  if (els.caseForm?.elements.personClaims) {
    els.caseForm.elements.personClaims.value = "";
  }
}

// =============================================================================
// DROPDOWNS
// =============================================================================
function populateDropdowns() {
  const deptSel    = document.querySelector('select[name="department"]');
  const statusSel  = document.querySelector('select[name="status"]');
  const statusFilt = document.getElementById("statusFilter");

  if (deptSel)    deptSel.innerHTML    = "";
  if (statusSel)  statusSel.innerHTML  = "";
  if (statusFilt) statusFilt.innerHTML = '<option value="All">All statuses</option>';

  state.choices.department.forEach(c => {
    if (!c) return;
    const o = document.createElement("option");
    o.value = o.textContent = c;
    deptSel?.appendChild(o);
  });

  state.choices.status.forEach(c => {
    if (!c) return;
    const o1 = document.createElement("option"); o1.value = o1.textContent = c;
    const o2 = document.createElement("option"); o2.value = o2.textContent = c;
    statusSel?.appendChild(o1);
    statusFilt?.appendChild(o2);
  });
}

// =============================================================================
// DOM CACHE & EVENTS
// =============================================================================
function cacheElements() {
  [
    "connectionBadge", "refreshButton", "exportButton", "newCaseButton",
    "caseRows", "searchInput", "statusFilter",
    "summaryTotal", "summarySavings", "summaryEfficiency", "summaryPayback",
    "drawerBackdrop", "closeDrawerButton", "cancelButton",
    "caseForm", "drawerTitle", "saveButton", "toast"
  ].forEach(id => els[id] = document.getElementById(id));

  els.drawer = document.getElementById("caseDrawer");
}

function bindEvents() {
  els.newCaseButton.addEventListener("click",  () => openDrawer());
  els.closeDrawerButton.addEventListener("click", closeDrawer);
  els.cancelButton.addEventListener("click",   closeDrawer);
  els.drawerBackdrop.addEventListener("click", closeDrawer);
  els.exportButton.addEventListener("click",   exportCsv);
  els.caseForm.addEventListener("submit",      saveCurrentCase);

  els.searchInput.addEventListener("input", e => {
    state.search = e.target.value.trim().toLowerCase();
    renderTable();
  });

  els.statusFilter.addEventListener("change", e => {
    state.statusFilter = e.target.value;
    renderTable();
  });

  els.refreshButton.addEventListener("click", async () => {
    await reloadRecords();
    render();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && els.drawer.classList.contains("open")) closeDrawer();
  });

  document.addEventListener("wheel", e => {
    if (document.activeElement.type === "number") e.preventDefault();
  }, { passive: false });
}

// =============================================================================
// RENDER
// =============================================================================
function render() {
  renderBadge();
  renderSummaries();
  renderTable();
}

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
      `<tr class="empty-row"><td colspan="11">No business cases match the current view.</td></tr>`;
    return;
  }

  els.caseRows.innerHTML = rows.map(r => `
    <tr>
      <td class="idea-cell">${esc(r.ideaName || "Untitled case")}</td>
      <td><span class="status-pill" data-status="${esc(r.status)}">${esc(r.status)}</span></td>
      <td>${esc(r.personDisplayName)}</td>
      <td class="text-cell">${esc(r.valueProposition)}</td>
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
      if (rec) openDrawer(rec);
    })
  );
}

function filtered() {
  const q = state.search;
  return [...state.records]
    .filter(r => state.statusFilter === "All" || r.status === state.statusFilter)
    .filter(r => !q || [
      r.ideaName, r.personDisplayName, r.personEmail,
      r.department, r.status, r.problemStatement, r.valueProposition
    ].some(v => String(v || "").toLowerCase().includes(q)))
    .sort((a, b) => new Date(b.modified || b.created || 0) - new Date(a.modified || a.created || 0));
}

// =============================================================================
// DRAWER
// =============================================================================
function openDrawer(record = null) {
  els.caseForm.reset();
  resetPersonPicker();
  els.drawerTitle.textContent = record ? "Edit innovation case" : "New innovation case";

  if (record) {
    Object.keys(CONFIG.fieldMap).forEach(key => {
      const ctrl = els.caseForm.elements[key];
      if (ctrl && record[key] != null) ctrl.value = record[key];
    });
    els.caseForm.elements.id.value = record.id;
    fillPersonPicker(record);
  } else {
    els.caseForm.elements.id.value = "";
    const firstStatus = state.choices.status[0] || "Intake";
    if (els.caseForm.elements.status) els.caseForm.elements.status.value = firstStatus;
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
  resetPersonPicker();
}

// =============================================================================
// SAVE
// =============================================================================
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
    await saveViaFlow(record);
    await reloadRecords();
    closeDrawer();
    els.caseForm.reset();
    render();
    showToast(record.id ? "✓ Updated in SharePoint." : "✓ Saved to SharePoint.");
  } catch (err) {
    console.error("Save failed:", err);
    showToast(`Save failed: ${err.message}`);
  } finally {
    setBusy(false);
  }
}

async function saveViaFlow(record) {
  const payload = buildSharePointPayload(record);
  console.log("Saving payload:", payload);

  const res = await fetch(CONFIG.saveFlowUrl, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload)
  });

  let text = "";
  try { text = await res.text(); } catch {}
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  try { return text ? JSON.parse(text) : {}; } catch { return {}; }
}

/**
 * Build the JSON payload for the Save Flow.
 *
 * FIX for HTTP 400 TriggerInputSchemaMismatch:
 *   Power Automate's schema expects strict Integer/Number types.
 *   We now use parseInt() for integer fields and parseFloat() for decimal
 *   fields, and skip any field whose value is blank / NaN so we never send
 *   a string where the schema expects a number.
 */
function buildSharePointPayload(record) {
  const payload = {
    operation: record.id ? "update" : "create",
    id:        record.id ? String(record.id) : ""
  };

  Object.entries(CONFIG.fieldMap).forEach(([jsKey, spField]) => {
    if (["created", "modified", "id"].includes(jsKey)) return;

    const val = record[jsKey];

    if (CONFIG.integerFields.has(jsKey)) {
      // Must be a whole integer — skip if empty
      if (val === "" || val == null) return;
      const n = parseInt(val, 10);
      if (isNaN(n)) return;
      payload[spField] = n;

    } else if (CONFIG.floatFields.has(jsKey)) {
      // Decimal-safe number — skip if empty
      if (val === "" || val == null) return;
      const n = parseFloat(val);
      if (isNaN(n)) return;
      payload[spField] = n;

    } else {
      // Text field — skip if empty
      const s = String(val ?? "").trim();
      if (s === "") return;
      payload[spField] = s;
    }
  });

  // People/Group field
  if (record.personClaims) {
    payload["person"]            = record.personClaims;
    payload["personDisplayName"] = record.personDisplayName || "";
  }

  return payload;
}

/** Reads FormData → clean JS record */
function formToRecord(fd) {
  const rec = {};

  Object.keys(CONFIG.fieldMap).forEach(key => {
    if (["created", "modified"].includes(key)) return;
    const val = fd.get(key);

    if (CONFIG.integerFields.has(key)) {
      rec[key] = (val === "" || val == null) ? null : parseInt(val, 10);
    } else if (CONFIG.floatFields.has(key)) {
      rec[key] = (val === "" || val == null) ? null : parseFloat(val);
    } else {
      rec[key] = val == null ? "" : String(val).trim();
    }
  });

  rec.id                = fd.get("id") || "";
  rec.status            = rec.status || state.choices.status[0] || "Intake";
  rec.personClaims      = fd.get("personClaims") || "";
  rec.personDisplayName = state.selectedPerson?.displayName || state.selectedPerson?.DisplayName || "";
  rec.personEmail       = state.selectedPerson?.email       || state.selectedPerson?.Email       || "";

  return rec;
}

// =============================================================================
// EXPORT CSV
// =============================================================================
function exportCsv() {
  const cols = [
    ["ideaName",             "Business case idea"],
    ["status",               "Status"],
    ["personDisplayName",    "Person"],
    ["department",           "Department or GP"],
    ["problemStatement",     "Problem statement"],
    ["scaleBusinessImpact",  "Scale and business impact"],
    ["currentWorkarounds",   "Current workarounds failing"],
    ["proposedSolution",     "Innovation approach"],
    ["mvpScope",             "MVP scope"],
    ["enabler",              "Technology or process enabler"],
    ["unfairAdvantage",      "Unfair advantage"],
    ["valueProposition",     "Value proposition"],
    ["costSavings",          "Cost savings"],
    ["efficiencyGain",       "Efficiency gain %"],
    ["paybackMonths",        "Payback period months"],
    ["activeUsers",          "Active users"],
    ["adoptionRate",         "Adoption rate %"],
    ["revenueImpact",        "Revenue impact"],
    ["cycleTimeReduction",   "Cycle time reduction %"],
    ["productivityUplift",   "Productivity uplift %"],
    ["scheduleImpact",       "Schedule impact"],
    ["goToMarketChannels",   "Digital and direct sales channel"],
    ["changeManagement",     "Change management and training"],
    ["rolloutPlan",          "Phased rollout plan"],
    ["toolsPlatformCharges", "Tools and platform charges"],
    ["licenseCost",          "License cost"],
    ["developmentCost",      "Development cost"],
    ["supportMaintenanceCost","Support and maintenance"],
    ["recurringCostAvoidance","Recurring cost avoidance"],
    ["marginImprovement",    "Margin improvement %"],
    ["scalabilityNotes",     "Scalable to all GPs"],
    ["modified",             "Updated"]
  ];

  const rows = filtered();
  const csv  = [
    cols.map(([, label]) => csvQ(label)).join(","),
    ...rows.map(r => cols.map(([key]) => csvQ(r[key])).join(","))
  ].join("\r\n");

  const a = Object.assign(document.createElement("a"), {
    href:     URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })),
    download: `innovation-cases-${new Date().toISOString().slice(0, 10)}.csv`
  });
  document.body.append(a);
  a.click();
  a.remove();
}

// =============================================================================
// UTILITY HELPERS
// =============================================================================
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

function numOrZero(v) {
  return v === "" || v == null || isNaN(Number(v)) ? 0 : Number(v);
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

const fmtPct = v => (v === "" || v == null) ? "" : `${fmtN(Number(v), 1)}%`;
const fmtMo  = v => (v === "" || v == null) ? "" : `${fmtN(Number(v), 0)} mo`;

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
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escAttr(v) { return esc(v).replace(/`/g, "&#96;"); }

function csvQ(v) {
  const t = v == null ? "" : String(v);
  return `"${t.replace(/"/g, '""')}"`;
}