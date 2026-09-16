$rootFolder = (Get-Location).Path

Get-ChildItem -File | ForEach-Object {

    $file = $_

    # Ignorar scripts PowerShell
    if ($file.Extension -eq ".ps1") {
        return
    }

    if ($file.BaseName -match '\((.+)\)$') {

        $content = $matches[1]

        # Remove o identificador da carta no final
        $expansion = $content -replace '\s+[A-Z]*[A-Z0-9-]+\s*$', ''

        # Casos especiais
        if ($content -match '^Wizards of the Coast Promos') {
            $expansion = "Wizards of the Coast Promos"
        }

        # Remover espaços extra
        $expansion = $expansion.Trim()

        $destinationFolder = Join-Path $rootFolder $expansion

        # Criar pasta caso não exista
        if (!(Test-Path -LiteralPath $destinationFolder)) {
            New-Item -ItemType Directory -Path $destinationFolder | Out-Null
        }

        $destinationFile = Join-Path $destinationFolder $file.Name

        try {
            Move-Item `
                -LiteralPath $file.FullName `
                -Destination $destinationFile `
                -Force

            Write-Host "Movido: $($file.Name) -> $expansion"
        }
        catch {
            Write-Host "ERRO ao mover $($file.Name): $($_.Exception.Message)"
        }
    }
}