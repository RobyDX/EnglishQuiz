[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$scriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$docsPath    = Join-Path $projectRoot 'docs'
$configPath  = Join-Path $scriptDir 'ftp-config.json'
$buildScript = Join-Path $scriptDir 'build-release.bat'

# --- Load config ---
if (-not (Test-Path $configPath)) {
    Write-Host "ERROR: Config file not found: $configPath" -ForegroundColor Red
    Write-Host "       Copy ftp-config.example.json to ftp-config.json and fill in your settings." -ForegroundColor Yellow
    exit 1
}

$config      = Get-Content $configPath -Raw | ConvertFrom-Json
$ftpHost     = 'ftp://' + $config.ftpHost.TrimEnd('/')   # FtpWebRequest requires ftp:// even for FTPS
$ftpUser     = $config.ftpUser
$ftpPassword = $config.ftpPassword
$ftpRemote   = $config.ftpRemotePath.TrimEnd('/')
$passive     = [bool]$config.passiveMode

# Safety: the remote folder is wiped before upload, never allow the FTP root
if ([string]::IsNullOrWhiteSpace($ftpRemote)) {
    Write-Host "ERROR: ftpRemotePath must be a subfolder (e.g. /EnglishQuiz), not the FTP root." -ForegroundColor Red
    exit 1
}

# --- Build ---
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " EnglishQuiz - Build + Deploy" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

& cmd.exe /c $buildScript
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[FAIL] Build failed - deploy aborted." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $docsPath)) {
    Write-Host "ERROR: docs folder not found after build: $docsPath" -ForegroundColor Red
    exit 1
}

# --- FTPS helpers ---
function New-FtpsRequest {
    param([string]$Url, [string]$Method, [System.Net.NetworkCredential]$Credential)
    $req             = [System.Net.FtpWebRequest]::Create($Url)
    $req.Credentials = $Credential
    $req.Method      = $Method
    $req.EnableSsl   = $true
    $req.UsePassive  = $passive
    $req.UseBinary   = $true
    $req.KeepAlive   = $false
    return $req
}

