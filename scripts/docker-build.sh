#!/bin/sh
# Baut das Website-Image mit Zugriff auf das laufende CMS, damit statisch
# vorgerenderte Seiten echte CMS-Daten (Blog-Schalter, Firmendaten) enthalten.
# Danach: cd /opt/deploy/11-interlexico-com && docker compose up -d --force-recreate
set -e
cd "$(dirname "$0")/.."
CMS_IP=$(docker inspect ix_cms_app --format '{{(index .NetworkSettings.Networks "ix-public").IPAddress}}' 2>/dev/null || true)
if [ -n "$CMS_IP" ]; then
  docker build --network host --build-arg CMS_URL="http://$CMS_IP:3000" -t interlexico-com:latest .
else
  echo "ix_cms_app nicht gefunden – Build mit Fallback-Werten" >&2
  docker build -t interlexico-com:latest .
fi
