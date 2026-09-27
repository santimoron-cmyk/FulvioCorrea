$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$listener = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
if ($listener) { Write-Output 'Ya hay un servidor escuchando en http://127.0.0.1:4173/en/'; exit }
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } else { Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' }
if (-not (Test-Path -LiteralPath $nodePath)) { throw 'Node.js no está disponible. Instálalo o abre el proyecto desde Codex.' }
Start-Process -FilePath $nodePath -ArgumentList 'server.mjs' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $PSScriptRoot 'server-output.log') -RedirectStandardError (Join-Path $PSScriptRoot 'server-error.log')
Write-Output 'Vista previa iniciada: http://127.0.0.1:4173/en/'
