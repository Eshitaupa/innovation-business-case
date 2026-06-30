
// const CONFIG = {
//   listTitle: "OGC Innovation Business Case",
//   sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

//   listFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/de240397094f4fe39a610c6a0a4d5997/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gJM20WCbDMWgARxFc6pbnqc6oq9cpX5Pw-aLgpp5a-s",

//   saveFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f44390bc94a847d29342ab85b1b8ec2d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SkMtR9vKtj7Mf07QWgksvnK8m1OUKOJR4D7TGiZt9bg",

// deleteFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b78b3db90e304888a38d3f594c1932dd/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dl0m779qsg2IlSRUa_-S1paDAbW3uNjL8kKzlo4csZQ",

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
//     "costSavings","efficiencyGain","paybackMonths","activeUsers","adoptionRate",
//     "revenueImpact","cycleTimeReduction","productivityUplift","scheduleImpact",
//     "toolsPlatformCharges","licenseCost","developmentCost","supportMaintenanceCost",
//     "recurringCostAvoidance","marginImprovement"
//   ]),

//   richTextFields: new Set([
//     "problemStatement","currentWorkarounds","proposedSolution","mvpScope",
//     "valueProposition","goToMarketChannels","changeManagement","rolloutPlan","scalabilityNotes"
//   ]),

//   plainTextFields: new Set([
//     "costSavings","revenueImpact","toolsPlatformCharges","licenseCost",
//     "developmentCost","supportMaintenanceCost","recurringCostAvoidance",
//     "productivityUplift","marginImprovement"
//   ]),

//   richTextLimits: {
//     problemStatement:   255,
//     currentWorkarounds: 2000,
//     proposedSolution:   3000,
//     mvpScope:           2000,
//     valueProposition:   3000,
//     goToMarketChannels: 2000,
//     changeManagement:   2000,
//     rolloutPlan:        2000,
//     scalabilityNotes:   2000
//   },

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
//   selectedPerson: null,
//   richTextValues: {}
// };

// const els = {};

// // =============================================================================
// // BOOT
// // =============================================================================
// document.addEventListener("DOMContentLoaded", init);

// async function init() {
//   cacheElements();
//   bindEvents();
//   buildRichTextEditors();
//   await loadFromFlow();
//   populateDropdowns();
//   buildPeopleSelect();
//   render();
// }

// // =============================================================================
// // RICH TEXT EDITOR
// // =============================================================================
// function buildRichTextEditors() {
//   CONFIG.richTextFields.forEach(fieldName => {
//     const textarea = els.caseForm?.elements[fieldName];
//     if (!textarea) return;

//     const limit = CONFIG.richTextLimits[fieldName];

//     const wrapper = document.createElement("div");
//     wrapper.className = "rich-editor-wrapper";
//     wrapper.setAttribute("data-field", fieldName);

//     const toolbar = document.createElement("div");
//     toolbar.className = "rich-toolbar";
//     toolbar.innerHTML = `
//       <button type="button" class="rich-btn" data-cmd="bold" title="Bold"><b>B</b></button>
//       <button type="button" class="rich-btn" data-cmd="italic" title="Italic"><i>I</i></button>
//       <button type="button" class="rich-btn" data-cmd="underline" title="Underline"><u>U</u></button>
//       <span class="rich-sep"></span>
//       <button type="button" class="rich-btn" data-cmd="insertUnorderedList" title="Bullet list">&#8226; List</button>
//       <button type="button" class="rich-btn" data-cmd="insertOrderedList" title="Numbered list">1. List</button>
//       <span class="rich-sep"></span>
//       <button type="button" class="rich-btn" data-cmd="justifyLeft" title="Align left">Left</button>
//       <button type="button" class="rich-btn" data-cmd="justifyCenter" title="Align center">Center</button>
//       <button type="button" class="rich-btn" data-cmd="justifyRight" title="Align right">Right</button>
//       <button type="button" class="rich-btn" data-cmd="justifyFull" title="Justify">Justify</button>
//       <span class="rich-sep"></span>
//       <button type="button" class="rich-btn" data-cmd="removeFormat" title="Clear formatting">&#10005; Clear</button>
//     `;

//     const editor = document.createElement("div");
//     editor.className = "rich-editor";
//     editor.contentEditable = "true";
//     editor.setAttribute("role", "textbox");
//     editor.setAttribute("aria-multiline", "true");
//     editor.setAttribute("data-field", fieldName);
//     editor.setAttribute("data-limit", limit);

//     const counter = document.createElement("div");
//     counter.className = "rich-counter";
//     counter.id = `counter-${fieldName}`;
//     counter.textContent = `0 / ${limit}`;

//     const limitMsg = document.createElement("div");
//     limitMsg.className = "rich-limit-msg";
//     limitMsg.id = `limit-${fieldName}`;
//     limitMsg.textContent = `Maximum ${limit.toLocaleString()} characters allowed.`;

//     wrapper.appendChild(toolbar);
//     wrapper.appendChild(editor);
//     wrapper.appendChild(counter);
//     wrapper.appendChild(limitMsg);

//     textarea.parentNode.insertBefore(wrapper, textarea);
//     textarea.style.display = "none";

//     editor.dataset.lastValidHtml = "";

//     toolbar.querySelectorAll(".rich-btn[data-cmd]").forEach(btn => {
//       btn.addEventListener("mousedown", e => e.preventDefault());
//       btn.addEventListener("click", e => {
//         e.preventDefault();
//         const cmd = btn.getAttribute("data-cmd");
//         runRichCommand(editor, toolbar, cmd);
//         updateCounter(editor, counter, limitMsg, limit);
//         syncEditorToTextarea(fieldName);
//       });
//     });

//     editor.addEventListener("beforeinput", e => {
//       if (e.inputType && e.inputType.startsWith("delete")) return;
//       const currentLen = getEditorTextLength(editor);
//       const selectedLen = getSelectedTextLength(editor);
//       const incomingLen = e.data ? e.data.length : 0;
//       if (incomingLen && currentLen - selectedLen + incomingLen > limit) {
//         e.preventDefault();
//         limitMsg.classList.add("show");
//         setTimeout(() => limitMsg.classList.remove("show"), 3000);
//       }
//     });

//     editor.addEventListener("input", () => {
//       enforceLimit(editor, counter, limitMsg, limit);
//       saveRichSelection(editor);
//       syncEditorToTextarea(fieldName);
//     });

//     editor.addEventListener("paste", e => {
//       e.preventDefault();
//       const text = (e.clipboardData || window.clipboardData).getData("text/plain");
//       insertPlainTextWithinLimit(editor, text, limit, limitMsg);
//       enforceLimit(editor, counter, limitMsg, limit);
//       saveRichSelection(editor);
//       syncEditorToTextarea(fieldName);
//     });

//     ["keyup", "mouseup", "focus", "click"].forEach(evt => {
//       editor.addEventListener(evt, () => {
//         saveRichSelection(editor);
//         updateToolbarState(toolbar, editor);
//       });
//     });
//   });
// }

// function enforceLimit(editor, counter, limitMsg, limit) {
//   const len = getEditorTextLength(editor);
//   counter.textContent = `${len} / ${limit}`;
//   if (len > limit) {
//     counter.classList.add("over");
//     limitMsg.classList.add("show");
//     restoreLastValidEditorState(editor);
//     setTimeout(() => limitMsg.classList.remove("show"), 3000);
//   } else {
//     counter.classList.remove("over");
//     limitMsg.classList.remove("show");
//     editor.dataset.lastValidHtml = editor.innerHTML;
//   }
// }

// function updateCounter(editor, counter, limitMsg, limit) {
//   const len = getEditorTextLength(editor);
//   counter.textContent = `${len} / ${limit}`;
//   counter.classList.toggle("over", len > limit);
//   limitMsg.classList.toggle("show", len > limit);
//   if (len <= limit) editor.dataset.lastValidHtml = editor.innerHTML;
// }

// function getEditorTextLength(editor) {
//   return (editor.innerText || "").replace(/\n$/, "").length;
// }

// function selectionIsInside(editor) {
//   const sel = window.getSelection();
//   return !!(sel && sel.rangeCount && editor.contains(sel.anchorNode));
// }

// function saveRichSelection(editor) {
//   const sel = window.getSelection();
//   if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;
//   editor._savedRange = sel.getRangeAt(0).cloneRange();
// }

// function restoreRichSelection(editor) {
//   const sel = window.getSelection();
//   if (!sel) return;
//   editor.focus();
//   if (editor._savedRange && editor.contains(editor._savedRange.commonAncestorContainer)) {
//     sel.removeAllRanges();
//     sel.addRange(editor._savedRange);
//     return;
//   }
//   placeCaretAtEnd(editor);
// }

// function placeCaretAtEnd(el) {
//   const range = document.createRange();
//   range.selectNodeContents(el);
//   range.collapse(false);
//   const sel = window.getSelection();
//   sel.removeAllRanges();
//   sel.addRange(range);
// }

