#!/usr/bin/env bash

set -euo pipefail

cd packages/lightwallet
npm run build -- --prod
cd mobile
firebase deploy
