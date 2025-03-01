#!/bin/bash

VERSION=$(cat ./manifest.json | jq .version | tr -d '"')

zip -r dnd-beyond-kit-v${VERSION}.zip ./manifest.json ./translations/ ./scripts ./popup ./images ./_locales

# Remember: For sorting and finding duplicates in `./translations/base.json`, we can use the following command:
# jq -r 'unique' < ./translations/base.json > ./translations/base-unique.json && rm -rf ./translations/base.json && mv ./translations/base-unique.json ./translations/base.json

## For sorting other files translations we can use (just change the lang code "pt-br"):
# export LANGUAGE="pt-br" && jq 'to_entries | sort_by(.key) | from_entries' < ./translations/$LANGUAGE.json > ./translations/$LANGUAGE-sorted.json && rm -rf ./translations/$LANGUAGE.json && mv ./translations/$LANGUAGE-sorted.json ./translations/$LANGUAGE.json