// function getSelectedTextLength(editor) {
//   const sel = window.getSelection();
//   if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return 0;
//   return String(sel.toString() || "").length;
// }

// function insertPlainTextWithinLimit(editor, text, limit, limitMsg) {
//   restoreRichSelection(editor);
//   const currentLen = getEditorTextLength(editor);
//   const selectedLen = getSelectedTextLength(editor);
//   const available = Math.max(0, limit - (currentLen - selectedLen));
//   const insertText = String(text || "").slice(0, available);
//   if (insertText.length < String(text || "").length) {
//     limitMsg.classList.add("show");
//     setTimeout(() => limitMsg.classList.remove("show"), 3000);
//   }
//   if (insertText) document.execCommand("insertText", false, insertText);
// }

// function restoreLastValidEditorState(editor) {
//   editor.innerHTML = editor.dataset.lastValidHtml || "";
//   placeCaretAtEnd(editor);
// }

// function runRichCommand(editor, toolbar, cmd) {
//   restoreRichSelection(editor);
//   document.execCommand("styleWithCSS", false, false);
//   document.execCommand(cmd, false, null);
//   saveRichSelection(editor);
//   updateToolbarState(toolbar, editor);
// }

// function updateToolbarState(toolbar, editor) {
//   if (editor && !selectionIsInside(editor)) return;
//   const cmds = ["bold", "italic", "underline", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull"];
//   cmds.forEach(cmd => {
//     const btn = toolbar.querySelector(`[data-cmd="${cmd}"]`);
//     if (btn) btn.classList.toggle("active", document.queryCommandState(cmd));
//   });
// }

// function syncEditorToTextarea(fieldName) {
//   const editor = document.querySelector(`.rich-editor[data-field="${fieldName}"]`);
//   const textarea = els.caseForm?.elements[fieldName];
//   if (editor && textarea) {
//     textarea.value = editor.innerHTML;
//     state.richTextValues[fieldName] = editor.innerHTML;
//   }
// }

// function setEditorContent(fieldName, htmlContent) {
//   const editor = document.querySelector(`.rich-editor[data-field="${fieldName}"]`);
//   const counter = document.getElementById(`counter-${fieldName}`);
//   const limitMsg = document.getElementById(`limit-${fieldName}`);
//   const limit = CONFIG.richTextLimits[fieldName];

//   if (editor) {
//     editor.innerHTML = htmlContent || "";
//     editor.dataset.lastValidHtml = editor.innerHTML;
//     if (counter) updateCounter(editor, counter, limitMsg, limit);
//   }

//   const textarea = els.caseForm?.elements[fieldName];
//   if (textarea) textarea.value = htmlContent || "";
// }

// function clearAllEditors() {
//   CONFIG.richTextFields.forEach(fieldName => {
//     setEditorContent(fieldName, "");
//   });
//   state.richTextValues = {};
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
//       state.choices.department      = uniqueChoices(rows, "field_2")                 || [...CONFIG.fallbackChoices.department];
//       state.choices.confidenceLevel = uniqueChoices(rows, "Confidence_x0020_Level") || [...CONFIG.fallbackChoices.confidenceLevel];
//     }

//     state.allUsers = Array.isArray(data.users)
//       ? data.users.filter(u => u.Email)
//       : [];

//     state.records = extractRows(data).map(mapItem);
//     state.mode    = "flow";
//   } catch (err) {
//     console.error("Flow load failed:", err);
//     state.records  = [];
//     state.allUsers = [];
//     state.choices  = {
//       department:      [...CONFIG.fallbackChoices.department],
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
// // =============================================================================
// function buildPeopleSelect() {
//   const container = document.getElementById("peoplePicker");
//   if (!container) return;
//   container.innerHTML = "";

//   const filterInput = document.createElement("input");
//   filterInput.type         = "text";
//   filterInput.id           = "personFilterInput";
//   filterInput.placeholder  = "Type name or email…";
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
//   const deptSel = document.querySelector('select[name="department"]');
//   const confSel = document.querySelector('select[name="confidenceLevel"]');

//   if (deptSel) deptSel.innerHTML = "";
//   if (confSel) confSel.innerHTML = "";

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
// // DELETE
// // =============================================================================
// function handleDeleteClick(id) {
//   if (!id) return;

//   const rec = state.records.find(r => String(r.id) === String(id));
//   const name = rec?.ideaName || "this record";

//   showConfirmModal(
//     "Delete business case",
//     `Are you sure you want to delete "<strong>${esc(name)}</strong>"? This action cannot be undone.`,
//     "Delete",
//     async () => {
//       await deleteRecord(id);
//     }
//   );
// }
// async function deleteRecord(id) {
//   if (!id) return;

//   const oldRecords = [...state.records];

//   // 1. Optimistically remove from UI immediately
//   state.records = state.records.filter(r => String(r.id) !== String(id));
//   render();

//   try {
//     const res = await fetch(CONFIG.deleteFlowUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: Number(id) })
//     });

//     const text = await res.text().catch(() => "");

//     if (!res.ok) {
//       console.error("Delete flow error:", res.status, text);
//       throw new Error(`HTTP ${res.status}: ${text || "Flow returned an error"}`);
//     }

//     showToast("✓ Record deleted.");

//   } catch (err) {
//     // Restore the record in UI if SharePoint call failed
//     state.records = oldRecords;
//     render();
//     console.error("Delete failed:", err);
//     showToast("⚠ Delete failed — " + err.message);
//   }
// }
// function showConfirmModal(title, bodyHtml, confirmLabel, onConfirm) {
//   document.getElementById("confirmModal")?.remove();

//   const modal = document.createElement("div");
//   modal.id = "confirmModal";
//   modal.setAttribute("role", "alertdialog");
//   modal.setAttribute("aria-modal", "true");
//   modal.setAttribute("aria-labelledby", "confirmModalTitle");

//   // Inline styles so z-index is guaranteed regardless of CSS load order
//   Object.assign(modal.style, {
//     position:       "fixed",
//     inset:          "0",
//     zIndex:         "9999",        // above drawer (11) and error modal (20)
//     background:     "rgba(18,26,22,0.5)",
//     display:        "flex",
//     alignItems:     "center",
//     justifyContent: "center",
//     padding:        "20px"
//   });

//   const name = bodyHtml.replace(/<[^>]*>/g, "").replace(/"/g, "");

//   modal.innerHTML = `
//     <div style="
//       background: var(--panel, #fff);
//       border-radius: 12px;
//       border: 1px solid var(--danger-line, #fca5a5);
//       box-shadow: 0 18px 48px rgba(13,32,66,0.18);
//       padding: 24px;
//       max-width: 440px;
//       width: 100%;
//     ">
//       <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
//         <div style="
//           width:36px;height:36px;border-radius:50%;
//           background:var(--danger-soft,#fff1f0);
//           display:flex;align-items:center;justify-content:center;flex:0 0 auto;
//         ">
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//             stroke="var(--danger,#b42318)" stroke-width="2"
//             stroke-linecap="round" stroke-linejoin="round">
//             <path d="M3 6h18"/><path d="M8 6V4h8v2"/>
//             <path d="M19 6l-1 14H6L5 6"/>
//             <path d="M10 11v6M14 11v6"/>
//           </svg>
//         </div>
//         <h3 id="confirmModalTitle" style="margin:0;flex:1;font-size:17px;font-weight:700;color:var(--ink,#0f1c2e);">
//           ${esc(title)}
//         </h3>
//         <button id="confirmClose" type="button" aria-label="Close" style="
//           background:transparent;border:none;cursor:pointer;padding:4px;
//           color:var(--muted,#6b7c93);display:flex;align-items:center;
//         ">
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//             stroke="currentColor" stroke-width="2"
//             stroke-linecap="round" stroke-linejoin="round">
//             <path d="M18 6 6 18M6 6l12 12"/>
//           </svg>
//         </button>
//       </div>
//       <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:var(--ink,#0f1c2e);">
//         Are you sure you want to delete
//       </p>
//       <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:var(--ink,#0f1c2e);">
//         "${esc(name)}"
//       </p>
//       <p style="margin:0 0 20px;font-size:13px;color:var(--muted,#6b7c93);">
//         This action cannot be undone.
//       </p>
//       <div style="display:flex;gap:10px;justify-content:flex-end;">
//         <button id="confirmCancel" type="button" style="
//           min-height:38px;padding:0 16px;
//           border:1px solid var(--line,#d6e0f0);border-radius:8px;
//           background:var(--panel,#fff);color:var(--ink,#0f1c2e);
//           font:inherit;font-weight:650;cursor:pointer;
//         ">Cancel</button>
//         <button id="confirmOk" type="button" style="
//           min-height:38px;padding:0 16px;
//           border:1px solid var(--danger,#b42318);border-radius:8px;
//           background:var(--danger,#b42318);color:#fff;
//           font:inherit;font-weight:650;cursor:pointer;
//           display:inline-flex;align-items:center;gap:8px;
//         ">
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
//             stroke="currentColor" stroke-width="2"
//             stroke-linecap="round" stroke-linejoin="round">
//             <path d="M3 6h18"/><path d="M8 6V4h8v2"/>
//             <path d="M19 6l-1 14H6L5 6"/>
//             <path d="M10 11v6M14 11v6"/>
//           </svg>
//           ${esc(confirmLabel)}
//         </button>
//       </div>
//     </div>
//   `;

