$rootFolder = (Get-Location).Path
$duplicatesFolder = Join-Path $rootFolder "duplicados"

Get-ChildItem -Path $rootFolder -Recurse -File | ForEach-Object {

    # Ignorar a pasta dos duplicados
    if ($_.FullName.StartsWith($duplicatesFolder)) {
        return
    }

    # Procurar ficheiros terminados em (1), (2), ...
    if ($_.BaseName -match '^(.*)\((\d+)\)$') {

        $originalBaseName = $matches[1]
        $originalFile = Join-Path $_.DirectoryName ($originalBaseName + $_.Extension)

        if (Test-Path $originalFile) {

            $relativePath = Resolve-Path $_.DirectoryName |
                ForEach-Object { $_.Path.Substring($rootFolder.Length).TrimStart('\') }

            $destinationFolder = Join-Path $duplicatesFolder $relativePath

            if (!(Test-Path $destinationFolder)) {
                New-Item -ItemType Directory -Path $destinationFolder -Force | Out-Null
            }

            $destinationFile = Join-Path $destinationFolder $_.Name

            Write-Host "Mover:" $_.Name

            Move-Item $_.FullName $destinationFile
        }
    }
}