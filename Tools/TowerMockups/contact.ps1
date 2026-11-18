# PROTOTYPE - NOT FOR PRODUCTION
# Build review contact sheets from exported PNGs (does not lock the files).
# Usage: powershell -File contact.ps1 <Folder> <outDir>   e.g. contact.ps1 Mortar $env:TEMP
param([string]$Folder, [string]$OutDir = $env:TEMP)
Add-Type -AssemblyName System.Drawing
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$d = Join-Path $here "out\$Folder"
function Load($p) { $b = [IO.File]::ReadAllBytes($p); [Drawing.Image]::FromStream((New-Object IO.MemoryStream(, $b))) }
function Contact($files, $out, [double]$S) {
  $imgs = @($files | ForEach-Object { Load $_.FullName })
  if ($imgs.Count -eq 0) { return }
  $W = [int](($imgs | ForEach-Object { $_.Width } | Measure-Object -Maximum).Maximum * $S)
  $H = [int](($imgs | ForEach-Object { $_.Height } | Measure-Object -Sum).Sum * $S)
  $bmp = New-Object Drawing.Bitmap $W, $H; $g = [Drawing.Graphics]::FromImage($bmp)
  $g.Clear([Drawing.Color]::FromArgb(222, 214, 190)); $g.InterpolationMode = 'HighQualityBicubic'
  $y = 0; foreach ($i in $imgs) { $g.DrawImage($i, 0, $y, [int]($i.Width * $S), [int]($i.Height * $S)); $y += [int]($i.Height * $S); $i.Dispose() }
  $bmp.Save($out); $g.Dispose(); $bmp.Dispose(); Write-Output $out
}
$all = Get-ChildItem $d -Filter *.png | Sort-Object Name
Contact (Get-ChildItem "$d\Preview~" -Filter *.png) (Join-Path $OutDir "$Folder`_preview.png") 2
Contact ($all | Where-Object { $_.Name -match '_idle\.png$' -and $_.Name -match '_base_' }) (Join-Path $OutDir "$Folder`_idle.png") 3
Contact ($all | Where-Object { $_.Name -match '_t0_' }) (Join-Path $OutDir "$Folder`_t0.png") 1.5
Contact ($all | Where-Object { $_.Name -match '_t1_' }) (Join-Path $OutDir "$Folder`_t1.png") 1.5
Contact ($all | Where-Object { $_.Name -match '_t2_' }) (Join-Path $OutDir "$Folder`_t2.png") 1.5