//   const close = () => modal.remove();

//   modal.querySelector("#confirmClose").addEventListener("click", close);
//   modal.querySelector("#confirmCancel").addEventListener("click", close);
//   modal.querySelector("#confirmOk").addEventListener("click", () => {
//     close();
//     onConfirm();
//   });

//   // Only close on backdrop click, not on box click
//   modal.addEventListener("click", e => {
//     if (e.target === modal) close();
//   });

//   document.body.appendChild(modal);
//   setTimeout(() => modal.querySelector("#confirmOk")?.focus(), 50);
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
//   els.summarySavings.textContent    = fmtPlain(sum(f, "costSavings"));
//   els.summaryEfficiency.textContent = `${fmtN(avg(nums(f, "efficiencyGain")), 1)}%`;
//   els.summaryPayback.textContent    = `${fmtN(avg(nums(f, "paybackMonths")), 0)} mo`;
// }

// function renderTable() {
//   renderSummaries();
//   const rows = filtered();

//   if (!rows.length) {
//     els.caseRows.innerHTML =
//       `<tr class="empty-row"><td colspan="10">No business cases match the current view.</td></tr>`;
//     return;
//   }

//   els.caseRows.innerHTML = rows.map(r => `
//     <tr>
//       <td class="idea-cell">${esc(r.ideaName)}</td>
//       <td>${esc(r.personDisplayName)}</td>
//       <td class="text-cell">${stripHtml(r.problemStatement)}</td>
//       <td class="number-cell">${fmtPlain(r.costSavings)}</td>
//       <td class="number-cell">${fmtPct(r.efficiencyGain)}</td>
//       <td class="number-cell">${fmtMo(r.paybackMonths)}</td>
//       <td class="number-cell">${fmtPct(r.adoptionRate)}</td>
//       <td class="number-cell">${fmtPlain(r.revenueImpact)}</td>
//       <td class="number-cell">${fmtDate(r.modified || r.created)}</td>
//       <td class="action-col">
//         <div class="row-actions">
//           <button class="icon-button row-action" type="button"
//             title="Edit" aria-label="Edit ${escAttr(r.ideaName || "case")}"
//             data-edit-id="${escAttr(r.id)}">
//             <svg><use href="#icon-edit"></use></svg>
//           </button>
//           <button class="icon-button row-action row-delete" type="button"
//             title="Delete" aria-label="Delete ${escAttr(r.ideaName || "case")}"
//             data-delete-id="${escAttr(r.id)}">
//             <svg><use href="#icon-trash"></use></svg>
//           </button>
//         </div>
//       </td>
//     </tr>`).join("");

//   els.caseRows.querySelectorAll("[data-edit-id]").forEach(btn =>
//     btn.addEventListener("click", () => {
//       const rec = state.records.find(x => String(x.id) === String(btn.dataset.editId));
//       if (rec) openDrawer(rec);
//     })
//   );

//   els.caseRows.querySelectorAll("[data-delete-id]").forEach(btn =>
//     btn.addEventListener("click", () => {
//       handleDeleteClick(btn.dataset.deleteId);
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
//   clearAllEditors();
//   clearAllFieldErrors();
//   els.drawerTitle.textContent = record ? "Edit innovation case" : "New innovation case";

//   if (record) {
//     for (const key of Object.keys(CONFIG.fieldMap)) {
//       const ctrl = els.caseForm.elements[key];
//       if (!ctrl) continue;
//       const v = record[key];
//       if (v == null) continue;

//       if (CONFIG.richTextFields.has(key)) {
//         setEditorContent(key, v);
//       } else {
//         ctrl.value = v;
//       }
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
//   document.body.classList.add("drawer-open");
//   setTimeout(() => els.caseForm.elements.ideaName?.focus(), 30);
// }

// function closeDrawer() {
//   els.drawer.classList.remove("open");
//   els.drawer.setAttribute("aria-hidden", "true");
//   els.drawerBackdrop.hidden = true;
//   document.body.classList.remove("drawer-open");
//   resetPersonPicker();
//   clearAllFieldErrors();
// }

// // =============================================================================
// // VALIDATION & ERROR DISPLAY
// // =============================================================================
// const FIELD_LABELS = {
//   ideaName:               "Business Case idea",
//   department:             "Department",
//   problemStatement:       "Pain point users face today",
//   currentWorkarounds:     "Current workarounds failing",
//   proposedSolution:       "Innovation approach",
//   mvpScope:               "MVP scope",
//   valueProposition:       "Strategic Benefits",
//   costSavings:            "Cost savings",
//   efficiencyGain:         "Efficiency gain %",
//   paybackMonths:          "Payback period months",
//   adoptionRate:           "Adoption rate %",
//   revenueImpact:          "Revenue impact",
//   confidenceLevel:        "Confidence Level"
// };

// function validateForm(record) {
//   const errors = [];

//   if (!record.ideaName?.trim()) {
//     errors.push({ field: "ideaName", message: "Business Case idea is required." });
//   }

//   const pctFields = [
//     { key: "efficiencyGain",    label: "Efficiency gain %" },
//     { key: "adoptionRate",      label: "Adoption rate %" },
//     { key: "cycleTimeReduction", label: "Cycle time reduction %" },
//     { key: "scheduleImpact",    label: "Schedule impact" },
//     { key: "productivityUplift", label: "Productivity uplift %" },
//     { key: "marginImprovement", label: "Margin improvement %" }
//   ];

//   pctFields.forEach(({ key, label }) => {
//     const v = Number(record[key]);
//     if (record[key] !== "" && record[key] !== null && (v < 0 || v > 100)) {
//       errors.push({ field: key, message: `${label} must be between 0 and 100.` });
//     }
//   });

//   const posFields = [
//     { key: "costSavings",          label: "Cost savings" },
//     { key: "paybackMonths",        label: "Payback period months" },
//     { key: "activeUsers",          label: "Active users" },
//     { key: "revenueImpact",        label: "Revenue impact" },
//     { key: "toolsPlatformCharges", label: "Tools and platform charges" },
//     { key: "licenseCost",          label: "License cost" },
//     { key: "developmentCost",      label: "Development cost" },
//     { key: "supportMaintenanceCost", label: "Support and maintenance" },
//     { key: "recurringCostAvoidance", label: "Recurring cost avoidance" }
//   ];

//   posFields.forEach(({ key, label }) => {
//     const v = Number(record[key]);
//     if (record[key] !== "" && record[key] !== null && v < 0) {
//       errors.push({ field: key, message: `${label} cannot be negative.` });
//     }
//   });

//   return errors;
// }

// function showFieldErrors(errors) {
//   clearAllFieldErrors();

//   errors.forEach(({ field, message }) => {
//     const ctrl = els.caseForm.elements[field];
//     if (ctrl) {
//       ctrl.classList.add("field-error");
//       const errSpan = document.createElement("span");
//       errSpan.className = "field-error-msg";
//       errSpan.textContent = message;
//       ctrl.parentNode.appendChild(errSpan);
//     }

//     if (CONFIG.richTextFields.has(field)) {
//       const editor = document.querySelector(`.rich-editor[data-field="${field}"]`);
//       if (editor) {
//         editor.classList.add("field-error");
//         const wrapper = editor.closest(".rich-editor-wrapper");
//         if (wrapper) {
//           const existing = wrapper.querySelector(".field-error-msg");
//           if (!existing) {
//             const errSpan = document.createElement("span");
//             errSpan.className = "field-error-msg";
//             errSpan.textContent = message;
//             wrapper.appendChild(errSpan);
//           }
//         }
//       }
//     }
//   });
// }

// function clearAllFieldErrors() {
//   els.caseForm?.querySelectorAll(".field-error").forEach(el => el.classList.remove("field-error"));
//   els.caseForm?.querySelectorAll(".field-error-msg").forEach(el => el.remove());
// }

// function showErrorModal(errors) {
//   document.getElementById("errorModal")?.remove();

//   const modal = document.createElement("div");
//   modal.id = "errorModal";
//   modal.className = "error-modal";
//   modal.setAttribute("role", "alertdialog");
//   modal.setAttribute("aria-modal", "true");
//   modal.setAttribute("aria-labelledby", "errorModalTitle");

//   const errorList = errors.map(e =>
//     `<li><span class="err-field">${esc(FIELD_LABELS[e.field] || e.field)}:</span> ${esc(e.message)}</li>`
//   ).join("");

