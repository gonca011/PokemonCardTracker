$rootFolder = (Get-Location).Path
$duplicatesFolder = Join-Path $rootFolder "duplicados"

Get-ChildItem -Path $rootFolder -File | ForEach-Object {

    $baseName = $_.BaseName

    # Remove (1), (2), etc. apenas para análise
    $analysisName = $baseName -replace '\(\d+\)$', ''

    # Obtém o conteúdo do último parêntese
    if ($analysisName -match '\((.+)\)$') {

        $content = $matches[1]
        $expansion = $content

        $parts = $content -split ' '

        if ($parts.Count -gt 1) {

            $last = $parts[-1]

            # Identificadores comuns das cartas Pokémon
            if (
                $last -match '^\d+$' -or
                $last -match '^\d+[a-z]?-\d+$' -or
                $last -match '^[A-Z]+\d+$' -or
                $last -match '^[A-Z]+\d+-[A-Z]+\d+$' -or
                $last -match '^[A-Z]*\d+[A-Z]*-[A-Z]*\d+[A-Z]*$' -or
                $last -match '^[A-Z]{1,5}\d+[a-z]?$'
            ) {
                $expansion = ($parts[0..($parts.Count - 2)] -join ' ')
            }
        }

        # Correções manuais

        if ($expansion -match '^EX Unseen Forces [A-Z!_]-28$') {
            $expansion = "EX Unseen Forces"
        }

        if ($expansion -match '^Yellow A Alternate ') {
            $expansion = "Yellow A Alternate"
        }

        switch ($expansion) {
            "Mega Evolution Promos No." { $expansion = "Mega Evolution Promos" }
            "Miscellaneous Promos No." { $expansion = "Miscellaneous Promos" }
            "Pikachu World Collection No." { $expansion = "Pikachu World Collection" }
            "Scarlet & Violet Promos No." { $expansion = "Scarlet & Violet Promos" }
            "Tropical Mega Battle No." { $expansion = "Tropical Mega Battle" }
        }

        # Criar pasta da expansão
        $destinationFolder = Join-Path $rootFolder $expansion

        if (!(Test-Path $destinationFolder)) {
            New-Item -ItemType Directory -Path $destinationFolder | Out-Null
        }

        $destinationFile = Join-Path $destinationFolder $_.Name

        # Não mover se já estiver no sítio certo
        if ($_.DirectoryName -eq $destinationFolder) {
            continue
        }

        Move-Item $_.FullName $destinationFile

        Write-Host "Movido: $($_.Name) -> $expansion"
    }
}