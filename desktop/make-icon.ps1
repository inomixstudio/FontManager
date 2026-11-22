# Membuat desktop\app.ico dari geometri logo Font Manager.
# Dijalankan otomatis oleh build-desktop.bat bila app.ico belum ada.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = Join-Path $scriptDir 'app.ico'

function New-RoundedPath([single]$x, [single]$y, [single]$w, [single]$h, [single]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  if ($r -le 0.01) {
    $path.AddRectangle((New-Object System.Drawing.RectangleF($x, $y, $w, $h)))
    return $path
  }
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-MarkBrush([single]$scale) {
  $rect = New-Object System.Drawing.RectangleF(0, 0, (64 * $scale), (64 * $scale))
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 159, 176, 255),
    [System.Drawing.Color]::FromArgb(255, 247, 124, 196),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
  $blend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
  $blend.Colors = @(
    [System.Drawing.Color]::FromArgb(255, 159, 176, 255),
    [System.Drawing.Color]::FromArgb(255, 189, 140, 255),
    [System.Drawing.Color]::FromArgb(255, 247, 124, 196)
  )
  $blend.Positions = @(0.0, 0.48, 1.0)
  $brush.InterpolationColors = $blend
  return $brush
}

function New-IconBitmap([int]$size) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $scale = $size / 64.0

  $badge = New-RoundedPath (1.2 * $scale) (1.2 * $scale) (61.6 * $scale) (61.6 * $scale) (15.2 * $scale)
  $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 11, 14, 21))
  $graphics.FillPath($bgBrush, $badge)

  $tint = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.RectangleF(0, 0, (64 * $scale), (64 * $scale))),
    [System.Drawing.Color]::FromArgb(23, 159, 176, 255),
    [System.Drawing.Color]::FromArgb(23, 247, 124, 196),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
  $graphics.FillPath($tint, $badge)

  $ringRect = New-Object System.Drawing.RectangleF((1.9 * $scale), (1.9 * $scale), (60.2 * $scale), (60.2 * $scale))
  $ring = New-RoundedPath $ringRect.X $ringRect.Y $ringRect.Width $ringRect.Height (14.6 * $scale)
  $ringBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.RectangleF(0, 0, (64 * $scale), (64 * $scale))),
    [System.Drawing.Color]::FromArgb(150, 182, 194, 255),
    [System.Drawing.Color]::FromArgb(60, 247, 124, 196),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
  $ringPen = New-Object System.Drawing.Pen($ringBrush, [single](1.5 * $scale))
  $graphics.DrawPath($ringPen, $ring)

  $markBrush = New-MarkBrush $scale
  $thickPen = New-Object System.Drawing.Pen($markBrush, [single](8.2 * $scale))
  $thinPen = New-Object System.Drawing.Pen($markBrush, [single](4.6 * $scale))
  $barPen = New-Object System.Drawing.Pen($markBrush, [single](4.2 * $scale))
  foreach ($pen in @($thickPen, $thinPen, $barPen)) {
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  }

  $graphics.DrawLine($thickPen, [single](31.9 * $scale), [single](16.4 * $scale), [single](19.9 * $scale), [single](45.8 * $scale))
  $graphics.DrawLine($thinPen, [single](31.9 * $scale), [single](16.4 * $scale), [single](43.9 * $scale), [single](45.8 * $scale))
  $graphics.DrawLine($barPen, [single](24.2 * $scale), [single](35.6 * $scale), [single](39.4 * $scale), [single](35.6 * $scale))

  $baseBrush = New-MarkBrush $scale
  $primary = New-RoundedPath (19.9 * $scale) (51.4 * $scale) (24.2 * $scale) (2.5 * $scale) (1.25 * $scale)
  $graphics.FillPath($baseBrush, $primary)
  $secondary = New-RoundedPath (19.9 * $scale) (56.3 * $scale) (13.4 * $scale) (2.1 * $scale) (1.05 * $scale)
  $faded = New-MarkBrush $scale
  $graphics.FillPath($faded, $secondary)

  $graphics.Dispose()
  return $bitmap
}

function Get-DibBytes([System.Drawing.Bitmap]$bitmap) {
  $size = $bitmap.Width
  $stream = New-Object System.IO.MemoryStream
  $writer = New-Object System.IO.BinaryWriter($stream)
  $maskStride = [int]([math]::Ceiling($size / 8.0 / 4.0) * 4)

  $writer.Write([int]40)
  $writer.Write([int]$size)
  $writer.Write([int]($size * 2))
  $writer.Write([int16]1)
  $writer.Write([int16]32)
  $writer.Write([int]0)
  $writer.Write([int](($size * $size * 4) + ($maskStride * $size)))
  $writer.Write([int]0)
  $writer.Write([int]0)
  $writer.Write([int]0)
  $writer.Write([int]0)

  for ($y = $size - 1; $y -ge 0; $y--) {
    for ($x = 0; $x -lt $size; $x++) {
      $color = $bitmap.GetPixel($x, $y)
      $writer.Write([byte]$color.B)
      $writer.Write([byte]$color.G)
      $writer.Write([byte]$color.R)
      $writer.Write([byte]$color.A)
    }
  }

  $emptyRow = New-Object 'byte[]' $maskStride
  for ($y = 0; $y -lt $size; $y++) {
    $writer.Write($emptyRow)
  }

  $writer.Flush()
  $bytes = $stream.ToArray()
  $writer.Dispose()
  $stream.Dispose()
  return ,$bytes
}

$sizes = @(16, 20, 24, 32, 40, 48, 64, 128, 256)
$images = @()
foreach ($size in $sizes) {
  $bitmap = New-IconBitmap $size
  $data = [byte[]](Get-DibBytes $bitmap)
  $images += [pscustomobject]@{ Size = $size; Data = $data }
  $bitmap.Dispose()
}

$file = New-Object System.IO.MemoryStream
$writer = New-Object System.IO.BinaryWriter($file)
$writer.Write([int16]0)
$writer.Write([int16]1)
$writer.Write([int16]$images.Count)

$offset = 6 + (16 * $images.Count)
foreach ($image in $images) {
  $dimension = if ($image.Size -ge 256) { 0 } else { $image.Size }
  $writer.Write([byte]$dimension)
  $writer.Write([byte]$dimension)
  $writer.Write([byte]0)
  $writer.Write([byte]0)
  $writer.Write([int16]1)
  $writer.Write([int16]32)
  $writer.Write([int]$image.Data.Length)
  $writer.Write([int]$offset)
  $offset += $image.Data.Length
}

foreach ($image in $images) {
  $writer.Write([byte[]]$image.Data)
}

$writer.Flush()
[System.IO.File]::WriteAllBytes($target, $file.ToArray())
$writer.Dispose()
$file.Dispose()

Write-Host "Ikon aplikasi dibuat: $target"