//   modal.innerHTML = `
//     <div class="error-modal-box">
//       <div class="error-modal-header">
//         <span class="error-modal-icon">⚠</span>
//         <h3 id="errorModalTitle">Please fix these errors</h3>
//         <button class="icon-button error-modal-close" type="button" aria-label="Close">
//           <svg><use href="#icon-close"></use></svg>
//         </button>
//       </div>
//       <ul class="error-list">${errorList}</ul>
//       <button class="button primary error-modal-ok" type="button">OK, I'll fix these</button>
//     </div>
//   `;

//   modal.querySelector(".error-modal-close").addEventListener("click", () => modal.remove());
//   modal.querySelector(".error-modal-ok").addEventListener("click", () => {
//     modal.remove();
//     const firstError = els.caseForm.querySelector(".field-error, .rich-editor.field-error");
//     if (firstError) {
//       firstError.scrollIntoView({ behavior: "smooth", block: "center" });
//       firstError.focus?.();
//     }
//   });
//   modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

//   els.drawer.appendChild(modal);
//   setTimeout(() => modal.querySelector(".error-modal-ok")?.focus(), 50);
// }

// // =============================================================================
// // SAVE
// // =============================================================================
// async function saveCurrentCase(e) {
//   e.preventDefault();

//   const fd     = new FormData(els.caseForm);
//   const record = formToRecord(fd);

//   const errors = validateForm(record);
//   if (errors.length) {
//     showFieldErrors(errors);
//     showErrorModal(errors);
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
//     const errMsg = err.message || "";
//     const saveErrors = parseSaveError(errMsg);
//     if (saveErrors.length) {
//       showFieldErrors(saveErrors);
//       showErrorModal(saveErrors);
//     } else {
//       showErrorModal([{ field: "general", message: "Save failed: " + errMsg }]);
//       showToast("⚠ Save failed — see error details.");
//     }
//   } finally {
//     setBusy(false);
//   }
// }

// function parseSaveError(errMsg) {
//   const errors = [];

//   const fieldPatterns = [
//     { pattern: /title/i,              field: "ideaName",      label: "Business Case idea" },
//     { pattern: /field_12|cost.sav/i,  field: "costSavings",   label: "Cost savings" },
//     { pattern: /field_13|effici/i,    field: "efficiencyGain", label: "Efficiency gain %" },
//     { pattern: /field_14|payback/i,   field: "paybackMonths",  label: "Payback period months" },
//     { pattern: /field_16|adoption/i,  field: "adoptionRate",   label: "Adoption rate %" }
//   ];

//   fieldPatterns.forEach(({ pattern, field, label }) => {
//     if (pattern.test(errMsg)) {
//       errors.push({ field, message: `${label}: ${errMsg}` });
//     }
//   });

//   return errors;
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

//     if (CONFIG.numberFields.has(jsKey)) {
//       payload[spField] = Number(s);
//     } else {
//       payload[spField] = s;
//     }
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
//   rec.id                = fd.get("id") || "";
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
//     ...rows.map(r => {
//       return cols.map(([k]) => {
//         const val = CONFIG.richTextFields.has(k) ? stripHtml(r[k]) : r[k];
//         return csvQ(val);
//       }).join(",");
//     })
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
// function stripHtml(html) {
//   if (!html) return "";
//   return html
//     .replace(/<[^>]*>/g, "")
//     .replace(/&amp;/g, "&")
//     .replace(/&lt;/g,  "<")
//     .replace(/&gt;/g,  ">")
//     .replace(/&quot;/g, '"')
//     .replace(/&#39;/g, "'")
//     .trim();
// }

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

// function fmtPlain(v) {
//   const n = Number(v) || 0;
//   if (!n) return "";
//   return new Intl.NumberFormat("en-US", {
//     maximumFractionDigits: n % 1 !== 0 ? 2 : 0
//   }).format(n);
// }

// function fmt$(v) {
//   const n = Number(v) || 0;
//   return new Intl.NumberFormat("en-US", {
//     style:                 "currency",
//     currency:              "USD",
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



const CONFIG = {
  listTitle: "OGC Innovation Business Case",
  sharePointSiteUrl: "https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI",

  listFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/de240397094f4fe39a610c6a0a4d5997/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gJM20WCbDMWgARxFc6pbnqc6oq9cpX5Pw-aLgpp5a-s",

  saveFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/f44390bc94a847d29342ab85b1b8ec2d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SkMtR9vKtj7Mf07QWgksvnK8m1OUKOJR4D7TGiZt9bg",

deleteFlowUrl: "https://defaultbfbb9a2b6d994e78b3c795005d555c.8b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b78b3db90e304888a38d3f594c1932dd/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dl0m779qsg2IlSRUa_-S1paDAbW3uNjL8kKzlo4csZQ",

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

  // Fields the Power Automate flow schema defines as "integer" — must be sent as numbers.
  // Source of truth is the flow's Request Body JSON Schema (not the SP column type).
  numberFields: new Set([
    "costSavings","efficiencyGain","paybackMonths","activeUsers","adoptionRate",
    "revenueImpact","cycleTimeReduction","productivityUplift","scheduleImpact",
    "toolsPlatformCharges","licenseCost","developmentCost","supportMaintenanceCost",
    "recurringCostAvoidance","marginImprovement"
  ]),

  // No text-number fields — the flow schema treats all numeric fields as integer
  textNumberFields: new Set([]),

  richTextFields: new Set([
    "problemStatement","currentWorkarounds","proposedSolution","mvpScope",
    "valueProposition","goToMarketChannels","changeManagement","rolloutPlan","scalabilityNotes"
  ]),

  plainTextFields: new Set([
    "costSavings","revenueImpact","toolsPlatformCharges","licenseCost",
    "developmentCost","supportMaintenanceCost","recurringCostAvoidance",
    "productivityUplift","marginImprovement"
  ]),

  richTextLimits: {
    problemStatement:   255,
    currentWorkarounds: 2000,
    proposedSolution:   3000,
    mvpScope:           2000,
    valueProposition:   3000,
    goToMarketChannels: 2000,
    changeManagement:   2000,
    rolloutPlan:        2000,
    scalabilityNotes:   2000
  },

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
  richTextValues: {},
  searchDebounce: 0
};

const els = {};

// =============================================================================
// BOOT
// =============================================================================
document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  bindEvents();
  buildRichTextEditors();
  await loadFromFlow();
  populateDropdowns();
  buildPeopleSelect();
  render();
}

// =============================================================================
// RICH TEXT EDITOR
// =============================================================================
function buildRichTextEditors() {
  CONFIG.richTextFields.forEach(fieldName => {
    const textarea = els.caseForm?.elements[fieldName];
    if (!textarea) return;

    const limit = CONFIG.richTextLimits[fieldName];

    const wrapper = document.createElement("div");
    wrapper.className = "rich-editor-wrapper";
    wrapper.setAttribute("data-field", fieldName);

    const toolbar = document.createElement("div");
    toolbar.className = "rich-toolbar";
    toolbar.innerHTML = `
      <button type="button" class="rich-btn" data-cmd="bold" title="Bold"><b>B</b></button>
      <button type="button" class="rich-btn" data-cmd="italic" title="Italic"><i>I</i></button>
      <button type="button" class="rich-btn" data-cmd="underline" title="Underline"><u>U</u></button>
      <span class="rich-sep"></span>
      <button type="button" class="rich-btn" data-cmd="insertUnorderedList" title="Bullet list">&#8226; List</button>
      <button type="button" class="rich-btn" data-cmd="insertOrderedList" title="Numbered list">1. List</button>
      <span class="rich-sep"></span>
      <button type="button" class="rich-btn" data-cmd="justifyLeft" title="Align left">Left</button>
      <button type="button" class="rich-btn" data-cmd="justifyCenter" title="Align center">Center</button>
      <button type="button" class="rich-btn" data-cmd="justifyRight" title="Align right">Right</button>
      <button type="button" class="rich-btn" data-cmd="justifyFull" title="Justify">Justify</button>
      <span class="rich-sep"></span>
      <button type="button" class="rich-btn" data-cmd="removeFormat" title="Clear formatting">&#10005; Clear</button>
    `;

    const editor = document.createElement("div");
    editor.className = "rich-editor";
    editor.contentEditable = "true";
    editor.setAttribute("role", "textbox");
    editor.setAttribute("aria-multiline", "true");
    editor.setAttribute("data-field", fieldName);
    editor.setAttribute("data-limit", limit);

    const counter = document.createElement("div");
    counter.className = "rich-counter";
    counter.id = `counter-${fieldName}`;
    counter.textContent = `0 / ${limit}`;

    const limitMsg = document.createElement("div");
    limitMsg.className = "rich-limit-msg";
    limitMsg.id = `limit-${fieldName}`;
    limitMsg.textContent = `Maximum ${limit.toLocaleString()} characters allowed.`;

    wrapper.appendChild(toolbar);
    wrapper.appendChild(editor);
    wrapper.appendChild(counter);
    wrapper.appendChild(limitMsg);

    textarea.parentNode.insertBefore(wrapper, textarea);
    textarea.style.display = "none";

    editor.dataset.lastValidHtml = "";

    toolbar.querySelectorAll(".rich-btn[data-cmd]").forEach(btn => {
      btn.addEventListener("mousedown", e => e.preventDefault());
      btn.addEventListener("click", e => {
        e.preventDefault();
        const cmd = btn.getAttribute("data-cmd");
        runRichCommand(editor, toolbar, cmd);
        updateCounter(editor, counter, limitMsg, limit);
        syncEditorToTextarea(fieldName);
      });
    });

    editor.addEventListener("beforeinput", e => {
      if (e.inputType && e.inputType.startsWith("delete")) return;
      const currentLen = getEditorTextLength(editor);
      const selectedLen = getSelectedTextLength(editor);
      const incomingLen = e.data ? e.data.length : 0;
      if (incomingLen && currentLen - selectedLen + incomingLen > limit) {
        e.preventDefault();
        limitMsg.classList.add("show");
        setTimeout(() => limitMsg.classList.remove("show"), 3000);
      }
    });

    editor.addEventListener("input", () => {
      enforceLimit(editor, counter, limitMsg, limit);
      saveRichSelection(editor);
      syncEditorToTextarea(fieldName);
    });

    editor.addEventListener("paste", e => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text/plain");
      insertPlainTextWithinLimit(editor, text, limit, limitMsg);
      enforceLimit(editor, counter, limitMsg, limit);
      saveRichSelection(editor);
      syncEditorToTextarea(fieldName);
    });

    ["keyup", "mouseup", "focus", "click"].forEach(evt => {
      editor.addEventListener(evt, () => {
        saveRichSelection(editor);
        updateToolbarState(toolbar, editor);
      });
    });
  });
}

