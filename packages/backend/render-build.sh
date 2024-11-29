#!/usr/bin/env bash
# exit on error
set -o errexit

# npm install
# npm run build # uncomment if required

# Store/pull Puppeteer cache with build cache
if [[ ! -d "${PUPPETEER_CACHE_DIR}" ]]; then 
  echo "...Copying Puppeteer Cache from Build Cache" 
  mkdir -p "${PUPPETEER_CACHE_DIR}"
  cp -R "${XDG_CACHE_HOME}/puppeteer/"* "${PUPPETEER_CACHE_DIR}/" || true
else 
  echo "...Storing Puppeteer Cache in Build Cache" 
  mkdir -p "${XDG_CACHE_HOME}/puppeteer"
  cp -R "${PUPPETEER_CACHE_DIR}"/* "${XDG_CACHE_HOME}/puppeteer/" || true
fi