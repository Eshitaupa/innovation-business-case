# Innovation Business Case Registry

A SharePoint-integrated business case tracker for Burns & McDonnell OGC Innovation.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell — all markup |
| `styles.css`  | All styles |
| `app.js`      | All logic + SharePoint REST integration |
| `embed-snippet.html` | Paste into SharePoint page (see below) |
| `setup-sharepoint-list.ps1` | PowerShell to create the SP list + columns |

---

## Deployment

### Step 1 — Upload files to Site Assets

1. Go to: `https://burnsmcd.sharepoint.com/sites/Location-India/IWC/PNI/SiteAssets/`
2. Create a folder named **`innovation business case`** (with spaces, to match existing URLs)
3. Upload: `index.html`, `styles.css`, `app.js`, `embed-snippet.html`

### Step 2 — Create the SharePoint list (if not already done)

Run `setup-sharepoint-list.ps1` in PowerShell with PnP PowerShell installed:

```powershell
.\setup-sharepoint-list.ps1
```

Or create the list manually with the name **`OGC Innovation Business Case`** and add columns field_1 through field_30 (see the script for types).

### Step 3 — Embed in a SharePoint page

> ⚠️ **Do NOT use a plain `<iframe src="index.html">`** — file-origin iframes cannot obtain a SharePoint request digest and all write operations will fail.

**Classic pages (Script Editor Web Part):**
1. Edit your SharePoint page
2. Insert a Script Editor Web Part
3. Paste the entire contents of `embed-snippet.html`
4. Save

**Modern pages (Embed Web Part):**
1. Edit the page → Add web part → Search "Embed"
2. Click "Enter embed code"
3. Paste the contents of `embed-snippet.html`
4. Save and republish

---

## How the SharePoint connection works

The app tries to connect to SharePoint on load:

1. **SharePoint mode** — REST API calls succeed → green badge "SharePoint connected". All saves go to the list.
2. **Local mode** — REST API fails (network, auth, offline) → orange badge "Local mode". Data is saved to `localStorage`. A warning is shown.

Write operations require a request digest token. The app obtains it by trying:
1. `__REQUESTDIGEST` hidden input on the host page (classic .aspx pages)
2. `__REQUESTDIGEST` in the parent frame (same-origin iframes)
3. `POST /_api/contextinfo` (modern pages)

---

## Field mapping

| App field | SharePoint column |
|-----------|-------------------|
| ideaName | Title |
| owner | field_1 |
| department | field_2 |
| status | field_3 |
| problemStatement | field_4 |
| scaleBusinessImpact | field_5 |
| currentWorkarounds | field_6 |
| proposedSolution | field_7 |
| mvpScope | field_8 |
| enabler | field_9 |
| unfairAdvantage | field_10 |
| valueProposition | field_11 |
| costSavings | field_12 |
| efficiencyGain | field_13 |
| paybackMonths | field_14 |
| activeUsers | field_15 |
| adoptionRate | field_16 |
| revenueImpact | field_17 |
| cycleTimeReduction | field_18 |
| productivityUplift | field_19 |
| scheduleImpact | field_20 |
| goToMarketChannels | field_21 |
| changeManagement | field_22 |
| rolloutPlan | field_23 |
| toolsPlatformCharges | field_24 |
| licenseCost | field_25 |
| developmentCost | field_26 |
| supportMaintenanceCost | field_27 |
| recurringCostAvoidance | field_28 |
| marginImprovement | field_29 |
| scalabilityNotes | field_30 |