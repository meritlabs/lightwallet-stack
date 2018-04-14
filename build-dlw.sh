#!/usr/bin/env bash

set -euo pipefail

cd packages/lightwallet/desktop
npm run build:prod
firebase deploy
