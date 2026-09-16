$rootFolder = Get-Location

$ignoreFolders = @(
    ".git",
    "duplicados"
)

$sets = Get-ChildItem -Path $rootFolder -Directory |
    Where-Object {
        $ignoreFolders -notcontains $_.Name
    } |
    Select-Object -ExpandProperty Name |
    Sort-Object


$sets | ConvertTo-Json | Out-File "sets.json" -Encoding utf8

Write-Host "sets.json criado com $($sets.Count) expansões."