function enforceLimit(editor, counter, limitMsg, limit) {
  const len = getEditorTextLength(editor);
  counter.textContent = `${len} / ${limit}`;
  if (len > limit) {
    counter.classList.add("over");
    limitMsg.classList.add("show");
    restoreLastValidEditorState(editor);
    setTimeout(() => limitMsg.classList.remove("show"), 3000);
  } else {
    counter.classList.remove("over");
    limitMsg.classList.remove("show");
    editor.dataset.lastValidHtml = editor.innerHTML;
  }
}

function updateCounter(editor, counter, limitMsg, limit) {
  const len = getEditorTextLength(editor);
  counter.textContent = `${len} / ${limit}`;
  counter.classList.toggle("over", len > limit);
  limitMsg.classList.toggle("show", len > limit);
  if (len <= limit) editor.dataset.lastValidHtml = editor.innerHTML;
}

function getEditorTextLength(editor) {
  return (editor.innerText || "").replace(/\n$/, "").length;
}

function selectionIsInside(editor) {
  const sel = window.getSelection();
  return !!(sel && sel.rangeCount && editor.contains(sel.anchorNode));
}

function saveRichSelection(editor) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return;
  editor._savedRange = sel.getRangeAt(0).cloneRange();
}

function restoreRichSelection(editor) {
  const sel = window.getSelection();
  if (!sel) return;
  editor.focus();
  if (editor._savedRange && editor.contains(editor._savedRange.commonAncestorContainer)) {
    sel.removeAllRanges();
    sel.addRange(editor._savedRange);
    return;
  }
  placeCaretAtEnd(editor);
}

function placeCaretAtEnd(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function getSelectedTextLength(editor) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) return 0;
  return String(sel.toString() || "").length;
}

function insertPlainTextWithinLimit(editor, text, limit, limitMsg) {
  restoreRichSelection(editor);
  const currentLen = getEditorTextLength(editor);
  const selectedLen = getSelectedTextLength(editor);
  const available = Math.max(0, limit - (currentLen - selectedLen));
  const insertText = String(text || "").slice(0, available);
  if (insertText.length < String(text || "").length) {
    limitMsg.classList.add("show");
    setTimeout(() => limitMsg.classList.remove("show"), 3000);
  }
  if (insertText) document.execCommand("insertText", false, insertText);
}

function restoreLastValidEditorState(editor) {
  editor.innerHTML = editor.dataset.lastValidHtml || "";
  placeCaretAtEnd(editor);
}

function runRichCommand(editor, toolbar, cmd) {
  restoreRichSelection(editor);
  document.execCommand("styleWithCSS", false, false);
  document.execCommand(cmd, false, null);
  saveRichSelection(editor);
  updateToolbarState(toolbar, editor);
}

function updateToolbarState(toolbar, editor) {
  if (editor && !selectionIsInside(editor)) return;
  const cmds = ["bold", "italic", "underline", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull"];
  cmds.forEach(cmd => {
    const btn = toolbar.querySelector(`[data-cmd="${cmd}"]`);
    if (btn) btn.classList.toggle("active", document.queryCommandState(cmd));
  });
}

function syncEditorToTextarea(fieldName) {
  const editor = document.querySelector(`.rich-editor[data-field="${fieldName}"]`);
  const textarea = els.caseForm?.elements[fieldName];
  if (editor && textarea) {
    textarea.value = editor.innerHTML;
    state.richTextValues[fieldName] = editor.innerHTML;
  }
}

function setEditorContent(fieldName, htmlContent) {
  const editor = document.querySelector(`.rich-editor[data-field="${fieldName}"]`);
  const counter = document.getElementById(`counter-${fieldName}`);
  const limitMsg = document.getElementById(`limit-${fieldName}`);
  const limit = CONFIG.richTextLimits[fieldName];

  if (editor) {
    editor.innerHTML = htmlContent || "";
    editor.dataset.lastValidHtml = editor.innerHTML;
    if (counter) updateCounter(editor, counter, limitMsg, limit);
  }

  const textarea = els.caseForm?.elements[fieldName];
  if (textarea) textarea.value = htmlContent || "";
}

function clearAllEditors() {
  CONFIG.richTextFields.forEach(fieldName => {
    setEditorContent(fieldName, "");
  });
  state.richTextValues = {};
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

    if (data.choices) {
      state.choices.confidenceLevel =
        Array.isArray(data.choices.confidenceLevel) && data.choices.confidenceLevel.length
          ? data.choices.confidenceLevel
          : [...CONFIG.fallbackChoices.confidenceLevel];

      state.choices.department =
        Array.isArray(data.choices.department) && data.choices.department.length
          ? data.choices.department
          : [...CONFIG.fallbackChoices.department];
    } else {
      const rows = extractRows(data);
      state.choices.department      = uniqueChoices(rows, "field_2")                 || [...CONFIG.fallbackChoices.department];
      state.choices.confidenceLevel = uniqueChoices(rows, "Confidence_x0020_Level") || [...CONFIG.fallbackChoices.confidenceLevel];
    }

    state.allUsers = Array.isArray(data.users)
      ? data.users.filter(u => u.Email)
      : [];

    state.records = extractRows(data).map(mapItem);
    state.mode    = "flow";
  } catch (err) {
    console.error("Flow load failed:", err);
    state.records  = [];
    state.allUsers = [];
    state.choices  = {
      department:      [...CONFIG.fallbackChoices.department],
      confidenceLevel: [...CONFIG.fallbackChoices.confidenceLevel]
    };
    state.mode = "error";
    showToast("⚠ Could not load SharePoint data — " + err.message);
  } finally {
    setBusy(false);
  }
}

// Keep existing records visible while fetching — only swap in new data on success
async function reloadRecords() {
  // Snapshot current records so the table never goes blank mid-fetch
  const snapshot = [...state.records];
  try {
    const res = await fetch(CONFIG.listFlowUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({})
    });
    if (!res.ok) throw new Error(`Flow returned HTTP ${res.status}`);
    const data = await res.json();
    // Only replace records once we have good data
    const fresh = extractRows(data).map(mapItem);
    if (fresh.length > 0 || snapshot.length === 0) {
      state.records = fresh;
    }
    state.mode = "flow";
    render();
  } catch (err) {
    // Restore snapshot so nothing disappears on error
    state.records = snapshot;
    console.error("Reload failed:", err);
    showToast("⚠ Could not refresh data");
    render();
  }
}

