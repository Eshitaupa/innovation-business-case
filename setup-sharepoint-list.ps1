param(
  [string]$ListTitle = "Innovation Business Cases"
)

$existing = Get-PnPList -Identity $ListTitle -ErrorAction SilentlyContinue
if (-not $existing) {
  New-PnPList -Title $ListTitle -Template GenericList -OnQuickLaunch | Out-Null
}

Set-PnPField -List $ListTitle -Identity "Title" -Values @{ Title = "Business case idea"; Required = $true } | Out-Null

function Add-TextField {
  param([string]$Name, [string]$DisplayName, [int]$MaxLength = 255)
  if (-not (Get-PnPField -List $ListTitle -Identity $Name -ErrorAction SilentlyContinue)) {
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $Name -Type Text -AddToDefaultView -ErrorAction Stop | Out-Null
  }
}

function Add-NoteField {
  param([string]$Name, [string]$DisplayName)
  if (-not (Get-PnPField -List $ListTitle -Identity $Name -ErrorAction SilentlyContinue)) {
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $Name -Type Note -AddToDefaultView -ErrorAction Stop | Out-Null
  }
}

function Add-NumberField {
  param([string]$Name, [string]$DisplayName)
  if (-not (Get-PnPField -List $ListTitle -Identity $Name -ErrorAction SilentlyContinue)) {
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $Name -Type Number -AddToDefaultView -ErrorAction Stop | Out-Null
  }
}

function Add-CurrencyField {
  param([string]$Name, [string]$DisplayName)
  if (-not (Get-PnPField -List $ListTitle -Identity $Name -ErrorAction SilentlyContinue)) {
    Add-PnPField -List $ListTitle -DisplayName $DisplayName -InternalName $Name -Type Currency -AddToDefaultView -ErrorAction Stop | Out-Null
  }
}

if (-not (Get-PnPField -List $ListTitle -Identity "CaseStatus" -ErrorAction SilentlyContinue)) {
  Add-PnPFieldFromXml -List $ListTitle -FieldXml '<Field Type="Choice" Name="CaseStatus" StaticName="CaseStatus" DisplayName="Status" Format="Dropdown"><Default>Intake</Default><CHOICES><CHOICE>Intake</CHOICE><CHOICE>Reviewing</CHOICE><CHOICE>MVP</CHOICE><CHOICE>Scaling</CHOICE><CHOICE>On hold</CHOICE></CHOICES></Field>' | Out-Null
}

Add-TextField "CaseOwner" "Owner"
Add-TextField "DepartmentGP" "Department or GP"
Add-NoteField "ProblemStatement" "Pain point users face today"
Add-NoteField "ScaleBusinessImpact" "Scale and business impact"
Add-NoteField "CurrentWorkarounds" "Current workarounds failing"
Add-NoteField "ProposedSolution" "Innovation approach"
Add-NoteField "MvpScope" "MVP scope"
Add-NoteField "TechnologyEnabler" "Technology or process enabler"
Add-NoteField "UnfairAdvantage" "Unfair advantage"
Add-NoteField "ValueProposition" "Value proposition"
Add-CurrencyField "CostSavings" "Cost savings"
Add-NumberField "EfficiencyGain" "Efficiency gain %"
Add-NumberField "PaybackMonths" "Payback period months"
Add-NumberField "ActiveUsers" "Active users"
Add-NumberField "AdoptionRate" "Adoption rate %"
Add-CurrencyField "RevenueImpact" "Revenue impact"
Add-NumberField "CycleTimeReduction" "Cycle time reduction %"
Add-NumberField "ProductivityUplift" "Productivity uplift %"
Add-TextField "ScheduleImpact" "Schedule impact"
Add-NoteField "GTMChannels" "Digital and direct sales channel"
Add-NoteField "ChangeManagement" "Change management and training"
Add-NoteField "RolloutPlan" "Phased rollout plan"
Add-CurrencyField "ToolsPlatformCharges" "Tools and platform charges"
Add-CurrencyField "LicenseCost" "License cost"
Add-CurrencyField "DevelopmentCost" "Development cost"
Add-CurrencyField "SupportMaintenanceCost" "Support and maintenance"
Add-CurrencyField "RecurringCostAvoidance" "Recurring cost avoidance"
Add-NumberField "MarginImprovement" "Margin improvement %"
Add-NoteField "ScalabilityNotes" "Scalable to all GPs"

Write-Host "SharePoint list is ready: $ListTitle"
