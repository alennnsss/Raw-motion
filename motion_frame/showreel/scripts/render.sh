#!/bin/bash
# Полная пересборка шоурила: исходники → музыка → громкость → рендер двух версий → постеры → проверка битов
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=../public/videos/showreel
POSTER_FRAME=44 # кадр, где слоган уже виден целиком: он же постер до старта видео

bash scripts/prepare-assets.sh
node scripts/music.mjs

# Громкость: одно усиление до -14 LUFS плюс лимитер на пики. Динамический loudnorm не используем: он «качает» тихие места
lufs=$(ffmpeg -hide_banner -nostats -i public/music-raw.wav -af ebur128 -f null - 2>&1 | awk '/I:/ {v=$2} END {print v}')
gain=$(awk -v l="$lufs" 'BEGIN {printf "%.2f", -14 - l}')
ffmpeg -v error -y -i public/music-raw.wav -af "volume=${gain}dB,alimiter=limit=0.89:level=disabled" public/music.wav
echo "Музыка: было ${lufs} LUFS, усиление ${gain} dB"

mkdir -p "$OUT" out
for id in desktop mobile; do
  npx remotion render src/index.ts "$id" "$OUT/showreel-$id.mp4" --codec=h264 --crf=26 --audio-bitrate=128k
  npx remotion still src/index.ts "$id" "out/poster-$id.png" --frame=$POSTER_FRAME
done
ffmpeg -v error -y -i out/poster-desktop.png -vf scale=1200:-1 -q:v 4 "$OUT/showreel-desktop.jpg"
ffmpeg -v error -y -i out/poster-mobile.png -q:v 4 "$OUT/showreel-mobile.jpg"

node scripts/check-beats.mjs "$OUT/showreel-desktop.mp4" "$OUT/showreel-mobile.mp4"
ls -la "$OUT"
