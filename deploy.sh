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
build_file_path="packages/lightwallet"
deploy_file_path="packages/lightwallet/mobile"
target="mobile"
build_tag=""


mobileDesktopPrompt() {
    while true; do
        read -p "Would you like to deploy to Mobile or Desktop? [M/D]: " md
        case $md in
            [Mm]* ) setMobileParams; break;;
            [Dd]* ) setDesktopParams; break;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

setMobileParams() {
    target="mobile"
    firebase_project="staging-mlw"
    build_file_path="packages/lightwallet"
    deploy_file_path="packages/lightwallet/mobile"
}

setDesktopParams() {
    target="desktop"
    firebase_project="merit-wallet-staging"
    build_file_path="packages/lightwallet/desktop"
    deploy_file_path="packages/lightwallet/desktop"
}

productionPrompt() {
    while true; do
        read -p "Would you like to deploy to Merit-$target to production? [Y/N]: " yn
        case $yn in
            [Yy]* ) setRunLevelProduction; break;;
            [Nn]* ) break;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

setRunLevelProduction() {
    environment="production"
    if [ $target == "mobile" ]; then
        firebase_project="merit-mlw-production"
        build_tag=" -- --prod"
    else
        firebase_project="merit-webwallet-production"
        build_tag=":prod"        
    fi
    env_vars=""
}

setRunLevelStaging() {
    environment="staging"
    if [ $target == "mobile" ]; then
        firebase_project="staging-mlw"
    else
        firebase_project="merit-wallet-staging"
    fi
    build_tag="" # This favors debug output over testing AOT compiling.    
    env_vars="LW_STAGING=true"
}

mobileDesktopPrompt;
productionPrompt;

print_in_yellow "Building Mobile LightWallet Now"
pushd $build_file_path

if [ ! -z "env_vars" ]; then 
    print_in_yellow "Running export $env_vars"
    export $env_vars 
fi 
print_in_yellow "npm run build $build_tag"
npm run build $build_tag
popd

pushd $deploy_file_path

print_in_yellow "Using firebase project: $firebase_project"
firebase use $firebase_project

print_in_purple "Deploying to firebase now!"
firebase deploy
