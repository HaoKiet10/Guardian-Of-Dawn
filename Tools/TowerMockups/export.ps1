# PROTOTYPE - NOT FOR PRODUCTION
# Export every sprite sheet of the given towers as PNG into out/<Folder>/.
# Usage:  powershell -File export.ps1 mortar machine_gun ...
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Towers)
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$chrome = @("C:\Program Files\Google\Chrome\Application\chrome.exe", "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $Towers) { $Towers = Get-ChildItem "$here\towers\*.js" | ForEach-Object { $_.BaseName } }
foreach ($t in $Towers) {
  $url = "file:///" + ($here -replace '\\', '/') + "/export.html?t=$t"
  # Chrome logs harmless warnings to stderr; PowerShell 5.1 would turn them into errors.
  $ErrorActionPreference = 'Continue'
  $dom = cmd /c "`"$chrome`" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=20000 --dump-dom `"$url`" 2>nul" | Out-String
  $ErrorActionPreference = 'Stop'
  $m = [regex]::Match($dom, '<pre id="out">(.*?)</pre>', 'Singleline')
  if (-not $m.Success -or $m.Groups[1].Value -match '^ERROR' -or $m.Groups[1].Value.Trim() -eq '') { Write-Warning "$t : nothing exported"; continue }
  $n = 0
  foreach ($line in ($m.Groups[1].Value -split "`n")) {
    $p = $line.Trim() -split '\|', 2; if ($p.Count -lt 2) { continue }
    $path = Join-Path "$here\out" $p[0]
    New-Item -ItemType Directory -Force (Split-Path $path) | Out-Null
    [IO.File]::WriteAllBytes($path, [Convert]::FromBase64String(($p[1] -replace '^data:image/png;base64,', '')))
    $n++
  }
  Write-Output "$t : $n PNG -> out/"
}
