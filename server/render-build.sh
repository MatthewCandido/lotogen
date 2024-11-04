#!/usr/bin/env bash
set -o errexit  # Exit on error

# Set default values if environment variables are not set
XDG_CACHE_HOME=${XDG_CACHE_HOME:-/root/.cache}
PUPPETEER_CACHE_DIR=${PUPPETEER_CACHE_DIR:-/opt/render/project/puppeteer}

npm install
# npm run build  # Uncomment if you need to build the project

# Ensure the cache directories exist
mkdir -p $XDG_CACHE_HOME/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

# Store/pull Puppeteer cache with build cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then 
  echo "...Copying Puppeteer Cache from Build Cache" 
  cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else 
  echo "...Storing Puppeteer Cache in Build Cache" 
  cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi
