# OGC Innovation Scorecard — Technical Documentation

**Version:** 1.0  
**Author:** Eshita Upadhyaya  
**Hosted at:** https://eshitaupa.github.io/innovation-business-case/  
**SharePoint Site:** https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI

---

## 1. Overview

The OGC Innovation Scorecard is a static web-based registry that allows users to log, view, edit, and track innovation business cases. It connects to a SharePoint list via **Power Automate HTTP flows**, avoiding the need for any server-side backend or authentication layer in the frontend.

The application consists of three files:

| File | Purpose |
|---|---|
| `index.html` | Structure and layout |
| `styles.css` | Visual styling |
| `app.js` | All logic — data loading, rendering, save/edit, export |

---

## 2. Architecture

```
Browser (Static HTML/JS)
        │
        │  POST (JSON)
        ▼
Power Automate Flow (List Flow)
        │
        ├──► SharePoint: Get Items  ──────────────► returns all records
        ├──► SharePoint HTTP: GET field_3 choices ► returns Status choices
        ├──► SharePoint HTTP: GET field_2 choices ► returns Department choices
        │
        └──► Response: { items: [...], choices: { status: [...], department: [...] } }

Browser (Static HTML/JS)
        │
        │  POST (JSON payload)
        ▼
Power Automate Flow (Save Flow)
        │
        └──► SharePoint: Create or Update item
```

There are **two flows**:

- **List Flow** — called on page load and refresh. Returns all records plus live dropdown choices.
- **Save Flow** — called on form submit. Creates a new item or updates an existing one.

---

## 3. SharePoint List Structure

**List name:** `OGC Innovation Business Case`

SharePoint's Power Automate connector uses internal field names (`field_1` through `field_30`) rather than display names. The mapping is defined in `app.js` under `CONFIG.fieldMap`.

| JS Key | SharePoint Field | Display Name |
|---|---|---|
| ideaName | Title | Business Case Idea |
| owner | field_1 | Owner |
| department | field_2 | Department or GP |
| status | field_3 | Status |
| problemStatement | field_4 | Pain point users face today |
| scaleBusinessImpact | field_5 | Scale and business impact |
| currentWorkarounds | field_6 | Current workarounds failing |
| proposedSolution | field_7 | Innovation approach |
| mvpScope | field_8 | MVP scope |
| enabler | field_9 | Technology or process enabler |
| unfairAdvantage | field_10 | Unfair advantage |
| valueProposition | field_11 | Value proposition |
| costSavings | field_12 | Cost savings |
| efficiencyGain | field_13 | Efficiency gain % |
| paybackMonths | field_14 | Payback period months |
| activeUsers | field_15 | Active users |
| adoptionRate | field_16 | Adoption rate % |
| revenueImpact | field_17 | Revenue impact |
| cycleTimeReduction | field_18 | Cycle time reduction % |
| productivityUplift | field_19 | Productivity uplift % |
| scheduleImpact | field_20 | Schedule impact |
| goToMarketChannels | field_21 | Digital and direct sales channel |
| changeManagement | field_22 | Change management and training |
| rolloutPlan | field_23 | Phased rollout plan |
| toolsPlatformCharges | field_24 | Tools and platform charges |
| licenseCost | field_25 | License cost |
| developmentCost | field_26 | Development cost |
| supportMaintenanceCost | field_27 | Support and maintenance |
| recurringCostAvoidance | field_28 | Recurring cost avoidance |
| marginImprovement | field_29 | Margin improvement % |
| scalabilityNotes | field_30 | Scalable to all GPs |

`field_2` (Department) and `field_3` (Status) are **Choice columns** in SharePoint. Their values are returned as objects:

```json
"field_3": {
  "@odata.type": "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
  "Id": 1,
  "Value": "Reviewing"
}
```

The `choiceText()` helper in `app.js` extracts the `.Value` string from this object.

---

## 4. Power Automate — List Flow

**Trigger:** HTTP POST (manual, no body required)

**Steps:**

1. **Get items** — fetches all records from the SharePoint list.  
   ⚠️ Enable **Pagination** under Settings and set threshold to `5000` to avoid missing records.

2. **Send an HTTP request to SharePoint** — fetches Status column choices.  
   Method: `GET`  
   URI: `/_api/web/lists/getbytitle('OGC Innovation Business Case')/fields/getbyinternalnameortitle('field_3')`

3. **Send an HTTP request to SharePoint 1** — fetches Department column choices.  
   Method: `GET`  
   URI: `/_api/web/lists/getbytitle('OGC Innovation Business Case')/fields/getbyinternalnameortitle('field_2')`

4. **Response** — returns combined JSON.

**Response body:**

```json
{
  "items": @{outputs('Get_items')?['body/value']},
  "choices": {
    "status": @{body('Send_an_HTTP_request_to_SharePoint')?['d']?['Choices']?['results']},
    "department": @{body('Send_an_HTTP_request_to_SharePoint_1')?['d']?['Choices']?['results']}
  }
}
```

**Why `?['d']?['Choices']?['results']`:**  
The SharePoint REST API (OData verbose format) wraps all field metadata in a `d` object. Choice values are nested under `d.Choices.results` as a plain string array.

---

## 5. Power Automate — Save Flow

**Trigger:** HTTP POST with JSON body

**Payload sent by app.js:**

```json
{
  "operation": "create",   // or "update"
  "id": "",                // SharePoint item ID (for updates only)
  "Title": "Business case name",
  "field_1": "Owner name",
  "field_3": "Intake",
  "field_12": 5000,
  ...
}
```

The flow checks `operation`:
- `"create"` → SharePoint **Create item** action
- `"update"` → SharePoint **Update item** action using `id`

Number fields are sent as numbers, text fields as strings. Empty or null values are omitted from the payload.

---

## 6. Dynamic Dropdowns — How It Works

A key feature is that Status and Department dropdowns in both the form and the filter bar **auto-populate from SharePoint column settings**, so any new option added in SharePoint List Settings is automatically reflected in the UI without any code change.

**Flow:**

1. On page load, `loadFromFlow()` calls the List Flow.
2. The response includes `choices.status` and `choices.department` as string arrays.
3. `populateDropdowns()` dynamically builds `<option>` elements for:
   - `select[name="status"]` (form)
   - `select[name="department"]` (form)
   - `#statusFilter` (table filter bar)

**Fallback chain (if flow choices are missing):**

```
Flow returns choices array  →  use it directly
Flow returns null/empty     →  derive unique values from existing records
Both fail                   →  use hardcoded fallback in CONFIG.fallbackChoices
```

---

## 7. app.js — Key Functions

| Function | What it does |
|---|---|
| `init()` | Entry point. Caches DOM elements, binds events, loads data, renders UI. |
| `loadFromFlow()` | POSTs to List Flow, extracts choices and records, sets `state.mode`. |
| `reloadRecords()` | Re-fetches records only (after save), preserves existing choices. |
| `populateDropdowns()` | Builds `<option>` elements from `state.choices` for form and filter. |
| `render()` | Calls `renderBadge()`, `renderSummaries()`, `renderTable()`. |
| `renderTable()` | Applies search + status filter, sorts by modified date, builds table rows. |
| `filtered()` | Returns filtered and sorted subset of `state.records`. |
| `openDrawer(record)` | Opens the side drawer. If `record` passed, pre-fills form for editing. |
| `saveCurrentCase(e)` | Handles form submit. Calls `saveViaFlow()` then reloads records. |
| `saveViaFlow(record)` | Builds payload and POSTs to Save Flow. |
| `buildSharePointPayload(record)` | Maps JS record keys to SharePoint field names using `CONFIG.fieldMap`. |
| `formToRecord(fd)` | Converts `FormData` to a JS record object with correct types. |
| `mapItem(item)` | Maps a raw SharePoint item to a clean JS record. Handles choice objects via `choiceText()`. |
| `exportCsv()` | Exports current filtered view as a CSV download. |
| `choiceText(v)` | Extracts `.Value` string from a SharePoint choice object, or returns string as-is. |

---

## 8. State Object

All application state lives in a single `state` object:

```javascript
const state = {
  records: [],          // All loaded records (mapped JS objects)
  choices: {
    department: [],     // Dynamic from SharePoint
    status: []          // Dynamic from SharePoint
  },
  mode: "connecting",   // "connecting" | "flow" | "error"
  search: "",           // Current search string
  statusFilter: "All",  // Current status filter value
  busy: false,          // True during async operations
  toastTimer: 0         // Timeout ID for toast dismissal
};
```

---

## 9. Adding a New Field

To add a new field end-to-end:

1. **SharePoint** — Add a new column to the list (e.g. `field_31`).
2. **app.js `CONFIG.fieldMap`** — Add: `newField: "field_31"`
3. **app.js `CONFIG.numberFields`** — Add `"newField"` if it is numeric.
4. **app.js `mapItem()`** — Add: `newField: item.field_31 || ""`
5. **index.html form** — Add a `<label>` + `<input name="newField">` in the appropriate section.
6. **index.html table** — Add a `<th>` header and a `<td>` cell in `renderTable()` if it should appear in the table.

No changes to the Power Automate flows are needed — the Save Flow payload is built dynamically from `CONFIG.fieldMap`.

---

## 10. Deployment

The app is hosted on **GitHub Pages** as a static site. There is no build step.

To deploy updates:
1. Edit `index.html`, `styles.css`, or `app.js` in the repository.
2. Push to the `main` branch.
3. GitHub Pages serves the updated files automatically within ~1 minute.

The flow URLs in `CONFIG` contain embedded SAS signatures and do not require any authentication from the browser side. If flows are re-created, update `CONFIG.listFlowUrl` and `CONFIG.saveFlowUrl` in `app.js`.

---

## 11. Known Considerations

| Item | Detail |
|---|---|
| Pagination | `Get items` in the List Flow must have Pagination enabled (threshold 5000) or records beyond the default page size will be missing. |
| Flow cold start | First load may be slow (~2–3s) if the flow hasn't been triggered recently. |
| Choice column format | SharePoint returns choice values as objects `{ Id, Value }` via the connector. Always use `choiceText()` to extract the string. |
| Fill-in choice | Both `field_2` and `field_3` have `FillInChoice=TRUE` in SharePoint, meaning users can type a custom value. The UI only shows predefined choices; custom typed values in SharePoint will appear in records but not in the dropdown. |
| CORS | The Power Automate flow URLs include CORS headers. No proxy is needed. |