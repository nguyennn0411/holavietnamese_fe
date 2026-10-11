$ErrorActionPreference = 'Stop'
# Render static assets once with the installed vi-VN voice, not a browser-dependent voice.
$data = Get-Content -LiteralPath "$PSScriptRoot/../src/features/alphabet/alphabet.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$outputDirectory = [IO.Path]::GetFullPath("$PSScriptRoot/../public/media/alphabet")
[IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
$voice = New-Object -ComObject SAPI.SpVoice
$token = New-Object -ComObject SAPI.SpObjectToken
$token.SetId('HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech_OneCore\Voices\Tokens\MSTTS_V110_viVN_An')
$voice.Voice = $token
$voice.Rate = -2
$items = @($data.letters) + @($data.consonantGroups) + @($data.tones)
$rendered = @()
try {
    foreach ($item in $items) {
        $stream = New-Object -ComObject SAPI.SpFileStream
        $outputFile = Join-Path $outputDirectory ($item.id + '.wav')
        $tempFile = Join-Path $outputDirectory ($item.id + '.rendering.wav')
        $rendered += @{ Temp = $tempFile; Output = $outputFile }
        try {
            $stream.Open($tempFile, 3, $false)
            $voice.AudioOutputStream = $stream
            [void]$voice.Speak(($item.reading + '.'))
        } finally { $stream.Close() }
        if ((Get-Item -LiteralPath $tempFile).Length -lt 1000) { throw "Empty audio: $tempFile" }
    }
    foreach ($file in $rendered) {
        Move-Item -LiteralPath $file.Temp -Destination $file.Output -Force
    }
} finally {
    foreach ($file in $rendered) {
        if (Test-Path -LiteralPath $file.Temp) { Remove-Item -LiteralPath $file.Temp }
    }
}
Write-Output "Rendered $($items.Count) Vietnamese audio files with $($voice.Voice.GetDescription())."
