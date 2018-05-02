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

environment=""
target=""
lw_env_vars=""
firebase_project=""
build_file_path=""
deploy_file_path=""
build_tag=""
deploy_token=""

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
            [Nn]* ) setRunLevelStaging; break;;
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
    lw_env_vars=""
}

setRunLevelStaging() {
    environment="staging"
    if [ $target == "mobile" ]; then
        firebase_project="staging-mlw"
    else
        firebase_project="merit-wallet-staging"
    fi
    build_tag="" # This favors debug output over testing AOT compiling.
    lw_env_vars="LW_STAGING=true"
}




while getopts ":t:e:k:" opt; do
  case $opt in
    t) target="$OPTARG"
    ;;
    e) environment="$OPTARG"
    ;;
    k) deploy_token="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

if [ "$target" != "mobile" ] && [ "$target" != "desktop" ]; then
    print_in_red "No target passed in with -t.  Prompting for input.\n"
    mobileDesktopPrompt;
else
    if [ "$target" == "mobile" ]; then
        setMobileParams;
    else
        setDesktopParams;
    fi
fi

if [ "$environment" != "staging" ] && [ "$environment" != "production" ]; then
    print_in_red "No environment passed in with -e.  Prompting for input.\n"
    productionPrompt;
else
    if [ "$environment" == "staging" ]; then
        setRunLevelStaging;
    else
        setRunLevelProduction;
    fi
fi



print_in_yellow "Building Merit-$target for $environment-environment now \n"
pushd $build_file_path

if [ ! -z "$lw_env_vars" ]; then
    print_in_yellow "Running export $lw_env_vars \n"
    export ${lw_env_vars}
fi
print_in_yellow "Running npm run build$build_tag \n"
npm run build$build_tag
popd

pushd $deploy_file_path

if [[ $deploy_token = *[!\ ]* ]]; then
    print_in_yellow "Deploying using token firebase auth.\n"
    print_in_yellow "Using firebase project: $firebase_project \n"
    firebase use $firebase_project --token $deploy_token

    print_in_green "Deploying to firebase now! \n"

    firebase deploy --token $deploy_token
else
    print_in_yellow "Deploying using general firebase auth.\n"
    print_in_yellow "Using firebase project: $firebase_project \n"
    firebase use $firebase_project

    print_in_green "Deploying to firebase now! \n"

    firebase deploy
fi
