#!/bin/bash

VERSION=$(cat ./manifest.json | jq .version | tr -d '"')

zip -r dnd-beyond-kit-v${VERSION}.zip ./manifest.json ./translations/ ./scripts ./popup ./images ./_locales

# Remember: For sorting and finding duplicates in `./translations/base.json`, we can use the following command:
# jq -r 'unique' < ./translations/base.json > ./translations/base-unique.json && rm -rf ./translations/base.json && mv ./translations/base-unique.json ./translations/base.json