function New-FtpsDirectory {
    param([string]$Url, [System.Net.NetworkCredential]$Credential)
    try {
        $req  = New-FtpsRequest -Url $Url -Method ([System.Net.WebRequestMethods+Ftp]::MakeDirectory) -Credential $Credential
        $resp = $req.GetResponse()
        $resp.Close()
    } catch [System.Net.WebException] {
        $ftpResp = $_.Exception.Response -as [System.Net.FtpWebResponse]
        if ($null -eq $ftpResp -or $ftpResp.StatusCode -ne [System.Net.FtpStatusCode]::ActionNotTakenFileUnavailable) {
            Write-Host "  WARN MakeDirectory ($Url): $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

function Remove-FtpsFile {
    param([string]$Url, [System.Net.NetworkCredential]$Credential)
    try {
        $req  = New-FtpsRequest -Url $Url -Method ([System.Net.WebRequestMethods+Ftp]::DeleteFile) -Credential $Credential
        $resp = $req.GetResponse()
        $resp.Close()
    } catch [System.Net.WebException] {
        Write-Host "  WARN DeleteFile ($Url): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

function Remove-FtpsDirectory {
    param([string]$Url, [System.Net.NetworkCredential]$Credential)
    try {
        $req  = New-FtpsRequest -Url $Url -Method ([System.Net.WebRequestMethods+Ftp]::RemoveDirectory) -Credential $Credential
        $resp = $req.GetResponse()
        $resp.Close()
    } catch [System.Net.WebException] {
        Write-Host "  WARN RemoveDirectory ($Url): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

function Send-FtpsFile {
    param([string]$LocalFile, [string]$Url, [System.Net.NetworkCredential]$Credential)
    $req               = New-FtpsRequest -Url $Url -Method ([System.Net.WebRequestMethods+Ftp]::UploadFile) -Credential $Credential
    $bytes             = [System.IO.File]::ReadAllBytes($LocalFile)
    $req.ContentLength = $bytes.Length
    $stream            = $req.GetRequestStream()
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
    $resp = $req.GetResponse()
    $resp.Close()
}

# Returns objects with Name and IsDir for each entry at the given URL.
# Windows-style FTP listing: "MM-DD-YY  HH:MMAM  <DIR>|size  name"
function Get-FtpsItems {
    param([string]$Url, [System.Net.NetworkCredential]$Credential)
    try {
        $req    = New-FtpsRequest -Url ($Url.TrimEnd('/') + '/') -Method ([System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails) -Credential $Credential
        $resp   = $req.GetResponse()
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
        $raw    = $reader.ReadToEnd()
        $reader.Close()
        $resp.Close()
        $items = @()
        foreach ($line in ($raw -split "`n")) {
            $line  = $line.Trim()
            if (-not $line) { continue }
            $parts = $line -split '\s+', 4
            if ($parts.Count -lt 4) { continue }
            $name  = $parts[3].Trim()
            $isDir = $parts[2].Trim() -eq '<DIR>'
            $items += [pscustomobject]@{ Name = $name; IsDir = $isDir }
        }
        return $items
    } catch {
        Write-Host "  WARN Get-FtpsItems ($Url): $($_.Exception.Message)" -ForegroundColor Yellow
        return @()
    }
}

# Recursively deletes all files then directories under the given remote path.
function Remove-FtpsTree {
    param([string]$RemotePath, [System.Net.NetworkCredential]$Credential)
    $items = Get-FtpsItems -Url "$ftpHost$RemotePath" -Credential $Credential
    foreach ($item in $items) {
        $childPath = "$RemotePath/$($item.Name)"
        if ($item.IsDir) {
            Remove-FtpsTree -RemotePath $childPath -Credential $Credential
            Remove-FtpsDirectory -Url "$ftpHost$childPath" -Credential $Credential
        } else {
            Remove-FtpsFile -Url "$ftpHost$childPath" -Credential $Credential
        }
    }
}

$cred = [System.Net.NetworkCredential]::new($ftpUser, $ftpPassword)

# --- Clean remote folder ---
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Cleaning remote folder" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Deleting contents of $ftpRemote ..."

Remove-FtpsTree -RemotePath $ftpRemote -Credential $cred

Write-Host "  [OK] Remote folder cleaned." -ForegroundColor Green

# --- Collect local files and their ancestor directories ---
$files = Get-ChildItem -Path $docsPath -Recurse -File

$remoteDirs = [System.Collections.Generic.HashSet[string]]::new()
foreach ($file in $files) {
    $rel   = $file.FullName.Substring($docsPath.Length).TrimStart('\', '/') -replace '\\', '/'
    $dir   = ($ftpRemote + '/' + $rel | Split-Path -Parent) -replace '\\', '/'
    $parts = $dir.Split('/', [System.StringSplitOptions]::RemoveEmptyEntries)
    $accumulated = ''
    foreach ($part in $parts) {
        $accumulated += '/' + $part
        $remoteDirs.Add($accumulated) | Out-Null
    }
}

# --- Upload ---
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Uploading via FTPS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Host   : $($config.ftpHost)"
Write-Host "  Remote : $ftpRemote"
Write-Host "  Files  : $($files.Count)"
Write-Host ""

foreach ($dir in ($remoteDirs | Sort-Object)) {
    New-FtpsDirectory -Url ($ftpHost + $dir) -Credential $cred
}

$i = 0
foreach ($file in $files) {
    $i++
    $rel       = $file.FullName.Substring($docsPath.Length).TrimStart('\', '/') -replace '\\', '/'
    $remoteUrl = $ftpHost + $ftpRemote + '/' + $rel
    Write-Host "  [$i/$($files.Count)] $rel"
    Send-FtpsFile -LocalFile $file.FullName -Url $remoteUrl -Credential $cred
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " Deploy complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
