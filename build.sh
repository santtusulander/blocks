#!/usr/bin/env bash

set -e

# Obtaining app version
app_version=$(git describe --always --dirty| tr -d v)

# Building dist
npm run dist

# Replacing version in package.json
search='("version":[[:space:]]*").+(")'
replace="\1${app_version}\2"
sed -i ".tmp" -E "s/${search}/${replace}/g" "package.json"

# Creating tar.gz
tar -zcvf udnportal-$app_version.tar.gz dist
