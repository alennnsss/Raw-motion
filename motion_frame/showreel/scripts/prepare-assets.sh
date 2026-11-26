#!/bin/bash
# Копирует исходники сайта в public/ шоурила (Remotion берёт файлы только из своей public/)
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public
for f in montazh_ad_ru_1080x1920.mp4 findy-job-ad.mp4 brag-v2-vertical.mp4 morent-reel-final.mp4; do
  cp "../public/videos/$f" public/
done
cp ../public/logo/logo-full.png ../public/logo/logo.png public/
