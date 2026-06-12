# MongoDB Atlas setup helper — run after creating your Atlas cluster in the browser.
# Usage: .\scripts\setup-mongodb.ps1

param(
  [Parameter(Mandatory = $true)]
  [string]$MongoUri
)

$envFile = Join-Path $PSScriptRoot ".." ".env"
$line = "MONGODB_URI=$MongoUri"

if (Test-Path $envFile) {
  $content = Get-Content $envFile | Where-Object { $_ -notmatch '^MONGODB_URI=' }
  Set-Content -Path $envFile -Value ($content + $line)
} else {
  Set-Content -Path $envFile -Value @(
    $line,
    "PORT=5000",
    "NODE_ENV=development"
  )
}

Write-Host "Saved MONGODB_URI to .env"
Write-Host "Seeding database..."
Push-Location (Join-Path $PSScriptRoot "..")
npm run seed
if ($LASTEXITCODE -eq 0) {
  Write-Host "Database seeded successfully."
} else {
  Write-Host "Seed failed — check your connection string and Atlas Network Access (0.0.0.0/0)."
}
Pop-Location
