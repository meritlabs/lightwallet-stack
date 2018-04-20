#!/usr/bin/env bash

print_in_color() {
    printf "%b" \
        "$(tput setaf "$2" 2> /dev/null)" \
        "$1" \
        "$(tput sgr0 2> /dev/null)"
}

print_in_green() {
    print_in_color "$1" 2
}

print_in_purple() {
    print_in_color "$1" 5
}

print_in_red() {
    print_in_color "$1" 1
}

print_in_yellow() {
    print_in_color "$1" 3
}

print_question() {
    print_in_yellow "   [?] $1"
}

set -euo pipefail

environment="staging"
firebase_project="staging-mlw"
env_vars="LW_STAGING=true"

productionPrompt() {
    while true; do
        read -p "Would you like to deploy to Merit to production? [Y/N]: " yn
        case $yn in
            [Yy]* ) setRunLevelProduction; break;;
            [Nn]* ) break;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

setRunLevelProduction() {
    environment="production"
    firebase_project="merit-mlw-production"
    env_vars=""
}

productionPrompt;

print_in_yellow "Building Mobile LightWallet Now"
pushd packages/lightwallet

if [ $environment == "staging" ]; then
    build_tag=""
else 
    build_tag=" -- --prod"
fi

print_in_yellow "Running $env_vars npm run build $build_tag"
(export $env_vars && npm run build $build_tag)

pushd mobile

print_in_yellow "Using firebase project: $firebase_project"
firebase use $firebase_project

print_in_purple "Deploying to firebase now!"
firebase deploy