// Spin the refresh icon while loading; never hides existing rows
async function handleRefresh() {
  const btn = els.refreshButton;
  btn.disabled = true;
  btn.classList.add("spinning");
  try {
    await reloadRecords();
  } finally {
    btn.disabled = false;
    btn.classList.remove("spinning");
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
// PEOPLE PICKER
// =============================================================================
function buildPeopleSelect() {
  const container = document.getElementById("peoplePicker");
  if (!container) return;
  container.innerHTML = "";

  const filterInput = document.createElement("input");
  filterInput.type         = "text";
  filterInput.id           = "personFilterInput";
  filterInput.placeholder  = "Type name or email…";
  filterInput.autocomplete = "off";
  filterInput.setAttribute("aria-label", "Search for a person");

  const sel = document.createElement("select");
  sel.id   = "personSelect";
  sel.size = 4;
  sel.setAttribute("aria-label", "Select a person");
  sel.style.cssText = "display:none;width:100%;";

  container.appendChild(filterInput);
  container.appendChild(sel);

  filterInput.addEventListener("input", () => {
    const q = filterInput.value.trim().toLowerCase();
    if (q.length < 2) {
      sel.style.display = "none";
      while (sel.firstChild) sel.removeChild(sel.firstChild);
      return;
    }

    const matches = state.allUsers
      .filter(u =>
        (u.Title || "").toLowerCase().includes(q) ||
        (u.Email || "").toLowerCase().includes(q)
      )
      .slice(0, 50);

    while (sel.firstChild) sel.removeChild(sel.firstChild);

    if (!matches.length) {
      const empty = document.createElement("option");
      empty.disabled    = true;
      empty.textContent = "No results found";
      sel.appendChild(empty);
    } else {
      matches.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.LoginName;
        opt.setAttribute("data-name",  u.Title || "");
        opt.setAttribute("data-email", u.Email || "");
        opt.textContent = (u.Title || "") + " — " + (u.Email || "");
        sel.appendChild(opt);
      });

      if (state.selectedPerson?.claims) {
        for (let i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value === state.selectedPerson.claims) {
            sel.options[i].selected = true;
            break;
          }
        }
      }
    }

    sel.style.display = "block";
  });

  sel.addEventListener("change", () => {
    const opt = sel.options[sel.selectedIndex];
    if (!opt || opt.disabled) return;

    const claims      = opt.value;
    const displayName = opt.getAttribute("data-name")  || "";
    const email       = opt.getAttribute("data-email") || "";

    state.selectedPerson = { displayName, email, claims };

    const hiddenField = els.caseForm?.elements.personClaims;
    if (hiddenField) hiddenField.value = claims;

    filterInput.value = displayName || email;
    sel.style.display = "none";
    while (sel.firstChild) sel.removeChild(sel.firstChild);
  });
}

function fillPersonPicker(record) {
  if (!record.personDisplayName && !record.personEmail) return;

  state.selectedPerson = {
    displayName: record.personDisplayName,
    email:       record.personEmail,
    claims:      record.personClaims
  };

  const filterInput = document.getElementById("personFilterInput");
  const sel         = document.getElementById("personSelect");
  if (!filterInput || !sel) return;

  filterInput.value = record.personDisplayName || record.personEmail;
  while (sel.firstChild) sel.removeChild(sel.firstChild);
  sel.style.display = "none";

  const hiddenField = els.caseForm?.elements.personClaims;
  if (hiddenField) hiddenField.value = record.personClaims;
}

function resetPersonPicker() {
  state.selectedPerson = null;

  const filterInput = document.getElementById("personFilterInput");
  const sel         = document.getElementById("personSelect");
  if (filterInput) filterInput.value = "";
  if (sel) {
    while (sel.firstChild) sel.removeChild(sel.firstChild);
    sel.style.display = "none";
  }

  const hiddenField = els.caseForm?.elements.personClaims;
  if (hiddenField) hiddenField.value = "";
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
    const o = document.createElement("option");
    o.value = o.textContent = c;
    deptSel?.appendChild(o);
  });

  (state.choices.confidenceLevel || []).forEach(c => {
    if (!c) return;
    const o = document.createElement("option");
    o.value = o.textContent = c;
    confSel?.appendChild(o);
  });
}

// =============================================================================
// DOM CACHE & EVENTS
// =============================================================================
function cacheElements() {
  [
    "connectionBadge", "refreshButton", "exportButton", "newCaseButton",
    "caseRows", "searchInput",
    "summaryTotal", "summarySavings", "summaryEfficiency", "summaryPayback",
    "drawerBackdrop", "closeDrawerButton", "cancelButton",
    "caseForm", "drawerTitle", "saveButton", "toast"
  ].forEach(id => { els[id] = document.getElementById(id); });
  els.drawer = document.getElementById("caseDrawer");
}

function bindEvents() {
  els.newCaseButton.addEventListener("click",    () => openDrawer());
  els.closeDrawerButton.addEventListener("click", closeDrawer);
  els.cancelButton.addEventListener("click",      closeDrawer);
  els.drawerBackdrop.addEventListener("click",    closeDrawer);
  els.exportButton.addEventListener("click",      exportCsv);
  els.caseForm.addEventListener("submit",         saveCurrentCase);

  // CHANGED: debounced search — waits 200ms before filtering
  els.searchInput.addEventListener("input", e => {
    clearTimeout(state.searchDebounce);
    state.searchDebounce = setTimeout(() => {
      state.search = e.target.value.trim().toLowerCase();
      renderTable();
    }, 200);
  });

  // CHANGED: refresh no longer blocks the whole page with is-busy
  els.refreshButton.addEventListener("click", handleRefresh);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && els.drawer.classList.contains("open")) closeDrawer();
  });

  document.addEventListener("wheel", e => {
    if (document.activeElement.type === "number") e.preventDefault();
  }, { passive: false });
}

