#!/usr/bin/env bash
# exit on error
set -o errexit

pnpm install
pnpm build

# Debugging output to check environment variables
echo "PUPPETEER_CACHE_DIR: ${PUPPETEER_CACHE_DIR}"
echo "XDG_CACHE_HOME: ${XDG_CACHE_HOME}"

# Ensure environment variables are set
: "${PUPPETEER_CACHE_DIR:?PUPPETEER_CACHE_DIR is not set}"
: "${XDG_CACHE_HOME:?XDG_CACHE_HOME is not set}"

# Store/pull Puppeteer cache with build cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then 
  echo "...Copying Puppeteer Cache from Build Cache" 
  cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else 
  echo "...Storing Puppeteer Cache in Build Cache" 
  cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi