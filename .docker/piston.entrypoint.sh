#!/bin/bash

# Sometimes Windows line endings can spill in here,
# if this happens, run `sed -i -e 's/\r$//' piston.entrypoint.sh`
# to get rid of them

WHITE='\u001b[37;22m'
LIGHT_CYAN='\u001b[39;22m'
BLUE='\u001b[36;22m'
RESET='\e[0m'

packages=( "python=3.9.4" "java=15.0.2" )

log() {
  date=$(date +"%FT%T.%3NZ")
  echo -e "${WHITE}$date ${BLUE}[ABACUS] ${LIGHT_CYAN}$1${RESET}"
}

install_packages() {
  log "Installing package(s)..."

  IFS='=' # package delimiter used in read -ra command

  for package in "${packages[@]}"; do
    read -ra p <<< "$package"
    language="${p[0]}"
    version="${p[1]}"

    log "Installing ${language}[v${version}]..."

    curl --silent \
      -X POST \
      -H "Content-Type: application/json" \
      -d "{\"language\":\"${language}\", \"version\": \"${version}\"}" \
      localhost:2000/api/v2/packages \
      &> /dev/null

    log "Installed ${language}[v${version}]"
  done
}

main() {
  log "Waiting for API server..."

  # This script starts before the API server starts, so spin until api server has started
  while true ; do
    if lsof -Pi :2000 -sTCP:LISTEN -t > /dev/null; then
      log "API Server is ready!"
      break
    fi
  done

  install_packages

  log "Finished setting up Piston for Abacus"
}

main