// =============================================================================
// DELETE
// =============================================================================
function handleDeleteClick(id) {
  if (!id) return;

  const rec = state.records.find(r => String(r.id) === String(id));
  const name = rec?.ideaName || "this record";

  showConfirmModal(
    "Delete business case",
    `Are you sure you want to delete "<strong>${esc(name)}</strong>"? This action cannot be undone.`,
    "Delete",
    async () => {
      await deleteRecord(id);
    }
  );
}
async function deleteRecord(id) {
  if (!id) return;

  const oldRecords = [...state.records];

  state.records = state.records.filter(r => String(r.id) !== String(id));
  render();

  try {
    const res = await fetch(CONFIG.deleteFlowUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(id) })
    });

    const text = await res.text().catch(() => "");

    if (!res.ok) {
      console.error("Delete flow error:", res.status, text);
      throw new Error(`HTTP ${res.status}: ${text || "Flow returned an error"}`);
    }

    showToast("✓ Record deleted.");

  } catch (err) {
    state.records = oldRecords;
    render();
    console.error("Delete failed:", err);
    showToast("⚠ Delete failed — " + err.message);
  }
}
function showConfirmModal(title, bodyHtml, confirmLabel, onConfirm) {
  document.getElementById("confirmModal")?.remove();

  const modal = document.createElement("div");
  modal.id = "confirmModal";
  modal.setAttribute("role", "alertdialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "confirmModalTitle");

  Object.assign(modal.style, {
    position:       "fixed",
    inset:          "0",
    zIndex:         "9999",
    background:     "rgba(18,26,22,0.5)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    padding:        "20px"
  });

  const name = bodyHtml.replace(/<[^>]*>/g, "").replace(/"/g, "");

  modal.innerHTML = `
    <div style="
      background: var(--panel, #fff);
      border-radius: 12px;
      border: 1px solid var(--danger-line, #fca5a5);
      box-shadow: 0 18px 48px rgba(13,32,66,0.18);
      padding: 24px;
      max-width: 440px;
      width: 100%;
    ">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="
          width:36px;height:36px;border-radius:50%;
          background:var(--danger-soft,#fff1f0);
          display:flex;align-items:center;justify-content:center;flex:0 0 auto;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="var(--danger,#b42318)" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/><path d="M8 6V4h8v2"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </div>
        <h3 id="confirmModalTitle" style="margin:0;flex:1;font-size:17px;font-weight:700;color:var(--ink,#0f1c2e);">
          ${esc(title)}
        </h3>
        <button id="confirmClose" type="button" aria-label="Close" style="
          background:transparent;border:none;cursor:pointer;padding:4px;
          color:var(--muted,#6b7c93);display:flex;align-items:center;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:var(--ink,#0f1c2e);">
        Are you sure you want to delete
      </p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:var(--ink,#0f1c2e);">
        "${esc(name)}"
      </p>
      <p style="margin:0 0 20px;font-size:13px;color:var(--muted,#6b7c93);">
        This action cannot be undone.
      </p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button id="confirmCancel" type="button" style="
          min-height:38px;padding:0 16px;
          border:1px solid var(--line,#d6e0f0);border-radius:8px;
          background:var(--panel,#fff);color:var(--ink,#0f1c2e);
          font:inherit;font-weight:650;cursor:pointer;
        ">Cancel</button>
        <button id="confirmOk" type="button" style="
          min-height:38px;padding:0 16px;
          border:1px solid var(--danger,#b42318);border-radius:8px;
          background:var(--danger,#b42318);color:#fff;
          font:inherit;font-weight:650;cursor:pointer;
          display:inline-flex;align-items:center;gap:8px;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/><path d="M8 6V4h8v2"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
          ${esc(confirmLabel)}
        </button>
      </div>
    </div>
  `;

  const close = () => modal.remove();

  modal.querySelector("#confirmClose").addEventListener("click", close);
  modal.querySelector("#confirmCancel").addEventListener("click", close);
  modal.querySelector("#confirmOk").addEventListener("click", () => {
    close();
    onConfirm();
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) close();
  });

  document.body.appendChild(modal);
  setTimeout(() => modal.querySelector("#confirmOk")?.focus(), 50);
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
  els.summarySavings.textContent    = fmtPlain(sum(f, "costSavings"));
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
      <td class="text-cell">${stripHtml(r.problemStatement)}</td>
      <td class="number-cell">${fmtPlain(r.costSavings)}</td>
      <td class="number-cell">${fmtPct(r.efficiencyGain)}</td>
      <td class="number-cell">${fmtMo(r.paybackMonths)}</td>
      <td class="number-cell">${fmtPct(r.adoptionRate)}</td>
      <td class="number-cell">${fmtPlain(r.revenueImpact)}</td>
      <td class="number-cell">${fmtDate(r.modified || r.created)}</td>
      <td class="action-col">
        <div class="row-actions">
          <button class="icon-button row-action" type="button"
            title="Edit" aria-label="Edit ${escAttr(r.ideaName || "case")}"
            data-edit-id="${escAttr(r.id)}">
            <svg><use href="#icon-edit"></use></svg>
          </button>
          <button class="icon-button row-action row-delete" type="button"
            title="Delete" aria-label="Delete ${escAttr(r.ideaName || "case")}"
            data-delete-id="${escAttr(r.id)}">
            <svg><use href="#icon-trash"></use></svg>
          </button>
        </div>
      </td>
    </tr>`).join("");

  els.caseRows.querySelectorAll("[data-edit-id]").forEach(btn =>
    btn.addEventListener("click", () => {
      const rec = state.records.find(x => String(x.id) === String(btn.dataset.editId));
      if (rec) openDrawer(rec);
    })
  );

  els.caseRows.querySelectorAll("[data-delete-id]").forEach(btn =>
    btn.addEventListener("click", () => {
      handleDeleteClick(btn.dataset.deleteId);
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
// DRAWER
// =============================================================================
function openDrawer(record = null) {
  els.caseForm.reset();
  resetPersonPicker();
  clearAllEditors();
  clearAllFieldErrors();
  els.drawerTitle.textContent = record ? "Edit innovation case" : "New innovation case";

  if (record) {
    for (const key of Object.keys(CONFIG.fieldMap)) {
      const ctrl = els.caseForm.elements[key];
      if (!ctrl) continue;
      const v = record[key];
      if (v == null) continue;

      if (CONFIG.richTextFields.has(key)) {
        setEditorContent(key, v);
      } else {
        ctrl.value = v;
      }
    }
    els.caseForm.elements.id.value = record.id;
    fillPersonPicker(record);
  } else {
    els.caseForm.elements.id.value = "";
    const c = els.caseForm.elements.confidenceLevel;
    if (c) c.value = state.choices.confidenceLevel[0] || "";
  }

  els.drawerBackdrop.hidden = false;
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  setTimeout(() => els.caseForm.elements.ideaName?.focus(), 30);
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  els.drawerBackdrop.hidden = true;
  document.body.classList.remove("drawer-open");
  resetPersonPicker();
  clearAllFieldErrors();
}

// =============================================================================
// VALIDATION & ERROR DISPLAY
// =============================================================================
const FIELD_LABELS = {
  ideaName:               "Business Case idea",
  department:             "Department",
  problemStatement:       "Pain point users face today",
  currentWorkarounds:     "Current workarounds failing",
  proposedSolution:       "Innovation approach",
  mvpScope:               "MVP scope",
  valueProposition:       "Strategic Benefits",
  costSavings:            "Cost savings",
  efficiencyGain:         "Efficiency gain %",
  paybackMonths:          "Payback period months",
  adoptionRate:           "Adoption rate %",
  revenueImpact:          "Revenue impact",
  confidenceLevel:        "Confidence Level"
};

function validateForm(record) {
  const errors = [];

  if (!record.ideaName?.trim()) {
    errors.push({ field: "ideaName", message: "Business Case idea is required." });
  }

  const pctFields = [
    { key: "efficiencyGain",    label: "Efficiency gain %" },
    { key: "adoptionRate",      label: "Adoption rate %" },
    { key: "cycleTimeReduction", label: "Cycle time reduction %" },
    { key: "scheduleImpact",    label: "Schedule impact" },
    { key: "productivityUplift", label: "Productivity uplift %" },
    { key: "marginImprovement", label: "Margin improvement %" }
  ];

  pctFields.forEach(({ key, label }) => {
    const v = Number(record[key]);
    if (record[key] !== "" && record[key] !== null && (v < 0 || v > 100)) {
      errors.push({ field: key, message: `${label} must be between 0 and 100.` });
    }
  });

  const posFields = [
    { key: "costSavings",          label: "Cost savings" },
    { key: "paybackMonths",        label: "Payback period months" },
    { key: "activeUsers",          label: "Active users" },
    { key: "revenueImpact",        label: "Revenue impact" },
    { key: "toolsPlatformCharges", label: "Tools and platform charges" },
    { key: "licenseCost",          label: "License cost" },
    { key: "developmentCost",      label: "Development cost" },
    { key: "supportMaintenanceCost", label: "Support and maintenance" },
    { key: "recurringCostAvoidance", label: "Recurring cost avoidance" }
  ];

  posFields.forEach(({ key, label }) => {
    const v = Number(record[key]);
    if (record[key] !== "" && record[key] !== null && v < 0) {
      errors.push({ field: key, message: `${label} cannot be negative.` });
    }
  });

  return errors;
}

function showFieldErrors(errors) {
  clearAllFieldErrors();

  errors.forEach(({ field, message }) => {
    const ctrl = els.caseForm.elements[field];
    if (ctrl) {
      ctrl.classList.add("field-error");
      const errSpan = document.createElement("span");
      errSpan.className = "field-error-msg";
      errSpan.textContent = message;
      ctrl.parentNode.appendChild(errSpan);
    }

    if (CONFIG.richTextFields.has(field)) {
      const editor = document.querySelector(`.rich-editor[data-field="${field}"]`);
      if (editor) {
        editor.classList.add("field-error");
        const wrapper = editor.closest(".rich-editor-wrapper");
        if (wrapper) {
          const existing = wrapper.querySelector(".field-error-msg");
          if (!existing) {
            const errSpan = document.createElement("span");
            errSpan.className = "field-error-msg";
            errSpan.textContent = message;
            wrapper.appendChild(errSpan);
          }
        }
      }
    }
  });
}

function clearAllFieldErrors() {
  els.caseForm?.querySelectorAll(".field-error").forEach(el => el.classList.remove("field-error"));
  els.caseForm?.querySelectorAll(".field-error-msg").forEach(el => el.remove());
}

function showErrorModal(errors) {
  document.getElementById("errorModal")?.remove();

  const modal = document.createElement("div");
  modal.id = "errorModal";
  modal.className = "error-modal";
  modal.setAttribute("role", "alertdialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "errorModalTitle");

  const errorList = errors.map(e =>
    `<li><span class="err-field">${esc(FIELD_LABELS[e.field] || e.field)}:</span> ${esc(e.message)}</li>`
  ).join("");

  modal.innerHTML = `
    <div class="error-modal-box">
      <div class="error-modal-header">
        <span class="error-modal-icon">⚠</span>
        <h3 id="errorModalTitle">Please fix these errors</h3>
        <button class="icon-button error-modal-close" type="button" aria-label="Close">
          <svg><use href="#icon-close"></use></svg>
        </button>
      </div>
      <ul class="error-list">${errorList}</ul>
      <button class="button primary error-modal-ok" type="button">OK, I'll fix these</button>
    </div>
  `;

  modal.querySelector(".error-modal-close").addEventListener("click", () => modal.remove());
  modal.querySelector(".error-modal-ok").addEventListener("click", () => {
    modal.remove();
    const firstError = els.caseForm.querySelector(".field-error, .rich-editor.field-error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus?.();
    }
  });
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  els.drawer.appendChild(modal);
  setTimeout(() => modal.querySelector(".error-modal-ok")?.focus(), 50);
}

// =============================================================================
// SAVE — optimistic update, no blocking reload
// =============================================================================
async function saveCurrentCase(e) {
  e.preventDefault();

  const fd     = new FormData(els.caseForm);
  const record = formToRecord(fd);

  const errors = validateForm(record);
  if (errors.length) {
    showFieldErrors(errors);
    showErrorModal(errors);
    return;
  }

  // CHANGED: disable save button instead of blocking entire page
  const saveBtn = els.saveButton;
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";

  try {
    const payload = buildSharePointPayload(record);
    console.log("📤 Saving payload:", JSON.stringify(payload, null, 2));

    // CHANGED: fire the save, but don't wait to update the UI
    const isUpdate = !!record.id;
    const now = new Date().toISOString();

    // Optimistically apply the record to state immediately
    const optimisticRecord = {
      ...record,
      modified: now,
      created:  record.created || now,
      personDisplayName: state.selectedPerson?.displayName || record.personDisplayName || "",
      personEmail:       state.selectedPerson?.email       || record.personEmail       || "",
      personClaims:      state.selectedPerson?.claims      || record.personClaims      || "",
      // coerce true Number fields; textNumber fields stay as strings
      ...Object.fromEntries(
        [...CONFIG.numberFields].map(k => [k, numOrZero(record[k])])
      ),
      ...Object.fromEntries(
        [...CONFIG.textNumberFields].map(k => [k, record[k] ?? ""])
      )
    };

    if (isUpdate) {
      const idx = state.records.findIndex(r => String(r.id) === String(record.id));
      if (idx !== -1) state.records[idx] = optimisticRecord;
      else state.records.unshift(optimisticRecord);
    } else {
      // Temp id for optimistic row; will be replaced on background reload
      optimisticRecord.id = `tmp-${Date.now()}`;
      state.records.unshift(optimisticRecord);
    }

    // Close drawer and show the updated table immediately — don't wait for the flow
    closeDrawer();
    render();
    showToast(isUpdate ? "✓ Saved locally — syncing to SharePoint…" : "✓ Created — syncing to SharePoint…");

    // Restore save button right away since drawer is already closed
    saveBtn.disabled = false;
    saveBtn.innerHTML = `<svg><use href="#icon-save"></use></svg> Save case`;

    // Fire-and-forget: never await this — Power Automate 502s won't affect the user
    saveViaFlow(payload)
      .then(result => {
        if (result?.status502 || result?.timedOut) {
          // Flow timed out but SP likely saved — reload will confirm
          showToast("⚠ SharePoint is slow — reloading to confirm…");
        } else {
          showToast(isUpdate ? "✓ Synced to SharePoint." : "✓ Created in SharePoint.");
        }
        // Always reload in background to get real ID and server timestamps
        reloadRecords();
      })
      .catch(err => {
        console.error("Background save failed:", err);
        // Only reload — don't re-open drawer or show error modal for background errors
        // The optimistic record is already shown; reload will either confirm or correct it
        showToast("⚠ Sync issue — refreshing from SharePoint…");
        reloadRecords();
      });

  } catch (err) {
    // This catch only fires for errors BEFORE the flow call (e.g. validation bugs)
    console.error("Save setup failed:", err);
    showToast("⚠ Unexpected error — " + (err.message || "please try again"));
    saveBtn.disabled = false;
    saveBtn.innerHTML = `<svg><use href="#icon-save"></use></svg> Save case`;
  }
}

function parseSaveError(errMsg) {
  const errors = [];

  const fieldPatterns = [
    { pattern: /title/i,              field: "ideaName",      label: "Business Case idea" },
    { pattern: /field_12|cost.sav/i,  field: "costSavings",   label: "Cost savings" },
    { pattern: /field_13|effici/i,    field: "efficiencyGain", label: "Efficiency gain %" },
    { pattern: /field_14|payback/i,   field: "paybackMonths",  label: "Payback period months" },
    { pattern: /field_16|adoption/i,  field: "adoptionRate",   label: "Adoption rate %" }
  ];

  fieldPatterns.forEach(({ pattern, field, label }) => {
    if (pattern.test(errMsg)) {
      errors.push({ field, message: `${label}: ${errMsg}` });
    }
  });

  return errors;
}

async function saveViaFlow(payload) {
  // Power Automate flows can take 30-60s; use a generous timeout.
  // A 502 "NoResponse" usually means SP saved but the flow response timed out —
  // treat it as a warning (sync via reload) rather than a hard error.
  const TIMEOUT_MS = 55000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(CONFIG.saveFlowUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
      signal:  controller.signal
    });
  } catch (fetchErr) {
    clearTimeout(timer);
    if (fetchErr.name === "AbortError") {
      // Timed out — SP may still have saved; reload will confirm
      console.warn("Save flow timed out — reloading to confirm.");
      return { timedOut: true };
    }
    throw fetchErr;
  }
  clearTimeout(timer);

  let text = "";
  try { text = await res.text(); } catch { /* ignore */ }

  // 502 from Power Automate almost always means SP received the write but
  // the flow response didn't make it back in time — not a real save failure.
  if (res.status === 502) {
    console.warn("Save flow returned 502 — treating as probable success, will reload.");
    return { status502: true };
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  try { return text ? JSON.parse(text) : {}; } catch { return {}; }
}

function buildSharePointPayload(record) {
  const payload = {
    operation: record.id && !String(record.id).startsWith("tmp-") ? "update" : "create",
    id:        record.id && !String(record.id).startsWith("tmp-") ? String(record.id) : ""
  };

  for (const [jsKey, spField] of Object.entries(CONFIG.fieldMap)) {
    if (["created", "modified", "id"].includes(jsKey)) continue;

    const val = record[jsKey];
    const s   = (val == null ? "" : String(val)).trim();
    if (s === "") continue;

    if (CONFIG.numberFields.has(jsKey)) {
      // Flow schema expects integer — parse and round
      const n = parseFloat(s);
      payload[spField] = isNaN(n) ? 0 : Math.round(n * 100) / 100; // keep up to 2 decimal places
    } else {
      payload[spField] = s;
    }
  }

  if (record.personClaims) {
    payload.person = record.personClaims;
  }

  return payload;
}

function formToRecord(fd) {
  const rec = {};
  for (const key of Object.keys(CONFIG.fieldMap)) {
    if (["created", "modified"].includes(key)) continue;
    const raw = fd.get(key);
    rec[key]  = raw == null ? "" : String(raw).trim();
  }
  rec.id                = fd.get("id") || "";
  rec.personClaims      = fd.get("personClaims") || "";
  rec.personDisplayName = state.selectedPerson?.displayName || "";
  rec.personEmail       = state.selectedPerson?.email       || "";

  return rec;
}

// =============================================================================
// EXPORT CSV
// =============================================================================
function exportCsv() {
  const cols = [
    ["ideaName",              "Business case idea"],
    ["personDisplayName",     "Person"],
    ["department",            "Department or GP"],
    ["problemStatement",      "Problem statement"],
    ["scaleBusinessImpact",   "Scale and business impact"],
    ["currentWorkarounds",    "Current workarounds failing"],
    ["proposedSolution",      "Innovation approach"],
    ["mvpScope",              "MVP scope"],
    ["enabler",               "Technology or process enabler"],
    ["unfairAdvantage",       "Unfair advantage"],
    ["valueProposition",      "Value proposition"],
    ["costSavings",           "Cost savings"],
    ["efficiencyGain",        "Efficiency gain %"],
    ["paybackMonths",         "Payback period months"],
    ["activeUsers",           "Active users"],
    ["adoptionRate",          "Adoption rate %"],
    ["revenueImpact",         "Revenue impact"],
    ["cycleTimeReduction",    "Cycle time reduction %"],
    ["productivityUplift",    "Productivity uplift %"],
    ["scheduleImpact",        "Schedule impact"],
    ["goToMarketChannels",    "Digital and direct sales channel"],
    ["changeManagement",      "Change management and training"],
    ["rolloutPlan",           "Phased rollout plan"],
    ["toolsPlatformCharges",  "Tools and platform charges"],
    ["licenseCost",           "License cost"],
    ["developmentCost",       "Development cost"],
    ["supportMaintenanceCost","Support and maintenance"],
    ["recurringCostAvoidance","Recurring cost avoidance"],
    ["marginImprovement",     "Margin improvement %"],
    ["scalabilityNotes",      "Scalable to all GPs"],
    ["confidenceLevel",       "Confidence Level"],
    ["modified",              "Updated"]
  ];

  const rows = filtered();
  const csv  = [
    cols.map(([, l]) => csvQ(l)).join(","),
    ...rows.map(r => {
      return cols.map(([k]) => {
        const val = CONFIG.richTextFields.has(k) ? stripHtml(r[k]) : r[k];
        return csvQ(val);
      }).join(",");
    })
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
// UTILITIES
// =============================================================================
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g,  "<")
    .replace(/&gt;/g,  ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
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

function fmtPlain(v) {
  const n = Number(v) || 0;
  if (!n) return "";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: n % 1 !== 0 ? 2 : 0
  }).format(n);
}

function fmt$(v) {
  const n = Number(v) || 0;
  return new Intl.NumberFormat("en-US", {
    style:                 "currency",
    currency:              "USD",
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
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

function escAttr(v) { return esc(v).replace(/`/g, "&#96;"); }

function csvQ(v) {
  const t = v == null ? "" : String(v);
  return `"${t.replace(/"/g, '""')}"`;
}