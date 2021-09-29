#!/bin/bash

log() {
  date=`date +"%FT%T.%3NZ"`
  echo "$date [Abacus] $1"
}

log "Waiting for API server..."

# This script starts before the api server starts, so spin until api server has started
while true ; do
  if lsof -Pi :2000 -sTCP:LISTEN -t > /dev/null; then
    log "API Server is ready!"
    break
  fi
done

log "Installing package(s)..."

packages=( "python=3.9.4" "java=15.0.2" )

IFS='=' # package delimiter used in read -ra command

for package in "${packages[@]}"; do
  read -ra a <<< "$package"

  log "Installing ${a[0]}[v${a[1]}]..."

  curl --silent \
    --method POST \
    --header "Content-Type: application/json" \
    --data "{\"language\":\"${a[0]}\", \"version\": \"${a[1]}\"}" \
    localhost:2000/api/v2/packages \
    &> /dev/null

  log "Installed ${a[0]}[v${a[1]}]"
done

log "Finished setting up Piston for Abacus."